/**
 * ==============================================================================
 * BÀI TẬP 3: TỰ ĐỘNG GỬI PHIẾU LƯƠNG CÁ NHÂN HÓA QUA GMAIL CHỐNG GỬI LẶP
 * ==============================================================================
 * Mục tiêu:
 * 1. Đọc dữ liệu bảng lương từ Sheet 'BangLuong_BT3'.
 * 2. Lọc chính xác các nhân viên có trạng thái "Chưa gửi" và có Email hợp lệ.
 * 3. Tạo mẫu email thông báo lương dạng bảng chi tiết, bảo mật thông tin thu nhập.
 * 4. Gửi email qua GmailApp và cập nhật trạng thái "Đã gửi" kèm ngày giờ chính xác.
 */

const CONFIG_BT3 = {
  SHEET_NAME: "BangLuong_BT3",
  COMPANY_NAME: "CÔNG TY CỔ PHẦN CÔNG NGHỆ & TỰ ĐỘNG HÓA",
  HR_EMAIL_SUPPORT: "hr@congty.com"
};

/**
 * Hàm gửi phiếu lương tự động hàng loạt
 */
function guiPhieuLuongHangLoat() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG_BT3.SHEET_NAME);
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert(`LỖI: Không tìm thấy sheet '${CONFIG_BT3.SHEET_NAME}'!`);
    return;
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 4) {
    SpreadsheetApp.getUi().alert("Bảng lương chưa có dữ liệu nhân viên.");
    return;
  }

  // Lấy dữ liệu từ dòng 4 (bỏ qua banner và tiêu đề)
  const rows = sheet.getRange(4, 1, lastRow - 3, 11).getValues();
  const thangHienTai = Utilities.formatDate(new Date(), "GMT+7", "MM/yyyy");
  
  let guiThanhCong = 0;
  let boQua = 0;

  for (let i = 0; i < rows.length; i++) {
    const maNV = rows[i][0];
    const hoTen = rows[i][1];
    const phongBan = rows[i][2];
    const email = String(rows[i][3]).trim();
    const luongCB = Number(rows[i][4]) || 0;
    const phuCap = Number(rows[i][5]) || 0;
    const thuongHQ = Number(rows[i][6]) || 0;
    const khauTru = Number(rows[i][7]) || 0;
    const thucLinh = Number(rows[i][8]) || 0;
    const trangThai = rows[i][9];

    // Điều kiện: Chưa gửi và email hợp lệ
    if (trangThai === "Chưa gửi" && email !== "" && email.includes("@")) {
      const subject = `[PHIẾU LƯƠNG THÁNG ${thangHienTai}] - Kính gửi ${hoTen} (${maNV})`;
      
      const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 20px;">
          <div style="max-width: 550px; margin: 0 auto; background: #FFFFFF; border-radius: 8px; border: 1px solid #E2E8F0; overflow: hidden;">
            
            <div style="background-color: #1B365D; color: white; padding: 20px; text-align: center;">
              <h2 style="margin: 0; font-size: 18px;">${CONFIG_BT3.COMPANY_NAME}</h2>
              <p style="margin: 5px 0 0; font-size: 13px; opacity: 0.9;">PHIẾU BÁO LƯƠNG & THU NHẬP - THÁNG ${thangHienTai}</p>
            </div>
            
            <div style="padding: 20px;">
              <p style="margin-top: 0;">Kính gửi Anh/Chị: <b style="color: #1B365D;">${hoTen}</b>,</p>
              <p style="font-size: 13px; color: #64748B;">Phòng Nhân sự xin gửi chi tiết bảng tính thu nhập của Anh/Chị như sau:</p>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 15px 0;">
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 8px 0; color: #64748B;">Mã Nhân Viên:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #1E293B;">${maNV}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 8px 0; color: #64748B;">Phòng Ban:</td>
                  <td style="padding: 8px 0; text-align: right; color: #1E293B;">${phongBan}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 8px 0; color: #64748B;">1. Lương Cơ Bản:</td>
                  <td style="padding: 8px 0; text-align: right; color: #1E293B;">${luongCB.toLocaleString('vi-VN')} đ</td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 8px 0; color: #64748B;">2. Phụ Cấp Công Tác/Ăn Trưa:</td>
                  <td style="padding: 8px 0; text-align: right; color: #1E293B;">${phuCap.toLocaleString('vi-VN')} đ</td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 8px 0; color: #64748B;">3. Thưởng Hiệu Quả KPI:</td>
                  <td style="padding: 8px 0; text-align: right; color: #16A34A; font-weight: 600;">+ ${thuongHQ.toLocaleString('vi-VN')} đ</td>
                </tr>
                <tr style="border-bottom: 1px solid #F1F5F9;">
                  <td style="padding: 8px 0; color: #64748B;">4. Các Khoản Khấu Trừ (BHXH, Thuế...):</td>
                  <td style="padding: 8px 0; text-align: right; color: #DC2626;">- ${khauTru.toLocaleString('vi-VN')} đ</td>
                </tr>
                <tr style="background-color: #EFF6FF;">
                  <td style="padding: 12px 8px; font-weight: bold; color: #1D4ED8; font-size: 14px;">5. THỰC LĨNH CHUYỂN KHOẢN:</td>
                  <td style="padding: 12px 8px; text-align: right; font-weight: bold; color: #1D4ED8; font-size: 16px;">${thucLinh.toLocaleString('vi-VN')} đ</td>
                </tr>
              </table>
              
              <div style="background: #F8FAFC; border-left: 3px solid #64748B; padding: 10px; font-size: 12px; color: #64748B; margin-top: 15px;">
                📌 <i>Lưu ý: Thông tin thu nhập là bảo mật. Nếu có bất kỳ thắc mắc nào về bảng lương, vui lòng phản hồi qua email <b>${CONFIG_BT3.HR_EMAIL_SUPPORT}</b> trong vòng 3 ngày làm việc.</i>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Gửi email
      GmailApp.sendEmail(email, subject, "", {
        htmlBody: htmlBody,
        name: "Phòng Nhân Sự (HR Team)"
      });

      // Cập nhật trạng thái ngay sau khi gửi (Dòng thực tế = i + 4)
      const currentSheetRow = i + 4;
      const thoiGianGui = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
      sheet.getRange(currentSheetRow, 10).setValue("Đã gửi");       // Cột J: Trạng Thái
      sheet.getRange(currentSheetRow, 11).setValue(thoiGianGui);     // Cột K: Thời Gian Gửi
      
      guiThanhCong++;
    } else {
      boQua++;
    }
  }

  SpreadsheetApp.getUi().alert(`Hoàn tất gửi phiếu lương!\n- Gửi thành công: ${guiThanhCong}\n- Bỏ qua (Đã gửi trước đó hoặc sai email): ${boQua}`);
}
