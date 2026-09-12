/**
 * FILE: 5_BaoCao_TongQuan.gs
 * Chức năng: Tạo trang báo cáo tổng quan và biểu đồ thống kê
 */
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
