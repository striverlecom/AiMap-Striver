'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/users/me')
      .then(res => res.json())
      .then(data => {
        if (!data.user) router.push('/login')
        else if (!data.user.isPaid) router.push('/payment')
        else setUser(data.user)
      })

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('welcome') === '1') {
        setShowWelcome(true)
        window.history.replaceState({}, '', '/dashboard')
        setTimeout(() => setShowWelcome(false), 4000)
      }
    }
  }, [router])

  if (!user) return <div className="container" style={{paddingTop: '20vh', textAlign: 'center'}}>Đang tải...</div>

  const days = [
    { title: 'Sự thật', desc: 'Tự chấm điểm doanh nghiệp' },
    { title: 'Dữ liệu', desc: 'Thu thập số liệu kinh doanh' },
    { title: 'Phỏng vấn', desc: 'Phát hiện vấn đề ẩn giấu' },
    { title: 'Sơ đồ', desc: 'Vẽ bản đồ vận hành 3 động cơ' },
    { title: 'Ưu tiên', desc: 'Ma trận chọn giải pháp' },
    { title: 'Tính ROI', desc: 'Biến thời gian thành tiền' },
    { title: 'Kế hoạch', desc: 'Roadmap triển khai 30 ngày' },
  ]

  return (
    <div className="container" style={{ paddingTop: '10vh', paddingBottom: '10vh' }}>
      
      {showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-text">
            Bản Đồ Của Bạn Đã Sẵn Sàng.
          </div>
        </div>
      )}

      <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1>Hành trình AI của bạn</h1>
        <p>Chọn bất kỳ trạm nào trên bản đồ để cập nhật dữ liệu của doanh nghiệp bạn.</p>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {days.map((day, idx) => {
          const dayNum = idx + 1
          const isUnlocked = true
          const isCompleted = user.currentDay > dayNum
          
          return (
            <Link 
              key={idx}
              href={isUnlocked ? `/day-${dayNum}` : '#'} 
              className={`glass-panel fade-in ${isUnlocked ? '' : 'locked'}`} 
              style={{ 
                animationDelay: `${idx * 0.1}s`,
                opacity: isUnlocked ? 1 : 0.5,
                border: isUnlocked ? '1px solid var(--card-border)' : '1px solid rgba(255,255,255,0.05)',
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                background: isCompleted ? 'rgba(50, 215, 75, 0.05)' : 'rgba(17, 17, 17, 0.7)',
                position: 'relative',
                overflow: 'hidden'
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ 
                  background: isCompleted ? 'var(--success)' : (isUnlocked ? 'var(--foreground)' : 'var(--muted)'),
                  color: isCompleted ? '#000' : 'var(--background)',
                  width: '32px', height: '32px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 600, fontSize: '0.9rem'
                }}>
                  {isCompleted ? '✓' : dayNum}
                </div>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{day.title}</h3>
              <p style={{ fontSize: '0.9rem' }}>{day.desc}</p>
            </Link>
          )
        })}
        {/* Result summary card */}
        <Link 
            href="/results" 
            className="glass-panel fade-in" 
            style={{ 
              animationDelay: `0.7s`,
              opacity: 1,
              borderColor: 'var(--warning)',
              cursor: 'pointer'
            }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Kết quả tổng hợp</h3>
            <p style={{ fontSize: '0.9rem' }}>Báo cáo hệ thống AI và đo lường ROI chi tiết.</p>
        </Link>
      </div>

      <style>{`
        .glass-panel:not(.locked):hover {
          transform: translateY(-5px);
          border-color: var(--muted);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  )
}
