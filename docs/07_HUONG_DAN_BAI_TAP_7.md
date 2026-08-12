# HƯỚNG DẪN BÀI THỰC HÀNH 7 (PROMPT-DRIVEN)
## RA LỆNH CHO AI AGENT XÂY DỰNG MENU UI QUẢN LÝ BÁN HÀNG & VẼ BIỂU ĐỒ DOANH THU TÔNG XANH DƯƠNG

---

### 📖 1. Tình Huống Doanh Nghiệp Thực Tế (Case Study Context)
* **Bối cảnh:** Bạn là Chủ hộ kinh doanh hoặc Quản lý cửa hàng bán lẻ thiết bị công nghệ trên các sàn E-commerce và Cửa hàng trực tiếp. Hàng ngày, cửa hàng phát sinh rất nhiều nghiệp vụ hỗn hợp bao gồm: Bán hàng cho khách, Nhập hàng sỉ về kho, và trả các khoản Chi phí vận hành/quảng cáo.
* **Nỗi đau khi làm thủ công (Before):** Mọi giao dịch được ghi chép lộn xộn trên một sổ nhật ký. Khi cần xem báo cáo so sánh doanh thu quảng cáo hoặc hiệu suất bán hàng, bạn phải tự lọc bảng, tự copy số liệu sang bảng tính tổng và tự bấm vẽ biểu đồ. Khi bàn giao cho nhân viên mới, họ không biết bấm nút nào trước nút nào sau, dẫn đến việc báo cáo không nhất quán, mất nhiều thời gian tổng hợp mỗi tối.
* **Giải pháp AI Tự động (After):** Sử dụng Master Prompt để yêu cầu AI thiết kế một **thanh Menu tiện ích trực quan** mang tên `🌸 Quản Lý Bán Hàng` ngay trên Google Sheets. Nhân viên chỉ cần nhấp chọn chức năng tương ứng. Đặc biệt, khi nhấp vào nút `📊 Xem Thống Kê`, hệ thống sẽ chạy script tự động lập bảng tổng hợp doanh số/chi phí theo kênh và vẽ **biểu đồ cột màu xanh dương** sang trọng để báo cáo tức thì!

---

### 🪄 2. Quy Trình Ra Lệnh Từng Bước Cho SPARK / AI Agent

#### 📍 BƯỚC 1: Kiểm Tra AI Nhận Diện Sheet Bán Hàng Mới
* **Mục đích:** Gửi link Google Sheet chứa trang dữ liệu mới `BanHang_BT7` để xác nhận AI đã đọc chính xác thông tin 7 cột giao dịch thô.
* **Câu Prompt gửi cho AI:**
```text
https://docs.google.com/spreadsheets/d/19jPP-MwIMPjeDfViicF1jTQBxx-0lTP8HAwR6IqArPI/edit

bạn có thể đọc được nội dung của sheet mới "BanHang_BT7" trong link này chứ? Hãy liệt kê 3 dòng dữ liệu giao dịch đầu tiên để xác nhận.
```

---

#### 📍 BƯỚC 2: Yêu Cầu AI Phân Tích Bố Cục Nhật Ký Giao Dịch
* **Mục đích:** AI phân tích tọa độ các cột quan trọng (Ngày, Loại giao dịch, Số tiền, Kênh bán) để xác định thuật toán lọc tổng hợp doanh thu/chi phí quảng cáo.
* **Câu Prompt gửi cho AI:**
```text
Hãy phân tích dữ liệu trong sheet "BanHang_BT7". Làm sao để dùng Apps Script lọc ra tổng Doanh thu của các kênh bán hàng (Shopee, Lazada, Website, Cửa Hàng) và tổng Chi phí của các kênh marketing (Chi Phí Marketing, Chi Phí Vận Hành)?
```

---

#### 📍 BƯỚC 3: Tạo Giao Diện Menu Tiện Ích "Quản Lý Bán Hàng"
* **Mục đích:** Sử dụng prompt để AI viết hàm `onOpen()` tự khởi động, tạo menu thả xuống có các biểu tượng emoji đẹp mắt như hình ảnh mẫu thiết kế.
* **Câu Prompt gửi cho AI:**
```text
Viết hàm onOpen() trong Google Apps Script để tạo một menu tùy chỉnh tên là "🌸 Quản Lý Bán Hàng" hiển thị trên thanh công cụ của Google Sheets với danh sách các nút bấm sau:
1. "➕ Thêm đơn hàng" (gọi hàm themDonHang)
2. "📦 Nhập hàng" (gọi hàm nhapHang)
3. "💸 Nhập chi phí" (gọi hàm nhapChiPhi)
(Thêm 1 dòng gạch ngang phân cách)
4. "📊 Xem Thống Kê" (gọi hàm xemThongKe)
(Thêm 1 dòng gạch ngang phân cách)
5. "⚙️ Khởi tạo Sheets" (gọi hàm khoiTaoSheets)
```

---

#### 📍 BƯỚC 4: Lập Trình Chức Năng Vẽ Biểu Đồ Thống Kê Tông Màu Xanh Dương
* **Mục đích:** Viết code cho chức năng `📊 Xem Thống Kê` để tự tạo bảng phân tích nhanh bằng công thức `SUMIFS` chuẩn tiếng Việt (dấu `;`), và tự vẽ biểu đồ cột đôi màu xanh dương (Blue theme) tinh tế bên cạnh bảng dữ liệu.
* **Câu Prompt gửi cho AI:**
```text
Hãy viết code cho hàm xemThongKe() thực hiện các yêu cầu sau:
1. Đọc dữ liệu từ dòng 4 sheet "BanHang_BT7" (A4:G).
2. Tạo bảng tổng hợp phân tích từ cột I đến K:
   - Dòng 3: Tiêu đề "Kênh/Phân Loại", "Doanh Thu", "Chi Phí".
   - Dòng 4-7 liệt kê các kênh bán: Shopee, Lazada, Website, Cửa Hàng. Điền công thức SUMIFS chuẩn tiếng Việt (dùng dấu ;) để cộng tiền Doanh thu bán hàng tương ứng.
   - Dòng 8-9 liệt kê chi phí: Chi Phí Marketing, Chi Phí Vận Hành. Điền công thức SUMIFS tương tự để cộng tiền Chi phí tương ứng.
   - Sử dụng .setFormulasLocal() để chèn công thức chuẩn xác.
3. Tự động vẽ 1 biểu đồ cột (Column Chart) so sánh Doanh thu và Chi phí của các kênh dựa trên bảng tổng hợp trên.
4. Đặt màu chủ đạo của biểu đồ là tông màu Xanh Dương (Xanh Navy đậm cho Doanh thu và Xanh Lam nhạt cho Chi phí). Đặt biểu đồ bên dưới bảng tổng hợp ở cột M.
```

---

#### 📍 BƯỚC 5: Thiết Lập Chức Năng Khởi Tạo Bảng Trống Định Dạng
* **Mục đích:** Viết code cho chức năng `⚙️ Khởi tạo Sheets` để tự động tạo một bảng nhật ký sạch, định dạng viền và tô màu tiêu đề màu xanh dương để nhân viên nhập liệu ngày mới.
* **Câu Prompt gửi cho AI:**
```text
Hãy viết code cho hàm khoiTaoSheets() để xóa sạch dữ liệu cũ trên sheet "BanHang_BT7", chèn lại dòng tiêu đề header (Ngày Giao Dịch, Loại Giao Dịch, Nội Dung, Số Lượng, Đơn Giá, Thành Tiền, Kênh/Phân Loại), tô nền tiêu đề màu xanh dương đậm (#1B365D), chữ trắng in đậm và kẻ viền bảng trống sẵn sàng nhập liệu.
```

---

### 💻 3. Mã Nguồn Apps Script Giải Mẫu (.gs)

```javascript
/**
 * BÀI TẬP 7: MENU UI QUẢN LÝ BÁN HÀNG & VẼ BIỂU ĐỒ THỐNG KÊ XANH DƯƠNG
 */
const CONFIG_BT7 = {
  SHEET_NAME: "BanHang_BT7",
  BLUE_PRIMARY: "#1B365D", // Xanh dương đậm tiêu đề
  BLUE_NAVY: "#1D4ED8",    // Xanh dương vẽ cột doanh thu
  BLUE_LIGHT: "#93C5FD"    // Xanh lam nhạt vẽ cột chi phí
};

/**
 * TẠO MENU UI KHI MỞ FILE GOOGLE SHEETS
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🌸 Quản Lý Bán Hàng")
    .addItem("➕ Thêm đơn hàng", "themDonHang")
    .addItem("📦 Nhập hàng", "nhapHang")
    .addItem("💸 Nhập chi phí", "nhapChiPhi")
    .addSeparator()
    .addItem("📊 Xem Thống Kê", "xemThongKe")
    .addSeparator()
    .addItem("⚙️ Khởi tạo Sheets", "khoiTaoSheets")
    .addToUi();
}

/**
 * CHỨC NĂNG 1: THÊM ĐƠN HÀNG (POPUP)
 */
function themDonHang() {
  SpreadsheetApp.getUi().alert("Chức năng: ➕ Thêm đơn hàng", "Hệ thống đang mở form nhập đơn hàng trực tuyến. Vui lòng kiểm tra!", SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * CHỨC NĂNG 2: NHẬP HÀNG (POPUP)
 */
function nhapHang() {
  SpreadsheetApp.getUi().alert("Chức năng: 📦 Nhập hàng", "Yêu cầu nhập kho sỉ đã được kích hoạt!", SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * CHỨC NĂNG 3: NHẬP CHI PHÍ (POPUP)
 */
function nhapChiPhi() {
  SpreadsheetApp.getUi().alert("Chức năng: 💸 Nhập chi phí", "Form cập nhật chi phí vận hành cửa hàng đã mở!", SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * CHỨC NĂNG 4: XEM THỐNG KÊ VÀ VẼ BIỂU ĐỒ XANH DƯƠNG
 */
function xemThongKe() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG_BT7.SHEET_NAME);
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert("Lỗi: Không tìm thấy sheet 'BanHang_BT7'!");
    return;
  }
  
  var lastRow = sheet.getLastRow();
  if (lastRow < 4) {
    SpreadsheetApp.getUi().alert("Chưa có đủ dữ liệu giao dịch từ dòng 4 để làm thống kê!");
    return;
  }
  
  // Dọn dẹp biểu đồ cũ
  var existingCharts = sheet.getCharts();
  for (var i = 0; i < existingCharts.length; i++) {
    sheet.removeChart(existingCharts[i]);
  }
  
  // 1. Tạo bảng tổng hợp phân tích ở Cột I-K
  sheet.getRange("I3:K3").setValues([["Kênh/Phân Loại", "Doanh Thu", "Chi Phí"]])
    .setBackground(CONFIG_BT7.BLUE_PRIMARY).setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
  
  var channels = [
    ["Shopee"],
    ["Lazada"],
    ["Website"],
    ["Cửa Hàng"],
    ["Chi Phí Marketing"],
    ["Chi Phí Vận Hành"]
  ];
  sheet.getRange("I4:I9").setValues(channels);
  
  // Điền công thức SUMIFS chuẩn tiếng Việt (dùng dấu ;) lồng biến dòng cuối
  var summaryFormulas = [];
  for (var r = 4; r <= 9; r++) {
    var itemLabelCell = "I" + r;
    var salesFormula = '=SUMIFS(F$4:F$' + lastRow + '; B$4:B$' + lastRow + '; "Bán Hàng"; G$4:G$' + lastRow + '; ' + itemLabelCell + ')';
    var costFormula = '=SUMIFS(F$4:F$' + lastRow + '; B$4:B$' + lastRow + '; "Chi Phí"; G$4:G$' + lastRow + '; ' + itemLabelCell + ')';
    summaryFormulas.push([salesFormula, costFormula]);
  }
  
  sheet.getRange("J4:K9").setFormulasLocal(summaryFormulas);
  sheet.getRange("J4:K9").setNumberFormat("#,##0");
  sheet.getRange("I3:K9").setBorder(true, true, true, true, true, true, "#D9D9D9", SpreadsheetApp.BorderStyle.SOLID);
  
  SpreadsheetApp.flush();
  
  // 2. VẼ BIỂU ĐỒ CỘT (COLUMN CHART) TÔNG MÀU XANH DƯƠNG CHỦ ĐẠO
  var chartBuilder = sheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(sheet.getRange("I3:K9"))
    .setPosition(11, 9, 0, 0) // Đặt dưới bảng tổng hợp ở dòng 11, cột I (9)
    .setOption("title", "THỐNG KÊ DOANH THU & CHI PHÍ BÁN HÀNG")
    .setOption("width", 500)
    .setOption("height", 320)
    .setOption("colors", [CONFIG_BT7.BLUE_NAVY, CONFIG_BT7.BLUE_LIGHT]) // Tông màu xanh dương chủ đạo
    .setOption("vAxis", {title: "Số Tiền (VNĐ)", format: "#,##0"})
    .setOption("hAxis", {title: "Kênh Phân Phối"})
    .build();
    
  sheet.insertChart(chartBuilder);
  
  SpreadsheetApp.getUi().alert("Thành công!", "Đã lập bảng phân tích nhanh và vẽ biểu đồ doanh số tông màu Xanh Dương thành công!", SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * CHỨC NĂNG 5: KHỞI TẠO SHEETS MỚI ĐÃ ĐỊNH DẠNG SẴN
 */
function khoiTaoSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG_BT6.SHEET_NAME) || ss.getActiveSheet();
  
  sheet.clear();
  var charts = sheet.getCharts();
  for (var i = 0; i < charts.length; i++) {
    sheet.removeChart(charts[i]);
  }
  
  // Định dạng tiêu đề Banner dòng 1
  sheet.getRange("A1:G1").merge().setValue("SỔ NHẬT KÝ BÁN HÀNG & CHI PHÍ")
    .setBackground(CONFIG_BT7.BLUE_PRIMARY).setFontColor("#FFFFFF").setFontWeight("bold").setFontSize(13)
    .setHorizontalAlignment("center").setVerticalAlignment("center");
  sheet.setRowHeight(1, 35);
  
  // Ghi Headers dòng 3
  var headers = ["Ngày Giao Dịch", "Loại Giao Dịch", "Nội Dung", "Số Lượng", "Đơn Giá", "Thành Tiền", "Kênh/Phân Loại"];
  sheet.getRange(3, 1, 1, headers.length).setValues([headers])
    .setBackground(CONFIG_BT7.BLUE_PRIMARY).setFontColor("#FFFFFF").setFontWeight("bold")
    .setHorizontalAlignment("center");
  sheet.setRowHeight(3, 24);
  
  sheet.getRange("A4:G20").setBorder(true, true, true, true, true, true, "#D9D9D9", SpreadsheetApp.BorderStyle.SOLID);
  sheet.autoResizeColumns(1, headers.length);
  
  SpreadsheetApp.getUi().alert("Khởi tạo thành công!", "Bảng nhật ký bán hàng sạch đã sẵn sàng nhập liệu!", SpreadsheetApp.getUi().ButtonSet.OK);
}
```

---

### 📋 4. Danh Sách Kiểm Tra Nghiệm Thu (Acceptance Checklist)
- [ ] Bảng giao dịch thô `BanHang_BT7` đã được nạp dữ liệu và có 7 cột chính.
- [ ] Hàm `onOpen()` tự động kích hoạt tạo menu `🌸 Quản Lý Bán Hàng` có emojis.
- [ ] Chạy hàm `xemThongKe()` tự động sinh bảng tổng hợp doanh số bán hàng và chi phí ở cột I-K.
- [ ] Công thức trong bảng tổng hợp sử dụng đúng dấu chấm phẩy (`;`) và phương thức `.setFormulasLocal()`.
- [ ] Xuất hiện **Biểu đồ cột (Column Chart)** được tô màu chủ đạo tông **Xanh Dương** hiển thị cột Doanh thu (Xanh dương đậm) và Chi phí (Xanh lam nhạt).
- [ ] Chạy hàm `khoiTaoSheets()` làm sạch trang tính và định dạng khung bảng trống màu xanh dương chuẩn.
