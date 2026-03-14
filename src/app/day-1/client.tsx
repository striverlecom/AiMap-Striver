'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const QUESTIONS = [
  { q: "Nhân viên mất nhiều thời gian cho công việc lặp lại?", hint: "Việc gì? Ai làm? Mấy giờ?" },
  { q: "Tốc độ ra quyết định có bị chậm vì thiếu dữ liệu?", hint: "Quyết định gì? Chờ ai? Mấy ngày?" },
  { q: "Khách hàng phản hồi có được xử lý nhanh chóng?", hint: "Bằng chứng cụ thể?" },
  { q: "Quy trình nội bộ có gây nhầm lẫn / sai sót thường xuyên?", hint: "Bằng chứng cụ thể?" },
  { q: "Đội ngũ có đang quá tải với công việc hành chính?", hint: "Bộ phận nào? Mấy % thời gian làm hành chính?" },
  { q: "Dữ liệu có được tổ chức tốt và dễ truy cập?", hint: "Bằng chứng cụ thể?" },
  { q: "Công ty có theo kịp đối thủ về mặt công nghệ?", hint: "Bằng chứng cụ thể?" }
]

export default function Day1Client({ serverUser }: { serverUser: any }) {
  const d = serverUser?.day1Data || {}
  
  let initialTop3 = [
    { id: 1, problem: '', victim: '', hoursLost: '', description: '' },
    { id: 2, problem: '', victim: '', hoursLost: '', description: '' },
    { id: 3, problem: '', victim: '', hoursLost: '', description: '' }
  ]
  try {
    const parsed = JSON.parse(d.top3Problems || '[]')
    if (Array.isArray(parsed) && parsed.length > 0) initialTop3 = parsed
  } catch(e) {}

  let initialEvidence = Array(7).fill('')
  try {
    const parsed = JSON.parse(d.evidenceData || '[]')
    if (Array.isArray(parsed) && parsed.length > 0) {
       initialEvidence = initialEvidence.map((val, i) => parsed[i] || val)
    }
  } catch(e) {}

  const [answers, setAnswers] = useState<number[]>([d.q1||3, d.q2||3, d.q3||3, d.q4||3, d.q5||3, d.q6||3, d.q7||3])
  const [evidence, setEvidence] = useState<string[]>(initialEvidence)
  const [top3Problems, setTop3Problems] = useState(initialTop3)
  const [notes, setNotes] = useState(d.notes || '')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const totalScore = answers.reduce((a, b) => a + b, 0)



  const handleSave = async () => {
    setLoading(true)
    try {
      const payload = {
        q1: answers[0], q2: answers[1], q3: answers[2], q4: answers[3],
        q5: answers[4], q6: answers[5], q7: answers[6], totalScore,
        evidenceData: JSON.stringify(evidence),
        top3Problems: JSON.stringify(top3Problems),
        notes
      }
      const res = await fetch('/api/days/1', {
        method: 'POST', body: JSON.stringify(payload)
      })
      if (res.ok) router.push('/day-2')
    } finally {
      setLoading(false)
    }
  }

  const updateProblem = (id: number, field: string, value: string) => {
    setTop3Problems(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  const getEvaluation = () => {
    if (totalScore <= 14) return { text: "Tốt", color: "var(--success)" }
    if (totalScore <= 25) return { text: "Trung bình", color: "#f5a623" }
    return { text: "Cần AI gấp", color: "var(--error)" }
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{fontSize: '2.5rem'}}>Ngày 1: Sự Thật</h1>
        <p>Mục tiêu: Biết chính xác doanh nghiệp đang ở đâu. Không đoán - chỉ sự thật.</p>
      </header>

      <div className="fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <section className="glass-panel" style={{ marginBottom: '3rem' }}>
          <h2 style={{borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', marginBottom: '2rem', color: 'var(--success)'}}>BẢNG TỰ CHẤM ĐIỂM (1-5)</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>1 = Rất tốt, không có vấn đề &nbsp;|&nbsp; 3 = Trung bình, có thể cải thiện &nbsp;|&nbsp; 5 = Nghiêm trọng, cần xử lý ngay</p>
          
          {QUESTIONS.map((q, idx) => (
            <div key={idx} style={{ marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--card-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem' }}>
                <strong style={{ fontSize: '1.1rem', flex: 1 }}>{idx + 1}. {q.q}</strong>
                <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--warning)', width: '30px', textAlign: 'right' }}>{answers[idx]}</span>
              </div>
              <input 
                type="range" min="1" max="5" step="1" 
                value={answers[idx]} 
                onChange={e => {
                  const newAns = [...answers]
                  newAns[idx] = parseInt(e.target.value)
                  setAnswers(newAns)
                }}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--foreground)', marginBottom: '0.5rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1rem' }}>
                <span>1 - Tốt</span>
                <span>5 - Nghiêm trọng</span>
              </div>
              <input 
                className="input-field" 
                placeholder={`Bằng chứng cụ thể: ${q.hint}`} 
                style={{ padding: '10px', fontSize: '0.9rem', background: 'var(--background)' }}
                value={evidence[idx] || ''}
                onChange={e => {
                  const newEv = [...evidence]
                  newEv[idx] = e.target.value
                  setEvidence(newEv)
                }}
              />
            </div>
          ))}
          
          <div style={{ background: 'var(--background)', padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', marginTop: '2rem', border: '1px solid var(--card-border)' }}>
            <h3>TỔNG ĐIỂM: <span style={{fontSize: '2.5rem', display: 'block', margin: '0.5rem 0'}}>{totalScore}</span></h3>
            <p style={{ color: getEvaluation().color, fontWeight: 600, fontSize: '1.25rem' }}>ĐÁNH GIÁ: {getEvaluation().text}</p>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>(7-14: Tốt | 15-25: Trung bình | 26-35: Cần AI gấp)</p>
          </div>
        </section>

        <section className="glass-panel" style={{ marginBottom: '3rem' }}>
          <h2 style={{borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', marginBottom: '2rem', color: 'var(--error)'}}>🔴 3 VẤN ĐỀ LỚN NHẤT PHÁT HIỆN</h2>
          
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--background)' }}>
                  <th style={{ padding: '1rem', color: 'var(--muted)', width: '25%' }}>Vấn đề cụ thể</th>
                  <th style={{ padding: '1rem', color: 'var(--muted)', width: '20%' }}>Ai chịu ảnh hưởng</th>
                  <th style={{ padding: '1rem', color: 'var(--muted)', width: '15%' }}>Giờ/tuần lãng phí</th>
                  <th style={{ padding: '1rem', color: 'var(--muted)' }}>Mô tả chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {top3Problems.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '0.5rem' }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Vấn đề cụ thể:</div>
                      <input className="input-field" placeholder="Nhập vấn đề..." value={p.problem} onChange={e => updateProblem(p.id, 'problem', e.target.value)} />
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Ai chịu ảnh hưởng:</div>
                      <input className="input-field" placeholder="Nhân sự/Phòng ban..." value={p.victim} onChange={e => updateProblem(p.id, 'victim', e.target.value)} />
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Giờ/tuần lãng phí:</div>
                      <input className="input-field" placeholder="Số giờ..." value={p.hoursLost} onChange={e => updateProblem(p.id, 'hoursLost', e.target.value)} />
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Mô tả chi tiết:</div>
                      <input className="input-field" placeholder="Mô tả..." value={p.description} onChange={e => updateProblem(p.id, 'description', e.target.value)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="glass-panel" style={{ marginBottom: '2rem' }}>
          <h2 style={{borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', marginBottom: '1.5rem', color: 'var(--foreground)'}}>📝 GHI CHÚ & NHẬN XÉT</h2>
          <textarea 
            className="input-field" 
            rows={4} 
            placeholder="Nhập ghi chú thêm..." 
            value={notes} 
            onChange={e => setNotes(e.target.value)}
          />
        </section>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button className="btn-primary" onClick={handleSave} disabled={loading} style={{ width: '100%', maxWidth: '300px' }}>
            {loading ? 'Đang lưu...' : 'Hoàn thành Sự Thật Ngày 1'}
          </button>
        </div>
      </div>
    </div>
  )
}
