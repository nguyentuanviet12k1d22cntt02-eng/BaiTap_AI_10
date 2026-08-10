# HƯỚNG DẪN BÀI THỰC HÀNH 2 (PROMPT-DRIVEN)
## RA LỆNH CHO AI AGENT XUẤT PHIẾU GIAO HÀNG PDF & LƯU VÀO GOOGLE DRIVE

---

### 📖 1. Tình Huống Doanh Nghiệp Thực Tế (Case Study Context)
* **Bối cảnh:** Bạn là Nhân viên Quản lý Kho vận hoặc Kế toán Bán hàng tại công ty phân phối thiết bị công nghệ. Mỗi ngày công ty phát sinh từ 50 đến 100 đơn hàng cần xuất phiếu giao kho giao cho tài xế và khách hàng.
* **Nỗi đau khi làm thủ công (Before):** Nhân viên phải mở từng dòng trên Sheet, sao chép họ tên, SĐT, địa chỉ, sản phẩm, số tiền rồi dán thủ công vào mẫu Word, bấm Save As PDF, đặt tên file rồi upload vào Google Drive. Mất 2-3 tiếng mỗi ngày và rất dễ gõ nhầm số tiền hoặc sai địa chỉ.
* **Giải pháp AI Tự động (After):** Ra lệnh cho AI Agent tạo sẵn nút bấm `🚀 Xuất Phiếu Giao Hàng PDF` trên Google Sheets. Bấm 1 click là toàn bộ đơn hàng tự động điền vào mẫu Docs, xuất thành PDF lưu thẳng vào Drive và cập nhật link vào bảng tính trong 30 giây.

---

### 🪄 2. Master Prompt (Dán vào Gemini / AI Agent)

```text
Bạn là một Chuyên viên Tự động hóa Quy trình Văn phòng (Office Automation Specialist).

Tôi có:
1. Một Google Sheet tên "DonHang_BT2" chứa danh sách đơn hàng từ dòng 4 gồm:
   - Cột A: Mã Đơn (vd: DH-2026-001)
   - Cột B: Tên Khách Hàng
   - Cột C: Số Điện Thoại
   - Cột D: Địa Chỉ Giao Hàng
   - Cột E: Sản Phẩm
   - Cột F: Số Lượng
   - Cột G: Đơn Giá
   - Cột H: Tổng Tiền
   - Cột I: Trạng Thái ("Chờ xuất" hoặc "Đã xuất")
   - Cột J: Link File PDF
2. Một file mẫu Google Docs có chứa các biến: {{MA_DON}}, {{TEN_KH}}, {{SDT}}, {{DIA_CHI}}, {{SAN_PHAM}}, {{SO_LUONG}}, {{DON_GIA}}, {{TONG_TIEN}}, {{NGAY_XUAT}}.
3. Một thư mục Google Drive để lưu các file PDF xuất ra.

HÃY XÂY DỰNG QUY TRÌNH TỰ ĐỘNG HOÀN TOÀN:
- Tự động duyệt qua các đơn hàng có Trạng Thái là "Chờ xuất".
- Với mỗi đơn, tạo 1 bản sao từ file Docs mẫu, thay thế toàn bộ các biến {{...}} bằng dữ liệu tương ứng của khách hàng.
- Xuất file đó thành định dạng PDF với tên "PhieuGiaoHang_[MãĐơn].pdf" và lưu vào thư mục Drive chỉ định.
- Cập nhật lại Google Sheet: Đổi Trạng Thái thành "Đã xuất" và ghi đường dẫn link file PDF vào cột J.
- Tạo một nút bấm tiện lợi trên menu Google Sheet để nhân viên có thể bấm "Xuất PDF Hàng Loạt" với 1 click.
```
