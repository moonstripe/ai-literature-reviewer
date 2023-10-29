import { Handlers } from "$fresh/server.ts";
import { parse } from "xml";
import {
  ArcXivResultEntry,
  ArcXivResultFeed,
  ArcXivResultXML,
  RelevantSource
} from "../../types.ts";

function removeSpecialCharactersAndPunctuation(inputString: string) {
  // Use a regular expression to match all non-alphanumeric characters and replace them with an empty string
  return inputString.replace(/[^a-zA-Z0-9\s]/g, '');
}

async function openAIResponseFromEntry(entry: ArcXivResultEntry, initialMessage: OpenAI.Chat.ChatCompletionMessageParam, finalPrompt: OpenAI.Chat.ChatCompletionMessageParam) {

  const cleanedSummary = removeSpecialCharactersAndPunctuation(entry.summary)

  return await openai.chat.completions.create({
    messages: [
      initialMessage,
      {
        role: "system",
        content: `
        Date Published: ${entry.published}
        Text Authors: ${Array.isArray(entry.author) ? entry.author.map(author => author.name).join(", ") : entry.author.name}
        Text Summary: ${cleanedSummary}
        Text Link: ${Array.isArray(entry.link) ? entry.link.filter(link => link["@title"] === "pdf")[0]["@href"] : entry.link["@href"]}
        `
      },
      finalPrompt
    ],
    model: "gpt-3.5-turbo"
  }
  )
}

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_KEY"),
});

export const handler: Handlers = {
  async POST(req, _ctx) {
    // pull topic from response body
    const { topic, angle, maxResults } = await req.json();

    // pull results from arcXiv
    const arcXivResponse = await fetch(
      `https://export.arxiv.org/api/query?search_query=all:${[topic, angle].join(", ")}&max_results=${maxResults}`,
    );

    const arXivText = await arcXivResponse.text();

    const results = parse(arXivText) as unknown as ArcXivResultXML;

    if (!results.feed) {
      return new Response("No feed returned from ArcXiv", { status: 404 });
    }

    const feed = results.feed as ArcXivResultFeed;

    if (!feed.entry) {
      return new Response("No entry returned from ArcXiv", { status: 404 });
    }

    const entries = feed.entry as ArcXivResultEntry[];

    const initialMessage: OpenAI.Chat.ChatCompletionMessageParam = {
      role: 'system',
      content: `You're a high-level researcher studying ${topic} from the angle of ${angle}. A search of existing literature returned the following source:`
    }
    const finalPrompt: OpenAI.Chat.ChatCompletionMessageParam = {
      role: "user",
      content: "Evaluate the relevance of the aforementioned resource in a JSON response, using the structure { sourceTitle: string, sourceAuthors: string, sourceLink: string, sourceSummary: string, sourcePublishDate: string; relevance: number} as your response. Only respond with properly escaped and formatted JSON."
    }

    const acculumatedResponses = await Promise.all(
      Array.isArray(entries) ? entries.map(entry => openAIResponseFromEntry(entry, initialMessage, finalPrompt)) : [openAIResponseFromEntry(entries, initialMessage, finalPrompt)]
    )

    const returnResponses: RelevantSource[] = []

    acculumatedResponses.map(response => {
      returnResponses.push(JSON.parse(response.choices[0].message.content!))
    })

    return new Response(JSON.stringify({data: returnResponses.sort((a: RelevantSource, b: RelevantSource) => (a.relevance < b.relevance) ? 1 : ((b.relevance < a.relevance) ? -1 : 0))}))
  }
}
