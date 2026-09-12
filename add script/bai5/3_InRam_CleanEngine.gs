/**
 * FILE: 3_InRam_CleanEngine.gs
 * Chức năng: Động cơ xử lý và làm sạch dữ liệu lớn trên RAM (< 2 giây)
 */
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
