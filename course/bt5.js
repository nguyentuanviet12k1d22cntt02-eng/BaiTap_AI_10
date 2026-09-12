COURSE_DATA.push(
{
    id: "bt5",
    index: 5,
    title: "Bài 5: Hệ Thống Kiểm Toán & Làm Sạch Dữ Liệu Lớn Tối Ưu Tốc Độ (< 2s)",
    shortTitle: "Kiểm Toán & Làm Sạch Dữ Liệu Lớn",
    subtitle: "Kiến Trúc In-Memory RAM, Khử Trùng Lặp, Audit Log & Dashboard Phân Kênh",
    level: "Dành Cho Dân Văn Phòng",
    time: "25 phút",
    tags: ["Big Data Cleaning", "In-memory RAM", "Audit Log Buffer", "Phone & Name Normalization", "Data Quality Dashboard", "Time-driven Trigger"],
    csvFile: "bai_tap_5_raw_data_1000_rows.csv",
    scriptFile: "BaiTap5_LamSachDuLieuLon_Optimization.gs",
    scriptContent: `/**
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
  var msg = "=== HỆ THỐNG LÀM SẠCH & KIỂM TOÁN DỮ LIỆU LỚN ===\\n\\n" +
    "1. 🔍 Quét Kiểm Toán Lỗi: Quét an toàn và xuất ra sheet 'Audit_Log' chi tiết từng lỗi.\\n" +
    "2. ⚡ Chạy Làm Sạch: Xử lý 100% trên bộ nhớ RAM, xuất ra tab 'DataCleaned_BT5' dưới 2 giây.\\n" +
    "3. 📂 Tách Kênh Bán: Tự động gom nhóm đơn hàng và chia về các sheet Shopee, Lazada, TikTok...\\n" +
    "4. 📊 Dashboard: Xem 4 thẻ KPI chất lượng dữ liệu và biểu đồ tỷ trọng doanh thu.\\n" +
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
    var cleanSdt = rawSdt.replace(/[\\.\\s-]/g, '');
    var kenhBan = String(rows[i][3] || '').trim();
    var doanhThu = Number(rows[i][4]) || 0;

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

    if (rawSdt.match(/[\\.\\s-]/) || (cleanSdt.length === 9 && !cleanSdt.startsWith('0'))) {
      cacLoi.push('SĐT sai định dạng/mất số 0 (' + rawSdt + ')');
      countSdtLoi++;
      if (mucDo === 'HỢP LỆ') mucDo = 'CẢNH BÁO (TỰ SỬA)';
    }

    if (String(rows[i][1] || '').match(/\\s{2,}/) || tenKH !== chuanHoaTenTiengViet(tenKH)) {
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

  var logSheet = ss.getSheetByName('Audit_Log') || ss.insertSheet('Audit_Log', 1);
  logSheet.clear();

  logSheet.getRange('A1:H1').merge()
    .setValue('📋 BÁO CÁO KIỂM TOÁN CHẤT LƯỢNG DỮ LIỆU (DATA AUDIT LOG)')
    .setBackground('#1B365D').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(14)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  logSheet.setRowHeight(1, 40);

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
  SpreadsheetApp.getUi().alert('🔍 ĐÃ HOÀN TẤT KIỂM TOÁN DỮ LIỆU!\\n\\nĐã phát hiện ' + auditLogs.length + ' bản ghi có vấn đề. Mời bạn xem chi tiết tại sheet "Audit_Log".');
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
    var sdt = String(rows[i][2] || '').trim().replace(/[\\.\\s-]/g, '');
    var kenhBan = String(rows[i][3] || '').trim();
    var doanhThu = Number(rows[i][4]) || 0;
    var rawDate = rows[i][5];
    var ngayTao = rawDate instanceof Date ? Utilities.formatDate(rawDate, 'GMT+7', 'dd/MM/yyyy') : String(rawDate || '');

    if (maGD === '') { countRong++; continue; }
    if (seenCodes.has(maGD)) { countTrung++; continue; }
    if (doanhThu <= 0) { countDoanhThuLoi++; continue; }

    seenCodes.add(maGD);
    tenKH = chuanHoaTenTiengViet(tenKH);

    if (sdt.length === 9 && !sdt.startsWith('0')) {
      sdt = '0' + sdt;
      countSdtSua++;
    }

    cleanedRows.push([maGD, tenKH, sdt, kenhBan, doanhThu, ngayTao, 'Hợp Lệ']);
  }

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

  var msg = '🎉 LÀM SẠCH HOÀN TẤT TRONG ' + duration + ' GIÂY!\\n' +
    '-----------------------------------------\\n' +
    '📥 Dữ liệu gốc: ' + rows.length + ' dòng\\n' +
    '✅ Dữ liệu sạch: ' + cleanedRows.length + ' dòng\\n' +
    '❌ Dòng đã loại bỏ: ' + (rows.length - cleanedRows.length) + '\\n' +
    '   • Trùng mã: ' + countTrung + '\\n' +
    '   • Doanh thu <= 0: ' + countDoanhThuLoi + '\\n' +
    '   • Mã rỗng: ' + countRong + '\\n' +
    '🔧 SĐT đã chuẩn hóa: ' + countSdtSua;

  SpreadsheetApp.getUi().alert(msg);
}

function chuanHoaTenTiengViet(str) {
  if (!str) return '';
  return str.toLowerCase().split(/\\s+/).filter(Boolean).map(function(word) {
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

  var headers = data[2];
  var rows = data.slice(3);

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
    var sheetName = 'Sàn_' + chName.replace(/[\\/\\?\\*\\[\\]:]/g, '_');
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

  SpreadsheetApp.getUi().alert('📂 ĐÃ TÁCH XONG DỮ LIỆU THEO TỪNG KÊNH BÁN:\\n\\n' + summaryList.join('\\n'));
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

  var kpis = [
    { label: '📥 TỔNG DÒNG THÔ', val: rawCount + ' dòng', color: '#2563eb', range: 'A5:B7' },
    { label: '✅ DỮ LIỆU SẠCH', val: cleanCount + ' dòng', color: '#059669', range: 'C5:D7' },
    { label: '🗑️ BẢN GHI RÁC ĐÃ LỌC', val: discardCount + ' dòng', color: '#dc2626', range: 'E5:F7' },
    { label: '🎯 ĐỘ CHÍNH XÁC (ACCURACY)', val: accuracyRate + '%', color: '#7c3aed', range: 'G5:H7' }
  ];

  kpis.forEach(function(kpi) {
    var rng = dashSheet.getRange(kpi.range);
    rng.setBackground('#f8fafc');
    dashSheet.getRange(kpi.range.split(':')[0]).setValue(kpi.label + '\\n\\n' + kpi.val)
      .setFontColor(kpi.color).setFontWeight('bold').setFontSize(13)
      .setHorizontalAlignment('center').setVerticalAlignment('middle');
  });

  var calcSheet = ss.getSheetByName('Calc_Data_Clean') || ss.insertSheet('Calc_Data_Clean');
  calcSheet.clear();

  calcSheet.getRange('A1:B1').setValues([['Kênh Bán', 'Tổng Doanh Thu']]);
  var channels = ['Shopee', 'Lazada', 'TikTok Shop', 'Website'];
  for (var c = 0; c < channels.length; c++) {
    var r = c + 2;
    calcSheet.getRange('A' + r).setValue(channels[c]);
    calcSheet.getRange('B' + r).setFormula('=SUMIFS(DataCleaned_BT5!E4:E; DataCleaned_BT5!D4:D; "' + channels[c] + '")');
  }

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

  var pieChart = dashSheet.newChart().asPieChart()
    .setTitle('📊 CƠ CẤU DOANH THU THEO KÊNH BÁN')
    .addRange(calcSheet.getRange('A1:B5'))
    .setPosition(9, 1, 10, 10)
    .setOption('width', 490).setOption('height', 360)
    .setOption('is3D', true)
    .setNumHeaders(1)
    .build();
  dashSheet.insertChart(pieChart);

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
  huyTriggerLamSach();
  ScriptApp.newTrigger('chayTuDongLamSachVaBaoCao')
    .timeBased()
    .everyDays(1)
    .atHour(23)
    .nearMinute(30)
    .create();

  SpreadsheetApp.getUi().alert('⏰ ĐÃ BẬT TỰ ĐỘNG HÓA HÀNG ĐÊM!\\n\\nHệ thống sẽ tự động quét, làm sạch và cập nhật Dashboard vào lúc 23:30 mỗi đêm.');
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
`,
    
    workflow: [
      { icon: "ph-magnifying-glass", title: "0. Trinh Sát Dữ Liệu", desc: "AI quét & nắm 6 cột dữ liệu thô trên sheet RawData_BT5" },
      { icon: "ph-list-plus", title: "1. Menu & Audit Log", desc: "Tạo menu và quét kiểm toán xuất báo cáo lỗi chi tiết" },
      { icon: "ph-lightning", title: "2. Clean Engine RAM", desc: "Xử lý mảng in-memory < 2s, khử trùng và chuẩn hóa SĐT/Tên" },
      { icon: "ph-folder-notch-open", title: "3. Tách Kênh Bán", desc: "Tự động phân bổ ra các tab Shopee, Lazada, TikTok, Web" },
      { icon: "ph-chart-pie-slice", title: "4. Dashboard & Hẹn Giờ", desc: "4 thẻ KPI chất lượng, biểu đồ và hẹn giờ 23:30 ban đêm" }
    ],

    masterPrompt: `[VAI TRÒ]: Bạn là Chuyên gia Xử lý Dữ liệu Lớn & Tối ưu Hiệu năng Google Workspace (Data Quality & In-Memory Optimization Expert).
[NHIỆM VỤ]: Viết mã Google Apps Script hoàn chỉnh theo kiến trúc tách từng file độc lập (1 Vi Bước = 1 File) để xây dựng hệ thống kiểm toán, làm sạch và phân bổ dữ liệu đơn hàng thương mại điện tử siêu tốc trên Google Sheets.
[DANH SÁCH FILE CẦN XÂY DỰNG]:
1. 1_Menu_DataCleaning.gs (Thanh Menu '🧹 Làm Sạch Dữ Liệu' và điều khiển trung tâm)
2. 2_AuditScan_BaoCaoLoi.gs (Quét an toàn dữ liệu thô, phát hiện lỗi và xuất báo cáo đối soát ra sheet Audit_Log)
3. 3_InRam_CleanEngine.gs (Động cơ làm sạch mảng trên bộ nhớ RAM với Set() tra cứu O(1), chuẩn hóa SĐT 10 số, họ tên Proper Case, xuất DataCleaned_BT5 trong dưới 2 giây)
4. 4_Split_ByChannel.gs (Tự động gom nhóm đơn và tách thành các sheet riêng cho từng sàn Shopee, Lazada, TikTok Shop, Website)
5. 5_Dashboard_DataQuality.gs (Xây dựng Dashboard trực quan gồm 4 thẻ KPI chất lượng và 2 Biểu đồ cơ cấu doanh thu / phân loại lỗi)
6. 6_Trigger_NightlyClean.gs (Cài đặt Time-driven Trigger tự động chạy ngầm lúc 23:30 mỗi đêm)
7. CleanConfigForm.html (Giao diện pop-up Aesthetic Blue cho phép người dùng tùy biến cấu hình bộ lọc)

[QUY TẮC BẮT BUỘC]:
- Tuân thủ file QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md: Tuyệt đối dùng getValues() 1 lần và setValues() 1 lần duy nhất, không lặp cell-by-cell gây timeout; chuẩn Locale VN dấu ;, mảng escape \\.`,

    businessScenario: {
      story: "Bạn là Chuyên viên Phân tích Dữ liệu / Vận hành E-Commerce của một chuỗi bán lẻ đa kênh. Hàng ngày, hệ thống trả về file log hơn 1.000 đơn hàng đổ về từ các sàn Shopee, Lazada, TikTok Shop và Website với chất lượng cực kỳ lộn xộn.",
      pain: "Mã đơn hàng bị rỗng hoặc bị trùng do khách ấn mua 2 lần, số điện thoại bị mất số '0' ở đầu hoặc dính dấu chấm/khoảng trắng, họ tên viết hoa thường tùy tiện, doanh thu có dòng bị âm do lỗi chiết khấu. Dùng hàm Excel thủ công lọc từng dòng mất cả buổi chiều và dễ làm treo bảng tính.",
      solution: "Xây dựng Hệ Thống Kiểm Toán & Làm Sạch Dữ Liệu Tự Động theo mô hình vi bước: (1) Quét kiểm toán an toàn ra tab Audit_Log, (2) Động cơ In-Memory RAM làm sạch 1.000 dòng trong dưới 2 giây, (3) Tự động phân bổ ra các tab từng sàn và (4) Dashboard phân tích chất lượng dữ liệu."
    },

    promptBreakdown: [
      { tag: "1. ÉP BUỘC HIỆU NĂNG RAM", title: "Kỹ thuật In-Memory Batching", desc: "Bắt buộc AI dùng getValues() và setValues() đúng 1 lần duy nhất, thao tác 100% trên mảng JavaScript để đạt tốc độ dưới 2 giây." },
      { tag: "2. BƯỚC ĐỆM KIỂM TOÁN AN TOÀN", title: "Sheet Audit_Log minh bạch", desc: "Quét kiểm tra trước và lập bảng đối soát chi tiết từng dòng lỗi trước khi làm sạch để dữ liệu gốc không bị ảnh hưởng." },
      { tag: "3. BỘ LỌC CHUẨN HÓA DỮ LIỆU", title: "Set() O(1) & Regex Chuẩn Hóa", desc: "Khử triệt để mã trùng lặp bằng cấu trúc Set, thêm số 0 cho SĐT 9 chữ số và chuẩn hóa họ tên Proper Case." },
      { tag: "4. PHÂN BỔ ĐA KÊNH BÁN", title: "Tự động tách Sheet theo Sàn", desc: "Quét cột Kênh Bán và chia dữ liệu sạch về từng tab Shopee, Lazada, TikTok Shop với màu sắc thương hiệu đồng bộ." },
      { tag: "5. DASHBOARD & TỰ ĐỘNG HÓA", title: "KPI Chất Lượng & Trigger Đêm", desc: "Hiển thị tỷ lệ chính xác (Accuracy %), biểu đồ phân loại lỗi và tự động hóa chạy ngầm lúc 23:30 mỗi đêm." }
    ],

    businessRequirements: `
      <p><b>Bài toán thực tế:</b> Xây dựng ứng dụng kiểm soát chất lượng và làm sạch dữ liệu lớn đa kênh, áp dụng kiến trúc 1 Vi Bước = 1 File Độc Lập:</p>
      <ul>
        <li><b>Mô hình 1 Vi Bước = 1 File Độc Lập:</b> Giúp học viên văn phòng làm đến đâu thấy ngay kết quả đến đó, không lo chắp vá code hay phát sinh lỗi xung đột.</li>
        <li><b>Bước Kiểm Toán An Toàn (Sheet Audit_Log):</b> Quét dữ liệu thô và xuất danh sách lỗi chi tiết ra tab <code>Audit_Log</code> để đối soát trước khi ghi vào dữ liệu sạch.</li>
        <li><b>Động Cơ Xử Lý Trên RAM Siêu Tốc:</b> Xử lý hơn 1.000 dòng log đơn hàng trong <b>dưới 2 giây</b> bằng kỹ thuật In-Memory Array & Set Deduplication.</li>
        <li><b>Tự Động Phân Bổ Theo Kênh Bán:</b> Tự tạo các tab <code>Sàn_Shopee</code>, <code>Sàn_Lazada</code>, <code>Sàn_TikTok Shop</code>, <code>Sàn_Website</code> giúp các bộ phận nhận việc ngay.</li>
        <li><b>Dashboard Kiểm Soát Chất Lượng:</b> 4 thẻ KPI nổi bật (📥 Tổng Dòng Thô, ✅ Dữ Liệu Sạch, 🗑️ Rác Đã Lọc, 🎯 Độ Chính Xác %) & 2 Biểu đồ trực quan.</li>
        <li><b>Tự Động Hóa Định Kỳ:</b> Hẹn giờ Time-driven Trigger chạy ngầm 23:30 hàng đêm.</li>
      </ul>
    `,

    tableHeaders: ["Mã Giao Dịch", "Tên Khách Hàng", "Số Điện Thoại", "Kênh Bán", "Doanh Thu", "Ngày Tạo", "Trạng Thái Lỗi Trong Dữ Liệu Thô"],
    tableRows: [
      ["TRX-2026-00001", "   nguyễn văn an  ", "988123456", "Shopee", "1,250,000", "01/08/2026", "<span style='color: #f59e0b;'>⚠️ Thừa khoảng trắng, mất số 0 đầu</span>"],
      ["TRX-2026-00002", "TRẦN THỊ BÍCH", "0903.987.654", "Lazada", "850,000", "01/08/2026", "<span style='color: #f59e0b;'>⚠️ SĐT dính dấu chấm</span>"],
      ["", "Lê Hoàng Long", "0912345678", "TikTok Shop", "450,000", "02/08/2026", "<span style='color: #ef4444;'>❌ Mã GD rỗng (Cần loại bỏ)</span>"],
      ["TRX-2026-00001", "Nguyễn Văn An", "0988123456", "Shopee", "1,250,000", "01/08/2026", "<span style='color: #ef4444;'>❌ Trùng lặp mã giao dịch (Cần loại bỏ)</span>"],
      ["TRX-2026-00005", "Phạm Thị Dung", "0977889900", "Website", "-150,000", "03/08/2026", "<span style='color: #ef4444;'>❌ Doanh thu âm (Cần loại bỏ)</span>"]
    ],

    steps: [
      {
        badge: "00",
        title: "Bước 0: AI Trinh Sát & Kiểm Kê Cấu Trúc Sheet RawData_BT5",
        desc: "Gửi link Google Sheets để AI tự động kiểm kê 6 cột dữ liệu thô và nhận diện các dạng lỗi tiềm ẩn trước khi lập trình.",
        promptBox: `[YÊU CẦU TRINH SÁT BẢNG TÍNH]:
Link Google Sheets: [Dán đường link bảng tính của bạn vào đây]

Tôi đang có một file bảng tính quản lý dữ liệu log đơn hàng đa sàn tại trang tính "RawData_BT5".
Nhiệm vụ của bạn ở bước này:
1. Hãy truy cập vào link bảng tính và kiểm kê kỹ trang tính "RawData_BT5".
2. Xác định rõ: Tên 6 cột dữ liệu (từ Cột A đến Cột F), dòng tiêu đề (Dòng 3) và dòng bắt đầu có dữ liệu thực tế (Dòng 4 trở đi).
3. Chỉ ra sơ bộ các dạng dữ liệu không chuẩn hiện có (mã rỗng, mã trùng, số điện thoại có dấu chấm hoặc mất số 0, họ tên thừa khoảng trắng, doanh thu âm).
4. Tóm tắt ngắn gọn cấu trúc để xác nhận bạn đã hiểu đúng trước khi làm việc.

⚠️ Lưu ý: Chưa viết bất kỳ dòng code nào ở bước này.`
      },
      {
        badge: "01",
        title: "Bước 1: Tạo File 1_Menu_DataCleaning.gs (Menu Điều Khiển Trung Tâm)",
        desc: "Thao tác: Mở Apps Script ➔ Bấm dấu (+) chọn Script ➔ Đặt tên file là <code>1_Menu_DataCleaning.gs</code> ➔ Dán mã AI sinh ra vào.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia Google Apps Script. Hãy tuân thủ nghiêm ngặt toàn bộ nguyên tắc trong tài liệu "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

[YÊU CẦU NGHIỆP VỤ - FILE 1_Menu_DataCleaning.gs]:
Dựa vào bảng tính đã trinh sát ở Bước 0, hãy viết mã cho file độc lập "1_Menu_DataCleaning.gs" chứa hàm onOpen() để tạo Menu "🧹 Làm Sạch Dữ Liệu" trên thanh công cụ Google Sheets gồm các chức năng:

1. 📊 1. Dashboard Chất Lượng Dữ Liệu (gọi hàm khoiTaoDashboardDataQuality)
   [Đường gạch ngang phân cách]
2. 🔍 2. Quét Kiểm Toán Lỗi (Ra Sheet Audit_Log) (gọi hàm chayKiemToanDuLieuAuditLog)
3. ⚡ 3. Chạy Làm Sạch Dữ Liệu (< 2s) (gọi hàm chayLamSachDuLieuInRam)
4. 📂 4. Tách Dữ Liệu Theo Kênh Bán Hàng (gọi hàm tachDuLieuTheoKenhBan)
   [Đường gạch ngang phân cách]
5. ⚙️ 5. Cấu Hình Quy Tắc Lọc (Pop-up) (gọi hàm moFormCauHinhLoc mở file 'CleanConfigForm' kích thước 680x560px)
   [Đường gạch ngang phân cách]
6. ⏰ 6. Bật Tự Động Hóa (23:30 Hàng Đêm) (gọi hàm caiDatTriggerLamSachHangDem)
7. 🛑 Tắt Tự Động Hóa Định Kỳ (gọi hàm huyTriggerLamSach)
   [Đường gạch ngang phân cách]
8. ❓ Hướng Dẫn Sử Dụng (hiện hộp thoại tóm tắt quy trình 5 bước)

[YÊU CẦU ĐẦU RA]:
- Xuất khối mã hoàn chỉnh cho file "1_Menu_DataCleaning.gs", có bọc kiểm tra an toàn nếu các hàm ở bước sau chưa được tạo.`
      },
      {
        badge: "02",
        title: "Bước 2: Tạo File 2_AuditScan_BaoCaoLoi.gs (Bước Đệm Kiểm Toán & Báo Cáo Lỗi An Toàn)",
        desc: "Thao tác: Bấm dấu (+) chọn Script ➔ Đặt tên file là <code>2_AuditScan_BaoCaoLoi.gs</code> ➔ Dán mã quét kiểm toán an toàn xuất ra sheet Audit_Log.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia Google Apps Script. Hãy tuân thủ nghiêm ngặt toàn bộ nguyên tắc trong tài liệu "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

[YÊU CẦU NGHIỆP VỤ - FILE 2_AuditScan_BaoCaoLoi.gs]:
Hãy viết toàn bộ mã nguồn cho file độc lập "2_AuditScan_BaoCaoLoi.gs" chứa hàm chayKiemToanDuLieuAuditLog() để quét kiểm tra dữ liệu thô và xuất báo cáo an toàn:

1. Đọc toàn bộ dữ liệu từ sheet "RawData_BT5" (bắt đầu từ dòng 4) bằng getValues() 1 lần duy nhất vào bộ nhớ RAM.
2. Kiểm tra chi tiết từng dòng và phát hiện các dạng lỗi:
   - Mã GD rỗng hoặc bị trùng lặp (dùng Set để phát hiện mã xuất hiện từ lần thứ 2 trở đi).
   - Doanh thu âm hoặc bằng 0.
   - Số điện thoại sai định dạng: chứa dấu chấm, khoảng trắng, gạch ngang hoặc chỉ có 9 số (bị mất số 0).
   - Họ tên khách hàng: chứa khoảng trắng thừa kép hoặc viết hoa/thường lộn xộn.
3. Tạo mới hoặc làm sạch trang tính tên "Audit_Log" nằm ở vị trí số 2 (sau RawData_BT5):
   - Hàng 1: Banner "📋 BÁO CÁO KIỂM TOÁN CHẤT LƯỢNG DỮ LIỆU (DATA AUDIT LOG)" nền xanh Navy #1B365D, chữ trắng in đậm cỡ 14.
   - Hàng 2: Dòng tóm tắt thống kê: Tổng dòng quét, số dòng hợp lệ, số mã rỗng, trùng mã, lỗi doanh thu, SĐT cần sửa, Tên cần sửa.
   - Hàng 4: Tiêu đề 8 cột: Dòng Lỗi, Mã Giao Dịch, Tên Khách Hàng, Số Điện Thoại, Kênh Bán, Doanh Thu, Mức Độ (LỖI NGHIÊM TRỌNG / CẢNH BÁO), Chi Tiết Lỗi Phát Hiện.
4. Ghi toàn bộ danh sách các dòng có lỗi xuống sheet "Audit_Log" 1 lần duy nhất bằng setValues() và format tiền tệ cho cột Doanh Thu.
5. Hiển thị hộp thoại Alert thông báo số lượng bản ghi phát hiện lỗi và chuyển tab sang "Audit_Log".

[YÊU CẦU ĐẦU RA]:
- Xuất khối mã hoàn chỉnh cho file "2_AuditScan_BaoCaoLoi.gs", tuyệt đối không chỉnh sửa đè lên dữ liệu thô gốc.`
      },
      {
        badge: "03",
        title: "Bước 3: Tạo File 3_InRam_CleanEngine.gs (Động Cơ Làm Sạch Siêu Tốc Trên RAM < 2 Giây)",
        desc: "Thao tác: Bấm dấu (+) chọn Script ➔ Đặt tên file là <code>3_InRam_CleanEngine.gs</code> ➔ Dán mã động cơ làm sạch trên RAM xuất tab DataCleaned_BT5.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia Google Apps Script. Hãy tuân thủ nghiêm ngặt toàn bộ nguyên tắc trong tài liệu "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm (In-Memory Batching, getValues/setValues đúng 1 lần).

[YÊU CẦU NGHIỆP VỤ - FILE 3_InRam_CleanEngine.gs]:
Hãy viết mã cho file độc lập "3_InRam_CleanEngine.gs" chứa hàm chayLamSachDuLieuInRam() để làm sạch hơn 1.000 dòng dữ liệu trong dưới 2 giây:

1. Đọc dữ liệu từ "RawData_BT5" vào mảng 2 chiều trong RAM bằng getValues().
2. Quy tắc lọc và chuẩn hóa dữ liệu trên RAM:
   - Loại bỏ các dòng có Mã Giao Dịch rỗng.
   - Sử dụng Set() tra cứu O(1) để loại bỏ triệt để các mã giao dịch trùng lặp (chỉ giữ lại dòng đầu tiên).
   - Loại bỏ các dòng có Doanh Thu <= 0.
   - Chuẩn hóa Họ Tên: Tạo hàm phụ chuanHoaTenTiengViet(str) xóa khoảng trắng thừa đầu/cuối/giữa và viết hoa chữ cái đầu từng từ (Proper Case: "  nguyễn  văn an " -> "Nguyễn Văn An").
   - Chuẩn hóa Số Điện Thoại: Xóa toàn bộ ký tự (. - space) và tự động thêm số "0" vào đầu nếu SĐT có 9 chữ số.
   - Chuẩn hóa Ngày Tạo: Giữ định dạng ngày tháng chuẩn dd/MM/yyyy.
   - Cột Trạng Thái: Gắn giá trị "Hợp Lệ".
3. Tạo mới hoặc làm sạch trang tính tên "DataCleaned_BT5":
   - Hàng 1: Banner "✨ BẢNG DỮ LIỆU ĐÃ ĐƯỢC LÀM SẠCH & CHUẨN HÓA (CLEAN DATA)" nền xanh Navy #1B365D, chữ trắng in đậm.
   - Hàng 3: Header 7 cột (Mã Giao Dịch, Tên Khách Hàng, Số Điện Thoại, Kênh Bán, Doanh Thu, Ngày Tạo, Trạng Thái) nền xanh dương #005A9C, chữ trắng in đậm.
   - Ghi toàn bộ dữ liệu sạch từ dòng 4 trở đi đúng 1 lần duy nhất bằng setValues().
   - Định dạng cột Doanh Thu '#,##0', căn giữa cột Mã GD, SĐT, Ngày Tạo và autoResizeColumns.
4. Đo thời gian thực thi (execution time) bằng startTime = new Date().getTime() và hiển thị hộp thoại Alert thống kê chi tiết: Thời gian hoàn tất (giây), Dòng ban đầu, Dòng sạch hợp lệ, Số dòng đã loại theo từng nguyên nhân.

[YÊU CẦU ĐẦU RA]:
- Xuất khối mã hoàn chỉnh cho file "3_InRam_CleanEngine.gs".`
      },
      {
        badge: "04",
        title: "Bước 4: Tạo File 4_Split_ByChannel.gs (Tự Động Phân Bổ Theo Kênh Bán Hàng)",
        desc: "Thao tác: Bấm dấu (+) chọn Script ➔ Đặt tên file là <code>4_Split_ByChannel.gs</code> ➔ Dán mã tự động chia tách sheet theo từng sàn thương mại điện tử.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia Google Apps Script. Hãy tuân thủ nghiêm ngặt toàn bộ nguyên tắc trong tài liệu "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

[YÊU CẦU NGHIỆP VỤ - FILE 4_Split_ByChannel.gs]:
Hãy viết mã cho file độc lập "4_Split_ByChannel.gs" chứa hàm tachDuLieuTheoKenhBan() để tự động phân bổ dữ liệu sạch cho từng bộ phận:

1. Nguồn dữ liệu: Đọc từ trang tính "DataCleaned_BT5" đã làm sạch ở Bước 3 (kiểm tra nếu chưa có sheet thì nhắc người dùng chạy Bước 3 trước).
2. Gom nhóm theo Kênh Bán (Cột D): Tự động gom nhóm toàn bộ các dòng theo từng kênh (Shopee, Lazada, TikTok Shop, Website...).
3. Tự động tạo hoặc làm mới từng sheet mang tên theo kênh:
   - Tên sheet: "Sàn_Shopee", "Sàn_Lazada", "Sàn_TikTok Shop", "Sàn_Website".
   - Banner từng sàn với màu thương hiệu đặc trưng: Shopee màu cam #EE4D2D, Lazada màu xanh đậm #0f146d, TikTok Shop màu đen #000000, Website màu xanh dương #2563eb.
   - Ghi dữ liệu của từng sàn tương ứng, định dạng số tiền '#,##0' và căn lề đẹp mắt.
4. Hiển thị hộp thoại Alert tổng kết số lượng đơn hàng đã được phân bổ về từng sàn.

[YÊU CẦU ĐẦU RA]:
- Xuất khối mã hoàn chỉnh cho file "4_Split_ByChannel.gs".`
      },
      {
        badge: "05",
        title: "Bước 5: Tạo File 5_Dashboard_DataQuality.gs (Dashboard Thống Kê & KPI Chất Lượng)",
        desc: "Thao tác: Bấm dấu (+) chọn Script ➔ Đặt tên file là <code>5_Dashboard_DataQuality.gs</code> ➔ Dán mã tạo 4 thẻ KPI và 2 biểu đồ phân tích.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia Google Apps Script. Hãy tuân thủ nghiêm ngặt toàn bộ nguyên tắc trong tài liệu "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm (Biểu đồ asPieChart, asColumnChart, setNumHeaders(1), Locale VN dấu ;).

[YÊU CẦU NGHIỆP VỤ - FILE 5_Dashboard_DataQuality.gs]:
Hãy viết toàn bộ mã nguồn cho file độc lập "5_Dashboard_DataQuality.gs" chứa hàm khoiTaoDashboardDataQuality() để xây dựng Dashboard kiểm soát chất lượng dữ liệu:

1. Khởi tạo trang "📊 Dashboard Dữ Liệu" ở vị trí đầu tiên (Sheet 1):
   - Hàng 1: Banner "📊 BÁO CÁO KIỂM SOÁT CHẤT LƯỢNG & DOANH THU ĐƠN HÀNG" nền Navy #1B365D, chữ trắng in đậm cỡ 18.
   - Hàng 3: Dòng ngày giờ cập nhật tự động.
2. 4 thẻ KPI chất lượng (Hàng 5 đến Hàng 7):
   - 📥 TỔNG DÒNG THÔ (Cột A-B): Số dòng tiếp nhận từ RawData_BT5.
   - ✅ DỮ LIỆU SẠCH (Cột C-D): Số dòng hợp lệ trong DataCleaned_BT5 (màu xanh lá #059669).
   - 🗑️ BẢN GHI RÁC ĐÃ LỌC (Cột E-F): Số dòng lỗi đã loại bỏ (màu đỏ #dc2626).
   - 🎯 ĐỘ CHÍNH XÁC (Cột G-H): Tỷ lệ % dữ liệu sạch trên tổng số dòng thô (màu tím #7c3aed).
3. Trang tính phụ "Calc_Data_Clean" (giữ hiển thị bình thường, không ẩn tab):
   - Bảng 1 (A1:B5): Tổng doanh thu từng kênh bán (Shopee, Lazada, TikTok Shop, Website) dùng công thức SUMIFS chuẩn dấu chấm phẩy ';'.
   - Bảng 2 (D1:E5): Cơ cấu các loại lỗi từ sheet Audit_Log dùng COUNTIF chuẩn dấu ';'.
4. Tự động vẽ 2 biểu đồ đặt tại Hàng 9:
   - Biểu đồ tròn (PIE): Cơ cấu doanh thu theo kênh bán (đặt tại A9, kích thước 490x360px, 3D, hiển thị chú thích).
   - Biểu đồ cột (COLUMN): Phân loại các dạng lỗi trong dữ liệu thô (đặt tại E9, kích thước 560x360px, cột màu đỏ cảnh báo).

[YÊU CẦU ĐẦU RA]:
- Xuất khối mã hoàn chỉnh cho file "5_Dashboard_DataQuality.gs".`
      },
      {
        badge: "06",
        title: "Bước 6: Tạo File 6_Trigger_NightlyClean.gs (Tự Động Hóa Định Kỳ 23:30 Hàng Đêm)",
        desc: "Thao tác: Bấm dấu (+) chọn Script ➔ Đặt tên file là <code>6_Trigger_NightlyClean.gs</code> ➔ Dán mã cài đặt trigger tự động hóa ban đêm.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia Google Apps Script. Hãy tuân thủ nghiêm ngặt toàn bộ nguyên tắc trong tài liệu "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

[YÊU CẦU NGHIỆP VỤ - FILE 6_Trigger_NightlyClean.gs]:
Hãy viết mã cho file độc lập "6_Trigger_NightlyClean.gs" để cài đặt cơ chế tự động hóa định kỳ không cần mở máy tính:

1. Hàm caiDatTriggerLamSachHangDem():
   - Tự động quét và xóa trigger cũ trùng lặp nếu đã cài trước đó để tránh kích hoạt nhiều lần.
   - Tạo Time-driven Trigger mới chạy hàm chayTuDongLamSachVaBaoCao() lặp lại mỗi ngày (everyDays(1)) vào khung giờ 23:00 - 24:00 đêm (atHour(23).nearMinute(30)).
   - Hiển thị hộp thoại Alert thông báo đã kích hoạt tự động hóa thành công.
2. Hàm huyTriggerLamSach():
   - Quét tìm tất cả các trigger đang liên kết với hàm chayTuDongLamSachVaBaoCao() và xóa bỏ hoàn toàn.
3. Hàm điều phối chayTuDongLamSachVaBaoCao():
   - Tự động gọi lần lượt: chayLamSachDuLieuInRam(), tachDuLieuTheoKenhBan() và khoiTaoDashboardDataQuality().

[YÊU CẦU ĐẦU RA]:
- Xuất khối mã hoàn chỉnh cho file "6_Trigger_NightlyClean.gs".`
      },
      {
        badge: "07",
        title: "Bước 7: Tạo File CleanConfigForm.html (Giao Diện Pop-up Cấu Hình Quy Tắc Lọc)",
        desc: "Thao tác: Bấm dấu (+) chọn HTML ➔ Đặt tên file là <code>CleanConfigForm.html</code> ➔ Dán mã giao diện pop-up Aesthetic Blue.",
        promptBox: `Hãy thiết kế mã nguồn cho tệp giao diện pop-up "CleanConfigForm.html" phục vụ cấu hình bộ lọc dữ liệu:

1. Giao diện & Thư viện:
   - Sử dụng Bootstrap 5 và FontAwesome 6 qua CDN.
   - Phong cách thiết kế Aesthetic Blue cao cấp, font chữ hệ thống hiện đại, bo góc tròn 12px, nền card trắng sáng bóng bẩy.
2. Nội dung biểu mẫu cấu hình:
   - Tiêu đề: "⚙️ Cấu Hình Quy Tắc Làm Sạch Dữ Liệu" (icon sliders màu xanh).
   - 5 Checkbox tùy chọn có mô tả phụ nhỏ gọn bên dưới:
     1. Khử trùng lặp mã giao dịch (Deduplication - Set() O(1)) [Mặc định: Bật]
     2. Tự động chuẩn hóa số điện thoại (Xóa ký tự lạ, thêm số 0 đầu) [Mặc định: Bật]
     3. Chuẩn hóa viết hoa họ tên (Proper Case) [Mặc định: Bật]
     4. Loại bỏ đơn có doanh thu <= 0 [Mặc định: Bật]
     5. Tự động chia tách sheet theo từng kênh bán [Mặc định: Bật]
   - Nút bấm chính "🚀 Bắt Đầu Xử Lý Ngay (< 2s)" nền xanh Navy #1B365D.
3. Tương tác JavaScript:
   - Khi bấm nút, nút chuyển sang trạng thái loading với icon xoay và gọi google.script.run.chayLamSachDuLieuInRam().
   - Khi xử lý thành công, tự động đóng cửa sổ modal bằng google.script.host.close().`
      }
    ],

    triggerGuide: `
      <h3 class="section-title"><i class="ph-bold ph-lightning"></i> Tự Động Hóa Định Kỳ & Cảnh Báo Email Ban Đêm</h3>
      <p style="color: var(--text-secondary); line-height: 1.7;">
        Bằng cách kích hoạt mục <b>"⏰ 6. Bật Tự Động Hóa (23:30 Hàng Đêm)"</b> trên menu bảng tính, Google Apps Script sẽ tự động đánh thức hệ thống vào lúc 23:30 mỗi đêm để quét toàn bộ log đơn hàng mới đổ về trong ngày, tự động làm sạch sang tab <code>DataCleaned_BT5</code>, chia về từng sàn và cập nhật lại Dashboard chỉ số kinh doanh. Khi bạn mở máy tính vào 08:00 sáng hôm sau, mọi dữ liệu đã sẵn sàng báo cáo ban lãnh đạo mà không tốn một giây thao tác thủ công!
      </p>
    `,

    checklist: [
      "Trang tính có sheet 'RawData_BT5' chứa hơn 1.000 dòng log đơn hàng bắt đầu từ dòng 4.",
      "Đã tạo đủ 7 tệp độc lập trong Apps Script Editor: 1_Menu_DataCleaning.gs, 2_AuditScan_BaoCaoLoi.gs, 3_InRam_CleanEngine.gs, 4_Split_ByChannel.gs, 5_Dashboard_DataQuality.gs, 6_Trigger_NightlyClean.gs, CleanConfigForm.html.",
      "Menu '🧹 Làm Sạch Dữ Liệu' xuất hiện trên thanh công cụ sau khi mở lại bảng tính.",
      "Chạy chức năng '2. Quét Kiểm Toán Lỗi' tạo thành công trang 'Audit_Log' với danh sách các dòng lỗi chi tiết.",
      "Chạy chức năng '3. Chạy Làm Sạch Dữ Liệu' tạo trang 'DataCleaned_BT5' hoàn tất dưới 2 giây, khử sạch trùng lặp, SĐT đủ 10 số có số 0 đầu, tên khách hàng viết hoa chuẩn.",
      "Chạy chức năng '4. Tách Dữ Liệu Theo Kênh Bán Hàng' tự động sinh 4 sheet Sàn_Shopee, Sàn_Lazada, Sàn_TikTok Shop, Sàn_Website với màu sắc nhận diện riêng.",
      "Trang '📊 Dashboard Dữ Liệu' hiển thị đủ 4 thẻ KPI chất lượng (độ chính xác %) cùng 2 Biểu đồ tròn và Biểu đồ cột không bị lỗi #ERROR!.",
      "Cài đặt Time-driven Trigger thành công lúc 23:30 hàng đêm."
    ]
  }
);
