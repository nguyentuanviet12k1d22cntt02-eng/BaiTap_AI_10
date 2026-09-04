/**
 * ==============================================================================
 * HỆ THỐNG QUẢN LÝ THU CHI TỰ ĐỘNG (GMAIL & GOOGLE SHEETS)
 * File: 5_BarChart_KenhTT.gs
 * Chức năng: Tự động khởi tạo và cập nhật Biểu đồ cột kênh thanh toán trên Dashboard
 * ==============================================================================
 */

// Hằng số tên trang tính và biểu đồ
var SHEET_DASHBOARD_COL = "Dashboard Sổ Quỹ";
var SHEET_CALC_DATA_COL = "Calc_Data";
var COLUMN_CHART_TITLE  = "CHI TIÊU THEO KÊNH THANH TOÁN";

/**
 * Hàm chính: Vẽ mới hoặc cập nhật Biểu đồ cột phân tích chi tiêu theo kênh thanh toán
 */
function veBieuDoCotKenhThanhToan() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Ép Google Sheets hoàn tất tính toán công thức SUMIFS trước khi đọc dải ô
    SpreadsheetApp.flush();

    var dashSheet = ss.getSheetByName(SHEET_DASHBOARD_COL);
    var calcSheet = ss.getSheetByName(SHEET_CALC_DATA_COL);

    // Kiểm tra an toàn sự tồn tại của trang tính
    if (!dashSheet) {
      if (typeof taoHoacCapNhatDashboard === "function") {
        taoHoacCapNhatDashboard();
        dashSheet = ss.getSheetByName(SHEET_DASHBOARD_COL);
      } else {
        Logger.log("Không tìm thấy trang tính: " + SHEET_DASHBOARD_COL);
        return;
      }
    }

    if (!calcSheet) {
      if (typeof khoiTaoHoacCapNhatCalcData === "function") {
        khoiTaoHoacCapNhatCalcData();
        calcSheet = ss.getSheetByName(SHEET_CALC_DATA_COL);
      } else {
        Logger.log("Không tìm thấy trang tính nguồn: " + SHEET_CALC_DATA_COL);
        return;
      }
    }

    // 2. Xóa biểu đồ cột cũ nếu đã tồn tại để chống lỗi vẽ đè / chồng lấn
    var existingCharts = dashSheet.getCharts();
    for (var i = 0; i < existingCharts.length; i++) {
      var chart = existingCharts[i];
      var chartTitle = chart.getOptions().get("title");
      var containerInfo = chart.getContainerInfo();
      var anchorRow = containerInfo ? containerInfo.getAnchorRow() : 0;
      var anchorCol = containerInfo ? containerInfo.getAnchorColumn() : 0;

      // Nhận diện biểu đồ theo tiêu đề hoặc vị trí tại Hàng 9 Cột E (5)
      if (chartTitle === COLUMN_CHART_TITLE || (anchorRow === 9 && anchorCol === 5)) {
        dashSheet.removeChart(chart);
      }
    }

    // 3. Khai báo nguồn dữ liệu từ bảng Kênh thanh toán trên sheet Calc_Data (D1:E5)
    var dataRange = calcSheet.getRange("D1:E5");

    // 4. Xây dựng Biểu đồ cột bằng Builder chuyên dụng .asColumnChart()
    var newColumnChart = dashSheet.newChart()
      .asColumnChart()
      .addRange(dataRange)
      .setNumHeaders(1) // BẮT BUỘC: Nhận diện D1:E1 là hàng tiêu đề
      .setOption("useFirstColumnAsDomain", true) // BẮT BUỘC: Nhận Cột D làm Trục Hoành X (Tên kênh thanh toán)
      .setPosition(9, 5, 10, 5) // Vị trí: Hàng 9, Cột E (5), độ lệch x=10px, y=5px
      .setTitle(COLUMN_CHART_TITLE)
      .setOption("titleTextStyle", {
        color: "#0f4c81",
        fontSize: 13,
        bold: true,
        fontName: "Arial"
      })
      .setOption("legend", { position: "none" }) // Ẩn chú thích vì chỉ có 1 cột số liệu
      .setOption("colors", ["#1a73e8"]) // Cột màu xanh dương hiện đại
      .setOption("hAxis", {
        title: "Kênh Thanh Toán",
        titleTextStyle: {
          color: "#5f6368",
          fontSize: 10,
          bold: true,
          fontName: "Arial"
        },
        textStyle: {
          color: "#3c4043",
          fontSize: 10,
          fontName: "Arial"
        }
      })
      .setOption("vAxis", {
        title: "Số tiền chi (VNĐ)",
        titleTextStyle: {
          color: "#5f6368",
          fontSize: 10,
          bold: true,
          fontName: "Arial"
        },
        format: "#,##0",
        minValue: 0,
        textStyle: {
          color: "#3c4043",
          fontSize: 10,
          fontName: "Arial"
        }
      })
      .setOption("width", 560)  // Chiều rộng 560px
      .setOption("height", 360) // Chiều cao 360px
      .setOption("backgroundColor", "#ffffff")
      .build();

    // 5. Nhúng biểu đồ vào trang Dashboard
    dashSheet.insertChart(newColumnChart);

    SpreadsheetApp.flush();
    Logger.log("Đã vẽ Biểu đồ cột kênh thanh toán thành công.");
  } catch (err) {
    Logger.log("Lỗi trong veBieuDoCotKenhThanhToan: " + err.toString());
  }
}

/**
 * ==============================================================================
 * HÀM LÀM MỚI TOÀN BỘ CẶP BIỂU ĐỒ TRÊN DASHBOARD
 * ==============================================================================
 * Cập nhật đồng bộ cả Biểu đồ tròn (Nhóm chi tiêu) và Biểu đồ cột (Kênh thanh toán)
 */
function lamMoiCapBieuDoDashboard() {
  try {
    if (typeof veBieuDoTronChiTieu === "function") {
      veBieuDoTronChiTieu();
    }
    veBieuDoCotKenhThanhToan();
  } catch (e) {
    Logger.log("Lỗi khi làm mới cặp biểu đồ: " + e.toString());
  }
}