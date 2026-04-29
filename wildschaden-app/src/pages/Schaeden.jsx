import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Filter, ChevronRight, Trash2 } from 'lucide-react'
import { getSchaeden, deleteSchaden } from '../store.js'

const STATUS_COLORS = {
  'Offen': '#ef4444',
  'In Bearbeitung': '#f59e0b',
  'Abgeschlossen': '#22c55e'
}

const SCHWERE_COLORS = {
  'Leicht': '#22c55e',
  'Mittel': '#f59e0b',
  'Schwer': '#ef4444'
}

export default function Schaeden() {
  const navigate = useNavigate()
  const [schaeden, setSchaeden] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Alle')
  const [showFilter, setShowFilter] = useState(false)

  useEffect(() => {
    setSchaeden(getSchaeden())
  }, [])

  const filters = ['Alle', 'Offen', 'In Bearbeitung', 'Abgeschlossen']

  const gefiltert = schaeden
    .filter(s => filter === 'Alle' || s.status === filter)
    .filter(s => !search || s.art.toLowerCase().includes(search.toLowerCase()) ||
      s.verursacher.toLowerCase().includes(search.toLowerCase()) ||
      s.ort.toLowerCase().includes(search.toLowerCase()) ||
      s.flaeche.toLowerCase().includes(search.toLowerCase()))

  const handleDelete = (e, id) => {
    e.stopPropagation()
    if (window.confirm('Schaden wirklich löschen?')) {
      deleteSchaden(id)
      setSchaeden(getSchaeden())
    }
  }

  return (
    <div style={{ padding: '16px' }}>
      {/* Header Actions */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: '0 12px'
        }}>
          <Search size={16} color="#9ca3af" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Schäden suchen…"
            style={{
              flex: 1, height: 42, border: 'none',
              fontSize: 14, color: '#1a1a2e', background: 'transparent'
            }}
          />
        </div>
        <button
          onClick={() => navigate('/schaeden/neu')}
          style={{
            background: '#00805F',
            color: '#fff',
            borderRadius: 12,
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 14,
            fontWeight: 600
          }}
        >
          <Plus size={18} />
          Neu
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 2 }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              flexShrink: 0,
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 500,
              background: filter === f ? '#00805F' : '#fff',
              color: filter === f ? '#fff' : '#6b7280',
              border: filter === f ? '1px solid #00805F' : '1px solid #e5e7eb'
            }}
          >
            {f}
            {f !== 'Alle' && (
              <span style={{ marginLeft: 4 }}>
                ({schaeden.filter(s => s.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {gefiltert.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 20px',
            color: '#9ca3af', fontSize: 14
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🌿</div>
            <div>Keine Schäden gefunden</div>
          </div>
        ) : gefiltert.map(s => (
          <div
            key={s.id}
            onClick={() => navigate(`/schaeden/${s.id}`)}
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: '14px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              cursor: 'pointer',
              display: 'flex',
              gap: 12,
              alignItems: 'center'
            }}
          >
            <div style={{
              width: 48, height: 48,
              borderRadius: 12,
              background: `${STATUS_COLORS[s.status]}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{ fontSize: 22 }}>
                {s.verursacher === 'Schwarzwild' ? '🐗' :
                 s.verursacher === 'Rehwild' ? '🦌' :
                 s.verursacher === 'Rotwild' ? '🦌' :
                 s.verursacher === 'Damwild' ? '🦌' : '🐾'}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>
                {s.art}
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>
                {s.verursacher} · {s.flaeche}
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>
                📍 {s.ort} · {s.datum}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: STATUS_COLORS[s.status],
                background: `${STATUS_COLORS[s.status]}15`,
                padding: '3px 8px',
                borderRadius: 6
              }}>
                {s.status}
              </span>
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: SCHWERE_COLORS[s.schweregrad],
                background: `${SCHWERE_COLORS[s.schweregrad]}15`,
                padding: '3px 8px',
                borderRadius: 6
              }}>
                {s.schweregrad}
              </span>
              {s.schadenBetrag > 0 && (
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e' }}>
                  ~{s.schadenBetrag} €
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
