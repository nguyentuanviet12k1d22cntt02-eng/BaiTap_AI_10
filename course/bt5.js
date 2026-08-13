COURSE_DATA.push(
{
    id: "bt5",
    index: 5,
    title: "Bài 5: Prompt Xử Lý & Làm Sạch 1.000 Dòng Dữ Liệu Lớn Tối Ưu Tốc Độ",
    shortTitle: "Làm Sạch Dữ Liệu Lớn (Big Data)",
    subtitle: "Prompting Tối Ưu Hiệu Năng & Chuẩn Hóa Dữ Liệu",
    level: "Dành Cho Dân Văn Phòng",
    time: "20 phút",
    tags: ["Big Data Cleaning", "In-memory RAM", "Phone & Name Normalization", "Fast Execution"],
    desc: "Cách viết Prompt ra lệnh cho AI xử lý 1.000 đến 10.000 dòng dữ liệu thô: lọc bỏ đơn trùng, sửa số điện thoại mất số 0, chuẩn hóa họ tên trong dưới 2 giây.",
    csvFile: "bai_tap_5_raw_data_1000_rows.csv",
    scriptFile: "BaiTap5_LamSachDuLieuLon_Optimization.gs",
    scriptContent: `/**
 * BÀI TẬP 5: XỬ LÝ & LÀM SẠCH 1.000 DÒNG DỮ LIỆU LỚN TỐI ƯU HIỆU NĂNG
 */
const CONFIG_BT5 = {
  RAW_SHEET_NAME: "RawData_BT5",
  CLEAN_SHEET_NAME: "DataCleaned_BT5"
};

function lamSachVaChuanHoaDuLieuLon() {
  const startTime = new Date().getTime();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rawSheet = ss.getSheetByName(CONFIG_BT5.RAW_SHEET_NAME);
  if (!rawSheet) return;

  let cleanSheet = ss.getSheetByName(CONFIG_BT5.CLEAN_SHEET_NAME);
  if (!cleanSheet) cleanSheet = ss.insertSheet(CONFIG_BT5.CLEAN_SHEET_NAME);
  else cleanSheet.clear();

  const rawData = rawSheet.getDataRange().getValues();
  if (rawData.length < 4) return;

  const headers = ["Mã Giao Dịch", "Tên Khách Hàng", "Số Điện Thoại", "Kênh Bán", "Doanh Thu", "Ngày Tạo", "Trạng Thái"];
  const rows = rawData.slice(3);

  const seenCodes = new Set();
  const cleanedRows = [];

  for (let i = 0; i < rows.length; i++) {
    const maGD = String(rows[i][0]).trim();
    let tenKH = String(rows[i][1]).trim();
    let sdt = String(rows[i][2]).trim().replace(/[\\.\\s-]/g, "");
    const kenhBan = String(rows[i][3]).trim();
    const doanhThu = Number(rows[i][4]) || 0;
    const ngayTao = rows[i][5] instanceof Date ? Utilities.formatDate(rows[i][5], "GMT+7", "dd/MM/yyyy") : rows[i][5];

    if (maGD === "" || seenCodes.has(maGD) || doanhThu <= 0) continue;
    seenCodes.add(maGD);

    tenKH = tenKH.toLowerCase().split(/\\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    if (sdt.length === 9 && !sdt.startsWith("0")) sdt = "0" + sdt;

    cleanedRows.push([maGD, tenKH, sdt, kenhBan, doanhThu, ngayTao, "Hợp Lệ"]);
  }

  if (cleanedRows.length > 0) {
    cleanSheet.getRange("A1:G1").merge().setValue("BẢNG DỮ LIỆU ĐÃ ĐƯỢC LÀM SẠCH (CLEAN DATA)").setBackground("#1B365D").setFontColor("#FFFFFF").setFontWeight("bold");
    cleanSheet.getRange(3, 1, 1, headers.length).setValues([headers]).setBackground("#005A9C").setFontColor("#FFFFFF").setFontWeight("bold");
    cleanSheet.getRange(4, 1, cleanedRows.length, headers.length).setValues(cleanedRows);
    cleanSheet.getRange(4, 5, cleanedRows.length, 1).setNumberFormat("#,##0");
    cleanSheet.autoResizeColumns(1, headers.length);
  }

  const duration = ((new Date().getTime() - startTime) / 1000).toFixed(2);
  SpreadsheetApp.getUi().alert(\`Đã hoàn tất trong \${duration} giây!\\n- Dữ liệu gốc: \${rows.length} dòng\\n- Dữ liệu sạch: \${cleanedRows.length} dòng\`);
}`,
    
    workflow: [
      { icon: "ph-database", title: "1. 1.000 Dòng Log Thô", desc: "Dữ liệu lỗi, trùng lặp, sai định dạng" },
      { icon: "ph-chat-circle-text", title: "2. Prompt Tối Ưu RAM", desc: "Yêu cầu xử lý mảng in-memory" },
      { icon: "ph-magic-wand", title: "3. AI Làm Sạch & Lọc", desc: "Tự xóa trùng & chuẩn hóa họ tên/SĐT" },
      { icon: "ph-check-circle", title: "4. Bảng Sạch Hoàn Hảo", desc: "Xuất ra sheet mới trong 2 giây" }
    ],

    masterPrompt: `Bạn là một Chuyên gia Xử lý Dữ liệu Lớn & Tối ưu Hiệu năng Google Workspace (Data Processing & Performance Optimization Expert).

Tôi có sheet "RawData_BT5" chứa hơn 1.000 dòng log đơn hàng đổ về từ các sàn Shopee, Lazada, TikTok Shop (dữ liệu từ dòng 4) với các cột:
- Cột A: Mã Giao Dịch (Có trường hợp bị trống, hoặc bị trùng lặp)
- Cột B: Tên Khách Hàng (Nhiều khoảng trắng thừa, viết hoa/thường lộn xộn)
- Cột C: Số Điện Thoại (Có dấu chấm, khoảng trắng, hoặc bị mất số '0' ở đầu do định dạng số)
- Cột D: Kênh Bán
- Cột E: Doanh Thu (Có bản ghi bị âm hoặc bằng 0 do lỗi hệ thống)
- Cột F: Ngày Tạo

HÃY XÂY DỰNG QUY TRÌNH LÀM SẠCH VÀ CHUẨN HÓA DỮ LIỆU TỐC ĐỘ CAO:
1. NGUYÊN TẮC HIỆU NĂNG: Phải đọc toàn bộ dữ liệu 1 lần duy nhất vào bộ nhớ RAM bằng getValues(), xử lý hoàn toàn trên mảng và ghi xuống sheet đúng 1 lần bằng setValues() để thời gian chạy dưới 3 giây (tránh bị timeout).
2. QUY TẮC LÀM SẠCH (DATA CLEANING):
   - Loại bỏ các dòng có Mã Giao Dịch rỗng.
   - Sử dụng Set để loại bỏ triệt để các Mã Giao Dịch bị trùng lặp (chỉ giữ lại bản ghi đầu tiên).
   - Loại bỏ các dòng có Doanh Thu <= 0.
   - Chuẩn hóa Tên Khách Hàng: Xóa khoảng trắng thừa và viết hoa chữ cái đầu từng từ (vd: "  nguyễn văn an " -> "Nguyễn Văn An").
   - Chuẩn hóa Số Điện Thoại: Xóa toàn bộ ký tự lạ (. - space) và tự động thêm số "0" vào đầu nếu SĐT chỉ có 9 chữ số.
3. ĐẦU RA: Tự động tạo sheet mới tên "DataCleaned_BT5", trang trí tiêu đề và ghi toàn bộ dữ liệu sạch sang đó, đồng thời hiển thị hộp thoại thống kê: Thời gian xử lý, Số dòng ban đầu, Số dòng hợp lệ, Số dòng đã loại bỏ.`,

    businessScenario: {
      story: "Bạn là Chuyên viên Phân tích Dữ liệu / Vận hành E-Commerce. Cuối mỗi ngày, hệ thống trả về file log hơn 1.000 đơn hàng từ Shopee, Lazada, TikTok Shop, Website hỗn độn.",
      pain: "Mã đơn bị rỗng hoặc bị trùng do khách bấm mua 2 lần, số điện thoại bị mất số '0' ở đầu hoặc dính dấu chấm/khoảng trắng, doanh thu bị âm. Dùng các hàm Excel thủ công lọc từng dòng mất cả buổi chiều và máy tính bị đơ giật.",
      solution: "Sử dụng Prompt ép AI xử lý mảng trên bộ nhớ RAM (In-Memory Array), toàn bộ 1.000 dòng dữ liệu được lọc sạch, chuẩn hóa họ tên và SĐT 10 số, xuất sang sheet mới tinh tươm chỉ trong 2 giây!"
    },

    promptBreakdown: [
      { tag: "1. ÉP BUỘC HIỆU NĂNG", title: "Kỹ thuật In-Memory Array", desc: "Nhắc rõ từ khóa getValues/setValues 1 lần duy nhất để AI không sinh mã duyệt từng ô chậm chạp." },
      { tag: "2. BỘ QUY TẮC LÀM SẠCH", title: "Chi tiết từng lỗi cụ thể", desc: "Liệt kê rõ ràng: Mã rỗng, mã trùng, doanh thu âm, SĐT thiếu số 0, tên thừa khoảng trắng." },
      { tag: "3. TÁCH BIỆT DỮ LIỆU", title: "Bảo toàn dữ liệu gốc", desc: "Yêu cầu ghi sang Sheet mới 'DataCleaned_BT5' để không làm hỏng sheet thô ban đầu." },
      { tag: "4. BÁO CÁO THỐNG KÊ", title: "Audit Log minh bạch", desc: "Yêu cầu thông báo số lượng dòng loại bỏ theo từng nguyên nhân để đối soát." }
    ],

    businessRequirements: `
      <p><b>Bài toán thực tế:</b> Nhân viên xử lý dữ liệu hàng ngày phải tốn hàng giờ dùng hàm Filter, Text to Columns, Trim, Proper thủ công rất dễ sót. Bằng Prompt tối ưu hiệu năng này, 1.000 dòng dữ liệu được làm sạch chuẩn chỉnh chỉ trong 2 giây.</p>
    `,

    tableHeaders: ["Mã Giao Dịch", "Tên Khách Hàng", "Số Điện Thoại", "Kênh Bán", "Doanh Thu", "Ngày Tạo", "Trạng Thái Lỗi"],
    tableRows: [
      ["TRX-2026-00001", "   nguyễn văn an  ", "988123456", "Shopee", "1,250,000", "01/08/2026", "<span style='color: #f59e0b;'>Thừa khoảng trắng, thiếu số 0</span>"],
      ["TRX-2026-00002", "TRẦN THỊ BÍCH", "0903.987.654", "Lazada", "850,000", "01/08/2026", "<span style='color: #f59e0b;'>SĐT có dấu chấm</span>"],
      ["", "Lê Hoàng Long", "0912345678", "TikTok Shop", "450,000", "02/08/2026", "<span style='color: #ef4444;'>Mã rỗng (Loại)</span>"],
      ["TRX-2026-00001", "Nguyễn Văn An", "0988123456", "Shopee", "1,250,000", "01/08/2026", "<span style='color: #ef4444;'>Trùng mã (Loại)</span>"]
    ],

    steps: [
      {
        badge: "01",
        title: "Import 1.000 Dòng Dữ Liệu Thô",
        desc: "Nhập file <code>bai_tap_5_raw_data_1000_rows.csv</code> vào sheet <code>RawData_BT5</code>."
      },
      {
        badge: "02",
        title: "Dán Master Prompt Cho Gemini",
        desc: "Dán câu Master Prompt từ Tab 1 vào AI. AI sẽ tự động tạo bộ xử lý trên RAM siêu nhanh.",
        promptBox: "Dán Master Prompt Bài 5 từ Tab 1 vào Gemini"
      },
      {
        badge: "03",
        title: "Prompt Tinh Chỉnh: Tự Động Phân Bổ Theo Kênh Bán",
        desc: "Nếu muốn tách dữ liệu sạch thành các sheet riêng theo từng sàn (Shopee, Lazada, TikTok):",
        promptBox: "Hãy nâng cấp quy trình: Sau khi làm sạch xong, hãy tự động tách và tạo các sheet riêng cho từng Kênh Bán (Shopee, Lazada, TikTok Shop, Website) tương ứng."
      }
    ],

    triggerGuide: `
      <h3 class="section-title"><i class="ph-bold ph-lightning"></i> Tự Động Hóa Đồng Bộ Hàng Đêm</h3>
      <p style="color: var(--text-secondary); line-height: 1.7;">
        Bạn có thể yêu cầu AI: <i>"Hãy tạo trigger tự động làm sạch và lưu trữ dữ liệu vào lúc 23:30 mỗi đêm"</i> để mỗi sáng đến văn phòng bạn luôn có sẵn bảng dữ liệu sạch tinh tươm.
      </p>
    `,

    checklist: [
      "Đã nạp 1.000 dòng dữ liệu thô vào sheet RawData_BT5",
      "Đã gửi Master Prompt cho AI Agent",
      "Chạy quy trình và quan sát sheet DataCleaned_BT5 xuất hiện",
      "Tên khách hàng đã được viết hoa chuẩn đẹp",
      "Số điện thoại được đưa về đúng 10 số có số 0 đầu",
      "Thời gian thực thi hoàn thành dưới 3 giây"
    ]
  }
);
