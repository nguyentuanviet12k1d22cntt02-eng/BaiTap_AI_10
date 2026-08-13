# BÀI 7: HỆ THỐNG QUẢN LÝ BÁN HÀNG PRO & BIỂU ĐỒ THỐNG KÊ TRỰC QUAN

## 🎯 MỤC TIÊU HỌC TẬP

Sau khi hoàn thành bài thực hành này, học viên sẽ:

1. **Hiểu cấu trúc dữ liệu** của hệ thống quản lý bán hàng thực tế (6 bảng liên kết)
2. **Ra lệnh cho Gemini Spark** xây dựng dashboard quản lý với giao diện đẹp mắt
3. **Viết Prompt chuẩn** để AI tự động tạo menu điều hướng và biểu đồ thống kê
4. **Tích hợp Apps Script** vào Google Sheets để tự động hóa nghiệp vụ
5. **Xây dựng biểu đồ phân tích** doanh thu, sản phẩm bán chạy, khách hàng VIP

---

## 📖 TÌNH HUỐNG DOANH NGHIỆP THỰC TẾ

### Bối cảnh:

**Công ty Tech Hub Store** kinh doanh thiết bị công nghệ (Laptop, Màn hình, Phụ kiện...) với:
- **66 sản phẩm** thuộc 7 danh mục
- **30 khách hàng** (40% VIP, 60% Thường)
- **30 đơn hàng** trong tháng 8/2026
- **56 dòng chi tiết** đơn hàng
- **35 giao dịch** nhập/xuất kho

### Vấn đề hiện tại:

🔴 **NỖI ĐAU KHI QUẢN LÝ THỦ CÔNG:**
- Quản lý Sơ Mi phải **mở 6 sheet khác nhau** để tra cứu thông tin đơn hàng, sản phẩm, khách hàng
- Không có **giao diện tổng quan** để xem nhanh tình trạng kinh doanh
- Khó khăn trong việc **thống kê sản phẩm bán chạy**, doanh thu theo danh mục
- Không biết **khách hàng VIP nào** mua nhiều nhất để chăm sóc
- Tốn **30-45 phút mỗi ngày** chỉ để tổng hợp báo cáo thủ công
- Tồn kho không được **cảnh báo** khi sắp hết hàng

### Giải pháp AI tự động:

✅ **SAU KHI ÁP DỤNG HỆ THỐNG TỰ ĐỘNG HÓA:**
- **Dashboard tổng quan** hiển thị toàn bộ số liệu quan trọng trên 1 màn hình
- **Menu điều hướng đẹp mắt** giúp truy cập nhanh 6 sheet dữ liệu
- **Biểu đồ tự động** phân tích doanh thu, TOP sản phẩm, phân khúc khách hàng
- **Cảnh báo tồn kho** tự động khi sản phẩm sắp hết
- **Tìm kiếm thông minh** đơn hàng, khách hàng chỉ trong 2 giây
- Tiết kiệm **90% thời gian** làm báo cáo

---

## 🗂️ CẤU TRÚC DỮ LIỆU HỆ THỐNG (6 SHEETS)

```
📊 bai_tap_7_quan_ly_ban_hang.xlsx
├── 🟣 DanhMuc_BT7         (7 danh mục sản phẩm)
├── 🔵 SanPham_BT7          (66 sản phẩm đa dạng)
├── 🟢 KhachHang_BT7        (30 khách hàng)
├── 🔴 DonHang_BT7          (30 đơn hàng)
├── 🟠 ChiTietDonHang_BT7   (56 dòng chi tiết)
└── ⚫ LichSuTonKho_BT7     (35 giao dịch nhập/xuất)
```

### Quan hệ giữa các bảng:

```
DanhMuc ──(1:N)──> SanPham
                      │
                      ├──(1:N)──> ChiTietDonHang ──(N:1)──> DonHang ──(N:1)──> KhachHang
                      │
                      └──(1:N)──> LichSuTonKho
```

---

## 🎨 GIAO DIỆN DASHBOARD MỤC TIÊU

```
┌─────────────────────────────────────────────────────────────┐
│  🏪 TECH HUB STORE - DASHBOARD QUẢN LÝ                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📊 TỔNG QUAN KINH DOANH THÁNG 8/2026                       │
│  ┌──────────┬──────────┬──────────┬──────────┐            │
│  │💰 Doanh  │📦 Đơn    │👥 Khách  │⚠️ Cảnh   │            │
│  │   Thu    │   Hàng   │   Hàng   │   Báo    │            │
│  │ 500tr    │   30     │   30     │   5 SP   │            │
│  └──────────┴──────────┴──────────┴──────────┘            │
│                                                             │
│  📈 BIỂU ĐỒ DOANH THU THEO DANH MỤC                         │
│  [Biểu đồ cột/tròn tự động]                                │
│                                                             │
│  🏆 TOP 10 SẢN PHẨM BÁN CHẠY                                │
│  [Bảng tự động sắp xếp]                                    │
│                                                             │
│  ⭐ KHÁCH HÀNG VIP MUA NHIỀU NHẤT                           │
│  [Danh sách tự động]                                       │
│                                                             │
│  🔍 [Tìm kiếm đơn hàng]  📋 [Xuất báo cáo]                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧠 KHUNG PROMPT CHUẨN CHO GEMINI SPARK

### MASTER PROMPT - Hệ Thống Quản Lý Bán Hàng Toàn Diện

```markdown
═══════════════════════════════════════════════════════════════
🎯 THÔNG TIN DỰ ÁN
═══════════════════════════════════════════════════════════════

BẠN LÀ: Chuyên gia Apps Script và Tự động hóa Google Sheets

NGỮ CẢNH:
• File: bai_tap_7_quan_ly_ban_hang.xlsx
• Cấu trúc: 6 sheets liên kết (DanhMuc, SanPham, KhachHang, DonHang, ChiTietDonHang, LichSuTonKho)
• Mục tiêu: Xây dựng hệ thống quản lý HOÀN CHỈNH với Dashboard + CRUD Interface
• **QUAN TRỌNG**: Sử dụng dấu CHẤM PHẨY (;) trong tất cả công thức Google Sheets (định dạng Việt Nam)

⚠️  CỰC KỲ QUAN TRỌNG - QUY TẮC GOOGLE SHEETS VIỆT NAM:
════════════════════════════════════════════════════════════════
1. SEPARATOR: Dấu CHẤM PHẨY (;) thay vì dấu phẩy (,)
   • Công thức: =SUM(A1; A2) ✅ KHÔNG PHẢI =SUM(A1, A2) ❌
   • QUERY: "SELECT Col1; SUM(Col2)" ✅
   • VLOOKUP: VLOOKUP(key; range; col; FALSE) ✅

2. NUMBER FORMAT: Dùng dấu chấm phẩy (;)
   • Đúng: #;##0 "VNĐ" ✅
   • Sai: #,##0 "VNĐ" ❌

3. JAVASCRIPT ARRAY (ngoại lệ): Vẫn dùng dấu phẩy
   • setValues([["A", "B"]]) ✅ - Đây là JavaScript, không phải công thức

4. ESCAPE BACKSLASH trong QUERY LABEL:
   ⚠️  NGUY HIỂM: JavaScript string cần 1 backslash, KHÔNG PHẢI 2!
   • SAI: LABEL SUM(Col2) '\\''  → Tạo ra \\ trong Sheets → LỖI #ERROR!
   • ĐÚNG: LABEL SUM(Col2) '\''  → Tạo ra \ (empty label) → OK
   
   Giải thích:
   - JavaScript: "\\'" = backslash + quote (2 ký tự)
   - Sheets nhận: \ và ' riêng biệt → LỖI cú pháp
   - JavaScript: "\'" = chỉ quote thôi (escape không cần \)
   - Sheets nhận: '' = empty label → ĐÚNG

5. QUY TẮC LABEL TRONG QUERY:
   • Ẩn label: LABEL Col1 '', SUM(Col2) ''  ✅
   • Đặt tên: LABEL Col1 'Tên Cột'  ✅
   • TUYỆT ĐỐI KHÔNG dùng: LABEL Col1 '\\''  ❌
════════════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════════
📊 PHẦN 1: DASHBOARD TỔNG QUAN
═══════════════════════════════════════════════════════════════

1️⃣ TẠO SHEET DASHBOARD
   • Tên: "📊 Dashboard"
   • Vị trí: Sheet đầu tiên (index 0)
   • Chiều cao dòng 1: 50px
   • Header: "🏪 TECH HUB STORE - DASHBOARD QUẢN LÝ"
   • Màu nền header: #1E40AF (xanh dương đậm)
   • Chữ: 20pt, Bold, màu trắng

2️⃣ MENU ĐIỀU HƯỚNG (Hàng 3)
   Tạo 7 nút bấm nằm ngang, mỗi nút:
   
   📊 Dashboard        → Scroll về đầu sheet
   🛍️  Quản Lý Sản Phẩm → showProductManagement()
   👥 Quản Lý Khách    → showCustomerManagement()
   📦 Quản Lý Đơn Hàng  → showOrderManagement()
   📈 Báo Cáo          → createReport()
   🔄 Làm Mới          → refreshDashboard()
   ❓ Hướng Dẫn        → showHelp()
   
   Định dạng nút:
   • Kích thước: 150px x 40px
   • Bo tròn: 8px
   • Font: 11pt, Bold
   • Màu chữ: Trắng
   • Màu nền: Theo icon (xanh dương, tím, xanh lá, đỏ, cam, xám, cyan)
   • Shadow: 0 2px 4px rgba(0,0,0,0.2)

3️⃣ THỐNG KÊ TỔNG QUAN (Hàng 5-7)
   4 ô thống kê nằm ngang:
   
   ┌─────────────────┐  ┌─────────────────┐
   │ 💰 DOANH THU    │  │ 📦 ĐƠN HÀNG     │
   │                 │  │                 │
   │   500,000,000   │  │      30         │
   │      VNĐ        │  │     đơn         │
   └─────────────────┘  └─────────────────┘
   
   ┌─────────────────┐  ┌─────────────────┐
   │ 👥 KHÁCH HÀNG   │  │ ⚠️  CẢNH BÁO    │
   │                 │  │                 │
   │      30         │  │      5          │
   │    người        │  │   sản phẩm      │
   └─────────────────┘  └─────────────────┘
   
   Định dạng ô:
   • Kích thước: 200px x 100px
   • Icon: 14pt
   • Label: 10pt, đậm, màu xám #6B7280
   • Số liệu: 24pt, đậm, màu đen
   • Đơn vị: 10pt, màu xám
   • Nền: Gradient nhẹ #F8FAFC đến #EFF6FF
   • Viền: 1px solid #E5E7EB
   
   Công thức:
   • Doanh thu: =SUM(DonHang_BT7!E:E)
   • Đơn hàng: =COUNTA(DonHang_BT7!A:A)-1
   • Khách hàng: =COUNTA(KhachHang_BT7!A:A)-1
   • Cảnh báo: =SUMPRODUCT((SanPham_BT7!F2:F < SanPham_BT7!G2:G)*(SanPham_BT7!F2:F <> ""))
   
   ⚠️  LƯU Ý ĐỊNH DẠNG SỐ (VIỆT NAM):
   • Doanh thu: setNumberFormat('#;##0 "VNĐ"')  ← DẤU CHẤM PHẨY
   • Đơn/Khách: setNumberFormat('#;##0')        ← DẤU CHẤM PHẨY

4️⃣ BIỂU ĐỒ DOANH THU THEO DANH MỤC (Hàng 9-25)
   Loại: Pie Chart (Biểu đồ tròn)
   Vị trí: Bên trái
   Kích thước: 500px x 400px
   
   Dữ liệu cần tính (dùng bảng phụ ẩn hoặc Apps Script):
   • Laptop & Máy Tính: 250tr
   • Màn Hình: 85tr
   • Bàn Phím & Chuột: 45tr
   • Âm Thanh: 65tr
   • Nội Thất: 30tr
   • Streaming: 15tr
   • Phụ Kiện: 10tr
   
   Cách tính:
   1. Từ ChiTietDonHang_BT7 lấy [Mã SP; Thành Tiền]
   2. JOIN với SanPham_BT7 qua Mã SP → lấy Mã Danh Mục
   3. JOIN với DanhMuc_BT7 qua Mã DM → lấy Tên Danh Mục
   4. SUM(Thành Tiền) GROUP BY Tên Danh Mục
   
   Code mẫu (DÙNG DẤU CHẤM PHẨY - KHÔNG DÙNG BACKSLASH):
   ```javascript
   calcSheet.getRange("A2").setFormula(
     '=QUERY(ARRAYFORMULA({IFERROR(VLOOKUP(VLOOKUP(ChiTietDonHang_BT7!B2:B; SanPham_BT7!A:C; 3; FALSE); DanhMuc_BT7!A:B; 2; FALSE); "Chưa Rõ"); ChiTietDonHang_BT7!E2:E}); "SELECT Col1; SUM(Col2) WHERE Col1 IS NOT NULL GROUP BY Col1 LABEL SUM(Col2) \'\'")'
   );
   ```
   
   ⚠️  LƯU Ý: LABEL SUM(Col2) '\'' nghĩa là empty label (ẩn tên cột)
   
   Định dạng biểu đồ:
   • Tiêu đề: "Doanh Thu Theo Danh Mục Sản Phẩm"
   • Font tiêu đề: 14pt, đậm
   • Legend: Bottom
   • Data labels: Hiện % và giá trị
   • Colors: Palette mặc định hoặc custom

5️⃣ BIỂU ĐỒ TOP 10 SẢN PHẨM BÁN CHẠY (Hàng 9-25)
   Loại: Bar Chart (Biểu đồ cột ngang)
   Vị trí: Bên phải biểu đồ tròn
   Kích thước: 500px x 400px
   
   Dữ liệu cần tính:
   • Cáp HDMI 2.1: 12 cái
   • Bàn phím Keychron: 8 cái
   • Ổ cứng SSD Samsung: 7 cái
   • Laptop Dell XPS: 3 cái
   • ...
   
   Cách tính:
   1. Từ ChiTietDonHang_BT7 lấy [Tên SP; Số Lượng]
   2. SUM(Số Lượng) GROUP BY Tên SP
   3. ORDER BY SUM DESC
   4. LIMIT 10
   
   Code mẫu (DÙNG DẤU CHẤM PHẨY - KHÔNG DÙNG BACKSLASH):
   ```javascript
   calcSheet.getRange("D2").setFormula(
     '=QUERY(ARRAYFORMULA({IFERROR(VLOOKUP(ChiTietDonHang_BT7!B2:B; SanPham_BT7!A:B; 2; FALSE); "Chưa Rõ"); ChiTietDonHang_BT7!D2:D}); "SELECT Col1; SUM(Col2) WHERE Col1 IS NOT NULL GROUP BY Col1 ORDER BY SUM(Col2) DESC LIMIT 10 LABEL SUM(Col2) \'\'")'
   );
   ```
   
   ⚠️  LƯU Ý: '\'' trong JavaScript = '' trong Sheets (empty label)
   
   Định dạng:
   • Tiêu đề: "TOP 10 Sản Phẩm Bán Chạy"
   • Trục X: Số lượng
   • Trục Y: Tên sản phẩm
   • Màu cột: #2563EB
   • Data labels: Hiện số lượng

6️⃣ BẢNG TOP 5 KHÁCH HÀNG VIP (Hàng 27-35)
   Vị trí: Dưới biểu đồ, căn giữa
   Kích thước: 800px width
   
   Cột:
   | STT | Tên Khách Hàng | Loại KH | Tổng Mua (VNĐ) | Số Đơn |
   |-----|----------------|---------|----------------|--------|
   | 1   | Nguyen Van An  | VIP     | 52,000,000     | 5      |
   | 2   | Tran Thi Bich  | VIP     | 45,000,000     | 3      |
   | ... | ...            | ...     | ...            | ...    |
   
   Cách tính:
   1. Từ DonHang_BT7 lấy [Mã KH; Tổng Tiền]
   2. JOIN với KhachHang_BT7 qua Mã KH → lấy Tên; Loại KH
   3. SUM(Tổng Tiền) và COUNT(Đơn) GROUP BY Mã KH
   4. ORDER BY SUM DESC LIMIT 5
   
   Code mẫu (DÙNG DẤU CHẤM PHẨY - KHÔNG DÙNG BACKSLASH):
   ```javascript
   dashSheet.getRange("A29").setFormula(
     '=LET(top; QUERY(DonHang_BT7!B2:E; "SELECT B; COUNT(A); SUM(D) WHERE B IS NOT NULL GROUP BY B ORDER BY SUM(D) DESC LIMIT 5 LABEL B \'\'; COUNT(A) \'\'; SUM(D) \'\'"); ' +
     'HSTACK(' +
     'SEQUENCE(ROWS(top)); ' +
     'MAP(INDEX(top;;1); LAMBDA(mkh; IFERROR(XLOOKUP(mkh; KhachHang_BT7!A:A; KhachHang_BT7!B:B); mkh))); ' +
     'MAP(INDEX(top;;1); LAMBDA(mkh; IFERROR(XLOOKUP(mkh; KhachHang_BT7!A:A; KhachHang_BT7!G:G); "Thường"))); ' +
     'INDEX(top;;3); ' +
     'INDEX(top;;2)' +
     '))'
   );
   ```
   
   ⚠️  LƯU Ý: LABEL B '\'' = empty label (không có tiêu đề cột)
   
   Định dạng:
   • Header: Nền #1E40AF, chữ trắng, 11pt đậm
   • Dòng lẻ: Nền trắng
   • Dòng chẵn: Nền #F8FAFC
   • Viền: 1px solid #E5E7EB
   • Số tiền: Căn phải, format #;##0 "VNĐ"  ← DẤU CHẤM PHẨY

7️⃣ TÌM KIẾM ĐƠN HÀNG (Hàng 37-40)
   Layout:
   [Nhập mã đơn hàng...] [🔍 Tìm Đơn]
   
   Khi click nút:
   • Lấy giá trị từ ô input
   • Tìm trong DonHang_BT7
   • Hiển thị Alert popup:
     ┌────────────────────────────────┐
     │ THÔNG TIN ĐƠN HÀNG DH-001     │
     ├────────────────────────────────┤
     │ Khách hàng: Nguyen Van An     │
     │ Ngày đặt: 01/08/2026          │
     │ Trạng thái: Hoàn Thành        │
     │ Tổng tiền: 34,100,000 VNĐ     │
     │                                │
     │ Sản phẩm:                      │
     │ • Laptop Dell XPS 15 (x1)     │
     │ • Chuột Logitech (x1)         │
     │                                │
     │          [OK]                  │
     └────────────────────────────────┘

═══════════════════════════════════════════════════════════════
🛍️  PHẦN 2: QUẢN LÝ SẢN PHẨM (HTML Dialog)
═══════════════════════════════════════════════════════════════

KHI CLICK NÚT "🛍️  Quản Lý Sản Phẩm" → Mở HTML Dialog

📐 KÍCH THƯỚC: 900px × 650px

🎨 CẤU TRÚC GIAO DIỆN:

<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

┌─────────────────────────────────────────────────────────┐
│ 🛍️  QUẢN LÝ SẢN PHẨM                    [✕ Đóng]      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [🔍 Tìm theo tên hoặc mã...]  [➕ Thêm]  [🔄 Làm mới] │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Mã   │Tên SP          │ DM │Giá (VNĐ) │Tồn│Thao tác│
│  ├───────────────────────────────────────────────────┤ │
│  │SP001 │Laptop Dell...  │DM01│32,000,000│15 │✏️ 🗑️ │ │
│  │SP002 │HP Envy 13      │DM01│24,000,000│ 8 │✏️ 🗑️ │ │
│  │SP003 │Màn hình Dell.. │DM02│ 8,500,000│24 │✏️ 🗑️ │ │
│  │ ...  │ ...            │... │ ...      │..│ ...  │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│        [◀ Trước]  Trang 1 / 7  [Sau ▶]                │
└─────────────────────────────────────────────────────────┘

✅ CHỨC NĂNG THÊM SẢN PHẨM:

Click [➕ Thêm] → Hiển thị Modal Bootstrap:

<div class="modal" id="addProductModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h5>➕ Thêm Sản Phẩm Mới</h5>
        <button type="button" class="btn-close"></button>
      </div>
      <div class="modal-body">
        <form id="productForm">
          <div class="mb-3">
            <label>Mã Sản Phẩm *</label>
            <input type="text" class="form-control" 
                   id="productCode" placeholder="SP###" required>
            <small class="text-muted">VD: SP067</small>
          </div>
          
          <div class="mb-3">
            <label>Tên Sản Phẩm *</label>
            <input type="text" class="form-control" 
                   id="productName" required>
          </div>
          
          <div class="mb-3">
            <label>Danh Mục *</label>
            <select class="form-select" id="category" required>
              <option value="">-- Chọn danh mục --</option>
              <option value="DM001">Laptop & Máy Tính</option>
              <option value="DM002">Màn Hình</option>
              <option value="DM003">Bàn Phím & Chuột</option>
              <option value="DM004">Âm Thanh</option>
              <option value="DM005">Nội Thất</option>
              <option value="DM006">Streaming</option>
              <option value="DM007">Phụ Kiện</option>
            </select>
          </div>
          
          <div class="row">
            <div class="col-md-6 mb-3">
              <label>Đơn Vị Tính *</label>
              <input type="text" class="form-control" 
                     id="unit" value="Chiếc">
            </div>
            <div class="col-md-6 mb-3">
              <label>Đơn Giá (VNĐ) *</label>
              <input type="number" class="form-control" 
                     id="price" min="0" required>
            </div>
          </div>
          
          <div class="row">
            <div class="col-md-6 mb-3">
              <label>Tồn Kho *</label>
              <input type="number" class="form-control" 
                     id="stock" min="0" required>
            </div>
            <div class="col-md-6 mb-3">
              <label>Tồn Tối Thiểu *</label>
              <input type="number" class="form-control" 
                     id="minStock" min="0" required>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary">❌ Hủy</button>
        <button type="button" class="btn btn-primary" 
                onclick="saveProduct()">💾 Lưu</button>
      </div>
    </div>
  </div>
</div>

📋 VALIDATION QUY TẮC:
• Mã SP: Bắt buộc, unique, regex ^SP\d{3}$
• Tên SP: Bắt buộc, min 5 ký tự, max 100 ký tự
• Danh Mục: Bắt buộc, phải tồn tại trong DanhMuc_BT7
• Đơn Giá: Số dương > 0
• Tồn Kho: Số nguyên >= 0
• Tồn Tối Thiểu: Số nguyên >= 0

🔄 SAU KHI LƯU:
1. Gọi google.script.run.addProduct(data)
2. Server thêm vào SanPham_BT7
3. Ghi log LichSuTonKho_BT7:
   • Loại: "Nhập Kho"
   • Số Lượng: {Tồn Kho}
   • Người: PropertiesService.getUserProperties().get('userName')
4. Toast: "✅ Đã thêm sản phẩm {Tên SP} thành công!"
5. Reload bảng dữ liệu

✏️  CHỨC NĂNG SỬA SẢN PHẨM:

Click icon ✏️  → Modal giống Thêm nhưng:
• Tiêu đề: "✏️  Cập Nhật Sản Phẩm"
• Mã SP: readonly (không cho sửa)
• Các field khác: pre-fill dữ liệu hiện tại

SAU KHI LƯU:
1. Gọi google.script.run.updateProduct(code, data)
2. Server update dòng tương ứng
3. Nếu Tồn Kho thay đổi → Ghi log điều chỉnh
4. Toast: "✅ Đã cập nhật!"

🗑️  CHỨC NĂNG XÓA SẢN PHẨM:

Click icon 🗑️  → Confirm dialog:

┌────────────────────────────────────┐
│  ⚠️  XÁC NHẬN XÓA                 │
├────────────────────────────────────┤
│  Bạn có chắc muốn xóa sản phẩm:   │
│                                    │
│  Laptop Dell XPS 15 9530           │
│  (SP001)                           │
│                                    │
│  ⚠️  Hành động này không hoàn tác! │
│                                    │
│  [❌ Hủy]  [🗑️  Xóa]              │
└────────────────────────────────────┘

KIỂM TRA TRƯỚC KHI XÓA:
• Check xem SP có trong ChiTietDonHang_BT7 không
• Nếu CÓ → Alert:
  "❌ Không thể xóa! Sản phẩm đã có trong X đơn hàng."
• Nếu KHÔNG → Cho phép xóa

SAU KHI XÓA:
1. Xóa dòng khỏi SanPham_BT7
2. Ghi log LichSuTonKho_BT7 (Loại: "Xóa SP")
3. Toast: "✅ Đã xóa!"

🔍 TÌM KIẾM:
• Ô input: debounce 300ms
• Tìm theo: Mã SP hoặc Tên SP (không phân biệt hoa thường)
• Highlight kết quả: background #FEF9C3
• Hiển thị: "Tìm thấy X kết quả"

📄 PHÂN TRANG:
• Mỗi trang: 10 sản phẩm
• Tổng: Math.ceil(totalProducts / 10)
• Nút Trước: disabled khi page = 1
• Nút Sau: disabled khi page = totalPages

═══════════════════════════════════════════════════════════════
👥 PHẦN 3: QUẢN LÝ KHÁCH HÀNG (Tương tự Sản Phẩm)
═══════════════════════════════════════════════════════════════

Dialog 900px × 650px

CỘT HIỂN THỊ:
| Mã KH | Tên | SĐT | Email | Thành Phố | Loại | Thao tác |

FORM THÊM/SỬA:
• Mã KH: KH### (auto-generate hoặc nhập tay)
• Tên: Text, required
• SĐT: 10 số, bắt đầu 0, regex ^\d{10}$
• Email: Validate format email
• Địa Chỉ: Textarea
• Thành Phố: Dropdown (Hà Nội, TP.HCM, Đà Nẵng, ...)
• Loại KH: Radio (VIP / Thường)

KIỂM TRA XÓA:
• Check KH có đơn hàng → Không cho xóa

═══════════════════════════════════════════════════════════════
📦 PHẦN 4: QUẢN LÝ ĐƠN HÀNG (Phức tạp hơn)
═══════════════════════════════════════════════════════════════

Dialog 1000px × 700px

BẢNG ĐƠN HÀNG:
| Mã Đơn | Khách Hàng | Ngày | Trạng Thái | Tổng Tiền | Thao tác |

Click vào dòng → Mở popup CHI TIẾT ĐƠN HÀNG

CHI TIẾT ĐƠN:
┌────────────────────────────────────────┐
│ 📦 CHI TIẾT ĐƠN HÀNG DH-001           │
├────────────────────────────────────────┤
│ Khách hàng: Nguyen Van An (KH001)     │
│ Ngày đặt: 01/08/2026                   │
│ Trạng thái: [Dropdown ▼]              │
│ PT Thanh toán: Chuyển Khoản            │
│                                        │
│ DANH SÁCH SẢN PHẨM:                    │
│ ┌────────────────────────────────────┐ │
│ │ SP │ Tên │ SL │ Giá │ Thành Tiền │ │
│ ├────────────────────────────────────┤ │
│ │SP01│Lap..│ 1  │32tr │ 32,000,000 │ │
│ │SP31│Chu..│ 1  │2.1tr│  2,100,000 │ │
│ └────────────────────────────────────┘ │
│                                        │
│ Tổng cộng: 34,100,000 VNĐ              │
│                                        │
│ [💾 Lưu TT]  [🗑️  Xóa Đơn]  [✕ Đóng] │
└────────────────────────────────────────┘

TẠO ĐƠN MỚI:
Form 2 bước:

BƯỚC 1: Chọn Khách Hàng
• Dropdown hoặc Autocomplete
• Nút [➕ Khách mới] nếu chưa có

BƯỚC 2: Thêm Sản Phẩm
• Select SP từ dropdown
• Nhập Số Lượng
• Tự động tính Thành Tiền
• Nút [➕ Thêm SP khác]
• Hiển thị bảng tạm các SP đã chọn
• Tổng Đơn tự động cập nhật

BƯỚC 3: Thông Tin Thanh Toán
• Phương thức: Dropdown
• Ghi chú: Textarea

SAU KHI LƯU ĐƠN MỚI:
1. Thêm vào DonHang_BT7
2. Thêm từng SP vào ChiTietDonHang_BT7
3. Trừ Tồn Kho trong SanPham_BT7
4. Ghi log LichSuTonKho_BT7 (Xuất Bán)
5. Toast: "✅ Đã tạo đơn {Mã Đơn}!"

═══════════════════════════════════════════════════════════════
🔧 PHẦN 5: CÀI ĐẶT KỸ THUẬT
═══════════════════════════════════════════════════════════════

📁 CẤU TRÚC FILE:

Code.gs
├─ Dashboard
│  ├─ createDashboard()
│  ├─ refreshDashboard()
│  └─ calculateStats()
├─ Product CRUD
│  ├─ getProducts(page, search)
│  ├─ addProduct(data)
│  ├─ updateProduct(code, data)
│  ├─ deleteProduct(code)
│  └─ checkProductInOrders(code)
├─ Customer CRUD
│  ├─ getCustomers(page, search)
│  ├─ addCustomer(data)
│  ├─ updateCustomer(code, data)
│  └─ deleteCustomer(code)
├─ Order CRUD
│  ├─ getOrders(page, filter)
│  ├─ getOrderDetails(orderId)
│  ├─ createOrder(orderData, items)
│  ├─ updateOrderStatus(id, status)
│  └─ deleteOrder(id)
├─ Utilities
│  ├─ showDialog(html, title, width, height)
│  ├─ showToast(message, title, timeout)
│  ├─ validateData(data, rules)
│  ├─ logInventory(action, productCode, qty, note)
│  └─ generateId(prefix)
└─ Menu & Triggers
   ├─ onOpen()
   ├─ onEdit(e)
   └─ showHelp()

HTML Files
├─ ProductManagement.html (UI + JS)
├─ CustomerManagement.html
├─ OrderManagement.html
└─ Styles.html (CSS chung)

🎨 STYLING:
• Framework: Bootstrap 5.3
• Icons: Font Awesome 6.4
• Font: 'Inter', system-ui
• Primary: #2563EB
• Success: #059669
• Danger: #DC2626
• Warning: #F59E0B

⚡ HIỆU NĂNG:
• Cache danh sách Danh Mục, Khách Hàng
• Batch read/write với getValues() / setValues()
• Limit mỗi lần load: 10 items
• Debounce search: 300ms

🔒 BẢO MẬT:
• Validate tất cả input (client + server)
• Escape HTML: HtmlService.createHtmlOutput().setXFrameOptionsMode()
• Check quyền trước khi xóa
• Log tất cả thao tác quan trọng

═══════════════════════════════════════════════════════════════
✅ KẾT QUẢ MONG ĐỢI
═══════════════════════════════════════════════════════════════

SAU KHI CHẠY XONG:
✔️  Dashboard hiển thị đầy đủ 4 thống kê + 3 biểu đồ
✔️  3 giao diện CRUD hoạt động mượt mà
✔️  Validation chặt chẽ, không crash
✔️  UI đẹp, responsive, dễ sử dụng
✔️  Log đầy đủ trong LichSuTonKho_BT7
✔️  Menu tùy chỉnh xuất hiện khi mở file
✔️  Code sạch, có comment, dễ maintain

HÃY TẠO CODE HOÀN CHỈNH VÀ CHẠY ĐƯỢC NGAY!
```

---

## 📋 CÁC BƯỚC THỰC HIỆN VỚI GEMINI SPARK

### BƯỚC 1: Tải File Excel và Mở Google Sheets

1. Tải file `bai_tap_7_quan_ly_ban_hang.xlsx` từ thư mục `data/`
2. Upload lên Google Drive
3. Mở bằng Google Sheets
4. Kiểm tra 6 sheets đã đầy đủ chưa

### BƯỚC 2: Mở Apps Script Editor

1. Trong Google Sheets, click **Extensions** > **Apps Script**
2. Một tab mới sẽ mở với editor Code.gs
3. Xóa code mẫu `function myFunction() { ... }`

### BƯỚC 3: Dán Master Prompt vào Gemini Spark

1. Mở **Gemini Spark** (https://aistudio.google.com/spark)
2. Dán toàn bộ **Master Prompt** ở trên vào ô chat
3. Nhấn Enter và chờ Gemini sinh code

### BƯỚC 4: Sao Chép Code Apps Script

1. Gemini sẽ trả về đoạn code JavaScript hoàn chỉnh
2. Click nút **"Copy Code"**
3. Quay lại Apps Script Editor
4. Dán code vào file **Code.gs**
5. Nhấn **Ctrl + S** để lưu

### BƯỚC 5: Chạy Function Tạo Dashboard

1. Trong Apps Script Editor, chọn function **`createDashboard`** từ dropdown
2. Click nút **"▶ Run"**
3. Lần đầu sẽ yêu cầu cấp quyền:
   - Click **"Review Permissions"**
   - Chọn tài khoản Google của bạn
   - Click **"Advanced"** > **"Go to [Project Name] (unsafe)"**
   - Click **"Allow"**
4. Chờ script chạy xong (5-10 giây)

### BƯỚC 6: Kiểm Tra Kết Quả

1. Quay lại Google Sheets
2. Làm mới trang (F5)
3. Kiểm tra sheet **"📊 Dashboard"** đã được tạo chưa
4. Xem các biểu đồ, bảng thống kê có hiển thị đúng không

### BƯỚC 7: Tinh Chỉnh Giao Diện (Nếu Cần)

Nếu giao diện chưa đẹp, gửi tiếp Prompt cho Gemini:

```
Vui lòng cải thiện giao diện Dashboard:
1. Tăng kích thước font tiêu đề lên 18pt
2. Thêm border cho các ô thống kê
3. Đổi màu nền header thành #1E40AF
4. Căn giữa tất cả các số liệu
5. Thêm icon emoji vào tiêu đề các phần
```

### BƯỚC 8: Thêm Menu Tùy Chỉnh (Optional)

Để thêm menu "Làm Mới Dashboard" vào thanh menu, dán thêm Prompt:

```
Thêm function onOpen() để tạo menu tùy chỉnh:
- Tên menu: "🔄 Dashboard"
- Item 1: "Làm Mới Dữ Liệu" → chạy createDashboard()
- Item 2: "Xóa Dashboard" → xóa sheet Dashboard
- Item 3: "Hướng Dẫn Sử Dụng" → hiển thị alert với hướng dẫn
```

---

## 🎯 CÁC BIỂU ĐỒ VÀ PHÂN TÍCH NÂNG CAO

### 1. Biểu Đồ Doanh Thu Theo Danh Mục (Pie Chart)

**Ý nghĩa:** Xem danh mục nào chiếm % doanh thu cao nhất để tập trung đầu tư marketing

**Công thức tính:**
```javascript
// Pseudo-code
for each row in ChiTietDonHang_BT7:
    productCode = row.maSanPham
    category = lookup(productCode in SanPham_BT7).maDanhMuc
    categoryName = lookup(category in DanhMuc_BT7).tenDanhMuc
    revenue[categoryName] += row.thanhTien
```

**Kết quả mong đợi:**
- Laptop & Máy Tính: 45%
- Màn Hình: 20%
- Âm Thanh: 15%
- Phụ Kiện: 10%
- Nội Thất: 7%
- Bàn Phím & Chuột: 2%
- Streaming: 1%

### 2. TOP 10 Sản Phẩm Bán Chạy (Bar Chart)

**Ý nghĩa:** Biết sản phẩm nào bán chạy để đảm bảo tồn kho đủ

**Công thức tính:**
```javascript
// GROUP BY Tên SP, SUM Số Lượng, ORDER BY DESC, LIMIT 10
productSales = {}
for each row in ChiTietDonHang_BT7:
    productName = row.tenSanPham
    productSales[productName] += row.soLuong

top10 = sort(productSales by value DESC).slice(0, 10)
```

**Kết quả mong đợi:**
1. Cáp HDMI 2.1 8K: 12 cái
2. Bàn phím Keychron: 8 cái
3. Ổ cứng SSD Samsung: 7 cái
4. ...

### 3. Phân Tích Khách Hàng VIP

**Ý nghĩa:** Chăm sóc đặc biệt khách hàng mua nhiều để giữ chân

**Công thức tính:**
```javascript
customerRevenue = {}
for each order in DonHang_BT7:
    customerCode = order.maKhachHang
    customerRevenue[customerCode] += order.tongTien

// JOIN với KhachHang_BT7 để lấy tên
topCustomers = sort(customerRevenue by value DESC).slice(0, 5)
```

### 4. Cảnh Báo Tồn Kho Thấp

**Ý nghĩa:** Đặt hàng kịp thời tránh hết hàng

**Công thức:**
```javascript
lowStockCount = 0
for each product in SanPham_BT7:
    if (product.tonKho < product.tonKhoToiThieu):
        lowStockCount++
```

---

## 🔧 CODE APPS SCRIPT MẪU (THAM KHẢO)

```javascript
/**
 * TẠO DASHBOARD QUẢN LÝ BÁN HÀNG TỰ ĐỘNG
 */

function createDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Xóa Dashboard cũ nếu có
  let dashboard = ss.getSheetByName("📊 Dashboard");
  if (dashboard) ss.deleteSheet(dashboard);
  
  // Tạo Dashboard mới
  dashboard = ss.insertSheet("📊 Dashboard", 0);
  
  // 1. HEADER CHÍNH
  dashboard.getRange("A1:H1").merge();
  dashboard.getRange("A1").setValue("🏪 TECH HUB STORE - DASHBOARD QUẢN LÝ");
  dashboard.getRange("A1").setFontSize(18).setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setBackground("#1E40AF").setFontColor("#FFFFFF");
  dashboard.setRowHeight(1, 40);
  
  // 2. TIÊU ĐỀ TỔNG QUAN
  dashboard.getRange("A3").setValue("📊 TỔNG QUAN KINH DOANH THÁNG 8/2026");
  dashboard.getRange("A3").setFontSize(14).setFontWeight("bold");
  
  // 3. 4 Ô THỐNG KÊ
  const stats = [
    ["💰 TỔNG DOANH THU", calculateTotalRevenue()],
    ["📦 TỔNG ĐƠN HÀNG", countOrders()],
    ["👥 TỔNG KHÁCH HÀNG", countCustomers()],
    ["⚠️ CẢNH BÁO TỒN KHO", checkLowStock()]
  ];
  
  let col = 1;
  stats.forEach(stat => {
    dashboard.getRange(4, col).setValue(stat[0]).setFontWeight("bold").setBackground("#EFF6FF");
    dashboard.getRange(5, col).setValue(stat[1]).setFontSize(20).setFontWeight("bold")
      .setHorizontalAlignment("center").setNumberFormat("#,##0");
    col += 2;
  });
  
  // 4. TẠO BIỂU ĐỒ DOANH THU THEO DANH MỤC
  createCategoryRevenueChart(dashboard);
  
  // 5. TẠO BIỂU ĐỒ TOP SẢN PHẨM
  createTopProductsChart(dashboard);
  
  // 6. BẢNG TOP KHÁCH HÀNG VIP
  createTopCustomersTable(dashboard);
  
  // Định dạng độ rộng cột
  dashboard.setColumnWidths(1, 8, 150);
  
  Logger.log("✅ Dashboard đã được tạo thành công!");
}

function calculateTotalRevenue() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("DonHang_BT7");
  const data = sheet.getRange("E2:E" + sheet.getLastRow()).getValues();
  return data.reduce((sum, row) => sum + (row[0] || 0), 0);
}

function countOrders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("DonHang_BT7");
  return sheet.getLastRow() - 1; // Trừ header
}

function countCustomers() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("KhachHang_BT7");
  return sheet.getLastRow() - 1;
}

function checkLowStock() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("SanPham_BT7");
  const data = sheet.getRange("F2:G" + sheet.getLastRow()).getValues();
  return data.filter(row => row[0] < row[1]).length;
}

function createCategoryRevenueChart(dashboard) {
  // Code tạo biểu đồ tròn
  // (Chi tiết sẽ do Gemini sinh ra)
}

function createTopProductsChart(dashboard) {
  // Code tạo biểu đồ cột
  // (Chi tiết sẽ do Gemini sinh ra)
}

function createTopCustomersTable(dashboard) {
  // Code tạo bảng TOP khách hàng
  // (Chi tiết sẽ do Gemini sinh ra)
}

// Thêm menu tùy chỉnh
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🔄 Dashboard')
    .addItem('Làm Mới Dữ Liệu', 'createDashboard')
    .addSeparator()
    .addItem('Hướng Dẫn Sử Dụng', 'showHelp')
    .addToUi();
}

function showHelp() {
  const ui = SpreadsheetApp.getUi();
  ui.alert('📖 Hướng Dẫn Sử Dụng',
    '1. Click menu "🔄 Dashboard" > "Làm Mới Dữ Liệu"\n' +
    '2. Chờ 5-10 giây để hệ thống cập nhật\n' +
    '3. Xem các biểu đồ và thống kê tự động\n' +
    '4. Sử dụng menu điều hướng để chuyển sheet',
    ui.ButtonSet.OK);
}
```

---

## ✅ DANH SÁCH KIỂM TRA NGHIỆM THU

### Kiểm tra Cơ bản:

- [ ] Sheet "📊 Dashboard" đã được tạo thành công
- [ ] Hiển thị đúng 4 số liệu tổng quan (Doanh thu, Đơn hàng, Khách hàng, Cảnh báo)
- [ ] Biểu đồ tròn "Doanh thu theo danh mục" hiển thị đúng 7 danh mục
- [ ] Biểu đồ cột "TOP 10 sản phẩm" sắp xếp từ cao đến thấp
- [ ] Bảng "TOP khách hàng VIP" hiển thị đúng 5 khách hàng

### Kiểm tra Nâng cao:

- [ ] Số liệu tự động cập nhật khi thay đổi dữ liệu trong các sheet gốc
- [ ] Biểu đồ có tiêu đề rõ ràng, legend và data labels
- [ ] Định dạng số tiền: #,##0 VNĐ
- [ ] Giao diện đẹp mắt, màu sắc hài hòa
- [ ] Menu "🔄 Dashboard" xuất hiện trên thanh menu

### Kiểm tra Hiệu năng:

- [ ] Dashboard tạo xong trong vòng 10 giây
- [ ] Không có lỗi khi chạy script
- [ ] File không bị lag khi mở Dashboard

---

## 🚀 Ý TƯỞNG MỞ RỘNG (NÂNG CAO)

### 1. Thêm Lọc Theo Thời Gian
- Dropdown chọn tháng/quý/năm
- Dashboard tự động lọc dữ liệu theo khoảng thời gian đã chọn

### 2. Tích Hợp Gửi Email Báo Cáo
- Tự động gửi Dashboard dạng PDF qua email mỗi tuần
- Gửi cho Giám đốc và Trưởng phòng kinh doanh

### 3. Cảnh Báo Thông Minh
- Gửi email cảnh báo khi tồn kho < tồn kho tối thiểu
- Thông báo khi có đơn hàng mới

### 4. Tích Hợp Bản Đồ
- Hiển thị vị trí khách hàng trên Google Maps
- Tối ưu tuyến giao hàng

### 5. Phân Tích RFM Khách Hàng
- Recency: Khách mua gần đây
- Frequency: Tần suất mua
- Monetary: Giá trị mua
- Phân khúc: VIP, Trung thành, Ngủ đông, Mới

---

## 📚 TÀI LIỆU THAM KHẢO

- **Apps Script Documentation**: https://developers.google.com/apps-script
- **Google Sheets Chart API**: https://developers.google.com/chart
- **Gemini Spark Guide**: https://aistudio.google.com/docs
- **JavaScript ES6 Syntax**: https://developer.mozilla.org/en-US/docs/Web/JavaScript

---

## 🎓 BÀI TẬP THỰC HÀNH

### Bài 1: Tạo Dashboard Cơ Bản (Dễ)
Tạo Dashboard với 4 ô thống kê và 1 biểu đồ doanh thu theo danh mục.

### Bài 2: Thêm Biểu Đồ TOP Sản Phẩm (Trung Bình)
Bổ sung biểu đồ cột ngang TOP 10 sản phẩm bán chạy.

### Bài 3: Bảng TOP Khách Hàng (Trung Bình)
Tạo bảng hiển thị 5 khách hàng VIP mua nhiều nhất.

### Bài 4: Chức Năng Tìm Kiếm (Nâng Cao)
Thêm ô tìm kiếm đơn hàng theo Mã Đơn.

### Bài 5: Cảnh Báo Tự Động (Nâng Cao)
Gửi email cảnh báo khi có sản phẩm sắp hết hàng.

---

## 🏆 KẾT QUẢ HỌC TẬP MONG ĐỢI

Sau khi hoàn thành bài thực hành, học viên có thể:

✅ Tự tin xây dựng Dashboard quản lý cho bất kỳ hệ thống nào  
✅ Ra lệnh cho AI tạo code Apps Script phức tạp  
✅ Phân tích dữ liệu đa chiều với biểu đồ trực quan  
✅ Tự động hóa quy trình báo cáo tiết kiệm 90% thời gian  
✅ Áp dụng ngay vào công việc thực tế tại công ty  

**Chúc các bạn thành công! 🚀**
