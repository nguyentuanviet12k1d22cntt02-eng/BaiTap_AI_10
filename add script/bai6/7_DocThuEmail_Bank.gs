/**
 * ==============================================================================
 * HỆ THỐNG QUẢN LÝ THU CHI TỰ ĐỘNG (GMAIL & GOOGLE SHEETS)
 * File: 7_DocThuEmail_Bank.gs
 * Chức năng: Quét email biên lai chuyển tiền từ Gmail (BIDV, Vietcombank, Techcombank),
 *            bóc tách chuẩn xác 14 trường dữ liệu và xuất bảng kiểm tra "Mail_Log".
 * ==============================================================================
 */

// Hằng số tên trang tính
var SHEET_MAIL_LOG = "Mail_Log";

// BẮT BUỘC KHAI BÁO HẰNG SỐ CHỈ MỤC CỘT (0-Indexed) CHO BẢNG MAIL_LOG
var COL_LOG_STT       = 0;  // Cột A: STT
var COL_LOG_DATE      = 1;  // Cột B: Ngày GD (DD/MM/YYYY)
var COL_LOG_MONTH     = 2;  // Cột C: Tháng/Năm (MM/YYYY)
var COL_LOG_CODE      = 3;  // Cột D: Mã GD (Số lệnh giao dịch)
var COL_LOG_TYPE      = 4;  // Cột E: Loại GD (Thu / Chi)
var COL_LOG_CATEGORY  = 5;  // Cột F: Nhóm Chi Tiêu
var COL_LOG_DESC      = 6;  // Cột G: Mô Tả Giao Dịch
var COL_LOG_PERSON    = 7;  // Cột H: Người Liên Quan (Đối tác)
var COL_LOG_CHANNEL   = 8;  // Cột I: Kênh Thanh Toán
var COL_LOG_AMOUNT    = 9;  // Cột J: Số Tiền
var COL_LOG_VAT       = 10; // Cột K: VAT (%)
var COL_LOG_TOTAL     = 11; // Cột L: Tổng Sau Thuế
var COL_LOG_STATUS    = 12; // Cột M: Trạng Thái Nạp
var COL_LOG_NOTE      = 13; // Cột N: Ghi Chú Đối Soát

/**
 * Hàm chính: Quét email biên lai ngân hàng từ Gmail và xuất kết quả ra bảng Mail_Log
 */
function docThuEmailVaoMailLog() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var mailLogSheet = ss.getSheetByName(SHEET_MAIL_LOG);

    // 1. Khởi tạo hoặc làm sạch trang tính Mail_Log
    if (!mailLogSheet) {
      mailLogSheet = ss.insertSheet(SHEET_MAIL_LOG);
    } else {
      mailLogSheet.clear();
    }

    mailLogSheet.showSheet();

    // 2. Thiết lập kích thước hàng và độ rộng các cột
    mailLogSheet.setRowHeight(1, 35); // Banner
    mailLogSheet.setRowHeight(2, 28); // Tiêu đề cột

    mailLogSheet.setColumnWidth(COL_LOG_STT + 1, 45);       // STT
    mailLogSheet.setColumnWidth(COL_LOG_DATE + 1, 95);      // Ngày GD
    mailLogSheet.setColumnWidth(COL_LOG_MONTH + 1, 85);     // Tháng/Năm
    mailLogSheet.setColumnWidth(COL_LOG_CODE + 1, 135);     // Mã GD
    mailLogSheet.setColumnWidth(COL_LOG_TYPE + 1, 75);      // Loại GD
    mailLogSheet.setColumnWidth(COL_LOG_CATEGORY + 1, 120); // Nhóm Chi Tiêu
    mailLogSheet.setColumnWidth(COL_LOG_DESC + 1, 260);     // Mô Tả
    mailLogSheet.setColumnWidth(COL_LOG_PERSON + 1, 200);   // Người Liên Quan
    mailLogSheet.setColumnWidth(COL_LOG_CHANNEL + 1, 170);  // Kênh Thanh Toán
    mailLogSheet.setColumnWidth(COL_LOG_AMOUNT + 1, 120);   // Số Tiền
    mailLogSheet.setColumnWidth(COL_LOG_VAT + 1, 70);       // VAT (%)
    mailLogSheet.setColumnWidth(COL_LOG_TOTAL + 1, 120);    // Tổng Sau Thuế
    mailLogSheet.setColumnWidth(COL_LOG_STATUS + 1, 100);   // Trạng Thái Nạp
    mailLogSheet.setColumnWidth(COL_LOG_NOTE + 1, 200);     // Ghi Chú

    // Tiêu đề Banner Dòng 1 (A1:N1)
    var banner = mailLogSheet.getRange("A1:N1");
    banner.merge();
    banner.setValue("NHẬT KÝ QUÉT VÀ BÓC TÁCH EMAIL BIÊN LAI NGÂN HÀNG (MAIL_LOG)");
    banner.setBackground("#0f4c81")
          .setFontColor("#ffffff")
          .setFontFamily("Arial")
          .setFontSize(12)
          .setFontWeight("bold")
          .setHorizontalAlignment("center")
          .setVerticalAlignment("middle");

    // Tiêu đề các cột Dòng 2 (A2:N2)
    var headers = [
      [
        "STT", "Ngày GD", "Tháng/Năm", "Mã GD", "Loại GD", 
        "Nhóm Chi Tiêu", "Mô Tả", "Người Liên Quan", "Kênh Thanh Toán", 
        "Số Tiền", "VAT (%)", "Tổng Sau Thuế", "Trạng Thái Nạp", "Ghi Chú"
      ]
    ];
    var headerRange = mailLogSheet.getRange("A2:N2");
    headerRange.setValues(headers)
               .setBackground("#e8f0fe")
               .setFontColor("#1a73e8")
               .setFontFamily("Arial")
               .setFontSize(10)
               .setFontWeight("bold")
               .setHorizontalAlignment("center")
               .setVerticalAlignment("middle");

    // 3. Tìm kiếm email biên lai chuyển tiền trong Gmail
    var searchQuery = 'subject:"Biên lai chuyển tiền" OR subject:"BIDV"';
    var threads = GmailApp.search(searchQuery, 0, 50);

    var outputData = [];
    var stt = 1;

    // 4. Duyệt qua từng email và bóc tách dữ liệu
    for (var i = 0; i < threads.length; i++) {
      var messages = threads[i].getMessages();
      for (var j = 0; j < messages.length; j++) {
        var msg = messages[j];
        var subject = msg.getSubject();
        var dateReceived = msg.getDate();

        // Đọc mã HTML gốc và chuyển đổi sang văn bản sạch có cấu trúc
        var rawHtml = msg.getBody();
        var fullText = chuyenDoiHtmlSangVanBan(rawHtml);
        if (!fullText || fullText.trim() === "") {
          fullText = msg.getPlainBody();
        }

        // Bóc tách dữ liệu chuẩn xác
        var parsedInfo = bocTachDuLieuBienLaiChuan(subject, fullText, dateReceived, msg.getId());

        var row = new Array(14);
        row[COL_LOG_STT]      = stt++;
        row[COL_LOG_DATE]     = parsedInfo.ngayGD;
        row[COL_LOG_MONTH]    = parsedInfo.thangNam;
        row[COL_LOG_CODE]     = parsedInfo.maGD;
        row[COL_LOG_TYPE]     = parsedInfo.loaiGD;
        row[COL_LOG_CATEGORY] = parsedInfo.nhomChiTieu;
        row[COL_LOG_DESC]     = parsedInfo.moTa;
        row[COL_LOG_PERSON]   = parsedInfo.nguoiLienQuan;
        row[COL_LOG_CHANNEL]  = parsedInfo.kenhThanhToan;
        row[COL_LOG_AMOUNT]   = parsedInfo.soTien;
        row[COL_LOG_VAT]      = parsedInfo.vatRate;
        row[COL_LOG_TOTAL]    = parsedInfo.tongSauThue;
        row[COL_LOG_STATUS]   = "Chưa nạp";
        row[COL_LOG_NOTE]     = parsedInfo.ghiChu;

        outputData.push(row);
      }
    }

    // 5. Ghi hàng loạt (Batch Operations) vào bảng Mail_Log
    if (outputData.length > 0) {
      var dataRange = mailLogSheet.getRange(3, 1, outputData.length, 14);
      dataRange.setValues(outputData)
               .setFontFamily("Arial")
               .setFontSize(10)
               .setVerticalAlignment("middle");

      // Căn lề
      mailLogSheet.getRange(3, COL_LOG_STT + 1, outputData.length, 1).setHorizontalAlignment("center");
      mailLogSheet.getRange(3, COL_LOG_DATE + 1, outputData.length, 4).setHorizontalAlignment("center");
      mailLogSheet.getRange(3, COL_LOG_CATEGORY + 1, outputData.length, 4).setHorizontalAlignment("left");
      mailLogSheet.getRange(3, COL_LOG_AMOUNT + 1, outputData.length, 1).setHorizontalAlignment("right");
      mailLogSheet.getRange(3, COL_LOG_VAT + 1, outputData.length, 1).setHorizontalAlignment("center");
      mailLogSheet.getRange(3, COL_LOG_TOTAL + 1, outputData.length, 1).setHorizontalAlignment("right");
      mailLogSheet.getRange(3, COL_LOG_STATUS + 1, outputData.length, 1).setHorizontalAlignment("center");
      mailLogSheet.getRange(3, COL_LOG_NOTE + 1, outputData.length, 1).setHorizontalAlignment("left");

      // Định dạng tiền tệ và phần trăm
      mailLogSheet.getRange(3, COL_LOG_AMOUNT + 1, outputData.length, 1).setNumberFormat('#,##0 "₫"');
      mailLogSheet.getRange(3, COL_LOG_VAT + 1, outputData.length, 1).setNumberFormat("0.00%");
      mailLogSheet.getRange(3, COL_LOG_TOTAL + 1, outputData.length, 1).setNumberFormat('#,##0 "₫"');

      // Kẻ khung viền toàn bảng
      mailLogSheet.getRange(2, 1, outputData.length + 1, 14)
                  .setBorder(true, true, true, true, true, true, "#dadce0", SpreadsheetApp.BorderStyle.SOLID);
    }

    SpreadsheetApp.flush();

    // 6. Báo cáo kết quả cho người dùng
    var thongBao = "Đã quét xong Gmail!\nTìm thấy: " + outputData.length + " email biên lai giao dịch.";
    Logger.log(thongBao);

    try {
      var ui = SpreadsheetApp.getUi();
      ui.alert(
        "KẾT QUẢ QUÉT EMAIL BIÊN LAI",
        thongBao + (outputData.length > 0 ? "\n\nDữ liệu đã được bóc tách hoàn chỉnh 14 cột vào bảng 'Mail_Log'." : "\n\nKhông có email biên lai chuyển tiền mới nào."),
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
 * HÀM CHUYỂN ĐỔI MÃ HTML EMAIL SANG VĂN BẢN CÓ PHÂN CÁCH RÕ RÀNG
 * ==============================================================================
 */
function chuyenDoiHtmlSangVanBan(html) {
  if (!html || typeof html !== "string") return "";

  return html
    .replace(/<style([\s\S]*?)<\/style>/gi, "")
    .replace(/<script([\s\S]*?)<\/script>/gi, "")
    .replace(/<\/tr>|<\/div>|<\/p>|<br\s*[\/]?>/gi, "\n")
    .replace(/<\/td>|<\/th>/gi, " : ")
    .replace(/<[^>]+>/gi, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

/**
 * ==============================================================================
 * HÀM TRÍCH XUẤT CHUỖI REGEX AN TOÀN TUYỆT ĐỐI (TRUY XUẤT ĐÚNG PHẦN TỬ GROUP 1)
 * ==============================================================================
 */
function layGiaTriRegex(chuoi, regex, giaTriMacDinh) {
  if (!chuoi || typeof chuoi !== "string") {
    return (giaTriMacDinh !== undefined) ? giaTriMacDinh : "";
  }
  var ketQua = chuoi.match(regex);
  // BẮT BUỘC: Kiểm tra và chỉ lấy phần tử chuỗi nhóm 1 ketQua[1]
  if (ketQua && ketQua.length > 1 && ketQua[1] !== undefined && ketQua[1] !== null) {
    return String(ketQua[1]).trim();
  }
  return (giaTriMacDinh !== undefined) ? giaTriMacDinh : "";
}

/**
 * ==============================================================================
 * BỘ PHÂN TÍCH VÀ BÓC TÁCH DỮ LIỆU BIÊN LAI ĐA NGÂN HÀNG CHUẨN XÁC
 * ==============================================================================
 */
function bocTachDuLieuBienLaiChuan(subject, fullText, dateReceived, messageId) {
  // 1. Ngày GD (Cột A) & Tháng/Năm (Cột B)
  var rawDate = layGiaTriRegex(fullText, /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/, "");
  var ngayStr = rawDate ? rawDate.replace(/[\-\.]/g, "/") : Utilities.formatDate(dateReceived, "GMT+7", "dd/MM/yyyy");
  
  var parts = ngayStr.split("/");
  var thangNamStr = (parts.length === 3) 
    ? ((parts[1].length === 1 ? "0" + parts[1] : parts[1]) + "/" + parts[2]) 
    : Utilities.formatDate(dateReceived, "GMT+7", "MM/yyyy");

  // 2. Mã số lệnh giao dịch (Cột D)
  var maGD = layGiaTriRegex(fullText, /Số lệnh(?: giao dịch)?(?: [^:]*)?:\s*([0-9A-Za-z]+)/i, "");
  if (!maGD) {
    maGD = layGiaTriRegex(subject, /(?:Lệnh GD|Số lệnh)[\s:\-]+([0-9A-Za-z]+)/i, "");
  }
  if (!maGD) {
    maGD = "GD" + messageId.substring(0, 8).toUpperCase();
  }

  // 3. Loại giao dịch (Cột C)
  var rawType = layGiaTriRegex(fullText, /Loại giao dịch(?: [^:]*)?:\s*([^:]+?)(?:\s*:|$)/i, "");
  var loaiGD = "Chi";
  if (/Thu|Nhận tiền/i.test(rawType) || /Loại giao dịch:\s*Nhận tiền/i.test(fullText)) {
    loaiGD = "Thu";
  }

  // 4. Người liên quan (Cột H)
  var nguoiLienQuan = "Chưa xác định";
  if (loaiGD === "Chi") {
    // Chi: Lấy Tên người nhận tiền / Beneficiary Name
    nguoiLienQuan = layGiaTriRegex(fullText, /(?:Tên người nhận tiền|Người nhận tiền|Beneficiary Name)(?: [^:]*)?:\s*([^:]+?)(?:\s*:|$)/i, "Chưa xác định");
  } else {
    // Thu: Lấy Người chuyển tiền / Remitter's name
    nguoiLienQuan = layGiaTriRegex(fullText, /(?:Tên người chuyển tiền|Người chuyển tiền|Remitter's name)(?: [^:]*)?:\s*([^:]+?)(?:\s*:|$)/i, "Chưa xác định");
  }

  // 5. Kênh thanh toán (Cột I)
  var kenhThanhToan = layGiaTriRegex(fullText, /Kênh thanh toán(?: [^:]*)?:\s*([^:]+?)(?:\s*:|$)/i, "");
  if (!kenhThanhToan) {
    if (/Techcombank/i.test(subject) || /Techcombank/i.test(fullText)) kenhThanhToan = "Chuyển khoản (Techcombank)";
    else if (/Vietcombank/i.test(subject) || /Vietcombank/i.test(fullText)) kenhThanhToan = "Chuyển khoản (Vietcombank)";
    else if (/Thẻ ngân hàng/i.test(fullText)) kenhThanhToan = "Thẻ ngân hàng (BIDV)";
    else kenhThanhToan = "Chuyển khoản (BIDV)";
  }

  // 6. Mô tả / Nội dung chuyển tiền (Cột G)
  var moTa = layGiaTriRegex(fullText, /Nội dung(?: chuyển tiền)?(?: [^:]*)?:\s*([^:]+?)(?:\s*:|Cảm ơn|$)/i, "");
  if (!moTa) {
    moTa = "Chuyển tiền qua " + kenhThanhToan;
  }

  // 7. Số tiền (Cột J)
  var rawAmount = layGiaTriRegex(fullText, /Số tiền(?: chi)?(?: [^:]*)?:\s*([0-9\.,]+)/i, "0");
  var cleanNum = String(rawAmount).replace(/[^0-9]/g, "");
  var soTien = Number(cleanNum) || 0;

  // 8. Tự động phân loại Nhóm Chi Tiêu (Cột F) theo 8 nhóm chuẩn sổ quỹ
  var nhomChiTieu = phanLoaiNhomChiTieuTuDong(moTa, nguoiLienQuan, loaiGD);

  // 9. Thuế VAT và Tổng Sau Thuế (Cột K & L)
  var vatRate = 0.0;
  var tongSauThue = Math.round(soTien * (1 + vatRate));

  // 10. Ghi chú đối soát (Cột N)
  var ghiChu = "Số lệnh: " + maGD;

  return {
    ngayGD: ngayStr,
    thangNam: thangNamStr,
    maGD: maGD,
    loaiGD: loaiGD,
    nhomChiTieu: nhomChiTieu,
    moTa: moTa,
    nguoiLienQuan: nguoiLienQuan,
    kenhThanhToan: kenhThanhToan,
    soTien: soTien,
    vatRate: vatRate,
    tongSauThue: tongSauThue,
    ghiChu: ghiChu
  };
}

/**
 * ==============================================================================
 * BỘ PHÂN LOẠI DANH MỤC CHI TIÊU TỰ ĐỘNG THEO 8 NHÓM CHUẨN SỔ QUỸ
 * ==============================================================================
 */
function phanLoaiNhomChiTieuTuDong(moTa, nguoiLienQuan, loaiGD) {
  var text = (String(moTa || "") + " " + String(nguoiLienQuan || "")).toLowerCase();

  // Luồng Thu: Gán vào Khác để khớp với danh mục trên bảng tính
  if (loaiGD === "Thu") {
    return "Khác";
  }

  // Luồng Chi: Phân vào đúng 8 nhóm chuẩn
  if (/tra sua|trà sữa|cafe|cà phê|phuc long|highlands|bún|phở|cơm|ăn|uống|pizza|nhà hàng|quán|buffet|thực phẩm|sen tay ho|an tiec/i.test(text)) {
    return "Ăn uống";
  }
  if (/xăng|petrolimex|shell|pv oil|grab|be|gojek|vé xe|gửi xe|bảo dưỡng|sửa xe|vé máy bay/i.test(text)) {
    return "Đi lại";
  }
  if (/tiền nhà|tiền điện|tiền nước|evn|dien luc|điện lực|internet|viettel|fpt|chung cư|vệ sinh|rác/i.test(text)) {
    return "Nhà ở";
  }
  if (/siêu thị|coopmart|winmart|vinmart|shopee|lazada|tiki|quần áo|mua sắm|thời trang|giày|dép/i.test(text)) {
    return "Mua sắm";
  }
  if (/khám|thuốc|bệnh viện|medlatec|nhà thuốc|pharmacity|long châu|nha khoa/i.test(text)) {
    return "Y tế";
  }
  if (/học|khoá học|khóa học|udemy|coursera|sách|học phí|tiếng anh|python/i.test(text)) {
    return "Học tập";
  }
  if (/xem phim|cgv|lotte|bhd|netflix|spotify|du lịch|vé tham quan|game/i.test(text)) {
    return "Giải trí";
  }

  return "Khác";
}

/**
 * Hàm bí danh phục vụ liên kết từ thanh Menu (File 1_Menu_ThuChi.gs)
 */
function quetVaGhiMailLog() {
  docThuEmailVaoMailLog();
}