# HƯỚNG DẪN BÀI THỰC HÀNH 5 (PROMPT-DRIVEN)
## RA LỆNH CHO AI AGENT XỬ LÝ & LÀM SẠCH 1.000 DÒNG DỮ LIỆU LỚN TRONG 2 GIÂY

---

### 📖 1. Tình Huống Doanh Nghiệp Thực Tế (Case Study Context)
* **Bối cảnh:** Bạn là Chuyên viên Phân tích Dữ liệu / Vận hành E-Commerce. Cuối mỗi ngày, hệ thống trả về file log hơn 1.000 đơn hàng từ Shopee, Lazada, TikTok Shop, Website hỗn độn.
* **Nỗi đau khi làm thủ công (Before):** Mã đơn bị rỗng hoặc bị trùng do khách bấm mua 2 lần, số điện thoại bị mất số '0' ở đầu hoặc dính dấu chấm/khoảng trắng, doanh thu bị âm. Dùng các hàm Excel thủ công lọc từng dòng mất cả buổi chiều và máy tính bị đơ giật.
* **Giải pháp AI Tự động (After):** Sử dụng Prompt ép AI xử lý mảng trên bộ nhớ RAM (In-Memory Array), toàn bộ 1.000 dòng dữ liệu được lọc sạch, chuẩn hóa họ tên và SĐT 10 số, xuất sang sheet mới tinh tươm chỉ trong 2 giây!

---

### 🪄 2. Master Prompt (Dán vào Gemini / AI Agent)

```text
Bạn là một Chuyên gia Xử lý Dữ liệu Lớn & Tối ưu Hiệu năng Google Workspace (Data Processing & Performance Optimization Expert).

Tôi có sheet "RawData_BT5" chứa hơn 1.000 dòng log đơn hàng đổ về từ các sàn Shopee, Lazada, TikTok Shop (dữ liệu từ dòng 4) với các cột:
- Cột A: Mã Giao Dịch (Có trường hợp bị trống, hoặc bị trùng lặp)
- Cột B: Tên Khách Hàng (Nhiều khoảng trắng thừa, viết hoa/thường lộn xộn)
- Cột C: Số Điện Thoại (Có dấu chấm, khoảng trắng, hoặc bị mất số '0' ở đầu do định dạng số)
- Cột D: Kênh Bán
- Cột E: Doanh Thu (Có bản ghi bị âm hoặc bằng 0 do lỗi hệ thống)
- Cột F: Ngày Tạo

HÃY XÂY DỰNG QUY TRÌNH LÀM SẠCH VÀ CHUẨN HÓA DỮ LIỆU TỐC ĐỘ CAO:
1. NGUYÊN TẮC HIỆU NĂNG: Phải đọc toàn bộ dữ liệu 1 lần duy nhất vào bộ nhớ RAM bằng getValues(), xử lý hoàn toàn trên mảng và ghi xuống sheet đúng 1 lần bằng setValues() để thời gian chạy dưới 3 giây (tránh bị timeout).
2. QUY TẮC LÀM SẠCH (DATA CLEANING):
   - Loại bỏ các dòng có Mã Giao Dịch rỗng.
   - Sử dụng Set để loại bỏ triệt để các Mã Giao Dịch bị trùng lặp (chỉ giữ lại bản ghi đầu tiên).
   - Loại bỏ các dòng có Doanh Thu <= 0.
   - Chuẩn hóa Tên Khách Hàng: Xóa khoảng trắng thừa và viết hoa chữ cái đầu từng từ (vd: "  nguyễn văn an " -> "Nguyễn Văn An").
   - Chuẩn hóa Số Điện Thoại: Xóa toàn bộ ký tự lạ (. - space) và tự động thêm số "0" vào đầu nếu SĐT chỉ có 9 chữ số.
3. ĐẦU RA: Tự động tạo sheet mới tên "DataCleaned_BT5", trang trí tiêu đề và ghi toàn bộ dữ liệu sạch sang đó, đồng thời hiển thị hộp thoại thống kê: Thời gian xử lý, Số dòng ban đầu, Số dòng hợp lệ, Số dòng đã loại bỏ.
```
