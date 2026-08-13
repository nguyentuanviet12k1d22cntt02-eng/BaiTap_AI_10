# 📘 HƯỚNG DẪN SỬ DỤNG APPS SCRIPT - HỆ THỐNG QUẢN LÝ BÁN HÀNG

## 🎯 MỤC TIÊU

Hướng dẫn này sẽ chỉ cho bạn cách:
1. **Thêm code Apps Script** vào Google Sheets của bạn
2. **Đặt tên đúng** cho các file
3. **Chạy lần đầu** và cấp quyền
4. **Sử dụng hệ thống** quản lý bán hàng

---

## 📂 DANH SÁCH CÁC FILE BẠN CẦN THÊM

Trong thư mục `add script/` có **4 files** quan trọng:

| Tên File Trong Thư Mục | Tên File Trong Apps Script | Mô Tả |
|------------------------|---------------------------|-------|
| `tool1.gs` | **Code.gs** | File code JavaScript chính (backend) |
| `trang1.html` | **ProductManagement.html** | Giao diện Quản Lý Sản Phẩm |
| `trang2.html` | **CustomerManagement.html** | Giao diện Quản Lý Khách Hàng |
| `trang3.html` | **OrderManagement.html** | Giao diện Quản Lý Đơn Hàng |

---

## 🚀 BƯỚC 1: MỞ APPS SCRIPT EDITOR

### Cách 1: Từ Google Sheets
1. Mở file **bai_tap_7_quan_ly_ban_hang.xlsx** trên Google Drive
2. Click vào **Extensions** (Tiện ích mở rộng) trên thanh menu
3. Chọn **Apps Script**

![Apps Script Menu](https://i.imgur.com/your-screenshot.png)

### Cách 2: Từ Google Drive
1. Vào Google Drive
2. Click **New** (Mới) → **More** (Thêm) → **Google Apps Script**
3. Sau đó liên kết với Sheet của bạn

---

## 📝 BƯỚC 2: THÊM FILE CODE.GS (BACKEND)

### 2.1. Xóa Code Mẫu
Khi mở Apps Script lần đầu, bạn sẽ thấy code mẫu như sau:

```javascript
function myFunction() {
  
}
```

**➡️ XÓA TOÀN BỘ CODE MẪU NÀY ĐI!**

### 2.2. Dán Code Mới
1. Mở file **`tool1.gs`** trong thư mục `add script/`
2. **Copy toàn bộ nội dung** (Ctrl + A → Ctrl + C)
3. **Paste** vào Apps Script Editor (Ctrl + V)
4. Click nút **💾 Save** (Ctrl + S)

### 2.3. Đổi Tên File (Nếu Cần)
- Tên mặc định: **Code.gs** ✅ (Giữ nguyên là tốt nhất)
- Nếu muốn đổi tên: Click vào "Code.gs" và gõ tên khác

---

## 🎨 BƯỚC 3: THÊM CÁC FILE HTML (GIAO DIỆN)

### 3.1. Tạo File HTML Thứ Nhất (ProductManagement.html)

1. Click dấu **➕** bên cạnh "Files" (hoặc click vào **+** → **HTML**)
2. Đặt tên: **`ProductManagement`** (không cần gõ .html)
3. Xóa code mẫu trong file HTML
4. Mở file **`trang1.html`** trong thư mục → Copy toàn bộ → Paste vào
5. Click **💾 Save**

### 3.2. Tạo File HTML Thứ Hai (CustomerManagement.html)

1. Click dấu **➕** → **HTML**
2. Đặt tên: **`CustomerManagement`**
3. Mở file **`trang2.html`** → Copy → Paste
4. Click **💾 Save**

### 3.3. Tạo File HTML Thứ Ba (OrderManagement.html)

1. Click dấu **➕** → **HTML**
2. Đặt tên: **`OrderManagement`**
3. Mở file **`trang3.html`** → Copy → Paste
4. Click **💾 Save**

### ✅ Kiểm Tra Lại

Sau khi xong, bạn sẽ thấy **4 files** trong Apps Script Editor:

```
📁 Apps Script Project
  ├── 📄 Code.gs
  ├── 📄 ProductManagement.html
  ├── 📄 CustomerManagement.html
  └── 📄 OrderManagement.html
```

---

## ⚙️ BƯỚC 4: CHẠY LẦN ĐẦU & CẤP QUYỀN

### 4.1. Chọn Function Để Chạy

1. Ở thanh công cụ trên cùng, tìm dropdown **"Select function"**
2. Click vào và chọn: **`createDashboard`**

![Select Function](https://i.imgur.com/your-select-function.png)

### 4.2. Click Nút Run (▶)

1. Click nút **▶ Run** (hoặc Ctrl + R)
2. Lần đầu tiên sẽ xuất hiện popup **"Authorization required"**
3. Click **"Review permissions"**

### 4.3. Cấp Quyền Cho Script

Làm theo các bước sau:

1. **Chọn tài khoản Google** của bạn
2. Sẽ có cảnh báo: "Google hasn't verified this app"
   - Click **"Advanced"** (Nâng cao)
   - Click **"Go to [Tên Project] (unsafe)"** (Tiếp tục đến project)
3. Click **"Allow"** (Cho phép)

🔐 **Lý do cần cấp quyền:**
- Script cần **đọc/ghi dữ liệu** trên Google Sheets
- Script cần **hiển thị giao diện HTML** (Dialog)

### 4.4. Chờ Script Chạy Xong

- Khi script đang chạy, bạn sẽ thấy icon loading
- Thời gian: khoảng **5-10 giây**
- Sau khi xong, sẽ có thông báo: **"Execution completed"**

---

## 🎉 BƯỚC 5: KIỂM TRA KẾT QUẢ

### 5.1. Quay Lại Google Sheets

1. Quay lại tab **Google Sheets** của bạn
2. Nhấn **F5** để refresh trang
3. Bạn sẽ thấy:
   - **Sheet mới**: `📊 Dashboard` (ở đầu tiên)
   - **Menu mới**: `🏪 Tech Hub Store` (trên thanh menu)

### 5.2. Kiểm Tra Dashboard

Sheet `📊 Dashboard` bao gồm:
- ✅ **4 ô thống kê**: Doanh thu, Đơn hàng, Khách hàng, Cảnh báo
- ✅ **Biểu đồ tròn**: Doanh thu theo danh mục
- ✅ **Biểu đồ cột**: TOP 10 sản phẩm bán chạy
- ✅ **Bảng TOP 5**: Khách hàng VIP chi tiêu cao nhất
- ✅ **Tra cứu đơn hàng**: Ô tìm kiếm đơn hàng

### 5.3. Kiểm Tra Menu

Click vào menu **🏪 Tech Hub Store**, bạn sẽ thấy:

```
🏪 Tech Hub Store
├── 📊 Dashboard Tổng Quan
├── ──────────────────────
├── 🛍️ Quản Lý Sản Phẩm
├── 👥 Quản Lý Khách Hàng
├── 📦 Quản Lý Đơn Hàng
├── ──────────────────────
├── 🔄 Làm Mới Dashboard
└── ❓ Hướng Dẫn Sử Dụng
```

---

## 🛠️ BƯỚC 6: SỬ DỤNG CÁC CHỨC NĂNG

### 📊 1. Làm Mới Dashboard

**Khi nào cần:**
- Khi thêm/sửa/xóa sản phẩm, khách hàng, đơn hàng
- Khi muốn cập nhật biểu đồ với dữ liệu mới

**Cách làm:**
1. Click menu **🏪 Tech Hub Store** → **🔄 Làm Mới Dashboard**
2. Chờ 5-10 giây
3. Dashboard sẽ cập nhật số liệu và biểu đồ mới

---

### 🛍️ 2. Quản Lý Sản Phẩm

**Mở giao diện:**
- Click menu **🏪 Tech Hub Store** → **🛍️ Quản Lý Sản Phẩm**
- Hoặc click nút trên Dashboard

#### ➕ Thêm Sản Phẩm Mới

1. Click nút **[➕ Thêm Sản Phẩm]**
2. Điền form:
   - **Mã Sản Phẩm**: VD: `SP067` (bắt buộc, unique)
   - **Tên Sản Phẩm**: VD: `Chuột Gaming Logitech G502` (bắt buộc)
   - **Danh Mục**: Chọn từ dropdown (bắt buộc)
   - **Đơn Vị Tính**: VD: `Chiếc` (mặc định)
   - **Đơn Giá**: VD: `1500000` (bắt buộc)
   - **Tồn Kho**: VD: `20` (bắt buộc)
   - **Tồn Tối Thiểu**: VD: `5` (bắt buộc)
3. Click **[💾 Lưu]**
4. Thông báo: **"✅ Đã thêm sản phẩm..."**

#### ✏️ Sửa Sản Phẩm

1. Tìm sản phẩm trong bảng
2. Click icon **✏️** (màu vàng)
3. Form sẽ mở với dữ liệu hiện tại
4. Sửa thông tin cần thay đổi
5. Click **[💾 Lưu]**

#### 🗑️ Xóa Sản Phẩm

1. Click icon **🗑️** (màu đỏ)
2. Xác nhận: **"Bạn có chắc muốn xóa...?"**
3. Click **OK**

**⚠️ Lưu ý:**
- Không thể xóa sản phẩm đã có trong đơn hàng
- Nếu xóa được → Hệ thống sẽ ghi log vào `LichSuTonKho_BT7`

#### 🔍 Tìm Kiếm Sản Phẩm

1. Gõ từ khóa vào ô **"Tìm theo mã hoặc tên sản phẩm..."**
2. Hệ thống tự động tìm sau **0.3 giây** (debounce)
3. Kết quả hiển thị ngay lập tức

#### 📄 Phân Trang

- Mỗi trang hiển thị **10 sản phẩm**
- Click **[◀ Trước]** hoặc **[Sau ▶]** để chuyển trang
- Hiển thị: `Trang 1 / 7 (Tổng 66 SP)`

---

### 👥 3. Quản Lý Khách Hàng

**Mở giao diện:**
- Click menu **🏪 Tech Hub Store** → **👥 Quản Lý Khách Hàng**

#### ➕ Thêm Khách Hàng Mới

1. Click nút **[➕ Thêm Khách Hàng]**
2. Điền form:
   - **Mã Khách Hàng**: VD: `KH031` (bắt buộc, unique)
   - **Tên Khách Hàng**: VD: `Nguyễn Văn A` (bắt buộc)
   - **SĐT**: VD: `0901234567` (bắt buộc, 10 số)
   - **Email**: VD: `nguyenvana@gmail.com`
   - **Địa Chỉ**: VD: `123 Trần Hưng Đạo`
   - **Thành Phố**: Chọn từ dropdown (Hà Nội, TP.HCM, Đà Nẵng, Khác)
   - **Loại KH**: Chọn **VIP** hoặc **Thường**
3. Click **[💾 Lưu Khách Hàng]**

#### ✏️ Sửa Thông Tin Khách Hàng

- Tương tự như Sản Phẩm
- Click icon **✏️** → Sửa → Lưu

#### 🗑️ Xóa Khách Hàng

**⚠️ Lưu ý:**
- Không thể xóa khách hàng đã có đơn hàng
- Nếu thử xóa → Thông báo: **"Không thể xóa! Khách hàng này đã từng phát sinh đơn hàng."**

---

### 📦 4. Quản Lý Đơn Hàng

**Mở giao diện:**
- Click menu **🏪 Tech Hub Store** → **📦 Quản Lý Đơn Hàng**

#### ➕ Tạo Đơn Hàng Mới (QUAN TRỌNG!)

**Bước 1: Chọn Khách Hàng**
1. Click nút **[➕ Tạo Đơn Hàng Mới]**
2. Dropdown **"1. Chọn Khách Hàng"** → Chọn KH từ danh sách

**Bước 2: Thêm Sản Phẩm Vào Đơn**
1. Dropdown **"Chọn Sản Phẩm"** → Chọn SP
2. Nhập **Số Lượng** (mặc định: 1)
3. Click **[➕ Thêm SP]**
4. Sản phẩm sẽ hiện trong bảng bên dưới
5. Lặp lại để thêm nhiều SP

**Bước 3: Xem Tổng Tiền**
- Tổng tiền tự động tính ở cuối form
- VD: **"Tổng Đơn: 34,100,000 đ"**

**Bước 4: Hoàn Tất Đơn**
1. Click **[💾 Hoàn Tất Đơn Hàng]**
2. Hệ thống sẽ:
   - ✅ Thêm đơn hàng vào `DonHang_BT7`
   - ✅ Thêm chi tiết vào `ChiTietDonHang_BT7`
   - ✅ **TỰ ĐỘNG TRỪ TỒN KHO** trong `SanPham_BT7`
   - ✅ Ghi log vào `LichSuTonKho_BT7`
3. Thông báo: **"✅ Đã tạo thành công đơn hàng DH031"**

#### 🗑️ Xóa Đơn Hàng

1. Click icon **🗑️** ở cột "Thao Tác"
2. Xác nhận xóa
3. Hệ thống xóa cả đơn hàng và chi tiết

**⚠️ Lưu ý:**
- Xóa đơn hàng **KHÔNG TỰ ĐỘNG HOÀN LẠI TỒN KHO**
- Nếu muốn hoàn kho → Cần sửa thủ công trong `SanPham_BT7`

---

### 🔍 5. Tra Cứu Đơn Hàng (Trên Dashboard)

**Vị trí:** Sheet `📊 Dashboard` → Góc phải dưới biểu đồ

**Cách dùng:**
1. Tìm ô **"Mã Đơn Hàng:"** (ô màu vàng)
2. Nhập mã đơn hàng, VD: `DH001`
3. Ô bên dưới sẽ tự động hiển thị:
   - **Khách Hàng**: Tên KH
   - **Trạng Thái**: Hoàn Thành / Đang Xử Lý / Hủy
   - **Tổng Tiền**: 34,100,000 VNĐ

**Công thức bên trong:**
- Sử dụng `XLOOKUP` để tìm kiếm nhanh trong `DonHang_BT7`
- Nếu không tìm thấy → Hiển thị: **"Không thấy"**

---

## 📊 BƯỚC 7: KIỂM TRA LOGS VÀ TỒN KHO

### 📜 Lịch Sử Tồn Kho

**Sheet:** `LichSuTonKho_BT7`

**Các sự kiện được ghi log:**
- ✅ **Nhập Kho**: Khi thêm sản phẩm mới
- ✅ **Xuất Bán**: Khi tạo đơn hàng (tự động)
- ✅ **Điều Chỉnh Tăng/Giảm**: Khi sửa tồn kho sản phẩm
- ✅ **Xóa SP**: Khi xóa sản phẩm

**Thông tin trong log:**
- **Thời Gian**: DD/MM/YYYY HH:mm:ss
- **Mã Sản Phẩm**: SP001, SP002, ...
- **Loại Giao Dịch**: Nhập Kho / Xuất Bán / Điều Chỉnh / Xóa SP
- **Số Lượng**: 10, 5, 2, ...
- **Người Thực Hiện**: Email của bạn
- **Ghi Chú**: Mô tả chi tiết

---

## 🎨 BƯỚC 8: TÙY CHỈNH GIÁ TRỊ MẶC ĐỊNH

### Thay Đổi Số Lượng Hiển Thị Mỗi Trang

**Vị trí:** File `Code.gs` → Dòng 125 và 206

```javascript
var limit = 10;  // Thay 10 → 20 nếu muốn hiển thị 20 SP/trang
```

### Thay Đổi Thời Gian Debounce Tìm Kiếm

**Vị trí:** File `ProductManagement.html` → Dòng 180

```javascript
searchTimeout = setTimeout(() => { currentPage = 1; loadProducts(); }, 300);
// Thay 300 → 500 nếu muốn chờ 0.5 giây
```

### Thay Đổi Trạng Thái Đơn Hàng Mặc Định

**Vị trí:** File `Code.gs` → Dòng 405

```javascript
orderData.status || "Mới Tạo"
// Thay "Mới Tạo" → "Đang Xử Lý" nếu muốn
```

---

## ❓ BƯỚC 9: XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi 1: "Script function not found: createDashboard"

**Nguyên nhân:**
- Chưa lưu file `Code.gs`
- Hoặc đặt tên function sai

**Giải pháp:**
1. Mở file `Code.gs`
2. Nhấn **Ctrl + S** để lưu
3. Chờ 2 giây
4. Chạy lại

---

### Lỗi 2: "Cannot read property 'getSheetByName' of null"

**Nguyên nhân:**
- Tên sheet không đúng (VD: `SanPham_BT7` bị gõ sai thành `SanPham_BT77`)

**Giải pháp:**
1. Kiểm tra lại tên các sheet trong Google Sheets
2. Đảm bảo có đủ **6 sheets**:
   - `DanhMuc_BT7`
   - `SanPham_BT7`
   - `KhachHang_BT7`
   - `DonHang_BT7`
   - `ChiTietDonHang_BT7`
   - `LichSuTonKho_BT7`

---

### Lỗi 3: Menu "🏪 Tech Hub Store" Không Xuất Hiện

**Nguyên nhân:**
- Chưa chạy function `onOpen()` lần đầu
- Hoặc chưa refresh lại Google Sheets

**Giải pháp:**
1. Đóng Google Sheets
2. Mở lại từ Google Drive
3. Chờ 2-3 giây
4. Menu sẽ tự động xuất hiện

**Hoặc chạy thủ công:**
1. Vào Apps Script Editor
2. Chọn function **`onOpen`**
3. Click **▶ Run**

---

### Lỗi 4: Dialog HTML Không Mở

**Nguyên nhân:**
- Tên file HTML không đúng
- VD: Trong `Code.gs` gọi `ProductManagement.html` nhưng file lại tên `Product.html`

**Giải pháp:**
1. Kiểm tra tên file trong Apps Script Editor
2. Đảm bảo đúng:
   - `ProductManagement.html`
   - `CustomerManagement.html`
   - `OrderManagement.html`
3. Không có khoảng trắng, không có dấu

---

### Lỗi 5: "Không thể xóa! Sản phẩm đã có trong X đơn hàng"

**Nguyên nhân:**
- Sản phẩm đã được dùng trong đơn hàng

**Giải pháp:**
- Đây là **tính năng bảo vệ dữ liệu**, không phải lỗi
- Nếu thực sự muốn xóa:
  1. Xóa các đơn hàng có chứa SP đó trước
  2. Sau đó mới xóa SP

---

### Lỗi 6: Tồn Kho Không Tự Động Trừ Khi Tạo Đơn

**Nguyên nhân:**
- Mã sản phẩm không khớp giữa `SanPham_BT7` và `ChiTietDonHang_BT7`

**Giải pháp:**
1. Kiểm tra cột **Mã SP** trong `SanPham_BT7`
2. Đảm bảo không có khoảng trắng thừa
3. VD: `SP001` ✅ / `SP001 ` ❌ (có space)

**Cách kiểm tra:**
```javascript
// Thêm đoạn này vào Code.gs để debug
Logger.log("Product Code: [" + it.productCode + "]");
Logger.log("Sheet Code: [" + spData[i][0] + "]");
```

---

## 🎓 BƯỚC 10: MẸO SỬ DỤNG NÂNG CAO

### Mẹo 1: Xem Log Execution (Logs)

**Để debug lỗi:**
1. Vào Apps Script Editor
2. Click **View** → **Logs** (hoặc Ctrl + Enter)
3. Xem các dòng log khi script chạy

### Mẹo 2: Thêm Triggers Tự Động

**Để tự động refresh Dashboard mỗi ngày:**
1. Apps Script Editor → Click icon **⏰ Triggers** (bên trái)
2. Click **+ Add Trigger**
3. Cấu hình:
   - Function: `createDashboard`
   - Event source: `Time-driven`
   - Type: `Day timer`
   - Time: `1am to 2am`
4. Click **Save**

### Mẹo 3: Chia Sẻ File Với Team

**Nếu muốn team cùng dùng:**
1. Click **Share** ở góc phải Google Sheets
2. Thêm email đồng nghiệp
3. Chọn quyền: **Editor** (để họ có thể thêm/sửa/xóa)

**Lưu ý:**
- Mọi người sẽ dùng chung 1 Apps Script
- Không cần thêm code lại
- Log sẽ ghi email người thực hiện

### Mẹo 4: Export Dashboard Ra PDF

**Cách 1: Thủ công**
1. Vào sheet `📊 Dashboard`
2. **File** → **Download** → **PDF Document**
3. Chọn: Current sheet, Landscape, Fit to width

**Cách 2: Tự động bằng Code**
(Thêm function vào `Code.gs`)

```javascript
function exportDashboardToPDF() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("📊 Dashboard");
  var url = ss.getUrl().replace(/edit/, 'export?format=pdf&gid=' + sheet.getSheetId());
  
  var response = UrlFetchApp.fetch(url, {
    headers: {
      'Authorization': 'Bearer ' + ScriptApp.getOAuthToken()
    }
  });
  
  var blob = response.getBlob().setName('Dashboard_' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd") + '.pdf');
  
  // Lưu vào Drive
  DriveApp.createFile(blob);
  
  SpreadsheetApp.getUi().alert('✅ Đã export PDF vào Google Drive!');
}
```

---

## ✅ CHECKLIST HOÀN THÀNH

Sau khi làm xong, bạn cần đảm bảo:

- [ ] Đã thêm đầy đủ **4 files** vào Apps Script
- [ ] Đặt tên đúng: `Code.gs`, `ProductManagement.html`, `CustomerManagement.html`, `OrderManagement.html`
- [ ] Đã chạy `createDashboard()` lần đầu và cấp quyền
- [ ] Sheet `📊 Dashboard` hiển thị đầy đủ số liệu và biểu đồ
- [ ] Menu `🏪 Tech Hub Store` xuất hiện trên thanh menu
- [ ] Thử thêm 1 sản phẩm mới → Thành công
- [ ] Thử thêm 1 khách hàng mới → Thành công
- [ ] Thử tạo 1 đơn hàng mới → Tồn kho tự động trừ
- [ ] Kiểm tra `LichSuTonKho_BT7` → Có log giao dịch

---

## 🎉 CHÚC MỪNG!

Bạn đã hoàn thành việc cài đặt **Hệ Thống Quản Lý Bán Hàng Tự Động** bằng Apps Script!

### Lợi ích bạn nhận được:
✅ Quản lý **66 sản phẩm** dễ dàng với giao diện CRUD chuyên nghiệp  
✅ Tự động hóa **tồn kho** khi bán hàng  
✅ Biểu đồ phân tích **doanh thu theo danh mục** và **TOP sản phẩm**  
✅ Tiết kiệm **90% thời gian** làm báo cáo thủ công  
✅ Ghi log đầy đủ mọi thao tác để **audit và kiểm soát**  

---

## 📞 HỖ TRỢ

Nếu gặp lỗi, hãy:
1. Đọc lại phần **"Xử Lý Lỗi Thường Gặp"** ở trên
2. Kiểm tra **Logs** trong Apps Script Editor
3. Gửi câu hỏi kèm:
   - Screenshot lỗi
   - Dòng code bị lỗi
   - Các bước bạn đã làm

---

## 📚 TÀI LIỆU THAM KHẢO

- **Apps Script Documentation**: https://developers.google.com/apps-script
- **Google Sheets API**: https://developers.google.com/sheets/api
- **Bootstrap 5 Docs**: https://getbootstrap.com/docs/5.3
- **Font Awesome Icons**: https://fontawesome.com/icons

---

**🎓 Created by: Chuyên gia Apps Script & Tự động hóa Google Sheets**  
**📅 Version: 1.0.0 - Tháng 8/2026**
