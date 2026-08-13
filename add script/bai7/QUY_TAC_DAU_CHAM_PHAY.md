# ⚠️  QUY TẮC CỰC KỲ QUAN TRỌNG: DẤU CHẤM PHẨY TRONG GOOGLE SHEETS VIỆT NAM

## 🎯 VẤN ĐỀ

Google Sheets ở **Việt Nam** sử dụng **dấu CHẤM PHẨY (;)** làm separator trong công thức, **KHÔNG PHẢI** dấu phẩy (,) như ở Mỹ.

---

## ✅ QUY TẮC BẮT BUỘC

### 1. Trong Công Thức Apps Script

Khi viết `.setFormula()` trong Apps Script, **BẮT BUỘC** dùng dấu `;`:

```javascript
// ❌ SAI (dùng dấu phẩy)
dashSheet.getRange("A1").setFormula('=SUM(A1, A2, A3)');
dashSheet.getRange("B1").setFormula('=VLOOKUP(A1, B:C, 2, FALSE)');

// ✅ ĐÚNG (dùng dấu chấm phẩy)
dashSheet.getRange("A1").setFormula('=SUM(A1; A2; A3)');
dashSheet.getRange("B1").setFormula('=VLOOKUP(A1; B:C; 2; FALSE)');
```

---

### 2. Trong QUERY String

Bên trong câu query SQL của Google Sheets, dùng dấu `;`:

```javascript
// ❌ SAI
'=QUERY(A:B; "SELECT A, SUM(B) GROUP BY A")'
//                    ↑ dấu phẩy SAI

// ✅ ĐÚNG
'=QUERY(A:B; "SELECT A; SUM(B) GROUP BY A")'
//                    ↑ dấu chấm phẩy ĐÚNG
```

---

### 3. ⚠️  LỖI NGUY HIỂM: Escape Backslash trong QUERY LABEL

**VẤN ĐỀ:** JavaScript string escape `\\` sẽ tạo ra 2 backslash `\\` trong Google Sheets → LỖI #ERROR!

```javascript
// ❌ SAI - TẠO LỖI #ERROR! (dùng \\)
calcSheet.getRange("A1").setFormula(
  '=QUERY(A:B; "SELECT A; SUM(B) GROUP BY A LABEL SUM(B) \'\\\'")'
);
// → Google Sheets nhận: LABEL SUM(B) '\\'  ← 2 backslash = LỖI cú pháp!

// ✅ ĐÚNG - Không dùng backslash
calcSheet.getRange("A1").setFormula(
  '=QUERY(A:B; "SELECT A; SUM(B) GROUP BY A LABEL SUM(B) \'\'")'
);
// → Google Sheets nhận: LABEL SUM(B) ''  ← empty label = OK!
```

**GIẢI THÍCH:**

| JavaScript Code | Sheets Nhận | Kết Quả |
|----------------|-------------|---------|
| `'\\\\'` | `\\` (2 backslash) | ❌ LỖI #ERROR! |
| `'\''` | `''` (empty string) | ✅ OK - Ẩn label |
| `'Tên Cột'` | `'Tên Cột'` | ✅ OK - Hiện label |

**QUY TẮC VÀNG:**
> Trong QUERY LABEL, **KHÔNG BAO GIỜ** dùng backslash `\`. Chỉ dùng `''` để ẩn label!

---

### 4. Trong ARRAYFORMULA

```javascript
// ❌ SAI
'=ARRAYFORMULA({A:A, B:B})'
//                 ↑ SAI

// ✅ ĐÚNG
'=ARRAYFORMULA({A:A; B:B})'
//                 ↑ ĐÚNG
```

---

### 5. Trong setNumberFormat()

```javascript
// ❌ SAI (dùng dấu phẩy)
dashSheet.getRange("A1").setNumberFormat('#,##0 "VNĐ"');

// ✅ ĐÚNG (dùng dấu chấm phẩy)
dashSheet.getRange("A1").setNumberFormat('#;##0 "VNĐ"');
```

---

### 6. Trong setValues() (Array JavaScript)

**NGOẠI LỆ**: Khi set giá trị bằng JavaScript array, vẫn dùng dấu `,` (vì đây là cú pháp JavaScript):

```javascript
// ✅ ĐÚNG (JavaScript array - dùng dấu phẩy)
dashSheet.getRange("A1:C1").setValues([["Mã SP", "Tên SP", "Giá"]]);
//                                              ↑      ↑      ↑ dấu phẩy OK

// ✅ ĐÚNG (JavaScript array nhiều dòng)
var data = [
  ["SP001", "Laptop Dell", 32000000],
  ["SP002", "Laptop HP", 24000000]
];
dashSheet.getRange(1, 1, 2, 3).setValues(data);
```

---

## 📋 CHECKLIST KIỂM TRA CODE

Trước khi chạy Apps Script, hãy kiểm tra:

- [ ] Tất cả `.setFormula()` dùng dấu `;` trong công thức
- [ ] Tất cả QUERY string dùng dấu `;` trong SELECT, GROUP BY
- [ ] Tất cả `.setNumberFormat()` dùng `#;##0` thay vì `#,##0`
- [ ] Tất cả VLOOKUP, XLOOKUP, IFERROR dùng dấu `;`
- [ ] Tất cả ARRAYFORMULA dùng dấu `;` giữa các cột
- [ ] SUMPRODUCT, MAP, LAMBDA dùng dấu `;`
- [ ] **QUAN TRỌNG**: QUERY LABEL dùng `''` KHÔNG dùng `\\` ⚠️
- [ ] **QUAN TRỌNG**: Không có `\\` nào trong QUERY string ⚠️

---

## 🔍 VÍ DỤ THỰC TẾ TỪ CODE

### Ví dụ 1: Công Thức Dashboard KPI

```javascript
// ✅ ĐÚNG
dashSheet.getRange("A6:B6")
  .setFormula('=SUM(DonHang_BT7!E:E)')
  .setNumberFormat('#;##0 "VNĐ"');
//                 ↑ dấu chấm phẩy
```

### Ví dụ 2: QUERY Phức Tạp

```javascript
// ✅ ĐÚNG
calcSheet.getRange("A2").setFormula(
  '=QUERY(ARRAYFORMULA({' +
  'IFERROR(VLOOKUP(VLOOKUP(ChiTietDonHang_BT7!B2:B; SanPham_BT7!A:C; 3; FALSE); DanhMuc_BT7!A:B; 2; FALSE); "Chưa Rõ"); ' +
  //                                              ↑                    ↑        ↑        ↑ tất cả dùng ;
  'ChiTietDonHang_BT7!E2:E}); ' +
  //                       ↑ ARRAYFORMULA dùng ;
  '"SELECT Col1; SUM(Col2) WHERE Col1 IS NOT NULL GROUP BY Col1 LABEL SUM(Col2) \'\'")'
  //           ↑ QUERY string dùng ;
);
```

### Ví dụ 3: LET với QUERY và MAP

```javascript
// ✅ ĐÚNG
dashSheet.getRange("A29").setFormula(
  '=LET(top; QUERY(DonHang_BT7!B2:E; "SELECT B; COUNT(A); SUM(D) WHERE B IS NOT NULL GROUP BY B ORDER BY SUM(D) DESC LIMIT 5 LABEL B \'\'; COUNT(A) \'\'; SUM(D) \'\'"); ' +
  //        ↑                                 ↑          ↑                                                                 ↑            ↑            ↑
  'HSTACK(' +
  'SEQUENCE(ROWS(top)); ' +
  'MAP(INDEX(top;;1); LAMBDA(mkh; IFERROR(XLOOKUP(mkh; KhachHang_BT7!A:A; KhachHang_BT7!B:B); mkh))); ' +
  //                              ↑                   ↑                    ↑
  'MAP(INDEX(top;;1); LAMBDA(mkh; IFERROR(XLOOKUP(mkh; KhachHang_BT7!A:A; KhachHang_BT7!G:G); "Thường"))); ' +
  'INDEX(top;;3); ' +
  'INDEX(top;;2)' +
  '))'
);
```

---

## 🚨 LỖI THƯỜNG GẶP

### Lỗi 1: "Formula parse error"

**Nguyên nhân:** Dùng dấu phẩy `,` thay vì dấu chấm phẩy `;`

**Ví dụ lỗi:**
```javascript
// ❌ Code này sẽ BÁO LỖI
dashSheet.getRange("A1").setFormula('=SUM(A1, A2)');
// → Error: Formula parse error (Google Sheets VN không hiểu dấu phẩy)
```

**Cách sửa:**
```javascript
// ✅ Sửa thành
dashSheet.getRange("A1").setFormula('=SUM(A1; A2)');
```

---

### Lỗi 2: #ERROR! trong ô sau khi chạy QUERY

**Nguyên nhân:** Dùng `\\` (double backslash) trong QUERY LABEL

**Ví dụ lỗi:**
```javascript
// ❌ Code này tạo #ERROR! trong Google Sheets
calcSheet.getRange("A1").setFormula(
  '=QUERY(A:B; "SELECT A; SUM(B) GROUP BY A LABEL SUM(B) \'\\\'")'
);
// → Sheets nhận: LABEL SUM(B) '\\'  ← 2 backslash = LỖI cú pháp!
```

**Cách sửa:**
```javascript
// ✅ Bỏ backslash, chỉ dùng ''
calcSheet.getRange("A1").setFormula(
  '=QUERY(A:B; "SELECT A; SUM(B) GROUP BY A LABEL SUM(B) \'\'")'
);
// → Sheets nhận: LABEL SUM(B) ''  ← empty label = OK!
```

**GIẢI THÍCH CHI TIẾT:**
```
JavaScript String: "LABEL Col1 '\\'"
                              ↓ (escape sequence)
                    '\\' = 1 backslash + 1 quote
                              ↓ (khi gửi vào Sheets)
Google Sheets nhận: LABEL Col1 '\'
                                 ↑ cú pháp SAI!
                              
JavaScript String: "LABEL Col1 ''"
                              ↓ (không có escape)
                    '' = 2 single quotes
                              ↓ (khi gửi vào Sheets)
Google Sheets nhận: LABEL Col1 ''
                                 ↑ empty label = ĐÚNG!
```

---

### Lỗi 3: Số tiền hiển thị sai format

**Nguyên nhân:** Dùng `#,##0` thay vì `#;##0`

```javascript
// ❌ SAI - Số hiển thị: 1000000 (không có dấu phân cách)
dashSheet.getRange("A1").setNumberFormat('#,##0');

// ✅ ĐÚNG - Số hiển thị: 1.000.000
dashSheet.getRange("A1").setNumberFormat('#;##0');
```

---

## 📝 GHI NHỚ

> **"Trong Google Sheets Việt Nam, mọi dấu phẩy trong công thức ĐỀU PHẢI ĐỔI THÀNH dấu chấm phẩy!"**

**Ngoại lệ duy nhất:** JavaScript array syntax vẫn dùng dấu phẩy (vì đây không phải công thức Sheets)

---

## ✅ TÓM TẮT

| Trường hợp | Dùng dấu gì | Ví dụ | Lưu ý |
|------------|-------------|-------|-------|
| `.setFormula()` | `;` | `=SUM(A1; A2)` | Bắt buộc |
| `.setNumberFormat()` | `;` | `#;##0` | Bắt buộc |
| QUERY string | `;` | `"SELECT A; B"` | Bắt buộc |
| QUERY LABEL | `''` | `LABEL Col1 ''` | **KHÔNG dùng `\\`** ⚠️ |
| ARRAYFORMULA | `;` | `{A:A; B:B}` | Bắt buộc |
| VLOOKUP/XLOOKUP | `;` | `VLOOKUP(key; range; col; mode)` | Bắt buộc |
| JavaScript array `.setValues()` | `,` | `[["A", "B"]]` | Ngoại lệ |

---

**🎓 Tác giả:** Chuyên gia Apps Script & Google Sheets Việt Nam  
**📅 Cập nhật:** Tháng 8/2026
