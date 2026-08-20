# BÁO CÁO PHÂN TÍCH VÀ KHẮC PHỤC LỖI CODE APPS SCRIPT BÀI SỐ 7
> **Hệ thống:** Quản lý bán hàng & Dashboard Tech Hub Store  
> **Tài liệu tham chiếu quy tắc:** `QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md`  
> **Thời gian tạo:** 2026-08-19  

---

## I. TỔNG QUAN HIỆN TƯỢNG VÀ NGUYÊN NHÂN GỐC RỄ (ROOT CAUSES)

Khi bạn sử dụng mã do AI (Gemini Spark) sinh ra, hệ thống gặp 2 hiện tượng chính:
1. **Bấm "📊 Dashboard Tổng Quan" hoặc "Làm mới":** Biểu đồ tròn và cột không hiển thị dữ liệu hoặc báo lỗi trên ô tính, chỉ số KPI bị lỗi `#VALUE!`/`#ERROR!`.
2. **Bấm "🛍️ Quản Lý Sản Phẩm", "👥 Quản Lý Khách Hàng", "📦 Quản Lý Đơn Hàng":** Hoàn toàn không thấy cửa sổ giao diện nào bật lên.

Dưới đây là bảng tóm tắt 5 nhóm lỗi cốt lõi được phát hiện trong mã nguồn:

| STT | Vị trí lỗi | Hiện tượng | Nguyên nhân kỹ thuật |
|---|---|---|---|
| **1** | Các hàm `openProductManager()`, `openCustomerManager()`, `openOrderManager()` | Bấm menu không hiện cửa sổ | **Thiếu file HTML** trong dự án Apps Script (`ProductManagement.html`, `CustomerManagement.html`, `OrderManagement.html`). Đồng thời khối `try...catch` nuốt lỗi ngầm. |
| **2** | `initDashboard()` - Chuỗi công thức `Calc_Data` | Biểu đồ không có dữ liệu, ô tính lỗi `#ERROR!` | Lỗi gõ dư dấu gạch chéo `\\\\` thành `\\` trong ô tính Google Sheets khi ghép mảng. |
| **3** | `initDashboard()` - Ô KPI Cảnh Báo Tồn Kho | Ô KPI báo `#ERROR!` hoặc `#VALUE!` | Hàm `COUNTIF` trong Google Sheets không chấp nhận mảng ảo từ `ARRAYFORMULA` làm dải ô tìm kiếm. |
| **4** | Toàn bộ Backend CRUD (`getProducts`, `getCustomers`, `getOrders`) | Giao diện không tải được dữ liệu, lỗi JS Client | AI bị nuốt chỉ số index mảng (ví dụ: `row` thay vì `row[1]`, `row[2]`, `row[3]`). |
| **5** | Khởi tạo Biểu đồ (`dashSheet.newChart()`) | Biểu đồ không nhận tiêu đề hoặc sai loại biểu đồ | Thiếu `.setNumHeaders(1)` và chưa áp dụng đúng API `Charts.ChartType`. |

---

## II. CHI TIẾT CÁC LỖI KỸ THUẬT VÀ CÁCH KHẮC PHỤC

### 1. Lỗi Thiếu File HTML Giao Diện (Nguyên nhân làm tê liệt các menu Quản lý)
* **Đoạn mã lỗi của AI:**
  ```javascript
  function openProductManager() {
    try {
      var html = HtmlService.createHtmlOutputFromFile("ProductManagement")
        .setWidth(920).setHeight(660).setTitle("🛍️ Quản Lý Sản Phẩm - Tech Hub Store");
      SpreadsheetApp.getUi().showModalDialog(html, " ");
    } catch (e) {
      Logger.log("Lỗi mở Product Manager: " + e.toString()); // Nuốt lỗi ngầm vào Log
    }
  }
  ```
* **Phân tích:** 
  * Hàm `HtmlService.createHtmlOutputFromFile("ProductManagement")` yêu cầu trong Trình biên tập Apps Script bắt buộc phải có tệp HTML tên là `ProductManagement.html`.
  * AI chỉ xuất ra 1 file JavaScript (`Code.gs`) duy nhất mà không hướng dẫn tạo các file HTML tương ứng, hoặc dự án của bạn chưa tạo 3 tệp HTML này.
  * Khối `try...catch` đã bắt ngoại lệ `File not found` và chỉ in vào `Logger.log`, khiến giao diện hoàn toàn không có phản hồi gì khi bấm vào.
* **Cách khắc phục:**
  1. Trong Apps Script Editor, bấm dấu `+` chọn **HTML**, tạo 3 tệp: `ProductManagement.html`, `CustomerManagement.html`, `OrderManagement.html`.
  2. Copy nội dung HTML chuẩn (đã có sẵn trong thư mục `add script/bai7/`).

---

### 2. Lỗi Ký Tự Escape Trong Công Thức Mảng (Nguyên nhân làm hỏng Biểu đồ Dashboard)
* **Đoạn mã lỗi của AI:**
  ```javascript
  // SAI: AI dùng 4 dấu gạch chéo ngược "\\\\" trong chuỗi JS
  var catFormula = '=QUERY({ARRAYFORMULA(IFERROR(VLOOKUP(...); ""))\\\\ ChiTietDonHang_BT7!H4:H}; "select Col1, sum(Col2)...")';
  var top10Formula = '=QUERY({ChiTietDonHang_BT7!D4:D\\\\ ChiTietDonHang_BT7!F4:F}; "select Col1, sum(Col2)...")';
  ```
* **Phân tích:**
  * Trong JavaScript, chuỗi `"\\\\"` sau khi parse sẽ biến thành `\\` (2 dấu gạch chéo).
  * Khi hàm `.setFormula(catFormula)` đẩy công thức vào Google Sheets, ô tính sẽ nhận:
    `=QUERY({ARRAYFORMULA(...) \\ ChiTietDonHang_BT7!H4:H}; ...)`
  * Google Sheets chỉ chấp nhận **1 dấu `\`** để ghép 2 cột ngang trong Locale Việt Nam. Dấu `\\` làm sai cú pháp, bảng `Calc_Data` sinh lỗi `#ERROR!`, dẫn đến 2 biểu đồ tròn và cột không có dữ liệu để vẽ.
* **Cách khắc phục:**
  Trong chuỗi JS, chỉ cần dùng 2 dấu gạch chéo `'\\'` để xuất ra đúng 1 dấu `\` trên ô tính:
  ```javascript
  // ĐÚNG:
  var catFormula = '=QUERY(ARRAYFORMULA({IFERROR(VLOOKUP(VLOOKUP(ChiTietDonHang_BT7!C4:C; SanPham_BT7!A:C; 3; FALSE); DanhMuc_BT7!A:B; 2; FALSE); "Chưa Rõ") \\ ChiTietDonHang_BT7!H4:H}); "SELECT Col1, SUM(Col2) WHERE Col2 IS NOT NULL GROUP BY Col1 LABEL SUM(Col2) \'\'")';
  ```

---

### 3. Lỗi Hàm `COUNTIF` Không Hỗ Trợ Mảng Ảo (Lỗi ô Cảnh báo tồn kho)
* **Đoạn mã lỗi của AI:**
  ```javascript
  // SAI: COUNTIF không nhận ARRAYFORMULA làm tham số Range
  formula: '=COUNTIF(ARRAYFORMULA(IF(SanPham_BT7!A4:A<>""; SanPham_BT7!F4:F < SanPham_BT7!G4:G; FALSE)); TRUE)'
  ```
* **Phân tích:**
  * Cú pháp Google Sheets quy định tham số thứ 1 của `COUNTIF(range; criterion)` phải là một **Dải ô địa chỉ thực (Cell Range)** trên trang tính (ví dụ `A4:A100`), không thể là kết quả tính toán mảng tạm thời từ `ARRAYFORMULA`.
* **Cách khắc phục:**
  Dùng hàm `SUMPRODUCT` kết hợp biểu thức logic nhân mảng:
  ```javascript
  // ĐÚNG:
  formula: '=SUMPRODUCT((SanPham_BT7!F4:F < SanPham_BT7!G4:G)*(SanPham_BT7!F4:F <> ""))'
  ```

---

### 4. Lỗi Mất Index Phần Tử Mảng Trong Backend API (Code.gs)
* **Đoạn mã lỗi của AI:**
  ```javascript
  // SAI: AI viết `row` thay vì `row[1]`, `row[2]`, `row[3]`
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    var id = String(row[0]);
    var name = String(row);  // LỖI: row là cả mảng! Lẽ ra là row[1]
    filtered.push({
      id: id,
      name: name,
      catId: row,            // LỖI: Lẽ ra là row[2]
      unit: row,             // LỖI: Lẽ ra là row[3]
      ...
    });
  }
  ```
* **Phân tích:**
  * Hiện tượng này rất hay gặp khi AI bị lỗi sinh Markdown hoặc tự động nén mã, làm mất chỉ mục `[1]`, `[2]`, `[3]`.
  * Hậu quả là object trả về cho trang HTML có `name: ["SP001", "Chuột Logitech", "DM01", ...]`, khiến bảng dữ liệu HTML không hiển thị được tên hoặc lỗi crash giao diện JavaScript.
* **Cách khắc phục:**
  Đảm bảo truy xuất chính xác từng cột theo chỉ mục 0-indexed: `row[0]` (Mã), `row[1]` (Tên), `row[2]` (Danh mục), `row[3]` (Đơn vị tính), `row[4]` (Giá), `row[5]` (Tồn kho), `row[6]` (Tồn tối thiểu).

---

## III. BỘ MÃ NGUỒN CHUẨN ĐÃ ĐƯỢC SỬA LỖI 100%

Trong dự án của bạn, bộ mã chuẩn hoàn chỉnh đã được xây dựng sẵn trong thư mục `add script/bai7/`. Cụ thể:

1. **Backend Script:** [`add script/bai7/tool1.gs`](file:///d:/AI_10_Basic/add%20script/bai7/tool1.gs)  
   - Đã sửa toàn bộ công thức chuẩn Locale Việt Nam (`SUMPRODUCT`, `QUERY`, `XLOOKUP`, `LET`).
   - Đã tối ưu cấu hình vẽ biểu đồ tròn hiển thị đường chỉ dẫn (`labeled`) và biểu đồ cột Top 10.
   - Toàn bộ CRUD Sản phẩm, Khách hàng, Đơn hàng, Lịch sử kho đều chạy an toàn theo chuẩn Batch Operations.

2. **Giao diện HTML Modal:**
   - [`add script/bai7/ProductManagement.html`](file:///d:/AI_10_Basic/add%20script/bai7/ProductManagement.html) (Quản lý Sản phẩm)
   - [`add script/bai7/CustomerManagement.html`](file:///d:/AI_10_Basic/add%20script/bai7/CustomerManagement.html) (Quản lý Khách hàng)
   - [`add script/bai7/OrderManagement.html`](file:///d:/AI_10_Basic/add%20script/bai7/OrderManagement.html) (Quản lý & Tạo Đơn hàng)

---

## IV. HƯỚNG DẪN 4 BƯỚC CÀI ĐẶT ĐỂ CHẠY THÀNH CÔNG TRÊN GOOGLE SHEETS

### Bước 1: Mở Trình biên tập Apps Script
1. Trên Google Sheets Bài số 7, vào menu **Tiện ích mở rộng (Extensions)** > **Apps Script**.

### Bước 2: Dán mã Backend (`Code.gs`)
1. Mở file `Code.gs` trong Apps Script.
2. Xóa toàn bộ mã cũ và copy toàn bộ nội dung từ file [`add script/bai7/tool1.gs`](file:///d:/AI_10_Basic/add%20script/bai7/tool1.gs) dán vào.

### Bước 3: Tạo 3 File HTML Giao Diện
Bấm vào dấu **+** cạnh mục *Files (Tệp)* > chọn **HTML** và tạo lần lượt 3 tệp với tên chính xác:
1. `ProductManagement` -> Copy nội dung từ [`add script/bai7/ProductManagement.html`](file:///d:/AI_10_Basic/add%20script/bai7/ProductManagement.html) dán vào.
2. `CustomerManagement` -> Copy nội dung từ [`add script/bai7/CustomerManagement.html`](file:///d:/AI_10_Basic/add%20script/bai7/CustomerManagement.html) dán vào.
3. `OrderManagement` -> Copy nội dung từ [`add script/bai7/OrderManagement.html`](file:///d:/AI_10_Basic/add%20script/bai7/OrderManagement.html) dán vào.

### Bước 4: Lưu và Khởi chạy
1. Nhấn nút **Save (Lưu)** (biểu tượng đĩa mềm hoặc `Ctrl + S`).
2. Chọn hàm `onOpen` và nhấn **Run (Chạy)** một lần để cấp quyền truy cập (Authorization).
3. Quay lại Google Sheets, reload lại trang tính (F5). Menu `🏪 Tech Hub Store` sẽ xuất hiện đầy đủ các tính năng:
   - Bấm **📊 Dashboard Tổng Quan**: Trang Dashboard sẽ tự động tạo banner, 4 ô KPI, 2 biểu đồ phân tích và bảng tra cứu đơn hàng.
   - Bấm **🛍️ Quản Lý Sản Phẩm / Khách Hàng / Đơn Hàng**: Cửa sổ giao diện hiện đại sẽ bật lên với đầy đủ chức năng Thêm, Sửa, Xóa, Tìm kiếm, Phân trang và Tự động trừ kho.
