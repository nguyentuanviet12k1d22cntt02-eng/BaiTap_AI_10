/**
 * HỆ THỐNG TỰ ĐỘNG TẠO TEMPLATE VÀ XUẤT HÓA ĐƠN PDF TỪ GOOGLE SHEET
 * 
 * Link Doc Template: https://docs.google.com/document/d/1cIZg4OlBFJqwILfkHXYZqsQH1yGIzlYBggAxWb8qxBI/edit
 * Link Sheet Dữ liệu: https://docs.google.com/spreadsheets/d/19jPP-MwIMPjeDfViicF1jTQBxx-0lTP8HAwR6IqArPI/edit
 * Link Folder Lưu Hóa Đơn: https://drive.google.com/drive/folders/1PMjituFsa7ywxrp1EX93jbRDlj5HCT-O?usp=drive_link
 */

// 1. THAY MÃ ID THƯ MỤC GOOGLE DRIVE LƯU FILE PDF XUẤT RA VÀO ĐÂY:
const FOLDER_OUTPUT_ID = '1PMjituFsa7ywxrp1EX93jbRDlj5HCT-O'; 

// ID File Google Doc Template và Google Sheet Dữ Liệu
const DOC_TEMPLATE_ID = '1cIZg4OlBFJqwILfkHXYZqsQH1yGIzlYBggAxWb8qxBI';
const SHEET_ID = '19jPP-MwIMPjeDfViicF1jTQBxx-0lTP8HAwR6IqArPI';

/**
 * Tạo menu tiện ích khi mở file Google Sheets
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🚀 Tự Động Hóa Kho")
    .addItem("📄 Xuất Phiếu Giao Hàng PDF", "exportPDF")
    .addSeparator()
    .addItem("🛠️ Thiết Lập Mẫu Google Doc", "setupDocTemplate")
    .addToUi();
}

// =========================================================================
// NHIỆM VỤ 1: TỰ ĐỘNG ĐỊNH DẠNG / TẠO MẪU GOOGLE DOC TEMPLATE
// =========================================================================
function setupDocTemplate() {
  const doc = DocumentApp.openById(DOC_TEMPLATE_ID);
  const body = doc.getBody();
  
  // Xóa toàn bộ nội dung cũ
  body.clear();
  
  // Thiết lập lề trang (chuẩn A4)
  body.setMarginTop(36);
  body.setMarginBottom(36);
  body.setMarginLeft(54);
  body.setMarginRight(54);
  
  // 1. Thêm Quốc hiệu & Tiêu đề
  const pNation = body.appendParagraph('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM');
  pNation.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  pNation.setFontFamily('Arial').setFontSize(12).setBold(true);
  
  const pMotto = body.appendParagraph('Độc lập - Tự do - Hạnh phúc');
  pMotto.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  pMotto.setFontFamily('Arial').setFontSize(11).setBold(true);
  
  const pDivider = body.appendParagraph('---------------------------------');
  pDivider.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  pDivider.setFontFamily('Arial').setFontSize(10);
  
  body.appendParagraph(''); // Dòng trống
  
  const pTitle = body.appendParagraph('PHIẾU XUẤT KHO KIÊM GIAO HÀNG');
  pTitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  pTitle.setFontFamily('Arial').setFontSize(16).setBold(true);
  
  body.appendParagraph(''); // Dòng trống
  
  // 2. Thông tin khách hàng
  const pInfoHeading = body.appendParagraph('THÔNG TIN KHÁCH HÀNG:');
  pInfoHeading.setFontFamily('Arial').setFontSize(12).setBold(true);
  
  const infoLines = [
    '• Mã đơn hàng: {{Mã Đơn}}',
    '• Ngày đặt: {{Ngày Đặt}}',
    '• Tên khách hàng: {{Tên Khách Hàng}}',
    '• Số điện thoại: {{Số Điện Thoại}}',
    '• Địa chỉ giao hàng: {{Địa Chỉ Giao Hàng}}'
  ];
  
  infoLines.forEach(line => {
    const pLine = body.appendParagraph(line);
    pLine.setFontFamily('Arial').setFontSize(11);
  });
  
  body.appendParagraph(''); // Dòng trống
  
  // 3. Bảng chi tiết đơn hàng (6 cột)
  const tableData = [
    ['STT', 'Tên Sản Phẩm', 'ĐVT', 'Số Lượng', 'Đơn Giá (VNĐ)', 'Thành Tiền (VNĐ)'],
    ['{{STT}}', '{{Tên Sản Phẩm}}', '{{ĐVT}}', '{{Số Lượng}}', '{{Đơn Giá}}', '{{Thành Tiền}}']
  ];
  
  const table = body.appendTable(tableData);
  
  // Định dạng hàng tiêu đề bảng
  const headerRow = table.getRow(0);
  for (let i = 0; i < headerRow.getNumCells(); i++) {
    const cell = headerRow.getCell(i);
    cell.getChild(0).asParagraph().setFontFamily('Arial').setFontSize(10).setBold(true).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    cell.setBackgroundColor('#F3F3F3');
  }
  
  // Định dạng hàng mẫu biến
  const dataRow = table.getRow(1);
  for (let i = 0; i < dataRow.getNumCells(); i++) {
    const cell = dataRow.getCell(i);
    const p = cell.getChild(0).asParagraph();
    p.setFontFamily('Arial').setFontSize(10);
    if (i === 0 || i === 2 || i === 3) {
      p.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    } else if (i === 4 || i === 5) {
      p.setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
    } else {
      p.setAlignment(DocumentApp.HorizontalAlignment.LEFT);
    }
  }
  
  body.appendParagraph(''); // Dòng trống
  
  // 4. Tổng cộng thanh toán & Chữ ký
  const pTotal = body.appendParagraph('TỔNG CỘNG THANH TOÁN: {{Tổng Tiền}} VNĐ');
  pTotal.setFontFamily('Arial').setFontSize(12).setBold(true).setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
  
  const pWords = body.appendParagraph('Số tiền bằng chữ: .........................................................................................................................................');
  pWords.setFontFamily('Arial').setFontSize(11).setItalic(true);
  
  body.appendParagraph('');
  
  // Bảng chữ ký 2 bên
  const sigTableData = [
    ['NGƯỜI NHẬN HÀNG', 'NGƯỜI LẬP PHIẾU'],
    ['(Ký, ghi rõ họ tên)', '(Ký, ghi rõ họ tên)']
  ];
  const sigTable = body.appendTable(sigTableData);
  sigTable.setBorderWidth(0); // Bỏ viền bảng chữ ký
  
  const sigHeaderRow = sigTable.getRow(0);
  sigHeaderRow.getCell(0).getChild(0).asParagraph().setFontFamily('Arial').setFontSize(11).setBold(true).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  sigHeaderRow.getCell(1).getChild(0).asParagraph().setFontFamily('Arial').setFontSize(11).setBold(true).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  
  const sigSubRow = sigTable.getRow(1);
  sigSubRow.getCell(0).getChild(0).asParagraph().setFontFamily('Arial').setFontSize(10).setItalic(true).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  sigSubRow.getCell(1).getChild(0).asParagraph().setFontFamily('Arial').setFontSize(10).setItalic(true).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  
  doc.saveAndClose();
  Logger.log('Tạo và định dạng template Google Doc hoàn tất!');
}

// =========================================================================
// NHIỆM VỤ 2: GOM NHÓM ĐƠN HÀNG & XUẤT HÓA ĐƠN PDF
// =========================================================================
function exportPDF() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('DonHang_BT2');
  const data = sheet.getDataRange().getValues();
  const displayData = sheet.getDataRange().getDisplayValues();
  
  if (data.length <= 3) {
    SpreadsheetApp.getUi().alert('Không có dữ liệu đơn hàng trên Sheet!');
    return;
  }
  
  // Xác định thư mục lưu trữ PDF
  let outputFolder;
  try {
    outputFolder = DriveApp.getFolderById(FOLDER_OUTPUT_ID);
  } catch (e) {
    outputFolder = DriveApp.getRootFolder();
  }
  
  const templateFile = DriveApp.getFileById(DOC_TEMPLATE_ID);
  
  // 1. Quét dữ liệu và gom nhóm (Tự động kế thừa giá trị ô gộp / Merged cells)
  const orders = {};
  
  let lastMaDon = '';
  let lastNgayDat = '';
  let lastTenKH = '';
  let lastSdt = '';
  let lastDiaChi = '';
  let lastStatus = '';
  
  // Quét dữ liệu bắt đầu từ Dòng 4 (chỉ số 3)
  for (let i = 3; i < data.length; i++) {
    const row = data[i];
    const displayRow = displayData[i];
    
    // Nếu ô không rỗng thì cập nhật, nếu rỗng thì kế thừa giá trị dòng trên
    if (row[0] && row[0].toString().trim() !== '') lastMaDon = displayRow[0].trim();
    if (row[1] && row[1].toString().trim() !== '') lastNgayDat = formatDate(row[1]) || displayRow[1].trim();
    if (row[2] && row[2].toString().trim() !== '') lastTenKH = displayRow[2].trim();
    if (row[3] && row[3].toString().trim() !== '') lastSdt = displayRow[3].trim();
    if (row[4] && row[4].toString().trim() !== '') lastDiaChi = displayRow[4].trim();
    if (row[10] && row[10].toString().trim() !== '') lastStatus = row[10].toString().trim();
    
    const tenSP = displayRow[5] ? displayRow[5].trim() : '';
    
    // Chỉ xử lý dòng có Tên sản phẩm và Trạng Thái = "Chờ xuất"
    if (tenSP !== '' && lastStatus === 'Chờ xuất' && lastMaDon !== '') {
      if (!orders[lastMaDon]) {
        orders[lastMaDon] = {
          maDon: lastMaDon,
          ngayDat: lastNgayDat,
          tenKH: lastTenKH,
          sdt: lastSdt,
          diaChi: lastDiaChi,
          items: [],
          rowIndices: []
        };
      }
      
      const soLuong = Number(row[7]) || 0;
      const donGia = Number(row[8]) || 0;
      let thanhTien = Number(row[9]);
      if (isNaN(thanhTien) || thanhTien === 0) {
        thanhTien = soLuong * donGia;
      }
      
      orders[lastMaDon].items.push({
        tenSP: tenSP,
        dvt: displayRow[6],
        soLuong: soLuong,
        donGia: donGia,
        thanhTien: thanhTien
      });
      
      orders[lastMaDon].rowIndices.push(i + 1); // Lưu chỉ số dòng thực tế trên Sheet
    }
  }
  
  const maDonKeys = Object.keys(orders);
  if (maDonKeys.length === 0) {
    SpreadsheetApp.getUi().alert('Không tìm thấy đơn hàng nào có Trạng Thái = "Chờ xuất"!');
    return;
  }
  
  let successCount = 0;
  
  // 2. Xuất file PDF cho từng đơn hàng
  maDonKeys.forEach(maDon => {
    const order = orders[maDon];
    
    // Nhân bản file Doc tạm
    const tempFileName = `Temp_${order.maDon}`;
    const tempFile = templateFile.makeCopy(tempFileName, outputFolder);
    const tempDoc = DocumentApp.openById(tempFile.getId());
    const body = tempDoc.getBody();
    
    // Thay thế các biến thông tin chung
    body.replaceText('{{Mã Đơn}}', order.maDon);
    body.replaceText('{{Ngày Đặt}}', order.ngayDat);
    body.replaceText('{{Tên Khách Hàng}}', order.tenKH);
    body.replaceText('{{Số Điện Thoại}}', order.sdt);
    body.replaceText('{{Địa Chỉ Giao Hàng}}', order.diaChi);
    
    // Điền bảng chi tiết sản phẩm
    const tables = body.getTables();
    if (tables.length > 0) {
      const table = tables[0];
      const templateRow = table.getRow(1);
      
      let tongTien = 0;
      
      order.items.forEach((item, index) => {
        tongTien += item.thanhTien;
        
        const newRow = templateRow.copy();
        newRow.getCell(0).setText((index + 1).toString());
        newRow.getCell(1).setText(item.tenSP || '');
        newRow.getCell(2).setText(item.dvt || '');
        newRow.getCell(3).setText(formatNumber(item.soLuong));
        newRow.getCell(4).setText(formatCurrency(item.donGia));
        newRow.getCell(5).setText(formatCurrency(item.thanhTien));
        
        table.appendTableRow(newRow);
      });
      
      // Xóa dòng mẫu ban đầu
      table.removeRow(1);
      
      // Thay thế tổng tiền
      body.replaceText('{{Tổng Tiền}}', formatCurrency(tongTien));
    }
    
    tempDoc.saveAndClose();
    
    // Xuất sang PDF
    const pdfBlob = tempFile.getAs('application/pdf');
    const pdfName = `HoaDon_${order.maDon}_${cleanFileName(order.tenKH)}.pdf`;
    pdfBlob.setName(pdfName);
    
    const pdfFile = outputFolder.createFile(pdfBlob);
    pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const pdfUrl = pdfFile.getUrl();
    
    // Xóa file Doc tạm
    tempFile.setTrashed(true);
    
    // 3. Cập nhật lại Google Sheet (Cột K -> "Đã xuất", Cột L -> Link PDF)
    order.rowIndices.forEach(rowIndex => {
      sheet.getRange(rowIndex, 11).setValue('Đã xuất');
      sheet.getRange(rowIndex, 12).setValue(pdfUrl);
    });
    
    successCount++;
  });
  
  SpreadsheetApp.getUi().alert(`Đã xuất thành công ${successCount} hóa đơn PDF!`);
}

function formatCurrency(amount) {
  if (typeof amount === 'number') {
    return amount.toLocaleString('vi-VN');
  }
  return amount || '0';
}

function formatNumber(num) {
  if (typeof num === 'number') {
    return num.toLocaleString('vi-VN');
  }
  return num || '0';
}

function formatDate(dateVal) {
  if (dateVal instanceof Date) {
    return Utilities.formatDate(dateVal, Session.getScriptTimeZone(), 'dd/MM/yyyy');
  }
  return dateVal ? dateVal.toString() : '';
}

function cleanFileName(name) {
  return name ? name.replace(/[^a-zA-Z0-9\s\u00C0-\u1EF9]/g, '').trim() : '';
}
