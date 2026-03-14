'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useState } from 'react'

export default function NavLinks({ hasSession }: { hasSession: boolean }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setIsOpen(false)
    router.push('/')
    router.refresh()
  }

  const closeMenu = () => setIsOpen(false)

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
            <Link href="/dashboard" onClick={closeMenu}>Hành trình</Link>
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
            <Link href="/login" onClick={closeMenu}>Đăng nhập</Link>
            <Link href="/register" onClick={closeMenu} style={{color: 'var(--foreground)'}}>Bắt đầu</Link>
          </>
        )}
      </div>
    </>
  )
}
