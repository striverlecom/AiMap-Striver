export default function Loading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%', background: 'var(--background)' }}>
      <div className="apple-loader-box">
        <div className="apple-spinner">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="blade" style={{ animationDelay: `${(i - 12) * 0.0833}s`, transform: `rotate(${i * 30}deg) translate(0, -130%)` }} />
          ))}
        </div>
      </div>
      <p style={{ marginTop: '1.5rem', color: 'var(--muted)', fontSize: '0.9rem', letterSpacing: '1px' }}>Đang tải...</p>
      
      <style>{`
        .apple-loader-box {
          background: rgba(30, 30, 30, 0.6);
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          width: 80px;
          height: 80px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .apple-spinner {
          position: relative;
          width: 32px;
          height: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .apple-spinner .blade {
          position: absolute;
          width: 2.5px;
          height: 8px;
          background: var(--foreground);
          border-radius: 4px;
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
