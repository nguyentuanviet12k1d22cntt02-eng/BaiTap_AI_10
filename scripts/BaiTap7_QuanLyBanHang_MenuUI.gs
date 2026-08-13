/**
 * ==============================================================================
 * BÀI TẬP 7: HỆ THỐNG QUẢN LÝ BÁN HÀNG TÍCH HỢP BẢN ĐỒ DỰ PHÒNG CHUYÊN NGHIỆP
 * ==============================================================================
 */

const CONFIG_BT7 = {
  SHEET_PRODUCTS: "SanPham_BT7",
  SHEET_ORDERS: "DonHang_BT7",
  PRIMARY_COLOR: "#4f46e5", // Indigo theme
  SECONDARY_COLOR: "#0f172a" // Slate dark theme
};

/**
 * TẠO MENU UI KHI MỞ FILE GOOGLE SHEETS
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🌸 Quản Lý Bán Hàng PRO")
    .addItem("🖥️ Mở Trang Quản Trị (Dashboard)", "showAdminConsole")
    .addSeparator()
    .addItem("⚙️ Khởi Tạo Dữ Liệu Mẫu", "initializeDatabase")
    .addToUi();
}

/**
 * HIỂN THỊ SIDEBAR TRANG QUẢN TRỊ
 */
function showAdminConsole() {
  var template = HtmlService.createTemplate(HTML_CONTENT);
  var htmlOutput = template.evaluate()
    .setTitle("Hệ Thống Quản Lý Bán Hàng & Bản Đồ Giao Hàng")
    .setWidth(950)
    .setHeight(680)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, "Hệ Thống Quản Lý Bán Hàng & Bản Đồ");
}

/**
 * ==============================================================================
 * CÁC HÀM BACKEND TRUNG GIAN (API CONNECTORS)
 * ==============================================================================
 */

/**
 * Lấy danh sách sản phẩm từ sheet SanPham_BT7
 */
function getProducts() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG_BT7.SHEET_PRODUCTS);
  if (!sheet) return [];
  
  var lastRow = sheet.getLastRow();
  if (lastRow < 4) return [];
  
  var values = sheet.getRange(4, 1, lastRow - 3, 5).getValues();
  return values.map(function(row) {
    return {
      code: row[0],
      name: row[1],
      unit: row[2],
      price: Number(row[3]) || 0,
      stock: Number(row[4]) || 0
    };
  });
}

/**
 * Lấy danh sách đơn hàng từ sheet DonHang_BT7
 */
function getOrders() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG_BT7.SHEET_ORDERS);
  if (!sheet) return [];
  
  var lastRow = sheet.getLastRow();
  if (lastRow < 4) return [];
  
  var values = sheet.getRange(4, 1, lastRow - 3, 9).getValues();
  return values.map(function(row) {
    var dateStr = "";
    if (row[1] instanceof Date) {
      dateStr = Utilities.formatDate(row[1], "GMT+7", "dd/MM/yyyy");
    } else {
      dateStr = String(row[1]);
    }
    return {
      orderId: row[0],
      date: dateStr,
      customer: row[2],
      address: row[3],
      productName: row[4],
      quantity: Number(row[5]) || 0,
      total: Number(row[6]) || 0,
      lng: Number(row[7]) || 0,
      lat: Number(row[8]) || 0
    };
  });
}

/**
 * Thêm sản phẩm mới vào danh mục
 */
function addProduct(code, name, unit, price, stock) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG_BT7.SHEET_PRODUCTS);
  if (!sheet) throw new Error("Không tìm thấy trang tính Sản phẩm!");
  
  // Kiểm tra trùng mã sản phẩm
  var products = getProducts();
  for (var i = 0; i < products.length; i++) {
    if (String(products[i].code).toUpperCase() === String(code).toUpperCase()) {
      throw new Error("Mã sản phẩm '" + code + "' đã tồn tại!");
    }
  }
  
  var lastRow = sheet.getLastRow();
  var insertRow = lastRow + 1;
  if (insertRow < 4) insertRow = 4;
  
  var newRow = [code, name, unit, price, stock];
  sheet.getRange(insertRow, 1, 1, 5).setValues([newRow]);
  
  // Định dạng viền và căn lề cho dòng mới
  var range = sheet.getRange(insertRow, 1, 1, 5);
  range.setBorder(true, true, true, true, true, true, "#D9D9D9", SpreadsheetApp.BorderStyle.SOLID);
  sheet.getRange(insertRow, 4).setNumberFormat("#,##0"); // Tiền tệ
  sheet.getRange(insertRow, 5).setNumberFormat("#,##0"); // Số lượng
  
  return "Đã thêm sản phẩm '" + name + "' thành công!";
}

/**
 * Thêm đơn hàng mới và tự động cập nhật kho sản phẩm
 */
function addOrder(customer, address, productName, quantity, lng, lat) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var pSheet = ss.getSheetByName(CONFIG_BT7.SHEET_PRODUCTS);
  var oSheet = ss.getSheetByName(CONFIG_BT7.SHEET_ORDERS);
  
  if (!pSheet || !oSheet) throw new Error("Chưa khởi tạo cấu trúc cơ sở dữ liệu!");
  
  // 1. Tìm thông tin sản phẩm và kiểm tra tồn kho
  var products = getProducts();
  var product = null;
  var productIndex = -1;
  for (var i = 0; i < products.length; i++) {
    if (products[i].name === productName) {
      product = products[i];
      productIndex = i;
      break;
    }
  }
  
  if (!product) throw new Error("Sản phẩm '" + productName + "' không có trong danh mục!");
  if (product.stock < quantity) {
    throw new Error("Không đủ hàng trong kho! Hiện chỉ còn " + product.stock + " " + product.unit);
  }
  
  // 2. Tạo mã đơn hàng mới dạng DH-0XX
  var orders = getOrders();
  var nextNum = 1;
  if (orders.length > 0) {
    var lastId = orders[orders.length - 1].orderId; // Ví dụ: DH-010
    var parts = lastId.split("-");
    if (parts.length === 2) {
      nextNum = parseInt(parts[1]) + 1;
    }
  }
  var orderId = "DH-" + ("000" + nextNum).slice(-3);
  var todayStr = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy");
  var totalAmount = product.price * quantity;
  
  // 3. Ghi đơn hàng mới vào DonHang_BT7
  var oLastRow = oSheet.getLastRow();
  var oInsertRow = oLastRow + 1;
  if (oInsertRow < 4) oInsertRow = 4;
  
  var newOrderRow = [orderId, todayStr, customer, address, productName, quantity, totalAmount, lng, lat];
  oSheet.getRange(oInsertRow, 1, 1, 9).setValues([newOrderRow]);
  
  // Định dạng viền & tiền tệ
  oSheet.getRange(oInsertRow, 1, 1, 9).setBorder(true, true, true, true, true, true, "#D9D9D9", SpreadsheetApp.BorderStyle.SOLID);
  oSheet.getRange(oInsertRow, 7).setNumberFormat("#,##0");
  
  // 4. Trừ tồn kho trong sheet SanPham_BT7
  // Dòng thực tế trong trang tính = index trong mảng + 4 (vì dòng 4 là dòng bắt đầu dữ liệu)
  var pRowInSheet = productIndex + 4;
  var newStock = product.stock - quantity;
  pSheet.getRange(pRowInSheet, 5).setValue(newStock); // Cột 5 là Tồn Kho
  
  return {
    success: true,
    message: "Tạo đơn hàng " + orderId + " thành công! Tổng tiền: " + totalAmount.toLocaleString("vi-VN") + " VNĐ"
  };
}

/**
 * KHỞI TẠO CƠ SỞ DỮ LIỆU BAN ĐẦU
 */
function initializeDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Tạo sheet Sản Phẩm
  var pSheet = ss.getSheetByName(CONFIG_BT7.SHEET_PRODUCTS);
  if (pSheet) ss.deleteSheet(pSheet);
  pSheet = ss.insertSheet(CONFIG_BT7.SHEET_PRODUCTS);
  pSheet.views.sheetView[0].showGridLines = true;
  
  // Tiêu đề banner dòng 1
  pSheet.getRange("A1:E1").merge().setValue("DANH MỤC SẢN PHẨM & TỒN KHO")
    .setBackground(CONFIG_BT7.SECONDARY_COLOR).setFontColor("#FFFFFF").setFontWeight("bold").setFontSize(13)
    .setHorizontalAlignment("center").setVerticalAlignment("center");
  pSheet.setRowHeight(1, 35);
  
  // Header dòng 3
  var pHeaders = ["Mã Sản Phẩm", "Tên Sản Phẩm", "ĐVT", "Đơn Giá (VNĐ)", "Tồn Kho"];
  pSheet.getRange(3, 1, 1, 5).setValues([pHeaders])
    .setBackground(CONFIG_BT7.PRIMARY_COLOR).setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
  pSheet.setRowHeight(3, 24);
  
  // Dữ liệu mẫu sản phẩm
  var pData = [
    ["SP001", "Laptop Dell XPS 15", "Chiếc", 32000000, 15],
    ["SP002", "Màn hình Dell UltraSharp 27 inch", "Chiếc", 8500000, 24],
    ["SP003", "Bàn phím Keychron K8 Pro", "Chiếc", 2300000, 45],
    ["SP004", "Chuột Logitech MX Master 3S", "Chiếc", 2100000, 30],
    ["SP005", "Ghế công thái học Sihoo M57", "Chiếc", 4500000, 12],
    ["SP006", "Tai nghe Sony WH-1000XM5", "Chiếc", 6800000, 18],
    ["SP007", "Webcam Elgato Facecam", "Chiếc", 3600000, 10]
  ];
  pSheet.getRange(4, 1, pData.length, 5).setValues(pData);
  pSheet.getRange(4, 1, pData.length, 5).setBorder(true, true, true, true, true, true, "#D9D9D9", SpreadsheetApp.BorderStyle.SOLID);
  pSheet.getRange(4, 4, pData.length, 2).setNumberFormat("#,##0");
  pSheet.autoResizeColumns(1, 5);
  
  // 2. Tạo sheet Đơn Hàng
  var oSheet = ss.getSheetByName(CONFIG_BT7.SHEET_ORDERS);
  if (oSheet) ss.deleteSheet(oSheet);
  oSheet = ss.insertSheet(CONFIG_BT7.SHEET_ORDERS);
  oSheet.views.sheetView[0].showGridLines = true;
  
  // Tiêu đề banner dòng 1
  oSheet.getRange("A1:I1").merge().setValue("DANH SÁCH ĐƠN HÀNG VÀ TỌA ĐỘ GIAO HÀNG")
    .setBackground(CONFIG_BT7.SECONDARY_COLOR).setFontColor("#FFFFFF").setFontWeight("bold").setFontSize(13)
    .setHorizontalAlignment("center").setVerticalAlignment("center");
  oSheet.setRowHeight(1, 35);
  
  // Header dòng 3
  var oHeaders = ["Mã Đơn Hàng", "Ngày Đặt", "Khách Hàng", "Địa Chỉ", "Sản Phẩm", "Số Lượng", "Thành Tiền (VNĐ)", "Kinh Độ (Lng)", "Vĩ Độ (Lat)"];
  oSheet.getRange(3, 1, 1, 9).setValues([oHeaders])
    .setBackground(CONFIG_BT7.PRIMARY_COLOR).setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
  oSheet.setRowHeight(3, 24);
  
  // Dữ liệu mẫu đơn hàng
  var oData = [
    ["DH-001", "01/08/2026", "Nguyễn Văn An", "12 Hoàng Hoa Thám, Hà Nội", "Laptop Dell XPS 15", 1, 32000000, 105.8542, 21.0285],
    ["DH-002", "02/08/2026", "Trần Thị Bích", "45 Lê Duẩn, Quận 1, TP.HCM", "Màn hình Dell UltraSharp 27 inch", 2, 17000000, 106.6984, 10.7769],
    ["DH-003", "04/08/2026", "Lê Hoàng Long", "78 Nguyễn Huệ, Hải Châu, Đà Nẵng", "Bàn phím Keychron K8 Pro", 1, 2300000, 108.2206, 16.0678],
    ["DH-004", "06/08/2026", "Phạm Minh Trang", "102 Cách Mạng Tháng 8, Quận 3, TP.HCM", "Chuột Logitech MX Master 3S", 3, 6300000, 106.6784, 10.7801],
    ["DH-005", "08/08/2026", "Đỗ Quang Hưng", "56 Cầu Giấy, Cầu Giấy, Hà Nội", "Ghế công thái học Sihoo M57", 1, 4500000, 105.7958, 21.0362],
    ["DH-006", "10/08/2026", "Vũ Thị Ngọc Hà", "22 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội", "Tai nghe Sony WH-1000XM5", 1, 6800000, 105.8524, 21.0243],
    ["DH-007", "11/08/2026", "Ngô Thành Nam", "15 Trần Phú, Ngô Quyền, Hải Phòng", "Webcam Elgato Facecam", 2, 7200000, 106.6896, 20.8449],
    ["DH-008", "12/08/2026", "Hoàng Văn Đức", "120 Nguyễn Văn Cừ, Ninh Kiều, Cần Thơ", "Bàn phím Keychron K8 Pro", 2, 4600000, 105.7724, 10.0294],
    ["DH-009", "14/08/2026", "Nguyễn Thị Mai", "88 Lê Lợi, Vinh, Nghệ An", "Chuột Logitech MX Master 3S", 1, 2100000, 105.6813, 18.6734],
    ["DH-010", "15/08/2026", "Bùi Anh Tuấn", "50 Quang Trung, Hải Châu, Đà Nẵng", "Màn hình Dell UltraSharp 27 inch", 1, 8500000, 108.2164, 16.0745]
  ];
  oSheet.getRange(4, 1, oData.length, 9).setValues(oData);
  oSheet.getRange(4, 1, oData.length, 9).setBorder(true, true, true, true, true, true, "#D9D9D9", SpreadsheetApp.BorderStyle.SOLID);
  oSheet.getRange(4, 7).setNumberFormat("#,##0");
  oSheet.autoResizeColumns(1, 9);
  
  SpreadsheetApp.getUi().alert("Khởi Tạo Thành Công!", "Hệ cơ sở dữ liệu bán hàng mới (Sản phẩm & Đơn hàng) đã được tạo sẵn sàng!", SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * ==============================================================================
 * GIAO DIỆN WEB HTML (SIDEBAR/MODAL INTERFACE)
 * ==============================================================================
 */
const HTML_CONTENT = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Trang Quản Trị Bán Hàng & Bản Đồ</title>
  <!-- Google Fonts & Phosphor Icons -->
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/@phosphor-icons/web"></script>
  <!-- Leaflet CSS & JS -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    body {
      background-color: #f8fafc;
      color: #0f172a;
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    
    /* Giao diện 2 cột */
    .sidebar {
      width: 240px;
      background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      flex-shrink: 0;
    }
    
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .brand-icon {
      width: 36px;
      height: 36px;
      background-color: #4f46e5;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    
    .brand-text h2 {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    
    .brand-text span {
      font-size: 11px;
      color: #94a3b8;
    }
    
    .nav-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .nav-item button {
      width: 100%;
      background: none;
      border: none;
      color: #94a3b8;
      padding: 12px;
      border-radius: 8px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .nav-item button:hover, .nav-item.active button {
      color: #ffffff;
      background-color: rgba(255, 255, 255, 0.08);
    }
    
    .nav-item.active button {
      background-color: #4f46e5;
    }
    
    /* Cột Content chính */
    .main-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    
    .header {
      background-color: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .header-title h1 {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
    }
    
    .status-badge {
      background-color: #ecfdf5;
      color: #059669;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      gap: 6px;
      border: 1px solid #a7f3d0;
    }
    
    .status-dot {
      width: 6px;
      height: 6px;
      background-color: #059669;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(0.9); opacity: 0.6; }
      50% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(0.9); opacity: 0.6; }
    }
    
    .content-area {
      flex-grow: 1;
      padding: 24px;
      overflow-y: auto;
      height: calc(100% - 64px);
    }
    
    .tab-pane {
      display: none;
      flex-direction: column;
      gap: 20px;
    }
    
    .tab-pane.active {
      display: flex;
    }
    
    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    
    .kpi-card {
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    
    .kpi-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    
    .kpi-icon.revenue { background-color: #e0e7ff; color: #4f46e5; }
    .kpi-icon.orders { background-color: #ecfdf5; color: #10b981; }
    .kpi-icon.stock { background-color: #fff1f2; color: #f43f5e; }
    
    .kpi-info span {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .kpi-info h3 {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 4px;
    }
    
    /* Layout Thống Kê & Bản đồ */
    .dashboard-layout {
      display: grid;
      grid-template-columns: 1.8fr 1.2fr;
      gap: 20px;
      min-height: 420px;
    }
    
    .card {
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .card-title {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 12px;
    }
    
    #map {
      height: 340px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      z-index: 1;
    }
    
    /* Tables */
    .table-container {
      max-height: 340px;
      overflow-y: auto;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      text-align: left;
    }
    
    th {
      background-color: #f1f5f9;
      color: #475569;
      font-weight: 700;
      padding: 10px 12px;
      position: sticky;
      top: 0;
      z-index: 10;
      border-bottom: 1px solid #cbd5e1;
    }
    
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
    }
    
    tr:hover td {
      background-color: #f8fafc;
    }
    
    /* Split Layout cho Form */
    .split-layout {
      display: grid;
      grid-template-columns: 1.6fr 1.4fr;
      gap: 20px;
    }
    
    /* Forms */
    form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    
    label {
      font-size: 12px;
      font-weight: 700;
      color: #475569;
    }
    
    input, select {
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
      font-size: 13px;
      outline: none;
      transition: border-color 0.2s;
    }
    
    input:focus, select:focus {
      border-color: #4f46e5;
    }
    
    .btn-submit {
      background-color: #4f46e5;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      padding: 10px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 8px;
      transition: background-color 0.2s;
    }
    
    .btn-submit:hover {
      background-color: #4338ca;
    }
    
    /* Toast Notification inside Sidebar */
    .toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #0f172a;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      display: none;
      align-items: center;
      gap: 10px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 9999;
    }
    
    .toast.success { border-left: 4px solid #10b981; }
    .toast.error { border-left: 4px solid #ef4444; }
  </style>
</head>
<body>

  <!-- Sidebar Navigation -->
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-icon">
        <i class="ph-bold ph-storefront"></i>
      </div>
      <div class="brand-text">
        <h2>TechShop Pro</h2>
        <span>Hệ Thống Quản Lý VIP</span>
      </div>
    </div>
    
    <nav>
      <ul class="nav-list">
        <li class="nav-item active" id="btn-tab-dash">
          <button onclick="switchTab('dash')">
            <i class="ph-bold ph-chart-pie"></i> Tổng Quan & Bản Đồ
          </button>
        </li>
        <li class="nav-item" id="btn-tab-orders">
          <button onclick="switchTab('orders')">
            <i class="ph-bold ph-shopping-cart-simple"></i> Quản Lý Đơn Hàng
          </button>
        </li>
        <li class="nav-item" id="btn-tab-products">
          <button onclick="switchTab('products')">
            <i class="ph-bold ph-package"></i> Quản Lý Sản Phẩm
          </button>
        </li>
      </ul>
    </nav>
  </aside>

  <!-- Main Content Area -->
  <main class="main-content">
    
    <!-- Top Header -->
    <header class="header">
      <div class="header-title">
        <h1 id="tab-title-text">TechShop Dashboard</h1>
      </div>
      <div class="status-badge">
        <div class="status-dot"></div>
        <span>Đồng bộ Google Sheets</span>
      </div>
    </header>
    
    <!-- Content Scroll Container -->
    <div class="content-area">
      
      <!-- TAB 1: DASHBOARD OVERVIEW & MAP -->
      <div class="tab-pane active" id="tab-dash">
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-icon revenue">
              <i class="ph-bold ph-currency-vnd"></i>
            </div>
            <div class="kpi-info">
              <span>Tổng Doanh Thu</span>
              <h3 id="kpi-revenue">0 VNĐ</h3>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon orders">
              <i class="ph-bold ph-shopping-bag"></i>
            </div>
            <div class="kpi-info">
              <span>Đơn Hàng Giao Thành Công</span>
              <h3 id="kpi-orders">0 đơn</h3>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon stock">
              <i class="ph-bold ph-warning-octagon"></i>
            </div>
            <div class="kpi-info">
              <span>Cảnh Báo Hết Hàng (<5)</span>
              <h3 id="kpi-stock-alert">0 mặt hàng</h3>
            </div>
          </div>
        </div>
        
        <div class="dashboard-layout">
          <div class="card">
            <div class="card-title">
              <i class="ph-bold ph-map-pin"></i> Bản đồ phân bố đơn giao hàng
            </div>
            <div id="map"></div>
          </div>
          
          <div class="card">
            <div class="card-title">
              <i class="ph-bold ph-trend-up"></i> Top 5 sản phẩm bán chạy
            </div>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Sản Phẩm</th>
                    <th style="text-align: center;">Số lượng</th>
                    <th style="text-align: right;">Doanh thu</th>
                  </tr>
                </thead>
                <tbody id="top-products-body">
                  <tr>
                    <td colspan="3" style="text-align: center;">Đang phân tích dữ liệu...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <!-- TAB 2: ORDER MANAGEMENT -->
      <div class="tab-pane" id="tab-orders">
        <div class="split-layout">
          <div class="card">
            <div class="card-title">
              <i class="ph-bold ph-list-bullets"></i> Nhật ký đơn hàng thực tế
            </div>
            <div class="table-container" style="max-height: 460px;">
              <table>
                <thead>
                  <tr>
                    <th>Mã Đơn</th>
                    <th>Khách Hàng</th>
                    <th>Sản Phẩm</th>
                    <th>SL</th>
                    <th>Thành Tiền</th>
                  </tr>
                </thead>
                <tbody id="orders-table-body">
                  <tr>
                    <td colspan="5" style="text-align: center;">Chưa có đơn hàng nào.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="card">
            <div class="card-title">
              <i class="ph-bold ph-plus-circle"></i> Thêm đơn hàng giao hàng mới
            </div>
            <form id="order-form" onsubmit="handleOrderSubmit(event)">
              <div class="form-group">
                <label for="order-customer">Họ Tên Khách Hàng</label>
                <input type="text" id="order-customer" required placeholder="Nhập tên khách hàng...">
              </div>
              <div class="form-group">
                <label for="order-address">Địa Chỉ Giao Hàng</label>
                <input type="text" id="order-address" required placeholder="Nhập địa chỉ giao hàng...">
              </div>
              <div class="form-group">
                <label for="order-product">Chọn Sản Phẩm</label>
                <select id="order-product" required onchange="updateEstimatedPrice()">
                  <!-- Dynamically populated -->
                </select>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="order-quantity">Số Lượng</label>
                  <input type="number" id="order-quantity" required min="1" value="1" oninput="updateEstimatedPrice()">
                </div>
                <div class="form-group">
                  <label>Giá trị ước tính</label>
                  <span id="order-estimated-value" style="font-size: 13px; font-weight: 700; color: #4f46e5; margin-top: 8px;">0 VNĐ</span>
                </div>
              </div>
              
              <div style="font-size: 11px; color: #64748b; background-color: #f1f5f9; padding: 10px; border-radius: 6px; border-left: 3px solid #cbd5e1;">
                <i class="ph-bold ph-info"></i> Click chọn trực tiếp vị trí giao hàng trên bản đồ hoặc nhập tọa độ dưới đây.
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="order-lat">Vĩ Độ (Latitude)</label>
                  <input type="number" step="any" id="order-lat" required placeholder="Ví dụ: 21.0285">
                </div>
                <div class="form-group">
                  <label for="order-lng">Kinh Độ (Longitude)</label>
                  <input type="number" step="any" id="order-lng" required placeholder="Ví dụ: 105.8542">
                </div>
              </div>
              
              <button type="submit" class="btn-submit">
                <i class="ph-bold ph-plus"></i> Xác Nhận Tạo Đơn Hàng
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <!-- TAB 3: PRODUCT MANAGEMENT -->
      <div class="tab-pane" id="tab-products">
        <div class="split-layout">
          <div class="card">
            <div class="card-title">
              <i class="ph-bold ph-package"></i> Bảng sản phẩm hiện có
            </div>
            <div class="table-container" style="max-height: 460px;">
              <table>
                <thead>
                  <tr>
                    <th>Mã SP</th>
                    <th>Tên Sản Phẩm</th>
                    <th>ĐVT</th>
                    <th>Đơn Giá</th>
                    <th>Tồn Kho</th>
                  </tr>
                </thead>
                <tbody id="products-table-body">
                  <tr>
                    <td colspan="5" style="text-align: center;">Chưa có sản phẩm nào.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="card">
            <div class="card-title">
              <i class="ph-bold ph-plus-square"></i> Nhập sản phẩm mới vào kho
            </div>
            <form id="product-form" onsubmit="handleProductSubmit(event)">
              <div class="form-row">
                <div class="form-group">
                  <label for="prod-code">Mã Sản Phẩm</label>
                  <input type="text" id="prod-code" required placeholder="Ví dụ: SP008">
                </div>
                <div class="form-group">
                  <label for="prod-unit">Đơn Vị Tính</label>
                  <input type="text" id="prod-unit" required placeholder="Ví dụ: Chiếc">
                </div>
              </div>
              <div class="form-group">
                <label for="prod-name">Tên Sản Phẩm</label>
                <input type="text" id="prod-name" required placeholder="Nhập tên sản phẩm...">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="prod-price">Đơn Giá (VNĐ)</label>
                  <input type="number" id="prod-price" required placeholder="Ví dụ: 1500000">
                </div>
                <div class="form-group">
                  <label for="prod-stock">Số Lượng Tồn Kho</label>
                  <input type="number" id="prod-stock" required placeholder="Ví dụ: 50">
                </div>
              </div>
              <button type="submit" class="btn-submit">
                <i class="ph-bold ph-plus"></i> Thêm Sản Phẩm
              </button>
            </form>
          </div>
        </div>
      </div>
      
    </div>
  </main>

  <!-- Toast Toast Notification Container -->
  <div class="toast" id="toast">
    <i class="ph-bold ph-info" id="toast-icon"></i>
    <span id="toast-msg">Thông báo</span>
  </div>

  <script>
    let map = null;
    let markersLayer = null;
    let productsList = [];
    let ordersList = [];
    
    // Khởi động khi mở giao diện
    window.onload = function() {
      initMap();
      loadData();
    };
    
    // 1. Khởi tạo bản đồ Leaflet
    function initMap() {
      // Bản đồ tập trung vào Việt Nam
      map = L.map('map').setView([16.0, 107.0], 5);
      
      // Sử dụng tile của OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      
      markersLayer = L.layerGroup().addTo(map);
      
      // Cho phép click trên bản đồ để lấy tọa độ Lng/Lat
      map.on('click', function(e) {
        document.getElementById('order-lat').value = e.latlng.lat.toFixed(4);
        document.getElementById('order-lng').value = e.latlng.lng.toFixed(4);
        showNotification("Đã lấy tọa độ tại vị trí click chuột!", "success");
      });
    }
    
    // 2. Chuyển tab giao diện
    function switchTab(tabId) {
      document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
      
      if (tabId === 'dash') {
        document.getElementById('btn-tab-dash').classList.add('active');
        document.getElementById('tab-dash').classList.add('active');
        document.getElementById('tab-title-text').innerText = "TechShop Dashboard";
        setTimeout(() => { map.invalidateSize(); }, 200); // Sửa lỗi bản đồ bị lệch kích thước khi ẩn hiện
      } else if (tabId === 'orders') {
        document.getElementById('btn-tab-orders').classList.add('active');
        document.getElementById('tab-orders').classList.add('active');
        document.getElementById('tab-title-text').innerText = "Quản Lý Đơn Hàng";
      } else if (tabId === 'products') {
        document.getElementById('btn-tab-products').classList.add('active');
        document.getElementById('tab-products').classList.add('active');
        document.getElementById('tab-title-text').innerText = "Quản Lý Sản Phẩm";
      }
    }
    
    // 3. Tải dữ liệu từ Google Sheets
    function loadData() {
      // Tải danh sách sản phẩm
      google.script.run.withSuccessHandler(function(products) {
        productsList = products;
        renderProductsTable();
        populateProductDropdown();
        
        // Tải danh sách đơn hàng
        google.script.run.withSuccessHandler(function(orders) {
          ordersList = orders;
          renderOrdersTable();
          updateKPIs();
          renderMapMarkers();
          renderTopProducts();
        }).getOrders();
        
      }).getProducts();
    }
    
    // 4. Cập nhật các chỉ số KPI
    function updateKPIs() {
      let totalRevenue = 0;
      ordersList.forEach(o => totalRevenue += o.total);
      document.getElementById('kpi-revenue').innerText = totalRevenue.toLocaleString('vi-VN') + " VNĐ";
      document.getElementById('kpi-orders').innerText = ordersList.length + " đơn";
      
      let stockAlert = 0;
      productsList.forEach(p => {
        if (p.stock < 5) stockAlert++;
      });
      document.getElementById('kpi-stock-alert').innerText = stockAlert + " mặt hàng";
    }
    
    // 5. Hiển thị danh sách sản phẩm
    function renderProductsTable() {
      const tbody = document.getElementById('products-table-body');
      tbody.innerHTML = '';
      
      if (productsList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Chưa có sản phẩm nào. Hãy tạo dữ liệu mẫu!</td></tr>';
        return;
      }
      
      productsList.forEach(p => {
        const row = document.createElement('tr');
        const alertStyle = p.stock < 5 ? 'style="color: #f43f5e; font-weight: 700;"' : '';
        row.innerHTML = `
          <td>${p.code}</td>
          <td><b>${p.name}</b></td>
          <td>${p.unit}</td>
          <td style="text-align: right;">${p.price.toLocaleString('vi-VN')} đ</td>
          <td style="text-align: center;" ${alertStyle}>${p.stock}</td>
        `;
        tbody.appendChild(row);
      });
    }
    
    // 6. Hiển thị danh sách đơn hàng
    function renderOrdersTable() {
      const tbody = document.getElementById('orders-table-body');
      tbody.innerHTML = '';
      
      if (ordersList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Chưa có đơn hàng nào.</td></tr>';
        return;
      }
      
      ordersList.forEach(o => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><span style="font-family: monospace; font-weight: 700;">${o.orderId}</span></td>
          <td><b>${o.customer}</b></td>
          <td>${o.productName}</td>
          <td style="text-align: center;">${o.quantity}</td>
          <td style="text-align: right; font-weight: 700;">${o.total.toLocaleString('vi-VN')} đ</td>
        `;
        tbody.appendChild(row);
      });
    }
    
    // 7. Render markers trên bản đồ Leaflet
    function renderMapMarkers() {
      markersLayer.clearLayers();
      let hasValidCoords = false;
      
      ordersList.forEach(o => {
        if (o.lat && o.lng) {
          hasValidCoords = true;
          // Tạo marker ghim đơn
          const marker = L.marker([o.lat, o.lng]);
          const popupContent = `
            <div style="font-size: 12px; line-height: 1.5;">
              <strong style="color: #4f46e5;">Đơn Hàng: ${o.orderId}</strong><br>
              <b>Khách Hàng:</b> ${o.customer}<br>
              <b>Sản Phẩm:</b> ${o.productName} (x${o.quantity})<br>
              <b>Địa chỉ:</b> ${o.address}<br>
              <b>Giá trị:</b> <span style="font-weight: 700; color: #10b981;">${o.total.toLocaleString('vi-VN')} VNĐ</span>
            </div>
          `;
          marker.bindPopup(popupContent);
          markersLayer.addLayer(marker);
        }
      });
    }
    
    // 8. Đổ sản phẩm vào select dropdown của đơn hàng
    function populateProductDropdown() {
      const select = document.getElementById('order-product');
      select.innerHTML = '';
      
      productsList.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.name;
        opt.text = `${p.name} - ${p.price.toLocaleString('vi-VN')} đ (Tồn: ${p.stock})`;
        select.appendChild(opt);
      });
      updateEstimatedPrice();
    }
    
    // Tính tiền ước tính dựa vào số lượng và giá sản phẩm
    function updateEstimatedPrice() {
      const prodName = document.getElementById('order-product').value;
      const quantity = parseInt(document.getElementById('order-quantity').value) || 0;
      
      const product = productsList.find(p => p.name === prodName);
      if (product) {
        const est = product.price * quantity;
        document.getElementById('order-estimated-value').innerText = est.toLocaleString('vi-VN') + " VNĐ";
      } else {
        document.getElementById('order-estimated-value').innerText = "0 VNĐ";
      }
    }
    
    // 9. Tính top sản phẩm bán chạy
    function renderTopProducts() {
      const tbody = document.getElementById('top-products-body');
      tbody.innerHTML = '';
      
      const summary = {};
      ordersList.forEach(o => {
        if (!summary[o.productName]) {
          summary[o.productName] = { qty: 0, revenue: 0 };
        }
        summary[o.productName].qty += o.quantity;
        summary[o.productName].revenue += o.total;
      });
      
      const sorted = Object.keys(summary).map(key => {
        return { name: key, qty: summary[key].qty, revenue: summary[key].revenue };
      }).sort((a, b) => b.qty - a.qty).slice(0, 5);
      
      if (sorted.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Chưa có dữ liệu giao dịch.</td></tr>';
        return;
      }
      
      sorted.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><b>${item.name}</b></td>
          <td style="text-align: center; font-weight: 700;">${item.qty}</td>
          <td style="text-align: right; color: #10b981; font-weight: 700;">${item.revenue.toLocaleString('vi-VN')} đ</td>
        `;
        tbody.appendChild(row);
      });
    }
    
    // 10. Gửi Form Thêm Sản Phẩm
    function handleProductSubmit(e) {
      e.preventDefault();
      const code = document.getElementById('prod-code').value.trim();
      const name = document.getElementById('prod-name').value.trim();
      const unit = document.getElementById('prod-unit').value.trim();
      const price = parseFloat(document.getElementById('prod-price').value) || 0;
      const stock = parseInt(document.getElementById('prod-stock').value) || 0;
      
      google.script.run
        .withSuccessHandler(function(response) {
          showNotification(response, "success");
          document.getElementById('product-form').reset();
          loadData();
        })
        .withFailureHandler(function(err) {
          showNotification(err.message, "error");
        })
        .addProduct(code, name, unit, price, stock);
    }
    
    // 11. Gửi Form Thêm Đơn Hàng
    function handleOrderSubmit(e) {
      e.preventDefault();
      const customer = document.getElementById('order-customer').value.trim();
      const address = document.getElementById('order-address').value.trim();
      const productName = document.getElementById('order-product').value;
      const quantity = parseInt(document.getElementById('order-quantity').value) || 0;
      const lat = parseFloat(document.getElementById('order-lat').value);
      const lng = parseFloat(document.getElementById('order-lng').value);
      
      google.script.run
        .withSuccessHandler(function(response) {
          showNotification(response.message, "success");
          document.getElementById('order-form').reset();
          loadData();
          switchTab('dash');
        })
        .withFailureHandler(function(err) {
          showNotification(err.message, "error");
        })
        .addOrder(customer, address, productName, quantity, lng, lat);
    }
    
    // Hiển thị toast thông báo
    function showNotification(message, type) {
      const toast = document.getElementById('toast');
      const icon = document.getElementById('toast-icon');
      const msgSpan = document.getElementById('toast-msg');
      
      toast.className = 'toast ' + type;
      msgSpan.innerText = message;
      
      if (type === 'success') {
        icon.className = 'ph-bold ph-check-circle';
      } else {
        icon.className = 'ph-bold ph-warning-octagon';
      }
      
      toast.style.display = 'flex';
      setTimeout(() => {
        toast.style.display = 'none';
      }, 3500);
    }
  </script>
</body>
</html>
`;
