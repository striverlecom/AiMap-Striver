import React from 'react'

type Props = {
  badge?: string
  title?: string
  children: React.ReactNode
  action?: React.ReactNode
  variant?: 'neutral' | 'accent' | 'blue'
  style?: React.CSSProperties
}

export default function AppleNotice({ badge, title, children, action, variant = 'neutral', style }: Props) {
  const accentBorder = variant === 'accent'
    ? 'rgba(52, 199, 89, 0.28)'
    : variant === 'blue'
      ? 'rgba(10, 132, 255, 0.28)'
      : 'rgba(255, 255, 255, 0.09)'

  const accentGlow = variant === 'accent'
    ? 'rgba(52, 199, 89, 0.06)'
    : variant === 'blue'
      ? 'rgba(10, 132, 255, 0.06)'
      : 'rgba(255, 255, 255, 0.025)'

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${accentGlow} 0%, rgba(255, 255, 255, 0.01) 100%)`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${accentBorder}`,
        borderRadius: '16px',
        padding: '1rem 1.35rem',
        boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
        ...style
      }}
    >
      <div style={{ flex: 1, minWidth: '260px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: title || badge ? '6px' : '0' }}>
          {badge && (
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '2px 9px',
                borderRadius: '999px',
                background: variant === 'accent' ? 'rgba(52, 199, 89, 0.12)' : variant === 'blue' ? 'rgba(10, 132, 255, 0.12)' : 'rgba(255, 255, 255, 0.08)',
                color: variant === 'accent' ? '#34c759' : variant === 'blue' ? '#38bdf8' : 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              {badge}
            </span>
          )}
          {title && (
            <strong style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600, letterSpacing: '-0.01em' }}>
              {title}
            </strong>
          )}
        </div>
        <div style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.55 }}>
          {children}
        </div>
      </div>
      {action && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{action}</div>}
    </div>
  )
}
