# HƯỚNG DẪN BÀI THỰC HÀNH 2 (PROMPT-DRIVEN)
## RA LỆNH CHO AI AGENT XUẤT PHIẾU GIAO HÀNG PDF ĐA SẢN PHẨM & LƯU VÀO GOOGLE DRIVE

---

### 📖 1. Tình Huống Doanh Nghiệp Thực Tế (Case Study Context)
* **Bối cảnh:** Bạn là Nhân viên Quản lý Kho vận hoặc Kế toán Bán hàng tại công ty phân phối thiết bị công nghệ. Mỗi ngày công ty phát sinh từ 50 đến 100 đơn hàng. Trong thực tế, **mỗi đơn hàng có thể có nhiều sản phẩm khác nhau** (ví dụ: 1 máy Laptop + 1 Chuột + 1 Balo chống sốc).
* **Nỗi đau khi làm thủ công (Before):** Nhân viên phải mở từng dòng trên Sheet, tìm các dòng có cùng Mã Đơn, kẻ bảng trong Word, copy từng sản phẩm, số lượng, đơn giá, tính tổng tiền, bấm Save As PDF, đặt tên file rồi upload vào Google Drive. Mất 2-3 tiếng mỗi ngày và rất dễ gõ nhầm số tiền hoặc bỏ sót sản phẩm của khách.
* **Giải pháp AI Tự động (After):** Ra lệnh cho AI Agent tạo sẵn nút bấm `🚀 Xuất Phiếu Giao Hàng PDF` trên Google Sheets. Bấm 1 click là hệ thống tự gom nhóm các sản phẩm theo từng đơn hàng, tự động chèn bảng danh sách hàng hóa vào mẫu Google Docs, xuất thành PDF lưu thẳng vào Drive và cập nhật link vào bảng tính trong 30 giây.

---

### 🪄 2. Quy Trình Ra Lệnh Từng Bước Cho SPARK / AI Agent

#### 📍 BƯỚC 1: Kiểm Kê Cấu Trúc Sheet & Dữ Liệu Bằng AI (Prompt Trinh Sát)
* **Mục đích:** Trước khi yêu cầu AI viết mã Apps Script tự động hóa phức tạp, hãy gửi đường link Google Sheets kèm câu lệnh kiểm kê tổng quát để AI (SPARK / Gemini) quét danh sách các sheet, bóc tách cấu trúc cột và phạm vi dữ liệu trong sheet `DonHang_BT2`.
* **Câu Prompt gửi cho SPARK:**
```text
Hãy truy cập vào file Google Sheet này: [Dán link vào đây].

Tôi cần bạn thực hiện kiểm kê tổng quát về cấu trúc của file này. Vui lòng thực hiện các bước sau:

1. Liệt kê tên tất cả các sheet (tab) hiện có trong file.

2. Với mỗi sheet, hãy mô tả cấu trúc của nó bao gồm:
   - Danh sách các tiêu đề cột (tên cột nằm ở dòng mấy).
   - Định dạng dữ liệu của các cột đó (ví dụ: cột đó chứa văn bản, số, ngày tháng, hay công thức).
   - Tổng số dòng dữ liệu ước tính trong sheet đó.

3. Trình bày kết quả dưới dạng bảng tổng hợp để tôi dễ đối chiếu.
```
* **💡 Lưu ý quan trọng:** Đảm bảo file Google Sheets của bạn đã được bật chế độ chia sẻ (Share) là *"Bất kỳ ai có đường liên kết đều có thể xem"* để AI có thể đọc trực tiếp.

---

#### 📍 BƯỚC 2: Thiết Kế Biểu Mẫu Tự Nhiên Bằng AI (Dữ Liệu Thật)
* **Mục đích:** Yêu cầu AI dựa trên tài liệu quy tắc thiết kế biểu mẫu để tạo mẫu *"Phiếu xuất kho kiêm giao hàng"* chuẩn in ấn A4, tự động co giãn vừa khít lề trang giấy.
* **Câu Prompt gửi cho Gemini / ChatGPT:**
```text
[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia soạn thảo văn bản. Hãy tuân thủ nghiêm ngặt toàn bộ nguyên tắc trong tài liệu "QUY_TAC_THIET_KE_BIEU_MAU_DOCS_WORD_AI.md" đính kèm.

[YÊU CẦU NGHIỆP VỤ]: Dựa vào thông tin đơn hàng đã phân tích ở trên, hãy thiết kế cho tôi mẫu "Phiếu xuất kho kiêm giao hàng" chuyên nghiệp trên Google Docs / Word.

Yêu cầu biểu mẫu có đầy đủ:
1. Thông tin công ty phát hành và thông tin khách hàng nhận hàng.
2. Bảng danh mục sản phẩm (STT, Tên hàng, ĐVT, Số lượng, Đơn giá, Thành tiền) điền sẵn 2-3 dòng sản phẩm mẫu thực tế.
3. Tổng tiền, số tiền bằng chữ và 3 chữ ký (Người lập, Người giao, Người nhận).

Hãy trình bày dưới dạng văn bản tài liệu rõ ràng, trang nhã để tôi copy vào Google Docs làm mẫu in.
```
* **🎯 Kết quả đối chiếu:** Mẫu biểu với dữ liệu thực tế mẫu xuất hiện trực quan trên Docs, bảng vừa khít lề trang giấy A4.

---

#### 📍 BƯỚC 3: Chuyển Đổi Dữ Liệu Thành Biến Tự Động Hóa {{...}}
* **Mục đích:** Sau khi đã ướm thử mẫu ưng ý trên Google Docs, gửi tiếp câu lệnh ngắn để AI tự động chuyển các thông tin cụ thể thành các biến `{{Ten_Bien}}` phục vụ cho việc tự động hóa.
* **Câu Prompt gửi cho Gemini / ChatGPT:**
```text
Mẫu biểu rất đẹp! Bây giờ hãy tự động chuyển đổi toàn bộ các giá trị dữ liệu cụ thể trong mẫu này thành các biến đặt trong cặp ngoặc nhọn {{...}} (ví dụ: {{Ma_Don}}, {{Ten_Khach_Hang}}, {{Ten_San_Pham}}, {{Tong_Tien}}...) để tôi dùng làm mẫu tự động hóa.

Hãy xuất lại toàn bộ văn bản mẫu Google Docs đã gắn đầy đủ các thẻ biến {{...}} này nhé.
```
* **🎯 Kết quả đối chiếu:** Mẫu Google Docs Template hoàn chỉnh đã gắn đầy đủ placeholder `{{...}}`.

---

#### 📍 BƯỚC 4: Ra Lệnh Cho AI Viết Mã Google Apps Script Tự Động Hóa Xuất PDF
* **Mục đích:** Dán câu lệnh yêu cầu viết mã vào AI (kèm file Quy Tắc Kỹ Thuật) để AI tự động tạo mã nguồn hoàn chỉnh: gom nhóm sản phẩm theo mã đơn (xử lý gộp ô), điền vào template Docs, xuất PDF lưu Drive và cập nhật link vào Sheet.
* **Câu Prompt gửi cho AI Agent:**
```text
[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia Google Apps Script. Hãy tuân thủ nghiêm ngặt toàn bộ nguyên tắc trong tài liệu "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

[BỐI CẢNH & DỮ LIỆU]: Trang tính "DonHang_BT2" có dữ liệu từ dòng 4 gồm các cột:
- Mã đơn, Ngày đặt, Tên khách hàng, Số điện thoại, Địa chỉ giao hàng
- Tên sản phẩm, ĐVT, Số lượng, Đơn giá, Thành tiền
- Trạng thái, Link file PDF

[YÊU CẦU NGHIỆP VỤ - XUẤT PHIẾU GIAO HÀNG PDF LƯU DRIVE]:
Hãy viết mã Google Apps Script hoàn chỉnh:
1. Gom nhóm các sản phẩm có cùng mã đơn và chỉ xuất các đơn có trạng thái "Chờ xuất" (xử lý trường hợp mã đơn bị gộp ô trên sheet).
2. Điền thông tin đơn hàng và danh mục sản phẩm vào mẫu Google Docs.
3. Xuất file PDF lưu vào thư mục Google Drive, cập nhật trạng thái đơn thành "Đã xuất" và dán link xem PDF vào bảng tính.
4. Tạo Menu nút bấm trên Google Sheets để người dùng bấm xuất phiếu nhanh.

[YÊU CẦU ĐẦU RA]:
- Xuất khối mã Apps Script hoàn chỉnh, có khai báo phần cấu hình ID ở đầu file để dễ thay thế.
```
* **💡 Bí quyết:** Toàn bộ thuật toán khó (xử lý ô gộp Merge Cells, điền bảng động nhiều dòng trong Docs, dọn dẹp file tạm trên Drive) đã được giải quyết tự động nhờ File Quy Tắc Kỹ Thuật!

* **🎯 Mã nguồn Apps Script sinh ra từ SPARK Agent để đối chiếu:**
```javascript
/**
 * HỆ THỐNG TỰ ĐỘNG TẠO TEMPLATE VÀ XUẤT HÓA ĐƠN PDF TỪ GOOGLE SHEET
 */

const FOLDER_OUTPUT_ID = '1PMjituFsa7ywxrp1EX93jbRDlj5HCT-O'; 
const DOC_TEMPLATE_ID = '1cIZg4OlBFJqwILfkHXYZqsQH1yGIzlYBggAxWb8qxBI';
const SHEET_ID = '19jPP-MwIMPjeDfViicF1jTQBxx-0lTP8HAwR6IqArPI';

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🚀 Tự Động Hóa Kho")
    .addItem("📄 Xuất Phiếu Giao Hàng PDF", "exportPDF")
    .addSeparator()
    .addItem("🛠️ Thiết Lập Mẫu Google Doc", "setupDocTemplate")
    .addToUi();
}

function setupDocTemplate() {
  const doc = DocumentApp.openById(DOC_TEMPLATE_ID);
  const body = doc.getBody();
  body.clear();
  body.setMarginTop(36).setMarginBottom(36).setMarginLeft(54).setMarginRight(54);
  
  // 1. Quốc hiệu - Tiêu đề
  body.appendParagraph('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM').setAlignment(DocumentApp.HorizontalAlignment.CENTER).setFontFamily('Arial').setFontSize(12).setBold(true);
  body.appendParagraph('Độc lập - Tự do - Hạnh phúc').setAlignment(DocumentApp.HorizontalAlignment.CENTER).setFontFamily('Arial').setFontSize(11).setBold(true);
  body.appendParagraph('---------------------------------').setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  body.appendParagraph('');
  body.appendParagraph('PHIẾU XUẤT KHO KIÊM GIAO HÀNG').setAlignment(DocumentApp.HorizontalAlignment.CENTER).setFontFamily('Arial').setFontSize(16).setBold(true);
  body.appendParagraph('');
  
  // 2. Thông tin khách hàng
  body.appendParagraph('THÔNG TIN KHÁCH HÀNG:').setFontFamily('Arial').setFontSize(12).setBold(true);
  ['• Mã đơn hàng: {{Mã Đơn}}', '• Ngày đặt: {{Ngày Đặt}}', '• Tên khách hàng: {{Tên Khách Hàng}}', '• Số điện thoại: {{Số Điện Thoại}}', '• Địa chỉ giao hàng: {{Địa Chỉ Giao Hàng}}']
    .forEach(line => body.appendParagraph(line).setFontFamily('Arial').setFontSize(11));
  body.appendParagraph('');
  
  // 3. Bảng chi tiết sản phẩm 6 cột
  const tableData = [
    ['STT', 'Tên Sản Phẩm', 'ĐVT', 'Số Lượng', 'Đơn Giá (VNĐ)', 'Thành Tiền (VNĐ)'],
    ['{{STT}}', '{{Tên Sản Phẩm}}', '{{ĐVT}}', '{{Số Lượng}}', '{{Đơn Giá}}', '{{Thành Tiền}}']
  ];
  const table = body.appendTable(tableData);
  
  // 4. Tổng cộng và chữ ký
  body.appendParagraph('TỔNG CỘNG THANH TOÁN: {{Tổng Tiền}} VNĐ').setFontFamily('Arial').setFontSize(12).setBold(true).setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
  body.appendParagraph('Số tiền bằng chữ: .........................................................................................................................................').setFontFamily('Arial').setFontSize(11).setItalic(true);
  
  const sigTable = body.appendTable([
    ['NGƯỜI NHẬN HÀNG', 'NGƯỜI LẬP PHIẾU'],
    ['(Ký, ghi rõ họ tên)', '(Ký, ghi rõ họ tên)']
  ]);
  sigTable.setBorderWidth(0);
  
  doc.saveAndClose();
}

function exportPDF() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('DonHang_BT2');
  const data = sheet.getDataRange().getValues();
  const displayData = sheet.getDataRange().getDisplayValues();
  
  const outputFolder = DriveApp.getFolderById(FOLDER_OUTPUT_ID);
  const templateFile = DriveApp.getFileById(DOC_TEMPLATE_ID);
  
  // Gom nhóm đơn hàng (Kế thừa ô gộp Merge Cells)
  const orders = {};
  let lastMaDon = '', lastNgayDat = '', lastTenKH = '', lastSdt = '', lastDiaChi = '', lastStatus = '';
  
  for (let i = 3; i < data.length; i++) {
    const row = data[i];
    const displayRow = displayData[i];
    if (row[0] && row[0].toString().trim() !== '') lastMaDon = displayRow[0].trim();
    if (row[1] && row[1].toString().trim() !== '') lastNgayDat = formatDate(row[1]) || displayRow[1].trim();
    if (row[2] && row[2].toString().trim() !== '') lastTenKH = displayRow[2].trim();
    if (row[3] && row[3].toString().trim() !== '') lastSdt = displayRow[3].trim();
    if (row[4] && row[4].toString().trim() !== '') lastDiaChi = displayRow[4].trim();
    if (row[10] && row[10].toString().trim() !== '') lastStatus = row[10].toString().trim();
    
    const tenSP = displayRow[5] ? displayRow[5].trim() : '';
    if (tenSP !== '' && lastStatus === 'Chờ xuất' && lastMaDon !== '') {
      if (!orders[lastMaDon]) {
        orders[lastMaDon] = { maDon: lastMaDon, ngayDat: lastNgayDat, tenKH: lastTenKH, sdt: lastSdt, diaChi: lastDiaChi, items: [], rowIndices: [] };
      }
      const soLuong = Number(row[7]) || 0;
      const donGia = Number(row[8]) || 0;
      const thanhTien = Number(row[9]) || (soLuong * donGia);
      orders[lastMaDon].items.push({ tenSP, dvt: displayRow[6], soLuong, donGia, thanhTien });
      orders[lastMaDon].rowIndices.push(i + 1);
    }
  }
  
  let successCount = 0;
  Object.keys(orders).forEach(maDon => {
    const order = orders[maDon];
    const tempFile = templateFile.makeCopy(`Temp_${order.maDon}`, outputFolder);
    const tempDoc = DocumentApp.openById(tempFile.getId());
    const body = tempDoc.getBody();
    
    body.replaceText('{{Mã Đơn}}', order.maDon);
    body.replaceText('{{Ngày Đặt}}', order.ngayDat);
    body.replaceText('{{Tên Khách Hàng}}', order.tenKH);
    body.replaceText('{{Số Điện Thoại}}', order.sdt);
    body.replaceText('{{Địa Chỉ Giao Hàng}}', order.diaChi);
    
    const table = body.getTables()[0];
    const templateRow = table.getRow(1);
    let tongTien = 0;
    
    order.items.forEach((item, idx) => {
      tongTien += item.thanhTien;
      const newRow = templateRow.copy();
      newRow.getCell(0).setText((idx + 1).toString());
      newRow.getCell(1).setText(item.tenSP);
      newRow.getCell(2).setText(item.dvt);
      newRow.getCell(3).setText(formatNumber(item.soLuong));
      newRow.getCell(4).setText(formatCurrency(item.donGia));
      newRow.getCell(5).setText(formatCurrency(item.thanhTien));
      table.appendTableRow(newRow);
    });
    table.removeRow(1);
    body.replaceText('{{Tổng Tiền}}', formatCurrency(tongTien));
    tempDoc.saveAndClose();
    
    const pdfBlob = tempFile.getAs('application/pdf');
    pdfBlob.setName(`HoaDon_${order.maDon}_${cleanFileName(order.tenKH)}.pdf`);
    const pdfFile = outputFolder.createFile(pdfBlob);
    pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const pdfUrl = pdfFile.getUrl();
    tempFile.setTrashed(true);
    
    order.rowIndices.forEach(rowIndex => {
      sheet.getRange(rowIndex, 11).setValue('Đã xuất');
      sheet.getRange(rowIndex, 12).setValue(pdfUrl);
    });
    successCount++;
  });
  SpreadsheetApp.getUi().alert(`Đã xuất thành công ${successCount} hóa đơn PDF!`);
}

function formatCurrency(amount) { return typeof amount === 'number' ? amount.toLocaleString('vi-VN') : (amount || '0'); }
function formatNumber(num) { return typeof num === 'number' ? num.toLocaleString('vi-VN') : (num || '0'); }
function formatDate(dateVal) { return dateVal instanceof Date ? Utilities.formatDate(dateVal, Session.getScriptTimeZone(), 'dd/MM/yyyy') : (dateVal ? dateVal.toString() : ''); }
function cleanFileName(name) { return name ? name.replace(/[^a-zA-Z0-9\s\u00C0-\u1EF9]/g, '').trim() : ''; }
```

* **🖼️ Hình ảnh đối chiếu thực tế:**
  1. *Hình 1:* Mã Apps Script hoàn chỉnh do AI tự động thiết kế.
  2. *Hình 2:* Mở trình soạn thảo Tiện ích mở rộng ➔ Apps Script trên Google Sheets.
  3. *Hình 3:* Dán mã vào Mã.gs, chọn hàm onOpen và bấm Chạy thử nghiệm thành công.








