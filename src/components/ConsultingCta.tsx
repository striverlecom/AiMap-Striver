'use client'

import React, { useState } from 'react'

export interface ConsultingCtaProps {
  variant?: 'roadmap' | 'prd' | 'si' | 'general'
  source?: string
  defaultTopic?: string
  className?: string
}

export default function ConsultingCta({
  variant = 'general',
  source = 'unknown',
  defaultTopic,
  className = ''
}: ConsultingCtaProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    topic: defaultTopic || (
      variant === 'roadmap'
        ? 'Thẩm định Lộ trình 12 tháng & Bảng tính ROI'
        : variant === 'prd'
        ? 'Triển khai Trọn gói Multi-Agent theo PRD'
        : variant === 'si'
        ? 'Đấu nối System Instruction & Hạ tầng Agent'
        : 'Tư vấn Thẩm định Chiến lược AI Doanh nghiệp'
    ),
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const isPrdOrSi = variant === 'prd' || variant === 'si'

  const title = isPrdOrSi
    ? (variant === 'prd'
        ? 'Biến Đặc Tả Kỹ Thuật (PRD) Thành Hệ Thống Chạy Thực Tế'
        : 'Đấu Nối Multi-Agent Vào Hạ Tầng & Quy Trình Doanh Nghiệp')
    : 'Thẩm Định Lộ Trình & Đặc Tả Kỹ Thuật 1-on-1 Cùng Chuyên Gia'

  const subtitle = isPrdOrSi
    ? 'Bạn đã sở hữu bản đặc tả kỹ thuật chi tiết chuẩn Enterprise. Bước tiếp theo là đưa vào vận hành thực tế cùng đội ngũ kỹ sư Striver AI: đấu nối API, thiết lập cơ chế Human-in-the-Loop và triển khai trọn gói (Turnkey Agency) trong 2–4 tuần.'
    : 'Đừng vội chi tiền đầu tư khi chưa có phản biện chuyên sâu. Đặt lịch 45 phút thẩm định trực tiếp cùng Chuyên gia Chiến lược Striver AI để rà soát tính khả thi của ROI, bóc tách rủi ro bảo mật và chuẩn hóa dữ liệu trước khi bấm nút triển khai.'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/consulting/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: source || variant
        })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi gửi thông tin.')
      }

      setIsSuccess(true)
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể gửi yêu cầu lúc này. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div
        className={`glass-panel ${className}`}
        style={{
          width: '100%',
          marginTop: '2.5rem',
          marginBottom: '2rem',
          padding: '2.5rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(20, 24, 20, 0.85) 0%, rgba(12, 14, 16, 0.95) 100%)',
          border: '1px solid rgba(50, 215, 75, 0.3)',
          boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(50, 215, 75, 0.25)',
          borderRadius: '24px'
        }}
      >
        {/* Ambient Top Glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(50, 215, 75, 0.8), transparent)',
            pointerEvents: 'none'
          }}
        />

        {/* Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(50, 215, 75, 0.12)',
              border: '1px solid rgba(50, 215, 75, 0.35)',
              color: 'var(--success)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--success)',
                boxShadow: '0 0 8px var(--success)',
                display: 'inline-block'
              }}
            />
            Human-in-the-Loop · Tư Vấn Thực Chiến
          </span>
        </div>

        {/* Headline & Subtitle */}
        <h3
          style={{
            fontSize: 'clamp(1.35rem, 2.8vw, 1.85rem)',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '0.85rem',
            lineHeight: 1.3
          }}
        >
          {title}
        </h3>
        <p
          style={{
            color: '#a1a1a6',
            fontSize: '1rem',
            lineHeight: 1.65,
            maxWidth: '860px',
            marginBottom: '2rem'
          }}
        >
          {subtitle}
        </p>

        {/* 3 Pillars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.25rem'
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.25rem'
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🎯</div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 600, marginBottom: '6px' }}>
              Thẩm Định Độc Lập 1-on-1
            </h4>
            <p style={{ color: '#8e8e93', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
              Khắc phục điểm mù số liệu, rà soát tính khả thi của ROI và sàng lọc kỹ những quy trình chỉ cần chuẩn hoá SOP chứ chưa cần mua công cụ AI đắt đỏ.
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.25rem'
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🛡️</div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 600, marginBottom: '6px' }}>
              An Ninh & Dữ Liệu Doanh Nghiệp
            </h4>
            <p style={{ color: '#8e8e93', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
              Thiết kế rào chắn bảo vệ bí mật kinh doanh và dữ liệu khách hàng. Đảm bảo tuân thủ phân quyền và cơ chế kiểm duyệt trước khi đưa dữ liệu vào LLM.
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.25rem'
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⚡</div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 600, marginBottom: '6px' }}>
              Triển Khai Trọn Gói (Turnkey)
            </h4>
            <p style={{ color: '#8e8e93', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
              Đội ngũ Kỹ sư Striver AI trực tiếp nhận chuyển giao: viết code, tích hợp Agent vào Zalo/CRM, cấu hình n8n và bàn giao trọn gói trong 2–4 tuần.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <button
            onClick={() => setIsOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #32d74b 0%, #20a036 100%)',
              color: '#000000',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '14px 28px',
              borderRadius: '999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(50, 215, 75, 0.35)',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <span>🗓️</span>
            <span>Đặt Lịch Thẩm Định 1-on-1 (Miễn Phí 45 Phút)</span>
          </button>

          <a
            href="https://striverle.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontWeight: 500,
              fontSize: '0.95rem',
              padding: '13px 24px',
              borderRadius: '999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)')}
            onMouseOut={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
          >
            <span>💬</span>
            <span>Tìm hiểu Chuyên gia Striver Le</span>
          </a>

          <span style={{ color: 'var(--muted)', fontSize: '0.85rem', marginLeft: 'auto' }}>
            🔒 Bảo mật 100% dữ liệu phỏng vấn & sổ sách
          </span>
        </div>
      </div>

      {/* Sleek Apple-style Booking Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
          onClick={e => {
            if (e.target === e.currentTarget) setIsOpen(false)
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              background: '#161618',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '24px',
              padding: '2rem',
              position: 'relative',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
              color: '#ffffff'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#8e8e93',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              ✕
            </button>

            {isSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', color: '#ffffff' }}>
                  Tiếp Nhận Yêu Cầu Thành Công!
                </h3>
                <p style={{ color: '#a1a1a6', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Cảm ơn bạn. Chuyên gia Chiến lược của Striver AI đã nhận thông tin và sẽ chủ động liên hệ lại qua Số điện thoại / Zalo trong vòng <strong>2–4 giờ làm việc</strong> để sắp xếp buổi thẩm định 1-on-1.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button
                    onClick={() => {
                      setIsSuccess(false)
                      setIsOpen(false)
                    }}
                    className="btn-primary"
                    style={{ padding: '10px 24px', fontSize: '0.95rem' }}
                  >
                    Đóng cửa sổ
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <span
                    style={{
                      color: 'var(--success)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase'
                    }}
                  >
                    Đặt Lịch Thẩm Định Trực Tiếp
                  </span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '4px', marginBottom: '6px' }}>
                    Trao Đổi 1-on-1 Cùng Chuyên Gia Striver AI
                  </h3>
                  <p style={{ color: '#8e8e93', fontSize: '0.88rem', margin: 0 }}>
                    Buổi trao đổi 45 phút bảo mật qua Google Meet nhằm thẩm định lộ trình, tính khả thi và báo giá triển khai cụ thể.
                  </p>
                </div>

                {errorMsg && (
                  <div
                    style={{
                      background: 'rgba(255, 69, 58, 0.12)',
                      border: '1px solid rgba(255, 69, 58, 0.4)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#ff453a',
                      fontSize: '0.88rem',
                      marginBottom: '1.25rem'
                    }}
                  >
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#a1a1a6', marginBottom: '6px' }}>
                      Họ và tên của bạn <span style={{ color: '#ff453a' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      style={modalInputStyle}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#a1a1a6', marginBottom: '6px' }}>
                        Số điện thoại / Zalo <span style={{ color: '#ff453a' }}>*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0912 345 678"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        style={modalInputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#a1a1a6', marginBottom: '6px' }}>
                        Tên doanh nghiệp / Lĩnh vực
                      </label>
                      <input
                        type="text"
                        placeholder="Công ty TNHH XYZ"
                        value={formData.company}
                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                        style={modalInputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#a1a1a6', marginBottom: '6px' }}>
                      Nhu cầu trọng tâm cần thẩm định
                    </label>
                    <select
                      value={formData.topic}
                      onChange={e => setFormData({ ...formData, topic: e.target.value })}
                      style={{ ...modalInputStyle, cursor: 'pointer' }}
                    >
                      <option value="Thẩm định Lộ trình 12 tháng & Bảng tính ROI">
                        Thẩm định Lộ trình 12 tháng & Bảng tính ROI (Phản biện độc lập)
                      </option>
                      <option value="Triển khai Trọn gói Multi-Agent theo PRD">
                        Triển khai Trọn gói Multi-Agent theo PRD (Turnkey Agency 2-4 tuần)
                      </option>
                      <option value="Đấu nối System Instruction & Hạ tầng Agent">
                        Đấu nối System Instruction & Hạ tầng Agent (Zalo, CRM, n8n, API)
                      </option>
                      <option value="Rà soát An ninh Dữ liệu & Chuẩn hoá SOP">
                        Rà soát An ninh Dữ liệu & Chuẩn hoá SOP Nội bộ trước khi dùng AI
                      </option>
                      <option value="Khác">Nhu cầu tư vấn khác</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#a1a1a6', marginBottom: '6px' }}>
                      Ghi chú thêm về bối cảnh hoặc mong đợi của bạn
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ví dụ: Đang có 5 nhân sự trực chat Zalo bị quá tải, muốn tự động hoá nhưng lo ngại nhân viên không chịu thích nghi..."
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      style={{ ...modalInputStyle, resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      style={{
                        padding: '12px 20px',
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#a1a1a6',
                        borderRadius: '999px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Huỷ bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        padding: '12px 28px',
                        background: 'linear-gradient(135deg, #32d74b 0%, #20a036 100%)',
                        color: '#000000',
                        fontWeight: 700,
                        border: 'none',
                        borderRadius: '999px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        fontSize: '0.95rem',
                        opacity: isSubmitting ? 0.7 : 1
                      }}
                    >
                      {isSubmitting ? 'Đang gửi thông tin...' : 'Xác Nhận Đặt Lịch (Free)'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

const modalInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  background: 'rgba(0, 0, 0, 0.35)',
  color: '#ffffff',
  fontSize: '0.92rem',
  outline: 'none',
  boxSizing: 'border-box'
}
