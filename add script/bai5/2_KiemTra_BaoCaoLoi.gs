/**
 * FILE: 2_KiemTra_BaoCaoLoi.gs
 * Chức năng: Kiểm tra dữ liệu thô và xuất danh sách lỗi ra sheet Bao_Cao_Loi
 */
function chayKiemTraBaoCaoLoi() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var rawSheet = ss.getSheetByName('RawData_BT5');
  if (!rawSheet) {
    SpreadsheetApp.getUi().alert('Thông báo: Không tìm thấy sheet nguồn "RawData_BT5"!');
    return;
  }

  var rawData = rawSheet.getDataRange().getValues();
  if (rawData.length < 4) {
    SpreadsheetApp.getUi().alert('Sheet RawData_BT5 chưa có dữ liệu để kiểm tra.');
    return;
  }

  var rows = rawData.slice(3);
  var danhSachLoi = [];
  var danhSachMaDaGap = new Set();

  var countRong = 0;
  var countTrung = 0;
  var countSdtLoi = 0;
  var countDoanhThuLoi = 0;
  var countTenThuaKhoangTrang = 0;

  for (var i = 0; i < rows.length; i++) {
    var soDong = i + 4;
    var maGD = String(rows[i][0] || '').trim();
    var tenKH = String(rows[i][1] || '').trim();
    var sdtGoc = String(rows[i][2] || '').trim();
    var sdtLocKyTu = sdtGoc.replace(/[\.\s-]/g, '');
    var kenhBan = String(rows[i][3] || '').trim();
    var doanhThu = Number(rows[i][4]) || 0;

    var cacLoiPhatHien = [];
    var mucDo = 'Hợp Lệ';

    if (maGD === '') {
      cacLoiPhatHien.push('Mã đơn hàng bị để trống');
      countRong++;
      mucDo = 'Lỗi Cần Loại Bỏ';
    } else if (danhSachMaDaGap.has(maGD)) {
      cacLoiPhatHien.push('Mã đơn hàng bị trùng lặp');
      countTrung++;
      mucDo = 'Lỗi Cần Loại Bỏ';
    } else {
      danhSachMaDaGap.add(maGD);
    }

    if (doanhThu <= 0) {
      cacLoiPhatHien.push('Doanh thu nhỏ hơn hoặc bằng 0 (' + doanhThu + ')');
      countDoanhThuLoi++;
      mucDo = 'Lỗi Cần Loại Bỏ';
    }

    if (sdtGoc.match(/[\.\s-]/) || (sdtLocKyTu.length === 9 && !sdtLocKyTu.startsWith('0'))) {
      cacLoiPhatHien.push('Số điện thoại có ký tự lạ hoặc mất số 0 đầu (' + sdtGoc + ')');
      countSdtLoi++;
      if (mucDo === 'Hợp Lệ') mucDo = 'Tự Động Sửa Được';
    }

    if (String(rows[i][1] || '').match(/\s{2,}/) || tenKH !== chuanHoaTenTiengViet(tenKH)) {
      cacLoiPhatHien.push('Họ tên viết hoa lộn xộn hoặc thừa khoảng trắng');
      countTenThuaKhoangTrang++;
      if (mucDo === 'Hợp Lệ') mucDo = 'Tự Động Sửa Được';
    }

    if (cacLoiPhatHien.length > 0) {
      danhSachLoi.push([
        soDong,
        maGD || '[Trống]',
        tenKH,
        sdtGoc,
        kenhBan,
        doanhThu,
        mucDo,
        cacLoiPhatHien.join('; ')
      ]);
    }
  }

  var logSheet = ss.getSheetByName('Bao_Cao_Loi') || ss.insertSheet('Bao_Cao_Loi', 1);
  logSheet.clear();

  logSheet.getRange('A1:H1').merge()
    .setValue('BẢNG BÁO CÁO KIỂM TRA LỖI DỮ LIỆU')
    .setBackground('#1B365D').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(14)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  logSheet.setRowHeight(1, 40);

  var dongHopLe = rows.length - (countRong + countTrung + countDoanhThuLoi);
  var textThongKe = 'Tổng số dòng kiểm tra: ' + rows.length +
    ' | Dòng đạt chuẩn: ' + dongHopLe +
    ' | Mã bị trống: ' + countRong +
    ' | Mã bị trùng: ' + countTrung +
    ' | Doanh thu không hợp lệ: ' + countDoanhThuLoi +
    ' | Số điện thoại cần sửa: ' + countSdtLoi +
    ' | Họ tên cần viết hoa lại: ' + countTenThuaKhoangTrang;
  logSheet.getRange('A2:H2').merge().setValue(textThongKe)
    .setFontColor('#64748b').setFontSize(10).setFontStyle('italic')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');

  var headers = ['Dòng Lỗi', 'Mã Giao Dịch', 'Tên Khách Hàng', 'Số Điện Thoại', 'Kênh Bán', 'Doanh Thu', 'Phân Loại Lỗi', 'Chi Tiết Lỗi Cụ Thể'];
  logSheet.getRange(4, 1, 1, headers.length).setValues([headers])
    .setBackground('#005A9C').setFontColor('#FFFFFF').setFontWeight('bold');
  logSheet.setRowHeight(4, 28);

  if (danhSachLoi.length > 0) {
    logSheet.getRange(5, 1, danhSachLoi.length, headers.length).setValues(danhSachLoi);
    logSheet.getRange(5, 6, danhSachLoi.length, 1).setNumberFormat('#,##0');
    logSheet.autoResizeColumns(1, headers.length);
  }

  ss.setActiveSheet(logSheet);
  SpreadsheetApp.getUi().alert('Hoàn tất kiểm tra dữ liệu!\n\nĐã tìm thấy ' + danhSachLoi.length + ' dòng dữ liệu có vấn đề. Bạn hãy xem chi tiết tại sheet "Bao_Cao_Loi".');
}
