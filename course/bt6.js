COURSE_DATA.push(
{
    id: "bt6",
    index: 6,
    title: "Bài 6: Hệ Thống Quản Lý Sổ Quỹ Thu Chi, Tự Động Đồng Bộ Gmail & Dashboard Dòng Tiền",
    shortTitle: "Quản Lý Sổ Quỹ & Đồng Bộ Gmail",
    subtitle: "Apps Script Đọc Thử Gmail Ra Mail_Log, Nạp Sổ Quỹ & Cài Trigger 5 Phút",
    level: "Dành Cho Dân Văn Phòng",
    time: "25 phút",
    tags: ["Quản Lý Thu Chi", "Đọc Thử Gmail", "Bóc Tách Mail_Log", "Ngân Hàng Biến Động Số Dư", "Time-driven Trigger"],
    desc: "Quy trình thiết kế hệ thống Quản lý Sổ Quỹ Thu/Chi và Dashboard dòng tiền tự động hóa trên Google Sheets bằng Apps Script. Hệ thống hỗ trợ: (1) Đọc thử email biên lai BIDV/VCB bóc tách dữ liệu ra sheet Mail_Log để kiểm tra, (2) Nạp chuẩn 12 cột vào sheet Giao_Dich, (3) Cài đặt Trigger tự động ngầm 5 phút, (4) Theo dõi 4 KPI & 2 biểu đồ, (5) Form nhập nhanh tiền mặt.",
    csvFile: "bai6.xlsx",
    scriptFile: "BaiTap6_QuanLyThuChi_Dashboard.gs",
    scriptContent: `/**
 * ==============================================================================
 * BÀI TẬP 6: HỆ THỐNG QUẢN LÝ SỔ QUỸ THU CHI, QUÉT GMAIL & DASHBOARD DÒNG TIỀN
 * ==============================================================================
 * Cấu trúc dự án theo mô hình tách từng file độc lập:
 * 1. 1_Menu_ThuChi.gs      (Menu thanh công cụ, Đồng bộ Gmail & Mở Form Popup)
 * 2. 2_Dashboard_KPI.gs   (Khởi tạo Dashboard & 4 Thẻ KPI Thu/Chi/Số Dư)
 * 3. 3_CalcData_ThuChi.gs (Trang phụ Calc_Data tính toán gom nhóm)
 * 4. 4_PieChart_ChiTieu.gs (Vẽ biểu đồ tròn cơ cấu chi tiêu theo nhóm)
 * 5. 5_BarChart_KenhTT.gs  (Vẽ biểu đồ cột chi tiêu theo kênh thanh toán)
 * 6. 6_BackendService.gs  (Xử lý thêm giao dịch thủ công, tính VAT & ghi log)
 * 7. 7_DocThuEmail_Bank.gs (🌟 BƯỚC 7: Đọc thử email BIDV & xuất dữ liệu ra sheet Mail_Log để kiểm chứng)
 * 8. 8_NapGiaoDich_Bank.gs (🌟 BƯỚC 8: Nạp chuẩn 12 cột vào Giao_Dich & cập nhật Dashboard)
 * 9. 9_Trigger_AutoSync.gs (🌟 BƯỚC 9: Cài đặt Time-driven Trigger chạy ngầm mỗi 5 phút)
 * 10. GiaoDichForm.html   (Giao diện Form nhập giao dịch nhanh Aesthetic Blue)
 * ==============================================================================
 */

// ==============================================================================
// 1. FILE 1_Menu_ThuChi.gs
// ==============================================================================
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('💰 Quản Lý Thu Chi')
    .addItem('📊 Dashboard Sổ Quỹ', 'khoiTaoDashboardThuChi')
    .addSeparator()
    .addItem('🔍 1. Đọc Thử Email Ra Sheet Mail_Log', 'docThuEmailXuatMailLog')
    .addItem('📥 2. Nạp Chính Thức Vào Sổ Quỹ Giao_Dich', 'quetVaNapVaoGiaoDich')
    .addItem('⏰ 3. Bật Tự Động Quét Gmail (Mỗi 5 Phút)', 'caiDatTriggerQuetGmail')
    .addItem('🛑 Tắt Tự Động Quét Gmail', 'huyTriggerQuetGmail')
    .addSeparator()
    .addItem('➕ Nhập Giao Dịch Thủ Công', 'moFormNhapGiaoDich')
    .addSeparator()
    .addItem('🔄 Làm Mới Dashboard', 'khoiTaoDashboardThuChi')
    .addItem('❓ Hướng Dẫn Sử Dụng', 'hienThiHuongDanThuChi')
    .addToUi();
}

function moFormNhapGiaoDich() {
  var html = HtmlService.createTemplateFromFile('GiaoDichForm')
    .evaluate()
    .setWidth(720)
    .setHeight(620)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  SpreadsheetApp.getUi().showModalDialog(html, '➕ Nhập Giao Dịch Thu/Chi Mới');
}

function hienThiHuongDanThuChi() {
  var msg = "=== HƯỚNG DẪN QUẢN LÝ SỔ QUỸ THU CHI & ĐỒNG BỘ GMAIL ===\\n\\n" +
    "1. 🔍 Đọc Thử Email: Bóc tách email BIDV xuất ra sheet 'Mail_Log' để kiểm tra trước.\\n" +
    "2. 📥 Nạp Chính Thức: Đưa dữ liệu chuẩn vào sheet 'Giao_Dich' & cập nhật Dashboard.\\n" +
    "3. ⏰ Bật Tự Động Quét: Cài Trigger chạy ngầm mỗi 5 phút hoàn toàn tự động.\\n" +
    "4. ➕ Nhập Thủ Công: Form popup nhập các khoản tiền mặt ngoài ngân hàng.";
  SpreadsheetApp.getUi().alert('❓ Hướng Dẫn', msg, SpreadsheetApp.getUi().ButtonSet.OK);
}

// ==============================================================================
// 2. FILE 2_Dashboard_KPI.gs
// ==============================================================================
function khoiTaoDashboardThuChi() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheet = ss.getSheetByName('Giao_Dich');
  if (!sourceSheet) {
    SpreadsheetApp.getUi().alert('Lỗi: Không tìm thấy sheet nguồn "Giao_Dich"!');
    return;
  }

  // Khởi tạo trang Dashboard
  var dashName = "📊 Dashboard Sổ Quỹ";
  var dashSheet = ss.getSheetByName(dashName) || ss.insertSheet(dashName, 0);
  ss.setActiveSheet(dashSheet);
  ss.moveActiveSheet(1);
  dashSheet.clear();
  dashSheet.getCharts().forEach(function(c) { dashSheet.removeChart(c); });

  // Thiết lập Banner
  dashSheet.getRange("A1:H1").merge().setValue("💰 SỔ QUỸ THU CHI & QUẢN TRỊ DÒNG TIỀN 2026")
    .setFontSize(18).setFontWeight("bold").setFontColor("#FFFFFF").setBackground("#0f4c81")
    .setHorizontalAlignment("center").setVerticalAlignment("middle");
  dashSheet.setRowHeight(1, 55);

  var timeStr = Utilities.formatDate(new Date(), 'GMT+7', 'dd/MM/yyyy HH:mm:ss');
  dashSheet.getRange("A3:H3").merge().setValue("📅 Dữ liệu cập nhật tự động lúc: " + timeStr)
    .setFontColor("#627d98").setFontSize(10).setFontStyle("italic")
    .setHorizontalAlignment("center").setVerticalAlignment("middle");
  dashSheet.setRowHeight(3, 25);

  // 4 Thẻ KPI
  // KPI 1: TỔNG THU
  dashSheet.getRange("A5:B5").merge().setValue("🟢 TỔNG THU (ĐÃ THU)").setBackground("#e6f4ea").setFontColor("#137333").setFontWeight("bold").setHorizontalAlignment("center");
  dashSheet.getRange("A6:B7").merge().setFormula('=SUMIFS(Giao_Dich!J3:J; Giao_Dich!C3:C; "Thu")').setBackground("#e6f4ea").setFontColor("#0d652d").setFontSize(16).setFontWeight("bold").setNumberFormat('#,##0 "VNĐ"').setHorizontalAlignment("center").setVerticalAlignment("middle");
  dashSheet.getRange("A5:B7").setBorder(true, true, true, true, false, false, "#81c995", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  // KPI 2: TỔNG CHI
  dashSheet.getRange("C5:D5").merge().setValue("🔴 TỔNG CHI (ĐÃ CHI)").setBackground("#fce8e6").setFontColor("#c5221f").setFontWeight("bold").setHorizontalAlignment("center");
  dashSheet.getRange("C6:D7").merge().setFormula('=SUMIFS(Giao_Dich!J3:J; Giao_Dich!C3:C; "Chi")').setBackground("#fce8e6").setFontColor("#a50e0e").setFontSize(16).setFontWeight("bold").setNumberFormat('#,##0 "VNĐ"').setHorizontalAlignment("center").setVerticalAlignment("middle");
  dashSheet.getRange("C5:D7").setBorder(true, true, true, true, false, false, "#f28b82", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  // KPI 3: SỐ DƯ QUỸ
  dashSheet.getRange("E5:F5").merge().setValue("🔵 SỐ DƯ QUỸ THỰC TẾ").setBackground("#e8f0fe").setFontColor("#1a73e8").setFontWeight("bold").setHorizontalAlignment("center");
  dashSheet.getRange("E6:F7").merge().setFormula('=A6-C6').setBackground("#e8f0fe").setFontColor("#174ea6").setFontSize(16).setFontWeight("bold").setNumberFormat('#,##0 "VNĐ"').setHorizontalAlignment("center").setVerticalAlignment("middle");
  dashSheet.getRange("E5:F7").setBorder(true, true, true, true, false, false, "#8ab4f8", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  // KPI 4: TỶ LỆ CHI/THU
  dashSheet.getRange("G5:H5").merge().setValue("📊 TỶ LỆ CHI / THU").setBackground("#f3e8fd").setFontColor("#7627bb").setFontWeight("bold").setHorizontalAlignment("center");
  dashSheet.getRange("G6:H7").merge().setFormula('=IF(A6>0; C6/A6; 0)').setBackground("#f3e8fd").setFontColor("#52188c").setFontSize(16).setFontWeight("bold").setNumberFormat('0.0%').setHorizontalAlignment("center").setVerticalAlignment("middle");
  dashSheet.getRange("G5:H7").setBorder(true, true, true, true, false, false, "#c58af9", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  // Tự động gọi các hàm tạo bảng phụ và vẽ biểu đồ nếu có
  if (typeof thietLapCalcDataThuChi === 'function') {
    var calcSheet = thietLapCalcDataThuChi(ss);
    SpreadsheetApp.flush();
    if (typeof veBieuDoTronChiTieu === 'function') veBieuDoTronChiTieu(dashSheet, calcSheet);
    if (typeof veBieuDoCotKenhTT === 'function') veBieuDoCotKenhTT(dashSheet, calcSheet);
  }
}

// ==============================================================================
// 3. FILE 3_CalcData_ThuChi.gs
// ==============================================================================
function thietLapCalcDataThuChi(ss) {
  var ssObj = ss || SpreadsheetApp.getActiveSpreadsheet();
  var calcName = "Calc_Data";
  var calcSheet = ssObj.getSheetByName(calcName) || ssObj.insertSheet(calcName);
  calcSheet.clear();

  // Bảng 1: Cơ cấu Chi tiêu theo Nhóm (A1:B9)
  calcSheet.getRange("A1:B1").setValues([["Nhóm Chi Tiêu", "Tổng Chi Sau Thuế"]]).setFontWeight("bold");
  var nhomList = ["Ăn uống", "Đi lại", "Nhà ở", "Mua sắm", "Y tế", "Học tập", "Giải trí", "Khác"];
  var nhomFormulas = [];
  for (var i = 0; i < nhomList.length; i++) {
    var rIdx = i + 2;
    nhomFormulas.push([
      nhomList[i],
      '=SUMIFS(Giao_Dich!J$3:J; Giao_Dich!C$3:C; "Chi"; Giao_Dich!D$3:D; A' + rIdx + ')'
    ]);
  }
  calcSheet.getRange(2, 1, nhomFormulas.length, 2).setFormulas(nhomFormulas);
  calcSheet.getRange("B2:B9").setNumberFormat("#,##0");

  // Bảng 2: Chi tiêu theo Kênh Thanh Toán (D1:E5)
  calcSheet.getRange("D1:E1").setValues([["Kênh Thanh Toán", "Tổng Chi"]]).setFontWeight("bold");
  var kenhList = ["Tiền mặt", "Chuyển khoản", "Ví điện tử", "Thẻ ngân hàng"];
  var kenhFormulas = [];
  for (var k = 0; k < kenhList.length; k++) {
    var kIdx = k + 2;
    kenhFormulas.push([
      kenhList[k],
      '=SUMIFS(Giao_Dich!J$3:J; Giao_Dich!C$3:C; "Chi"; Giao_Dich!G$3:G; D' + kIdx + ')'
    ]);
  }
  calcSheet.getRange(2, 4, kenhFormulas.length, 2).setFormulas(kenhFormulas);
  calcSheet.getRange("E2:E5").setNumberFormat("#,##0");

  return calcSheet;
}

// ==============================================================================
// 4. FILE 4_PieChart_ChiTieu.gs
// ==============================================================================
function veBieuDoTronChiTieu(dashSheet, calcSheet) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dSheet = dashSheet || ss.getSheetByName("📊 Dashboard Sổ Quỹ");
  var cSheet = calcSheet || ss.getSheetByName("Calc_Data");
  if (!dSheet || !cSheet) return;

  var pieRange = cSheet.getRange("A1:B9");
  var pieChart = dSheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(pieRange)
    .setNumHeaders(1)
    .setPosition(9, 1, 0, 0)
    .setOption("title", "📊 CƠ CẤU CHI TIÊU THEO TỪNG NHÓM")
    .setOption("titleTextStyle", { color: "#0f4c81", fontSize: 13, bold: true })
    .setOption("pieSliceText", "percentage")
    .setOption("legend", { position: "right", textStyle: { fontSize: 11, color: "#334e68" } })
    .setOption("width", 490)
    .setOption("height", 360)
    .build();

  dSheet.insertChart(pieChart);
}

// ==============================================================================
// 5. FILE 5_BarChart_KenhTT.gs
// ==============================================================================
function veBieuDoCotKenhTT(dashSheet, calcSheet) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dSheet = dashSheet || ss.getSheetByName("📊 Dashboard Sổ Quỹ");
  var cSheet = calcSheet || ss.getSheetByName("Calc_Data");
  if (!dSheet || !cSheet) return;

  var colRange = cSheet.getRange("D1:E5");
  var colChart = dSheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(colRange)
    .setNumHeaders(1)
    .setPosition(9, 5, 0, 0)
    .setOption("title", "💳 CHI TIÊU THEO KÊNH THANH TOÁN")
    .setOption("titleTextStyle", { color: "#0f4c81", fontSize: 13, bold: true })
    .setOption("colors", ["#2563EB"])
    .setOption("legend", { position: "none" })
    .setOption("hAxis", { title: "Kênh Thanh Toán", textStyle: { fontSize: 10 } })
    .setOption("vAxis", { title: "Số Tiền Chi (VNĐ)", minValue: 0 })
    .setOption("width", 560)
    .setOption("height", 360)
    .build();

  dSheet.insertChart(colChart);
}

// ==============================================================================
// 6. FILE 6_BackendService.gs
// ==============================================================================
function luuGiaoDichMoi(formData) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Giao_Dich");
    if (!sheet) return { success: false, message: "Không tìm thấy trang tính Giao_Dich!" };

    var soTien = Number(formData.soTien) || 0;
    var vat = Number(formData.vat) || 0;
    var tongSauThue = Math.round(soTien * (1 + vat));

    var newRow = [
      formData.ngayGD,       // Cột A: Ngày GD
      formData.thangNam,      // Cột B: Tháng/Năm
      formData.loaiGD,        // Cột C: Loại GD (Thu / Chi)
      formData.nhomChiTieu,   // Cột D: Nhóm Chi Tiêu
      formData.moTa,          // Cột E: Mô Tả
      formData.nguoiLienQuan, // Cột F: Người Liên Quan
      formData.kenhTT,        // Cột G: Kênh Thanh Toán
      soTien,                 // Cột H: Số Tiền
      vat,                    // Cột I: VAT (%)
      tongSauThue,            // Cột J: Tổng Sau Thuế
      formData.trangThai,     // Cột K: Trạng Thái
      formData.ghiChu         // Cột L: Ghi Chú
    ];

    sheet.appendRow(newRow);
    SpreadsheetApp.flush();

    // Làm mới lại Dashboard nếu đang có
    if (typeof khoiTaoDashboardThuChi === 'function') {
      khoiTaoDashboardThuChi();
    }

    return { success: true, message: "Đã lưu giao dịch thành công!" };
  } catch (e) {
    return { success: false, message: "Lỗi lưu dữ liệu: " + e.toString() };
  }
}

// ==============================================================================
// 7. FILE 7_DocThuEmail_Bank.gs (🌟 BƯỚC 7: ĐỌC THỬ & XUẤT RA SHEET Mail_Log)
// ==============================================================================
function docThuEmailXuatMailLog() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var logName = "Mail_Log";
  var logSheet = ss.getSheetByName(logName) || ss.insertSheet(logName);
  
  // Khởi tạo dòng tiêu đề nếu sheet còn trống
  if (logSheet.getLastRow() === 0) {
    logSheet.getRange("A1:G1").setValues([[
      "Thời Gian Quét", "Tiêu Đề Email", "Số Lệnh GD", "Ngày GD Bóc Được", "Người Chuyển", "Số Tiền (VNĐ)", "Nội Dung Chuyển Tiền"
    ]]).setFontWeight("bold").setBackground("#e8f0fe");
    logSheet.setRowHeight(1, 35);
  }

  // Tìm kiếm email từ BIDV hoặc tài khoản gửi giả lập
  var query = 'from:nguyentuanviet12k1@gmail.com OR subject:("BIDV" OR "Biên lai chuyển tiền" OR "biến động số dư")';
  var threads = GmailApp.search(query, 0, 5);
  var count = 0;

  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    for (var j = 0; j < messages.length; j++) {
      var msg = messages[j];
      var bodyText = msg.getPlainBody();
      var bodyHtml = msg.getBody();
      var subject = msg.getSubject();
      var dateReceived = msg.getDate();

      // Bóc tách thông tin
      var info = bocTachChiTietEmail(subject, bodyText, bodyHtml, dateReceived);

      // Ghi dòng kiểm tra vào sheet Mail_Log
      var timeScan = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
      logSheet.appendRow([
        timeScan,
        subject,
        info.maGD,
        info.ngayGD,
        info.nguoiChuyen,
        info.soTien,
        info.noiDung
      ]);
      count++;
    }
  }

  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert(
    '🔍 ĐÃ ĐỌC THỬ THÀNH CÔNG',
    'Hệ thống đã đọc ' + count + ' email và ghi dữ liệu bóc tách được vào sheet "Mail_Log".\\n\\nHãy mở tab Mail_Log để kiểm tra trước khi nạp chính thức!',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Hàm phân tích & bóc tách chi tiết email (Hỗ trợ cả THU & CHI, phân loại nhóm chi tiêu)
 */
function bocTachChiTietEmail(subject, bodyText, bodyHtml, dateObj) {
  var content = (bodyText || "") + " " + (bodyHtml || "");
  var cleanText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

  var ngayGD = Utilities.formatDate(dateObj, "GMT+7", "dd/MM/yyyy");
  var thangNam = Utilities.formatDate(dateObj, "GMT+7", "MM/yyyy");
  var soTien = 0;
  var nguoiChuyen = "";
  var nguoiNhan = "";
  var noiDung = "";
  var maGD = "---";
  var loaiGD = "Thu";
  var nhomChiTieu = "Khác";
  var kenhTT = "Chuyển khoản";
  var trangThai = "Đã thu";

  // 1. Trích xuất Ngày giao dịch (dd/MM/yyyy)
  var dateMatch = cleanText.match(/(\d{2}\/\d{2}\/\d{4})/);
  if (dateMatch) {
    ngayGD = dateMatch[1];
    var parts = ngayGD.split('/');
    if (parts.length === 3) thangNam = parts[1] + "/" + parts[2];
  }

  // 2. Trích xuất Số lệnh giao dịch
  var orderMatch = subject.match(/Lệnh GD\s*([0-9a-zA-Z]+)/i) 
                || cleanText.match(/(?:Số lệnh giao dịch|Order Number)\s*[:\s]*([0-9a-zA-Z]+)/i);
  if (orderMatch && orderMatch[1] && orderMatch[1].toLowerCase() !== "giao") {
    maGD = orderMatch[1].trim();
  }

  // 3. Nhận diện Loại Giao Dịch (Thu hoặc Chi)
  var loaiMatch = cleanText.match(/Loại giao dịch\s*[:\s]*([^<\n\r]+?)(?=(?:Tài khoản|Người|Số tiền|$))/i);
  if (loaiMatch && loaiMatch[1]) {
    var rawLoai = loaiMatch[1].toLowerCase();
    if (rawLoai.indexOf("chi") >= 0 || rawLoai.indexOf("chuyển tiền đi") >= 0 || rawLoai.indexOf("thanh toán") >= 0) {
      loaiGD = "Chi";
      trangThai = "Đã chi";
    }
  } else if (cleanText.toLowerCase().indexOf("thanh toán") >= 0 || cleanText.toLowerCase().indexOf("chuyển tiền đi") >= 0) {
    loaiGD = "Chi";
    trangThai = "Đã chi";
  }

  // 4. Trích xuất Người chuyển tiền & Người nhận tiền
  var remitterMatch = cleanText.match(/(?:Tên người chuyển tiền|Người chuyển tiền|Remitter's name)\s*[:\s]*([^:]+?)(?=(?:Tài khoản|Người nhận|Tên người hưởng|Beneficiary|Số tiền|$))/i);
  if (remitterMatch && remitterMatch[1]) {
    nguoiChuyen = remitterMatch[1].replace(/Remitter's name/gi, '').replace(/Tài khoản.*/gi, '').trim();
  }

  var beneficiaryMatch = cleanText.match(/(?:Tên người hưởng|Người nhận tiền|Beneficiary Name)\s*[:\s]*([^:]+?)(?=(?:Kênh|Ngân hàng|Số tiền|Nội dung|$))/i);
  if (beneficiaryMatch && beneficiaryMatch[1]) {
    nguoiNhan = beneficiaryMatch[1].replace(/Beneficiary Name/gi, '').replace(/Kênh.*/gi, '').trim();
  }

  var nguoiLienQuan = loaiGD === "Thu" ? (nguoiChuyen || "Khách hàng") : (nguoiNhan || "Nhà cung cấp");

  // 5. Trích xuất Kênh thanh toán
  var channelMatch = cleanText.match(/(?:Kênh thanh toán|Tên ngân hàng hưởng|Payment Channel)\s*[:\s]*([^:]+?)(?=(?:Số tiền|Nội dung|$))/i);
  if (channelMatch && channelMatch[1]) {
    kenhTT = channelMatch[1].trim();
  }

  // 6. Trích xuất Số tiền
  var moneyMatch = cleanText.match(/(?:Số tiền giao dịch|Số tiền|Amount)\s*[:\s]*([+-]?[0-9.,]+)\s*(?:VND|VNĐ|₫|d|đ)?/i)
                || cleanText.match(/([+-]?[0-9]{1,3}(?:[.,][0-9]{3})+)\s*(?:VND|VNĐ|₫|d|đ)/i);
  if (moneyMatch && moneyMatch[1]) {
    var raw = moneyMatch[1].replace(/[+-]/g, '').replace(/[.,](?=[0-9]{3})/g, '').replace(',', '.').replace('₫', '').trim();
    soTien = Math.abs(parseFloat(raw)) || 0;
  }

  // 7. Trích xuất Nội dung chuyển tiền
  var ndMatch = cleanText.match(/(?:Nội dung chuyển tiền|Details of Payment)\s*[:\s]*([^:]+?)(?=(?:Cảm ơn|Thank you|Lưu ý|Note|$))/i);
  if (ndMatch && ndMatch[1]) {
    noiDung = ndMatch[1].replace(/Details of Payment/gi, '').replace(/Cảm ơn Quý khách.*/gi, '').replace(/Thank you.*/gi, '').trim();
  } else {
    noiDung = subject;
  }

  // 8. Tự động nhận diện Nhóm Chi Tiêu dựa trên từ khóa nội dung
  var ndLower = (noiDung + " " + subject).toLowerCase();
  if (ndLower.indexOf("an ") >= 0 || ndLower.indexOf("ăn") >= 0 || ndLower.indexOf("tiec") >= 0 || ndLower.indexOf("tiệc") >= 0 || ndLower.indexOf("cafe") >= 0 || ndLower.indexOf("sen tay ho") >= 0) {
    nhomChiTieu = "Ăn uống";
  } else if (ndLower.indexOf("dien") >= 0 || ndLower.indexOf("điện") >= 0 || ndLower.indexOf("nuoc") >= 0 || ndLower.indexOf("nước") >= 0 || ndLower.indexOf("nha") >= 0 || ndLower.indexOf("nhà") >= 0) {
    nhomChiTieu = "Nhà ở";
  } else if (ndLower.indexOf("mua sam") >= 0 || ndLower.indexOf("mua sắm") >= 0 || ndLower.indexOf("quan ao") >= 0 || ndLower.indexOf("vinmart") >= 0 || ndLower.indexOf("sieu thi") >= 0) {
    nhomChiTieu = "Mua sắm";
  } else if (ndLower.indexOf("xang") >= 0 || ndLower.indexOf("xăng") >= 0 || ndLower.indexOf("grab") >= 0 || ndLower.indexOf("be") >= 0 || ndLower.indexOf("xe") >= 0) {
    nhomChiTieu = "Đi lại";
  } else if (ndLower.indexOf("hoc") >= 0 || ndLower.indexOf("học") >= 0 || ndLower.indexOf("sach") >= 0 || ndLower.indexOf("sách") >= 0) {
    nhomChiTieu = "Học tập";
  } else if (ndLower.indexOf("kham") >= 0 || ndLower.indexOf("thuoc") >= 0 || ndLower.indexOf("y te") >= 0) {
    nhomChiTieu = "Y tế";
  }

  return {
    ngayGD: ngayGD,
    thangNam: thangNam,
    loaiGD: loaiGD,
    nhomChiTieu: nhomChiTieu,
    soTien: soTien,
    nguoiLienQuan: nguoiLienQuan,
    kenhTT: kenhTT,
    noiDung: noiDung,
    trangThai: trangThai,
    maGD: maGD
  };
}

// ==============================================================================
// 8. FILE 8_NapGiaoDich_Bank.gs (🌟 BƯỚC 8: NẠP CHUẨN 12 CỘT VÀO GIAO_DICH)
// ==============================================================================
function quetVaNapVaoGiaoDich() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Giao_Dich");
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Lỗi: Không tìm thấy sheet "Giao_Dich"!');
    return;
  }

  var labelName = "Da_Nap_Sheets";
  var label = GmailApp.getUserLabelByName(labelName) || GmailApp.createLabel(labelName);

  // 1. Quét danh sách các Mã Lệnh GD đã có trong sheet Giao_Dich (Cột L) để chống trùng
  var lastRow = sheet.getLastRow();
  var danhSachMaDaCo = "";
  if (lastRow >= 3) {
    danhSachMaDaCo = sheet.getRange("L3:L" + lastRow).getValues().flat().join(" ");
  }

  // 2. Tìm kiếm email có tiêu đề chứa "Biên lai chuyển tiền"
  var query = 'subject:("Biên lai chuyển tiền") is:unread -label:' + labelName;
  var threads = GmailApp.search(query, 0, 10);
  var soLuong = 0;

  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    for (var j = 0; j < messages.length; j++) {
      var msg = messages[j];
      if (msg.isUnread()) {
        var info = bocTachChiTietEmail(msg.getSubject(), msg.getPlainBody(), msg.getBody(), msg.getDate());

        if (info && info.soTien > 0) {
          // Kiểm tra chống trùng lặp: Nếu mã GD đã có trong sheet thì bỏ qua
          if (info.maGD !== "---" && danhSachMaDaCo.indexOf(info.maGD) >= 0) {
            Logger.log("ℹ️ Bỏ qua giao dịch đã tồn tại: " + info.maGD);
            continue;
          }

          // Chuẩn bị dòng 12 cột chuẩn khớp 100% với sheet Giao_Dich
          var newRow = [
            info.ngayGD,        // Cột A: Ngày GD
            info.thangNam,      // Cột B: Tháng/Năm
            info.loaiGD,        // Cột C: Loại GD (Thu / Chi)
            info.nhomChiTieu,   // Cột D: Nhóm Chi Tiêu
            info.noiDung,       // Cột E: Mô TẢ
            info.nguoiLienQuan, // Cột F: Người Liên Quan
            info.kenhTT,        // Cột G: Kênh Thanh Toán
            info.soTien,        // Cột H: Số Tiền
            0,                  // Cột I: VAT (0%)
            info.soTien,        // Cột J: Tổng Sau Thuế
            info.trangThai,     // Cột K: Trạng Thái (Đã thu / Đã chi)
            "Biên lai GD: " + info.maGD // Cột L: Ghi Chú
          ];

          sheet.appendRow(newRow);
          danhSachMaDaCo += " " + info.maGD; // Cập nhật bộ nhớ đệm chống trùng
          soLuong++;
        }
        msg.markRead();
      }
    }
    threads[i].addLabel(label);
  }

  if (soLuong > 0) {
    SpreadsheetApp.flush();
    if (typeof khoiTaoDashboardThuChi === 'function') {
      khoiTaoDashboardThuChi();
    }
    SpreadsheetApp.getUi().alert(
      '📥 ĐÃ NẠP THÀNH CÔNG',
      'Đã nạp ' + soLuong + ' giao dịch mới (cả Thu & Chi) vào sheet "Giao_Dich" và cập nhật Dashboard!',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } else {
    SpreadsheetApp.getUi().alert('Thông báo', 'Không có email biên lai mới chưa đọc hoặc tất cả giao dịch đã tồn tại.', SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

// ==============================================================================
// 9. FILE 9_Trigger_AutoSync.gs (🌟 BƯỚC 9: CÀI ĐẶT TRIGGER TỰ ĐỘNG MỖI 5 PHÚT)
// ==============================================================================
function caiDatTriggerQuetGmail() {
  huyTriggerQuetGmail();

  ScriptApp.newTrigger('quetVaNapVaoGiaoDich')
    .timeBased()
    .everyMinutes(5)
    .create();

  SpreadsheetApp.getUi().alert(
    '⏰ ĐÃ BẬT TỰ ĐỘNG HÓA 5 PHÚT',
    'Hệ thống sẽ tự động chạy ngầm mỗi 5 phút để đọc email biên lai và nạp thẳng vào Google Sheets!',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function huyTriggerQuetGmail() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'quetVaNapVaoGiaoDich') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}`,
    workflow: [
      { icon: "ph-brain", title: "0. Hiểu Sổ Quỹ", desc: "AI quét & hiểu 12 cột bảng Giao_Dich" },
      { icon: "ph-list-plus", title: "1. Menu Tiện Ích", desc: "Tạo file 1_Menu_ThuChi.gs" },
      { icon: "ph-chart-line-up", title: "2. Dashboard KPI", desc: "Tạo file 2_Dashboard_KPI.gs (4 thẻ KPI)" },
      { icon: "ph-table", title: "3. Bảng Calc_Data", desc: "Tạo file 3_CalcData_ThuChi.gs" },
      { icon: "ph-chart-pie-slice", title: "4. Biểu Đồ Tròn", desc: "Tạo file 4_PieChart_ChiTieu.gs" },
      { icon: "ph-chart-bar", title: "5. Biểu Đồ Cột", desc: "Tạo file 5_BarChart_KenhTT.gs" },
      { icon: "ph-database", title: "6. Backend Lưu Đơn", desc: "Tạo file 6_BackendService.gs" },
      { icon: "ph-file-magnifying-glass", title: "7. Đọc Thử Mail_Log", desc: "Tạo file 7_DocThuEmail_Bank.gs" },
      { icon: "ph-broom", title: "8. Tinh Chỉnh Regex", desc: "Làm sạch rác ký tự bóc tách" },
      { icon: "ph-tray-arrow-down", title: "9. Nạp Giao_Dich", desc: "Tạo file 8_NapGiaoDich_Bank.gs" },
      { icon: "ph-clock-countdown", title: "10. Trigger 5 Phút", desc: "Tạo file 9_Trigger_AutoSync.gs" },
      { icon: "ph-browser", title: "11. Form Pop-up", desc: "Tạo file GiaoDichForm.html" }
    ],
    masterPrompt: `[VAI TRÒ]: Bạn là Chuyên gia Tự động hóa Google Sheets và Lập trình viên Google Apps Script / HTML UI chuyên nghiệp.
[NHIỆM VỤ]: Viết mã Google Apps Script và giao diện HTML hoàn chỉnh theo kiến trúc tách từng file độc lập để xây dựng hệ thống Quản lý Sổ Quỹ Thu Chi, Tự động quét Gmail BIDV (qua bước kiểm tra Mail_Log trước khi nạp Giao_Dich) và Dashboard Dòng Tiền.
[DANH SÁCH CÁC FILE CẦN TẠO]:
1. 1_Menu_ThuChi.gs (Tạo Menu "💰 Quản Lý Thu Chi" gồm Đọc thử Mail_Log, Nạp Giao_Dich, Trigger 5 phút & Form popup)
2. 2_Dashboard_KPI.gs (Tạo Dashboard Sổ Quỹ & 4 thẻ KPI: Tổng Thu, Tổng Chi, Số Dư Quỹ, Tỷ Lệ Chi/Thu)
3. 3_CalcData_ThuChi.gs (Trang phụ Calc_Data tính gom nhóm theo 8 Nhóm Chi Tiêu và 4 Kênh Thanh Toán)
4. 4_PieChart_ChiTieu.gs (Vẽ biểu đồ tròn cơ cấu chi tiêu)
5. 5_BarChart_KenhTT.gs (Vẽ biểu đồ cột chi tiêu theo kênh thanh toán)
6. 6_BackendService.gs (Hàm luuGiaoDichMoi tính VAT và thêm dòng mới vào Giao_Dich)
7. 7_DocThuEmail_Bank.gs (Hàm docThuEmailXuatMailLog quét email BIDV bóc tách ra sheet Mail_Log để kiểm tra an toàn)
8. 8_NapGiaoDich_Bank.gs (Hàm quetVaNapVaoGiaoDich nạp chuẩn 12 cột vào Giao_Dich, markRead & cập nhật Dashboard)
9. 9_Trigger_AutoSync.gs (Hàm cài đặt & hủy Trigger time-driven chạy ngầm mỗi 5 phút)
10. GiaoDichForm.html (Form pop-up nhập giao dịch nhanh Aesthetic Blue tự tính VAT)

[QUY TẮC BẮT BUỘC]:
- Tuân thủ file QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md: Chuẩn Locale VN dấu ;, mảng escape \\, dải ô mở Giao_Dich!J3:J, không ẩn tab Calc_Data khi vẽ biểu đồ, setNumHeaders(1).`,
    businessScenario: {
      story: "Bạn là Kế toán nội bộ / Chuyên viên Hành chính - Thủ quỹ hoặc chủ doanh nghiệp / cửa hàng. Hàng ngày phát sinh hàng chục khoản thu chi qua tài khoản ngân hàng (BIDV, Vietcombank, Techcombank...) và ví điện tử, đồng thời cũng có các khoản chi tiêu tiền mặt trực tiếp.",
      pain: "Phải ngồi gõ tay từng giao dịch ngân hàng vào Google Sheets rất tốn thời gian, dễ sai sót số tiền và quên giao dịch. Cuối tháng làm báo cáo dòng tiền lại phải cộng trừ thủ công.",
      solution: "Xây dựng Hệ thống Tự Động Hóa Quản Lý Sổ Quỹ Toàn Diện: (1) Đọc thử email bóc tách ra sheet Mail_Log kiểm tra an toàn, (2) Nạp chuẩn vào Sổ Quỹ Giao_Dich & Dashboard, (3) Tự động ngầm mỗi 5 phút bằng Trigger, (4) Form pop-up nhập tiền mặt."
    },
    promptBreakdown: [
      { tag: "1. VAI TRÒ & DỮ LIỆU", title: "Quản lý dữ liệu Giao_Dich", desc: "AI nhận diện sheet Giao_Dich với 12 cột thông tin chuẩn và bắt đầu dữ liệu từ dòng số 3." },
      { tag: "2. CÔNG THỨC VIỆT NAM", title: "Quy chuẩn SUMIFS chuẩn dấu ;", desc: "Sử dụng công thức SUMIFS chuẩn Locale Việt Nam để lọc Tổng Thu, Tổng Chi và Số Dư Quỹ chính xác." },
      { tag: "3. TỔNG HỢP & BIỂU ĐỒ", title: "Pie & Column Chart", desc: "Tự tạo bảng phụ Calc_Data sạch từ dòng 1 và vẽ 2 biểu đồ phân tích cơ cấu chi tiêu và kênh thanh toán." },
      { tag: "4. ĐỌC THỬ RA MAIL_LOG", title: "Kiểm tra bóc tách an toàn", desc: "Quét Gmail BIDV và bóc tách các trường: Ngày, Người chuyển, Số tiền, Nội dung xuất ra tab Mail_Log." },
      { tag: "5. NẠP SỔ QUỸ & TRIGGER", title: "Đồng bộ Giao_Dich & Chạy ngầm 5 phút", desc: "Nạp 12 cột vào Giao_Dich, làm mới Dashboard và thiết lập Trigger chạy ngầm mỗi 5 phút." }
    ],
    businessRequirements: `
      <p><b>Bài toán thực tế:</b> Xây dựng ứng dụng quản lý sổ quỹ thu chi, tự động hóa đọc Gmail ngân hàng qua bước kiểm chứng an toàn:</p>
      <ul>
        <li><b>Mô hình 1 Vi Bước = 1 File Độc Lập:</b> Giúp người học làm đến đâu thấy ngay kết quả đến đó, không lo chắp vá hay dán đè code.</li>
        <li><b>Bước Kiểm Chứng An Toàn (Sheet Mail_Log):</b> Đọc email BIDV và xuất dữ liệu bóc tách ra tab <code>Mail_Log</code> để học viên kiểm tra tính chính xác trước khi ghi vào sổ quỹ chính.</li>
        <li><b>Đồng Bộ Vào Sheet Giao_Dich:</b> Nạp tự động vào 12 cột của bảng <code>Giao_Dich</code>, đánh dấu <code>markRead()</code> và gắn nhãn <code>Da_Nap_Sheets</code>.</li>
        <li><b>Cài đặt Trigger thời gian (Time-driven):</b> Script tự động chạy ngầm mỗi 5–10 phút mà không cần người dùng phải mở bảng tính.</li>
        <li><b>Dashboard Sổ Quỹ Thông Minh:</b> 4 thẻ KPI nổi bật (🟢 Tổng Thu, 🔴 Tổng Chi, 🔵 Số Dư Quỹ, 📊 Tỷ Lệ Chi/Thu) & 2 Biểu đồ phân tích.</li>
      </ul>
    `,
    tableHeaders: ["Ngày GD", "Tháng/Năm", "Loại GD", "Nhóm Chi Tiêu", "Mô Tả", "Người Liên Quan", "Kênh Thanh Toán", "Số Tiền", "VAT (%)", "Tổng Sau Thuế", "Trạng Thái", "Ghi Chú"],
    tableRows: [
      ["01/01/2026", "01/2026", "Chi", "Ăn uống", "Ăn sáng bún bò Huế", "Nguyễn Văn An", "Tiền mặt", 45000, 0, 45000, "Đã chi", "—"],
      ["05/01/2026", "05/2026", "Thu", "Khác", "Lương tháng 01/2026", "Nguyễn Văn An", "Chuyển khoản", 15000000, 0, 15000000, "Đã thu", "Biên lai GD: 15668595287"],
      ["07/01/2026", "07/2026", "Chi", "Đi lại", "Đổ xăng xe máy", "Trần Thị Bình", "Tiền mặt", 120000, 0.08, 129600, "Đã chi", "Shell Hoàng Cầu"],
      ["10/01/2026", "10/2026", "Chi", "Nhà ở", "Tiền điện tháng 01", "Lê Hoàng Cường", "Ví điện tử", 380000, 0.1, 418000, "Đã chi", "Biên lai GD: 88472910481"],
      ["12/01/2026", "12/2026", "Chi", "Mua sắm", "Mua quần áo siêu thị", "Phạm Thị Dung", "Thẻ ngân hàng", 850000, 0.08, 918000, "Đã chi", "Vinmart+"]
    ],
    steps: [
      {
        badge: "00",
        title: "Bước 0: AI Trinh Sát & Kiểm Kê Cấu Trúc Sheet Giao_Dich",
        desc: "Gửi link Google Sheets để AI tự động kiểm kê 12 cột dữ liệu và phạm vi bảng tính trước khi bắt đầu viết code.",
        promptBox: `[YÊU CẦU TRINH SÁT BẢNG TÍNH]:
Hãy truy cập vào file Google Sheets này: [Dán đường link bảng tính của bạn vào đây]

Tôi đang có trang tính "Giao_Dich" quản lý thu chi. Bạn hãy kiểm kê tổng quát:
1. Liệt kê tên và ý nghĩa 12 cột dữ liệu (từ cột A đến cột L).
2. Xác định dòng tiêu đề và dòng bắt đầu có dữ liệu thực tế.
3. Tóm tắt ngắn gọn cấu trúc để xác nhận bạn đã hiểu đúng bảng tính.

⚠️ Lưu ý: Chưa viết bất kỳ dòng code nào ở bước này.`
      },
      {
        badge: "01",
        title: "Bước 1: Tạo File 1_Menu_ThuChi.gs (Menu Điều Khiển Trung Tâm)",
        desc: "Thao tác: Mở Apps Script ➔ Bấm dấu (+) chọn Script ➔ Đặt tên file là <code>1_Menu_ThuChi.gs</code> ➔ Dán mã AI sinh ra vào.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia Google Apps Script. Hãy tuân thủ nghiêm ngặt toàn bộ nguyên tắc trong tài liệu "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

[YÊU CẦU NGHIỆP VỤ - FILE 1_Menu_ThuChi.gs]:
Dựa vào bảng tính thu chi đã phân tích ở Bước 0, hãy viết mã cho file độc lập "1_Menu_ThuChi.gs" chứa hàm onOpen() để tạo Menu "Quản Lý Thu Chi" trên thanh công cụ Google Sheets:

1. Dashboard Sổ Quỹ
2. Đọc Thử Email Ra Bảng Mail_Log (kiểm tra trước khi nạp)
3. Nạp Giao Dịch Vào Sổ Quỹ Giao_Dich
4. Bật Tự Động Quét Email (Mỗi 5 Phút)
5. Tắt Tự Động Quét Email
6. Nhập Giao Dịch Thu Chi Thủ Công
7. Hướng Dẫn Sử Dụng

[YÊU CẦU ĐẦU RA]:
- Xuất khối mã hoàn chỉnh cho file "1_Menu_ThuChi.gs", có bọc kiểm tra an toàn nếu các hàm ở bước sau chưa được tạo.`
      },
      {
        badge: "02",
        title: "Bước 2: Tạo File 2_Dashboard_KPI.gs (Trang Dashboard & 4 Thẻ Tổng Quan)",
        desc: "Thao tác: Bấm dấu (+) chọn Script ➔ Đặt tên file là <code>2_Dashboard_KPI.gs</code> ➔ Dán mã tạo trang Dashboard, 4 thẻ KPI và lắng nghe onEdit.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia Google Apps Script. Hãy tuân thủ nghiêm ngặt toàn bộ nguyên tắc trong tài liệu "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

[YÊU CẦU NGHIỆP VỤ - FILE 2_Dashboard_KPI.gs]:
Hãy viết toàn bộ mã nguồn cho file độc lập "2_Dashboard_KPI.gs" để xây dựng giao diện Dashboard và cơ chế tự động cập nhật:

1. Tạo trang tính mới tên "Dashboard Sổ Quỹ" nằm ở vị trí đầu tiên (nếu đã có thì làm sạch nội dung cũ để làm mới).
2. Banner tiêu đề:
   - Dòng 1: "SỔ QUỸ THU CHI & QUẢN TRỊ DÒNG TIỀN 2026" (nền xanh navy #0f4c81, chữ trắng in đậm).
   - Dòng 3: Hiển thị ngày giờ cập nhật tự động.
3. 4 thẻ tổng quan tài chính (Hàng 5 đến Hàng 7):
   - Tổng Thu: Tính tổng cột "Tổng Sau Thuế" của các khoản Thu từ bảng Giao_Dich (định dạng VNĐ).
   - Tổng Chi: Tính tổng cột "Tổng Sau Thuế" của các khoản Chi từ bảng Giao_Dich (định dạng VNĐ).
   - Số Dư Quỹ: Lấy Tổng Thu trừ Tổng Chi (định dạng VNĐ).
   - Tỷ Lệ Chi / Thu: Tính tỷ lệ % Tổng Chi trên Tổng Thu (định dạng 0.0%).
4. Lắng nghe thay đổi thời gian thực: Tích hợp hàm onEdit(e) an toàn để khi người dùng sửa hoặc thêm dòng trực tiếp ở sheet "Giao_Dich", Dashboard tự động tính toán lại và nhảy số tức thì.

[YÊU CẦU ĐẦU RA]:
- Xuất khối mã hoàn chỉnh cho file "2_Dashboard_KPI.gs", có hàm điều phối tự động kết nối biểu đồ khi các bước sau hoàn thành.`
      },
      {
        badge: "03",
        title: "Bước 3: Tạo File 3_CalcData_ThuChi.gs (Bảng Phụ Gom Nhóm Cho Biểu Đồ)",
        desc: "Thao tác: Bấm dấu (+) chọn Script ➔ Đặt tên file là <code>3_CalcData_ThuChi.gs</code> ➔ Dán mã tính toán 2 bảng gom nhóm chi tiêu (dải ô mở).",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia Google Apps Script. Hãy tuân thủ nghiêm ngặt toàn bộ nguyên tắc trong tài liệu "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

[YÊU CẦU NGHIỆP VỤ - FILE 3_CalcData_ThuChi.gs]:
Hãy viết mã cho file độc lập "3_CalcData_ThuChi.gs" tạo trang tính phụ tên "Calc_Data" để tổng hợp dữ liệu nguồn cho biểu đồ:

1. Bảng chi tiêu theo Nhóm ngành hàng (bắt đầu từ cột A, dòng 1):
   - Tiêu đề: "Nhóm Chi Tiêu" và "Tổng Chi Sau Thuế".
   - 8 nhóm: Ăn uống, Đi lại, Nhà ở, Mua sắm, Y tế, Học tập, Giải trí, Khác.
   - Dùng công thức SUMIFS với dải ô mở vô tận (như Giao_Dich!J3:J, Giao_Dich!C3:C) để tự động cộng dồn số liệu khi có thêm dòng mới.

2. Bảng chi tiêu theo Kênh thanh toán (bắt đầu từ cột D, dòng 1):
   - Tiêu đề: "Kênh Thanh Toán" và "Tổng Chi".
   - 4 kênh: Tiền mặt, Chuyển khoản, Ví điện tử, Thẻ ngân hàng.
   - Dùng công thức SUMIFS với dải ô mở vô tận tính tổng tiền chi theo từng kênh.

[YÊU CẦU ĐẦU RA]:
- Xuất khối mã hoàn chỉnh cho file "3_CalcData_ThuChi.gs", giữ tab Calc_Data hiển thị bình thường để biểu đồ đọc dữ liệu ổn định.`
      },
      {
        badge: "04",
        title: "Bước 4: Tạo File 4_PieChart_ChiTieu.gs (Biểu Đồ Tròn Cơ Cấu Chi Tiêu)",
        desc: "Thao tác: Bấm dấu (+) chọn Script ➔ Đặt tên file là <code>4_PieChart_ChiTieu.gs</code> ➔ Dán mã tự động vẽ biểu đồ tròn lên Dashboard.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia Google Apps Script. Hãy tuân thủ nghiêm ngặt toàn bộ nguyên tắc trong tài liệu "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

[YÊU CẦU NGHIỆP VỤ - FILE 4_PieChart_ChiTieu.gs]:
Hãy viết mã cho file độc lập "4_PieChart_ChiTieu.gs" để tự động vẽ Biểu đồ tròn trên trang "Dashboard Sổ Quỹ":

1. Nguồn dữ liệu: Lấy từ bảng Nhóm chi tiêu trên trang Calc_Data (dải ô A1:B9).
2. Vị trí đặt: Tại Hàng 9 Cột A trên Dashboard (kích thước vừa vặn khoảng 490px x 360px).
3. Định dạng biểu đồ:
   - Tiêu đề: "CƠ CẤU CHI TIÊU THEO TỪNG NHÓM" (màu xanh navy sang trọng).
   - Hiển thị tỷ lệ % trên từng lát cắt và có chú thích danh mục rõ ràng bên phải.

[YÊU CẦU ĐẦU RA]:
- Xuất khối mã hoàn chỉnh cho file "4_PieChart_ChiTieu.gs", tự động xóa biểu đồ cũ nếu đã có trước khi vẽ mới.`
      },
      {
        badge: "05",
        title: "Bước 5: Tạo File 5_BarChart_KenhTT.gs (Biểu Đồ Cột Kênh Thanh Toán)",
        desc: "Thao tác: Bấm dấu (+) chọn Script ➔ Đặt tên file là <code>5_BarChart_KenhTT.gs</code> ➔ Dán mã vẽ biểu đồ cột so sánh chi tiêu.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia Google Apps Script. Hãy tuân thủ nghiêm ngặt toàn bộ nguyên tắc trong tài liệu "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

[YÊU CẦU NGHIỆP VỤ - FILE 5_BarChart_KenhTT.gs]:
Hãy viết mã cho file độc lập "5_BarChart_KenhTT.gs" để tự động vẽ Biểu đồ cột trên trang "Dashboard Sổ Quỹ":

1. Nguồn dữ liệu: Lấy từ bảng Kênh thanh toán trên trang Calc_Data (dải ô D1:E5).
2. Vị trí đặt: Tại Hàng 9 Cột E trên Dashboard (nằm song song bên phải Biểu đồ tròn, kích thước khoảng 560px x 360px).
3. Định dạng biểu đồ:
   - Tiêu đề: "CHI TIÊU THEO KÊNH THANH TOÁN" (cột màu xanh dương hiện đại).
   - Trục ngang thể hiện các kênh thanh toán, trục đứng thể hiện số tiền chi.

[YÊU CẦU ĐẦU RA]:
- Xuất khối mã hoàn chỉnh cho file "5_BarChart_KenhTT.gs", đảm bảo 2 biểu đồ hiển thị song song cân đối bên dưới 4 thẻ tổng quan.`
      },
      {
        badge: "06",
        title: "Bước 6: Tạo File 6_BackendService.gs (Chức Năng Lưu Giao Dịch Mới)",
        desc: "Thao tác: Bấm dấu (+) chọn Script ➔ Đặt tên file là <code>6_BackendService.gs</code> ➔ Dán mã xử lý tính thuế VAT và lưu dòng mới.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia Google Apps Script. Hãy tuân thủ nghiêm ngặt toàn bộ nguyên tắc trong tài liệu "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

[YÊU CẦU NGHIỆP VỤ - FILE 6_BackendService.gs]:
Hãy viết mã cho file độc lập "6_BackendService.gs" xử lý việc lưu một giao dịch thu chi mới vào sổ quỹ:

1. Nhận thông tin giao dịch: Ngày, Tháng/Năm, Loại (Thu/Chi), Nhóm chi tiêu, Mô tả, Người liên quan, Kênh thanh toán, Số tiền, Thuế VAT, Trạng thái, Ghi chú.
2. Tự động tính: Tổng tiền sau thuế = Số tiền * (1 + VAT).
3. Thêm một dòng mới vào cuối bảng "Giao_Dich" với đúng thứ tự 12 cột (A đến L).
4. Tự động gọi cập nhật lại số liệu trên Dashboard ngay sau khi lưu thành công.

[YÊU CẦU ĐẦU RA]:
- Xuất khối mã hoàn chỉnh cho file "6_BackendService.gs", có phản hồi kết quả thành công để thông báo cho người dùng.`
      },
      {
        badge: "07",
        title: "Bước 7: Tạo File 7_DocThuEmail_Bank.gs (Đọc Thử Email Ra Bảng Mail_Log)",
        desc: "Thao tác: Bấm dấu (+) chọn Script ➔ Đặt tên file là <code>7_DocThuEmail_Bank.gs</code> ➔ Dán mã quét thử email ngân hàng ra tab Mail_Log.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia Google Apps Script. Hãy tuân thủ nghiêm ngặt toàn bộ nguyên tắc trong tài liệu "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

[YÊU CẦU NGHIỆP VỤ - FILE 7_DocThuEmail_Bank.gs]:
Hãy viết mã cho file độc lập "7_DocThuEmail_Bank.gs" để quét thử email ngân hàng và xuất kết quả ra bảng kiểm tra:

1. Tìm các email có tiêu đề chứa "Biên lai chuyển tiền" trong Gmail.
2. Bóc tách các trường thông tin: Ngày giao dịch, Tháng/Năm, Mã số lệnh, Loại (Thu/Chi), Người liên quan, Kênh thanh toán, Số tiền và Nội dung.
3. Tạo trang tính tên "Mail_Log" và xuất toàn bộ danh sách email đọc được vào bảng này để người dùng xem trước và kiểm tra.

[YÊU CẦU ĐẦU RA]:
- Xuất khối mã hoàn chỉnh cho file "7_DocThuEmail_Bank.gs", có thông báo số lượng email đã đọc thành công.`
      },
      {
        badge: "08",
        title: "Bước 8: Tinh Chỉnh Làm Sạch Số Liệu & Chống Nạp Trùng Email",
        desc: "Thao tác: Gửi câu lệnh phản hồi bên dưới cho AI để cập nhật lại file <code>7_DocThuEmail_Bank.gs</code> với bộ lọc làm sạch rác và chống trùng.",
        promptBox: `[YÊU CẦU TINH CHỈNH VÀ LÀM SẠCH DỮ LIỆU EMAIL]:
Dựa vào kết quả đọc thử email ở Bước 7, hãy tối ưu hóa lại file "7_DocThuEmail_Bank.gs" với các yêu cầu thực tế sau:

1. Làm sạch ký tự rác:
   - Tên người gửi/nhận: Cắt bỏ các chữ tiếng Anh thừa ("Remitter's name...", "Tài khoản..."), chỉ giữ lại tên người hoặc công ty.
   - Số tiền: Chuẩn hóa thành số nguyên sạch (ví dụ: 15000000) để cộng trừ tính toán.
   - Nội dung: Cắt bỏ các câu cảm ơn hoặc lời chào cuối thư.
2. Tự động phân loại:
   - Nhận tiền -> Loại "Thu", trạng thái "Đã thu".
   - Chuyển đi -> Loại "Chi", trạng thái "Đã chi".
   - Tự động nhận diện Nhóm chi tiêu theo từ khóa: Ăn uống (ăn, cafe, tiec), Nhà ở (tiền điện, nước, nhà), Mua sắm (quần áo, siêu thị), Đi lại (xăng, grab, xe).
3. Cơ chế chống trùng lặp: Trước khi thêm dòng, kiểm tra xem Mã số lệnh giao dịch đã có trong bảng chưa. Nếu đã có rồi thì bỏ qua ngay để không bao giờ bị ghi đúp tiền.

Hãy xuất lại toàn bộ đoạn mã file "7_DocThuEmail_Bank.gs" đã được tinh chỉnh hoàn hảo.`
      },
      {
        badge: "09",
        title: "Bước 9: Tạo File 8_NapGiaoDich_Bank.gs (Nạp Email Vào Sổ Quỹ & Nhảy Dashboard)",
        desc: "Thao tác: Bấm dấu (+) chọn Script ➔ Đặt tên file là <code>8_NapGiaoDich_Bank.gs</code> ➔ Dán mã tự động chuyển dữ liệu từ Mail_Log sang Giao_Dich.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia Google Apps Script. Hãy tuân thủ nghiêm ngặt toàn bộ nguyên tắc trong tài liệu "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

[YÊU CẦU NGHIỆP VỤ - FILE 8_NapGiaoDich_Bank.gs]:
Hãy viết mã cho file độc lập "8_NapGiaoDich_Bank.gs" để tự động nạp giao dịch từ bảng "Mail_Log" sang bảng chính "Giao_Dich":

1. Cơ chế tự động đồng bộ khép kín: Lấy các dòng giao dịch mới trong bảng "Mail_Log" nạp sang bảng "Giao_Dich" với đầy đủ 12 cột chuẩn xác.
2. Kiểm tra cột Ghi chú trên bảng Giao_Dich để đảm bảo không nạp trùng các mã giao dịch đã có.
3. Đánh dấu trạng thái trên Mail_Log là "Đã nạp vào Giao_Dich" và đánh dấu email trên Gmail là đã đọc.
4. Tự động kích hoạt làm mới 4 thẻ tổng quan và 2 biểu đồ trên trang Dashboard ngay sau khi nạp xong.

[YÊU CẦU ĐẦU RA]:
- Xuất khối mã hoàn chỉnh cho file "8_NapGiaoDich_Bank.gs", kèm thông báo tổng số giao dịch đã nạp thành công.`
      },
      {
        badge: "10",
        title: "Bước 10: Tạo File 9_Trigger_AutoSync.gs (Cài Đặt Tự Động Quét Email Mỗi 5 Phút)",
        desc: "Thao tác: Bấm dấu (+) chọn Script ➔ Đặt tên file là <code>9_Trigger_AutoSync.gs</code> ➔ Dán mã thiết lập tự động quét email chạy ngầm 24/7.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia Google Apps Script. Hãy tuân thủ nghiêm ngặt toàn bộ nguyên tắc trong tài liệu "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

[YÊU CẦU NGHIỆP VỤ - FILE 9_Trigger_AutoSync.gs]:
Hãy viết mã cho file độc lập "9_Trigger_AutoSync.gs" để quản lý việc tự động chạy ngầm theo thời gian:

1. Chức năng bật tự động:
   - Tự động kích hoạt hàm nạp giao dịch chạy ngầm định kỳ mỗi 5 phút một lần (Time-driven Trigger).
   - Xóa các lịch cũ trùng lặp trước khi tạo lịch mới để tránh chạy đúp.
   - Hiển thị thông báo xác nhận đã kích hoạt tự động hóa thành công.
2. Chức năng tắt tự động:
   - Tìm và xóa bỏ toàn bộ lịch chạy ngầm khi người dùng muốn tạm dừng.

[YÊU CẦU ĐẦU RA]:
- Xuất khối mã hoàn chỉnh cho file "9_Trigger_AutoSync.gs", an toàn và dễ sử dụng.`
      },
      {
        badge: "11",
        title: "Bước 11: Tạo File GiaoDichForm.html (Giao Diện Pop-up Nhập Nhanh Giao Dịch)",
        desc: "Thao tác: Bấm dấu (+) chọn HTML ➔ Đặt tên file là <code>GiaoDichForm.html</code> ➔ Dán mã giao diện form nhập nhanh thu chi.",
        promptBox: `[YÊU CẦU THIẾT KẾ - TỆP GIAO DIỆN GiaoDichForm.html]:
Hãy thiết kế mã nguồn giao diện HTML cho file "GiaoDichForm.html" để người dùng nhập nhanh giao dịch:

1. Phong cách thiết kế:
   - Giao diện hiện đại, trực quan, bo góc trang nhã, phông chữ dễ đọc.
2. Các trường nhập liệu thông minh:
   - Ngày phát sinh (mặc định là hôm nay) và Tháng/Năm.
   - Loại giao dịch: Chọn "Thu" hoặc "Chi".
   - Nhóm chi tiêu: Danh sách chọn 8 nhóm (Ăn uống, Đi lại, Nhà ở, Mua sắm, Y tế, Học tập, Giải trí, Khác).
   - Mô tả giao dịch và Người liên quan.
   - Kênh thanh toán: Tiền mặt, Chuyển khoản, Ví điện tử, Thẻ ngân hàng.
   - Số tiền, Tùy chọn thuế VAT (0%, 8%, 10%) và Ô Tổng sau thuế (tự động tính ngay khi nhập tiền).
   - Trạng thái và Ghi chú thêm.
3. Nút "Lưu Giao Dịch": Kết nối trực tiếp với file 6_BackendService.gs để ghi vào bảng Giao_Dich và cập nhật lại Dashboard.

[YÊU CẦU ĐẦU RA]:
- Xuất trọn vẹn mã HTML/CSS/JavaScript hoàn chỉnh cho file "GiaoDichForm.html".`
      }
    ],
    checklist: [
      "Trang tính gồm sheet nguồn Giao_Dich với cấu trúc 12 cột chuẩn xác từ A đến L.",
      "Đã tạo đủ 9 file .gs độc lập và 1 file GiaoDichForm.html trong Apps Script Editor.",
      "Menu '💰 Quản Lý Thu Chi' hiển thị đầy đủ các mục: Đọc thử Mail_Log, Nạp Giao_Dich, Trigger 5 phút và Form nhập.",
      "Trang 📊 Dashboard Sổ Quỹ tự động tạo mới, hiển thị đúng 4 thẻ KPI Tổng Thu, Tổng Chi, Số Dư Quỹ, Tỷ Lệ Chi/Thu.",
      "Trang phụ Calc_Data nạp đủ 2 bảng số liệu thô sạch bắt đầu từ dòng 1.",
      "Cả 2 Biểu đồ tròn (Cơ cấu chi tiêu) và Biểu đồ cột (Kênh thanh toán) hiển thị đầy đủ màu sắc và số liệu.",
      "Bấm '🔍 1. Đọc Thử Email Ra Sheet Mail_Log': Bóc tách thử nghiệm thành công và xuất dữ liệu ra tab Mail_Log để kiểm tra.",
      "Bấm '📥 2. Nạp Chính Thức Vào Sổ Quỹ Giao_Dich': Dữ liệu biên lai nhảy vào sheet Giao_Dich, email được đánh dấu đã đọc và gắn nhãn chống trùng.",
      "Bấm '⏰ 3. Bật Tự Động Quét Gmail': Trigger 5 phút được thiết lập và tự chạy ngầm định kỳ.",
      "Nhập thử giao dịch qua pop-up GiaoDichForm thành công, dòng mới được ghi vào Giao_Dich và Dashboard cập nhật ngay lập tức."
    ],
    triggerGuide: `
      <h3 class="section-title"><i class="ph-bold ph-lightning"></i> Quy Trình Tự Động Hóa Quét Gmail Ngân Hàng 3 Bước Chuẩn</h3>
      <p style="color: var(--text-secondary); line-height: 1.7;">
        <b>Bước 1 - Đọc thử kiểm tra:</b> Bấm <b>"🔍 1. Đọc Thử Email Ra Sheet Mail_Log"</b> để xem trước dữ liệu bóc tách được từ email BIDV.<br>
        <b>Bước 2 - Nạp sổ quỹ:</b> Bấm <b>"📥 2. Nạp Chính Thức Vào Sổ Quỹ Giao_Dich"</b> để ghi vào bảng chính và xem Dashboard cập nhật.<br>
        <b>Bước 3 - Bật chạy ngầm:</b> Bấm <b>"⏰ 3. Bật Tự Động Quét Gmail (Mỗi 5 Phút)"</b> để hệ thống tự động hóa hoàn toàn 24/7.
      </p>
    `
  }
);
