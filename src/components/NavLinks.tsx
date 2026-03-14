'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import AvatarMenu from './AvatarMenu'

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
            <Link href="/dashboard" className="nav-cta" prefetch={true} onClick={(e) => handleNav(e as any, '/dashboard')}>Hành trình</Link>
            {/* Desktop Avatar Menu (Hidden in mobile CSS via display toggles if needed, but for now we keep layout flow) */}
            <div className="desktop-avatar-container">
              <AvatarMenu />
            </div>
            {/* Mobile raw links (Only visible inside hamburger) */}
            <Link href="/profile" className="mobile-only-link" onClick={() => setIsOpen(false)}>Hồ sơ cá nhân</Link>
            <button 
              className="mobile-only-link"
              onClick={handleLogout}
              style={{
                fontSize: '1.5rem', 
                color: 'var(--error)',
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
