import { useState } from "preact/hooks";
import { TopicInputProps, RelevantSource } from "../types.ts";

export default function TopicInput({ relevantSources, angle }: TopicInputProps) {
  const [topic, setTopic] = useState<string>("");
  const [maxResults, setMaxResults] = useState<number>(5);
  const [isLoadingResponse, setIsLoadingResponse] = useState<boolean>(false);

  const handleTopicChange = (e: Event) => {
    const currentTarget = e.currentTarget as HTMLInputElement;

    setTopic(currentTarget.value);
  };

  const handleAngleChange = (e: Event) => {
    const currentTarget = e.currentTarget as HTMLInputElement;

    angle.value = currentTarget.value;
  };

  const handleMaxResultChange = (e: Event) => {
    const currentTarget = e.currentTarget as HTMLInputElement;

    setMaxResults(parseInt(currentTarget.value));
  };

  const handleSearch = async () => {
    if (topic.length > 0 && angle.value.length > 0) {
      setIsLoadingResponse(true)

      // send inputted topic to openai interface
      try {
        const response = await fetch("/api/pull-source-relevance", {
          method: "POST",
          body: JSON.stringify({
            topic,
            angle,
            maxResults,
          }),
        });

        const json = await response.json();

        relevantSources.value = json.data
      } catch (error) {
        console.error(error)
      }

      setIsLoadingResponse(false)
    }
  };

  return relevantSources.value.length === 0 ? (
    <div class="flex flex-col w-full mt-8">
      <div class="flex w-full">
        <input
          class="rounded-lg border-1 px-4 py-2 w-full ml-0 mr-2 grow"
          placeholder="Input your research topic here."
          value={topic}
          onInput={handleTopicChange}
        />
        <input
          class="rounded-lg border-1 px-4 py-2 ml-2 mr-0 w-24"
          type="number"
          value={maxResults}
          onInput={handleMaxResultChange}
        />
      </div>
      <textarea value={angle} onInput={handleAngleChange} class="my-2 rounded-lg border-1 px-4 py-2" placeholder="How are you approaching the topic?"/>
      <button
        class={`px-4 py-2 focus:outline-none rounded-lg mx-0 ${isLoadingResponse ? `pointer-events-none	bg-gray-600 text-white` : `bg-black text-white`}`}
        disabled={isLoadingResponse}
        onClick={handleSearch}
      >
        {!isLoadingResponse ? "Search" : <img class="animate-spin text-white m-auto" src="/spinner.svg"></img>}
      </button>
    </div>
  ) : null;
}
