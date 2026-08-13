COURSE_DATA.push(
{
    id: "bt3",
    index: 3,
    title: "Bài 3: Prompt Gửi Phiếu Lương Hàng Loạt Cá Nhân Hóa & Bảo Mật",
    shortTitle: "Gửi Phiếu Lương Cá Nhân Hóa",
    subtitle: "Prompting cho Nghiệp Vụ Nhân Sự (HR) & Gmail",
    level: "Dành Cho Dân Văn Phòng",
    time: "15 phút",
    tags: ["HR Automation", "Gmail Security", "Email HTML Template", "Anti-Spam"],
    desc: "Cách viết Prompt ra lệnh cho AI tự động quét bảng lương nhân sự, soạn email bảng thu nhập chi tiết gửi riêng cho từng người và tự khóa chống gửi trùng.",
    csvFile: "bai_tap_3_gui_phieu_luong.csv",
    scriptFile: "BaiTap3_GuiPhieuLuong_GmailApp.gs",
    scriptContent: `/**
 * BÀI TẬP 3: GỬI PHIẾU LƯƠNG TỰ ĐỘNG QUA GMAIL
 */
const CONFIG_BT3 = {
  SHEET_NAME: "BangLuong_BT3",
  COMPANY_NAME: "CÔNG TY CỔ PHẦN CÔNG NGHỆ AUTO",
  HR_EMAIL: "hr@congty.com"
};

function guiPhieuLuongHangLoat() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG_BT3.SHEET_NAME);
  if (!sheet) return;

  const lastRow = sheet.getLastRow();
  if (lastRow < 4) return;

  const rows = sheet.getRange(4, 1, lastRow - 3, 11).getValues();
  const thangHienTai = Utilities.formatDate(new Date(), "GMT+7", "MM/yyyy");

  for (let i = 0; i < rows.length; i++) {
    const maNV = rows[i][0];
    const hoTen = rows[i][1];
    const phongBan = rows[i][2];
    const email = String(rows[i][3]).trim();
    const luongCB = Number(rows[i][4]).toLocaleString('vi-VN');
    const phuCap = Number(rows[i][5]).toLocaleString('vi-VN');
    const thuongHQ = Number(rows[i][6]).toLocaleString('vi-VN');
    const khauTru = Number(rows[i][7]).toLocaleString('vi-VN');
    const thucLinh = Number(rows[i][8]).toLocaleString('vi-VN');
    const trangThai = rows[i][9];

    if (trangThai === "Chưa gửi" && email.includes("@")) {
      const subject = \`[PHIẾU LƯƠNG THÁNG \${thangHienTai}] - Kính gửi \${hoTen}\`;
      const htmlBody = \`
        <div style="font-family: Arial; max-width: 500px; margin: auto; border: 1px solid #E2E8F0; padding: 20px; border-radius: 8px;">
          <h3 style="color: #1B365D; text-align: center; margin-top: 0;">PHIẾU LƯƠNG THÁNG \${thangHienTai}</h3>
          <p>Xin chào <b>\${hoTen}</b> (Mã NV: <i>\${maNV}</i> - \${phongBan}),</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 15px 0;">
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 6px 0;">Lương cơ bản:</td><td style="text-align: right;">\${luongCB} đ</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 6px 0;">Phụ cấp:</td><td style="text-align: right;">\${phuCap} đ</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 6px 0;">Thưởng KPI:</td><td style="text-align: right; color: #16A34A;">+ \${thuongHQ} đ</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 6px 0;">Khấu trừ:</td><td style="text-align: right; color: #DC2626;">- \${khauTru} đ</td></tr>
            <tr style="background: #EFF6FF;"><td style="padding: 10px 5px; font-weight: bold; color: #1D4ED8;">THỰC LĨNH:</td><td style="padding: 10px 5px; text-align: right; font-weight: bold; font-size: 16px; color: #1D4ED8;">\${thucLinh} đ</td></tr>
          </table>
          <p style="font-size: 12px; color: #64748B;">Mọi thắc mắc vui lòng liên hệ \${CONFIG_BT3.HR_EMAIL}.</p>
        </div>\`;

      GmailApp.sendEmail(email, subject, "", { htmlBody: htmlBody });

      const currentRow = i + 4;
      const thoiGian = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
      sheet.getRange(currentRow, 10).setValue("Đã gửi");
      sheet.getRange(currentRow, 11).setValue(thoiGian);
    }
  }
}`,
    
    workflow: [
      { icon: "ph-users", title: "1. Bảng Lương HR", desc: "Dữ liệu lương từng nhân viên" },
      { icon: "ph-chat-circle-dots", title: "2. Prompt Nghiệp Vụ", desc: "Mô tả tiêu chuẩn bảo mật & mẫu thư" },
      { icon: "ph-lock-key", title: "3. Bảo Mật Cá Nhân", desc: "Mỗi người chỉ nhận thư riêng biệt" },
      { icon: "ph-shield-check", title: "4. Chống Gửi Lặp", desc: "Ghi log thời gian & khóa gửi lại" }
    ],

    masterPrompt: `Bạn là một Trợ lý Tự động hóa Nhân sự (HR Automation Specialist).

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
5. Thêm cơ chế bảo vệ: Khi người dùng bấm chạy lại lần 2, hệ thống tự động bỏ qua những người đã gửi, tuyệt đối không gửi trùng lặp.`,

    businessScenario: {
      story: "Bạn là Chuyên viên Nhân sự (C&B / HR) phụ trách gửi phiếu lương hàng tháng cho 50 nhân viên. Thu nhập cá nhân là thông tin nhạy cảm bắt buộc phải bảo mật 100% giữa các nhân sự.",
      pain: "Gửi thủ công từng email riêng rất dễ gửi nhầm bảng lương của người này cho người khác (vi phạm bảo mật lương nghiêm trọng). Nếu gửi giữa chừng bị mạng chập chờn thì không nhớ ai đã gửi ai chưa, dẫn đến gửi trùng lặp gây phiền toái.",
      solution: "AI Agent tự động quét bảng lương: tự tách riêng thu nhập từng người, soạn email HTML chuyên nghiệp (định dạng VNĐ), gửi riêng biệt, ghi nhận thời gian gửi và tự động khóa chống gửi trùng."
    },

    promptBreakdown: [
      { tag: "1. BẢO MẬT TUYỆT ĐỐI", title: "Nguyên tắc 1-1", desc: "Yêu cầu rõ ràng mỗi nhân viên chỉ nhận được đúng dòng thu nhập của mình." },
      { tag: "2. TIÊU CHUẨN TIỀN TỆ", title: "Format số VNĐ", desc: "Yêu cầu số tiền phải có dấu phẩy/chấm phân cách hàng nghìn và đơn vị VNĐ dễ đọc." },
      { tag: "3. CƠ CHẾ CHỐNG LẶP", title: "Anti-Duplication Guard", desc: "Dựa vào cột 'Trạng Thái' và 'Thời Gian Gửi' để đảm bảo không bị spam email nhân viên." },
      { tag: "4. TEMPLATE THƯƠNG HIỆU", title: "Email HTML Trang Nhã", desc: "Giao diện bảng thu nhập chuyên nghiệp, tạo niềm tin cho người lao động." }
    ],

    businessRequirements: `
      <p><b>Bài toán thực tế:</b> Gửi phiếu lương thủ công cho 50 nhân viên mất nửa ngày và rất dễ gửi nhầm file của người này cho người khác (vi phạm bảo mật lương nghiêm trọng). Bằng 1 câu Prompt chuẩn, AI sẽ tự động hóa khép kín và an toàn 100%.</p>
    `,

    tableHeaders: ["Mã NV", "Họ và Tên", "Phòng Ban", "Email Nhận", "Lương CB", "Phụ Cấp", "Thưởng KPI", "Khấu Trừ", "Thực Lĩnh", "Trạng Thái", "Thời Gian Gửi"],
    tableRows: [
      ["NV001", "Hoàng Văn Dũng", "Kinh Doanh", "dung.demo@gmail.com", "15,000,000", "2,000,000", "3,500,000", "500,000", "<b style='color: #10b981;'>20,000,000 đ</b>", "Chưa gửi", "—"],
      ["NV002", "Lê Thị Mai", "Kế Toán", "mai.demo@gmail.com", "16,000,000", "1,500,000", "2,000,000", "0", "<b style='color: #10b981;'>19,500,000 đ</b>", "Chưa gửi", "—"]
    ],

    steps: [
      {
        badge: "01",
        title: "Chuẩn Bị Bảng Lương Trên Google Sheets",
        desc: "Đổi tên sheet thành <code>BangLuong_BT3</code>, nhập dữ liệu và chỉnh sửa email nhận thành email phụ của bạn để kiểm thử."
      },
      {
        badge: "02",
        title: "Gửi Master Prompt Cho Gemini",
        desc: "Dán câu Master Prompt từ Tab 1 vào Gemini in Google Sheets hoặc AI Agent.",
        promptBox: "Dán Master Prompt Bài 3 từ Tab 1 vào Gemini"
      },
      {
        badge: "03",
        title: "Prompt Tinh Chỉnh: Thêm Lời Nhắn Từ Ban Giám Đốc",
        desc: "Nếu muốn thêm thông điệp chúc mừng hoặc lưu ý phản hồi trong vòng 48h:",
        promptBox: "Hãy thêm vào cuối email một khung ghi chú màu vàng nhạt: 'Mọi thắc mắc về bảng lương vui lòng phản hồi qua email hr@congty.com trong vòng 48 giờ làm việc.'"
      }
    ],

    triggerGuide: `
      <h3 class="section-title"><i class="ph-bold ph-envelope-simple"></i> Kiểm Tra Giới Hạn Gửi Gmail</h3>
      <p style="color: var(--text-secondary); line-height: 1.7;">
        Tài khoản Gmail cá nhân cho phép gửi tối đa 100 email/ngày. Tài khoản Google Workspace Doanh nghiệp cho phép gửi tới 1.500 email/ngày.
      </p>
    `,

    checklist: [
      "Đã gửi Master Prompt Bài 3 cho AI Agent",
      "Chạy thử nghiệm và nhận được email bảng lương HTML chuẩn đẹp",
      "Số tiền trong email được định dạng có dấu phân cách hàng nghìn",
      "Cột Trạng Thái tự động chuyển thành 'Đã gửi'",
      "Chạy lại lần 2 và kiểm tra hệ thống tự động bỏ qua không gửi trùng"
    ]
  }
);
