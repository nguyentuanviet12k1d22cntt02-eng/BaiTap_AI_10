# HƯỚNG DẪN BÀI THỰC HÀNH 1 (PROMPT-DRIVEN)
## RA LỆNH CHO GEMINI TỰ ĐỘNG BÁO CÁO DOANH THU & VẼ MINI-CHART SPARKLINE

---

### 📖 1. Tình Huống Doanh Nghiệp Thực Tế (Case Study Context)
* **Bối cảnh:** Bạn là Trợ lý Ban Giám Đốc hoặc Trưởng nhóm Kinh doanh tại chuỗi bán lẻ 10 chi nhánh toàn quốc. Mỗi sáng lúc 08:30, Ban Giám Đốc sẽ họp giao ban đầu ngày để đánh giá tốc độ bán hàng và điều phối hàng hóa giữa các vùng miền.
* **Nỗi đau khi làm thủ công (Before):** Mỗi sáng lúc 7:30 bạn phải thức dậy mở file Sheets, tính tổng 10 chi nhánh, tìm xem chi nhánh nào bán chạy nhất, kẻ vẽ biểu đồ rồi gõ email gửi sếp. Hôm nào bận việc đột xuất hay quên gửi là bị nhắc nhở, tốn 30 phút mỗi ngày.
* **Giải pháp AI Tự động (After):** Chỉ với 1 câu Master Prompt, bạn ra lệnh cho Gemini tự động vẽ biểu đồ Sparkline mini trong ô và lập lịch tự động gửi email báo cáo HTML kèm 2 thẻ KPI lúc đúng 08:00 sáng mỗi ngày, kể cả khi bạn chưa mở máy tính!

---

### 🪄 2. Master Prompt (Dán vào Gemini / AI Agent)

```text
Bạn là một Trợ lý Tự động hóa Doanh nghiệp (AI Office Automation Expert).

Tôi đang có bảng dữ liệu Google Sheets tại trang tính "DoanhThu_BT1" với cấu trúc từ dòng 4 như sau:
- Cột A: Mã CN (Mã chi nhánh)
- Cột B: Tên Chi Nhánh
- Cột C: Khu Vực (Hà Nội, TP.HCM, Đà Nẵng...)
- Cột D đến Cột J: Doanh thu các ngày từ Thứ 2 đến Chủ nhật
- Cột K: Xu Hướng (Cần vẽ biểu đồ)
- Cột L: Tổng Doanh Thu Tuần

HÃY THỰC HIỆN TỰ ĐỘNG CÁC TÁC VỤ SAU CHO TÔI:
1. Viết công thức Google Sheets tại ô K4 để vẽ biểu đồ đường mini (Sparkline) màu xanh dương (#1a73e8) thể hiện xu hướng doanh thu 7 ngày từ D4:J4, và công thức tính tổng tuần tại L4.
2. Xây dựng quy trình tự động quét toàn bộ bảng tính này, tính tổng doanh thu toàn hệ thống, tìm ra chi nhánh có doanh thu cao nhất.
3. Soạn email định dạng HTML chuẩn chuyên nghiệp với màu xanh navy sang trọng (#000080), hiển thị 2 thẻ KPI (Tổng Doanh Thu & Chi Nhánh Dẫn Đầu) và bảng chi tiết từng chi nhánh, gửi tới email của tôi với tiêu đề "[BÁO CÁO DOANH THU] - Cập nhật lúc dd/MM/yyyy HH:mm:ss".
4. Thiết lập lịch tự động kích hoạt quy trình này và tự xóa trigger cũ để tránh trùng lặp.
```

---

### 💻 3. Mã Nguồn Chuẩn Giải Mẫu (Kết Quả AI Sinh Ra)

```javascript
function sendRevenueReport() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DoanhThu_BT1");
  var dataRange = sheet.getRange(4, 1, sheet.getLastRow() - 3, 12);
  var data = dataRange.getValues();
  
  var totalSystemRevenue = 0;
  var maxRevenue = 0;
  var topBranch = "";
  var tableRowsHTML = "";
  
  for (var i = 0; i < data.length; i++) {
    var branchCode = data[i][0];
    var branchName = data[i][1];
    var region = data[i][2];
    var weeklyTotal = data[i][11];
    
    if (branchCode == "") continue;
    totalSystemRevenue += weeklyTotal;
    
    if (weeklyTotal > maxRevenue) {
      maxRevenue = weeklyTotal;
      topBranch = branchName;
    }
    
    var formattedTotal = weeklyTotal.toLocaleString('vi-VN') + " VNĐ";
    tableRowsHTML += `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${branchCode}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${branchName}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${region}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formattedTotal}</td>
      </tr>
    `;
  }
  
  var formattedSystemTotal = totalSystemRevenue.toLocaleString('vi-VN') + " VNĐ";
  var formattedMaxRevenue = maxRevenue.toLocaleString('vi-VN') + " VNĐ";
  var now = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
  
  var htmlBody = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
      <h2 style="color: #000080; text-align: center;">BÁO CÁO DOANH THU HỆ THỐNG</h2>
      <p style="text-align: center; color: #555;">Cập nhật lúc: ${now}</p>
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div style="background-color: #f4f7f6; padding: 15px; border-radius: 8px; width: 48%; border-left: 5px solid #000080;">
          <h4 style="margin: 0 0 10px 0; color: #000080;">TỔNG DOANH THU</h4>
          <p style="font-size: 18px; font-weight: bold; margin: 0;">${formattedSystemTotal}</p>
        </div>
        <div style="background-color: #f4f7f6; padding: 15px; border-radius: 8px; width: 48%; border-left: 5px solid #1a73e8;">
          <h4 style="margin: 0 0 10px 0; color: #1a73e8;">CHI NHÁNH DẪN ĐẦU</h4>
          <p style="font-size: 16px; font-weight: bold; margin: 0;">${topBranch}</p>
          <p style="font-size: 14px; margin: 5px 0 0 0;">${formattedMaxRevenue}</p>
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
        <tbody>${tableRowsHTML}</tbody>
      </table>
    </div>
  `;
  
  MailApp.sendEmail({
    to: "nguyentuanviet12k1@gmail.com",
    subject: "[BÁO CÁO DOANH THU] - Cập nhật lúc " + now,
    htmlBody: htmlBody
  });
}

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
}
```
