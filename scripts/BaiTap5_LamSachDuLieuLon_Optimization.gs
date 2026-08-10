/**
 * ==============================================================================
 * BÀI TẬP 5: XỬ LÝ & LÀM SẠCH 1,000 - 10,000 DÒNG DỮ LIỆU LỚN TỐI ƯU HIỆU NĂNG
 * ==============================================================================
 * Mục tiêu:
 * 1. Đọc 1,000 dòng log đơn hàng thô từ Sheet 'RawData_BT5'.
 * 2. Lọc bỏ các dòng lỗi: mã giao dịch rỗng, mã giao dịch bị trùng lặp, doanh thu âm hoặc bằng 0.
 * 3. Chuẩn hóa dữ liệu: Viết hoa chuẩn tên khách hàng, sửa số điện thoại về chuẩn 10 chữ số (thêm '0' đầu).
 * 4. Tối ưu hiệu năng: Xử lý 100% trên RAM (In-memory Batch Processing), ghi xuống Sheet 1 lần duy nhất.
 */

const CONFIG_BT5 = {
  RAW_SHEET_NAME: "RawData_BT5",
  CLEAN_SHEET_NAME: "DataCleaned_BT5"
};

function lamSachVaChuanHoaDuLieuLon() {
  const startTime = new Date().getTime();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rawSheet = ss.getSheetByName(CONFIG_BT5.RAW_SHEET_NAME);
  
  if (!rawSheet) {
    SpreadsheetApp.getUi().alert(`LỖI: Không tìm thấy sheet '${CONFIG_BT5.RAW_SHEET_NAME}'!`);
    return;
  }

  let cleanSheet = ss.getSheetByName(CONFIG_BT5.CLEAN_SHEET_NAME);
  if (!cleanSheet) {
    cleanSheet = ss.insertSheet(CONFIG_BT5.CLEAN_SHEET_NAME);
  } else {
    cleanSheet.clear(); // Xóa sạch bảng cũ để ghi lại dữ liệu mới
  }

  // 1. ĐỌC DỮ LIỆU 1 LẦN DUY NHẤT VÀO MẢNG
  const rawData = rawSheet.getDataRange().getValues();
  if (rawData.length < 4) {
    SpreadsheetApp.getUi().alert("Không có dữ liệu để xử lý.");
    return;
  }

  // Dòng 3 là header, dữ liệu từ dòng 4 trở đi
  const headers = ["Mã Giao Dịch", "Tên Khách Hàng", "Số Điện Thoại", "Kênh Bán", "Doanh Thu", "Ngày Tạo", "Trạng Thái Xử Lý"];
  const rows = rawData.slice(3); // Cắt từ dòng index 3 (dòng 4 trên sheet)

  const seenTransactionCodes = new Set(); // Cấu trúc Set giúp tra cứu O(1) chống trùng
  const cleanedRows = [];
  
  let countTrungLap = 0;
  let countLoiDoanhThu = 0;
  let countMaRong = 0;

  // 2. DUYỆT VÀ CHUẨN HÓA TOÀN BỘ TRÊN BỘ NHỚ RAM
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const maGD = String(row[0]).trim();
    let tenKH = String(row[1]).trim();
    let sdt = String(row[2]).trim().replace(/[\.\s-]/g, ""); // Bỏ dấu chấm, khoảng trắng, gạch ngang
    const kenhBan = String(row[3]).trim();
    const doanhThu = Number(row[4]) || 0;
    const ngayTao = row[5] instanceof Date ? Utilities.formatDate(row[5], "GMT+7", "dd/MM/yyyy") : row[5];

    // Kiểm tra các điều kiện lọc lỗi:
    if (maGD === "") {
      countMaRong++;
      continue;
    }
    if (seenTransactionCodes.has(maGD)) {
      countTrungLap++;
      continue;
    }
    if (doanhThu <= 0) {
      countLoiDoanhThu++;
      continue;
    }

    // Đã qua các bước lọc -> Đánh dấu mã này đã xuất hiện
    seenTransactionCodes.add(maGD);

    // Chuẩn hóa Tên khách hàng (Viết hoa chữ cái đầu từng từ)
    tenKH = chuanHoaTenTiengViet(tenKH);

    // Chuẩn hóa Số điện thoại (Đảm bảo 10 số có số 0 đầu)
    if (sdt.length === 9 && !sdt.startsWith("0")) {
      sdt = "0" + sdt;
    }

    cleanedRows.push([
      maGD,
      tenKH,
      sdt,
      kenhBan,
      doanhThu,
      ngayTao,
      "Hợp Lệ"
    ]);
  }

  // 3. GHI TOÀN BỘ DỮ LIỆU SẠCH XUỐNG SHEET 1 LẦN DUY NHẤT
  if (cleanedRows.length > 0) {
    // Banner tiêu đề
    cleanSheet.getRange("A1:G1").merge().setValue("BẢNG DỮ LIỆU ĐÃ ĐƯỢC LÀM SẠCH & CHUẨN HÓA (CLEAN DATA)")
      .setBackground("#1B365D").setFontColor("#FFFFFF").setFontWeight("bold").setFontSize(13);
    cleanSheet.setRowHeight(1, 30);

    // Ghi Header tại dòng 3
    cleanSheet.getRange(3, 1, 1, headers.length).setValues([headers])
      .setBackground("#005A9C").setFontColor("#FFFFFF").setFontWeight("bold");
    cleanSheet.setRowHeight(3, 25);

    // Ghi toàn bộ dữ liệu sạch từ dòng 4
    const dataTargetRange = cleanSheet.getRange(4, 1, cleanedRows.length, headers.length);
    dataTargetRange.setValues(cleanedRows);
    
    // Định dạng cột Doanh Thu thành tiền tệ
    cleanSheet.getRange(4, 5, cleanedRows.length, 1).setNumberFormat("#,##0");
    
    // Căn lề
    cleanSheet.getRange(4, 1, cleanedRows.length, 1).setHorizontalAlignment("center");
    cleanSheet.getRange(4, 3, cleanedRows.length, 1).setHorizontalAlignment("center");
    cleanSheet.getRange(4, 6, cleanedRows.length, 2).setHorizontalAlignment("center");

    // Tự động dãn cột
    cleanSheet.autoResizeColumns(1, headers.length);
  }

  const executionTime = ((new Date().getTime() - startTime) / 1000).toFixed(2);

  // 4. BÁO CÁO THỐNG KÊ KẾT QUẢ
  const thongBao = 
    `🎉 ĐÃ HOÀN TẤT LÀM SẠCH DỮ LIỆU!\n` +
    `----------------------------------------\n` +
    `⏱️ Thời gian xử lý: ${executionTime} giây\n` +
    `📥 Tổng dòng ban đầu: ${rows.length}\n` +
    `✅ Dòng hợp lệ đã lưu: ${cleanedRows.length}\n` +
    `❌ Dòng bị loại bỏ: ${rows.length - cleanedRows.length}\n` +
    `   • Trùng mã đơn: ${countTrungLap}\n` +
    `   • Lỗi doanh thu (<=0): ${countLoiDoanhThu}\n` +
    `   • Mã đơn rỗng: ${countMaRong}`;

  SpreadsheetApp.getUi().alert(thongBao);
}

/**
 * Hàm phụ trợ: Chuẩn hóa chữ hoa đầu từ cho họ tên tiếng Việt
 */
function chuanHoaTenTiengViet(str) {
  if (!str) return "";
  return str.toLowerCase().split(/\s+/).map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
}
