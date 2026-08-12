/**
 * BÀI TẬP 7: MENU UI QUẢN LÝ BÁN HÀNG & VẼ BIỂU ĐỒ THỐNG KÊ XANH DƯƠNG
 */
const CONFIG_BT7 = {
  SHEET_NAME: "BanHang_BT7",
  BLUE_PRIMARY: "#1B365D", // Xanh dương đậm tiêu đề
  BLUE_NAVY: "#1D4ED8",    // Xanh dương vẽ cột doanh thu
  BLUE_LIGHT: "#93C5FD"    // Xanh lam nhạt vẽ cột chi phí
};

/**
 * TẠO MENU UI KHI MỞ FILE GOOGLE SHEETS
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🌸 Quản Lý Bán Hàng")
    .addItem("➕ Thêm đơn hàng", "themDonHang")
    .addItem("📦 Nhập hàng", "nhapHang")
    .addItem("💸 Nhập chi phí", "nhapChiPhi")
    .addSeparator()
    .addItem("📊 Xem Thống Kê", "xemThongKe")
    .addSeparator()
    .addItem("⚙️ Khởi tạo Sheets", "khoiTaoSheets")
    .addToUi();
}

/**
 * CHỨC NĂNG 1: THÊM ĐƠN HÀNG (POPUP)
 */
function themDonHang() {
  SpreadsheetApp.getUi().alert("Chức năng: ➕ Thêm đơn hàng", "Hệ thống đang mở form nhập đơn hàng trực tuyến. Vui lòng kiểm tra!", SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * CHỨC NĂNG 2: NHẬP HÀNG (POPUP)
 */
function nhapHang() {
  SpreadsheetApp.getUi().alert("Chức năng: 📦 Nhập hàng", "Yêu cầu nhập kho sỉ đã được kích hoạt!", SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * CHỨC NĂNG 3: NHẬP CHI PHÍ (POPUP)
 */
function nhapChiPhi() {
  SpreadsheetApp.getUi().alert("Chức năng: 💸 Nhập chi phí", "Form cập nhật chi phí vận hành cửa hàng đã mở!", SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * CHỨC NĂNG 4: XEM THỐNG KÊ VÀ VẼ BIỂU ĐỒ XANH DƯƠNG
 */
function xemThongKe() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG_BT7.SHEET_NAME);
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert("Lỗi: Không tìm thấy sheet 'BanHang_BT7'!");
    return;
  }
  
  var lastRow = sheet.getLastRow();
  if (lastRow < 4) {
    SpreadsheetApp.getUi().alert("Chưa có đủ dữ liệu giao dịch từ dòng 4 để làm thống kê!");
    return;
  }
  
  // Dọn dẹp biểu đồ cũ
  var existingCharts = sheet.getCharts();
  for (var i = 0; i < existingCharts.length; i++) {
    sheet.removeChart(existingCharts[i]);
  }
  
  // 1. Tạo bảng tổng hợp phân tích ở Cột I-K
  sheet.getRange("I3:K3").setValues([["Kênh/Phân Loại", "Doanh Thu", "Chi Phí"]])
    .setBackground(CONFIG_BT7.BLUE_PRIMARY).setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
  
  var channels = [
    ["Shopee"],
    ["Lazada"],
    ["Website"],
    ["Cửa Hàng"],
    ["Chi Phí Marketing"],
    ["Chi Phí Vận Hành"]
  ];
  sheet.getRange("I4:I9").setValues(channels);
  
  // Điền công thức SUMIFS chuẩn tiếng Việt (dùng dấu ;) lồng biến dòng cuối
  var summaryFormulas = [];
  for (var r = 4; r <= 9; r++) {
    var itemLabelCell = "I" + r;
    var salesFormula = '=SUMIFS(F$4:F$' + lastRow + '; B$4:B$' + lastRow + '; "Bán Hàng"; G$4:G$' + lastRow + '; ' + itemLabelCell + ')';
    var costFormula = '=SUMIFS(F$4:F$' + lastRow + '; B$4:B$' + lastRow + '; "Chi Phí"; G$4:G$' + lastRow + '; ' + itemLabelCell + ')';
    summaryFormulas.push([salesFormula, costFormula]);
  }
  
  sheet.getRange("J4:K9").setFormulasLocal(summaryFormulas);
  sheet.getRange("J4:K9").setNumberFormat("#,##0");
  sheet.getRange("I3:K9").setBorder(true, true, true, true, true, true, "#D9D9D9", SpreadsheetApp.BorderStyle.SOLID);
  
  SpreadsheetApp.flush();
  
  // 2. VẼ BIỂU ĐỒ CỘT (COLUMN CHART) TÔNG MÀU XANH DƯƠNG CHỦ ĐẠO
  var chartBuilder = sheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(sheet.getRange("I3:K9"))
    .setPosition(11, 9, 0, 0) // Đặt dưới bảng tổng hợp ở dòng 11, cột I (9)
    .setOption("title", "THỐNG KÊ DOANH THU & CHI PHÍ BÁN HÀNG")
    .setOption("width", 500)
    .setOption("height", 320)
    .setOption("colors", [CONFIG_BT7.BLUE_NAVY, CONFIG_BT7.BLUE_LIGHT]) // Tông màu xanh dương chủ đạo
    .setOption("vAxis", {title: "Số Tiền (VNĐ)", format: "#,##0"})
    .setOption("hAxis", {title: "Kênh Phân Phối"})
    .build();
    
  sheet.insertChart(chartBuilder);
  
  SpreadsheetApp.getUi().alert("Thành công!", "Đã lập bảng phân tích nhanh và vẽ biểu đồ doanh số tông màu Xanh Dương thành công!", SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * CHỨC NĂNG 5: KHỞI TẠO SHEETS MỚI ĐÃ ĐỊNH DẠNG SẴN
 */
function khoiTaoSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG_BT7.SHEET_NAME) || ss.getActiveSheet();
  
  sheet.clear();
  var charts = sheet.getCharts();
  for (var i = 0; i < charts.length; i++) {
    sheet.removeChart(charts[i]);
  }
  
  // Định dạng tiêu đề Banner dòng 1
  sheet.getRange("A1:G1").merge().setValue("SỔ NHẬT KÝ BÁN HÀNG & CHI PHÍ")
    .setBackground(CONFIG_BT7.BLUE_PRIMARY).setFontColor("#FFFFFF").setFontWeight("bold").setFontSize(13)
    .setHorizontalAlignment("center").setVerticalAlignment("center");
  sheet.setRowHeight(1, 35);
  
  // Ghi Headers dòng 3
  var headers = ["Ngày Giao Dịch", "Loại Giao Dịch", "Nội Dung", "Số Lượng", "Đơn Giá", "Thành Tiền", "Kênh/Phân Loại"];
  sheet.getRange(3, 1, 1, headers.length).setValues([headers])
    .setBackground(CONFIG_BT7.BLUE_PRIMARY).setFontColor("#FFFFFF").setFontWeight("bold")
    .setHorizontalAlignment("center");
  sheet.setRowHeight(3, 24);
  
  sheet.getRange("A4:G20").setBorder(true, true, true, true, true, true, "#D9D9D9", SpreadsheetApp.BorderStyle.SOLID);
  sheet.autoResizeColumns(1, headers.length);
  
  SpreadsheetApp.getUi().alert("Khởi tạo thành công!", "Bảng nhật ký bán hàng sạch đã sẵn sàng nhập liệu!", SpreadsheetApp.getUi().ButtonSet.OK);
}
