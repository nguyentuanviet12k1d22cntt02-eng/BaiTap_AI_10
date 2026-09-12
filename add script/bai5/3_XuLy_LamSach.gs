/**
 * FILE: 3_XuLy_LamSach.gs
 * Chức năng: Làm sạch dữ liệu siêu tốc dưới 2 giây và lưu sang DataCleaned_BT5
 */
function chayLamSachDuLieuNhanh() {
  var thoiGianBatDau = new Date().getTime();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var rawSheet = ss.getSheetByName('RawData_BT5');
  if (!rawSheet) {
    SpreadsheetApp.getUi().alert('Thông báo: Không tìm thấy sheet nguồn "RawData_BT5"!');
    return;
  }

  var rawData = rawSheet.getDataRange().getValues();
  if (rawData.length < 4) return;

  var rows = rawData.slice(3);
  var danhSachMa = new Set();
  var duLieuSach = [];

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
    var ngayGoc = rows[i][5];
    var ngayTao = ngayGoc instanceof Date ? Utilities.formatDate(ngayGoc, 'GMT+7', 'dd/MM/yyyy') : String(ngayGoc || '');

    if (maGD === '') { countRong++; continue; }
    if (danhSachMa.has(maGD)) { countTrung++; continue; }
    if (doanhThu <= 0) { countDoanhThuLoi++; continue; }

    danhSachMa.add(maGD);
    tenKH = chuanHoaTenTiengViet(tenKH);

    if (sdt.length === 9 && !sdt.startsWith('0')) {
      sdt = '0' + sdt;
      countSdtSua++;
    }

    duLieuSach.push([maGD, tenKH, sdt, kenhBan, doanhThu, ngayTao, 'Hợp Lệ']);
  }

  var cleanName = 'DataCleaned_BT5';
  var cleanSheet = ss.getSheetByName(cleanName) || ss.insertSheet(cleanName, 2);
  cleanSheet.clear();

  var headers = ['Mã Giao Dịch', 'Tên Khách Hàng', 'Số Điện Thoại', 'Kênh Bán', 'Doanh Thu', 'Ngày Tạo', 'Trạng Thái'];

  cleanSheet.getRange('A1:G1').merge()
    .setValue('BẢNG DỮ LIỆU ĐÃ ĐƯỢC LÀM SẠCH VÀ CHUẨN HÓA')
    .setBackground('#1B365D').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(13)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  cleanSheet.setRowHeight(1, 35);

  cleanSheet.getRange(3, 1, 1, headers.length).setValues([headers])
    .setBackground('#005A9C').setFontColor('#FFFFFF').setFontWeight('bold');
  cleanSheet.setRowHeight(3, 26);

  if (duLieuSach.length > 0) {
    cleanSheet.getRange(4, 1, duLieuSach.length, headers.length).setValues(duLieuSach);
    cleanSheet.getRange(4, 5, duLieuSach.length, 1).setNumberFormat('#,##0');
    cleanSheet.getRange(4, 1, duLieuSach.length, 1).setHorizontalAlignment('center');
    cleanSheet.getRange(4, 3, duLieuSach.length, 1).setHorizontalAlignment('center');
    cleanSheet.getRange(4, 6, duLieuSach.length, 2).setHorizontalAlignment('center');
    cleanSheet.autoResizeColumns(1, headers.length);
  }

  var giayXuLy = ((new Date().getTime() - thoiGianBatDau) / 1000).toFixed(2);
  ss.setActiveSheet(cleanSheet);

  var thongBao = 'ĐÃ LÀM SẠCH XONG TRONG ' + giayXuLy + ' GIÂY!\n' +
    '-----------------------------------------\n' +
    'Dữ liệu ban đầu: ' + rows.length + ' dòng\n' +
    'Dữ liệu sạch thu được: ' + duLieuSach.length + ' dòng\n' +
    'Số dòng đã loại bỏ: ' + (rows.length - duLieuSach.length) + '\n' +
    '   - Bị trùng mã đơn: ' + countTrung + '\n' +
    '   - Doanh thu nhỏ hơn hoặc bằng 0: ' + countDoanhThuLoi + '\n' +
    '   - Mã đơn để trống: ' + countRong + '\n' +
    'Số điện thoại đã tự thêm số 0: ' + countSdtSua;

  SpreadsheetApp.getUi().alert(thongBao);
}

function chuanHoaTenTiengViet(chuoi) {
  if (!chuoi) return '';
  return chuoi.toLowerCase().split(/\s+/).filter(Boolean).map(function(tu) {
    return tu.charAt(0).toUpperCase() + tu.slice(1);
  }).join(' ');
}
