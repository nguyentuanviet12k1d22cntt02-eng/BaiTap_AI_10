/**
 * BÀI TẬP 5: TỰ ĐỘNG KIỂM TRA VÀ LÀM SẠCH DỮ LIỆU LỚN SIÊU TỐC
 * 
 * Kiến trúc dự án tách từng file độc lập (1 Bước = 1 File):
 * 1. 1_Menu_LamSach.gs       (Tạo menu điều khiển tiện ích trên bảng tính)
 * 2. 2_KiemTra_BaoCaoLoi.gs   (Kiểm tra dữ liệu thô và xuất danh sách lỗi ra sheet Bao_Cao_Loi)
 * 3. 3_XuLy_LamSach.gs       (Xử lý làm sạch dữ liệu siêu tốc dưới 2 giây ra sheet DataCleaned_BT5)
 * 4. 4_TachSheet_KenhBan.gs   (Tự động tách dữ liệu thành các sheet theo từng kênh bán hàng)
 * 5. 5_BaoCao_TongQuan.gs     (Tạo trang báo cáo tổng quan và biểu đồ thống kê)
 * 6. 6_HenGio_TuDong.gs      (Hẹn giờ tự động chạy làm sạch lúc 23:30 mỗi đêm)
 * 7. BangTuyChon.html         (Cửa sổ tùy chọn các quy tắc làm sạch dữ liệu)
 */

// ==============================================================================
// 1. FILE 1_Menu_LamSach.gs
// ==============================================================================
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Làm Sạch Dữ Liệu')
    .addItem('1. Xem Báo Cáo Tổng Quan', 'khoiTaoBaoCaoTongQuan')
    .addSeparator()
    .addItem('2. Kiểm Tra Dữ Liệu (Xuất Sheet Báo Cáo Lỗi)', 'chayKiemTraBaoCaoLoi')
    .addItem('3. Chạy Làm Sạch Dữ Liệu (Dưới 2 Giây)', 'chayLamSachDuLieuNhanh')
    .addItem('4. Tách Dữ Liệu Theo Kênh Bán Hàng', 'tachDuLieuTheoKenhBan')
    .addSeparator()
    .addItem('5. Tùy Chọn Quy Tắc Làm Sạch', 'moCuaSoTuyChon')
    .addSeparator()
    .addItem('6. Bật Tự Động Chạy Hàng Đêm (23:30)', 'caiDatHenGioHangDem')
    .addItem('7. Tắt Tự Động Chạy Hàng Đêm', 'huyHenGioHangDem')
    .addSeparator()
    .addItem('8. Hướng Dẫn Sử Dụng', 'hienThiHuongDan')
    .addToUi();
}

function moCuaSoTuyChon() {
  var html = HtmlService.createTemplateFromFile('BangTuyChon')
    .evaluate()
    .setWidth(680)
    .setHeight(540)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  SpreadsheetApp.getUi().showModalDialog(html, 'Tùy Chọn Quy Tắc Làm Sạch Dữ Liệu');
}

function hienThiHuongDan() {
  var msg = "QUY TRÌNH LÀM SẠCH DỮ LIỆU CHO DÂN VĂN PHÒNG:\n\n" +
    "Bước 1: Bấm '2. Kiểm Tra Dữ Liệu' để quét và xem danh sách lỗi ở sheet 'Bao_Cao_Loi'.\n" +
    "Bước 2: Bấm '3. Chạy Làm Sạch Dữ Liệu' để hệ thống tự động xóa trùng, sửa tên, sửa số điện thoại và lưu sang sheet 'DataCleaned_BT5' trong 2 giây.\n" +
    "Bước 3: Bấm '4. Tách Dữ Liệu Theo Kênh Bán' để tự động chia đơn về các sheet Shopee, Lazada, TikTok Shop, Website.\n" +
    "Bước 4: Bấm '1. Xem Báo Cáo Tổng Quan' để xem các con số thống kê và biểu đồ.\n" +
    "Bước 5: Bấm '6. Bật Tự Động Chạy' để máy tự làm việc lúc 23:30 mỗi đêm.";
  SpreadsheetApp.getUi().alert('Hướng Dẫn Sử Dụng', msg, SpreadsheetApp.getUi().ButtonSet.OK);
}

// ==============================================================================
// 2. FILE 2_KiemTra_BaoCaoLoi.gs
// ==============================================================================
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

// ==============================================================================
// 3. FILE 3_XuLy_LamSach.gs
// ==============================================================================
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

// ==============================================================================
// 4. FILE 4_TachSheet_KenhBan.gs
// ==============================================================================
function tachDuLieuTheoKenhBan() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cleanSheet = ss.getSheetByName('DataCleaned_BT5');
  if (!cleanSheet) {
    SpreadsheetApp.getUi().alert('Vui lòng bấm mục "3. Chạy Làm Sạch Dữ Liệu" trước để có dữ liệu sạch!');
    return;
  }

  var data = cleanSheet.getDataRange().getValues();
  if (data.length < 4) return;

  var headers = data[2];
  var rows = data.slice(3);

  var nhomKenhBan = {};
  for (var i = 0; i < rows.length; i++) {
    var kenh = String(rows[i][3] || 'Khác').trim();
    if (!nhomKenhBan[kenh]) {
      nhomKenhBan[kenh] = [];
    }
    nhomKenhBan[kenh].push(rows[i]);
  }

  var mauSacKenh = {
    'Shopee': '#EE4D2D',
    'Lazada': '#0f146d',
    'TikTok Shop': '#1e293b',
    'Website': '#2563eb'
  };

  var danhSachKetQua = [];

  for (var tenKenh in nhomKenhBan) {
    var tenSheet = 'San_' + tenKenh.replace(/[\/\?\*\[\]:]/g, '_');
    var chSheet = ss.getSheetByName(tenSheet) || ss.insertSheet(tenSheet);
    chSheet.clear();

    var cacDongCuaKenh = nhomKenhBan[tenKenh];
    var mauChuDao = mauSacKenh[tenKenh] || '#1B365D';

    chSheet.getRange('A1:G1').merge()
      .setValue('DANH SÁCH ĐƠN HÀNG: ' + tenKenh.toUpperCase())
      .setBackground(mauChuDao).setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(13)
      .setHorizontalAlignment('center').setVerticalAlignment('middle');
    chSheet.setRowHeight(1, 35);

    chSheet.getRange(3, 1, 1, headers.length).setValues([headers])
      .setBackground('#334155').setFontColor('#FFFFFF').setFontWeight('bold');
    chSheet.setRowHeight(3, 26);

    chSheet.getRange(4, 1, cacDongCuaKenh.length, headers.length).setValues(cacDongCuaKenh);
    chSheet.getRange(4, 5, cacDongCuaKenh.length, 1).setNumberFormat('#,##0');
    chSheet.getRange(4, 1, cacDongCuaKenh.length, 1).setHorizontalAlignment('center');
    chSheet.getRange(4, 3, cacDongCuaKenh.length, 1).setHorizontalAlignment('center');
    chSheet.getRange(4, 6, cacDongCuaKenh.length, 2).setHorizontalAlignment('center');
    chSheet.autoResizeColumns(1, headers.length);

    danhSachKetQua.push('- Sàn ' + tenKenh + ': ' + cacDongCuaKenh.length + ' đơn');
  }

  SpreadsheetApp.getUi().alert('ĐÃ TÁCH XONG DỮ LIỆU THEO TỪNG KÊNH BÁN HÀNG:\n\n' + danhSachKetQua.join('\n'));
}

// ==============================================================================
// 5. FILE 5_BaoCao_TongQuan.gs
// ==============================================================================
function khoiTaoBaoCaoTongQuan() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var rawSheet = ss.getSheetByName('RawData_BT5');
  var cleanSheet = ss.getSheetByName('DataCleaned_BT5');

  var tongDongTho = rawSheet ? Math.max(0, rawSheet.getLastRow() - 3) : 0;
  var tongDongSach = cleanSheet ? Math.max(0, cleanSheet.getLastRow() - 3) : 0;
  var soDongDaLoai = Math.max(0, tongDongTho - tongDongSach);
  var tyLeSach = tongDongTho > 0 ? ((tongDongSach / tongDongTho) * 100).toFixed(1) : 0;

  var tenSheetBaoCao = 'Bao_Cao_Tong_Quan';
  var dashSheet = ss.getSheetByName(tenSheetBaoCao) || ss.insertSheet(tenSheetBaoCao, 0);
  ss.setActiveSheet(dashSheet);
  ss.moveActiveSheet(1);
  dashSheet.clear();
  dashSheet.getCharts().forEach(function(c) { dashSheet.removeChart(c); });

  dashSheet.getRange('A1:H1').merge()
    .setValue('BÁO CÁO TỔNG QUAN CHẤT LƯỢNG DỮ LIỆU VÀ DOANH THU ĐƠN HÀNG')
    .setFontSize(18).setFontWeight('bold').setFontColor('#FFFFFF').setBackground('#1B365D')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  dashSheet.setRowHeight(1, 50);

  var ngayGio = Utilities.formatDate(new Date(), 'GMT+7', 'dd/MM/yyyy HH:mm:ss');
  dashSheet.getRange('A3:H3').merge()
    .setValue('Thời gian cập nhật gần nhất: ' + ngayGio)
    .setFontColor('#64748b').setFontSize(10).setFontStyle('italic')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');

  var danhSachThe = [
    { ten: 'TỔNG DÒNG BAN ĐẦU', giaTri: tongDongTho + ' dòng', mau: '#2563eb', o: 'A5:B7' },
    { ten: 'DỮ LIỆU SẠCH HỢP LỆ', giaTri: tongDongSach + ' dòng', mau: '#059669', o: 'C5:D7' },
    { ten: 'SỐ BẢN GHI ĐÃ LOẠI BỎ', giaTri: soDongDaLoai + ' dòng', mau: '#dc2626', o: 'E5:F7' },
    { ten: 'TỶ LỆ DỮ LIỆU ĐẠT CHUẨN', giaTri: tyLeSach + '%', mau: '#7c3aed', o: 'G5:H7' }
  ];

  danhSachThe.forEach(function(the) {
    var oRange = dashSheet.getRange(the.o);
    oRange.setBackground('#f8fafc');
    dashSheet.getRange(the.o.split(':')[0]).setValue(the.ten + '\n\n' + the.giaTri)
      .setFontColor(the.mau).setFontWeight('bold').setFontSize(13)
      .setHorizontalAlignment('center').setVerticalAlignment('middle');
  });

  var calcSheet = ss.getSheetByName('Bang_Phu_Thong_Ke') || ss.insertSheet('Bang_Phu_Thong_Ke');
  calcSheet.clear();

  calcSheet.getRange('A1:B1').setValues([['Kênh Bán', 'Tổng Doanh Thu']]);
  var danhSachKenh = ['Shopee', 'Lazada', 'TikTok Shop', 'Website'];
  for (var c = 0; c < danhSachKenh.length; c++) {
    var r = c + 2;
    calcSheet.getRange('A' + r).setValue(danhSachKenh[c]);
    calcSheet.getRange('B' + r).setFormula('=SUMIFS(DataCleaned_BT5!E4:E; DataCleaned_BT5!D4:D; "' + danhSachKenh[c] + '")');
  }

  calcSheet.getRange('D1:E1').setValues([['Loại Lỗi', 'Số Lượng']]);
  var danhSachLoiThongKe = [
    ['Mã Đơn Bị Trùng', '=COUNTIF(Bao_Cao_Loi!G5:G; "*Trùng*")'],
    ['Mã Đơn Bị Trống', '=COUNTIF(Bao_Cao_Loi!G5:G; "*Trống*")'],
    ['Doanh Thu Nhỏ Hơn 0', '=COUNTIF(Bao_Cao_Loi!G5:G; "*Doanh thu*")'],
    ['Số Điện Thoại Cần Sửa', '=COUNTIF(Bao_Cao_Loi!G5:G; "*Số điện thoại*")']
  ];
  for (var e = 0; e < danhSachLoiThongKe.length; e++) {
    var re = e + 2;
    calcSheet.getRange('D' + re).setValue(danhSachLoiThongKe[e][0]);
    calcSheet.getRange('E' + re).setFormula(danhSachLoiThongKe[e][1]);
  }

  SpreadsheetApp.flush();

  var bieuDoTron = dashSheet.newChart().asPieChart()
    .setTitle('CƠ CẤU DOANH THU THEO KÊNH BÁN')
    .addRange(calcSheet.getRange('A1:B5'))
    .setPosition(9, 1, 10, 10)
    .setOption('width', 490).setOption('height', 360)
    .setOption('is3D', true)
    .setNumHeaders(1)
    .build();
  dashSheet.insertChart(bieuDoTron);

  var bieuDoCot = dashSheet.newChart().asColumnChart()
    .setTitle('CÁC DẠNG LỖI TÌM THẤY TRONG DỮ LIỆU BAN ĐẦU')
    .addRange(calcSheet.getRange('D1:E5'))
    .setPosition(9, 5, 10, 10)
    .setOption('width', 560).setOption('height', 360)
    .setOption('colors', ['#dc2626'])
    .setNumHeaders(1)
    .build();
  dashSheet.insertChart(bieuDoCot);

  SpreadsheetApp.getUi().alert('Báo cáo tổng quan dữ liệu đã được tạo thành công!');
}

// ==============================================================================
// 6. FILE 6_HenGio_TuDong.gs
// ==============================================================================
function caiDatHenGioHangDem() {
  huyHenGioHangDem();
  ScriptApp.newTrigger('chayTuDongBanDem')
    .timeBased()
    .everyDays(1)
    .atHour(23)
    .nearMinute(30)
    .create();

  SpreadsheetApp.getUi().alert('ĐÃ BẬT HẸN GIỜ TỰ ĐỘNG!\n\nHệ thống sẽ tự động làm sạch và cập nhật báo cáo vào lúc 23:30 mỗi đêm.');
}

function huyHenGioHangDem() {
  var triggers = ScriptApp.getProjectTriggers();
  var daHuy = 0;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'chayTuDongBanDem') {
      ScriptApp.deleteTrigger(triggers[i]);
      daHuy++;
    }
  }
  if (daHuy > 0) {
    SpreadsheetApp.getUi().alert('Đã tắt chế độ hẹn giờ tự động.');
  }
}

function chayTuDongBanDem() {
  chayLamSachDuLieuNhanh();
  tachDuLieuTheoKenhBan();
  khoiTaoBaoCaoTongQuan();
}
