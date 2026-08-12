# HƯỚNG DẪN BÀI THỰC HÀNH 6 (PROMPT-DRIVEN)
## RA LỆNH CHO AI AGENT PHÂN TÍCH NHÓM KHÁCH HÀNG & PHÂN LOẠI RFM TỰ ĐỘNG: VẼ BIỂU ĐỒ & XUẤT BÁO CÁO

---

### 📖 1. Tình Huống Doanh Nghiệp Thực Tế (Case Study Context)
* **Bối cảnh:** Bạn là Chuyên viên Phân tích Dữ liệu (Data Analyst) hoặc Trưởng bộ phận Chăm sóc khách hàng (CRM) tại một chuỗi bán lẻ thời trang. Công ty đang chuẩn bị cho chiến dịch Tri ân cuối năm và cần phân khúc khách hàng để gửi các chương trình ưu đãi phù hợp: tặng quà tri ân cho khách hàng VIP, mã giảm giá duy trì cho khách hàng Trung thành và thư mời khảo sát kèm quà tặng cho khách hàng đã lâu không phát sinh đơn hàng (Nguy cơ rời bỏ).
* **Nỗi đau khi làm thủ công (Before):** Bạn có danh sách hàng trăm dòng giao dịch lịch sử. Để tính ra ai là VIP hay ai sắp rời bỏ, bạn phải viết hàng loạt cột phụ, tìm ngày mua cuối cùng, đếm số đơn hàng bằng `COUNTIFS`, cộng tiền bằng `SUMIFS`, sau đó dùng hàm `IF` lồng nhau cực kỳ phức tạp để chấm điểm và phân loại RFM. Mỗi lần có dữ liệu giao dịch mới, bạn lại phải lập lại các thao tác này từ đầu, mất nhiều giờ và cực kỳ dễ nhầm lẫn.
* **Giải pháp AI Tự động (After):** Áp dụng quy trình ra lệnh từng bước cho AI Agent (Gemini/Spark) để tự động hóa toàn diện: từ khâu đọc file, phân tích dữ liệu, tự động viết script tính điểm RFM lập bảng phân khúc, vẽ biểu đồ tròn biểu thị tỷ lệ, vẽ biểu đồ cột thể hiện doanh thu đóng góp, và xuất báo cáo chuyên nghiệp sang file Docs (Word) & PDF lưu trữ chỉ trong 5 giây!

---

### 🪄 2. Quy Trình Ra Lệnh Từng Bước Cho SPARK / AI Agent

#### 📍 BƯỚC 1: Kiểm Tra Xem AI Có Thực Sự Đang Đọc Được File Hay Không
* **Mục đích:** Trước khi thực hiện các yêu cầu lập trình hay phân tích sâu, hãy gửi đường link Google Sheets của bạn cho AI (Spark / Gemini) kèm câu hỏi kiểm tra để chắc chắn AI đã nhận diện và đọc được đầy đủ dữ liệu trong trang tính `DonHang_BT6`.
* **Câu Prompt gửi cho AI:**
```text
https://docs.google.com/spreadsheets/d/19jPP-MwIMPjeDfViicF1jTQBxx-0lTP8HAwR6IqArPI/edit

bạn có thể đọc được nội dung của trang tính "DonHang_BT6" trong link này chứ? Hãy liệt kê 3 dòng dữ liệu đầu tiên để xác nhận.
```
* **💡 Mẹo:** Hãy đảm bảo file Google Sheets đã được bật chế độ chia sẻ là *'Bất kỳ ai có đường liên kết đều có thể xem'* để AI có thể đọc trực tiếp.

---

#### 📍 BƯỚC 2: Yêu Cầu AI Phân Tích Cấu Trúc Bảng & Chỉ Số Phân Phối
* **Mục đích:** Ra lệnh cho AI phân tích chi tiết cấu trúc cột (tên cột, vị trí cột A-E), xác định tọa độ và định dạng dữ liệu để AI hiểu sâu về nghiệp vụ trước khi sinh mã nguồn.
* **Câu Prompt gửi cho AI:**
```text
Hãy phân tích cấu trúc cột của sheet "DonHang_BT6" và đề xuất thuật toán tính 3 chỉ số RFM cho từng khách hàng duy nhất:
1. R (Recency): Khoảng cách số ngày từ lần mua cuối của khách hàng đó đến ngày chốt báo cáo 31/08/2026.
2. F (Frequency): Tổng số đơn hàng của khách hàng.
3. M (Monetary): Tổng doanh thu mua sắm của khách hàng đó.
```

---

#### 📍 BƯỚC 3: Ra Lệnh Cho AI Sinh Mã Apps Script Tính Toán RFM & Vẽ Biểu ĐỒ (Cột & Tròn)
* **Mục đích:** Sử dụng Siêu Prompt chi tiết để yêu cầu AI viết mã Apps Script tính toán điểm RFM, xếp loại phân khúc khách hàng, lập bảng tổng hợp phân khúc, tự động vẽ **Biểu đồ tròn** (tỷ lệ khách hàng) và **Biểu đồ cột** (doanh thu đóng góp).
* **Câu Prompt gửi cho AI:**
```text
Bạn là Lập trình viên Google Apps Script. Viết 1 đoạn code Apps Script (.gs) hoàn chỉnh cho sheet "DonHang_BT6":
1. Đọc dữ liệu từ dòng 4 (A4:E) và tính toán R (so với ngày 31/08/2026), F, M cho mỗi khách hàng.
2. Chấm điểm RFM từ 1-5 theo quy tắc:
   - R: <=15 ngày: 5đ; <=45 ngày: 4đ; <=90 ngày: 3đ; <=180 ngày: 2đ; còn lại: 1đ.
   - F: >=10 lần: 5đ; >=5 lần: 4đ; >=3 lần: 3đ; >=2 lần: 2đ; còn lại: 1đ.
   - M: >=50.000.000: 5đ; >=20.000.000: 4đ; <=10.000.000: 3đ; >=5.000.000: 2đ; còn lại: 1đ.
3. Phân hạng dựa trên tổng điểm RFM (tối đa 15đ): VIP (>=13), Trung thành (10-12), Tiềm năng (7-9), Khách mới (5-6), Nguy cơ rời bỏ (<=4).
4. Ghi kết quả sang sheet mới tên là "BaoCao_RFM_BT6". Định dạng bảng chuyên nghiệp màu Navy.
5. Tạo bảng tổng hợp phân khúc ở cột M-O bằng công thức COUNTIF & SUMIF. [BẮT BUỘC CHUẨN LOCALE VIỆT NAM]: Các đối số trong công thức phải được phân cách bằng dấu chấm phẩy (;) (ví dụ: =COUNTIF(K4:K8; "VIP")). Trong Apps Script, bắt buộc sử dụng phương thức .setFormulasLocal() thay vì .setFormulas() để phù hợp với cài đặt Locale Việt Nam của bảng tính.
6. Vẽ tự động 1 Biểu đồ tròn (Pie Chart) thể hiện tỷ lệ % khách hàng của mỗi phân khúc và 1 Biểu đồ cột (Column Chart) thể hiện doanh số đóng góp của từng phân khúc. Đặt 2 biểu đồ cạnh bảng tổng hợp ở cột Q.
7. Thêm menu "📊 PHÂN TÍCH" > "Chạy Phân Tích RFM Khách Hàng".
```

---

#### 📍 BƯỚC 4: Ra Lệnh Cho AI Thiết Lập Biểu Mẫu Word (Google Docs) Thô
* **Mục đích:** Hướng dẫn AI tạo ra biểu mẫu Docs mẫu đại diện cho một báo cáo phân tích khách hàng chính thức trên Word, chứa các thẻ placeholder `{{VIP_Count}}`, `{{Loyal_Count}}`... để sau này điền dữ liệu tự động.
* **Câu Prompt gửi cho AI:**
```text
Hãy tạo một file Google Docs ```javascript
/**
 * BÀI TẬP 6: PHÂN TÍCH PHÂN KHÚC KHÁCH HÀNG THEO MÔ HÌNH RFM, VẼ BIỂU ĐỒ & XUẤT BÁO CÁO
 */
const CONFIG_BT6 = {
  SOURCE_SHEET: "DonHang_BT6",
  REPORT_SHEET: "BaoCao_RFM_BT6",
  REPORT_DATE: new Date("2026-08-31"), // Ngày chốt báo cáo cố định
  FOLDER_PDF_NAME: "BaoCao_RFM_PDF"
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
  
  const lastRow = sourceSheet.getLastRow();
  if (lastRow < 4) {
    SpreadsheetApp.getUi().alert("Lỗi: Không có dữ liệu giao dịch!");
    return;
  }
  
  const rawData = sourceSheet.getRange(4, 1, lastRow - 3, 5).getValues();
  const customerMap = {};
  
  for (let i = 0; i < rawData.length; i++) {
    const maKH = String(rawData[i][1]).trim();
    const tenKH = String(rawData[i][2]).trim();
    const ngayMua = rawData[i][3];
    const doanhThu = Number(rawData[i][4]) || 0;
    
    if (maKH === "") continue;
    
    let ngayMuaDate;
    if (ngayMua instanceof Date) {
      ngayMuaDate = ngayMua;
    } else {
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
  
  const rfmReportRows = [];
  let vipCount = 0;
  
  for (const maKH in customerMap) {
    const cust = customerMap[maKH];
    const diffTime = CONFIG_BT6.REPORT_DATE.getTime() - cust.lastPurchase.getTime();
    let recencyDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (recencyDays < 0) recencyDays = 0;
    
    const f = cust.frequency;
    const m = cust.monetary;
    
    let rScore = 1;
    if (recencyDays <= 15) rScore = 5;
    else if (recencyDays <= 45) rScore = 4;
    else if (recencyDays <= 90) rScore = 3;
    else if (recencyDays <= 180) rScore = 2;
    
    let fScore = 1;
    if (f >= 10) fScore = 5;
    else if (f >= 5) fScore = 4;
    else if (f >= 3) fScore = 3;
    else if (f >= 2) fScore = 2;
    
    let mScore = 1;
    if (m >= 50000000) mScore = 5;
    else if (m >= 20000000) mScore = 4;
    else if (m >= 10000000) mScore = 3;
    else if (m >= 5000000) mScore = 2;
    
    const totalScore = rScore + fScore + mScore;
    
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
  
  // Sắp xếp báo cáo theo mã khách hàng tăng dần
  rfmReportRows.sort(function(a, b) {
    return a[0].localeCompare(b[0]);
  });
  
  // Ghi kết quả ra sheet BaoCao_RFM_BT6
  var reportSheet = ss.getSheetByName(CONFIG_BT6.REPORT_SHEET);
  if (!reportSheet) {
    reportSheet = ss.insertSheet(CONFIG_BT6.REPORT_SHEET);
  } else {
    reportSheet.clear();
    var oldCharts = reportSheet.getCharts();
    for (var c = 0; c < oldCharts.length; c++) {
      reportSheet.removeChart(oldCharts[c]);
    }
  }
  
  // Thiết lập đường lưới hiển thị
  reportSheet.setHiddenGridlines(false);
  
  // Ghi Banner dòng 1
  reportSheet.getRange("A1:K1").merge().setValue("BÁO CÁO PHÂN TÍCH PHÂN KHÚC KHÁCH HÀNG RFM")
    .setBackground("#1B365D").setFontColor("#FFFFFF").setFontWeight("bold").setFontSize(13)
    .setHorizontalAlignment("center").setVerticalAlignment("center");
  reportSheet.setRowHeight(1, 35);
  
  // Tiêu đề bảng
  var headers = [
    "Mã Khách Hàng", "Tên Khách Hàng", "Ngày Mua Cuối", "Recency (ngày)", 
    "Frequency (lượt)", "Monetary (VNĐ)", "R-Score", "F-Score", "M-Score", 
    "Tổng Điểm", "Phân Phân Khúc"
  ];
  
  reportSheet.getRange("A3:K3").setValues([headers])
    .setBackground("#1B365D").setFontColor("#FFFFFF").setFontWeight("bold")
    .setHorizontalAlignment("center").setVerticalAlignment("center");
  reportSheet.setRowHeight(3, 24);
  
  // Ghi dữ liệu chi tiết
  if (rfmReportRows.length > 0) {
    var dataRange = reportSheet.getRange(4, 1, rfmReportRows.length, 11);
    dataRange.setValues(rfmReportRows);
    
    // Định dạng dữ liệu
    dataRange.setFontFamily("Arial").setFontSize(10);
    reportSheet.getRange(4, 3, rfmReportRows.length, 1).setNumberFormat("dd/mm/yyyy").setHorizontalAlignment("center");
    reportSheet.getRange(4, 4, rfmReportRows.length, 2).setNumberFormat("#,##0").setHorizontalAlignment("right");
    reportSheet.getRange(4, 6, rfmReportRows.length, 1).setNumberFormat("#,##0").setHorizontalAlignment("right");
    reportSheet.getRange(4, 7, rfmReportRows.length, 4).setHorizontalAlignment("center");
    reportSheet.getRange(4, 11, rfmReportRows.length, 1).setFontWeight("bold");
    
    // Kẻ viền mảnh
    dataRange.setBorder(true, true, true, true, true, true, "#D9D9D9", SpreadsheetApp.BorderStyle.SOLID);
  }
  
  // Tự động căn chỉnh cột rộng vừa chữ
  for (var col = 1; col <= 11; col++) {
    reportSheet.autoResizeColumn(col);
  }
  
  // --------------------------------------------------------------------------
  // 4. TẠO BẢNG TỔNG HỢP PHÂN KHÚC (CỘT M - O)
  // --------------------------------------------------------------------------
  var summaryHeaders = ["Phân Khúc Khách Hàng", "Số Lượng KH", "Doanh Thu Đóng Góp (VNĐ)"];
  reportSheet.getRange("M3:O3").setValues([summaryHeaders])
    .setBackground("#1B365D").setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
  
  var segments = [
    "VIP",
    "Khách Hàng Trung Thành",
    "Khách Hàng Tiềm Năng",
    "Khách Mới",
    "Khách Hàng Nguy Cơ Rời Bỏ"
  ];
  
  var endRowIndex = rfmReportRows.length + 3;
  
  const summaryFormulas = [];
  for (let s = 0; s < segments.length; s++) {
    const seg = segments[s];
    const countFormula = '=COUNTIF(K4:K' + endRowIndex + '; "' + seg + '")';
    const sumFormula = '=SUMIF(K4:K' + endRowIndex + '; "' + seg + '"; F4:F' + endRowIndex + ')';
    summaryFormulas.push([seg, countFormula, sumFormula]);
  }
  
  reportSheet.getRange("M4:O8").setFormulasLocal(summaryFormulas);
  reportSheet.getRange("N4:N8").setNumberFormat("#,##0").setHorizontalAlignment("center");
  reportSheet.getRange("O4:O8").setNumberFormat("#,##0");
  reportSheet.getRange("M3:O8").setBorder(true, true, true, true, true, true, "#D9D9D9", SpreadsheetApp.BorderStyle.SOLID);
  
  // VẼ BIỂU ĐỒ TRÒN (PIE CHART) - PHÂN PHỐI SỐ LƯỢNG
  var pieChart = reportSheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(reportSheet.getRange("M3:N8"))
    .setPosition(10, 13, 0, 0)
    .setOption("title", "TỶ LỆ PHÂN BỔ KHÁCH HÀNG THEO PHÂN KHÚC")
    .setOption("width", 400)
    .setOption("height", 280)
    .setOption("is3D", true)
    .build();
  reportSheet.insertChart(pieChart);
  
  // VẼ BIỂU ĐỒ CỘT (COLUMN CHART) - DOANH THU ĐÓNG GÓP
  var columnChart = reportSheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(reportSheet.getRange("M3:M8"))
    .addRange(reportSheet.getRange("O3:O8"))
    .setPosition(25, 13, 0, 0)
    .setOption("title", "DOANH THU ĐÓNG GÓP THEO PHÂN KHÚC KHÁCH HÀNG")
    .setOption("width", 400)
    .setOption("height", 280)
    .setOption("legend", {position: "none"})
    .setOption("colors", ["#005A9C"])
    .setOption("vAxis", {format: "#,##0"})
    .build();
  reportSheet.insertChart(columnChart);
}
      .build();
    
    targetSheet.getRange("M10").setRichTextValue(richText)
               .setBackground("#28a745")
               .setFontColor("#FFFFFF")
               .setFontWeight("bold")
               .setHorizontalAlignment("center")
               .setVerticalAlignment("middle");
               
    SpreadsheetApp.getUi().alert('✅ Đã phân tích RFM và xuất báo cáo PDF thành công!\nLink PDF đã được gắn tại ô H1.');
    
  } catch (e) {
    SpreadsheetApp.getUi().alert("⚠️ Đã phân tích xong dữ liệu, nhưng có lỗi khi tạo PDF: " + e.message);
  }
}

// Hàm hỗ trợ ép kiểu Ngày
function parseDate_(val) {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (typeof val === 'string' && val.trim() !== '') {
    var parts = val.trim().split('/');
    if (parts.length === 3) {
      return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
    }
    var d = new Date(val);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

// Hàm hỗ trợ ép kiểu Số
function parseNumber_(val) {
  if (typeof val === 'number') return val;
  if (typeof val === 'string' && val.trim() !== '') {
    var clean = val.replace(/\./g, '').replace(/,/g, '').trim();
    var n = parseFloat(clean);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}
```

---

### 📋 4. Danh Sách Kiểm Tra Nghiệm Thu (Acceptance Checklist)
- [ ] Sheet dữ liệu thô `DonHang_BT6` đã được tạo và điền đầy đủ dữ liệu.
- [ ] AI Agent nhận link Sheet và đọc chính xác 3 dòng dữ liệu đầu tiên.
- [ ] Apps Script chạy thành công, tự động tính các cột R, F, M và Phân Phân Khúc.
- [ ] Bảng tổng hợp phân khúc (cột M-O) được tạo tự động bằng công thức `COUNTIF`/`SUMIF`.
- [ ] Xuất hiện **Biểu Đồ Tròn (Pie Chart)** thể hiện tỷ lệ % các nhóm khách hàng.
- [ ] Xuất hiện **Biểu Đồ Cột (Column Chart)** thể hiện doanh số đóng góp của từng nhóm.
- [ ] (Nâng cao) Bản sao tài liệu Docs/Word mẫu được điền biến và xuất thành PDF thành công vào Drive.
