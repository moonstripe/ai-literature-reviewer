import { useState } from "preact/hooks";
import { SourceTableProps } from "../types.ts";

export default function SourceTable(
  { relevantSources, angle, literatureReviewResults }: SourceTableProps,
) {
  const [selectedSources, setSelectedSources] = useState<number[]>([]);
  const [isLoadingResponse, setIsLoadingResponse] = useState<boolean>(false);

  const handleSelectedSource = (index: number) => {
    if (selectedSources.includes(index)) {
      const newSelectedSources = selectedSources.filter((sourceIndex) =>
        sourceIndex !== index
      );

      setSelectedSources(newSelectedSources);
    } else {
      const newSelectedSources = [...selectedSources, index];

      setSelectedSources(newSelectedSources);
    }
  };

  const handleSelectAll = () => {
    setSelectedSources(relevantSources.value.map((_, i) => i));
  };

  const handleSubmitSourcePDFLinks = async () => {
    setIsLoadingResponse(true);

    try {
        const response = await fetch("/api/make-lit-review", {
          method: "POST",
          body: JSON.stringify({
            sources: selectedSources.map((index) => relevantSources.value[index]),
            angle: angle.value,
          }),
          headers: {
            "x-deno-timeout-ms": "600000",
          },
        });

        const json = await response.json();

        literatureReviewResults.value = json.data
    } catch (error) {
        console.error(error)
    }


    setIsLoadingResponse(false)
  };

  return relevantSources.value.length > 0 &&
      literatureReviewResults.value.length === 0
    ? (
      <div class="flex flex-col w-full mt-8">
        <div class="flex mb-2">
          <button
            onClick={handleSelectAll}
            class={`px-4 py-2 focus:outline-none rounded-lg ml-auto mr-2 ${
              isLoadingResponse
                ? `pointer-events-none	bg-gray-600 text-white`
                : `bg-black text-white`
            }`}
          >
            {!isLoadingResponse
              ? "Select All"
              : (
                <img class="animate-spin text-white m-auto" src="/spinner.svg">
                </img>
              )}
          </button>
          <button
            onClick={handleSubmitSourcePDFLinks}
            class={`px-4 py-2 focus:outline-none rounded-lg ml-2 mr-0 ${
              isLoadingResponse
                ? `pointer-events-none	bg-gray-600 text-white`
                : `bg-black text-white`
            }`}
          >
            {!isLoadingResponse
              ? "Submit"
              : (
                <img class="animate-spin text-white m-auto" src="/spinner.svg">
                </img>
              )}
          </button>
        </div>
        <table class="table-auto">
          <tr class="rounded-lg bg-black text-white p-2">
            <th>
              <p class="p-2">Select</p>
            </th>
            <th>
              <p class="p-2">Title</p>
            </th>
            <th>
              <p class="p-2">Author(s)</p>
            </th>
            <th>
              <p class="p-2">Summary</p>
            </th>
            <th>
              <p class="p-2">Link</p>
            </th>
            <th>
              <p class="p-2">Relevance</p>
            </th>
          </tr>
          {relevantSources.value.map((source, i) => (
            <tr class="my-2">
              <td>
                <input
                  type="checkbox"
                  onClick={() => handleSelectedSource(i)}
                  checked={selectedSources.includes(i)}
                >
                </input>
              </td>
              <td>
                <p class="p-2">{source.sourceTitle}</p>
              </td>
              <td>
                <p class="p-2">{source.sourceAuthors}</p>
              </td>
              <td>
                <p class="p-2">{source.sourceSummary}</p>
              </td>
              <td>
                <a
                  href={source.sourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-2 text-blue-400"
                >
                  PDF
                </a>
              </td>
              <td>
                <p class="p-2">{source.relevance}</p>
              </td>
            </tr>
          ))}
        </table>
      </div>
    )
    : null;
}
