# HƯỚNG DẪN BÀI THỰC HÀNH 6 (PROMPT-DRIVEN)
## RA LỆNH CHO AI AGENT PHÂN TÍCH NHÓM KHÁCH HÀNG & PHÂN LOẠI RFM TỰ ĐỘNG

---

### 📖 1. Tình Huống Doanh Nghiệp Thực Tế (Case Study Context)
* **Bối cảnh:** Bạn là Chuyên viên Phân tích Dữ liệu (Data Analyst) hoặc Trưởng bộ phận Chăm sóc khách hàng (CRM) tại một chuỗi bán lẻ thời trang. Công ty đang chuẩn bị cho chiến dịch Tri ân cuối năm và cần gửi các chương trình ưu đãi khác nhau đến từng nhóm khách hàng: tặng quà đặc biệt cho khách hàng VIP, mã giảm giá duy trì cho khách hàng Trung thành và thư mời khảo sát kèm quà tặng cho khách hàng đã lâu không mua hàng (Nguy cơ rời bỏ).
* **Nỗi đau khi làm thủ công (Before):** Bạn có một danh sách hơn 1.000 giao dịch thô. Để tính ra được ai là VIP hay ai sắp rời bỏ, bạn phải viết hàng loạt cột phụ, tính ngày mua cuối cùng, đếm số đơn hàng bằng `COUNTIFS`, cộng tiền bằng `SUMIFS`, sau đó dùng hàm `IF` lồng nhau cực kỳ phức tạp để phân loại. Mỗi lần có dữ liệu mới lại phải làm lại từ đầu, mất cả ngày trời và rất dễ nhầm lẫn.
* **Giải pháp AI Tự động (After):** Sử dụng Master Prompt ra lệnh cho AI viết đoạn mã Apps Script tự động. Chỉ với 1 click, hệ thống tự động quét toàn bộ lịch sử đơn hàng, phân tích 3 chỉ số RFM (Recency - Ngày mua gần nhất, Frequency - Tần suất, Monetary - Tổng chi tiêu) của từng khách hàng, xếp loại chính xác và xuất ra một Dashboard báo cáo phân khúc trực quan trong 3 giây!

---

### 🪄 2. Master Prompt Phân Tích RFM Khách Hàng (Dán vào Gemini / AI Agent)

```text
[VAI TRÒ]: Bạn là Chuyên gia Phân tích Dữ liệu và Lập trình viên Google Apps Script chuyên nghiệp.
[NHIỆM VỤ]: Viết một đoạn code Apps Script (.gs) hoàn chỉnh để thực hiện phân tích phân khúc khách hàng theo mô hình RFM từ trang tính "Lịch sử Giao dịch". Không giải thích thêm, chỉ xuất khối mã code duy nhất.

[THÔNG TIN DỮ LIỆU ĐẦU VÀO]:
- Tên Sheet nguồn: "DonHang_BT6"
- Dữ liệu bắt đầu từ dòng 4, bao gồm các cột:
  + Cột A: Mã Đơn Hàng
  + Cột B: Mã Khách Hàng
  + Cột C: Tên Khách Hàng
  + Cột D: Ngày Mua Hàng (Định dạng dd/MM/yyyy)
  + Cột E: Doanh Thu Đơn (VNĐ)

[LUẬT NGHIỆP VỤ & PHÂN TÍCH RFM]:
1. Thuật toán xử lý trên bộ nhớ RAM (In-memory Array) để tối ưu hiệu năng.
2. Với mỗi khách hàng duy nhất (gom nhóm theo Mã Khách Hàng), hãy tính toán:
   - R (Recency): Số ngày kể từ lần mua hàng cuối cùng của khách hàng đó đến ngày chốt báo cáo cố định là "31/08/2026".
   - F (Frequency): Tổng số đơn hàng đã mua (số lần xuất hiện của Mã Khách Hàng).
   - M (Monetary): Tổng số tiền đã chi tiêu (tổng Doanh Thu Đơn).
3. Quy tắc chấm điểm RFM (từ 1 đến 5 điểm cho mỗi tiêu chí):
   - R-Score (Càng nhỏ điểm càng cao - mua gần đây): R <= 15 ngày: 5đ; R <= 45 ngày: 4đ; R <= 90 ngày: 3đ; R <= 180 ngày: 2đ; còn lại: 1đ.
   - F-Score (Càng nhiều điểm càng cao - mua nhiều lần): F >= 10 lần: 5đ; F >= 5 lần: 4đ; F >= 3 lần: 3đ; F >= 2 lần: 2đ; còn lại (1 lần): 1đ.
   - M-Score (Càng lớn điểm càng cao - chi tiêu nhiều): M >= 50.000.000: 5đ; M >= 20.000.000: 4đ; M >= 10.000.000: 3đ; M >= 5.000.000: 2đ; còn lại: 1đ.
4. Phân hạng khách hàng dựa trên Tổng điểm RFM (R-Score + F-Score + M-Score, tối đa 15đ):
   - VIP (Tổng điểm >= 13)
   - Khách Hàng Trung Thành (Tổng điểm từ 10 đến 12)
   - Khách Hàng Tiềm Năng (Tổng điểm từ 7 đến 9)
   - Khách Mới (Tổng điểm từ 5 đến 6)
   - Khách Hàng Nguy Cơ Rời Bỏ (Tổng điểm <= 4)

[ĐẦU RA & TRỰC QUAN HÓA]:
- Tạo tự động Sheet mới tên là "BaoCao_RFM_BT6" (nếu có rồi thì xóa trắng ghi lại).
- Ghi dữ liệu kết quả phân tích gồm các cột: Mã KH, Tên KH, Ngày Mua Cuối, R (ngày), F (lượt), M (VNĐ), R-Score, F-Score, M-Score, Tổng Điểm, Phân Phân Khúc.
- Tạo Bảng Tổng Hợp Phân Khúc ở Cột M đến O (Phân khúc, Số lượng KH, Doanh thu đóng góp) bằng công thức COUNTIF/SUMIF. [BẮT BUỘC CHUẨN LOCALE VIỆT NAM]: Các đối số trong công thức phải được phân cách bằng dấu chấm phẩy (;) (ví dụ: =COUNTIF(K4:K8; "VIP")). Trong Apps Script, bắt buộc sử dụng phương thức .setFormulasLocal() thay vì .setFormulas() để phù hợp với cài đặt Locale Việt Nam của bảng tính.
- Vẽ **Biểu Đồ Tròn (Pie Chart)** hiển thị tỷ lệ phần trăm số lượng khách hàng theo từng phân khúc.
- Vẽ **Biểu Đồ Cột (Column Chart)** hiển thị tổng doanh thu đóng góp của mỗi phân khúc để so sánh.
- Thiết lập định dạng bảng đẹp mắt: tiêu đề màu xanh Navy (#1B365D), chữ trắng, in đậm. Kẻ viền mảnh, định dạng tiền tệ VNĐ cho cột M và cột doanh thu đóng góp.
- Thêm hàm onOpen() để tạo Menu "📊 PHÂN TÍCH" > "Chạy Phân Tích RFM Khách Hàng" trên thanh công cụ.
- Hiển thị hộp thoại Alert thông báo thời gian chạy và số lượng khách hàng thuộc nhóm VIP.

```

---

### 💻 3. Mã Nguồn Apps Script Giải Mẫu (.gs)

```javascript
/**
 * BÀI TẬP 6: PHÂN TÍCH PHÂN KHÚC KHÁCH HÀNG THEO MÔ HÌNH RFM
 */
const CONFIG_BT6 = {
  SOURCE_SHEET: "DonHang_BT6",
  REPORT_SHEET: "BaoCao_RFM_BT6",
  REPORT_DATE: new Date("2026-08-31") // Ngày chốt báo cáo cố định
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("📊 PHÂN TÍCH")
    .addItem("Chạy Phân Tích RFM Khách Hàng", "runRFMAnalysis")
    .addToUi();
}

function runRFMAnalysis() {
  const startTime = new Date().getTime();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getSheetByName(CONFIG_BT6.SOURCE_SHEET);
  
  if (!sourceSheet) {
    SpreadsheetApp.getUi().alert(`Lỗi: Không tìm thấy sheet nguồn "${CONFIG_BT6.SOURCE_SHEET}"!`);
    return;
  }
  
  // Đọc dữ liệu từ dòng 4
  const lastRow = sourceSheet.getLastRow();
  if (lastRow < 4) {
    SpreadsheetApp.getUi().alert("Lỗi: Không có dữ liệu giao dịch!");
    return;
  }
  
  const rawData = sourceSheet.getRange(4, 1, lastRow - 3, 5).getValues();
  
  // 1. Gom nhóm dữ liệu theo từng khách hàng duy nhất
  const customerMap = {};
  
  for (let i = 0; i < rawData.length; i++) {
    const maDon = rawData[i][0];
    const maKH = String(rawData[i][1]).trim();
    const tenKH = String(rawData[i][2]).trim();
    const ngayMua = rawData[i][3];
    const doanhThu = Number(rawData[i][4]) || 0;
    
    if (maKH === "") continue;
    
    let ngayMuaDate;
    if (ngayMua instanceof Date) {
      ngayMuaDate = ngayMua;
    } else {
      // Trường hợp là string dd/MM/yyyy
      const parts = String(ngayMua).split("/");
      if (parts.length === 3) {
        ngayMuaDate = new Date(parts[2], parts[1] - 1, parts[0]);
      } else {
        ngayMuaDate = new Date();
      }
    }
    
    if (!customerMap[maKH]) {
      customerMap[maKH] = {
        maKH: maKH,
        tenKH: tenKH,
        lastPurchase: ngayMuaDate,
        frequency: 0,
        monetary: 0
      };
    }
    
    customerMap[maKH].frequency += 1;
    customerMap[maKH].monetary += doanhThu;
    
    if (ngayMuaDate > customerMap[maKH].lastPurchase) {
      customerMap[maKH].lastPurchase = ngayMuaDate;
    }
  }
  
  // 2. Chấm điểm RFM & Phân loại khách hàng
  const rfmReportRows = [];
  let vipCount = 0;
  
  for (const maKH in customerMap) {
    const cust = customerMap[maKH];
    
    // Tính Recency (số ngày kể từ lần mua cuối tới ngày báo cáo 31/08/2026)
    const diffTime = CONFIG_BT6.REPORT_DATE.getTime() - cust.lastPurchase.getTime();
    let recencyDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (recencyDays < 0) recencyDays = 0; // Đề phòng lỗi ngày tương lai
    
    const f = cust.frequency;
    const m = cust.monetary;
    
    // Chấm điểm R-Score (Càng nhỏ điểm càng cao)
    let rScore = 1;
    if (recencyDays <= 15) rScore = 5;
    else if (recencyDays <= 45) rScore = 4;
    else if (recencyDays <= 90) rScore = 3;
    else if (recencyDays <= 180) rScore = 2;
    
    // Chấm điểm F-Score (Càng lớn điểm càng cao)
    let fScore = 1;
    if (f >= 10) fScore = 5;
    else if (f >= 5) fScore = 4;
    else if (f >= 3) fScore = 3;
    else if (f >= 2) fScore = 2;
    
    // Chấm điểm M-Score (Càng nhiều tiền điểm càng cao)
    let mScore = 1;
    if (m >= 50000000) mScore = 5;
    else if (m >= 20000000) mScore = 4;
    else if (m >= 10000000) mScore = 3;
    else if (m >= 50000000) mScore = 2; // Sửa lỗi logic nếu có
    else if (m >= 5000000) mScore = 2;
    
    const totalScore = rScore + fScore + mScore;
    
    // Phân hạng
    let classification = "Khách Hàng Nguy Cơ Rời Bỏ";
    if (totalScore >= 13) {
      classification = "VIP";
      vipCount++;
    } else if (totalScore >= 10) {
      classification = "Khách Hàng Trung Thành";
    } else if (totalScore >= 7) {
      classification = "Khách Hàng Tiềm Năng";
    } else if (totalScore >= 5) {
      classification = "Khách Mới";
    }
    
    const formattedLastDate = Utilities.formatDate(cust.lastPurchase, "GMT+7", "dd/MM/yyyy");
    
    rfmReportRows.push([
      cust.maKH,
      cust.tenKH,
      formattedLastDate,
      recencyDays,
      f,
      m,
      rScore,
      fScore,
      mScore,
      totalScore,
      classification
    ]);
  }
  
  // 3. Xuất kết quả sang sheet mới
  let reportSheet = ss.getSheetByName(CONFIG_BT6.REPORT_SHEET);
  if (!reportSheet) {
    reportSheet = ss.insertSheet(CONFIG_BT6.REPORT_SHEET);
  } else {
    reportSheet.clear();
  }
  
  // Thiết lập tiêu đề báo cáo
  reportSheet.getRange("A1:K1").merge().setValue("BÁO CÁO PHÂN TÍCH PHÂN KHÚC KHÁCH HÀNG (RFM)")
    .setBackground("#1B365D").setFontColor("#FFFFFF").setFontWeight("bold").setFontSize(13)
    .setHorizontalAlignment("center").setVerticalAlignment("center");
  reportSheet.setRowHeight(1, 35);
  
  // Ghi Headers
  const headers = ["Mã KH", "Tên Khách Hàng", "Ngày Mua Cuối", "R (Ngày)", "F (Lượt)", "M (VNĐ)", "Điểm R", "Điểm F", "Điểm M", "Tổng Điểm", "Phân Phân Khúc"];
  reportSheet.getRange(3, 1, 1, headers.length).setValues([headers])
    .setBackground("#005A9C").setFontColor("#FFFFFF").setFontWeight("bold")
    .setHorizontalAlignment("center");
  
  // Ghi dữ liệu
  if (rfmReportRows.length > 0) {
    reportSheet.getRange(4, 1, rfmReportRows.length, headers.length).setValues(rfmReportRows);
    
    // Định dạng tiền tệ cho cột M (cột 6)
    reportSheet.getRange(4, 6, rfmReportRows.length, 1).setNumberFormat("#,##0");
    
    // Định dạng căn giữa một số cột số
    reportSheet.getRange(4, 3, rfmReportRows.length, 2).setHorizontalAlignment("center");
    reportSheet.getRange(4, 5, rfmReportRows.length, 1).setHorizontalAlignment("center");
    reportSheet.getRange(4, 7, rfmReportRows.length, 4).setHorizontalAlignment("center");
    
    // Auto fit columns
    reportSheet.autoResizeColumns(1, headers.length);
    
    // --------------------------------------------------------------------------
    // 4. TẠO BẢNG TỔNG HỢP PHÂN KHÚC (SUMMARY TABLE)
    // --------------------------------------------------------------------------
    var endRowIndex = 3 + rfmReportRows.length;
    reportSheet.getRange("M3:O3").setValues([["Phân Khúc Khách Hàng", "Số Lượng KH", "Doanh Thu Đóng Góp (VNĐ)"]])
      .setBackground("#1B365D").setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
    
    var segments = [
      "VIP",
      "Khách Hàng Trung Thành",
      "Khách Hàng Tiềm Năng",
      "Khách Mới",
      "Khách Hàng Nguy Cơ Rời Bỏ"
    ];
    
    var summaryFormulas = [];
    for (var s = 0; s < segments.length; s++) {
      var seg = segments[s];
      var countFormula = '=COUNTIF(K4:K' + endRowIndex + '; "' + seg + '")';
      var sumFormula = '=SUMIF(K4:K' + endRowIndex + '; "' + seg + '"; F4:F' + endRowIndex + ')';
      summaryFormulas.push([seg, countFormula, sumFormula]);
    }
    
    reportSheet.getRange("M4:O8").setFormulasLocal(summaryFormulas);
    reportSheet.getRange("N4:N8").setNumberFormat("#,##0").setHorizontalAlignment("center");
    reportSheet.getRange("O4:O8").setNumberFormat("#,##0");
    reportSheet.getRange("M3:O8").setBorder(true, true, true, true, true, true, "#D9D9D9", SpreadsheetApp.BorderStyle.SOLID);
    
    // --------------------------------------------------------------------------
    // 5. VẼ BIỂU ĐỒ TRÒN (PIE CHART) - PHÂN PHỐI SỐ LƯỢNG KHÁCH HÀNG
    // --------------------------------------------------------------------------
    var pieChart = reportSheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(reportSheet.getRange("M3:N8")) // Cột Phân khúc & Số lượng KH
      .setPosition(10, 13, 0, 0) // Đặt ở hàng 10, Cột M (13)
      .setOption("title", "TỶ LỆ PHÂN BỔ KHÁCH HÀNG THEO PHÂN KHÚC")
      .setOption("width", 450)
      .setOption("height", 280)
      .setOption("is3D", true)
      .build();
    reportSheet.insertChart(pieChart);
    
    // --------------------------------------------------------------------------
    // 6. VẼ BIỂU ĐỒ CỘT (COLUMN CHART) - DOANH THU ĐÓNG GÓP CỦA PHÂN KHÚC
    // --------------------------------------------------------------------------
    var columnChart = reportSheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(reportSheet.getRange("M3:M8")) // Trục hoành: Tên Phân khúc
      .addRange(reportSheet.getRange("O3:O8")) // Trục tung: Tổng Doanh thu đóng góp
      .setPosition(25, 13, 0, 0) // Đặt ở hàng 25, Cột M (13)
      .setOption("title", "DOANH THU ĐÓNG GÓP THEO PHÂN KHÚC KHÁCH HÀNG")
      .setOption("width", 450)
      .setOption("height", 280)
      .setOption("legend", {position: "none"})
      .setOption("colors", ["#005A9C"])
      .setOption("vAxis", {format: "#,##0"})
      .build();
    reportSheet.insertChart(columnChart);
  }
  
  const duration = ((new Date().getTime() - startTime) / 1000).toFixed(2);
  SpreadsheetApp.getUi().alert(`Đã hoàn tất phân tích trong ${duration} giây!\n- Tổng số khách hàng: ${rfmReportRows.length}\n- Số khách hàng VIP: ${vipCount}\nKết quả đã được ghi và vẽ biểu đồ xong trong Sheet "${CONFIG_BT6.REPORT_SHEET}"`);
}
```

---

### 🚶 4. Các Bước Thực Hiện Với AI

#### **Bước 1: Kiểm Tra AI Đọc Dữ Liệu**
* Gửi đường link Google Sheet chứa trang dữ liệu `DonHang_BT6` cho AI để kiểm tra xem AI có truy cập đọc được thông tin không.

#### **Bước 2: Phân Tích Cấu Trúc Bảng**
* Yêu cầu AI bóc tách cấu trúc cột, hàng và đề xuất các công thức cần thiết để tính toán RFM cho khách hàng.

#### **Bước 3: Apps Script Vẽ Biểu Đồ (Cột & Tròn)**
* Dán Master Prompt hoặc mã Apps Script mẫu để tính toán điểm RFM, dựng bảng tổng hợp (COUNTIF/SUMIF) và vẽ tự động biểu đồ cột + tròn song song trên Sheet.

#### **Bước 4: Tạo Biểu Mẫu Docs/Word Mẫu**
* Ra lệnh cho AI tạo một file Google Docs template chứa tiêu đề báo cáo phân tích và các thẻ placeholders `{{VIP_Count}}`, `{{Loyal_Count}}`... để phục vụ ghi dữ liệu tự động.

#### **Bước 5: Xuất Báo Cáo PDF Lưu Drive**
* Ra lệnh cho AI nâng cấp code Apps Script để mở bản sao Docs mẫu, điền các số liệu thống kê thật, xuất PDF lưu trên Drive và trả link liên kết về ô H1 của Sheet.

---

### 📋 5. Danh Sách Kiểm Tra Nghiệm Thu (Acceptance Checklist)
- [ ] Đã tạo sheet lịch sử giao dịch `DonHang_BT6` trên Google Trang Tính.
- [ ] Đã copy Master Prompt gửi cho AI Agent/Gemini.
- [ ] Apps Script chạy thành công không có lỗi cú pháp hay timeout.
- [ ] Tự động tạo hoặc làm sạch Sheet mới mang tên `BaoCao_RFM_BT6`.
- [ ] Tính toán chính xác R, F, M cho từng khách hàng (không bị trùng lặp Mã KH).
- [ ] Cột số tiền M (Doanh thu tổng) được định dạng VNĐ dễ đọc có dấu phân cách hàng nghìn.
- [ ] Tự động tạo bảng tổng hợp phân khúc khách hàng bằng công thức `COUNTIF` và `SUMIF` từ cột M đến O.
- [ ] Vẽ thành công **Biểu Đồ Tròn (Pie Chart)** biểu diễn tỷ lệ phân bổ các phân khúc khách hàng.
- [ ] Vẽ thành công **Biểu Đồ Cột (Column Chart)** thể hiện doanh số đóng góp của từng phân khúc.

