// DOM Elements
const fileInput = document.getElementById("fileInput");
const fileLabel = document.getElementById("fileLabel");
const fileName = document.getElementById("fileName");
const analyzeBtn = document.getElementById("analyzeBtn");
const btnText = document.getElementById("btnText");
const statusSection = document.getElementById("statusSection");
const statusIcon = document.getElementById("statusIcon");
const statusText = document.getElementById("status");
const resultsContainer = document.getElementById("resultsContainer");
const resultsDiv = document.getElementById("results");
const clearBtn = document.getElementById("clearBtn");

// State
let selectedFile = null;

// File Input Handler
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  
  if (file) {
    selectedFile = file;
    fileName.textContent = file.name;
    fileLabel.classList.add("active");
    
    // Reset previous results
    hideStatus();
    hideResults();
  }
});

// Drag and Drop Support
fileLabel.addEventListener("dragover", (e) => {
  e.preventDefault();
  fileLabel.classList.add("active");
});

fileLabel.addEventListener("dragleave", () => {
  if (!selectedFile) {
    fileLabel.classList.remove("active");
  }
});

fileLabel.addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  
  if (file && file.type === "application/pdf") {
    selectedFile = file;
    fileInput.files = e.dataTransfer.files;
    fileName.textContent = file.name;
    fileLabel.classList.add("active");
    hideStatus();
    hideResults();
  } else {
    showStatus("error", "Please upload a valid PDF file");
  }
});

// Analyze Button Handler
analyzeBtn.addEventListener("click", async () => {
  if (!selectedFile) {
    showStatus("error", "Please select a PDF file first");
    return;
  }

  try {
    // Update UI for loading state
    setLoadingState(true);
    showStatus("loading", "Analyzing your policy document...");
    hideResults();

    // Create FormData
    const formData = new FormData();
    formData.append("file", selectedFile);

    // Make API request
    const response = await fetch("http://127.0.0.1:8000/analyze-policy", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    const data = await response.json();

    // Show success status
    showStatus(
      "success",
      `✓ Successfully analyzed ${data.processed_clauses || 0} clause${
        data.processed_clauses !== 1 ? "s" : ""
      }`
    );

    // Render results
    if (data.analysis && data.analysis.length > 0) {
      renderResults(data.analysis);
    } else {
      showStatus("warning", "No clauses found in the document");
    }

  } catch (err) {
    console.error("Analysis error:", err);
    showStatus(
      "error",
      err.message || "Failed to analyze document. Please check if the server is running."
    );
  } finally {
    setLoadingState(false);
  }
});

// Clear Button Handler
clearBtn.addEventListener("click", () => {
  selectedFile = null;
  fileInput.value = "";
  fileName.textContent = "Choose PDF file";
  fileLabel.classList.remove("active");
  hideStatus();
  hideResults();
});

// Helper Functions
function setLoadingState(isLoading) {
  analyzeBtn.disabled = isLoading;
  
  if (isLoading) {
    btnText.innerHTML = `
      <div class="btn-loading">
        <div class="spinner"></div>
        <span>Analyzing...</span>
      </div>
    `;
  } else {
    btnText.textContent = "Analyze Document";
  }
}

function showStatus(type, message) {
  statusSection.classList.remove("hidden");
  statusText.textContent = message;
  
  // Clear previous icon
  statusIcon.innerHTML = "";
  statusIcon.className = "status-icon";
  
  switch (type) {
    case "loading":
      statusIcon.classList.add("loading");
      statusIcon.innerHTML = '<div class="status-spinner"></div>';
      break;
      
    case "success":
      statusIcon.classList.add("success");
      statusIcon.innerHTML = '✓';
      statusIcon.style.color = '#16a34a';
      statusIcon.style.fontSize = '20px';
      statusIcon.style.fontWeight = 'bold';
      break;
      
    case "error":
      statusIcon.classList.add("error");
      statusIcon.innerHTML = '✕';
      statusIcon.style.color = '#dc2626';
      statusIcon.style.fontSize = '20px';
      statusIcon.style.fontWeight = 'bold';
      break;
      
    case "warning":
      statusIcon.classList.add("warning");
      statusIcon.innerHTML = '⚠';
      statusIcon.style.color = '#ca8a04';
      statusIcon.style.fontSize = '20px';
      break;
  }
}

function hideStatus() {
  statusSection.classList.add("hidden");
}

function hideResults() {
  resultsContainer.classList.add("hidden");
  resultsDiv.innerHTML = "";
}

function renderResults(clauses) {
  resultsDiv.innerHTML = "";
  resultsContainer.classList.remove("hidden");
  
  clauses.forEach((item, index) => {
    const card = createClauseCard(item, index);
    resultsDiv.appendChild(card);
    
    // Add slide-in animation with delay
    setTimeout(() => {
      card.classList.add("slide-in");
    }, index * 50);
  });
}

function createClauseCard(item, index) {
  const card = document.createElement("div");
  card.className = "result-card";
  
  // Risk level styling
  const riskLevel = (item.risk_level || "unknown").toLowerCase();
  
  // Entities HTML
  const entityHtml =
    item.entities && item.entities.length > 0
      ? item.entities
          .map(
            (e) =>
              `<span class="entity-badge">
                <span>${escapeHtml(e.text)}</span>
                <span class="entity-label">· ${escapeHtml(e.label)}</span>
              </span>`
          )
          .join("")
      : `<span class="no-entities">No entities detected</span>`;
  
  card.innerHTML = `
    <div class="result-header">
      <div class="result-meta">
        <span class="clause-number">#${index + 1}</span>
        <span class="clause-type">${escapeHtml(item.clause_type || "General")}</span>
      </div>
      <span class="risk-badge ${riskLevel}">
        ${escapeHtml(item.risk_level || "Unknown")} Risk
      </span>
    </div>

    <div class="result-content">
      <div class="simplified-section">
        <p class="section-title">Plain English</p>
        <p class="section-text">${escapeHtml(item.simplified || "N/A")}</p>
      </div>

      <div class="summary-section">
        <p class="section-title">Summary</p>
        <p class="summary-text">${escapeHtml(item.summary || "N/A")}</p>
      </div>

      <div class="importance-section">
        <p class="section-title">Why It Matters</p>
        <p class="importance-text">${escapeHtml(item.importance || "N/A")}</p>
      </div>

      ${item.entities && item.entities.length > 0 ? `
        <div class="entities-section">
          <p class="section-title">Key Entities</p>
          <div class="entities-list">
            ${entityHtml}
          </div>
        </div>
      ` : ""}
    </div>
  `;
  
  return card;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Initialize
hideStatus();
hideResults();