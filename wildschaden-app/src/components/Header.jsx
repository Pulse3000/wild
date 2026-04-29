import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Settings } from 'lucide-react'

const titles = {
  '/': null,
  '/schaeden': 'Schäden',
  '/schaeden/neu': 'Schaden melden',
  '/karte': 'Karte',
  '/paechter': 'Pächter',
  '/einstellungen': 'Einstellungen'
}

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname

  const isHome = path === '/'
  const isDetail = path.startsWith('/schaeden/') && path !== '/schaeden/neu' && path !== '/schaeden'
  const title = titles[path] || (isDetail ? 'Schaden Details' : '')
  const showBack = path !== '/' && path !== '/schaeden' && path !== '/karte' && path !== '/paechter'

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      paddingTop: 'env(safe-area-inset-top, 0px)',
      height: 'calc(56px + env(safe-area-inset-top, 0px))'
    }}>
      <div style={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 12
      }}>
        {showBack ? (
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 36, height: 36,
              borderRadius: 10,
              background: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <ArrowLeft size={18} color="#374151" />
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #00805F, #006B4F)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18
            }}>🦊</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.2 }}>Die Wildschaden App</div>
              <div style={{ fontSize: 11, color: '#00805F', lineHeight: 1.2 }}>Rechberg & Umgebung</div>
            </div>
          </div>
        )}

        <div style={{ flex: 1, textAlign: showBack ? 'left' : 'center' }}>
          {showBack && title && (
            <span style={{ fontSize: 17, fontWeight: 600, color: '#1a1a2e' }}>{title}</span>
          )}
        </div>

        {isHome && (
          <button
            onClick={() => navigate('/einstellungen')}
            style={{
              width: 36, height: 36,
              borderRadius: 10,
              background: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Settings size={18} color="#374151" />
          </button>
        )}
      </div>
    </header>
  )
}
