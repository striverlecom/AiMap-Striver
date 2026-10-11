'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type ROISolution = {
  id: string,
  name: string,
  employees: number,
  hoursPerWeek: number,
  aiReplacementPct: number,
  avgSalaryMonth: number,
  implementationCost: number,
  extraRevenuePerHour: number
}

export default function Day6Client({ serverUser }: { serverUser: any }) {
  let savedRois: ROISolution[] = []
  
  if (serverUser?.day6Data?.roiData) {
    try { 
      const parsed = JSON.parse(serverUser.day6Data.roiData) 
      if (Array.isArray(parsed) && parsed.length > 0) savedRois = parsed;
    } catch(e){}
  }

  let params = { hoursPerMonth: 160, weeksPerYear: 52 }
  if (serverUser?.day2Data?.parameters) {
    try { 
      const p = JSON.parse(serverUser.day2Data.parameters)
      if(p.hoursPerMonth || p.weeksPerYear) {
        params = { 
          hoursPerMonth: p.hoursPerMonth || 160, 
          weeksPerYear: p.weeksPerYear || 52 
        }
      }
    } catch(e){}
  }

  let day5Top3: any[] = []
  if (serverUser?.day5Data?.priorities) {
    try {
      const day5 = JSON.parse(serverUser.day5Data.priorities)
      day5Top3 = day5.filter((s:any) => s.isTop3).slice(0, 3)
    } catch(e){}
  }

  let defaultAvgSalary = 12000000;
  if (serverUser?.day2Data?.salaryData) {
    try {
      const sData = JSON.parse(serverUser.day2Data.salaryData);
      let totalSalary = 0;
      let totalEmployees = 0;
      if (Array.isArray(sData)) {
        sData.forEach((row: any) => {
          const count = parseInt(row.count) || 0;
          const salary = parseFloat(row.salary) || 0;
          totalSalary += salary * count;
          totalEmployees += count;
        });
      }
      if (totalEmployees > 0 && totalSalary > 0) {
        defaultAvgSalary = Math.round(totalSalary / totalEmployees);
      }
    } catch(e) {}
  }

  const targetCount = savedRois.length > 0
    ? savedRois.length
    : (day5Top3.length > 0 ? day5Top3.length : 1);

  let rois: ROISolution[] = Array(targetCount).fill(0).map((_, i) => {
    const existingDay6 = savedRois[i] || {};
    const d5Item = day5Top3[i] || {};
    
    return {
      id: `sol-${i+1}`,
      name: d5Item.solution || d5Item.problem || existingDay6.name || `Giải pháp #${i+1}`,
      employees: existingDay6.employees !== undefined && existingDay6.employees !== 0 ? existingDay6.employees : 1,
      hoursPerWeek: parseFloat(d5Item.hoursImpact) || existingDay6.hoursPerWeek || 8,
      aiReplacementPct: existingDay6.aiReplacementPct !== undefined && existingDay6.aiReplacementPct !== 0 ? existingDay6.aiReplacementPct : 60,
      avgSalaryMonth: existingDay6.avgSalaryMonth !== undefined && existingDay6.avgSalaryMonth !== 0 ? existingDay6.avgSalaryMonth : defaultAvgSalary,
      implementationCost: existingDay6.implementationCost !== undefined && existingDay6.implementationCost !== 0 ? existingDay6.implementationCost : 15000000,
      extraRevenuePerHour: existingDay6.extraRevenuePerHour || 0,
    }
  });

  const [solutions, setSolutions] = useState<ROISolution[]>(rois)
  const [globalParams, setGlobalParams] = useState(params)
  const [loading, setLoading] = useState(false)
  const router = useRouter()


  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/days/6', {
        method: 'POST', body: JSON.stringify({ roiData: JSON.stringify(solutions) })
      })
      if (res.ok) { router.refresh(); router.push('/day-7'); }
    } finally {
      setLoading(false)
    }
  }

  const updateSolution = (id: string, field: keyof ROISolution, value: any) => {
    setSolutions(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const formatVND = (num: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0)

  // Calcs
  let totalNam1Savings = 0
  let totalNam1Revenue = 0
  let totalNam1Value = 0
  let totalInvestment = 0

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{fontSize: '1.125rem', color: 'var(--muted)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem'}}>Ngày 6: Tính ROI</h1>
        <p>Biến 3 Chiến thắng nhanh từ Ngày 5 thành những con số tài chính biết nói.</p>
      </header>

      <div className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {solutions.map((sol, i) => {
            const totalHoursWeek = sol.employees * sol.hoursPerWeek
            const hoursSavedWeek = totalHoursWeek * (sol.aiReplacementPct / 100)
            const hourlyWage = sol.avgSalaryMonth / globalParams.hoursPerMonth
            const savingsWeek = hoursSavedWeek * hourlyWage
            const fteSaved = hoursSavedWeek / 40 // assuming standard 40h/week for FTE metric

            const savingsYear = savingsWeek * globalParams.weeksPerYear
            const revenueYear = sol.extraRevenuePerHour * hoursSavedWeek * globalParams.weeksPerYear
            const totalValueYear = savingsYear + revenueYear
            
            const roiPct = sol.implementationCost > 0 ? (totalValueYear / sol.implementationCost) * 100 : 0
            const paybackMonths = totalValueYear > 0 ? (sol.implementationCost / totalValueYear) * 12 : 0

            totalNam1Savings += savingsYear
            totalNam1Revenue += revenueYear
            totalNam1Value += totalValueYear
            totalInvestment += sol.implementationCost

            return (
              <div key={sol.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.8rem', color: 'var(--success)', whiteSpace: 'normal', overflowWrap: 'anywhere', lineHeight: 1.4 }}>
                  #{i+1}: {sol.name}
                </h3>
                
                <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Thông Tin Đầu Vào (Bạn Điền)</div>
                  
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'block' }}>Số NV thực hiện</label>
                    <input type="number" className="input-field" style={{ padding: '8px' }} value={sol.employees} onChange={e => updateSolution(sol.id, 'employees', parseFloat(e.target.value)||0)} />
                  </div>
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'block' }}>Giờ/tuần mỗi NV dành cho việc này</label>
                    <input type="number" className="input-field" style={{ padding: '8px' }} value={sol.hoursPerWeek} onChange={e => updateSolution(sol.id, 'hoursPerWeek', parseFloat(e.target.value)||0)} />
                  </div>
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'block' }}>% AI có thể làm thay (30-70%)</label>
                    <input type="number" className="input-field" style={{ padding: '8px' }} value={sol.aiReplacementPct} onChange={e => updateSolution(sol.id, 'aiReplacementPct', parseFloat(e.target.value)||0)} />
                  </div>
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'block' }}>Lương TB/tháng của NV (VND)</label>
                    <input type="number" className="input-field" style={{ padding: '8px' }} value={sol.avgSalaryMonth} onChange={e => updateSolution(sol.id, 'avgSalaryMonth', parseFloat(e.target.value)||0)} />
                  </div>
                  <div style={{ marginBottom: '0.8rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'block' }}>Chi phí triển khai ước tính (VND)</label>
                    <input type="number" className="input-field" style={{ padding: '8px' }} value={sol.implementationCost} onChange={e => updateSolution(sol.id, 'implementationCost', parseFloat(e.target.value)||0)} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'block' }}>Giá trị DT mới mỗi giờ NV tạo ra (VND)</label>
                    <input type="number" className="input-field" style={{ padding: '8px' }} value={sol.extraRevenuePerHour} onChange={e => updateSolution(sol.id, 'extraRevenuePerHour', parseFloat(e.target.value)||0)} />
                  </div>
                </div>

                <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--card-border)' }}>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Tính Toán Trung Gian (Tự Động)</div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{color: 'var(--muted)', fontSize: '0.85rem'}}>Tổng giờ/tuần:</span>
                    <span style={{fontWeight: 600}}>{totalHoursWeek.toFixed(1)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{color: 'var(--muted)', fontSize: '0.85rem'}}>Giờ tiết kiệm/tuần:</span>
                    <span style={{fontWeight: 600, color: 'var(--success)'}}>{hoursSavedWeek.toFixed(1)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{color: 'var(--muted)', fontSize: '0.85rem'}}>Lương theo giờ (VND):</span>
                    <span style={{fontWeight: 600}}>{formatVND(hourlyWage)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{color: 'var(--muted)', fontSize: '0.85rem'}}>Tiết kiệm/tuần (VND):</span>
                    <span style={{fontWeight: 600}}>{formatVND(savingsWeek)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{color: 'var(--muted)', fontSize: '0.85rem'}}>FTE tiết kiệm (nhân sự):</span>
                    <span style={{fontWeight: 600}}>{fteSaved.toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--success)' }}>
                  <div style={{ color: 'var(--success)', fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: 600 }}>KẾT QUẢ ROI CHUẨN</div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{color: 'var(--muted)', fontSize: '0.85rem'}}>Tiết kiệm Chi Phí/Năm:</span>
                    <span style={{fontWeight: 600}}>{formatVND(savingsYear)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{color: 'var(--muted)', fontSize: '0.85rem'}}>Doanh thu thêm/Năm:</span>
                    <span style={{fontWeight: 600}}>{formatVND(revenueYear)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px dotted var(--card-border)' }}>
                    <span style={{color: 'var(--muted)', fontSize: '0.85rem'}}>Tổng Giá Trị/Năm:</span>
                    <span style={{fontWeight: 700, color: 'var(--success)', fontSize: '1.1rem'}}>{formatVND(totalValueYear)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{color: 'var(--muted)', fontSize: '0.85rem'}}>% ROI Năm Đầu:</span>
                    <span style={{fontWeight: 700, color: 'var(--warning)', fontSize: '1.2rem'}}>{roiPct.toFixed(0)}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{color: 'var(--muted)', fontSize: '0.85rem'}}>Thời gian hoàn vốn:</span>
                    <span style={{fontWeight: 600}}>{paybackMonths.toFixed(1)} tháng</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div style={{ background: '#000', padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h4 style={{ color: 'var(--muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>🎯 TỔNG CỘNG 3 GIẢI PHÁP</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem', marginTop: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '4px' }}>TỔNG CHI PHÍ ĐẦU TƯ</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{formatVND(totalInvestment)}</div>
            </div>
            <div style={{ width: '1px', background: 'var(--card-border)' }}></div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '4px' }}>TỔNG LỢI ÍCH 1 NĂM</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--success)' }}>{formatVND(totalNam1Value)}</div>
            </div>
            <div style={{ width: '1px', background: 'var(--card-border)' }}></div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '4px' }}>TRUNG BÌNH ROI NĂM ĐẦU</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--warning)' }}>{totalInvestment > 0 ? ((totalNam1Value / totalInvestment) * 100).toFixed(0) : 0}%</div>
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button className="btn-primary" onClick={handleSave} disabled={loading} style={{ width: '100%', maxWidth: '300px' }}>
            {loading ? 'Đang lưu...' : 'Hoàn thành Mảnh Bức Tranh Số 6'}
          </button>
        </div>
      </div>
    </div>
  )
}
