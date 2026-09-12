/**
 * FILE: 6_HenGio_TuDong.gs
 * Chức năng: Hẹn giờ tự động làm sạch và cập nhật báo cáo lúc 23:30 mỗi đêm
 */
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
