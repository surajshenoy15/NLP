chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "FETCH_PDF") {
    try {
      const res = await fetch(message.pdfUrl);
      const blob = await res.blob();
      const arrayBuffer = await blob.arrayBuffer();

      sendResponse({ success: true, pdfBuffer: arrayBuffer });
    } catch (err) {
      sendResponse({ success: false, error: err.message });
    }
  }

  return true; // IMPORTANT
});
