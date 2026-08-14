COURSE_DATA.push(
{
  id: "bt8",
  index: 8,
  title: "Bài 8: Thiết Kế Giáo Án, Slide & Học Liệu AI Tích Hợp (Bài 1, 2, 3 HSK 1)",
  shortTitle: "Giáo Án & Slide AI Tích Hợp",
  subtitle: "Liên Kết NotebookLM & Gemini Pro Trong Sư Phạm Tiếng Trung",
  level: "Dành Cho Giáo Viên & Giảng Viên AI",
  time: "30 phút",
  tags: ["NotebookLM RAG", "Gemini Pro Multimodal", "Sư Phạm Tiếng Trung", "Slide Outline Generator", "Imagen 3 Visuals", "Audio Podcast Overview", "Interactive Quiz"],
  desc: "Quy trình thực hành kết hợp sức mạnh khóa dữ liệu chuẩn xác của NotebookLM với khả năng thiết kế sư phạm đỉnh cao của Gemini Pro để tự động hóa biên soạn giáo án chuẩn SPARK, dựng kịch bản slide giảng dạy tương tác, sinh bài trắc nghiệm tự động (Quiz), tạo file nghe audio dạng Podcast và vẽ ảnh học liệu trực quan.",
  csvFile: "bai_tap_8_du_lieu_tu_vung_hsk1.xlsx",
  scriptFile: "BaiTap8_Prompts_Va_KichBan.txt",
  scriptContent: `================================================================================
BÀI TẬP 8: BỘ SIÊU PROMPTS (MEGA PROMPTS) THIẾT KẾ GIÁO ÁN, SLIDE, QUIZ & AUDIO PODCAST
================================================================================

Dưới đây là các câu Master Prompt được thiết kế cực kỳ chi tiết, chia rõ Vai trò (Role), Bối cảnh (Context), Nhiệm vụ (Task), Ràng buộc (Constraints) và Định dạng đầu ra (Output Format) để mang lại kết quả chất lượng cao nhất cho buổi học thực hành.

--------------------------------------------------------------------------------
1️⃣ PROMPT 1: TRÍCH XUẤT KIẾN THỨC NGUỒN CHUẨN XÁC (DÙNG TRÊN NOTEBOOKLM)
--------------------------------------------------------------------------------
* Vai trò: Chuyên gia Nghiên cứu Ngôn ngữ & Biên soạn Giáo trình HSK.
* Mục tiêu: Đọc chính xác nội dung từ 3 tệp nguồn PDF bài 1, 2, 3 để tạo tài liệu gốc chuẩn hóa, ngăn ngừa lỗi sai Pinyin và chữ Hán.
* Câu lệnh (Prompt):

"Bạn đóng vai trò là một Chuyên gia Nghiên cứu Ngôn ngữ và Sư phạm Tiếng Trung (HSK Pedagogical Expert). Nhiệm vụ của bạn là phân tích sâu sắc 3 tệp tài liệu PDF bài 1, 2, 3 HSK 1 được cung cấp làm nguồn tri thức duy nhất. Hãy biên soạn một tài liệu tổng hợp kiến thức gốc chuẩn xác 100% không sai lệch chữ viết hay thanh điệu theo cấu trúc sau:

1. BẢNG TỔNG HỢP TỪ VỰNG TÍCH HỢP:
Trình bày dưới dạng bảng Markdown gồm các cột:
- Chữ Hán (Giản thể)
- Phiên âm Pinyin (Phải viết chuẩn dấu thanh điệu, ví dụ: nǐ, hǎo, xǐhuan, méi guānxi)
- Từ loại (Danh từ, Động từ, Đại từ, v.v.)
- Nghĩa tiếng Việt (Chuẩn xác theo ngữ cảnh bài học)
- Câu ví dụ áp dụng song ngữ (Một câu tiếng Trung đơn giản kèm Pinyin và dịch nghĩa tiếng Việt phù hợp với trình độ HSK 1).

2. TỔNG HỢP QUY TẮC NGỮ ÂM & PHÁT ÂM BẮT BUỘC:
- Giải thích quy tắc biến điệu hai thanh 3 đứng cạnh nhau (ví dụ: nǐ + hǎo -> ní hǎo).
- Giải thích quy tắc phát âm thanh nhẹ (Neutral tone) và cách đọc (ví dụ: māma, yéye, bàba).
- Giải thích quy tắc biến điệu của chữ '不' (bù) khi đi với thanh 4 (biến thành 'bú') và khi đi với thanh 1, 2, 3 (giữ nguyên 'bù').
- Giải thích quy tắc viết vận mẫu bắt đầu bằng 'ü' khi kết hợp với j, q, x (bỏ hai dấu chấm trên đầu thành ju, qu, xu) và khi kết hợp với l, n (giữ nguyên lǜ, nǚ).
- Mỗi quy tắc phải cho ít nhất 3 ví dụ thực tế lấy từ tài liệu nguồn.

3. HƯỚNG DẪN NGỮ PHÁP TRỌNG TÂM:
- Câu chữ '是' (shì): Cấu trúc khẳng định, phủ định (不是), ví dụ cụ thể.
- Đại từ nghi vấn '...什么' (shénme): Vị trí trong câu, cách dùng để hỏi tên/vật thể.
- Trợ từ nghi vấn '吗' (ma): Cách chuyển đổi câu trần thuật thành câu hỏi Có/Không.

YÊU CẦU NGHIÊM NGẶT:
- Tuyệt đối chỉ trích xuất thông tin xuất hiện trong 3 file PDF nguồn bài 1, 2, 3. Không tự ý thêm từ vựng ngoài phạm vi bài học (trừ khi đặt câu ví dụ nhưng phải ghi chú rõ)."

--------------------------------------------------------------------------------
2️⃣ PROMPT 2: SOẠN GIÁO ÁN TƯƠNG TÁC CHUẨN SPARK (DÙNG TRÊN GEMINI PRO)
--------------------------------------------------------------------------------
* Vai trò: Giảng viên Sư phạm cao cấp, chuyên gia thiết kế phương pháp giảng dạy tích cực.
* Mục tiêu: Chuyển đổi dữ liệu kiến thức thô thành một giáo án bài giảng 90 phút đầy sinh động, tập trung vào học viên.
* Câu lệnh (Prompt):

"Bạn đóng vai trò là một Giảng viên Sư phạm Tiếng Trung cấp cao và là chuyên gia thiết kế bài giảng theo phương pháp tương tác chủ động. Hãy dựa trên dữ liệu kiến thức bài 1, 2, 3 HSK 1 đã được chuẩn hóa để soạn một giáo án chi tiết dài 90 phút với chủ đề 'Những Bước Chào Hỏi Đầu Tiên Với Tiếng Trung' theo cấu trúc SPARK.

Giáo án phải được chia chi tiết theo 5 giai đoạn như sau:

1. S - SPARK (Khởi động/Kích thích - 10 phút):
- Thiết kế một trò chơi nhỏ hoặc hoạt động khởi động vui vẻ (ví dụ: xem hình đoán bối cảnh hoặc nghe nhạc đoán cảm xúc) để thu hút học sinh ngay từ giây đầu tiên.
- Nêu rõ mục tiêu hoạt động, cách tổ chức và lời thoại dẫn dắt của giáo viên (song ngữ Trung - Việt).

2. P - PARTICIPATE (Học viên tham gia - 20 phút):
- Hướng dẫn học sinh chủ động khám phá từ vựng mới và Pinyin thông qua các hoạt động tương tác (như ghép thẻ từ, nghe và bắt chước). Tránh việc giáo viên đọc học sinh chép.
- Nêu rõ nhiệm vụ của học sinh và cách giáo viên hỗ trợ sửa phát âm lỗi.

3. A - ANALYZE (Phân tích sâu - 25 phút):
- Giáo viên đóng vai trò định hướng giúp học sinh tự rút ra quy luật ngữ pháp và ngữ âm (Câu chữ 是, câu hỏi với 吗, biến điệu thanh điệu của 3rd tone và chữ '不').
- Thiết kế các bảng so sánh Đúng/Sai trực quan để học sinh phân tích lỗi sai phổ biến (ví dụ: sai vị trí của '吗', hay quên biến điệu '你好').

4. R - REINFORCE (Củng cố thực hành - 25 phút):
- Thiết kế hoạt động thực hành nhập vai (Role-play) theo cặp hoặc theo nhóm nhỏ. Học sinh đóng vai gặp gỡ nhau tại sân bay hoặc quán cà phê, thực hiện chào hỏi, hỏi tên, quốc tịch, nghề nghiệp và nói lời cảm ơn/tạm biệt.
- Cung cấp kịch bản đóng vai mẫu (Pinyin + Hán tự + Dịch nghĩa).

5. K - KICKER (Kết thúc/Nghiệm thu - 10 phút):
- Thiết kế một bài kiểm tra nhanh 5 câu (Quick Quiz) để nghiệm thu kiến thức ngay tại lớp.
- Giao bài tập về nhà sáng tạo (ví dụ: tự quay video 1 phút giới thiệu bản thân bằng tiếng Trung gửi cho giáo viên).

YÊU CẦU ĐẦU RA: Trình bày giáo án rõ ràng, có phân bổ thời gian chi tiết từng phút, chỉ rõ hoạt động của Giáo viên và Học sinh, viết kèm lời thoại mẫu bằng tiếng Trung kèm phiên âm Pinyin để giáo viên dễ sử dụng giảng dạy."

--------------------------------------------------------------------------------
3️⃣ PROMPT 3: THIẾT KẾ KỊCH BẢN SLIDE GIẢNG DẠY ĐỒNG BỘ (DÙNG TRÊN GEMINI PRO)
--------------------------------------------------------------------------------
* Vai trò: Nhà thiết kế nội dung học tập (Instructional Designer) chuyên nghiệp.
* Mục tiêu: Dựng chi tiết từng trang Slide bài giảng có cấu trúc đẹp mắt, chỉ rõ cả phần chữ, bố cục và prompt sinh ảnh minh họa.
* Câu lệnh (Prompt):

"Bạn là một Instructional Designer chuyên nghiệp. Hãy chuyển đổi giáo án SPARK 'Những Bước Chào Hỏi Đầu Tiên Với Tiếng Trung' ở trên thành một kịch bản Slide bài giảng chi tiết gồm tối thiểu 10 slide để chuẩn bị giảng dạy.

Với mỗi trang slide, bạn hãy trình bày chính xác theo cấu trúc thiết kế sau đây:

- TRANG SLIDE SỐ: [Ví dụ: Slide 1, Slide 2...]
- TIÊU ĐỀ SLIDE (Slide Title): [Ngắn gọn, cuốn hút học viên]
- NỘI DUNG HIỂN THỊ CHÍNH (On-screen Text):
  + Viết rõ ràng chữ Hán giản thể cỡ lớn.
  + Kèm phiên âm Pinyin có dấu thanh điệu ngay bên dưới chữ Hán.
  + Dịch nghĩa tiếng Việt tương ứng.
  + Trình bày dạng các thẻ (cards) hoặc bullet points ngắn gọn, dễ nhìn.
- GỢI Ý BỐ CỤC & TÔNG MÀU (Visual Layout & Colors):
  + Mô tả chi tiết cách sắp xếp slide (Ví dụ: Chia đôi slide. Cột trái chiếm 40% diện tích dùng để chèn hình ảnh bối cảnh giao tiếp. Cột phải chiếm 60% diện tích hiển thị 3 câu hội thoại mẫu. Tông màu nền sử dụng xanh mint pastel dịu mắt để tạo sự tập trung).
- LỜI GIẢNG CỦA GIÁO VIÊN (Teacher's Script):
  + Viết lời thoại gợi ý bằng tiếng Việt tự nhiên để giáo viên nói khi trình chiếu slide này.
- PROMPT SINH ẢNH MINH HỌA (AI Image Prompt):
  + Viết một đoạn mô tả chi tiết bằng tiếng Anh (dài khoảng 50-70 từ) để đưa vào AI sinh ảnh (như Gemini/Imagen 3/Midjourney) vẽ ảnh minh họa cho slide này. Mô tả rõ phong cách 3D Pixar, nhân vật, hành động, bối cảnh, ánh sáng ấm áp, biểu cảm thân thiện, không chứa chữ lỗi (no text, no typos)."

--------------------------------------------------------------------------------
4️⃣ PROMPT 4: TẠO BÀI TRẮC NGHIỆM TƯƠNG TÁC - QUIZ GENERATOR (NOTEBOOKLM / GEMINI)
--------------------------------------------------------------------------------
* Vai trò: Chuyên gia Khảo thí và Đánh giá Giáo dục Ngôn ngữ.
* Mục tiêu: Soạn bộ câu hỏi trắc nghiệm kiểm tra độ hiểu bài của học sinh về từ vựng, ngữ pháp của cả 3 bài.
* Câu lệnh (Prompt):

"Bạn đóng vai trò là một Chuyên gia Khảo thí Tiếng Trung HSK. Hãy dựa vào tài liệu từ vựng và ngữ pháp của bài 1, 2, 3 HSK 1 để thiết kế một bộ đề kiểm tra trắc nghiệm tương tác gồm 10 câu hỏi theo các dạng sau:
- 4 câu chọn từ điền vào chỗ trống (选词填空) kiểm tra từ vựng (chào hỏi, cảm ơn, hỏi tên).
- 3 câu trắc nghiệm ngữ âm (phát hiện lỗi sai biến điệu thanh điệu hoặc phiên âm Pinyin).
- 3 câu trắc nghiệm đọc hiểu (đọc đoạn hội thoại ngắn 2 câu và chọn câu trả lời đúng).

QUY TẮC HIỂN THỊ BẮT BUỘC:
1. Mọi câu hỏi, đoạn hội thoại và 4 lựa chọn (A, B, C, D) ĐỀU PHẢI HIỂN THỊ ĐẦY ĐỦ CẢ CHỮ HÁN VÀ PINYIN.
   - Ví dụ chuẩn: A. 不是 (Bú shì)  | B. 吗 (Ma)  | C. 是 (Shì)  | D. 你好 (Nǐ hǎo)
2. Pinyin bắt buộc dùng ký tự Unicode chuẩn có dấu (Ví dụ: Nǐ hǎo, Shénme). Tuyệt đối KHÔNG dùng mã LaTeX (như \\check, \\imath,...).

Định dạng hiển thị từng câu hỏi:
- Câu hỏi số: ...
- Nội dung câu hỏi (Chữ Hán + Pinyin + Dịch tiếng Việt bối cảnh nếu cần)
- A. [Chữ Hán] ([Pinyin])  | B. [Chữ Hán] ([Pinyin])  | C. [Chữ Hán] ([Pinyin])  | D. [Chữ Hán] ([Pinyin])
- Đáp án đúng: ...
- Giải thích chi tiết về mặt chuyên môn sư phạm tại sao đáp án đó đúng và các đáp án khác sai."

--------------------------------------------------------------------------------
5️⃣ PROMPT 5: TẠO HỘI THOẠI BÀI NGHE AUDIO PODCAST (DÙNG TRÊN NOTEBOOKLM)
--------------------------------------------------------------------------------
* Vai trò: Nhà sản xuất Podcast Học thuật (Educational Podcast Producer).
* Mục tiêu: Thiết lập hướng thảo luận cho hai MC ảo trong tính năng Audio Overview của NotebookLM để tạo bài nghe thảo luận sinh động.
* Hướng dẫn tùy chỉnh (Customize Audio Overview):

"Customize the audio overview to be an engaging educational discussion about HSK 1 Lessons 1 to 3. The two hosts should friendly introduce Chinese basic greetings (nǐ hǎo, nín hǎo), ways to express gratitude (xièxie, bú kèqi), and how to ask for names (nǐ jiào shénme míngzi). They must speak clearly and spell out the Chinese pronunciations (Pinyin) slowly for beginners. Make the tone warm, conversational, and highly encouraging for foreign students learning Chinese for the first time."

--------------------------------------------------------------------------------
6️⃣ PROMPT 6: LẬP TRÌNH ỨNG DỤNG WEB FLASHCARD TRẮC NGHIỆM TƯƠNG TÁC (CÓ ẢNH MINH HỌA)
--------------------------------------------------------------------------------
* Vai trò: Chuyên gia Khảo thí Tiếng Trung HSK kiêm Lập trình viên Front-end (HTML/CSS/JS).
* Mục tiêu: Tạo một Ứng dụng Web Flashcard trắc nghiệm tương tác trực quan dưới dạng đơn file HTML để học sinh tự làm bài tập ôn luyện.
* Câu lệnh (Prompt):

"Bạn đóng vai trò là một Chuyên gia Khảo thí Tiếng Trung HSK kiêm Lập trình viên Front-end (HTML/CSS/JS). Dựa vào tài liệu từ vựng và ngữ pháp Bài 1, 2, 3 HSK 1, hãy tạo một Ứng dụng Web Flashcard Trắc nghiệm Tương tác trực quan dưới dạng ĐƠN FILE HTML (chứa sẵn CSS và JavaScript) với 10 câu hỏi gồm các dạng:
- 4 câu chọn từ điền vào chỗ trống (选词填空) kiểm tra từ vựng (chào hỏi, cảm ơn, hỏi tên).
- 3 câu trắc nghiệm ngữ âm (phát hiện lỗi sai biến điệu thanh điệu hoặc Pinyin).
- 3 câu trắc nghiệm đọc hiểu đoạn hội thoại ngắn 2 câu.

YÊU CẦU THIẾT KẾ & GIAO DIỆN (CANVAS) CÓ HÌNH ẢNH MINH HỌA:
1. Khung hiển thị thẻ (Flashcard Container):
   - Phía trên câu hỏi của mỗi thẻ, bắt buộc phải có một khung hình ảnh minh họa bối cảnh giao tiếp tương ứng (kích thước lớn, hiển thị đẹp mắt).
   - Trong mã nguồn JavaScript, hãy định nghĩa mảng đối tượng câu hỏi (questions) có trường 'image' chứa link ảnh để tôi có thể tự điền đường dẫn ảnh AI đã sinh ở các bước trước (ví dụ: ảnh chào hỏi, ảnh cảm ơn) hoặc dùng tạm link ảnh placeholder từ Unsplash bám sát nội dung (ví dụ: https://images.unsplash.com/photo-1544717305-2782549b5136 hoặc các link tương đương).
2. Dạng Flashcard Tương tác: Người dùng click chọn đáp án (A, B, C, D) -> Thẻ câu hỏi sẽ chuyển màu (Xanh lá nếu đúng, Đỏ nếu sai) và hiện ngay một vùng hiển thị 'Giải thích sư phạm chi tiết'.
3. Chức năng điều hướng: Nút 'Câu tiếp theo', 'Câu trước', thanh tiến trình sinh động (Progress Bar), và bảng tổng kết điểm hiển thị huy hiệu (badge) kèm xếp loại học lực khi làm xong 10 câu.
4. Phong cách thiết kế: Layout hiện đại (gần giống Canva/Duolingo), sử dụng phông chữ Sans-serif rõ ràng cho tiếng Trung và Pinyin, màu sắc pastel dịu nhẹ (Mint green hoặc Soft blue).

QUY TẮC PHIÊN ÂM & CHỮ HÁN (BẮT BUỘC):
- Tất cả câu hỏi, tùy chọn A B C D đều phải hiển thị đầy đủ CẢ CHỮ HÁN VÀ PINYIN.
- Pinyin bắt buộc dùng ký tự Unicode chuẩn có dấu (Ví dụ: Nǐ hǎo, Shénme, Xièxie).
- TUYỆT ĐỐI KHÔNG dùng mã LaTeX (như \\check, \\imath, \\hat...) để viết dấu thanh điệu."`,

  workflow: [
    { icon: "ph-books", title: "1. Khóa Dữ Liệu Nguồn Tại NotebookLM", desc: "Tải 3 file PDF giáo trình HSK 1 lên NotebookLM để làm nguồn đối chiếu dữ liệu chuẩn xác." },
    { icon: "ph-note-blank", title: "2. Trích Xuất Học Liệu Chuẩn Hóa", desc: "Sử dụng Prompt 1 để kết xuất bảng từ vựng, ngữ pháp không sai lệch Pinyin vào Note ghim." },
    { icon: "ph-presentation", title: "3. Dựng Giáo Án & Slide Tương Tác", desc: "Dùng Prompt 2 & 3 trên Gemini Pro để thiết kế giáo án SPARK 90 phút và kịch bản Slide chi tiết." },
    { icon: "ph-question", title: "4. Biên Soạn Bài Tập Trắc Nghiệm (Quiz)", desc: "Dùng Prompt 4 để tự động thiết kế bộ câu hỏi trắc nghiệm Đọc hiểu - Ngữ pháp tương tác." },
    { icon: "ph-headset", title: "5. Xuất Audio Bài Nghe Dạng Podcast", desc: "Sử dụng Audio Overview của NotebookLM để tạo tệp Podcast thảo luận bài học sống động." },
    { icon: "ph-palette", title: "6. Sinh Ảnh Học Liệu Trực Quan", desc: "Dùng Prompt sinh ảnh tiếng Anh chèn vào AI vẽ ảnh của Gemini để nhận ảnh giao tiếp 3D Pixar." },
    { icon: "ph-code", title: "7. Thiết Kế Web Flashcard Tương Tác", desc: "Dùng Prompt 6 trên Gemini Pro để tạo ra đơn file HTML ứng dụng Web Flashcard học tập trực quan có chèn ảnh AI." }
  ],

  businessScenario: {
    story: "Bạn là giáo viên tiếng Trung chuẩn bị dạy bài Chào hỏi, Cảm ơn và Hỏi tên cho học viên mới bắt đầu. Việc tìm kiếm hình ảnh minh họa bối cảnh giao tiếp tự nhiên và thiết kế slide giảng dạy bài bản cực kỳ mất thời gian. Các công cụ tạo slide AI thông thường rất hay viết sai Pinyin, dịch sai nghĩa hoặc tạo ra các hình ảnh không đồng bộ, xa lạ với văn hóa Trung Quốc.",
    pain: "Tốn 4-5 tiếng mỗi buổi để thiết kế slide thủ công và tìm ảnh chất lượng cao trên Google. Nguy cơ tài liệu bị lỗi chính tả Pinyin nghiêm trọng do AI tự do bị ảo tưởng kiến thức. Bài giảng thiếu tính tương tác, chủ yếu là đọc chép một chiều khiến học viên nhàm chán.",
    solution: "Ứng dụng giải pháp liên kết: Dùng NotebookLM làm 'vòng khóa bảo mật' giúp giữ nguyên kiến thức gốc từ 3 file PDF giáo trình. Sau đó, dùng Gemini Pro để thiết kế giáo án SPARK tăng tương tác, phân rã kịch bản Slide đồng bộ, tạo Quiz tương tác nhanh, xuất Podcast bài nghe tự động và vẽ ảnh minh họa giao tiếp 3D Pixar trực quan."
  },

  promptBreakdown: [
    { tag: "1. PHÂN VAI CHUYÊN GIA", title: "Role Specification", desc: "Định hình AI là chuyên gia sư phạm tiếng Trung và nhà thiết kế nội dung học tập để có đầu ra chuẩn mực sư phạm." },
    { tag: "2. KIỂM SOÁT TÀI LIỆU GỐC", title: "RAG Constraints", desc: "Yêu cầu AI chỉ lấy từ vựng và ngữ pháp có trong 3 file PDF nguồn bài 1, 2, 3 đã tải lên NotebookLM để tránh lỗi sai phiên âm." },
    { tag: "3. TIÊU CHUẨN SPARK", title: "Active Learning Framework", desc: "Áp dụng cấu trúc giáo án 5 bước SPARK tập trung vào các hoạt động thực hành đóng vai và tương tác của học sinh." },
    { tag: "4. PHỐI HỢP ĐA PHƯƠNG TIỆN", title: "Visual & Audio Cohesion", desc: "Tích hợp cả Slide trình chiếu, bộ câu hỏi trắc nghiệm kiểm tra nhanh (Quiz), Audio bài nghe dạng Podcast đối thoại sinh động và ảnh vẽ minh họa." }
  ],

  businessRequirements: `
    <div class="business-req-box">
      <h4>🎯 Yêu cầu thực hành giảng dạy cốt lõi:</h4>
      <ul>
        <li><b>Bảo toàn kiến thức gốc:</b> Tải thành công 3 file PDF giáo trình lên NotebookLM, chạy Prompt 1 để tạo Note từ vựng và ngữ pháp chuẩn Pinyin.</li>
        <li><b>Soạn giáo án SPARK:</b> Thiết kế hoàn chỉnh giáo án 90 phút tương tác cao bằng Gemini Pro dựa trên nội dung Note đã lưu.</li>
        <li><b>Xây dựng kịch bản Slide:</b> Phân tách giáo án thành dàn ý Slide 10 trang chi tiết có chữ Hán lớn, Pinyin có dấu thanh điệu, bố cục rõ ràng và lời thoại của giáo viên.</li>
        <li><b>Biên soạn đề kiểm tra trắc nghiệm (Quiz):</b> Thiết kế bộ câu hỏi trắc nghiệm tự động 10 câu có đáp án giải thích để cho học sinh làm trên lớp.</li>
        <li><b>Sản xuất Audio Podcast bài nghe:</b> Sử dụng tính năng Audio Overview của NotebookLM để tạo cuộc hội thoại bài giảng bằng âm thanh sinh động.</li>
        <li><b>Sáng tạo học liệu trực quan bằng AI:</b> Sử dụng Prompt sinh ảnh tiếng Anh của Gemini Pro để vẽ ít nhất 2 tranh minh họa bối cảnh giao tiếp 3D Pixar sắc nét, đồng bộ màu sắc với slide.</li>
      </ul>
    </div>
  `,

  tableHeaders: ["Bài Học", "Chủ Đề", "Từ Vựng Trọng Tâm", "Quy Tắc Ngữ Âm & Ngữ Pháp", "Học Liệu Đi Kèm (Quiz & Audio Podcast)"],
  tableRows: [
    [
      "Bài 1 (bai1.pdf)",
      "你好 (Chào hỏi)",
      "你 (nǐ), 好 (hǎo), 您 (nín), 你们 (nǐmen), 对不起 (duìbuqǐ), 没关系 (méi guānxi)",
      "Biến điệu thanh 3 (3+3 -> 2+3), các nét viết chữ Hán cơ bản (Ngang, Dọc, Phẩy, Điểm, Mác)",
      "Câu hỏi phân biệt '你' và '您'. Audio Podcast giới thiệu nét văn hóa chào hỏi của người Trung Quốc."
    ],
    [
      "Bài 2 (bai2.pdf)",
      "谢谢你 (Cảm ơn)",
      "谢谢 (xièxie), 不 (bù), 不客气 (bú kèqi), 再见 (zàijiàn)",
      "Thanh nhẹ (Neutral tone), quy tắc đánh dấu thanh điệu Pinyin, biến điệu của chữ '不' (bù -> bú)",
      "Bài tập trắc nghiệm chọn đáp án phản hồi cho '谢谢你'. Audio Podcast phát âm chuẩn các thanh nhẹ."
    ],
    [
      "Bài 3 (bai3.pdf)",
      "你叫什么名字 (Hỏi tên)",
      "叫 (jiào), 什么 (shénme), 名字 (míngzi), 我 (wǒ), 是 (shì), 老师 (lǎoshī), 吗 (ma), 学生 (xuésheng), 人 (rén), 中国 (Zhōngguó), 美国 (Měiguó)",
      "Đại từ nghi vấn '...什么', câu chữ '...是' và phủ định, câu hỏi với trợ từ '吗', quy tắc bỏ hai chấm của ü khi đi với j, q, x",
      "Bài tập sắp xếp câu hỏi tên và quốc tịch. Audio Podcast đối thoại hỏi đáp tên giữa hai MC ảo."
    ]
  ],

  steps: [
    {
      badge: "01",
      title: "Thiết lập nguồn RAG trên NotebookLM để kiểm soát tri thức",
      desc: `
        <div class="step-meta">
          <span class="step-meta-label">🎯 Mục tiêu nghiệp vụ:</span>
          <span class="step-meta-value">Tải tài liệu dạy học chuẩn lên để làm kho tri thức RAG bảo mật, ngăn AI tự biên soạn từ vựng hoặc sai Pinyin.</span>
        </div>
        <p style="margin-top: 10px;"><b>Hướng dẫn thực hiện trực tiếp:</b></p>
        <ol>
          <li>Truy cập vào công cụ <a href="https://notebooklm.google/" target="_blank">Google NotebookLM</a>.</li>
          <li>Đăng nhập bằng tài khoản Google của bạn, chọn <b>"New Notebook"</b> (Sổ ghi chú mới).</li>
          <li>Đặt tên cho sổ ghi chú là: <code>Sư phạm tiếng Trung HSK 1 - Bài 1 đến Bài 3</code>.</li>
          <li>Nhấp vào nút tải tài liệu lên và tải lên 3 file PDF giáo trình mẫu có sẵn trong máy của bạn: <code>bai1.pdf</code>, <code>bai2.pdf</code> và <code>bai3.pdf</code>.</li>
        </ol>
      `
    },
    {
      badge: "02",
      title: "Trích xuất học liệu chuẩn hóa bằng Prompt RAG",
      desc: `
        <div class="step-meta">
          <span class="step-meta-label">🎯 Mục tiêu nghiệp vụ:</span>
          <span class="step-meta-value">Tạo cơ sở dữ liệu học liệu (từ vựng, ngữ pháp, ngữ âm) chuẩn xác 100% làm Note ghim trong Notebook.</span>
        </div>
        <p style="margin-top: 10px;"><b>Hướng dẫn thực hiện trực tiếp:</b></p>
        <ol>
          <li>Chọn xem cả 3 file PDF nguồn bài 1, 2, 3 vừa nạp ở Bước 1.</li>
          <li>Nhấp vào nút <b>"Sao chép"</b> ở khung câu lệnh bên dưới để lấy câu Master Prompt 1.</li>
          <li>Dán câu lệnh này vào khung chat của NotebookLM và gửi đi.</li>
          <li>Kiểm tra bảng từ vựng và ngữ pháp do AI trả về. Bấm chọn nút <b>"Ghim vào ghi chú" (Pin to Note)</b> để lưu trữ văn bản này làm dữ liệu nền.</li>
        </ol>
      `,
      promptBox: `Bạn đóng vai trò là một Chuyên gia Nghiên cứu Ngôn ngữ và Sư phạm Tiếng Trung (HSK Pedagogical Expert). Nhiệm vụ của bạn là phân tích sâu sắc 3 tệp tài liệu PDF bài 1, 2, 3 HSK 1 được cung cấp làm nguồn tri thức duy nhất. Hãy biên soạn một tài liệu tổng hợp kiến thức gốc chuẩn xác 100% không sai lệch chữ viết hay thanh điệu theo cấu trúc sau:

1. BẢNG TỔNG HỢP TỪ VỰNG TÍCH HỢP:
Trình bày dưới dạng bảng Markdown gồm các cột:
- Chữ Hán (Giản thể)
- Phiên âm Pinyin (Phải viết chuẩn dấu thanh điệu, ví dụ: nǐ, hǎo, xǐhuan, méi guānxi)
- Từ loại (Danh từ, Động từ, Đại từ, v.v.)
- Nghĩa tiếng Việt (Chuẩn xác theo ngữ cảnh bài học)
- Câu ví dụ áp dụng song ngữ (Một câu tiếng Trung đơn giản kèm Pinyin và dịch nghĩa tiếng Việt phù hợp với trình độ HSK 1).

2. TỔNG HỢP QUY TẮC NGỮ ÂM & PHÁT ÂM BẮT BUỘC:
- Giải thích quy tắc biến điệu hai thanh 3 đứng cạnh nhau (ví dụ: nǐ + hǎo -> ní hǎo).
- Giải thích quy tắc phát âm thanh nhẹ (Neutral tone) và cách đọc (ví dụ: māma, yéye, bàba).
- Giải thích quy tắc biến điệu của chữ '不' (bù) khi đi với thanh 4 (biến thành 'bú') và khi đi với thanh 1, 2, 3 (giữ nguyên 'bù').
- Giải thích quy tắc viết vận mẫu bắt đầu bằng 'ü' khi kết hợp với j, q, x (bỏ hai dấu chấm trên đầu thành ju, qu, xu) và khi kết hợp với l, n (giữ nguyên lǜ, nǚ).
- Mỗi quy tắc phải cho ít nhất 3 ví dụ thực tế lấy từ tài liệu nguồn.

3. HƯỚNG DẪN NGỮ PHÁP TRỌNG TÂM:
- Câu chữ '是' (shì): Cấu trúc khẳng định, phủ định (不是), ví dụ cụ thể.
- Đại từ nghi vấn '什么' (shénme): Vị trí trong câu, cách dùng để hỏi tên/vật thể.
- Trợ từ nghi vấn 'ma' (ma): Cách chuyển đổi câu trần thuật thành câu hỏi Có/Không.

YÊU CẦU NGHIÊM NGẶT:
- Tuyệt đối chỉ trích xuất thông tin xuất hiện trong 3 file PDF nguồn bài 1, 2, 3. Không tự ý thêm từ vựng ngoài phạm vi bài học (trừ khi đặt câu ví dụ nhưng phải ghi chú rõ).`
    },
    {
      badge: "03",
      title: "Dựng Giáo án tương tác 90 phút theo mô hình SPARK trên Gemini Pro",
      desc: `
        <div class="step-meta">
          <span class="step-meta-label">🎯 Mục tiêu nghiệp vụ:</span>
          <span class="step-meta-value">Tạo giáo án giảng dạy 90 phút tương tác năng động giúp học viên tự tin chào hỏi, hỏi tên, giới thiệu bản thân.</span>
        </div>
        <p style="margin-top: 10px;"><b>Hướng dẫn thực hiện trực tiếp:</b></p>
        <ol>
          <li>Mở một tab trình duyệt mới, truy cập vào công cụ <a href="https://gemini.google/" target="_blank">Google Gemini</a>.</li>
          <li>Quay lại ghi chú đã lưu ở Bước 2 trên NotebookLM, sao chép toàn bộ văn bản từ vựng ngữ pháp chuẩn đã trích xuất.</li>
          <li>Bấm nút <b>"Sao chép"</b> ở khung câu lệnh bên dưới để lấy Master Prompt 2.</li>
          <li>Dán nội dung học liệu kèm câu Master Prompt 2 vào khung chat của Gemini Pro và gửi đi. AI sẽ tự động phân bổ 5 giai đoạn SPARK kèm lời thoại giảng dạy mẫu.</li>
        </ol>
      `,
      promptBox: `Bạn đóng vai trò là một Giảng viên Sư phạm Tiếng Trung cấp cao và là chuyên gia thiết kế bài giảng theo phương pháp tương tác chủ động. Hãy dựa trên dữ liệu kiến thức bài 1, 2, 3 HSK 1 đã được chuẩn hóa để soạn một giáo án chi tiết dài 90 phút với chủ đề 'Những Bước Chào Hỏi Đầu Tiên Với Tiếng Trung' theo cấu trúc SPARK.

Giáo án phải được chia chi tiết theo 5 giai đoạn như sau:

1. S - SPARK (Khởi động/Kích thích - 10 phút):
- Thiết kế một trò chơi nhỏ hoặc hoạt động khởi động vui vẻ (ví dụ: xem hình đoán bối cảnh hoặc nghe nhạc đoán cảm xúc) để thu hút học sinh ngay từ giây đầu tiên.
- Nêu rõ mục tiêu hoạt động, cách tổ chức và lời thoại dẫn dắt của giáo viên (song ngữ Trung - Việt).

2. P - PARTICIPATE (Học viên tham gia - 20 phút):
- Hướng dẫn học sinh chủ động khám phá từ vựng mới và Pinyin thông qua các hoạt động tương tác (như ghép thẻ từ, nghe và bắt chước). Tránh việc giáo viên đọc học sinh chép.
- Nêu rõ nhiệm vụ của học sinh và cách giáo viên hỗ trợ sửa phát âm lỗi.

3. A - ANALYZE (Phân tích sâu - 25 phút):
- Giáo viên đóng vai trò định hướng giúp học sinh tự rút ra quy luật ngữ pháp và ngữ âm (Câu chữ 是, câu hỏi với 吗, biến điệu thanh điệu của 3rd tone và chữ '不').
- Thiết kế các bảng so sánh Đúng/Sai trực quan để học sinh phân tích lỗi sai phổ biến (ví dụ: sai vị trí của '吗', hay quên biến điệu '你好').

4. R - REINFORCE (Củng cố thực hành - 25 phút):
- Thiết kế hoạt động thực hành nhập vai (Role-play) theo cặp hoặc theo nhóm nhỏ. Học sinh đóng vai gặp gỡ nhau tại sân bay hoặc quán cà phê, thực hiện chào hỏi, hỏi tên, quốc tịch, nghề nghiệp và nói lời cảm ơn/tạm biệt.
- Cung cấp kịch bản đóng vai mẫu (Pinyin + Hán tự + Dịch nghĩa).

5. K - KICKER (Kết thúc/Nghiệm thu - 10 phút):
- Thiết kế một bài kiểm tra nhanh 5 câu (Quick Quiz) để nghiệm thu kiến thức ngay tại lớp.
- Giao bài tập về nhà sáng tạo (ví dụ: tự quay video 1 phút giới thiệu bản thân bằng tiếng Trung gửi cho giáo viên).

YÊU CẦU ĐẦU RA: Trình bày giáo án rõ ràng, có phân bổ thời gian chi tiết từng phút, chỉ rõ hoạt động của Giáo viên và Học sinh, viết kèm lời thoại mẫu bằng tiếng Trung kèm phiên âm Pinyin để giáo viên dễ sử dụng giảng dạy.`
    },
    {
      badge: "04",
      title: "Thiết kế kịch bản Slide bài giảng đồng bộ và xuất AI Image Prompts",
      desc: `
        <div class="step-meta">
          <span class="step-meta-label">🎯 Mục tiêu nghiệp vụ:</span>
          <span class="step-meta-value">Chuyển đổi giáo án thành dàn ý Slide 10 trang chi tiết gồm text, gợi ý bố cục trực quan và prompt vẽ ảnh bằng tiếng Anh.</span>
        </div>
        <p style="margin-top: 10px;"><b>Hướng dẫn thực hiện trực tiếp:</b></p>
        <ol>
          <li>Tại cửa sổ chat Gemini Pro (nơi vừa tạo xong giáo án ở Bước 3), bấm nút <b>"Sao chép"</b> ở khung câu lệnh bên dưới để lấy Master Prompt 3.</li>
          <li>Dán câu lệnh này vào khung chat Gemini Pro và nhấn gửi đi.</li>
          <li>AI sẽ tự động sinh ra kịch bản chi tiết cho từng trang slide (từ slide 1 đến slide 10) bao gồm cả các câu lệnh bằng tiếng Anh mô tả bối cảnh hình ảnh để chèn vào slide.</li>
        </ol>
      `,
      promptBox: `Bạn là một Instructional Designer chuyên nghiệp. Hãy chuyển đổi giáo án SPARK 'Những Bước Chào Hỏi Đầu Tiên Với Tiếng Trung' ở trên thành một kịch bản Slide bài giảng chi tiết gồm tối thiểu 10 slide để chuẩn bị giảng dạy.

Với mỗi trang slide, bạn hãy trình bày chính xác theo cấu trúc thiết kế sau đây:

- TRANG SLIDE SỐ: [Ví dụ: Slide 1, Slide 2...]
- TIÊU ĐỀ SLIDE (Slide Title): [Ngắn gọn, cuốn hút học viên]
- NỘI DUNG HIỂN THỊ CHÍNH (On-screen Text):
  + Viết rõ ràng chữ Hán giản thể cỡ lớn.
  + Kèm phiên âm Pinyin có dấu thanh điệu ngay bên dưới chữ Hán.
  + Dịch nghĩa tiếng Việt tương ứng.
  + Trình bày dạng các thẻ (cards) hoặc bullet points ngắn gọn, dễ nhìn.
- GỢI Ý BỐ CỤC & TÔNG MÀU (Visual Layout & Colors):
  + Mô tả chi tiết cách sắp xếp slide (Ví dụ: Chia đôi slide. Cột trái chiếm 40% diện tích dùng để chèn hình ảnh bối cảnh giao tiếp. Cột phải chiếm 60% diện tích hiển thị 3 câu hội thoại mẫu. Tông màu nền sử dụng xanh mint pastel dịu mắt để tạo sự tập trung).
- LỜI GIẢNG CỦA GIÁO VIÊN (Teacher's Script):
  + Viết lời thoại gợi ý bằng tiếng Việt tự nhiên để giáo viên nói khi trình chiếu slide này.
- PROMPT SINH ẢNH MINH HỌA (AI Image Prompt):
  + Viết một đoạn mô tả chi tiết bằng tiếng Anh (dài khoảng 50-70 từ) để đưa vào AI sinh ảnh (như Gemini/Imagen 3/Midjourney) vẽ ảnh minh họa cho slide này. Mô tả rõ phong cách 3D Pixar, nhân vật, hành động, bối cảnh, ánh sáng ấm áp, biểu cảm thân thiện, không chứa chữ lỗi (no text, no typos).`
    },
    {
      badge: "05",
      title: "Biên soạn đề kiểm tra trắc nghiệm (Quiz Generator) tự động",
      desc: `
        <div class="step-meta">
          <span class="step-meta-label">🎯 Mục tiêu nghiệp vụ:</span>
          <span class="step-meta-value">Tạo nhanh bộ câu hỏi trắc nghiệm ngữ âm, từ vựng và đọc hiểu 10 câu để đánh giá kết quả học tập của học sinh cuối giờ.</span>
        </div>
        <p style="margin-top: 10px;"><b>Hướng dẫn thực hiện trực tiếp:</b></p>
        <ol>
          <li>Tại khung chat của NotebookLM hoặc Gemini Pro, bấm nút <b>"Sao chép"</b> ở khung câu lệnh bên dưới để lấy Master Prompt 4.</li>
          <li>Dán câu lệnh này vào và nhấn gửi đi.</li>
          <li>AI sẽ lập tức tạo ra 10 câu hỏi trắc nghiệm trích xuất từ nội dung 3 bài học kèm theo đáp án và lời giải thích ngữ pháp cụ thể.</li>
          <li>Giáo viên lưu bộ câu hỏi này ra file để in hoặc dán trực tiếp lên slide/Quizizz/Kahoot cho học sinh thực hành.</li>
        </ol>
      `,
      promptBox: `Bạn đóng vai trò là một Chuyên gia Khảo thí Tiếng Trung HSK. Hãy dựa vào tài liệu từ vựng và ngữ pháp của bài 1, 2, 3 HSK 1 để thiết kế một bộ đề kiểm tra trắc nghiệm tương tác gồm 10 câu hỏi theo các dạng sau:
- 4 câu chọn từ điền vào chỗ trống (选词填空) kiểm tra từ vựng (chào hỏi, cảm ơn, hỏi tên).
- 3 câu trắc nghiệm ngữ âm (phát hiện lỗi sai biến điệu thanh điệu hoặc phiên âm Pinyin).
- 3 câu trắc nghiệm đọc hiểu (đọc đoạn hội thoại ngắn 2 câu và chọn câu trả lời đúng).

QUY TẮC HIỂN THỊ BẮT BUỘC:
1. Mọi câu hỏi, đoạn hội thoại và 4 lựa chọn (A, B, C, D) ĐỀU PHẢI HIỂN THỊ ĐẦY ĐỦ CẢ CHỮ HÁN VÀ PINYIN.
   - Ví dụ chuẩn: A. 不是 (Bú shì)  | B. 吗 (Ma)  | C. 是 (Shì)  | D. 你好 (Nǐ hǎo)
2. Pinyin bắt buộc dùng ký tự Unicode chuẩn có dấu (Ví dụ: Nǐ hǎo, Shénme). Tuyệt đối KHÔNG dùng mã LaTeX (như \\check, \\imath,...).

Định dạng hiển thị từng câu hỏi:
- Câu hỏi số: ...
- Nội dung câu hỏi (Chữ Hán + Pinyin + Dịch tiếng Việt bối cảnh nếu cần)
- A. [Chữ Hán] ([Pinyin])  | B. [Chữ Hán] ([Pinyin])  | C. [Chữ Hán] ([Pinyin])  | D. [Chữ Hán] ([Pinyin])
- Đáp án đúng: ...
- Giải thích chi tiết về mặt chuyên môn sư phạm tại sao đáp án đó đúng và các đáp án khác sai.`
    },
    {
      badge: "06",
      title: "Sản xuất Audio bài nghe tự động bằng Audio Overview (Podcast)",
      desc: `
        <div class="step-meta">
          <span class="step-meta-label">🎯 Mục tiêu nghiệp vụ:</span>
          <span class="step-meta-value">Tạo file âm thanh bài nghe dạng Talkshow trò chuyện sinh động để học sinh luyện nghe phát âm và hiểu bài ở nhà.</span>
        </div>
        <p style="margin-top: 10px;"><b>Hướng dẫn thực hiện trực tiếp:</b></p>
        <ol>
          <li>Quay lại giao diện chính của <b>NotebookLM</b> (nơi chứa 3 file PDF nguồn).</li>
          <li>Ở cột bên phải, nhấp chọn nút <b>"Notebook guide"</b> (Hướng dẫn sổ ghi chú).</li>
          <li>Tại mục <b>"Audio Overview"</b> (Xem trước âm thanh), nhấp chọn <b>"Customize"</b> để cấu hình cuộc hội thoại. Bấm nút <b>"Sao chép"</b> bên dưới để lấy Prompt cấu hình bằng tiếng Anh. Dán vào ô Customization.</li>
          <li>Nhấp vào nút <b>"Generate"</b> để bắt đầu sinh Audio. Hệ thống sẽ mất khoảng 3 - 5 phút để tạo ra một đoạn hội thoại Podcast tiếng Anh thảo luận về bài học tiếng Trung cực kỳ cuốn hút giữa 2 MC (1 nam, 1 nữ).</li>
          <li>Tải file Audio này về (định dạng .wav) để chèn vào Slide bài giảng hoặc gửi trực tiếp cho học sinh nghe.</li>
        </ol>
      `,
      promptBox: `Customize the audio overview to be an engaging educational discussion about HSK 1 Lessons 1 to 3. The two hosts should friendly introduce Chinese basic greetings (nǐ hǎo, nín hǎo), ways to express gratitude (xièxie, bú kèqi), and how to ask for names (nǐ jiào shénme míngzi). They must speak clearly and spell out the Chinese pronunciations (Pinyin) slowly for beginners. Make the tone warm, conversational, and highly encouraging for foreign students learning Chinese for the first time.`
    },
    {
      badge: "07",
      title: "Sinh ảnh minh họa bối cảnh giao tiếp 3D Pixar bằng AI sinh ảnh và hoàn thiện Slide",
      desc: `
        <div class="step-meta">
          <span class="step-meta-label">🎯 Mục tiêu nghiệp vụ:</span>
          <span class="step-meta-value">Tạo tranh minh họa 3D bối cảnh lớp học tiếng Trung phong cách hoạt hình Pixar đẹp mắt chèn slide bài giảng.</span>
        </div>
        <p style="margin-top: 10px;"><b>Hướng dẫn thực hiện trực tiếp:</b></p>
        <ol>
          <li>Bấm nút <b>"Sao chép"</b> ở khung câu lệnh bên dưới để lấy Master Prompt vẽ ảnh (hoặc copy prompt tiếng Anh do Gemini sinh ra ở Bước 4).</li>
          <li>Dán câu lệnh này vào khung chat của Gemini Pro (nơi đã được tích hợp mô hình sinh ảnh chất lượng cao Imagen 3) và gửi đi.</li>
          <li>Đợi AI tạo ảnh, tải bức ảnh 3D Pixar ưng ý nhất về máy.</li>
          <li>Truy cập Canva hoặc PowerPoint, chèn nội dung văn bản (đã thiết kế ở Bước 4) và dán bức ảnh minh họa này vào slide để hoàn thành bài học.</li>
        </ol>
      `,
      promptBox: `Create a high-quality 3D digital illustration in a warm, charming Pixar animation style. The scene is set inside a bright and modern Chinese language classroom, with a wooden blackboard in the background displaying basic Chinese characters like '你好' and '谢谢' written in elegant chalk. In the foreground, a friendly, young female Chinese teacher with black hair tied up in a neat ponytail and wearing a professional light blue shirt is smiling warmly and welcoming a foreign male student of European descent. The student, a young man around 20 years old with blonde hair and a green t-shirt, is standing in front of the class, gesturing politely as he introduces himself. The atmosphere is highly educational, encouraging, and warm. Soft natural sunlight streams through a large side window. Vibrant colors, clean lines, high detail, masterpiece, no text, no letters, no spelling errors.`
    },
    {
      badge: "08",
      title: "Thiết kế Ứng dụng Web Flashcard Trắc nghiệm Tương tác (Có ảnh minh họa)",
      desc: `
        <div class="step-meta">
          <span class="step-meta-label">🎯 Mục tiêu nghiệp vụ:</span>
          <span class="step-meta-value">Tạo ra một công cụ học tập tự ôn luyện (Self-study Web App) trực quan dưới dạng flashcard có hình ảnh để học sinh tự làm bài tập ở nhà.</span>
        </div>
        <p style="margin-top: 10px;"><b>Hướng dẫn thực hiện trực tiếp:</b></p>
        <ol>
          <li>Bấm nút <b>"Sao chép"</b> ở khung câu lệnh bên dưới để lấy Master Prompt 6.</li>
          <li>Mở một cửa sổ chat mới trên Gemini Pro, dán câu lệnh này vào và nhấn gửi đi.</li>
          <li>AI sẽ tự động viết toàn bộ code HTML/CSS/JS (đơn file) chứa sẵn 10 câu hỏi HSK 1, khung chứa ảnh, chấm điểm tự động và giải thích chi tiết.</li>
          <li>Học viên lưu đoạn code này thành file có đuôi <code>flashcard.html</code> trên máy tính và mở bằng trình duyệt để bắt đầu học tập. Bạn có thể thay thế các URL hình ảnh trong code bằng đường dẫn ảnh AI đã tải về ở Bước 7 để bài học sinh động hơn.</li>
        </ol>
      `,
      promptBox: `Bạn đóng vai trò là một Chuyên gia Khảo thí Tiếng Trung HSK kiêm Lập trình viên Front-end (HTML/CSS/JS). Dựa vào tài liệu từ vựng và ngữ pháp Bài 1, 2, 3 HSK 1, hãy tạo một Ứng dụng Web Flashcard Trắc nghiệm Tương tác trực quan dưới dạng ĐƠN FILE HTML (chứa sẵn CSS và JavaScript) với 10 câu hỏi gồm các dạng:
- 4 câu chọn từ điền vào chỗ trống (选词填空) kiểm tra từ vựng (chào hỏi, cảm ơn, hỏi tên).
- 3 câu trắc nghiệm ngữ âm (phát hiện lỗi sai biến điệu thanh điệu hoặc Pinyin).
- 3 câu trắc nghiệm đọc hiểu đoạn hội thoại ngắn 2 câu.

YÊU CẦU THIẾT KẾ & GIAO DIỆN (CANVAS) CÓ HÌNH ẢNH MINH HỌA:
1. Khung hiển thị thẻ (Flashcard Container):
   - Phía trên câu hỏi của mỗi thẻ, bắt buộc phải có một khung hình ảnh minh họa bối cảnh giao tiếp tương ứng (kích thước lớn, hiển thị đẹp mắt).
   - Trong mã nguồn JavaScript, hãy định nghĩa mảng đối tượng câu hỏi (questions) có trường 'image' chứa link ảnh để tôi có thể tự điền đường dẫn ảnh AI đã sinh ở các bước trước (ví dụ: ảnh chào hỏi, ảnh cảm ơn) hoặc dùng tạm link ảnh placeholder từ Unsplash bám sát nội dung (ví dụ: https://images.unsplash.com/photo-1544717305-2782549b5136 hoặc các link tương đương).
2. Dạng Flashcard Tương tác: Người dùng click chọn đáp án (A, B, C, D) -> Thẻ câu hỏi sẽ chuyển màu (Xanh lá nếu đúng, Đỏ nếu sai) và hiện ngay một vùng hiển thị 'Giải thích sư phạm chi tiết'.
3. Chức năng điều hướng: Nút 'Câu tiếp theo', 'Câu trước', thanh tiến trình sinh động (Progress Bar), và bảng tổng kết điểm hiển thị huy hiệu (badge) kèm xếp loại học lực khi làm xong 10 câu.
4. Phong cách thiết kế: Layout hiện đại (gần giống Canva/Duolingo), sử dụng phông chữ Sans-serif rõ ràng cho tiếng Trung và Pinyin, màu sắc pastel dịu nhẹ (Mint green hoặc Soft blue).

QUY TẮC PHIÊN ÂM & CHỮ HÁN (BẮT BUỘC):
- Tất cả câu hỏi, tùy chọn A B C D đều phải hiển thị đầy đủ CẢ CHỮ HÁN VÀ PINYIN.
- Pinyin bắt buộc dùng ký tự Unicode chuẩn có dấu (Ví dụ: Nǐ hǎo, Shénme, Xièxie).
- TUYỆT ĐỐI KHÔNG dùng mã LaTeX (như \\check, \\imath, \\hat...) để viết dấu thanh điệu.`
    }
  ],

  triggerGuide: `
    <h3 class="section-title"><i class="ph-bold ph-lightbulb"></i> Mẹo Sư Phạm Dành Cho Giảng Viên</h3>
    <div style="color: var(--text-secondary); line-height: 1.7; font-size: 14px;">
      <p>Để truyền đạt buổi thực hành này hiệu quả nhất đến học viên, bạn nên lưu ý:</p>
      <ul>
        <li><b>Giải thích lý do phải chia làm 2 công cụ:</b> Nhấn mạnh rằng NotebookLM giúp bảo vệ kiến thức gốc (ngăn AI viết sai Pinyin), còn Gemini Pro giúp bay bổng sáng tạo slide và hình ảnh học liệu.</li>
        <li><b>Tối ưu hóa Prompts sinh ảnh:</b> Nhắc nhở học viên luôn để Prompt mô tả bối cảnh bằng tiếng Anh. AI vẽ ảnh hiểu tiếng Anh tốt hơn và sẽ tránh được các chi tiết dị dạng tốt hơn so với tiếng Việt.</li>
        <li><b>Hoạt động nghiệm thu chéo:</b> Sau khi học viên tạo xong slide và ảnh, cho các nhóm tự nhận xét xem phiên âm Pinyin và biến điệu ngữ âm trên slide có khớp hoàn toàn với kiến thức chuẩn trong tài liệu giáo trình hay chưa.</li>
      </ul>
    </div>
  `,

  checklist: [
    "Đã tạo Notebook mới và tải lên thành công 3 file PDF giáo trình HSK 1.",
    "Trích xuất thành công bảng từ vựng và quy tắc phát âm chuẩn xác không lỗi Pinyin vào Note ghim.",
    "Dựng được giáo án bài giảng tích hợp 90 phút chuẩn mô hình SPARK bằng Gemini Pro.",
    "Thiết kế được kịch bản Slide chi tiết 10 trang có đầy đủ Hán tự, Pinyin và nghĩa tiếng Việt.",
    "Biên soạn thành công đề kiểm tra trắc nghiệm 10 câu có đáp án giải thích chi tiết bằng AI.",
    "Sản xuất thành công file Audio nghe Podcast (Audio Overview) thảo luận bài học từ NotebookLM.",
    "Sinh được ít nhất 2 hình ảnh minh họa bối cảnh giao tiếp 3D phong cách Pixar sắc nét, tươi sáng bằng Gemini Pro.",
    "Ghép thành công kịch bản Slide, bài nghe audio và ảnh minh họa AI thành một slide bài giảng hoàn chỉnh (PowerPoint/Canva).",
    "Lập trình thành công đơn file HTML Web Flashcard tương tác có tích hợp hiển thị ảnh và làm bài trắc nghiệm."
  ]
}
);
