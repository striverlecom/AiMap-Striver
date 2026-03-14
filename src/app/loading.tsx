export default function Loading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%', background: 'var(--background)' }}>
      <div className="spinner"></div>
      <p style={{ marginTop: '1.5rem', color: 'var(--muted)', fontSize: '0.9rem', letterSpacing: '1px' }}>Đang tải dữ liệu...</p>
      
      <style>{`
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          border-top-color: var(--foreground);
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
