# HƯỚNG DẪN BÀI THỰC HÀNH 2 (PROMPT-DRIVEN)
## RA LỆNH CHO AI AGENT XUẤT PHIẾU GIAO HÀNG PDF ĐA SẢN PHẨM & LƯU VÀO GOOGLE DRIVE

---

### 📖 1. Tình Huống Doanh Nghiệp Thực Tế (Case Study Context)
* **Bối cảnh:** Bạn là Nhân viên Quản lý Kho vận hoặc Kế toán Bán hàng tại công ty phân phối thiết bị công nghệ. Mỗi ngày công ty phát sinh từ 50 đến 100 đơn hàng. Trong thực tế, **mỗi đơn hàng có thể có nhiều sản phẩm khác nhau** (ví dụ: 1 máy Laptop + 1 Chuột + 1 Balo chống sốc).
* **Nỗi đau khi làm thủ công (Before):** Nhân viên phải mở từng dòng trên Sheet, tìm các dòng có cùng Mã Đơn, kẻ bảng trong Word, copy từng sản phẩm, số lượng, đơn giá, tính tổng tiền, bấm Save As PDF, đặt tên file rồi upload vào Google Drive. Mất 2-3 tiếng mỗi ngày và rất dễ gõ nhầm số tiền hoặc bỏ sót sản phẩm của khách.
* **Giải pháp AI Tự động (After):** Ra lệnh cho AI Agent tạo sẵn nút bấm `🚀 Xuất Phiếu Giao Hàng PDF` trên Google Sheets. Bấm 1 click là hệ thống tự gom nhóm các sản phẩm theo từng đơn hàng, tự động chèn bảng danh sách hàng hóa vào mẫu Google Docs, xuất thành PDF lưu thẳng vào Drive và cập nhật link vào bảng tính trong 30 giây.

---

### 🪄 2. Master Prompt (Dán vào Gemini / AI Agent)

```text
Bạn là một Chuyên viên Tự động hóa Quy trình Văn phòng (Office Automation Specialist).

Tôi có:
1. Một Google Sheet tên "DonHang_BT2" chứa danh sách đơn hàng từ dòng 4 gồm 12 cột:
   - Cột A: Mã Đơn (vd: DH-2026-001 - một mã đơn có thể xuất hiện trên nhiều dòng do có nhiều sản phẩm)
   - Cột B: Ngày Đặt (dd/MM/yyyy)
   - Cột C: Tên Khách Hàng
   - Cột D: Số Điện Thoại
   - Cột E: Địa Chỉ Giao Hàng
   - Cột F: Tên Sản Phẩm
   - Cột G: ĐVT (Đơn vị tính: Chiếc, Bộ, Cái...)
   - Cột H: Số Lượng
   - Cột I: Đơn Giá (VNĐ)
   - Cột J: Thành Tiền (VNĐ)
   - Cột K: Trạng Thái ("Chờ xuất" hoặc "Đã xuất")
   - Cột L: Link File PDF
2. Một file mẫu Google Docs có chứa các biến thông tin chung: {{MA_DON}}, {{NGAY_DAT}}, {{NGAY_XUAT}}, {{TEN_KH}}, {{SDT}}, {{DIA_CHI}}, {{TONG_TIEN}} và một Bảng mẫu có sẵn dòng tiêu đề để điền danh mục sản phẩm.
3. Một thư mục Google Drive để lưu các file PDF xuất ra.

HÃY XÂY DỰNG QUY TRÌNH TỰ ĐỘNG HOÀN TOÀN:
- Duyệt qua Sheet và gom nhóm (group by) các dòng có cùng "Mã Đơn" mà có Trạng Thái là "Chờ xuất".
- Với mỗi đơn hàng:
  1. Tạo 1 bản sao từ file Docs mẫu và thay thế các biến {{...}} bằng thông tin khách hàng.
  2. Tự động chèn các dòng sản phẩm của đơn hàng đó vào Bảng (gồm: STT, Tên Sản Phẩm, ĐVT, Số Lượng, Đơn Giá và Thành Tiền có định dạng VNĐ).
  3. Tính Tổng tiền đơn hàng và điền vào thẻ {{TONG_TIEN}}.
  4. Xuất file đó thành định dạng PDF với tên "PhieuGiaoHang_[MãĐơn].pdf" và lưu vào thư mục Drive chỉ định.
  5. Cập nhật lại Google Sheet: Đổi Trạng Thái thành "Đã xuất" và ghi đường dẫn link file PDF vào cột L cho tất cả các dòng thuộc đơn đó.
- Tạo một menu tùy chỉnh tiện lợi trên Google Sheet để nhân viên có thể bấm "Xuất Phiếu Giao Hàng PDF" với 1 click.
```
