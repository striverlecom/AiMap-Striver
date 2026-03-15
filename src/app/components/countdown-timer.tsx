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
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255, 69, 58, 0.1)', border: '1px solid rgba(255, 69, 58, 0.3)', padding: '16px 32px', borderRadius: '24px', marginBottom: '40px' }}>
      <div style={{ color: '#ff453a', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>
        ⚠️ Ưu Đãi Đóng Lại Sau: {mounted ? formatTime(timeLeft) : '24:00:00'}
      </div>
      <div style={{ color: '#ff9f0a', fontSize: '0.95rem', fontWeight: 500 }}>
        Chỉ Còn 25 Suất Cuối Cùng Ở Mức Giá Này.
      </div>
    </div>
  );
}
