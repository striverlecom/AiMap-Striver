'use client'

import Link from 'next/link'

export default function ResultsClient({ serverUser }: { serverUser: any }) {
  const user = serverUser || {}
  
  // Calculated Metrics
  const scoreAI = user.day1Data?.totalScore || 0
  let scoreText = 'Chưa xác định'
  if (scoreAI >= 7 && scoreAI <= 14) scoreText = 'Tốt'
  else if (scoreAI >= 15 && scoreAI <= 25) scoreText = 'Trung bình'
  else if (scoreAI >= 26 && scoreAI <= 35) scoreText = 'Cần AI gấp'

  let totalEmployees = 0
  if (user.day2Data?.salaryData) {
    try { 
      const parsed = JSON.parse(user.day2Data.salaryData)
      if (Array.isArray(parsed)) parsed.forEach((row:any) => totalEmployees += (parseInt(row.count)||0)) 
    } catch(e){}
  }

  let issueProcesses = 0
  if (user.day4Data?.mapData) {
    try {
      const md = JSON.parse(user.day4Data.mapData)
      Object.values(md).forEach((arr:any) => {
        if (Array.isArray(arr)) arr.forEach((r:any) => { if (r.wastedTime || r.qualityRisk || r.issues) issueProcesses++ })
      })
    } catch(e){}
  }

  // Load Parameters from Day 2
  let globalParams = { hoursPerMonth: 160, weeksPerYear: 52, companyName: '', authorName: '', startDate: '' }
  if (user.day2Data?.parameters) {
    try {
      const p = JSON.parse(user.day2Data.parameters)
      if (p.hoursPerMonth || p.weeksPerYear) {
        globalParams = { 
          hoursPerMonth: p.hoursPerMonth || 160, 
          weeksPerYear: p.weeksPerYear || 52,
          companyName: p.companyName || '',
          authorName: p.authorName || '',
          startDate: p.startDate || ''
        }
      }
    } catch(e){}
  }

  // Load Solutions from Day 6 directly
  let rois: any[] = []
  if (user.day6Data?.roiData) {
    try { 
      const parsed = JSON.parse(user.day6Data.roiData)
      if (Array.isArray(parsed)) rois = parsed 
    } catch(e){}
  }

  let day5TopSolutions: any[] = []
  if (user.day5Data?.priorities) {
    try {
      const parsed = JSON.parse(user.day5Data.priorities)
      if (Array.isArray(parsed)) {
        day5TopSolutions = parsed.filter((item: any) => item.isTop3).slice(0, 3)
      }
    } catch(e){}
  }

  let totalHoursWeek = 0
  let totalHoursMonth = 0
  let totalSavingsYear = 0
  let totalRevenueYear = 0
  let totalInvestment = 0
  let totalValueYear = 0
  let totalEmployeesSol = 0
  let totalFtes = 0

  const processedRois = rois.map((sol, index) => {
    const day5Solution = day5TopSolutions[index]
    const solutionName = [
      day5Solution?.solution,
      sol.name,
      day5Solution?.problem,
      `Giải pháp #${index + 1}`
    ].find(value => typeof value === 'string' && value.trim().length > 0) as string

    const totalResourceHours = sol.employees * sol.hoursPerWeek
    const hoursSavedWeek = totalResourceHours * (sol.aiReplacementPct / 100)
    const hoursSavedMonth = hoursSavedWeek * (globalParams.weeksPerYear / 12)
    const hourlyWage = sol.avgSalaryMonth / globalParams.hoursPerMonth
    
    const savingsYear = hoursSavedWeek * hourlyWage * globalParams.weeksPerYear
    const revenueYear = sol.extraRevenuePerHour * hoursSavedWeek * globalParams.weeksPerYear
    const tvYear = savingsYear + revenueYear
    const roi = sol.implementationCost > 0 ? (tvYear / sol.implementationCost) * 100 : 0
    const paybackMonths = tvYear > 0 ? (sol.implementationCost / tvYear) * 12 : 0
    const fteSaved = hoursSavedWeek / 40

    totalHoursWeek += hoursSavedWeek
    totalHoursMonth += hoursSavedMonth
    totalSavingsYear += savingsYear
    totalRevenueYear += revenueYear
    totalValueYear += tvYear
    totalInvestment += sol.implementationCost
    totalEmployeesSol += sol.employees
    totalFtes += fteSaved

    return { ...sol, name: solutionName.trim(), hoursSavedWeek, hoursSavedMonth, savingsYear, revenueYear, tvYear, roi, paybackMonths, fteSaved }
  })

  const globalRoiPct = totalInvestment > 0 ? (totalValueYear / totalInvestment) * 100 : 0

  const formatVND = (num: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0)

  return (
    <div className="container fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.02em', marginBottom: '0.5rem'}}>BÁO CÁO KIỂM TOÁN AI</h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>Kết quả sau 7 ngày phân tích - Dựa trên dữ liệu thật</p>
      </header>

      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* THÔNG TIN DOANH NGHIỆP */}
        <section className="glass-panel" style={{ border: '1px solid var(--card-border)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--foreground)' }}>🏢 THÔNG TIN DOANH NGHIỆP</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div><span style={{color:'var(--muted)', display: 'block', fontSize: '0.85rem', marginBottom: '4px'}}>Công ty:</span> <strong style={{color:'var(--warning)', fontSize: '1.2rem'}}>{globalParams.companyName || '---'}</strong></div>
            <div><span style={{color:'var(--muted)', display: 'block', fontSize: '0.85rem', marginBottom: '4px'}}>Người thực hiện:</span> <strong style={{color:'var(--foreground)', fontSize: '1.1rem'}}>{globalParams.authorName || '---'}</strong></div>
            <div><span style={{color:'var(--muted)', display: 'block', fontSize: '0.85rem', marginBottom: '4px'}}>Ngày lập:</span> <strong style={{color:'var(--foreground)', fontSize: '1.1rem'}}>{globalParams.startDate || '---'}</strong></div>
          </div>
        </section>

        {/* CHẨN ĐOÁN */}
        <section className="glass-panel">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', color: 'var(--warning)' }}>🔍 CHẨN ĐOÁN</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div>
              <div style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>Điểm Sẵn Sàng AI</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{scoreAI}<span style={{fontSize: '1.5rem', color: 'var(--muted)'}}>/35</span></div>
              <div style={{ color: 'var(--warning)', fontWeight: 600, marginTop: '0.5rem' }}>Đánh giá: {scoreText}</div>
            </div>
            <div>
              <div style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>Tổng nhân viên</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{totalEmployees}</div>
              <div style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>người</div>
            </div>
            <div>
              <div style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>Quy trình có vấn đề</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--error)' }}>{issueProcesses}</div>
              <div style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>quy trình</div>
            </div>
          </div>
        </section>

        {/* BẢNG GIẢI PHÁP KHUYẾN NGHỊ */}
        <section className="glass-panel">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', color: 'var(--success)' }}>💡 GIẢI PHÁP AI KHUYẾN NGHỊ</h2>

          <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {processedRois.map((r, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: '0.75rem', alignItems: 'start', padding: '1rem', border: '1px solid var(--card-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>#{i + 1}</span>
                <strong style={{ whiteSpace: 'normal', overflowWrap: 'anywhere', lineHeight: 1.5 }}>{r.name}</strong>
              </div>
            ))}
          </div>
          
          {/* DESKTOP MATRIX TABLE (Hidden on Mobile) */}
          <div className="report-wrapper hide-on-mobile">
            <table className="report-table">
              <thead>
                <tr>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--card-border)', color: 'var(--muted)' }}>Chỉ số</th>
                {processedRois.map((r,i) => (
                  <th key={i} style={{ padding: '1rem', borderBottom: '2px solid var(--card-border)', minWidth: '220px', verticalAlign: 'top' }}>
                    <div style={{ whiteSpace: 'normal', overflowWrap: 'anywhere', lineHeight: 1.45 }}>{r.name}</div>
                  </th>
                ))}
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--card-border)', color: 'var(--success)' }}>TỔNG TỰ TÍNH</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px dotted var(--card-border)' }}>
                <td style={{ padding: '1rem', textAlign: 'left', color: 'var(--muted)' }}>Số NV / Giải pháp</td>
                {processedRois.map((r,i) => <td key={i} style={{ padding: '1rem' }}>{r.employees}</td>)}
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--foreground)' }}>{totalEmployeesSol}</td>
              </tr>
              <tr style={{ borderBottom: '1px dotted var(--card-border)' }}>
                <td style={{ padding: '1rem', textAlign: 'left', color: 'var(--muted)' }}>Giờ TK/tuần</td>
                {processedRois.map((r,i) => <td key={i} style={{ padding: '1rem' }}>{r.hoursSavedWeek.toFixed(1)}</td>)}
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--success)' }}>{totalHoursWeek.toFixed(1)}</td>
              </tr>
              <tr style={{ borderBottom: '1px dotted var(--card-border)' }}>
                <td style={{ padding: '1rem', textAlign: 'left', color: 'var(--muted)' }}>FTE tiết kiệm</td>
                {processedRois.map((r,i) => <td key={i} style={{ padding: '1rem' }}>{r.fteSaved.toFixed(3)}</td>)}
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--success)' }}>{totalFtes.toFixed(3)}</td>
              </tr>
              <tr style={{ borderBottom: '1px dotted var(--card-border)' }}>
                <td style={{ padding: '1rem', textAlign: 'left', color: 'var(--muted)' }}>Giờ TK/tháng</td>
                {processedRois.map((r,i) => <td key={i} style={{ padding: '1rem' }}>{r.hoursSavedMonth.toFixed(1)}</td>)}
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--success)' }}>{totalHoursMonth.toFixed(1)}</td>
              </tr>
              <tr style={{ borderBottom: '1px dotted var(--card-border)' }}>
                <td style={{ padding: '1rem', textAlign: 'left', color: 'var(--muted)' }}>Tiết kiệm CP/năm</td>
                {processedRois.map((r,i) => <td key={i} style={{ padding: '1rem' }}>{formatVND(r.savingsYear)}</td>)}
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--success)' }}>{formatVND(totalSavingsYear)}</td>
              </tr>
              <tr style={{ borderBottom: '1px dotted var(--card-border)' }}>
                <td style={{ padding: '1rem', textAlign: 'left', color: 'var(--muted)' }}>DT thêm/năm</td>
                {processedRois.map((r,i) => <td key={i} style={{ padding: '1rem' }}>{formatVND(r.revenueYear)}</td>)}
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--success)' }}>{formatVND(totalRevenueYear)}</td>
              </tr>
              <tr style={{ borderBottom: '1px dotted var(--card-border)', background: 'rgba(0,255,0,0.05)' }}>
                <td style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--success)' }}>TỔNG GIÁ TRỊ/NĂM</td>
                {processedRois.map((r,i) => <td key={i} style={{ padding: '1rem', fontWeight: 600 }}>{formatVND(r.tvYear)}</td>)}
                <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--success)', fontSize: '1.2rem' }}>{formatVND(totalValueYear)}</td>
              </tr>
              <tr style={{ borderBottom: '1px dotted var(--card-border)' }}>
                <td style={{ padding: '1rem', textAlign: 'left', color: 'var(--muted)' }}>Chi phí triển khai</td>
                {processedRois.map((r,i) => <td key={i} style={{ padding: '1rem' }}>{formatVND(r.implementationCost)}</td>)}
                <td style={{ padding: '1rem', fontWeight: 600 }}>{formatVND(totalInvestment)}</td>
              </tr>
              <tr style={{ borderBottom: '1px dotted var(--card-border)' }}>
                <td style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--warning)' }}>% ROI</td>
                {processedRois.map((r,i) => <td key={i} style={{ padding: '1rem', fontWeight: 600, color: 'var(--warning)' }}>{r.roi.toFixed(0)}%</td>)}
                <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--warning)', fontSize: '1.2rem' }}>{globalRoiPct.toFixed(0)}%</td>
              </tr>
              <tr>
                <td style={{ padding: '1rem', textAlign: 'left', color: 'var(--muted)' }}>Thời gian hoàn vốn</td>
                {processedRois.map((r,i) => <td key={i} style={{ padding: '1rem' }}>{r.paybackMonths.toFixed(1)} tháng</td>)}
                <td style={{ padding: '1rem', fontWeight: 600 }}>{totalValueYear > 0 ? ((totalInvestment / totalValueYear) * 12).toFixed(1) : 0} tháng</td>
              </tr>
            </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW (Hidden on Desktop) */}
          <div className="show-on-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '1rem' }}>
            {processedRois.map((r, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>
                  {r.name}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                  <div><div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Số NV</div><div style={{ fontWeight: 500 }}>{r.employees}</div></div>
                  <div><div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>FTE tiết kiệm</div><div style={{ fontWeight: 500 }}>{r.fteSaved.toFixed(3)}</div></div>
                  <div><div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Giờ TK/tuần</div><div style={{ fontWeight: 500 }}>{r.hoursSavedWeek.toFixed(1)}h</div></div>
                  <div><div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Giờ TK/tháng</div><div style={{ fontWeight: 500, color: 'var(--success)' }}>{r.hoursSavedMonth.toFixed(1)}h</div></div>
                  <div><div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Tiết kiệm CP/năm</div><div style={{ fontWeight: 500, color: 'var(--success)' }}>{formatVND(r.savingsYear)}</div></div>
                  <div><div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>DT thêm/năm</div><div style={{ fontWeight: 500, color: 'var(--success)' }}>{formatVND(r.revenueYear)}</div></div>
                  <div><div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Giá trị/năm</div><div style={{ fontWeight: 600, color: 'var(--success)' }}>{formatVND(r.tvYear)}</div></div>
                  <div><div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Chi phí đầu tư</div><div style={{ fontWeight: 500 }}>{formatVND(r.implementationCost)}</div></div>
                  <div><div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>% ROI</div><div style={{ fontWeight: 600, color: 'var(--warning)' }}>{r.roi.toFixed(0)}%</div></div>
                  <div><div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Hoàn vốn</div><div style={{ fontWeight: 500 }}>{r.paybackMonths.toFixed(1)} tháng</div></div>
                </div>
              </div>
            ))}
            
            {/* TỔNG KẾT CARD */}
            <div style={{ background: 'rgba(50, 215, 75, 0.1)', border: '1px solid var(--success)', borderRadius: '12px', padding: '1.25rem', marginTop: '0.5rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)', marginBottom: '1rem', borderBottom: '1px solid rgba(50, 215, 75, 0.3)', paddingBottom: '0.75rem', textAlign: 'center' }}>
                TỔNG TỰ TÍNH
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.8rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Tổng NV áp dụng:</span><strong style={{ color: 'var(--foreground)' }}>{totalEmployeesSol}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Tổng FTE tiết kiệm:</span><strong style={{ color: 'var(--success)' }}>{totalFtes.toFixed(3)}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Tổng Giờ TK/tuần:</span><strong style={{ color: 'var(--success)' }}>{totalHoursWeek.toFixed(1)}h</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Tổng Giờ TK/tháng:</span><strong style={{ color: 'var(--success)' }}>{totalHoursMonth.toFixed(1)}h</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Tổng Tiết kiệm CP/năm:</span><strong style={{ color: 'var(--success)' }}>{formatVND(totalSavingsYear)}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Tổng DT thêm/năm:</span><strong style={{ color: 'var(--success)' }}>{formatVND(totalRevenueYear)}</strong></div>
                <div style={{ width: '100%', height: '1px', background: 'rgba(50, 215, 75, 0.3)', margin: '4px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: 'var(--success)', fontWeight: 600 }}>TỔNG GIÁ TRỊ/NĂM:</span><strong style={{ color: 'var(--success)', fontSize: '1.2rem' }}>{formatVND(totalValueYear)}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Tổng Chi phí đầu tư:</span><strong style={{ color: 'var(--foreground)' }}>{formatVND(totalInvestment)}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: 'var(--warning)', fontWeight: 600 }}>TỔNG ROI %:</span><strong style={{ color: 'var(--warning)', fontSize: '1.2rem' }}>{globalRoiPct.toFixed(0)}%</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Trung bình hoàn vốn:</span><strong style={{ color: 'var(--foreground)' }}>{totalValueYear > 0 ? ((totalInvestment / totalValueYear) * 12).toFixed(1) : 0} tháng</strong></div>
              </div>
            </div>
          </div>
        </section>

        {/* KẾT QUẢ CUỐI CÙNG & KHUYẾN NGHỊ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          
          <section className="glass-panel" style={{ border: '1px solid var(--success)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--success)' }}>KẾT QUẢ CUỐI CÙNG</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Tổng giá trị hàng năm:</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>{formatVND(totalValueYear)}</div>
              </div>
              <div style={{ borderTop: '1px dotted var(--card-border)', paddingTop: '1rem' }}>
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Tổng chi phí đầu tư:</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)' }}>{formatVND(totalInvestment)}</div>
              </div>
              <div style={{ borderTop: '1px dotted var(--card-border)', paddingTop: '1rem' }}>
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>ROI năm đầu:</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)' }}>{globalRoiPct.toFixed(0)}%</div>
              </div>
            </div>
          </section>

          <section className="glass-panel">
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--foreground)' }}>KHUYẾN NGHỊ & BƯỚC TIẾP THEO</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--muted)' }}>
              <li style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>1.</span>
                <span>Triển khai ngay 3 Chiến thắng nhanh trong 30 ngày đầu</span>
              </li>
              <li style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>2.</span>
                <span>Đo lường kết quả sau 60 ngày & điều chỉnh</span>
              </li>
              <li style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>3.</span>
                <span>Mở rộng sang các Big Swing sau khi Quick Win chứng minh hiệu quả</span>
              </li>
              <li style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>4.</span>
                <span>Đào tạo đội ngũ sử dụng hệ thống AI mới</span>
              </li>
            </ul>
          </section>

        </div>
        
        <div style={{ textAlign: 'center', marginTop: '3rem', paddingBottom: '2rem' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>Striver Le · "Đừng trả tiền để thử nghiệm. Hãy trả tiền cho kết quả."</p>
          <Link href="/dashboard" prefetch={true} className="btn-secondary" style={{ padding: '12px 24px', minHeight: '48px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>Quay Lại Bảng Điều Khiển</Link>
        </div>

      </div>
    </div>
  )
}
