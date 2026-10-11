'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const QUESTIONS = [
  { q: "Nhân sự mất nhiều thời gian cho tác vụ thủ công lặp lại?", hint: "Gõ báo giá, copy paste, lọc Excel, trả lời tin nhắn mẫu - Mấy giờ/ngày?" },
  { q: "Dữ liệu giữa các khâu có bị đứt gãy, thiếu chính xác hoặc thất lạc?", hint: "Kho lệch số, quên đơn, mất bao lâu để tìm lại tài liệu/hợp đồng cũ?" },
  { q: "Tốc độ phản hồi và chăm sóc khách hàng có bị chậm trễ?", hint: "Khách hỏi giá/hỗ trợ phải chờ bao lâu? Có bị sót tin nhắn khi đông khách?" },
  { q: "Quy trình nội bộ có gây nhầm lẫn / sai sót thường xuyên?", hint: "Báo giá nhầm, giao nhầm hàng, thiếu bước kiểm tra chất lượng trước khi gửi?" },
  { q: "Đội ngũ (hoặc Founder) có bị quá tải với các việc gõ phím / giấy tờ?", hint: "Dành mấy % thời gian cho việc hành chính thay vì tạo doanh thu?" },
  { q: "Kiến thức và kinh nghiệm đang nằm trong đầu cá nhân, thiếu SOP chuẩn?", hint: "Nếu người đó nghỉ/bận thì khâu đó có bị tê liệt hoặc đình trệ không?" },
  { q: "Khách hàng có phàn nàn vì quy trình của bạn chậm chạp hoặc thiếu chuyên nghiệp?", hint: "Có trường hợp khách hủy đơn hoặc không quay lại vì trải nghiệm chậm không?" }
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
      if (res.ok) { router.refresh(); router.push('/day-2'); }
    } finally {
      setLoading(false)
    }
  }

  const updateProblem = (id: number, field: string, value: string) => {
    setTop3Problems(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  const getEvaluation = () => {
    if (totalScore <= 14) {
      return { 
        text: "Nền tảng Sẵn Sàng Cao", 
        color: "var(--success)",
        desc: "Quy trình rõ ràng, ít tắc nghẽn. Ưu tiên tự động hóa các tác vụ lặp để giải phóng tối đa sức lao động."
      }
    }
    if (totalScore <= 25) {
      return { 
        text: "Nền tảng Trung Bình", 
        color: "#f5a623",
        desc: "Có điểm nghẽn cục bộ. Khuyến nghị chỉ tập trung thí điểm 1-2 khâu lãng phí thời gian nhất, tránh làm AI dàn trải."
      }
    }
    return { 
      text: "Báo Động Quy Trình Nội Bộ", 
      color: "var(--error)",
      desc: "CẢNH BÁO: Quy trình còn phân tán hoặc giao việc miệng. Cần chuẩn hóa dữ liệu & SOP trước, CHƯA NÊN vội vã mua công cụ AI kẻo lãng phí ngân sách."
    }
  }

  const evalResult = getEvaluation()

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{fontSize: '1.125rem', color: 'var(--muted)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem'}}>Ngày 1: Sự Thật</h1>
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
            <h3>TỔNG ĐIỂM SẴN SÀNG: <span style={{fontSize: '2.5rem', display: 'block', margin: '0.5rem 0', fontWeight: 700}}>{totalScore}<span style={{fontSize: '1.2rem', color: 'var(--muted)'}}>/35</span></span></h3>
            <p style={{ color: evalResult.color, fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.5rem' }}>ĐÁNH GIÁ: {evalResult.text}</p>
            <p style={{ color: 'var(--foreground)', fontSize: '0.95rem', maxWidth: '650px', margin: '0 auto 1rem auto', lineHeight: 1.6 }}>{evalResult.desc}</p>
            <p style={{ color: 'var(--muted)', fontSize: '0.8rem', borderTop: '1px dashed var(--card-border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
              Thang chuẩn: 7-14 (Sẵn sàng cao) | 15-25 (Trung bình) | 26-35 (Báo động quy trình, chuẩn hóa trước khi làm AI)
            </p>
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
