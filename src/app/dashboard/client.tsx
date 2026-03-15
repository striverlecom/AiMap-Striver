'use client'

import { useEffect, useState, MouseEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DashboardClient({ serverUser }: { serverUser: any }) {
  const [user, setUser] = useState<any>(serverUser)
  const [showWelcome, setShowWelcome] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('welcome') === '1') {
        setShowWelcome(true)
        window.history.replaceState({}, '', '/dashboard')
        setTimeout(() => setShowWelcome(false), 4000)
      }
    }
  }, [])

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const days = [
    { title: 'Sự thật', desc: 'Thấu hiểu cội nguồn doanh nghiệp, tự định vị vị thế hiện tại qua lăng kính dữ liệu.', date: 'Trạm 1' },
    { title: 'Dữ liệu', desc: 'Khai phá kho báu số liệu bị lãng quên, xây dựng nền móng định lượng chính xác.', date: 'Trạm 2' },
    { title: 'Phỏng vấn', desc: 'Lắng nghe nhịp đập nội bộ, phát hiện những điểm nghẽn vô hình.', date: 'Trạm 3' },
    { title: 'Sơ đồ', desc: 'Mô phỏng bức tranh toàn cảnh, kiến tạo bản đồ vận hành 3 động cơ lõi.', date: 'Trạm 4' },
    { title: 'Ưu tiên', desc: 'Thuật toán ma trận thông minh, định vị giải pháp tối ưu nguồn lực.', date: 'Trạm 5' },
    { title: 'Tính ROI', desc: 'Lượng hóa giá trị tương lai, biến thời gian tiết kiệm được thành tài sản.', date: 'Trạm 6' },
    { title: 'Kế hoạch', desc: 'Chiến lược 30 ngày chuyển đổi số, roadmap độc bản cho riêng bạn.', date: 'Trạm 7' },
  ]

  return (
    <div className="apple-dashboard-container">
      {/* Background Ambience */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>

      {showWelcome && (
        <div className="welcome-overlay-luxury">
          <div className="welcome-text-luxury">
            <span className="welcome-gradient">Kỷ Nguyên Mới.</span>
            <br />Bắt Đầu Từ Đây.
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Hành Trình <br />
            <span className="text-gradient">Chuyển Đổi AI</span>
          </h1>
          <p className="hero-subtitle">
            Khám phá 7 cột mốc lịch sử tái thiết kế doanh nghiệp. 
            Tuyệt tác công nghệ dành riêng cho những nhà lãnh đạo tiên phong.
          </p>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="timeline-section">
        <div className="timeline-container">
          <div className="timeline-line"></div>
          
          {days.map((day, idx) => {
            const dayNum = idx + 1
            const isUnlocked = true // Logic for demo, real: user.currentDay >= dayNum
            const isCompleted = user.currentDay > dayNum
            const isCurrent = user.currentDay === dayNum

            return (
              <div 
                key={idx} 
                className={`milestone-wrapper ${idx % 2 === 0 ? 'left' : 'right'}`}
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className={`milestone-node ${isCompleted ? 'completed' : isCurrent ? 'current' : 'locked'}`}>
                  {isCompleted ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  ) : (
                    <div className="node-inner" />
                  )}
                </div>

                <Link 
                  href={isUnlocked ? `/day-${dayNum}` : '#'} 
                  prefetch={isUnlocked ? true : false}
                  className={`milestone-card glass-panel-luxury ${isUnlocked ? '' : 'disabled'}`}
                  onMouseMove={handleMouseMove}
                  onClick={(e) => { 
                    if (!isUnlocked) e.preventDefault()
                    else setIsLoading(true) 
                  }}
                >
                  <div className="card-top">
                    <span className="card-date gradient-text-small">{day.date}</span>
                    {isCurrent && <span className="status-badge pulse">Tiếp tục</span>}
                    {isCompleted && <span className="status-badge success">Hoàn thành</span>}
                  </div>
                  <h3 className="card-title">{day.title}</h3>
                  <p className="card-desc">{day.desc}</p>
                  
                  <div className="card-footer">
                    <span className="action-text">
                      {isCompleted ? 'Xem lại báo cáo' : isCurrent ? 'Bắt đầu ngay' : 'Đang khóa'}
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </span>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>

        {/* Final Result Card */}
        <div className="final-result-wrapper">
           <Link 
              href="/results" 
              prefetch={true}
              className="final-result-card glass-panel-luxury luxury-gold"
              onClick={() => setIsLoading(true)}
              onMouseMove={handleMouseMove}
            >
              <div className="glass-reflection"></div>
              <h2 className="final-title">Báo Cáo Tổng Thể</h2>
              <p className="final-desc">Kiệt tác chiến lược độc bản kiến tạo tương lai khác biệt, dành riêng cho bạn sau hành trình 7 ngày.</p>
              <div className="btn-wrapper">
                <span className="btn-luxury pulse-gold">Xem Kết Quả Trực Quan</span>
              </div>
          </Link>
        </div>
      </section>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay-luxury">
          <div className="apple-loader-box">
            <div className="apple-spinner">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="blade" style={{ animationDelay: `${(i - 12) * 0.0833}s`, transform: `rotate(${i * 30}deg) translate(0, -130%)` }} />
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Apple-style Luxury UI */
        .apple-dashboard-container {
          min-height: 100vh;
          background-color: #000;
          color: #f5f5f7;
          overflow-x: hidden;
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        /* Ambient Glows */
        .ambient-glow {
          position: absolute;
          width: 60vw;
          height: 60vw;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.15;
          z-index: 0;
          pointer-events: none;
        }
        .glow-1 {
          top: -10%;
          left: -10%;
          background: radial-gradient(circle, #0071e3 0%, rgba(0,0,0,0) 70%);
        }
        .glow-2 {
          bottom: 20%;
          right: -20%;
          background: radial-gradient(circle, #bf48ff 0%, rgba(0,0,0,0) 70%);
        }

        /* Welcome Overlay */
        .welcome-overlay-luxury {
          position: fixed;
          inset: 0;
          background: #000;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeOutLuxury 1s 3s forwards ease-in-out;
        }
        .welcome-text-luxury {
          text-align: center;
          font-size: 3rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.2;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUpLuxury 1.5s 0.5s forwards cubic-bezier(0.16, 1, 0.3, 1);
        }
        .welcome-gradient {
          background: linear-gradient(135deg, #fff 0%, #a5a5a6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @keyframes fadeOutLuxury {
          to { opacity: 0; visibility: hidden; }
        }
        @keyframes fadeInUpLuxury {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Hero Section */
        .hero-section {
          padding: 12vh 2rem 8vh;
          position: relative;
          z-index: 10;
          max-width: 1000px;
          margin: 0 auto;
          text-align: center;
        }
        .hero-title {
          font-size: clamp(3rem, 6vw, 5.5rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1.05;
          margin-bottom: 1.5rem;
          opacity: 0;
          animation: fadeInUp 1s 0.2s forwards;
        }
        .text-gradient {
          background: linear-gradient(90deg, #ffb6ff, #b344ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          color: #a1a1a6;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.5;
          font-weight: 400;
          opacity: 0;
          animation: fadeInUp 1s 0.4s forwards;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Timeline Layout */
        .timeline-section {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 2rem 10vh;
          position: relative;
          z-index: 10;
        }
        .timeline-container {
          position: relative;
          padding: 2rem 0;
        }
        .timeline-line {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 100%;
          background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 10%, rgba(255,255,255,0.1) 90%, rgba(255,255,255,0) 100%);
        }

        .milestone-wrapper {
          display: flex;
          justify-content: flex-end;
          padding: 2rem 0;
          position: relative;
          width: 50%;
          opacity: 0;
          animation: fadeInUp 1s forwards;
        }
        .milestone-wrapper.left {
          left: 0;
          justify-content: flex-end;
          padding-right: 3rem;
        }
        .milestone-wrapper.right {
          left: 50%;
          justify-content: flex-start;
          padding-left: 3rem;
        }

        .milestone-node {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #000;
          border: 2px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          box-shadow: 0 0 0 6px #000;
          transition: all 0.3s ease;
        }
        .milestone-wrapper.left .milestone-node { right: -12px; }
        .milestone-wrapper.right .milestone-node { left: -12px; }

        .milestone-node.completed {
          background: #fff;
          border-color: #fff;
          color: #000;
        }
        .milestone-node.current {
          border-color: #0071e3;
          box-shadow: 0 0 0 6px #000, 0 0 20px rgba(0, 113, 227, 0.5);
        }
        .milestone-node.current .node-inner {
          width: 8px;
          height: 8px;
          background: #0071e3;
          border-radius: 50%;
        }

        /* Glass Cards */
        .glass-panel-luxury {
          background: rgba(20, 20, 22, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 2rem;
          width: 100%;
          max-width: 420px;
          text-decoration: none;
          color: #f5f5f7;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: block;
          position: relative;
          overflow: hidden;
        }
        
        .glass-panel-luxury::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, -20%), rgba(255,255,255,0.06), transparent 40%);
          opacity: 0;
          transition: opacity 0.5s;
          pointer-events: none;
        }

        .glass-panel-luxury:hover {
          transform: translateY(-4px) scale(1.01);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset;
        }
        .glass-panel-luxury:hover::before {
          opacity: 1;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .gradient-text-small {
          background: linear-gradient(90deg, #a1a1a6, #d2d2d7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .status-badge {
          font-size: 0.75rem;
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 500;
        }
        .status-badge.pulse {
          background: rgba(0, 113, 227, 0.15);
          color: #2997ff;
          border: 1px solid rgba(0, 113, 227, 0.3);
          animation: pulseGlow 2s infinite;
        }
        .status-badge.success {
          background: rgba(50, 215, 75, 0.15);
          color: #32d74b;
          border: 1px solid rgba(50, 215, 75, 0.3);
        }
        
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(0,113,227, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(0,113,227, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0,113,227, 0); }
        }

        .card-title {
          font-size: 1.75rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          margin-bottom: 0.75rem;
          color: #fff;
        }
        .card-desc {
          color: #86868b;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }
        
        .card-footer {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 1rem;
        }
        .action-text {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #2997ff;
          transition: gap 0.3s;
        }
        .glass-panel-luxury:hover .action-text {
          gap: 10px;
        }

        /* Responsive Timeline */
        @media (max-width: 768px) {
          .hero-section {
            padding: 10vh 1.5rem 5vh;
          }
          .hero-title {
            font-size: clamp(2.25rem, 8vw, 3rem);
            margin-bottom: 1rem;
          }
          .hero-subtitle {
            font-size: 1rem;
            padding: 0 10px;
          }
          
          .timeline-section {
            padding: 0 1rem 8vh;
          }
          .timeline-line {
            left: 24px;
            width: 1px;
            background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 10%, rgba(255,255,255,0.15) 90%, rgba(255,255,255,0) 100%);
          }
          
          .milestone-wrapper {
            width: 100%;
            padding: 1rem 0 1.5rem 0;
            justify-content: flex-start !important;
          }
          .milestone-wrapper.left, .milestone-wrapper.right {
            left: 0;
            padding-left: 56px; /* Space for the node */
            padding-right: 0;
          }
          
          .milestone-node {
            width: 20px;
            height: 20px;
            box-shadow: 0 0 0 4px #000;
          }
          .milestone-wrapper.left .milestone-node, 
          .milestone-wrapper.right .milestone-node {
            left: 14px; /* Center with the 24px timeline line */
            right: auto;
          }
          
          .glass-panel-luxury {
            padding: 1.5rem;
            border-radius: 20px;
            max-width: 100%;
          }
          .card-title {
            font-size: 1.4rem;
            margin-bottom: 0.5rem;
          }
          .card-desc {
            font-size: 0.9rem;
            margin-bottom: 1rem;
          }
          .status-badge {
            font-size: 0.7rem;
            padding: 3px 8px;
          }
          
          /* Final Result Mobile */
          .final-result-card {
            padding: 2.5rem 1.5rem;
            border-radius: 20px;
          }
          .final-title {
            font-size: 2rem;
          }
          .final-desc {
            font-size: 1rem;
          }
          .btn-luxury {
            padding: 10px 20px;
            font-size: 0.9rem;
            width: 100%;
            text-align: center;
          }
        }

        /* Loading */
        .loading-overlay-luxury {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(10px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .apple-loader-box {
          background: rgba(30, 30, 30, 0.6);
          backdrop-filter: blur(20px) saturate(150%);
          width: 80px; height: 80px;
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .apple-spinner {
          position: relative; width: 32px; height: 32px;
          display: flex; justify-content: center; align-items: center;
        }
        .apple-spinner .blade {
          position: absolute; width: 2.5px; height: 8px;
          background: #fff; border-radius: 4px;
          animation: apple-fade 1s infinite linear;
        }
        @keyframes apple-fade {
          0% { opacity: 1; }
          100% { opacity: 0.15; }
        }
      `}</style>
    </div>
  )
}
