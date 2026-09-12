/**
 * FILE: 6_Trigger_NightlyClean.gs
 * Chức năng: Cài đặt Trigger chạy ngầm tự động quét và làm sạch dữ liệu mỗi đêm
 */
function caiDatTriggerLamSachHangDem() {
  huyTriggerLamSach(); // Xóa trigger cũ nếu có
  ScriptApp.newTrigger('chayTuDongLamSachVaBaoCao')
    .timeBased()
    .everyDays(1)
    .atHour(23)
    .nearMinute(30)
    .create();

  SpreadsheetApp.getUi().alert('⏰ ĐÃ BẬT TỰ ĐỘNG HÓA HÀNG ĐÊM!\n\nHệ thống sẽ tự động quét, làm sạch và cập nhật Dashboard vào lúc 23:30 mỗi đêm.');
}

function huyTriggerLamSach() {
  var triggers = ScriptApp.getProjectTriggers();
  var count = 0;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'chayTuDongLamSachVaBaoCao') {
      ScriptApp.deleteTrigger(triggers[i]);
      count++;
    }
  }
  if (count > 0) {
    SpreadsheetApp.getUi().alert('🛑 Đã hủy toàn bộ lịch tự động hóa làm sạch dữ liệu.');
  }
}

function chayTuDongLamSachVaBaoCao() {
  chayLamSachDuLieuInRam();
  tachDuLieuTheoKenhBan();
  khoiTaoDashboardDataQuality();
}
