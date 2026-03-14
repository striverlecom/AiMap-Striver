'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Day3Client({ serverUser }: { serverUser: any }) {
  let initialBld = [{ id: 1, name: 'Sếp 1', role: 'Giám Đốc', q1: '', q2: '', q3: '', q4: '', q5: '' }]
  let initialNv = [{ id: 1, name: 'Nhân viên 1', role: 'Vận hành', q1: '', q2: '', q3: '', q4: '' }]
  let initialFindings = { commonProblems: '', hiddenKnowledge: '', mostTimeConsuming: '', mostFrustratingTool: '', goalGap: '' }
  
  const rawData = serverUser?.day3Data?.interviewData;
  if (rawData) {
    try {
      const parsed = JSON.parse(rawData)
      if (parsed.bldInterviews && parsed.bldInterviews.length > 0) initialBld = parsed.bldInterviews
      else if (parsed.bld) initialBld = [{ id: 1, name: parsed.bld.team1 || 'Sếp 1', role: 'Giám Đốc', q1: parsed.bld.q1 || '', q2: parsed.bld.q2 || '', q3: parsed.bld.q3 || '', q4: parsed.bld.q4 || '', q5: parsed.bld.q5 || '' }]
      
      if (parsed.nvInterviews && parsed.nvInterviews.length > 0) initialNv = parsed.nvInterviews
      else if (parsed.nv) initialNv = [{ id: 1, name: parsed.nv.team1 || 'Nhân viên 1', role: 'Vận hành', q1: parsed.nv.q1 || '', q2: parsed.nv.q2 || '', q3: parsed.nv.q3 || '', q4: parsed.nv.q4 || '' }]
      
      if (parsed.findings) initialFindings = { ...initialFindings, ...parsed.findings }
    } catch(e) {}
  }

  const [bldInterviews, setBldInterviews] = useState(initialBld)
  const [nvInterviews, setNvInterviews] = useState(initialNv)
  const [findings, setFindings] = useState(initialFindings)

  const [activeBld, setActiveBld] = useState(initialBld[0]?.id || 1)
  const [activeNv, setActiveNv] = useState(initialNv[0]?.id || 1)

  const [loading, setLoading] = useState(false)
  const router = useRouter()


  const handleSave = async () => {
    setLoading(true)
    try {
      const payload = { bldInterviews, nvInterviews, findings }
      const res = await fetch('/api/days/3', {
        method: 'POST', body: JSON.stringify({ interviewData: JSON.stringify(payload) })
      })
      if (res.ok) { router.refresh(); router.push('/day-4'); }
    } finally {
      setLoading(false)
    }
  }

  const addBld = () => {
    const newId = Date.now()
    setBldInterviews([...bldInterviews, { id: newId, name: `Lãnh đạo mới`, role: '', q1: '', q2: '', q3: '', q4: '', q5: '' }])
    setActiveBld(newId)
  }

  const addNv = () => {
    const newId = Date.now()
    setNvInterviews([...nvInterviews, { id: newId, name: `Nhân viên mới`, role: '', q1: '', q2: '', q3: '', q4: '' }])
    setActiveNv(newId)
  }

  const removeBld = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    if (bldInterviews.length > 1) {
      const filtered = bldInterviews.filter(b => b.id !== id)
      setBldInterviews(filtered)
      if (activeBld === id) setActiveBld(filtered[0].id)
    }
  }

  const removeNv = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    if (nvInterviews.length > 1) {
      const filtered = nvInterviews.filter(n => n.id !== id)
      setNvInterviews(filtered)
      if (activeNv === id) setActiveNv(filtered[0].id)
    }
  }

  const updateBld = (id: number, field: string, value: string) => {
    setBldInterviews(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const updateNv = (id: number, field: string, value: string) => {
    setNvInterviews(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const updateFindings = (field: string, value: string) => {
    setFindings(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{fontSize: '1.125rem', color: 'var(--muted)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem'}}>Ngày 3: Phỏng Vấn (Sếp vs Nhân Viên)</h1>
        <p>Thu thập thông tin từ bên trong. Lắng nghe 80%, nói 20%. Không đưa giải pháp vội.</p>
      </header>

      <div className="glass-panel fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* BLD INTERVIEWS */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', marginBottom: '1.5rem', color: 'var(--success)'}}>1. Phỏng Vấn Lãnh Đạo (Tầm Nhìn & Khó Khăn Cấp Cao)</h2>
          
          {/* TABS BLD */}
          <div className="mobile-flex-wrap" style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem', scrollbarWidth: 'none' }}>
            {bldInterviews.map(bld => (
              <div 
                key={bld.id} 
                onClick={() => setActiveBld(bld.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '0.6rem 1.2rem', borderRadius: '20px', cursor: 'pointer', whiteSpace: 'nowrap',
                  background: activeBld === bld.id ? 'var(--foreground)' : 'transparent',
                  color: activeBld === bld.id ? 'var(--background)' : 'var(--muted)',
                  border: '1px solid var(--card-border)', transition: 'all 0.2s ease',
                  fontWeight: activeBld === bld.id ? 600 : 400
                }}
              >
                {bld.name || 'Chưa nhập tên'}
                {bldInterviews.length > 1 && (
                  <span onClick={(e) => removeBld(e, bld.id)} style={{ color: activeBld === bld.id ? 'var(--background)' : 'var(--error)', opacity: 0.7, padding: '0 4px' }}>×</span>
                )}
              </div>
            ))}
            <button onClick={addBld} style={{ padding: '0.6rem 1.2rem', borderRadius: '20px', background: 'transparent', color: 'var(--success)', border: '1px dashed var(--success)', cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Thêm Lãnh Đạo</button>
          </div>

          {/* ACTIVE BLD FORM */}
          {bldInterviews.map(bld => bld.id === activeBld && (
            <div key={bld.id} className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', background: 'var(--background)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--muted)' }}>Họ tên Lãnh đạo</label>
                  <input className="input-field" placeholder="VD: Nguyễn Văn A" value={bld.name} onChange={e => updateBld(bld.id, 'name', e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--muted)' }}>Chức vụ phòng ban</label>
                  <input className="input-field" placeholder="VD: Giám đốc Kinh doanh" value={bld.role} onChange={e => updateBld(bld.id, 'role', e.target.value)} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>1. Tổng quan về Vai trò & Đội ngũ</label>
                <ul style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.8rem', paddingLeft: '1.2rem' }}>
                  <li>Bạn có thể mô tả vai trò của bạn và trách nhiệm chính của đội ngũ bạn không?</li>
                  <li>Các mục tiêu hoặc KPI chính mà đội ngũ bạn chịu trách nhiệm trong quý/năm này là gì?</li>
                  <li>Bạn có thể cho tôi biết cấu trúc đội ngũ của bạn không? Ai báo cáo cho ai?</li>
                </ul>
                <textarea className="input-field" rows={3} placeholder="Ghi chú câu trả lời..." value={bld.q1} onChange={e => updateBld(bld.id, 'q1', e.target.value)} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>2. Quy trình & Luồng công việc cốt lõi</label>
                <ul style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.8rem', paddingLeft: '1.2rem' }}>
                  <li>Từ góc độ cao, những quy trình quan trọng nhất mà đội ngũ bạn quản lý là gì?</li>
                  <li>Bạn thấy đâu là những điểm tắc nghẽn hoặc trì hoãn lớn nhất trong luồng công việc của đội ngũ bạn?</li>
                  <li>Những nhiệm vụ nào dường như tiêu tốn nhiều giờ công hoặc tài nguyên nhất?</li>
                </ul>
                <textarea className="input-field" rows={3} placeholder="Ghi chú câu trả lời..." value={bld.q2} onChange={e => updateBld(bld.id, 'q2', e.target.value)} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>3. Công cụ & Công nghệ</label>
                <ul style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.8rem', paddingLeft: '1.2rem' }}>
                  <li>Những hệ thống phần mềm hoặc công cụ chính mà đội ngũ bạn dựa vào là gì?</li>
                  <li>Những điều gì khiến bạn cảm thấy khó chịu nhất với bộ công nghệ hiện tại của mình?</li>
                  <li>Có những quy trình quan trọng nào diễn ra bên ngoài phần mềm chính (ví dụ: chia sẻ bảng tính, email) không?</li>
                </ul>
                <textarea className="input-field" rows={3} placeholder="Ghi chú câu trả lời..." value={bld.q3} onChange={e => updateBld(bld.id, 'q3', e.target.value)} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>4. Điểm đau & Thách thức chiến lược</label>
                <ul style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.8rem', paddingLeft: '1.2rem' }}>
                  <li>Những thách thức lớn nhất mà đội ngũ bạn đang phải đối mặt ngay bây giờ là gì?</li>
                  <li>Nếu bạn có một cây đũa thần, vấn đề nào bạn muốn giải quyết cho đội ngũ của mình ngay lập tức?</li>
                  <li>Bạn cảm thấy điều gì đang ngăn cản đội ngũ của bạn trở nên hiệu quả hoặc hiệu suất hơn?</li>
                </ul>
                <textarea className="input-field" rows={3} placeholder="Ghi chú câu trả lời..." value={bld.q4} onChange={e => updateBld(bld.id, 'q4', e.target.value)} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>5. Tầm nhìn Tương lai</label>
                <ul style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.8rem', paddingLeft: '1.2rem' }}>
                  <li>Bạn thấy đâu là những cơ hội lớn nhất để cải thiện trong bộ phận của bạn?</li>
                  <li>Đội ngũ của bạn thường phản ứng như thế nào với công nghệ mới? Khả năng bị kháng cự?</li>
                </ul>
                <textarea className="input-field" rows={3} placeholder="Ghi chú câu trả lời..." value={bld.q5} onChange={e => updateBld(bld.id, 'q5', e.target.value)} />
              </div>
            </div>
          ))}
        </div>

        {/* NHAN VIEN INTERVIEWS */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', marginBottom: '1.5rem', color: 'var(--warning)'}}>2. Phỏng Vấn Nhân Viên (Thực Tế Công Việc)</h2>
          
          {/* TABS NV */}
          <div className="mobile-flex-wrap" style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem', scrollbarWidth: 'none' }}>
            {nvInterviews.map(nv => (
              <div 
                key={nv.id} 
                onClick={() => setActiveNv(nv.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '0.6rem 1.2rem', borderRadius: '20px', cursor: 'pointer', whiteSpace: 'nowrap',
                  background: activeNv === nv.id ? 'var(--foreground)' : 'transparent',
                  color: activeNv === nv.id ? 'var(--background)' : 'var(--muted)',
                  border: '1px solid var(--card-border)', transition: 'all 0.2s ease',
                  fontWeight: activeNv === nv.id ? 600 : 400
                }}
              >
                {nv.name || 'Chưa nhập tên'}
                {nvInterviews.length > 1 && (
                  <span onClick={(e) => removeNv(e, nv.id)} style={{ color: activeNv === nv.id ? 'var(--background)' : 'var(--error)', opacity: 0.7, padding: '0 4px' }}>×</span>
                )}
              </div>
            ))}
            <button onClick={addNv} style={{ padding: '0.6rem 1.2rem', borderRadius: '20px', background: 'transparent', color: 'var(--warning)', border: '1px dashed var(--warning)', cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Thêm Nhân Viên</button>
          </div>

          {/* ACTIVE NV FORM */}
          {nvInterviews.map(nv => nv.id === activeNv && (
            <div key={nv.id} className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', background: 'var(--background)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--muted)' }}>Họ tên Nhân viên</label>
                  <input className="input-field" placeholder="VD: Trần Thị B" value={nv.name} onChange={e => updateNv(nv.id, 'name', e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--muted)' }}>Công việc / Vai trò</label>
                  <input className="input-field" placeholder="VD: Nhân viên CSKH" value={nv.role} onChange={e => updateNv(nv.id, 'role', e.target.value)} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>1. Vai trò & Trách nhiệm Hàng ngày</label>
                <ul style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.8rem', paddingLeft: '1.2rem' }}>
                  <li>Bạn có thể mô tả một ngày hoặc tuần điển hình trong vai trò của bạn không?</li>
                  <li>Những nhiệm vụ phổ biến nhất mà bạn thực hiện mỗi ngày là gì?</li>
                  <li>Bạn dành bao nhiêu thời gian trong ngày cho các trách nhiệm cốt lõi so với các nhiệm vụ hành chính / lặp lại?</li>
                </ul>
                <textarea className="input-field" rows={3} placeholder="Ghi chú câu trả lời..." value={nv.q1} onChange={e => updateNv(nv.id, 'q1', e.target.value)} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>2. Đi sâu vào Quy trình (Tốn thời gian nhất)</label>
                <ul style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.8rem', paddingLeft: '1.2rem' }}>
                  <li>Bạn có thể mô tả các bước chính xác mà bạn thực hiện để hoàn thành [một nhiệm vụ phổ biến] không?</li>
                  <li>Phần nào của quy trình đó là thủ công nhất hoặc tốn nhiều thời gian nhất?</li>
                  <li>Bạn cần tìm hoặc tham khảo thông tin gì để hoàn thành nó, và bạn lấy nó từ đâu?</li>
                </ul>
                <textarea className="input-field" rows={3} placeholder="Ghi chú câu trả lời..." value={nv.q2} onChange={e => updateNv(nv.id, 'q2', e.target.value)} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>3. Công cụ & Khó chịu</label>
                <ul style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.8rem', paddingLeft: '1.2rem' }}>
                  <li>Phần mềm nào bạn dành phần lớn thời gian trong ngày để làm việc?</li>
                  <li>Bạn thấy điều gì khó chịu nhất về các công cụ mà bạn phải sử dụng?</li>
                  <li>Có phải bạn phải nhập dữ liệu hai lần hoặc copy-paste giữa các hệ thống khác nhau không?</li>
                </ul>
                <textarea className="input-field" rows={3} placeholder="Ghi chú câu trả lời..." value={nv.q3} onChange={e => updateNv(nv.id, 'q3', e.target.value)} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>4. Điểm đau & Danh sách mong muốn</label>
                <ul style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.8rem', paddingLeft: '1.2rem' }}>
                  <li>Phần nào là phần nhàm chán hoặc lặp đi lặp lại nhất trong công việc của bạn?</li>
                  <li>Nếu bạn có một trợ lý, bạn sẽ giao cho họ những nhiệm vụ nào ngay lập tức?</li>
                  <li>Bạn hiện tại theo dõi công việc của mình hoặc báo cáo về tiến độ như thế nào?</li>
                </ul>
                <textarea className="input-field" rows={3} placeholder="Ghi chú câu trả lời..." value={nv.q4} onChange={e => updateNv(nv.id, 'q4', e.target.value)} />
              </div>
            </div>
          ))}
        </div>

        {/* KEY FINDINGS */}
        <div style={{ marginBottom: '2rem', padding: '2rem', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{marginBottom: '1.5rem', color: '#fff', fontSize: '1.4rem'}}>3. Phát Hiện Quan Trọng (Đối chiếu Sếp vs Nhân viên)</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--muted)' }}>1. Điểm Khớp Nhau: Vấn đề nào xuất hiện ở Cả lãnh đạo VÀ nhân viên?</label>
              <textarea className="input-field" rows={2} style={{background: 'var(--background)'}} value={findings.commonProblems} onChange={e => updateFindings('commonProblems', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--muted)' }}>2. Điểm Mù Của Sếp: Điều gì NV biết mà sếp không biết?</label>
              <textarea className="input-field" rows={2} style={{background: 'var(--background)'}} value={findings.hiddenKnowledge} onChange={e => updateFindings('hiddenKnowledge', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--muted)' }}>3. Nút Thắt Nguyên Tắc: Quy trình nào TỐN THỜI GIAN nhất?</label>
              <textarea className="input-field" rows={2} style={{background: 'var(--background)'}} value={findings.mostTimeConsuming} onChange={e => updateFindings('mostTimeConsuming', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--muted)' }}>4. Nút Thắt Công Cụ: Công cụ nào gây BỰC MÌNH nhất?</label>
              <textarea className="input-field" rows={2} style={{background: 'var(--background)'}} value={findings.mostFrustratingTool} onChange={e => updateFindings('mostFrustratingTool', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--muted)' }}>5. Khoảng Trống Thực Thi: Khoảng cách giữa MỤC TIÊU chiến lược và THỰC TẾ hàng ngày?</label>
              <textarea className="input-field" rows={2} style={{background: 'var(--background)'}} value={findings.goalGap} onChange={e => updateFindings('goalGap', e.target.value)} />
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button className="btn-primary" onClick={handleSave} disabled={loading} style={{ width: '100%', maxWidth: '300px' }}>
            {loading ? 'Đang lưu...' : 'Hoàn thành Ngày 3 Phỏng Vấn'}
          </button>
        </div>
      </div>
    </div>
  )
}
