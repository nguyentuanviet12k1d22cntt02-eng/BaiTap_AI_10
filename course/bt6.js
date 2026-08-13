COURSE_DATA.push(
{
    id: "bt6",
    index: 6,
    title: "Bài 6: Phân Tích Nhóm Khách Hàng RFM, Vẽ Biểu Đồ & Xuất Báo Cáo Tự Động",
    shortTitle: "Phân Tích RFM & Biểu Đồ",
    subtitle: "Apps Script vẽ biểu đồ cột, tròn & xuất báo cáo",
    level: "Dành Cho Dân Văn Phòng",
    time: "20 phút",
    tags: ["RFM Segmentation", "Pie & Column Chart", "Google Docs Report", "PDF Export"],
    desc: "Quy trình ra lệnh cho AI Agent tự động tính toán các chỉ số RFM để phân nhóm khách hàng, vẽ biểu đồ tròn tỷ lệ và biểu đồ cột doanh thu đóng góp, sau đó điền dữ liệu xuất file báo cáo Word/PDF chuyên nghiệp.",
    csvFile: "bai_tap_6_rfm_analysis.csv",
    scriptFile: "BaiTap6_PhanTichKhachHang_RFM.gs",
    scriptContent: `/**
 * BÀI TẬP 6: PHÂN TÍCH PHÂN KHÚC KHÁCH HÀNG THEO MÔ HÌNH RFM, VẼ BIỂU ĐỒ & XUẤT BÁO CÁO
 */
const CONFIG_BT6 = {
  SOURCE_SHEET: "DonHang_BT6",
  REPORT_SHEET: "BaoCao_RFM_BT6",
  REPORT_DATE: new Date("2026-08-31"), // Ngày chốt báo cáo cố định
  FOLDER_PDF_NAME: "BaoCao_RFM_PDF"
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("📊 PHÂN TÍCH")
    .addItem("Chạy Phân Tích RFM Khách Hàng", "runRFMAnalysis")
    .addToUi();
}

function runRFMAnalysis() {
  const startTime = new Date().getTime();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getSheetByName(CONFIG_BT6.SOURCE_SHEET);
  
  if (!sourceSheet) {
    SpreadsheetApp.getUi().alert(\`Lỗi: Không tìm thấy sheet nguồn "\${CONFIG_BT6.SOURCE_SHEET}"!\`);
    return;
  }
  
  const lastRow = sourceSheet.getLastRow();
  if (lastRow < 4) {
    SpreadsheetApp.getUi().alert("Lỗi: Không có dữ liệu giao dịch!");
    return;
  }
  
  const rawData = sourceSheet.getRange(4, 1, lastRow - 3, 5).getValues();
  const customerMap = {};
  
  for (let i = 0; i < rawData.length; i++) {
    const maKH = String(rawData[i][1]).trim();
    const tenKH = String(rawData[i][2]).trim();
    const ngayMua = rawData[i][3];
    const doanhThu = Number(rawData[i][4]) || 0;
    
    if (maKH === "") continue;
    
    let ngayMuaDate;
    if (ngayMua instanceof Date) {
      ngayMuaDate = ngayMua;
    } else {
      const parts = String(ngayMua).split("/");
      if (parts.length === 3) {
        ngayMuaDate = new Date(parts[2], parts[1] - 1, parts[0]);
      } else {
        ngayMuaDate = new Date();
      }
    }
    
    if (!customerMap[maKH]) {
      customerMap[maKH] = {
        maKH: maKH,
        tenKH: tenKH,
        lastPurchase: ngayMuaDate,
        frequency: 0,
        monetary: 0
      };
    }
    
    customerMap[maKH].frequency += 1;
    customerMap[maKH].monetary += doanhThu;
    
    if (ngayMuaDate > customerMap[maKH].lastPurchase) {
      customerMap[maKH].lastPurchase = ngayMuaDate;
    }
  }
  
  const rfmReportRows = [];
  let vipCount = 0;
  
  for (const maKH in customerMap) {
    const cust = customerMap[maKH];
    const diffTime = CONFIG_BT6.REPORT_DATE.getTime() - cust.lastPurchase.getTime();
    let recencyDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (recencyDays < 0) recencyDays = 0;
    
    const f = cust.frequency;
    const m = cust.monetary;
    
    let rScore = 1;
    if (recencyDays <= 15) rScore = 5;
    else if (recencyDays <= 45) rScore = 4;
    else if (recencyDays <= 90) rScore = 3;
    else if (recencyDays <= 180) rScore = 2;
    
    let fScore = 1;
    if (f >= 10) fScore = 5;
    else if (f >= 5) fScore = 4;
    else if (f >= 3) fScore = 3;
    else if (f >= 2) fScore = 2;
    
    let mScore = 1;
    if (m >= 50000000) mScore = 5;
    else if (m >= 20000000) mScore = 4;
    else if (m >= 10000000) mScore = 3;
    else if (m >= 5000000) mScore = 2;
    
    const totalScore = rScore + fScore + mScore;
    
    let classification = "Khách Hàng Nguy Cơ Rời Bỏ";
    if (totalScore >= 13) {
      classification = "VIP";
      vipCount++;
    } else if (totalScore >= 10) {
      classification = "Khách Hàng Trung Thành";
    } else if (totalScore >= 7) {
      classification = "Khách Hàng Tiềm Năng";
    } else if (totalScore >= 5) {
      classification = "Khách Mới";
    }
    
    const formattedLastDate = Utilities.formatDate(cust.lastPurchase, "GMT+7", "dd/MM/yyyy");
    
    rfmReportRows.push([
      cust.maKH,
      cust.tenKH,
      formattedLastDate,
      recencyDays,
      f,
      m,
      rScore,
      fScore,
      mScore,
      totalScore,
      classification
    ]);
  }
  
  // Sắp xếp báo cáo theo mã khách hàng tăng dần
  rfmReportRows.sort(function(a, b) {
    return a[0].localeCompare(b[0]);
  });
  
  // Ghi kết quả ra sheet BaoCao_RFM_BT6
  var reportSheet = ss.getSheetByName(CONFIG_BT6.REPORT_SHEET);
  if (!reportSheet) {
    reportSheet = ss.insertSheet(CONFIG_BT6.REPORT_SHEET);
  } else {
    reportSheet.clear();
    var oldCharts = reportSheet.getCharts();
    for (var c = 0; c < oldCharts.length; c++) {
      reportSheet.removeChart(oldCharts[c]);
    }
  }
  
  // Thiết lập đường lưới hiển thị
  reportSheet.setHiddenGridlines(false);
  
  // Ghi Banner dòng 1
  reportSheet.getRange("A1:K1").merge().setValue("BÁO CÁO PHÂN TÍCH PHÂN KHÚC KHÁCH HÀNG RFM")
    .setBackground("#1B365D").setFontColor("#FFFFFF").setFontWeight("bold").setFontSize(13)
    .setHorizontalAlignment("center").setVerticalAlignment("center");
  reportSheet.setRowHeight(1, 35);
  
  // Tiêu đề bảng
  var headers = [
    "Mã Khách Hàng", "Tên Khách Hàng", "Ngày Mua Cuối", "Recency (ngày)", 
    "Frequency (lượt)", "Monetary (VNĐ)", "R-Score", "F-Score", "M-Score", 
    "Tổng Điểm", "Phân Phân Khúc"
  ];
  
  reportSheet.getRange("A3:K3").setValues([headers])
    .setBackground("#1B365D").setFontColor("#FFFFFF").setFontWeight("bold")
    .setHorizontalAlignment("center").setVerticalAlignment("center");
  reportSheet.setRowHeight(3, 24);
  
  // Ghi dữ liệu chi tiết
  if (rfmReportRows.length > 0) {
    var dataRange = reportSheet.getRange(4, 1, rfmReportRows.length, 11);
    dataRange.setValues(rfmReportRows);
    
    // Định dạng dữ liệu
    dataRange.setFontFamily("Arial").setFontSize(10);
    reportSheet.getRange(4, 3, rfmReportRows.length, 1).setNumberFormat("dd/mm/yyyy").setHorizontalAlignment("center");
    reportSheet.getRange(4, 4, rfmReportRows.length, 2).setNumberFormat("#,##0").setHorizontalAlignment("right");
    reportSheet.getRange(4, 6, rfmReportRows.length, 1).setNumberFormat("#,##0").setHorizontalAlignment("right");
    reportSheet.getRange(4, 7, rfmReportRows.length, 4).setHorizontalAlignment("center");
    reportSheet.getRange(4, 11, rfmReportRows.length, 1).setFontWeight("bold");
    
    // Kẻ viền mảnh
    dataRange.setBorder(true, true, true, true, true, true, "#D9D9D9", SpreadsheetApp.BorderStyle.SOLID);
  }
  
  // Tự động căn chỉnh cột rộng vừa chữ
  for (var col = 1; col <= 11; col++) {
    reportSheet.autoResizeColumn(col);
  }
  
  // --------------------------------------------------------------------------
  // 4. TẠO BẢNG TỔNG HỢP PHÂN KHÚC (CỘT M - O)
  // --------------------------------------------------------------------------
  var summaryHeaders = ["Phân Khúc Khách Hàng", "Số Lượng KH", "Doanh Thu Đóng Góp (VNĐ)"];
  reportSheet.getRange("M3:O3").setValues([summaryHeaders])
    .setBackground("#1B365D").setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
  
  var segments = [
    "VIP",
    "Khách Hàng Trung Thành",
    "Khách Hàng Tiềm Năng",
    "Khách Mới",
    "Khách Hàng Nguy Cơ Rời Bỏ"
  ];
  
  var endRowIndex = rfmReportRows.length + 3;
  
  const summaryFormulas = [];
  for (let s = 0; s < segments.length; s++) {
    const seg = segments[s];
    const countFormula = '=COUNTIF(K4:K' + endRowIndex + '; "' + seg + '")';
    const sumFormula = '=SUMIF(K4:K' + endRowIndex + '; "' + seg + '"; F4:F' + endRowIndex + ')';
    summaryFormulas.push([seg, countFormula, sumFormula]);
  }
  
  reportSheet.getRange("M4:O8").setFormulasLocal(summaryFormulas);
  reportSheet.getRange("N4:N8").setNumberFormat("#,##0").setHorizontalAlignment("center");
  reportSheet.getRange("O4:O8").setNumberFormat("#,##0");
  reportSheet.getRange("M3:O8").setBorder(true, true, true, true, true, true, "#D9D9D9", SpreadsheetApp.BorderStyle.SOLID);
  
  // VẼ BIỂU ĐỒ TRÒN (PIE CHART) - PHÂN PHỐI SỐ LƯỢNG
  var pieChart = reportSheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(reportSheet.getRange("M3:N8"))
    .setPosition(10, 13, 0, 0)
    .setOption("title", "TỶ LỆ PHÂN BỔ KHÁCH HÀNG THEO PHÂN KHÚC")
    .setOption("width", 400)
    .setOption("height", 280)
    .setOption("is3D", true)
    .build();
  reportSheet.insertChart(pieChart);
  
  // VẼ BIỂU ĐỒ CỘT (COLUMN CHART) - DOANH THU ĐÓNG GÓP
  var columnChart = reportSheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(reportSheet.getRange("M3:M8"))
    .addRange(reportSheet.getRange("O3:O8"))
    .setPosition(25, 13, 0, 0)
    .setOption("title", "DOANH THU ĐÓNG GÓP THEO PHÂN KHÚC KHÁCH HÀNG")
    .setOption("width", 400)
    .setOption("height", 280)
    .setOption("legend", {position: "none"})
    .setOption("colors", ["#005A9C"])
    .setOption("vAxis", {format: "#,##0"})
    .build();
  reportSheet.insertChart(columnChart);
}`,
    workflow: [
      { icon: "ph-link", title: "1. Đọc Dữ Liệu", desc: "Xác nhận AI đọc chính xác sheet DonHang_BT6" },
      { icon: "ph-table", title: "2. Phân Tích Cột", desc: "AI phân tích cấu trúc cột & công thức RFM" },
      { icon: "ph-chart-pie", title: "3. Sinh Code Biểu Đồ", desc: "Apps Script tính toán và vẽ Combo/Pie charts" },
      { icon: "ph-file-doc", title: "4. Tạo Mẫu Docs", desc: "Thiết kế biểu mẫu Word báo cáo RFM" },
      { icon: "ph-file-pdf", title: "5. Xuất Báo Cáo PDF", desc: "Apps Script điền số liệu & lưu Drive" }
    ],
    masterPrompt: `/**
 * Trình tự tự động hóa Phân tích & Báo cáo RFM Khách Hàng
 * Tích hợp tính năng xuất PDF từ Google Docs Template
 */

// 1. Tạo Custom Menu trên thanh công cụ Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('📊 PHÂN TÍCH')
    .addItem('Chạy Phân Tích RFM & Xuất PDF', 'runRFMAnalysis')
    .addToUi();
}

// 2. Hàm chính thực hiện phân tích RFM
function runRFMAnalysis() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheet = ss.getSheetByName("DonHang_BT6");
  
  if (!sourceSheet) {
    SpreadsheetApp.getUi().alert('⚠️ Không tìm thấy sheet "DonHang_BT6". Vui lòng kiểm tra lại!');
    return;
  }
  
  // Đọc dữ liệu từ dòng 4 (A4:E)
  var lastRow = sourceSheet.getLastRow();
  if (lastRow < 4) {
    SpreadsheetApp.getUi().alert('⚠️ Sheet "DonHang_BT6" không có dữ liệu từ dòng 4 trở đi.');
    return;
  }
  
  var data = sourceSheet.getRange(4, 1, lastRow - 3, 5).getValues();
  var reportDate = new Date(2026, 7, 31); // Mốc ngày chốt báo cáo 31/08/2026
  
  // Tổng hợp dữ liệu theo từng Mã Khách Hàng
  var customers = {};
  
  for (var i = 0; i < data.length; i++) {
    var orderId = data[i][0];
    var custId = data[i][1];
    var custName = data[i][2];
    var dateVal = parseDate_(data[i][3]);
    var revenueVal = parseNumber_(data[i][4]);
    
    if (!custId) continue; // Bỏ qua dòng trống
    
    if (!customers[custId]) {
      customers[custId] = {
        id: custId,
        name: custName,
        lastDate: dateVal,
        frequency: 1,
        monetary: revenueVal
      };
    } else {
      customers[custId].frequency += 1;
      customers[custId].monetary += revenueVal;
      if (dateVal && (!customers[custId].lastDate || dateVal > customers[custId].lastDate)) {
        customers[custId].lastDate = dateVal;
        if (custName) customers[custId].name = custName;
      }
    }
  }
  
  // Tính chỉ số R, F, M, chấm điểm và phân hạng
  var outputRows = [];
  for (var id in customers) {
    var c = customers[id];
    
    var recency = 0;
    if (c.lastDate) {
      var diffTime = reportDate.getTime() - c.lastDate.getTime();
      recency = Math.max(0, Math.round(diffTime / (1000 * 3600 * 24)));
    }
    
    var rScore = 1;
    if (recency <= 15) rScore = 5;
    else if (recency <= 45) rScore = 4;
    else if (recency <= 90) rScore = 3;
    else if (recency <= 180) rScore = 2;
    else rScore = 1;
    
    var fScore = 1;
    if (c.frequency >= 10) fScore = 5;
    else if (c.frequency >= 5) fScore = 4;
    else if (c.frequency >= 3) fScore = 3;
    else if (c.frequency >= 2) fScore = 2;
    else fScore = 1;
    
    var mScore = 1;
    if (c.monetary >= 50000000) mScore = 5;
    else if (c.monetary >= 20000000) mScore = 4;
    else if (c.monetary >= 10000000) mScore = 3;
    else if (c.monetary >= 5000000) mScore = 2;
    else mScore = 1;
    
    var totalScore = rScore + fScore + mScore;
    
    var segment = "";
    if (totalScore >= 13) segment = "VIP";
    else if (totalScore >= 10) segment = "Trung thành";
    else if (totalScore >= 7) segment = "Tiềm năng";
    else if (totalScore >= 5) segment = "Khách mới";
    else segment = "Nguy cơ rời bỏ";
    
    outputRows.push([
      c.id, c.name, c.lastDate, recency, c.frequency, c.monetary,
      rScore, fScore, mScore, totalScore, segment
    ]);
  }
  
  outputRows.sort(function(a, b) {
    return a[0].localeCompare(b[0]);
  });
  
  var targetSheet = ss.getSheetByName("BaoCao_RFM_BT6");
  if (!targetSheet) {
    targetSheet = ss.insertSheet("BaoCao_RFM_BT6");
  } else {
    targetSheet.clearContents();
    targetSheet.clearFormats();
    var existingCharts = targetSheet.getCharts();
    for (var k = 0; k < existingCharts.length; k++) {
      targetSheet.removeChart(existingCharts[k]);
    }
  }
  
  targetSheet.setHiddenGridlines(false);
  
  var headers = [
    "Mã Khách Hàng", "Tên Khách Hàng", "Ngày Mua Gần Nhất", 
    "Recency (Ngày)", "Frequency (Số đơn)", "Monetary (VNĐ)", 
    "Điểm R", "Điểm F", "Điểm M", "Tổng Điểm", "Phân Hạng"
  ];
  
  targetSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  if (outputRows.length > 0) {
    targetSheet.getRange(2, 1, outputRows.length, headers.length).setValues(outputRows);
  }
  
  var numRows = outputRows.length;
  var lastDataRow = numRows + 1;
  
  var navyColor = "#1B365D";
  targetSheet.getRange(1, 1, 1, headers.length)
             .setBackground(navyColor)
             .setFontColor("#FFFFFF")
             .setFontWeight("bold")
             .setHorizontalAlignment("center")
             .setVerticalAlignment("middle");
  targetSheet.setRowHeight(1, 35);
  
  if (numRows > 0) {
    var dataRange = targetSheet.getRange(2, 1, numRows, headers.length);
    dataRange.setFontFamily("Roboto")
             .setFontSize(10)
             .setVerticalAlignment("middle");
    
    for (var r = 2; r <= lastDataRow; r++) {
      targetSheet.getRange(r, 1, 1, headers.length)
                 .setBackground(r % 2 === 0 ? "#F4F6F9" : "#FFFFFF");
    }
    
    targetSheet.getRange(2, 1, numRows, 1).setHorizontalAlignment("center");
    targetSheet.getRange(2, 2, numRows, 1).setHorizontalAlignment("left");
    targetSheet.getRange(2, 3, numRows, 1).setNumberFormat("dd/mm/yyyy").setHorizontalAlignment("center");
    targetSheet.getRange(2, 4, numRows, 1).setNumberFormat("#,##0").setHorizontalAlignment("right");
    targetSheet.getRange(2, 5, numRows, 1).setNumberFormat("#,##0").setHorizontalAlignment("right");
    targetSheet.getRange(2, 6, numRows, 1).setNumberFormat("#,##0 \"VNĐ\"").setHorizontalAlignment("right");
    targetSheet.getRange(2, 7, numRows, 4).setNumberFormat("0").setHorizontalAlignment("center");
    targetSheet.getRange(2, 11, numRows, 1).setHorizontalAlignment("center").setFontWeight("bold");
    
    dataRange.setBorder(true, true, true, true, true, true, "#D3D3D3", SpreadsheetApp.BorderStyle.SOLID);
  }
  
  // Bảng Tổng Hợp Phân Khúc
  var summaryHeaders = ["Phân Hạng", "Số Lượng Khách", "Tổng Doanh Thu"];
  targetSheet.getRange(1, 13, 1, 3).setValues([summaryHeaders])
             .setBackground(navyColor)
             .setFontColor("#FFFFFF")
             .setFontWeight("bold")
             .setHorizontalAlignment("center")
             .setVerticalAlignment("middle");
             
  var segments = ["VIP", "Trung thành", "Tiềm năng", "Khách mới", "Nguy cơ rời bỏ"];
  var summaryNames = [];
  var summaryFormulas = [];
  
  for (var s = 0; s < segments.length; s++) {
    var rowIdx = s + 2;
    summaryNames.push([segments[s]]);
    summaryFormulas.push([
      '=COUNTIF(K$2:K$' + lastDataRow + '; M' + rowIdx + ')',
      '=SUMIF(K$2:K$' + lastDataRow + '; M' + rowIdx + '; F$2:F$' + lastDataRow + ')'
    ]);
  }
  
  summaryNames.push(["Tổng cộng"]);
  summaryFormulas.push([
    '=SUM(N2:N6)',
    '=SUM(O2:O6)'
  ]);
  
  targetSheet.getRange(2, 13, summaryNames.length, 1).setValues(summaryNames);
  targetSheet.getRange(2, 14, summaryFormulas.length, 2).setValues(summaryFormulas);

  targetSheet.getRange(2, 13, 6, 3).setBorder(true, true, true, true, true, true, "#D3D3D3", SpreadsheetApp.BorderStyle.SOLID);
  targetSheet.getRange("M2:M6").setHorizontalAlignment("left").setFontWeight("bold");
  targetSheet.getRange("N2:N7").setNumberFormat("#,##0").setHorizontalAlignment("right");
  targetSheet.getRange("O2:O7").setNumberFormat("#,##0 \"VNĐ\"").setHorizontalAlignment("right");
  targetSheet.getRange("M7:O7")
             .setBackground("#E8EEF5")
             .setFontWeight("bold")
             .setBorder(true, true, true, true, true, true, navyColor, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  // Tạo Biểu Đồ
  var pieChart = targetSheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(targetSheet.getRange("M1:N6"))
    .setPosition(2, 17, 0, 0)
    .setOption('title', 'Tỷ Lệ Khách Hàng Theo Phân Khúc')
    .setOption('is3D', true)
    .setOption('width', 480)
    .setOption('height', 300)
    .build();
  targetSheet.insertChart(pieChart);
  
  var columnChart = targetSheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(targetSheet.getRange("M1:M6"))
    .addRange(targetSheet.getRange("O1:O6"))
    .setPosition(18, 17, 0, 0)
    .setOption('title', 'Doanh Số Đóng Góp Theo Phân Khúc')
    .setOption('legend', {position: 'none'})
    .setOption('width', 480)
    .setOption('height', 300)
    .setOption('colors', [navyColor])
    .setOption('vAxis', {title: 'Doanh thu (VNĐ)', format: 'short'})
    .build();
  targetSheet.insertChart(columnChart);
  
  for (var col = 1; col <= 15; col++) {
    if (col === 12) {
      targetSheet.setColumnWidth(12, 30);
    } else {
      targetSheet.autoResizeColumn(col);
    }
  }

  // =========================================================================
  // PHẦN NÂNG CẤP: TẠO BÁO CÁO PDF TỪ GOOGLE DOCS TEMPLATE
  // =========================================================================
  try {
    // 1. Lấy dữ liệu từ bảng tổng hợp (Cần ép tính toán để lấy value thực tế)
    SpreadsheetApp.flush(); 
    
    var vipCount = targetSheet.getRange("N2").getValue();
    var loyalCount = targetSheet.getRange("N3").getValue();
    var potentialCount = targetSheet.getRange("N4").getValue();
    var newCount = targetSheet.getRange("N5").getValue();
    var churnCount = targetSheet.getRange("N6").getValue();
    
    // ID của file template "BaoCao_RFM_Template"
    var templateId = "1DQ857s2uv0U1fS1MdaIAztf7wxwuvrJvMxFzt7430yc"; 
    
    // 2. Tìm hoặc tạo thư mục "BaoCao_RFM_PDF"
    var folderName = "BaoCao_RFM_PDF";
    var folders = DriveApp.getFoldersByName(folderName);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
    
    // 3. Tạo bản sao tạm thời của template
    var templateFile = DriveApp.getFileById(templateId);
    var tempFile = templateFile.makeCopy("Temp_BaoCao_RFM", folder);
    var tempDoc = DocumentApp.openById(tempFile.getId());
    var body = tempDoc.getBody();
    
    // 4. Thay thế từ khóa bằng số liệu thật
    body.replaceText("{{VIP_Count}}", vipCount);
    body.replaceText("{{Loyal_Count}}", loyalCount);
    body.replaceText("{{Potential_Count}}", potentialCount);
    body.replaceText("{{New_Count}}", newCount);
    body.replaceText("{{Churn_Count}}", churnCount);
    
    // Thêm nhận định tự động
    var insightText = "Phân khúc VIP (" + vipCount + " KH) và Trung thành (" + loyalCount + " KH) đang là nhóm nòng cốt. Cần đặc biệt chú ý chiến dịch giữ chân nhóm Nguy cơ rời bỏ (" + churnCount + " KH).";
    body.replaceText("{{Insights}}", insightText);
    
    // Lưu và đóng file tạm để đảm bảo nội dung được ghi lại
    tempDoc.saveAndClose();
    
    // 5. Xuất ra định dạng PDF
    var pdfBlob = tempFile.getAs(MimeType.PDF);
    var timeString = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "ddMMyyyy_HHmmss");
    var pdfFile = folder.createFile(pdfBlob).setName("BaoCao_RFM_" + timeString + ".pdf");
    var pdfUrl = pdfFile.getUrl();
    
    // 6. Xóa file Doc tạm để dọn rác
    tempFile.setTrashed(true);
    
    // 7. Ghi link PDF vào ô H1 dưới dạng RichText Hyperlink
    var richText = SpreadsheetApp.newRichTextValue()
      .setText("📥 XEM BÁO CÁO PDF")
      .setLinkUrl(pdfUrl)
      .build();
    
    targetSheet.getRange("M10").setRichTextValue(richText)
               .setBackground("#28a745")
               .setFontColor("#FFFFFF")
               .setFontWeight("bold")
               .setHorizontalAlignment("center")
               .setVerticalAlignment("middle");
               
    SpreadsheetApp.getUi().alert('✅ Đã phân tích RFM và xuất báo cáo PDF thành công!\nLink PDF đã được gắn tại ô H1.');
    
  } catch (e) {
    SpreadsheetApp.getUi().alert("⚠️ Đã phân tích xong dữ liệu, nhưng có lỗi khi tạo PDF: " + e.message);
  }
}

// Hàm hỗ trợ ép kiểu Ngày
function parseDate_(val) {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (typeof val === 'string' && val.trim() !== '') {
    var parts = val.trim().split('/');
    if (parts.length === 3) {
      return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
    }
    var d = new Date(val);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

// Hàm hỗ trợ ép kiểu Số
function parseNumber_(val) {
  if (typeof val === 'number') return val;
  if (typeof val === 'string' && val.trim() !== '') {
    var clean = val.replace(/\./g, '').replace(/,/g, '').trim();
    var n = parseFloat(clean);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}`,
    businessScenario: {
      story: "Bạn là Chuyên viên Phân tích Dữ liệu hoặc Trưởng bộ phận Chăm sóc khách hàng. Công ty chuẩn bị cho chiến dịch Tri ân cuối năm và cần gửi ưu đãi riêng cho từng nhóm khách hàng.",
      pain: "Bạn có danh sách hàng nghìn giao dịch thô. Để tính ra được ai là VIP hay ai sắp rời bỏ, bạn phải viết hàng loạt cột phụ, tính toán đếm số đơn bằng COUNTIFS, cộng tiền bằng SUMIFS, rồi lồng các hàm IF cực kỳ dễ sai sót và mỏi mắt.",
      solution: "Apps Script tự động quét toàn bộ đơn hàng, tính toán RFM, phân nhóm khách hàng VIP/Trung thành/Nguy cơ rời bỏ, vẽ biểu đồ phân phối và đóng góp doanh số, sau đó xuất báo cáo chuyên nghiệp chỉ trong 3 giây!"
    },
    promptBreakdown: [
      { tag: "1. VAI TRÒ & DỮ LIỆU", title: "Phân tích RFM từ DonHang_BT6", desc: "AI nhận diện sheet DonHang_BT6 và tập trung phân tích 3 chỉ số Recency, Frequency, Monetary." },
      { tag: "2. LUẬT CHẤM ĐIỂM", title: "Quy tắc điểm 1-5 & Phân nhóm", desc: "Chấm điểm từng chỉ số và tính tổng điểm (tối đa 15đ) để xếp hạng khách hàng chính xác." },
      { tag: "3. TỔNG HỢP & BIỂU ĐỒ", title: "Pie & Column Chart", desc: "Tự lập bảng tổng hợp phân khúc bằng COUNTIF/SUMIF, vẽ 1 biểu đồ tròn và 1 biểu đồ cột song song." },
      { tag: "4. DOCUMENT REPORT", title: "Docs & PDF Export", desc: "(Nâng cao) Tự động điền dữ liệu phân khúc vào biểu mẫu báo cáo Docs và xuất PDF lưu Drive." }
    ],
    businessRequirements: `
      <p><b>Bài toán thực tế:</b> Phân loại nhóm khách hàng dựa trên lịch sử mua sắm để tối ưu hóa hiệu quả chăm sóc khách hàng. Tự động hóa hoàn toàn quy trình xử lý, tính toán điểm RFM, vẽ biểu đồ tròn tỷ lệ, biểu đồ cột doanh số và xuất file báo cáo văn bản.</p>
      <ul>
        <li><b>Mục tiêu:</b> Chạy thuật toán in-memory xử lý 100+ dòng giao dịch, vẽ 2 biểu đồ trực quan hóa và xuất kết quả báo cáo.</li>
        <li><b>Kỹ năng đạt được:</b> Làm chủ mô hình phân tích RFM, vẽ biểu đồ nâng cao qua Apps Script, xuất file in ấn sang PDF/Google Drive.</li>
      </ul>
    `,
    tableHeaders: ["Mã Đơn", "Mã KH", "Tên Khách Hàng", "Ngày Mua", "Doanh Thu Đơn"],
    tableRows: [
      ["DH-RFM-0001", "KH001", "Nguyễn Văn An", "28/08/2026", "5,200,000"],
      ["DH-RFM-0002", "KH002", "Trần Thị Bích", "25/08/2026", "12,800,000"],
      ["DH-RFM-0003", "KH001", "Nguyễn Văn An", "15/07/2026", "3,500,000"],
      ["DH-RFM-0004", "KH003", "Lê Hoàng Long", "10/06/2026", "2,400,000"],
      ["DH-RFM-0005", "KH002", "Trần Thị Bích", "05/05/2026", "8,500,000"]
    ],
    steps: [
      {
        badge: "01",
        title: "Bước 1: Kiểm Tra Xem AI Có Thực Sự Đang Đọc Được File Hay Không",
        desc: "Trước khi thực hiện phân tích hay lập trình, hãy gửi đường link Google Sheets của bạn và kiểm tra xem AI (Spark / Gemini) có truy cập đọc được trang dữ liệu <code>DonHang_BT6</code> không.",
        promptBox: `https://docs.google.com/spreadsheets/d/19jPP-MwIMPjeDfViicF1jTQBxx-0lTP8HAwR6IqArPI/edit
 
bạn có thể đọc được nội dung của trang tính "DonHang_BT6" trong link này chứ? Hãy liệt kê 3 dòng dữ liệu đầu tiên để xác nhận.`,
        note: "<b>💡 Mẹo:</b> Hãy đảm bảo file Google Sheets đã được bật chế độ chia sẻ là <i>'Bất kỳ ai có đường liên kết đều có thể xem'</i>."
      },
      {
        badge: "02",
        title: "Bước 2: Yêu Cầu AI Phân Tích Cấu Trúc Bảng & Chỉ Số Phân Phối",
        desc: "Ra lệnh cho AI phân tích cấu trúc cột, xác định tọa độ và phương pháp tính các chỉ số RFM trước khi viết code.",
        promptBox: `Hãy phân tích cấu trúc cột của sheet "DonHang_BT6" và đề xuất thuật toán tính 3 chỉ số RFM cho từng khách hàng duy nhất:
1. R (Recency): Khoảng cách số ngày từ lần mua cuối của khách hàng đó đến ngày chốt báo cáo 31/08/2026.
2. F (Frequency): Tổng số đơn hàng của khách hàng.
3. M (Monetary): Tổng doanh thu mua sắm của khách hàng đó.`
      },
      {
        badge: "03",
        title: "Bước 3: Ra Lệnh AI Viết Apps Script Tính Toán RFM & Vẽ Biểu Đồ (Cột & Tròn)",
        desc: "Sử dụng Siêu Prompt chi tiết để AI viết mã nguồn tự động tạo bảng phân khúc và chèn biểu đồ cột + tròn song song trên Sheet.",
        promptBox: `Bạn là Lập trình viên Google Apps Script. Viết 1 đoạn code Apps Script (.gs) hoàn chỉnh cho sheet "DonHang_BT6":
1. Đọc dữ liệu từ dòng 4 (A4:E) và tính toán R (so với ngày 31/08/2026), F, M cho mỗi khách hàng.
2. Chấm điểm RFM từ 1-5 theo quy tắc:
   - R: <=15 ngày: 5đ; <=45 ngày: 4đ; <=90 ngày: 3đ; <=180 ngày: 2đ; còn lại: 1đ.
   - F: >=10 lần: 5đ; >=5 lần: 4đ; >=3 lần: 3đ; >=2 lần: 2đ; còn lại: 1đ.
   - M: >=50.000.000: 5đ; >=20.000.000: 4đ; <=10.000.000: 3đ; >=5.000.000: 2đ; còn lại: 1đ.
3. Phân hạng dựa trên tổng điểm RFM (tối đa 15đ): VIP (>=13), Trung thành (10-12), Tiềm năng (7-9), Khách mới (5-6), Nguy cơ rời bỏ (<=4).
4. Ghi kết quả sang sheet mới tên là "BaoCao_RFM_BT6". Định dạng bảng chuyên nghiệp màu Navy.
5. Tạo bảng tổng hợp phân khúc ở cột M-O bằng công thức COUNTIF & SUMIF. [BẮT BUỘC CHUẨN LOCALE VIỆT NAM]: Các đối số trong công thức phải được phân cách bằng dấu chấm phẩy (;) (ví dụ: =COUNTIF(K4:K8; "VIP")). Trong Apps Script, bắt buộc sử dụng phương thức .setFormulasLocal() thay vì .setFormulas() để phù hợp với cài đặt Locale Việt Nam của bảng tính.
6. Vẽ tự động 1 Biểu đồ tròn (Pie Chart) thể hiện tỷ lệ % khách hàng của mỗi phân khúc và 1 Biểu đồ cột (Column Chart) thể hiện doanh số đóng góp của từng phân khúc. Đặt 2 biểu đồ cạnh bảng tổng hợp ở cột Q.
7. Thêm menu "📊 PHÂN TÍCH" > "Chạy Phân Tích RFM Khách Hàng".`
      },
      {
        badge: "04",
        title: "Bước 4: Ra Lệnh Cho AI Thiết Lập Biểu Mẫu Word (Google Docs) Thô",
        desc: "Hướng dẫn AI tạo ra biểu mẫu Docs mẫu đại diện cho một báo cáo phân tích khách hàng chính thức trên Word, chứa các thẻ placeholder <code>{VIP_Count}</code>, <code>{Loyal_Count}</code>... để sau này điền dữ liệu tự động.",
        promptBox: `Hãy tạo một file Google Docs template đặt tên là "BaoCao_RFM_Template" với cấu trúc sau:
1. Tiêu đề: "BÁO CÁO PHÂN TÍCH CHẤT LƯỢNG KHÁCH HÀNG DOANH NGHIỆP".
2. Bảng thống kê phân khúc khách hàng gồm các dòng:
   - Số lượng khách hàng VIP: {VIP_Count}
   - Số lượng khách hàng Trung thành: {Loyal_Count}
   - Số lượng khách hàng Tiềm năng: {Potential_Count}
   - Số lượng khách hàng Mới: {New_Count}
   - Số lượng khách hàng Nguy cơ rời bỏ: {Churn_Count}
3. Phần nhận định chung: "{Insights}".`
      },
      {
        badge: "05",
        title: "Bước 5: Ra Lệnh Cho AI Apps Script Điền Dữ Liệu & Xuất Báo Cáo PDF",
        desc: "Tích hợp quy trình tự động hóa khép kín: Nhân bản biểu mẫu Docs mẫu, điền dữ liệu thực tế tính toán từ Sheet và xuất PDF lưu Drive.",
        promptBox: `Hãy nâng cấp mã nguồn Apps Script của bạn để thực hiện:
1. Mở file Google Docs "BaoCao_RFM_Template" bằng ID hoặc tên và tạo một bản sao tạm.
2. Tìm và thay thế các từ khóa mẫu {VIP_Count}, {Loyal_Count}... bằng số liệu phân tích thật từ bảng tổng hợp.
3. Xuất file Doc tạm đó thành định dạng PDF chất lượng cao lưu vào thư mục Drive "BaoCao_RFM_PDF".
4. Xóa file Doc tạm để dọn rác Drive, và trả liên kết file PDF về ô H1 của sheet báo cáo.`
      }
    ],
    checklist: [
      "Đã tạo sheet dữ liệu giao dịch DonHang_BT6 thành công",
      "Đã gửi link Sheet và xác nhận AI Agent đọc chính xác dữ liệu",
      "AI phân tích chi tiết cấu trúc cột và đề xuất thuật toán tính RFM",
      "Đã copy Master Prompt gửi AI để sinh mã nguồn Apps Script",
      "Mã Apps Script thực thi không lỗi, tạo thành công sheet BaoCao_RFM_BT6",
      "Tự động tạo bảng tổng hợp (COUNTIF/SUMIF) và vẽ biểu đồ Tròn & Cột cạnh nhau",
      "(Nâng cao) Bản sao Docs mẫu được điền số liệu và xuất thành công file PDF lên Drive"
    ],
    triggerGuide: `
      <h3 class="section-title"><i class="ph-bold ph-calendar-blank"></i> Kích Hoạt Tự Động Đầu Tháng</h3>
      <p style="color: var(--text-secondary); line-height: 1.7;">
        Bạn có thể yêu cầu AI: <i>"Hãy hướng dẫn tôi thiết lập Trigger tự động chạy báo cáo phân tích RFM này vào ngày 1 hàng tháng lúc 00:00"</i> để ban giám đốc luôn có báo cáo phân khúc mới nhất ngay khi bước vào tháng mới.
      </p>
    `
  }
);
