'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AvatarMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setIsOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <div className="avatar-menu-wrapper" ref={menuRef} style={{ position: 'relative', marginLeft: '24px' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'var(--card-border)',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
          overflow: 'hidden',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'var(--muted)' }}>
          <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
          <path d="M12.0002 14.5C6.99016 14.5 2.91016 17.92 2.91016 22C2.91016 22.28 3.13016 22.5 3.41016 22.5H20.5902C20.8702 22.5 21.0902 22.28 21.0902 22C21.0902 17.92 17.0102 14.5 12.0002 14.5Z" fill="currentColor"/>
        </svg>
      </button>

      {isOpen && (
        <div 
          style={{
            position: 'absolute',
            top: '44px',
            right: 0,
            width: '200px',
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            padding: '8px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
          className="fade-in"
        >
          <Link 
            href="/profile" 
            onClick={() => setIsOpen(false)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: 'var(--foreground)',
              transition: 'background 0.2s',
              display: 'block'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Hồ sơ cá nhân
          </Link>
          <div style={{ height: '1px', background: 'var(--card-border)', margin: '4px 0' }} />
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: 'var(--error)',
              textAlign: 'left',
              transition: 'background 0.2s',
              width: '100%'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,69,58,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  )
}
