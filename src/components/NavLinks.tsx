'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NavLinks({ hasSession }: { hasSession: boolean }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setIsOpen(false)
    router.push('/')
    router.refresh()
  }

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    setIsOpen(false)
    setLoading(true)
  }

  return (
    <>
      <button 
        className={`mobile-menu-btn ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        <div className="mobile-menu-icon"></div>
      </button>

      <div className={`nav-links ${isOpen ? 'mobile-open' : ''}`}>
        {hasSession ? (
          <>
            <Link href="/dashboard" prefetch={true} onClick={(e) => handleNav(e as any, '/dashboard')}>Hành trình</Link>
            <button 
              onClick={handleLogout}
              style={{
                marginLeft: '24px', 
                fontSize: '0.875rem', 
                color: 'var(--muted)',
                textAlign: 'left'
              }}>
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link href="/login" prefetch={true} onClick={(e) => handleNav(e as any, '/login')}>Đăng nhập</Link>
            <Link href="/register" prefetch={true} onClick={(e) => handleNav(e as any, '/register')} style={{color: 'var(--foreground)'}}>Bắt đầu</Link>
          </>
        )}
      </div>
    </>
  )
}
