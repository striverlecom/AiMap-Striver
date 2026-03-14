'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (res.ok) {
        if (!data.user.isPaid) {
          router.push('/payment')
        } else {
          router.push('/dashboard')
        }
        router.refresh()
      } else {
        setError(data.error || 'Đăng nhập thất bại')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '15vh' }}>
      <div className="glass-panel fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Đăng nhập</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--muted)' }}>Email</label>
            <input type="email" required className="input-field" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--muted)' }}>Mật khẩu</label>
            <input type="password" required className="input-field" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <p style={{ color: 'var(--error)', fontSize: '0.9rem' }}>{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Đang xử lý...' : 'Tiếp tục'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem' }}>
          Chưa có tài khoản? <Link href="/register" style={{ color: 'var(--foreground)' }}>Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  )
}
