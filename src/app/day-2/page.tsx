'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Day2Page() {
  const [data, setData] = useState({
    revenue: 0,
    targetRevenue: 0,
    salaryCost: 0,
    customerCount: 0,
    churnRate: 0,
    avgOrderTime: 0
  })
  
  const [salaryData, setSalaryData] = useState([
    { id: 1, department: 'Sales / Kinh doanh', salary: 0, count: 0 },
    { id: 2, department: 'Marketing', salary: 0, count: 0 },
    { id: 3, department: 'CSKH / Hỗ trợ', salary: 0, count: 0 },
    { id: 4, department: 'Kế toán / Tài chính', salary: 0, count: 0 },
    { id: 5, department: 'Sản xuất / Vận hành', salary: 0, count: 0 },
    { id: 6, department: 'IT / Kỹ thuật', salary: 0, count: 0 },
    { id: 7, department: 'Hành chính / HR', salary: 0, count: 0 },
    { id: 8, department: 'Khác', salary: 0, count: 0 }
  ])

  const [challenges, setChallenges] = useState({
    biggestChallenge: '',
    timeConsumingProcess: '',
    customerComplaints: '',
    aiWishlist: ''
  })

  const [parameters, setParameters] = useState({
    companyName: '',
    authorName: '',
    startDate: '',
    hoursPerMonth: 160,
    weeksPerYear: 52,
    reinvestPct: 50
  })
  
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/users/me').then(res => res.json()).then(resData => {
      if (resData.user?.day2Data) {
        const d2 = resData.user.day2Data;
        setData({
          revenue: d2.revenue || 0,
          targetRevenue: d2.targetRevenue || 0,
          salaryCost: d2.salaryCost || 0,
          customerCount: d2.customerCount || 0,
          churnRate: d2.churnRate || 0,
          avgOrderTime: d2.avgOrderTime || 0
        });
        if (d2.salaryData) {
          try { 
            const parsed = JSON.parse(d2.salaryData)
            if (parsed.length > 0) setSalaryData(parsed)
          } catch(e){}
        }
        if (d2.challenges) {
          try { 
            const p = JSON.parse(d2.challenges) 
            setChallenges(prev => ({ ...prev, ...(p || {}) }))
          } catch(e){}
        }
        if (d2.parameters) {
          try { 
            const p = JSON.parse(d2.parameters)
            setParameters({
              companyName: p.companyName || '',
              authorName: p.authorName || '',
              startDate: p.startDate || '',
              hoursPerMonth: p.hoursPerMonth || 160,
              weeksPerYear: p.weeksPerYear || 52,
              reinvestPct: p.reinvestPct || 50
            })
          } catch(e){}
        }
      }
    })
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      const payload = {
        ...data,
        salaryData: JSON.stringify(salaryData),
        challenges: JSON.stringify(challenges),
        parameters: JSON.stringify(parameters)
      }
      const res = await fetch('/api/days/2', {
        method: 'POST', body: JSON.stringify(payload)
      })
      if (res.ok) router.push('/day-3')
    } finally {
      setLoading(false)
    }
  }

  const updateSalary = (id: number, field: string, value: any) => {
    setSalaryData(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row))
  }

  const addDepartment = () => {
    setSalaryData([...salaryData, { id: Date.now(), department: 'Phòng ban mới', salary: 0, count: 0 }])
  }

  const removeDepartment = (id: number) => {
    setSalaryData(salaryData.filter(d => d.id !== id))
  }

  const formatVND = (num: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0)
  
  const totalSalaryCost = salaryData.reduce((acc, row) => acc + (row.salary * row.count), 0)
  const totalEmployees = salaryData.reduce((acc, row) => acc + row.count, 0)

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{fontSize: '2.5rem'}}>Ngày 2: Dữ Liệu</h1>
        <p>Thu thập số liệu thật. Biến cảm giác thành con số.</p>
      </header>

      <div className="fade-in" style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* PART A */}
        <div className="glass-panel">
          <h2 style={{borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', marginBottom: '1.5rem', color: 'var(--success)'}}>A. CHỈ SỐ KINH DOANH CHÍNH</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--muted)', fontSize: '0.9rem' }}>Doanh thu 12 tháng qua (VND)</label>
              <input type="number" className="input-field" style={{ padding: '12px 16px' }} value={data.revenue} onChange={e => setData({...data, revenue: parseFloat(e.target.value)||0})} />
              <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '4px' }}>{formatVND(data.revenue)}</div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--muted)', fontSize: '0.9rem' }}>Mục tiêu DT 12 tháng tới (VND)</label>
              <input type="number" className="input-field" style={{ padding: '12px 16px' }} value={data.targetRevenue} onChange={e => setData({...data, targetRevenue: parseFloat(e.target.value)||0})} />
              <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '4px' }}>{formatVND(data.targetRevenue)}</div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--muted)', fontSize: '0.9rem' }}>Chi phí nhân sự / tháng (VND)</label>
              <input type="number" className="input-field" style={{ padding: '12px 16px' }} value={data.salaryCost} onChange={e => setData({...data, salaryCost: parseFloat(e.target.value)||0})} />
              <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '4px' }}>{formatVND(data.salaryCost)}</div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--muted)', fontSize: '0.9rem' }}>Số khách hàng hiện tại</label>
              <input type="number" className="input-field" style={{ padding: '12px 16px' }} value={data.customerCount} onChange={e => setData({...data, customerCount: parseInt(e.target.value)||0})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--muted)', fontSize: '0.9rem' }}>Tỷ lệ giữ chân KH (%)</label>
              <input type="number" className="input-field" style={{ padding: '12px 16px' }} value={data.churnRate} onChange={e => setData({...data, churnRate: parseFloat(e.target.value)||0})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--muted)', fontSize: '0.9rem' }}>Thời gian xử lý đơn hàng TB (Giờ)</label>
              <input type="number" className="input-field" style={{ padding: '12px 16px' }} value={data.avgOrderTime} onChange={e => setData({...data, avgOrderTime: parseFloat(e.target.value)||0})} />
            </div>
          </div>
        </div>

        {/* PART B */}
        <div className="glass-panel" style={{ overflowX: 'auto', width: '100%' }}>
          <h2 style={{borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', margin: '0 0 1.5rem 0', color: 'var(--success)'}}>B. BẢNG LƯƠNG THEO BỘ PHẬN</h2>
          <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--background)' }}>
                <th style={{ padding: '1rem', color: 'var(--muted)' }}>Bộ phận</th>
                <th style={{ padding: '1rem', color: 'var(--muted)' }}>Lương TB/tháng (VND)</th>
                <th style={{ padding: '1rem', color: 'var(--muted)' }}>Số NV</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', textAlign: 'right' }}>Tổng CP/tháng</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {salaryData.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '0.5rem' }}>
                    <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Bộ phận:</div>
                    <input className="input-field" style={{ padding: '12px 16px' }} value={row.department} onChange={e => updateSalary(row.id, 'department', e.target.value)} />
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Lương TB/tháng (VND):</div>
                    <input type="number" className="input-field" style={{ padding: '12px 16px' }} value={row.salary} onChange={e => updateSalary(row.id, 'salary', parseFloat(e.target.value)||0)} />
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px'}}>Số lượng Nhân viên:</div>
                    <input type="number" className="input-field" style={{ padding: '12px 16px' }} value={row.count} onChange={e => updateSalary(row.id, 'count', parseInt(e.target.value)||0)} />
                  </td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 600, color: 'var(--warning)' }}>
                    <div className="mobile-label" style={{display: 'none', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '4px', textAlign: 'left'}}>Tổng CP/tháng:</div>
                    {formatVND(row.salary * row.count)}
                  </td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                    <button onClick={() => removeDepartment(row.id)} style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', padding: '10px' }}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={{ padding: '1rem', fontWeight: 700 }}>
                  TỔNG CỘNG
                </td>
                <td></td>
                <td style={{ padding: '1rem', fontWeight: 700 }}>{totalEmployees} NV</td>
                <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--success)', textAlign: 'right' }}>{formatVND(totalSalaryCost)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
          <button className="btn-secondary" onClick={addDepartment} style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>+ Thêm Bộ Phận</button>
        </div>

        {/* PART C */}
        <div className="glass-panel">
          <h2 style={{borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', marginBottom: '1.5rem', color: 'var(--warning)'}}>C. THÁCH THỨC & VẤN ĐỀ CHÍNH</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--muted)', fontSize: '0.9rem' }}>Thách thức lớn nhất đang gặp:</label>
              <textarea className="input-field" style={{ padding: '12px 16px' }} rows={2} value={challenges.biggestChallenge} onChange={e => setChallenges({...challenges, biggestChallenge: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--muted)', fontSize: '0.9rem' }}>Quy trình nào tốn thời gian nhất:</label>
              <textarea className="input-field" style={{ padding: '12px 16px' }} rows={2} value={challenges.timeConsumingProcess} onChange={e => setChallenges({...challenges, timeConsumingProcess: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--muted)', fontSize: '0.9rem' }}>Khách hàng phàn nàn gì nhiều nhất:</label>
              <textarea className="input-field" style={{ padding: '12px 16px' }} rows={2} value={challenges.customerComplaints} onChange={e => setChallenges({...challenges, customerComplaints: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--muted)', fontSize: '0.9rem' }}>Nếu có AI, sẽ sửa gì đầu tiên và việc nào sẽ ước AI làm thay:</label>
              <textarea className="input-field" style={{ padding: '12px 16px' }} rows={2} value={challenges.aiWishlist} onChange={e => setChallenges({...challenges, aiWishlist: e.target.value})} />
            </div>
          </div>
        </div>

        {/* PART D */}
        <div className="glass-panel" style={{ border: '1px solid var(--card-border)' }}>
          <h2 style={{borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', marginBottom: '1.5rem', color: 'var(--foreground)'}}>D. THÔNG TIN DOANH NGHIỆP & THAM SỐ</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--muted)', fontSize: '0.9rem' }}>Tên công ty</label>
              <input type="text" className="input-field" style={{ padding: '12px 16px' }} value={parameters.companyName} onChange={e => setParameters({...parameters, companyName: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--muted)', fontSize: '0.9rem' }}>Người thực hiện</label>
              <input type="text" className="input-field" style={{ padding: '12px 16px' }} value={parameters.authorName} onChange={e => setParameters({...parameters, authorName: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--muted)', fontSize: '0.9rem' }}>Ngày lập báo cáo</label>
              <input type="date" className="input-field" style={{ padding: '12px 16px', minHeight: '48px' }} value={parameters.startDate} onChange={e => setParameters({...parameters, startDate: e.target.value})} />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', paddingTop: '1.5rem', borderTop: '1px dotted var(--card-border)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--muted)', fontSize: '0.9rem' }}>Số giờ làm việc / tháng</label>
              <input type="number" className="input-field" style={{ padding: '12px 16px' }} value={parameters.hoursPerMonth} onChange={e => setParameters({...parameters, hoursPerMonth: parseFloat(e.target.value)||0})} />
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '4px' }}>Chuẩn: 160 (20 ngày x 8h)</div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--muted)', fontSize: '0.9rem' }}>Số tuần làm việc / năm</label>
              <input type="number" className="input-field" style={{ padding: '12px 16px' }} value={parameters.weeksPerYear} onChange={e => setParameters({...parameters, weeksPerYear: parseFloat(e.target.value)||0})} />
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '4px' }}>Chuẩn: 52</div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--muted)', fontSize: '0.9rem' }}>% tái phân bổ cho DT</label>
              <input type="number" className="input-field" style={{ padding: '12px 16px' }} value={parameters.reinvestPct} onChange={e => setParameters({...parameters, reinvestPct: parseFloat(e.target.value)||0})} />
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '4px' }}>Thận trọng: 50%</div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button className="btn-primary" onClick={handleSave} disabled={loading} style={{ width: '100%', maxWidth: '300px' }}>
            {loading ? 'Đang lưu...' : 'Hoàn thành Dữ Liệu Ngày 2'}
          </button>
        </div>
      </div>
    </div>
  )
}
