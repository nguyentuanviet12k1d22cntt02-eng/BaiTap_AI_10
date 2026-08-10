/**
 * ==============================================================================
 * BÀI TẬP 1: BÁO CÁO DOANH THU HỆ THỐNG & TỰ ĐỘNG GỬI EMAIL THEO LỊCH
 * ==============================================================================
 * Tác giả: Nguyễn Tuấn Việt
 * Mục tiêu:
 * 1. Quét dữ liệu từ Sheet 'DoanhThu_BT1' từ dòng 4.
 * 2. Tự động tính tổng doanh thu toàn hệ thống & tìm chi nhánh có doanh thu cao nhất.
 * 3. Định dạng số tiền chuẩn VNĐ và tạo giao diện Email HTML chuyên nghiệp.
 * 4. Tự động dọn dẹp trigger cũ và tạo trigger hẹn giờ chạy tự động.
 */

function sendRevenueReport() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DoanhThu_BT1");
  var dataRange = sheet.getRange(4, 1, sheet.getLastRow() - 3, 12); // Lấy dữ liệu từ dòng 4 đến cột L
  var data = dataRange.getValues();
  
  var totalSystemRevenue = 0;
  var maxRevenue = 0;
  var topBranch = "";
  var tableRowsHTML = "";
  
  // Xử lý dữ liệu
  for (var i = 0; i < data.length; i++) {
    var branchCode = data[i][0];
    var branchName = data[i][1];
    var region = data[i][2];
    var weeklyTotal = data[i][11]; // Cột L (index 11)
    
    if (branchCode == "") continue; // Bỏ qua dòng trống
    
    totalSystemRevenue += weeklyTotal;
    
    if (weeklyTotal > maxRevenue) {
      maxRevenue = weeklyTotal;
      topBranch = branchName;
    }
    
    // Định dạng số tiền
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
  
  // Lấy thời gian hiện tại (bao gồm cả giờ phút giây)
  var now = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
  
  // Soạn HTML Email
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
        <tbody>
          ${tableRowsHTML}
        </tbody>
      </table>
      
      <p style="margin-top: 20px; font-size: 12px; color: #888; text-align: center;">Email này được gửi tự động từ hệ thống quản lý.</p>
    </div>
  `;
  
  // Gửi email tới địa chỉ người nhận
  MailApp.sendEmail({
    to: "nguyentuanviet12k1@gmail.com", // Đổi thành email người nhận mong muốn
    subject: "[BÁO CÁO DOANH THU] - Cập nhật lúc " + now,
    htmlBody: htmlBody
  });
}

// Hàm tạo Trigger tự động chạy theo lịch (Đã có cơ chế xóa trùng)
function createDailyTrigger() {
  // Xóa các trigger cũ để tránh trùng lặp
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  
  // Tạo trigger mới lặp lại hàng ngày lúc 08:00 sáng
  ScriptApp.newTrigger("sendRevenueReport")
    .timeBased()
    .atHour(8)
    .everyDays(1)
    .inTimezone("Asia/Ho_Chi_Minh")
    .create();
}
