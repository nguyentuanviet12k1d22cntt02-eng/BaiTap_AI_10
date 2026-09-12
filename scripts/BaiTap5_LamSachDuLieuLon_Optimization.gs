/**
 * ==============================================================================
 * BÀI TẬP 5: HỆ THỐNG KIỂM TOÁN & LÀM SẠCH DỮ LIỆU LỚN IN-MEMORY TỐI ƯU HIỆU NĂNG
 * ==============================================================================
 * Kiến trúc dự án tách từng file độc lập (1 Vi Bước = 1 File):
 * 1. 1_Menu_DataCleaning.gs    (Menu thanh công cụ, điều khiển trung tâm & gọi popup)
 * 2. 2_AuditScan_BaoCaoLoi.gs   (Quét kiểm toán dữ liệu thô, xuất bảng Audit_Log đối soát)
 * 3. 3_InRam_CleanEngine.gs    (Động cơ làm sạch trên RAM < 2s, xuất DataCleaned_BT5)
 * 4. 4_Split_ByChannel.gs      (Tự động tách dữ liệu sạch thành các sheet theo sàn bán hàng)
 * 5. 5_Dashboard_DataQuality.gs(Dashboard phân tích chất lượng dữ liệu & tỷ trọng doanh thu)
 * 6. 6_Trigger_NightlyClean.gs (Cài đặt Time-driven Trigger tự động hóa lúc 23:30 hàng đêm)
 * 7. CleanConfigForm.html      (Giao diện Pop-up cấu hình bộ lọc linh hoạt Aesthetic Blue)
 * ==============================================================================
 */

// ==============================================================================
// 1. FILE 1_Menu_DataCleaning.gs
// ==============================================================================
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🧹 Làm Sạch Dữ Liệu')
    .addItem('📊 1. Dashboard Chất Lượng Dữ Liệu', 'khoiTaoDashboardDataQuality')
    .addSeparator()
    .addItem('🔍 2. Quét Kiểm Toán Lỗi (Ra Sheet Audit_Log)', 'chayKiemToanDuLieuAuditLog')
    .addItem('⚡ 3. Chạy Làm Sạch Dữ Liệu (< 2s)', 'chayLamSachDuLieuInRam')
    .addItem('📂 4. Tách Dữ Liệu Theo Kênh Bán Hàng', 'tachDuLieuTheoKenhBan')
    .addSeparator()
    .addItem('⚙️ 5. Cấu Hình Quy Tắc Lọc (Pop-up)', 'moFormCauHinhLoc')
    .addSeparator()
    .addItem('⏰ 6. Bật Tự Động Hóa (23:30 Hàng Đêm)', 'caiDatTriggerLamSachHangDem')
    .addItem('🛑 Tắt Tự Động Hóa Định Kỳ', 'huyTriggerLamSach')
    .addSeparator()
    .addItem('❓ Hướng Dẫn Sử Dụng', 'hienThiHuongDanDataCleaning')
    .addToUi();
}

function moFormCauHinhLoc() {
  var html = HtmlService.createTemplateFromFile('CleanConfigForm')
    .evaluate()
    .setWidth(680)
    .setHeight(560)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  SpreadsheetApp.getUi().showModalDialog(html, '⚙️ Cấu Hình Quy Tắc Làm Sạch Dữ Liệu');
}

function hienThiHuongDanDataCleaning() {
  var msg = "=== HỆ THỐNG LÀM SẠCH & KIỂM TOÁN DỮ LIỆU LỚN ===\n\n" +
    "1. 🔍 Quét Kiểm Toán Lỗi: Quét an toàn và xuất ra sheet 'Audit_Log' chi tiết từng lỗi.\n" +
    "2. ⚡ Chạy Làm Sạch: Xử lý 100% trên bộ nhớ RAM, xuất ra tab 'DataCleaned_BT5' dưới 2 giây.\n" +
    "3. 📂 Tách Kênh Bán: Tự động gom nhóm đơn hàng và chia về các sheet Shopee, Lazada, TikTok...\n" +
    "4. 📊 Dashboard: Xem 4 thẻ KPI chất lượng dữ liệu và biểu đồ tỷ trọng doanh thu.\n" +
    "5. ⏰ Tự Động Hóa: Cài trigger chạy ngầm lúc 23:30 mỗi đêm mà không cần mở bảng tính.";
  SpreadsheetApp.getUi().alert('❓ Hướng Dẫn Sử Dụng', msg, SpreadsheetApp.getUi().ButtonSet.OK);
}

// ==============================================================================
// 2. FILE 2_AuditScan_BaoCaoLoi.gs
// ==============================================================================
function chayKiemToanDuLieuAuditLog() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var rawSheet = ss.getSheetByName('RawData_BT5');
  if (!rawSheet) {
    SpreadsheetApp.getUi().alert('Lỗi: Không tìm thấy sheet nguồn "RawData_BT5"!');
    return;
  }

  var rawData = rawSheet.getDataRange().getValues();
  if (rawData.length < 4) {
    SpreadsheetApp.getUi().alert('Bảng RawData_BT5 không có dữ liệu để kiểm toán.');
    return;
  }

  // Dòng 3 là header, dữ liệu từ dòng 4 (index 3)
  var rows = rawData.slice(3);
  var auditLogs = [];
  var seenCodes = new Set();

  var countRong = 0;
  var countTrung = 0;
  var countSdtLoi = 0;
  var countDoanhThuLoi = 0;
  var countTenThuaSpace = 0;

  for (var i = 0; i < rows.length; i++) {
    var rowNum = i + 4;
    var maGD = String(rows[i][0] || '').trim();
    var tenKH = String(rows[i][1] || '').trim();
    var rawSdt = String(rows[i][2] || '').trim();
    var cleanSdt = rawSdt.replace(/[\.\s-]/g, '');
    var kenhBan = String(rows[i][3] || '').trim();
    var doanhThu = Number(rows[i][4]) || 0;
    var ngayTao = rows[i][5];

    var cacLoi = [];
    var mucDo = 'HỢP LỆ';

    if (maGD === '') {
      cacLoi.push('Mã GD bị rỗng');
      countRong++;
      mucDo = 'LỖI NGHIÊM TRỌNG (LOẠI)';
    } else if (seenCodes.has(maGD)) {
      cacLoi.push('Mã GD bị trùng lặp');
      countTrung++;
      mucDo = 'LỖI NGHIÊM TRỌNG (LOẠI)';
    } else {
      seenCodes.add(maGD);
    }

    if (doanhThu <= 0) {
      cacLoi.push('Doanh thu âm hoặc bằng 0 (' + doanhThu + ')');
      countDoanhThuLoi++;
      mucDo = 'LỖI NGHIÊM TRỌNG (LOẠI)';
    }

    if (rawSdt.match(/[\.\s-]/) || (cleanSdt.length === 9 && !cleanSdt.startsWith('0'))) {
      cacLoi.push('SĐT sai định dạng/mất số 0 (' + rawSdt + ')');
      countSdtLoi++;
      if (mucDo === 'HỢP LỆ') mucDo = 'CẢNH BÁO (TỰ SỬA)';
    }

    if (String(rows[i][1] || '').match(/\s{2,}/) || tenKH !== chuanHoaTenTiengViet(tenKH)) {
      cacLoi.push('Họ tên hoa/thường lộn xộn hoặc thừa khoảng trắng');
      countTenThuaSpace++;
      if (mucDo === 'HỢP LỆ') mucDo = 'CẢNH BÁO (TỰ SỬA)';
    }

    if (cacLoi.length > 0) {
      auditLogs.push([
        rowNum,
        maGD || '[RỖNG]',
        tenKH,
        rawSdt,
        kenhBan,
        doanhThu,
        mucDo,
        cacLoi.join('; ')
      ]);
    }
  }

  // Khởi tạo trang Audit_Log
  var logSheet = ss.getSheetByName('Audit_Log') || ss.insertSheet('Audit_Log', 1);
  logSheet.clear();

  // Banner
  logSheet.getRange('A1:H1').merge()
    .setValue('📋 BÁO CÁO KIỂM TOÁN CHẤT LƯỢNG DỮ LIỆU (DATA AUDIT LOG)')
    .setBackground('#1B365D').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(14)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  logSheet.setRowHeight(1, 40);

  // Thống kê nhanh
  var validCount = rows.length - (countRong + countTrung + countDoanhThuLoi);
  var summaryText = 'Tổng dòng quét: ' + rows.length +
    ' | Dòng hợp lệ: ' + validCount +
    ' | Mã rỗng: ' + countRong +
    ' | Trùng mã: ' + countTrung +
    ' | Lỗi doanh thu: ' + countDoanhThuLoi +
    ' | SĐT cần sửa: ' + countSdtLoi +
    ' | Tên cần sửa: ' + countTenThuaSpace;
  logSheet.getRange('A2:H2').merge().setValue(summaryText)
    .setFontColor('#64748b').setFontSize(10).setFontStyle('italic')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');

  // Header bảng audit
  var headers = ['Dòng Lỗi', 'Mã Giao Dịch', 'Tên Khách Hàng', 'Số Điện Thoại', 'Kênh Bán', 'Doanh Thu', 'Mức Độ', 'Chi Tiết Lỗi Phát Hiện'];
  logSheet.getRange(4, 1, 1, headers.length).setValues([headers])
    .setBackground('#005A9C').setFontColor('#FFFFFF').setFontWeight('bold');
  logSheet.setRowHeight(4, 28);

  if (auditLogs.length > 0) {
    logSheet.getRange(5, 1, auditLogs.length, headers.length).setValues(auditLogs);
    logSheet.getRange(5, 6, auditLogs.length, 1).setNumberFormat('#,##0');
    logSheet.autoResizeColumns(1, headers.length);
  }

  ss.setActiveSheet(logSheet);
  SpreadsheetApp.getUi().alert('🔍 ĐÃ HOÀN TẤT KIỂM TOÁN DỮ LIỆU!\n\nĐã phát hiện ' + auditLogs.length + ' bản ghi có vấn đề. Mời bạn xem chi tiết tại sheet "Audit_Log".');
}

// ==============================================================================
// 3. FILE 3_InRam_CleanEngine.gs
// ==============================================================================
function chayLamSachDuLieuInRam() {
  var startTime = new Date().getTime();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var rawSheet = ss.getSheetByName('RawData_BT5');
  if (!rawSheet) {
    SpreadsheetApp.getUi().alert('Lỗi: Không tìm thấy sheet nguồn "RawData_BT5"!');
    return;
  }

  var rawData = rawSheet.getDataRange().getValues();
  if (rawData.length < 4) return;

  var rows = rawData.slice(3);
  var seenCodes = new Set();
  var cleanedRows = [];

  var countTrung = 0;
  var countDoanhThuLoi = 0;
  var countRong = 0;
  var countSdtSua = 0;

  for (var i = 0; i < rows.length; i++) {
    var maGD = String(rows[i][0] || '').trim();
    var tenKH = String(rows[i][1] || '').trim();
    var sdt = String(rows[i][2] || '').trim().replace(/[\.\s-]/g, '');
    var kenhBan = String(rows[i][3] || '').trim();
    var doanhThu = Number(rows[i][4]) || 0;
    var rawDate = rows[i][5];
    var ngayTao = rawDate instanceof Date ? Utilities.formatDate(rawDate, 'GMT+7', 'dd/MM/yyyy') : String(rawDate || '');

    // 1. Lọc bỏ dòng lỗi nghiêm trọng
    if (maGD === '') { countRong++; continue; }
    if (seenCodes.has(maGD)) { countTrung++; continue; }
    if (doanhThu <= 0) { countDoanhThuLoi++; continue; }

    seenCodes.add(maGD);

    // 2. Chuẩn hóa Họ Tên (Proper Case)
    tenKH = chuanHoaTenTiengViet(tenKH);

    // 3. Chuẩn hóa SĐT (Thêm số 0 vào đầu nếu có 9 số)
    if (sdt.length === 9 && !sdt.startsWith('0')) {
      sdt = '0' + sdt;
      countSdtSua++;
    }

    cleanedRows.push([maGD, tenKH, sdt, kenhBan, doanhThu, ngayTao, 'Hợp Lệ']);
  }

  // 4. Ghi xuống sheet DataCleaned_BT5 một lần duy nhất
  var cleanName = 'DataCleaned_BT5';
  var cleanSheet = ss.getSheetByName(cleanName) || ss.insertSheet(cleanName, 2);
  cleanSheet.clear();

  var headers = ['Mã Giao Dịch', 'Tên Khách Hàng', 'Số Điện Thoại', 'Kênh Bán', 'Doanh Thu', 'Ngày Tạo', 'Trạng Thái'];

  cleanSheet.getRange('A1:G1').merge()
    .setValue('✨ BẢNG DỮ LIỆU ĐÃ ĐƯỢC LÀM SẠCH & CHUẨN HÓA (CLEAN DATA)')
    .setBackground('#1B365D').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(13)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  cleanSheet.setRowHeight(1, 35);

  cleanSheet.getRange(3, 1, 1, headers.length).setValues([headers])
    .setBackground('#005A9C').setFontColor('#FFFFFF').setFontWeight('bold');
  cleanSheet.setRowHeight(3, 26);

  if (cleanedRows.length > 0) {
    cleanSheet.getRange(4, 1, cleanedRows.length, headers.length).setValues(cleanedRows);
    cleanSheet.getRange(4, 5, cleanedRows.length, 1).setNumberFormat('#,##0');
    cleanSheet.getRange(4, 1, cleanedRows.length, 1).setHorizontalAlignment('center');
    cleanSheet.getRange(4, 3, cleanedRows.length, 1).setHorizontalAlignment('center');
    cleanSheet.getRange(4, 6, cleanedRows.length, 2).setHorizontalAlignment('center');
    cleanSheet.autoResizeColumns(1, headers.length);
  }

  var duration = ((new Date().getTime() - startTime) / 1000).toFixed(2);
  ss.setActiveSheet(cleanSheet);

  var msg = '🎉 LÀM SẠCH HOÀN TẤT TRONG ' + duration + ' GIÂY!\n' +
    '-----------------------------------------\n' +
    '📥 Dữ liệu gốc: ' + rows.length + ' dòng\n' +
    '✅ Dữ liệu sạch: ' + cleanedRows.length + ' dòng\n' +
    '❌ Dòng đã loại bỏ: ' + (rows.length - cleanedRows.length) + '\n' +
    '   • Trùng mã: ' + countTrung + '\n' +
    '   • Doanh thu <= 0: ' + countDoanhThuLoi + '\n' +
    '   • Mã rỗng: ' + countRong + '\n' +
    '🔧 SĐT đã chuẩn hóa: ' + countSdtSua;

  SpreadsheetApp.getUi().alert(msg);
}

function chuanHoaTenTiengViet(str) {
  if (!str) return '';
  return str.toLowerCase().split(/\s+/).filter(Boolean).map(function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

// ==============================================================================
// 4. FILE 4_Split_ByChannel.gs
// ==============================================================================
function tachDuLieuTheoKenhBan() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cleanSheet = ss.getSheetByName('DataCleaned_BT5');
  if (!cleanSheet) {
    SpreadsheetApp.getUi().alert('Vui lòng chạy bước "3. Làm Sạch Dữ Liệu" trước để có dữ liệu sạch!');
    return;
  }

  var data = cleanSheet.getDataRange().getValues();
  if (data.length < 4) return;

  var headers = data[2]; // Dòng 3 là header
  var rows = data.slice(3);

  // Gom nhóm theo Kênh Bán (Cột D - index 3)
  var channelGroups = {};
  for (var i = 0; i < rows.length; i++) {
    var channel = String(rows[i][3] || 'Khác').trim();
    if (!channelGroups[channel]) {
      channelGroups[channel] = [];
    }
    channelGroups[channel].push(rows[i]);
  }

  var channelColors = {
    'Shopee': '#EE4D2D',
    'Lazada': '#0f146d',
    'TikTok Shop': '#000000',
    'Website': '#2563eb'
  };

  var summaryList = [];

  for (var chName in channelGroups) {
    var sheetName = 'Sàn_' + chName.replace(/[\/\?\*\[\]:]/g, '_');
    var chSheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
    chSheet.clear();

    var groupRows = channelGroups[chName];
    var themeColor = channelColors[chName] || '#1B365D';

    chSheet.getRange('A1:G1').merge()
      .setValue('📦 DỮ LIỆU ĐƠN HÀNG: ' + chName.toUpperCase())
      .setBackground(themeColor).setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(13)
      .setHorizontalAlignment('center').setVerticalAlignment('middle');
    chSheet.setRowHeight(1, 35);

    chSheet.getRange(3, 1, 1, headers.length).setValues([headers])
      .setBackground('#334155').setFontColor('#FFFFFF').setFontWeight('bold');
    chSheet.setRowHeight(3, 26);

    chSheet.getRange(4, 1, groupRows.length, headers.length).setValues(groupRows);
    chSheet.getRange(4, 5, groupRows.length, 1).setNumberFormat('#,##0');
    chSheet.getRange(4, 1, groupRows.length, 1).setHorizontalAlignment('center');
    chSheet.getRange(4, 3, groupRows.length, 1).setHorizontalAlignment('center');
    chSheet.getRange(4, 6, groupRows.length, 2).setHorizontalAlignment('center');
    chSheet.autoResizeColumns(1, headers.length);

    summaryList.push('• ' + chName + ': ' + groupRows.length + ' đơn');
  }

  SpreadsheetApp.getUi().alert('📂 ĐÃ TÁCH XONG DỮ LIỆU THEO TỪNG KÊNH BÁN:\n\n' + summaryList.join('\n'));
}

// ==============================================================================
// 5. FILE 5_Dashboard_DataQuality.gs
// ==============================================================================
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

// ==============================================================================
// 6. FILE 6_Trigger_NightlyClean.gs
// ==============================================================================
function caiDatTriggerLamSachHangDem() {
  huyTriggerLamSach(); // Xóa trigger cũ nếu có
  ScriptApp.newTrigger('chayTuDongLamSachVaBaoCao')
    .timeBased()
    .everyDays(1)
    .atHour(23)
    .nearMinute(30)
    .create();

  SpreadsheetApp.getUi().alert('⏰ ĐÃ BẬT TỰ ĐỘNG HÓA HÀNG ĐÊM!\n\nHệ thống sẽ tự động quét, làm sạch và cập nhật Dashboard vào lúc 23:30 mỗi đêm.');
}

function huyTriggerLamSach() {
  var triggers = ScriptApp.getProjectTriggers();
  var count = 0;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'chayTuDongLamSachVaBaoCao') {
      ScriptApp.deleteTrigger(triggers[i]);
      count++;
    }
  }
  if (count > 0) {
    SpreadsheetApp.getUi().alert('🛑 Đã hủy toàn bộ lịch tự động hóa làm sạch dữ liệu.');
  }
}

function chayTuDongLamSachVaBaoCao() {
  chayLamSachDuLieuInRam();
  tachDuLieuTheoKenhBan();
  khoiTaoDashboardDataQuality();
}
