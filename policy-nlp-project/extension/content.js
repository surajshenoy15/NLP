(function () {
  let attempts = 0;
  const MAX_ATTEMPTS = 15;

  const extractPdfText = () => {
    attempts++;

    // Chrome PDF viewer renders text inside .textLayer
    const textLayers = document.querySelectorAll(".textLayer");

    let extractedText = "";
    textLayers.forEach(layer => {
      extractedText += layer.innerText + "\n";
    });

    // If meaningful text found → send to extension
    if (extractedText.trim().length > 300) {
      chrome.runtime.sendMessage({
        type: "PDF_TEXT_DETECTED",
        payload: extractedText
      });
      return;
    }

    // Retry until PDF finishes rendering
    if (attempts < MAX_ATTEMPTS) {
      setTimeout(extractPdfText, 1000);
    }
  };

  // Run only on PDF viewer
  if (
    document.contentType === "application/pdf" ||
    document.querySelector("embed[type='application/pdf']")
  ) {
    setTimeout(extractPdfText, 1500);
  }
})();
