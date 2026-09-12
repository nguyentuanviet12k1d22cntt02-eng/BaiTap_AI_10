/**
 * FILE: 4_TachSheet_KenhBan.gs
 * Chức năng: Tự động tách dữ liệu sạch theo từng kênh bán hàng
 */
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
