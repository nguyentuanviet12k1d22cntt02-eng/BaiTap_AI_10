COURSE_DATA.push(
{
    id: "bt5",
    index: 5,
    title: "Bài 5: Tự Động Kiểm Tra Và Làm Sạch Hơn 1.000 Dòng Dữ Liệu Siêu Tốc (Dưới 2 Giây)",
    shortTitle: "Làm Sạch Dữ Liệu Siêu Tốc",
    subtitle: "Tự Động Xóa Đơn Trùng, Sửa Số Điện Thoại, Viết Hoa Họ Tên Và Tách Sheet",
    level: "Dành Cho Dân Văn Phòng",
    time: "25 phút",
    tags: ["Làm sạch dữ liệu", "Xử lý siêu tốc", "Xóa đơn trùng", "Sửa số điện thoại", "Viết hoa họ tên", "Tách sheet tự động", "Báo cáo tổng quan", "Hẹn giờ tự động"],
    csvFile: "bai_tap_5_raw_data_1000_rows.xlsx",
    scriptFile: "BaiTap5_LamSachDuLieuLon_Optimization.gs",
    scriptContent: `/**
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
  var msg = "QUY TRÌNH LÀM SẠCH DỮ LIỆU CHO DÂN VĂN PHÒNG:\\n\\n" +
    "Bước 1: Bấm '2. Kiểm Tra Dữ Liệu' để quét và xem danh sách lỗi ở sheet 'Bao_Cao_Loi'.\\n" +
    "Bước 2: Bấm '3. Chạy Làm Sạch Dữ Liệu' để hệ thống tự động xóa trùng, sửa tên, sửa số điện thoại và lưu sang sheet 'DataCleaned_BT5' trong 2 giây.\\n" +
    "Bước 3: Bấm '4. Tách Dữ Liệu Theo Kênh Bán' để tự động chia đơn về các sheet Shopee, Lazada, TikTok Shop, Website.\\n" +
    "Bước 4: Bấm '1. Xem Báo Cáo Tổng Quan' để xem các con số thống kê và biểu đồ.\\n" +
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
    SpreadsheetApp.getUi().alert('Thông báo: Không tìm thấy sheet nguồn \"RawData_BT5\"!');
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
    var sdtLocKyTu = sdtGoc.replace(/[\\.\\s-]/g, '');
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

    if (sdtGoc.match(/[\\.\\s-]/) || (sdtLocKyTu.length === 9 && !sdtLocKyTu.startsWith('0'))) {
      cacLoiPhatHien.push('Số điện thoại có ký tự lạ hoặc mất số 0 đầu (' + sdtGoc + ')');
      countSdtLoi++;
      if (mucDo === 'Hợp Lệ') mucDo = 'Tự Động Sửa Được';
    }

    if (String(rows[i][1] || '').match(/\\s{2,}/) || tenKH !== chuanHoaTenTiengViet(tenKH)) {
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
  SpreadsheetApp.getUi().alert('Hoàn tất kiểm tra dữ liệu!\\n\\nĐã tìm thấy ' + danhSachLoi.length + ' dòng dữ liệu có vấn đề. Bạn hãy xem chi tiết tại sheet \"Bao_Cao_Loi\".');
}

// ==============================================================================
// 3. FILE 3_XuLy_LamSach.gs
// ==============================================================================
function chayLamSachDuLieuNhanh() {
  var thoiGianBatDau = new Date().getTime();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var rawSheet = ss.getSheetByName('RawData_BT5');
  if (!rawSheet) {
    SpreadsheetApp.getUi().alert('Thông báo: Không tìm thấy sheet nguồn \"RawData_BT5\"!');
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
    var sdt = String(rows[i][2] || '').trim().replace(/[\\.\\s-]/g, '');
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

  var thongBao = 'ĐÃ LÀM SẠCH XONG TRONG ' + giayXuLy + ' GIÂY!\\n' +
    '-----------------------------------------\\n' +
    'Dữ liệu ban đầu: ' + rows.length + ' dòng\\n' +
    'Dữ liệu sạch thu được: ' + duLieuSach.length + ' dòng\\n' +
    'Số dòng đã loại bỏ: ' + (rows.length - duLieuSach.length) + '\\n' +
    '   - Bị trùng mã đơn: ' + countTrung + '\\n' +
    '   - Doanh thu nhỏ hơn hoặc bằng 0: ' + countDoanhThuLoi + '\\n' +
    '   - Mã đơn để trống: ' + countRong + '\\n' +
    'Số điện thoại đã tự thêm số 0: ' + countSdtSua;

  SpreadsheetApp.getUi().alert(thongBao);
}

function chuanHoaTenTiengViet(chuoi) {
  if (!chuoi) return '';
  return chuoi.toLowerCase().split(/\\s+/).filter(Boolean).map(function(tu) {
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
    SpreadsheetApp.getUi().alert('Vui lòng bấm mục \"3. Chạy Làm Sạch Dữ Liệu\" trước để có dữ liệu sạch!');
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
    var tenSheet = 'San_' + tenKenh.replace(/[\\/\\?\\*\\[\\]:]/g, '_');
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

  SpreadsheetApp.getUi().alert('ĐÃ TÁCH XONG DỮ LIỆU THEO TỪNG KÊNH BÁN HÀNG:\\n\\n' + danhSachKetQua.join('\\n'));
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
    dashSheet.getRange(the.o.split(':')[0]).setValue(the.ten + '\\n\\n' + the.giaTri)
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
    calcSheet.getRange('B' + r).setFormula('=SUMIFS(DataCleaned_BT5!E4:E; DataCleaned_BT5!D4:D; \"' + danhSachKenh[c] + '\")');
  }

  calcSheet.getRange('D1:E1').setValues([['Loại Lỗi', 'Số Lượng']]);
  var danhSachLoiThongKe = [
    ['Mã Đơn Bị Trùng', '=COUNTIF(Bao_Cao_Loi!G5:G; \"*Trùng*\")'],
    ['Mã Đơn Bị Trống', '=COUNTIF(Bao_Cao_Loi!G5:G; \"*Trống*\")'],
    ['Doanh Thu Nhỏ Hơn 0', '=COUNTIF(Bao_Cao_Loi!G5:G; \"*Doanh thu*\")'],
    ['Số Điện Thoại Cần Sửa', '=COUNTIF(Bao_Cao_Loi!G5:G; \"*Số điện thoại*\")']
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

  SpreadsheetApp.getUi().alert('ĐÃ BẬT HẸN GIỜ TỰ ĐỘNG!\\n\\nHệ thống sẽ tự động làm sạch và cập nhật báo cáo vào lúc 23:30 mỗi đêm.');
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
`,
    
    workflow: [
      { icon: "ph-magnifying-glass", title: "1. Đọc Dữ Liệu Thô", desc: "AI đọc cấu trúc các cột và phát hiện lỗi có sẵn" },
      { icon: "ph-list-checks", title: "2. Báo Cáo Lỗi", desc: "Tạo menu và xuất danh sách các dòng bị lỗi để kiểm tra" },
      { icon: "ph-lightning", title: "3. Làm Sạch Siêu Tốc", desc: "Xử lý hàng loạt trong 2 giây, xóa trùng, sửa tên và số điện thoại" },
      { icon: "ph-folder-notch-open", title: "4. Tách Sheet Theo Sàn", desc: "Tự động phân bổ dữ liệu về các tab Shopee, Lazada, TikTok, Web" },
      { icon: "ph-chart-pie-slice", title: "5. Báo Cáo & Hẹn Giờ", desc: "Hiển thị 4 thẻ thống kê, biểu đồ và hẹn giờ chạy đêm 23:30" }
    ],

    masterPrompt: `[TIÊU CHUẨN KỸ THUẬT]: Hãy áp dụng toàn bộ quy tắc trong file "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

Bạn là chuyên gia Google Sheets. Tôi có sheet "RawData_BT5" chứa hơn 1.000 dòng đơn hàng từ dòng 4 (gồm Mã Giao Dịch, Tên Khách Hàng, Số Điện Thoại, Kênh Bán, Doanh Thu, Ngày Tạo).

Hãy viết trọn bộ mã Google Apps Script tự động hóa làm sạch dữ liệu:
1. Tạo thanh menu "Làm Sạch Dữ Liệu" trên bảng tính để dễ bấm thao tác.
2. Kiểm tra dữ liệu và xuất danh sách các dòng bị lỗi sang sheet "Bao_Cao_Loi" để xem trước (mã để trống, mã trùng, số điện thoại sai, tên thừa khoảng trắng, doanh thu âm).
3. Làm sạch dữ liệu siêu tốc sang sheet "DataCleaned_BT5" trong dưới 2 giây: xóa đơn trùng, xóa mã trống, lọc doanh thu âm, viết hoa chữ cái đầu cho họ tên và tự thêm số 0 cho số điện thoại.
4. Tự động tách đơn hàng ra các sheet riêng theo kênh bán (Shopee, Lazada, TikTok Shop, Website).
5. Tạo trang "Bao_Cao_Tong_Quan" hiển thị 4 con số thống kê và 2 biểu đồ.
6. Hẹn giờ tự động chạy làm sạch và cập nhật báo cáo lúc 23:30 mỗi đêm.

Yêu cầu: Viết theo từng file riêng biệt, xử lý thật nhanh không làm đơ bảng tính và không dùng biểu tượng cảm xúc.`,

    businessScenario: {
      story: "Bạn là nhân viên văn phòng, kế toán hoặc quản lý đơn hàng. Mỗi ngày bạn nhận được file danh sách hơn 1.000 đơn hàng đổ về từ các sàn Shopee, Lazada, TikTok Shop và Website tại sheet RawData_BT5 với rất nhiều lỗi lộn xộn.",
      pain: "Mã đơn hàng bị để trống hoặc bị trùng lặp do khách bấm mua nhiều lần, số điện thoại bị dính dấu chấm hoặc mất số 0 ở đầu (ví dụ: 988123456), họ tên viết hoa thường tùy tiện, doanh thu có dòng bị âm. Ngồi lọc và sửa tay từng ô mất cả buổi chiều và rất dễ làm sai lệch dữ liệu gốc.",
      solution: "Sử dụng quy trình tự động chia nhỏ từng bước: (1) Kiểm tra và xuất danh sách lỗi ra sheet riêng để xem trước, (2) Xử lý làm sạch toàn bộ hơn 1.000 dòng trong dưới 2 giây ra sheet dữ liệu sạch, (3) Tách tự động về các sheet từng sàn và (4) Tự động tổng hợp con số báo cáo."
    },

    promptBreakdown: [
      { tag: "1. XỬ LÝ SIÊU TỐC", title: "Xử lý hàng loạt trong 2 giây", desc: "Yêu cầu đọc và ghi dữ liệu đúng 1 lần để hệ thống chạy cực nhanh, không làm đơ giật bảng tính." },
      { tag: "2. BƯỚC KIỂM TRA AN TOÀN", title: "Xuất danh sách lỗi đối soát", desc: "Quét và lập danh sách lỗi ra sheet riêng trước, giữ nguyên vẹn dữ liệu gốc ban đầu để người dùng an tâm." },
      { tag: "3. TỰ ĐỘNG SỬA LỖI", title: "Xóa trùng, sửa tên và số điện thoại", desc: "Tự động xóa đơn bị trùng mã, thêm số 0 cho số điện thoại thiếu số và viết hoa chữ cái đầu cho họ tên." },
      { tag: "4. TÁCH DỮ LIỆU TỰ ĐỘNG", title: "Chia đơn về từng kênh bán", desc: "Tự động tạo các sheet Shopee, Lazada, TikTok Shop, Website giúp phân chia công việc cho từng người phụ trách." },
      { tag: "5. BÁO CÁO VÀ HẸN GIỜ", title: "Thống kê con số và tự động hóa", desc: "Tự động tính tỷ lệ dữ liệu đạt chuẩn %, vẽ biểu đồ và hẹn giờ tự chạy lúc 23:30 mỗi đêm." }
    ],

    businessRequirements: `
      <p><b>Bài toán thực tế:</b> Xây dựng ứng dụng kiểm tra chất lượng và làm sạch dữ liệu lớn bán hàng đa kênh, áp dụng mô hình 1 Bước = 1 File Độc Lập dễ hiểu cho người làm văn phòng:</p>
      <ul>
        <li><b>Mô hình 1 Bước = 1 File Độc Lập:</b> Học viên làm đến đâu thấy ngay kết quả đến đó, không sợ chắp vá code hay phát sinh lỗi khó sửa.</li>
        <li><b>Bước Kiểm Tra An Toàn (Sheet Bao_Cao_Loi):</b> Quét dữ liệu thô và xuất danh sách lỗi chi tiết ra sheet <code>Bao_Cao_Loi</code> để đối soát trước khi làm sạch.</li>
        <li><b>Xử Lý Làm Sạch Siêu Tốc Dưới 2 Giây:</b> Tự động xóa trùng lặp, chuẩn hóa họ tên và thêm số 0 cho số điện thoại, ghi sang sheet <code>DataCleaned_BT5</code>.</li>
        <li><b>Tự Động Tách Sheet Theo Kênh Bán:</b> Tự tạo các sheet <code>San_Shopee</code>, <code>San_Lazada</code>, <code>San_TikTok Shop</code>, <code>San_Website</code>.</li>
        <li><b>Báo Cáo Tổng Quan:</b> 4 thẻ chỉ số thống kê (Tổng Dòng Ban Đầu, Dữ Liệu Sạch Hợp Lệ, Số Bản Ghi Đã Loại, Tỷ Lệ Đạt Chuẩn %) và 2 Biểu đồ cơ cấu doanh thu.</li>
        <li><b>Hẹn Giờ Chạy Tự Động:</b> Tự động chạy làm sạch và cập nhật báo cáo lúc 23:30 mỗi đêm.</li>
      </ul>
    `,

    tableHeaders: ["Mã Giao Dịch", "Tên Khách Hàng", "Số Điện Thoại", "Kênh Bán", "Doanh Thu", "Ngày Tạo", "Trạng Thái Lỗi Trong Dữ Liệu Ban Đầu"],
    tableRows: [
      ["TRX-2026-00001", "   nguyễn văn an  ", "988123456", "Shopee", "1,250,000", "01/08/2026", "<span style='color: #b45309;'>[Cần sửa] Thừa khoảng trắng, mất số 0 đầu</span>"],
      ["TRX-2026-00002", "TRẦN THỊ BÍCH", "0903.987.654", "Lazada", "850,000", "01/08/2026", "<span style='color: #b45309;'>[Cần sửa] Số điện thoại có dấu chấm</span>"],
      ["", "Lê Hoàng Long", "0912345678", "TikTok Shop", "450,000", "02/08/2026", "<span style='color: #dc2626;'>[Loại bỏ] Mã đơn bị để trống</span>"],
      ["TRX-2026-00001", "Nguyễn Văn An", "0988123456", "Shopee", "1,250,000", "01/08/2026", "<span style='color: #dc2626;'>[Loại bỏ] Bị trùng lặp mã đơn</span>"],
      ["TRX-2026-00005", "Phạm Thị Dung", "0977889900", "Website", "-150,000", "03/08/2026", "<span style='color: #dc2626;'>[Loại bỏ] Doanh thu nhỏ hơn hoặc bằng 0</span>"]
    ],

    steps: [
      {
        badge: "00",
        title: "Bước 0: AI Đọc Và Nắm Rõ Cấu Trúc Bảng Dữ Liệu Thô",
        desc: "Gửi link Google Sheets để AI tự đọc cấu trúc 6 cột dữ liệu và nhận diện các dạng lỗi có sẵn trước khi viết code.",
        promptBox: `Link Google Sheets: [Dán link bảng tính của bạn vào đây]

Tôi có bảng dữ liệu đơn hàng ở sheet "RawData_BT5" (dữ liệu từ dòng 4 trở đi).
Bạn hãy đọc sheet này và chỉ ra cho tôi các cột dữ liệu cùng các lỗi sai phổ biến đang có trong bảng (như mã bị trống, mã bị trùng, số điện thoại sai định dạng, họ tên thừa khoảng trắng, doanh thu âm).
Chưa cần viết code ở bước này.`
      },
      {
        badge: "01",
        title: "Bước 1: Tạo File 1_Menu_LamSach.gs (Tạo Menu Tiện Ích Trên Bảng Tính)",
        desc: "Thao tác: Đính kèm file QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md ➔ Mở Tiện ích mở rộng ➔ Apps Script ➔ Bấm dấu (+) chọn Script ➔ Đặt tên file là 1_Menu_LamSach.gs ➔ Dán mã AI sinh ra vào.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Hãy áp dụng toàn bộ quy tắc trong file "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

Hãy viết mã cho file "1_Menu_LamSach.gs" để tạo một thanh menu tên "Làm Sạch Dữ Liệu" trên Google Sheets gồm các mục:
1. 1. Xem Báo Cáo Tổng Quan
2. 2. Kiểm Tra Dữ Liệu (Xuất Sheet Báo Cáo Lỗi)
3. 3. Chạy Làm Sạch Dữ Liệu (Dưới 2 Giây)
4. 4. Tách Dữ Liệu Theo Kênh Bán Hàng
5. 5. Tùy Chọn Quy Tắc Làm Sạch (mở file BangTuyChon.html)
6. 6. Bật Tự Động Chạy Hàng Đêm (23:30)
7. 7. Tắt Tự Động Chạy Hàng Đêm
8. 8. Hướng Dẫn Sử Dụng
Lưu ý: Không dùng biểu tượng cảm xúc trong menu và thông báo.`
      },
      {
        badge: "02",
        title: "Bước 2: Tạo File 2_KiemTra_BaoCaoLoi.gs (Kiểm Tra Và Lập Danh Sách Lỗi)",
        desc: "Thao tác: Đính kèm file QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md ➔ Bấm dấu (+) chọn Script ➔ Đặt tên file là 2_KiemTra_BaoCaoLoi.gs ➔ Dán mã quét kiểm tra an toàn xuất ra sheet Bao_Cao_Loi.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Hãy áp dụng toàn bộ quy tắc trong file "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

Hãy viết mã cho file "2_KiemTra_BaoCaoLoi.gs":
Quét toàn bộ dữ liệu ở sheet "RawData_BT5" (từ dòng 4 trở đi) và xuất danh sách các dòng bị lỗi sang sheet mới tên "Bao_Cao_Loi" để tôi đối soát:
- Tìm các lỗi: mã đơn bị để trống, mã đơn bị trùng lặp, doanh thu nhỏ hơn hoặc bằng 0, số điện thoại có dấu chấm hoặc mất số 0 đầu, họ tên viết hoa lộn xộn hoặc thừa khoảng trắng.
- Liệt kê rõ: Dòng lỗi, Mã giao dịch, Tên khách hàng, Số điện thoại, Kênh bán, Doanh thu, Phân loại lỗi và Chi tiết lỗi.
- Có một dòng tóm tắt số lượng lỗi ở đầu sheet.
- Giữ nguyên dữ liệu gốc không chỉnh sửa và không dùng biểu tượng cảm xúc.`
      },
      {
        badge: "03",
        title: "Bước 3: Tạo File 3_XuLy_LamSach.gs (Làm Sạch Dữ Liệu Siêu Tốc Dưới 2 Giây)",
        desc: "Thao tác: Đính kèm file QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md ➔ Bấm dấu (+) chọn Script ➔ Đặt tên file là 3_XuLy_LamSach.gs ➔ Dán mã xử lý làm sạch dữ liệu trong 2 giây ra sheet DataCleaned_BT5.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Hãy áp dụng toàn bộ quy tắc trong file "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

Hãy viết mã cho file "3_XuLy_LamSach.gs":
Tự động làm sạch toàn bộ dữ liệu từ sheet "RawData_BT5" và lưu kết quả sang sheet mới tên "DataCleaned_BT5":
- Xóa bỏ các dòng có mã đơn để trống, mã đơn bị trùng lặp hoặc doanh thu nhỏ hơn hay bằng 0.
- Sửa họ tên: viết hoa chữ cái đầu của mỗi từ và xóa các khoảng trắng thừa.
- Sửa số điện thoại: bỏ các dấu chấm, khoảng trắng thừa và tự thêm số 0 vào đầu nếu bị thiếu.
- Yêu cầu xử lý thật nhanh trong dưới 2 giây để không làm đơ bảng tính.
- Báo cáo số dòng ban đầu, số dòng sạch thu được và số dòng đã lọc bỏ. Không dùng biểu tượng cảm xúc.`
      },
      {
        badge: "04",
        title: "Bước 4: Tạo File 4_TachSheet_KenhBan.gs (Tự Động Tách Sheet Theo Từng Kênh Bán)",
        desc: "Thao tác: Đính kèm file QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md ➔ Bấm dấu (+) chọn Script ➔ Đặt tên file là 4_TachSheet_KenhBan.gs ➔ Dán mã tự động chia tách dữ liệu sạch thành các sheet từng sàn.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Hãy áp dụng toàn bộ quy tắc trong file "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

Hãy viết mã cho file "4_TachSheet_KenhBan.gs":
Đọc dữ liệu từ sheet "DataCleaned_BT5" và tự động tách các đơn hàng ra từng sheet riêng theo cột Kênh Bán (gồm Shopee, Lazada, TikTok Shop, Website). Mỗi sheet có màu tiêu đề riêng để phân biệt và không dùng biểu tượng cảm xúc.`
      },
      {
        badge: "05",
        title: "Bước 5: Tạo File 5_BaoCao_TongQuan.gs (Tạo Trang Báo Cáo Và Biểu Đồ Thống Kê)",
        desc: "Thao tác: Đính kèm file QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md ➔ Bấm dấu (+) chọn Script ➔ Đặt tên file là 5_BaoCao_TongQuan.gs ➔ Dán mã tạo 4 thẻ con số tổng quan và 2 biểu đồ thống kê.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Hãy áp dụng toàn bộ quy tắc trong file "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

Hãy viết mã cho file "5_BaoCao_TongQuan.gs":
Tạo trang "Bao_Cao_Tong_Quan" ở đầu bảng tính:
- Hiển thị 4 ô số liệu lớn: Tổng dòng ban đầu, Dữ liệu sạch hợp lệ, Số dòng đã loại bỏ, Tỷ lệ dữ liệu đạt chuẩn (%).
- Vẽ 2 biểu đồ: một biểu đồ tròn thể hiện cơ cấu doanh thu theo kênh bán và một biểu đồ cột phân loại các dạng lỗi tìm thấy.
Không dùng biểu tượng cảm xúc trong tiêu đề hoặc biểu đồ.`
      },
      {
        badge: "06",
        title: "Bước 6: Tạo File 6_HenGio_TuDong.gs (Hẹn Giờ Tự Động Chạy Lúc 23:30 Mỗi Đêm)",
        desc: "Thao tác: Đính kèm file QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md ➔ Bấm dấu (+) chọn Script ➔ Đặt tên file là 6_HenGio_TuDong.gs ➔ Dán mã cài đặt hẹn giờ tự động hàng đêm.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Hãy áp dụng toàn bộ quy tắc trong file "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

Hãy viết mã cho file "6_HenGio_TuDong.gs":
Cài đặt tính năng tự động chạy làm sạch dữ liệu, tách sheet và cập nhật báo cáo vào lúc 23:30 mỗi đêm mà tôi không cần phải mở máy tính. Có cả hàm để tắt hẹn giờ khi cần.`
      },
      {
        badge: "07",
        title: "Bước 7: Tạo File BangTuyChon.html (Cửa Sổ Tùy Chọn Quy Tắc Làm Sạch)",
        desc: "Thao tác: Đính kèm file QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md ➔ Bấm dấu (+) chọn HTML ➔ Đặt tên file là BangTuyChon.html ➔ Dán mã giao diện cửa sổ tùy chọn sạch sẽ, dễ nhìn.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Hãy áp dụng toàn bộ quy tắc trong file "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

Hãy tạo file giao diện "BangTuyChon.html":
Hiển thị một cửa sổ popup đơn giản, có các ô tích chọn để tôi có thể bật hoặc tắt:
1. Xóa mã đơn trùng lặp
2. Tự động sửa số điện thoại
3. Viết hoa chữ cái đầu cho họ tên
4. Loại bỏ đơn có doanh thu nhỏ hơn hoặc bằng 0
5. Tự động tách sheet theo kênh bán
Phía dưới có nút bấm "Bắt Đầu Xử Lý Làm Sạch Dữ Liệu (Dưới 2 Giây)". Thiết kế trang nhã, dễ nhìn và không dùng biểu tượng cảm xúc rườm rà.`
      }
    ],

    triggerGuide: `
      <h3 class="section-title"><i class="ph-bold ph-clock"></i> Hẹn Giờ Tự Động Chạy Hàng Đêm Lúc 23:30</h3>
      <p style="color: var(--text-secondary); line-height: 1.7;">
        Khi bạn bấm chọn <b>"6. Bật Tự Động Chạy Hàng Đêm (23:30)"</b> trên menu bảng tính, Google Sheets sẽ tự động kích hoạt tính năng hẹn giờ chạy ngầm. Cứ đúng 23:30 mỗi đêm, máy sẽ tự động gom toàn bộ đơn hàng phát sinh trong ngày, tự động xóa trùng, sửa tên, sửa số điện thoại, chia về từng sàn và cập nhật con số báo cáo. Sáng hôm sau khi bạn đến văn phòng lúc 08:00, mọi bảng số liệu đã tinh tươm sẵn sàng để gửi sếp mà bạn không cần phải làm thủ công một thao tác nào!
      </p>
    `,

    checklist: [
      "Bảng tính có sheet 'RawData_BT5' chứa hơn 1.000 dòng log đơn hàng bắt đầu từ dòng 4.",
      "Đã tạo đủ 7 file độc lập trong trình soạn thảo Apps Script: 1_Menu_LamSach.gs, 2_KiemTra_BaoCaoLoi.gs, 3_XuLy_LamSach.gs, 4_TachSheet_KenhBan.gs, 5_BaoCao_TongQuan.gs, 6_HenGio_TuDong.gs, BangTuyChon.html.",
      "Menu 'Làm Sạch Dữ Liệu' xuất hiện trên thanh công cụ sau khi mở lại bảng tính.",
      "Bấm mục '2. Kiểm Tra Dữ Liệu' tạo thành công sheet 'Bao_Cao_Loi' liệt kê danh sách các dòng lỗi chi tiết.",
      "Bấm mục '3. Chạy Làm Sạch Dữ Liệu' tạo sheet 'DataCleaned_BT5' trong dưới 2 giây, không còn đơn trùng, số điện thoại có đủ 10 số có số 0 đầu, họ tên viết hoa chuẩn.",
      "Bấm mục '4. Tách Dữ Liệu Theo Kênh Bán Hàng' tự động sinh 4 sheet San_Shopee, San_Lazada, San_TikTok Shop, San_Website.",
      "Trang 'Bao_Cao_Tong_Quan' hiển thị đúng 4 thẻ con số thống kê cùng 2 biểu đồ tròn và cột không bị lỗi.",
      "Bật thành công hẹn giờ tự động chạy lúc 23:30 mỗi đêm."
    ]
  }
);
