/**
 * AUTOMATION MASTER COURSE - PROMPT ENGINEERING & AI AGENT PLATFORM
 */

// Master Course Data Focused on Prompts for Gemini & AI Agents

// Application State
let currentExerciseId = "bt1";
let completedExercises = JSON.parse(localStorage.getItem("completed_exercises") || "[]");

// DOM Elements
const exerciseNavList = document.getElementById("exerciseNavList");
const breadcrumbTitle = document.getElementById("breadcrumbTitle");
const exerciseTitle = document.getElementById("exerciseTitle");
const exerciseDesc = document.getElementById("exerciseDesc");
const exerciseTags = document.getElementById("exerciseTags");
const exerciseLevel = document.getElementById("exerciseLevel");
const exerciseTime = document.getElementById("exerciseTime");
const workflowDiagram = document.getElementById("workflowDiagram");
const scenarioStory = document.getElementById("scenarioStory");
const scenarioPain = document.getElementById("scenarioPain");
const scenarioSolution = document.getElementById("scenarioSolution");
const masterPromptText = document.getElementById("masterPromptText");
const promptBreakdownGrid = document.getElementById("promptBreakdownGrid");
const businessRequirements = document.getElementById("businessRequirements");
const dataTableContainer = document.getElementById("dataTableContainer");
const tableRowCount = document.getElementById("tableRowCount");
const stepsTimelineContainer = document.getElementById("stepsTimelineContainer");
const triggerGuideContainer = document.getElementById("triggerGuideContainer");
const checklistContainer = document.getElementById("checklistContainer");
const btnMarkComplete = document.getElementById("btnMarkComplete");
const markCompleteText = document.getElementById("markCompleteText");
const completedCounter = document.getElementById("completedCounter");
const progressPercentage = document.getElementById("progressPercentage");
const progressBarFill = document.getElementById("progressBarFill");
const scriptCodeBlock = document.getElementById("scriptCodeBlock");
const scriptFileName = document.getElementById("scriptFileName");
const btnCopyCode = document.getElementById("btnCopyCode");
const btnDownloadCurrentScript = document.getElementById("btnDownloadCurrentScript");
const btnCopyMasterPrompt = document.getElementById("btnCopyMasterPrompt");
const btnCopyPromptInside = document.getElementById("btnCopyPromptInside");
const btnDownloadAllExcel = document.getElementById("btnDownloadAllExcel");
const btnDownloadCurrentCsv = document.getElementById("btnDownloadCurrentCsv");
const btnResetProgress = document.getElementById("btnResetProgress");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const sidebar = document.getElementById("sidebar");

// Show Toast Notification
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Render Sidebar Navigation
function renderNav() {
  exerciseNavList.innerHTML = "";
  COURSE_DATA.forEach(ex => {
    const isCompleted = completedExercises.includes(ex.id);
    const isActive = ex.id === currentExerciseId;

    const li = document.createElement("li");
    li.className = `nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
    li.onclick = () => switchExercise(ex.id);

    li.innerHTML = `
      <div class="nav-item-number">${isCompleted ? '<i class="ph-bold ph-check"></i>' : ex.index}</div>
      <div class="nav-item-info">
        <div class="nav-item-title">${ex.shortTitle}</div>
        <div class="nav-item-subtitle">${ex.subtitle}</div>
      </div>
      <div class="nav-item-status">
        <i class="ph-bold ${isCompleted ? 'ph-check-circle' : 'ph-circle'}"></i>
      </div>
    `;
    exerciseNavList.appendChild(li);
  });

  updateProgress();
}

// Update Progress Bar
function updateProgress() {
  const count = completedExercises.length;
  const total = COURSE_DATA.length;
  const percent = Math.round((count / total) * 100);

  completedCounter.textContent = `${count}/${total} hoàn thành`;
  progressPercentage.textContent = `${percent}%`;
  progressBarFill.style.width = `${percent}%`;

  const isCurrentCompleted = completedExercises.includes(currentExerciseId);
  if (isCurrentCompleted) {
    btnMarkComplete.classList.add("completed");
    markCompleteText.textContent = "Đã hoàn thành";
  } else {
    btnMarkComplete.classList.remove("completed");
    markCompleteText.textContent = "Đánh dấu hoàn thành";
  }
}

// Switch Exercise
function switchExercise(id) {
  currentExerciseId = id;
  const ex = COURSE_DATA.find(e => e.id === id);
  if (!ex) return;

  // Update Breadcrumb & Header
  breadcrumbTitle.textContent = ex.title;
  exerciseTitle.textContent = ex.title;
  exerciseDesc.textContent = ex.desc;
  exerciseLevel.textContent = ex.level;
  exerciseTime.innerHTML = `<i class="ph ph-clock"></i> ${ex.time}`;

  // Update Download Button dynamically based on file type
  if (ex.csvFile && ex.csvFile.endsWith('.xlsx')) {
    btnDownloadCurrentCsv.innerHTML = `<i class="ph-bold ph-file-xls"></i> Tải Dữ Liệu XLSX`;
  } else {
    btnDownloadCurrentCsv.innerHTML = `<i class="ph-bold ph-file-csv"></i> Tải Dữ Liệu CSV`;
  }

  // Render Tags
  exerciseTags.innerHTML = ex.tags.map((t, idx) => {
    const colors = ["tag-purple", "tag-blue", "tag-emerald"];
    const col = colors[idx % colors.length];
    return `<span class="tag-badge ${col}">${t}</span>`;
  }).join("");

  // Render Workflow Diagram
  workflowDiagram.innerHTML = ex.workflow.map(node => `
    <div class="workflow-node">
      <div class="node-icon"><i class="ph-bold ${node.icon}"></i></div>
      <div class="node-title">${node.title}</div>
      <div class="node-desc">${node.desc}</div>
    </div>
  `).join("");

  // Render Business Scenario
  if (ex.businessScenario) {
    if (scenarioStory) scenarioStory.innerHTML = `<b>📖 Tình huống:</b> ${ex.businessScenario.story}`;
    if (scenarioPain) scenarioPain.innerHTML = ex.businessScenario.pain;
    if (scenarioSolution) scenarioSolution.innerHTML = ex.businessScenario.solution;
  }

  // Render Tab 1: Master Prompt Studio
  masterPromptText.textContent = ex.masterPrompt;
  promptBreakdownGrid.innerHTML = ex.promptBreakdown.map(item => `
    <div class="breakdown-card">
      <span class="breakdown-tag">${item.tag}</span>
      <div class="breakdown-title">${item.title}</div>
      <div class="breakdown-desc">${item.desc}</div>
    </div>
  `).join("");

  // Render Tab 2: Overview & Data Table
  businessRequirements.innerHTML = ex.businessRequirements;
  let tableHtml = `<table class="data-table"><thead><tr>`;
  ex.tableHeaders.forEach(h => {
    tableHtml += `<th>${h}</th>`;
  });
  tableHtml += `</tr></thead><tbody>`;
  ex.tableRows.forEach(row => {
    tableHtml += `<tr>`;
    row.forEach(cell => {
      tableHtml += `<td>${cell}</td>`;
    });
    tableHtml += `</tr>`;
  });
  tableHtml += `</tbody></table>`;
  dataTableContainer.innerHTML = tableHtml;
  tableRowCount.textContent = `Xem trước ${ex.tableRows.length} dòng dữ liệu mẫu`;

  // Render Tab 3: Steps Timeline
  stepsTimelineContainer.innerHTML = ex.steps.map(step => `
    <div class="step-item">
      <div class="step-badge">${step.badge}</div>
      <div class="step-content">
        <h4 class="step-title">${step.title}</h4>
        <p class="step-description">${step.desc}</p>
        ${step.promptBox ? `
          <div class="step-prompt-card">
            <div class="step-prompt-card-header">
              <span class="prompt-card-label"><i class="ph-bold ph-chat-circle-dots"></i> Câu Lệnh Prompt Gửi AI</span>
              <button class="btn-copy-step-prompt" onclick="copyStepPrompt(this)">
                <i class="ph-bold ph-copy"></i> Sao chép
              </button>
            </div>
            <pre class="step-prompt-pre">${escapeHtml(step.promptBox)}</pre>
          </div>
        ` : ''}
        ${step.note ? `
          <div class="step-note-box">
            <i class="ph-bold ph-info"></i>
            <div>${step.note}</div>
          </div>
        ` : ''}
        ${step.expectedResult ? `
          <div class="step-result-card">
            <div class="step-result-header">
              <i class="ph-bold ph-check-circle" style="color: #10b981;"></i>
              <span>Kết quả đối chiếu chuẩn xác</span>
            </div>
            <div class="step-image-gallery">
              ${step.expectedResult.image ? `
                <div class="step-image-box">
                  <div class="step-image-title">${step.expectedResult.imageTitle || 'Hình ảnh minh họa'}</div>
                  <div class="step-image-frame">
                    <img src="${step.expectedResult.image}" alt="${step.expectedResult.imageTitle || 'Kết quả'}" class="step-result-img">
                  </div>
                </div>
              ` : ''}
              ${step.expectedResult.htmlText ? `
                <div class="step-result-text">
                  ${step.expectedResult.htmlText}
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `).join("");

  // Render Tab 3: Script Code Preview
  if (scriptFileName) scriptFileName.textContent = ex.scriptFile || "Code.gs";
  if (scriptCodeBlock) scriptCodeBlock.textContent = ex.scriptContent || "// Mã nguồn Apps Script";

  // Render Tab 5: Trigger & Checklist
  triggerGuideContainer.innerHTML = ex.triggerGuide;
  checklistContainer.innerHTML = ex.checklist.map((item, idx) => `
    <li class="checklist-item">
      <input type="checkbox" id="check_${ex.id}_${idx}">
      <label for="check_${ex.id}_${idx}">${item}</label>
    </li>
  `).join("");

  renderNav();
  if (window.innerWidth <= 900) {
    sidebar.classList.remove("open");
  }
}

// Tab Switching
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

    btn.classList.add("active");
    const targetTab = document.getElementById(btn.dataset.tab);
    if (targetTab) targetTab.classList.add("active");
  });
});

// Mark Complete Button
btnMarkComplete.addEventListener("click", () => {
  if (completedExercises.includes(currentExerciseId)) {
    completedExercises = completedExercises.filter(id => id !== currentExerciseId);
    showToast("Đã hủy đánh dấu hoàn thành!");
  } else {
    completedExercises.push(currentExerciseId);
    showToast("🎉 Tuyệt vời! Bạn đã hoàn thành bài thực hành này.");
  }
  localStorage.setItem("completed_exercises", JSON.stringify(completedExercises));
  renderNav();
});

// Reset Progress
btnResetProgress.addEventListener("click", () => {
  if (confirm("Bạn có chắc chắn muốn đặt lại toàn bộ tiến độ học tập?")) {
    completedExercises = [];
    localStorage.removeItem("completed_exercises");
    renderNav();
    showToast("Đã đặt lại tiến độ học tập!");
  }
});

// Copy Master Prompt
function copyCurrentPrompt() {
  const ex = COURSE_DATA.find(e => e.id === currentExerciseId);
  if (ex) {
    navigator.clipboard.writeText(ex.masterPrompt).then(() => {
      showToast("✨ Đã sao chép Master Prompt! Hãy dán vào Gemini / AI Agent.");
    }).catch(() => {
      showToast("Lỗi sao chép!");
    });
  }
}

btnCopyMasterPrompt.addEventListener("click", copyCurrentPrompt);
btnCopyPromptInside.addEventListener("click", copyCurrentPrompt);

// Copy Code Button
if (btnCopyCode) {
  btnCopyCode.addEventListener("click", () => {
    const code = scriptCodeBlock ? scriptCodeBlock.textContent : "";
    navigator.clipboard.writeText(code).then(() => {
      showToast("📋 Đã sao chép mã nguồn Apps Script!");
    }).catch(() => {
      showToast("Lỗi sao chép!");
    });
  });
}

// Helper Download Function
function downloadFile(filename, content, mimeType = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Download Current Script
if (btnDownloadCurrentScript) {
  btnDownloadCurrentScript.addEventListener("click", () => {
    const ex = COURSE_DATA.find(e => e.id === currentExerciseId);
    if (ex && ex.scriptContent) {
      downloadFile(ex.scriptFile || "Code.gs", ex.scriptContent, "application/javascript");
      showToast(`Đã tải xuống ${ex.scriptFile || "Code.gs"}`);
    }
  });
}

// Download Current CSV
btnDownloadCurrentCsv.addEventListener("click", () => {
  const ex = COURSE_DATA.find(e => e.id === currentExerciseId);
  if (ex) {
    const a = document.createElement("a");
    a.href = `data/${ex.csvFile}`;
    a.download = ex.csvFile;
    a.click();
    showToast(`Đang tải xuống ${ex.csvFile}...`);
  }
});

// Download All Excel
btnDownloadAllExcel.addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = "data/Du_Lieu_Mau_Tong_Hop.xlsx";
  a.download = "Du_Lieu_Mau_Tong_Hop.xlsx";
  a.click();
  showToast("Đang tải xuống File Excel mẫu thực hành...");
});

// Mobile Sidebar Toggle
mobileMenuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

// Initialize on Load
document.addEventListener("DOMContentLoaded", () => {
  renderNav();
  switchExercise("bt1");
});


// Helper function to escape HTML
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Copy Step Prompt Helper
window.copyStepPrompt = function(btn) {
  const card = btn.closest('.step-prompt-card');
  if (card) {
    const pre = card.querySelector('.step-prompt-pre');
    if (pre) {
      navigator.clipboard.writeText(pre.textContent).then(() => {
        showToast("Đã sao chép câu lệnh Prompt!");
      }).catch(() => {
        showToast("Đã sao chép câu lệnh Prompt!");
      });
    }
  }
};
