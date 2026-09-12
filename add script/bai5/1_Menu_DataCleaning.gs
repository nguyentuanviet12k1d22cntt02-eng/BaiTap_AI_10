/**
 * FILE: 1_Menu_DataCleaning.gs
 * Chức năng: Tạo thanh Menu điều khiển trung tâm trên Google Sheets
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🧹 Làm Sạch Dữ Liệu')
    .addItem('📊 1. Dashboard Chất Lượng Dữ Liệu', 'khoiTaoDashboardDataQuality')
    .addSeparator()
    .addItem('🔍 2. Quét Kiểm Toán Lỗi (Ra Sheet Audit_Log)', 'chayKiemToanDuLieuAuditLog')
    .addItem('⚡ 3. Chạy Làm Sạch Dữ Liệu (< 2s)', 'chayLamSachDuLieuInRam')
    .addItem('📂 4. Tách Dữ Liệu Theo Kênh Bán Hàng', 'tachDuLieuTheoKenhBan')
    .addSeparator()
    .addItem('⚙️ 5. Cấu Hình Quy Tắc Lọc (Pop-up)', 'moFormCauHinhLoc')
    .addSeparator()
    .addItem('⏰ 6. Bật Tự Động Hóa (23:30 Hàng Đêm)', 'caiDatTriggerLamSachHangDem')
    .addItem('🛑 Tắt Tự Động Hóa Định Kỳ', 'huyTriggerLamSach')
    .addSeparator()
    .addItem('❓ Hướng Dẫn Sử Dụng', 'hienThiHuongDanDataCleaning')
    .addToUi();
}

function moFormCauHinhLoc() {
  var html = HtmlService.createTemplateFromFile('CleanConfigForm')
    .evaluate()
    .setWidth(680)
    .setHeight(560)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  SpreadsheetApp.getUi().showModalDialog(html, '⚙️ Cấu Hình Quy Tắc Làm Sạch Dữ Liệu');
}

function hienThiHuongDanDataCleaning() {
  var msg = "=== HỆ THỐNG LÀM SẠCH & KIỂM TOÁN DỮ LIỆU LỚN ===\n\n" +
    "1. 🔍 Quét Kiểm Toán Lỗi: Quét an toàn và xuất ra sheet 'Audit_Log' chi tiết từng lỗi.\n" +
    "2. ⚡ Chạy Làm Sạch: Xử lý 100% trên bộ nhớ RAM, xuất ra tab 'DataCleaned_BT5' dưới 2 giây.\n" +
    "3. 📂 Tách Kênh Bán: Tự động gom nhóm đơn hàng và chia về các sheet Shopee, Lazada, TikTok...\n" +
    "4. 📊 Dashboard: Xem 4 thẻ KPI chất lượng dữ liệu và biểu đồ tỷ trọng doanh thu.\n" +
    "5. ⏰ Tự Động Hóa: Cài trigger chạy ngầm lúc 23:30 mỗi đêm mà không cần mở bảng tính.";
  SpreadsheetApp.getUi().alert('❓ Hướng Dẫn Sử Dụng', msg, SpreadsheetApp.getUi().ButtonSet.OK);
}
