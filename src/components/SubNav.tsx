'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function SubNav({ hasSession }: { hasSession: boolean }) {
  const pathname = usePathname()
  
  // Hide subnav on landing, login, register, payment, and dashboard
  const hideOnPaths = ['/', '/login', '/register', '/payment', '/dashboard']
  if (!hasSession || hideOnPaths.includes(pathname)) return null

  const days = [
    { num: 1, path: '/day-1', label: '1. Sự thật' },
    { num: 2, path: '/day-2', label: '2. Dữ liệu' },
    { num: 3, path: '/day-3', label: '3. Phỏng vấn' },
    { num: 4, path: '/day-4', label: '4. Sơ đồ' },
    { num: 5, path: '/day-5', label: '5. Ưu tiên' },
    { num: 6, path: '/day-6', label: '6. Xác định ROI' },
    { num: 7, path: '/day-7', label: '7. Lộ trình' },
    { num: 8, path: '/day-8', label: '8. PRD' },
    { num: 9, path: '/day-9', label: '9. SI' },
    { num: 10, path: '/results', label: 'Báo cáo' }
  ]

  return (
    <div style={{
      position: 'sticky',
      top: '48px', /* Snaps exactly below the new 48px main header */
      zIndex: 40,
      background: 'rgba(0,0,0,0.75)', /* Slightly more transparent */
      backdropFilter: 'saturate(180%) blur(20px)',
      WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem', /* Balanced spacing between items and arrows */
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        padding: '0.6rem 1rem',
        maxWidth: '100%',
      }}>
        {days.map((d, index) => {
          const isActive = pathname === d.path
          return (
            <React.Fragment key={d.num}>
              {index > 0 && (
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.3, flexShrink: 0, color: 'var(--muted)' }}>
                  <path d="M1 9L5 5L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              <Link 
                href={d.path}
                prefetch={true}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '16px',
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  color: isActive ? '#000' : 'rgba(255,255,255,0.6)',
                  background: isActive ? '#fff' : 'transparent',
                  fontWeight: isActive ? 600 : 400
                }}
              >
                {d.label}
              </Link>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
