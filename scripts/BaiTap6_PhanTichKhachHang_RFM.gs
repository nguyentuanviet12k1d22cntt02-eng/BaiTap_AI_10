/**
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
    SpreadsheetApp.getUi().alert(`Lỗi: Không tìm thấy sheet nguồn "${CONFIG_BT6.SOURCE_SHEET}"!`);
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
    .setChartType(Charts.ChainType ? Charts.ChartType.COLUMN : Charts.ChartType.COLUMN)
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
}
