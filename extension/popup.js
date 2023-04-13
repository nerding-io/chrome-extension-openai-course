console.log("Options started.");
document.getElementById("option-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const apiKey = document.getElementById("api-key").value;
  chrome.storage.sync.set({ apiKey }, () => {
    alert("Options saved.");
    restoreOptions();
    console.log("Options saved.");
  });
});
function restoreOptions() {
  chrome.storage.sync.get("apiKey", (data) => {
    const { apiKey } = data;
    document.getElementById("api-key").value = apiKey;
  });
}

restoreOptions();

console.log("Options started.");
document.getElementById("option-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const apiKey = document.getElementById("api-key").value;
  chrome.storage.sync.set({ apiKey }, () => {
    alert("Options saved.");
    restoreOptions();
    console.log("Options saved.");
  });
});
function restoreOptions() {
  chrome.storage.sync.get("apiKey", (data) => {
    const { apiKey } = data;
    document.getElementById("api-key").value = apiKey;
  });
}

restoreOptions();

function toggleBadgeText(enabled) {
  const button = document.getElementById("toggle-button");
  button.textContent = enabled ? "Disable" : "Enable";
  button.classList.toggle("enabled", enabled);
  chrome.action.setBadgeText({
    text: enabled ? "ON" : "OFF",
  });
}

function toggleExtensionState() {
  chrome.storage.sync.get("enabled", (data) => {
    let { enabled } = data;

    enabled = !enabled;

    chrome.storage.sync.set({ enabled }, () => {
      toggleBadgeText(enabled);
    });
    chrome.tabs.reload();

    chrome.runtime.sendMessage(
      { action: "toggleExtensionState", enabled },
      (response) => {
        console.log("sent");
      }
    );
  });
}

const toggleButton = document.getElementById("toggle-button");
toggleButton.addEventListener("click", toggleExtensionState);

chrome.storage.sync.get("enabled", (data) => {
  const { enabled } = data;
  toggleBadgeText(enabled);
});
