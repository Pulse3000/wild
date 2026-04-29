import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Bell, ChevronRight, TrendingUp } from 'lucide-react'
import { getSchaeden } from '../store.js'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const STATUS_COLORS = {
  'Offen': '#ef4444',
  'In Bearbeitung': '#f59e0b',
  'Abgeschlossen': '#22c55e'
}

const STATUS_ICONS = {
  'Offen': '🔴',
  'In Bearbeitung': '🟡',
  'Abgeschlossen': '✅'
}

export default function Uebersicht() {
  const navigate = useNavigate()
  const [schaeden, setSchaeden] = useState([])

  useEffect(() => {
    setSchaeden(getSchaeden())
  }, [])

  const gesamt = schaeden.length
  const offen = schaeden.filter(s => s.status === 'Offen').length
  const inBearbeitung = schaeden.filter(s => s.status === 'In Bearbeitung').length
  const abgeschlossen = schaeden.filter(s => s.status === 'Abgeschlossen').length

  const wildartStats = ['Schwarzwild', 'Rehwild', 'Rotwild', 'Damwild', 'Sonstiges'].map(art => ({
    name: art.replace('wild', ''),
    Anzahl: schaeden.filter(s => s.verursacher === art).length
  }))

  const flaechenStats = ['Grünland', 'Wald/Jungkultur', 'Maisfeld', 'Fichtenschonung', 'Sonstiges'].map(f => ({
    name: f,
    betrag: schaeden.filter(s => s.flaeche === f).reduce((sum, s) => sum + (s.schadenBetrag || 0), 0)
  })).filter(f => f.betrag > 0).sort((a, b) => b.betrag - a.betrag)

  const gesamtBetrag = schaeden.reduce((sum, s) => sum + (s.schadenBetrag || 0), 0)

  const letzteSchaeden = [...schaeden].slice(0, 5)

  return (
    <div style={{ padding: '16px', paddingBottom: 24 }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #00805F 0%, #005f46 100%)',
        borderRadius: 20,
        padding: '20px',
        marginBottom: 16,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', right: -20, top: -20,
          width: 100, height: 100,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', right: 10, top: 10,
          width: 70, height: 70,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36
        }}>🦊</div>
        <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, marginBottom: 4 }}>
          Rechberg & Umgebung · Schäden erfassen & verwalten
        </div>
        <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
          Die Wildschaden App
        </div>
        <button
          onClick={() => navigate('/schaeden/neu')}
          style={{
            background: '#F97316',
            color: '#fff',
            border: 'none',
            borderRadius: 14,
            padding: '14px 20px',
            fontSize: 15,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(249,115,22,0.4)'
          }}
        >
          <Plus size={20} />
          Neuen Schaden melden
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { emoji: '⚠️', zahl: gesamt, label: 'Gesamt', sub: 'Schäden erfasst', bg: '#fff7ed' },
          { emoji: '🔴', zahl: offen, label: 'Offen', sub: 'Noch unbearbeitet', bg: '#fef2f2' },
          { emoji: '🟡', zahl: inBearbeitung, label: 'In Bearbeitung', sub: 'Wird bearbeitet', bg: '#fffbeb' },
          { emoji: '✅', zahl: abgeschlossen, label: 'Abgeschlossen', sub: 'Erledigt', bg: '#f0fdf4' },
        ].map(item => (
          <div key={item.label} style={{
            background: item.bg,
            borderRadius: 16,
            padding: '16px',
            border: '1px solid rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: 26, marginBottom: 4 }}>{item.emoji}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e' }}>{item.zahl}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{item.label}</div>
            <div style={{ fontSize: 11, color: '#6b7280' }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Wildart Chart */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '16px', marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Schäden pro Wildart</div>
          <div style={{ fontSize: 12, color: '#6b7280', background: '#f3f4f6', padding: '3px 8px', borderRadius: 8 }}>
            Gesamt: {gesamt}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={wildartStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="Anzahl" radius={[6, 6, 0, 0]}>
              {wildartStats.map((_, i) => (
                <Cell key={i} fill={['#00805F', '#F97316', '#ef4444', '#f59e0b', '#6b7280'][i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gesamtschaden */}
      {flaechenStats.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 16, padding: '16px', marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Gesamtschaden pro Fläche</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#00805F' }}>~{(gesamtBetrag/1000).toFixed(1)}k €</div>
          </div>
          {flaechenStats.map((f, i) => (
            <div key={f.name} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: '#374151' }}>{f.name}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>
                  {f.betrag >= 1000 ? `${(f.betrag/1000).toFixed(1)}k` : f.betrag} €
                </span>
              </div>
              <div style={{ background: '#f3f4f6', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(f.betrag / flaechenStats[0].betrag) * 100}%`,
                  background: ['#00805F', '#F97316', '#ef4444', '#f59e0b', '#6b7280'][i],
                  borderRadius: 4,
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Benachrichtigungen */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '16px', marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Bell size={16} color="#00805F" />
          <div style={{ fontSize: 15, fontWeight: 600 }}>Benachrichtigungen</div>
        </div>
        <div style={{ fontSize: 13, color: '#6b7280' }}>E-Mail an Jagdpächter & Melder</div>
      </div>

      {/* Letzte Schäden */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Letzte Schäden</div>
          <button
            onClick={() => navigate('/schaeden')}
            style={{
              fontSize: 13, color: '#00805F', background: 'none',
              display: 'flex', alignItems: 'center', gap: 2
            }}
          >
            Alle <ChevronRight size={14} />
          </button>
        </div>
        {letzteSchaeden.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#9ca3af', fontSize: 14 }}>
            Noch keine Schäden erfasst
          </div>
        ) : letzteSchaeden.map(s => (
          <div
            key={s.id}
            onClick={() => navigate(`/schaeden/${s.id}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: '1px solid #f3f4f6',
              cursor: 'pointer',
              gap: 12
            }}
          >
            <div style={{
              width: 40, height: 40,
              borderRadius: 10,
              background: '#f3f4f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, flexShrink: 0
            }}>
              {STATUS_ICONS[s.status]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>
                {s.art} — {s.verursacher}
              </div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                {s.flaeche} · {s.schweregrad}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: 11, fontWeight: 600,
                color: STATUS_COLORS[s.status] || '#6b7280',
                background: `${STATUS_COLORS[s.status]}18`,
                padding: '2px 8px',
                borderRadius: 6,
                marginBottom: 2
              }}>
                {s.status}
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>
                {s.datum === new Date().toISOString().split('T')[0] ? 'Heute' :
                 s.datum === new Date(Date.now() - 86400000).toISOString().split('T')[0] ? 'Gestern' : s.datum}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
