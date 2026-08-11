/**
 * ==============================================================================
 * BÀI TẬP 2: TỰ ĐỘNG ĐIỀN DỮ LIỆU ĐƠN HÀNG ĐA SẢN PHẨM & XUẤT HÓA ĐƠN PDF VÀO DRIVE
 * ==============================================================================
 * Mục tiêu nghiệp vụ thực tế (Hỗ trợ Ô Gộp / Merge Cells & Dòng Phụ):
 * 1. Đọc dữ liệu từ Sheet 'DonHang_BT2' (Ô Mã Đơn, Khách Hàng, Trạng Thái chỉ hiển thị 1 ô gộp duy nhất).
 * 2. Tự động nhận diện dòng phụ thuộc về đơn hàng phía trước (Kỹ thuật Forward Fill).
 * 3. Tự động nhân bản file Google Docs mẫu và điền thông tin chung (Khách hàng, Địa chỉ, Ngày đặt).
 * 4. Tự động chèn bảng danh mục nhiều sản phẩm kèm STT, ĐVT, Số lượng, Đơn giá và Thành tiền.
 * 5. Tính Tổng tiền thanh toán cho toàn bộ đơn hàng.
 * 6. Chuyển đổi Google Docs thành file PDF lưu vào Google Drive.
 * 7. Cập nhật trạng thái "Đã xuất" và gắn Link PDF vào ô trạng thái của đơn hàng đó.
 */

const CONFIG_BT2 = {
  SHEET_NAME: "DonHang_BT2",
  TEMPLATE_DOC_ID: "DIEN_GOOGLE_DOCS_TEMPLATE_ID_O_DAY", // ID file Docs mẫu (hoặc chạy hàm taoFileDocsMauMoi để tạo tự động)
  DESTINATION_FOLDER_ID: "DIEN_DRIVE_FOLDER_ID_O_DAY"     // ID thư mục Drive lưu file PDF
};

/**
 * Hàm tự động tạo mẫu Google Docs chuẩn doanh nghiệp hỗ trợ bảng đa sản phẩm
 */
function taoFileDocsMauMoi() {
  const doc = DocumentApp.create("MAU_PHIEU_GIAO_HANG_DA_SAN_PHAM");
  const body = doc.getBody();
  body.clear();
  
  // 1. Quốc hiệu - Tiêu ngữ
  const headerPara = body.appendParagraph("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n───────────────────────");
  headerPara.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  headerPara.setFontSize(10);
  
  // 2. Tiêu đề Phiếu
  const title = body.appendParagraph("\nPHIẾU GIAO HÀNG KIÊM XUẤT KHO");
  title.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  title.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  title.setFontSize(16);
  title.setBold(true);
  
  // 3. Thông tin chung
  const metaPara = body.appendParagraph("Mã đơn hàng: {{MA_DON}} | Ngày đặt: {{NGAY_DAT}} | Ngày xuất: {{NGAY_XUAT}}\n");
  metaPara.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  metaPara.setFontSize(10);
  metaPara.setItalic(true);
  
  const customerInfo = body.appendParagraph(
    "THÔNG TIN KHÁCH HÀNG:\n" +
    "• Khách hàng: {{TEN_KH}}\n" +
    "• Số điện thoại: {{SDT}}\n" +
    "• Địa chỉ giao hàng: {{DIA_CHI}}\n\n" +
    "DANH SÁCH SẢN PHẨM GIAO HÀNG:"
  );
  customerInfo.setFontSize(11);
  
  // 4. Bảng danh mục sản phẩm (Table Template với 1 dòng Header)
  const table = body.appendTable([
    ["STT", "Tên Sản Phẩm", "ĐVT", "SL", "Đơn Giá (VNĐ)", "Thành Tiền (VNĐ)"]
  ]);
  
  // Định dạng dòng Header của bảng
  const headerRow = table.getRow(0);
  for (let c = 0; c < headerRow.getNumCells(); c++) {
    const cell = headerRow.getCell(c);
    cell.setBackgroundColor("#1e293b");
    const p = cell.getChild(0).asParagraph();
    p.setFontColor("#ffffff");
    p.setBold(true);
    p.setFontSize(10);
    p.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  }
  
  // 5. Tổng cộng và chữ ký
  const totalPara = body.appendParagraph("\nTỔNG CỘNG THANH TOÁN: {{TONG_TIEN}} VNĐ");
  totalPara.setFontSize(12);
  totalPara.setBold(true);
  totalPara.setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
  
  const signPara = body.appendParagraph(
    "\n\nNGƯỜI NHẬN HÀNG                                                    NGƯỜI LẬP PHIẾU\n" +
    "(Ký, ghi rõ họ tên)                                                (Ký, ghi rõ họ tên)"
  );
  signPara.setFontSize(10);
  signPara.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  
  doc.saveAndClose();
  
  const fileId = doc.getId();
  const fileUrl = doc.getUrl();
  Logger.log(`Đã tạo file mẫu thành công! ID: ${fileId} - URL: ${fileUrl}`);
  SpreadsheetApp.getUi().alert(`Đã tạo file Google Docs mẫu!\n\nID: ${fileId}\n\nHãy copy ID này và điền vào biến CONFIG_BT2.TEMPLATE_DOC_ID.`);
  return fileId;
}

/**
 * Hàm chính: Gom nhóm đơn hàng đa sản phẩm và xuất hàng loạt PDF
 */
function xuatHangLoatPhieuGiaoHangPDF() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG_BT2.SHEET_NAME);
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert(`LỖI: Không tìm thấy sheet '${CONFIG_BT2.SHEET_NAME}'!`);
    return;
  }
  
  if (CONFIG_BT2.TEMPLATE_DOC_ID.includes("DIEN_")) {
    SpreadsheetApp.getUi().alert("Vui lòng điền TEMPLATE_DOC_ID vào phần cấu hình CONFIG_BT2 trước khi chạy!");
    return;
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 4) {
    SpreadsheetApp.getUi().alert("Không có dữ liệu đơn hàng để xử lý.");
    return;
  }

  // Đọc dữ liệu từ dòng 4 (Cột 1 đến 12)
  // Cấu trúc cột: 
  // 0: Mã Đơn | 1: Ngày Đặt | 2: Tên KH | 3: SDT | 4: Địa Chỉ | 5: Tên SP | 6: ĐVT | 7: SL | 8: Đơn Giá | 9: Thành Tiền | 10: Trạng Thái | 11: Link PDF
  const dataRange = sheet.getRange(4, 1, lastRow - 3, 12);
  const rows = dataRange.getValues();
  
  // 1. Gom nhóm sản phẩm theo từng Mã Đơn (Xử lý thông minh cho Ô Gộp / Ô Trống)
  const ordersMap = {};
  let currentMaDon = "";

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cellMaDon = String(row[0]).trim();
    const sheetRowIndex = i + 4; // Dòng thực tế trên Sheet

    // Nếu ô Mã Đơn có giá trị -> Bắt đầu đơn hàng mới
    if (cellMaDon !== "") {
      currentMaDon = cellMaDon;
      ordersMap[currentMaDon] = {
        maDon: currentMaDon,
        ngayDat: row[1] ? (row[1] instanceof Date ? Utilities.formatDate(row[1], "GMT+7", "dd/MM/yyyy") : String(row[1])) : "",
        tenKH: row[2],
        sdt: row[3],
        diaChi: row[4],
        trangThai: String(row[10]).trim(),
        headerSheetRow: sheetRowIndex,
        sheetRows: [sheetRowIndex],
        items: []
      };
    } else if (currentMaDon !== "") {
      // Dòng phụ (sản phẩm thứ 2, 3...) của đơn hàng hiện tại
      ordersMap[currentMaDon].sheetRows.push(sheetRowIndex);
    }

    // Thêm sản phẩm nếu có tên sản phẩm (Cột F / index 5)
    if (currentMaDon !== "" && row[5]) {
      ordersMap[currentMaDon].items.push({
        tenSP: row[5],
        dvt: row[6],
        soLuong: Number(row[7]) || 1,
        donGia: Number(row[8]) || 0,
        thanhTien: Number(row[9]) || (Number(row[7]) * Number(row[8]))
      });
    }
  }

  const templateDoc = DriveApp.getFileById(CONFIG_BT2.TEMPLATE_DOC_ID);
  const targetFolder = CONFIG_BT2.DESTINATION_FOLDER_ID.includes("DIEN_") 
    ? DriveApp.getRootFolder() 
    : DriveApp.getFolderById(CONFIG_BT2.DESTINATION_FOLDER_ID);
    
  const ngayXuat = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy");
  let countOrdersExported = 0;

  // 2. Xử lý xuất PDF cho từng Đơn hàng
  for (const maDon in ordersMap) {
    const order = ordersMap[maDon];

    // Chỉ xuất các đơn có trạng thái "Chờ xuất"
    if (order.trangThai === "Chờ xuất") {
      // 2.1. Tính tổng tiền của toàn đơn
      let tongTienDonHang = 0;
      order.items.forEach(item => {
        tongTienDonHang += item.thanhTien;
      });

      // 2.2. Tạo bản sao tạm thời từ file Docs mẫu
      const tempDocFile = templateDoc.makeCopy(`Temp_${order.maDon}`, targetFolder);
      const tempDoc = DocumentApp.openById(tempDocFile.getId());
      const body = tempDoc.getBody();

      // 2.3. Thay thế các biến thông tin chung
      body.replaceText("{{MA_DON}}", String(order.maDon));
      body.replaceText("{{NGAY_DAT}}", String(order.ngayDat));
      body.replaceText("{{NGAY_XUAT}}", ngayXuat);
      body.replaceText("{{TEN_KH}}", String(order.tenKH));
      body.replaceText("{{SDT}}", String(order.sdt));
      body.replaceText("{{DIA_CHI}}", String(order.diaChi));
      body.replaceText("{{TONG_TIEN}}", Number(tongTienDonHang).toLocaleString('vi-VN'));

      // 2.4. Điền danh sách nhiều sản phẩm vào Bảng
      const tables = body.getTables();
      if (tables.length > 0) {
        const itemTable = tables[0]; // Bảng sản phẩm đầu tiên
        
        // Thêm từng dòng sản phẩm vào bảng
        order.items.forEach((item, idx) => {
          const row = itemTable.appendTableRow();
          row.appendTableCell(String(idx + 1)).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
          row.appendTableCell(String(item.tenSP));
          row.appendTableCell(String(item.dvt)).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
          row.appendTableCell(String(item.soLuong)).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
          row.appendTableCell(Number(item.donGia).toLocaleString('vi-VN')).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
          row.appendTableCell(Number(item.thanhTien).toLocaleString('vi-VN')).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
          
          // Định dạng kích thước chữ cho dòng dữ liệu
          for (let c = 0; c < row.getNumCells(); c++) {
            row.getCell(c).setFontSize(9.5);
          }
        });
      }

      tempDoc.saveAndClose();

      // 2.5. Xuất thành file PDF và lưu vào Drive
      const pdfBlob = tempDocFile.getAs(MimeType.PDF).setName(`PhieuGiaoHang_${order.maDon}.pdf`);
      const pdfFile = targetFolder.createFile(pdfBlob);
      pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      const pdfUrl = pdfFile.getUrl();

      // 2.6. Xóa bản sao Docs tạm
      tempDocFile.setTrashed(true);

      // 2.7. Cập nhật lại Google Sheet (ghi vào ô chính của đơn)
      sheet.getRange(order.headerSheetRow, 11).setValue("Đã xuất"); // Cột K: Trạng Thái
      sheet.getRange(order.headerSheetRow, 12).setValue(pdfUrl);    // Cột L: Link File PDF

      countOrdersExported++;
    }
  }

  SpreadsheetApp.getUi().alert(`✅ Thành công!\nĐã xuất và tạo ${countOrdersExported} hóa đơn PDF đa sản phẩm vào Google Drive.`);
}

/**
 * Menu tùy chỉnh trên Google Sheets
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🚀 TỰ ĐỘNG HÓA")
    .addItem("📄 Xuất Phiếu Giao Hàng PDF (Đa Sản Phẩm)", "xuatHangLoatPhieuGiaoHangPDF")
    .addSeparator()
    .addItem("🛠️ Tạo Mẫu Google Docs Mới", "taoFileDocsMauMoi")
    .addToUi();
}
