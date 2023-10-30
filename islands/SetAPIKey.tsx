import { useState } from "preact/hooks";

export default function SetAPIKey() {
  const [apiKey, setAPIKey] = useState<string>("");
  const [isLoadingResponse, setIsLoadingResponse] = useState<boolean>(false);
  const [isModal, setIsModal] = useState<boolean>(true);

  const handleChangeAPIKey = (e: Event) => {
    const currentTarget = e.currentTarget as HTMLInputElement;


    console.log(apiKey)

    setAPIKey(currentTarget.value);
  };

  const handleSendAPIKey = async () => {
    setIsLoadingResponse(true);
    const response = await fetch("/api/set-api-key", {
      method: "POST",
      body: JSON.stringify({
        apiKey,
      }),
    });

    const json = await response.json();

    if (json.status > 200) {
        setAPIKey("")
    } else {
        setIsModal(false)
    }

    setIsLoadingResponse(false);
  };

  return isModal
    ? (
      <div class="flex w-full">
        <div class={`absolute top-0 left-0 w-screen h-screen bg-gray-200 flex ${isModal ? "visible z-50" : "hidden -z-50"}`}>
          <div class="mx-auto my-auto">
            <input
              placeholder="OpenAI API Key"
              value={apiKey}
              onInput={handleChangeAPIKey}
              name="apiKey"
              class="px-4 py-2 ml-0 mr-2 rounded-lg border-1"
            />
            <button
              class={`px-4 py-2 focus:outline-none rounded-lg ml-2 mr-0 ${
                isLoadingResponse
                  ? `pointer-events-none	bg-gray-600 text-white`
                  : `bg-black text-white`
              }`}
              disabled={isLoadingResponse}
              onClick={handleSendAPIKey}
            >
              {!isLoadingResponse ? "Set" : <img class="animate-spin text-white m-auto" src="/spinner.svg"></img>}
            </button>
          </div>
        </div>
      </div>
    )
    : null;
}
