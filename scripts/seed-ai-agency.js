const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seedAiAgencyScenario() {
  console.log('--- BẮT ĐẦU CHẠY THỰC TẾ 9 NGÀY CHO TÀI KHOẢN striveraivn@gmail.com ---')
  const user = await prisma.user.findUnique({
    where: { email: 'striveraivn@gmail.com' }
  })

  if (!user) {
    throw new Error('Không tìm thấy tài khoản striveraivn@gmail.com!')
  }

  const userId = user.id

  // ==========================================
  // NGÀY 1: KHÁM SỨC KHỎE VẬN HÀNH (SỰ THẬT)
  // ==========================================
  console.log('-> Đang xử lý Ngày 1...')
  const day1Evidence = [
    'Founder mất 14 giờ cho mỗi khách hàng chỉ để tổng hợp ghi âm phỏng vấn, bóc tách bảng lương Excel và viết báo cáo chẩn đoán 30 trang.',
    'Chậm trễ ra quyết định chiến lược: Không đủ dữ liệu tổng hợp về các rào cản phổ biến của khách hàng vì ghi chép phân tán ở Notion, Google Docs và Zalo.',
    'Khách hàng phản hồi sau buổi phỏng vấn phải chờ 5-7 ngày mới nhận được báo cáo, gây giảm nhiệt và giảm tỷ lệ chốt gói Triển khai.',
    'Nhầm lẫn và sai sót dữ liệu: Một mình founder nhập liệu thủ công giữa các file Excel tính ROI dễ nhầm công thức và sai số liệu tài chính.',
    'Founder dành tới 70% thời gian trong tuần cho các việc hành chính, gõ tài liệu, chỉnh sửa slide và format văn bản thay vì đi bán hàng hoặc nâng cấp chuyên môn.',
    'Dữ liệu hồ sơ khách hàng, prompt mẫu và template PRD lưu rải rác trên máy tính cá nhân, không có cơ sở tri thức (Knowledge Base) tập trung.',
    'Công ty cung cấp dịch vụ AI nhưng chính quy trình nội bộ của agency lại đang vận hành hoàn toàn thủ công "chạy bằng cơm".'
  ]

  const day1Top3Problems = [
    {
      id: 1,
      problem: 'Soạn thảo Báo Cáo Chẩn Đoán AI $500 thủ công',
      victim: 'Founder kiêm Solution Architect',
      hoursLost: '14 giờ/khách hàng',
      description: 'Mỗi khi chốt được 1 gói $500, Founder mất 12-14 giờ nghe lại ghi âm, trích xuất dữ liệu thô, vẽ sơ đồ và viết báo cáo 30 trang, dẫn đến kiệt sức khi có từ 3 khách/tháng trở lên.'
    },
    {
      id: 2,
      problem: 'Tìm kiếm, sàng lọc và tiếp cận khách hàng tiềm năng phân tán',
      victim: 'Founder kiêm Sales Lead',
      hoursLost: '15 giờ/tuần',
      description: 'Phải tự lướt LinkedIn, Facebook, Zalo kết bạn và nhắn tin thủ công cho từng chủ doanh nghiệp SME nhưng tỷ lệ phản hồi thấp vì thiếu cá nhân hóa sâu sắc.'
    },
    {
      id: 3,
      problem: 'Chậm trễ xây dựng PRD kỹ thuật & System Instruction sau chẩn đoán',
      victim: 'Khách hàng & Doanh thu Upsell',
      hoursLost: '8 giờ/khách hàng',
      description: 'Sau khi khách đồng ý triển khai, Founder mất thêm 3-5 ngày tự tay viết PRD kỹ thuật và System Instruction, làm nguội nhu cầu và kéo dài chu kỳ chốt hợp đồng lớn ($2,500 - $5,000).'
    }
  ]

  await prisma.day1Data.upsert({
    where: { userId },
    update: {
      q1: 5, q2: 3, q3: 3, q4: 4, q5: 5, q6: 3, q7: 4,
      totalScore: 27,
      evidenceData: JSON.stringify(day1Evidence),
      top3Problems: JSON.stringify(day1Top3Problems),
      notes: 'Agency AI 1 Founder chuyên bán gói Chẩn đoán AI $500. Nút thắt lớn nhất là Founder bị kẹt giữa Bán hàng (Acquisition) và Làm dịch vụ (Delivery).'
    },
    create: {
      userId,
      q1: 5, q2: 3, q3: 3, q4: 4, q5: 5, q6: 3, q7: 4,
      totalScore: 27,
      evidenceData: JSON.stringify(day1Evidence),
      top3Problems: JSON.stringify(day1Top3Problems),
      notes: 'Agency AI 1 Founder chuyên bán gói Chẩn đoán AI $500. Nút thắt lớn nhất là Founder bị kẹt giữa Bán hàng (Acquisition) và Làm dịch vụ (Delivery).'
    }
  })

  // ==========================================
  // NGÀY 2: THÔNG SỐ TÀI CHÍNH & QUY MÔ
  // ==========================================
  console.log('-> Đang xử lý Ngày 2...')
  const day2SalaryData = [
    { id: 1, department: 'Founder & AI Solution Architect', salary: 50000000, count: 1 }
  ]

  const day2Challenges = {
    biggestChallenge: 'Vòng lặp "Feast or Famine": Tháng nào tập trung bán hàng thì không kịp làm báo cáo chẩn đoán; tháng nào cắm đầu viết báo cáo thì doanh thu tháng sau tụt dốc vì ngừng tìm khách.',
    timeConsumingProcess: 'Nghe lại file ghi âm 60-90 phút phỏng vấn khách hàng, tổng hợp insight, bóc tách bảng chi phí nhân sự và soạn thảo báo cáo Word/PDF 30 trang.',
    customerComplaints: 'Khách hàng kỳ vọng nhận được Báo cáo Chẩn đoán trong vòng 24-48 giờ sau buổi phỏng vấn, nhưng thực tế phải chờ 5-7 ngày làm việc.',
    aiWishlist: 'Xây dựng hệ thống Multi-Agent đóng vai trò trợ lý hậu cần (Back-office Copilot) để tự động hóa 80% khâu tạo báo cáo chẩn đoán và tài liệu kỹ thuật.'
  }

  const day2Parameters = {
    companyName: 'Striver AI Agency (Solo Consultant)',
    authorName: 'Striver Lê',
    startDate: '2026-10-01',
    hoursPerMonth: 160,
    weeksPerYear: 52,
    reinvestPct: 50
  }

  await prisma.day2Data.upsert({
    where: { userId },
    update: {
      revenue: 50000000,       // 50 triệu/tháng (4 gói $500)
      targetRevenue: 250000000, // 250 triệu/tháng (10 gói $500 + 2 gói triển khai $2,500)
      salaryCost: 50000000,    // Chi phí thời gian của Founder
      customerCount: 4,
      churnRate: 0,
      avgOrderTime: 14,
      salaryData: JSON.stringify(day2SalaryData),
      challenges: JSON.stringify(day2Challenges),
      parameters: JSON.stringify(day2Parameters)
    },
    create: {
      userId,
      revenue: 50000000,
      targetRevenue: 250000000,
      salaryCost: 50000000,
      customerCount: 4,
      churnRate: 0,
      avgOrderTime: 14,
      salaryData: JSON.stringify(day2SalaryData),
      challenges: JSON.stringify(day2Challenges),
      parameters: JSON.stringify(day2Parameters)
    }
  })

  // ==========================================
  // NGÀY 3: PHỎNG VẤN SÂU (GÓC NHÌN FOUNDER)
  // ==========================================
  console.log('-> Đang xử lý Ngày 3...')
  const day3InterviewData = {
    bldInterviews: [
      {
        id: 1,
        name: 'Striver Lê (Góc nhìn Founder / Business Owner)',
        role: 'Founder & Giám Đốc Điều Hành',
        q1: 'Mục tiêu chiến lược: Doanh số đạt 250 triệu VNĐ/tháng (~10,000 USD). Bán 10 gói Chẩn đoán AI $500/tháng để làm phễu chuyển đổi sang 2 dự án triển khai Multi-Agent trọn gói ($2,500 - $5,000/dự án).',
        q2: 'Trở ngại lớn nhất: Không thể scale (mở rộng quy mô) vì 1 mình phải làm từ A đến Z. Nếu nhận quá 4 khách/tháng là rơi vào trạng thái kiệt sức (burnout).',
        q3: 'Kỳ vọng về AI: Biến quy trình tư vấn của chính mình thành một dây chuyền bán tự động, giải phóng ít nhất 25-30 giờ/tuần để tập trung vào chốt sale và xây dựng quan hệ đối tác.',
        q4: 'Rủi ro lo ngại: Sợ chất lượng báo cáo bị nông hoặc có hiện tượng ảo giác (hallucination) nếu để AI tự viết hoàn toàn mà không có guardrails và khung kiểm soát con người.',
        q5: 'Ngân sách đầu tư: Sẵn sàng bỏ ra 20-30 triệu VNĐ để xây dựng pipeline tự động hóa cho agency.'
      }
    ],
    nvInterviews: [
      {
        id: 1,
        name: 'Striver Lê (Góc nhìn Kỹ Sư Thực Thi & Phân Tích)',
        role: 'Solution Architect & Lead Delivery',
        q1: 'Công việc hàng ngày: Đọc ghi chép phỏng vấn khách hàng, làm sạch dữ liệu bảng lương, chạy công thức tính ROI trên Excel, viết bài phân tích cho từng phòng ban, format heading, kẻ bảng...',
        q2: 'Khâu gây ức chế nhất: Định dạng văn bản báo cáo và viết đi viết lại các đoạn diễn giải phương pháp luận chuẩn giống nhau cho các khách hàng khác nhau.',
        q3: 'Công cụ đang dùng: Google Docs, Notion, Whisper API (để chuyển voice thành text), Google Sheets, Canva. Các công cụ này hoàn toàn rời rạc, không tự kết nối dữ liệu với nhau.',
        q4: 'Đề xuất giải pháp: Cần 1 pipeline tự động nhận bản ghi chép phỏng vấn thô -> tự phân loại theo 3 động cơ vận hành -> tự tính ROI -> tự xuất ra bản thảo PRD và Báo cáo chẩn đoán chuẩn Markdown.'
      }
    ],
    findings: {
      commonProblems: 'Nút thắt cổ chai duy nhất kìm hãm agency tăng trưởng là năng lực sản xuất tài liệu tư vấn của một cá nhân duy nhất.',
      hiddenKnowledge: 'Phương pháp luận chẩn đoán AI 9 ngày rất chặt chẽ và có giá trị cao đối với SME, nhưng hiện đang phụ thuộc 100% vào trí nhớ và thời gian của Founder.',
      mostTimeConsuming: 'Khâu soạn Báo cáo Chẩn đoán 30 trang (14 giờ/báo cáo) và khâu soạn PRD kỹ thuật (8 giờ/bản).',
      mostFrustratingTool: 'Google Docs kết hợp nhập liệu thủ công từ file Excel.',
      goalGap: 'Cần nâng công suất từ 4 báo cáo/tháng lên 15 báo cáo/tháng mà không cần tuyển thêm nhân viên full-time bằng cách sử dụng Multi-Agent Copilot.'
    }
  }

  await prisma.day3Data.upsert({
    where: { userId },
    update: { interviewData: JSON.stringify(day3InterviewData) },
    create: { userId, interviewData: JSON.stringify(day3InterviewData) }
  })

  // ==========================================
  // NGÀY 4: SƠ ĐỒ CHUỖI GIÁ TRỊ (3 ĐỘNG CƠ)
  // ==========================================
  console.log('-> Đang xử lý Ngày 4...')
  const day4MapData = {
    acquisition: [
      {
        id: 1,
        step: 'Quét và thu thập danh sách chủ SME tiềm năng trên LinkedIn/Facebook',
        assignee: 'Founder',
        hours: 5,
        tools: 'LinkedIn Sales Navigator, Google Sheets',
        issues: 'Mất thời gian lọc bằng tay, dữ liệu không đồng nhất',
        wastedTime: true,
        qualityRisk: false
      },
      {
        id: 2,
        step: 'Soạn tin nhắn tiếp cận (Cold Outreach) cá nhân hóa cho từng lead',
        assignee: 'Founder',
        hours: 8,
        tools: 'Zalo, LinkedIn InMail, Email',
        issues: 'Gửi thủ công từng tin, tốn nhiều công sức nhưng dễ nản khi tỷ lệ phản hồi dưới 10%',
        wastedTime: true,
        qualityRisk: true
      },
      {
        id: 3,
        step: 'Cuộc gọi thẩm định ban đầu (Discovery Call 30 phút) để bán gói $500',
        assignee: 'Founder',
        hours: 4,
        tools: 'Google Meet, Calendly',
        issues: 'Một số lead chưa đủ ngân sách hoặc thiếu nhận thức về AI vẫn đặt lịch, làm lãng phí thời gian',
        wastedTime: false,
        qualityRisk: true
      }
    ],
    delivery: [
      {
        id: 4,
        step: 'Thu thập bảng câu hỏi & biên bản phỏng vấn khách hàng (Audit Input)',
        assignee: 'Founder',
        hours: 2,
        tools: 'Google Forms, Notion, Whisper',
        issues: 'Dữ liệu khách hàng điền rời rạc, câu trả lời mơ hồ cần hỏi lại nhiều lần',
        wastedTime: false,
        qualityRisk: true
      },
      {
        id: 5,
        step: 'Bóc tách điểm nghẽn, đối chiếu chi phí lương & tính toán bài toán tài chính ROI',
        assignee: 'Founder',
        hours: 4,
        tools: 'Excel, Google Sheets',
        issues: 'Tính toán thủ công từng use-case, dễ sai sót công thức',
        wastedTime: true,
        qualityRisk: true
      },
      {
        id: 6,
        step: 'Soạn thảo Báo Cáo Chẩn Đoán AI $500 hoàn chỉnh (30 trang chuyên sâu)',
        assignee: 'Founder',
        hours: 8,
        tools: 'Google Docs, Markdown, Canva',
        issues: 'Điểm nghẽn nghiêm trọng nhất: Mất 8 tiếng gõ chữ, dàn trang, format biểu đồ',
        wastedTime: true,
        qualityRisk: true
      },
      {
        id: 7,
        step: 'Họp bàn giao kết quả và thuyết trình giải pháp cho Ban Lãnh Đạo khách hàng',
        assignee: 'Founder',
        hours: 2,
        tools: 'Google Meet, Slide Deck',
        issues: 'Khâu mang lại giá trị cao nhất, cần giữ lại 100% cho con người',
        wastedTime: false,
        qualityRisk: false
      }
    ],
    support: [
      {
        id: 8,
        step: 'Soạn bản đặc tả PRD kỹ thuật và System Instruction để chào bán gói Triển khai $2,500',
        assignee: 'Founder',
        hours: 6,
        tools: 'Notion, Cursor/VSCode',
        issues: 'Khách hàng có nhu cầu nóng nhưng phải đợi 3-5 ngày mới có PRD kỹ thuật',
        wastedTime: true,
        qualityRisk: true
      },
      {
        id: 9,
        step: 'Theo dõi tiến độ, giải đáp thắc mắc và giữ liên lạc định kỳ sau chẩn đoán',
        assignee: 'Founder',
        hours: 2,
        tools: 'Zalo Group, Email',
        issues: 'Hay bị quên follow-up vì đang mải làm báo cáo cho khách hàng mới',
        wastedTime: true,
        qualityRisk: false
      }
    ]
  }

  await prisma.day4Data.upsert({
    where: { userId },
    update: { mapData: JSON.stringify(day4MapData) },
    create: { userId, mapData: JSON.stringify(day4MapData) }
  })

  // ==========================================
  // NGÀY 5: MA TRẬN ƯU TIÊN (TOP 3 GIẢI PHÁP)
  // ==========================================
  console.log('-> Đang xử lý Ngày 5...')
  const day5Priorities = [
    {
      id: 1,
      problem: 'Soạn thảo Báo Cáo Chẩn Đoán AI $500 hoàn chỉnh tốn 8-12 tiếng',
      solution: 'Agent Tự Động Hóa Soạn Báo Cáo Chẩn Đoán AI $500 (AI Diagnostic Report Multi-Agent)',
      hoursImpact: 12,
      impact: 5,
      effort: 2,
      isTop3: true,
      assignee: 'Founder',
      notes: 'Giải pháp cốt lõi số 1: Giảm thời gian làm báo cáo từ 12h xuống 1h. Giúp tăng công suất lên gấp 4 lần ngay lập tức.'
    },
    {
      id: 2,
      problem: 'Soạn tin nhắn tiếp cận (Cold Outreach) và sàng lọc lead tiềm năng mất 8h/tuần',
      solution: 'Agent Sàng Lọc & Cá Nhân Hóa Tiếp Cận Khách Hàng (Lead Qualifier & Outreach Agent)',
      hoursImpact: 8,
      impact: 4,
      effort: 2,
      isTop3: true,
      assignee: 'Founder',
      notes: 'Giải pháp số 2: Tự động phân tích hồ sơ SME trên web/fanpage và soạn tin nhắn cold outreach siêu cá nhân hóa.'
    },
    {
      id: 3,
      problem: 'Soạn bản đặc tả PRD kỹ thuật và System Instruction để chào bán gói Triển khai mất 6h',
      solution: 'Agent Tự Động Phân Rã PRD Kỹ Thuật & System Instruction (PRD & Spec Synthesizer Agent)',
      hoursImpact: 6,
      impact: 4,
      effort: 2,
      isTop3: true,
      assignee: 'Founder',
      notes: 'Giải pháp số 3: Tự động chuyển đổi kết quả chẩn đoán thành bản PRD 14 phần và System Instruction XML để chốt gói triển khai $2,500.'
    },
    {
      id: 4,
      problem: 'Lọc thủ công danh sách SME trên mạng xã hội mất 5h/tuần',
      solution: 'Quy trình thu thập dữ liệu bằng công cụ cào web tự động (Scraping tool & n8n)',
      hoursImpact: 5,
      impact: 3,
      effort: 3,
      isTop3: false,
      assignee: 'Founder',
      notes: 'Xử lý bằng quy trình & công cụ đơn giản trước.'
    },
    {
      id: 5,
      problem: 'Quên follow-up chăm sóc khách sau chẩn đoán',
      solution: 'Thiết lập tự động hóa nhắc lịch Zalo/Email CRM',
      hoursImpact: 2,
      impact: 3,
      effort: 1,
      isTop3: false,
      assignee: 'Founder',
      notes: 'Dùng quy trình CRM đơn giản (Process Only).'
    }
  ]

  await prisma.day5Data.upsert({
    where: { userId },
    update: { priorities: JSON.stringify(day5Priorities) },
    create: { userId, priorities: JSON.stringify(day5Priorities) }
  })

  // ==========================================
  // NGÀY 6: TÍNH TOÁN BÀI TOÁN ROI TÀI CHÍNH
  // ==========================================
  console.log('-> Đang xử lý Ngày 6...')
  const day6RoiData = [
    {
      id: 'sol-1',
      name: 'Agent Tự Động Hóa Soạn Báo Cáo Chẩn Đoán AI $500 (AI Diagnostic Report Multi-Agent)',
      employees: 1,
      hoursPerWeek: 12,
      aiReplacementPct: 80, // Tiết kiệm 9.6 giờ/tuần
      avgSalaryMonth: 50000000,
      implementationCost: 15000000, // Chi phí xây dựng hệ thống ban đầu
      extraRevenuePerHour: 750000   // Giá trị tạo thêm khi nhận thêm khách hàng $500
    },
    {
      id: 'sol-2',
      name: 'Agent Sàng Lọc & Cá Nhân Hóa Tiếp Cận Khách Hàng (Lead Qualifier & Outreach Agent)',
      employees: 1,
      hoursPerWeek: 8,
      aiReplacementPct: 75, // Tiết kiệm 6 giờ/tuần
      avgSalaryMonth: 50000000,
      implementationCost: 10000000,
      extraRevenuePerHour: 500000
    },
    {
      id: 'sol-3',
      name: 'Agent Tự Động Phân Rã PRD Kỹ Thuật & System Instruction (PRD & Spec Synthesizer Agent)',
      employees: 1,
      hoursPerWeek: 6,
      aiReplacementPct: 85, // Tiết kiệm 5.1 giờ/tuần
      avgSalaryMonth: 50000000,
      implementationCost: 8000000,
      extraRevenuePerHour: 1000000  // Thúc đẩy chốt deal triển khai $2,500 - $5,000 nhanh hơn
    }
  ]

  await prisma.day6Data.upsert({
    where: { userId },
    update: { roiData: JSON.stringify(day6RoiData) },
    create: { userId, roiData: JSON.stringify(day6RoiData) }
  })

  // ==========================================
  // NGÀY 7: LỘ TRÌNH TRIỂN KHAI THỰC CHIẾN
  // ==========================================
  console.log('-> Đang xử lý Ngày 7...')
  const day7Roadmap = {
    phases: [
      {
        id: 1,
        period: '🚀 LÀM NGAY (Tuần 1-4: Quick-Win)',
        task: 'Xây dựng và đưa vào vận hành Agent Soạn Báo Cáo Chẩn Đoán AI $500 (AI Diagnostic Report Generator)',
        savings: 'Tiết kiệm 38.4 giờ/tháng, tăng công suất phục vụ từ 4 lên 12 khách hàng $500/tháng',
        owner: 'Striver Lê',
        status: 'Đang triển khai'
      },
      {
        id: 2,
        period: '🏃‍♂️ LÀM TIẾP (Tháng 2-3: Wave 1)',
        task: 'Triển khai Agent Sàng Lọc & Tiếp Cận Lead tự động qua Zalo OA & LinkedIn InMail',
        savings: 'Tiết kiệm 24 giờ/tháng, tạo phễu đều đặn 15-20 cuộc gọi chẩn đoán chất lượng cao/tháng',
        owner: 'Striver Lê',
        status: 'Chưa'
      },
      {
        id: 3,
        period: '🚶‍♂️ LÀM SAU (Tháng 4-6: Wave 2)',
        task: 'Tích hợp Agent Phân Rã PRD Kỹ Thuật & System Instruction tự động để chốt hợp đồng triển khai $2,500 - $5,000',
        savings: 'Rút ngắn chu kỳ chốt sale từ 10 ngày xuống 48 giờ, tăng tỷ lệ chuyển đổi upsell thêm 35%',
        owner: 'Striver Lê',
        status: 'Chưa'
      },
      {
        id: 4,
        period: '🔭 DÀI HẠN (Tháng 7-12: Scale Agency)',
        task: 'Đóng gói toàn bộ nền tảng Striver AI thành nền tảng SaaS Platform cho các đơn vị tư vấn và Agency khác thuê lại',
        savings: 'Mở rộng nguồn thu thụ động (MRR) ngoài dịch vụ tư vấn trực tiếp',
        owner: 'Striver Lê',
        status: 'Chưa'
      }
    ],
    week1Actions: [
      {
        id: 1,
        action: 'Chuẩn hóa bộ mẫu câu hỏi Audit đầu vào và xây dựng prompt phân loại dữ liệu khách hàng theo mô hình JSON',
        deadline: 'Ngày thứ 3 của Tuần 1',
        expected: 'Có 1 schema JSON chuẩn hóa dữ liệu đầu vào cho 3 Động cơ vận hành'
      },
      {
        id: 2,
        action: 'Thiết lập pipeline Gemini 2.5 Flash để tự động bóc tách bản ghi âm và sinh bản thảo báo cáo chẩn đoán theo khung 7 phần',
        deadline: 'Ngày thứ 5 của Tuần 1',
        expected: 'Bản thử nghiệm đầu tiên sinh báo cáo mẫu trong 3 phút từ biên bản phỏng vấn'
      },
      {
        id: 3,
        action: 'Kiểm thử thực tế trên 01 khách hàng hiện tại, đo lường thời gian Founder cần can thiệp soát xét (HITL)',
        deadline: 'Chủ nhật Tuần 1',
        expected: 'Rút ngắn thời gian Founder hoàn thiện báo cáo từ 12 tiếng xuống còn dưới 1.5 tiếng'
      }
    ]
  }

  await prisma.day7Data.upsert({
    where: { userId },
    update: { roadmap: JSON.stringify(day7Roadmap) },
    create: { userId, roadmap: JSON.stringify(day7Roadmap) }
  })

  // ==========================================
  // NGÀY 8: TẠO BẢN PRD HOÀN CHỈNH (CHUẨN OZIL 14 PHẦN)
  // ==========================================
  console.log('-> Đang xử lý Ngày 8 (Tạo bản PRD hoàn chỉnh theo chuẩn 14 phần)...')
  
  const manualWorkflowUseCase1 = `
Quy trình thủ công hiện tại của Founder khi làm Báo Cáo Chẩn Đoán AI $500:
1. Tiếp nhận tài liệu: Founder nhận file ghi âm phỏng vấn 60 phút qua Google Drive + 1 file Excel khảo sát của khách hàng.
2. Nghe và ghi chép (Transcribe & Note): Mất 2-3 tiếng nghe lại ghi âm, chép lại các điểm nghẽn, tên phòng ban, số lượng nhân sự và ngân sách khách hàng.
3. Phân loại 3 Động cơ: Tự tay mở Google Docs, kẻ bảng chia thành 3 Động cơ (Tìm khách, Phục vụ, Chăm sóc) và liệt kê các khâu lãng phí thời gian.
4. Tính toán bài toán tài chính: Mở Google Sheets, nhập mức lương trung bình của khách hàng, số giờ lãng phí, tự gõ công thức tính số tiền thiệt hại hàng năm và tỷ lệ ROI kỳ vọng khi áp dụng AI.
5. Viết báo cáo tư vấn: Mất 6-8 tiếng gõ từng mục báo cáo theo sườn: Bối cảnh -> Khám bệnh -> Khuyến nghị giải pháp AI -> Lộ trình 3 giai đoạn.
6. Soát lỗi và xuất PDF: Định dạng heading, kẻ bảng đẹp mắt, chèn logo Striver AI và xuất file PDF gửi khách hàng.
Tổng thời gian: 12 - 14 tiếng/khách hàng. Khi có 3 khách cùng lúc là Founder kiệt sức và trễ hạn.
  `.trim()

  const prdMarkdownUseCase1 = `
# PRD: Agent Tự Động Hóa Soạn Báo Cáo Chẩn Đoán AI $500 (AI Diagnostic Report Multi-Agent)

## 1. Thẻ điều hành (Executive Summary)
- **Bối cảnh:** Striver AI Agency vận hành theo mô hình Solo Consultant (1 Founder duy nhất). Sản phẩm phễu chủ lực là "Gói Chẩn Đoán & Kiểm Toán AI Toàn Diện" bán với giá $500 (~12.5 triệu VNĐ). Hiện tại, Founder mất 12-14 giờ làm việc thủ công cho mỗi khách hàng để hoàn thành bản báo cáo 30 trang. Điều này tạo ra nút thắt cổ chai nghiêm trọng khiến doanh nghiệp không thể vượt ngưỡng 4 khách hàng/tháng.
- **Mục tiêu định lượng (ROI):**
  - Cắt giảm thời gian sản xuất báo cáo từ **12 giờ xuống còn 1.5 giờ** (giảm 87.5% thời gian thủ công).
  - Tăng công suất phục vụ từ **4 khách hàng/tháng lên 12-15 khách hàng/tháng** mà không cần thuê thêm nhân viên.
  - Tăng doanh thu trực tiếp từ gói chẩn đoán từ 50 triệu lên 150 - 187.5 triệu VNĐ/tháng.
  - Tiết kiệm 38.4 giờ làm việc/tháng cho Founder, tương đương giá trị thời gian 28.8 triệu VNĐ/tháng (dựa trên mức định giá giờ công 750,000 VNĐ/giờ).
- **Phạm vi In-scope:**
  - Hệ thống Multi-Agent tiếp nhận văn bản phỏng vấn thô (transcript) và dữ liệu khảo sát.
  - Tự động chuẩn hóa dữ liệu, bóc tách 3 Động cơ vận hành (Acquisition, Delivery, Support).
  - Tự động tính toán các chỉ số thiệt hại tài chính và ROI theo công thức chuẩn của Striver AI.
  - Tự động soạn thảo bản thảo Báo cáo Chẩn đoán hoàn chỉnh (Markdown/DOCX).
  - Hàng đợi phê duyệt (Approval Queue) để Founder soát xét trong 30-45 phút trước khi xuất bản.
- **Phạm vi Out-of-scope:**
  - Tự động gửi báo cáo trực tiếp cho khách hàng mà không qua con người phê duyệt (Bắt buộc Human-in-the-loop).
  - Tự động thay đổi giá bán hoặc cam kết pháp lý với khách hàng.

## 2. Ngữ cảnh người dùng (User Context)
- **Đối tượng vận hành:** Striver Lê (Founder kiêm Solution Architect).
- **Nỗi đau vận hành hiện tại (Pain Points):**
  - Quá tải xử lý tài liệu lặp lại: Mất 8 tiếng gõ bàn phím cho các mục cấu trúc cố định và bảng biểu.
  - Rủi ro sai lệch số liệu: Nhập thủ công từ Excel sang Word dễ nhầm lẫn số liệu lương và tỷ lệ ROI.
  - Trễ hẹn với khách: Khách hàng chờ 5-7 ngày làm nguội bớt sự hào hứng và giảm tỷ lệ chốt deal triển khai tiếp theo ($2,500 - $5,000).

## 3. Kiến trúc quy trình tự động hóa (Process Architecture - Sơ đồ To-Be)
Hệ thống vận hành theo kiến trúc 3 Agent chuyên biệt kết hợp 1 điểm chốt chặn con người (HITL):
1. **Agent 1: Agent Phân Loại & Chuẩn Hóa Dữ Liệu (Autonomy Tier: L1):** Nhận transcript thô và file bảng tính -> Làm sạch PII (tên nhân viên, số CCCD, tài khoản ngân hàng) -> Chuẩn hóa thành JSON cấu trúc chuẩn.
2. **Agent 2: Agent Phân Tích Điểm Nghẽn & Tính Toán ROI (Autonomy Tier: L2):** Nhận JSON -> Nhận diện các điểm nghẽn trong 3 Động cơ -> Tính toán số giờ lãng phí, chi phí cơ hội bị mất và tỷ lệ ROI cho từng giải pháp AI đề xuất.
3. **Agent 3: Agent Soạn Thảo Báo Cáo Chẩn Đoán (Autonomy Tier: L1):** Tổng hợp dữ liệu từ Agent 1 & Agent 2 -> Áp dụng Knowledge Pack của Striver AI -> Soạn thảo báo cáo chuyên sâu 7 chương.
4. **Human Reviewer (Founder):** Đọc bản thảo, tinh chỉnh nhận xét chiến lược mang dấu ấn cá nhân -> Bấm "Phê duyệt & Xuất PDF".

## 4. Data Workflow JSON
\`\`\`json
{
  "workflow_id": "wf_diagnostic_report_v1",
  "trigger": "audit_interview_completed",
  "steps": [
    {
      "step_id": 1,
      "agent": "Agent Phân Loại Dữ Liệu",
      "autonomy_tier": "L1",
      "input": "raw_transcript_and_survey",
      "output": "structured_audit_input.json"
    },
    {
      "step_id": 2,
      "agent": "Agent Tính Toán ROI",
      "autonomy_tier": "L2",
      "input": "structured_audit_input.json",
      "output": "roi_financial_matrix.json"
    },
    {
      "step_id": 3,
      "agent": "Agent Soạn Thảo Báo Cáo",
      "autonomy_tier": "L1",
      "input": {
        "audit_data": "structured_audit_input.json",
        "financial_data": "roi_financial_matrix.json"
      },
      "output": "draft_diagnostic_report.md"
    },
    {
      "step_id": 4,
      "human_checkpoint": {
        "role": "Founder Striver Le",
        "action": "review_and_approve",
        "sla_hours": 2
      }
    }
  ]
}
\`\`\`

## 5. Data Flow Map (Bản đồ luồng dữ liệu)
- **Nguồn đầu vào:** File âm thanh ghi âm phỏng vấn (Google Meet) + Bảng trả lời khảo sát ban đầu.
- **Tầng tiền xử lý:** Module Whisper Speech-to-Text chuyển đổi giọng nói -> Module Data Sanitizer che dấu thông tin nhạy cảm cá nhân (PII Masking).
- **Tầng Agentic Orchestration:**
  - Vector Store (Qdrant/Chroma) cung cấp kho tri thức giải pháp AI SME đã kiểm chứng.
  - Agent 1 $\\rightarrow$ Agent 2 $\\rightarrow$ Agent 3 trao đổi qua chuẩn JSON Schema xác thực nghiêm ngặt bằng Zod.
- **Hệ thống đích:** Lưu trữ bản thảo Markdown tại PostgreSQL Neon $\\rightarrow$ Hiển thị trên Admin Dashboard $\\rightarrow$ Xuất bản PDF kèm chữ ký điện tử.

## 6. Concrete Example (Ví dụ dữ liệu cụ thể)
- **Input thực tế:**
  - Doanh nghiệp khách hàng: Công ty TNHH May Mặc An Phú (35 nhân sự, 3 phòng ban: Kinh doanh 8 người, Vận hành xưởng 22 người, Kế toán 5 người).
  - Vấn đề khai báo: "Nhân viên kinh doanh mất 3 tiếng mỗi ngày tra cứu bảng tồn kho và báo giá thủ công qua Zalo cho khách sỉ, hay báo nhầm mẫu hết hàng."
- **Bước xử lý trung gian của Agent:**
  - Agent 1 trích xuất: Engine = Acquisition; Task = Báo giá & Check tồn kho; Assignee = Sale; Hours_Lost = 3h/người/ngày $\\times$ 8 người = 24h/ngày.
  - Agent 2 tính toán: Mức lương TB 10 triệu/tháng (62,500 đ/h). Số tiền lãng phí hàng năm: $24h \\times 26 \\text{ ngày} \\times 12 \\text{ tháng} \\times 62,500 = 468,000,000$ VNĐ. Giải pháp đề xuất: "Agent Tra Cứu Tồn Kho & Báo Giá Tự Động". Chi phí triển khai ước tính: 35 triệu. ROI năm đầu: 1,237%.
- **Output hoàn chỉnh:** Bản báo cáo sinh ra phân tích chi tiết bài toán kinh tế, sơ đồ kiến trúc giải pháp và lộ trình 3 tuần thực hiện, kèm khuyến nghị khách hàng đăng ký gói Triển khai của Striver AI.

## 7. Đặc tả Agent theo mô hình RCICE
### Agent 1: Agent Phân Loại & Chuẩn Hóa Dữ Liệu
- **Role:** Chuyên viên phân tích nghiệp vụ (BA) cấp cao chuyên chuẩn hóa dữ liệu doanh nghiệp.
- **Context:** Tiếp nhận bản chép lời phỏng vấn lộn xộn, nhiều từ đệm, nói lắp và thông tin tản mạn.
- **Instructions:**
  1. Loại bỏ các đoạn hội thoại chào hỏi xã giao.
  2. Bóc tách thông tin công ty: Tên, ngành hàng, doanh thu ước tính, cơ cấu nhân sự.
  3. Phân loại toàn bộ các vấn đề được nêu vào đúng 3 Động cơ: Acquisition, Delivery, Support.
  4. Đánh dấu các câu trả lời chưa rõ ràng bằng thẻ \`{TODO - Quan trọng: Cần xác nhận lại với khách}\`.
- **Constraints:** Không tự bịa thêm phòng ban hoặc số lượng nhân sự nếu trong transcript không đề cập.
- **Examples:** (Đã tích hợp trong kịch bản mẫu).

### Agent 2: Agent Phân Tích Điểm Nghẽn & Tính Toán ROI
- **Role:** Chuyên gia thẩm định tài chính dự án công nghệ.
- **Context:** Hoạt động trên dữ liệu đã chuẩn hóa của Agent 1 và thông số định mức của Striver AI.
- **Instructions:**
  1. Tính đơn giá giờ công của từng phòng ban = Lương tháng / 160 giờ.
  2. Tính tổng giá trị lãng phí = Số giờ mất $\\times$ Tỷ lệ lãng phí $\\times$ Đơn giá giờ $\\times$ 52 tuần.
  3. Đối chiếu ma trận 4 góc để xếp hạng ưu tiên giải pháp AI (Tác động cao - Độ phức tạp thấp).
  4. Xuất kết quả dưới định dạng JSON tài chính chuẩn.
- **Constraints:** Mọi công thức toán học phải có giải trình từng bước, không chấp nhận số liệu nhảy cóc.

### Agent 3: Agent Soạn Thảo Báo Cáo Chẩn Đoán
- **Role:** Cố vấn trưởng chuyển đổi số (Chief AI Transformation Consultant) của Striver AI.
- **Context:** Sở hữu toàn bộ tri thức của Knowledge Pack "Architect Ozil Enterprise".
- **Instructions:**
  1. Tiếp nhận JSON từ Agent 1 và Agent 2.
  2. Soạn thảo văn phong tiếng Việt sắc sảo, đanh thép, mang tính cố vấn chiến lược cấp C-Level.
  3. Trình bày đủ 7 phần chuẩn: Tóm tắt điều hành, Bức tranh hiện trạng, Điểm nghẽn tài chính, Giải pháp đề xuất, Ma trận ưu tiên, Lộ trình hành động, Kêu gọi hành động (CTA).
- **Constraints:** Giữ nguyên các con số do Agent 2 tính toán, không làm tròn sai lệch.

## 8. INPUT SCHEMA và OUTPUT SCHEMA
### INPUT SCHEMA (Chuẩn hóa đầu vào)
\`\`\`json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "AuditRawInputSchema",
  "type": "object",
  "required": ["companyName", "interviewTranscript", "departments"],
  "properties": {
    "companyName": { "type": "string", "description": "Tên doanh nghiệp được chẩn đoán" },
    "interviewTranscript": { "type": "string", "description": "Văn bản bóc băng phỏng vấn đầy đủ" },
    "departments": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "headcount", "avgSalaryVND"],
        "properties": {
          "name": { "type": "string" },
          "headcount": { "type": "integer", "minimum": 1 },
          "avgSalaryVND": { "type": "number", "minimum": 0 }
        }
      }
    }
  }
}
\`\`\`

### OUTPUT SCHEMA (Đặc tả đầu ra của Agent phân tích)
\`\`\`json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "DiagnosticAnalysisOutputSchema",
  "type": "object",
  "required": ["executiveSummary", "engineAnalysis", "top3AiSolutions", "financialSummary"],
  "properties": {
    "executiveSummary": { "type": "string" },
    "engineAnalysis": {
      "type": "object",
      "properties": {
        "acquisitionIssues": { "type": "array", "items": { "type": "string" } },
        "deliveryIssues": { "type": "array", "items": { "type": "string" } },
        "supportIssues": { "type": "array", "items": { "type": "string" } }
      }
    },
    "top3AiSolutions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["solutionName", "targetEngine", "hoursSavedPerYear", "estimatedRoiPct"],
        "properties": {
          "solutionName": { "type": "string" },
          "targetEngine": { "type": "string", "enum": ["acquisition", "delivery", "support"] },
          "hoursSavedPerYear": { "type": "number" },
          "estimatedRoiPct": { "type": "number" }
        }
      }
    },
    "financialSummary": {
      "type": "object",
      "required": ["totalWastedVND", "potentialSavingsVND", "paybackMonths"],
      "properties": {
        "totalWastedVND": { "type": "number" },
        "potentialSavingsVND": { "type": "number" },
        "paybackMonths": { "type": "number" }
      }
    }
  }
}
\`\`\`

## 9. Knowledge Base Strategy (Chiến lược cơ sở tri thức)
- Nguồn tài liệu: Toàn bộ 4 gói tài liệu "Ozil Knowledge Pack", 50+ tình huống mẫu tư vấn SME tại Việt Nam, và thư viện các công thức tính ROI đã kiểm chứng.
- Chiến lược Embeddings: Sử dụng \`text-embedding-004\` của Google kết hợp Hybrid Search (Dense Vector + BM25 Full-text search) để đảm bảo tra cứu chính xác cả thuật ngữ kỹ thuật và tiếng lóng kinh doanh của chủ doanh nghiệp Việt Nam.
- Chunking: Cắt theo phân đoạn ngữ nghĩa (Semantic Chunking) từ 300 - 500 tokens kèm metadata phân loại ngành nghề (F&B, Bán lẻ, Sản xuất, Dịch vụ).

## 10. Integration & Technical Requirements
- Nền tảng: Next.js 15, PostgreSQL (Neon Serverless), Prisma ORM.
- AI Provider: Google Gemini 2.5 Flash làm động cơ chính (Primary) kết hợp fallback sang Gemini 2.5 Flash-Lite khi quá tải.
- Giao thức tích hợp: Webhook tự động nhận file transcript từ Google Drive/Whisper, REST API đẩy dữ liệu về CMS nội bộ.
- Bảo mật: Tuân thủ quy định không dùng dữ liệu khách hàng để huấn luyện model (Data Privacy & Compliance).

## 11. Human-in-the-loop & Failure Paths Matrix
| Trường hợp lỗi / Tình huống ngoại lệ | Rủi ro | Cơ chế tự động xử lý | Hành động của Founder (HITL) |
| :--- | :--- | :--- | :--- |
| Transcript thiếu thông tin về lương nhân sự | Báo cáo bị khuyết dữ liệu ROI cốt lõi | Agent tự động gắn cờ \`{TODO - Nghiêm trọng: Thiếu bảng lương}\` và dùng mức lương thị trường làm mốc tạm thời | Founder gọi điện 5 phút cho khách hàng để cập nhật số thực tế trước khi xuất bản |
| Model bị Hallucination (sáng tạo số liệu không có trong bài phỏng vấn) | Mất uy tín chuyên môn của Agency | Zod Validator kiểm tra chéo các con số trong báo cáo với \`AuditRawInputSchema\` | Báo cáo bị chặn xuất bản, hiển thị cảnh báo đỏ trên dashboard của Founder |
| API Gemini gặp lỗi 429 hoặc 503 | Gián đoạn tiến độ tạo báo cáo | Hệ thống tự động kích hoạt Exponential Backoff và chuyển sang Fallback Model | Không cần can thiệp nếu fallback thành công, báo lỗi nếu timeout sau 3 phút |
| Khách hàng hoạt động trong ngành nghề đặc thù (Sản xuất hóa chất, Y tế) | Thuật ngữ chuyên ngành bị dịch sai | Agent kích hoạt cờ cảnh báo thuật ngữ độ chính xác trung bình | Founder dành 15 phút rà soát thuật ngữ chuyên ngành |

## 12. Evaluation Framework (Khung đánh giá chất lượng)
- **Chỉ số kỹ thuật (Technical Metrics):**
  - Thời gian sinh bản thảo toàn bộ 7 chương: $\\le 90$ giây.
  - Tỷ lệ tuân thủ JSON Schema đầu ra: $100\\%$.
  - Mức độ che giấu PII thành công: $100\\%$.
- **Chỉ số kinh doanh & Hiệu quả (Business Metrics):**
  - Thời gian Founder cần để hoàn thiện 1 báo cáo: $\\le 45$ phút (so với 12-14 giờ trước đây).
  - Tỷ lệ khách hàng đánh giá hài lòng về độ sâu sắc của báo cáo chẩn đoán: $\\ge 9.2/10$.
  - Tỷ lệ chuyển đổi từ gói Chẩn đoán $500 lên gói Triển khai Multi-Agent ($2,500+): $\\ge 35\\%$.

## 13. Roadmap & Risks (Lộ trình triển khai & Quản trị rủi ro)
- **Giai đoạn 1: Prototype (Tuần 1 - 2):** Xây dựng pipeline Agent 1 và Agent 2 trên n8n/Node.js, kiểm thử trên 3 bộ hồ sơ khách hàng cũ.
- **Giai đoạn 2: Pilot nội bộ (Tuần 3 - 4):** Áp dụng trực tiếp vào quy trình thực tế của Founder, đo lường thời gian tiết kiệm thực tế.
- **Giai đoạn 3: Production & Tự động hóa hoàn toàn (Tháng 2):** Tích hợp UI Admin trực quan, kết nối webhook tự động với Google Drive.
- **Quản trị rủi ro:** Sao lưu toàn bộ transcript khách hàng trên cơ sở dữ liệu mã hóa riêng; định kỳ kiểm tra rà soát các thay đổi trong chính sách API của Google.

## 14. Open Questions/TODOs
- \`{TODO - Quan trọng: Cần khảo sát xem có nên hỗ trợ xuất thẳng ra file Canva/PowerPoint template cho Founder thay vì chỉ xuất PDF/Markdown hay không?}\`
- \`{TODO - Nên biết: Cân nhắc tích hợp gửi voice note tóm tắt 3 phút của Founder vào nhóm Zalo của khách hàng sau khi gửi báo cáo.}\`
  `.trim()

  const day8Items = [
    {
      useCaseIndex: 1,
      useCaseTitle: 'Agent Tự Động Hóa Soạn Báo Cáo Chẩn Đoán AI $500 (AI Diagnostic Report Multi-Agent)',
      sourceProblem: 'Soạn thảo Báo Cáo Chẩn Đoán AI $500 hoàn chỉnh tốn 8-12 tiếng',
      sourceSolution: 'Agent Tự Động Hóa Soạn Báo Cáo Chẩn Đoán AI $500 (AI Diagnostic Report Multi-Agent)',
      sourceType: 'system',
      manualWorkflow: manualWorkflowUseCase1,
      status: 'completed',
      markdown: prdMarkdownUseCase1,
      errorMessage: null,
      model: 'gemini-2.5-flash',
      responseId: 'resp_prd_agency_solopreneur_1',
      generatedAt: new Date().toISOString(),
      roiInput: day6RoiData[0],
      roadmapContext: day7Roadmap
    },
    {
      useCaseIndex: 2,
      useCaseTitle: 'Agent Sàng Lọc & Cá Nhân Hóa Tiếp Cận Khách Hàng (Lead Qualifier & Outreach Agent)',
      sourceProblem: 'Soạn tin nhắn tiếp cận (Cold Outreach) và sàng lọc lead tiềm năng mất 8h/tuần',
      sourceSolution: 'Agent Sàng Lọc & Cá Nhân Hóa Tiếp Cận Khách Hàng (Lead Qualifier & Outreach Agent)',
      sourceType: 'system',
      manualWorkflow: 'Founder tự vào LinkedIn/Facebook tìm kiếm các CEO, giám đốc điều hành SME, đọc bài viết gần nhất của họ, soạn tin nhắn InMail hoặc Zalo thủ công khen ngợi và gợi mở bài toán tối ưu chi phí vận hành bằng AI. Mất trung bình 20 phút cho mỗi tin nhắn, mỗi tuần gửi được khoảng 25-30 tin.',
      status: 'completed',
      markdown: `# PRD: Agent Sàng Lọc & Cá Nhân Hóa Tiếp Cận Khách Hàng (Lead Qualifier & Outreach Agent)

## 1. Thẻ điều hành (Executive Summary)
- Tự động hóa khâu thu thập thông tin và soạn thảo thông điệp tiếp cận cá nhân hóa sâu sắc cho Founder gửi đến các chủ SME.
- Mục tiêu: Tăng số lượng tin nhắn chất lượng cao từ 25 tin/tuần lên 120 tin/tuần, tăng tỷ lệ đặt lịch hẹn chẩn đoán từ 8% lên 22%.
- Tiết kiệm 6 giờ làm việc/tuần cho Founder.

## 2. Ngữ cảnh người dùng
- Founder đóng vai trò Sales Lead duy nhất, thường xuyên bị nản lòng vì phải gõ tin nhắn thủ công lặp lại.

## 3. Kiến trúc quy trình
- Agent 1: Lead Enrichment Agent (L0) quét thông tin website và fanpage doanh nghiệp khách hàng.
- Agent 2: Cold Message Crafter (L1) viết thông điệp theo công thức PAS (Problem - Agitate - Solve) gắn liền với nỗi đau của ngành đó.
- Human: Founder duyệt tin nhắn và bấm gửi bằng tài khoản cá nhân.

## 4. Data Workflow JSON
\`\`\`json
{ "workflow": "lead_outreach_v1", "agent": "Agent Soạn Thảo Tin Nhắn Tiếp Cận", "tier": "L1" }
\`\`\`

## 5. Data Flow Map
- Website khách hàng -> Agent làm giàu dữ liệu -> Agent soạn tin -> Hàng đợi duyệt của Founder -> Gửi tin.

## 6. Concrete Example
- Khách hàng là công ty chuỗi trà sữa 5 cửa hàng -> Agent nhận diện khâu order và kiểm kho là điểm nghẽn -> Soạn tin đề xuất chẩn đoán quy trình order.

## 7. RCICE
- Role: Chuyên viên tư vấn phát triển kinh doanh B2B.

## 8. INPUT SCHEMA và OUTPUT SCHEMA
- Input: URL website / Fanpage / Tên doanh nghiệp.
- Output: Thông điệp tiếp cận cá nhân hóa 3 đoạn.

## 9. Knowledge Base Strategy
- Thư viện 30 mẫu tin nhắn outreach chuyển đổi cao nhất của Striver AI.

## 10. Integration & Technical Requirements
- Tích hợp Zalo API / LinkedIn Helper.

## 11. Human-in-the-loop & Failure Paths
- Tuyệt đối không gửi tin tự động nếu chưa có Founder kiểm tra nội dung.

## 12. Evaluation Framework
- Tỷ lệ phản hồi (Reply Rate) >= 18%, Tỷ lệ đặt lịch call >= 10%.

## 13. Roadmap & Risks
- Triển khai trong Tháng 2 sau khi hoàn thiện Agent Báo Cáo.

## 14. Open Questions/TODOs
- {TODO - Quan trọng: Xác định chính sách chống spam trên LinkedIn để bảo vệ tài khoản cá nhân của Founder.}
`,
      errorMessage: null,
      model: 'gemini-2.5-flash',
      responseId: 'resp_prd_agency_solopreneur_2',
      generatedAt: new Date().toISOString(),
      roiInput: day6RoiData[1],
      roadmapContext: day7Roadmap
    },
    {
      useCaseIndex: 3,
      useCaseTitle: 'Agent Tự Động Phân Rã PRD Kỹ Thuật & System Instruction (PRD & Spec Synthesizer Agent)',
      sourceProblem: 'Soạn bản đặc tả PRD kỹ thuật và System Instruction để chào bán gói Triển khai mất 6h',
      sourceSolution: 'Agent Tự Động Phân Rã PRD Kỹ Thuật & System Instruction (PRD & Spec Synthesizer Agent)',
      sourceType: 'system',
      manualWorkflow: 'Sau khi khách hàng đồng ý với báo cáo chẩn đoán $500, Founder phải mất 6-8 tiếng ngồi viết bản PRD kỹ thuật 14 phần và soạn System Instruction XML cho từng con Agent để chào bán gói Triển khai $2,500. Việc này làm chậm quá trình chốt hợp đồng.',
      status: 'completed',
      markdown: `# PRD: Agent Tự Động Phân Rã PRD Kỹ Thuật & System Instruction (PRD & Spec Synthesizer Agent)

## 1. Thẻ điều hành (Executive Summary)
- Tự động chuyển đổi các phát hiện từ Báo Cáo Chẩn Đoán thành bản PRD 14 phần chuẩn Kiến trúc Ozil và trích xuất System Instruction XML production-ready.
- Rút ngắn thời gian lập đề xuất kỹ thuật từ 6 giờ xuống còn 20 phút.
- Thúc đẩy chốt các hợp đồng triển khai giá trị cao ($2,500 - $5,000) ngay khi khách hàng còn đang hào hứng.

## 2. Ngữ cảnh người dùng
- Founder cần một công cụ sinh đặc tả kỹ thuật chuẩn xác, không phải gõ lại từ đầu.

## 3. Kiến trúc quy trình
- Đọc Báo cáo chẩn đoán -> Trích xuất danh sách Agent cần xây dựng -> Tạo PRD kỹ thuật -> Sinh System Instruction.

## 4. Data Workflow JSON
\`\`\`json
{ "workflow": "spec_synthesis_v1", "agent": "Agent Phân Rã Kỹ Thuật", "tier": "L1" }
\`\`\`

## 5. Data Flow Map
- Diagnostic Report Markdown -> Spec Synthesizer -> Technical PRD & SI Bundle.

## 6. Concrete Example
- Khách may mặc cần bot check tồn kho -> Agent tự viết PRD và System Instruction cho Inventory Bot.

## 7. RCICE
- Role: Solution Architect kiêm Prompt Engineer trưởng.

## 8. INPUT SCHEMA và OUTPUT SCHEMA
- Input: Báo cáo chẩn đoán Markdown.
- Output: PRD kỹ thuật + File System Instruction XML.

## 9. Knowledge Base Strategy
- Bộ khung System Instruction XML chuẩn Striver AI với 5 thẻ bắt buộc.

## 10. Integration & Technical Requirements
- Node.js CLI / Next.js API.

## 11. Human-in-the-loop & Failure Paths
- Founder bắt buộc review lại các ràng buộc bảo mật (Constraints) trước khi gửi cho dev hoặc khách hàng.

## 12. Evaluation Framework
- Điểm đánh giá Rubric >= 90/100 điểm.

## 13. Roadmap & Risks
- Triển khai trong Tháng 3.

## 14. Open Questions/TODOs
- {TODO - Nên biết: Tích hợp xuất thẳng sang định dạng n8n workflow JSON.}
`,
      errorMessage: null,
      model: 'gemini-2.5-flash',
      responseId: 'resp_prd_agency_solopreneur_3',
      generatedAt: new Date().toISOString(),
      roiInput: day6RoiData[2],
      roadmapContext: day7Roadmap
    }
  ]

  await prisma.day8Data.upsert({
    where: { userId },
    update: { prdData: JSON.stringify(day8Items) },
    create: { userId, prdData: JSON.stringify(day8Items) }
  })

  // ==========================================
  // NGÀY 9: TẠO SYSTEM INSTRUCTIONS CHUẨN XML
  // ==========================================
  console.log('-> Đang xử lý Ngày 9 (Tạo System Instruction chuẩn XML Production-Ready)...')

  const siMarkdownUseCase1 = `
# System Instructions: Agent Tự Động Hóa Soạn Báo Cáo Chẩn Đoán AI $500 (AI Diagnostic Report Multi-Agent)

Danh sách các Agent được đặc tả trong kịch bản này:
1. Agent Phân Loại & Chuẩn Hóa Dữ Liệu Khách Hàng (Data Normalizer Agent)
2. Agent Phân Tích Điểm Nghẽn & Tính Toán ROI (ROI & Bottleneck Calculator Agent)
3. Agent Soạn Thảo Báo Cáo Chẩn Đoán & Khuyến Nghị (Diagnostic Report Author Agent)

---

### 1. Agent Phân Loại & Chuẩn Hóa Dữ Liệu Khách Hàng

\`\`\`xml
<role>
Bạn là Agent Phân Loại & Chuẩn Hóa Dữ Liệu Khách Hàng thuộc hệ thống Striver AI.
Bạn là chuyên gia phân tích nghiệp vụ (Business Analyst) sắc bén với hơn 10 năm kinh nghiệm trong việc bóc tách dữ liệu doanh nghiệp SME.
Vị trí của bạn là Agent tầng cửa ngõ (Gateway Agent), tiếp nhận dữ liệu phỏng vấn và bản ghi thô từ khách hàng để chuẩn hóa cấu trúc dữ liệu cho toàn bộ các Agent phân tích phía sau.
Bạn làm việc tỉ mỉ, khách quan, trung thực với dữ liệu gốc; tuyệt đối không suy diễn, không tự thêm thắt các phòng ban hoặc nhân sự không có trong tài liệu.
Điều bạn KHÔNG BAO GIỜ làm: Tự tiện sáng tạo số liệu tài chính hoặc bỏ qua các thông tin nhạy cảm (PII) chưa được che giấu.
</role>

<context>
Bạn hoạt động trong môi trường Node.js Backend kết nối với cơ sở dữ liệu PostgreSQL của Striver AI.
Dữ liệu đầu vào của bạn là văn bản bóc băng phỏng vấn (Transcript) từ cuộc gọi chẩn đoán và thông tin khảo sát ban đầu của khách hàng.
Bạn phải làm sạch các dữ liệu nhạy cảm như số căn cước, mật khẩu, tài khoản ngân hàng (thay bằng [PII_REDACTED]).

Input JSON Schema:
{
  "type": "object",
  "required": ["companyName", "rawTranscript", "departments"],
  "properties": {
    "companyName": { "type": "string" },
    "rawTranscript": { "type": "string" },
    "departments": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "headcount", "avgSalaryVND"],
        "properties": {
          "name": { "type": "string" },
          "headcount": { "type": "integer" },
          "avgSalaryVND": { "type": "number" }
        }
      }
    }
  }
}

Output JSON Schema:
{
  "type": "object",
  "required": ["companyName", "issues"],
  "properties": {
    "companyName": { "type": "string" },
    "issues": { "type": "array" }
  }
}
</context>

<instructions>
1. Bước 1: Tiếp nhận dữ liệu đầu vào theo đúng Input JSON Schema. Quét toàn bộ nội dung rawTranscript để nhận diện và che giấu các thông tin định danh cá nhân nhạy cảm (PII).
2. Bước 2: Bóc tách toàn bộ các lời than phiền, trở ngại, và quy trình công việc được nhắc tới trong transcript; phân loại rành mạch vào 3 Động cơ vận hành cốt lõi:
   - Động cơ 1: Tìm khách (Acquisition - Marketing, Sales, Tìm kiếm lead, Báo giá).
   - Động cơ 2: Phục vụ (Delivery - Sản xuất, Cung cấp dịch vụ, Vận hành, Kiểm kho, Giao hàng).
   - Động cơ 3: Chăm sóc (Support - CSKH, Kế toán, Nhân sự, Thu hồi công nợ, Giữ chân khách).
3. Bước 3: Đối với mỗi vấn đề được phát hiện, trích xuất chính xác: Tên vấn đề, Bộ phận chịu trách nhiệm, Số giờ ước tính bị lãng phí mỗi tuần, và Bằng chứng nguyên văn (quote) từ lời kể của khách hàng. Nếu transcript không nói rõ số giờ, gắn cờ "{TODO - Quan trọng: Cần Founder xác minh lại thời gian}".
4. Bước 4: Kiểm tra tính toàn vẹn và xuất kết quả theo định dạng Output JSON Schema.
</instructions>

<criteria>
1. Độ chính xác phân loại: 100% vấn đề phải được phân loại đúng vào 1 trong 3 Động cơ (Acquisition, Delivery, Support).
2. Mức độ che giấu PII: 0% rò rỉ số điện thoại cá nhân, số tài khoản hoặc thông tin mật.
3. Không bịa đặt: Tuyệt đối không tự suy diễn số giờ nếu khách hàng không nhắc tới.
4. Thời gian phản hồi: Dưới 15 giây cho tài liệu 5,000 từ.
5. Định dạng dữ liệu: Đầu ra bắt buộc phải là JSON hợp lệ, phân tích được bằng JSON.parse().
</criteria>

<examples>
Happy path (Ví dụ 1):
Input:
{
  "companyName": "Công ty Vận Tải Toàn Cầu",
  "rawTranscript": "Giám đốc bảo là đội điều xe có 4 người, mỗi ngày mất 3 tiếng dò bảng giá và chat Zalo với tài xế báo giá cho khách, hay bị nhầm giá cước.",
  "departments": [{ "name": "Điều xe", "headcount": 4, "avgSalaryVND": 12000000 }]
}
Phân tích:
- Engine: Delivery & Acquisition (Khâu báo giá & điều xe).
- Bộ phận: Điều xe (4 người).
- Giờ lãng phí: 3 giờ/người/ngày = 12 giờ/ngày.
Output:
{
  "companyName": "Công ty Vận Tải Toàn Cầu",
  "issues": [
    {
      "engine": "delivery",
      "step": "Tra cứu bảng giá và báo giá cước cho khách qua Zalo",
      "department": "Điều xe",
      "hoursLostPerDay": 12,
      "quote": "mỗi ngày mất 3 tiếng dò bảng giá và chat Zalo với tài xế báo giá cho khách, hay bị nhầm giá cước"
    }
  ]
}

Edge case (Ví dụ 2):
Input:
{
  "companyName": "Nội Thất Mộc Xinh",
  "rawTranscript": "Nhân viên hay phàn nàn là làm báo giá mệt mỏi lắm.",
  "departments": [{ "name": "Kinh doanh", "headcount": 2, "avgSalaryVND": 9000000 }]
}
Phân tích: Có vấn đề làm báo giá nhưng không có số giờ cụ thể.
Output:
{
  "companyName": "Nội Thất Mộc Xinh",
  "issues": [
    {
      "engine": "acquisition",
      "step": "Làm báo giá nội thất",
      "department": "Kinh doanh",
      "hoursLostPerDay": null,
      "flag": "{TODO - Quan trọng: Cần Founder xác minh lại thời gian làm báo giá}"
    }
  ]
}
</examples>
\`\`\`

---

### 2. Agent Phân Tích Điểm Nghẽn & Tính Toán ROI

\`\`\`xml
<role>
Bạn là Agent Phân Tích Điểm Nghẽn & Tính Toán ROI của Striver AI.
Bạn là chuyên gia mô hình tài chính và đánh giá hiệu quả đầu tư công nghệ (Financial Modeler & Tech ROI Specialist).
Định vị của bạn là bộ não phân tích định lượng, nhận dữ liệu đã làm sạch từ Agent 1 và chuyển hóa thành những con số thiệt hại tài chính và tiềm năng tiết kiệm biết nói.
Phong cách làm việc: Chuẩn xác, minh bạch từng công thức toán học, không làm tròn cẩu thả.
Điều bạn KHÔNG BAO GIỜ làm: Đưa ra con số ROI mà không có công thức giải trình chi tiết từng thành phần.
</role>

<context>
Môi trường hoạt động: Thực thi trong worker tính toán tài chính của Striver AI.
Thông số chuẩn định mức: 1 tháng làm việc = 160 giờ; 1 năm = 52 tuần.
Công thức đơn giá giờ công: HourlyRate = Lương_tháng / 160.
Công thức thiệt hại năm: AnnualWaste = Số_giờ_lãng_phí_năm * HourlyRate.

Input JSON Schema:
{
  "type": "object",
  "required": ["companyName", "issues", "departments"],
  "properties": {
    "companyName": { "type": "string" },
    "issues": { "type": "array" },
    "departments": { "type": "array" }
  }
}

Output JSON Schema:
{
  "type": "object",
  "required": ["companyName", "financialMatrix"],
  "properties": {
    "companyName": { "type": "string" },
    "financialMatrix": { "type": "array" }
  }
}
</context>

<instructions>
1. Bước 1: Tính toán đơn giá giờ làm việc (Hourly Rate) cho từng phòng ban từ danh sách departments.
2. Bước 2: Với mỗi vấn đề trong danh sách issues, tính toán tổng số giờ lãng phí trong 1 năm (Annual Hours Lost) và tổng chi phí thiệt hại tương ứng bằng tiền VNĐ.
3. Bước 3: Đề xuất giải pháp AI tương ứng để giải quyết điểm nghẽn; ước tính tỷ lệ AI thay thế được (từ 50% đến 85% tùy độ phức tạp của tác vụ).
4. Bước 4: Tính toán tỷ lệ hoàn vốn ROI năm đầu theo công thức: ROI = ((Giá_trị_tiết_kiệm_năm_1 - Chi_phí_triển_khai) / Chi_phí_triển_khai) * 100%. Xuất ra Output JSON Schema đầy đủ.
</instructions>

<criteria>
1. Độ chính xác toán học: 100% phép tính phải khớp chính xác đến từng đơn vị VNĐ.
2. Tính minh bạch: Mỗi giải pháp đề xuất đều phải ghi rõ công thức tính và biến số đầu vào.
3. Khả năng thẩm định: Tỷ lệ AI thay thế không được vượt quá 90% (tuân thủ nguyên tắc Human-in-the-loop).
4. Định dạng đầu ra: Đúng chuẩn Output JSON Schema.
</criteria>

<examples>
Happy path (Ví dụ 1):
Input: Vấn đề 12 giờ lãng phí/ngày, phòng ban Điều xe (Lương 12 triệu/tháng).
Phân tích:
- Hourly rate = 12,000,000 / 160 = 75,000 VNĐ/giờ.
- Giờ lãng phí/năm = 12 * 26 ngày * 12 tháng = 3,744 giờ/năm.
- Thiệt hại tài chính hàng năm = 3,744 * 75,000 = 280,800,000 VNĐ.
- Giải pháp: Agent Báo Giá & Điều Xe Tự Động (Tỷ lệ thay thế: 80% = tiết kiệm 2,995.2 giờ = 224,640,000 VNĐ).
- Chi phí triển khai ước tính: 30,000,000 VNĐ.
- ROI = ((224,640,000 - 30,000,000) / 30,000,000) * 100% = 648.8%.

Edge case (Ví dụ 2):
Input: Vấn đề gắn cờ {TODO}.
Phân tích: Không tính bừa số tiền, trả về giá trị null và ghi chú rõ ràng cần bổ sung dữ liệu.
</examples>
\`\`\`

---

### 3. Agent Soạn Thảo Báo Cáo Chẩn Đoán & Khuyến Nghị

\`\`\`xml
<role>
Bạn là Cố Vấn Trưởng Chuyển Đổi Số AI của Striver AI (Striver AI Chief Transformation Consultant).
Bạn là chuyên gia tư vấn chiến lược cấp cao với khả năng diễn đạt lưu loát, thấu cảm sâu sắc nỗi đau của các chủ doanh nghiệp SME Việt Nam.
Định vị của bạn là Agent tầng xuất bản (Authoring Agent), tổng hợp toàn bộ kết quả phân tích định lượng từ Agent 1 và Agent 2 thành một bản Báo Cáo Chẩn Đoán AI $500 hoàn hảo, chuyên nghiệp và có sức thuyết phục cao nhất.
Văn phong: Gãy gọn, khúc chiết, mang tính định hướng hành động (action-oriented), không lan man học thuật.
Điều bạn KHÔNG BAO GIỜ làm: Tự ý thay đổi các con số tài chính do Agent 2 đã tính toán.
</role>

<context>
Bạn sở hữu toàn bộ tri thức của Knowledge Pack "Architect Ozil Enterprise".
Đầu vào của bạn là kết quả phân tích điểm nghẽn và bảng tính tài chính ROI từ Agent 2.
Mục tiêu là tạo ra tài liệu Markdown hoàn chỉnh sẵn sàng chuyển đổi thành PDF gửi cho khách hàng sau khi Founder phê duyệt.

Input JSON Schema:
{
  "type": "object",
  "required": ["companyName", "financialMatrix", "solutions"],
  "properties": {
    "companyName": { "type": "string" },
    "financialMatrix": { "type": "array" },
    "solutions": { "type": "array" }
  }
}

Output JSON Schema:
{
  "type": "object",
  "required": ["reportMarkdown"],
  "properties": {
    "reportMarkdown": { "type": "string" }
  }
}
</context>

<instructions>
1. Bước 1: Tiếp nhận dữ liệu phân tích từ Agent 2. Đọc kỹ bối cảnh công ty, tên người lập, cơ cấu tổ chức và các con số tài chính.
2. Bước 2: Soạn thảo Phần 1 - Thẻ Điều Hành (Executive Summary): Trình bày ngắn gọn trong 1 trang về hiện trạng, số tiền thiệt hại hàng năm và tiềm năng tiết kiệm tài chính khi đưa AI vào vận hành.
3. Bước 3: Soạn thảo Phần 2 - Phân Tích 3 Động Cơ Vận Hành (Acquisition, Delivery, Support): Nêu rõ từng điểm nghẽn kèm bằng chứng trích dẫn thực tế từ doanh nghiệp.
4. Bước 4: Soạn thảo Phần 3 - Ma Trận Giải Pháp AI & Đánh Giá ROI: Bảng tổng hợp các giải pháp, số giờ tiết kiệm, tỷ lệ ROI và mức độ ưu tiên.
5. Bước 5: Soạn thảo Phần 4 - Lộ Trình Triển Khai 3 Giai Đoạn (Quick-Win, Wave 1, Wave 2) và lời kêu gọi hành động (CTA) chuyển tiếp lên gói Triển khai của Striver AI.
</instructions>

<criteria>
1. Độ hoàn chỉnh cấu trúc: Đầy đủ tất cả các chương mục quy định của Báo cáo Chẩn đoán Striver AI.
2. Tính thống nhất số liệu: 100% các con số tài chính phải trùng khớp chính xác với kết quả của Agent 2.
3. Ngôn ngữ tiếng Việt chuẩn mực: Không viết sai chính tả, không dùng văn phong dịch thuật thô cứng.
4. Thời gian tạo báo cáo: Hoàn thành trong vòng 60 giây.
</criteria>

<examples>
Happy path (Ví dụ 1):
Sinh ra bản báo cáo Markdown đầy đủ 30 trang với các tiêu đề rõ ràng, bảng biểu so sánh As-Is vs To-Be và lộ trình hành động tuần đầu tiên.

Edge case (Ví dụ 2):
Khi có điểm nghẽn chưa đủ dữ liệu định lượng, trình bày bằng khối Alert chú ý và hướng dẫn khách hàng cách thu thập số liệu trong tuần tới.
</examples>
\`\`\`
  `.trim()

  const day9Items = [
    {
      useCaseIndex: 1,
      useCaseTitle: 'Agent Tự Động Hóa Soạn Báo Cáo Chẩn Đoán AI $500 (AI Diagnostic Report Multi-Agent)',
      status: 'completed',
      markdown: siMarkdownUseCase1,
      errorMessage: null,
      model: 'gemini-2.5-flash',
      generatedAt: new Date().toISOString()
    },
    {
      useCaseIndex: 2,
      useCaseTitle: 'Agent Sàng Lọc & Cá Nhân Hóa Tiếp Cận Khách Hàng (Lead Qualifier & Outreach Agent)',
      status: 'completed',
      markdown: `# System Instructions: Agent Sàng Lọc & Cá Nhân Hóa Tiếp Cận Khách Hàng (Lead Qualifier & Outreach Agent)

Danh sách Agent:
1. Agent Thu Thập & Làm Giàu Dữ Liệu Lead (Lead Enrichment Agent)
2. Agent Soạn Thảo Tin Nhắn Tiếp Cận Cá Nhân Hóa (Personalized Message Crafter Agent)

\`\`\`xml
<role>
Bạn là Agent Soạn Thảo Tin Nhắn Tiếp Cận Khách Hàng B2B cho Striver AI.
Bạn hiểu sâu sắc tâm lý chủ doanh nghiệp SME: bận rộn, dị ứng với tin nhắn spam tự động, chỉ quan tâm đến hiệu quả và tối ưu chi phí.
</role>
<context>
Đầu vào: Thông tin tên công ty, ngành nghề, và nỗi đau điển hình.
Input JSON Schema: { "companyName": "string", "industry": "string" }
Output JSON Schema: { "outreachMessage": "string" }
</context>
<instructions>
1. Bước 1: Phân tích ngành nghề của khách hàng.
2. Bước 2: Nêu bật 1 điểm nghẽn vận hành phổ biến nhất của ngành đó.
3. Bước 3: Đề xuất buổi chẩn đoán 30 phút không cam kết.
4. Bước 4: Xuất tin nhắn theo công thức Hook - Story - Offer.
</instructions>
<criteria>
1. Chiều dài tin nhắn dưới 150 từ.
2. Không dùng từ ngữ sáo rỗng.
</criteria>
<examples>
Happy path (Ví dụ 1):
Tin nhắn gửi chủ chuỗi F&B về bài toán thất thoát nguyên vật liệu.
Edge case (Ví dụ 2):
Tin nhắn gửi công ty công nghệ đã biết về AI.
</examples>
\`\`\`
`,
      errorMessage: null,
      model: 'gemini-2.5-flash',
      generatedAt: new Date().toISOString()
    },
    {
      useCaseIndex: 3,
      useCaseTitle: 'Agent Tự Động Phân Rã PRD Kỹ Thuật & System Instruction (PRD & Spec Synthesizer Agent)',
      status: 'completed',
      markdown: `# System Instructions: Agent Tự Động Phân Rã PRD Kỹ Thuật & System Instruction (PRD & Spec Synthesizer Agent)

Danh sách Agent:
1. Agent Phân Rã Kiến Trúc Quy Trình (Process Architect Agent)
2. Agent Soạn Thảo System Instruction XML (Prompt Engineer Agent)

\`\`\`xml
<role>
Bạn là Agent Soạn Thảo Đặc Tả Kỹ Thuật PRD & System Instruction thuộc Striver AI.
Chuyên môn của bạn là chuyển dịch ngôn ngữ kinh doanh thành ngôn ngữ kiến trúc phần mềm Multi-Agent.
</role>
<context>
Đầu vào: Bản Báo Cáo Chẩn Đoán AI $500.
Input JSON Schema: { "diagnosticReportMarkdown": "string" }
Output JSON Schema: { "prdMarkdown": "string", "systemInstructions": "string" }
</context>
<instructions>
1. Bước 1: Đọc báo cáo chẩn đoán để xác định các quy trình To-Be.
2. Bước 2: Phân tách thành từng Agent độc lập kèm Autonomy Tier (L0, L1, L2, L3).
3. Bước 3: Soạn thảo PRD 14 phần chuẩn Kiến trúc Ozil.
4. Bước 4: Xuất System Instruction XML với 5 thẻ bắt buộc: role, context, instructions, criteria, examples.
</instructions>
<criteria>
1. Đầy đủ 14 phần PRD bắt buộc.
2. Thẻ XML đúng chuẩn và đóng mở chính xác.
</criteria>
<examples>
Happy path (Ví dụ 1): Bóc tách hệ thống bot chăm sóc khách hàng.
Edge case (Ví dụ 2): Hệ thống yêu cầu tích hợp cơ sở dữ liệu cũ ERP.
</examples>
\`\`\`
`,
      errorMessage: null,
      model: 'gemini-2.5-flash',
      generatedAt: new Date().toISOString()
    }
  ]

  await prisma.day9Data.upsert({
    where: { userId },
    update: { siData: JSON.stringify(day9Items) },
    create: { userId, siData: JSON.stringify(day9Items) }
  })

  // Đảm bảo currentDay = 9 và isPaid = true
  await prisma.user.update({
    where: { id: userId },
    data: { currentDay: 9, isPaid: true }
  })

  console.log('=== CHÚC MỪNG! ĐÃ CHẠY HOÀN TẤT THỰC TẾ TRỌN VẸN 9 NGÀY CHO TÀI KHOẢN striveraivn@gmail.com ===')
}

seedAiAgencyScenario()
  .catch(err => {
    console.error('LỖI KHI CHẠY KỊCH BẢN:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
