/**
 * ==============================================================================
 * HỆ THỐNG QUẢN LÝ THU CHI TỰ ĐỘNG (GMAIL & GOOGLE SHEETS)
 * File: 2_Dashboard_KPI.gs
 * Chức năng: Khởi tạo giao diện Dashboard Sổ Quỹ, 4 thẻ KPI tài chính và lắng nghe onEdit
 * ==============================================================================
 */

// Hằng số tên trang tính
var SHEET_DASHBOARD = "Dashboard Sổ Quỹ";
var SHEET_GIAO_DICH = "Giao_Dich";

// Hằng số chỉ mục cột của sheet Giao_Dich (0-Indexed)
var COL_GD_DATE     = 0;  // Cột A: Ngày GD
var COL_GD_MONTH    = 1;  // Cột B: Tháng/Năm
var COL_GD_TYPE     = 2;  // Cột C: Loại GD (Thu/Chi)
var COL_GD_CATEGORY = 3;  // Cột D: Nhóm Chi Tiêu
var COL_GD_DESC     = 4;  // Cột E: Mô Tả
var COL_GD_PERSON   = 5;  // Cột F: Người Liên Quan
var COL_GD_CHANNEL  = 6;  // Cột G: Kênh Thanh Toán
var COL_GD_AMOUNT   = 7;  // Cột H: Số Tiền
var COL_GD_VAT      = 8;  // Cột I: VAT (%)
var COL_GD_TOTAL    = 9;  // Cột J: Tổng Sau Thuế
var COL_GD_STATUS   = 10; // Cột K: Trạng Thái
var COL_GD_NOTE     = 11; // Cột L: Ghi Chú

/**
 * Hàm chính: Mở hoặc Tạo mới / Làm mới toàn bộ giao diện Dashboard Sổ Quỹ
 */
function taoHoacCapNhatDashboard() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dashSheet = ss.getSheetByName(SHEET_DASHBOARD);

    // 1. Kiểm tra và khởi tạo Sheet Dashboard
    if (!dashSheet) {
      dashSheet = ss.insertSheet(SHEET_DASHBOARD, 0);
    } else {
      dashSheet.clear(); // Làm sạch nội dung cũ để vẽ lại mới hoàn toàn
    }

    // Đưa sheet Dashboard lên vị trí đầu tiên (Chuẩn API GAS)
    ss.setActiveSheet(dashSheet);
    ss.moveActiveSheet(1);

    // Ẩn đường lưới để Dashboard hiển thị giao diện phẳng hiện đại
    dashSheet.setHiddenGridlines(true);

    // 2. Thiết lập độ rộng cột (8 cột từ A đến H)
    for (var col = 1; col <= 8; col++) {
      dashSheet.setColumnWidth(col, 120);
    }

    // Thiết lập chiều cao các hàng
    dashSheet.setRowHeight(1, 45); // Banner tiêu đề
    dashSheet.setRowHeight(2, 10); // Khoảng cách
    dashSheet.setRowHeight(3, 25); // Thời gian cập nhật
    dashSheet.setRowHeight(4, 15); // Khoảng cách
    dashSheet.setRowHeight(5, 28); // Tiêu đề thẻ KPI
    dashSheet.setRowHeight(6, 42); // Giá trị số thẻ KPI
    dashSheet.setRowHeight(7, 24); // Chú thích thẻ KPI

    // 3. Banner tiêu đề Dòng 1 (A1:H1)
    var bannerRange = dashSheet.getRange("A1:H1");
    bannerRange.merge();
    bannerRange.setValue("SỔ QUỸ THU CHI & QUẢN TRỊ DÒNG TIỀN 2026");
    bannerRange.setBackground("#0f4c81")
               .setFontColor("#ffffff")
               .setFontFamily("Arial")
               .setFontSize(16)
               .setFontWeight("bold")
               .setHorizontalAlignment("center")
               .setVerticalAlignment("middle");

    // 4. Ngày giờ cập nhật tự động Dòng 3 (A3:H3)
    var timeRange = dashSheet.getRange("A3:H3");
    timeRange.merge();
    var nowStr = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
    timeRange.setValue("📅 Cập nhật lần cuối: " + nowStr);
    timeRange.setFontFamily("Arial")
             .setFontSize(10)
             .setFontStyle("italic")
             .setFontColor("#5f6368")
             .setHorizontalAlignment("right")
             .setVerticalAlignment("middle");

    // 5. Xây dựng 4 Thẻ Tổng Quan Tài Chính (KPI Cards - Dòng 5 đến Dòng 7)

    // --- THẺ 1: TỔNG THU (Cột A:B) ---
    var card1Title = dashSheet.getRange("A5:B5");
    card1Title.merge().setValue("💰 TỔNG THU NHẬP");
    card1Title.setBackground("#e6f4ea")
              .setFontColor("#137333")
              .setFontWeight("bold")
              .setFontSize(11)
              .setHorizontalAlignment("center")
              .setVerticalAlignment("middle");

    var card1Val = dashSheet.getRange("A6:B6");
    card1Val.merge();
    // Công thức dải ô mở vô tận chuẩn Locale VN (dùng ;)
    card1Val.setFormula('=SUMIFS(' + SHEET_GIAO_DICH + '!J3:J; ' + SHEET_GIAO_DICH + '!C3:C; "Thu")');
    card1Val.setBackground("#ffffff")
            .setFontColor("#137333")
            .setFontWeight("bold")
            .setFontSize(17)
            .setNumberFormat('#,##0 "₫"')
            .setHorizontalAlignment("center")
            .setVerticalAlignment("middle");

    var card1Sub = dashSheet.getRange("A7:B7");
    card1Sub.merge().setValue("Toàn bộ nguồn thu");
    card1Sub.setBackground("#f8f9fa")
            .setFontColor("#5f6368")
            .setFontStyle("italic")
            .setFontSize(9)
            .setHorizontalAlignment("center")
            .setVerticalAlignment("middle");

    dashSheet.getRange("A5:B7").setBorder(true, true, true, true, false, false, "#ceead6", SpreadsheetApp.BorderStyle.SOLID);

    // --- THẺ 2: TỔNG CHI (Cột C:D) ---
    var card2Title = dashSheet.getRange("C5:D5");
    card2Title.merge().setValue("💸 TỔNG CHI TIÊU");
    card2Title.setBackground("#fce8e6")
              .setFontColor("#c5221f")
              .setFontWeight("bold")
              .setFontSize(11)
              .setHorizontalAlignment("center")
              .setVerticalAlignment("middle");

    var card2Val = dashSheet.getRange("C6:D6");
    card2Val.merge();
    // Công thức dải ô mở vô tận chuẩn Locale VN (dùng ;)
    card2Val.setFormula('=SUMIFS(' + SHEET_GIAO_DICH + '!J3:J; ' + SHEET_GIAO_DICH + '!C3:C; "Chi")');
    card2Val.setBackground("#ffffff")
            .setFontColor("#c5221f")
            .setFontWeight("bold")
            .setFontSize(17)
            .setNumberFormat('#,##0 "₫"')
            .setHorizontalAlignment("center")
            .setVerticalAlignment("middle");

    var card2Sub = dashSheet.getRange("C7:D7");
    card2Sub.merge().setValue("Tổng các khoản đã chi");
    card2Sub.setBackground("#f8f9fa")
            .setFontColor("#5f6368")
            .setFontStyle("italic")
            .setFontSize(9)
            .setHorizontalAlignment("center")
            .setVerticalAlignment("middle");

    dashSheet.getRange("C5:D7").setBorder(true, true, true, true, false, false, "#fad2cf", SpreadsheetApp.BorderStyle.SOLID);

    // --- THẺ 3: SỐ DƯ QUỸ (Cột E:F) ---
    var card3Title = dashSheet.getRange("E5:F5");
    card3Title.merge().setValue("🏦 SỐ DƯ QUỸ HIỆN TẠI");
    card3Title.setBackground("#e8f0fe")
              .setFontColor("#1a73e8")
              .setFontWeight("bold")
              .setFontSize(11)
              .setHorizontalAlignment("center")
              .setVerticalAlignment("middle");

    var card3Val = dashSheet.getRange("E6:F6");
    card3Val.merge();
    // Số dư = Tổng Thu (A6) - Tổng Chi (C6)
    card3Val.setFormula('=A6-C6');
    card3Val.setBackground("#ffffff")
            .setFontColor("#1a73e8")
            .setFontWeight("bold")
            .setFontSize(17)
            .setNumberFormat('#,##0 "₫"')
            .setHorizontalAlignment("center")
            .setVerticalAlignment("middle");

    var card3Sub = dashSheet.getRange("E7:F7");
    card3Sub.merge().setValue("Tổng Thu - Tổng Chi");
    card3Sub.setBackground("#f8f9fa")
            .setFontColor("#5f6368")
            .setFontStyle("italic")
            .setFontSize(9)
            .setHorizontalAlignment("center")
            .setVerticalAlignment("middle");

    dashSheet.getRange("E5:F7").setBorder(true, true, true, true, false, false, "#d2e3fc", SpreadsheetApp.BorderStyle.SOLID);

    // --- THẺ 4: TỶ LỆ CHI / THU (Cột G:H) ---
    var card4Title = dashSheet.getRange("G5:H5");
    card4Title.merge().setValue("📊 TỶ LỆ CHI / THU");
    card4Title.setBackground("#fef7e0")
              .setFontColor("#b06000")
              .setFontWeight("bold")
              .setFontSize(11)
              .setHorizontalAlignment("center")
              .setVerticalAlignment("middle");

    var card4Val = dashSheet.getRange("G6:H6");
    card4Val.merge();
    // Tỷ lệ = Tổng Chi / Tổng Thu (bọc điều kiện tránh chia cho 0)
    card4Val.setFormula('=IF(A6>0; C6/A6; 0)');
    card4Val.setBackground("#ffffff")
            .setFontColor("#b06000")
            .setFontWeight("bold")
            .setFontSize(17)
            .setNumberFormat("0.0%")
            .setHorizontalAlignment("center")
            .setVerticalAlignment("middle");

    var card4Sub = dashSheet.getRange("G7:H7");
    card4Sub.merge().setValue("Ngưỡng an toàn < 80%");
    card4Sub.setBackground("#f8f9fa")
            .setFontColor("#5f6368")
            .setFontStyle("italic")
            .setFontSize(9)
            .setHorizontalAlignment("center")
            .setVerticalAlignment("middle");

    dashSheet.getRange("G5:H7").setBorder(true, true, true, true, false, false, "#feefc3", SpreadsheetApp.BorderStyle.SOLID);

    // 6. Điều phối kết nối biểu đồ khi các module sau được triển khai
    if (typeof capNhatBieuDoDashboard === "function") {
      capNhatBieuDoDashboard();
    } else if (typeof veBieuDoPhanTich === "function") {
      veBieuDoPhanTich();
    }

    SpreadsheetApp.flush();
    Logger.log("Đã khởi tạo và cập nhật Dashboard Sổ Quỹ thành công.");
  } catch (err) {
    Logger.log("Lỗi trong taoHoacCapNhatDashboard: " + err.toString());
  }
}

/**
 * Hàm bí danh phục vụ liên kết từ thanh Menu (File 1_Menu_ThuChi.gs)
 */
function moDashboardSoQuy() {
  taoHoacCapNhatDashboard();
}

/**
 * Cập nhật thời gian hiển thị trên ô A3 của Dashboard
 */
function capNhatThoiGianDashboard() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dashSheet = ss.getSheetByName(SHEET_DASHBOARD);
    if (dashSheet) {
      var nowStr = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
      dashSheet.getRange("A3").setValue("📅 Cập nhật lần cuối: " + nowStr);
    }
  } catch (e) {
    Logger.log("Không thể cập nhật thời gian Dashboard: " + e.toString());
  }
}

/**
 * ==============================================================================
 * LẮNG NGHE SỰ KIỆN THỜI GIAN THỰC (REAL-TIME REACTIVE LISTENER)
 * ==============================================================================
 * Tự động kích hoạt mỗi khi người dùng chỉnh sửa hoặc thêm dòng trong bảng tính.
 * @param {Object} e Event object được truyền từ hệ thống Google Sheets.
 */
function onEdit(e) {
  try {
    // Trường hợp chạy kiểm thử không có event object
    if (!e || !e.range) {
      capNhatThoiGianDashboard();
      return;
    }

    var sheetName = e.range.getSheet().getName();

    // Khi có thay đổi dữ liệu tại sheet Giao_Dich
    if (sheetName === SHEET_GIAO_DICH) {
      // Cập nhật lại nhãn thời gian trên Dashboard
      capNhatThoiGianDashboard();

      // Tự động gọi vẽ lại / làm mới biểu đồ nếu module biểu đồ đã tồn tại
      if (typeof capNhatBieuDoDashboard === "function") {
        capNhatBieuDoDashboard();
      }
    }
  } catch (err) {
    Logger.log("Lỗi trong onEdit: " + err.toString());
  }
}