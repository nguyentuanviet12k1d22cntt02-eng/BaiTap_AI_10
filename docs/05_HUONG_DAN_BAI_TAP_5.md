# HƯỚNG DẪN THỰC HÀNH BÀI 5: TỰ ĐỘNG KIỂM TRA VÀ LÀM SẠCH DỮ LIỆU LỚN
## XỬ LÝ HƠN 1.000 DÒNG DỮ LIỆU TRONG DƯỚI 2 GIÂY TRÊN GOOGLE SHEETS

---

### 1. TÌNH HUỐNG THỰC TẾ TRONG DOANH NGHIỆP

* **Bối cảnh:** Bạn là nhân viên văn phòng, kế toán hoặc quản lý đơn hàng. Mỗi ngày hệ thống xuất ra danh sách hơn 1.000 đơn hàng đổ về từ các sàn Shopee, Lazada, TikTok Shop và Website tại sheet `RawData_BT5`.
* **Khó khăn khi làm thủ công:** 
  - Mã đơn hàng bị để trống hoặc bị trùng lặp do khách bấm mua nhiều lần.
  - Số điện thoại bị mất số 0 ở đầu do định dạng số của Excel, hoặc dính dấu chấm, khoảng trắng (ví dụ: `0903.123.456`, `988123456`).
  - Họ tên viết hoa và viết thường tùy tiện, có nhiều khoảng trắng thừa.
  - Doanh thu có dòng bị âm hoặc bằng 0 do lỗi hệ thống.
  - Dùng các hàm Excel thủ công để lọc từng dòng mất cả buổi chiều, rất dễ làm đơ máy và có nguy cơ làm hỏng dữ liệu gốc.
* **Giải pháp tự động hóa:**
  - Áp dụng mô hình **1 Bước = 1 File Độc Lập**.
  - Kiểm tra an toàn trước: Quét dữ liệu thô và xuất danh sách các dòng lỗi ra sheet riêng `Bao_Cao_Loi` để kiểm tra đối soát trước, không sửa đè lên dữ liệu gốc.
  - Xử lý siêu tốc: Gom dữ liệu vào bộ nhớ máy để lọc trùng, sửa tên, sửa số điện thoại và lưu sang sheet `DataCleaned_BT5` trong **dưới 2 giây**.
  - Tự động tách đơn hàng về các sheet riêng cho từng sàn (`San_Shopee`, `San_Lazada`, `San_TikTok Shop`, `San_Website`).
  - Tạo trang **Báo Cáo Tổng Quan** hiển thị các con số thống kê và cài đặt hẹn giờ tự chạy lúc 23:30 mỗi đêm.

---

### 2. MASTER PROMPT TỔNG HỢP (NẾU MUỐN LÀM TRỌN GÓI)

```text
[TIÊU CHUẨN KỸ THUẬT]: Hãy áp dụng toàn bộ quy tắc trong file "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

Bạn là chuyên gia Google Sheets. Tôi có sheet "RawData_BT5" chứa hơn 1.000 dòng đơn hàng từ dòng 4 (gồm Mã Giao Dịch, Tên Khách Hàng, Số Điện Thoại, Kênh Bán, Doanh Thu, Ngày Tạo).

Hãy viết trọn bộ mã Google Apps Script tự động hóa làm sạch dữ liệu:
1. Tạo thanh menu "Làm Sạch Dữ Liệu" trên bảng tính để dễ bấm thao tác.
2. Kiểm tra dữ liệu và xuất danh sách các dòng bị lỗi sang sheet "Bao_Cao_Loi" để xem trước (mã để trống, mã trùng, số điện thoại sai, tên thừa khoảng trắng, doanh thu âm).
3. Làm sạch dữ liệu siêu tốc sang sheet "DataCleaned_BT5" trong dưới 2 giây: xóa đơn trùng, xóa mã trống, lọc doanh thu âm, viết hoa chữ cái đầu cho họ tên và tự thêm số 0 cho số điện thoại.
4. Tự động tách đơn hàng ra các sheet riêng theo kênh bán (Shopee, Lazada, TikTok Shop, Website).
5. Tạo trang "Bao_Cao_Tong_Quan" hiển thị 4 con số thống kê và 2 biểu đồ.
6. Hẹn giờ tự động chạy làm sạch và cập nhật báo cáo lúc 23:30 mỗi đêm.

Yêu cầu: Viết theo từng file riêng biệt, xử lý thật nhanh không làm đơ bảng tính và không dùng biểu tượng cảm xúc.
```

---

### 3. DANH SÁCH CÁC TỆP MÃ NGUỒN ĐỘC LẬP TRONG BÀI

```
Hệ Thống Làm Sạch Dữ Liệu
├── 1_Menu_LamSach.gs       (Bước 1: Tạo menu tiện ích trên thanh công cụ)
├── 2_KiemTra_BaoCaoLoi.gs   (Bước 2: Quét kiểm tra dữ liệu và lập danh sách lỗi ra sheet Bao_Cao_Loi)
├── 3_XuLy_LamSach.gs       (Bước 3: Làm sạch dữ liệu siêu tốc dưới 2 giây ra sheet DataCleaned_BT5)
├── 4_TachSheet_KenhBan.gs   (Bước 4: Tự động tách dữ liệu thành các sheet theo từng kênh bán)
├── 5_BaoCao_TongQuan.gs     (Bước 5: Tạo trang báo cáo tổng quan và biểu đồ thống kê)
├── 6_HenGio_TuDong.gs      (Bước 6: Hẹn giờ tự động chạy làm sạch lúc 23:30 mỗi đêm)
└── BangTuyChon.html         (Bước 7: Cửa sổ tùy chọn các quy tắc làm sạch dữ liệu)
```

---

### 4. LỘ TRÌNH 8 BƯỚC THỰC HÀNH CHI TIẾT (PROMPT RÚT GỌN CHO DÂN VĂN PHÒNG)

#### BƯỚC 0: AI ĐỌC VÀ NẮM RÕ SHEET `RawData_BT5`
* **Mục tiêu:** Cho AI đọc đường link Google Sheets để hiểu các cột và các lỗi có sẵn trước khi viết code.
* **Câu Prompt:**
```text
Link Google Sheets: [Dán link bảng tính của bạn vào đây]

Tôi có bảng dữ liệu đơn hàng ở sheet "RawData_BT5" (dữ liệu từ dòng 4 trở đi).
Bạn hãy đọc sheet này và chỉ ra cho tôi các cột dữ liệu cùng các lỗi sai phổ biến đang có trong bảng (như mã bị trống, mã bị trùng, số điện thoại sai định dạng, họ tên thừa khoảng trắng, doanh thu âm).
Chưa cần viết code ở bước này.
```

---

#### BƯỚC 1: TẠO FILE `1_Menu_LamSach.gs`
* **Thao tác:** Đính kèm file `QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md` ➔ Mở Tiện ích mở rộng ➔ Apps Script ➔ Bấm dấu (+) chọn Script ➔ Đặt tên file là `1_Menu_LamSach.gs` ➔ Dán mã AI sinh ra vào.
* **Câu Prompt:**
```text
[TIÊU CHUẨN KỸ THUẬT]: Hãy áp dụng toàn bộ quy tắc trong file "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

Hãy viết mã cho file "1_Menu_LamSach.gs" để tạo một thanh menu tên "Làm Sạch Dữ Liệu" trên Google Sheets gồm các mục:
1. 1. Xem Báo Cáo Tổng Quan
2. 2. Kiểm Tra Dữ Liệu (Xuất Sheet Báo Cáo Lỗi)
3. 3. Chạy Làm Sạch Dữ Liệu (Dưới 2 Giây)
4. 4. Tách Dữ Liệu Theo Kênh Bán Hàng
5. 5. Tùy Chọn Quy Tắc Làm Sạch (mở file BangTuyChon.html)
6. 6. Bật Tự Động Chạy Hàng Đêm (23:30)
7. 7. Tắt Tự Động Chạy Hàng Đêm
8. 8. Hướng Dẫn Sử Dụng
Lưu ý: Không dùng biểu tượng cảm xúc trong menu và thông báo.
```

---

#### BƯỚC 2: TẠO FILE `2_KiemTra_BaoCaoLoi.gs`
* **Thao tác:** Đính kèm file `QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md` ➔ Bấm dấu (+) chọn Script ➔ Đặt tên file là `2_KiemTra_BaoCaoLoi.gs` ➔ Dán mã AI sinh ra vào.
* **Câu Prompt:**
```text
[TIÊU CHUẨN KỸ THUẬT]: Hãy áp dụng toàn bộ quy tắc trong file "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

Hãy viết mã cho file "2_KiemTra_BaoCaoLoi.gs":
Quét toàn bộ dữ liệu ở sheet "RawData_BT5" (từ dòng 4 trở đi) và xuất danh sách các dòng bị lỗi sang sheet mới tên "Bao_Cao_Loi" để tôi đối soát:
- Tìm các lỗi: mã đơn bị để trống, mã đơn bị trùng lặp, doanh thu nhỏ hơn hoặc bằng 0, số điện thoại có dấu chấm hoặc mất số 0 đầu, họ tên viết hoa lộn xộn hoặc thừa khoảng trắng.
- Liệt kê rõ: Dòng lỗi, Mã giao dịch, Tên khách hàng, Số điện thoại, Kênh bán, Doanh thu, Phân loại lỗi và Chi tiết lỗi.
- Có một dòng tóm tắt số lượng lỗi ở đầu sheet.
- Giữ nguyên dữ liệu gốc không chỉnh sửa và không dùng biểu tượng cảm xúc.
```

---

#### BƯỚC 3: TẠO FILE `3_XuLy_LamSach.gs`
* **Thao tác:** Đính kèm file `QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md` ➔ Bấm dấu (+) chọn Script ➔ Đặt tên file là `3_XuLy_LamSach.gs` ➔ Dán mã AI sinh ra vào.
* **Câu Prompt:**
```text
[TIÊU CHUẨN KỸ THUẬT]: Hãy áp dụng toàn bộ quy tắc trong file "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

Hãy viết mã cho file "3_XuLy_LamSach.gs":
Tự động làm sạch toàn bộ dữ liệu từ sheet "RawData_BT5" và lưu kết quả sang sheet mới tên "DataCleaned_BT5":
- Xóa bỏ các dòng có mã đơn để trống, mã đơn bị trùng lặp hoặc doanh thu nhỏ hơn hay bằng 0.
- Sửa họ tên: viết hoa chữ cái đầu của mỗi từ và xóa các khoảng trắng thừa.
- Sửa số điện thoại: bỏ các dấu chấm, khoảng trắng thừa và tự thêm số 0 vào đầu nếu bị thiếu.
- Yêu cầu xử lý thật nhanh trong dưới 2 giây để không làm đơ bảng tính.
- Báo cáo số dòng ban đầu, số dòng sạch thu được và số dòng đã lọc bỏ. Không dùng biểu tượng cảm xúc.
```

---

#### BƯỚC 4: TẠO FILE `4_TachSheet_KenhBan.gs`
* **Thao tác:** Đính kèm file `QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md` ➔ Bấm dấu (+) chọn Script ➔ Đặt tên file là `4_TachSheet_KenhBan.gs` ➔ Dán mã AI sinh ra vào.
* **Câu Prompt:**
```text
[TIÊU CHUẨN KỸ THUẬT]: Hãy áp dụng toàn bộ quy tắc trong file "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

Hãy viết mã cho file "4_TachSheet_KenhBan.gs":
Đọc dữ liệu từ sheet "DataCleaned_BT5" và tự động tách các đơn hàng ra từng sheet riêng theo cột Kênh Bán (gồm Shopee, Lazada, TikTok Shop, Website). Mỗi sheet có màu tiêu đề riêng để phân biệt và không dùng biểu tượng cảm xúc.
```

---

#### BƯỚC 5: TẠO FILE `5_BaoCao_TongQuan.gs`
* **Thao tác:** Đính kèm file `QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md` ➔ Bấm dấu (+) chọn Script ➔ Đặt tên file là `5_BaoCao_TongQuan.gs` ➔ Dán mã AI sinh ra vào.
* **Câu Prompt:**
```text
[TIÊU CHUẨN KỸ THUẬT]: Hãy áp dụng toàn bộ quy tắc trong file "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

Hãy viết mã cho file "5_BaoCao_TongQuan.gs":
Tạo trang "Bao_Cao_Tong_Quan" ở đầu bảng tính:
- Hiển thị 4 ô số liệu lớn: Tổng dòng ban đầu, Dữ liệu sạch hợp lệ, Số dòng đã loại bỏ, Tỷ lệ dữ liệu đạt chuẩn (%).
- Vẽ 2 biểu đồ: một biểu đồ tròn thể hiện cơ cấu doanh thu theo kênh bán và một biểu đồ cột phân loại các dạng lỗi tìm thấy.
Không dùng biểu tượng cảm xúc trong tiêu đề hoặc biểu đồ.
```

---

#### BƯỚC 6: TẠO FILE `6_HenGio_TuDong.gs`
* **Thao tác:** Đính kèm file `QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md` ➔ Bấm dấu (+) chọn Script ➔ Đặt tên file là `6_HenGio_TuDong.gs` ➔ Dán mã AI sinh ra vào.
* **Câu Prompt:**
```text
[TIÊU CHUẨN KỸ THUẬT]: Hãy áp dụng toàn bộ quy tắc trong file "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

Hãy viết mã cho file "6_HenGio_TuDong.gs":
Cài đặt tính năng tự động chạy làm sạch dữ liệu, tách sheet và cập nhật báo cáo vào lúc 23:30 mỗi đêm mà tôi không cần phải mở máy tính. Có cả hàm để tắt hẹn giờ khi cần.
```

---

#### BƯỚC 7: TẠO FILE `BangTuyChon.html`
* **Thao tác:** Đính kèm file `QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md` ➔ Bấm dấu (+) chọn HTML ➔ Đặt tên file là `BangTuyChon.html` ➔ Dán mã AI sinh ra vào.
* **Câu Prompt:**
```text
[TIÊU CHUẨN KỸ THUẬT]: Hãy áp dụng toàn bộ quy tắc trong file "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

Hãy tạo file giao diện "BangTuyChon.html":
Hiển thị một cửa sổ popup đơn giản, có các ô tích chọn để tôi có thể bật hoặc tắt:
1. Xóa mã đơn trùng lặp
2. Tự động sửa số điện thoại
3. Viết hoa chữ cái đầu cho họ tên
4. Loại bỏ đơn có doanh thu nhỏ hơn hoặc bằng 0
5. Tự động tách sheet theo kênh bán
Phía dưới có nút bấm "Bắt Đầu Xử Lý Làm Sạch Dữ Liệu (Dưới 2 Giây)". Thiết kế trang nhã, dễ nhìn và không dùng biểu tượng cảm xúc rườm rà.
```

---

### 5. DANH SÁCH KIỂM TRA NGHIỆM THU

- [ ] Bảng tính có sheet `RawData_BT5` chứa hơn 1.000 dòng log đơn hàng bắt đầu từ dòng 4.
- [ ] Đã tạo đủ 7 file độc lập trong trình soạn thảo Apps Script: `1_Menu_LamSach.gs`, `2_KiemTra_BaoCaoLoi.gs`, `3_XuLy_LamSach.gs`, `4_TachSheet_KenhBan.gs`, `5_BaoCao_TongQuan.gs`, `6_HenGio_TuDong.gs`, `BangTuyChon.html`.
- [ ] Menu `Làm Sạch Dữ Liệu` xuất hiện trên thanh công cụ sau khi mở lại bảng tính.
- [ ] Bấm mục `2. Kiểm Tra Dữ Liệu` tạo thành công sheet `Bao_Cao_Loi` liệt kê danh sách các dòng lỗi chi tiết.
- [ ] Bấm mục `3. Chạy Làm Sạch Dữ Liệu` tạo sheet `DataCleaned_BT5` trong dưới 2 giây, không còn đơn trùng, số điện thoại có đủ 10 số có số 0 đầu, họ tên viết hoa chuẩn.
- [ ] Bấm mục `4. Tách Dữ Liệu Theo Kênh Bán Hàng` tự động sinh 4 sheet `San_Shopee`, `San_Lazada`, `San_TikTok Shop`, `San_Website`.
- [ ] Trang `Bao_Cao_Tong_Quan` hiển thị đúng 4 thẻ con số thống kê cùng 2 biểu đồ tròn và cột không bị lỗi.
- [ ] Bật thành công hẹn giờ tự động chạy lúc 23:30 mỗi đêm.
