'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminClient() {
  const [adminKey, setAdminKey] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [selectedUserDossier, setSelectedUserDossier] = useState<any | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    const savedKey = localStorage.getItem('striver_admin_key')
    if (savedKey) {
      setAdminKey(savedKey)
      fetchLeads(savedKey)
    } else {
      // Auto-unlock if user is already logged in as admin (e.g. striveraivn@gmail.com)
      fetch('/api/admin/leads')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.leads) {
            setLeads(data.leads)
            setIsUnlocked(true)
          }
        })
        .catch(() => {})
    }
  }, [])

  const fetchLeads = async (key: string) => {
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch(`/api/admin/leads?adminKey=${encodeURIComponent(key)}`, {
        headers: { 'x-admin-key': key }
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Admin key không chính xác.')
      }

      setLeads(data.leads || [])
      setIsUnlocked(true)
      localStorage.setItem('striver_admin_key', key)
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể xác thực quyền Admin.')
      setIsUnlocked(false)
    } finally {
      setLoading(false)
    }
  }

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminKey.trim()) return
    fetchLeads(adminKey.trim())
  }

  const handleUpdateStatus = async (leadId: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}?adminKey=${encodeURIComponent(adminKey)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({ status: nextStatus })
      })
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: nextStatus } : l))
      }
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const filteredLeads = leads.filter(l => {
    if (filterStatus === 'all') return true
    return l.status === filterStatus
  })

  const stats = {
    total: leads.length,
    pending: leads.filter(l => l.status === 'pending').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    converted: leads.filter(l => l.status === 'converted').length
  }

  if (!isUnlocked) {
    return (
      <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          className="glass-panel"
          style={{
            width: '100%',
            maxWidth: '420px',
            textAlign: 'center',
            padding: '2.5rem 2rem',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔐</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Striver AI Admin Portal
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Vui lòng nhập Passcode để truy cập danh sách khách hàng và hồ sơ thẩm định.
          </p>

          {errorMsg && (
            <div style={{ color: 'var(--error)', background: 'rgba(255,69,58,0.1)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="password"
              placeholder="Nhập Admin Key..."
              value={adminKey}
              onChange={e => setAdminKey(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(0,0,0,0.4)',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                textAlign: 'center'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
            >
              {loading ? 'Đang mở khoá...' : 'Đăng Nhập Quản Trị'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            ● Agency Consultant Dashboard
          </span>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 800, marginTop: '4px', marginBottom: '4px' }}>
            Hồ Sơ Khách Hàng & Yêu Cầu Thẩm Định
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
            Quản lý phễu tư vấn 1-on-1 và bóc tách dữ liệu 9 ngày của từng doanh nghiệp trước khi họp.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => fetchLeads(adminKey)}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            🔄 Làm Mới
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('striver_admin_key')
              setIsUnlocked(false)
            }}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem', color: 'var(--error)' }}
          >
            Đăng Xuất
          </button>
        </div>
      </div>

      {/* METRICS OVERVIEW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Tổng Yêu Cầu</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--foreground)' }}>{stats.total}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ color: 'var(--warning)', fontSize: '0.85rem' }}>Chờ Liên Hệ</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)' }}>{stats.pending}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #0071e3' }}>
          <div style={{ color: '#0071e3', fontSize: '0.85rem' }}>Đã Trao Đổi 1-on-1</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0071e3' }}>{stats.contacted}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--success)' }}>
          <div style={{ color: 'var(--success)', fontSize: '0.85rem' }}>Chốt Hợp Đồng Agency</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>{stats.converted}</div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: `Tất cả (${stats.total})` },
          { id: 'pending', label: `Chờ liên hệ (${stats.pending})` },
          { id: 'contacted', label: `Đã liên hệ (${stats.contacted})` },
          { id: 'converted', label: `Chốt hợp đồng (${stats.converted})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 500,
              background: filterStatus === tab.id ? '#ffffff' : 'rgba(255,255,255,0.06)',
              color: filterStatus === tab.id ? '#000000' : 'var(--muted)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* LEADS TABLE */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.03)' }}>
                <th style={{ padding: '1rem', color: 'var(--muted)', fontWeight: 600 }}>Khách Hàng / Công Ty</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', fontWeight: 600 }}>Liên Hệ Trực Tiếp</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', fontWeight: 600 }}>Nhu Cầu Thẩm Định</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', fontWeight: 600 }}>Nguồn</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', fontWeight: 600 }}>Trạng Thái</th>
                <th style={{ padding: '1rem', color: 'var(--muted)', fontWeight: 600, textAlign: 'right' }}>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
                    Chưa có yêu cầu tư vấn nào trong mục này.
                  </td>
                </tr>
              ) : (
                filteredLeads.map(lead => {
                  const cleanPhone = String(lead.phone || '').replace(/\D/g, '')
                  return (
                    <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--foreground)' }}>{lead.name}</div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{lead.company || 'Doanh nghiệp chưa đặt tên'}</div>
                        <div style={{ color: '#6e6e73', fontSize: '0.75rem', marginTop: '2px' }}>
                          {new Date(lead.createdAt).toLocaleString('vi-VN')}
                        </div>
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 500 }}>{lead.phone}</span>
                          <a
                            href={`https://zalo.me/${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: '#0068ff',
                              color: '#fff',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              textDecoration: 'none'
                            }}
                          >
                            Zalo
                          </a>
                          <a
                            href={`tel:${cleanPhone}`}
                            style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: 'rgba(255,255,255,0.1)',
                              color: '#fff',
                              fontSize: '0.75rem',
                              textDecoration: 'none'
                            }}
                          >
                            Gọi
                          </a>
                        </div>
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <div style={{ color: 'var(--foreground)', fontWeight: 500, fontSize: '0.88rem' }}>{lead.topic}</div>
                        {lead.notes && (
                          <div style={{ color: 'var(--muted)', fontSize: '0.8rem', fontStyle: 'italic', marginTop: '4px', maxWidth: '240px' }}>
                            "{lead.notes}"
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'var(--muted)'
                          }}
                        >
                          {lead.source}
                        </span>
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <select
                          value={lead.status}
                          onChange={e => handleUpdateStatus(lead.id, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            background: lead.status === 'converted'
                              ? 'rgba(50, 215, 75, 0.15)'
                              : lead.status === 'contacted'
                              ? 'rgba(0, 113, 227, 0.15)'
                              : 'rgba(255, 159, 10, 0.15)',
                            color: lead.status === 'converted'
                              ? 'var(--success)'
                              : lead.status === 'contacted'
                              ? '#0071e3'
                              : 'var(--warning)',
                            border: 'none',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="pending" style={{ background: '#222', color: '#fff' }}>⏳ Chờ liên hệ</option>
                          <option value="contacted" style={{ background: '#222', color: '#fff' }}>📞 Đã liên hệ</option>
                          <option value="converted" style={{ background: '#222', color: '#fff' }}>🚀 Chốt Hợp Đồng</option>
                          <option value="rejected" style={{ background: '#222', color: '#fff' }}>✕ Không phù hợp</option>
                        </select>
                      </td>

                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedUserDossier(lead)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '999px',
                            background: lead.user ? 'rgba(50, 215, 75, 0.15)' : 'rgba(255,255,255,0.08)',
                            color: lead.user ? 'var(--success)' : 'var(--muted)',
                            border: lead.user ? '1px solid rgba(50, 215, 75, 0.3)' : '1px solid rgba(255,255,255,0.1)',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          {lead.user ? '🔎 Hồ Sơ 9 Ngày' : 'Thông tin cơ bản'}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER 9-DAY DOSSIER DRAWER/MODAL */}
      {selectedUserDossier && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'flex-end',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)'
          }}
          onClick={e => {
            if (e.target === e.currentTarget) setSelectedUserDossier(null)
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '720px',
              height: '100vh',
              background: '#141416',
              borderLeft: '1px solid rgba(255,255,255,0.15)',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '-10px 0 40px rgba(0,0,0,0.8)',
              color: '#ffffff'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Hồ Sơ Kiểm Toán Khách Hàng
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '2px 0 0 0' }}>
                  {selectedUserDossier.name} · {selectedUserDossier.company || 'Doanh nghiệp'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedUserDossier(null)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#aaa',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '1.1rem'
                }}
              >
                ✕
              </button>
            </div>

            {/* QUICK CONTACT BAR */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>SĐT/Zalo: <strong>{selectedUserDossier.phone}</strong></div>
              <div>Nhu cầu: <strong style={{ color: 'var(--warning)' }}>{selectedUserDossier.topic}</strong></div>
              <a
                href={`https://zalo.me/${String(selectedUserDossier.phone).replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.8rem', marginLeft: 'auto' }}
              >
                Nhắn Zalo Ngay
              </a>
            </div>

            {/* 9-DAY AUDIT HIGHLIGHTS */}
            {selectedUserDossier.user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Ngày 1: Điểm sẵn sàng */}
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--success)', marginBottom: '8px' }}>
                    Ngày 1: Đánh Giá Tính Sẵn Sàng AI
                  </h4>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
                    <div>Điểm tự chấm: <strong>{selectedUserDossier.user.day1Data?.totalScore || 0}/35</strong></div>
                  </div>
                  {selectedUserDossier.user.day1Data?.notes && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '6px' }}>
                      Ghi chú: {selectedUserDossier.user.day1Data.notes}
                    </div>
                  )}
                </div>

                {/* Ngày 2: Tài chính & Bảng lương */}
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--warning)', marginBottom: '8px' }}>
                    Ngày 2: Doanh Thu & Cơ Cấu Lương
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
                    <div>Doanh thu: <strong>{selectedUserDossier.user.day2Data?.revenue?.toLocaleString()} đ</strong></div>
                    <div>Mục tiêu: <strong>{selectedUserDossier.user.day2Data?.targetRevenue?.toLocaleString()} đ</strong></div>
                    <div>Khách hàng: <strong>{selectedUserDossier.user.day2Data?.customerCount || 0}</strong></div>
                    <div>Tỷ lệ rời bỏ: <strong>{selectedUserDossier.user.day2Data?.churnRate || 0}%</strong></div>
                  </div>
                </div>

                {/* Ngày 5 & 6: Top 3 Giải Pháp & ROI */}
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ fontSize: '1rem', color: '#0071e3', marginBottom: '8px' }}>
                    Ngày 5 & 6: Giải Pháp Ưu Tiên & Bảng Tính ROI
                  </h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                    Xem chi tiết trong tài khoản người dùng hoặc trao đổi trực tiếp trong buổi thẩm định 45 phút.
                  </div>
                </div>

                {/* Ngày 8 & 9: PRD & System Instruction */}
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ fontSize: '1rem', color: '#ff2d55', marginBottom: '8px' }}>
                    Ngày 8 & 9: Đặc Tả Kỹ Thuật (PRD) & Não Bộ Multi-Agent
                  </h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                    {selectedUserDossier.user.day8Data?.prdData ? '✓ Đã tạo bản vẽ kỹ thuật PRD' : 'Chưa tạo PRD'} ·{' '}
                    {selectedUserDossier.user.day9Data?.siData ? '✓ Đã tạo System Instruction' : 'Chưa tạo SI'}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>
                Khách hàng này để lại thông tin tư vấn trực tiếp (chưa liên kết với tài khoản kiểm toán 9 ngày).
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
