/**
 * ==============================================================================
 * HỆ THỐNG QUẢN LÝ THU CHI TỰ ĐỘNG (GMAIL & GOOGLE SHEETS)
 * File: 6_BackendService.gs
 * Chức năng: Xử lý nghiệp vụ lưu giao dịch thu chi mới vào bảng "Giao_Dich"
 *            và kích hoạt tự động làm mới Dashboard & Biểu đồ.
 * ==============================================================================
 */

// Hằng số tên trang tính
var SHEET_GIAO_DICH_SVC = "Giao_Dich";
var SHEET_DASHBOARD_SVC = "Dashboard Sổ Quỹ";

// BẮT BUỘC KHAI BÁO HẰNG SỐ CỘT (0-Indexed) ĐÚNG 12 CỘT (A -> L)
var COL_DATE     = 0;  // Cột A: Ngày GD (DD/MM/YYYY)
var COL_MONTH    = 1;  // Cột B: Tháng/Năm (MM/YYYY)
var COL_TYPE     = 2;  // Cột C: Loại GD (Thu / Chi)
var COL_CATEGORY = 3;  // Cột D: Nhóm Chi Tiêu
var COL_DESC     = 4;  // Cột E: Mô Tả
var COL_PERSON   = 5;  // Cột F: Người Liên Quan
var COL_CHANNEL  = 6;  // Cột G: Kênh Thanh Toán
var COL_AMOUNT   = 7;  // Cột H: Số Tiền (trước thuế)
var COL_VAT      = 8;  // Cột I: VAT (%)
var COL_TOTAL    = 9;  // Cột J: Tổng Sau Thuế
var COL_STATUS   = 10; // Cột K: Trạng Thái (Đã chi / Đã thu)
var COL_NOTE     = 11; // Cột L: Ghi Chú

/**
 * Hàm chính: Nhận dữ liệu giao dịch và lưu vào trang tính Giao_Dich
 * @param {Object} giaoDich Object chứa thông tin giao dịch đầu vào.
 * @return {Object} Kết quả xử lý { success: boolean, message: string, row: number, data: Object }
 */
function luuGiaoDichMoi(giaoDich) {
  try {
    if (!giaoDich || typeof giaoDich !== "object") {
      throw new Error("Dữ liệu giao dịch đầu vào không hợp lệ.");
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_GIAO_DICH_SVC);

    if (!sheet) {
      throw new Error("Không tìm thấy trang tính '" + SHEET_GIAO_DICH_SVC + "'.");
    }

    // 1. Chuẩn hóa và làm sạch kiểu dữ liệu an toàn (Data Cleansing)
    var loaiGD = String(giaoDich.loaiGD || giaoDich.type || "Chi").trim();
    // Chuẩn hóa loại giao dịch thành "Thu" hoặc "Chi"
    loaiGD = (loaiGD.toLowerCase() === "thu") ? "Thu" : "Chi";

    var nhomChiTieu = String(giaoDich.nhomChiTieu || giaoDich.category || "Khác").trim();
    var moTa        = String(giaoDich.moTa || giaoDich.desc || "").trim();
    var nguoiLienQuan = String(giaoDich.nguoiLienQuan || giaoDich.person || "Nguyễn Văn An").trim();
    var kenhThanhToan = String(giaoDich.kenhThanhToan || giaoDich.channel || "Tiền mặt").trim();
    var trangThai   = String(giaoDich.trangThai || giaoDich.status || (loaiGD === "Thu" ? "Đã thu" : "Đã chi")).trim();
    var ghiChu      = String(giaoDich.ghiChu || giaoDich.note || "").trim();

    // 2. Xử lý Ngày tháng an toàn
    var rawDate = giaoDich.ngayGD || giaoDich.date || new Date();
    var dateObj = (rawDate instanceof Date) ? rawDate : new Date(rawDate);

    // Fallback nếu chuỗi ngày có định dạng DD/MM/YYYY
    if (isNaN(dateObj.getTime()) && typeof rawDate === "string") {
      var parts = rawDate.split(/[\/\-\.]/);
      if (parts.length === 3) {
        if (parts[0].length === 4) { // YYYY-MM-DD
          dateObj = new Date(Number(parts[0]), Number(parts) - 1, Number(parts));
        } else { // DD/MM/YYYY
          dateObj = new Date(Number(parts), Number(parts) - 1, Number(parts[0]));
        }
      }
    }

    var ngayStr = !isNaN(dateObj.getTime())
      ? Utilities.formatDate(dateObj, "GMT+7", "dd/MM/yyyy")
      : Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy");

    var thangNamStr = !isNaN(dateObj.getTime())
      ? Utilities.formatDate(dateObj, "GMT+7", "MM/yyyy")
      : Utilities.formatDate(new Date(), "GMT+7", "MM/yyyy");

    // 3. Xử lý Số tiền và Thuế VAT
    var rawAmount = giaoDich.soTien || giaoDich.amount || 0;
    var soTienNum = Number(String(rawAmount).replace(/[^0-9.-]+/g, "")) || 0;

    var rawVat = String(giaoDich.vat || giaoDich.vatRate || "0").replace("%", "").trim();
    var vatVal = Number(rawVat) || 0;
    var vatRate = (vatVal > 1) ? (vatVal / 100) : vatVal; // Nếu truyền 8 hoặc 10 -> 0.08 hoặc 0.10

    // Tính Tổng tiền sau thuế = Số tiền * (1 + VAT)
    var tongSauThue = Math.round(soTienNum * (1 + vatRate));

    // 4. Tạo mảng 12 phần tử tương ứng với 12 cột từ A đến L
    var newRowData = new Array(12);
    newRowData[COL_DATE]     = ngayStr;
    newRowData[COL_MONTH]    = thangNamStr;
    newRowData[COL_TYPE]     = loaiGD;
    newRowData[COL_CATEGORY] = nhomChiTieu;
    newRowData[COL_DESC]     = moTa;
    newRowData[COL_PERSON]   = nguoiLienQuan;
    newRowData[COL_CHANNEL]  = kenhThanhToan;
    newRowData[COL_AMOUNT]   = soTienNum;
    newRowData[COL_VAT]      = vatRate;
    newRowData[COL_TOTAL]    = tongSauThue;
    newRowData[COL_STATUS]   = trangThai;
    newRowData[COL_NOTE]     = ghiChu;

    // 5. Xác định vị trí chèn dòng an toàn (chèn trước dòng TỔNG CỘNG nếu có)
    var lastRow = sheet.getLastRow();
    var targetRow = lastRow + 1;
    var hasSummaryRow = false;

    if (lastRow >= 3) {
      // Đọc dòng cuối cùng để kiểm tra xem có phải dòng TỔNG CỘNG hay không
      var lastRowValues = sheet.getRange(lastRow, 1, 1, 12).getValues()[0];
      var checkDesc = String(lastRowValues[COL_DESC] || "").trim().toUpperCase();
      var checkDate = String(lastRowValues[COL_DATE] || "").trim().toUpperCase();

      if (checkDesc.indexOf("TỔNG CỘNG") !== -1 || checkDate.indexOf("TỔNG CỘNG") !== -1) {
        // Chèn dòng mới ngay phía trên dòng TỔNG CỘNG
        sheet.insertRowBefore(lastRow);
        targetRow = lastRow;
        hasSummaryRow = true;
      }
    }

    // 6. Ghi hàng loạt (Batch Operations) vào dòng mục tiêu
    var targetRange = sheet.getRange(targetRow, 1, 1, 12);
    targetRange.setValues([newRowData]);

    // 7. Định dạng hiển thị chuẩn mực cho dòng mới
    targetRange.setFontFamily("Arial").setFontSize(10).setVerticalAlignment("middle");
    
    // Căn lề
    sheet.getRange(targetRow, COL_DATE + 1, 1, 3).setHorizontalAlignment("center"); // Ngày, Tháng, Loại
    sheet.getRange(targetRow, COL_CATEGORY + 1, 1, 4).setHorizontalAlignment("left"); // Nhóm, Mô tả, Người, Kênh
    sheet.getRange(targetRow, COL_AMOUNT + 1, 1, 3).setHorizontalAlignment("right");  // Tiền, VAT, Tổng
    sheet.getRange(targetRow, COL_STATUS + 1).setHorizontalAlignment("center");      // Trạng thái
    sheet.getRange(targetRow, COL_NOTE + 1).setHorizontalAlignment("left");          // Ghi chú

    // Định dạng tiền tệ và phần trăm
    sheet.getRange(targetRow, COL_AMOUNT + 1).setNumberFormat('#,##0 "₫"');
    sheet.getRange(targetRow, COL_VAT + 1).setNumberFormat("0.00%");
    sheet.getRange(targetRow, COL_TOTAL + 1).setNumberFormat('#,##0 "₫"');

    // Kẻ viền ô mỏng
    targetRange.setBorder(true, true, true, true, true, true, "#dadce0", SpreadsheetApp.BorderStyle.SOLID);

    // 8. TỰ ĐỘNG KÍCH HOẠT LÀM MỚI DASHBOARD & BIỂU ĐỒ (Reactive Pipeline Chaining)
    kichHoatCapNhatDashboardToanDien();

    Logger.log("Đã lưu thành công giao dịch vào dòng " + targetRow);

    return {
      success: true,
      message: "Đã lưu thành công giao dịch vào Sổ Quỹ!",
      row: targetRow,
      data: {
        ngayGD: ngayStr,
        loaiGD: loaiGD,
        nhomChiTieu: nhomChiTieu,
        moTa: moTa,
        soTien: soTienNum,
        tongSauThue: tongSauThue
      }
    };
  } catch (err) {
    Logger.log("Lỗi trong luuGiaoDichMoi: " + err.toString());
    return {
      success: false,
      message: "Lỗi khi lưu giao dịch: " + err.message,
      error: err.toString()
    };
  }
}

/**
 * Hàm kích hoạt chuỗi làm mới toàn diện Dashboard và cặp Biểu đồ
 */
function kichHoatCapNhatDashboardToanDien() {
  try {
    SpreadsheetApp.flush(); // Ép hoàn tất ghi dữ liệu và tính toán SUMIFS

    // 1. Cập nhật nhãn thời gian trên Dashboard
    if (typeof capNhatThoiGianDashboard === "function") {
      capNhatThoiGianDashboard();
    }

    // 2. Làm mới cặp biểu đồ phân tích
    if (typeof lamMoiCapBieuDoDashboard === "function") {
      lamMoiCapBieuDoDashboard();
    } else if (typeof capNhatBieuDoDashboard === "function") {
      capNhatBieuDoDashboard();
    }
  } catch (e) {
    Logger.log("Lỗi khi kích hoạt cập nhật Dashboard: " + e.toString());
  }
}

/**
 * ==============================================================================
 * HÀM KIỂM THỬ NHANH TRỰC TIẾP (TEST RUNNER)
 * ==============================================================================
 * Chạy hàm này trong trình soạn thảo Apps Script để kiểm tra lưu giao dịch mẫu.
 */
function kiemThuLuuGiaoDich() {
  var giaoDichMau = {
    ngayGD: new Date(),
    loaiGD: "Chi",
    nhomChiTieu: "Ăn uống",
    moTa: "Thanh toán bữa tối Pizza",
    nguoiLienQuan: "Diệp Đại Lê Hoài",
    kenhThanhToan: "Ví điện tử",
    soTien: 250000,
    vat: "8%",
    trangThai: "Đã chi",
    ghiChu: "MoMo - Pizza 4P's"
  };

  var ketQua = luuGiaoDichMoi(giaoDichMau);
  Logger.log("Kết quả kiểm thử: " + JSON.stringify(ketQua));

  try {
    var ui = SpreadsheetApp.getUi();
    if (ketQua.success) {
      ui.alert("THÀNH CÔNG", ketQua.message + "\nDòng đã thêm: " + ketQua.row, ui.ButtonSet.OK);
    } else {
      ui.alert("THẤT BẠI", ketQua.message, ui.ButtonSet.OK);
    }
  } catch (e) {
    Logger.log("Chạy trong môi trường không có giao diện UI: " + e.toString());
  }
}