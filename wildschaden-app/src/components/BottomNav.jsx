import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, AlertTriangle, Map, Users } from 'lucide-react'

const navItems = [
  { path: '/', icon: Home, label: 'Übersicht' },
  { path: '/schaeden', icon: AlertTriangle, label: 'Schäden' },
  { path: '/karte', icon: Map, label: 'Karte' },
  { path: '/paechter', icon: Users, label: 'Pächter' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#fff',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      zIndex: 100
    }}>
      {navItems.map(({ path: p, icon: Icon, label }) => {
        const isActive = path === p || (p === '/schaeden' && path.startsWith('/schaeden'))
        return (
          <button
            key={p}
            onClick={() => navigate(p)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              padding: '8px 0',
              background: 'transparent',
              color: isActive ? '#00805F' : '#9ca3af',
              transition: 'color 0.15s',
              border: 'none'
            }}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
            <span style={{
              fontSize: 10,
              fontWeight: isActive ? 600 : 400,
              lineHeight: 1
            }}>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
