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

* **🎯 Kết quả phản hồi mẫu từ SPARK để đối chiếu:**
```text
Có, tôi đã truy cập và kiểm kê chi tiết cấu trúc tệp Google Sheets Du_Lieu_Mau_Tong_Hop.

1. Danh sách các Sheet:
   - DoanhThu_BT1: Báo cáo doanh thu chi nhánh.
   - DonHang_BT2: Bảng quản lý đơn hàng đa sản phẩm.
   - BangLuong_BT3: Bảng lương nhân viên.
   - DonNghiPhep_BT4: Đơn nghỉ phép.
   - RawData_BT5: Dữ liệu giao dịch thô.

2. Cấu trúc chi tiết sheet DonHang_BT2:
   - Tiêu đề: Nằm tại Dòng 3 (Cột A đến L).
   - Dữ liệu: Bắt đầu từ Dòng 4.
   - Các cột: Mã Đơn, Ngày Đặt, Tên Khách Hàng, Số Điện Thoại, Địa Chỉ, Sản Phẩm, ĐVT, Số Lượng, Đơn Giá, Thành Tiền, Trạng Thái, Link PDF.
```

---

#### 📍 BƯỚC 2: Ra Lệnh Cho AI Tạo Biểu Mẫu Google Docs / Word Chuẩn ("Siêu Prompt")
* **Mục đích:** Sao chép kết quả kiểm kê cấu trúc dữ liệu từ Bước 1, gửi vào Gemini hoặc ChatGPT kèm yêu cầu thiết kế để AI tự động xuất ra mẫu Word/Docs *"Phiếu xuất kho kiêm giao hàng"* chuẩn in ấn với các placeholder `{{...}}` theo đúng quy tắc chuẩn hóa.
* **Câu Prompt gửi cho Gemini / ChatGPT:**
```text
Dưới đây là kết quả kiểm kê cấu trúc của tệp Google Sheet bai_tap_2_don_hang:

1. Danh sách các Sheet (Tab):
   - Số lượng: 1 sheet duy nhất.
   - Tên sheet: Sheet1 (Gid: 110030286).

2. Mô tả cấu trúc của Sheet1:
   - Dòng 1: Tiêu đề khối dữ liệu gộp ô (A1:L1): DỮ LIỆU THỰC HÀNH: DONHANG_BT2.
   - Dòng 2: Dòng trống ngăn cách.
   - Dòng 3: Dòng tiêu đề cột chính (chứa 12 cột từ A đến L).
   - Dữ liệu: Bắt đầu từ dòng 4 đến dòng 20 (tổng cộng 17 dòng dữ liệu chi tiết, tương ứng với 7 đơn hàng từ DH-2026-001 đến DH-2026-007).
   - Đặc điểm tổ chức: Các đơn hàng có nhiều sản phẩm được gộp ô (merge cells) ở các cột thông tin chung (Mã đơn, Ngày đặt, Khách hàng, SĐT, Địa chỉ, Trạng thái, Link PDF). Các cột chi tiết mặt hàng hiển thị trên từng dòng riêng lẻ.

3. Bảng tổng hợp cấu trúc các cột trong Sheet1:
   - Cột A: Mã Đơn (Văn bản / Text - Mã định danh đơn hàng, ví dụ: DH-2026-001. Gộp ô theo đơn)
   - Cột B: Ngày Đặt (Ngày tháng / Date - Định dạng dd/MM/yyyy, ví dụ: 10/08/2026. Gộp ô theo đơn)
   - Cột C: Tên Khách Hàng (Văn bản - Họ tên người mua, ví dụ: Nguyễn Văn An. Gộp ô theo đơn)
   - Cột D: Số Điện Thoại (Văn bản - SĐT người mua, ví dụ: 0988123456. Gộp ô theo đơn)
   - Cột E: Địa Chỉ Giao Hàng (Văn bản - Địa chỉ nhận hàng, ví dụ: 12 Hoàng Hoa Thám, Ba Đình, Hà Nội. Gộp ô theo đơn)
   - Cột F: Tên Sản Phẩm (Văn bản - Tên mặt hàng / thiết bị trong đơn, ví dụ: Laptop Dell XPS 15 9530)
   - Cột G: ĐVT (Văn bản - Đơn vị tính của sản phẩm, ví dụ: Chiếc, Bộ, Sợi)
   - Cột H: Số Lượng (Số nguyên / Integer, ví dụ: 1, 2)
   - Cột I: Đơn Giá (Số / Tiền tệ, ví dụ: 32.000.000)
   - Cột J: Thành Tiền (Số / Tiền tệ, ví dụ: 32.000.000)
   - Cột K: Trạng Thái (Văn bản - Chờ xuất, Đã xuất. Gộp ô theo đơn)
   - Cột L: Link File PDF (Đường dẫn liên kết URL đến file phiếu giao hàng)

Dựa vào kết quả kiểm kê cấu trúc trên, hãy thiết kế cho tôi mẫu 'Phiếu xuất kho kiêm giao hàng' (file Word/Docs) đảm bảo tính thẩm mỹ, chuyên nghiệp và tối ưu cho việc in ấn.

Yêu cầu chi tiết:

1. Bố cục tài liệu:
   - Đầu trang: Thông tin Đơn vị phát hành (Tên công ty, MST, Địa chỉ, Hotline, Email).
   - Giữa trang: Tiêu đề phiếu, Thông tin chi tiết đơn hàng và khách hàng.
   - Thân trang: Bảng danh mục hàng hóa (STT, Mã hàng/SKU, Tên sản phẩm, ĐVT, Số lượng, Đơn giá, Thành tiền).
   - Cuối trang: Tổng cộng thanh toán, số tiền bằng chữ và khu vực chữ ký các bên liên quan dàn đều theo chiều ngang.

2. Quy tắc về biến (placeholder):
   - Mọi vị trí cần điền dữ liệu tự động phải được đặt trong cặp ngoặc nhọn {{ }}.
   - Tên biến bên trong ngoặc phải viết liền, không dấu, dùng dấu gạch dưới _ (Ví dụ: {{Ten_San_Pham}}, {{So_Tien_Bang_Chu}}).
   - Hãy tự động ánh xạ các trường thông tin từ bảng dữ liệu phía trên thành các biến tương ứng.

3. Trình bày:
   - Bảng danh mục hàng hóa cần có kẻ khung rõ ràng, các cột số lượng, đơn giá và thành tiền căn lề phải.
   - Ngôn ngữ lịch sự, rõ ràng, thiết kế trang nhã tối ưu in ấn trên khổ A4.
```
* **💡 Lưu ý:** Đảm bảo giữ nguyên các placeholder dạng `{{...}}` để Apps Script nhận diện và điền dữ liệu tự động.
* **🎯 Kết quả đối chiếu:** Tệp mẫu `Phiếu xuất kho kiêm giao hàng` do AI tạo ra trên Google Docs / Word với bố cục chuyên nghiệp.

---

#### 📍 BƯỚC 3: Ra Lệnh Cho AI Viết Mã Google Apps Script Tự Động Hóa Xuất PDF
* **Mục đích:** Dán Siêu Prompt kỹ thuật 5 thành tố vào SPARK / AI Agent để sinh mã Apps Script hoàn chỉnh: tự động gom nhóm sản phẩm theo mã đơn (xử lý gộp ô), điền thông tin vào mẫu Docs, xuất PDF lưu Drive, cập nhật trạng thái "Đã xuất" và link PDF vào Sheet.
* **Câu Prompt gửi cho SPARK:**
```text
Bạn là một Chuyên gia Lập trình Google Apps Script và Tự động hóa Google Workspace.

DỰ ÁN: TỰ ĐỘNG XUẤT PHIẾU XUẤT KHO KIÊM GIAO HÀNG PDF ĐA SẢN PHẨM TỪ GOOGLE SHEETS

Tôi đã có:
1. Google Sheet: Trang tính tên "DonHang_BT2" chứa dữ liệu từ dòng 4 gồm 12 cột:
   - Cột A: Mã Đơn (ví dụ: DH-2026-001 - một mã đơn có thể gồm nhiều dòng do có nhiều sản phẩm, các dòng sau có thể bị để trống do gộp ô)
   - Cột B: Ngày Đặt (dd/MM/yyyy)
   - Cột C: Tên Khách Hàng
   - Cột D: Số Điện Thoại
   - Cột E: Địa Chỉ Giao Hàng
   - Cột F: Tên Sản Phẩm
   - Cột G: ĐVT (Đơn vị tính)
   - Cột H: Số Lượng
   - Cột I: Đơn Giá (VNĐ)
   - Cột J: Thành Tiền (VNĐ)
   - Cột K: Trạng Thái ("Chờ xuất" hoặc "Đã xuất")
   - Cột L: Link File PDF

2. Google Docs Template: File mẫu tên "PHIẾU XUẤT KHO KIÊM GIAO HÀNG - Template" (hoặc ID file) chứa:
   - Các biến thông tin chung: {{Mã Đơn}}, {{Ngày Đặt}}, {{Tên Khách Hàng}}, {{Số Điện Thoại}}, {{Địa Chỉ Giao Hàng}}, {{Tổng Tiền}}
   - Một Bảng sản phẩm gồm dòng tiêu đề và dòng mẫu chứa placeholder: {{STT}}, {{Tên Sản Phẩm}}, {{ĐVT}}, {{Số Lượng}}, {{Đơn Giá}}, {{Thành Tiền}}

HÃY VIẾT MÃ GOOGLE APPS SCRIPT HOÀN CHỈNH THỰC HIỆN CÁC YÊU CẦU SAU:

1. THUẬT TOÁN GOM NHÓM & LỌC DỮ LIỆU:
   - Đọc dữ liệu từ dòng 4 của sheet "DonHang_BT2".
   - Tự động nhận diện các dòng con thuộc cùng một đơn hàng (xử lý trường hợp ô Mã Đơn, Tên KH bị trống do gộp ô bằng cách ghi nhớ mã đơn gần nhất).
   - Chỉ xử lý các đơn hàng có Trạng Thái là "Chờ xuất". Bỏ qua các đơn "Đã xuất".

2. QUY TRÌNH XUẤT TỪNG PHIẾU GIAO HÀNG:
   Với mỗi đơn hàng cần xuất:
   a. Tìm file Docs Template theo tên (hoặc ID cấu hình) và tạo một bản sao tạm.
   b. Thay thế toàn bộ các biến thông tin chung ({{Mã Đơn}}, {{Tên Khách Hàng}}, {{Ngày Đặt}}...) bằng dữ liệu thật.
   c. Tìm bảng sản phẩm trong Docs: Duyệt qua tất cả các mặt hàng thuộc đơn đó, chèn từng dòng vào bảng với STT tự tăng từ 1, Đơn Giá và Thành Tiền được định dạng tiền tệ VNĐ (ví dụ: 32.000.000). Sau đó xóa dòng placeholder mẫu.
   d. Tính Tổng tiền của đơn và điền vào biến {{Tổng Tiền}} (có format VNĐ).
   e. Lưu và đóng tài liệu tạm, chuyển đổi thành file PDF với tên: "PhieuXuatKho_[Mã Đơn]_[Tên Khách Hàng].pdf".
   f. Lưu file PDF vào một thư mục trên Google Drive tên "HoaDon_PDF" (nếu chưa có thư mục thì tự động tạo mới).
   g. Xóa file Docs tạm sau khi đã xuất PDF để tránh rác Drive.
   h. Cập nhật ngược lại Google Sheet: Đổi cột K thành "Đã xuất" và dán link xem PDF vào cột L cho tất cả các dòng thuộc đơn hàng đó.

3. GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG:
   - Hàm onOpen() tự động thêm Menu tùy chỉnh "🚀 Tự Động Hóa Kho" > "📄 Xuất Phiếu Giao Hàng PDF" lên thanh menu Google Sheets khi mở file.
   - Hiển thị hộp thoại Toast hoặc Alert thông báo rõ số lượng đơn hàng đã xuất thành công khi chạy xong.
   - Code viết theo chuẩn ES6 sạch sẽ, có khối try-catch bắt lỗi và chú thích tiếng Việt chi tiết từng hàm.
```
* **💡 Bí quyết:** Siêu Prompt này giải quyết triệt để 3 bài toán khó: xử lý ô gộp Merge Cells trên Sheets, chèn bảng động nhiều dòng trong Google Docs và tự động dọn dẹp file tạm trên Drive.

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








