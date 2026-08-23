COURSE_DATA.push(
{
    id: "bt2",
    index: 2,
    title: "Bài 2: Prompt Tự Động Điền Dữ Liệu & Xuất Phiếu Giao Hàng PDF Đa Sản Phẩm Lưu Drive",
    shortTitle: "Xuất Phiếu Giao Hàng PDF",
    subtitle: "Prompting cho Google Docs, Drive & Xuất PDF Đa Mặt Hàng",
    level: "Dành Cho Dân Văn Phòng",
    time: "20 phút",
    tags: ["Google Docs Template", "PDF Export", "Multi-Item Invoice", "Google Drive", "No-Code Workflow"],
    desc: "Cách viết Prompt ra lệnh cho AI Agent tự động gom nhóm các đơn hàng 'Chờ xuất' có nhiều sản phẩm, tự động chèn bảng danh mục hàng hóa vào mẫu Docs và xuất file PDF lưu vào Google Drive.",
    csvFile: "bai_tap_2_don_hang.xlsx",
    scriptFile: "BaiTap2_XuatHoaDonPDF_Drive.gs",
    scriptContent: `/**
 * BÀI TẬP 2: TỰ ĐỘNG XUẤT HÓA ĐƠN PDF ĐA SẢN PHẨM TỪ GOOGLE DOCS MẪU
 */
const CONFIG_BT2 = {
  SHEET_NAME: "DonHang_BT2",
  TEMPLATE_DOC_ID: "DIEN_DOCS_ID_VAO_DAY",
  DESTINATION_FOLDER_ID: "DIEN_FOLDER_ID_VAO_DAY"
};

function xuatHangLoatPhieuGiaoHangPDF() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG_BT2.SHEET_NAME);
  if (!sheet) return;

  const lastRow = sheet.getLastRow();
  if (lastRow < 4) return;

  const rows = sheet.getRange(4, 1, lastRow - 3, 12).getValues();
  
  // 1. Gom nhóm sản phẩm theo từng Mã Đơn
  const ordersMap = {};
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const maDon = String(row[0]).trim();
    if (!maDon) continue;

    if (!ordersMap[maDon]) {
      ordersMap[maDon] = {
        maDon: maDon,
        ngayDat: row[1] ? Utilities.formatDate(new Date(row[1]), "GMT+7", "dd/MM/yyyy") : "",
        tenKH: row[2],
        sdt: row[3],
        diaChi: row[4],
        trangThai: String(row[10]).trim(),
        items: [],
        sheetRows: []
      };
    }
    ordersMap[maDon].sheetRows.push(i + 4);
    ordersMap[maDon].items.push({
      tenSP: row[5],
      dvt: row[6],
      soLuong: Number(row[7]) || 1,
      donGia: Number(row[8]) || 0,
      thanhTien: Number(row[9]) || (Number(row[7]) * Number(row[8]))
    });
  }

  const templateDoc = DriveApp.getFileById(CONFIG_BT2.TEMPLATE_DOC_ID);
  const targetFolder = DriveApp.getFolderById(CONFIG_BT2.DESTINATION_FOLDER_ID);
  const ngayXuat = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy");

  for (const maDon in ordersMap) {
    const order = ordersMap[maDon];
    if (order.trangThai === "Chờ xuất") {
      let tongTien = 0;
      order.items.forEach(item => tongTien += item.thanhTien);

      const tempDocFile = templateDoc.makeCopy("Temp_" + order.maDon, targetFolder);
      const tempDoc = DocumentApp.openById(tempDocFile.getId());
      const body = tempDoc.getBody();

      body.replaceText("{{MA_DON}}", String(order.maDon));
      body.replaceText("{{NGAY_DAT}}", String(order.ngayDat));
      body.replaceText("{{NGAY_XUAT}}", ngayXuat);
      body.replaceText("{{TEN_KH}}", String(order.tenKH));
      body.replaceText("{{SDT}}", String(order.sdt));
      body.replaceText("{{DIA_CHI}}", String(order.diaChi));
      body.replaceText("{{TONG_TIEN}}", Number(tongTien).toLocaleString('vi-VN'));

      const tables = body.getTables();
      if (tables.length > 0) {
        const itemTable = tables[0];
        order.items.forEach((item, idx) => {
          const row = itemTable.appendTableRow();
          row.appendTableCell(String(idx + 1)).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
          row.appendTableCell(String(item.tenSP));
          row.appendTableCell(String(item.dvt)).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
          row.appendTableCell(String(item.soLuong)).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
          row.appendTableCell(Number(item.donGia).toLocaleString('vi-VN')).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
          row.appendTableCell(Number(item.thanhTien).toLocaleString('vi-VN')).getChild(0).asParagraph().setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
        });
      }

      tempDoc.saveAndClose();

      const pdfBlob = tempDocFile.getAs(MimeType.PDF).setName("PhieuGiaoHang_" + order.maDon + ".pdf");
      const pdfFile = targetFolder.createFile(pdfBlob);
      pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      tempDocFile.setTrashed(true);

      const pdfUrl = pdfFile.getUrl();
      order.sheetRows.forEach(rowIdx => {
        sheet.getRange(rowIdx, 11).setValue("Đã xuất");
        sheet.getRange(rowIdx, 12).setValue(pdfUrl);
      });
    }
  }
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🚀 TỰ ĐỘNG HÓA")
    .addItem("📄 Xuất Phiếu Giao Hàng PDF", "xuatHangLoatPhieuGiaoHangPDF")
    .addToUi();
}`,
    
    workflow: [
      { icon: "ph-file-doc", title: "1. Mẫu Docs & Bảng", desc: "Tạo file mẫu chứa tag {{...}} và bảng sản phẩm" },
      { icon: "ph-chat-circle-text", title: "2. Ra Lệnh Cho AI", desc: "Mô tả quy trình gom nhóm đa sản phẩm & điền bảng" },
      { icon: "ph-file-pdf", title: "3. Tự Xuất PDF", desc: "AI chuyển đổi Docs sang PDF" },
      { icon: "ph-google-drive-logo", title: "4. Lưu Drive & Cập Nhật", desc: "Lưu vào thư mục & ghi link vào Sheet" }
    ],

    masterPrompt: `Bạn là một Chuyên viên Tự động hóa Quy trình Văn phòng (Office Automation Specialist).

Tôi có:
1. Một Google Sheet tên "DonHang_BT2" chứa danh sách đơn hàng từ dòng 4 gồm 12 cột:
   - Cột A: Mã Đơn (vd: DH-2026-001 - một mã đơn có thể xuất hiện trên nhiều dòng do có nhiều sản phẩm)
   - Cột B: Ngày Đặt (dd/MM/yyyy)
   - Cột C: Tên Khách Hàng
   - Cột D: Số Điện Thoại
   - Cột E: Địa Chỉ Giao Hàng
   - Cột F: Tên Sản Phẩm
   - Cột G: ĐVT (Đơn vị tính: Chiếc, Bộ, Cái...)
   - Cột H: Số Lượng
   - Cột I: Đơn Giá (VNĐ)
   - Cột J: Thành Tiền (VNĐ)
   - Cột K: Trạng Thái ("Chờ xuất" hoặc "Đã xuất")
   - Cột L: Link File PDF
2. Một file mẫu Google Docs có chứa các biến thông tin chung: {{MA_DON}}, {{NGAY_DAT}}, {{NGAY_XUAT}}, {{TEN_KH}}, {{SDT}}, {{DIA_CHI}}, {{TONG_TIEN}} và một Bảng mẫu có sẵn dòng tiêu đề để điền danh mục sản phẩm.
3. Một thư mục Google Drive để lưu các file PDF xuất ra.

HÃY XÂY DỰNG QUY TRÌNH TỰ ĐỘNG HOÀN TOÀN:
- Duyệt qua Sheet và gom nhóm (group by) các dòng có cùng "Mã Đơn" mà có Trạng Thái là "Chờ xuất".
- Với mỗi đơn hàng:
  1. Tạo 1 bản sao từ file Docs mẫu và thay thế các biến {{...}} bằng thông tin khách hàng.
  2. Tự động chèn các dòng sản phẩm của đơn hàng đó vào Bảng (gồm: STT, Tên Sản Phẩm, ĐVT, Số Lượng, Đơn Giá và Thành Tiền có định dạng VNĐ).
  3. Tính Tổng tiền đơn hàng và điền vào thẻ {{TONG_TIEN}}.
  4. Xuất file đó thành định dạng PDF với tên "PhieuGiaoHang_[MãĐơn].pdf" và lưu vào thư mục Drive chỉ định.
  5. Cập nhật lại Google Sheet: Đổi Trạng Thái thành "Đã xuất" và ghi đường dẫn link file PDF vào cột L cho tất cả các dòng thuộc đơn đó.
- Tạo một menu tùy chỉnh tiện lợi trên Google Sheet để nhân viên có thể bấm "Xuất Phiếu Giao Hàng PDF" với 1 click.`,

    businessScenario: {
      story: "Bạn là Nhân viên Quản lý Kho vận hoặc Kế toán Bán hàng tại công ty phân phối thiết bị công nghệ. Mỗi ngày công ty phát sinh từ 50 đến 100 đơn hàng. Trong thực tế, một đơn hàng thường bao gồm nhiều sản phẩm khác nhau (ví dụ: 1 máy Laptop + 1 Chuột + 1 Balo chống sốc).",
      pain: "Nhân viên phải mở từng dòng trên Sheet, dò tìm các sản phẩm cùng mã đơn, kẻ bảng trong Word, copy họ tên, sản phẩm, tính tổng tiền rồi dán thủ công, bấm Save As PDF rồi upload vào Drive. Mất 2-3 tiếng mỗi ngày và rất dễ gõ nhầm số tiền hoặc bỏ sót sản phẩm.",
      solution: "Ra lệnh cho AI Agent tạo sẵn nút bấm '🚀 Xuất Phiếu Giao Hàng PDF' trên Google Sheets. Bấm 1 click là hệ thống tự gom nhóm sản phẩm theo mã đơn, tự chèn bảng hàng hóa vào mẫu Docs, xuất thành PDF lưu thẳng vào Drive và cập nhật link vào bảng tính trong 30 giây."
    },

    promptBreakdown: [
      { tag: "1. VẬT LIỆU ĐẦU VÀO", title: "Cấu trúc đa sản phẩm", desc: "Nêu rõ cấu trúc 12 cột: Mã đơn lặp lại nhiều dòng cho các mặt hàng khác nhau trong cùng đơn." },
      { tag: "2. GOM NHÓM DỮ LIỆU", title: "Group By theo Mã Đơn", desc: "Yêu cầu AI gom nhóm các dòng cùng Mã Đơn để xuất ra duy nhất 1 hóa đơn PDF hoàn chỉnh." },
      { tag: "3. CHÈN BẢNG ĐỘNG", title: "Dynamic Table trong Docs", desc: "Chỉ rõ việc chèn động từng dòng mặt hàng vào bảng biểu trong Google Docs." },
      { tag: "4. TÍNH TỔNG & ĐỊNH DẠNG", title: "Tính Tổng Tiền & VNĐ", desc: "Tự động tính tổng tiền các món và định dạng phân cách hàng nghìn chuẩn VNĐ." },
      { tag: "5. CẬP NHẬT ĐỒNG BỘ", title: "Đổi trạng thái toàn bộ dòng", desc: "Ghi nhận link PDF và chuyển trạng thái 'Đã xuất' cho toàn bộ các dòng thuộc đơn." }
    ],

    businessRequirements: `
      <p><b>Bài toán thực tế:</b> Đơn hàng thực tế luôn có <b>nhiều sản phẩm</b>. Thay vì sao chép từng sản phẩm vào bảng Word/Docs bằng tay, AI Agent tự động gom nhóm theo Mã Đơn, vẽ bảng chi tiết sản phẩm và xuất 1 file PDF trọn vẹn.</p>
    `,

    tableHeaders: ["Mã Đơn", "Ngày Đặt", "Tên Khách Hàng", "Số Điện Thoại", "Địa Chỉ", "Sản Phẩm", "ĐVT", "SL", "Đơn Giá", "Thành Tiền", "Trạng Thái", "Link PDF"],
    tableRows: [
      ["DH-2026-001", "10/08/2026", "Nguyễn Văn An", "0988123456", "12 Hoàng Hoa Thám, HN", "Laptop Dell XPS 15", "Chiếc", 1, "32,000,000", "32,000,000", "<span style='color: #f59e0b; font-weight: bold;'>Chờ xuất</span>", "—"],
      ["", "", "", "", "", "Chuột không dây Logitech MX", "Chiếc", 1, "2,100,000", "2,100,000", "", ""],
      ["", "", "", "", "", "Balo chống sốc Targus 15.6\"", "Chiếc", 1, "850,000", "850,000", "", ""],
      ["DH-2026-002", "10/08/2026", "Trần Thị Bích", "0903987654", "45 Lê Duẩn, TP.HCM", "Màn hình Dell UltraSharp 27\"", "Chiếc", 2, "8,500,000", "17,000,000", "<span style='color: #f59e0b; font-weight: bold;'>Chờ xuất</span>", "—"],
      ["", "", "", "", "", "Giá treo màn hình Human Motion", "Bộ", 2, "890,000", "1,780,000", "", ""],
      ["", "", "", "", "", "Cáp HDMI 2.1 8K Baseus", "Sợi", 2, "250,000", "500,000", "", ""]
    ],

    steps: [
      {
        badge: "01",
        title: "Kiểm Kê Cấu Trúc Sheet & Dữ Liệu Bằng AI (Prompt Trinh Sát)",
        desc: "Đảm bảo file Google Sheets của bạn đã được bật chế độ chia sẻ (Share) là <b>'Bất kỳ ai có đường liên kết đều có thể xem'</b>. Gửi link kèm câu lệnh kiểm kê tổng quát để AI (SPARK / Gemini) quét danh sách các sheet, bóc tách cấu trúc cột và phạm vi dữ liệu trong sheet <code>DonHang_BT2</code>.",
        promptBox: `Hãy truy cập vào file Google Sheet này: [Dán link vào đây].

Tôi cần bạn thực hiện kiểm kê tổng quát về cấu trúc của file này. Vui lòng thực hiện các bước sau:

1. Liệt kê tên tất cả các sheet (tab) hiện có trong file.

2. Với mỗi sheet, hãy mô tả cấu trúc của nó bao gồm:
   - Danh sách các tiêu đề cột (tên cột nằm ở dòng mấy).
   - Định dạng dữ liệu của các cột đó (ví dụ: cột đó chứa văn bản, số, ngày tháng, hay công thức).
   - Tổng số dòng dữ liệu ước tính trong sheet đó.

3. Trình bày kết quả dưới dạng bảng tổng hợp để tôi dễ đối chiếu.`,
        expectedResult: {
          image: "assets/spark_read_success.png",
          imageTitle: "Kết quả AI kiểm kê và đọc thành công toàn bộ các sheet dữ liệu"
        }
      },
      {
        badge: "02",
        title: "Thiết Kế Biểu Mẫu Tự Nhiên Bằng AI (Dữ Liệu Thật)",
        desc: "Yêu cầu AI dựa trên tài liệu quy tắc thiết kế biểu mẫu để tạo mẫu <code>Phiếu xuất kho kiêm giao hàng</code> chuẩn in ấn A4, tự động co giãn vừa khít lề trang giấy.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia soạn thảo văn bản. Hãy tuân thủ nghiêm ngặt toàn bộ nguyên tắc trong tài liệu "QUY_TAC_THIET_KE_BIEU_MAU_DOCS_WORD_AI.md" đính kèm.

[YÊU CẦU NGHIỆP VỤ]: Dựa vào thông tin đơn hàng đã phân tích ở trên, hãy thiết kế cho tôi mẫu "Phiếu xuất kho kiêm giao hàng" chuyên nghiệp trên Google Docs / Word.

Yêu cầu biểu mẫu có đầy đủ:
1. Thông tin công ty phát hành và thông tin khách hàng nhận hàng.
2. Bảng danh mục sản phẩm (STT, Tên hàng, ĐVT, Số lượng, Đơn giá, Thành tiền) điền sẵn 2-3 dòng sản phẩm mẫu thực tế.
3. Tổng tiền, số tiền bằng chữ và 3 chữ ký (Người lập, Người giao, Người nhận).

Hãy trình bày dưới dạng văn bản tài liệu rõ ràng, trang nhã để tôi copy vào Google Docs làm mẫu in.`,
        expectedResult: {
          image: "assets/phieu_xuat_kho_template_preview.png",
          imageTitle: "Mẫu Phiếu Xuất Kho Kiêm Giao Hàng với dữ liệu thực tế do AI thiết kế"
        }
      },
      {
        badge: "03",
        title: "Chuyển Đổi Dữ Liệu Thành Biến Tự Động Hóa {{...}}",
        desc: "Sau khi đã ướm thử mẫu ưng ý trên Google Docs, gửi tiếp câu lệnh ngắn này để AI tự động chuyển các thông tin cụ thể thành các biến <code>{{Ten_Bien}}</code>.",
        promptBox: `Mẫu biểu rất đẹp! Bây giờ hãy tự động chuyển đổi toàn bộ các giá trị dữ liệu cụ thể trong mẫu này thành các biến đặt trong cặp ngoặc nhọn {{...}} (ví dụ: {{Ma_Don}}, {{Ten_Khach_Hang}}, {{Ten_San_Pham}}, {{Tong_Tien}}...) để tôi dùng làm mẫu tự động hóa.

Hãy xuất lại toàn bộ văn bản mẫu Google Docs đã gắn đầy đủ các thẻ biến {{...}} này nhé.`,
        expectedResult: {
          image: "assets/spark_template_docs.png",
          imageTitle: "Mẫu Google Docs Template đã gắn đầy đủ các thẻ biến {{...}}"
        }
      },
      {
        badge: "04",
        title: "Viết Mã Apps Script Tự Động Hóa Xuất PDF",
        desc: "Gửi câu lệnh nghiệp vụ bên dưới kèm file Quy Tắc Kỹ Thuật để AI tự động viết mã Apps Script gom nhóm đơn hàng và xuất PDF lưu Drive.",
        promptBox: `[TIÊU CHUẨN KỸ THUẬT]: Bạn là Chuyên gia Google Apps Script. Hãy tuân thủ nghiêm ngặt toàn bộ nguyên tắc trong tài liệu "QUY_TAC_SINH_CODE_APPS_SCRIPT_AI.md" đính kèm.

[BỐI CẢNH & DỮ LIỆU]: Trang tính "DonHang_BT2" có dữ liệu từ dòng 4 gồm các cột:
- Mã đơn, Ngày đặt, Tên khách hàng, Số điện thoại, Địa chỉ giao hàng
- Tên sản phẩm, ĐVT, Số lượng, Đơn giá, Thành tiền
- Trạng thái, Link file PDF

[YÊU CẦU NGHIỆP VỤ - XUẤT PHIẾU GIAO HÀNG PDF LƯU DRIVE]:
Hãy viết mã Google Apps Script hoàn chỉnh:
1. Gom nhóm các sản phẩm có cùng mã đơn và chỉ xuất các đơn có trạng thái "Chờ xuất" (xử lý trường hợp mã đơn bị gộp ô trên sheet).
2. Điền thông tin đơn hàng và danh mục sản phẩm vào mẫu Google Docs.
3. Xuất file PDF lưu vào thư mục Google Drive, cập nhật trạng thái đơn thành "Đã xuất" và dán link xem PDF vào bảng tính.
4. Tạo Menu nút bấm trên Google Sheets để người dùng bấm xuất phiếu nhanh.

[YÊU CẦU ĐẦU RA]:
- Xuất khối mã Apps Script hoàn chỉnh, có khai báo phần cấu hình ID ở đầu file để dễ thay thế.`,
        expectedResult: {
          images: [
            {
              src: "assets/step3_code_ai_generated.png",
              title: "1. Mã Apps Script hoàn chỉnh do AI tự động thiết kế"
            },
            {
              src: "assets/step3_sheet_open_appscript.png",
              title: "2. Mở trình soạn thảo Tiện ích mở rộng ➔ Apps Script trên Google Sheets"
            },
            {
              src: "assets/step3_appscript_run_success.png",
              title: "3. Dán mã vào Mã.gs, chọn hàm onOpen và bấm Chạy thử nghiệm thành công"
            }
          ]
        }
      },
      {
        badge: "05",
        title: "Dán Mã, Điền ID & Chạy Thử Nghiệm Trên Sheets",
        desc: "Tạo một thư mục Google Drive tên <code>HoaDon_PDF</code>, sao chép ID thư mục và ID file Google Docs Template vừa tạo dán vào mã nguồn Apps Script. Mở <b>Tiện ích mở rộng ➔ Apps Script</b>, dán mã code, chọn hàm <code>onOpen</code> và chạy thử.",
        expectedResult: {
          image: "assets/spark_pdf_exported_drive.png",
          imageTitle: "File PDF phiếu giao hàng tự động lưu vào Google Drive"
        }
      }
    ],

    triggerGuide: `
      <h3 class="section-title"><i class="ph-bold ph-cursor-click"></i> Cách Sử Dụng Nút Bấm 1-Click</h3>
      <p style="color: var(--text-secondary); line-height: 1.7;">
        Sau khi AI cài đặt xong, mỗi khi mở Google Sheet bạn sẽ thấy xuất hiện menu mới: <b>🚀 TỰ ĐỘNG HÓA ➔ 📄 Xuất Phiếu Giao Hàng PDF</b>. Hệ thống sẽ tự động lọc các đơn chưa xuất, gom toàn bộ sản phẩm cùng mã đơn và xuất thành 1 file PDF duy nhất trong Google Drive!
      </p>
    `,

    checklist: [
      "Đã tạo mẫu Google Docs với các thẻ {{...}} và Bảng sản phẩm mẫu",
      "Đã gửi Master Prompt cho AI Agent và nhận phản hồi mã Apps Script",
      "Menu 'Tự Động Hóa' xuất hiện trên thanh công cụ Google Sheet",
      "Bấm nút và kiểm tra file PDF xuất hiện trong Google Drive đầy đủ danh mục mặt hàng",
      "Toàn bộ các dòng thuộc đơn hàng được cập nhật trạng thái 'Đã xuất' và link PDF"
    ]
  }
);
