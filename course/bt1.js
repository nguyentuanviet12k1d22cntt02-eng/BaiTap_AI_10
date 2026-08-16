COURSE_DATA.push(
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
    csvFile: "bai_tap_1_doanh_thu_sparkline.xlsx",
    
    workflow: [
      { icon: "ph-chat-circle-dots", title: "1. Viết Master Prompt", desc: "Mô tả nghiệp vụ & dữ liệu cho Gemini" },
      { icon: "ph-sparkle", title: "2. AI Sinh Công Thức", desc: "Tự điền hàm Sparkline & tính tổng" },
      { icon: "ph-robot", title: "3. AI Thiết Lập Workflow", desc: "Tự tạo email HTML báo cáo lãnh đạo" },
      { icon: "ph-clock-countdown", title: "4. Hẹn Giờ 08:00 Sáng", desc: "Tự động kích hoạt hàng ngày" }
    ],

    masterPrompt: `[VAI TRÒ]: Bạn là Chuyên gia tự động hóa Google Sheets và Google Apps Script.
[BỐI CẢNH & NHIỆM VỤ]: Tôi có trang tính tên "DoanhThu_BT1" ghi nhận doanh thu 7 ngày (từ cột D đến J) từ dòng 4 trở đi của các chi nhánh. Hãy viết một đoạn mã Apps Script hoàn chỉnh để tự động hóa toàn bộ quy trình sau:

1. TỰ ĐỘNG ĐIỀN CÔNG THỨC:
   - Cột L (Tổng tuần): Tự động điền công thức tính tổng =SUM(D4:J4) cho tất cả các dòng có dữ liệu.
   - Cột K (Xu hướng): Tự động vẽ biểu đồ mini Sparkline dạng đường màu xanh dương. Vì Google Sheets đang cài đặt tiếng Việt, hãy dùng chính xác cú pháp phân cách bằng dấu chấm phẩy và gạch chéo:
     =SPARKLINE(D4:J4; {"charttype"\\"line"; "color"\\"#1a73e8"; "linewidth"\\2})

2. TỔNG HỢP SỐ LIỆU & BÁO CÁO:
   - Tự động tính Tổng doanh thu toàn hệ thống và tìm Chi nhánh có doanh thu cao nhất.
   - Tự động soạn email định dạng HTML màu xanh Navy (#0f172a) sang trọng, hiển thị 2 Thẻ KPI nổi bật và Bảng chi tiết doanh thu (định dạng tiền tệ VNĐ).
   - Gửi email tới "giamdoc@congty.com" với tiêu đề "[BÁO CÁO DOANH THU] - Cập nhật ngày " + ngày hiện tại.

3. TIỆN ÍCH SỬ DỤNG & TỰ ĐỘNG HÓA:
   - Tạo Menu tiện ích "🚀 BÁO CÁO" > "Chạy Báo Cáo Ngay" trực tiếp trên thanh công cụ của Sheets để người dùng bấm chạy bất cứ lúc nào.
   - Tạo chức năng hẹn giờ tự động chạy và gửi email lúc 08:00 sáng mỗi ngày.
   - Hiển thị thông báo "Thành công!" trên màn hình sau khi hoàn thành.

[QUY TẮC KỸ THUẬT BẮT BUỘC]:
- CHỈ DÙNG API GOOGLE: Dùng hàm chuẩn setFormulas(), tuyệt đối không dùng cú pháp của Excel như setFormulasLocal.
- DẤU PHÂN CÁCH THAM SỐ (;): Bảng tính tiếng Việt bắt buộc dùng dấu chấm phẩy (;) để phân cách các tham số trong hàm (ví dụ trong SPARKLINE), tuyệt đối KHÔNG dùng dấu phẩy (,).
- ESCAPE CÔNG THỨC: Escape dấu gạch chéo ngược (\\) thành (\\\\) trong chuỗi code JavaScript.
- CODE SẴN SÀNG: Chỉ xuất 1 khối mã code duy nhất hoàn chỉnh, không giải thích dài dòng, sẵn sàng copy dùng ngay.`,

    businessScenario: {
      story: "Bạn là Trợ lý Ban Giám Đốc hoặc Trưởng nhóm Kinh doanh tại chuỗi bán lẻ 10 chi nhánh toàn quốc. Mỗi sáng lúc 08:30, Ban Giám Đốc sẽ họp giao ban đầu ngày để đánh giá tốc độ bán hàng và điều phối hàng hóa giữa các vùng miền.",
      pain: "Mỗi sáng 7h30 bạn phải thức dậy mở file Sheets, tính tổng 10 chi nhánh, tìm xem chi nhánh nào bán chạy nhất, kẻ vẽ biểu đồ rồi gõ email gửi sếp. Hôm nào bận việc đột xuất hay quên gửi là bị nhắc nhở, tốn 30 phút mỗi ngày.",
      solution: "Chỉ với 1 câu Master Prompt chuẩn Locale Việt Nam, bạn ra lệnh cho Apps Script tự động chèn biểu đồ Sparkline mini, tính tổng, tạo Menu tùy chỉnh trên Sheet và gửi email báo cáo HTML lúc đúng 08:00 sáng mỗi ngày!"
    },

    promptBreakdown: [
      { tag: "1. VAI TRÒ & DỮ LIỆU", title: "Chuyên Gia Apps Script & Tab Dữ Liệu", desc: "Xác định rõ vai trò AI và chỉ định chính xác tên trang tính DoanhThu_BT1 cần xử lý." },
      { tag: "2. CÔNG THỨC TIẾNG VIỆT", title: "Chuẩn Locale Việt Nam (; và \\)", desc: "Hướng dẫn AI dùng đúng định dạng dấu chấm phẩy cho hàm Sparkline tránh bị lỗi #ERROR." },
      { tag: "3. TÍNH TOÁN KPI", title: "Tổng Doanh Thu & Top 1 Chi Nhánh", desc: "Yêu cầu AI tự động quét dữ liệu để tìm ra chi nhánh có doanh thu xuất sắc nhất." },
      { tag: "4. EMAIL HTML CHUYÊN NGHIỆP", title: "Giao Diện Navy & Thẻ KPI", desc: "Mô tả phong cách email sang trọng với màu chủ đạo #0f172a và định dạng tiền VNĐ." },
      { tag: "5. NÚT BẤM & HẸN GIỜ", title: "Menu Tiện Ích & Hẹn Giờ 08:00", desc: "Tạo menu bấm trực tiếp trên Google Sheets và kích hoạt gửi tự động mỗi sáng." }
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
        desc: "Đảm bảo file đang ở chế độ <b>Google Trang tính gốc (không có badge .XLSX xanh bên cạnh tên file)</b> để kích hoạt đầy đủ tính năng Apps Script và Trigger. Nếu thấy có badge <code>.XLSX</code>, hãy nhấp vào menu <b>Tệp (File) ➔ Lưu dưới dạng Google Trang tính (Save as Google Sheets)</b> trước khi thực hiện tiếp.",
        expectedResult: {
          image: "assets/sheet_format_check.jpg",
          imageTitle: "Kiểm tra và lưu file ở định dạng Google Sheets gốc"
        }
      },
      {
        badge: "02",
        title: "Mở Tiện Ích Mở Rộng ➔ Apps Script",
        desc: "Trên Google Sheets, vào menu <b>Tiện ích mở rộng ➔ Apps Script</b> để mở trình soạn thảo mã nguồn.",
        expectedResult: {
          image: "assets/sheet_open_appscript.jpg",
          imageTitle: "Mở trình soạn thảo Google Apps Script"
        }
      },
      {
        badge: "03",
        title: "Kiểm Kê Cấu Trúc Sheet & Dữ Liệu Bằng AI (Prompt Trinh Sát)",
        desc: "Để yêu cầu AI liệt kê chi tiết cấu trúc, danh sách các sheet và dữ liệu của từng sheet trong một file Google Sheet, giúp AI nắm rõ toàn bộ các sheet và cấu trúc cột trước khi bắt tay vào tự động hóa.",
        promptBox: `Hãy truy cập vào file Google Sheet này: [Dán link vào đây].

Tôi cần bạn thực hiện kiểm kê tổng quát về cấu trúc của file này. Vui lòng thực hiện các bước sau:

1. Liệt kê tên tất cả các sheet (tab) hiện có trong file.

2. Với mỗi sheet, hãy mô tả cấu trúc của nó bao gồm:
   - Danh sách các tiêu đề cột (tên cột nằm ở dòng mấy).
   - Định dạng dữ liệu của các cột đó (ví dụ: cột đó chứa văn bản, số, ngày tháng, hay công thức).
   - Tổng số dòng dữ liệu ước tính trong sheet đó.

3. Trình bày kết quả dưới dạng bảng tổng hợp để tôi dễ đối chiếu.`,
        expectedResult: {
          image: "assets/gemini_kiem_ke_cau_truc_sheet.png",
          imageTitle: "Kết quả AI kiểm kê chi tiết cấu trúc các sheet và cột dữ liệu"
        }
      },
      {
        badge: "04",
        title: "Dán Master Prompt & Lấy Code Chuẩn Locale VN",
        desc: "Sao chép câu **Master Prompt** tại Tab 1, gửi cho AI (Gemini hoặc AI Agent) để AI tự động thiết kế mã nguồn.",
        promptBox: `[VAI TRÒ]: Bạn là Chuyên gia tự động hóa Google Sheets và Google Apps Script.
[BỐI CẢNH & NHIỆM VỤ]: Tôi có trang tính tên "DoanhThu_BT1" ghi nhận doanh thu 7 ngày (từ cột D đến J) từ dòng 4 trở đi của các chi nhánh. Hãy viết một đoạn mã Apps Script hoàn chỉnh để tự động hóa toàn bộ quy trình sau:

1. TỰ ĐỘNG ĐIỀN CÔNG THỨC:
   - Cột L (Tổng tuần): Tự động điền công thức tính tổng =SUM(D4:J4) cho tất cả các dòng có dữ liệu.
   - Cột K (Xu hướng): Tự động vẽ biểu đồ mini Sparkline dạng đường màu xanh dương. Vì Google Sheets đang cài đặt tiếng Việt, hãy dùng chính xác cú pháp phân cách bằng dấu chấm phẩy và gạch chéo:
     =SPARKLINE(D4:J4; {"charttype"\\"line"; "color"\\"#1a73e8"; "linewidth"\\2})

2. TỔNG HỢP SỐ LIỆU & BÁO CÁO:
   - Tự động tính Tổng doanh thu toàn hệ thống và tìm Chi nhánh có doanh thu cao nhất.
   - Tự động soạn email định dạng HTML màu xanh Navy (#0f172a) sang trọng, hiển thị 2 Thẻ KPI nổi bật và Bảng chi tiết doanh thu (định dạng tiền tệ VNĐ).
   - Gửi email tới "giamdoc@congty.com" với tiêu đề "[BÁO CÁO DOANH THU] - Cập nhật ngày " + ngày hiện tại.

3. TIỆN ÍCH SỬ DỤNG & TỰ ĐỘNG HÓA:
   - Tạo Menu tiện ích "🚀 BÁO CÁO" > "Chạy Báo Cáo Ngay" trực tiếp trên thanh công cụ của Sheets để người dùng bấm chạy bất cứ lúc nào.
   - Tạo chức năng hẹn giờ tự động chạy và gửi email lúc 08:00 sáng mỗi ngày.
   - Hiển thị thông báo "Thành công!" trên màn hình sau khi hoàn thành.

[QUY TẮC KỸ THUẬT BẮT BUỘC]:
- CHỈ DÙNG API GOOGLE: Dùng hàm chuẩn setFormulas(), tuyệt đối không dùng cú pháp của Excel như setFormulasLocal.
- DẤU PHÂN CÁCH THAM SỐ (;): Bảng tính tiếng Việt bắt buộc dùng dấu chấm phẩy (;) để phân cách các tham số trong hàm (ví dụ trong SPARKLINE), tuyệt đối KHÔNG dùng dấu phẩy (,).
- ESCAPE CÔNG THỨC: Escape dấu gạch chéo ngược (\\) thành (\\\\) trong chuỗi code JavaScript.
- CODE SẴN SÀNG: Chỉ xuất 1 khối mã code duy nhất hoàn chỉnh, không giải thích dài dòng, sẵn sàng copy dùng ngay.`,
        expectedResult: {
          image: "assets/gemini_paste_prompt.jpg",
          imageTitle: "Gửi prompt cho Gemini và nhận code Apps Script"
        }
      },
      {
        badge: "05",
        title: "Dán Code Vào Apps Script & Chạy Thử",
        desc: "Dán mã nguồn vào tệp <code>Code.gs</code>, chọn hàm <code>runDailyReport</code> hoặc dùng menu <b>🚀 BÁO CÁO ➔ Chạy Báo Cáo Ngay</b> trên Google Sheets để chạy thử nghiệm.",
        promptBox: `Sau khi dán mã nguồn vào Code.gs, chọn hàm runDailyReport trong danh sách hàm và bấm nút Chạy (Run) để kiểm tra gửi báo cáo ngay lập tức.`,
        expectedResult: {
          image: "assets/appscript_run_code.jpg",
          imageTitle: "Dán mã Code.gs và bấm nút Chạy thử nghiệm"
        }
      },
      {
        badge: "06",
        title: "Kích Hoạt Lịch Hẹn Giờ 08:00 Sáng",
        desc: "Chọn hàm <code>setupDailyTrigger</code> trong danh sách hàm và bấm <b>▷ Chạy</b> để thiết lập lịch gửi email tự động mỗi sáng. Kiểm tra hộp thư Gmail để nhận kết quả email HTML được thiết kế sang trọng.",
        promptBox: `Hãy thiết lập trigger tự động gửi báo cáo vào lúc 08:00 AM hàng ngày bằng cách chạy hàm setupDailyTrigger hoặc thiết lập thủ công trong phần Triggers.`,
        expectedResult: {
          image: "assets/gmail_received_report.jpg",
          imageTitle: "Nhận báo cáo doanh thu HTML định dạng Navy tuyệt đẹp trong Gmail"
        }
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
  }
);
