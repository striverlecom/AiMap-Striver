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
    e.preventDefault()
    setIsOpen(false)
    setLoading(true) // Start loading animation visually if needed
    router.push(path)
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
            <a href="/dashboard" onClick={(e) => handleNav(e, '/dashboard')}>Hành trình</a>
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
            <a href="/login" onClick={(e) => handleNav(e, '/login')}>Đăng nhập</a>
            <a href="/register" onClick={(e) => handleNav(e, '/register')} style={{color: 'var(--foreground)'}}>Bắt đầu</a>
          </>
        )}
      </div>
    </>
  )
}
