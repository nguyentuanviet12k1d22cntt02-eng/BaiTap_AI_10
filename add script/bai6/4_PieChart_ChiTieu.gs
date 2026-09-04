/**
 * ==============================================================================
 * HỆ THỐNG QUẢN LÝ THU CHI TỰ ĐỘNG (GMAIL & GOOGLE SHEETS)
 * File: 4_PieChart_ChiTieu.gs
 * Chức năng: Tự động khởi tạo và cập nhật Biểu đồ tròn cơ cấu chi tiêu trên Dashboard
 * ==============================================================================
 */

// Hằng số tên trang tính và biểu đồ
var SHEET_DASHBOARD_PIE = "Dashboard Sổ Quỹ";
var SHEET_CALC_DATA_PIE = "Calc_Data";
var PIE_CHART_TITLE     = "CƠ CẤU CHI TIÊU THEO TỪNG NHÓM";

/**
 * Hàm chính: Vẽ mới hoặc cập nhật Biểu đồ tròn phân tích cơ cấu chi tiêu
 */
function veBieuDoTronChiTieu() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Ép Google Sheets tính toán xong toàn bộ công thức trên các sheet trước khi vẽ
    SpreadsheetApp.flush();

    var dashSheet = ss.getSheetByName(SHEET_DASHBOARD_PIE);
    var calcSheet = ss.getSheetByName(SHEET_CALC_DATA_PIE);

    // 1. Kiểm tra an toàn sự tồn tại của trang tính
    if (!dashSheet) {
      if (typeof taoHoacCapNhatDashboard === "function") {
        taoHoacCapNhatDashboard();
        dashSheet = ss.getSheetByName(SHEET_DASHBOARD_PIE);
      } else {
        Logger.log("Không tìm thấy trang tính: " + SHEET_DASHBOARD_PIE);
        return;
      }
    }

    if (!calcSheet) {
      if (typeof khoiTaoHoacCapNhatCalcData === "function") {
        khoiTaoHoacCapNhatCalcData();
        calcSheet = ss.getSheetByName(SHEET_CALC_DATA_PIE);
      } else {
        Logger.log("Không tìm thấy trang tính nguồn: " + SHEET_CALC_DATA_PIE);
        return;
      }
    }

    // 2. Xóa biểu đồ tròn cũ nếu đã tồn tại để chống lỗi vẽ đè / trùng lặp
    var existingCharts = dashSheet.getCharts();
    for (var i = 0; i < existingCharts.length; i++) {
      var chart = existingCharts[i];
      var chartTitle = chart.getOptions().get("title");
      var containerInfo = chart.getContainerInfo();
      var anchorRow = containerInfo ? containerInfo.getAnchorRow() : 0;
      var anchorCol = containerInfo ? containerInfo.getAnchorColumn() : 0;

      // Nhận diện biểu đồ theo tiêu đề hoặc vị trí tại Hàng 9 Cột A (1)
      if (chartTitle === PIE_CHART_TITLE || (anchorRow === 9 && anchorCol === 1)) {
        dashSheet.removeChart(chart);
      }
    }

    // 3. Khai báo nguồn dữ liệu từ bảng Nhóm chi tiêu trên sheet Calc_Data (A1:B9)
    var dataRange = calcSheet.getRange("A1:B9");

    // 4. Bảng màu đồng bộ, sang trọng cho 8 nhóm chi tiêu
    var pieColors = [
      "#1a73e8", // Ăn uống: Xanh dương chuẩn
      "#34a853", // Đi lại: Xanh lá
      "#fbbc04", // Nhà ở: Vàng cam
      "#ea4335", // Mua sắm: Đỏ tươi
      "#9334e6", // Y tế: Tím
      "#ff6d01", // Học tập: Cam đậm
      "#46bdc6", // Giải trí: Xanh ngọc
      "#70757a"  // Khác: Xám trung tính
    ];

    // 5. Xây dựng Biểu đồ tròn chuẩn chuyên dụng với .asPieChart()
    var newPieChart = dashSheet.newChart()
      .asPieChart() // BẮT BUỘC DÙNG .asPieChart() cho biểu đồ tròn trong Google Sheets
      .addRange(dataRange)
      .setNumHeaders(1) // Khai báo Dòng 1 là tiêu đề cột
      .setPosition(9, 1, 5, 5) // Vị trí: Hàng 9, Cột A (1), độ lệch x=5px, y=5px
      .setTitle(PIE_CHART_TITLE)
      .setOption("titleTextStyle", {
        color: "#0f4c81",
        fontSize: 13,
        bold: true,
        fontName: "Arial"
      })
      .setOption("pieSliceText", "percentage") // Hiển thị % trực tiếp trên từng lát cắt
      .setOption("pieSliceTextStyle", {
        fontSize: 11,
        bold: true,
        color: "#ffffff"
      })
      .setOption("legend", {
        position: "right",
        textStyle: {
          color: "#3c4043",
          fontSize: 10,
          fontName: "Arial"
        }
      })
      .setOption("colors", pieColors)
      .setOption("width", 490)  // Chiều rộng
      .setOption("height", 360) // Chiều cao
      .setOption("backgroundColor", "#ffffff")
      .build();

    // 6. Nhúng biểu đồ vào Dashboard
    dashSheet.insertChart(newPieChart);

    SpreadsheetApp.flush();
    Logger.log("Đã vẽ Biểu đồ tròn cơ cấu chi tiêu thành công.");
  } catch (err) {
    Logger.log("Lỗi trong veBieuDoTronChiTieu: " + err.toString());
  }
}

/**
 * ==============================================================================
 * HÀM ĐIỀU PHỐI TỔNG HỢP CHO DASHBOARD (DISPATCHER HOOK)
 * ==============================================================================
 * Được gọi từ file 2_Dashboard_KPI.gs và 3_CalcData_ThuChi.gs mỗi khi cập nhật dữ liệu.
 */
function capNhatBieuDoDashboard() {
  try {
    // 1. Cập nhật Biểu đồ tròn cơ cấu chi tiêu
    veBieuDoTronChiTieu();

    // 2. Tự động gọi Biểu đồ cột kênh thanh toán nếu đã được tích hợp ở file tiếp theo
    if (typeof veBieuDoCotKenhThanhToan === "function") {
      veBieuDoCotKenhThanhToan();
    }
  } catch (e) {
    Logger.log("Lỗi trong capNhatBieuDoDashboard: " + e.toString());
  }
}

/**
 * Hàm bí danh hỗ trợ gọi đồng bộ
 */
function veBieuDoPhanTich() {
  capNhatBieuDoDashboard();
}