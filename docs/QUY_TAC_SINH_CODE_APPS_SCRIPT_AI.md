# BỘ QUY TẮC BẮT BUỘC KHI RA LỆNH CHO AI TẠO GOOGLE APPS SCRIPT (GAS)
> **Mục đích:** Đảm bảo mã nguồn do AI (Gemini, ChatGPT, Claude, AI Agents) sinh ra chạy ngay 100% không lỗi, tối ưu hiệu năng, chuẩn Locale Việt Nam và không bị lỗi vặt trong Google Sheets.

---

## I. 10 NGUYÊN TẮC KỸ THUẬT VÀNG (BẮT BUỘC AI PHẢI TUÂN THỦ)

### 1. Phân biệt rõ Hệ tọa độ (1-Indexed vs 0-Indexed)
* **Google Sheets API:** Sử dụng tọa độ đếm từ **1** (Dòng 1, Cột 1 là ô `A1`).
  * Cú pháp: `sheet.getRange(startRow, startCol, numRows, numCols)`.
* **Mảng JavaScript:** Sử dụng chỉ mục đếm từ **0**.
  * Dữ liệu lấy từ dòng 4 của Sheet thì `data[0]` trong JS tương ứng với dòng 4. Cột A là `data[i][0]`, Cột B là `data[i][1]`, Cột L (cột 12) là `data[i][11]`.

---

### 2. Chuẩn Locale Việt Nam trong Công thức (`setFormulas`)
* **Dấu phân cách tham số:** Bảng tính Google Sheets cài đặt vùng Việt Nam bắt buộc dùng dấu **chấm phẩy (`;`)** để ngăn cách tham số trong hàm (Ví dụ: `=SPARKLINE(D4:J4; ...)`, `=IF(A4>0; "Có"; "Không")`), tuyệt đối **KHÔNG** dùng dấu phẩy (`,`).
* **Ký tự ngăn cách trong Mảng Literal:** Trong công thức như `=SPARKLINE(D4:J4; {"charttype"\"line"; "color"\"#1a73e8"})`, dấu gạch chéo ngược `\` được dùng để ngăn cách key-value.
* **Quy tắc Escape trong Code JS:** Khi gán chuỗi công thức trong Apps Script, ký tự `\` phải được escape thành `\\`:
  ```javascript
  // ĐÚNG:
  sparklineFormulas.push(['=SPARKLINE(D' + r + ':J' + r + '; {"charttype"\\\\"line"; "color"\\\\"#1a73e8"})']);
  
  // SAI (gây lỗi #ERROR hoặc lỗi biên dịch JS):
  sparklineFormulas.push(['=SPARKLINE(D' + r + ':J' + r + ', {"charttype","line"})']);
  ```

---

### 3. Tuyệt đối chỉ dùng API Google Apps Script (Không dùng VBA/Excel)
* **CẤM** các hàm không tồn tại trong GAS như: `setFormulasLocal()`, `Range.Select()`, `ActiveSheet`, `WorksheetFunction...`.
* **DÙNG CHUẨN:** `setFormulas()`, `getValues()`, `setValues()`, `SpreadsheetApp.getActiveSpreadsheet()`, `SpreadsheetApp.flush()`.

---

### 4. Quy tắc Batch Operations (Xử lý hàng loạt - Chống Timeout)
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

### 10. Định dạng Code đầu ra (Output Standard)
* AI chỉ xuất **1 khối mã code duy nhất** (Single Code Block).
* Có chú thích rõ ràng bằng tiếng Việt ở từng phần (Khởi tạo Menu, Đọc dữ liệu, Xử lý logic, Ghi kết quả / Gửi mail).
* Không cắt xén code dạng `// ... thêm code của bạn vào đây ...`, toàn bộ code phải hoàn chỉnh copy là chạy được ngay.

---

## II. ĐOẠN RÀNG BUỘC KỸ THUẬT MẪU (DÁN KÈM VÀO MỌI PROMPT)

> 💡 **Mẹo:** Mỗi khi bạn gửi Prompt yêu cầu AI viết Google Apps Script, hãy copy đoạn text bên dưới và dán vào cuối câu lệnh Prompt của bạn:

```text
[QUY TẮC KỸ THUẬT APPS SCRIPT BẮT BUỘC]:
1. CHỈ DÙNG API GOOGLE APPS SCRIPT: Tuyệt đối không dùng cú pháp của Excel (như setFormulasLocal, WorksheetFunction).
2. CHUẨN LOCALE VIỆT NAM: Nếu có dùng công thức trên Sheet (như SPARKLINE, IF, SUMIFS), bắt buộc dùng dấu chấm phẩy (;) phân cách tham số, dấu gạch chéo ngược (\) cho mảng và escape thành (\\) trong chuỗi code JavaScript.
3. TỐI ƯU HIỆU NĂNG (BATCH OPERATIONS): Không gọi getValue()/setValue() trong vòng lặp for. Đọc toàn bộ dữ liệu 1 lần bằng getValues(), xử lý trong mảng RAM và ghi 1 lần bằng setValues().
4. AN TOÀN RANH GIỚI: Luôn kiểm tra lastRow có dữ liệu trước khi gọi getRange() để tránh lỗi phạm vi rỗng.
5. TRIGGER AN TOÀN: Khi tạo Trigger hẹn giờ, luôn xóa các trigger cũ của hàm trước khi tạo trigger mới.
6. XỬ LÝ LỖI UI: Bọc các lệnh Browser.msgBox/alert trong try...catch để code chạy an toàn khi kích hoạt ngầm qua Trigger.
7. XUẤT CODE HOÀN CHỈNH: Chỉ xuất 1 khối mã code duy nhất, đầy đủ từ đầu đến cuối, có comment tiếng Việt rõ ràng, sẵn sàng copy dùng ngay.
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
