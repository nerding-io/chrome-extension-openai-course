function findFormFields() {
  const formFields = document.querySelectorAll("input, textarea, select");
  return formFields;
}

async function startVoiceFill(field) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];
    mediaRecorder.addEventListener("error", (event) => {
      console.error("MediaRecorder error:", event.error);
    });

    mediaRecorder.addEventListener("dataavailable", (event) => {
      console.log("Data available:", event);
      audioChunks.push(event.data);
      whisperASRRequest(audioChunks).then((data) => {
        console.log("data", data);
        field.value = data.text;
      });
    });

    mediaRecorder.addEventListener("stop", async () => {
      console.log("Stop event fired");
      // const audioBlob = new Blob(audioChunks);
      // const audioBuffer = new Uint8Array(await audioBlob.arrayBuffer());
      // console.log("audioBuffer", audioBuffer);
      // chrome.runtime.sendMessage({
      //   type: "voiceFill",
      //   fieldId: field.id,
      //   audioBuffer,
      // });
    });

    mediaRecorder.start();

    setTimeout(() => {
      mediaRecorder.stop();
      stream.getTracks().forEach((track) => track.stop());
    }, 5000);
  } catch (err) {
    console.error(err);
  }
}

async function fillFormWithSuggestions() {
  const formFields = findFormFields();
  const formFieldsInfo = Array.from(formFields).map((field) => ({
    type: field.nodeName.toLowerCase(),
    label:
      field.getAttribute("name") ||
      field.getAttribute("id") ||
      field.getAttribute("placeholder") ||
      "",
  }));

  formFields.forEach((field) => {
    const micIcon = document.createElement("div");
    micIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c1.103 0 2 .897 2 2v7c0 1.103-.897 2-2 2s-2-.897-2-2v-7c0-1.103.897-2 2-2zm0-2c-2.209 0-4 1.791-4 4v7c0 2.209 1.791 4 4 4s4-1.791 4-4v-7c0-2.209-1.791-4-4-4zm8 9v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2zm-7 13v-2h-2v2h-4v2h10v-2h-4z"/></svg>`;

    // style the mic icon
    micIcon.style.width = "24px";
    micIcon.style.height = "24px";
    micIcon.style.cursor = "pointer";
    micIcon.style.marginLeft = "5px";
    micIcon.style.marginTop = "5px";
    micIcon.style.fill = "currentColor";
    micIcon.addEventListener("click", () => {
      console.log("mic clicked");
      startVoiceFill(field);
    });
    field.parentNode.insertBefore(micIcon, field.nextSibling);
  });

  const enabled = await getEnabled();
  if (!enabled) {
    return;
  }

  // send to background.js
  chrome.runtime.sendMessage({ formFieldsInfo }, (response) => {
    console.log("sent");
    const { suggestions } = response;
    formFields.forEach((field, index) => {
      field.value = suggestions[index].value;
    });
  });
}

fillFormWithSuggestions();
