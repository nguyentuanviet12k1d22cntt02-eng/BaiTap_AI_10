/**
 * FILE: 5_Dashboard_DataQuality.gs
 * Chức năng: Xây dựng Dashboard kiểm soát chất lượng dữ liệu & tỷ trọng doanh thu
 */
function khoiTaoDashboardDataQuality() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var rawSheet = ss.getSheetByName('RawData_BT5');
  var cleanSheet = ss.getSheetByName('DataCleaned_BT5');

  var rawCount = rawSheet ? Math.max(0, rawSheet.getLastRow() - 3) : 0;
  var cleanCount = cleanSheet ? Math.max(0, cleanSheet.getLastRow() - 3) : 0;
  var discardCount = Math.max(0, rawCount - cleanCount);
  var accuracyRate = rawCount > 0 ? ((cleanCount / rawCount) * 100).toFixed(1) : 0;

  var dashName = '📊 Dashboard Dữ Liệu';
  var dashSheet = ss.getSheetByName(dashName) || ss.insertSheet(dashName, 0);
  ss.setActiveSheet(dashSheet);
  ss.moveActiveSheet(1);
  dashSheet.clear();
  dashSheet.getCharts().forEach(function(c) { dashSheet.removeChart(c); });

  // Banner Header
  dashSheet.getRange('A1:H1').merge()
    .setValue('📊 BÁO CÁO KIỂM SOÁT CHẤT LƯỢNG & DOANH THU ĐƠN HÀNG')
    .setFontSize(18).setFontWeight('bold').setFontColor('#FFFFFF').setBackground('#1B365D')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  dashSheet.setRowHeight(1, 50);

  var timeStr = Utilities.formatDate(new Date(), 'GMT+7', 'dd/MM/yyyy HH:mm:ss');
  dashSheet.getRange('A3:H3').merge()
    .setValue('📅 Cập nhật tự động lúc: ' + timeStr + ' | Thuật toán tối ưu In-Memory RAM')
    .setFontColor('#64748b').setFontSize(10).setFontStyle('italic')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');

  // 4 Thẻ KPI (Hàng 5 - 7)
  var kpis = [
    { label: '📥 TỔNG DÒNG THÔ', val: rawCount + ' dòng', color: '#2563eb', range: 'A5:B7' },
    { label: '✅ DỮ LIỆU SẠCH', val: cleanCount + ' dòng', color: '#059669', range: 'C5:D7' },
    { label: '🗑️ BẢN GHI RÁC ĐÃ LỌC', val: discardCount + ' dòng', color: '#dc2626', range: 'E5:F7' },
    { label: '🎯 ĐỘ CHÍNH XÁC (ACCURACY)', val: accuracyRate + '%', color: '#7c3aed', range: 'G5:H7' }
  ];

  kpis.forEach(function(kpi) {
    var rng = dashSheet.getRange(kpi.range);
    rng.setBackground('#f8fafc');
    dashSheet.getRange(kpi.range.split(':')[0]).setValue(kpi.label + '\n\n' + kpi.val)
      .setFontColor(kpi.color).setFontWeight('bold').setFontSize(13)
      .setHorizontalAlignment('center').setVerticalAlignment('middle');
  });

  // Sheet phụ Calc_Data_Clean
  var calcSheet = ss.getSheetByName('Calc_Data_Clean') || ss.insertSheet('Calc_Data_Clean');
  calcSheet.clear();

  // Bảng 1: Cơ cấu Kênh Bán
  calcSheet.getRange('A1:B1').setValues([['Kênh Bán', 'Tổng Doanh Thu']]);
  var channels = ['Shopee', 'Lazada', 'TikTok Shop', 'Website'];
  for (var c = 0; c < channels.length; c++) {
    var r = c + 2;
    calcSheet.getRange('A' + r).setValue(channels[c]);
    calcSheet.getRange('B' + r).setFormula('=SUMIFS(DataCleaned_BT5!E4:E; DataCleaned_BT5!D4:D; "' + channels[c] + '")');
  }

  // Bảng 2: Cơ cấu Lỗi
  calcSheet.getRange('D1:E1').setValues([['Loại Lỗi', 'Số Lượng']]);
  var errors = [
    ['Mã Trùng Lặp', '=COUNTIF(Audit_Log!G5:G; "*TRÙNG*")'],
    ['Mã GD Rỗng', '=COUNTIF(Audit_Log!G5:G; "*RỖNG*")'],
    ['Doanh Thu <= 0', '=COUNTIF(Audit_Log!G5:G; "*Doanh thu*")'],
    ['SĐT Cần Sửa', '=COUNTIF(Audit_Log!G5:G; "*SĐT*")']
  ];
  for (var e = 0; e < errors.length; e++) {
    var re = e + 2;
    calcSheet.getRange('D' + re).setValue(errors[e][0]);
    calcSheet.getRange('E' + re).setFormula(errors[e][1]);
  }

  SpreadsheetApp.flush();

  // Biểu đồ tròn Kênh Bán
  var pieChart = dashSheet.newChart().asPieChart()
    .setTitle('📊 CƠ CẤU DOANH THU THEO KÊNH BÁN')
    .addRange(calcSheet.getRange('A1:B5'))
    .setPosition(9, 1, 10, 10)
    .setOption('width', 490).setOption('height', 360)
    .setOption('is3D', true)
    .setNumHeaders(1)
    .build();
  dashSheet.insertChart(pieChart);

  // Biểu đồ cột Cơ cấu Lỗi
  var barChart = dashSheet.newChart().asColumnChart()
    .setTitle('🔍 PHÂN LOẠI CÁC DẠNG LỖI TRONG DỮ LIỆU THÔ')
    .addRange(calcSheet.getRange('D1:E5'))
    .setPosition(9, 5, 10, 10)
    .setOption('width', 560).setOption('height', 360)
    .setOption('colors', ['#dc2626'])
    .setNumHeaders(1)
    .build();
  dashSheet.insertChart(barChart);

  SpreadsheetApp.getUi().alert('📊 Dashboard Chất Lượng Dữ Liệu đã được khởi tạo thành công!');
}
