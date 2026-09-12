/**
 * FILE: 4_Split_ByChannel.gs
 * Chức năng: Tự động gom nhóm đơn hàng và chia về các trang tính riêng theo từng sàn bán hàng
 */
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
