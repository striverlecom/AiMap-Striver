'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PaymentPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/users/me?basic=true')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          if (data.user.isPaid) {
            router.push('/dashboard')
          } else {
            setUser(data.user)
          }
        } else {
          router.push('/login')
        }
      })
      .finally(() => setLoading(false))

    // Simple polling to check if payment is successful via webhook
    const interval = setInterval(() => {
      fetch('/api/users/me?basic=true')
        .then(res => res.json())
        .then(data => {
          if (data.user?.isPaid) {
            clearInterval(interval)
            setIsSuccess(true)
            setTimeout(() => {
              router.push('/dashboard?welcome=1')
              router.refresh()
            }, 3000)
          }
        })
    }, 5000)

    return () => clearInterval(interval)
  }, [router])

  const bypassPayment = async () => {
    try {
      // Simulate webhook locally for DEV purposes
      await fetch('/api/sepay/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transferType: 'in',
          transferAmount: 50000,
          content: user.paymentRef
        })
      })
    } catch {}
  }

  if (loading) return <div className="container" style={{paddingTop: '20vh', textAlign: 'center'}}>Đang tải...</div>

  if (isSuccess) {
    return (
      <div className="container fade-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', textAlign: 'center' }}>
        <svg className="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle className="success-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
          <path className="success-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Thanh toán thành công!</h2>
        <p style={{ color: 'var(--muted)' }}>Đang chuẩn bị Bản Đồ AI cho doanh nghiệp của bạn...</p>
      </div>
    )
  }

  // Use compact2 template for a modern vertical card layout from VietQR
  const BANK_ID = 'TPB'
  const ACCOUNT_NO = '00005510675'
  const ACCOUNT_NAME = 'LE QUANG CUONG'
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=50000&addInfo=${user?.paymentRef}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '10vh', paddingBottom: '10vh' }}>
      <div className="glass-panel fade-in" style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Sẵn sàng đột phá?</h2>
        <p style={{ marginBottom: '2rem', color: 'var(--muted)' }}>Quét mã thanh toán <strong>50,000đ</strong> để mở khóa bản đồ 7 Ngày.</p>
        
        {/* Modern Apple-style Floating QR Card */}
        <div style={{ 
          background: '#ffffff', 
          padding: '8px', 
          borderRadius: '24px', 
          display: 'inline-block', 
          marginBottom: '2rem', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          overflow: 'hidden'
        }}>
          {user?.paymentRef ? (
            <img src={qrUrl} alt="Thanh toán QR Code" style={{ width: '100%', maxWidth: '280px', height: 'auto', display: 'block', borderRadius: '16px' }} />
          ) : (
            <div style={{ width: '280px', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', background: '#f5f5f7', borderRadius: '16px' }}>
              Không thể tạo mã QR
            </div>
          )}
        </div>
        
        {/* Subtle Frosted Manual Transfer Info */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem', borderRadius: '16px', marginBottom: '2rem', textAlign: 'left', fontSize: '0.9rem' }}>
          <p style={{marginBottom: '12px', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Hoặc chuyển khoản thủ công:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: 'var(--muted)' }}>Ngân hàng:</span>
            <strong style={{ fontSize: '1rem' }}>{BANK_ID}</strong>
            <span style={{ color: 'var(--muted)' }}>Số tài khoản:</span>
            <strong style={{ fontSize: '1rem', letterSpacing: '1px' }}>{ACCOUNT_NO}</strong>
            <span style={{ color: 'var(--muted)' }}>Nội dung:</span>
            <strong style={{ fontSize: '1.1rem', color: 'var(--success)' }}>{user?.paymentRef}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--muted)', fontSize: '0.9rem' }}>
          <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid var(--muted)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          Đang đợi thanh toán từ hệ thống...
        </div>



        <style>{`
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  )
}
