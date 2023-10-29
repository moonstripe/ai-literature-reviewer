import { Handlers } from "$fresh/server.ts";
import pdf from 'npm:pdf-parse/lib/pdf-parse.js'
import { RelevantSource, RelevantSourcesWithText } from "../../types.ts";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_KEY"),
});

function getLast1000Words(inputString: string): string {
  // Tokenize the string into words using space as a delimiter.
  const words = inputString.split(' ');

  // Calculate the starting index for the last 1,000 words.
  const startIndex = Math.max(words.length - 1000, 0);

  // Extract the substring containing the last 1,500 words.
  const last1000words = words.slice(startIndex).join(' ');

  return last1000words;
}

export const handler: Handlers = {
  async POST(req, _ctx) {

    const { sources, angle } = await req.json()

    const relevantSourcesWithText: RelevantSourcesWithText[] = []

    const pdfRequests = sources.map(async (source: RelevantSource) => {
        const response = await fetch(source.sourceLink);

        const text = await pdf(await response.arrayBuffer())

        relevantSourcesWithText.push({
          ...source,
          sourceText: text.text
        })

    })

    await Promise.all(pdfRequests)

    relevantSourcesWithText.map((source) => source.sourceText = getLast1000Words(source.sourceText))

    const initialMessage: OpenAI.Chat.ChatCompletionMessageParam = {
      role: 'system',
      content: `
        Your goal is to write a literature review, using the following source. 
        Your literature review should consider the following source's relevance to the paper's stated angle: ${angle}
        `
    }
    const finalPrompt: OpenAI.Chat.ChatCompletionMessageParam = {
      role: "user",
      content: "Write a section in the literature review about this source's relevant to the stated angle. Respond in prose."
    }

    const litReviewRequests = relevantSourcesWithText.map(async (source) => {


      return await openai.chat.completions.create({
        messages: [
          initialMessage,
          {
            role: "system",
            content: `
              Source Title: ${source.sourceTitle}
              Source Authors: ${source.sourceAuthors}
              Source Date: ${source.sourcePublishDate}
              Source Text: ${source.sourceText}
            `
          },
          finalPrompt
        ],
        model: "gpt-3.5-turbo"
      }
      )
    })

    const openAIResponses = await Promise.all(litReviewRequests)

    
    return new Response(JSON.stringify({
      data: openAIResponses.map(response => response.choices[0].message.content)
    }))
  },
};
