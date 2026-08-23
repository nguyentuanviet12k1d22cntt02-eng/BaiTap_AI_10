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
const videoTutorialContainer = document.getElementById("videoTutorialContainer");
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
  exerciseTags.innerHTML = (ex.tags || []).map((t, idx) => {
    const colors = ["tag-purple", "tag-blue", "tag-emerald"];
    const col = colors[idx % colors.length];
    return `<span class="tag-badge ${col}">${t}</span>`;
  }).join("");

  // Render Workflow Diagram
  workflowDiagram.innerHTML = (ex.workflow || []).map(node => `
    <div class="workflow-node">
      <div class="node-icon"><i class="ph-bold ${node.icon || 'ph-check'}"></i></div>
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
  masterPromptText.textContent = ex.masterPrompt || "";
  promptBreakdownGrid.innerHTML = (ex.promptBreakdown || []).map(item => `
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

  // Render Video Tutorial (Lite YouTube Player with High-Res Thumbnail)
  if (videoTutorialContainer) {
    if (ex.youtubeVideoId) {
      const customPoster = ex.videoPoster || 'assets/thumbnail_bai_1_youtube.jpg';
      
      videoTutorialContainer.innerHTML = `
        <div class="video-tutorial-card">
          <div class="video-card-header">
            <div class="video-card-title">
              <i class="ph-fill ph-youtube-logo" style="color: #ef4444; font-size: 24px;"></i>
              <div>
                <h4>${ex.youtubeVideoTitle || 'Video Hướng Dẫn Thực Hành Trực Quan'}</h4>
                <span>Xem từng bước hướng dẫn chi tiết (1080p HD)</span>
              </div>
            </div>
            <a href="https://www.youtube.com/watch?v=${ex.youtubeVideoId}" target="_blank" class="btn-watch-youtube" title="Mở xem trên YouTube">
              <i class="ph-bold ph-arrow-square-out"></i> Mở Trên YouTube
            </a>
          </div>
          <div class="video-poster-wrapper" id="videoPosterWrapper" onclick="playYouTubeVideo('${ex.youtubeVideoId}')" title="Bấm để phát video hướng dẫn">
            <img src="${customPoster}" alt="${ex.youtubeVideoTitle || 'Video hướng dẫn'}" class="video-poster-img" onerror="this.src='https://img.youtube.com/vi/${ex.youtubeVideoId}/hqdefault.jpg'">
            <div class="video-play-overlay">
              <div class="custom-play-btn">
                <svg viewBox="0 0 68 48" class="yt-play-svg">
                  <path class="yt-play-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#ff0000"></path>
                  <path d="M 45,24 27,14 27,34" fill="#ffffff"></path>
                </svg>
              </div>
              <span class="video-play-hint">Nhấp để phát video HD</span>
            </div>
          </div>
        </div>
      `;
    } else {
      videoTutorialContainer.innerHTML = "";
    }
  }

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
              ${step.expectedResult.images ? step.expectedResult.images.map(img => `
                <div class="step-image-box">
                  <div class="step-image-title">${img.title ? `<i class="ph-bold ph-image"></i> ${img.title}` : (step.expectedResult.imageTitle || 'Hình ảnh minh họa')}</div>
                  <div class="step-image-frame">
                    <img src="${img.src || img}" alt="${img.title || 'Kết quả'}" class="step-result-img">
                  </div>
                </div>
              `).join('') : (step.expectedResult.image ? `
                <div class="step-image-box">
                  <div class="step-image-title"><i class="ph-bold ph-image"></i> ${step.expectedResult.imageTitle || 'Hình ảnh minh họa'}</div>
                  <div class="step-image-frame">
                    <img src="${step.expectedResult.image}" alt="${step.expectedResult.imageTitle || 'Kết quả'}" class="step-result-img">
                  </div>
                </div>
              ` : '')}
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

// Helper Download Function (From String Content)
function downloadFile(filename, content, mimeType = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 300);
}

// Universal Asset Download Function (From URL / File Path via Blob)
function downloadAssetFromUrl(url, filename) {
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("File not found");
      return response.blob();
    })
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      }, 300);
    })
    .catch(() => {
      // Direct link fallback
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
      }, 300);
    });
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

// Download Current CSV / XLSX
if (btnDownloadCurrentCsv) {
  btnDownloadCurrentCsv.addEventListener("click", () => {
    const ex = COURSE_DATA.find(e => e.id === currentExerciseId);
    if (ex && ex.csvFile) {
      downloadAssetFromUrl(`data/${ex.csvFile}`, ex.csvFile);
      showToast(`Đang tải xuống ${ex.csvFile}...`);
    }
  });
}

// Download AI Code Rules
const btnDownloadRules = document.getElementById("btnDownloadRules");
if (btnDownloadRules) {
  btnDownloadRules.addEventListener("click", () => {
    downloadAssetFromUrl("data/QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md", "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md");
    showToast("Đang tải xuống Bộ Quy Tắc AI Apps Script...");
  });
}

// Download Docs/Word Template Rules
const btnDownloadTemplateRules = document.getElementById("btnDownloadTemplateRules");
if (btnDownloadTemplateRules) {
  btnDownloadTemplateRules.addEventListener("click", () => {
    downloadAssetFromUrl("data/QUY_TAC_THIET_KE_BIEU_MAU_DOCS_WORD_AI.md", "QUY_TAC_THIET_KE_BIEU_MAU_DOCS_WORD_AI.md");
    showToast("Đang tải xuống Quy Tắc Thiết Kế Biểu Mẫu Docs/Word...");
  });
}

// Download All Excel Master Package
if (btnDownloadAllExcel) {
  btnDownloadAllExcel.addEventListener("click", () => {
    downloadAssetFromUrl("data/Du_Lieu_Mau_Tong_Hop.xlsx", "Du_Lieu_Mau_Tong_Hop.xlsx");
    showToast("Đang tải xuống File Excel mẫu thực hành...");
  });
}

// Mobile Sidebar Toggle
mobileMenuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

// Play YouTube Video Lite Handler
window.playYouTubeVideo = function(videoId) {
  const wrapper = document.getElementById("videoPosterWrapper");
  if (!wrapper) return;
  
  wrapper.className = "video-embed-wrapper";
  wrapper.onclick = null;
  wrapper.innerHTML = `
    <iframe 
      src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
      title="Video hướng dẫn thực hành" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  `;
};

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
