/**
 * ==============================================================================
 * CÔNG CỤ HỖ TRỢ TEST: GIẢ LẬP GỬI EMAIL BIÊN LAI NGÂN HÀNG (MOCK SENDER)
 * File: 0_GuiEmailGiaLap_Bank.gs
 * Chức năng: Gửi email biên lai chuyển tiền chuẩn định dạng HTML (BIDV/Vietcombank)
 *            đến hòm thư Gmail của bạn để kiểm thử bóc tách tự động.
 * ==============================================================================
 */

/**
 * Hàm chính: Bấm Chạy hàm này để tự động gửi 3 email biên lai mẫu vào Gmail của bạn
 */
function guiBoEmailBienLaiMauDeTest() {
  try {
    // Tự động lấy email của chính bạn đang đăng nhập Google Sheets
    var emailNhan = Session.getActiveUser().getEmail();
    if (!emailNhan) {
      emailNhan = "diepdailehoai@gmail.com"; // Điền email của bạn tại đây nếu cần
    }

    Logger.log("Bắt đầu gửi email test đến: " + emailNhan);

    // 1. Email Mẫu 1: Chi tiền Ăn uống (Phúc Long Coffee & Tea)
    guiEmailBienLaiBIDV({
      emailNhan: emailNhan,
      maGD: "18492015839",
      loaiGD: "Chi",
      soTien: "185,000 VND",
      doiTac: "PHUC LONG COFFEE & TEA",
      kenhTT: "Chuyển khoản (BIDV)",
      noiDung: "Thanh toan tien tra sua va cafe buoi chieu phong kinh doanh"
    });

    // 2. Email Mẫu 2: Thu tiền Hoàn tiền Cashback (BIDV)
    guiEmailBienLaiBIDV({
      emailNhan: emailNhan,
      maGD: "19582014632",
      loaiGD: "Thu",
      soTien: "320,000 VND",
      doiTac: "NGAN HANG BIDV",
      kenhTT: "Thẻ ngân hàng (BIDV)",
      noiDung: "Hoan tien cashback giao dich the thang 08"
    });

    // 3. Email Mẫu 3: Chi tiền Đi lại (Xăng dầu Petrolimex)
    guiEmailBienLaiBIDV({
      emailNhan: emailNhan,
      maGD: "17892014821",
      loaiGD: "Chi",
      soTien: "500,000 VND",
      doiTac: "PETROLIMEX CUA HANG XANG DAU SO 12",
      kenhTT: "Chuyển khoản (BIDV)",
      noiDung: "Do xang xe oto cong tac tuan 3"
    });

    SpreadsheetApp.flush();

    var thongBao = "ĐÃ GỬI THÀNH CÔNG 3 EMAIL BIÊN LAI MẪU!\n\nEmail được gửi đến: " + emailNhan + "\n\nBây giờ bạn có thể mở sheet để chạy quét email (File test.gs hoặc 7_DocThuEmail_Bank.gs) nhé!";
    Logger.log(thongBao);

    try {
      SpreadsheetApp.getUi().alert("GỬI EMAIL TEST THÀNH CÔNG", thongBao, SpreadsheetApp.getUi().ButtonSet.OK);
    } catch (e) {
      Logger.log("Không có UI: " + e.toString());
    }

  } catch (err) {
    Logger.log("Lỗi khi gửi email test: " + err.toString());
  }
}

/**
 * Hàm phụ trợ: Tạo HTML biên lai chuẩn ngân hàng và gửi qua GmailApp
 */
function guiEmailBienLaiBIDV(params) {
  var nowStr = Utilities.formatDate(new Date(), "GMT+7", "HH:mm") + " Thứ " + Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy");
  var isThu = (params.loaiGD === "Thu");

  var subject = "BIDV Biên lai chuyển tiền qua tài khoản - Lệnh GD " + params.maGD;

  var htmlBody = 
    '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">' +
      '<div style="background-color: #ffffff; padding: 25px 20px 15px; text-align: center; border-bottom: 2px solid #008744;">' +
        '<h2 style="color: #0f4c81; margin: 0; font-size: 20px; letter-spacing: 1px;">NGÂN HÀNG <span style="color: #fbbc04;">BIDV</span></h2>' +
        '<h3 style="color: #333333; margin: 8px 0 4px; font-size: 15px; text-transform: uppercase;">BIÊN LAI CHUYỂN TIỀN QUA TÀI KHOẢN</h3>' +
        '<p style="color: #666666; margin: 0; font-size: 12px;">(Loại giao dịch: ' + (isThu ? "Nhận tiền / Thu" : "Chuyển tiền / Chi") + ')</p>' +
      '</div>' +
      
      '<table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #202124;">' +
        '<tr style="border-bottom: 1px solid #f1f3f4;">' +
          '<td style="padding: 12px 20px; font-weight: bold; width: 40%; color: #5f6368;">Ngày, giờ giao dịch</td>' +
          '<td style="padding: 12px 20px; font-weight: 500;">' + nowStr + '</td>' +
        '</tr>' +
        '<tr style="border-bottom: 1px solid #f1f3f4;">' +
          '<td style="padding: 12px 20px; font-weight: bold; color: #5f6368;">Số lệnh giao dịch</td>' +
          '<td style="padding: 12px 20px; font-weight: bold; color: #0f4c81;">' + params.maGD + '</td>' +
        '</tr>' +
        '<tr style="border-bottom: 1px solid #f1f3f4;">' +
          '<td style="padding: 12px 20px; font-weight: bold; color: #5f6368;">Loại giao dịch</td>' +
          '<td style="padding: 12px 20px; font-weight: bold; color: ' + (isThu ? "#137333" : "#c5221f") + ';">' + (isThu ? "Thu" : "Chi") + '</td>' +
        '</tr>' +
        '<tr style="border-bottom: 1px solid #f1f3f4;">' +
          '<td style="padding: 12px 20px; font-weight: bold; color: #5f6368;">' + (isThu ? "Người chuyển tiền" : "Tên người nhận tiền") + '</td>' +
          '<td style="padding: 12px 20px; font-weight: bold; color: #202124;">' + params.doiTac + '</td>' +
        '</tr>' +
        '<tr style="border-bottom: 1px solid #f1f3f4;">' +
          '<td style="padding: 12px 20px; font-weight: bold; color: #5f6368;">Kênh thanh toán</td>' +
          '<td style="padding: 12px 20px;">' + params.kenhTT + '</td>' +
        '</tr>' +
        '<tr style="border-bottom: 1px solid #f1f3f4; background-color: #f8fdf9;">' +
          '<td style="padding: 14px 20px; font-weight: bold; color: #137333; font-size: 14px;">Số tiền</td>' +
          '<td style="padding: 14px 20px; font-weight: bold; color: #137333; font-size: 16px;">' + params.soTien + '</td>' +
        '</tr>' +
        '<tr style="border-bottom: 1px solid #f1f3f4;">' +
          '<td style="padding: 12px 20px; font-weight: bold; color: #5f6368;">Nội dung chuyển tiền</td>' +
          '<td style="padding: 12px 20px; line-height: 1.4;">' + params.noiDung + '</td>' +
        '</tr>' +
      '</table>' +
      
      '<div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 11px; color: #70757a; border-top: 1px solid #e0e0e0;">' +
        '<p style="margin: 0;">Đây là email biên lai giao dịch tự động được tạo phục vụ mục đích kiểm thử hệ thống sổ quỹ.</p>' +
      '</div>' +
    '</div>';

  GmailApp.sendEmail(params.emailNhan, subject, "", {
    htmlBody: htmlBody
  });
}
