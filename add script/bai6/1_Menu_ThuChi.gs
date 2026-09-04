/**
 * ==============================================================================
 * HỆ THỐNG QUẢN LÝ THU CHI TỰ ĐỘNG (GMAIL & GOOGLE SHEETS)
 * File: 1_Menu_ThuChi.gs
 * Chức năng: Khởi tạo thanh Menu "Quản Lý Thu Chi", quản lý Trigger và điều hướng an toàn.
 * ==============================================================================
 */

// Tên hàm xử lý chạy ngầm định kỳ qua Time-driven Trigger
var TRIGGER_FUNCTION_NAME = "tuDongQuetEmailVaNapSoQuy";

/**
 * Hàm tự động kích hoạt khi mở bảng tính Google Sheets để tạo Menu điều khiển.
 * @param {Object} e Event object khi mở bảng tính.
 */
function onOpen(e) {
  try {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu("Quản Lý Thu Chi")
      .addItem("1. Dashboard Sổ Quỹ", "menuMoDashboard")
      .addSeparator()
      .addItem("2. Đọc Thử Email Ra Bảng Mail_Log (kiểm tra trước khi nạp)", "menuDocThuEmail")
      .addItem("3. Nạp Giao Dịch Vào Sổ Quỹ Giao_Dich", "menuNapGiaoDichVaoSoQuy")
      .addSeparator()
      .addItem("4. Bật Tự Động Quét Email (Mỗi 5 Phút)", "menuBatTuDongQuetEmail")
      .addItem("5. Tắt Tự Động Quét Email", "menuTatTuDongQuetEmail")
      .addSeparator()
      .addItem("6. Nhập Giao Dịch Thu Chi Thủ Công", "menuNhapGiaoDichThuCong")
      .addSeparator()
      .addItem("7. Hướng Dẫn Sử Dụng", "menuHuongDanSuDung")
      .addToUi();
  } catch (err) {
    Logger.log("Lỗi khởi tạo Menu onOpen: " + err.toString());
  }
}

/**
 * 1. Điều hướng: Mở / Cập nhật Dashboard Sổ Quỹ
 */
function menuMoDashboard() {
  try {
    if (typeof moDashboardSoQuy === "function") {
      moDashboardSoQuy();
    } else if (typeof taoHoacCapNhatDashboard === "function") {
      taoHoacCapNhatDashboard();
    } else {
      thongBaoChuaCoModule("Dashboard Sổ Quỹ", "File chứa mã tạo Dashboard sẽ được tích hợp ở các bước tiếp theo.");
    }
  } catch (err) {
    hienThiLoiAnToan("Lỗi khi mở Dashboard Sổ Quỹ", err);
  }
}

/**
 * 2. Điều hướng: Đọc thử email bóc tách dữ liệu vào sheet Mail_Log
 */
function menuDocThuEmail() {
  try {
    if (typeof docThuEmailVaoMailLog === "function") {
      docThuEmailVaoMailLog();
    } else if (typeof quetVaGhiMailLog === "function") {
      quetVaGhiMailLog();
    } else {
      thongBaoChuaCoModule("Đọc Thử Email Ra Mail_Log", "File xử lý bóc tách Gmail sẽ được tích hợp ở các bước tiếp theo.");
    }
  } catch (err) {
    hienThiLoiAnToan("Lỗi khi đọc thử Email", err);
  }
}

/**
 * 3. Điều hướng: Nạp giao dịch từ Mail_Log vào Sổ Quỹ Giao_Dich
 */
function menuNapGiaoDichVaoSoQuy() {
  try {
    if (typeof napMailLogVaoGiaoDich === "function") {
      napMailLogVaoGiaoDich();
    } else if (typeof dongBoGiaoDichTuMail === "function") {
      dongBoGiaoDichTuMail();
    } else {
      thongBaoChuaCoModule("Nạp Giao Dịch Vào Sổ Quỹ", "File xử lý chuyển đổi dữ liệu vào Giao_Dich sẽ được tích hợp ở các bước tiếp theo.");
    }
  } catch (err) {
    hienThiLoiAnToan("Lỗi khi nạp giao dịch vào Sổ Quỹ", err);
  }
}

/**
 * 4. Quản lý Trigger: Bật tự động quét email mỗi 5 phút (Chống trùng lặp trigger)
 */
function menuBatTuDongQuetEmail() {
  try {
    var triggers = ScriptApp.getProjectTriggers();
    // Xóa tất cả các trigger cũ của hàm quét email để tránh lặp vô hạn
    for (var i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() === TRIGGER_FUNCTION_NAME) {
        ScriptApp.deleteTrigger(triggers[i]);
      }
    }

    // Tạo Trigger mới định kỳ 5 phút một lần
    ScriptApp.newTrigger(TRIGGER_FUNCTION_NAME)
      .timeBased()
      .everyMinutes(5)
      .create();

    try {
      SpreadsheetApp.getUi().alert(
        "KÍCH HOẠT THÀNH CÔNG",
        "Đã bật chế độ tự động quét email mỗi 5 phút một lần.\nHệ thống sẽ tự động bóc tách hóa đơn/biên lai và đồng bộ vào sổ quỹ.",
        SpreadsheetApp.getUi().ButtonSet.OK
      );
    } catch (e) {
      Logger.log("Chạy trong môi trường không có UI: " + e.toString());
    }
  } catch (err) {
    hienThiLoiAnToan("Lỗi khi bật Trigger tự động quét Email", err);
  }
}

/**
 * 5. Quản lý Trigger: Tắt tự động quét email
 */
function menuTatTuDongQuetEmail() {
  try {
    var triggers = ScriptApp.getProjectTriggers();
    var count = 0;
    for (var i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() === TRIGGER_FUNCTION_NAME) {
        ScriptApp.deleteTrigger(triggers[i]);
        count++;
      }
    }

    try {
      var ui = SpreadsheetApp.getUi();
      if (count > 0) {
        ui.alert("ĐÃ TẮT TỰ ĐỘNG", "Đã xóa toàn bộ " + count + " lịch trình tự động quét email ngầm.", ui.ButtonSet.OK);
      } else {
        ui.alert("THÔNG BÁO", "Hiện tại không có lịch trình tự động nào đang chạy.", ui.ButtonSet.OK);
      }
    } catch (e) {
      Logger.log("Chạy trong môi trường không có UI: " + e.toString());
    }
  } catch (err) {
    hienThiLoiAnToan("Lỗi khi tắt Trigger tự động quét Email", err);
  }
}

/**
 * 6. Điều hướng: Mở biểu mẫu nhập giao dịch thủ công
 */
function menuNhapGiaoDichThuCong() {
  try {
    if (typeof moFormNhapThuCong === "function") {
      moFormNhapThuCong();
    } else if (typeof hienThiSidebarNhapLieu === "function") {
      hienThiSidebarNhapLieu();
    } else {
      thongBaoChuaCoModule("Nhập Giao Dịch Thủ Công", "Biểu mẫu Sidebar nhập liệu sẽ được tích hợp ở các bước tiếp theo.");
    }
  } catch (err) {
    hienThiLoiAnToan("Lỗi khi mở giao diện nhập liệu", err);
  }
}

/**
 * 7. Hiển thị hộp thoại Hướng Dẫn Sử Dụng
 */
function menuHuongDanSuDung() {
  try {
    var htmlContent = 
      '<div style="font-family: Arial, sans-serif; padding: 15px; color: #202124; line-height: 1.6;">' +
        '<h2 style="color: #1a73e8; margin-top: 0;">📘 HƯỚNG DẪN QUẢN LÝ SỔ QUỸ THU CHI</h2>' +
        '<p>Hệ thống hỗ trợ quản lý tài chính tự động thông qua Gmail và Google Sheets:</p>' +
        '<ol style="padding-left: 20px;">' +
          '<li><b>Dashboard Sổ Quỹ:</b> Xem báo cáo tổng quan dòng tiền Thu - Chi, số dư và biểu đồ phân tích.</li>' +
          '<li><b>Đọc Thử Email:</b> Quét các email biên lai/hóa đơn mới nhất từ Gmail và lưu vào bảng tạm <code>Mail_Log</code> để kiểm tra.</li>' +
          '<li><b>Nạp Giao Dịch:</b> Đồng bộ dữ liệu đã kiểm tra từ <code>Mail_Log</code> sang trang <code>Giao_Dich</code>.</li>' +
          '<li><b>Bật/Tắt Tự Động:</b> Thiết lập kích hoạt ngầm quét email mỗi 5 phút một lần.</li>' +
          '<li><b>Nhập Thủ Công:</b> Nhập trực tiếp các khoản thu/chi phát sinh tiền mặt ngoài email.</li>' +
        '</ol>' +
        '<div style="background-color: #f1f3f4; padding: 10px; border-radius: 6px; font-size: 12px; margin-top: 15px;">' +
          '💡 <i>Lưu ý: Đảm bảo cấp quyền truy cập Gmail và Google Sheets đầy đủ trong lần chạy đầu tiên.</i>' +
        '</div>' +
      '</div>';

    var htmlOutput = HtmlService.createHtmlOutput(htmlContent)
      .setWidth(520)
      .setHeight(400);

    SpreadsheetApp.getUi().showModalDialog(htmlOutput, "Hệ Thống Thu Chi Tự Động 2026");
  } catch (err) {
    hienThiLoiAnToan("Lỗi khi mở Hướng dẫn sử dụng", err);
  }
}

/**
 * ==============================================================================
 * CÁC HÀM TRỢ GIÚP KIỂM SOÁT LỖI VÀ AN TOÀN GIAO DIỆN (HELPER FUNCTIONS)
 * ==============================================================================
 */

/**
 * Thông báo khi module nghiệp vụ chưa được khai báo
 * @param {string} tenChucNang Tên chức năng được chọn
 * @param {string} chiTiet Thông tin gợi ý
 */
function thongBaoChuaCoModule(tenChucNang, chiTiet) {
  try {
    var ui = SpreadsheetApp.getUi();
    ui.alert(
      "MODULE ĐANG ĐƯỢC THIẾT LẬP",
      "Chức năng [" + tenChucNang + "] chưa được nạp.\n\n" + chiTiet,
      ui.ButtonSet.OK
    );
  } catch (e) {
    Logger.log("Chưa có module [" + tenChucNang + "]: " + chiTiet);
  }
}

/**
 * Hiển thị lỗi an toàn qua giao diện hoặc ghi log nếu chạy ngầm
 * @param {string} tieuDe Tiêu đề thông báo lỗi
 * @param {Error|Object} err Đối tượng lỗi
 */
function hienThiLoiAnToan(tieuDe, err) {
  var errorMsg = err && err.message ? err.message : err.toString();
  Logger.log(tieuDe + ": " + errorMsg);
  try {
    SpreadsheetApp.getUi().alert(
      "CẢNH BÁO",
      tieuDe + ":\n" + errorMsg,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } catch (e) {
    // Trường hợp không thể hiển thị UI
    Logger.log("Không thể hiển thị UI: " + e.toString());
  }
}