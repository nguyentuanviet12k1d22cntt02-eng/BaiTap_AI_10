/**
 * ==============================================================================
 * HỆ THỐNG QUẢN LÝ THU CHI TỰ ĐỘNG (GMAIL & GOOGLE SHEETS)
 * File: 3_CalcData_ThuChi.gs
 * Chức năng: Khởi tạo và đồng bộ bảng tính phụ "Calc_Data" làm dữ liệu nguồn cho biểu đồ
 * ==============================================================================
 */

// Hằng số tên trang tính
var SHEET_CALC_DATA = "Calc_Data";
var SHEET_GIAO_DICH = "Giao_Dich";

/**
 * Hàm chính: Khởi tạo và thiết lập các bảng tổng hợp dữ liệu trên sheet Calc_Data
 */
function khoiTaoHoacCapNhatCalcData() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var calcSheet = ss.getSheetByName(SHEET_CALC_DATA);

    // 1. Kiểm tra và khởi tạo Sheet Calc_Data
    if (!calcSheet) {
      calcSheet = ss.insertSheet(SHEET_CALC_DATA);
    } else {
      calcSheet.clear(); // Làm sạch dữ liệu cũ để cập nhật mới
    }

    // Đảm bảo trang tính luôn hiển thị bình thường để biểu đồ đọc dữ liệu ổn định
    calcSheet.showSheet();

    // Thiết lập kích thước cột gọn gàng, rõ ràng
    calcSheet.setColumnWidth(1, 150); // Cột A: Nhóm Chi Tiêu
    calcSheet.setColumnWidth(2, 170); // Cột B: Tổng Chi Sau Thuế
    calcSheet.setColumnWidth(3, 40);  // Cột C: Khoảng cách đệm
    calcSheet.setColumnWidth(4, 160); // Cột D: Kênh Thanh Toán
    calcSheet.setColumnWidth(5, 170); // Cột E: Tổng Chi
    calcSheet.setRowHeight(1, 32);    // Chiều cao hàng tiêu đề

    // ==========================================================================
    // BẢNG 1: CHI TIÊU THEO NHÓM NGÀNH HÀNG (CỘT A & B, TỪ DÒNG 1)
    // ==========================================================================
    
    // Tiêu đề Bảng 1 (A1:B1)
    var headerCatRange = calcSheet.getRange("A1:B1");
    headerCatRange.setValues([["Nhóm Chi Tiêu", "Tổng Chi Sau Thuế"]]);
    headerCatRange.setBackground("#e8f0fe")
                  .setFontColor("#1a73e8")
                  .setFontFamily("Arial")
                  .setFontSize(10)
                  .setFontWeight("bold")
                  .setHorizontalAlignment("center")
                  .setVerticalAlignment("middle");

    // Danh sách 8 nhóm ngành hàng
    var categories = [
      ["Ăn uống"],
      ["Đi lại"],
      ["Nhà ở"],
      ["Mua sắm"],
      ["Y tế"],
      ["Học tập"],
      ["Giải trí"],
      ["Khác"]
    ];

    // Tạo mảng công thức SUMIFS với dải ô mở vô tận chuẩn Locale VN (dùng ;)
    var categoryFormulas = [];
    for (var i = 0; i < categories.length; i++) {
      var rowNum = i + 2; // Dữ liệu bắt đầu từ dòng 2
      categoryFormulas.push([
        '=SUMIFS(' + SHEET_GIAO_DICH + '!J3:J; ' + 
                     SHEET_GIAO_DICH + '!C3:C; "Chi"; ' + 
                     SHEET_GIAO_DICH + '!D3:D; A' + rowNum + ')'
      ]);
    }

    // Ghi hàng loạt (Batch Operations) cho Bảng 1
    var catNameRange = calcSheet.getRange(2, 1, categories.length, 1);
    catNameRange.setValues(categories)
                .setFontFamily("Arial")
                .setFontSize(10)
                .setVerticalAlignment("middle");

    var catFormulaRange = calcSheet.getRange(2, 2, categoryFormulas.length, 1);
    catFormulaRange.setFormulas(categoryFormulas)
                   .setFontFamily("Arial")
                   .setFontSize(10)
                   .setFontWeight("bold")
                   .setNumberFormat('#,##0 "₫"')
                   .setHorizontalAlignment("right")
                   .setVerticalAlignment("middle");

    // Kẻ khung viền cho Bảng 1
    calcSheet.getRange(1, 1, categories.length + 1, 2)
             .setBorder(true, true, true, true, true, true, "#dadce0", SpreadsheetApp.BorderStyle.SOLID);

    // ==========================================================================
    // BẢNG 2: CHI TIÊU THEO KÊNH THANH TOÁN (CỘT D & E, TỪ DÒNG 1)
    // ==========================================================================

    // Tiêu đề Bảng 2 (D1:E1)
    var headerChanRange = calcSheet.getRange("D1:E1");
    headerChanRange.setValues([["Kênh Thanh Toán", "Tổng Chi"]]);
    headerChanRange.setBackground("#fce8e6")
                   .setFontColor("#c5221f")
                   .setFontFamily("Arial")
                   .setFontSize(10)
                   .setFontWeight("bold")
                   .setHorizontalAlignment("center")
                   .setVerticalAlignment("middle");

    // Danh sách 4 kênh thanh toán
    var channels = [
      ["Tiền mặt"],
      ["Chuyển khoản"],
      ["Ví điện tử"],
      ["Thẻ ngân hàng"]
    ];

    // Tạo mảng công thức SUMIFS với dải ô mở vô tận chuẩn Locale VN (dùng ;)
    var channelFormulas = [];
    for (var j = 0; j < channels.length; j++) {
      var rowChanNum = j + 2; // Dữ liệu bắt đầu từ dòng 2
      channelFormulas.push([
        '=SUMIFS(' + SHEET_GIAO_DICH + '!J3:J; ' + 
                     SHEET_GIAO_DICH + '!C3:C; "Chi"; ' + 
                     SHEET_GIAO_DICH + '!G3:G; D' + rowChanNum + ')'
      ]);
    }

    // Ghi hàng loạt (Batch Operations) cho Bảng 2
    var chanNameRange = calcSheet.getRange(2, 4, channels.length, 1);
    chanNameRange.setValues(channels)
                 .setFontFamily("Arial")
                 .setFontSize(10)
                 .setVerticalAlignment("middle");

    var chanFormulaRange = calcSheet.getRange(2, 5, channelFormulas.length, 1);
    chanFormulaRange.setFormulas(channelFormulas)
                    .setFontFamily("Arial")
                    .setFontSize(10)
                    .setFontWeight("bold")
                    .setNumberFormat('#,##0 "₫"')
                    .setHorizontalAlignment("right")
                    .setVerticalAlignment("middle");

    // Kẻ khung viền cho Bảng 2
    calcSheet.getRange(1, 4, channels.length + 1, 2)
             .setBorder(true, true, true, true, true, true, "#dadce0", SpreadsheetApp.BorderStyle.SOLID);

    // ==========================================================================
    // LIÊN KẾT ĐỒNG BỘ: GỌI LÀM MỚI BIỂU ĐỒ NẾU MODULE BIỂU ĐỒ ĐÃ TỒN TẠI
    // ==========================================================================
    if (typeof capNhatBieuDoDashboard === "function") {
      capNhatBieuDoDashboard();
    } else if (typeof veBieuDoPhanTich === "function") {
      veBieuDoPhanTich();
    }

    SpreadsheetApp.flush();
    Logger.log("Đã khởi tạo dữ liệu tổng hợp tại sheet Calc_Data thành công.");
  } catch (err) {
    Logger.log("Lỗi trong khoiTaoHoacCapNhatCalcData: " + err.toString());
  }
}