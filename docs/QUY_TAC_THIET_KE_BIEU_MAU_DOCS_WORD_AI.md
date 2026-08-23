# BỘ QUY TẮC THIẾT KẾ BIỂU MẪU GOOGLE DOCS & MS WORD CHUẨN IN ẤN DÀNH CHO AI
> **Phiên bản:** 2.0 (Khung Tiêu Chuẩn Nền Tảng Cho Mọi Loại Tài Liệu Doanh Nghiệp)  
> **Áp dụng cho AI (Gemini, ChatGPT, Claude):** Khi được yêu cầu thiết kế bất kỳ biểu mẫu nào (Phiếu xuất kho, Phiếu giao hàng, Báo giá, Hóa đơn, Phiếu thu/chi, Biên bản bàn giao, Phiếu lương...) trên Google Docs hoặc Microsoft Word.

---

## 🛑 ĐIỀU KHOẢN CỐT LÕI (BẮT BUỘC TUÂN THỦ 100%)

### 1. Giới Hạn Khổ Giấy & Chống Tràn Lề (Print Boundary)
- **Khổ giấy tiêu chuẩn:** A4 Đứng (*Portrait: 21.0 cm × 29.7 cm*).
- **Lề trang chuẩn:** Lề 2.0 cm đến 2.54 cm mỗi bên.
- **Vùng in khả dụng (Printable Width):** Tối đa **16.0 cm – 17.0 cm**.
- **CẤM:** Tuyệt đối không để bất kỳ bảng biểu, hình ảnh hay dòng chữ nào có bề rộng vượt quá 100% vùng in khả dụng. Khi người dùng dán vào Google Docs / Word, toàn bộ các cột phải hiển thị trọn vẹn trong trang giấy, **không được tràn sang lề phải hoặc bị khuất**.

---

## 📊 NGUYÊN TẮC THIẾT KẾ BẢNG BIỂU (TÁI SỬ DỤNG CHO MỌI BÀI TOÁN)

### 2. Công Thức Phân Bổ Tỉ Lệ Độ Rộng Cột (Column Width Sizing Rules)
Khi tạo bất kỳ bảng nào, AI phải tự động tính toán độ rộng từng cột theo đúng tính chất dữ liệu bên dưới sao cho **TỔNG ĐỘ RỘNG = 100%**:

| Loại Cột | Nội Dung Dữ Liệu | Tỉ Lệ Độ Rộng Cố Định | Căn Lề |
| :--- | :--- | :---: | :---: |
| **Cột Ngắn** | STT, Mã SKU, ĐVT, Số lượng, Size, Màu | **6% – 10%** | Giữa (*Center*) hoặc Phải |
| **Cột Số Liệu / Tiền** | Đơn giá, Thành tiền, Chiết khấu, Thuế VAT | **12% – 16%** | Phải (*Right*) |
| **Cột Ngày Tháng** | Ngày đặt, Ngày giao, Hạn thanh toán | **10% – 12%** | Giữa (*Center*) |
| **Cột Nội Dung Dài** | Tên hàng, Diễn giải, Quy cách, Mô tả | **35% – 50%** | Trái (*Left, Wrap text*) |

#### 📐 Ví dụ phân bổ chuẩn cho các loại bảng phổ biến:
- **Bảng Phiếu Giao Hàng / Hóa Đơn (6 Cột):**  
  `STT (6%)` | `Tên hàng (44%)` | `ĐVT (8%)` | `SL (8%)` | `Đơn giá (17%)` | `Thành tiền (17%)` = **100%**
- **Bảng Phiếu Thu / Chi / Thanh Toán (4 Cột):**  
  `STT (8%)` | `Nội dung thanh toán (56%)` | `Chứng từ kèm theo (16%)` | `Số tiền (20%)` = **100%**
- **Bảng Báo Giá / Hợp Đồng (5 Cột):**  
  `STT (6%)` | `Mô tả sản phẩm / Dịch vụ (50%)` | `ĐVT (10%)` | `Số lượng (10%)` | `Thành tiền (24%)` = **100%**

---

### 3. Tiêu Đề Cột Siêu Ngắn Gọn (Header Conciseness)
- **NGUYÊN TẮC:** Tiêu đề các cột trong bảng phải dùng **từ ngữ ngắn nhất có thể** (1 – 2 từ).
- **CẤM:** Không được đưa mô tả chi tiết, thông số kỹ thuật hoặc ghi chú mở ngoặc vào dòng tiêu đề bảng vì sẽ làm Google Docs tự động kéo phình to cột làm rách bảng.
  - ❌ *Sai:* `Tên sản phẩm, quy cách kỹ thuật (Core i7, 16GB RAM, SSD 512GB)`
  - ✅ *Đúng:* `Tên hàng` hoặc `Tên sản phẩm` *(chi tiết cấu hình đưa vào dòng dữ liệu con)*.

---

### 4. Định Dạng & Thẩm Mỹ Trang In
- **Đường viền bảng (*Borders*):** Mảnh nét đơn `0.5pt`, màu xám dịu (`#cbd5e1`).
- **Màu nền tiêu đề bảng (*Header background*):** Màu xám nhạt (`#f1f5f9`) hoặc xanh nhạt trang nhã (`#f0f7ff`).
- **Dòng tổng kết (*Summary Row*):** Gộp các cột bên trái thành tiêu đề in đậm (*"Tổng cộng tiền hàng"*, *"Thuế VAT"*, *"TỔNG THANH TOÁN"*), ô số tiền căn lề phải rõ ràng.
- **Khu vực chữ ký:** 2 đến 3 cột chữ ký dàn đều chiều ngang ở cuối trang (*Người lập*, *Người giao*, *Người nhận / Thủ trưởng đơn vị*).

---

## 🏷️ QUY TẮC BIẾN TỰ ĐỘNG HÓA (PLACEHOLDERS)
- Cú pháp biến: Đặt trong cặp ngoặc nhọn `{{Ten_Bien}}` (viết liền, không dấu, dùng dấu gạch dưới `_`).
- Biến thông tin chung: `{{Ma_Don}}`, `{{Ngay_Dat}}`, `{{Ten_Khach_Hang}}`, `{{So_Dien_Thoai}}`, `{{Dia_Chi}}`, `{{Tong_Tien}}`, `{{So_Tien_Bang_Chu}}`.
- Biến trong bảng lặp: `{{Ten_San_Pham}}`, `{{DVT}}`, `{{So_Luong}}`, `{{Don_Gia}}`, `{{Thanh_Tien}}`.

---

## 💬 CÂU PROMPT MẪU TỔNG QUÁT (DÙNG ĐƯỢC CHO MỌI BIỂU MẪU)

```text
[TIÊU CHUẨN]: Bạn là Chuyên gia soạn thảo văn bản. Hãy tuân thủ nghiêm ngặt tài liệu "QUY_TAC_THIET_KE_BIEU_MAU_DOCS_WORD_AI.md". Bảng biểu bắt buộc tự động điều chỉnh độ rộng từng cột (STT 6%, Tên hàng 44%, ĐVT 8%, SL 8%, Đơn giá 17%, Thành tiền 17%) vừa khít 100% trang in A4 (~16cm), dùng tiêu đề ngắn gọn, tuyệt đối không để tràn lề phải.

[YÊU CẦU]: Thiết kế mẫu [Tên Biểu Mẫu Cần Làm: Phiếu xuất kho / Báo giá / Phiếu thu...] trên Google Docs...
```
