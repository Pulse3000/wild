import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSchaeden } from '../store.js'

const STATUS_COLORS = {
  'Offen': '#ef4444',
  'In Bearbeitung': '#f59e0b',
  'Abgeschlossen': '#22c55e'
}

export default function Karte() {
  const navigate = useNavigate()
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [schaeden, setSchaeden] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    setSchaeden(getSchaeden())
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Load Leaflet dynamically
    const initMap = async () => {
      const L = await import('leaflet')

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }

      if (!mapRef.current) return

      const map = L.default.map(mapRef.current, {
        center: [48.714, 9.843],
        zoom: 13,
        zoomControl: true
      })

      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map)

      schaeden.forEach(s => {
        if (!s.lat || !s.lng) return
        const color = STATUS_COLORS[s.status] || '#6b7280'

        const icon = L.default.divIcon({
          html: `<div style="
            width: 32px; height: 32px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex; align-items: center; justify-content: center;
            font-size: 14px;
          ">
            ${s.verursacher === 'Schwarzwild' ? '🐗' :
              s.verursacher === 'Rehwild' ? '🦌' :
              s.verursacher === 'Rotwild' ? '🦌' : '🐾'}
          </div>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        })

        L.default.marker([s.lat, s.lng], { icon })
          .addTo(map)
          .on('click', () => setSelected(s))
      })

      mapInstanceRef.current = map
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [schaeden])

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      {/* Legend */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        zIndex: 999,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 12,
        padding: '8px 12px',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        fontSize: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
            <span style={{ color: '#374151' }}>{status}</span>
          </div>
        ))}
        <span style={{ marginLeft: 'auto', color: '#9ca3af' }}>{schaeden.length} Schäden</span>
      </div>

      {/* Map Container */}
      <div
        ref={mapRef}
        style={{ width: '100%', height: 'calc(100vh - 180px)', minHeight: 400 }}
      />

      {/* Selected Popup */}
      {selected && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 16,
          right: 16,
          zIndex: 999,
          background: '#fff',
          borderRadius: 16,
          padding: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{selected.art}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>
                {selected.verursacher} · {selected.flaeche} · {selected.schweregrad}
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>📍 {selected.ort}</div>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 600,
              color: STATUS_COLORS[selected.status],
              background: `${STATUS_COLORS[selected.status]}18`,
              padding: '4px 10px',
              borderRadius: 8
            }}>
              {selected.status}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button
              onClick={() => navigate(`/schaeden/${selected.id}`)}
              style={{
                flex: 1, padding: '10px',
                borderRadius: 10, background: '#00805F',
                color: '#fff', fontSize: 13, fontWeight: 600
              }}
            >
              Details anzeigen
            </button>
            <button
              onClick={() => setSelected(null)}
              style={{
                padding: '10px 14px',
                borderRadius: 10, background: '#f3f4f6',
                color: '#374151', fontSize: 13
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
