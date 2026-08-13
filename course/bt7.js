COURSE_DATA.push(
  {
    id: "bt7",
    index: 7,
    title: "Bài 7: Hệ Thống Quản Lý Bán Hàng & Dashboard Doanh Thu Chuyên Nghiệp",
    shortTitle: "Quản Lý Bán Hàng & Dashboard",
    subtitle: "Apps Script Dashboard & Giao Diện Quản Lý CRUD Đồng Bộ",
    level: "Dành Cho Dân Văn Phòng",
    time: "25 phút",
    tags: ["Google Sheets Database", "Apps Script Dashboard", "Vietnamese Locale Semicolon", "CRUD Forms"],
    desc: "Quy trình thiết kế hệ thống quản lý bán hàng và Dashboard phân tích doanh thu trực quan ngay trên Google Sheets bằng Apps Script. Hệ thống hỗ trợ xem KPI, biểu đồ doanh thu theo danh mục, top sản phẩm bán chạy, quản lý khách hàng và tự động trừ kho.",
    csvFile: "bai_tap_7_quan_ly_ban_hang.xlsx",
    scriptFile: "BaiTap7_TechHubStore_Dashboard.gs",
    scriptContent: `/**
 * ==============================================================================
 * BÀI TẬP 7: HỆ THỐNG QUẢN LÝ BÁN HÀNG & DASHBOARD TECH HUB STORE
 * ==============================================================================
 * Dự án bao gồm 4 tệp code trong Apps Script Editor:
 * 1. Code.gs (Mã Backend chính)
 * 2. ProductManagement.html (Giao diện Quản Lý Sản Phẩm)
 * 3. CustomerManagement.html (Giao diện Quản Lý Khách Hàng)
 * 4. OrderManagement.html (Giao diện Quản Lý Đơn Hàng)
 * ==============================================================================
 */

// ==============================================================================
// TỆP 1: Code.gs (Dán nội dung này vào file Code.gs của dự án)
// ==============================================================================

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
function showCustomerManagement() { showDialog('CustomerManagement', '👥 Quách Lý Khách Hàng - Tech Hub Store', 920, 660); }
function showOrderManagement() { showDialog('OrderManagement', '📦 Quản Lý Đơn Hàng - Tech Hub Store', 1020, 720); }

function showHelp() {
  var helpText = "🏪 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG TECH HUB STORE\\n\\n" +
    "1. 📊 Dashboard: Hiển thị các chỉ số kinh doanh, biểu đồ và Top khách hàng VIP.\\n" +
    "2. 🛍️ Quản Lý Sản Phẩm: Thêm, sửa, xóa, tìm kiếm danh sách sản phẩm.\\n" +
    "3. 👥 Quản Lý Khách Hàng: Quản lý thông tin khách hàng VIP/Thường.\\n" +
    "4. 📦 Quản Lý Đơn Hàng: Tạo đơn hàng mới (tự động trừ tồn kho), xem chi tiết & cập nhật trạng thái.\\n" +
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
      .setFontColor("#FFFFFF").setBackground(navs[i][1]).setHorizontalAlignment("center").setVerticalAlignment("middle");
  }
  dashSheet.setRowHeight(3, 40);

  // --- C. THỐNG KÊ TỔNG QUAN (KPIs) ---
  dashSheet.getRange("A5:B5").merge().setValue("💰 DOANH THU").setFontWeight("bold").setFontColor("#6B7280").setHorizontalAlignment("center").setBackground("#F8FAFC");
  dashSheet.getRange("A6:B6").merge().setFormula('=SUM(DonHang_BT7!E4:E)').setFontSize(20).setFontWeight("bold").setFontColor("#1E293B").setHorizontalAlignment("center").setNumberFormat('#;##0 "VNĐ"');
  dashSheet.getRange("A7:B7").merge().setValue("VNĐ").setFontSize(10).setFontColor("#6B7280").setHorizontalAlignment("center");

  dashSheet.getRange("C5:D5").merge().setValue("📦 ĐƠN HÀNG").setFontWeight("bold").setFontColor("#6B7280").setHorizontalAlignment("center").setBackground("#F8FAFC");
  dashSheet.getRange("C6:D6").merge().setFormula('=COUNTA(DonHang_BT7!A4:A)').setFontSize(20).setFontWeight("bold").setFontColor("#1E293B").setHorizontalAlignment("center").setNumberFormat('#;##0');
  dashSheet.getRange("C7:D7").merge().setValue("đơn").setFontSize(10).setFontColor("#6B7280").setHorizontalAlignment("center");

  dashSheet.getRange("E5:F5").merge().setValue("👥 KHÁCH HÀNG").setFontWeight("bold").setFontColor("#6B7280").setHorizontalAlignment("center").setBackground("#F8FAFC");
  dashSheet.getRange("E6:F6").merge().setFormula('=COUNTA(KhachHang_BT7!A4:A)').setFontSize(20).setFontWeight("bold").setFontColor("#1E293B").setHorizontalAlignment("center").setNumberFormat('#;##0');
  dashSheet.getRange("E7:F7").merge().setValue("người").setFontSize(10).setFontColor("#6B7280").setHorizontalAlignment("center");

  dashSheet.getRange("G5:H5").merge().setValue("⚠️ CẢNH BÁO TỒN KHO").setFontWeight("bold").setFontColor("#991B1B").setHorizontalAlignment("center").setBackground("#FEE2E2");
  dashSheet.getRange("G6:H6").merge().setFormula('=SUMPRODUCT((SanPham_BT7!F4:F < SanPham_BT7!G4:G)*(SanPham_BT7!F4:F <> ""))').setFontSize(20).setFontWeight("bold").setFontColor("#DC2626").setHorizontalAlignment("center").setNumberFormat('#;##0');
  dashSheet.getRange("G7:H7").merge().setValue("sản phẩm").setFontSize(10).setFontColor("#991B1B").setHorizontalAlignment("center");

  // --- D. ĐẶT CÔNG THỨC BẢNG PHỤ CALC_DATA ---
  calcSheet.getRange("A1:B1").setValues([["Danh Mục", "Doanh Thu"]]);
  // Dùng chuỗi \\\\ để sinh ra đúng 1 dấu \\ ghép mảng trong ô Google Sheets ở dạng chuỗi literal
  calcSheet.getRange("A2").setFormula(
    '=QUERY(ARRAYFORMULA({IFERROR(VLOOKUP(VLOOKUP(ChiTietDonHang_BT7!C4:C; SanPham_BT7!A:C; 3; FALSE); DanhMuc_BT7!A:B; 2; FALSE); "Chưa Rõ") \\\\ ChiTietDonHang_BT7!H4:H}); "SELECT Col1; SUM(Col2) WHERE Col2 IS NOT NULL GROUP BY Col1 LABEL SUM(Col2) \'\'")'
  );

  calcSheet.getRange("D1:E1").setValues([["Sản Phẩm", "Số Lượng Bán"]]);
  calcSheet.getRange("D2").setFormula(
    '=QUERY(ARRAYFORMULA({IFERROR(VLOOKUP(ChiTietDonHang_BT7!C4:C; SanPham_BT7!A:B; 2; FALSE); "Chưa Rõ") \\\\ ChiTietDonHang_BT7!F4:F}); "SELECT Col1; SUM(Col2) WHERE Col2 IS NOT NULL GROUP BY Col1 ORDER BY SUM(Col2) DESC LIMIT 10 LABEL SUM(Col2) \'\'")'
  );

  // Ép buộc Google Sheets tính toán hoàn tất công thức trước khi lấy dữ liệu/vẽ biểu đồ
  SpreadsheetApp.flush();
  
  // Lấy dữ liệu thực tế từ Calc_Data cho biểu đồ tròn và biểu đồ cột
  var pieData = calcSheet.getRange("A1:B" + calcSheet.getLastRow()).getValues().filter(function(r) { return r[0] !== ""; });
  var top10Bar = calcSheet.getRange("D1:E" + calcSheet.getLastRow()).getValues().filter(function(r) { return r[0] !== ""; });

  // --- E. VẼ BIỂU ĐỒ ---
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
    '=LET(top; QUERY(DonHang_BT7!A4:E; "SELECT B; COUNT(A); SUM(E) WHERE B IS NOT NULL GROUP BY B ORDER BY SUM(E) DESC LIMIT 5 LABEL B \'\'; COUNT(A) \'\'; SUM(E) \'\'"); ' +
    'HSTACK(SEQUENCE(ROWS(top)); MAP(INDEX(top;;1); LAMBDA(mkh; IFERROR(XLOOKUP(mkh; KhachHang_BT7!A:A; KhachHang_BT7!B:B); mkh))); MAP(INDEX(top;;1); LAMBDA(mkh; IFERROR(XLOOKUP(mkh; KhachHang_BT7!A:A; KhachHang_BT7!H:H); "Thường"))); INDEX(top;;3); INDEX(top;;2)))'
  );
  dashSheet.getRange("D29:D33").setNumberFormat('#;##0 "VNĐ"');

  // --- G. TRA CỨU ĐƠN HÀNG ---
  dashSheet.getRange("G27:H27").merge().setValue("🔍 TRA CỨU ĐƠN HÀNG").setFontWeight("bold").setFontColor("#FFFFFF").setBackground("#1E40AF").setHorizontalAlignment("center");
  dashSheet.getRange("G28").setValue("Mã Đơn Hàng:").setFontWeight("bold");
  dashSheet.getRange("H28").setValue("DH-001").setBackground("#FEF08A").setHorizontalAlignment("center").setFontWeight("bold");
  dashSheet.getRange("G29").setValue("Khách Hàng:").setFontWeight("bold");
  dashSheet.getRange("H29").setFormula('=IF(H28=""; ""; IFERROR(XLOOKUP(XLOOKUP(H28; DonHang_BT7!A:A; DonHang_BT7!B:B); KhachHang_BT7!A:A; KhachHang_BT7!B:B); "Không thấy"))');
  dashSheet.getRange("G30").setValue("Trạng Thái:").setFontWeight("bold");
  dashSheet.getRange("H30").setFormula('=IF(H28=""; ""; IFERROR(XLOOKUP(H28; DonHang_BT7!A:A; DonHang_BT7!D:D); "Không thấy"))');
  dashSheet.getRange("G31").setValue("Tổng Tiền:").setFontWeight("bold");
  dashSheet.getRange("H31").setFormula('=IF(H28=""; ""; IFERROR(XLOOKUP(H28; DonHang_BT7!A:A; DonHang_BT7!E:E); 0))').setNumberFormat('#;##0 "VNĐ"');

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
// CRUD CUSTOMERS
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

// UTILITIES
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


// ==============================================================================
// TỆP 2: ProductManagement.html (Tạo tệp HTML mới tên ProductManagement)
// ==============================================================================

<!DOCTYPE html>
<html>
<head>
    <base target="_top">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            font-family: 'Inter', system-ui, sans-serif;
            background: #f8fafc;
            padding: 15px;
        }
        .card-custom {
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            background: #fff;
        }
        .table-hover tbody tr:hover {
            background-color: #f1f5f9;
        }
        .badge-stock {
            font-size: 0.85rem;
            padding: 0.35em 0.65em;
        }
    </style>
</head>
<body>
    <div class="card-custom p-3 mb-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="m-0 text-primary fw-bold"><i class="fa-solid fa-box-open me-2"></i>Quản Lý Sản Phẩm</h5>
            <button class="btn btn-success btn-sm fw-bold" onclick="openAddModal()">
                <i class="fa-solid fa-plus me-1"></i>Thêm Sản Phẩm
            </button>
        </div>
        <div class="row g-2 mb-3">
            <div class="col-md-8">
                <div class="input-group">
                    <span class="input-group-text bg-white"><i class="fa-solid fa-magnifying-glass text-muted"></i></span>
                    <input type="text" id="searchInput" class="form-control" placeholder="Tìm theo mã hoặc tên sản phẩm..." onkeyup="onSearch()">
                </div>
            </div>
            <div class="col-md-4 text-end">
                <button class="btn btn-outline-secondary btn-sm h-100" onclick="loadProducts()">
                    <i class="fa-solid fa-rotate me-1"></i>Làm mới
                </button>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-hover align-middle border">
                <thead class="table-light">
                    <tr>
                        <th>Mã SP</th>
                        <th>Tên Sản Phẩm</th>
                        <th>Danh Mục</th>
                        <th class="text-end">Đơn Giá</th>
                        <th class="text-center">Tồn Kho</th>
                        <th class="text-center">Thao Tác</th>
                    </tr>
                </thead>
                <tbody id="productTableBody">
                    <tr>
                        <td colspan="6" class="text-center py-4 text-muted"><i class="fa-solid fa-spinner fa-spin me-2"></i>Đang tải dữ liệu...</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="d-flex justify-content-between align-items-center pt-2">
            <small id="pageInfo" class="text-muted">Trang 1 / 1</small>
            <div>
                <button id="btnPrev" class="btn btn-outline-primary btn-sm me-1" onclick="changePage(-1)"><i class="fa-solid fa-chevron-left"></i> Trước</button>
                <button id="btnNext" class="btn btn-outline-primary btn-sm" onclick="changePage(1)">Sau <i class="fa-solid fa-chevron-right"></i></button>
            </div>
        </div>
    </div>

    <!-- Modal Thêm/Sửa Sản Phẩm -->
    <div class="modal fade" id="productModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="modalTitle">➕ Thêm Sản Phẩm Mới</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="productForm">
                        <div class="mb-2">
                            <label class="form-label fw-bold small">Mã Sản Phẩm *</label>
                            <input type="text" id="productCode" class="form-control form-control-sm" placeholder="SP001" required>
                        </div>
                        <div class="mb-2">
                            <label class="form-label fw-bold small">Tên Sản Phẩm *</label>
                            <input type="text" id="productName" class="form-control form-control-sm" required>
                        </div>
                        <div class="mb-2">
                            <label class="form-label fw-bold small">Danh Mục *</label>
                            <select id="productCategory" class="form-select form-select-sm" required>
                                <option value="">-- Chọn danh mục --</option>
                            </select>
                        </div>
                        <div class="row g-2 mb-2">
                            <div class="col-6">
                                <label class="form-label fw-bold small">Đơn Vị Tính</label>
                                <input type="text" id="productUnit" class="form-control form-control-sm" value="Chiếc">
                            </div>
                            <div class="col-6">
                                <label class="form-label fw-bold small">Đơn Giá (VNĐ) *</label>
                                <input type="number" id="productPrice" class="form-control form-control-sm" min="0" required>
                            </div>
                        </div>
                        <div class="row g-2 mb-2">
                            <div class="col-6">
                                <label class="form-label fw-bold small">Tồn Kho *</label>
                                <input type="number" id="productStock" class="form-control form-control-sm" min="0" required>
                            </div>
                            <div class="col-6">
                                <label class="form-label fw-bold small">Tồn Tối Thiểu *</label>
                                <input type="number" id="productMinStock" class="form-control form-control-sm" min="0" required>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Hủy</button>
                    <button type="button" class="btn btn-primary btn-sm" onclick="saveProduct()">💾 Lưu</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        let currentPage = 1;
        let totalPages = 1;
        let isEditMode = false;
        let searchTimeout = null;
        let bsModal = null;

        document.addEventListener("DOMContentLoaded", function () {
            bsModal = new bootstrap.Modal(document.getElementById('productModal'));
            loadCategories();
            loadProducts();
        });

        function loadCategories() {
            google.script.run.withSuccessHandler(function (cats) {
                let sel = document.getElementById('productCategory');
                sel.innerHTML = '<option value="">-- Chọn danh mục --</option>';
                cats.forEach(c => {
                    sel.innerHTML += \`<option value="\${c.code}">\${c.name}</option>\`;
                });
            }).getCategories();
        }

        function loadProducts() {
            let search = document.getElementById('searchInput').value;
            google.script.run.withSuccessHandler(function (res) {
                currentPage = res.page || 1;
                totalPages = res.totalPages || 1;
                renderTable(res.items);
                document.getElementById('pageInfo').innerText = \`Trang \${currentPage} / \${totalPages} (Tổng \${res.total} SP)\`;
                document.getElementById('btnPrev').disabled = (currentPage <= 1);
                document.getElementById('btnNext').disabled = (currentPage >= totalPages);
            }).getProducts(currentPage, search);
        }

        function renderTable(items) {
            let tbody = document.getElementById('productTableBody');
            if (!items || items.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">Không tìm thấy sản phẩm nào!</td></tr>';
                return;
            }
            let html = '';
            items.forEach(item => {
                let isLow = item.stock < item.minStock;
                let badge = isLow ? \`<span class="badge bg-danger badge-stock">\${item.stock} ⚠️</span>\` : \`<span class="badge bg-success badge-stock">\${item.stock}</span>\`;
                html += \`<tr>
          <td class="fw-bold">\${item.code}</td>
          <td>\${item.name}</td>
          <td>\${item.category}</td>
          <td class="text-end fw-bold text-primary">\${Number(item.price).toLocaleString('vi-VN')} đ</td>
          <td class="text-center">\${badge}</td>
          <td class="text-center">
            <button class="btn btn-sm btn-outline-warning me-1" onclick="editProduct('\${item.code}', '\${escapeHtml(item.name)}', '\${item.category}', '\${item.unit}', \${item.price}, \${item.stock}, \${item.minStock})"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('\${item.code}')"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>\`;
            });
            tbody.innerHTML = html;
        }

        function escapeHtml(str) {
            return str.replace(/'/g, "\\\\'").replace(/"/g, '\\\\"');
        }

        function onSearch() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => { currentPage = 1; loadProducts(); }, 300);
        }

        function changePage(delta) {
            if (currentPage + delta >= 1 && currentPage + delta <= totalPages) {
                currentPage += delta;
                loadProducts();
            }
        }

        function openAddModal() {
            isEditMode = false;
            document.getElementById('modalTitle').innerText = "➕ Thêm Sản Phẩm Mới";
            document.getElementById('productCode').readOnly = false;
            document.getElementById('productForm').reset();
            bsModal.show();
        }

        function editProduct(code, name, cat, unit, price, stock, minStock) {
            isEditMode = true;
            document.getElementById('modalTitle').innerText = "✏️ Cập Nhật Sản Phẩm";
            document.getElementById('productCode').value = code;
            document.getElementById('productCode').readOnly = true;
            document.getElementById('productName').value = name;
            document.getElementById('productCategory').value = cat;
            document.getElementById('productUnit').value = unit;
            document.getElementById('productPrice').value = price;
            document.getElementById('productStock').value = stock;
            document.getElementById('productMinStock').value = minStock;
            bsModal.show();
        }

        function saveProduct() {
            let code = document.getElementById('productCode').value.trim();
            let name = document.getElementById('productName').value.trim();
            let category = document.getElementById('productCategory').value;
            let unit = document.getElementById('productUnit').value.trim();
            let price = document.getElementById('productPrice').value;
            let stock = document.getElementById('productStock').value;
            let minStock = document.getElementById('productMinStock').value;

            if (!code || !name || !category || price === "" || stock === "") {
                alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
                return;
            }

            let data = { code, name, category, unit, price, stock, minStock };

            if (isEditMode) {
                google.script.run.withSuccessHandler(() => {
                    bsModal.hide();
                    loadProducts();
                }).withFailureHandler(err => alert(err.message)).updateProduct(code, data);
            } else {
                google.script.run.withSuccessHandler(() => {
                    bsModal.hide();
                    loadProducts();
                }).withFailureHandler(err => alert(err.message)).addProduct(data);
            }
        }

        function deleteProduct(code) {
            if (confirm(\`Bạn có chắc muốn xóa sản phẩm \${code}?\`)) {
                google.script.run.withSuccessHandler(() => {
                    loadProducts();
                }).withFailureHandler(err => alert(err.message)).deleteProduct(code);
            }
        }
    </script>
</body>
</html>


// ==============================================================================
// TỆP 3: CustomerManagement.html (Tạo tệp HTML mới tên CustomerManagement)
// ==============================================================================

<!DOCTYPE html>
<html>
<head>
    <base target="_top">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            font-family: 'Inter', system-ui, sans-serif;
            background: #f8fafc;
            padding: 15px;
        }
        .card-custom {
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            background: #fff;
        }
    </style>
</head>
<body>
    <div class="card-custom p-3 mb-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="m-0 text-primary fw-bold"><i class="fa-solid fa-users me-2"></i>Quản Lý Khách Hàng</h5>
            <button class="btn btn-success btn-sm fw-bold" onclick="openAddModal()">
                <i class="fa-solid fa-user-plus me-1"></i>Thêm Khách Hàng
            </button>
        </div>
        <div class="row g-2 mb-3">
            <div class="col-md-8">
                <input type="text" id="searchInput" class="form-control" placeholder="Tìm tên, SĐT hoặc mã KH..." onkeyup="onSearch()">
            </div>
            <div class="col-md-4 text-end">
                <button class="btn btn-outline-secondary btn-sm h-100" onclick="loadCustomers()">Làm mới</button>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-hover align-middle border">
                <thead class="table-light">
                    <tr>
                        <th>Mã KH</th>
                        <th>Tên Khách Hàng</th>
                        <th>SĐT</th>
                        <th>Email</th>
                        <th>Thành Phố</th>
                        <th>Loại</th>
                        <th class="text-center">Thao Tác</th>
                    </tr>
                </thead>
                <tbody id="customerTableBody">
                    <tr>
                        <td colspan="7" class="text-center py-3 text-muted">Đang tải dữ liệu...</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="d-flex justify-content-between align-items-center pt-2">
            <small id="pageInfo" class="text-muted">Trang 1 / 1</small>
            <div>
                <button id="btnPrev" class="btn btn-outline-primary btn-sm me-1" onclick="changePage(-1)">Trước</button>
                <button id="btnNext" class="btn btn-outline-primary btn-sm" onclick="changePage(1)">Sau</button>
            </div>
        </div>
    </div>

    <!-- Modal Khách Hàng -->
    <div class="modal fade" id="customerModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="modalTitle">Thêm Khách Hàng Mới</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="customerForm">
                        <div class="mb-2">
                            <label class="form-label fw-bold small">Mã Khách Hàng *</label>
                            <input type="text" id="custCode" class="form-control form-control-sm" placeholder="KH001" required>
                        </div>
                        <div class="mb-2">
                            <label class="form-label fw-bold small">Tên Khách Hàng *</label>
                            <input type="text" id="custName" class="form-control form-control-sm" required>
                        </div>
                        <div class="row g-2 mb-2">
                            <div class="col-6">
                                <label class="form-label fw-bold small">SĐT *</label>
                                <input type="text" id="custPhone" class="form-control form-control-sm" placeholder="0901234567" required>
                            </div>
                            <div class="col-6">
                                <label class="form-label fw-bold small">Email</label>
                                <input type="email" id="custEmail" class="form-control form-control-sm">
                            </div>
                        </div>
                        <div class="mb-2">
                            <label class="form-label fw-bold small">Địa Chỉ</label>
                            <input type="text" id="custAddress" class="form-control form-control-sm">
                        </div>
                        <div class="row g-2 mb-2">
                            <div class="col-6">
                                <label class="form-label fw-bold small">Thành Phố</label>
                                <select id="custCity" class="form-select form-select-sm">
                                    <option value="Hà Nội">Hà Nội</option>
                                    <option value="TP.HCM">TP.HCM</option>
                                    <option value="Đà Nẵng">Đà Nẵng</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <label class="form-label fw-bold small">Loại KH</label>
                                <select id="custType" class="form-select form-select-sm">
                                    <option value="Thường">Thường</option>
                                    <option value="VIP">VIP</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Hủy</button>
                    <button type="button" class="btn btn-primary btn-sm" onclick="saveCustomer()">💾 Lưu Khách Hàng</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        let currentPage = 1, totalPages = 1, isEditMode = false, bsModal = null;

        document.addEventListener("DOMContentLoaded", function () {
            bsModal = new bootstrap.Modal(document.getElementById('customerModal'));
            loadCustomers();
        });

        function loadCustomers() {
            let search = document.getElementById('searchInput').value;
            google.script.run.withSuccessHandler(res => {
                currentPage = res.page || 1;
                totalPages = res.totalPages || 1;
                renderTable(res.items);
                document.getElementById('pageInfo').innerText = \`Trang \${currentPage} / \${totalPages}\`;
            }).getCustomers(currentPage, search);
        }

        function renderTable(items) {
            let tbody = document.getElementById('customerTableBody');
            if (!items || items.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center py-3 text-muted">Không có dữ liệu</td></tr>';
                return;
            }
            let html = '';
            items.forEach(c => {
                let typeBadge = c.type === 'VIP' ? '<span class="badge bg-warning text-dark">VIP</span>' : '<span class="badge bg-secondary">Thường</span>';
                html += \`<tr>
          <td class="fw-bold">\${c.code}</td>
          <td>\${c.name}</td>
          <td>\${c.phone}</td>
          <td>\${c.email}</td>
          <td>\${c.city}</td>
          <td>\${typeBadge}</td>
          <td class="text-center">
            <button class="btn btn-sm btn-outline-warning me-1" onclick="editCust('\${c.code}', '\${c.name}', '\${c.phone}', '\${c.email}', '\${c.address}', '\${c.city}', '\${c.type}')"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteCust('\${c.code}')"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>\`;
            });
            tbody.innerHTML = html;
        }

        function openAddModal() {
            isEditMode = false;
            document.getElementById('custCode').readOnly = false;
            document.getElementById('customerForm').reset();
            bsModal.show();
        }

        function editCust(code, name, phone, email, address, city, type) {
            isEditMode = true;
            document.getElementById('custCode').value = code;
            document.getElementById('custCode').readOnly = true;
            document.getElementById('custName').value = name;
            document.getElementById('custPhone').value = phone;
            document.getElementById('custEmail').value = email;
            document.getElementById('custAddress').value = address;
            document.getElementById('custCity').value = city;
            document.getElementById('custType').value = type;
            bsModal.show();
        }

        function saveCustomer() {
            let code = document.getElementById('custCode').value.trim();
            let name = document.getElementById('custName').value.trim();
            let phone = document.getElementById('custPhone').value.trim();
            let email = document.getElementById('custEmail').value.trim();
            let address = document.getElementById('custAddress').value.trim();
            let city = document.getElementById('custCity').value;
            let type = document.getElementById('custType').value;

            let data = { code, name, phone, email, address, city, type };

            if (isEditMode) {
                google.script.run.withSuccessHandler(() => { bsModal.hide(); loadCustomers(); })
                    .withFailureHandler(err => alert(err.message)).updateCustomer(code, data);
            } else {
                google.script.run.withSuccessHandler(() => { bsModal.hide(); loadCustomers(); })
                    .withFailureHandler(err => alert(err.message)).addCustomer(data);
            }
        }

        function deleteCust(code) {
            if (confirm(\`Xóa khách hàng \${code}?\`)) {
                google.script.run.withSuccessHandler(() => loadCustomers())
                    .withFailureHandler(err => alert(err.message)).deleteCustomer(code);
            }
        }
    </script>
</body>
</html>


// ==============================================================================
// TỆP 4: OrderManagement.html (Tạo tệp HTML mới tên OrderManagement)
// ==============================================================================

<!DOCTYPE html>
<html>
<head>
    <base target="_top">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            font-family: 'Inter', system-ui, sans-serif;
            background: #f8fafc;
            padding: 15px;
        }
        .card-custom {
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            background: #fff;
        }
    </style>
</head>
<body>
    <div class="card-custom p-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="m-0 text-primary fw-bold"><i class="fa-solid fa-cart-shopping me-2"></i>Quản Lý Đơn Hàng</h5>
            <button class="btn btn-success btn-sm fw-bold" onclick="openCreateOrderModal()">
                <i class="fa-solid fa-plus me-1"></i>Tạo Đơn Hàng Mới
            </button>
        </div>
        <table class="table table-hover border align-middle">
            <thead class="table-light">
                <tr>
                    <th>Mã Đơn</th>
                    <th>Mã KH</th>
                    <th>Ngày Đặt</th>
                    <th>Trạng Thái</th>
                    <th class="text-end">Tổng Tiền</th>
                    <th class="text-center">Thao Tác</th>
                </tr>
            </thead>
            <tbody id="orderTableBody">
                <tr>
                    <td colspan="6" class="text-center py-3 text-muted">Đang tải danh sách đơn hàng...</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Modal Tạo Đơn Hàng -->
    <div class="modal fade" id="createOrderModal" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">🛒 Tạo Đơn Hàng Mới</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label fw-bold">1. Chọn Khách Hàng</label>
                        <select id="orderCustSelect" class="form-select form-select-sm">
                            <option value="">-- Đang tải danh sách KH --</option>
                        </select>
                    </div>
                    <hr>
                    <label class="form-label fw-bold">2. Thêm Sản Phẩm Vào Đơn</label>
                    <div class="row g-2 mb-2">
                        <div class="col-6">
                            <select id="orderProdSelect" class="form-select form-select-sm">
                                <option value="">-- Chọn Sản Phẩm --</option>
                            </select>
                        </div>
                        <div class="col-3">
                            <input type="number" id="orderProdQty" class="form-control form-control-sm" value="1" min="1" placeholder="Số lượng">
                        </div>
                        <div class="col-3">
                            <button class="btn btn-primary btn-sm w-100" onclick="addItemToOrder()">➕ Thêm SP</button>
                        </div>
                    </div>
                    <table class="table table-sm border mt-2">
                        <thead class="table-light">
                            <tr>
                                <th>Tên SP</th>
                                <th class="text-end">Đơn Giá</th>
                                <th class="text-center">SL</th>
                                <th class="text-end">Thành Tiền</th>
                                <th class="text-center">Xóa</th>
                            </tr>
                        </thead>
                        <tbody id="orderItemsTable">
                            <tr>
                                <td colspan="5" class="text-center text-muted">Chưa chọn sản phẩm nào</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="text-end fw-bold fs-5 text-danger me-2">
                        Tổng Đơn: <span id="grandTotalText">0 đ</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Hủy</button>
                    <button type="button" class="btn btn-success btn-sm" onclick="submitCreateOrder()">💾 Hoàn Tất Đơn Hàng</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        let orderModal = null;
        let selectedItems = [];
        let allProducts = [];

        document.addEventListener("DOMContentLoaded", function () {
            orderModal = new bootstrap.Modal(document.getElementById('createOrderModal'));
            loadOrders();
            loadCustomersAndProducts();
        });

        function loadOrders() {
            google.script.run.withSuccessHandler(res => {
                let tbody = document.getElementById('orderTableBody');
                if (!res.items || res.items.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-3 text-muted">Chưa có đơn hàng nào</td></tr>';
                    return;
                }
                let html = '';
                res.items.forEach(o => {
                    html += \`<tr>
            <td class="fw-bold">\${o.id}</td>
            <td>\${o.customerCode}</td>
            <td>\${o.date}</td>
            <td><span class="badge bg-info">\${o.status}</span></td>
            <td class="text-end fw-bold text-danger">\${Number(o.total).toLocaleString('vi-VN')} đ</td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-danger" onclick="deleteOrder('\${o.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>\`;
                });
                tbody.innerHTML = html;
            }).getOrders(1, "");
        }

        function loadCustomersAndProducts() {
            google.script.run.withSuccessHandler(res => {
                let sel = document.getElementById('orderCustSelect');
                sel.innerHTML = '<option value="">-- Chọn khách hàng --</option>';
                res.items.forEach(c => {
                    sel.innerHTML += \`<option value="\${c.code}">\${c.name} (\\ \${c.code})</option>\`;
                });
                // Sửa lỗi hiển thị mảng khách hàng dropdown
                sel.innerHTML = '<option value="">-- Chọn khách hàng --</option>';
                res.items.forEach(c => {
                    sel.innerHTML += \`<option value="\${c.code}">\${c.name} (\${c.code})</option>\`;
                });
            }).getCustomers(1, "");

            google.script.run.withSuccessHandler(res => {
                allProducts = res.items;
                let sel = document.getElementById('orderProdSelect');
                sel.innerHTML = '<option value="">-- Chọn Sản Phẩm --</option>';
                res.items.forEach(p => {
                    sel.innerHTML += \`<option value="\${p.code}">\${p.name} - \${Number(p.price).toLocaleString('vi-VN')}đ (Tồn: \${p.stock})</option>\`;
                });
            }).getProducts(1, "");
        }

        function openCreateOrderModal() {
            selectedItems = [];
            renderSelectedItems();
            orderModal.show();
        }

        function addItemToOrder() {
            let pCode = document.getElementById('orderProdSelect').value;
            let qty = Number(document.getElementById('orderProdQty').value);
            if (!pCode || qty <= 0) return;

            let prod = allProducts.find(p => p.code === pCode);
            if (!prod) return;

            let exist = selectedItems.find(i => i.productCode === pCode);
            if (exist) {
                exist.qty += qty;
            } else {
                selectedItems.push({
                    productCode: prod.code,
                    productName: prod.name,
                    price: prod.price,
                    qty: qty
                });
            }
            renderSelectedItems();
        }

        function renderSelectedItems() {
            let tbody = document.getElementById('orderItemsTable');
            if (selectedItems.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Chưa chọn sản phẩm nào</td></tr>';
                document.getElementById('grandTotalText').innerText = "0 đ";
                return;
            }
            let html = '';
            let grandTotal = 0;
            selectedItems.forEach((it, idx) => {
                let lineTotal = it.price * it.qty;
                grandTotal += lineTotal;
                html += \`<tr>
          <td>\${it.productName}</td>
          <td class="text-end">\${Number(it.price).toLocaleString('vi-VN')} đ</td>
          <td class="text-center">\${it.qty}</td>
          <td class="text-end fw-bold">\${Number(lineTotal).toLocaleString('vi-VN')} đ</td>
          <td class="text-center"><button class="btn btn-sm btn-link text-danger" onclick="removeItem(\${idx})">Xóa</button></td>
        </tr>\`;
            });
            tbody.innerHTML = html;
            document.getElementById('grandTotalText').innerText = Number(grandTotal).toLocaleString('vi-VN') + " đ";
        }

        function removeItem(idx) {
            selectedItems.splice(idx, 1);
            renderSelectedItems();
        }

        function submitCreateOrder() {
            let custCode = document.getElementById('orderCustSelect').value;
            if (!custCode) { alert("Vui lòng chọn khách hàng!"); return; }
            if (selectedItems.length === 0) { alert("Vui lòng thêm sản phẩm vào đơn!"); return; }

            google.script.run.withSuccessHandler(orderId => {
                alert("✅ Đã tạo thành công đơn hàng " + orderId);
                orderModal.hide();
                loadOrders();
            }).createOrder({ customerCode: custCode, status: "Hoàn Thành" }, selectedItems);
        }

        function deleteOrder(orderId) {
            if (confirm(\`Xóa đơn hàng \${orderId}?\`)) {
                google.script.run.withSuccessHandler(() => loadOrders()).deleteOrder(orderId);
            }
        }
    </script>
</body>
</html>
`,
    workflow: [
      { icon: "ph-database", title: "1. Cấu Trúc Bảng Tính", desc: "Tạo cấu trúc 6 sheet bán hàng (Sản phẩm, Khách hàng, Đơn hàng...)" },
      { icon: "ph-code", title: "2. Lập Trình Backend", desc: "Apps Script kết nối dữ liệu, tự động trừ tồn kho, ghi log lịch sử kho" },
      { icon: "ph-app-window", title: "3. Dashboard Động", desc: "Tính KPI tổng quan và biểu đồ tự động bằng công thức Việt Nam" },
      { icon: "ph-users", title: "4. Form Giao Diện CRUD", desc: "Thiết kế các biểu mẫu HTML/CSS quản lý sản phẩm, khách hàng, đơn hàng" }
    ],
    masterPrompt: `[VAI TRÒ]: Bạn là Chuyên gia Tự động hóa và Lập trình viên Google Apps Script / HTML UI chuyên nghiệp.
[NHIỆM VỤ]: Viết mã Google Apps Script và các tệp giao diện HTML hoàn chỉnh để xây dựng hệ thống quản lý bán hàng tích hợp Dashboard tự động trên Google Sheets cho Tech Hub Store.
[YÊU CẦU BACKEND (Google Sheets)]:
1. Tạo menu "🏪 Tech Hub Store" khi mở file (onOpen) để mở các cửa sổ giao diện:
   - "Quản Lý Sản Phẩm" (ProductManagement, 920x660)
   - "Quản Lý Khách Hàng" (CustomerManagement, 920x660)
   - "Quản Lý Đơn Hàng" (OrderManagement, 1020x720)
   - "Làm Mới Dashboard" (hàm refreshDashboard)
2. Viết các hàm nghiệp vụ:
   - Đọc, thêm, sửa, xóa dữ liệu Sản phẩm (sheet SanPham_BT7) và Khách hàng (sheet KhachHang_BT7), bỏ qua 3 dòng đầu tiêu đề. Không cho xóa sản phẩm nếu đã có đơn bán.
   - Hàm lưu đơn hàng mới: ghi vào DonHang_BT7 và ChiTietDonHang_BT7, đồng thời tự động trừ tồn kho trong SanPham_BT7 và ghi log nhật ký xuất kho vào LichSuTonKho_BT7.
3. Hàm tạo Dashboard (createDashboard):
   - Tạo sheet "📊 Dashboard" và sheet ẩn "Calc_Data" để đặt công thức biểu đồ.
   - Nạp các ô thống kê KPI Doanh thu, Đơn hàng, Khách hàng, Cảnh báo tồn kho.
   - Sử dụng dấu chấm phẩy ';' làm dấu ngăn cách tham số công thức và dấu gạch chéo ngược '\\' làm dấu ghép mảng ngang cho tiếng Việt.
   - Tự động vẽ Biểu đồ tròn (doanh thu danh mục) và Biểu đồ cột (top 10 bán chạy) lấy dữ liệu động từ Calc_Data.
   - Tạo bảng xếp hạng Top 5 khách hàng VIP chi tiêu cao nhất dùng hàm LET/MAP.
   - Tạo ô tra cứu nhanh đơn hàng bằng mã đơn trên Dashboard.
[YÊU CẦU FRONTEND (HTML/CSS/JS)]:
1. Thiết kế giao diện chuyên nghiệp tông màu Aesthetic Blue, font Inter/Quicksand, bo góc tròn và hiệu ứng bóng đổ mịn.
2. Các form đều hỗ trợ tìm kiếm, phân trang hiển thị 10 dòng, hiển thị thông báo toast/modal sinh động khi thêm, sửa hoặc xóa dữ liệu thành công.`,
    businessScenario: {
      story: "Bạn là quản lý vận hành của chuỗi cửa hàng công nghệ Tech Hub Store. Mọi quy trình xử lý đơn hàng, nhập thông tin khách hàng và cập nhật hàng tồn kho hiện tại đang làm hoàn toàn thủ công trên Google Sheets rất chậm và dễ nhầm lẫn.",
      pain: "Nhân viên phải copy-paste dữ liệu chéo nhau, quên trừ tồn kho khi bán hàng, khó khăn trong việc theo dõi biểu đồ doanh số thời gian thực và tra cứu thông tin đơn hàng.",
      solution: "Sử dụng Google Apps Script và HTML Service thiết lập hệ thống Menu, Dashboard tự động phân tích và các cửa sổ pop-up (Sản phẩm, Khách hàng, Đơn hàng) giúp đồng bộ dữ liệu chỉ với 1 click chuột."
    },
    promptBreakdown: [
      { tag: "1. VAI TRÒ & NHIỆM VỤ", title: "Chuyên gia tự động hóa Google Sheets", desc: "Nhận diện vai trò lập trình viên Apps Script và mục tiêu xây dựng web-app quản lý bán hàng đồng bộ." },
      { tag: "2. CÔNG THỨC VIỆT NAM", title: "Quy chuẩn dấu chấm phẩy ;", desc: "Thiết lập quy tắc dùng dấu chấm phẩy ngăn cách các tham số trong công thức tiếng Việt và dùng một dấu gạch chéo ngược để ghép mảng." },
      { tag: "3. TRỪ TỒN KHO TỰ ĐỘNG", title: "Đồng bộ dữ liệu hai chiều", desc: "Tự động tính thành tiền đơn hàng, thực hiện phép trừ tồn kho sản phẩm và ghi lịch sử tồn kho chi tiết." },
      { tag: "4. GIAO DIỆN HTML/CSS", title: "Form Pop-up Aesthetic Blue", desc: "Dựng giao diện form quản lý với phong cách Aesthetic Blue cao cấp, phân trang và tìm kiếm mượt mà." }
    ],
    businessRequirements: `
      <p><b>Yêu cầu nghiệp vụ cốt lõi:</b> Xây dựng ứng dụng quản lý bán hàng tự động hóa hoàn toàn trên Google Sheets:</p>
      <ul>
        <li><b>Đồng bộ dữ liệu:</b> Tự động cập nhật 6 sheets dữ liệu liên kết chéo.</li>
        <li><b>Công thức chuẩn Locale Việt Nam:</b> Áp dụng dấu chấm phẩy <code>;</code> và mảng ngang <code>\\</code> để Sheets không báo lỗi <code>#ERROR!</code>.</li>
        <li><b>Tự động trừ tồn kho:</b> Khi hoàn tất đơn hàng, tồn kho sản phẩm tự động giảm và ghi log chi tiết.</li>
        <li><b>Dashboard tương tác:</b> Biểu đồ tự vẽ động, xếp hạng Top 5 VIP chi tiêu dùng hàm <code>LET/MAP</code>, tra cứu thông tin đơn hàng theo mã.</li>
      </ul>
    `,
    tableHeaders: ["Mã KH", "Tên Khách Hàng", "SĐT", "Email", "Địa Chỉ", "Thành Phố", "Ngày Đăng Ký", "Loại KH"],
    tableRows: [
      ["KH001", "Nguyễn Văn An", "0901234567", "an.nguyen@gmail.com", "12 Hoàng Hoa Thám", "Hà Nội", "01/08/2026", "VIP"],
      ["KH002", "Trần Thị Bích", "0912345678", "bich.tran@gmail.com", "45 Lê Duẩn, Q.1", "TP.HCM", "02/08/2026", "Thường"],
      ["KH003", "Lê Hoàng Long", "0987654321", "long.le@gmail.com", "78 Nguyễn Huệ", "Đà Nẵng", "04/08/2026", "Thường"],
      ["KH004", "Phạm Minh Trang", "0934567890", "trang.pham@gmail.com", "102 Cách Mạng Tháng 8", "TP.HCM", "06/08/2026", "VIP"]
    ],
    steps: [
      {
        badge: "01",
        title: "Bước 1: Thiết lập thanh công cụ Menu tiện ích",
        desc: "Yêu cầu AI viết mã Apps Script tạo menu điều hướng mở các giao diện và thực hiện làm mới Dashboard.",
        promptBox: `Tôi muốn viết một đoạn mã Google Apps Script để tạo Menu tùy chỉnh trên thanh công cụ của Google Sheets.
Khi tôi mở file bảng tính này lên, hãy tự động xuất hiện một Menu mới tên là "🏪 Tech Hub Store" gồm các mục chọn sau:
1. "📊 Dashboard Tổng Quan" (khi bấm vào sẽ chạy chức năng làm mới Dashboard)
2. Một đường gạch ngang phân cách
3. "🛍️ Quản Lý Sản Phẩm" (khi bấm vào sẽ mở ra giao diện quản lý sản phẩm)
4. "👥 Quản Lý Khách Hàng" (khi bấm vào sẽ mở ra giao diện quản lý khách hàng)
5. "📦 Quản Lý Đơn Hàng" (khi bấm vào sẽ mở ra giao diện tạo và quản lý đơn hàng)
6. Một đường gạch ngang phân cách
7. "🔄 Làm Mới Dashboard" (khi bấm vào sẽ chạy chức năng cập nhật lại số liệu Dashboard)
8. "❓ Hướng Dẫn Sử Dụng" (khi bấm vào sẽ hiện một bảng thông báo nhỏ hướng dẫn sơ lược cách dùng)

Yêu cầu thiết lập kích thước các cửa sổ giao diện khi mở ra:
- Cửa sổ Sản phẩm: rộng 920px, cao 660px.
- Cửa sổ Khách hàng: rộng 920px, cao 660px.
- Cửa sổ Đơn hàng: rộng 1020px, cao 720px.`
      },
      {
        badge: "02",
        title: "Bước 2: Thiết lập trang Dashboard và các ô chỉ số KPI",
        desc: "AI tạo trang thống kê tổng quan và nạp các công thức tính toán doanh số chuẩn locale tiếng Việt.",
        promptBox: `Hãy viết hàm Google Apps Script để khởi tạo và định cấu trúc trang tính "📊 Dashboard". 
Yêu cầu chi tiết như sau:
1. Mỗi lần tôi chạy chức năng này, hãy xóa toàn bộ bảng biểu và biểu đồ cũ trên trang "📊 Dashboard" để làm mới từ đầu. Nếu chưa có trang này thì tự động tạo mới.
2. Tạo một dòng tiêu đề lớn ở hàng 1: "🏪 TECH HUB STORE - DASHBOARD QUẢN LÝ", định dạng cỡ chữ lớn 20, in đậm, chữ màu trắng, nền màu xanh dương đậm.
3. Thiết kế 4 ô thông tin nổi bật (KPI) từ hàng 5 đến hàng 7:
   - Ô 1: "💰 DOANH THU" (tự động tính tổng tiền từ cột E của trang tính "DonHang_BT7", lấy dữ liệu từ dòng 4 trở đi).
   - Ô 2: "📦 ĐƠN HÀNG" (tự động đếm số đơn hàng tại cột A của trang tính "DonHang_BT7", lấy dữ liệu từ dòng 4 trở đi).
   - Ô 3: "👥 KHÁCH HÀNG" (tự động đếm số khách hàng tại cột A của trang tính "KhachHang_BT7", lấy từ dòng 4 trở đi).
   - Ô 4: "⚠️ CẢNH BÁO TỒN KHO" (tự động đếm xem có bao nhiêu sản phẩm có lượng tồn kho hiện tại nhỏ hơn lượng tồn kho tối thiểu trong trang tính "SanPham_BT7", lấy dữ liệu từ dòng 4 trở đi).

* LƯU Ý QUAN TRỌNG VỀ ĐỊNH DẠNG VIỆT NAM:
- Tất cả các công thức điền vào ô trang tính bắt buộc phải sử dụng dấu chấm phẩy ';' làm dấu phân cách (ví dụ: dùng SUM(A1; A2) chứ không dùng dấu phẩy như ở Mỹ).
- Ô doanh thu và tiền tệ cần định dạng hiển thị số có phân cách hàng nghìn và thêm chữ 'VNĐ' ở cuối (ví dụ: 1.500.000 VNĐ).`
      },
      {
        badge: "03",
        title: "Bước 3: Thiết lập công thức mảng và tự động vẽ biểu đồ",
        desc: "AI lập trình biểu đồ tròn phân tích ngành hàng và biểu đồ cột top 10 sản phẩm bán chạy sử dụng sheet Calc_Data trung gian.",
        promptBox: `Tôi muốn viết mã Apps Script để tự động vẽ biểu đồ trên trang Dashboard:
1. Tạo thêm một trang tính phụ tên là "Calc_Data" để làm nơi tính toán trung gian và ẩn trang này đi.
2. Điền công thức mảng để tự động lọc và gom nhóm doanh thu theo từng Danh mục sản phẩm (sử dụng dữ liệu từ trang ChiTietDonHang_BT7 và SanPham_BT7 bắt đầu từ dòng 4).
3. Điền công thức mảng để tự động tìm ra Top 10 sản phẩm bán được số lượng nhiều nhất.

* LƯU Ý CÔNG THỨC TIẾNG VIỆT:
- Trong công thức Excel/Sheets tiếng Việt, các hàm phải phân tách bằng dấu chấm phẩy ';'.
- Khi ghép các cột dữ liệu hàng ngang trong công thức mảng, bắt buộc phải dùng dấu gạch chéo ngược '\\'. Vì vậy, trong đoạn mã JavaScript, hãy viết là hai dấu gạch chéo ngược "\\\\" để khi lưu xuống ô tính Excel nó hiển thị đúng một dấu '\\' (ví dụ: [Cột 1] \\\\ [Cột 2]).
4. Vẽ một biểu đồ tròn thể hiện tỷ lệ phần trăm doanh thu theo từng Danh mục sản phẩm, hiển thị rõ nhãn tên danh mục có đường kẻ chỉ dẫn.
5. Vẽ một biểu đồ cột thể hiện Top 10 sản phẩm bán chạy nhất. Đặt cả 2 biểu đồ này nằm gọn gàng bên dưới các ô thông tin KPI trên trang Dashboard.`
      },
      {
        badge: "04",
        title: "Bước 4: Nghiệp vụ lưu dữ liệu, tự động trừ kho và ghi log",
        desc: "Hoàn thiện các hàm backend đồng bộ dữ liệu sản phẩm, khách hàng, lưu đơn hàng, trừ tồn kho và ghi nhật ký giao dịch kho tự động.",
        promptBox: `Hãy viết mã Apps Script đóng vai trò xử lý dữ liệu ở trang tính để kết nối với giao diện người dùng:
1. Đối với Sản phẩm và Khách hàng: Viết các chức năng giúp lấy danh sách (hỗ trợ phân trang 10 dòng mỗi trang và tìm kiếm theo tên hoặc mã), chức năng thêm mới, chỉnh sửa thông tin và xóa. 
   - Lưu ý đặc biệt: Khi người dùng muốn xóa một sản phẩm, hãy kiểm tra xem sản phẩm đó đã từng xuất hiện trong đơn hàng nào ở trang ChiTietDonHang_BT7 chưa. Nếu đã có thì báo lỗi "Không thể xóa sản phẩm đã bán" và không cho xóa.
2. Đối với Đơn hàng: Viết chức năng lưu đơn hàng mới khi người dùng nhấn Hoàn tất trên giao diện:
   - Ghi thông tin chung (Mã đơn hàng tự động tăng, Khách hàng, Ngày mua, Tổng tiền đơn hàng) vào trang DonHang_BT7.
   - Ghi chi tiết từng mặt hàng được mua (Mã sản phẩm, Tên sản phẩm, Đơn vị tính, Số lượng, Đơn giá, Thành tiền) vào trang ChiTietDonHang_BT7.
   - **Tự động trừ kho**: Với mỗi mặt hàng được bán, hãy tìm đúng sản phẩm đó ở trang SanPham_BT7 và giảm số lượng tồn kho của sản phẩm đó đi tương ứng với số lượng khách mua.
   - **Ghi nhật ký tồn kho**: Tự động ghi một dòng thông tin vào trang LichSuTonKho_BT7 gồm: Mã giao dịch, ngày giao dịch, mã sản phẩm, loại giao dịch là "Xuất Bán", số lượng xuất (số âm), tồn kho mới sau khi trừ, và tên người thực hiện.

* Lưu ý chung: Tất cả dữ liệu sản phẩm, khách hàng, đơn hàng trên các sheet đều bắt đầu từ dòng số 4 (dòng 1 đến 3 là tiêu đề). Hãy điều chỉnh mã để khi tìm kiếm hoặc cập nhật thì bỏ qua 3 dòng đầu này.`
      },
      {
        badge: "05",
        title: "Bước 5: Thiết kế giao diện các Form quản lý HTML",
        desc: "Yêu cầu AI thiết kế 3 giao diện HTML theo phong cách Aesthetic Blue cao cấp, hỗ trợ tìm kiếm và phân trang.",
        promptBox: `Hãy thiết kế 3 tệp giao diện HTML riêng biệt: ProductManagement.html, CustomerManagement.html, và OrderManagement.html.
Yêu cầu thiết kế:
1. Giao diện đồng bộ theo tông màu Aesthetic Blue sang trọng, bo góc 12px, font chữ Inter/Quicksand hiện đại, sử dụng thư viện Bootstrap 5 và biểu tượng FontAwesome.
2. Form Quản lý Sản phẩm và Khách hàng: Có bảng danh sách (hiển thị 10 dòng/trang, có phân trang, có ô tìm kiếm), nút Thêm mới mở popup modal, mỗi dòng có nút Sửa (icon bút màu vàng) và Xóa (icon thùng rác màu đỏ). Khi click nút Sửa, tải dữ liệu cũ vào modal để sửa.
3. Form Quản lý Đơn hàng: Có nút Tạo đơn hàng mới mở popup modal. Trong modal gồm: Dropdown chọn khách hàng, khu vực chọn sản phẩm và nhập số lượng, nút 'Thêm sản phẩm' để đẩy sản phẩm vào bảng giỏ hàng tạm thời bên dưới, tính tổng tiền đơn hàng tự động và nút 'Hoàn tất đơn hàng' để gửi dữ liệu về backend lưu vào sheets.`
      }
    ],
    checklist: [
      "Trang tính gồm đủ 6 sheets nguồn với tên gọi chính xác: DanhMuc_BT7, SanPham_BT7, KhachHang_BT7, DonHang_BT7, ChiTietDonHang_BT7, LichSuTonKho_BT7.",
      "Bảng dữ liệu của các sheet đều bắt đầu ghi nhận từ dòng thứ 4 trở đi (3 dòng đầu dành cho tiêu đề và trang trí).",
      "Đã tạo đủ 4 file trong Apps Script Editor: Code.gs, ProductManagement.html, CustomerManagement.html, OrderManagement.html.",
      "Menu '🏪 Tech Hub Store' hiển thị trên thanh công cụ sau khi mở file Google Sheets.",
      "Trang Dashboard tự động tạo mới, hiển thị đúng 4 thẻ chỉ số KPI Doanh thu, Đơn hàng, Khách hàng, Cảnh báo tồn kho mà không có ô nào báo lỗi #ERROR!.",
      "Biểu đồ tròn Doanh thu theo Danh mục và biểu đồ cột Top 10 sản phẩm bán chạy tự động vẽ dựa trên sheet Calc_Data mà không bị lỗi mảng.",
      "Tạo đơn hàng mới thành công, tồn kho của sản phẩm trong sheet SanPham_BT7 tự động giảm và sheet LichSuTonKho_BT7 tự động ghi log giao dịch."
    ],
    triggerGuide: `
      <h3 class="section-title"><i class="ph-bold ph-lightning"></i> Tự Động Hóa Định Kỳ</h3>
      <p style="color: var(--text-secondary); line-height: 1.7;">
        Học viên có thể cài đặt Trigger tự động kích hoạt hàm <code>refreshDashboard()</code> mỗi giờ một lần hoặc chạy định kỳ cuối ngày lúc 23:00 để gửi báo cáo tóm tắt các sản phẩm có tồn kho dưới hạn mức tối thiểu đến email của người quản lý.
      </p>
    `
  }
);
