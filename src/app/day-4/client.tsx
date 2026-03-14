'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Day4Client({ serverUser }: { serverUser: any }) {
  let initialEngines = {
    acquisition: [{ id: 1, step: '', assignee: '', hours: 0, tools: '', issues: '', wastedTime: false, qualityRisk: false }],
    delivery: [{ id: 1, step: '', assignee: '', hours: 0, tools: '', issues: '', wastedTime: false, qualityRisk: false }],
    support: [{ id: 1, step: '', assignee: '', hours: 0, tools: '', issues: '', wastedTime: false, qualityRisk: false }]
  }

  const rawData = serverUser?.day4Data?.mapData;
  if (rawData) {
    try {
      const parsed = JSON.parse(rawData)
      initialEngines = {
        ...initialEngines,
        acquisition: Array.isArray(parsed.acquisition) ? parsed.acquisition : initialEngines.acquisition,
        delivery: Array.isArray(parsed.delivery) ? parsed.delivery : initialEngines.delivery,
        support: Array.isArray(parsed.support) ? parsed.support : initialEngines.support
      }
    } catch(e) {}
  }

  const [engines, setEngines] = useState(initialEngines)
  const [loading, setLoading] = useState(false)
  const router = useRouter()



  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/days/4', {
        method: 'POST', body: JSON.stringify({ mapData: JSON.stringify(engines) })
      })
      if (res.ok) router.push('/day-5')
    } finally {
      setLoading(false)
    }
  }

  const addRow = (engineKey: 'acquisition'|'delivery'|'support') => {
    setEngines(prev => ({
      ...prev,
      [engineKey]: [...prev[engineKey], { id: Date.now(), step: '', assignee: '', hours: 0, tools: '', issues: '', wastedTime: false, qualityRisk: false }]
    }))
  }

  const updateRow = (engineKey: 'acquisition'|'delivery'|'support', id: number, field: string, value: any) => {
    setEngines(prev => ({
      ...prev,
      [engineKey]: prev[engineKey].map(row => row.id === id ? { ...row, [field]: value } : row)
    }))
  }

  const removeRow = (engineKey: 'acquisition'|'delivery'|'support', id: number) => {
    setEngines(prev => ({
      ...prev,
      [engineKey]: prev[engineKey].filter(row => row.id !== id)
    }))
  }

  const engineTitles = {
    acquisition: '🚀 ĐỘNG CƠ 1: TÌM KHÁCH (Acquisition)',
    delivery: '📦 ĐỘNG CƠ 2: PHỤC VỤ (Delivery)',
    support: '❤️ ĐỘNG CƠ 3: CHĂM SÓC (Support)'
  }

  // Tính tổng thực tế:
  let totalWastedTime = 0
  let totalQualityRisk = 0
  let totalIssueProcesses = 0

  Object.values(engines).forEach(engineArr => {
    engineArr.forEach(row => {
      if (row.wastedTime) totalWastedTime++
      if (row.qualityRisk) totalQualityRisk++
      if (row.wastedTime || row.qualityRisk || row.issues.trim() !== '') totalIssueProcesses++
    })
  })

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{fontSize: '2.5rem'}}>Ngày 4: Sơ Đồ</h1>
        <p>Vẽ bản đồ vận hành (3 Động cơ). Mỗi bước đánh dấu một vấn đề rủi ro/lãng phí.</p>
      </header>

      <div className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {(['acquisition', 'delivery', 'support'] as const).map(engineKey => (
          <div key={engineKey} className="glass-panel" style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: 'var(--success)', marginBottom: '1.5rem', fontSize: '1.25rem' }}>{engineTitles[engineKey]}</h2>
            
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <th style={{ padding: '1rem', color: 'var(--muted)', fontWeight: 500 }}>Bước / Nhiệm vụ</th>
                    <th style={{ padding: '1rem', color: 'var(--muted)', fontWeight: 500, width: '120px' }}>Ai làm</th>
                    <th style={{ padding: '1rem', color: 'var(--muted)', fontWeight: 500, width: '100px' }}>Giờ/tuần</th>
                    <th style={{ padding: '1rem', color: 'var(--muted)', fontWeight: 500, width: '150px' }}>Công cụ</th>
                    <th style={{ padding: '1rem', color: 'var(--muted)', fontWeight: 500 }}>Vấn đề</th>
                    <th style={{ padding: '1rem', color: 'var(--muted)', fontWeight: 500, width: '100px', textAlign: 'center' }}>Lãng phí TG</th>
                    <th style={{ padding: '1rem', color: 'var(--muted)', fontWeight: 500, width: '100px', textAlign: 'center' }}>Rủi ro CL</th>
                    <th style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {engines[engineKey].map((row, idx) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Bước / Nhiệm vụ:</div>
                        <input className="input-field" style={{ padding: '12px 16px' }} value={row.step} onChange={e => updateRow(engineKey, row.id, 'step', e.target.value)} />
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Ai làm:</div>
                        <input className="input-field" style={{ padding: '12px 16px' }} value={row.assignee} onChange={e => updateRow(engineKey, row.id, 'assignee', e.target.value)} />
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Giờ/tuần:</div>
                        <input type="number" className="input-field" style={{ padding: '12px 16px' }} value={row.hours} onChange={e => updateRow(engineKey, row.id, 'hours', parseFloat(e.target.value)||0)} />
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Công cụ:</div>
                        <input className="input-field" style={{ padding: '12px 16px' }} value={row.tools} onChange={e => updateRow(engineKey, row.id, 'tools', e.target.value)} />
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Vấn đề:</div>
                        <input className="input-field" style={{ padding: '12px 16px' }} value={row.issues} onChange={e => updateRow(engineKey, row.id, 'issues', e.target.value)} />
                      </td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                        <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px', textAlign: 'left'}}>Lãng phí Thời GIAN?</div>
                        <input type="checkbox" style={{ transform: 'scale(1.5)', cursor: 'pointer', margin: '8px 0' }} checked={row.wastedTime} onChange={e => updateRow(engineKey, row.id, 'wastedTime', e.target.checked)} />
                      </td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                        <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px', textAlign: 'left'}}>Rủi ro CHẤT LƯỢNG?</div>
                        <input type="checkbox" style={{ transform: 'scale(1.5)', cursor: 'pointer', margin: '8px 0' }} checked={row.qualityRisk} onChange={e => updateRow(engineKey, row.id, 'qualityRisk', e.target.checked)} />
                      </td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                        <button onClick={() => removeRow(engineKey, row.id)} style={{ color: 'var(--error)', fontSize: '1.2rem', background: 'none', border: 'none', cursor: 'pointer', padding: '10px' }}>×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="btn-secondary" onClick={() => addRow(engineKey)} style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>+ Thêm Bước</button>
            </div>
          </div>
        ))}

        <div className="mobile-column-stack" style={{ background: '#111', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--card-border)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', textAlign: 'center' }}>
          <div style={{ padding: '1rem 0' }}>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Lãng phí TG</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--error)' }}>{totalWastedTime}</div>
          </div>
          <div className="mobile-col-borders" style={{ borderLeft: '1px solid var(--card-border)', borderRight: '1px solid var(--card-border)', padding: '1rem 0' }}>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Rủi ro CL</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--error)' }}>{totalQualityRisk}</div>
          </div>
          <div style={{ padding: '1rem 0' }}>
            <div style={{ color: 'var(--foreground)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>Có vấn đề</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--success)' }}>{totalIssueProcesses}</div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button className="btn-primary" onClick={handleSave} disabled={loading} style={{ width: '100%', maxWidth: '300px' }}>
            {loading ? 'Đang lưu...' : 'Hoàn thành Ngày 4'}
          </button>
        </div>
      </div>
    </div>
  )
}
