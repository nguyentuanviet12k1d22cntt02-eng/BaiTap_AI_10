/**
 * ==============================================================================
 * HỆ THỐNG QUẢN LÝ THU CHI TỰ ĐỘNG (GMAIL & GOOGLE SHEETS)
 * File: test.gs (hoặc 7_DocThoEmail_Raw.gs)
 * Chức năng: Đọc và đổ toàn bộ nội dung email ngân hàng thô ra trang tính "Test_Email_Raw"
 *            để người dùng và AI kiểm tra trực quan cấu trúc email trước khi bóc tách.
 * ==============================================================================
 */

// Hằng số tên trang tính lưu dữ liệu thô
var SHEET_TEST_RAW = "Test_Email_Raw";

/**
 * Hàm chính: Quét Gmail và xuất toàn bộ nội dung thô ra tab Test_Email_Raw
 */
function docVaXuatNoiDungEmailTho() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var rawSheet = ss.getSheetByName(SHEET_TEST_RAW);

    // 1. Tạo mới hoặc làm sạch trang tính Test_Email_Raw
    if (!rawSheet) {
      rawSheet = ss.insertSheet(SHEET_TEST_RAW);
    } else {
      rawSheet.clear();
    }

    rawSheet.showSheet();

    // 2. Thiết lập độ rộng cột để dễ dàng xem toàn bộ nội dung email
    rawSheet.setRowHeight(1, 35); // Dòng banner
    rawSheet.setRowHeight(2, 28); // Dòng tiêu đề cột

    rawSheet.setColumnWidth(1, 50);  // Cột A: STT
    rawSheet.setColumnWidth(2, 140); // Cột B: Ngày Giờ Nhận
    rawSheet.setColumnWidth(3, 260); // Cột C: Tiêu Đề Email
    rawSheet.setColumnWidth(4, 200); // Cột D: Người Gửi (From)
    rawSheet.setColumnWidth(5, 550); // Cột E: Nội Dung Email Thô (Plain Body)
    rawSheet.setColumnWidth(6, 160); // Cột F: Message ID

    // Banner tiêu đề Dòng 1 (A1:F1)
    var banner = rawSheet.getRange("A1:F1");
    banner.merge();
    banner.setValue("BẢNG DỮ LIỆU EMAIL NGÂN HÀNG THÔ (TEST_EMAIL_RAW)");
    banner.setBackground("#0f4c81")
          .setFontColor("#ffffff")
          .setFontFamily("Arial")
          .setFontSize(12)
          .setFontWeight("bold")
          .setHorizontalAlignment("center")
          .setVerticalAlignment("middle");

    // Tiêu đề các cột Dòng 2 (A2:F2)
    var headers = [
      ["STT", "Ngày Giờ Nhận", "Tiêu Đề Email", "Người Gửi (From)", "Nội Dung Email Thô (Plain Body)", "Message ID"]
    ];
    var headerRange = rawSheet.getRange("A2:F2");
    headerRange.setValues(headers)
               .setBackground("#e8f0fe")
               .setFontColor("#1a73e8")
               .setFontFamily("Arial")
               .setFontSize(10)
               .setFontWeight("bold")
               .setHorizontalAlignment("center")
               .setVerticalAlignment("middle");

    // 3. Tìm kiếm email ngân hàng trong Gmail (BIDV / Biên lai chuyển tiền)
    var searchQuery = 'subject:"Biên lai chuyển tiền" OR subject:"BIDV"';
    var threads = GmailApp.search(searchQuery, 0, 20); // Lấy tối đa 20 email gần nhất để kiểm tra

    var rawData = [];
    var stt = 1;

    for (var i = 0; i < threads.length; i++) {
      var messages = threads[i].getMessages();
      for (var j = 0; j < messages.length; j++) {
        var msg = messages[j];
        var dateStr = Utilities.formatDate(msg.getDate(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
        var subject = msg.getSubject();
        var from = msg.getFrom();
        var plainBody = msg.getPlainBody();
        var msgId = msg.getId();

        rawData.push([
          stt++,
          dateStr,
          subject,
          from,
          plainBody,
          msgId
        ]);
      }
    }

    // 4. Ghi dữ liệu thô hàng loạt xuống Sheet
    if (rawData.length > 0) {
      var dataRange = rawSheet.getRange(3, 1, rawData.length, 6);
      dataRange.setValues(rawData)
               .setFontFamily("Arial")
               .setFontSize(10)
               .setVerticalAlignment("top"); // Căn trên để đọc nội dung thư nhiều dòng thuận tiện

      // Định dạng căn lề
      rawSheet.getRange(3, 1, rawData.length, 1).setHorizontalAlignment("center");
      rawSheet.getRange(3, 2, rawData.length, 1).setHorizontalAlignment("center");
      rawSheet.getRange(3, 3, rawData.length, 3).setHorizontalAlignment("left");
      rawSheet.getRange(3, 6, rawData.length, 1).setHorizontalAlignment("center");

      // Bật chế độ tự động xuống dòng (Wrap text) cho cột nội dung thô
      rawSheet.getRange(3, 5, rawData.length, 1).setWrap(true);

      // Kẻ khung viền
      rawSheet.getRange(2, 1, rawData.length + 1, 6)
              .setBorder(true, true, true, true, true, true, "#dadce0", SpreadsheetApp.BorderStyle.SOLID);
    }

    SpreadsheetApp.flush();

    var thongBao = "Đã quét và đổ " + rawData.length + " email thô vào trang tính 'Test_Email_Raw' thành công!\n\nBây giờ bạn và AI có thể mở tab này ra để quan sát cấu trúc chính xác của từng dòng email.";
    Logger.log(thongBao);

    try {
      var ui = SpreadsheetApp.getUi();
      ui.alert("QUÉT DỮ LIỆU EMAIL THÔ THÀNH CÔNG", thongBao, ui.ButtonSet.OK);
    } catch (e) {
      Logger.log("Chạy không có UI: " + e.toString());
    }

    return {
      success: true,
      count: rawData.length
    };
  } catch (err) {
    Logger.log("Lỗi trong docVaXuatNoiDungEmailTho: " + err.toString());
    try {
      SpreadsheetApp.getUi().alert("LỖI XỬ LÝ", "Không thể đọc email: " + err.message, SpreadsheetApp.getUi().ButtonSet.OK);
    } catch (e) {}
    return { success: false, error: err.toString() };
  }
}
