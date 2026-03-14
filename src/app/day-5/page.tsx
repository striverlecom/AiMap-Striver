'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Day5Page() {
  const [solutions, setSolutions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [top3Count, setTop3Count] = useState(0)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/users/me').then(res => res.json()).then(data => {
      let loadedSolutions: any[] = []
      
      // If Day 5 data exists, load it
      if (data.user?.day5Data?.priorities) {
        try {
          const parsed = JSON.parse(data.user.day5Data.priorities)
          if (Array.isArray(parsed) && parsed.length > 0) {
            loadedSolutions = parsed
          }
        } catch(e){}
      }

      // If no Day 5 data, auto-generate from Day 4 issues
      if (loadedSolutions.length === 0 && data.user?.day4Data?.mapData) {
        try {
          const mapData = JSON.parse(data.user.day4Data.mapData)
          let idCounter = 1;
          ['acquisition', 'delivery', 'support'].forEach(key => {
            if(mapData[key]) {
              mapData[key].forEach((row: any) => {
                if (row.issues && row.issues.trim() !== '') {
                  loadedSolutions.push({
                    id: idCounter++,
                    problem: row.issues,
                    solution: '',
                    hoursImpact: row.hours || 0,
                    impact: 3,
                    effort: 3,
                    isTop3: false,
                    assignee: '',
                    notes: ''
                  })
                }
              })
            }
          })
        } catch(e){}
      }
      
      setSolutions(loadedSolutions)
      setTop3Count(loadedSolutions.filter(s => s.isTop3).length)
    })
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/days/5', {
        method: 'POST', body: JSON.stringify({ priorities: JSON.stringify(solutions) })
      })
      if (res.ok) router.push('/day-6')
    } finally {
      setLoading(false)
    }
  }

  const updateRow = (id: number, field: string, value: any) => {
    setSolutions(prev => {
      let newCount = top3Count;
      if (field === 'isTop3') {
        const row = prev.find(r => r.id === id);
        if (value && !row.isTop3) newCount++;
        else if (!value && row.isTop3) newCount--;
        
        if (newCount > 3) return prev; // prevent more than 3
      }
      
      const newSols = prev.map(row => row.id === id ? { ...row, [field]: value } : row)
      if (field === 'isTop3') {
        setTop3Count(newSols.filter(s => s.isTop3).length)
      }
      return newSols;
    })
  }

  const getCategory = (impact: number, effort: number) => {
    if (impact >= 3 && effort <= 3) return { label: '🔥 Quick Win', color: 'var(--success)' }
    if (impact >= 3 && effort > 3) return { label: '🏗️ Big Swing', color: 'var(--warning)' }
    return { label: '⏸️ Skip', color: 'var(--muted)' }
  }

  const top3Solutions = solutions.filter(s => s.isTop3).slice(0, 3)

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{fontSize: '2.5rem'}}>Ngày 5: Ưu Tiên</h1>
        <p>Lọc ra 3 "Chiến thắng nhanh" (Quick Win) từ các vấn đề đã tìm thấy ở Ngày 4.</p>
        <div style={{ marginTop: '1rem', color: top3Count === 3 ? 'var(--success)' : 'var(--warning)' }}>
          Đã chọn TOP 3: {top3Count}/3
        </div>
      </header>

      <div className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="glass-panel" style={{ overflowX: 'auto', marginBottom: '3rem', width: '100%' }}>
          <table className="responsive-table" style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                <th style={{ padding: '1rem', color: 'var(--muted)', width: '25%' }}>Vấn đề (Từ N4)</th>
                <th style={{ padding: '1rem', color: 'var(--muted)' }}>Giải pháp AI đề xuất</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', width: '120px', textAlign: 'center' }}>NV x Giờ/tuần lãng phí</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', width: '100px', textAlign: 'center' }}>Tác động<br/>(1-5)</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', width: '100px', textAlign: 'center' }}>Khó khăn<br/>(1-5)</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', width: '120px', textAlign: 'center' }}>Trạng thái</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', width: '80px', textAlign: 'center' }}>Top 3</th>
              </tr>
            </thead>
            <tbody>
              {solutions.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>Không tìm thấy vấn đề nào từ Ngày 4. Vui lòng quay lại Ngày 4 để điền "Vấn đề".</td></tr>
              ) : solutions.map((row) => {
                const cat = getCategory(row.impact, row.effort)
                return (
                  <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: row.isTop3 ? 'rgba(0, 255, 0, 0.05)' : 'transparent' }}>
                    <td style={{ padding: '1rem 0.5rem', fontSize: '0.9rem' }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Vấn đề (Từ N4):</div>
                      <div style={{ padding: '8px 0' }}>{row.problem}</div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Giải pháp AI đề xuất:</div>
                      <input className="input-field" style={{ padding: '8px' }} placeholder="VD: ChatGPT Plus..." value={row.solution} onChange={e => updateRow(row.id, 'solution', e.target.value)} />
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'center', color: 'var(--warning)', fontWeight: 600 }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px', textAlign: 'left'}}>Giờ/tuần lãng phí:</div>
                      <div style={{ padding: '8px 0' }}>{row.hoursImpact}</div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Tác động (1-5):</div>
                      <input type="number" min="1" max="5" className="input-field" style={{ padding: '8px', textAlign: 'center' }} value={row.impact} onChange={e => updateRow(row.id, 'impact', parseInt(e.target.value)||1)} />
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Khó khăn (1-5):</div>
                      <input type="number" min="1" max="5" className="input-field" style={{ padding: '8px', textAlign: 'center' }} value={row.effort} onChange={e => updateRow(row.id, 'effort', parseInt(e.target.value)||1)} />
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'center', color: cat.color, fontWeight: 600, fontSize: '0.85rem' }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px', textAlign: 'left'}}>Trạng thái:</div>
                      <div style={{ padding: '8px 0' }}>{cat.label}</div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px', textAlign: 'left'}}>Chọn vào Top 3?</div>
                      <input type="checkbox" style={{ transform: 'scale(1.5)', cursor: row.isTop3 || top3Count < 3 ? 'pointer' : 'not-allowed', margin: '8px 0' }} checked={row.isTop3} onChange={e => updateRow(row.id, 'isTop3', e.target.checked)} disabled={!row.isTop3 && top3Count >= 3} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* TOP 3 SUMMARY TABLE */}
        {top3Solutions.length > 0 && (
          <div className="glass-panel" style={{ overflowX: 'auto', marginBottom: '3rem', border: '1px solid var(--success)', width: '100%' }}>
            <h2 style={{borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', margin: '0 0 1.5rem 0', color: 'var(--success)'}}>🏆 Top 3 Quick Win (Tóm tắt chuyển sang Ngày 6)</h2>
            <table className="responsive-table" style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--background)' }}>
                  <th style={{ padding: '1rem', color: 'var(--muted)', width: '80px', textAlign: 'center' }}>Ưu tiên</th>
                  <th style={{ padding: '1rem', color: 'var(--muted)', width: '25%' }}>Tên giải pháp AI</th>
                  <th style={{ padding: '1rem', color: 'var(--muted)', width: '25%' }}>Vấn đề giải quyết</th>
                  <th style={{ padding: '1rem', color: 'var(--muted)', width: '150px' }}>NV phụ trách</th>
                  <th style={{ padding: '1rem', color: 'var(--muted)', width: '80px', textAlign: 'center' }}>Tác động</th>
                  <th style={{ padding: '1rem', color: 'var(--muted)' }}>Ghi chú / Mở rộng</th>
                </tr>
              </thead>
              <tbody>
                {top3Solutions.map((row, idx) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'center', fontWeight: 700, fontSize: '1.2rem', color: 'var(--success)' }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px', textAlign: 'left'}}>Ưu tiên:</div>
                      #{idx + 1}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Tên giải pháp AI:</div>
                      <div style={{ padding: '8px 0' }}>{row.solution || '(Chưa điền giải pháp)'}</div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Vấn đề giải quyết:</div>
                      <div style={{ padding: '8px 0' }}>{row.problem}</div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>NV phụ trách:</div>
                      <input className="input-field" style={{ padding: '8px' }} placeholder="Tên NV..." value={row.assignee || ''} onChange={e => updateRow(row.id, 'assignee', e.target.value)} />
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'center', fontWeight: 600, color: 'var(--warning)' }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px', textAlign: 'left'}}>Tác động:</div>
                      <div style={{ padding: '8px 0' }}>{row.impact}/5</div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Ghi chú / Mở rộng:</div>
                      <input className="input-field" style={{ padding: '8px' }} placeholder="Ghi chú thêm..." value={row.notes || ''} onChange={e => updateRow(row.id, 'notes', e.target.value)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div style={{ textAlign: 'center' }}>
          <button className="btn-primary" onClick={handleSave} disabled={loading || top3Count !== 3 && solutions.length >= 3} style={{ width: '100%', maxWidth: '300px' }}>
            {loading ? 'Đang lưu...' : 'Chốt 3 Chiến Thắng (Sang Ngày 6)'}
          </button>
          {(top3Count !== 3 && solutions.length >= 3) && <p style={{ color: 'var(--error)', marginTop: '1rem', fontSize: '0.9rem' }}>Vui lòng chọn đủ 3 giải pháp Top 3 (Quick Win).</p>}
        </div>
      </div>
    </div>
  )
}
