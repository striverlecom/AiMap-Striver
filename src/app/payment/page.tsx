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

  // Replace with actual bank details if using real Sepay
  const BANK_ID = 'TPB'
  const ACCOUNT_NO = '00005510675'
  const ACCOUNT_NAME = 'LE QUANG CUONG'
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-print.png?amount=50000&addInfo=${user?.paymentRef}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '10vh', paddingBottom: '10vh' }}>
      <div className="glass-panel fade-in" style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Sẵn sàng đột phá?</h2>
        <p style={{ marginBottom: '2rem' }}>Thanh toán <strong>50,000đ</strong> để mở khóa hành trình Xây Dựng Bản Đồ AI.</p>
        
        <div style={{ background: '#fff', padding: '1rem', borderRadius: 'var(--radius-lg)', display: 'inline-block', marginBottom: '2rem' }}>
          {user?.paymentRef ? (
            <img src={qrUrl} alt="Thanh toan QR Code" style={{ width: '250px', height: '250px' }} />
          ) : (
            <div style={{ width: '250px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
              Không thể tạo mã QR
            </div>
          )}
        </div>
        
        <div style={{ background: 'var(--card-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', textAlign: 'left', fontSize: '0.9rem' }}>
          <p style={{marginBottom: '8px'}}>Hoặc chuyển khoản thủ công:</p>
          <p>Ngân hàng: <strong>{BANK_ID}</strong></p>
          <p>Số tài khoản: <strong>{ACCOUNT_NO}</strong></p>
          <p>Nội dung: <strong>{user?.paymentRef}</strong></p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--muted)', fontSize: '0.9rem' }}>
          <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid var(--muted)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          Đang đợi thanh toán từ hệ thống...
        </div>

        {/* Temporary DEV button */}
        <button onClick={bypassPayment} style={{ marginTop: '2rem', color: 'var(--muted)', fontSize: '0.8rem', textDecoration: 'underline' }}>
          (Dev Only: Simulate Payment)
        </button>

        <style>{`
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  )
}
