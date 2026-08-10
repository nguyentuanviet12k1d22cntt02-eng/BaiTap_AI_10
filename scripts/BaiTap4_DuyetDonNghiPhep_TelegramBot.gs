/**
 * ==============================================================================
 * BÀI TẬP 4: QUY TRÌNH DUYỆT ĐƠN NGHỈ PHÉP TỰ ĐỘNG VỚI ONFORMSUBMIT & TELEGRAM BOT
 * ==============================================================================
 * Mục tiêu:
 * 1. Kích hoạt tự động khi có nhân viên nộp Form xin nghỉ phép (`onFormSubmit`).
 * 2. Tự động sinh Mã Đơn Nghỉ Phép chuẩn hóa (vd: `NP-2026-0004`).
 * 3. Gửi thông báo tức thì vào nhóm Telegram của Ban Quản lý qua REST API.
 * 4. Tự động gửi email xác nhận cho nhân viên rằng đơn đã được tiếp nhận.
 */

const CONFIG_BT4 = {
  SHEET_NAME: "DonNghiPhep_BT4",
  TELEGRAM_BOT_TOKEN: "DIEN_BOT_TOKEN_CUA_BAN_O_DAY", // Lấy từ @BotFather trên Telegram
  TELEGRAM_CHAT_ID: "DIEN_CHAT_ID_NHOM_O_DAY",       // ID nhóm nhận thông báo
  MANAGER_EMAIL: "quanly@congty.com"
};

/**
 * Hàm kích hoạt khi có phản hồi Form mới (Cần gắn Trigger onFormSubmit)
 */
function xuLyDonNghiPhepTuDong(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG_BT4.SHEET_NAME) || ss.getActiveSheet();
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 4) return;
  
  // Đọc dữ liệu dòng vừa được thêm vào
  // Giả định thứ tự cột:
  // Cột 1: Dấu thời gian, Cột 2: Email, Cột 3: Họ tên, Cột 4: Phòng ban, 
  // Cột 5: Số ngày nghỉ, Cột 6: Từ ngày, Cột 7: Đến ngày, Cột 8: Lý do
  const rowData = sheet.getRange(lastRow, 1, 1, 8).getValues()[0];
  
  const thoiGianGui = Utilities.formatDate(new Date(rowData[0]), "GMT+7", "dd/MM/yyyy HH:mm");
  const emailNV = rowData[1];
  const hoTenNV = rowData[2];
  const phongBan = rowData[3];
  const soNgay = rowData[4];
  const tuNgay = rowData[5] instanceof Date ? Utilities.formatDate(rowData[5], "GMT+7", "dd/MM/yyyy") : rowData[5];
  const denNgay = rowData[6] instanceof Date ? Utilities.formatDate(rowData[6], "GMT+7", "dd/MM/yyyy") : rowData[6];
  const lyDo = rowData[7];

  // 1. Tự động sinh Mã Đơn Nghỉ Phép (Ghi vào Cột 9: Mã Đơn)
  const stt = lastRow - 3;
  const maDon = `NP-${new Date().getFullYear()}-${Utilities.formatString("%04d", stt)}`;
  
  sheet.getRange(lastRow, 9).setValue(maDon);
  sheet.getRange(lastRow, 10).setValue("Chờ Quản Lý Duyệt"); // Cột 10: Trạng Thái

  // 2. Gửi thông báo tức thì về nhóm Telegram Quản lý
  const messageTelegram = 
    `🚨 *CÓ ĐƠN XIN NGHỈ PHÉP MỚI*\n` +
    `------------------------------------\n` +
    `📋 *Mã đơn:* \`${maDon}\`\n` +
    `👤 *Nhân viên:* *${hoTenNV}*\n` +
    `🏢 *Phòng ban:* ${phongBan}\n` +
    `⏳ *Số ngày nghỉ:* ${soNgay} ngày\n` +
    `📅 *Thời gian:* Từ ${tuNgay} đến ${denNgay}\n` +
    `📝 *Lý do:* _${lyDo}_\n` +
    `⏰ *Gửi lúc:* ${thoiGianGui}\n` +
    `------------------------------------\n` +
    `👉 _Vui lòng vào Google Sheets để duyệt đơn!_`;

  guiThongBaoTelegram(messageTelegram);

  // 3. Gửi email xác nhận tiếp nhận đơn cho nhân viên
  if (emailNV && emailNV.includes("@")) {
    const subjectNV = `[XÁC NHẬN TIẾP NHẬN] Đơn xin nghỉ phép #${maDon}`;
    const bodyNV = `
      <div style="font-family: Arial, sans-serif; padding: 15px; border: 1px solid #ddd; border-radius: 6px;">
        <h3 style="color: #1a73e8;">Chào ${hoTenNV},</h3>
        <p>Hệ thống đã ghi nhận đơn xin nghỉ phép của bạn với thông tin sau:</p>
        <ul>
          <li><b>Mã đơn:</b> ${maDon}</li>
          <li><b>Thời gian:</b> Từ ${tuNgay} đến ${denNgay} (${soNgay} ngày)</li>
          <li><b>Trạng thái hiện tại:</b> <span style="color: orange; font-weight: bold;">Chờ Quản Lý Duyệt</span></li>
        </ul>
        <p>Kết quả phê duyệt sẽ được cập nhật và thông báo sớm nhất.</p>
      </div>
    `;
    GmailApp.sendEmail(emailNV, subjectNV, "", { htmlBody: bodyNV });
  }
}

/**
 * Hàm gửi tin nhắn qua Telegram API bằng UrlFetchApp
 */
function guiThongBaoTelegram(noiDung) {
  if (CONFIG_BT4.TELEGRAM_BOT_TOKEN.includes("DIEN_")) {
    Logger.log("Chưa cấu hình TELEGRAM_BOT_TOKEN, bỏ qua gửi Telegram.");
    return;
  }
  
  const url = `https://api.telegram.org/bot${CONFIG_BT4.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const payload = {
    chat_id: CONFIG_BT4.TELEGRAM_CHAT_ID,
    text: noiDung,
    parse_mode: "Markdown"
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    Logger.log("Telegram Response: " + response.getContentText());
  } catch (err) {
    Logger.log("Lỗi gửi Telegram: " + err.toString());
  }
}
