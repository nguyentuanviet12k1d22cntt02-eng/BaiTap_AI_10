COURSE_DATA.push(
{
    id: "bt4",
    index: 4,
    title: "Bài 4: Prompt Phê Duyệt Đơn Nghỉ Phép Tự Động Kết Hợp Form & Telegram Bot",
    shortTitle: "Phê Duyệt Đơn & Bot Telegram",
    subtitle: "Prompting cho Google Form, Event Trigger & Telegram API",
    level: "Dành Cho Dân Văn Phòng",
    time: "20 phút",
    tags: ["Google Forms", "Event Trigger", "Telegram Bot API", "Instant Alert"],
    desc: "Cách viết Prompt ra lệnh cho AI tự động kích hoạt mỗi khi có nhân viên nộp Form xin nghỉ: sinh mã đơn NP-2026-XXXX và bắn thông báo tức thì vào nhóm Telegram quản lý.",
    csvFile: "bai_tap_4_don_nghi_phep_form.csv",
    scriptFile: "BaiTap4_DuyetDonNghiPhep_TelegramBot.gs",
    scriptContent: `/**
 * BÀI TẬP 4: TỰ ĐỘNG XỬ LÝ ĐƠN NGHỈ PHÉP & THÔNG BÁO TELEGRAM
 */
const CONFIG_BT4 = {
  SHEET_NAME: "DonNghiPhep_BT4",
  TELEGRAM_BOT_TOKEN: "DIEN_BOT_TOKEN_VAO_DAY",
  TELEGRAM_CHAT_ID: "DIEN_CHAT_ID_VAO_DAY"
};

function xuLyDonNghiPhepTuDong(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG_BT4.SHEET_NAME) || ss.getActiveSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 4) return;

  const rowData = sheet.getRange(lastRow, 1, 1, 8).getValues()[0];
  const hoTenNV = rowData[2];
  const phongBan = rowData[3];
  const soNgay = rowData[4];
  const lyDo = rowData[7];

  const stt = lastRow - 3;
  const maDon = "NP-" + new Date().getFullYear() + "-" + Utilities.formatString("%04d", stt);
  sheet.getRange(lastRow, 9).setValue(maDon);
  sheet.getRange(lastRow, 10).setValue("Chờ Quản Lý Duyệt");

  const msg = 
    "🚨 *CÓ ĐƠN XIN NGHỈ PHÉP MỚI*\\n" +
    "------------------------------------\\n" +
    "📋 *Mã đơn:* \`" + maDon + "\`\\n" +
    "👤 *Nhân viên:* *" + hoTenNV + "*\\n" +
    "🏢 *Phòng ban:* " + phongBan + "\\n" +
    "⏳ *Số ngày:* " + soNgay + " ngày\\n" +
    "📝 *Lý do:* _" + lyDo + "_\\n" +
    "👉 _Vui lòng vào Google Sheet để duyệt đơn!_";

  guiTelegram(msg);
}

function guiTelegram(noiDung) {
  if (CONFIG_BT4.TELEGRAM_BOT_TOKEN.includes("DIEN_")) return;
  const url = "https://api.telegram.org/bot" + CONFIG_BT4.TELEGRAM_BOT_TOKEN + "/sendMessage";
  const payload = { chat_id: CONFIG_BT4.TELEGRAM_CHAT_ID, text: noiDung, parse_mode: "Markdown" };
  UrlFetchApp.fetch(url, { method: "post", contentType: "application/json", payload: JSON.stringify(payload), muteHttpExceptions: true });
}`,
    
    workflow: [
      { icon: "ph-article", title: "1. Google Form", desc: "Nhân viên điền đơn xin nghỉ" },
      { icon: "ph-sparkle", title: "2. AI Kích Hoạt Tức Thì", desc: "Bắt sự kiện onFormSubmit" },
      { icon: "ph-identification-badge", title: "3. Tự Sinh Mã Đơn", desc: "Tạo mã chuẩn NP-2026-XXXX" },
      { icon: "ph-telegram-logo", title: "4. Bắn Bot Telegram", desc: "Thông báo ngay về nhóm duyệt của sếp" }
    ],

    masterPrompt: `Bạn là một Kiến trúc sư Tự động hóa Doanh nghiệp (Enterprise Automation Architect).

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
4. Tự động gửi một email xác nhận đến hòm thư của nhân viên thông báo đơn đã được chuyển tới cấp quản lý.`,

    businessScenario: {
      story: "Nhân viên công ty thường xuyên nộp đơn xin nghỉ phép đột xuất qua Google Form. Ban Giám Đốc và các Trưởng phòng thường xuyên đi công tác ngoài văn phòng, không ngồi trực Google Sheet cả ngày.",
      pain: "Nhân viên nộp đơn từ sáng nhưng đến chiều muộn sếp mới mở máy tính kiểm tra Sheet nên không duyệt kịp thời gian. Nhân viên cũng sốt ruột không biết đơn đã được chuyển tới cấp trên hay chưa.",
      solution: "Ngay khi nhân viên bấm Nộp Form, AI tự sinh mã đơn NP-2026-XXXX, bắn tin nhắn thông báo ting ting vào nhóm Telegram trên điện thoại của sếp kèm lý do và số ngày nghỉ, đồng thời gửi email xác nhận cho nhân viên chỉ sau 1 giây."
    },

    promptBreakdown: [
      { tag: "1. KÍCH HOẠT TỨC THÌ", title: "Sự kiện onFormSubmit", desc: "Yêu cầu AI lắng nghe hành động nộp form thay vì phải chờ quét theo giờ." },
      { tag: "2. SINH MÃ TỰ ĐỘNG", title: "Quy tắc sinh mã định danh", desc: "Định dạng rõ cấu trúc NP-YYYY-XXXX để quản lý dễ tra cứu." },
      { tag: "3. THÔNG BÁO ĐA KÊNH", title: "Kết nối Telegram Webhook", desc: "Bắn thông báo tức thì vào app chat mà sếp thường xuyên mở xem trên điện thoại." },
      { tag: "4. PHẢN HỒI NHÂN VIÊN", title: "Email xác nhận tiếp nhận", desc: "Tự động phản hồi giúp người nộp an tâm đơn đã vào hệ thống." }
    ],

    businessRequirements: `
      <p><b>Bài toán thực tế:</b> Nhân viên nộp đơn nhưng sếp không hay mở Google Sheet kiểm tra, dẫn đến việc duyệt phép bị trễ. Nhờ AI kết nối Telegram Bot, sếp nhận ngay thông báo ting ting trên điện thoại chỉ sau 1 giây.</p>
    `,

    tableHeaders: ["Dấu Thời Gian", "Email", "Họ Tên", "Phòng Ban", "Số Ngày", "Từ Ngày", "Đến Ngày", "Lý Do", "Mã Đơn", "Trạng Thái"],
    tableRows: [
      ["10/08/2026 08:30", "dung.demo@gmail.com", "Hoàng Văn Dũng", "Kinh Doanh", 2, "12/08/2026", "13/08/2026", "Việc gia đình", "<span style='color: #38bdf8; font-weight: bold;'>NP-2026-0001</span>", "Chờ Duyệt"],
      ["10/08/2026 09:15", "mai.demo@gmail.com", "Lê Thị Mai", "Kế Toán", 1, "15/08/2026", "15/08/2026", "Khám sức khỏe", "<span style='color: #38bdf8; font-weight: bold;'>NP-2026-0002</span>", "Đã Duyệt"]
    ],

    steps: [
      {
        badge: "01",
        title: "Tạo Bot Telegram Nhanh",
        desc: "Mở Telegram chat với <code>@BotFather</code>, gửi <code>/newbot</code> để tạo bot và nhận chuỗi <code>BOT_TOKEN</code>. Mời bot vào nhóm quản lý để nhận tin nhắn."
      },
      {
        badge: "02",
        title: "Gửi Master Prompt Cho AI",
        desc: "Dán câu Master Prompt từ Tab 1 vào Gemini/AI Agent. Cung cấp Token Bot khi AI hỏi.",
        promptBox: "Dán Master Prompt Bài 4 từ Tab 1 vào Gemini"
      },
      {
        badge: "03",
        title: "Prompt Tinh Chỉnh: Thêm Nút Bấm Duyệt Nhanh",
        desc: "Muốn thêm đường link mở trực tiếp file Sheet vào tin nhắn Telegram:",
        promptBox: "Hãy thêm vào cuối tin nhắn Telegram một đường link: '🔗 Nhấp vào đây để mở Google Sheet và bấm Duyệt ngay'."
      }
    ],

    triggerGuide: `
      <h3 class="section-title"><i class="ph-bold ph-lightning"></i> Cài Đặt Trigger Tự Động onFormSubmit</h3>
      <p style="color: var(--text-secondary); line-height: 1.7;">
        Khi AI sinh xong giải pháp, bạn chỉ cần yêu cầu AI: <i>"Hãy gắn trigger onFormSubmit cho hàm xử lý này"</i> hoặc làm theo hướng dẫn 3 bước đơn giản trên giao diện.
      </p>
    `,

    checklist: [
      "Đã tạo Telegram Bot và lấy Token",
      "Đã dán Master Prompt cho AI Agent",
      "Đã liên kết Google Form với Sheet DonNghiPhep_BT4",
      "Thử điền 1 đơn nghỉ phép trên Form",
      "Tin nhắn thông báo xuất hiện tức thì trong nhóm Telegram"
    ]
  }
);
