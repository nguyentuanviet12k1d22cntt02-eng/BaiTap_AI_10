# HƯỚNG DẪN BÀI THỰC HÀNH 2 (PROMPT-DRIVEN)
## RA LỆNH CHO AI AGENT XUẤT PHIẾU GIAO HÀNG PDF ĐA SẢN PHẨM & LƯU VÀO GOOGLE DRIVE

---

### 📖 1. Tình Huống Doanh Nghiệp Thực Tế (Case Study Context)
* **Bối cảnh:** Bạn là Nhân viên Quản lý Kho vận hoặc Kế toán Bán hàng tại công ty phân phối thiết bị công nghệ. Mỗi ngày công ty phát sinh từ 50 đến 100 đơn hàng. Trong thực tế, **mỗi đơn hàng có thể có nhiều sản phẩm khác nhau** (ví dụ: 1 máy Laptop + 1 Chuột + 1 Balo chống sốc).
* **Nỗi đau khi làm thủ công (Before):** Nhân viên phải mở từng dòng trên Sheet, tìm các dòng có cùng Mã Đơn, kẻ bảng trong Word, copy từng sản phẩm, số lượng, đơn giá, tính tổng tiền, bấm Save As PDF, đặt tên file rồi upload vào Google Drive. Mất 2-3 tiếng mỗi ngày và rất dễ gõ nhầm số tiền hoặc bỏ sót sản phẩm của khách.
* **Giải pháp AI Tự động (After):** Ra lệnh cho AI Agent tạo sẵn nút bấm `🚀 Xuất Phiếu Giao Hàng PDF` trên Google Sheets. Bấm 1 click là hệ thống tự gom nhóm các sản phẩm theo từng đơn hàng, tự động chèn bảng danh sách hàng hóa vào mẫu Google Docs, xuất thành PDF lưu thẳng vào Drive và cập nhật link vào bảng tính trong 30 giây.

---

### 🪄 2. Quy Trình Ra Lệnh Từng Bước Cho SPARK / AI Agent

#### 📍 BƯỚC 1: Kiểm Tra Xem SPARK Có Thật Sự Đang Đọc Được File Hay Không
* **Mục đích:** Trước khi yêu cầu AI viết mã Apps Script tự động hóa phức tạp, hãy gửi đường link Google Sheets của bạn và kiểm tra xem AI (SPARK / Gemini) có thực sự truy cập và đọc được đầy đủ dữ liệu trong bảng hay không.
* **Câu Prompt gửi cho SPARK:**
```text
https://docs.google.com/spreadsheets/d/19jPP-MwIMPjeDfViicF1jTQBxx-0ITP8HAwR6IqArPI/edit?gid=1426817910#gid=1426817910

bạn có thể đọc được nội dung của link này chứ
```
* **💡 Lưu ý quan trọng:** Đảm bảo file Google Sheets của bạn đã được bật chế độ chia sẻ (Share) là *"Bất kỳ ai có đường liên kết đều có thể xem"* để AI có thể đọc trực tiếp.

* **🎯 Kết quả phản hồi mẫu từ SPARK để đối chiếu:**
```text
Có, tôi có thể đọc được nội dung của tệp Google Sheets Du_Lieu_Mau_Tong_Hop.

Tệp này chứa các trang dữ liệu thực hành bao gồm:
1. DoanhThu_BT1: Dữ liệu doanh thu theo từng ngày trong tuần của các chi nhánh (Hà Nội, TP.HCM, Đà Nẵng, Cần Thơ, Đồng Nai).
2. DonHang_BT2: Thông tin đơn hàng (Mã đơn, Ngày đặt, Khách hàng, Sản phẩm, Số lượng, Đơn giá, Thành tiền, Trạng thái và Link PDF).
3. BangLuong_BT3: Bảng lương nhân viên (Mã NV, Họ tên, Phòng ban, Lương cơ bản, Phụ cấp, Thưởng, Khấu trừ, Thực lĩnh).
4. DonNghiPhep_BT4: Đơn đăng ký nghỉ phép của nhân viên (Thời gian, Lý do, Số ngày nghỉ, Trạng thái duyệt).
5. RawData_BT5: Dữ liệu thô các giao dịch (Mã giao dịch, Khách hàng, Kênh bán hàng, Doanh thu, Ngày tạo).

Bạn cần hỗ trợ phân tích, xử lý hoặc trích xuất thông tin gì từ tệp này?
```
*(Học viên kiểm tra thấy SPARK liệt kê chính xác 5 sheet như trên là đã kết nối dữ liệu thành công).*

---

#### 📍 BƯỚC 2: Yêu Cầu AI Phân Tích Cấu Trúc Bảng & Tọa Độ Dữ Liệu (DonHang_BT2)
* **Mục đích:** Ra lệnh cho AI (SPARK / Gemini) bóc tách cấu trúc cột, phạm vi hàng (tiêu đề, dòng bắt đầu dữ liệu), các trường thông tin đơn hàng và cơ chế gom nhóm sản phẩm. Việc này giúp đảm bảo AI nắm chính xác 100% tọa độ ô trước khi sinh mã Apps Script.
* **Câu Prompt gửi cho SPARK:**
```text
hãy phân tích nội dung trong DonHang_BT2 bao gồm những giá trị nào, hàng nào cột nào trong trang
```
* **💡 Lưu ý / Mẹo:** Giúp AI nhận diện đúng các cột quan trọng từ A đến L (*Mã Đơn, Ngày Đặt, Khách Hàng, Sản Phẩm, Số Lượng, Đơn Giá, Thành Tiền, Trạng Thái, Link PDF*) và cơ chế xử lý các đơn hàng có nhiều sản phẩm.

* **🎯 Kết quả phản hồi mẫu từ SPARK để đối chiếu:**
```text
Trang dữ liệu DonHang_BT2 trong tệp Du_Lieu_Mau_Tong_Hop là bảng quản lý chi tiết các đơn hàng mua sắm thiết bị và phụ kiện công nghệ.

Cấu trúc chi tiết về hàng, cột và các giá trị dữ liệu như sau:
1. Cấu trúc Cột (12 Cột: Cột A – Cột L):
   - Cột A (Mã Đơn): Mã định danh của đơn hàng (ví dụ: DH-2026-001, DH-2026-002, ..., DH-2026-007).
   - Cột B (Ngày Đặt): Ngày khách hàng đặt hàng (09/08/2026, 10/08/2026, 11/08/2026).
   - Cột C (Tên Khách Hàng): Họ và tên người mua (Nguyễn Văn An, Trần Thị Bích, Lê Hoàng Long, Phạm Minh Trang...).
   - Cột D (Số Điện Thoại): SĐT liên hệ (0988123456, 0903987654...).
   - Cột E (Địa Chỉ Giao Hàng): Địa chỉ giao hàng tại các tỉnh/thành (Hà Nội, TP.HCM, Đà Nẵng).
   - Cột F -> L: Tên Sản Phẩm, ĐVT, Số Lượng, Đơn Giá, Thành Tiền, Trạng Thái và Link File PDF.
```
*(Học viên kiểm tra thấy SPARK phân tích chính xác 12 cột như trên là hoàn thành Bước 2).*

---

#### 📍 BƯỚC 3: Ra Lệnh Cho AI Tạo Biểu Mẫu Google Docs Chuẩn ("Siêu Prompt")
* **Mục đích:** Sử dụng Siêu Prompt chi tiết để yêu cầu SPARK / AI Agent tự động tạo ra một tệp Google Docs mẫu mang tên *"PHIẾU XUẤT KHO KIÊM GIAO HÀNG"* với đầy đủ khung tiêu đề quốc hiệu, bảng chi tiết 6 cột, phần thanh toán, chữ ký và các placeholder `{{...}}`.
* **Câu Prompt gửi cho SPARK:**
```text
Hãy tạo một Google Docs template theo đúng cấu trúc của mẫu phiếu xuất kho trong hình tham chiếu.

Mục tiêu: tạo một biểu mẫu "PHIẾU XUẤT KHO KIÊM GIAO HÀNG" có bố cục gọn, chuyên nghiệp, dễ in trên 1 trang A4.

Yêu cầu bố cục:

1. PHẦN ĐẦU TRANG
- Căn giữa.
- Dòng 1: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", in đậm.
- Dòng 2: "Độc lập - Tự do - Hạnh phúc", in đậm.
- Bên dưới có một đường gạch ngang ngắn, căn giữa.
- Cách một khoảng nhỏ rồi đến tiêu đề:
  "PHIẾU XUẤT KHO KIÊM GIAO HÀNG"
- Tiêu đề lớn, in đậm, căn giữa.

2. THÔNG TIN KHÁCH HÀNG
- Tiêu đề "THÔNG TIN KHÁCH HÀNG:" in đậm.
- Bên dưới gồm 5 dòng:
  • Mã đơn hàng: {{Mã Đơn}}
  • Ngày đặt: {{Ngày Đặt}}
  • Tên khách hàng: {{Tên Khách Hàng}}
  • Số điện thoại: {{Số Điện Thoại}}
  • Địa chỉ giao hàng: {{Địa Chỉ Giao Hàng}}

- Các placeholder {{...}} phải được giữ nguyên để sau này Google Apps Script có thể thay thế tự động.

3. BẢNG CHI TIẾT SẢN PHẨM
Tạo một bảng 6 cột:

STT | Tên Sản Phẩm | ĐVT | Số Lượng | Đơn Giá (VNĐ) | Thành Tiền (VNĐ)

Ngay bên dưới là một dòng mẫu:

{{STT}} | {{Tên Sản Phẩm}} | {{ĐVT}} | {{Số Lượng}} | {{Đơn Giá}} | {{Thành Tiền}}

Yêu cầu bảng:
- Có đường viền mảnh.
- Hàng tiêu đề có nền xám rất nhạt.
- Hàng tiêu đề in đậm.
- STT, ĐVT, Số Lượng căn giữa.
- Tên sản phẩm căn trái.
- Đơn giá và Thành tiền căn phải.
- Chiều rộng các cột cân đối để vừa trang A4.
- Không để bảng quá rộng hoặc sát mép trang.

4. PHẦN THANH TOÁN
Bên dưới bảng, tạo khoảng cách vừa phải.

- Dòng:
  "TỔNG CỘNG THANH TOÁN: {{Tổng Tiền}} VNĐ"
- Căn phải.
- In đậm.

Bên dưới:
"Số tiền bằng chữ: ........................................................................................................"

- Căn trái.
- Chữ nghiêng nhẹ.

5. PHẦN CHỮ KÝ
Ở cuối trang tạo khu vực chữ ký gồm 2 cột bằng nhau:

NGƯỜI NHẬN HÀNG                    NGƯỜI LẬP PHIẾU

(Ký, ghi rõ họ tên)                    (Ký, ghi rõ họ tên)

- Hai tiêu đề căn giữa trong từng cột.
- Không hiển thị đường viền của bảng chữ ký.
- Chừa khoảng trống đủ để ký tay.
- Hai bên phải cân đối.

6. PHONG CÁCH TOÀN BỘ TÀI LIỆU
- Khổ giấy A4.
- Bố cục dọc.
- Font Arial.
- Màu chữ đen.
- Thiết kế tối giản, giống biểu mẫu hành chính/văn phòng.
- Không thêm logo, hình ảnh, màu sắc hoặc nội dung không được yêu cầu.
- Khoảng cách giữa các phần vừa phải.
- Ưu tiên bố cục giống hình tham chiếu.
- Toàn bộ biểu mẫu phải cố gắng nằm gọn trên 1 trang A4.

Quan trọng:
Đây là TEMPLATE nên phải giữ nguyên tất cả placeholder dạng {{...}}.
Không thay placeholder bằng dữ liệu giả.
```
* **💡 Lưu ý:** Đảm bảo giữ nguyên các placeholder dạng `{{...}}` để Apps Script nhận diện và điền dữ liệu tự động.
* **🎯 Kết quả đối chiếu:** Tệp mẫu `PHIẾU XUẤT KHO KIÊM GIAO HÀNG - Template` được tạo thành công trên Google Drive và bố cục trên Google Docs đạt chuẩn A4.

---

#### 📍 BƯỚC 4: Ra Lệnh Cho AI Viết Mã Google Apps Script Tự Động Hóa Xuất PDF
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
  1. *Hình 1:* Giao diện Apps Script khi chọn hàm `exportPDF` và bấm Chạy (Run).
  2. *Hình 2:* Thư mục Google Drive `Xuat_Hoa_Don` chứa đầy đủ các file Hóa đơn PDF đã được xuất tự động.








