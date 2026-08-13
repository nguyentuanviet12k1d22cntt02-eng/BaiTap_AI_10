/** 
 * 🏪 TECH HUB STORE - HỆ THỐNG QUẢN LÝ BÁN HÀNG & DASHBOARD 
 */

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🏪 Tech Hub Store')
    .addItem('📊 Dashboard Tổng Quan', 'refreshDashboard')
    .addSeparator()
    .addItem('🛍️ Quản Lý Sản Phẩm', 'showProductManagement')
    .addItem('👥 Quản Lý Khách Hàng', 'showCustomerManagement')
    .addItem('📦 Quản Lý Đơn Hàng', 'showOrderManagement')
    .addSeparator()
    .addItem('🔄 Làm Mới Dashboard', 'refreshDashboard')
    .addItem('❓ Hướng Dẫn Sử Dụng', 'showHelp')
    .addToUi();
}

function showDialog(filename, title, width, height) {
  var template = HtmlService.createTemplateFromFile(filename);
  var html = template.evaluate()
    .setWidth(width || 900)
    .setHeight(height || 650)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  SpreadsheetApp.getUi().showModalDialog(html, title);
}

function showProductManagement() { showDialog('ProductManagement', '🛍️ Quản Lý Sản Phẩm - Tech Hub Store', 920, 660); }
function showCustomerManagement() { showDialog('CustomerManagement', '👥 Quản Lý Khách Hàng - Tech Hub Store', 920, 660); }
function showOrderManagement() { showDialog('OrderManagement', '📦 Quản Lý Đơn Hàng - Tech Hub Store', 1020, 720); }

function showHelp() {
  var helpText = "🏪 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG TECH HUB STORE\n\n" +
    "1. 📊 Dashboard: Hiển thị các chỉ số kinh doanh, biểu đồ và Top khách hàng VIP.\n" +
    "2. 🛍️ Quản Lý Sản Phẩm: Thêm, sửa, xóa, tìm kiếm danh sách sản phẩm.\n" +
    "3. 👥 Quản Lý Khách Hàng: Quản lý thông tin khách hàng VIP/Thường.\n" +
    "4. 📦 Quản Lý Đơn Hàng: Tạo đơn hàng mới (tự động trừ tồn kho), xem chi tiết & cập nhật trạng thái.\n" +
    "5. 📜 Lịch Sử Tồn Kho: Mọi thao tác nhập/xuất/thay đổi tồn kho đều được ghi log tự động.";
  SpreadsheetApp.getUi().alert('❓ Hướng Dẫn Sử Dụng', helpText, SpreadsheetApp.getUi().ButtonSet.OK);
}

function refreshDashboard() { createDashboard(); }

function createDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Tạo hoặc reset Sheet "📊 Dashboard"
  var dashName = "📊 Dashboard";
  var dashSheet = ss.getSheetByName(dashName) || ss.insertSheet(dashName, 0);
  ss.setActiveSheet(dashSheet);
  ss.moveActiveSheet(1);
  dashSheet.clear();
  dashSheet.getCharts().forEach(function(c) { dashSheet.removeChart(c); });

  // 2. Reset Sheet phụ "Calc_Data"
  var calcName = "Calc_Data";
  var calcSheet = ss.getSheetByName(calcName) || ss.insertSheet(calcName);
  calcSheet.clear();
  calcSheet.hideSheet();

  // --- A. HEADER DASHBOARD ---
  dashSheet.getRange("A1:H1").merge().setValue("🏪 TECH HUB STORE - DASHBOARD QUẢN LÝ")
    .setFontSize(20).setFontWeight("bold").setFontColor("#FFFFFF").setBackground("#1E40AF")
    .setHorizontalAlignment("center").setVerticalAlignment("middle");
  dashSheet.setRowHeight(1, 50);

  // --- B. MENU ĐIỀU HƯỚNG ---
  var navs = [
    ["📊 Dashboard", "#2563EB"], ["🛍️ Sản Phẩm", "#7C3AED"], ["👥 Khách Hàng", "#059669"],
    ["📦 Đơn Hàng", "#DC2626"], ["📈 Báo Cáo", "#D97706"], ["🔄 Làm Mới", "#4B5563"], ["❓ Hướng Dẫn", "#0891B2"]
  ];
  for (var i = 0; i < navs.length; i++) {
    var colChar = String.fromCharCode(65 + i);
    dashSheet.getRange(colChar + "3").setValue(navs[i][0]).setFontSize(11).setFontWeight("bold")
      .setFontColor("#FFFFFF").setBackground(navs[i]).setHorizontalAlignment("center").setVerticalAlignment("middle");
  }
  dashSheet.setRowHeight(3, 40);

  // --- C. THỐNG KÊ TỔNG QUAN (KPIs) ---
  dashSheet.getRange("A5:B5").merge().setValue("💰 DOANH THU").setFontWeight("bold").setFontColor("#6B7280").setHorizontalAlignment("center").setBackground("#F8FAFC");
  dashSheet.getRange("A6:B6").merge().setFormula('=SUM(DonHang_BT7!E4:E)').setFontSize(20).setFontWeight("bold").setFontColor("#1E293B").setHorizontalAlignment("center").setNumberFormat('#,##0 "VNĐ"');
  dashSheet.getRange("A7:B7").merge().setValue("VNĐ").setFontSize(10).setFontColor("#6B7280").setHorizontalAlignment("center");

  dashSheet.getRange("C5:D5").merge().setValue("📦 ĐƠN HÀNG").setFontWeight("bold").setFontColor("#6B7280").setHorizontalAlignment("center").setBackground("#F8FAFC");
  dashSheet.getRange("C6:D6").merge().setFormula('=COUNTA(DonHang_BT7!A4:A)').setFontSize(20).setFontWeight("bold").setFontColor("#1E293B").setHorizontalAlignment("center").setNumberFormat('#,##0');
  dashSheet.getRange("C7:D7").merge().setValue("đơn").setFontSize(10).setFontColor("#6B7280").setHorizontalAlignment("center");

  dashSheet.getRange("E5:F5").merge().setValue("👥 KHÁCH HÀNG").setFontWeight("bold").setFontColor("#6B7280").setHorizontalAlignment("center").setBackground("#F8FAFC");
  dashSheet.getRange("E6:F6").merge().setFormula('=COUNTA(KhachHang_BT7!A4:A)').setFontSize(20).setFontWeight("bold").setFontColor("#1E293B").setHorizontalAlignment("center").setNumberFormat('#,##0');
  dashSheet.getRange("E7:F7").merge().setValue("người").setFontSize(10).setFontColor("#6B7280").setHorizontalAlignment("center");

  dashSheet.getRange("G5:H5").merge().setValue("⚠️ CẢNH BÁO TỒN KHO").setFontWeight("bold").setFontColor("#991B1B").setHorizontalAlignment("center").setBackground("#FEE2E2");
  dashSheet.getRange("G6:H6").merge().setFormula('=SUMPRODUCT((SanPham_BT7!F4:F < SanPham_BT7!G4:G)*(SanPham_BT7!F4:F <> ""))').setFontSize(20).setFontWeight("bold").setFontColor("#DC2626").setHorizontalAlignment("center").setNumberFormat('#,##0');
  dashSheet.getRange("G7:H7").merge().setValue("sản phẩm").setFontSize(10).setFontColor("#991B1B").setHorizontalAlignment("center");

  // --- D. ĐẶT CÔNG THỨC BẢNG PHỤ CALC_DATA ---
  calcSheet.getRange("A1:B1").setValues([["Danh Mục", "Doanh Thu"]]);
  // Dùng chuỗi \\ để sinh ra đúng 1 dấu \ ghép mảng trong ô Google Sheets
  calcSheet.getRange("A2").setFormula(
    '=QUERY(ARRAYFORMULA({IFERROR(VLOOKUP(VLOOKUP(ChiTietDonHang_BT7!C4:C; SanPham_BT7!A:C; 3; FALSE); DanhMuc_BT7!A:B; 2; FALSE); "Chưa Rõ") \\ ChiTietDonHang_BT7!H4:H}); "SELECT Col1, SUM(Col2) WHERE Col2 IS NOT NULL GROUP BY Col1 LABEL SUM(Col2) \'\'")'
  );

  calcSheet.getRange("D1:E1").setValues([["Sản Phẩm", "Số Lượng Bán"]]);
  calcSheet.getRange("D2").setFormula(
    '=QUERY(ARRAYFORMULA({IFERROR(VLOOKUP(ChiTietDonHang_BT7!C4:C; SanPham_BT7!A:B; 2; FALSE); "Chưa Rõ") \\ ChiTietDonHang_BT7!F4:F}); "SELECT Col1, SUM(Col2) WHERE Col2 IS NOT NULL GROUP BY Col1 ORDER BY SUM(Col2) DESC LIMIT 10 LABEL SUM(Col2) \'\'")'
  );

  // Ép buộc Google Sheets tính toán hoàn tất công thức trước khi vẽ biểu đồ
  SpreadsheetApp.flush();

  // --- E. VẼ BIỂU ĐỒ ---
  // var pieChart = dashSheet.newChart()
  //   .setChartType(Charts.ChartType.PIE)
  //   .addRange(calcSheet.getRange("A1:B15"))
  //   .setPosition(9, 1, 0, 0)
  //   .setOption('title', 'Doanh Thu Theo Danh Mục Sản Phẩm')
  //   .setOption('width', 580)
  //   .setOption('height', 360)
  //   .setOption('is3D', true)
  //   .setOption('legend', {position: 'bottom'})
  //   .build();
  // dashSheet.insertChart(pieChart);

  // var barChart = dashSheet.newChart()
  //   .setChartType(Charts.ChartType.BAR)
  //   .addRange(calcSheet.getRange("D1:E11"))
  //   .setPosition(9, 5, 0, 0)
  //   .setOption('title', 'TOP 10 Sản Phẩm Bán Chạy')
  //   .setOption('width', 580)
  //   .setOption('height', 360)
  //   .setOption('colors', ['#2563EB'])
  //   .setOption('legend', {position: 'none'})
  //   .build();
  // dashSheet.insertChart(barChart);

  // Ép buộc Google Sheets tính toán hoàn tất công thức trước khi lấy dữ liệu/vẽ biểu đồ
  SpreadsheetApp.flush();
  
  // Lấy dữ liệu thực tế từ Calc_Data cho biểu đồ tròn và biểu đồ cột
  var pieData = calcSheet.getRange("A1:B" + calcSheet.getLastRow()).getValues().filter(function(r) { return r[0] !== ""; });
  var top10Bar = calcSheet.getRange("D1:E" + calcSheet.getLastRow()).getValues().filter(function(r) { return r[0] !== ""; });

  // 1. Biểu đồ tròn: Thêm đường kẻ chỉ dẫn (Callout Lines) + %
  var pieChart = dashSheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(calcSheet.getRange(1, 1, pieData.length, 2))
    .setPosition(9, 1, 0, 0)
    .setNumHeaders(1)                           // Nhận diện dòng 1 là tiêu đề
    .setOption('title', 'Doanh Thu Theo Danh Mục Sản Phẩm')
    .setOption('width', 580)
    .setOption('height', 360)
    .setOption('pieSliceText', 'percentage')     // Hiển thị %
    .setOption('legend', {position: 'labeled'}) // Vẽ đường kẻ chỉ dẫn (Callout Line)
    .build();
  dashSheet.insertChart(pieChart);

  // 2. Biểu đồ cột
  var barChart = dashSheet.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(calcSheet.getRange(1, 4, top10Bar.length, 2))
    .setPosition(9, 5, 0, 0)
    .setNumHeaders(1)
    .setOption('title', 'TOP 10 Sản Phẩm Bán Chạy')
    .setOption('width', 580)
    .setOption('height', 360)
    .setOption('colors', ['#2563EB'])
    .setOption('legend', {position: 'none'})
    .build();
  dashSheet.insertChart(barChart);



  // --- F. TOP 5 KHÁCH HÀNG VIP ---
  dashSheet.getRange("A27:E27").merge().setValue("🏆 TOP 5 KHÁCH HÀNG VIP CHI TIÊU CAO NHẤT").setFontWeight("bold").setFontColor("#FFFFFF").setBackground("#1E40AF").setHorizontalAlignment("center");
  dashSheet.getRange("A28:E28").setValues([["STT", "Tên Khách Hàng", "Loại KH", "Tổng Mua (VNĐ)", "Số Đơn"]]).setFontWeight("bold").setBackground("#E0E7FF").setHorizontalAlignment("center");
  dashSheet.getRange("A29").setFormula(
    '=LET(top; QUERY(DonHang_BT7!A4:E; "SELECT B, COUNT(A), SUM(E) WHERE B IS NOT NULL GROUP BY B ORDER BY SUM(E) DESC LIMIT 5 LABEL B \'\', COUNT(A) \'\', SUM(E) \'\'"); ' +
    'HSTACK(SEQUENCE(ROWS(top)); MAP(INDEX(top;;1); LAMBDA(mkh; IFERROR(XLOOKUP(mkh; KhachHang_BT7!A:A; KhachHang_BT7!B:B); mkh))); MAP(INDEX(top;;1); LAMBDA(mkh; IFERROR(XLOOKUP(mkh; KhachHang_BT7!A:A; KhachHang_BT7!H:H); "Thường"))); INDEX(top;;3); INDEX(top;;2)))'
  );
  dashSheet.getRange("D29:D33").setNumberFormat('#,##0 "VNĐ"');

  // --- G. TRA CỨU ĐƠN HÀNG ---
  dashSheet.getRange("G27:H27").merge().setValue("🔍 TRA CỨU ĐƠN HÀNG").setFontWeight("bold").setFontColor("#FFFFFF").setBackground("#1E40AF").setHorizontalAlignment("center");
  dashSheet.getRange("G28").setValue("Mã Đơn Hàng:").setFontWeight("bold");
  dashSheet.getRange("H28").setValue("DH-001").setBackground("#FEF08A").setHorizontalAlignment("center").setFontWeight("bold");
  dashSheet.getRange("G29").setValue("Khách Hàng:").setFontWeight("bold");
  dashSheet.getRange("H29").setFormula('=IF(H28=""; ""; IFERROR(XLOOKUP(XLOOKUP(H28; DonHang_BT7!A:A; DonHang_BT7!B:B); KhachHang_BT7!A:A; KhachHang_BT7!B:B); "Không thấy"))');
  dashSheet.getRange("G30").setValue("Trạng Thái:").setFontWeight("bold");
  dashSheet.getRange("H30").setFormula('=IF(H28=""; ""; IFERROR(XLOOKUP(H28; DonHang_BT7!A:A; DonHang_BT7!D:D); "Không thấy"))');
  dashSheet.getRange("G31").setValue("Tổng Tiền:").setFontWeight("bold");
  dashSheet.getRange("H31").setFormula('=IF(H28=""; ""; IFERROR(XLOOKUP(H28; DonHang_BT7!A:A; DonHang_BT7!E:E); 0))').setNumberFormat('#,##0 "VNĐ"');

  for (var c = 1; c <= 8; c++) dashSheet.autoResizeColumn(c);
  SpreadsheetApp.getUi().alert("✅ Đã cập nhật Dashboard TECH HUB STORE thành công!");
}

// ==========================================
// CRUD PRODUCTS
// ==========================================
function getCategories() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DanhMuc_BT7");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  data.splice(0, 3); // Bỏ 3 dòng tiêu đề
  return data.map(function(r) { return { code: r[0], name: r[1] }; });
}

function getAllProducts() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SanPham_BT7");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  data.splice(0, 3);
  return data.map(function(r) {
    return { code: r[0], name: r[1], category: r[2], unit: r[3], price: r[4], stock: r[5], minStock: r[6] };
  });
}

function getProducts(page, search) {
  page = page || 1;
  var limit = 10;
  var data = getAllProducts();

  if (search) {
    var term = search.toString().toLowerCase();
    data = data.filter(function(r) {
      return r.code.toString().toLowerCase().indexOf(term) > -1 || r.name.toString().toLowerCase().indexOf(term) > -1;
    });
  }

  var total = data.length;
  var totalPages = Math.ceil(total / limit) || 1;
  var start = (page - 1) * limit;
  return { items: data.slice(start, start + limit), totalPages: totalPages, total: total, page: page };
}

function addProduct(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SanPham_BT7");
  var rows = sheet.getDataRange().getValues();
  for (var i = 3; i < rows.length; i++) {
    if (rows[i][0] == data.code) throw new Error("Mã sản phẩm " + data.code + " đã tồn tại!");
  }
  sheet.appendRow([data.code, data.name, data.category, data.unit || "Chiếc", Number(data.price), Number(data.stock), Number(data.minStock)]);
  logInventory("Nhập Kho", data.code, Number(data.stock), "Khởi tạo sản phẩm mới");
  return true;
}

function updateProduct(code, data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SanPham_BT7");
  var rows = sheet.getDataRange().getValues();
  for (var i = 3; i < rows.length; i++) {
    if (rows[i][0] == code) {
      var oldStock = Number(rows[i][5]);
      var newStock = Number(data.stock);
      sheet.getRange(i + 1, 2, 1, 6).setValues([[data.name, data.category, data.unit, Number(data.price), newStock, Number(data.minStock)]]);
      if (oldStock !== newStock) {
        var diff = newStock - oldStock;
        logInventory(diff > 0 ? "Điều Chỉnh Tăng" : "Điều Chỉnh Giảm", code, Math.abs(diff), "Cập nhật thông tin sản phẩm");
      }
      return true;
    }
  }
  throw new Error("Không tìm thấy sản phẩm mã: " + code);
}

function deleteProduct(code) {
  var ctSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ChiTietDonHang_BT7");
  if (ctSheet) {
    var ctData = ctSheet.getDataRange().getValues();
    for (var i = 3; i < ctData.length; i++) {
      if (ctData[i][2] == code) throw new Error("Không thể xóa! Sản phẩm đã có trong chi tiết đơn hàng.");
    }
  }
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SanPham_BT7");
  var rows = sheet.getDataRange().getValues();
  for (var j = 3; j < rows.length; j++) {
    if (rows[j][0] == code) {
      sheet.deleteRow(j + 1);
      logInventory("Xóa SP", code, 0, "Xóa sản phẩm khỏi danh mục");
      return true;
    }
  }
  throw new Error("Không tìm thấy sản phẩm!");
}

// ==========================================
// CRUD CUSTOMERS (Sửa đúng cột H là Loại KH)
// ==========================================
function getAllCustomers() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("KhachHang_BT7");
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  data.splice(0, 3);
  return data.map(function(r) {
    return { code: r[0], name: r[1], phone: r[2], email: r[3], address: r[4], city: r[5], registeredDate: r[6], type: r[7] };
  });
}

function getCustomers(page, search) {
  page = page || 1;
  var limit = 10;
  var data = getAllCustomers();

  if (search) {
    var term = search.toString().toLowerCase();
    data = data.filter(function(r) {
      return r.code.toString().toLowerCase().indexOf(term) > -1 || r.name.toString().toLowerCase().indexOf(term) > -1 || r.phone.toString().toLowerCase().indexOf(term) > -1;
    });
  }

  var total = data.length;
  var totalPages = Math.ceil(total / limit) || 1;
  var start = (page - 1) * limit;
  return { items: data.slice(start, start + limit), totalPages: totalPages, total: total, page: page };
}

function addCustomer(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("KhachHang_BT7");
  var rows = sheet.getDataRange().getValues();
  for (var i = 3; i < rows.length; i++) {
    if (rows[i][0] == data.code) throw new Error("Mã khách hàng " + data.code + " đã tồn tại!");
  }
  var dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy");
  sheet.appendRow([data.code, data.name, data.phone, data.email, data.address, data.city, dateStr, data.type || "Thường"]);
  return true;
}

function updateCustomer(code, data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("KhachHang_BT7");
  var rows = sheet.getDataRange().getValues();
  for (var i = 3; i < rows.length; i++) {
    if (rows[i][0] == code) {
      var origDate = rows[i][6];
      sheet.getRange(i + 1, 2, 1, 7).setValues([[data.name, data.phone, data.email, data.address, data.city, origDate, data.type]]);
      return true;
    }
  }
  throw new Error("Không tìm thấy khách hàng!");
}

function deleteCustomer(code) {
  var dhSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DonHang_BT7");
  if (dhSheet) {
    var dhData = dhSheet.getDataRange().getValues();
    for (var i = 3; i < dhData.length; i++) {
      if (dhData[i][1] == code) throw new Error("Không thể xóa! Khách hàng đã phát sinh đơn hàng.");
    }
  }
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("KhachHang_BT7");
  var rows = sheet.getDataRange().getValues();
  for (var j = 3; j < rows.length; j++) {
    if (rows[j][0] == code) {
      sheet.deleteRow(j + 1);
      return true;
    }
  }
  throw new Error("Không tìm thấy khách hàng!");
}

// ==========================================
// CRUD ORDERS (Sửa đúng 8 cột ChiTietDonHang_BT7)
// ==========================================
function getOrders(page, search) {
  page = page || 1;
  var limit = 10;
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DonHang_BT7");
  if (!sheet) return { items: [], totalPages: 1, total: 0 };

  var data = sheet.getDataRange().getValues();
  data.splice(0, 3);

  if (search) {
    var term = search.toString().toLowerCase();
    data = data.filter(function(r) {
      return r[0].toString().toLowerCase().indexOf(term) > -1 || r[1].toString().toLowerCase().indexOf(term) > -1;
    });
  }

  var total = data.length;
  var totalPages = Math.ceil(total / limit) || 1;
  var start = (page - 1) * limit;
  var pagedData = data.slice(start, start + limit);

  var items = pagedData.map(function(r) {
    return {
      id: r[0], customerCode: r[1],
      date: r[2] instanceof Date ? Utilities.formatDate(r[2], Session.getScriptTimeZone(), "dd/MM/yyyy") : r[2],
      status: r[3], total: r[4]
    };
  });
  return { items: items, totalPages: totalPages, total: total, page: page };
}

function getOrderDetails(orderId) {
  var dhSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DonHang_BT7");
  var ctSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ChiTietDonHang_BT7");
  var khSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("KhachHang_BT7");

  var orderInfo = null;
  var dhData = dhSheet.getDataRange().getValues();
  for (var i = 3; i < dhData.length; i++) {
    if (dhData[i][0] == orderId) {
      orderInfo = {
        id: dhData[i][0], customerCode: dhData[i][1],
        date: dhData[i][2] instanceof Date ? Utilities.formatDate(dhData[i][2], Session.getScriptTimeZone(), "dd/MM/yyyy") : dhData[i][2],
        status: dhData[i][3], total: dhData[i][4]
      };
      break;
    }
  }
  if (!orderInfo) throw new Error("Không tìm thấy đơn hàng " + orderId);

  var khData = khSheet.getDataRange().getValues();
  orderInfo.customerName = orderInfo.customerCode;
  for (var k = 3; k < khData.length; k++) {
    if (khData[k][0] == orderInfo.customerCode) {
      orderInfo.customerName = khData[k][1] + " (" + orderInfo.customerCode + ")";
      break;
    }
  }

  var items = [];
  var ctData = ctSheet.getDataRange().getValues();
  for (var c = 3; c < ctData.length; c++) {
    if (ctData[c][1] == orderId) { // Cột B (index 1) là Mã Đơn Hàng
      items.push({
        detailId: ctData[c][0], productCode: ctData[c][2], productName: ctData[c][3],
        unit: ctData[c][4], qty: ctData[c][5], price: ctData[c][6], total: ctData[c][7]
      });
    }
  }
  orderInfo.items = items;
  return orderInfo;
}

function createOrder(orderData, items) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dhSheet = ss.getSheetByName("DonHang_BT7");
  var ctSheet = ss.getSheetByName("ChiTietDonHang_BT7");
  var spSheet = ss.getSheetByName("SanPham_BT7");

  var orderId = generateId("DH");
  var dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy");

  var grandTotal = 0;
  items.forEach(function(it) { grandTotal += Number(it.price) * Number(it.qty); });

  dhSheet.appendRow([orderId, orderData.customerCode, dateStr, orderData.status || "Hoàn Thành", grandTotal, "Chuyển Khoản", ""]);

  var spData = spSheet.getDataRange().getValues();
  var ctLastRow = ctSheet.getLastRow();

  items.forEach(function(it, idx) {
    var ctId = "CT" + ("000" + (ctLastRow + idx - 2)).slice(-3);
    var lineTotal = Number(it.price) * Number(it.qty);
    ctSheet.appendRow([ctId, orderId, it.productCode, it.productName, it.unit || "Chiếc", Number(it.qty), Number(it.price), lineTotal]);

    // Trừ tồn kho
    for (var i = 3; i < spData.length; i++) {
      if (spData[i][0] == it.productCode) {
        var currentStock = Number(spData[i][5]);
        var newStock = Math.max(0, currentStock - Number(it.qty));
        spSheet.getRange(i + 1, 6).setValue(newStock);
        logInventory("Xuất Bán", it.productCode, -Number(it.qty), "Xuất đơn " + orderId);
        break;
      }
    }
  });
  return orderId;
}

function updateOrderStatus(orderId, status) {
  var dhSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DonHang_BT7");
  var dhData = dhSheet.getDataRange().getValues();
  for (var i = 3; i < dhData.length; i++) {
    if (dhData[i][0] == orderId) {
      dhSheet.getRange(i + 1, 4).setValue(status);
      return true;
    }
  }
  throw new Error("Không tìm thấy đơn hàng!");
}

function deleteOrder(orderId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dhSheet = ss.getSheetByName("DonHang_BT7");
  var ctSheet = ss.getSheetByName("ChiTietDonHang_BT7");

  var dhData = dhSheet.getDataRange().getValues();
  for (var i = 3; i < dhData.length; i++) {
    if (dhData[i][0] == orderId) { dhSheet.deleteRow(i + 1); break; }
  }

  var ctData = ctSheet.getDataRange().getValues();
  for (var j = ctData.length - 1; j >= 3; j--) {
    if (ctData[j][1] == orderId) { ctSheet.deleteRow(j + 1); }
  }
  return true;
}

// ==========================================
// UTILITIES
// ==========================================
function logInventory(action, productCode, qty, note) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("LichSuTonKho_BT7");
  if (!sheet) return;

  var user = Session.getActiveUser().getEmail() || "Admin";
  var timeStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy");
  var gdId = "GD" + ("000" + (sheet.getLastRow() - 2)).slice(-3);

  var spSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SanPham_BT7");
  var spName = productCode, newStock = 0;
  if (spSheet) {
    var spData = spSheet.getDataRange().getValues();
    for (var i = 3; i < spData.length; i++) {
      if (spData[i][0] == productCode) { spName = spData[i][1]; newStock = spData[i][5]; break; }
    }
  }
  sheet.appendRow([gdId, timeStr, productCode, spName, action, qty, newStock, user, note || ""]);
}

function generateId(prefix) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DonHang_BT7");
  if (!sheet) return prefix + "-001";
  var count = Math.max(1, sheet.getLastRow() - 2); 
  var numStr = ("000" + count).slice(-3);
  return prefix + "-" + numStr;
}