# HƯỚNG DẪN BÀI THỰC HÀNH 1 (PROMPT-DRIVEN)
## RA LỆNH CHO GEMINI TỰ ĐỘNG BÁO CÁO DOANH THU & VẼ MINI-CHART SPARKLINE (LOCALE VIỆT NAM)

---

### 📖 1. Tình Huống Doanh Nghiệp Thực Tế (Case Study Context)
* **Bối cảnh:** Bạn là Trợ lý Ban Giám Đốc hoặc Trưởng nhóm Kinh doanh tại chuỗi bán lẻ 10 chi nhánh toàn quốc. Mỗi sáng lúc 08:30, Ban Giám Đốc sẽ họp giao ban đầu ngày để đánh giá tốc độ bán hàng và điều phối hàng hóa giữa các vùng miền.
* **Nỗi đau khi làm thủ công (Before):** Mỗi sáng lúc 7:30 bạn phải thức dậy mở file Sheets, tính tổng 10 chi nhánh, tìm xem chi nhánh nào bán chạy nhất, kẻ vẽ biểu đồ rồi gõ email gửi sếp. Hôm nào bận việc đột xuất hay quên gửi là bị nhắc nhở, tốn 30 phút mỗi ngày.
* **Giải pháp AI Tự động (After):** Chỉ với 1 câu Master Prompt chuẩn Locale Việt Nam, bạn ra lệnh cho Apps Script tự động chèn biểu đồ Sparkline mini, tính tổng, tạo Menu tùy chỉnh trên Sheet và gửi email báo cáo HTML lúc đúng 08:00 sáng mỗi ngày!

---

### 🪄 2. Các Prompt Thực Hành Theo Từng Nghiệp Vụ (Micro-Prompting)

> **Phương pháp khuyên dùng:** Tách nhỏ bài toán thành 3 module riêng biệt giúp dễ kiểm soát, dễ chạy thử từng phần và sửa lỗi nhanh chóng.

#### 📌 Module 1: Điền Công Thức & Biểu Đồ Mini Sparkline
```text
[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia Google Apps Script. Hãy tuân thủ nghiêm ngặt toàn bộ nguyên tắc kỹ thuật trong tài liệu "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

[BỐI CẢNH & DỮ LIỆU]: Tôi có trang tính "DoanhThu_BT1". Dữ liệu bắt đầu từ dòng 4, trong đó cột D đến cột J là doanh thu 7 ngày (Thứ 2 đến Chủ nhật) của các chi nhánh.

[YÊU CẦU NGHIỆP VỤ 1 - CÔNG THỨC & BIỂU ĐỒ]:
Hãy viết hàm insertFormulasAndSparkline() trong Apps Script:
- Cột L (Tổng tuần): Tự động điền công thức tính tổng doanh thu 7 ngày (cột D đến cột J) cho tất cả dòng có dữ liệu.
- Cột K (Xu hướng): Tự động chèn biểu đồ mini Sparkline dạng đường màu xanh dương thể hiện xu hướng tăng giảm 7 ngày.

[YÊU CẦU ĐẦU RA]:
- Xuất khối mã Apps Script hoàn chỉnh, chạy thử nghiệm ngay trên Google Sheets.
```

#### 📌 Module 2: Phân Tích KPI & Soạn Email Báo Cáo HTML
```text
[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia Google Apps Script. Hãy tuân thủ nghiêm ngặt toàn bộ nguyên tắc kỹ thuật trong tài liệu "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

[BỐI CẢNH & DỮ LIỆU]: Trang tính "DoanhThu_BT1" có dữ liệu từ dòng 4 gồm:
- Cột A: Mã chi nhánh
- Cột B: Tên chi nhánh
- Cột C: Khu vực
- Cột L: Tổng doanh thu tuần

[YÊU CẦU NGHIỆP VỤ 2 - PHÂN TÍCH KPI & GỬI EMAIL]:
Hãy viết hàm sendDailyRevenueEmail():
1. Quét dữ liệu từ dòng 4 để tính Tổng doanh thu toàn hệ thống và tìm Chi nhánh đạt doanh thu cao nhất tuần.
2. Soạn email báo cáo định dạng HTML màu xanh Navy (#0f172a) sang trọng, hiển thị 2 Thẻ KPI nổi bật (Tổng doanh thu, Chi nhánh dẫn đầu) và Bảng chi tiết doanh thu các chi nhánh (định dạng tiền tệ VNĐ).
3. Gửi email tới "giamdoc@congty.com" với tiêu đề: "[BÁO CÁO DOANH THU] - Cập nhật ngày " + ngày hiện tại.

[YÊU CẦU ĐẦU RA]:
- Xuất khối mã Apps Script hoàn chỉnh để kết hợp vào dự án.
```

#### 📌 Module 3: Tạo Menu Nút Bấm Trên Sheet & Hẹn Giờ 08:00
```text
[TIÊU CHUẨN KỸ THUẬT]: Tuân thủ nghiêm ngặt tài liệu "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

[YÊU CẦU NGHIỆP VỤ 3 - MENU TIỆN ÍCH & TỰ ĐỘNG HÓA]:
Hãy viết các hàm tiện ích và tự động hóa:
1. Hàm onOpen(): Tạo menu "🚀 BÁO CÁO" > "Chạy Báo Cáo Ngay" trên thanh công cụ của Sheets để bấm chạy toàn bộ quy trình.
2. Hàm setupDailyTrigger(): Thiết lập Trigger kích hoạt tự động chạy và gửi email vào lúc 08:00 sáng mỗi ngày.
3. Hiển thị hộp thoại thông báo "Thành công!" trên màn hình sau khi hoàn tất.

[YÊU CẦU ĐẦU RA]:
- Xuất khối mã Apps Script hoàn chỉnh.
```

---

#### 🌟 Tùy Chọn: Master Prompt Trọn Gói 1-Click (Gộp 3 Module)
```text
[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia tự động hóa Google Sheets & Apps Script. Hãy tuân thủ nghiêm ngặt toàn bộ các nguyên tắc kỹ thuật trong tài liệu "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

[BỐI CẢNH & DỮ LIỆU]: Tôi có trang tính tên "DoanhThu_BT1". Dữ liệu bắt đầu từ dòng 4, trong đó:
- Cột D đến cột J: Doanh thu 7 ngày trong tuần (từ Thứ 2 đến Chủ nhật) của các chi nhánh.
- Cột K: Cột biểu đồ xu hướng (Sparkline).
- Cột L: Cột tổng doanh thu cả tuần.

[YÊU CẦU NGHIỆP VỤ]:
1. Tự động điền công thức & vẽ biểu đồ:
   - Cột L (Tổng tuần): Tự động tính tổng doanh thu 7 ngày (từ cột D đến cột J) cho tất cả các dòng có dữ liệu.
   - Cột K (Xu hướng): Tự động vẽ biểu đồ mini Sparkline dạng đường màu xanh dương thể hiện xu hướng tăng giảm 7 ngày.

2. Tổng hợp số liệu & Gửi email báo cáo:
   - Tự động tính Tổng doanh thu toàn hệ thống và tìm Chi nhánh đạt doanh thu cao nhất tuần.
   - Soạn email báo cáo định dạng HTML chuyên nghiệp với tông màu xanh Navy (#0f172a) sang trọng, hiển thị nổi bật 2 Thẻ KPI (Tổng doanh thu, Chi nhánh xuất sắc nhất) và Bảng chi tiết doanh thu các chi nhánh (định dạng tiền tệ VNĐ rõ ràng).
   - Gửi email đến địa chỉ "giamdoc@congty.com" với tiêu đề: "[BÁO CÁO DOANH THU] - Cập nhật ngày " + ngày hiện tại.

3. Tiện ích sử dụng & Hẹn giờ:
   - Tạo menu "🚀 BÁO CÁO" > "Chạy Báo Cáo Ngay" trên thanh công cụ của Google Sheets để người dùng bấm chạy bất cứ lúc nào.
   - Tạo hàm hẹn giờ tự động chạy và gửi email vào lúc 08:00 sáng mỗi ngày.
   - Hiển thị hộp thoại thông báo "Thành công!" trên màn hình sau khi hoàn tất.

[YÊU CẦU ĐẦU RA]:
- Xuất 1 khối mã Google Apps Script (.gs) hoàn chỉnh, sẵn sàng sao chép vào Apps Script để sử dụng ngay mà không cần chỉnh sửa thủ công.
```

---

### 💻 3. Mã Nguồn Chuẩn Giải Mẫu (Kết Quả AI Sinh Ra)

```javascript
/**
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
  // 1. CHÈN CÔNG THỨC CHUẨN LOCALE VIỆT NAM (DÙNG ; VÀ \)
  // --------------------------------------------------------------------------
  var sparklineFormulas = [];
  var sumFormulas = [];
  
  for (var r = 4; r <= lastRow; r++) {
    // Công thức SPARKLINE chuẩn Locale Việt Nam: dùng ; và \ trong mảng thuộc tính
    sparklineFormulas.push(['=SPARKLINE(D' + r + ':J' + r + '; {"charttype"\\"line"; "color"\\"#1a73e8"; "linewidth"\\2})']);
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
    
    tableRowsHTML += `
      <tr style="background-color: ${rowBg};">
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1e293b;">${branchCode}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #334155;">${branchName}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;">${region}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700; color: #0f172a;">${formattedRowTotal}</td>
      </tr>
    `;
  }
  
  var formattedSystemTotal = totalSystemRevenue.toLocaleString('vi-VN') + " VNĐ";
  var formattedMaxRevenue  = maxRevenue.toLocaleString('vi-VN') + " VNĐ";
  var todayDateStr         = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy");
  
  // --------------------------------------------------------------------------
  // 3. SOẠN VÀ GỬI EMAIL HTML NAVY (#0f172a) SANG TRỌNG
  // --------------------------------------------------------------------------
  var htmlBody = `
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
          <p style="margin: 0; font-size: 13px; color: #94a3b8;">Cập nhật tự động ngày: <strong style="color: #38bdf8;">${todayDateStr}</strong></p>
        </div>
        
        <!-- KPI Cards Grid -->
        <div style="padding: 24px 20px 10px 20px;">
          <table style="width: 100%; border-collapse: separate; border-spacing: 12px 0;">
            <tr>
              <td style="width: 50%; background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #1a73e8; border-radius: 8px; padding: 16px; vertical-align: top;">
                <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">TỔNG DOANH THU HỆ THỐNG</div>
                <div style="font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 6px;">${formattedSystemTotal}</div>
              </td>
              <td style="width: 50%; background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #10b981; border-radius: 8px; padding: 16px; vertical-align: top;">
                <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">CHI NHÁNH DẪN ĐẦU</div>
                <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 6px;">${topBranch}</div>
                <div style="font-size: 13px; font-weight: 700; color: #10b981; margin-top: 2px;">${formattedMaxRevenue} <span style="font-size: 11px; font-weight: 400; color: #64748b;">(${topRegion})</span></div>
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
              ${tableRowsHTML}
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
  `;
  
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
}
```
