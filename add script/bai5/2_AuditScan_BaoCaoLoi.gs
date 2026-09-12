/**
 * FILE: 2_AuditScan_BaoCaoLoi.gs
 * Chức năng: Quét kiểm toán dữ liệu thô, phát hiện lỗi và lập báo cáo an toàn ra sheet Audit_Log
 */
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
