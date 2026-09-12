/**
 * FILE: 1_Menu_LamSach.gs
 * Chức năng: Tạo menu điều khiển tiện ích trên bảng tính
 */
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
