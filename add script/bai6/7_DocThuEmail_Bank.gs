/**
 * ==============================================================================
 * HỆ THỐNG QUẢN LÝ THU CHI TỰ ĐỘNG (GMAIL & GOOGLE SHEETS)
 * File: 7_DocThuEmail_Bank.gs
 * Chức năng: Quét email biên lai chuyển tiền BIDV từ Gmail, bóc tách chuẩn xác
 *            các trường dữ liệu từ bảng biểu và xuất danh sách ra bảng "Mail_Log".
 * ==============================================================================
 */

// Hằng số tên trang tính
var SHEET_MAIL_LOG = "Mail_Log";

// BẮT BUỘC KHAI BÁO HẰNG SỐ CỘT (0-Indexed) ĐÚNG THỨ TỰ BẢNG MAIL_LOG
var COL_LOG_STT     = 0; // Cột A: STT
var COL_LOG_DATE    = 1; // Cột B: Ngày GD (DD/MM/YYYY)
var COL_LOG_MONTH   = 2; // Cột C: Tháng/Năm (MM/YYYY)
var COL_LOG_CODE    = 3; // Cột D: Mã GD (Số lệnh giao dịch)
var COL_LOG_TYPE    = 4; // Cột E: Loại GD (Thu / Chi)
var COL_LOG_AMOUNT  = 5; // Cột F: Số Tiền (VNĐ)
var COL_LOG_PERSON  = 6; // Cột G: Người Liên Quan (Đối tác nhận / chuyển)
var COL_LOG_CHANNEL = 7; // Cột H: Kênh Thanh Toán
var COL_LOG_DESC    = 8; // Cột I: Nội Dung Chuyển Tiền
var COL_LOG_STATUS  = 9; // Cột J: Trạng Thái Nạp

/**
 * Hàm chính: Quét thử email biên lai BIDV từ Gmail và xuất kết quả ra bảng Mail_Log
 */
function docThuEmailVaoMailLog() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var mailLogSheet = ss.getSheetByName(SHEET_MAIL_LOG);

    // 1. Khởi tạo hoặc làm sạch trang tính Mail_Log
    if (!mailLogSheet) {
      mailLogSheet = ss.insertSheet(SHEET_MAIL_LOG);
    } else {
      mailLogSheet.clear(); // Làm sạch dữ liệu cũ để cập nhật mới nhất
    }

    mailLogSheet.showSheet();

    // 2. Thiết lập kích thước hàng và độ rộng cột tối ưu
    mailLogSheet.setRowHeight(1, 35); // Dòng banner
    mailLogSheet.setRowHeight(2, 28); // Dòng tiêu đề cột

    mailLogSheet.setColumnWidth(COL_LOG_STT + 1, 50);     // STT
    mailLogSheet.setColumnWidth(COL_LOG_DATE + 1, 100);   // Ngày GD
    mailLogSheet.setColumnWidth(COL_LOG_MONTH + 1, 90);   // Tháng/Năm
    mailLogSheet.setColumnWidth(COL_LOG_CODE + 1, 140);   // Mã GD
    mailLogSheet.setColumnWidth(COL_LOG_TYPE + 1, 80);    // Loại GD
    mailLogSheet.setColumnWidth(COL_LOG_AMOUNT + 1, 130); // Số Tiền
    mailLogSheet.setColumnWidth(COL_LOG_PERSON + 1, 200); // Người Liên Quan
    mailLogSheet.setColumnWidth(COL_LOG_CHANNEL + 1, 150);// Kênh Thanh Toán
    mailLogSheet.setColumnWidth(COL_LOG_DESC + 1, 260);   // Nội Dung
    mailLogSheet.setColumnWidth(COL_LOG_STATUS + 1, 110); // Trạng Thái Nạp

    // Tiêu đề Banner Dòng 1 (A1:J1)
    var banner = mailLogSheet.getRange("A1:J1");
    banner.merge();
    banner.setValue("NHẬT KÝ QUÉT EMAIL BIÊN LAI NGÂN HÀNG (MAIL_LOG)");
    banner.setBackground("#0f4c81")
          .setFontColor("#ffffff")
          .setFontFamily("Arial")
          .setFontSize(12)
          .setFontWeight("bold")
          .setHorizontalAlignment("center")
          .setVerticalAlignment("middle");

    // Tiêu đề các cột Dòng 2 (A2:J2)
    var headers = [
      ["STT", "Ngày GD", "Tháng/Năm", "Mã GD", "Loại GD", "Số Tiền", "Người Liên Quan", "Kênh Thanh Toán", "Nội Dung", "Trạng Thái Nạp"]
    ];
    var headerRange = mailLogSheet.getRange("A2:J2");
    headerRange.setValues(headers)
               .setBackground("#e8f0fe")
               .setFontColor("#1a73e8")
               .setFontFamily("Arial")
               .setFontSize(10)
               .setFontWeight("bold")
               .setHorizontalAlignment("center")
               .setVerticalAlignment("middle");

    // 3. Tìm kiếm email có tiêu đề chứa "Biên lai chuyển tiền" hoặc "BIDV" trong Gmail
    var searchQuery = 'subject:"Biên lai chuyển tiền" OR subject:"BIDV"';
    var threads = GmailApp.search(searchQuery, 0, 50); // Quét tối đa 50 luồng email mới nhất

    var outputData = [];
    var stt = 1;

    // 4. Duyệt qua từng email và bóc tách dữ liệu chuẩn BIDV
    for (var i = 0; i < threads.length; i++) {
      var messages = threads[i].getMessages();
      for (var j = 0; j < messages.length; j++) {
        var msg = messages[j];
        var subject = msg.getSubject();
        var body = msg.getPlainBody();
        var dateReceived = msg.getDate();

        // Bóc tách thông tin giao dịch theo đúng cấu trúc thực tế BIDV
        var parsedInfo = bocTachEmailBIDV(subject, body, dateReceived, msg.getId());

        var row = new Array(10);
        row[COL_LOG_STT]     = stt++;
        row[COL_LOG_DATE]    = parsedInfo.ngayGD;
        row[COL_LOG_MONTH]   = parsedInfo.thangNam;
        row[COL_LOG_CODE]    = parsedInfo.maGD;
        row[COL_LOG_TYPE]    = parsedInfo.loaiGD;
        row[COL_LOG_AMOUNT]  = parsedInfo.soTien;
        row[COL_LOG_PERSON]  = parsedInfo.nguoiLienQuan;
        row[COL_LOG_CHANNEL] = parsedInfo.kenhThanhToan;
        row[COL_LOG_DESC]    = parsedInfo.noiDung;
        row[COL_LOG_STATUS]  = "Chưa nạp";

        outputData.push(row);
      }
    }

    // 5. Ghi hàng loạt (Batch Operations) vào bảng Mail_Log
    if (outputData.length > 0) {
      var dataRange = mailLogSheet.getRange(3, 1, outputData.length, 10);
      dataRange.setValues(outputData)
               .setFontFamily("Arial")
               .setFontSize(10)
               .setVerticalAlignment("middle");

      // Định dạng căn lề và số tiền
      mailLogSheet.getRange(3, COL_LOG_STT + 1, outputData.length, 1).setHorizontalAlignment("center");
      mailLogSheet.getRange(3, COL_LOG_DATE + 1, outputData.length, 4).setHorizontalAlignment("center");
      mailLogSheet.getRange(3, COL_LOG_AMOUNT + 1, outputData.length, 1)
                  .setNumberFormat('#,##0 "₫"')
                  .setHorizontalAlignment("right");
      mailLogSheet.getRange(3, COL_LOG_PERSON + 1, outputData.length, 3).setHorizontalAlignment("left");
      mailLogSheet.getRange(3, COL_LOG_STATUS + 1, outputData.length, 1).setHorizontalAlignment("center");

      // Kẻ khung viền toàn bảng
      mailLogSheet.getRange(2, 1, outputData.length + 1, 10)
                  .setBorder(true, true, true, true, true, true, "#dadce0", SpreadsheetApp.BorderStyle.SOLID);
    }

    SpreadsheetApp.flush();

    // 6. Báo cáo số lượng email đọc được cho người dùng
    var thongBao = "Đã quét xong Gmail!\nTìm thấy: " + outputData.length + " email biên lai giao dịch.";
    Logger.log(thongBao);

    try {
      var ui = SpreadsheetApp.getUi();
      ui.alert(
        "KẾT QUẢ QUÉT EMAIL BIÊN LAI",
        thongBao + (outputData.length > 0 ? "\n\nDữ liệu đã được trích xuất vào trang tính 'Mail_Log' để bạn kiểm tra." : "\n\nKhông có email biên lai chuyển tiền mới nào."),
        ui.ButtonSet.OK
      );
    } catch (e) {
      Logger.log("Chạy trong môi trường không có UI: " + e.toString());
    }

    return {
      success: true,
      totalEmails: outputData.length,
      data: outputData
    };
  } catch (err) {
    Logger.log("Lỗi trong docThuEmailVaoMailLog: " + err.toString());
    try {
      SpreadsheetApp.getUi().alert("LỖI XỬ LÝ", "Không thể quét email: " + err.message, SpreadsheetApp.getUi().ButtonSet.OK);
    } catch (e) {}
    return { success: false, error: err.toString() };
  }
}

/**
 * ==============================================================================
 * BỘ PHÂN TÍCH VÀ BÓC TÁCH EMAIL BIDV CHUẨN XÁC (BIDV MULTI-LINE PARSER)
 * ==============================================================================
 */
function bocTachEmailBIDV(subject, body, dateReceived, messageId) {
  // 1. Ngày & Tháng/Năm giao dịch (Bóc tách từ mẫu "10:10 Thứ Năm 15/01/2026")
  var ngayStr = Utilities.formatDate(dateReceived, "GMT+7", "dd/MM/yyyy");
  var thangNamStr = Utilities.formatDate(dateReceived, "GMT+7", "MM/yyyy");

  var dateMatch = body.match(/Ngày,\s*giờ\s*giao\s*dịch[\s:\r\n]+(?:[\d:]+)?\s*(?:Thứ\s+[^\d\r\n]+)?\s*(\d{1,2}\/\d{1,2}\/\d{4})/i);
  if (!dateMatch || !dateMatch[1]) {
    dateMatch = body.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
  }
  if (dateMatch && dateMatch[1]) {
    ngayStr = dateMatch[1].trim();
    var parts = ngayStr.split("/");
    if (parts.length === 3) {
      var month = parts[1].length === 1 ? "0" + parts[1] : parts[1];
      thangNamStr = month + "/" + parts[2];
    }
  }

  // 2. Mã số lệnh giao dịch (Bóc tách từ "Số lệnh giao dịch: 19582014632")
  var maGD = "1849201" + messageId.substring(0, 4);
  var codeMatch = body.match(/Số lệnh giao dịch[\s:\r\n]+([0-9A-Za-z]+)/i);
  if (!codeMatch || !codeMatch[1]) {
    codeMatch = subject.match(/(?:Lệnh GD|Số lệnh)[\s:\-]+([0-9A-Za-z]+)/i);
  }
  if (codeMatch && codeMatch[1]) {
    maGD = codeMatch[1].trim();
  }

  // 3. Phân loại giao dịch (Thu / Chi - Đọc từ ô 'Loại giao dịch' trong bảng)
  var loaiGD = "Chi"; // Mặc định là Chi nếu không tìm thấy
  var typeMatch = body.match(/Loại giao dịch[\s:\r\n]+([^\r\n]+)/i);
  if (typeMatch && typeMatch[1]) {
    var rawType = typeMatch[1].trim().toLowerCase();
    if (rawType.indexOf("thu") !== -1 || rawType.indexOf("nhận tiền") !== -1 || rawType.indexOf("hoàn tiền") !== -1) {
      loaiGD = "Thu";
    }
  } else if (/Nhận tiền\s*\/\s*Thu/i.test(body) || /\bThu\b/i.test(body)) {
    loaiGD = "Thu";
  }

  // 4. Số tiền giao dịch (Bóc tách từ "Số tiền: 320,000 VND")
  var soTien = 0;
  var amountMatch = body.match(/Số tiền[\s:\r\n]+([0-9\.,]+)\s*(?:VND|VNĐ|đ)?/i);
  if (!amountMatch || !amountMatch[1]) {
    amountMatch = body.match(/([0-9]{1,3}(?:[.,][0-9]{3})+)\s*(?:VND|VNĐ|đ)/i);
  }
  if (amountMatch && amountMatch[1]) {
    var cleanNum = amountMatch[1].replace(/[^0-9]/g, "");
    soTien = Number(cleanNum) || 0;
  }

  // 5. Người liên quan (Đối tác): Thu -> Người chuyển tiền, Chi -> Người nhận tiền
  var nguoiLienQuan = "Chưa xác định";
  if (loaiGD === "Thu") {
    var remMatch = body.match(/Người chuyển tiền[\s:\r\n]+([^\r\n]+)/i);
    if (remMatch && remMatch[1]) {
      nguoiLienQuan = remMatch[1].trim();
    }
  } else {
    var benMatch = body.match(/Người nhận tiền[\s:\r\n]+([^\r\n]+)/i);
    if (benMatch && benMatch[1]) {
      nguoiLienQuan = benMatch[1].trim();
    }
  }

  // 6. Kênh thanh toán (Bóc tách từ "Kênh thanh toán: Thẻ ngân hàng (BIDV)")
  var kenhThanhToan = "Chuyển khoản (BIDV)";
  var channelMatch = body.match(/Kênh thanh toán[\s:\r\n]+([^\r\n]+)/i);
  if (channelMatch && channelMatch[1]) {
    kenhThanhToan = channelMatch[1].trim();
  }

  // 7. Nội dung chuyển tiền (Bóc tách từ "Nội dung chuyển tiền: Hoan tien cashback...")
  var noiDung = "Chuyển tiền qua BIDV";
  var descMatch = body.match(/Nội dung chuyển tiền[\s:\r\n]+([^\r\n]+)/i);
  if (descMatch && descMatch[1]) {
    noiDung = descMatch[1].trim();
  } else if (subject) {
    noiDung = subject.replace(/BIDV|Biên lai chuyển tiền(?:\s*thành công)?[\s:\-]*/gi, "").trim() || "Chuyển tiền qua BIDV";
  }

  return {
    ngayGD: ngayStr,
    thangNam: thangNamStr,
    maGD: maGD,
    loaiGD: loaiGD,
    soTien: soTien,
    nguoiLienQuan: nguoiLienQuan,
    kenhThanhToan: kenhThanhToan,
    noiDung: noiDung
  };
}

/**
 * Hàm bí danh phục vụ liên kết từ thanh Menu (File 1_Menu_ThuChi.gs)
 */
function quetVaGhiMailLog() {
  docThuEmailVaoMailLog();
}