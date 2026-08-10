# HƯỚNG DẪN BÀI THỰC HÀNH 3 (PROMPT-DRIVEN)
## RA LỆNH CHO AI AGENT GỬI PHIẾU LƯƠNG CÁ NHÂN HÓA QUA GMAIL

---

### 📖 1. Tình Huống Doanh Nghiệp Thực Tế (Case Study Context)
* **Bối cảnh:** Bạn là Chuyên viên Nhân sự (C&B / HR) phụ trách gửi phiếu lương hàng tháng cho 50 nhân viên. Thu nhập cá nhân là thông tin nhạy cảm bắt buộc phải bảo mật 100% giữa các nhân sự.
* **Nỗi đau khi làm thủ công (Before):** Gửi thủ công từng email riêng rất dễ gửi nhầm bảng lương của người này cho người khác (vi phạm bảo mật lương nghiêm trọng). Nếu gửi giữa chừng bị mạng chập chờn thì không nhớ ai đã gửi ai chưa, dẫn đến gửi trùng lặp gây phiền toái.
* **Giải pháp AI Tự động (After):** AI Agent tự động quét bảng lương: tự tách riêng thu nhập từng người, soạn email HTML chuyên nghiệp (định dạng VNĐ), gửi riêng biệt, ghi nhận thời gian gửi và tự động khóa chống gửi trùng.

---

### 🪄 2. Master Prompt (Dán vào Gemini / AI Agent)

```text
Bạn là một Trợ lý Tự động hóa Nhân sự (HR Automation Specialist).

Tôi có bảng tính Google Sheets tại sheet "BangLuong_BT3" với các cột từ dòng 4:
- Cột A: Mã NV (vd: NV001)
- Cột B: Họ và Tên
- Cột C: Phòng Ban
- Cột D: Email Nhận
- Cột E: Lương Cơ Bản
- Cột F: Phụ Cấp
- Cột G: Thưởng KPI
- Cột H: Khấu Trừ
- Cột I: Thực Lĩnh
- Cột J: Trạng Thái ("Chưa gửi" hoặc "Đã gửi")
- Cột K: Thời Gian Gửi

HÃY XÂY DỰNG QUY TRÌNH TỰ ĐỘNG GỬI PHIẾU LƯƠNG BẢO MẬT:
1. Chỉ gửi cho các nhân viên có Trạng Thái là "Chưa gửi" và có địa chỉ email hợp lệ.
2. Thiết kế mẫu email định dạng HTML tuyệt đẹp, trang nhã (tông màu xanh navy #1B365D), hiển thị rõ ràng từng khoản lương: Lương CB, Phụ cấp, Thưởng (+), Khấu trừ (-) và ô THỰC LĨNH to, nổi bật màu xanh dương đậm (định dạng tiền tệ VNĐ có dấu phân cách hàng nghìn).
3. Tiêu đề email: "[PHIẾU LƯƠNG THÁNG MM/YYYY] - Kính gửi [Họ và Tên Nhân Viên]".
4. Sau khi gửi thành công cho ai: Lập tức đổi Trạng Thái thành "Đã gửi" và ghi ngày giờ gửi chi tiết (dd/MM/yyyy HH:mm:ss) vào Cột K.
5. Thêm cơ chế bảo vệ: Khi người dùng bấm chạy lại lần 2, hệ thống tự động bỏ qua những người đã gửi, tuyệt đối không gửi trùng lặp.
```
