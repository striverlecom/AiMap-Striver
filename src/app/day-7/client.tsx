'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Day7Client({ serverUser }: { serverUser: any }) {
  const u = serverUser || {}
  
  let initialRoadmap = {
    phases: [
      { id: 1, period: '🚀 LÀM NGAY (Tuần 1-4)', task: '', savings: '', owner: '', status: 'Chưa' },
      { id: 2, period: '🏃‍♂️ LÀM TIẾP (Tháng 2-3)', task: '', savings: '', owner: '', status: 'Chưa' },
      { id: 3, period: '🚶‍♂️ LÀM SAU (Tháng 4-6)', task: '', savings: '', owner: '', status: 'Chưa' },
      { id: 4, period: '🔭 DÀI HẠN (Tháng 7-12)', task: '', savings: '', owner: '', status: 'Chưa' }
    ],
    week1Actions: [
      { id: 1, action: '', deadline: '', expected: '' },
      { id: 2, action: '', deadline: '', expected: '' },
      { id: 3, action: '', deadline: '', expected: '' }
    ]
  }

  if (u?.day7Data?.roadmap) {
    try {
      const parsed = JSON.parse(u.day7Data.roadmap)
      initialRoadmap = {
        ...initialRoadmap,
        phases: Array.isArray(parsed.phases) ? parsed.phases : initialRoadmap.phases,
        week1Actions: Array.isArray(parsed.week1Actions) ? parsed.week1Actions : initialRoadmap.week1Actions
      }
    } catch(e){}
  }

  let employees = 0
  if (u?.day2Data?.salaryData) {
    try { 
      const parsed = JSON.parse(u.day2Data.salaryData)
      if (Array.isArray(parsed)) parsed.forEach((row:any) => employees += (parseInt(row.count)||0)) 
    } catch(e){}
  }
  
  let issues = 0
  if (u?.day4Data?.mapData) {
    try { 
      const md = JSON.parse(u.day4Data.mapData)
      Object.values(md).forEach((arr:any) => {
        if (Array.isArray(arr)) arr.forEach((r:any) => { if(r.wastedTime || r.qualityRisk || r.issues) issues++ })
      })
    } catch(e){}
  }

  let t1='', t2='', t3=''
  if (u?.day5Data?.priorities) {
    try {
      const parsed = JSON.parse(u.day5Data.priorities);
      if (Array.isArray(parsed)) {
        const top = parsed.filter((s:any) => s.isTop3).slice(0,3)
        t1 = top[0]?.solution || top[0]?.problem || ''
        t2 = top[1]?.solution || top[1]?.problem || ''
        t3 = top[2]?.solution || top[2]?.problem || ''
      }
    } catch(e){}
  }

  let totalVal = 0
  if (u?.day6Data?.roiData) {
    try {
      const parsed = JSON.parse(u.day6Data.roiData);
      if (Array.isArray(parsed)) {
        parsed.forEach((sol:any) => {
          const hw = sol.employees * sol.hoursPerWeek * (sol.aiReplacementPct/100)
          const wg = sol.avgSalaryMonth / 160
          totalVal += (hw * wg * 52) + (sol.extraRevenuePerHour * hw * 52)
        })
      }
    } catch(e){}
  }

  const [roadmap, setRoadmap] = useState(initialRoadmap)
  const [summary, setSummary] = useState({
    scoreAI: u?.day1Data?.totalScore || 0,
    totalEmployees: employees,
    issueProcesses: issues,
    top1: t1, top2: t2, top3: t3,
    totalValueYear: totalVal
  })

  const [loading, setLoading] = useState(false)
  const router = useRouter()


  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/days/7', {
        method: 'POST', body: JSON.stringify({ roadmap: JSON.stringify(roadmap) })
      })
      if (res.ok) router.push('/results') // go strictly to Results Compilation 
    } finally {
      setLoading(false)
    }
  }

  const updatePhase = (id: number, field: string, value: any) => {
    setRoadmap(prev => ({
      ...prev,
      phases: prev.phases.map(p => p.id === id ? { ...p, [field]: value } : p)
    }))
  }

  const updateAction = (id: number, field: string, value: any) => {
    setRoadmap(prev => ({
      ...prev,
      week1Actions: prev.week1Actions.map(a => a.id === id ? { ...a, [field]: value } : a)
    }))
  }

  const formatVND = (num: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0)

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{fontSize: '2.5rem'}}>Ngày 7: Kế Hoạch & Lộ Trình</h1>
        <p>Lên khung hành động cụ thể để biến 6 ngày thu thập thành kết quả.</p>
      </header>

      <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* TÓM TẮT */}
        <div className="glass-panel" style={{ marginBottom: '3rem', border: '1px solid var(--success)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--success)', textTransform: 'uppercase' }}>Tóm Tắt Khám Sức Khỏe Doanh Nghiệp (Tự động)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div><span style={{color:'var(--muted)'}}>Điểm sẵn sàng AI (N1):</span> <strong style={{color:'var(--warning)'}}>{summary.scoreAI}/35</strong></div>
            <div><span style={{color:'var(--muted)'}}>Tổng nhân sự (N2):</span> <strong>{summary.totalEmployees} người</strong></div>
            <div><span style={{color:'var(--muted)'}}>Số quy trình có vấn đề (N4):</span> <strong style={{color:'var(--error)'}}>{summary.issueProcesses}</strong></div>
            <div style={{gridColumn: '1 / -1'}}><span style={{color:'var(--muted)'}}>Chiến thắng nhanh 1:</span> <strong>{summary.top1 || 'N/A'}</strong></div>
            <div style={{gridColumn: '1 / -1'}}><span style={{color:'var(--muted)'}}>Chiến thắng nhanh 2:</span> <strong>{summary.top2 || 'N/A'}</strong></div>
            <div style={{gridColumn: '1 / -1'}}><span style={{color:'var(--muted)'}}>Chiến thắng nhanh 3:</span> <strong>{summary.top3 || 'N/A'}</strong></div>
            <div style={{gridColumn: '1 / -1', fontSize: '1.2rem'}}><span style={{color:'var(--muted)'}}>Tổng giá trị / năm mang lại (N6):</span> <strong style={{color:'var(--success)'}}>{formatVND(summary.totalValueYear)}</strong></div>
          </div>
        </div>

        {/* LỘ TRÌNH TRIỂN KHAI */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.8rem' }}>Lộ Trình Triển Khai</h2>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table className="responsive-table" style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--card-bg)' }}>
                  <th style={{ padding: '1rem' }}>Giai đoạn</th>
                  <th style={{ padding: '1rem' }}>Làm gì</th>
                  <th style={{ padding: '1rem' }}>Tiết kiệm dự kiến</th>
                  <th style={{ padding: '1rem' }}>Ai chịu trách nhiệm</th>
                  <th style={{ padding: '1rem' }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {roadmap.phases.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 600, color: i===0?'var(--success)': i===1?'var(--warning)': 'var(--foreground)' }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px', textAlign: 'left'}}>Giai đoạn:</div>
                      {p.period}
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Làm gì:</div>
                      <input className="input-field" style={{ padding: '12px 16px' }} value={p.task} onChange={e => updatePhase(p.id, 'task', e.target.value)} />
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Tiết kiệm dự kiến:</div>
                      <input className="input-field" style={{ padding: '12px 16px' }} value={p.savings} onChange={e => updatePhase(p.id, 'savings', e.target.value)} />
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Ai chịu trách nhiệm:</div>
                      <input className="input-field" style={{ padding: '12px 16px' }} value={p.owner} onChange={e => updatePhase(p.id, 'owner', e.target.value)} />
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Trạng thái:</div>
                      <select className="input-field" style={{ padding: '12px 16px', WebkitAppearance: 'none' }} value={p.status} onChange={e => updatePhase(p.id, 'status', e.target.value)}>
                        <option value="Chưa">Chưa BĐ</option>
                        <option value="Đang làm">Đang làm</option>
                        <option value="Xong">Hoàn thành</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3 HÀNH ĐỘNG TUẦN ĐẦU */}
        <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--warning)' }}>3 Hành Động Cụ Thể Tuần Đầu Tiên</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>LƯU Ý: KHÔNG được ghi "nghiên cứu thêm". Phải CỤ THỂ: hành động + deadline rõ ràng.</p>
          
          <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px dotted var(--card-border)' }}>
                <th style={{ padding: '0.5rem', color: 'var(--muted)' }}>Hành động cụ thể</th>
                <th style={{ padding: '0.5rem', color: 'var(--muted)', width: '25%' }}>Deadline</th>
                <th style={{ padding: '0.5rem', color: 'var(--muted)', width: '35%' }}>Kết quả mong đợi</th>
              </tr>
            </thead>
            <tbody>
              {roadmap.week1Actions.map(a => (
                <tr key={a.id}>
                  <td style={{ padding: '0.5rem' }}>
                    <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Hành động cụ thể:</div>
                    <input className="input-field" style={{ padding: '12px 16px' }} value={a.action} onChange={e => updateAction(a.id, 'action', e.target.value)} />
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Deadline:</div>
                    <input className="input-field" style={{ padding: '12px 16px' }} value={a.deadline} onChange={e => updateAction(a.id, 'deadline', e.target.value)} />
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Kết quả mong đợi:</div>
                    <input className="input-field" style={{ padding: '12px 16px' }} value={a.expected} onChange={e => updateAction(a.id, 'expected', e.target.value)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <button className="btn-primary" onClick={handleSave} disabled={loading} style={{ width: '100%', maxWidth: '300px', padding: '1rem', fontSize: '1.1rem' }}>
            {loading ? 'Đang Xử Lý...' : 'Xuất Báo Cáo Kiểm Toán (Hoàn Tất)'}
          </button>
        </div>
      </div>
    </div>
  )
}
