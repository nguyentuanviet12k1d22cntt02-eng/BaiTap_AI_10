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
        title: "Tạo File Google Docs Mẫu Có Bảng Sản Phẩm",
        desc: "Tạo 1 file Google Docs mẫu với các tag chung <code>{{MA_DON}}</code>, <code>{{TEN_KH}}</code>, <code>{{TONG_TIEN}}</code>... và tạo 1 Bảng (Table) có sẵn dòng tiêu đề để AI chèn danh mục mặt hàng."
      },
      {
        badge: "02",
        title: "Gửi Master Prompt Cho AI Agent",
        desc: "Dán câu Master Prompt Bài 2 vào Gemini / AI Agent. AI sẽ tự động sinh mã Apps Script xử lý gom nhóm đa sản phẩm và chèn bảng tự động.",
        promptBox: "Dán Master Prompt Bài 2 từ Tab 1 vào Gemini / AI Agent"
      },
      {
        badge: "03",
        title: "Prompt Tinh Chỉnh: Thêm Tính Năng Gửi Email Kèm Hóa Đơn",
        desc: "Nếu muốn sau khi tạo PDF thì tự động gửi email kèm file hóa đơn cho khách hàng, hãy gửi thêm prompt phụ:",
        promptBox: "Hãy nâng cấp quy trình: Sau khi tạo file PDF xong, tự động gửi email cho khách hàng kèm link xem hóa đơn và đính kèm trực tiếp file PDF này."
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
        ${step.promptBox ? `<div class="step-prompt-box">💬 <b>Prompt mẫu:</b> "${step.promptBox}"</div>` : ''}
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
