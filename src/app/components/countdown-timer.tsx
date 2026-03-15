'use client'

import { useEffect, useState } from 'react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.15)', padding: '16px 32px', borderRadius: '24px', marginBottom: '40px' }}>
      <div style={{ color: '#fff', fontWeight: 600, fontSize: '1.05rem', marginBottom: '8px', letterSpacing: '0.5px' }}>
        Ưu Ưu Đãi Đóng Lại Sau: {mounted ? formatTime(timeLeft) : '24:00:00'}
      </div>
      <div style={{ color: '#a1a1a6', fontSize: '0.95rem', fontWeight: 500 }}>
        Chỉ Còn 25 Suất Cuối Cùng Ở Mức Giá Này.
      </div>
    </div>
  );
}
