'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
    { num: 8, path: '/results', label: 'Báo cáo' }
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
        gap: '0.5rem',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        padding: '0.6rem 1rem', /* Thinner padding */
        maxWidth: '1000px',
        width: '100%'
      }}>
        {days.map(d => {
          const isActive = pathname === d.path
          return (
            <Link 
              key={d.num} 
              href={d.path}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '16px',
                fontSize: '0.8rem', /* Smaller, more discreet */
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                color: isActive ? '#000' : 'rgba(255,255,255,0.6)',
                background: isActive ? '#fff' : 'transparent',
                fontWeight: isActive ? 600 : 400
              }}
            >
              {d.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
