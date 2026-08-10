import os
import csv
import random
from datetime import datetime, timedelta
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

os.makedirs("c:/Users/ADMIN/Desktop/demo/data", exist_ok=True)
os.makedirs("c:/Users/ADMIN/Desktop/demo/scripts", exist_ok=True)
os.makedirs("c:/Users/ADMIN/Desktop/demo/docs", exist_ok=True)

# -------------------------------------------------------------
# 1. BÀI TẬP 1: Dữ liệu Doanh thu các chi nhánh
# -------------------------------------------------------------
headers_bt1 = ["Mã CN", "Tên Chi Nhánh", "Khu Vực", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"]
branches = [
    ("CN001", "Chi nhánh Ba Đình", "Hà Nội", 12500000, 14200000, 13800000, 15600000, 18900000, 24500000, 26800000),
    ("CN002", "Chi nhánh Cầu Giấy", "Hà Nội", 18200000, 19500000, 17800000, 21000000, 25600000, 31200000, 34500000),
    ("CN003", "Chi nhánh Đống Đa", "Hà Nội", 15400000, 16200000, 14900000, 17800000, 20500000, 27800000, 29600000),
    ("CN004", "Chi nhánh Quận 1", "TP.HCM", 25600000, 27800000, 24900000, 29500000, 35600000, 45200000, 49800000),
    ("CN005", "Chi nhánh Quận 3", "TP.HCM", 20100000, 22400000, 21500000, 24800000, 29800000, 38500000, 41200000),
    ("CN006", "Chi nhánh Bình Thạnh", "TP.HCM", 16800000, 18200000, 17500000, 19800000, 23500000, 30500000, 33200000),
    ("CN007", "Chi nhánh Hải Châu", "Đà Nẵng", 11200000, 12800000, 12100000, 13900000, 16800000, 21500000, 23900000),
    ("CN008", "Chi nhánh Thanh Khê", "Đà Nẵng", 9800000, 10500000, 10200000, 11800000, 14200000, 18600000, 20100000),
    ("CN009", "Chi nhánh Ninh Kiều", "Cần Thơ", 10500000, 11800000, 11200000, 12900000, 15400000, 19800000, 21500000),
    ("CN010", "Chi nhánh Biên Hòa", "Đồng Nai", 13400000, 14800000, 14100000, 16200000, 19500000, 25200000, 27600000),
]

with open("c:/Users/ADMIN/Desktop/demo/data/bai_tap_1_doanh_thu_sparkline.csv", "w", newline="", encoding="utf-8-sig") as f:
    writer = csv.writer(f)
    writer.writerow(headers_bt1)
    writer.writerows(branches)

# -------------------------------------------------------------
# 2. BÀI TẬP 2: Dữ liệu Đơn hàng cần xuất PDF
# -------------------------------------------------------------
headers_bt2 = ["Mã Đơn", "Tên Khách Hàng", "Số Điện Thoại", "Địa Chỉ Giao Hàng", "Sản Phẩm", "Số Lượng", "Đơn Giá", "Tổng Tiền", "Trạng Thái", "Link File PDF"]
orders = [
    ["DH-2026-001", "Nguyễn Văn An", "0988123456", "12 Hoàng Hoa Thám, Ba Đình, Hà Nội", "Laptop Dell XPS 15", 1, 32000000, 32000000, "Chờ xuất", ""],
    ["DH-2026-002", "Trần Thị Bích", "0903987654", "45 Lê Duẩn, Quận 1, TP.HCM", "Màn hình Dell UltraSharp 27 inch", 2, 8500000, 17000000, "Chờ xuất", ""],
    ["DH-2026-003", "Lê Hoàng Long", "0912345678", "78 Nguyễn Huệ, Hải Châu, Đà Nẵng", "Bàn phím cơ Keychron K8 Pro", 3, 2300000, 6900000, "Chờ xuất", ""],
    ["DH-2026-004", "Phạm Minh Trang", "0977654321", "102 Cách Mạng Tháng 8, Quận 3, TP.HCM", "Chuột không dây Logitech MX Master 3S", 2, 2100000, 4200000, "Chờ xuất", ""],
    ["DH-2026-005", "Đỗ Quang Hưng", "0934567890", "56 Cầu Giấy, Hà Nội", "Tai nghe chống ồn Sony WH-1000XM5", 1, 6800000, 6800000, "Chờ xuất", ""],
    ["DH-2026-006", "Vũ Thị Ngọc Hà", "0987112233", "22 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội", "Ghế công thái học Ergonomic Sihoo", 1, 4500000, 4500000, "Đã xuất", "https://drive.google.com/file/d/demo1/view"],
    ["DH-2026-007", "Ngô Thành Nam", "0908889900", "89 Phan Xích Long, Phú Nhuận, TP.HCM", "Ổ cứng di động SSD Samsung T7 1TB", 2, 2700000, 5400000, "Chờ xuất", ""],
    ["DH-2026-008", "Hoàng Kim Oanh", "0945678123", "15 Tràng Thi, Hoàn Kiếm, Hà Nội", "Webcam Elgato Facecam 1080p", 1, 3600000, 3600000, "Chờ xuất", ""],
]

with open("c:/Users/ADMIN/Desktop/demo/data/bai_tap_2_xuat_hoa_don_pdf.csv", "w", newline="", encoding="utf-8-sig") as f:
    writer = csv.writer(f)
    writer.writerow(headers_bt2)
    writer.writerows(orders)

# -------------------------------------------------------------
# 3. BÀI TẬP 3: Dữ liệu Bảng lương gửi qua Gmail
# -------------------------------------------------------------
headers_bt3 = ["Mã NV", "Họ và Tên", "Phòng Ban", "Email Nhận", "Lương Cơ Bản", "Phụ Cấp", "Thưởng Hiệu Quả", "Khấu Trừ", "Thực Lĩnh", "Trạng Thái", "Thời Gian Gửi"]
payroll = [
    ["NV001", "Hoàng Văn Dũng", "Kinh Doanh", "dung.hoang.demo@gmail.com", 15000000, 2000000, 3500000, 500000, 20000000, "Chưa gửi", ""],
    ["NV002", "Lê Thị Mai", "Kế Toán", "mai.le.demo@gmail.com", 16000000, 1500000, 2000000, 0, 19500000, "Chưa gửi", ""],
    ["NV003", "Trần Quốc Toản", "Kỹ Thuật", "toan.tran.demo@gmail.com", 22000000, 2500000, 4000000, 1000000, 27500000, "Chưa gửi", ""],
    ["NV004", "Nguyễn Hồng Hạnh", "Nhân Sự", "hanh.nguyen.demo@gmail.com", 14000000, 1500000, 1500000, 0, 17000000, "Chưa gửi", ""],
    ["NV005", "Bùi Thanh Tùng", "Marketing", "tung.bui.demo@gmail.com", 17500000, 2000000, 3000000, 500000, 22000000, "Chưa gửi", ""],
    ["NV006", "Đặng Thùy Dương", "Thiết Kế", "duong.dang.demo@gmail.com", 15500000, 1800000, 2200000, 0, 19500000, "Chưa gửi", ""],
    ["NV007", "Phan Anh Tuấn", "Kinh Doanh", "tuan.phan.demo@gmail.com", 13500000, 2000000, 5000000, 800000, 19700000, "Chưa gửi", ""],
]

with open("c:/Users/ADMIN/Desktop/demo/data/bai_tap_3_gui_phieu_luong.csv", "w", newline="", encoding="utf-8-sig") as f:
    writer = csv.writer(f)
    writer.writerow(headers_bt3)
    writer.writerows(payroll)

# -------------------------------------------------------------
# 4. BÀI TẬP 4: Dữ liệu Đơn nghỉ phép từ Form
# -------------------------------------------------------------
headers_bt4 = ["Dấu Thời Gian", "Email Nhân Viên", "Họ Tên Nhân Viên", "Phòng Ban", "Số Ngày Nghỉ", "Từ Ngày", "Đến Ngày", "Lý Do Nghỉ", "Mã Đơn", "Trạng Thái", "Quản Lý Duyệt"]
leaves = [
    ["10/08/2026 08:30:15", "dung.hoang.demo@gmail.com", "Hoàng Văn Dũng", "Kinh Doanh", 2, "12/08/2026", "13/08/2026", "Giải quyết việc cá nhân gia đình", "NP-2026-0001", "Chờ Quản Lý Duyệt", ""],
    ["10/08/2026 09:15:22", "mai.le.demo@gmail.com", "Lê Thị Mai", "Kế Toán", 1, "15/08/2026", "15/08/2026", "Khám sức khỏe định kỳ", "NP-2026-0002", "Đã Duyệt", "Trần Trưởng Phòng"],
    ["10/08/2026 10:45:00", "toan.tran.demo@gmail.com", "Trần Quốc Toản", "Kỹ Thuật", 3, "18/08/2026", "20/08/2026", "Nghỉ phép năm về quê", "NP-2026-0003", "Chờ Quản Lý Duyệt", ""],
]

with open("c:/Users/ADMIN/Desktop/demo/data/bai_tap_4_don_nghi_phep_form.csv", "w", newline="", encoding="utf-8-sig") as f:
    writer = csv.writer(f)
    writer.writerow(headers_bt4)
    writer.writerows(leaves)

# -------------------------------------------------------------
# 5. BÀI TẬP 5: Dữ liệu Raw 1,000 dòng hỗn tạp cần làm sạch
# -------------------------------------------------------------
headers_bt5 = ["Mã Giao Dịch", "Tên Khách Hàng", "Số Điện Thoại", "Kênh Bán", "Doanh Thu", "Ngày Tạo"]
first_names = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương"]
mid_names = ["Văn", "Thị", "Hồng", "Minh", "Đức", "Thành", "Ngọc", "Thanh", "Quang", "Anh", "Xuân", "Hoài"]
last_names = ["An", "Bình", "Cường", "Dũng", "Em", "Hương", "Giang", "Hải", "Khánh", "Linh", "Nam", "Phúc", "Quân", "Sơn", "Trang", "Tâm", "Uyên", "Vinh"]
channels = ["Shopee", "Lazada", "Tiki", "TikTok Shop", "Website", "Cửa Hàng Trực Tiếp", "Facebook Ads"]

raw_rows = []
used_codes = []

for i in range(1, 1001):
    # Tạo mã đơn (có trường hợp lặp và rỗng)
    if i % 40 == 0:
        ma_gd = "" # dòng lỗi rỗng
    elif i % 25 == 0 and len(used_codes) > 0:
        ma_gd = random.choice(used_codes) # trùng mã
    else:
        ma_gd = f"TRX-2026-{i:05d}"
        used_codes.append(ma_gd)

    # Tên khách hàng (có trường hợp viết thường, thừa khoảng trắng)
    name = f"{random.choice(first_names)} {random.choice(mid_names)} {random.choice(last_names)}"
    if i % 7 == 0:
        name = "   " + name.lower() + "  "
    elif i % 5 == 0:
        name = name.upper()

    # Số điện thoại (có trường hợp dấu chấm, khoảng trắng, mất số 0 đầu)
    clean_phone = f"09{random.randint(10000000, 99999999)}"
    if i % 6 == 0:
        phone = clean_phone[1:] # mất số 0 đầu
    elif i % 8 == 0:
        phone = f"{clean_phone[:4]}.{clean_phone[4:7]}.{clean_phone[7:]}" # có dấu chấm
    elif i % 9 == 0:
        phone = f"{clean_phone[:4]} {clean_phone[4:7]} {clean_phone[7:]}" # có khoảng trắng
    else:
        phone = clean_phone

    # Doanh thu (có trường hợp âm, 0, hoặc số hợp lệ)
    if i % 50 == 0:
        rev = 0
    elif i % 70 == 0:
        rev = -500000 # số âm lỗi
    else:
        rev = random.randint(150, 8500) * 1000

    channel = random.choice(channels)
    date_val = (datetime(2026, 8, 1) + timedelta(days=random.randint(0, 9))).strftime("%d/%m/%Y")

    raw_rows.append([ma_gd, name, phone, channel, rev, date_val])

with open("c:/Users/ADMIN/Desktop/demo/data/bai_tap_5_raw_data_1000_rows.csv", "w", newline="", encoding="utf-8-sig") as f:
    writer = csv.writer(f)
    writer.writerow(headers_bt5)
    writer.writerows(raw_rows)

# -------------------------------------------------------------
# 6. TẠO FILE EXCEL TỔNG HỢP GỒM 5 SHEET ĐƯỢC FORMAT CHUYÊN NGHIỆP
# -------------------------------------------------------------
wb = openpyxl.Workbook()
wb.remove(wb.active) # xóa sheet mặc định

sheets_spec = [
    ("DoanhThu_BT1", headers_bt1, branches, "1B365D"),
    ("DonHang_BT2", headers_bt2, orders, "005A9C"),
    ("BangLuong_BT3", headers_bt3, payroll, "1B365D"),
    ("DonNghiPhep_BT4", headers_bt4, leaves, "005A9C"),
    ("RawData_BT5", headers_bt5, raw_rows, "4A5568")
]

thin_border = Border(
    left=Side(style='thin', color='D9D9D9'),
    right=Side(style='thin', color='D9D9D9'),
    top=Side(style='thin', color='D9D9D9'),
    bottom=Side(style='thin', color='D9D9D9')
)

for title, headers, rows_data, color_hex in sheets_spec:
    ws = wb.create_sheet(title=title)
    ws.views.sheetView[0].showGridLines = True

    # Title Banner
    ws.merge_cells("A1:G1")
    title_cell = ws["A1"]
    title_cell.value = f"DỮ LIỆU THỰC HÀNH: {title.upper()}"
    title_cell.font = Font(name="Calibri", size=14, bold=True, color="FFFFFF")
    title_cell.fill = PatternFill(start_color=color_hex, end_color=color_hex, fill_type="solid")
    title_cell.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws.row_dimensions[1].height = 32

    # Headers at row 3
    header_row_idx = 3
    ws.row_dimensions[header_row_idx].height = 24
    for col_idx, h in enumerate(headers, 1):
        cell = ws.cell(row=header_row_idx, column=col_idx, value=h)
        cell.font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
        cell.fill = PatternFill(start_color=color_hex, end_color=color_hex, fill_type="solid")
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    # Data Rows
    current_row = 4
    for row_idx, r in enumerate(rows_data):
        ws.row_dimensions[current_row].height = 20
        bg_fill = PatternFill(start_color="F8FAFC" if row_idx % 2 == 1 else "FFFFFF", fill_type="solid")
        for col_idx, val in enumerate(r, 1):
            cell = ws.cell(row=current_row, column=col_idx, value=val)
            cell.font = Font(name="Calibri", size=10)
            cell.border = thin_border
            cell.fill = bg_fill

            # Format số tiền
            if isinstance(val, (int, float)) and val > 1000:
                cell.number_format = '#,##0'
                cell.alignment = Alignment(horizontal="right", vertical="center")
            elif isinstance(val, (int, float)):
                cell.alignment = Alignment(horizontal="center", vertical="center")
            else:
                cell.alignment = Alignment(horizontal="left", vertical="center")
        current_row += 1

    # Auto fit column widths
    for col in ws.columns:
        max_len = 0
        col_letter = get_column_letter(col[0].column)
        for cell in col:
            if cell.row >= 3 and cell.value is not None:
                max_len = max(max_len, len(str(cell.value)))
        ws.column_dimensions[col_letter].width = max(max_len + 4, 13)

excel_path = "c:/Users/ADMIN/Desktop/demo/data/Du_Lieu_Mau_Tong_Hop.xlsx"
wb.save(excel_path)
print(f"Created all data files and Excel workbook at: {excel_path}")
