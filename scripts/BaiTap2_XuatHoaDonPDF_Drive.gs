/**
 * ==============================================================================
 * BÀI TẬP 2: TỰ ĐỘNG ĐIỀN DỮ LIỆU GOOGLE DOCS & XUẤT HÓA ĐƠN PDF VÀO DRIVE
 * ==============================================================================
 * Mục tiêu:
 * 1. Đọc các đơn hàng có trạng thái "Chờ xuất" từ Sheet 'DonHang_BT2'.
 * 2. Tự động nhân bản file mẫu Google Docs có chứa tag {{MA_DON}}, {{TEN_KH}}...
 * 3. Thay thế toàn bộ dữ liệu thật vào tài liệu.
 * 4. Chuyển đổi Google Docs thành file PDF lưu vào thư mục Google Drive.
 * 5. Cập nhật lại đường dẫn xem file PDF và chuyển trạng thái đơn sang "Đã xuất".
 */

const CONFIG_BT2 = {
  SHEET_NAME: "DonHang_BT2",
  TEMPLATE_DOC_ID: "DIEN_GOOGLE_DOCS_TEMPLATE_ID_O_DAY", // ID file Docs mẫu
  DESTINATION_FOLDER_ID: "DIEN_DRIVE_FOLDER_ID_O_DAY"     // ID thư mục Drive lưu file PDF
};

/**
 * Hàm tự động tạo mẫu Google Docs nếu người dùng chưa có
 */
function taoFileDocsMauMoi() {
  const doc = DocumentApp.create("MAU_PHIEU_GIAO_HANG_CHUAN");
  const body = doc.getBody();
  
  // Thiết lập tiêu đề
  const title = body.appendParagraph("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n-----------------------");
  title.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  
  const mainHeading = body.appendParagraph("\nPHIẾU XUẤT KHO KIÊM GIAO HÀNG");
  mainHeading.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  mainHeading.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  
  body.appendParagraph("Mã đơn hàng: {{MA_DON}}");
  body.appendParagraph("Ngày xuất phiếu: {{NGAY_XUAT}}\n");
  
  body.appendParagraph("THÔNG TIN KHÁCH HÀNG:");
  body.appendParagraph("• Họ và tên: {{TEN_KH}}");
  body.appendParagraph("• Số điện thoại: {{SDT}}");
  body.appendParagraph("• Địa chỉ giao nhận: {{DIA_CHI}}\n");
  
  body.appendParagraph("CHI TIẾT ĐƠN HÀNG:");
  body.appendParagraph("• Tên sản phẩm: {{SAN_PHAM}}");
  body.appendParagraph("• Số lượng: {{SO_LUONG}}");
  body.appendParagraph("• Đơn giá: {{DON_GIA}} VNĐ");
  body.appendParagraph("• TỔNG CỘNG THANH TOÁN: {{TONG_TIEN}} VNĐ\n");
  
  body.appendParagraph("\nNgười nhận hàng                     Người lập phiếu\n(Ký và ghi rõ họ tên)               (Ký và ghi rõ họ tên)");
  
  doc.saveAndClose();
  
  const fileUrl = doc.getUrl();
  const fileId = doc.getId();
  
  Logger.log(`Đã tạo file mẫu thành công! ID: ${fileId} - URL: ${fileUrl}`);
  SpreadsheetApp.getUi().alert(`Đã tạo file Docs mẫu!\nID: ${fileId}\n\nHãy copy ID này vào biến CONFIG_BT2.TEMPLATE_DOC_ID.`);
  return fileId;
}

/**
 * Hàm chính: Duyệt đơn hàng và xuất hàng loạt file PDF
 */
function xuatHangLoatPhieuGiaoHangPDF() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG_BT2.SHEET_NAME);
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert(`LỖI: Không tìm thấy sheet '${CONFIG_BT2.SHEET_NAME}'!`);
    return;
  }
  
  if (CONFIG_BT2.TEMPLATE_DOC_ID.includes("DIEN_")) {
    SpreadsheetApp.getUi().alert("Vui lòng điền TEMPLATE_DOC_ID vào phần CONFIG_BT2 trước khi chạy!");
    return;
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 4) {
    SpreadsheetApp.getUi().alert("Không có dữ liệu đơn hàng để xử lý.");
    return;
  }

  // Đọc dữ liệu từ dòng 4
  const dataRange = sheet.getRange(4, 1, lastRow - 3, 10);
  const rows = dataRange.getValues();
  
  const templateDoc = DriveApp.getFileById(CONFIG_BT2.TEMPLATE_DOC_ID);
  const targetFolder = CONFIG_BT2.DESTINATION_FOLDER_ID.includes("DIEN_") 
    ? DriveApp.getRootFolder() 
    : DriveApp.getFolderById(CONFIG_BT2.DESTINATION_FOLDER_ID);
    
  const ngayXuat = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy");
  let countSuccess = 0;

  for (let i = 0; i < rows.length; i++) {
    const maDon = rows[i][0];
    const tenKH = rows[i][1];
    const sdt = rows[i][2];
    const diaChi = rows[i][3];
    const sanPham = rows[i][4];
    const soLuong = rows[i][5];
    const donGia = Number(rows[i][6]).toLocaleString('vi-VN');
    const tongTien = Number(rows[i][7]).toLocaleString('vi-VN');
    const trangThai = rows[i][8];

    // Chỉ xuất các đơn có trạng thái "Chờ xuất"
    if (trangThai === "Chờ xuất") {
      // 1. Tạo file Doc tạm từ mẫu
      const tempDocFile = templateDoc.makeCopy(`Temp_${maDon}`, targetFolder);
      const tempDoc = DocumentApp.openById(tempDocFile.getId());
      const body = tempDoc.getBody();

      // 2. Điền dữ liệu vào tag
      body.replaceText("{{MA_DON}}", String(maDon));
      body.replaceText("{{TEN_KH}}", String(tenKH));
      body.replaceText("{{SDT}}", String(sdt));
      body.replaceText("{{DIA_CHI}}", String(diaChi));
      body.replaceText("{{SAN_PHAM}}", String(sanPham));
      body.replaceText("{{SO_LUONG}}", String(soLuong));
      body.replaceText("{{DON_GIA}}", donGia);
      body.replaceText("{{TONG_TIEN}}", tongTien);
      body.replaceText("{{NGAY_XUAT}}", ngayXuat);
      
      tempDoc.saveAndClose();

      // 3. Chuyển Docs tạm sang PDF
      const pdfBlob = tempDocFile.getAs(MimeType.PDF).setName(`PhieuGiaoHang_${maDon}.pdf`);
      const pdfFile = targetFolder.createFile(pdfBlob);
      pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      // 4. Xóa file Doc tạm
      tempDocFile.setTrashed(true);

      // 5. Cập nhật lại vào Sheet (Dòng thực tế = i + 4)
      const currentSheetRow = i + 4;
      sheet.getRange(currentSheetRow, 9).setValue("Đã xuất"); // Cột I: Trạng Thái
      sheet.getRange(currentSheetRow, 10).setValue(pdfFile.getUrl()); // Cột J: Link PDF
      
      countSuccess++;
    }
  }

  SpreadsheetApp.getUi().alert(`✅ Thành công! Đã xuất và lưu trữ ${countSuccess} file PDF vào Google Drive.`);
}
