# BỘ QUY TẮC BẮT BUỘC KHI RA LỆNH CHO AI TẠO GOOGLE APPS SCRIPT (GAS)
> **Mục đích:** Đảm bảo mã nguồn do AI (Gemini, ChatGPT, Claude, AI Agents) sinh ra chạy ngay 100% không lỗi, tối ưu hiệu năng, chuẩn Locale Việt Nam và không bị lỗi vặt trong Google Sheets.

---

## I. 10 NGUYÊN TẮC KỸ THUẬT VÀNG (BẮT BUỘC AI PHẢI TUÂN THỦ)

### 1. Phân biệt rõ Hệ tọa độ (1-Indexed vs 0-Indexed) & Khai Báo Hằng Số Cột
* **Google Sheets API:** Sử dụng tọa độ đếm từ **1** (Dòng 1, Cột 1 là ô `A1`).
  * Cú pháp: `sheet.getRange(startRow, startCol, numRows, numCols)`.
* **Mảng JavaScript:** Sử dụng chỉ mục đếm từ **0**.
  * Dữ liệu lấy từ dòng 4 của Sheet thì `data[0]` trong JS tương ứng với dòng 4. Cột A là index 0, Cột B là index 1, Cột C là index 2, Cột L là index 11.
* **BẮT BUỘC KHAI BÁO BIẾN HẰNG SỐ CỘT (CHỐNG LỖI MẤT INDEX):**
  * Để chống triệt để lỗi gõ thiếu index hoặc lỗi trình duyệt AI nuốt mất số `[1]`, `[2]` khi copy, AI **bắt buộc** phải khai báo các hằng số chỉ mục cột trước vòng lặp và truy xuất qua biến:
  ```javascript
  // BẮT BUỘC KHAI BÁO HẰNG SỐ CỘT:
  var COL_CODE   = 0;  // Cột A: Mã chi nhánh
  var COL_NAME   = 1;  // Cột B: Tên chi nhánh
  var COL_REGION = 2;  // Cột C: Khu vực
  var COL_TOTAL  = 11; // Cột L: Tổng tuần
  
  for (var i = 0; i < data.length; i++) {
    // ĐÚNG (Rõ nghĩa và không bao giờ bị nuốt index):
    var branchCode = String(data[i][COL_CODE] || '').trim();
    var branchName = String(data[i][COL_NAME] || '').trim();
    var region     = String(data[i][COL_REGION] || '').trim();
    var weekTotal  = Number(data[i][COL_TOTAL]) || 0;
    
    // TUYỆT ĐỐI CẤM dùng data[i] làm giá trị đơn lẻ (Ví dụ: String(data[i]) là SAI).
  }
  ```

---

### 2. Chuẩn Locale Việt Nam trong Công thức (`setFormulas`)
* **Dấu phân cách tham số:** Bảng tính Google Sheets cài đặt vùng Việt Nam bắt buộc dùng dấu **chấm phẩy (`;`)** để ngăn cách tham số trong hàm (Ví dụ: `=SPARKLINE(D4:J4; ...)`, `=IF(A4>0; "Có"; "Không")`), tuyệt đối **KHÔNG** dùng dấu phẩy (`,`).
* **Ký tự trong ô tính Google Sheets:** Trong ô tính chỉ chứa **1 dấu gạch chéo đơn `\`** (Ví dụ: `=SPARKLINE(D4:J4; {"charttype"\"line"; "color"\"#1a73e8"})`).
* **Quy tắc viết trong Code JavaScript (Apps Script):** Trong chuỗi JS, chỉ cần dùng **2 dấu `\\`** để sinh ra đúng **1 dấu `\`** trong ô tính:
  ```javascript
  // ĐÚNG (Trong chuỗi JS dùng 2 dấu \\ để ô tính nhận đúng 1 dấu \):
  sparklineFormulas.push(['=SPARKLINE(D' + r + ':J' + r + '; {"charttype"\\"line"; "color"\\"#1a73e8"})']);
  
  // SAI (Dùng 4 dấu \\\\ sẽ làm ô tính bị dư thành 2 dấu \\ gây lỗi #ERROR!):
  // SAI: sparklineFormulas.push(['=SPARKLINE(... {"charttype"\\\\"line"...})']);
  ```

---

### 3. Tuyệt đối chỉ dùng API Google Apps Script Chuẩn (CẤM hàm ảo/VBA)
* **CẤM** các hàm và Enum không tồn tại hoặc do AI bịa đặt:
  - ❌ `sheet.setGridlines(false)` hoặc `sheet.showGridlines(false)` ➔ BẮT BUỘC DÙNG: `sheet.setHiddenGridlines(true)` (để ẩn lưới) hoặc `sheet.setHiddenGridlines(false)` (để hiện lưới).
  - ❌ `sheet.moveSheet(1)` hoặc `sheet.setIndex(1)` ➔ BẮT BUỘC DÙNG: `ss.setActiveSheet(sheet); ss.moveActiveSheet(1);`.
  - ❌ `setFormulasLocal()`, `Range.Select()`, `ActiveSheet`, `WorksheetFunction...`.
* **DÙNG CHUẨN:** `setFormulas()`, `getValues()`, `setValues()`, `setHiddenGridlines()`, `SpreadsheetApp.getActiveSpreadsheet()`, `SpreadsheetApp.flush()`.

---

### 4. Quy Tắc Sinh Biểu Đồ Chuẩn Google Sheets (Embedded Charts Master Rules)
* **BẮT BUỘC DÙNG BUILDER CHUYÊN DỤNG (Chống lỗi trắng ruột & lỗi undefined):**
  - Biểu đồ tròn: `dashSheet.newChart().asPieChart()`
  - Biểu đồ cột: `dashSheet.newChart().asColumnChart()`
  - Biểu đồ thanh: `dashSheet.newChart().asBarChart()`
  - Biểu đồ đường: `dashSheet.newChart().asLineChart()`
  - ❌ **CẤM:** Không dùng `SpreadsheetApp.ChartType.PIE` (Lỗi `Cannot read properties of undefined reading 'PIE'`) và không dùng `setChartType()` chung chung.
* **BẮT BUỘC KHAI BÁO `.setNumHeaders(1)` (Chống lỗi biểu đồ rỗng/trắng tinh):**
  - Khi dải dữ liệu nguồn có Dòng 1 là tiêu đề (ví dụ `A1:B9`), bắt buộc gọi `.setNumHeaders(1)` ngay sau `.addRange(dataRange)` để Google Sheets phân biệt nhãn và giá trị số.
* **BẮT BUỘC GỌI `SpreadsheetApp.flush()` TRƯỚC KHI ĐỌC DỮ LIỆU VẼ:**
  - Ép Google Sheets hoàn thành việc tính toán công thức `SUMIFS` trên bảng phụ `Calc_Data` trước khi lấy `getRange()` nạp vào biểu đồ.
* **CƠ CHẾ XÓA BIỂU ĐỒ CŨ (CHỐNG VẼ ĐÈ/CHỒNG LẤN):**
  - Trước khi `insertChart()`, bắt buộc quét qua `sheet.getCharts()` và xóa biểu đồ cũ theo tiêu đề hoặc toạ độ ô neo (`anchorRow`, `anchorCol`).

---

### 5. Quy tắc Batch Operations (Xử lý hàng loạt - Chống Timeout)
* **CẤM** gọi `sheet.getRange().getValue()` hoặc `setValue()` bên trong vòng lặp `for` (Gây chậm và dính lỗi *Exceeded maximum execution time*).
* **QUY TRÌNH BẮT BUỘC:**
  1. Đọc toàn bộ vùng dữ liệu 1 lần vào RAM: `var data = sheet.getRange(...).getValues();`
  2. Xử lý logic / tính toán trên mảng JavaScript.
  3. Ghi kết quả ngược lại Sheet 1 lần duy nhất: `sheet.getRange(...).setValues(outputData);`

---

### 5. Kiểm tra ranh giới dữ liệu (Boundary Safety)
* Luôn kiểm tra số lượng dòng trước khi gọi `getRange()` để tránh lỗi crash *`The number of rows in the range must be at least 1`*:
  ```javascript
  var lastRow = sheet.getLastRow();
  if (lastRow < 4) {
    Logger.log("Chưa có dữ liệu từ dòng 4 trở đi.");
    return;
  }
  var numRows = lastRow - 3; // Số dòng thực tế cần xử lý
  ```

---

### 6. Xử lý kiểu dữ liệu an toàn (Data Cleansing)
* **Số và tiền tệ:** Tránh lỗi cộng chuỗi ký tự (`"12500000"` + `"500000"` thành `"12500000500000"`):
  ```javascript
  var revenue = Number(data[i][3]) || 0; // Luôn ép kiểu Number và fallback về 0
  ```
* **Ngày tháng:** Google Sheets tự nhận diện ô ngày thành `Date` object trong JS. Khi định dạng, dùng:
  ```javascript
  var dateStr = Utilities.formatDate(new Date(data[i][1]), "GMT+7", "dd/MM/yyyy");
  ```

---

### 7. Xuất file & Tương tác Google Docs / Drive / PDF
* Khi tạo file Docs từ mẫu để xuất PDF:
  1. Thay thế biến tag `{{TAG_NAME}}`.
  2. **Bắt buộc** gọi `doc.saveAndClose()` trước khi chuyển đổi sang PDF qua `docFile.getAs(MimeType.PDF)` để đảm bảo nội dung mới được lưu xuống đĩa.
  3. Xóa file Docs tạm sau khi xuất PDF: `docFile.setTrashed(true);`
  4. Cấp quyền xem cho link Drive: `pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);`

---

### 8. Quản lý Trigger tự động (Tránh lỗi lặp vô hạn)
* Khi tạo Time-driven Trigger (hẹn giờ hàng ngày):
  * **Bắt buộc** quét và xóa trigger cũ cùng tên trước khi tạo mới để tránh người dùng bấm nhiều lần sinh ra hàng chục trigger chạy trùng lặp:
  ```javascript
  function setupDailyTrigger() {
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() === "tenHamCanChay") {
        ScriptApp.deleteTrigger(triggers[i]);
      }
    }
    ScriptApp.newTrigger("tenHamCanChay")
      .timeBased()
      .atHour(8)
      .everyDays(1)
      .inTimezone("Asia/Ho_Chi_Minh")
      .create();
  }
  ```

---

### 9. Xử lý giao diện người dùng (UI vs Headless Safe)
* Các hàm tương tác như `Browser.msgBox()` hoặc `SpreadsheetApp.getUi().alert()` chỉ chạy được khi người dùng thao tác trực tiếp trên Sheet.
* Khi chạy ngầm qua Trigger tự động (08h00 sáng), gọi UI sẽ gây lỗi crash. Hãy bọc UI thông báo trong khối `try...catch`:
  ```javascript
  try {
    Browser.msgBox("Thành công!", "Quy trình đã hoàn tất.", Browser.Buttons.OK);
  } catch (e) {
    Logger.log("Chạy ngầm qua Trigger (không có giao diện UI): " + e.toString());
  }
  ```

---

### 11. Kiến Trúc Phản Ứng Dữ Liệu Tự Động Thời Gian Thực (Universal Real-Time Reactive Pipeline)
* **Nguyên tắc Chuỗi Nạp Tự Động (Pipeline Chaining):** 
  - Dữ liệu đi theo 1 chiều khép kín: `Quét Gmail` ➔ *Tự động nạp vào* ➔ `Mail_Log` ➔ *Tự động chuyển tiếp dòng mới sang* ➔ `Giao_Dich` ➔ *Tự động làm mới* ➔ `Calc_Data & Dashboard`.
  - Mọi hàm ghi dữ liệu backend (nạp mail, nhập form) **BẮT BUỘC** gọi hàm làm mới Dashboard ở bước cuối cùng trước khi kết thúc.
* **Nguyên tắc Lắng Nghe Sự Kiện Người Dùng (`onEdit` Reactive Listener):**
  - Luôn tích hợp hàm `onEdit(e)` an toàn để khi người dùng gõ phím, sửa dữ liệu hoặc dán thêm dòng mới trực tiếp vào Sheet nguồn (`Giao_Dich` hoặc `Mail_Log`), hệ thống tự động nhận biết và kích hoạt làm mới Dashboard & các biểu đồ liên quan ngay lập tức.
* **Nguyên tắc Công Thức Dải Ô Mở (Open Range Formula):**
  - Mọi công thức tổng hợp (`SUMIFS`, `COUNTIFS`, `AVERAGEIFS`, `FILTER`) trong bảng tính phụ `Calc_Data` hoặc ô báo cáo **BẮT BUỘC** sử dụng dải ô mở đến vô tận (ví dụ: `Giao_Dich!J3:J`, `Giao_Dich!C3:C`, tuyệt đối KHÔNG viết cứng `J3:J50`) để khi dữ liệu tăng lên hàng nghìn dòng, Google Sheets tự động cộng dồn số liệu tức thì 100%.

---

### 12. Định dạng Code đầu ra (Output Standard)
* AI chỉ xuất **1 khối mã code duy nhất** (Single Code Block).
* Có chú thích rõ ràng bằng tiếng Việt ở từng phần (Khởi tạo Menu, Đọc dữ liệu, Xử lý logic, Ghi kết quả / Gửi mail, Lắng nghe sự kiện onEdit).
* Không cắt xén code dạng `// ... thêm code của bạn vào đây ...`, toàn bộ code phải hoàn chỉnh copy là chạy được ngay.

---

## II. ĐOẠN RÀNG BUỘC KỸ THUẬT MẪU (DÁN KÈM VÀO MỌI PROMPT)

> 💡 **Mẹo:** Mỗi khi bạn gửi Prompt yêu cầu AI viết Google Apps Script, hãy copy đoạn text bên dưới và dán vào cuối câu lệnh Prompt của bạn:

```text
[QUY TẮC KỸ THUẬT APPS SCRIPT BẮT BUỘC]:
1. CHỈ DÙNG API GOOGLE APPS SCRIPT CHUẨN: Tuyệt đối không dùng cú pháp ảo/Excel. Muốn ẩn/hiện lưới dùng sheet.setHiddenGridlines(true/false). Biểu đồ bắt buộc dùng Charts.ChartType.PIE / Charts.ChartType.COLUMN (CẤM dùng SpreadsheetApp.ChartType).
2. CHUẨN LOCALE VIỆT NAM: Nếu dùng công thức trên Sheet (như SPARKLINE, IF, SUMIFS), bắt buộc dùng dấu chấm phẩy (;) phân cách tham số, dấu gạch chéo ngược (\) cho mảng và escape thành (\\) trong chuỗi code JavaScript.
3. TỐI ƯU HIỆU NĂNG (BATCH OPERATIONS): Không gọi getValue()/setValue() trong vòng lặp for. Đọc toàn bộ dữ liệu 1 lần bằng getValues(), xử lý trong mảng RAM và ghi 1 lần bằng setValues().
4. DẢI Ô MỞ LINH HOẠT: Công thức SUMIFS/COUNTIFS phải dùng dải ô mở (như J3:J, C3:C) để tự động co giãn theo dữ liệu mới.
5. PHẢN ỨNG THỜI GIAN THỰC (REACTIVE): Tích hợp hàm onEdit(e) và cơ chế tự động gọi làm mới Dashboard mỗi khi có dòng mới được thêm vào từ Form, Email hoặc gõ trực tiếp.
6. AN TOÀN RANH GIỚI: Luôn kiểm tra lastRow có dữ liệu trước khi gọi getRange() để tránh lỗi phạm vi rỗng.
7. TRIGGER AN TOÀN: Khi tạo Trigger hẹn giờ, luôn xóa các trigger cũ của hàm trước khi tạo trigger mới.
8. XỬ LÝ LỖI UI: Bọc các lệnh Browser.msgBox/alert trong try...catch để code chạy an toàn khi kích hoạt ngầm qua Trigger.
9. XUẤT CODE HOÀN CHỈNH: Chỉ xuất 1 khối mã code duy nhất, đầy đủ từ đầu đến cuối, có comment tiếng Việt rõ ràng, sẵn sàng copy dùng ngay.
```

---

## III. MẪU KHUNG MASTER PROMPT CHUẨN ĐỂ RA LỆNH CHO AI

```text
[VAI TRÒ]: Bạn là Chuyên gia tự động hóa Google Sheets và Google Apps Script cấp cao.

[BỐI CẢNH DỮ LIỆU]:
- Tên Sheet cần xử lý: "[Tên_Sheet_Của_Bạn]"
- Dòng tiêu đề cột: Dòng [3]
- Dữ liệu bắt đầu từ: Dòng [4]
- Cấu trúc các cột:
  + Cột A ([Tên cột A]): [Kiểu dữ liệu]
  + Cột B ([Tên cột B]): [Kiểu dữ liệu]
  + Cột C ([Tên cột C]): [Kiểu dữ liệu]
  ...

[YÊU CẦU NGHIỆP VỤ]:
1. [Mô tả bước 1: Xử lý dữ liệu / Điền công thức gì...]
2. [Mô tả bước 2: Tính toán KPI / Lọc số liệu...]
3. [Mô tả bước 3: Gửi email HTML / Xuất PDF / Tạo biểu đồ...]
4. [Mô tả bước 4: Tạo Menu trên thanh công cụ & Hẹn giờ chạy tự động...]

[QUY TẮC KỸ THUẬT BẮT BUỘC]:
- Tuân thủ toàn bộ 10 nguyên tắc kỹ thuật Apps Script (Chuẩn Locale VN với dấu ;, Batch operations getValues/setValues, xóa trigger cũ trước khi tạo mới, bọc UI trong try-catch).
- Xuất 1 khối mã JavaScript duy nhất hoàn chỉnh 100%, sẵn sàng chạy ngay.
```
