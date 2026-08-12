/**
 * AUTOMATION MASTER COURSE - PROMPT ENGINEERING & AI AGENT PLATFORM
 */

// Master Course Data Focused on Prompts for Gemini & AI Agents
const COURSE_DATA = [
  {
    id: "bt1",
    index: 1,
    title: "Bài 1: Prompt Tự Động Hóa Báo Cáo Doanh Thu & Sparkline Gửi Email 08h00",
    shortTitle: "Báo Cáo Doanh Thu & Sparkline",
    subtitle: "Prompting cho Gemini trong Google Sheets & Gmail",
    level: "Dành Cho Dân Văn Phòng",
    time: "15 phút",
    tags: ["Gemini in Sheets", "Sparkline Prompt", "Gmail Automation", "No-Code"],
    desc: "Cách viết Prompt ra lệnh cho Gemini/AI Agent tự động viết công thức Sparkline vẽ biểu đồ mini trong ô và lập lịch tự động gửi email báo cáo HTML lúc 08:00 sáng mỗi ngày.",
    csvFile: "bai_tap_1_doanh_thu_sparkline.csv",
    
    workflow: [
      { icon: "ph-chat-circle-dots", title: "1. Viết Master Prompt", desc: "Mô tả nghiệp vụ & dữ liệu cho Gemini" },
      { icon: "ph-sparkle", title: "2. AI Sinh Công Thức", desc: "Tự điền hàm Sparkline & tính tổng" },
      { icon: "ph-robot", title: "3. AI Thiết Lập Workflow", desc: "Tự tạo email HTML báo cáo lãnh đạo" },
      { icon: "ph-clock-countdown", title: "4. Hẹn Giờ 08:00 Sáng", desc: "Tự động kích hoạt hàng ngày" }
    ],

    masterPrompt: `[VAI TRÒ]: Bạn là Lập trình viên Google Apps Script.
[NHIỆM VỤ]: Viết 1 đoạn code Apps Script (.gs) hoàn chỉnh cho tab "DoanhThu_BT1". Không giải thích, chỉ xuất khối mã code.

[RÀNG BUỘC CÔNG THỨC NGHIÊM NGẠT - CHUẨN LOCALE VIỆT NAM]:
1. Cột L (Col 12): Chèn công thức '=SUM(D4:J4)' từ dòng 4 đến lastRow.
2. Cột K (Col 11): Chèn công thức SPARKLINE chuẩn Việt Nam từ dòng 4 đến lastRow. 
   BẮT BỘC dùng chính xác cú pháp này (Dùng dấu ';' và dấu '\\'):
   =SPARKLINE(D4:J4; {"charttype"\\"line"; "color"\\"#1a73e8"; "linewidth"\\2})
   
*LƯU Ý KỸ THUẬT KHI ĐƯA VÀO APPS SCRIPT:*
- Không dùng dấu phẩy (,) trong mảng thuộc tính Sparkline.
- Không thêm dấu gạch chéo ngược (\\) trước dấu # của mã màu.
- Trong JS String, escape dấu nháy kép chuẩn: \\"charttype\\"\\"line\\"...

[TÍNH NĂNG ĐỒNG BỘ]:
- Quét dữ liệu Cột L để tính Tổng Doanh Thu Hệ Thống và Chi Nhánh Cao Nhất.
- Soạn email HTML màu Navy (#0f172a) sang trọng có Thẻ KPI + Bảng chi tiết (định dạng VNĐ) gửi đến "giamdoc@congty.com" với tiêu đề "[BÁO CÁO DOANH THU] - Cập nhật ngày " + dd/MM/yyyy.
- Thêm hàm onOpen() tạo Menu "🚀 BÁO CÁO" > "Chạy Báo Cáo Ngay" trên Sheet.
- Thêm hàm setupDailyTrigger() đặt lịch 08:00 AM hàng ngày.
- Hiện Browser.msgBox("Thành công!") khi chạy xong.`,

    businessScenario: {
      story: "Bạn là Trợ lý Ban Giám Đốc hoặc Trưởng nhóm Kinh doanh tại chuỗi bán lẻ 10 chi nhánh toàn quốc. Mỗi sáng lúc 08:30, Ban Giám Đốc sẽ họp giao ban đầu ngày để đánh giá tốc độ bán hàng và điều phối hàng hóa giữa các vùng miền.",
      pain: "Mỗi sáng 7h30 bạn phải thức dậy mở file Sheets, tính tổng 10 chi nhánh, tìm xem chi nhánh nào bán chạy nhất, kẻ vẽ biểu đồ rồi gõ email gửi sếp. Hôm nào bận việc đột xuất hay quên gửi là bị nhắc nhở, tốn 30 phút mỗi ngày.",
      solution: "Chỉ với 1 câu Master Prompt chuẩn Locale Việt Nam, bạn ra lệnh cho Apps Script tự động chèn biểu đồ Sparkline mini, tính tổng, tạo Menu tùy chỉnh trên Sheet và gửi email báo cáo HTML lúc đúng 08:00 sáng mỗi ngày!"
    },

    promptBreakdown: [
      { tag: "1. VAI TRÒ & NHIỆM VỤ", title: "Lập trình viên Google Apps Script", desc: "Yêu cầu AI đóng vai lập trình viên GAS, tập trung xuất duy nhất mã nguồn hoàn chỉnh." },
      { tag: "2. CÔNG THỨC CHUẨN VN", title: "Locale Việt Nam (; và \\)", desc: "Ép cú pháp Sparkline chuẩn =SPARKLINE(D4:J4; {\"charttype\"\\\"line\";...}) tránh lỗi cú pháp dấu phẩy." },
      { tag: "3. TÍNH NĂNG TÍNH TOÁN", title: "Quét Cột L & Phân Tích KPI", desc: "Tự động tính Tổng Doanh Thu Hệ Thống và tìm Chi Nhánh Dẫn Đầu có doanh thu cao nhất." },
      { tag: "4. EMAIL HTML & MENU", title: "Navy Theme & Menu Nút Bấm", desc: "Tạo email HTML sang trọng (#0f172a) và hàm onOpen() tạo menu '🚀 BÁO CÁO' ngay trên thanh công cụ." },
      { tag: "5. TỰ ĐỘNG HÓA & POPUP", title: "Trigger 08:00 & Thông Báo", desc: "Hàm setupDailyTrigger() chạy định kỳ và Browser.msgBox('Thành công!') báo kết quả." }
    ],

    businessRequirements: `
      <p><b>Bài toán thực tế:</b> Tự động hóa toàn bộ quy trình từ khâu điền công thức biểu đồ mini Sparkline chuẩn Locale Việt Nam, tạo Menu nút bấm trên Google Sheets đến khâu tính KPI và gửi email báo cáo HTML tới Giám đốc lúc 08:00 sáng mỗi ngày.</p>
      <ul>
        <li><b>Mục tiêu:</b> Chèn công thức động chuẩn Việt Nam, tạo menu tùy chỉnh, phân tích dữ liệu và gửi email HTML tự động 100%.</li>
        <li><b>Kỹ năng đạt được:</b> Kỹ thuật viết Prompt ràng buộc công thức nghiêm ngặt cho Apps Script, xử lý Locale Việt Nam (dấu chấm phẩy <code>;</code> và gạch chéo ngược <code>\\</code>), tạo Menu UI và cài đặt Trigger.</li>
      </ul>
    `,

    tableHeaders: ["Mã CN", "Tên Chi Nhánh", "Khu Vực", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật", "Xu Hướng (Sparkline)", "Tổng Tuần"],
    tableRows: [
      ["CN001", "Chi nhánh Ba Đình", "Hà Nội", "12,500,000", "14,200,000", "13,800,000", "15,600,000", "18,900,000", "24,500,000", "26,800,000", "<svg class='sparkline-preview' viewBox='0 0 100 24'><polyline fill='none' stroke='#38bdf8' stroke-width='2' points='0,18 16,14 32,15 48,12 64,8 80,3 100,0'/></svg>", "126,300,000 đ"],
      ["CN002", "Chi nhánh Cầu Giấy", "Hà Nội", "18,200,000", "19,500,000", "17,800,000", "21,000,000", "25,600,000", "31,200,000", "34,500,000", "<svg class='sparkline-preview' viewBox='0 0 100 24'><polyline fill='none' stroke='#38bdf8' stroke-width='2' points='0,16 16,14 32,17 48,13 64,9 80,4 100,0'/></svg>", "167,800,000 đ"],
      ["CN004", "Chi nhánh Quận 1", "TP.HCM", "25,600,000", "27,800,000", "24,900,000", "29,500,000", "35,600,000", "45,200,000", "49,800,000", "<svg class='sparkline-preview' viewBox='0 0 100 24'><polyline fill='none' stroke='#10b981' stroke-width='2' points='0,16 16,13 32,17 48,11 64,7 80,2 100,0'/></svg>", "238,400,000 đ"]
    ],

    steps: [
      {
        badge: "01",
        title: "Kiểm Tra Định Dạng File (Bắt buộc: Không có badge .XLSX)",
        desc: "Đảm bảo file đang ở chế độ <b>Google Trang tính gốc (không có badge .XLSX xanh bên cạnh tên file)</b> để kích hoạt đầy đủ tính năng Apps Script và Trigger. Nếu thấy có badge <code>.XLSX</code>, hãy nhấp vào menu <b>Tệp (File) ➔ Lưu dưới dạng Google Trang tính (Save as Google Sheets)</b> trước khi thực hiện tiếp."
      },
      {
        badge: "02",
        title: "Mở Tiện Ích Mở Rộng ➔ Apps Script",
        desc: "Trên Google Sheets, vào menu <b>Tiện ích mở rộng ➔ Apps Script</b> để mở trình soạn thảo mã nguồn."
      },
      {
        badge: "03",
        title: "Dán Master Prompt & Lấy Code Chuẩn Locale VN",
        desc: "Sao chép câu **Master Prompt** tại Tab 1, dán vào AI Agent hoặc copy trực tiếp toàn bộ code tại Tab 3.",
        promptBox: "Dán Master Prompt từ Tab 1 vào AI Agent"
      },
      {
        badge: "04",
        title: "Dán Code Vào Apps Script & Chạy Thử",
        desc: "Dán mã nguồn vào tệp <code>Code.gs</code>, chọn hàm <code>runDailyReport</code> hoặc dùng menu <b>🚀 BÁO CÁO ➔ Chạy Báo Cáo Ngay</b> trên Google Sheets."
      },
      {
        badge: "05",
        title: "Kích Hoạt Lịch Hẹn Giờ 08:00 Sáng",
        desc: "Chọn hàm <code>setupDailyTrigger</code> trong danh sách hàm và bấm <b>▷ Chạy</b> để thiết lập lịch gửi email tự động mỗi sáng."
      }
    ],

    scriptContent: `/**
 * ==============================================================================
 * BÀI TẬP 1: BÁO CÁO DOANH THU HỆ THỐNG - CHUẨN LOCALE VIỆT NAM
 * ==============================================================================
 */

/**
 * TẠO MENU TRÊN GOOGLE SHEETS KHI MỞ FILE
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🚀 BÁO CÁO")
    .addItem("Chạy Báo Cáo Ngay", "runDailyReport")
    .addItem("Cài Đặt Hẹn Giờ 08:00 Sáng", "setupDailyTrigger")
    .addToUi();
}

/**
 * HÀM CHÍNH: Chèn công thức chuẩn Locale VN, phân tích KPI và gửi Email HTML
 */
function runDailyReport() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("DoanhThu_BT1");
  
  if (!sheet) {
    throw new Error("Không tìm thấy trang tính có tên 'DoanhThu_BT1'!");
  }
  
  var lastRow = sheet.getLastRow();
  if (lastRow < 4) {
    Logger.log("Chưa có dữ liệu từ dòng 4 trở đi.");
    return;
  }
  
  var numRows = lastRow - 3;
  
  // --------------------------------------------------------------------------
  // 1. CHÈN CÔNG THỨC CHUẨN LOCALE VIỆT NAM (DÙNG ; VÀ \\)
  // --------------------------------------------------------------------------
  var sparklineFormulas = [];
  var sumFormulas = [];
  
  for (var r = 4; r <= lastRow; r++) {
    // Công thức SPARKLINE chuẩn Locale Việt Nam: dùng ; và \\ trong mảng thuộc tính
    sparklineFormulas.push(['=SPARKLINE(D' + r + ':J' + r + '; {"charttype"\\\\"line"; "color"\\\\"#1a73e8"; "linewidth"\\\\2})']);
    sumFormulas.push(['=SUM(D' + r + ':J' + r + ')']);
  }
  
  sheet.getRange(4, 11, numRows, 1).setFormulas(sparklineFormulas); // Cột K (11)
  sheet.getRange(4, 12, numRows, 1).setFormulas(sumFormulas);       // Cột L (12)
  SpreadsheetApp.flush();
  
  // --------------------------------------------------------------------------
  // 2. QUÉT DỮ LIỆU CỘT L & PHÂN TÍCH KPI
  // --------------------------------------------------------------------------
  var data = sheet.getRange(4, 1, numRows, 12).getValues();
  
  var totalSystemRevenue = 0;
  var maxRevenue = -1;
  var topBranch = "";
  var topRegion = "";
  var tableRowsHTML = "";
  
  for (var i = 0; i < data.length; i++) {
    var branchCode  = data[i][0]; // Cột A
    var branchName  = data[i][1]; // Cột B
    var region      = data[i][2]; // Cột C
    var weeklyTotal = Number(data[i][11]) || 0; // Cột L (index 11)
    
    if (!branchCode && !branchName) continue;
    
    totalSystemRevenue += weeklyTotal;
    
    if (weeklyTotal > maxRevenue) {
      maxRevenue = weeklyTotal;
      topBranch = branchName;
      topRegion = region;
    }
    
    var formattedRowTotal = weeklyTotal.toLocaleString('vi-VN') + " VNĐ";
    var rowBg = (i % 2 === 0) ? "#f8fafc" : "#ffffff";
    
    tableRowsHTML += \`
      <tr style="background-color: \${rowBg};">
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1e293b;">\${branchCode}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #334155;">\${branchName}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;">\${region}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700; color: #0f172a;">\${formattedRowTotal}</td>
      </tr>
    \`;
  }
  
  var formattedSystemTotal = totalSystemRevenue.toLocaleString('vi-VN') + " VNĐ";
  var formattedMaxRevenue  = maxRevenue.toLocaleString('vi-VN') + " VNĐ";
  var todayDateStr         = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy");
  
  // --------------------------------------------------------------------------
  // 3. SOẠN VÀ GỬI EMAIL HTML NAVY (#0f172a) SANG TRỌNG
  // --------------------------------------------------------------------------
  var htmlBody = \`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
        
        <!-- Header Navy -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">BÁO CÁO DOANH THU TOÀN HỆ THỐNG</h1>
          <p style="margin: 0; font-size: 13px; color: #94a3b8;">Cập nhật tự động ngày: <strong style="color: #38bdf8;">\${todayDateStr}</strong></p>
        </div>
        
        <!-- KPI Cards Grid -->
        <div style="padding: 24px 20px 10px 20px;">
          <table style="width: 100%; border-collapse: separate; border-spacing: 12px 0;">
            <tr>
              <td style="width: 50%; background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #1a73e8; border-radius: 8px; padding: 16px; vertical-align: top;">
                <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">TỔNG DOANH THU HỆ THỐNG</div>
                <div style="font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 6px;">\${formattedSystemTotal}</div>
              </td>
              <td style="width: 50%; background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #10b981; border-radius: 8px; padding: 16px; vertical-align: top;">
                <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">CHI NHÁNH DẪN ĐẦU</div>
                <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 6px;">\${topBranch}</div>
                <div style="font-size: 13px; font-weight: 700; color: #10b981; margin-top: 2px;">\${formattedMaxRevenue} <span style="font-size: 11px; font-weight: 400; color: #64748b;">(\${topRegion})</span></div>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- Table Section -->
        <div style="padding: 10px 20px 24px 20px;">
          <h3 style="margin: 10px 0 12px 0; font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase;">Chi Tiết Từng Chi Nhánh</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background-color: #0f172a; color: #ffffff;">
                <th style="padding: 10px 14px; text-align: left; border-top-left-radius: 6px;">Mã CN</th>
                <th style="padding: 10px 14px; text-align: left;">Tên Chi Nhánh</th>
                <th style="padding: 10px 14px; text-align: left;">Khu Vực</th>
                <th style="padding: 10px 14px; text-align: right; border-top-right-radius: 6px;">Doanh Thu Tuần</th>
              </tr>
            </thead>
            <tbody>
              \${tableRowsHTML}
            </tbody>
          </table>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
          Email được kích hoạt tự động lúc 08:00 AM bởi hệ thống Google Apps Script.
        </div>
      </div>
    </body>
    </html>
  \`;
  
  MailApp.sendEmail({
    to: "giamdoc@congty.com",
    subject: "[BÁO CÁO DOANH THU] - Cập nhật ngày " + todayDateStr,
    htmlBody: htmlBody
  });
  
  Logger.log("Đã gửi email báo cáo thành công tới giamdoc@congty.com.");
  
  // Hiển thị thông báo khi chạy từ giao diện Sheet
  try {
    Browser.msgBox("Thành công!", "Đã tính toán KPI và gửi email báo cáo doanh thu tới Giám đốc thành công!", Browser.Buttons.OK);
  } catch (e) {
    Logger.log("Chạy headless qua Trigger: " + e.toString());
  }
}

/**
 * 4. THIẾT LẬP TRIGGER HẸN GIỜ 08:00 AM HÀNG NGÀY
 */
function setupDailyTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "runDailyReport") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  
  ScriptApp.newTrigger("runDailyReport")
    .timeBased()
    .atHour(8)
    .everyDays(1)
    .inTimezone("Asia/Ho_Chi_Minh")
    .create();
    
  try {
    Browser.msgBox("Thành công!", "Đã cài đặt Trigger tự động gửi báo cáo vào lúc 08:00 AM mỗi ngày!", Browser.Buttons.OK);
  } catch (e) {
    Logger.log("Trigger setup: " + e.toString());
  }
}ght: bold; margin: 0;">\${topBranch}</p>
          <p style="font-size: 14px; margin: 5px 0 0 0;">\${formattedMaxRevenue}</p>
        </div>
      </div>
      
      <h3 style="color: #000080; border-bottom: 2px solid #000080; padding-bottom: 5px;">Chi Tiết Các Chi Nhánh</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr style="background-color: #000080; color: white;">
            <th style="padding: 10px; text-align: left;">Mã CN</th>
            <th style="padding: 10px; text-align: left;">Tên Chi Nhánh</th>
            <th style="padding: 10px; text-align: left;">Khu Vực</th>
            <th style="padding: 10px; text-align: right;">Doanh Thu Tuần</th>
          </tr>
        </thead>
        <tbody>
          \${tableRowsHTML}
        </tbody>
      </table>
      
      <p style="margin-top: 20px; font-size: 12px; color: #888; text-align: center;">Email này được gửi tự động từ hệ thống quản lý.</p>
    </div>
  \`;
  
  // Gửi email tới địa chỉ người nhận
  MailApp.sendEmail({
    to: "nguyentuanviet12k1@gmail.com", // Đổi thành email người nhận
    subject: "[BÁO CÁO DOANH THU] - Cập nhật lúc " + now,
    htmlBody: htmlBody
  });
}

// Hàm tạo Trigger tự động chạy theo lịch
function createDailyTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  ScriptApp.newTrigger("sendRevenueReport")
    .timeBased()
    .atHour(8)
    .everyDays(1)
    .inTimezone("Asia/Ho_Chi_Minh")
    .create();
}`,

    triggerGuide: `
      <h3 class="section-title"><i class="ph-bold ph-chat-circle-dots"></i> Câu Prompt Yêu Cầu AI Hướng Dẫn Cài Đặt Hẹn Giờ</h3>
      <p style="color: var(--text-secondary); margin-bottom: 10px;">Nếu bạn không biết cách bấm cài đặt Trigger, hãy gửi câu prompt sau cho Gemini:</p>
      <div class="step-prompt-box">
"Hãy hướng dẫn tôi từng bước bằng hình ảnh hoặc danh sách thao tác đơn giản nhất để cài đặt cho quy trình này tự động chạy lúc 8h sáng mỗi ngày trong Google Sheets."
      </div>
    `,

    checklist: [
      "Đã copy Master Prompt và gửi cho Gemini / AI Agent",
      "Đã dán công thức =SPARKLINE() vào cột K trên Google Sheets",
      "AI đã tạo quy trình gửi email báo cáo HTML đẹp mắt",
      "Đã kiểm tra email đến hộp thư thành công",
      "Đã thiết lập lịch tự động chạy lúc 08:00 sáng"
    ]
  },

  {
    id: "bt2",
    index: 2,
    title: "Bài 2: Prompt Tự Động Điền Dữ Liệu & Xuất Phiếu Giao Hàng PDF Đa Sản Phẩm Lưu Drive",
    shortTitle: "Xuất Phiếu Giao Hàng PDF",
    subtitle: "Prompting cho Google Docs, Drive & Xuất PDF Đa Mặt Hàng",
    level: "Dành Cho Dân Văn Phòng",
    time: "20 phút",
    tags: ["Google Docs Template", "PDF Export", "Multi-Item Invoice", "Google Drive", "No-Code Workflow"],
    desc: "Cách viết Prompt ra lệnh cho AI Agent tự động gom nhóm các đơn hàng 'Chờ xuất' có nhiều sản phẩm, tự động chèn bảng danh mục hàng hóa vào mẫu Docs và xuất file PDF lưu vào Google Drive.",
    csvFile: "bai_tap_2_xuat_hoa_don_pdf.csv",
    scriptFile: "BaiTap2_XuatHoaDonPDF_Drive.gs",
    scriptContent: `/**
 * BÀI TẬP 2: TỰ ĐỘNG XUẤT HÓA ĐƠN PDF ĐA SẢN PHẨM TỪ GOOGLE DOCS MẪU
 */
const CONFIG_BT2 = {
  SHEET_NAME: "DonHang_BT2",
  TEMPLATE_DOC_ID: "DIEN_DOCS_ID_VAO_DAY",
  DESTINATION_FOLDER_ID: "DIEN_FOLDER_ID_VAO_DAY"
};

function xuatHangLoatPhieuGiaoHangPDF() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG_BT2.SHEET_NAME);
  if (!sheet) return;

  const lastRow = sheet.getLastRow();
  if (lastRow < 4) return;

  const rows = sheet.getRange(4, 1, lastRow - 3, 12).getValues();
  
  // 1. Gom nhóm sản phẩm theo từng Mã Đơn
  const ordersMap = {};
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const maDon = String(row[0]).trim();
    if (!maDon) continue;

    if (!ordersMap[maDon]) {
      ordersMap[maDon] = {
        maDon: maDon,
        ngayDat: row[1] ? Utilities.formatDate(new Date(row[1]), "GMT+7", "dd/MM/yyyy") : "",
        tenKH: row[2],
        sdt: row[3],
        diaChi: row[4],
        trangThai: String(row[10]).trim(),
        items: [],
        sheetRows: []
      };
    }
    ordersMap[maDon].sheetRows.push(i + 4);
    ordersMap[maDon].items.push({
      tenSP: row[5],
      dvt: row[6],
      soLuong: Number(row[7]) || 1,
      donGia: Number(row[8]) || 0,
      thanhTien: Number(row[9]) || (Number(row[7]) * Number(row[8]))
    });
  }

  const templateDoc = DriveApp.getFileById(CONFIG_BT2.TEMPLATE_DOC_ID);
  const targetFolder = DriveApp.getFolderById(CONFIG_BT2.DESTINATION_FOLDER_ID);
  const ngayXuat = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy");

  for (const maDon in ordersMap) {
    const order = ordersMap[maDon];
    if (order.trangThai === "Chờ xuất") {
      let tongTien = 0;
      order.items.forEach(item => tongTien += item.thanhTien);

      const tempDocFile = templateDoc.makeCopy("Temp_" + order.maDon, targetFolder);
      const tempDoc = DocumentApp.openById(tempDocFile.getId());
      const body = tempDoc.getBody();

      body.replaceText("{{MA_DON}}", String(order.maDon));
      body.replaceText("{{NGAY_DAT}}", String(order.ngayDat));
      body.replaceText("{{NGAY_XUAT}}", ngayXuat);
      body.replaceText("{{TEN_KH}}", String(order.tenKH));
      body.replaceText("{{SDT}}", String(order.sdt));
      body.replaceText("{{DIA_CHI}}", String(order.diaChi));
      body.replaceText("{{TONG_TIEN}}", Number(tongTien).toLocaleString('vi-VN'));

      const tables = body.getTables();
      if (tables.length > 0) {
        const itemTable = tables[0];
        order.items.forEach((item, idx) => {
          const row = itemTable.appendTableRow();
          row.appendTableCell(String(idx + 1)).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
          row.appendTableCell(String(item.tenSP));
          row.appendTableCell(String(item.dvt)).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
          row.appendTableCell(String(item.soLuong)).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
          row.appendTableCell(Number(item.donGia).toLocaleString('vi-VN')).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
          row.appendTableCell(Number(item.thanhTien).toLocaleString('vi-VN')).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
        });
      }

      tempDoc.saveAndClose();

      const pdfBlob = tempDocFile.getAs(MimeType.PDF).setName("PhieuGiaoHang_" + order.maDon + ".pdf");
      const pdfFile = targetFolder.createFile(pdfBlob);
      pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      tempDocFile.setTrashed(true);

      const pdfUrl = pdfFile.getUrl();
      order.sheetRows.forEach(rowIdx => {
        sheet.getRange(rowIdx, 11).setValue("Đã xuất");
        sheet.getRange(rowIdx, 12).setValue(pdfUrl);
      });
    }
  }
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🚀 TỰ ĐỘNG HÓA")
    .addItem("📄 Xuất Phiếu Giao Hàng PDF", "xuatHangLoatPhieuGiaoHangPDF")
    .addToUi();
}`,
    
    workflow: [
      { icon: "ph-file-doc", title: "1. Mẫu Docs & Bảng", desc: "Tạo file mẫu chứa tag {{...}} và bảng sản phẩm" },
      { icon: "ph-chat-circle-text", title: "2. Ra Lệnh Cho AI", desc: "Mô tả quy trình gom nhóm đa sản phẩm & điền bảng" },
      { icon: "ph-file-pdf", title: "3. Tự Xuất PDF", desc: "AI chuyển đổi Docs sang PDF" },
      { icon: "ph-google-drive-logo", title: "4. Lưu Drive & Cập Nhật", desc: "Lưu vào thư mục & ghi link vào Sheet" }
    ],

    masterPrompt: `Bạn là một Chuyên viên Tự động hóa Quy trình Văn phòng (Office Automation Specialist).

Tôi có:
1. Một Google Sheet tên "DonHang_BT2" chứa danh sách đơn hàng từ dòng 4 gồm 12 cột:
   - Cột A: Mã Đơn (vd: DH-2026-001 - một mã đơn có thể xuất hiện trên nhiều dòng do có nhiều sản phẩm)
   - Cột B: Ngày Đặt (dd/MM/yyyy)
   - Cột C: Tên Khách Hàng
   - Cột D: Số Điện Thoại
   - Cột E: Địa Chỉ Giao Hàng
   - Cột F: Tên Sản Phẩm
   - Cột G: ĐVT (Đơn vị tính: Chiếc, Bộ, Cái...)
   - Cột H: Số Lượng
   - Cột I: Đơn Giá (VNĐ)
   - Cột J: Thành Tiền (VNĐ)
   - Cột K: Trạng Thái ("Chờ xuất" hoặc "Đã xuất")
   - Cột L: Link File PDF
2. Một file mẫu Google Docs có chứa các biến thông tin chung: {{MA_DON}}, {{NGAY_DAT}}, {{NGAY_XUAT}}, {{TEN_KH}}, {{SDT}}, {{DIA_CHI}}, {{TONG_TIEN}} và một Bảng mẫu có sẵn dòng tiêu đề để điền danh mục sản phẩm.
3. Một thư mục Google Drive để lưu các file PDF xuất ra.

HÃY XÂY DỰNG QUY TRÌNH TỰ ĐỘNG HOÀN TOÀN:
- Duyệt qua Sheet và gom nhóm (group by) các dòng có cùng "Mã Đơn" mà có Trạng Thái là "Chờ xuất".
- Với mỗi đơn hàng:
  1. Tạo 1 bản sao từ file Docs mẫu và thay thế các biến {{...}} bằng thông tin khách hàng.
  2. Tự động chèn các dòng sản phẩm của đơn hàng đó vào Bảng (gồm: STT, Tên Sản Phẩm, ĐVT, Số Lượng, Đơn Giá và Thành Tiền có định dạng VNĐ).
  3. Tính Tổng tiền đơn hàng và điền vào thẻ {{TONG_TIEN}}.
  4. Xuất file đó thành định dạng PDF với tên "PhieuGiaoHang_[MãĐơn].pdf" và lưu vào thư mục Drive chỉ định.
  5. Cập nhật lại Google Sheet: Đổi Trạng Thái thành "Đã xuất" và ghi đường dẫn link file PDF vào cột L cho tất cả các dòng thuộc đơn đó.
- Tạo một menu tùy chỉnh tiện lợi trên Google Sheet để nhân viên có thể bấm "Xuất Phiếu Giao Hàng PDF" với 1 click.`,

    businessScenario: {
      story: "Bạn là Nhân viên Quản lý Kho vận hoặc Kế toán Bán hàng tại công ty phân phối thiết bị công nghệ. Mỗi ngày công ty phát sinh từ 50 đến 100 đơn hàng. Trong thực tế, một đơn hàng thường bao gồm nhiều sản phẩm khác nhau (ví dụ: 1 máy Laptop + 1 Chuột + 1 Balo chống sốc).",
      pain: "Nhân viên phải mở từng dòng trên Sheet, dò tìm các sản phẩm cùng mã đơn, kẻ bảng trong Word, copy họ tên, sản phẩm, tính tổng tiền rồi dán thủ công, bấm Save As PDF rồi upload vào Drive. Mất 2-3 tiếng mỗi ngày và rất dễ gõ nhầm số tiền hoặc bỏ sót sản phẩm.",
      solution: "Ra lệnh cho AI Agent tạo sẵn nút bấm '🚀 Xuất Phiếu Giao Hàng PDF' trên Google Sheets. Bấm 1 click là hệ thống tự gom nhóm sản phẩm theo mã đơn, tự chèn bảng hàng hóa vào mẫu Docs, xuất thành PDF lưu thẳng vào Drive và cập nhật link vào bảng tính trong 30 giây."
    },

    promptBreakdown: [
      { tag: "1. VẬT LIỆU ĐẦU VÀO", title: "Cấu trúc đa sản phẩm", desc: "Nêu rõ cấu trúc 12 cột: Mã đơn lặp lại nhiều dòng cho các mặt hàng khác nhau trong cùng đơn." },
      { tag: "2. GOM NHÓM DỮ LIỆU", title: "Group By theo Mã Đơn", desc: "Yêu cầu AI gom nhóm các dòng cùng Mã Đơn để xuất ra duy nhất 1 hóa đơn PDF hoàn chỉnh." },
      { tag: "3. CHÈN BẢNG ĐỘNG", title: "Dynamic Table trong Docs", desc: "Chỉ rõ việc chèn động từng dòng mặt hàng vào bảng biểu trong Google Docs." },
      { tag: "4. TÍNH TỔNG & ĐỊNH DẠNG", title: "Tính Tổng Tiền & VNĐ", desc: "Tự động tính tổng tiền các món và định dạng phân cách hàng nghìn chuẩn VNĐ." },
      { tag: "5. CẬP NHẬT ĐỒNG BỘ", title: "Đổi trạng thái toàn bộ dòng", desc: "Ghi nhận link PDF và chuyển trạng thái 'Đã xuất' cho toàn bộ các dòng thuộc đơn." }
    ],

    businessRequirements: `
      <p><b>Bài toán thực tế:</b> Đơn hàng thực tế luôn có <b>nhiều sản phẩm</b>. Thay vì sao chép từng sản phẩm vào bảng Word/Docs bằng tay, AI Agent tự động gom nhóm theo Mã Đơn, vẽ bảng chi tiết sản phẩm và xuất 1 file PDF trọn vẹn.</p>
    `,

    tableHeaders: ["Mã Đơn", "Ngày Đặt", "Tên Khách Hàng", "Số Điện Thoại", "Địa Chỉ", "Sản Phẩm", "ĐVT", "SL", "Đơn Giá", "Thành Tiền", "Trạng Thái", "Link PDF"],
    tableRows: [
      ["DH-2026-001", "10/08/2026", "Nguyễn Văn An", "0988123456", "12 Hoàng Hoa Thám, HN", "Laptop Dell XPS 15", "Chiếc", 1, "32,000,000", "32,000,000", "<span style='color: #f59e0b; font-weight: bold;'>Chờ xuất</span>", "—"],
      ["", "", "", "", "", "Chuột không dây Logitech MX", "Chiếc", 1, "2,100,000", "2,100,000", "", ""],
      ["", "", "", "", "", "Balo chống sốc Targus 15.6\"", "Chiếc", 1, "850,000", "850,000", "", ""],
      ["DH-2026-002", "10/08/2026", "Trần Thị Bích", "0903987654", "45 Lê Duẩn, TP.HCM", "Màn hình Dell UltraSharp 27\"", "Chiếc", 2, "8,500,000", "17,000,000", "<span style='color: #f59e0b; font-weight: bold;'>Chờ xuất</span>", "—"],
      ["", "", "", "", "", "Giá treo màn hình Human Motion", "Bộ", 2, "890,000", "1,780,000", "", ""],
      ["", "", "", "", "", "Cáp HDMI 2.1 8K Baseus", "Sợi", 2, "250,000", "500,000", "", ""]
    ],

    steps: [
      {
        badge: "01",
        title: "Kiểm Tra Kết Nối Dữ Liệu Với AI",
        desc: "Đảm bảo file Google Sheets của bạn đã được bật chế độ chia sẻ (Share) là <b>'Bất kỳ ai có đường liên kết đều có thể xem'</b>. Gửi link Google Sheet cho AI (SPARK / Gemini) và kiểm tra xem AI có thể đọc được đầy đủ dữ liệu hay không.",
        promptBox: `https://docs.google.com/spreadsheets/d/19jPP-MwIMPjeDfViicF1jTQBxx-0ITP8HAwR6IqArPI/edit?gid=1426817910#gid=1426817910

bạn có thể đọc được nội dung của link này chứ`
      },
      {
        badge: "02",
        title: "Yêu Cầu AI Phân Tích Cấu Trúc Bảng Dữ Liệu",
        desc: "Ra lệnh cho AI phân tích các cột và tọa độ dữ liệu trong sheet <code>DonHang_BT2</code> (Mã đơn, Ngày đặt, Khách hàng, Sản phẩm, v.v.) và cơ chế gom nhóm sản phẩm.",
        promptBox: `hãy phân tích nội dung trong DonHang_BT2 bao gồm những giá trị nào, hàng nào cột nào trong trang`
      },
      {
        badge: "03",
        title: "Tạo Biểu Mẫu Google Docs Template Bằng AI",
        desc: "Sử dụng Siêu Prompt thiết kế để yêu cầu AI tự động tạo một tệp Google Docs mẫu mang tên <code>PHIẾU XUẤT KHO KIÊM GIAO HÀNG - Template</code> có sẵn các thẻ placeholder <code>{{...}}</code> và bảng sản phẩm để Apps Script nhận diện và điền tự động.",
        promptBox: `Hãy tạo một Google Docs template theo đúng cấu trúc của mẫu phiếu xuất kho trong hình tham chiếu.

Mục tiêu: tạo một biểu mẫu "PHIẾU XUẤT KHO KIÊM GIAO HÀNG" có bố cục gọn, chuyên nghiệp, dễ in trên 1 trang A4.

Yêu cầu bố cục:

1. PHẦN ĐẦU TRANG
- Căn giữa.
- Dòng 1: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", in đậm.
- Dòng 2: "Độc lập - Tự do - Hạnh phúc", in đậm.
- Bên dưới có một đường gạch ngang ngắn, căn giữa.
- Cách một khoảng nhỏ rồi đến tiêu đề:
  "PHIẾU XUẤT KHO KIÊM GIAO HÀNG"
- Tiêu đề lớn, in đậm, căn giữa.

2. THÔNG TIN KHÁCH HÀNG:
- Tiêu đề "THÔNG TIN KHÁCH HÀNG:" in đậm.
- Bên dưới gồm 5 dòng:
  • Mã đơn hàng: {{Mã Đơn}}
  • Ngày đặt: {{Ngày Đặt}}
  • Tên khách hàng: {{Tên Khách Hàng}}
  • Số điện thoại: {{Số Điện Thoại}}
  • Địa chỉ giao hàng: {{Địa Chỉ Giao Hàng}}

- Các placeholder {{...}} phải được giữ nguyên để sau này Google Apps Script có thể thay thế tự động.

3. BẢNG CHI TIẾT SẢN PHẨM (Tạo một bảng 6 cột):
STT | Tên Sản Phẩm | ĐVT | Số Lượng | Đơn Giá (VNĐ) | Thành Tiền (VNĐ)
Ngay bên dưới là một dòng mẫu:
{{STT}} | {{Tên Sản Phẩm}} | {{ĐVT}} | {{Số Lượng}} | {{Đơn Giá}} | {{Thành Tiền}}

Yêu cầu bảng:
- Có đường viền mảnh.
- Hàng tiêu đề có nền xám rất nhạt, in đậm.
- STT, ĐVT, Số Lượng căn giữa.
- Tên sản phẩm căn trái.
- Đơn giá và Thành tiền căn phải.
- Chiều rộng các cột cân đối để vừa trang A4.

4. PHẦN THANH TOÁN
- Dòng: "TỔNG CỘNG THANH TOÁN: {{Tổng Tiền}} VNĐ" (căn phải, in đậm)
- Dòng: "Số tiền bằng chữ: ........................................................................................................" (căn trái, chữ nghiêng nhẹ)

5. PHẦN CHỮ KÝ
Ở cuối trang tạo khu vực chữ ký gồm 2 cột bằng nhau (không hiển thị đường viền):
NGƯỜI NHẬN HÀNG                    NGƯỜI LẬP PHIẾU
(Ký, ghi rõ họ tên)                    (Ký, ghi rõ họ tên)

6. PHONG CÁCH TOÀN BỘ TÀI LIỆU
- Khổ giấy A4 dọc, font Arial, chữ đen tối giản, nằm gọn trên 1 trang.`
      },
      {
        badge: "04",
        title: "Viết Mã Apps Script Tự Động Hóa Xuất PDF",
        desc: "Dán Siêu Prompt kỹ thuật 5 thành tố vào AI Agent để sinh mã Apps Script hoàn chỉnh: tự gom nhóm sản phẩm theo mã đơn (xử lý gộp ô), điền thông tin vào mẫu Docs, xuất PDF lưu Drive, cập nhật trạng thái 'Đã xuất' và link PDF vào Sheet.",
        promptBox: `Bạn là một Chuyên gia Lập trình Google Apps Script và Tự động hóa Google Workspace.

DỰ ÁN: TỰ ĐỘNG XUẤT PHIẾU XUẤT KHO KIÊM GIAO HÀNG PDF ĐA SẢN PHẨM TỪ GOOGLE SHEETS

Tôi đã có:
1. Google Sheet: Trang tính tên "DonHang_BT2" chứa dữ liệu từ dòng 4 gồm 12 cột: Mã Đơn (gộp ô), Ngày Đặt, Tên Khách Hàng, Số Điện Thoại, Địa Chỉ, Sản Phẩm, ĐVT, Số Lượng, Đơn Giá, Thành Tiền, Trạng Thái, Link File PDF.
2. Google Docs Template: File mẫu tên "PHIẾU XUẤT KHO KIÊM GIAO HÀNG - Template" chứa các biến thông tin chung và bảng sản phẩm.

HÃY VIẾT MÃ GOOGLE APPS SCRIPT HOÀN CHỈNH THỰC HIỆN CÁC YÊU CẦU SAU:
1. THUẬT TOÁN GOM NHÓM & LỌC DỮ LIỆU: Đọc dữ liệu từ dòng 4. Tự động nhận diện các dòng con thuộc cùng đơn (kế thừa mã đơn gần nhất khi ô bị trống). Chỉ xử lý đơn hàng "Chờ xuất".
2. QUY TRÌNH XUẤT TỪNG PHIẾU: Sao bản tạm template Docs; thay thế biến chung; chèn dòng sản phẩm vào bảng với STT tự tăng, định dạng tiền tệ VNĐ; điền {{Tổng Tiền}}; xuất PDF đặt tên PhieuXuatKho_[Mã Đơn]_[Tên Khách Hàng].pdf; lưu vào thư mục Drive "HoaDon_PDF"; xóa Docs tạm; cập nhật cột K thành "Đã xuất" và dán link PDF vào cột L.
3. GIAO DIỆN & TRẢI NGHIỆM: Hàm onOpen() tự động thêm Menu '🚀 Tự Động Hóa Kho' > '📄 Xuất Phiếu Giao Hàng PDF'. Hiển thị Alert thông báo số lượng đơn đã xuất thành công.`
      },
      {
        badge: "05",
        title: "Thiết Lập ID Và Chạy Quy Trình Trên Sheets",
        desc: "Tạo một thư mục Google Drive tên <code>HoaDon_PDF</code>, sao chép ID thư mục và ID file Google Docs Template vừa tạo dán vào mã nguồn Apps Script. Mở <b>Tiện ích mở rộng ➔ Apps Script</b>, dán mã code, chọn hàm <code>exportPDF</code> hoặc sử dụng Menu <b>🚀 Tự Động Hóa Kho ➔ 📄 Xuất Phiếu Giao Hàng PDF</b> để chạy thử."
      }
    ],

    triggerGuide: `
      <h3 class="section-title"><i class="ph-bold ph-cursor-click"></i> Cách Sử Dụng Nút Bấm 1-Click</h3>
      <p style="color: var(--text-secondary); line-height: 1.7;">
        Sau khi AI cài đặt xong, mỗi khi mở Google Sheet bạn sẽ thấy xuất hiện menu mới: <b>🚀 TỰ ĐỘNG HÓA ➔ 📄 Xuất Phiếu Giao Hàng PDF</b>. Hệ thống sẽ tự động lọc các đơn chưa xuất, gom toàn bộ sản phẩm cùng mã đơn và xuất thành 1 file PDF duy nhất trong Google Drive!
      </p>
    `,

    checklist: [
      "Đã tạo mẫu Google Docs với các thẻ {{...}} và Bảng sản phẩm mẫu",
      "Đã gửi Master Prompt cho AI Agent và nhận phản hồi mã Apps Script",
      "Menu 'Tự Động Hóa' xuất hiện trên thanh công cụ Google Sheet",
      "Bấm nút và kiểm tra file PDF xuất hiện trong Google Drive đầy đủ danh mục mặt hàng",
      "Toàn bộ các dòng thuộc đơn hàng được cập nhật trạng thái 'Đã xuất' và link PDF"
    ]
  },

  {
    id: "bt3",
    index: 3,
    title: "Bài 3: Prompt Gửi Phiếu Lương Hàng Loạt Cá Nhân Hóa & Bảo Mật",
    shortTitle: "Gửi Phiếu Lương Cá Nhân Hóa",
    subtitle: "Prompting cho Nghiệp Vụ Nhân Sự (HR) & Gmail",
    level: "Dành Cho Dân Văn Phòng",
    time: "15 phút",
    tags: ["HR Automation", "Gmail Security", "Email HTML Template", "Anti-Spam"],
    desc: "Cách viết Prompt ra lệnh cho AI tự động quét bảng lương nhân sự, soạn email bảng thu nhập chi tiết gửi riêng cho từng người và tự khóa chống gửi trùng.",
    csvFile: "bai_tap_3_gui_phieu_luong.csv",
    scriptFile: "BaiTap3_GuiPhieuLuong_GmailApp.gs",
    scriptContent: `/**
 * BÀI TẬP 3: GỬI PHIẾU LƯƠNG TỰ ĐỘNG QUA GMAIL
 */
const CONFIG_BT3 = {
  SHEET_NAME: "BangLuong_BT3",
  COMPANY_NAME: "CÔNG TY CỔ PHẦN CÔNG NGHỆ AUTO",
  HR_EMAIL: "hr@congty.com"
};

function guiPhieuLuongHangLoat() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG_BT3.SHEET_NAME);
  if (!sheet) return;

  const lastRow = sheet.getLastRow();
  if (lastRow < 4) return;

  const rows = sheet.getRange(4, 1, lastRow - 3, 11).getValues();
  const thangHienTai = Utilities.formatDate(new Date(), "GMT+7", "MM/yyyy");

  for (let i = 0; i < rows.length; i++) {
    const maNV = rows[i][0];
    const hoTen = rows[i][1];
    const phongBan = rows[i][2];
    const email = String(rows[i][3]).trim();
    const luongCB = Number(rows[i][4]).toLocaleString('vi-VN');
    const phuCap = Number(rows[i][5]).toLocaleString('vi-VN');
    const thuongHQ = Number(rows[i][6]).toLocaleString('vi-VN');
    const khauTru = Number(rows[i][7]).toLocaleString('vi-VN');
    const thucLinh = Number(rows[i][8]).toLocaleString('vi-VN');
    const trangThai = rows[i][9];

    if (trangThai === "Chưa gửi" && email.includes("@")) {
      const subject = \`[PHIẾU LƯƠNG THÁNG \${thangHienTai}] - Kính gửi \${hoTen}\`;
      const htmlBody = \`
        <div style="font-family: Arial; max-width: 500px; margin: auto; border: 1px solid #E2E8F0; padding: 20px; border-radius: 8px;">
          <h3 style="color: #1B365D; text-align: center; margin-top: 0;">PHIẾU LƯƠNG THÁNG \${thangHienTai}</h3>
          <p>Xin chào <b>\${hoTen}</b> (Mã NV: <i>\${maNV}</i> - \${phongBan}),</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 15px 0;">
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 6px 0;">Lương cơ bản:</td><td style="text-align: right;">\${luongCB} đ</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 6px 0;">Phụ cấp:</td><td style="text-align: right;">\${phuCap} đ</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 6px 0;">Thưởng KPI:</td><td style="text-align: right; color: #16A34A;">+ \${thuongHQ} đ</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 6px 0;">Khấu trừ:</td><td style="text-align: right; color: #DC2626;">- \${khauTru} đ</td></tr>
            <tr style="background: #EFF6FF;"><td style="padding: 10px 5px; font-weight: bold; color: #1D4ED8;">THỰC LĨNH:</td><td style="padding: 10px 5px; text-align: right; font-weight: bold; font-size: 16px; color: #1D4ED8;">\${thucLinh} đ</td></tr>
          </table>
          <p style="font-size: 12px; color: #64748B;">Mọi thắc mắc vui lòng liên hệ \${CONFIG_BT3.HR_EMAIL}.</p>
        </div>\`;

      GmailApp.sendEmail(email, subject, "", { htmlBody: htmlBody });

      const currentRow = i + 4;
      const thoiGian = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
      sheet.getRange(currentRow, 10).setValue("Đã gửi");
      sheet.getRange(currentRow, 11).setValue(thoiGian);
    }
  }
}`,
    
    workflow: [
      { icon: "ph-users", title: "1. Bảng Lương HR", desc: "Dữ liệu lương từng nhân viên" },
      { icon: "ph-chat-circle-dots", title: "2. Prompt Nghiệp Vụ", desc: "Mô tả tiêu chuẩn bảo mật & mẫu thư" },
      { icon: "ph-lock-key", title: "3. Bảo Mật Cá Nhân", desc: "Mỗi người chỉ nhận thư riêng biệt" },
      { icon: "ph-shield-check", title: "4. Chống Gửi Lặp", desc: "Ghi log thời gian & khóa gửi lại" }
    ],

    masterPrompt: `Bạn là một Trợ lý Tự động hóa Nhân sự (HR Automation Specialist).

Tôi có bảng tính Google Sheets tại sheet "BangLuong_BT3" với các cột từ dòng 4:
- Cột A: Mã NV (vd: NV001)
- Cột B: Họ và Tên
- Cột C: Phòng Ban
- Cột D: Email Nhận
- Cột E: Lương Cơ Bản
- Cột F: Phụ Cấp
- Cột G: Thưởng KPI
- Cột H: Khấu Trừ
- Cột I: Thực Lĩnh
- Cột J: Trạng Thái ("Chưa gửi" hoặc "Đã gửi")
- Cột K: Thời Gian Gửi

HÃY XÂY DỰNG QUY TRÌNH TỰ ĐỘNG GỬI PHIẾU LƯƠNG BẢO MẬT:
1. Chỉ gửi cho các nhân viên có Trạng Thái là "Chưa gửi" và có địa chỉ email hợp lệ.
2. Thiết kế mẫu email định dạng HTML tuyệt đẹp, trang nhã (tông màu xanh navy #1B365D), hiển thị rõ ràng từng khoản lương: Lương CB, Phụ cấp, Thưởng (+), Khấu trừ (-) và ô THỰC LĨNH to, nổi bật màu xanh dương đậm (định dạng tiền tệ VNĐ có dấu phân cách hàng nghìn).
3. Tiêu đề email: "[PHIẾU LƯƠNG THÁNG MM/YYYY] - Kính gửi [Họ và Tên Nhân Viên]".
4. Sau khi gửi thành công cho ai: Lập tức đổi Trạng Thái thành "Đã gửi" và ghi ngày giờ gửi chi tiết (dd/MM/yyyy HH:mm:ss) vào Cột K.
5. Thêm cơ chế bảo vệ: Khi người dùng bấm chạy lại lần 2, hệ thống tự động bỏ qua những người đã gửi, tuyệt đối không gửi trùng lặp.`,

    businessScenario: {
      story: "Bạn là Chuyên viên Nhân sự (C&B / HR) phụ trách gửi phiếu lương hàng tháng cho 50 nhân viên. Thu nhập cá nhân là thông tin nhạy cảm bắt buộc phải bảo mật 100% giữa các nhân sự.",
      pain: "Gửi thủ công từng email riêng rất dễ gửi nhầm bảng lương của người này cho người khác (vi phạm bảo mật lương nghiêm trọng). Nếu gửi giữa chừng bị mạng chập chờn thì không nhớ ai đã gửi ai chưa, dẫn đến gửi trùng lặp gây phiền toái.",
      solution: "AI Agent tự động quét bảng lương: tự tách riêng thu nhập từng người, soạn email HTML chuyên nghiệp (định dạng VNĐ), gửi riêng biệt, ghi nhận thời gian gửi và tự động khóa chống gửi trùng."
    },

    promptBreakdown: [
      { tag: "1. BẢO MẬT TUYỆT ĐỐI", title: "Nguyên tắc 1-1", desc: "Yêu cầu rõ ràng mỗi nhân viên chỉ nhận được đúng dòng thu nhập của mình." },
      { tag: "2. TIÊU CHUẨN TIỀN TỆ", title: "Format số VNĐ", desc: "Yêu cầu số tiền phải có dấu phẩy/chấm phân cách hàng nghìn và đơn vị VNĐ dễ đọc." },
      { tag: "3. CƠ CHẾ CHỐNG LẶP", title: "Anti-Duplication Guard", desc: "Dựa vào cột 'Trạng Thái' và 'Thời Gian Gửi' để đảm bảo không bị spam email nhân viên." },
      { tag: "4. TEMPLATE THƯƠNG HIỆU", title: "Email HTML Trang Nhã", desc: "Giao diện bảng thu nhập chuyên nghiệp, tạo niềm tin cho người lao động." }
    ],

    businessRequirements: `
      <p><b>Bài toán thực tế:</b> Gửi phiếu lương thủ công cho 50 nhân viên mất nửa ngày và rất dễ gửi nhầm file của người này cho người khác (vi phạm bảo mật lương nghiêm trọng). Bằng 1 câu Prompt chuẩn, AI sẽ tự động hóa khép kín và an toàn 100%.</p>
    `,

    tableHeaders: ["Mã NV", "Họ và Tên", "Phòng Ban", "Email Nhận", "Lương CB", "Phụ Cấp", "Thưởng KPI", "Khấu Trừ", "Thực Lĩnh", "Trạng Thái", "Thời Gian Gửi"],
    tableRows: [
      ["NV001", "Hoàng Văn Dũng", "Kinh Doanh", "dung.demo@gmail.com", "15,000,000", "2,000,000", "3,500,000", "500,000", "<b style='color: #10b981;'>20,000,000 đ</b>", "Chưa gửi", "—"],
      ["NV002", "Lê Thị Mai", "Kế Toán", "mai.demo@gmail.com", "16,000,000", "1,500,000", "2,000,000", "0", "<b style='color: #10b981;'>19,500,000 đ</b>", "Chưa gửi", "—"]
    ],

    steps: [
      {
        badge: "01",
        title: "Chuẩn Bị Bảng Lương Trên Google Sheets",
        desc: "Đổi tên sheet thành <code>BangLuong_BT3</code>, nhập dữ liệu và chỉnh sửa email nhận thành email phụ của bạn để kiểm thử."
      },
      {
        badge: "02",
        title: "Gửi Master Prompt Cho Gemini",
        desc: "Dán câu Master Prompt từ Tab 1 vào Gemini in Google Sheets hoặc AI Agent.",
        promptBox: "Dán Master Prompt Bài 3 từ Tab 1 vào Gemini"
      },
      {
        badge: "03",
        title: "Prompt Tinh Chỉnh: Thêm Lời Nhắn Từ Ban Giám Đốc",
        desc: "Nếu muốn thêm thông điệp chúc mừng hoặc lưu ý phản hồi trong vòng 48h:",
        promptBox: "Hãy thêm vào cuối email một khung ghi chú màu vàng nhạt: 'Mọi thắc mắc về bảng lương vui lòng phản hồi qua email hr@congty.com trong vòng 48 giờ làm việc.'"
      }
    ],

    triggerGuide: `
      <h3 class="section-title"><i class="ph-bold ph-envelope-simple"></i> Kiểm Tra Giới Hạn Gửi Gmail</h3>
      <p style="color: var(--text-secondary); line-height: 1.7;">
        Tài khoản Gmail cá nhân cho phép gửi tối đa 100 email/ngày. Tài khoản Google Workspace Doanh nghiệp cho phép gửi tới 1.500 email/ngày.
      </p>
    `,

    checklist: [
      "Đã gửi Master Prompt Bài 3 cho AI Agent",
      "Chạy thử nghiệm và nhận được email bảng lương HTML chuẩn đẹp",
      "Số tiền trong email được định dạng có dấu phân cách hàng nghìn",
      "Cột Trạng Thái tự động chuyển thành 'Đã gửi'",
      "Chạy lại lần 2 và kiểm tra hệ thống tự động bỏ qua không gửi trùng"
    ]
  },

  {
    id: "bt4",
    index: 4,
    title: "Bài 4: Prompt Phê Duyệt Đơn Nghỉ Phép Tự Động Kết Hợp Form & Telegram Bot",
    shortTitle: "Phê Duyệt Đơn & Bot Telegram",
    subtitle: "Prompting cho Google Form, Event Trigger & Telegram API",
    level: "Dành Cho Dân Văn Phòng",
    time: "20 phút",
    tags: ["Google Forms", "Event Trigger", "Telegram Bot API", "Instant Alert"],
    desc: "Cách viết Prompt ra lệnh cho AI tự động kích hoạt mỗi khi có nhân viên nộp Form xin nghỉ: sinh mã đơn NP-2026-XXXX và bắn thông báo tức thì vào nhóm Telegram quản lý.",
    csvFile: "bai_tap_4_don_nghi_phep_form.csv",
    scriptFile: "BaiTap4_DuyetDonNghiPhep_TelegramBot.gs",
    scriptContent: `/**
 * BÀI TẬP 4: TỰ ĐỘNG XỬ LÝ ĐƠN NGHỈ PHÉP & THÔNG BÁO TELEGRAM
 */
const CONFIG_BT4 = {
  SHEET_NAME: "DonNghiPhep_BT4",
  TELEGRAM_BOT_TOKEN: "DIEN_BOT_TOKEN_VAO_DAY",
  TELEGRAM_CHAT_ID: "DIEN_CHAT_ID_VAO_DAY"
};

function xuLyDonNghiPhepTuDong(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG_BT4.SHEET_NAME) || ss.getActiveSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 4) return;

  const rowData = sheet.getRange(lastRow, 1, 1, 8).getValues()[0];
  const hoTenNV = rowData[2];
  const phongBan = rowData[3];
  const soNgay = rowData[4];
  const lyDo = rowData[7];

  const stt = lastRow - 3;
  const maDon = "NP-" + new Date().getFullYear() + "-" + Utilities.formatString("%04d", stt);
  sheet.getRange(lastRow, 9).setValue(maDon);
  sheet.getRange(lastRow, 10).setValue("Chờ Quản Lý Duyệt");

  const msg = 
    "🚨 *CÓ ĐƠN XIN NGHỈ PHÉP MỚI*\\n" +
    "------------------------------------\\n" +
    "📋 *Mã đơn:* \`" + maDon + "\`\\n" +
    "👤 *Nhân viên:* *" + hoTenNV + "*\\n" +
    "🏢 *Phòng ban:* " + phongBan + "\\n" +
    "⏳ *Số ngày:* " + soNgay + " ngày\\n" +
    "📝 *Lý do:* _" + lyDo + "_\\n" +
    "👉 _Vui lòng vào Google Sheet để duyệt đơn!_";

  guiTelegram(msg);
}

function guiTelegram(noiDung) {
  if (CONFIG_BT4.TELEGRAM_BOT_TOKEN.includes("DIEN_")) return;
  const url = "https://api.telegram.org/bot" + CONFIG_BT4.TELEGRAM_BOT_TOKEN + "/sendMessage";
  const payload = { chat_id: CONFIG_BT4.TELEGRAM_CHAT_ID, text: noiDung, parse_mode: "Markdown" };
  UrlFetchApp.fetch(url, { method: "post", contentType: "application/json", payload: JSON.stringify(payload), muteHttpExceptions: true });
}`,
    
    workflow: [
      { icon: "ph-article", title: "1. Google Form", desc: "Nhân viên điền đơn xin nghỉ" },
      { icon: "ph-sparkle", title: "2. AI Kích Hoạt Tức Thì", desc: "Bắt sự kiện onFormSubmit" },
      { icon: "ph-identification-badge", title: "3. Tự Sinh Mã Đơn", desc: "Tạo mã chuẩn NP-2026-XXXX" },
      { icon: "ph-telegram-logo", title: "4. Bắn Bot Telegram", desc: "Thông báo ngay về nhóm duyệt của sếp" }
    ],

    masterPrompt: `Bạn là một Kiến trúc sư Tự động hóa Doanh nghiệp (Enterprise Automation Architect).

Tôi đang có một Google Form liên kết với Google Sheets "DonNghiPhep_BT4" để nhân viên nộp đơn xin nghỉ phép. Các cột dữ liệu gồm:
- Cột 1: Dấu thời gian
- Cột 2: Email Nhân Viên
- Cột 3: Họ Tên Nhân Viên
- Cột 4: Phòng Ban
- Cột 5: Số Ngày Nghỉ
- Cột 6: Từ Ngày
- Cột 7: Đến Ngày
- Cột 8: Lý Do Nghỉ
- Cột 9: Mã Đơn (Đang trống)
- Cột 10: Trạng Thái ("Chờ Quản Lý Duyệt")

HÃY THIẾT LẬP QUY TRÌNH TỰ ĐỘNG HÓA TỨC THÌ (REAL-TIME WORKFLOW):
1. Thiết lập sự kiện tự động kích hoạt ngay khi có người gửi Form mới (onFormSubmit).
2. Tự động sinh Mã Đơn Nghỉ Phép chuẩn hóa dạng "NP-[NămHiệnTại]-[STT 4 chữ số]" (Ví dụ: NP-2026-0001) và ghi vào Cột 9, đồng thời set Cột 10 là "Chờ Quản Lý Duyệt".
3. Gửi tin nhắn thông báo tức thì vào nhóm Telegram của Ban Quản Lý (thông qua Telegram Bot API) với định dạng Markdown chuyên nghiệp hiển thị đầy đủ: Mã đơn, Tên nhân viên, Phòng ban, Số ngày nghỉ, Lý do và Lời nhắc duyệt đơn.
4. Tự động gửi một email xác nhận đến hòm thư của nhân viên thông báo đơn đã được chuyển tới cấp quản lý.`,

    businessScenario: {
      story: "Nhân viên công ty thường xuyên nộp đơn xin nghỉ phép đột xuất qua Google Form. Ban Giám Đốc và các Trưởng phòng thường xuyên đi công tác ngoài văn phòng, không ngồi trực Google Sheet cả ngày.",
      pain: "Nhân viên nộp đơn từ sáng nhưng đến chiều muộn sếp mới mở máy tính kiểm tra Sheet nên không duyệt kịp thời gian. Nhân viên cũng sốt ruột không biết đơn đã được chuyển tới cấp trên hay chưa.",
      solution: "Ngay khi nhân viên bấm Nộp Form, AI tự sinh mã đơn NP-2026-XXXX, bắn tin nhắn thông báo ting ting vào nhóm Telegram trên điện thoại của sếp kèm lý do và số ngày nghỉ, đồng thời gửi email xác nhận cho nhân viên chỉ sau 1 giây."
    },

    promptBreakdown: [
      { tag: "1. KÍCH HOẠT TỨC THÌ", title: "Sự kiện onFormSubmit", desc: "Yêu cầu AI lắng nghe hành động nộp form thay vì phải chờ quét theo giờ." },
      { tag: "2. SINH MÃ TỰ ĐỘNG", title: "Quy tắc sinh mã định danh", desc: "Định dạng rõ cấu trúc NP-YYYY-XXXX để quản lý dễ tra cứu." },
      { tag: "3. THÔNG BÁO ĐA KÊNH", title: "Kết nối Telegram Webhook", desc: "Bắn thông báo tức thì vào app chat mà sếp thường xuyên mở xem trên điện thoại." },
      { tag: "4. PHẢN HỒI NHÂN VIÊN", title: "Email xác nhận tiếp nhận", desc: "Tự động phản hồi giúp người nộp an tâm đơn đã vào hệ thống." }
    ],

    businessRequirements: `
      <p><b>Bài toán thực tế:</b> Nhân viên nộp đơn nhưng sếp không hay mở Google Sheet kiểm tra, dẫn đến việc duyệt phép bị trễ. Nhờ AI kết nối Telegram Bot, sếp nhận ngay thông báo ting ting trên điện thoại chỉ sau 1 giây.</p>
    `,

    tableHeaders: ["Dấu Thời Gian", "Email", "Họ Tên", "Phòng Ban", "Số Ngày", "Từ Ngày", "Đến Ngày", "Lý Do", "Mã Đơn", "Trạng Thái"],
    tableRows: [
      ["10/08/2026 08:30", "dung.demo@gmail.com", "Hoàng Văn Dũng", "Kinh Doanh", 2, "12/08/2026", "13/08/2026", "Việc gia đình", "<span style='color: #38bdf8; font-weight: bold;'>NP-2026-0001</span>", "Chờ Duyệt"],
      ["10/08/2026 09:15", "mai.demo@gmail.com", "Lê Thị Mai", "Kế Toán", 1, "15/08/2026", "15/08/2026", "Khám sức khỏe", "<span style='color: #38bdf8; font-weight: bold;'>NP-2026-0002</span>", "Đã Duyệt"]
    ],

    steps: [
      {
        badge: "01",
        title: "Tạo Bot Telegram Nhanh",
        desc: "Mở Telegram chat với <code>@BotFather</code>, gửi <code>/newbot</code> để tạo bot và nhận chuỗi <code>BOT_TOKEN</code>. Mời bot vào nhóm quản lý để nhận tin nhắn."
      },
      {
        badge: "02",
        title: "Gửi Master Prompt Cho AI",
        desc: "Dán câu Master Prompt từ Tab 1 vào Gemini/AI Agent. Cung cấp Token Bot khi AI hỏi.",
        promptBox: "Dán Master Prompt Bài 4 từ Tab 1 vào Gemini"
      },
      {
        badge: "03",
        title: "Prompt Tinh Chỉnh: Thêm Nút Bấm Duyệt Nhanh",
        desc: "Muốn thêm đường link mở trực tiếp file Sheet vào tin nhắn Telegram:",
        promptBox: "Hãy thêm vào cuối tin nhắn Telegram một đường link: '🔗 Nhấp vào đây để mở Google Sheet và bấm Duyệt ngay'."
      }
    ],

    triggerGuide: `
      <h3 class="section-title"><i class="ph-bold ph-lightning"></i> Cài Đặt Trigger Tự Động onFormSubmit</h3>
      <p style="color: var(--text-secondary); line-height: 1.7;">
        Khi AI sinh xong giải pháp, bạn chỉ cần yêu cầu AI: <i>"Hãy gắn trigger onFormSubmit cho hàm xử lý này"</i> hoặc làm theo hướng dẫn 3 bước đơn giản trên giao diện.
      </p>
    `,

    checklist: [
      "Đã tạo Telegram Bot và lấy Token",
      "Đã dán Master Prompt cho AI Agent",
      "Đã liên kết Google Form với Sheet DonNghiPhep_BT4",
      "Thử điền 1 đơn nghỉ phép trên Form",
      "Tin nhắn thông báo xuất hiện tức thì trong nhóm Telegram"
    ]
  },

  {
    id: "bt5",
    index: 5,
    title: "Bài 5: Prompt Xử Lý & Làm Sạch 1.000 Dòng Dữ Liệu Lớn Tối Ưu Tốc Độ",
    shortTitle: "Làm Sạch Dữ Liệu Lớn (Big Data)",
    subtitle: "Prompting Tối Ưu Hiệu Năng & Chuẩn Hóa Dữ Liệu",
    level: "Dành Cho Dân Văn Phòng",
    time: "20 phút",
    tags: ["Big Data Cleaning", "In-memory RAM", "Phone & Name Normalization", "Fast Execution"],
    desc: "Cách viết Prompt ra lệnh cho AI xử lý 1.000 đến 10.000 dòng dữ liệu thô: lọc bỏ đơn trùng, sửa số điện thoại mất số 0, chuẩn hóa họ tên trong dưới 2 giây.",
    csvFile: "bai_tap_5_raw_data_1000_rows.csv",
    scriptFile: "BaiTap5_LamSachDuLieuLon_Optimization.gs",
    scriptContent: `/**
 * BÀI TẬP 5: XỬ LÝ & LÀM SẠCH 1.000 DÒNG DỮ LIỆU LỚN TỐI ƯU HIỆU NĂNG
 */
const CONFIG_BT5 = {
  RAW_SHEET_NAME: "RawData_BT5",
  CLEAN_SHEET_NAME: "DataCleaned_BT5"
};

function lamSachVaChuanHoaDuLieuLon() {
  const startTime = new Date().getTime();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rawSheet = ss.getSheetByName(CONFIG_BT5.RAW_SHEET_NAME);
  if (!rawSheet) return;

  let cleanSheet = ss.getSheetByName(CONFIG_BT5.CLEAN_SHEET_NAME);
  if (!cleanSheet) cleanSheet = ss.insertSheet(CONFIG_BT5.CLEAN_SHEET_NAME);
  else cleanSheet.clear();

  const rawData = rawSheet.getDataRange().getValues();
  if (rawData.length < 4) return;

  const headers = ["Mã Giao Dịch", "Tên Khách Hàng", "Số Điện Thoại", "Kênh Bán", "Doanh Thu", "Ngày Tạo", "Trạng Thái"];
  const rows = rawData.slice(3);

  const seenCodes = new Set();
  const cleanedRows = [];

  for (let i = 0; i < rows.length; i++) {
    const maGD = String(rows[i][0]).trim();
    let tenKH = String(rows[i][1]).trim();
    let sdt = String(rows[i][2]).trim().replace(/[\\.\\s-]/g, "");
    const kenhBan = String(rows[i][3]).trim();
    const doanhThu = Number(rows[i][4]) || 0;
    const ngayTao = rows[i][5] instanceof Date ? Utilities.formatDate(rows[i][5], "GMT+7", "dd/MM/yyyy") : rows[i][5];

    if (maGD === "" || seenCodes.has(maGD) || doanhThu <= 0) continue;
    seenCodes.add(maGD);

    tenKH = tenKH.toLowerCase().split(/\\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    if (sdt.length === 9 && !sdt.startsWith("0")) sdt = "0" + sdt;

    cleanedRows.push([maGD, tenKH, sdt, kenhBan, doanhThu, ngayTao, "Hợp Lệ"]);
  }

  if (cleanedRows.length > 0) {
    cleanSheet.getRange("A1:G1").merge().setValue("BẢNG DỮ LIỆU ĐÃ ĐƯỢC LÀM SẠCH (CLEAN DATA)").setBackground("#1B365D").setFontColor("#FFFFFF").setFontWeight("bold");
    cleanSheet.getRange(3, 1, 1, headers.length).setValues([headers]).setBackground("#005A9C").setFontColor("#FFFFFF").setFontWeight("bold");
    cleanSheet.getRange(4, 1, cleanedRows.length, headers.length).setValues(cleanedRows);
    cleanSheet.getRange(4, 5, cleanedRows.length, 1).setNumberFormat("#,##0");
    cleanSheet.autoResizeColumns(1, headers.length);
  }

  const duration = ((new Date().getTime() - startTime) / 1000).toFixed(2);
  SpreadsheetApp.getUi().alert(\`Đã hoàn tất trong \${duration} giây!\\n- Dữ liệu gốc: \${rows.length} dòng\\n- Dữ liệu sạch: \${cleanedRows.length} dòng\`);
}`,
    
    workflow: [
      { icon: "ph-database", title: "1. 1.000 Dòng Log Thô", desc: "Dữ liệu lỗi, trùng lặp, sai định dạng" },
      { icon: "ph-chat-circle-text", title: "2. Prompt Tối Ưu RAM", desc: "Yêu cầu xử lý mảng in-memory" },
      { icon: "ph-magic-wand", title: "3. AI Làm Sạch & Lọc", desc: "Tự xóa trùng & chuẩn hóa họ tên/SĐT" },
      { icon: "ph-check-circle", title: "4. Bảng Sạch Hoàn Hảo", desc: "Xuất ra sheet mới trong 2 giây" }
    ],

    masterPrompt: `Bạn là một Chuyên gia Xử lý Dữ liệu Lớn & Tối ưu Hiệu năng Google Workspace (Data Processing & Performance Optimization Expert).

Tôi có sheet "RawData_BT5" chứa hơn 1.000 dòng log đơn hàng đổ về từ các sàn Shopee, Lazada, TikTok Shop (dữ liệu từ dòng 4) với các cột:
- Cột A: Mã Giao Dịch (Có trường hợp bị trống, hoặc bị trùng lặp)
- Cột B: Tên Khách Hàng (Nhiều khoảng trắng thừa, viết hoa/thường lộn xộn)
- Cột C: Số Điện Thoại (Có dấu chấm, khoảng trắng, hoặc bị mất số '0' ở đầu do định dạng số)
- Cột D: Kênh Bán
- Cột E: Doanh Thu (Có bản ghi bị âm hoặc bằng 0 do lỗi hệ thống)
- Cột F: Ngày Tạo

HÃY XÂY DỰNG QUY TRÌNH LÀM SẠCH VÀ CHUẨN HÓA DỮ LIỆU TỐC ĐỘ CAO:
1. NGUYÊN TẮC HIỆU NĂNG: Phải đọc toàn bộ dữ liệu 1 lần duy nhất vào bộ nhớ RAM bằng getValues(), xử lý hoàn toàn trên mảng và ghi xuống sheet đúng 1 lần bằng setValues() để thời gian chạy dưới 3 giây (tránh bị timeout).
2. QUY TẮC LÀM SẠCH (DATA CLEANING):
   - Loại bỏ các dòng có Mã Giao Dịch rỗng.
   - Sử dụng Set để loại bỏ triệt để các Mã Giao Dịch bị trùng lặp (chỉ giữ lại bản ghi đầu tiên).
   - Loại bỏ các dòng có Doanh Thu <= 0.
   - Chuẩn hóa Tên Khách Hàng: Xóa khoảng trắng thừa và viết hoa chữ cái đầu từng từ (vd: "  nguyễn văn an " -> "Nguyễn Văn An").
   - Chuẩn hóa Số Điện Thoại: Xóa toàn bộ ký tự lạ (. - space) và tự động thêm số "0" vào đầu nếu SĐT chỉ có 9 chữ số.
3. ĐẦU RA: Tự động tạo sheet mới tên "DataCleaned_BT5", trang trí tiêu đề và ghi toàn bộ dữ liệu sạch sang đó, đồng thời hiển thị hộp thoại thống kê: Thời gian xử lý, Số dòng ban đầu, Số dòng hợp lệ, Số dòng đã loại bỏ.`,

    businessScenario: {
      story: "Bạn là Chuyên viên Phân tích Dữ liệu / Vận hành E-Commerce. Cuối mỗi ngày, hệ thống trả về file log hơn 1.000 đơn hàng từ Shopee, Lazada, TikTok Shop, Website hỗn độn.",
      pain: "Mã đơn bị rỗng hoặc bị trùng do khách bấm mua 2 lần, số điện thoại bị mất số '0' ở đầu hoặc dính dấu chấm/khoảng trắng, doanh thu bị âm. Dùng các hàm Excel thủ công lọc từng dòng mất cả buổi chiều và máy tính bị đơ giật.",
      solution: "Sử dụng Prompt ép AI xử lý mảng trên bộ nhớ RAM (In-Memory Array), toàn bộ 1.000 dòng dữ liệu được lọc sạch, chuẩn hóa họ tên và SĐT 10 số, xuất sang sheet mới tinh tươm chỉ trong 2 giây!"
    },

    promptBreakdown: [
      { tag: "1. ÉP BUỘC HIỆU NĂNG", title: "Kỹ thuật In-Memory Array", desc: "Nhắc rõ từ khóa getValues/setValues 1 lần duy nhất để AI không sinh mã duyệt từng ô chậm chạp." },
      { tag: "2. BỘ QUY TẮC LÀM SẠCH", title: "Chi tiết từng lỗi cụ thể", desc: "Liệt kê rõ ràng: Mã rỗng, mã trùng, doanh thu âm, SĐT thiếu số 0, tên thừa khoảng trắng." },
      { tag: "3. TÁCH BIỆT DỮ LIỆU", title: "Bảo toàn dữ liệu gốc", desc: "Yêu cầu ghi sang Sheet mới 'DataCleaned_BT5' để không làm hỏng sheet thô ban đầu." },
      { tag: "4. BÁO CÁO THỐNG KÊ", title: "Audit Log minh bạch", desc: "Yêu cầu thông báo số lượng dòng loại bỏ theo từng nguyên nhân để đối soát." }
    ],

    businessRequirements: `
      <p><b>Bài toán thực tế:</b> Nhân viên xử lý dữ liệu hàng ngày phải tốn hàng giờ dùng hàm Filter, Text to Columns, Trim, Proper thủ công rất dễ sót. Bằng Prompt tối ưu hiệu năng này, 1.000 dòng dữ liệu được làm sạch chuẩn chỉnh chỉ trong 2 giây.</p>
    `,

    tableHeaders: ["Mã Giao Dịch", "Tên Khách Hàng", "Số Điện Thoại", "Kênh Bán", "Doanh Thu", "Ngày Tạo", "Trạng Thái Lỗi"],
    tableRows: [
      ["TRX-2026-00001", "   nguyễn văn an  ", "988123456", "Shopee", "1,250,000", "01/08/2026", "<span style='color: #f59e0b;'>Thừa khoảng trắng, thiếu số 0</span>"],
      ["TRX-2026-00002", "TRẦN THỊ BÍCH", "0903.987.654", "Lazada", "850,000", "01/08/2026", "<span style='color: #f59e0b;'>SĐT có dấu chấm</span>"],
      ["", "Lê Hoàng Long", "0912345678", "TikTok Shop", "450,000", "02/08/2026", "<span style='color: #ef4444;'>Mã rỗng (Loại)</span>"],
      ["TRX-2026-00001", "Nguyễn Văn An", "0988123456", "Shopee", "1,250,000", "01/08/2026", "<span style='color: #ef4444;'>Trùng mã (Loại)</span>"]
    ],

    steps: [
      {
        badge: "01",
        title: "Import 1.000 Dòng Dữ Liệu Thô",
        desc: "Nhập file <code>bai_tap_5_raw_data_1000_rows.csv</code> vào sheet <code>RawData_BT5</code>."
      },
      {
        badge: "02",
        title: "Dán Master Prompt Cho Gemini",
        desc: "Dán câu Master Prompt từ Tab 1 vào AI. AI sẽ tự động tạo bộ xử lý trên RAM siêu nhanh.",
        promptBox: "Dán Master Prompt Bài 5 từ Tab 1 vào Gemini"
      },
      {
        badge: "03",
        title: "Prompt Tinh Chỉnh: Tự Động Phân Bổ Theo Kênh Bán",
        desc: "Nếu muốn tách dữ liệu sạch thành các sheet riêng theo từng sàn (Shopee, Lazada, TikTok):",
        promptBox: "Hãy nâng cấp quy trình: Sau khi làm sạch xong, hãy tự động tách và tạo các sheet riêng cho từng Kênh Bán (Shopee, Lazada, TikTok Shop, Website) tương ứng."
      }
    ],

    triggerGuide: `
      <h3 class="section-title"><i class="ph-bold ph-lightning"></i> Tự Động Hóa Đồng Bộ Hàng Đêm</h3>
      <p style="color: var(--text-secondary); line-height: 1.7;">
        Bạn có thể yêu cầu AI: <i>"Hãy tạo trigger tự động làm sạch và lưu trữ dữ liệu vào lúc 23:30 mỗi đêm"</i> để mỗi sáng đến văn phòng bạn luôn có sẵn bảng dữ liệu sạch tinh tươm.
      </p>
    `,

    checklist: [
      "Đã nạp 1.000 dòng dữ liệu thô vào sheet RawData_BT5",
      "Đã gửi Master Prompt cho AI Agent",
      "Chạy quy trình và quan sát sheet DataCleaned_BT5 xuất hiện",
      "Tên khách hàng đã được viết hoa chuẩn đẹp",
      "Số điện thoại được đưa về đúng 10 số có số 0 đầu",
      "Thời gian thực thi hoàn thành dưới 3 giây"
    ]
  },

  {
    id: "bt6",
    index: 6,
    title: "Bài 6: Phân Tích Nhóm Khách Hàng RFM, Vẽ Biểu Đồ & Xuất Báo Cáo Tự Động",
    shortTitle: "Phân Tích RFM & Biểu Đồ",
    subtitle: "Apps Script vẽ biểu đồ cột, tròn & xuất báo cáo",
    level: "Dành Cho Dân Văn Phòng",
    time: "20 phút",
    tags: ["RFM Segmentation", "Pie & Column Chart", "Google Docs Report", "PDF Export"],
    desc: "Quy trình ra lệnh cho AI Agent tự động tính toán các chỉ số RFM để phân nhóm khách hàng, vẽ biểu đồ tròn tỷ lệ và biểu đồ cột doanh thu đóng góp, sau đó điền dữ liệu xuất file báo cáo Word/PDF chuyên nghiệp.",
    csvFile: "bai_tap_6_rfm_analysis.csv",
    scriptFile: "BaiTap6_PhanTichKhachHang_RFM.gs",
    scriptContent: `/**
 * BÀI TẬP 6: PHÂN TÍCH PHÂN KHÚC KHÁCH HÀNG THEO MÔ HÌNH RFM, VẼ BIỂU ĐỒ & XUẤT BÁO CÁO
 */
const CONFIG_BT6 = {
  SOURCE_SHEET: "DonHang_BT6",
  REPORT_SHEET: "BaoCao_RFM_BT6",
  REPORT_DATE: new Date("2026-08-31"), // Ngày chốt báo cáo cố định
  FOLDER_PDF_NAME: "BaoCao_RFM_PDF"
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("📊 PHÂN TÍCH")
    .addItem("Chạy Phân Tích RFM Khách Hàng", "runRFMAnalysis")
    .addToUi();
}

function runRFMAnalysis() {
  const startTime = new Date().getTime();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getSheetByName(CONFIG_BT6.SOURCE_SHEET);
  
  if (!sourceSheet) {
    SpreadsheetApp.getUi().alert(\`Lỗi: Không tìm thấy sheet nguồn "\${CONFIG_BT6.SOURCE_SHEET}"!\`);
    return;
  }
  
  const lastRow = sourceSheet.getLastRow();
  if (lastRow < 4) {
    SpreadsheetApp.getUi().alert("Lỗi: Không có dữ liệu giao dịch!");
    return;
  }
  
  const rawData = sourceSheet.getRange(4, 1, lastRow - 3, 5).getValues();
  const customerMap = {};
  
  for (let i = 0; i < rawData.length; i++) {
    const maKH = String(rawData[i][1]).trim();
    const tenKH = String(rawData[i][2]).trim();
    const ngayMua = rawData[i][3];
    const doanhThu = Number(rawData[i][4]) || 0;
    
    if (maKH === "") continue;
    
    let ngayMuaDate;
    if (ngayMua instanceof Date) {
      ngayMuaDate = ngayMua;
    } else {
      const parts = String(ngayMua).split("/");
      if (parts.length === 3) {
        ngayMuaDate = new Date(parts[2], parts[1] - 1, parts[0]);
      } else {
        ngayMuaDate = new Date();
      }
    }
    
    if (!customerMap[maKH]) {
      customerMap[maKH] = {
        maKH: maKH,
        tenKH: tenKH,
        lastPurchase: ngayMuaDate,
        frequency: 0,
        monetary: 0
      };
    }
    
    customerMap[maKH].frequency += 1;
    customerMap[maKH].monetary += doanhThu;
    
    if (ngayMuaDate > customerMap[maKH].lastPurchase) {
      customerMap[maKH].lastPurchase = ngayMuaDate;
    }
  }
  
  const rfmReportRows = [];
  let vipCount = 0;
  
  for (const maKH in customerMap) {
    const cust = customerMap[maKH];
    const diffTime = CONFIG_BT6.REPORT_DATE.getTime() - cust.lastPurchase.getTime();
    let recencyDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (recencyDays < 0) recencyDays = 0;
    
    const f = cust.frequency;
    const m = cust.monetary;
    
    let rScore = 1;
    if (recencyDays <= 15) rScore = 5;
    else if (recencyDays <= 45) rScore = 4;
    else if (recencyDays <= 90) rScore = 3;
    else if (recencyDays <= 180) rScore = 2;
    
    let fScore = 1;
    if (f >= 10) fScore = 5;
    else if (f >= 5) fScore = 4;
    else if (f >= 3) fScore = 3;
    else if (f >= 2) fScore = 2;
    
    let mScore = 1;
    if (m >= 50000000) mScore = 5;
    else if (m >= 20000000) mScore = 4;
    else if (m >= 10000000) mScore = 3;
    else if (m >= 5000000) mScore = 2;
    
    const totalScore = rScore + fScore + mScore;
    
    let classification = "Khách Hàng Nguy Cơ Rời Bỏ";
    if (totalScore >= 13) {
      classification = "VIP";
      vipCount++;
    } else if (totalScore >= 10) {
      classification = "Khách Hàng Trung Thành";
    } else if (totalScore >= 7) {
      classification = "Khách Hàng Tiềm Năng";
    } else if (totalScore >= 5) {
      classification = "Khách Mới";
    }
    
    const formattedLastDate = Utilities.formatDate(cust.lastPurchase, "GMT+7", "dd/MM/yyyy");
    
    rfmReportRows.push([
      cust.maKH,
      cust.tenKH,
      formattedLastDate,
      recencyDays,
      f,
      m,
      rScore,
      fScore,
      mScore,
      totalScore,
      classification
    ]);
  }
  
  // Sắp xếp báo cáo theo mã khách hàng tăng dần
  rfmReportRows.sort(function(a, b) {
    return a[0].localeCompare(b[0]);
  });
  
  // Ghi kết quả ra sheet BaoCao_RFM_BT6
  var reportSheet = ss.getSheetByName(CONFIG_BT6.REPORT_SHEET);
  if (!reportSheet) {
    reportSheet = ss.insertSheet(CONFIG_BT6.REPORT_SHEET);
  } else {
    reportSheet.clear();
    var oldCharts = reportSheet.getCharts();
    for (var c = 0; c < oldCharts.length; c++) {
      reportSheet.removeChart(oldCharts[c]);
    }
  }
  
  // Thiết lập đường lưới hiển thị
  reportSheet.setHiddenGridlines(false);
  
  // Ghi Banner dòng 1
  reportSheet.getRange("A1:K1").merge().setValue("BÁO CÁO PHÂN TÍCH PHÂN KHÚC KHÁCH HÀNG RFM")
    .setBackground("#1B365D").setFontColor("#FFFFFF").setFontWeight("bold").setFontSize(13)
    .setHorizontalAlignment("center").setVerticalAlignment("center");
  reportSheet.setRowHeight(1, 35);
  
  // Tiêu đề bảng
  var headers = [
    "Mã Khách Hàng", "Tên Khách Hàng", "Ngày Mua Cuối", "Recency (ngày)", 
    "Frequency (lượt)", "Monetary (VNĐ)", "R-Score", "F-Score", "M-Score", 
    "Tổng Điểm", "Phân Phân Khúc"
  ];
  
  reportSheet.getRange("A3:K3").setValues([headers])
    .setBackground("#1B365D").setFontColor("#FFFFFF").setFontWeight("bold")
    .setHorizontalAlignment("center").setVerticalAlignment("center");
  reportSheet.setRowHeight(3, 24);
  
  // Ghi dữ liệu chi tiết
  if (rfmReportRows.length > 0) {
    var dataRange = reportSheet.getRange(4, 1, rfmReportRows.length, 11);
    dataRange.setValues(rfmReportRows);
    
    // Định dạng dữ liệu
    dataRange.setFontFamily("Arial").setFontSize(10);
    reportSheet.getRange(4, 3, rfmReportRows.length, 1).setNumberFormat("dd/mm/yyyy").setHorizontalAlignment("center");
    reportSheet.getRange(4, 4, rfmReportRows.length, 2).setNumberFormat("#,##0").setHorizontalAlignment("right");
    reportSheet.getRange(4, 6, rfmReportRows.length, 1).setNumberFormat("#,##0").setHorizontalAlignment("right");
    reportSheet.getRange(4, 7, rfmReportRows.length, 4).setHorizontalAlignment("center");
    reportSheet.getRange(4, 11, rfmReportRows.length, 1).setFontWeight("bold");
    
    // Kẻ viền mảnh
    dataRange.setBorder(true, true, true, true, true, true, "#D9D9D9", SpreadsheetApp.BorderStyle.SOLID);
  }
  
  // Tự động căn chỉnh cột rộng vừa chữ
  for (var col = 1; col <= 11; col++) {
    reportSheet.autoResizeColumn(col);
  }
  
  // --------------------------------------------------------------------------
  // 4. TẠO BẢNG TỔNG HỢP PHÂN KHÚC (CỘT M - O)
  // --------------------------------------------------------------------------
  var summaryHeaders = ["Phân Khúc Khách Hàng", "Số Lượng KH", "Doanh Thu Đóng Góp (VNĐ)"];
  reportSheet.getRange("M3:O3").setValues([summaryHeaders])
    .setBackground("#1B365D").setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
  
  var segments = [
    "VIP",
    "Khách Hàng Trung Thành",
    "Khách Hàng Tiềm Năng",
    "Khách Mới",
    "Khách Hàng Nguy Cơ Rời Bỏ"
  ];
  
  var endRowIndex = rfmReportRows.length + 3;
  
  const summaryFormulas = [];
  for (let s = 0; s < segments.length; s++) {
    const seg = segments[s];
    const countFormula = '=COUNTIF(K4:K' + endRowIndex + '; "' + seg + '")';
    const sumFormula = '=SUMIF(K4:K' + endRowIndex + '; "' + seg + '"; F4:F' + endRowIndex + ')';
    summaryFormulas.push([seg, countFormula, sumFormula]);
  }
  
  reportSheet.getRange("M4:O8").setFormulasLocal(summaryFormulas);
  reportSheet.getRange("N4:N8").setNumberFormat("#,##0").setHorizontalAlignment("center");
  reportSheet.getRange("O4:O8").setNumberFormat("#,##0");
  reportSheet.getRange("M3:O8").setBorder(true, true, true, true, true, true, "#D9D9D9", SpreadsheetApp.BorderStyle.SOLID);
  
  // VẼ BIỂU ĐỒ TRÒN (PIE CHART) - PHÂN PHỐI SỐ LƯỢNG
  var pieChart = reportSheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(reportSheet.getRange("M3:N8"))
    .setPosition(10, 13, 0, 0)
    .setOption("title", "TỶ LỆ PHÂN BỔ KHÁCH HÀNG THEO PHÂN KHÚC")
    .setOption("width", 400)
    .setOption("height", 280)
    .setOption("is3D", true)
    .build();
  reportSheet.insertChart(pieChart);
  
  // VẼ BIỂU ĐỒ CỘT (COLUMN CHART) - DOANH THU ĐÓNG GÓP
  var columnChart = reportSheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(reportSheet.getRange("M3:M8"))
    .addRange(reportSheet.getRange("O3:O8"))
    .setPosition(25, 13, 0, 0)
    .setOption("title", "DOANH THU ĐÓNG GÓP THEO PHÂN KHÚC KHÁCH HÀNG")
    .setOption("width", 400)
    .setOption("height", 280)
    .setOption("legend", {position: "none"})
    .setOption("colors", ["#005A9C"])
    .setOption("vAxis", {format: "#,##0"})
    .build();
  reportSheet.insertChart(columnChart);
}`,
    workflow: [
      { icon: "ph-link", title: "1. Đọc Dữ Liệu", desc: "Xác nhận AI đọc chính xác sheet DonHang_BT6" },
      { icon: "ph-table", title: "2. Phân Tích Cột", desc: "AI phân tích cấu trúc cột & công thức RFM" },
      { icon: "ph-chart-pie", title: "3. Sinh Code Biểu Đồ", desc: "Apps Script tính toán và vẽ Combo/Pie charts" },
      { icon: "ph-file-doc", title: "4. Tạo Mẫu Docs", desc: "Thiết kế biểu mẫu Word báo cáo RFM" },
      { icon: "ph-file-pdf", title: "5. Xuất Báo Cáo PDF", desc: "Apps Script điền số liệu & lưu Drive" }
    ],
    masterPrompt: `/**
 * Trình tự tự động hóa Phân tích & Báo cáo RFM Khách Hàng
 * Tích hợp tính năng xuất PDF từ Google Docs Template
 */

// 1. Tạo Custom Menu trên thanh công cụ Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('📊 PHÂN TÍCH')
    .addItem('Chạy Phân Tích RFM & Xuất PDF', 'runRFMAnalysis')
    .addToUi();
}

// 2. Hàm chính thực hiện phân tích RFM
function runRFMAnalysis() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheet = ss.getSheetByName("DonHang_BT6");
  
  if (!sourceSheet) {
    SpreadsheetApp.getUi().alert('⚠️ Không tìm thấy sheet "DonHang_BT6". Vui lòng kiểm tra lại!');
    return;
  }
  
  // Đọc dữ liệu từ dòng 4 (A4:E)
  var lastRow = sourceSheet.getLastRow();
  if (lastRow < 4) {
    SpreadsheetApp.getUi().alert('⚠️ Sheet "DonHang_BT6" không có dữ liệu từ dòng 4 trở đi.');
    return;
  }
  
  var data = sourceSheet.getRange(4, 1, lastRow - 3, 5).getValues();
  var reportDate = new Date(2026, 7, 31); // Mốc ngày chốt báo cáo 31/08/2026
  
  // Tổng hợp dữ liệu theo từng Mã Khách Hàng
  var customers = {};
  
  for (var i = 0; i < data.length; i++) {
    var orderId = data[i][0];
    var custId = data[i][1];
    var custName = data[i][2];
    var dateVal = parseDate_(data[i][3]);
    var revenueVal = parseNumber_(data[i][4]);
    
    if (!custId) continue; // Bỏ qua dòng trống
    
    if (!customers[custId]) {
      customers[custId] = {
        id: custId,
        name: custName,
        lastDate: dateVal,
        frequency: 1,
        monetary: revenueVal
      };
    } else {
      customers[custId].frequency += 1;
      customers[custId].monetary += revenueVal;
      if (dateVal && (!customers[custId].lastDate || dateVal > customers[custId].lastDate)) {
        customers[custId].lastDate = dateVal;
        if (custName) customers[custId].name = custName;
      }
    }
  }
  
  // Tính chỉ số R, F, M, chấm điểm và phân hạng
  var outputRows = [];
  for (var id in customers) {
    var c = customers[id];
    
    var recency = 0;
    if (c.lastDate) {
      var diffTime = reportDate.getTime() - c.lastDate.getTime();
      recency = Math.max(0, Math.round(diffTime / (1000 * 3600 * 24)));
    }
    
    var rScore = 1;
    if (recency <= 15) rScore = 5;
    else if (recency <= 45) rScore = 4;
    else if (recency <= 90) rScore = 3;
    else if (recency <= 180) rScore = 2;
    else rScore = 1;
    
    var fScore = 1;
    if (c.frequency >= 10) fScore = 5;
    else if (c.frequency >= 5) fScore = 4;
    else if (c.frequency >= 3) fScore = 3;
    else if (c.frequency >= 2) fScore = 2;
    else fScore = 1;
    
    var mScore = 1;
    if (c.monetary >= 50000000) mScore = 5;
    else if (c.monetary >= 20000000) mScore = 4;
    else if (c.monetary >= 10000000) mScore = 3;
    else if (c.monetary >= 5000000) mScore = 2;
    else mScore = 1;
    
    var totalScore = rScore + fScore + mScore;
    
    var segment = "";
    if (totalScore >= 13) segment = "VIP";
    else if (totalScore >= 10) segment = "Trung thành";
    else if (totalScore >= 7) segment = "Tiềm năng";
    else if (totalScore >= 5) segment = "Khách mới";
    else segment = "Nguy cơ rời bỏ";
    
    outputRows.push([
      c.id, c.name, c.lastDate, recency, c.frequency, c.monetary,
      rScore, fScore, mScore, totalScore, segment
    ]);
  }
  
  outputRows.sort(function(a, b) {
    return a[0].localeCompare(b[0]);
  });
  
  var targetSheet = ss.getSheetByName("BaoCao_RFM_BT6");
  if (!targetSheet) {
    targetSheet = ss.insertSheet("BaoCao_RFM_BT6");
  } else {
    targetSheet.clearContents();
    targetSheet.clearFormats();
    var existingCharts = targetSheet.getCharts();
    for (var k = 0; k < existingCharts.length; k++) {
      targetSheet.removeChart(existingCharts[k]);
    }
  }
  
  targetSheet.setHiddenGridlines(false);
  
  var headers = [
    "Mã Khách Hàng", "Tên Khách Hàng", "Ngày Mua Gần Nhất", 
    "Recency (Ngày)", "Frequency (Số đơn)", "Monetary (VNĐ)", 
    "Điểm R", "Điểm F", "Điểm M", "Tổng Điểm", "Phân Hạng"
  ];
  
  targetSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  if (outputRows.length > 0) {
    targetSheet.getRange(2, 1, outputRows.length, headers.length).setValues(outputRows);
  }
  
  var numRows = outputRows.length;
  var lastDataRow = numRows + 1;
  
  var navyColor = "#1B365D";
  targetSheet.getRange(1, 1, 1, headers.length)
             .setBackground(navyColor)
             .setFontColor("#FFFFFF")
             .setFontWeight("bold")
             .setHorizontalAlignment("center")
             .setVerticalAlignment("middle");
  targetSheet.setRowHeight(1, 35);
  
  if (numRows > 0) {
    var dataRange = targetSheet.getRange(2, 1, numRows, headers.length);
    dataRange.setFontFamily("Roboto")
             .setFontSize(10)
             .setVerticalAlignment("middle");
    
    for (var r = 2; r <= lastDataRow; r++) {
      targetSheet.getRange(r, 1, 1, headers.length)
                 .setBackground(r % 2 === 0 ? "#F4F6F9" : "#FFFFFF");
    }
    
    targetSheet.getRange(2, 1, numRows, 1).setHorizontalAlignment("center");
    targetSheet.getRange(2, 2, numRows, 1).setHorizontalAlignment("left");
    targetSheet.getRange(2, 3, numRows, 1).setNumberFormat("dd/mm/yyyy").setHorizontalAlignment("center");
    targetSheet.getRange(2, 4, numRows, 1).setNumberFormat("#,##0").setHorizontalAlignment("right");
    targetSheet.getRange(2, 5, numRows, 1).setNumberFormat("#,##0").setHorizontalAlignment("right");
    targetSheet.getRange(2, 6, numRows, 1).setNumberFormat("#,##0 \"VNĐ\"").setHorizontalAlignment("right");
    targetSheet.getRange(2, 7, numRows, 4).setNumberFormat("0").setHorizontalAlignment("center");
    targetSheet.getRange(2, 11, numRows, 1).setHorizontalAlignment("center").setFontWeight("bold");
    
    dataRange.setBorder(true, true, true, true, true, true, "#D3D3D3", SpreadsheetApp.BorderStyle.SOLID);
  }
  
  // Bảng Tổng Hợp Phân Khúc
  var summaryHeaders = ["Phân Hạng", "Số Lượng Khách", "Tổng Doanh Thu"];
  targetSheet.getRange(1, 13, 1, 3).setValues([summaryHeaders])
             .setBackground(navyColor)
             .setFontColor("#FFFFFF")
             .setFontWeight("bold")
             .setHorizontalAlignment("center")
             .setVerticalAlignment("middle");
             
  var segments = ["VIP", "Trung thành", "Tiềm năng", "Khách mới", "Nguy cơ rời bỏ"];
  var summaryNames = [];
  var summaryFormulas = [];
  
  for (var s = 0; s < segments.length; s++) {
    var rowIdx = s + 2;
    summaryNames.push([segments[s]]);
    summaryFormulas.push([
      '=COUNTIF(K$2:K$' + lastDataRow + '; M' + rowIdx + ')',
      '=SUMIF(K$2:K$' + lastDataRow + '; M' + rowIdx + '; F$2:F$' + lastDataRow + ')'
    ]);
  }
  
  summaryNames.push(["Tổng cộng"]);
  summaryFormulas.push([
    '=SUM(N2:N6)',
    '=SUM(O2:O6)'
  ]);
  
  targetSheet.getRange(2, 13, summaryNames.length, 1).setValues(summaryNames);
  targetSheet.getRange(2, 14, summaryFormulas.length, 2).setValues(summaryFormulas);

  targetSheet.getRange(2, 13, 6, 3).setBorder(true, true, true, true, true, true, "#D3D3D3", SpreadsheetApp.BorderStyle.SOLID);
  targetSheet.getRange("M2:M6").setHorizontalAlignment("left").setFontWeight("bold");
  targetSheet.getRange("N2:N7").setNumberFormat("#,##0").setHorizontalAlignment("right");
  targetSheet.getRange("O2:O7").setNumberFormat("#,##0 \"VNĐ\"").setHorizontalAlignment("right");
  targetSheet.getRange("M7:O7")
             .setBackground("#E8EEF5")
             .setFontWeight("bold")
             .setBorder(true, true, true, true, true, true, navyColor, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  // Tạo Biểu Đồ
  var pieChart = targetSheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(targetSheet.getRange("M1:N6"))
    .setPosition(2, 17, 0, 0)
    .setOption('title', 'Tỷ Lệ Khách Hàng Theo Phân Khúc')
    .setOption('is3D', true)
    .setOption('width', 480)
    .setOption('height', 300)
    .build();
  targetSheet.insertChart(pieChart);
  
  var columnChart = targetSheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(targetSheet.getRange("M1:M6"))
    .addRange(targetSheet.getRange("O1:O6"))
    .setPosition(18, 17, 0, 0)
    .setOption('title', 'Doanh Số Đóng Góp Theo Phân Khúc')
    .setOption('legend', {position: 'none'})
    .setOption('width', 480)
    .setOption('height', 300)
    .setOption('colors', [navyColor])
    .setOption('vAxis', {title: 'Doanh thu (VNĐ)', format: 'short'})
    .build();
  targetSheet.insertChart(columnChart);
  
  for (var col = 1; col <= 15; col++) {
    if (col === 12) {
      targetSheet.setColumnWidth(12, 30);
    } else {
      targetSheet.autoResizeColumn(col);
    }
  }

  // =========================================================================
  // PHẦN NÂNG CẤP: TẠO BÁO CÁO PDF TỪ GOOGLE DOCS TEMPLATE
  // =========================================================================
  try {
    // 1. Lấy dữ liệu từ bảng tổng hợp (Cần ép tính toán để lấy value thực tế)
    SpreadsheetApp.flush(); 
    
    var vipCount = targetSheet.getRange("N2").getValue();
    var loyalCount = targetSheet.getRange("N3").getValue();
    var potentialCount = targetSheet.getRange("N4").getValue();
    var newCount = targetSheet.getRange("N5").getValue();
    var churnCount = targetSheet.getRange("N6").getValue();
    
    // ID của file template "BaoCao_RFM_Template"
    var templateId = "1DQ857s2uv0U1fS1MdaIAztf7wxwuvrJvMxFzt7430yc"; 
    
    // 2. Tìm hoặc tạo thư mục "BaoCao_RFM_PDF"
    var folderName = "BaoCao_RFM_PDF";
    var folders = DriveApp.getFoldersByName(folderName);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
    
    // 3. Tạo bản sao tạm thời của template
    var templateFile = DriveApp.getFileById(templateId);
    var tempFile = templateFile.makeCopy("Temp_BaoCao_RFM", folder);
    var tempDoc = DocumentApp.openById(tempFile.getId());
    var body = tempDoc.getBody();
    
    // 4. Thay thế từ khóa bằng số liệu thật
    body.replaceText("{{VIP_Count}}", vipCount);
    body.replaceText("{{Loyal_Count}}", loyalCount);
    body.replaceText("{{Potential_Count}}", potentialCount);
    body.replaceText("{{New_Count}}", newCount);
    body.replaceText("{{Churn_Count}}", churnCount);
    
    // Thêm nhận định tự động
    var insightText = "Phân khúc VIP (" + vipCount + " KH) và Trung thành (" + loyalCount + " KH) đang là nhóm nòng cốt. Cần đặc biệt chú ý chiến dịch giữ chân nhóm Nguy cơ rời bỏ (" + churnCount + " KH).";
    body.replaceText("{{Insights}}", insightText);
    
    // Lưu và đóng file tạm để đảm bảo nội dung được ghi lại
    tempDoc.saveAndClose();
    
    // 5. Xuất ra định dạng PDF
    var pdfBlob = tempFile.getAs(MimeType.PDF);
    var timeString = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "ddMMyyyy_HHmmss");
    var pdfFile = folder.createFile(pdfBlob).setName("BaoCao_RFM_" + timeString + ".pdf");
    var pdfUrl = pdfFile.getUrl();
    
    // 6. Xóa file Doc tạm để dọn rác
    tempFile.setTrashed(true);
    
    // 7. Ghi link PDF vào ô H1 dưới dạng RichText Hyperlink
    var richText = SpreadsheetApp.newRichTextValue()
      .setText("📥 XEM BÁO CÁO PDF")
      .setLinkUrl(pdfUrl)
      .build();
    
    targetSheet.getRange("M10").setRichTextValue(richText)
               .setBackground("#28a745")
               .setFontColor("#FFFFFF")
               .setFontWeight("bold")
               .setHorizontalAlignment("center")
               .setVerticalAlignment("middle");
               
    SpreadsheetApp.getUi().alert('✅ Đã phân tích RFM và xuất báo cáo PDF thành công!\nLink PDF đã được gắn tại ô H1.');
    
  } catch (e) {
    SpreadsheetApp.getUi().alert("⚠️ Đã phân tích xong dữ liệu, nhưng có lỗi khi tạo PDF: " + e.message);
  }
}

// Hàm hỗ trợ ép kiểu Ngày
function parseDate_(val) {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (typeof val === 'string' && val.trim() !== '') {
    var parts = val.trim().split('/');
    if (parts.length === 3) {
      return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
    }
    var d = new Date(val);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

// Hàm hỗ trợ ép kiểu Số
function parseNumber_(val) {
  if (typeof val === 'number') return val;
  if (typeof val === 'string' && val.trim() !== '') {
    var clean = val.replace(/\./g, '').replace(/,/g, '').trim();
    var n = parseFloat(clean);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}`,
    businessScenario: {
      story: "Bạn là Chuyên viên Phân tích Dữ liệu hoặc Trưởng bộ phận Chăm sóc khách hàng. Công ty chuẩn bị cho chiến dịch Tri ân cuối năm và cần gửi ưu đãi riêng cho từng nhóm khách hàng.",
      pain: "Bạn có danh sách hàng nghìn giao dịch thô. Để tính ra được ai là VIP hay ai sắp rời bỏ, bạn phải viết hàng loạt cột phụ, tính toán đếm số đơn bằng COUNTIFS, cộng tiền bằng SUMIFS, rồi lồng các hàm IF cực kỳ dễ sai sót và mỏi mắt.",
      solution: "Apps Script tự động quét toàn bộ đơn hàng, tính toán RFM, phân nhóm khách hàng VIP/Trung thành/Nguy cơ rời bỏ, vẽ biểu đồ phân phối và đóng góp doanh số, sau đó xuất báo cáo chuyên nghiệp chỉ trong 3 giây!"
    },
    promptBreakdown: [
      { tag: "1. VAI TRÒ & DỮ LIỆU", title: "Phân tích RFM từ DonHang_BT6", desc: "AI nhận diện sheet DonHang_BT6 và tập trung phân tích 3 chỉ số Recency, Frequency, Monetary." },
      { tag: "2. LUẬT CHẤM ĐIỂM", title: "Quy tắc điểm 1-5 & Phân nhóm", desc: "Chấm điểm từng chỉ số và tính tổng điểm (tối đa 15đ) để xếp hạng khách hàng chính xác." },
      { tag: "3. TỔNG HỢP & BIỂU ĐỒ", title: "Pie & Column Chart", desc: "Tự lập bảng tổng hợp phân khúc bằng COUNTIF/SUMIF, vẽ 1 biểu đồ tròn và 1 biểu đồ cột song song." },
      { tag: "4. DOCUMENT REPORT", title: "Docs & PDF Export", desc: "(Nâng cao) Tự động điền dữ liệu phân khúc vào biểu mẫu báo cáo Docs và xuất PDF lưu Drive." }
    ],
    businessRequirements: `
      <p><b>Bài toán thực tế:</b> Phân loại nhóm khách hàng dựa trên lịch sử mua sắm để tối ưu hóa hiệu quả chăm sóc khách hàng. Tự động hóa hoàn toàn quy trình xử lý, tính toán điểm RFM, vẽ biểu đồ tròn tỷ lệ, biểu đồ cột doanh số và xuất file báo cáo văn bản.</p>
      <ul>
        <li><b>Mục tiêu:</b> Chạy thuật toán in-memory xử lý 100+ dòng giao dịch, vẽ 2 biểu đồ trực quan hóa và xuất kết quả báo cáo.</li>
        <li><b>Kỹ năng đạt được:</b> Làm chủ mô hình phân tích RFM, vẽ biểu đồ nâng cao qua Apps Script, xuất file in ấn sang PDF/Google Drive.</li>
      </ul>
    `,
    tableHeaders: ["Mã Đơn", "Mã KH", "Tên Khách Hàng", "Ngày Mua", "Doanh Thu Đơn"],
    tableRows: [
      ["DH-RFM-0001", "KH001", "Nguyễn Văn An", "28/08/2026", "5,200,000"],
      ["DH-RFM-0002", "KH002", "Trần Thị Bích", "25/08/2026", "12,800,000"],
      ["DH-RFM-0003", "KH001", "Nguyễn Văn An", "15/07/2026", "3,500,000"],
      ["DH-RFM-0004", "KH003", "Lê Hoàng Long", "10/06/2026", "2,400,000"],
      ["DH-RFM-0005", "KH002", "Trần Thị Bích", "05/05/2026", "8,500,000"]
    ],
    steps: [
      {
        badge: "01",
        title: "Bước 1: Kiểm Tra Xem AI Có Thực Sự Đang Đọc Được File Hay Không",
        desc: "Trước khi thực hiện phân tích hay lập trình, hãy gửi đường link Google Sheets của bạn và kiểm tra xem AI (Spark / Gemini) có truy cập đọc được trang dữ liệu <code>DonHang_BT6</code> không.",
        promptBox: `https://docs.google.com/spreadsheets/d/19jPP-MwIMPjeDfViicF1jTQBxx-0lTP8HAwR6IqArPI/edit
 
bạn có thể đọc được nội dung của trang tính "DonHang_BT6" trong link này chứ? Hãy liệt kê 3 dòng dữ liệu đầu tiên để xác nhận.`,
        note: "<b>💡 Mẹo:</b> Hãy đảm bảo file Google Sheets đã được bật chế độ chia sẻ là <i>'Bất kỳ ai có đường liên kết đều có thể xem'</i>."
      },
      {
        badge: "02",
        title: "Bước 2: Yêu Cầu AI Phân Tích Cấu Trúc Bảng & Chỉ Số Phân Phối",
        desc: "Ra lệnh cho AI phân tích cấu trúc cột, xác định tọa độ và phương pháp tính các chỉ số RFM trước khi viết code.",
        promptBox: `Hãy phân tích cấu trúc cột của sheet "DonHang_BT6" và đề xuất thuật toán tính 3 chỉ số RFM cho từng khách hàng duy nhất:
1. R (Recency): Khoảng cách số ngày từ lần mua cuối của khách hàng đó đến ngày chốt báo cáo 31/08/2026.
2. F (Frequency): Tổng số đơn hàng của khách hàng.
3. M (Monetary): Tổng doanh thu mua sắm của khách hàng đó.`
      },
      {
        badge: "03",
        title: "Bước 3: Ra Lệnh AI Viết Apps Script Tính Toán RFM & Vẽ Biểu Đồ (Cột & Tròn)",
        desc: "Sử dụng Siêu Prompt chi tiết để AI viết mã nguồn tự động tạo bảng phân khúc và chèn biểu đồ cột + tròn song song trên Sheet.",
        promptBox: `Bạn là Lập trình viên Google Apps Script. Viết 1 đoạn code Apps Script (.gs) hoàn chỉnh cho sheet "DonHang_BT6":
1. Đọc dữ liệu từ dòng 4 (A4:E) và tính toán R (so với ngày 31/08/2026), F, M cho mỗi khách hàng.
2. Chấm điểm RFM từ 1-5 theo quy tắc:
   - R: <=15 ngày: 5đ; <=45 ngày: 4đ; <=90 ngày: 3đ; <=180 ngày: 2đ; còn lại: 1đ.
   - F: >=10 lần: 5đ; >=5 lần: 4đ; >=3 lần: 3đ; >=2 lần: 2đ; còn lại: 1đ.
   - M: >=50.000.000: 5đ; >=20.000.000: 4đ; <=10.000.000: 3đ; >=5.000.000: 2đ; còn lại: 1đ.
3. Phân hạng dựa trên tổng điểm RFM (tối đa 15đ): VIP (>=13), Trung thành (10-12), Tiềm năng (7-9), Khách mới (5-6), Nguy cơ rời bỏ (<=4).
4. Ghi kết quả sang sheet mới tên là "BaoCao_RFM_BT6". Định dạng bảng chuyên nghiệp màu Navy.
5. Tạo bảng tổng hợp phân khúc ở cột M-O bằng công thức COUNTIF & SUMIF. [BẮT BUỘC CHUẨN LOCALE VIỆT NAM]: Các đối số trong công thức phải được phân cách bằng dấu chấm phẩy (;) (ví dụ: =COUNTIF(K4:K8; "VIP")). Trong Apps Script, bắt buộc sử dụng phương thức .setFormulasLocal() thay vì .setFormulas() để phù hợp với cài đặt Locale Việt Nam của bảng tính.
6. Vẽ tự động 1 Biểu đồ tròn (Pie Chart) thể hiện tỷ lệ % khách hàng của mỗi phân khúc và 1 Biểu đồ cột (Column Chart) thể hiện doanh số đóng góp của từng phân khúc. Đặt 2 biểu đồ cạnh bảng tổng hợp ở cột Q.
7. Thêm menu "📊 PHÂN TÍCH" > "Chạy Phân Tích RFM Khách Hàng".`
      },
      {
        badge: "04",
        title: "Bước 4: Ra Lệnh Cho AI Thiết Lập Biểu Mẫu Word (Google Docs) Thô",
        desc: "Hướng dẫn AI tạo ra biểu mẫu Docs mẫu đại diện cho một báo cáo phân tích khách hàng chính thức trên Word, chứa các thẻ placeholder <code>{VIP_Count}</code>, <code>{Loyal_Count}</code>... để sau này điền dữ liệu tự động.",
        promptBox: `Hãy tạo một file Google Docs template đặt tên là "BaoCao_RFM_Template" với cấu trúc sau:
1. Tiêu đề: "BÁO CÁO PHÂN TÍCH CHẤT LƯỢNG KHÁCH HÀNG DOANH NGHIỆP".
2. Bảng thống kê phân khúc khách hàng gồm các dòng:
   - Số lượng khách hàng VIP: {VIP_Count}
   - Số lượng khách hàng Trung thành: {Loyal_Count}
   - Số lượng khách hàng Tiềm năng: {Potential_Count}
   - Số lượng khách hàng Mới: {New_Count}
   - Số lượng khách hàng Nguy cơ rời bỏ: {Churn_Count}
3. Phần nhận định chung: "{Insights}".`
      },
      {
        badge: "05",
        title: "Bước 5: Ra Lệnh Cho AI Apps Script Điền Dữ Liệu & Xuất Báo Cáo PDF",
        desc: "Tích hợp quy trình tự động hóa khép kín: Nhân bản biểu mẫu Docs mẫu, điền dữ liệu thực tế tính toán từ Sheet và xuất PDF lưu Drive.",
        promptBox: `Hãy nâng cấp mã nguồn Apps Script của bạn để thực hiện:
1. Mở file Google Docs "BaoCao_RFM_Template" bằng ID hoặc tên và tạo một bản sao tạm.
2. Tìm và thay thế các từ khóa mẫu {VIP_Count}, {Loyal_Count}... bằng số liệu phân tích thật từ bảng tổng hợp.
3. Xuất file Doc tạm đó thành định dạng PDF chất lượng cao lưu vào thư mục Drive "BaoCao_RFM_PDF".
4. Xóa file Doc tạm để dọn rác Drive, và trả liên kết file PDF về ô H1 của sheet báo cáo.`
      }
    ],
    checklist: [
      "Đã tạo sheet dữ liệu giao dịch DonHang_BT6 thành công",
      "Đã gửi link Sheet và xác nhận AI Agent đọc chính xác dữ liệu",
      "AI phân tích chi tiết cấu trúc cột và đề xuất thuật toán tính RFM",
      "Đã copy Master Prompt gửi AI để sinh mã nguồn Apps Script",
      "Mã Apps Script thực thi không lỗi, tạo thành công sheet BaoCao_RFM_BT6",
      "Tự động tạo bảng tổng hợp (COUNTIF/SUMIF) và vẽ biểu đồ Tròn & Cột cạnh nhau",
      "(Nâng cao) Bản sao Docs mẫu được điền số liệu và xuất thành công file PDF lên Drive"
    ],
    triggerGuide: `
      <h3 class="section-title"><i class="ph-bold ph-calendar-blank"></i> Kích Hoạt Tự Động Đầu Tháng</h3>
      <p style="color: var(--text-secondary); line-height: 1.7;">
        Bạn có thể yêu cầu AI: <i>"Hãy hướng dẫn tôi thiết lập Trigger tự động chạy báo cáo phân tích RFM này vào ngày 1 hàng tháng lúc 00:00"</i> để ban giám đốc luôn có báo cáo phân khúc mới nhất ngay khi bước vào tháng mới.
      </p>
    `
  },

  {
    id: "bt7",
    index: 7,
    title: "Bài 7: Xây Dựng Menu UI Quản Lý Bán Hàng & Vẽ Biểu Đồ Thống Kê Xanh Dương",
    shortTitle: "Quản Lý Bán Hàng & Menu UI",
    subtitle: "Apps Script lập trình menu UI và vẽ biểu đồ xanh dương",
    level: "Dành Cho Dân Văn Phòng",
    time: "20 phút",
    tags: ["Menu UI Design", "Google Apps Script", "Column Chart", "Semicolon Localized"],
    desc: "Quy trình thiết lập menu chức năng tùy chỉnh trên thanh công cụ và viết mã Apps Script tính toán doanh thu/chi phí quảng cáo và vẽ biểu đồ cột đôi màu xanh dương.",
    csvFile: "bai_tap_7_quan_ly_ban_hang.csv",
    scriptFile: "BaiTap7_QuanLyBanHang_MenuUI.gs",
    scriptContent: `/**
 * BÀI TẬP 7: MENU UI QUẢN LÝ BÁN HÀNG & VẼ BIỂU ĐỒ THỐNG KÊ XANH DƯƠNG
 */
const CONFIG_BT7 = {
  SHEET_NAME: "BanHang_BT7",
  BLUE_PRIMARY: "#1B365D", // Xanh dương đậm tiêu đề
  BLUE_NAVY: "#1D4ED8",    // Xanh dương vẽ cột doanh thu
  BLUE_LIGHT: "#93C5FD"    // Xanh lam nhạt vẽ cột chi phí
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🌸 Quản Lý Bán Hàng")
    .addItem("➕ Thêm đơn hàng", "themDonHang")
    .addItem("📦 Nhập hàng", "nhapHang")
    .addItem("💸 Nhập chi phí", "nhapChiPhi")
    .addSeparator()
    .addItem("📊 Xem Thống Kê", "xemThongKe")
    .addSeparator()
    .addItem("⚙️ Khởi tạo Sheets", "khoiTaoSheets")
    .addToUi();
}

function themDonHang() {
  SpreadsheetApp.getUi().alert("Chức năng: ➕ Thêm đơn hàng", "Hệ thống đang mở form nhập đơn hàng trực tuyến. Vui lòng kiểm tra!", SpreadsheetApp.getUi().ButtonSet.OK);
}

function nhapHang() {
  SpreadsheetApp.getUi().alert("Chức năng: 📦 Nhập hàng", "Yêu cầu nhập kho sỉ đã được kích hoạt!", SpreadsheetApp.getUi().ButtonSet.OK);
}

function nhapChiPhi() {
  SpreadsheetApp.getUi().alert("Chức năng: 💸 Nhập chi phí", "Form cập nhật chi phí vận hành cửa hàng đã mở!", SpreadsheetApp.getUi().ButtonSet.OK);
}

function xemThongKe() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG_BT7.SHEET_NAME);
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert("Lỗi: Không tìm thấy sheet 'BanHang_BT7'!");
    return;
  }
  
  var lastRow = sheet.getLastRow();
  if (lastRow < 4) {
    SpreadsheetApp.getUi().alert("Chưa có đủ dữ liệu giao dịch từ dòng 4 để làm thống kê!");
    return;
  }
  
  var existingCharts = sheet.getCharts();
  for (var i = 0; i < existingCharts.length; i++) {
    sheet.removeChart(existingCharts[i]);
  }
  
  sheet.getRange("I3:K3").setValues([["Kênh/Phân Loại", "Doanh Thu", "Chi Phí"]])
    .setBackground(CONFIG_BT7.BLUE_PRIMARY).setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
  
  var channels = [
    ["Shopee"],
    ["Lazada"],
    ["Website"],
    ["Cửa Hàng"],
    ["Chi Phí Marketing"],
    ["Chi Phí Vận Hành"]
  ];
  sheet.getRange("I4:I9").setValues(channels);
  
  var summaryFormulas = [];
  for (var r = 4; r <= 9; r++) {
    var itemLabelCell = "I" + r;
    var salesFormula = '=SUMIFS(F$4:F$' + lastRow + '; B$4:B$' + lastRow + '; "Bán Hàng"; G$4:G$' + lastRow + '; ' + itemLabelCell + ')';
    var costFormula = '=SUMIFS(F$4:F$' + lastRow + '; B$4:B$' + lastRow + '; "Chi Phí"; G$4:G$' + lastRow + '; ' + itemLabelCell + ')';
    summaryFormulas.push([salesFormula, costFormula]);
  }
  
  sheet.getRange("J4:K9").setFormulasLocal(summaryFormulas);
  sheet.getRange("J4:K9").setNumberFormat("#,##0");
  sheet.getRange("I3:K9").setBorder(true, true, true, true, true, true, "#D9D9D9", SpreadsheetApp.BorderStyle.SOLID);
  
  SpreadsheetApp.flush();
  
  var chartBuilder = sheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(sheet.getRange("I3:K9"))
    .setPosition(11, 9, 0, 0)
    .setOption("title", "THỐNG KÊ DOANH THU & CHI PHÍ BÁN HÀNG")
    .setOption("width", 500)
    .setOption("height", 320)
    .setOption("colors", [CONFIG_BT7.BLUE_NAVY, CONFIG_BT7.BLUE_LIGHT])
    .setOption("vAxis", {title: "Số Tiền (VNĐ)", format: "#,##0"})
    .setOption("hAxis", {title: "Kênh Phân Phối"})
    .build();
    
  sheet.insertChart(chartBuilder);
  
  SpreadsheetApp.getUi().alert("Thành công!", "Đã lập bảng phân tích nhanh và vẽ biểu đồ doanh số tông màu Xanh Dương thành công!", SpreadsheetApp.getUi().ButtonSet.OK);
}

function khoiTaoSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG_BT7.SHEET_NAME) || ss.getActiveSheet();
  
  sheet.clear();
  var charts = sheet.getCharts();
  for (var i = 0; i < charts.length; i++) {
    sheet.removeChart(charts[i]);
  }
  
  sheet.getRange("A1:G1").merge().setValue("SỔ NHẬT KÝ BÁN HÀNG & CHI PHÍ")
    .setBackground(CONFIG_BT7.BLUE_PRIMARY).setFontColor("#FFFFFF").setFontWeight("bold").setFontSize(13)
    .setHorizontalAlignment("center").setVerticalAlignment("center");
  sheet.setRowHeight(1, 35);
  
  var headers = ["Ngày Giao Dịch", "Loại Giao Dịch", "Nội Dung", "Số Lượng", "Đơn Giá", "Thành Tiền", "Kênh/Phân Loại"];
  sheet.getRange(3, 1, 1, headers.length).setValues([headers])
    .setBackground(CONFIG_BT7.BLUE_PRIMARY).setFontColor("#FFFFFF").setFontWeight("bold")
    .setHorizontalAlignment("center");
  sheet.setRowHeight(3, 24);
  
  sheet.getRange("A4:G20").setBorder(true, true, true, true, true, true, "#D9D9D9", SpreadsheetApp.BorderStyle.SOLID);
  sheet.autoResizeColumns(1, headers.length);
  
  SpreadsheetApp.getUi().alert("Khởi tạo thành công!", "Bảng nhật ký bán hàng sạch đã sẵn sàng nhập liệu!", SpreadsheetApp.getUi().ButtonSet.OK);
}`,
    workflow: [
      { icon: "ph-link", title: "1. Đọc Dữ Liệu", desc: "Xác nhận AI đọc chính xác sheet BanHang_BT7" },
      { icon: "ph-table", title: "2. Phân Tích Cột", desc: "AI phân tích cấu trúc cột & phân khúc giao dịch" },
      { icon: "ph-list-bullets", title: "3. Tạo Menu UI", desc: "Apps Script hàm onOpen() tạo menu tùy chỉnh" },
      { icon: "ph-chart-bar", title: "4. Vẽ Biểu Đồ", desc: "Hàm Xem Thống Kê vẽ biểu đồ tông xanh dương" },
      { icon: "ph-gear", title: "5. Khởi Tạo Sheet", desc: "Hàm Khởi tạo sheet mẫu trống định dạng chuẩn" }
    ],
    masterPrompt: `[VAI TRÒ]: Bạn là Chuyên gia Tự động hóa và Lập trình viên Google Apps Script chuyên nghiệp.
[NHIỆM VỤ]: Viết một đoạn code Apps Script (.gs) hoàn chỉnh cho sheet "BanHang_BT7" để tạo một menu UI và vẽ biểu đồ cột thống kê tông màu xanh dương. Không giải thích, chỉ xuất khối mã code duy nhất.

[THÔNG TIN DỮ LIỆU ĐẦU VÀO]:
- Tên Sheet nguồn: "BanHang_BT7"
- Dữ liệu bắt đầu từ dòng 4 gồm các cột: Ngày Giao Dịch, Loại Giao Dịch, Nội Dung, Số Lượng, Đơn Giá, Thành Tiền, Kênh/Phân Loại.

[LUẬT NGHIỆP VỤ & MENU UI]:
1. Tạo một menu tên là "🌸 Quản Lý Bán Hàng" thả xuống ngay khi mở file (hàm onOpen()):
   - "➕ Thêm đơn hàng" (hàm themDonHang)
   - "📦 Nhập hàng" (hàm nhapHang)
   - "💸 Nhập chi phí" (hàm nhapChiPhi)
   - (Dòng ngăn cách)
   - "📊 Xem Thống Kê" (hàm xemThongKe)
   - (Dòng ngăn cách)
   - "⚙️ Khởi tạo Sheets" (hàm khoiTaoSheets)
2. Lập trình cho hàm xemThongKe():
   - Tạo bảng tổng hợp doanh số/chi phí theo kênh tại cột I-K.
   - [BẮT BUỘC CHUẨN LOCALE VIỆT NAM]: Các đối số trong công thức SUMIFS phải dùng dấu chấm phẩy (;) (ví dụ: =SUMIFS(F$4:F$53; B$4:B$53; "Bán Hàng"; G$4:G$53; I4)). Trong Apps Script, dùng hàm .setFormulasLocal() thay vì .setFormulas() để không báo lỗi cú pháp.
   - Vẽ một biểu đồ cột (Column Chart) hiển thị doanh thu và chi phí, đặt màu cột chủ đạo tông màu Xanh Dương (Xanh Navy đậm cho Doanh thu và Xanh Lam nhạt cho Chi phí).
3. Lập trình cho hàm khoiTaoSheets():
   - Xóa sạch dữ liệu cũ và định dạng khung bảng trống định dạng tiêu đề màu xanh dương đậm (#1B365D), chữ trắng in đậm chuẩn đẹp.`,
    businessScenario: {
      story: "Bạn là Quản lý cửa hàng bán lẻ thiết bị công nghệ. Hàng ngày có nhiều giao dịch bán hàng, nhập kho và chi phí phát sinh lộn xộn. Bạn muốn tự động hóa tạo menu thao tác nhanh cho nhân viên.",
      pain: "Mỗi ngày nhân viên phải lọc tay số liệu, tự lập bảng so sánh doanh số/chi phí và vẽ biểu đồ báo cáo gửi bạn, rất dễ sai lệch và mất thời gian tổng hợp mỗi tối.",
      solution: "Tạo menu tiện ích trực tiếp trên Sheets. Nhân viên chỉ cần nhấp chọn, hệ thống tự lập bảng và tự vẽ biểu đồ cột màu xanh dương chủ đạo trực quan trong tích tắc!"
    },
    promptBreakdown: [
      { tag: "1. VAI TRÒ & DATA", title: "Lập trình viên Apps Script", desc: "AI nhận diện sheet BanHang_BT7 làm sheet nguồn." },
      { tag: "2. GIAO DIỆN MENU", title: "Thanh Menu 🌸 Quản Lý Bán Hàng", desc: "Hàm onOpen() tự khởi tạo menu gồm các nút chức năng nhập liệu và thống kê." },
      { tag: "3. THỐNG KÊ LOCALE VN", title: "SUMIFS và setFormulasLocal()", desc: "Bắt buộc công thức sử dụng dấu chấm phẩy (;) và setFormulasLocal() để không bị lỗi trên Sheets tiếng Việt." },
      { tag: "4. BIỂU ĐỒ XANH DƯƠNG", title: "Biểu đồ cột Blue theme", desc: "Vẽ biểu đồ cột đôi so sánh doanh số/chi phí với tông màu xanh dương chủ đạo sắc nét." }
    ],
    businessRequirements: `
      <p><b>Bài toán thực tế:</b> Xây dựng một quy trình làm việc chuẩn cho nhân viên bán hàng bằng thanh công cụ tiện ích. Tự động hóa tính toán doanh số/chi phí và vẽ biểu đồ cột tông màu xanh dương chủ đạo.</p>
      <ul>
        <li><b>Mục tiêu:</b> Lập trình menu UI, viết công thức SUMIFS local, và vẽ biểu đồ cột đôi.</li>
        <li><b>Kỹ năng đạt được:</b> Tạo Custom Menu trong Sheets, thiết lập biểu đồ qua Apps Script, sử dụng công thức Localized Việt Nam.</li>
      </ul>
    `,
    tableHeaders: ["Ngày Giao Dịch", "Loại Giao Dịch", "Nội Dung", "Số Lượng", "Đơn Giá", "Thành Tiền", "Kênh/Phân Loại"],
    tableRows: [
      ["02/08/2026", "Bán Hàng", "Laptop Acer Aspire", "1", "12,500,000", "12,500,000", "Shopee"],
      ["05/08/2026", "Nhập Hàng", "Lô Chuột Logitech (Nhập sỉ)", "10", "300,000", "3,000,000", "Nhập Kho"],
      ["12/08/2026", "Bán Hàng", "Chuột Logitech G102", "2", "450,000", "900,000", "Lazada"],
      ["15/08/2026", "Chi Phí", "Chi phí chạy quảng cáo Facebook Ads", "1", "2,000,000", "2,000,000", "Chi Phí Marketing"]
    ],
    steps: [
      {
        badge: "01",
        title: "Bước 1: Kiểm Tra AI Nhận Diện Sheet Bán Hàng Mới",
        desc: "Gửi link Google Sheet chứa trang dữ liệu mới <code>BanHang_BT7</code> để xác nhận AI đã đọc chính xác thông tin giao dịch.",
        promptBox: `https://docs.google.com/spreadsheets/d/19jPP-MwIMPjeDfViicF1jTQBxx-0lTP8HAwR6IqArPI/edit
 
bạn có thể đọc được nội dung của sheet mới "BanHang_BT7" trong link này chứ? Hãy liệt kê 3 dòng dữ liệu giao dịch đầu tiên để xác nhận.`
      },
      {
        badge: "02",
        title: "Bước 2: Yêu Cầu AI Phân Tích Bố Cục Nhật Ký Giao Dịch",
        desc: "Yêu cầu AI phân tích các cột dữ liệu để lập kế hoạch tính toán doanh thu/chi phí và vẽ biểu đồ cột.",
        promptBox: `Hãy phân tích dữ liệu trong sheet "BanHang_BT7". Làm sao để dùng Apps Script lọc ra tổng Doanh thu của các kênh bán hàng (Shopee, Lazada, Website, Cửa Hàng) và tổng Chi phí của các kênh marketing (Chi Phí Marketing, Chi Phí Vận Hành)?`
      },
      {
        badge: "03",
        title: "Bước 3: Tạo Giao Diện Menu Tiện Ích 'Quản Lý Bán Hàng'",
        desc: "AI viết mã Apps Script hàm <code>onOpen()</code> tự tạo thanh Menu thả xuống <code>🌸 Quản Lý Bán Hàng</code> với các emojis tương ứng.",
        promptBox: `Viết hàm onOpen() trong Google Apps Script để tạo một menu tùy chỉnh tên là "🌸 Quản Lý Bán Hàng" hiển thị trên thanh công cụ của Google Sheets với danh sách các nút bấm sau:
1. "➕ Thêm đơn hàng" (gọi hàm themDonHang)
2. "📦 Nhập hàng" (gọi hàm nhapHang)
3. "💸 Nhập chi phí" (gọi hàm nhapChiPhi)
(Thêm 1 dòng gạch ngang phân cách)
4. "📊 Xem Thống Kê" (gọi hàm xemThongKe)
(Thêm 1 dòng gạch ngang phân cách)
5. "⚙️ Khởi tạo Sheets" (gọi hàm khoiTaoSheets)`
      },
      {
        badge: "04",
        title: "Bước 4: Lập Trình Chức Năng Vẽ Biểu Đồ Thống Kê Tông Màu Xanh Dương",
        desc: "AI viết code hàm <code>xemThongKe()</code> để tự chèn bảng tổng hợp bằng công thức <code>SUMIFS</code> local (dấu <code>;</code>) và vẽ biểu đồ cột đôi màu xanh dương cạnh bảng dữ liệu.",
        promptBox: `Hãy viết code cho hàm xemThongKe() thực hiện các yêu cầu sau:
1. Đọc dữ liệu từ dòng 4 sheet "BanHang_BT7" (A4:G).
2. Tạo bảng tổng hợp phân tích từ cột I đến K:
   - Dòng 3: Tiêu đề "Kênh/Phân Loại", "Doanh Thu", "Chi Phí".
   - Dòng 4-7 liệt kê các kênh bán: Shopee, Lazada, Website, Cửa Hàng. Điền công thức SUMIFS chuẩn tiếng Việt (dùng dấu ;) để cộng tiền Doanh thu bán hàng tương ứng.
   - Dòng 8-9 liệt kê chi phí: Chi Phí Marketing, Chi Phí Vận Hành. Điền công thức SUMIFS tương tự để cộng tiền Chi phí tương ứng.
   - Sử dụng .setFormulasLocal() để chèn công thức chuẩn xác.
3. Tự động vẽ 1 biểu đồ cột (Column Chart) so sánh Doanh thu và Chi phí của các kênh dựa trên bảng tổng hợp trên.
4. Đặt màu chủ đạo của biểu đồ là tông màu Xanh Dương (Xanh Navy đậm cho Doanh thu và Xanh Lam nhạt cho Chi phí). Đặt biểu đồ bên dưới bảng tổng hợp ở cột M.`
      },
      {
        badge: "05",
        title: "Bước 5: Thiết Lập Chức Năng Khởi Tạo Bảng Trống Định Dạng",
        desc: "AI viết code hàm <code>khoiTaoSheets()</code> để dọn dẹp trang tính và định dạng trước bảng dữ liệu trống tông màu xanh dương sẵn sàng nhập liệu mới.",
        promptBox: `Hãy viết code cho hàm khoiTaoSheets() để xóa sạch dữ liệu cũ trên sheet "BanHang_BT7", chèn lại dòng tiêu đề header (Ngày Giao Dịch, Loại Giao Dịch, Nội Dung, Số Lượng, Đơn Giá, Thành Tiền, Kênh/Phân Loại), tô nền tiêu đề màu xanh dương đậm (#1B365D), chữ trắng in đậm và kẻ viền bảng trống sẵn sàng nhập liệu.`
      }
    ],
    checklist: [
      "Đã tạo sheet dữ liệu giao dịch BanHang_BT7 thành công",
      "Đã gửi link Sheet và xác nhận AI Agent đọc chính xác 3 dòng đầu",
      "AI đề xuất thành công giải thuật phân tách doanh thu/chi phí",
      "Hàm onOpen() tự động khởi tạo menu 🌸 Quản Lý Bán Hàng có emojis",
      "Hàm Xem Thống Kê tự động điền bảng SUMIFS chuẩn tiếng Việt (dấu ;)",
      "Vẽ thành công biểu đồ cột đôi Doanh thu/Chi phí màu xanh dương chủ đạo",
      "Hàm Khởi Tạo Sheet dọn sạch và vẽ khung bảng trống màu xanh dương đậm"
    ],
    triggerGuide: `
      <h3 class="section-title"><i class="ph-bold ph-lightning"></i> Cập Nhật Hàng Đêm</h3>
      <p style="color: var(--text-secondary); line-height: 1.7;">
        Bạn có thể thiết lập Trigger chạy hàm <code>xemThongKe</code> lúc 23:59 mỗi đêm để biểu đồ thống kê luôn cập nhật số liệu chốt ngày mới nhất cho bạn xem vào sáng hôm sau.
      </p>
    `
  }

];

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
  showToast("Đang tải xuống File Excel 5 Sheet tổng hợp...");
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
