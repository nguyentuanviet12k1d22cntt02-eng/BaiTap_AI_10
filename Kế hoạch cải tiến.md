1. Phân Tích Nhóm Khách Hàng & Phân Loại RFM (RFM Analysis)
Tình huống thực tế: Doanh nghiệp có tệp lịch sử mua hàng gồm hàng nghìn dòng. Họ cần phân loại khách hàng để triển khai chiến dịch Marketing cá nhân hóa mà không biết lập trình SQL/Python.
Nhiệm vụ bài tập:
Làm sạch & Tính toán: Tính 3 chỉ số Recency (Ngày mua gần nhất), Frequency (Tần suất mua), Monetary (Tổng số tiền chi tiêu) cho mỗi khách hàng.
Phân nhóm tự động: Dùng AI viết công thức lồng nhau hoặc Apps Script để chấm điểm RFM và xếp loại khách hàng (VIP, Tiềm năng, Cần cứu vãn, Rời bỏ).
Đầu ra: Dashboard thống kê tỷ lệ phần trăm các nhóm khách hàng và tự động cập nhật biểu đồ hình quạt (Pie chart).
2. Tự Động Gom Dữ Liệu & Hợp Nhất Đa Nguồn (Data Consolidation)
Tình huống thực tế: Nhân viên phải copy-paste thủ công dữ liệu doanh thu từ 12 sheet (ứng với 12 tháng) hoặc từ các file báo cáo chi nhánh riêng lẻ để gộp thành 1 bảng tổng.
Nhiệm vụ bài tập:
Tích hợp dữ liệu: Ra lệnh cho AI Agent viết Apps Script tự động quét một thư mục trên Google Drive hoặc các sheet trong file để gộp dữ liệu về một trang tính trung tâm.
Liên kết dữ liệu (Data Enrichment): Sử dụng các hàm XLOOKUP, QUERY kết hợp để map (khớp) thông tin sản phẩm và phân loại khách hàng từ các bảng danh mục (Master Data) khác sang bảng tổng.
3. Dashboard Phân Tích Doanh Thu Đa Chiều & Phát Hiện Bất Thường (KPI Dashboard & Anomaly Alert)
Tình huống thực tế: Cấp quản lý muốn có một góc nhìn tổng quan nhanh và nhận cảnh báo sớm khi doanh thu của chi nhánh hoặc nhóm sản phẩm có biến động lớn.
Nhiệm vụ bài tập:
Thiết kế Dashboard động: Sử dụng hàm FILTER, UNIQUE và SUMIFS động để lọc doanh số theo thời gian và khu vực.
Phát hiện bất thường (Anomaly Detection): Tính toán tốc độ tăng trưởng tuần này so với tuần trước. Nếu giảm quá một ngưỡng quy định (ví dụ: -20%), ô dữ liệu tự động chuyển đỏ (Conditional Formatting) và Apps Script tự động gửi cảnh báo qua Email/Telegram cho quản lý.
4. Tự Động Hóa Nhận Định Báo Cáo Bằng AI (Automated Insights Generation)
Tình huống thực tế: Người phân tích dữ liệu mất rất nhiều thời gian mỗi cuối tuần để ngồi đọc số liệu trên Sheet rồi viết tay các câu nhận định (ví dụ: "Doanh thu tăng nhờ ngành hàng điện tử...", "Cần chú ý chi nhánh A...").
Nhiệm vụ bài tập:
Liên kết API: Gọi trực tiếp API của Gemini/GPT từ trong Google Sheets (thông qua Apps Script).
Tạo báo cáo tự động: Gửi bảng dữ liệu tổng hợp (doanh thu, chi phí, lợi nhuận) cho AI và yêu cầu AI tự động viết 3-5 câu nhận định phân tích ngắn gọn, súc tích bằng Tiếng Việt ngay tại một ô được định vị sẵn trên Dashboard.
5. Phân Tích Hiệu Quả Chiến Dịch & Phễu Chuyển Đổi (Marketing Funnel & ROI)
Tình huống thực tế: Bộ phận Marketing chạy nhiều chiến dịch quảng cáo trên Facebook, Google, TikTok và có số liệu về: Lượt hiển thị (Impression), Lượt click (Click), Lượt điền Form (Lead), Lượt mua hàng (Purchase).
Nhiệm vụ bài tập:
Tính toán phễu: Tính toán Tỷ lệ nhấp (CTR), Tỷ lệ chuyển đổi (CR) qua từng bước của phễu.
Phân tích chi phí & ROI: Tính CPA (Cost Per Acquisition), ROI (Return on Investment) của từng chiến dịch và phân loại chiến dịch nào hiệu quả nhất để tối ưu ngân sách.