# HƯỚNG DẪN BÀI THỰC HÀNH 4 (PROMPT-DRIVEN)
## RA LỆNH CHO AI AGENT DUYỆT ĐƠN NGHỈ PHÉP & BẮN BOT TELEGRAM

---

### 📖 1. Tình Huống Doanh Nghiệp Thực Tế (Case Study Context)
* **Bối cảnh:** Nhân viên công ty thường xuyên nộp đơn xin nghỉ phép đột xuất qua Google Form. Ban Giám Đốc và các Trưởng phòng thường xuyên đi công tác ngoài văn phòng, không ngồi trực Google Sheet cả ngày.
* **Nỗi đau khi làm thủ công (Before):** Nhân viên nộp đơn từ sáng nhưng đến chiều muộn sếp mới mở máy tính kiểm tra Sheet nên không duyệt kịp thời gian. Nhân viên cũng sốt ruột không biết đơn đã được chuyển tới cấp trên hay chưa.
* **Giải pháp AI Tự động (After):** Ngay khi nhân viên bấm Nộp Form, AI tự sinh mã đơn `NP-2026-XXXX`, bắn tin nhắn thông báo ting ting vào nhóm Telegram trên điện thoại của sếp kèm lý do và số ngày nghỉ, đồng thời gửi email xác nhận cho nhân viên chỉ sau 1 giây.

---

### 🪄 2. Master Prompt (Dán vào Gemini / AI Agent)

```text
Bạn là một Kiến trúc sư Tự động hóa Doanh nghiệp (Enterprise Automation Architect).

Tôi đang có một Google Form liên kết với Google Sheets "DonNghiPhep_BT4" để nhân viên nộp đơn xin nghỉ phép. Các cột dữ liệu gồm:
- Cột 1: Dấu thời gian
- Cột 2: Email Nhân Viên
- Cột 3: Họ Tên Nhân Viên
- Cột 4: Phòng Ban
- Cột 5: Số Ngày Nghỉ
- Cột 6: Từ Ngày
- Cột 7: Đến Ngày
- Cột 8: Lý Do Nghỉ
- Cột 9: Mã Đơn (Đang trống)
- Cột 10: Trạng Thái ("Chờ Quản Lý Duyệt")

HÃY THIẾT LẬP QUY TRÌNH TỰ ĐỘNG HÓA TỨC THÌ (REAL-TIME WORKFLOW):
1. Thiết lập sự kiện tự động kích hoạt ngay khi có người gửi Form mới (onFormSubmit).
2. Tự động sinh Mã Đơn Nghỉ Phép chuẩn hóa dạng "NP-[NămHiệnTại]-[STT 4 chữ số]" (Ví dụ: NP-2026-0001) và ghi vào Cột 9, đồng thời set Cột 10 là "Chờ Quản Lý Duyệt".
3. Gửi tin nhắn thông báo tức thì vào nhóm Telegram của Ban Quản Lý (thông qua Telegram Bot API) với định dạng Markdown chuyên nghiệp hiển thị đầy đủ: Mã đơn, Tên nhân viên, Phòng ban, Số ngày nghỉ, Lý do và Lời nhắc duyệt đơn.
4. Tự động gửi một email xác nhận đến hòm thư của nhân viên thông báo đơn đã được chuyển tới cấp quản lý.
```
