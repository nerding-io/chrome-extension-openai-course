function getEnabled() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("enabled", (data) => {
      const { enabled } = data;
      resolve(enabled);
    });
  });
}

function getApiKeys() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("apiKey", (data) => {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        const { apiKey } = data;
        resolve(apiKey);
      }
    });
  });
}

async function chatGPTRequest(prompt) {
  console.log("chatGPTRequest");
  const openai_api_key = await getApiKeys();
  const request = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openai_api_key}`,
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: `you are a content creator for a software engineering writing a blog. 
            The reader is a software engineer who is interested in using the openai api.
            The reader is familiar with javascript and has some experience with the openai api.
            The response should be formatted in double-quoted property name in JSON only and escaped, no explanation is needed.
           {
              "field": "string",
              "label": "string",
              "value": "string",
           }`,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 2500,
      temperature: 0.9,
      model: "gpt-3.5-turbo",
    }),
  });

  const data = await request.json();
  console.log("chatGPTRequest", data.choices[0].message.content);
  return JSON.parse(data.choices[0].message.content);
}

async function whisperASRRequest(audioData) {
  const openai_api_key = await getApiKeys();
  try {
    const formData = new FormData();
    const blob = new Blob(audioData, {
      type: "audio/webm",
    });
    const file = new File([blob], "input.webm", {
      type: "audio/webm",
    });
    formData.append("file", file);
    formData.append("model", "whisper-1");

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${openai_api_key}`);

    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers,
        body: formData,
      }
    );
    const data = await response.json();
    console.log("whisperASRRequest", data);
    return data;
  } catch (error) {
    console.log("error transcribing audio", error);
  }
}
