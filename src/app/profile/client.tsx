'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfileClient({ serverUser }: { serverUser: any }) {
  const [name, setName] = useState(serverUser.name || '')
  const [email, setEmail] = useState(serverUser.email || '')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: password || undefined })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi cập nhật.')
      }

      setSuccess('Cập nhật thông tin thành công!')
      setPassword('') // Clear password field after update
      router.refresh() // Sync server components layout
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center', maxWidth: '600px', width: '100%' }}>
        <h1 style={{fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.02em', marginBottom: '0.5rem'}}>Hồ Sơ Cá Nhân</h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>Quản lý thông tin và bảo mật tài khoản</p>
      </header>

      <div style={{ maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Payment Status Card */}
        <div className="glass-panel" style={{ border: serverUser.isPaid ? '1px solid var(--success)' : '1px solid var(--warning)' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: serverUser.isPaid ? 'var(--success)' : 'var(--warning)' }}>Trạng thái Gói Cước</h2>
          {serverUser.isPaid ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }} />
              <span style={{ fontWeight: 600 }}>Tài khoản Pro (Đã thanh toán)</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--warning)', boxShadow: '0 0 10px var(--warning)' }} />
              <span>Chưa thanh toán phí mở khóa.</span>
              <Link href="/payment" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', marginLeft: 'auto' }}>Thanh toán ngay</Link>
            </div>
          )}
        </div>

        {/* Profile Settings Form */}
        <div className="glass-panel">
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {error && <div style={{ color: 'var(--error)', fontSize: '0.9rem', padding: '12px', background: 'rgba(255,69,58,0.1)', borderRadius: '8px' }}>{error}</div>}
            {success && <div style={{ color: 'var(--success)', fontSize: '0.9rem', padding: '12px', background: 'rgba(50,215,75,0.1)', borderRadius: '8px' }}>{success}</div>}
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--muted)', fontSize: '0.9rem' }}>Họ và tên</label>
              <input 
                type="text" 
                className="input-field" 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--muted)', fontSize: '0.9rem' }}>Email đăng nhập</label>
              <input 
                type="email" 
                className="input-field" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--muted)', fontSize: '0.9rem' }}>Mật khẩu mới</label>
              <input 
                type="password" 
                className="input-field" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                placeholder="Bỏ trống nếu không muốn đổi"
              />
              <p style={{ fontSize: '0.8rem', marginTop: '6px', color: 'var(--muted)' }}>Chỉ nhập khi bạn muốn thiết lập lại mật khẩu. Cần đăng nhập lại sau khi đổi.</p>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
              {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
