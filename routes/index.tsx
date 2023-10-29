import { useSignal } from "@preact/signals";
import TopicInput from "../islands/TopicInput.tsx";
import SetAPIKey from "../islands/SetAPIKey.tsx";
import SourceTable from "../islands/SourceTable.tsx";
import LiteratureReview from "../islands/LiteratureReview.tsx";
import { RelevantSource } from "../types.ts";

export default function Home() {
  const relevantSources = useSignal<RelevantSource[]>([])
  const angle = useSignal<string>("")
  const literatureReviewResults = useSignal<string[]>([])

  return (
    <main class="bg-white flex py-8">
      <div class="w-3/4 mx-auto">
        <h1 class="text-2xl">Literature Reviewer</h1>
        <p class="text-gray-400">
          by&nbsp;
          <a
            href="https://github.com/moonstripe"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-400"
          >
            Kojin Glick
          </a>
        </p>

        <SetAPIKey />

        <TopicInput relevantSources={relevantSources} angle={angle}/>
        
        <SourceTable relevantSources={relevantSources} angle={angle} literatureReviewResults={literatureReviewResults}/>

        <LiteratureReview literatureReviewResults={literatureReviewResults}/>      
      </div>
    </main>
  );
}
