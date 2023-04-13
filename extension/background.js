console.log("Hello from background script");

importScripts("utils.js");

async function suggestValues(formFieldsInfo) {
  const suggestions = [];

  for (const fieldInfo of formFieldsInfo) {
    const prompt = `Suggest a value for a ${fieldInfo.type} field with name ${fieldInfo.name} and label ${fieldInfo.label}`;
    const suggestion = await chatGPTRequest(prompt);
    suggestions.push(suggestion);
  }

  return suggestions;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.formFieldsInfo) {
    suggestValues(request.formFieldsInfo).then((suggestions) => {
      sendResponse({ suggestions });
    });
    return true; // keeps the message channel open for async response
  }
});

chrome.storage.sync.get("enabled", function (data) {
  const nextState = data.enabled ? "ON" : "OFF";

  chrome.action.setBadgeText({
    text: nextState,
  });
});
