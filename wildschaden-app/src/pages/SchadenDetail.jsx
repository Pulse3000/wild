import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSchaden, updateSchaden, deleteSchaden } from '../store.js'
import { MapPin, Edit2, Trash2, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react'

const STATUS_OPTIONS = ['Offen', 'In Bearbeitung', 'Abgeschlossen']
const STATUS_COLORS = { 'Offen': '#ef4444', 'In Bearbeitung': '#f59e0b', 'Abgeschlossen': '#22c55e' }

export default function SchadenDetail({ onUpdated }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [schaden, setSchaden] = useState(null)
  const [editStatus, setEditStatus] = useState(false)

  useEffect(() => {
    const s = getSchaden(id)
    if (!s) navigate('/')
    setSchaden(s)
  }, [id])

  if (!schaden) return null

  const handleStatusChange = (newStatus) => {
    updateSchaden(id, { status: newStatus })
    setSchaden(prev => ({ ...prev, status: newStatus }))
    setEditStatus(false)
    onUpdated && onUpdated()
  }

  const handleDelete = () => {
    if (window.confirm('Schaden wirklich löschen?')) {
      deleteSchaden(id)
      onUpdated && onUpdated()
      navigate(-1)
    }
  }

  const statusIcon = schaden.status === 'Offen' ? <AlertCircle size={16} /> :
                     schaden.status === 'In Bearbeitung' ? <Clock size={16} /> :
                     <CheckCircle size={16} />

  return (
    <div style={{ padding: '16px', paddingBottom: 32 }}>
      {/* Status Badge */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
      }}>
        <div
          onClick={() => setEditStatus(!editStatus)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            borderRadius: 20,
            background: `${STATUS_COLORS[schaden.status]}18`,
            color: STATUS_COLORS[schaden.status],
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {statusIcon}
          {schaden.status}
          <span style={{ fontSize: 11 }}>▼</span>
        </div>
        <button
          onClick={handleDelete}
          style={{
            padding: '8px',
            borderRadius: 10,
            background: '#fef2f2',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 13
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Status Picker */}
      {editStatus && (
        <div style={{
          background: '#fff',
          borderRadius: 14,
          padding: '12px',
          marginBottom: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}>
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                background: schaden.status === s ? `${STATUS_COLORS[s]}18` : '#f9fafb',
                color: schaden.status === s ? STATUS_COLORS[s] : '#374151',
                fontSize: 14,
                fontWeight: schaden.status === s ? 600 : 400,
                textAlign: 'left'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Main Info Card */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{schaden.art}</div>
        <div style={{ fontSize: 15, color: '#6b7280', marginBottom: 16 }}>durch {schaden.verursacher}</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Schweregrad', value: schaden.schweregrad },
            { label: 'Fläche', value: schaden.flaeche },
            { label: 'Datum', value: schaden.datum },
            { label: 'Ort', value: schaden.ort },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#f9fafb', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Schadenbetrag */}
      {schaden.schadenBetrag > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #e8f5f0, #d1ede6)',
          borderRadius: 14,
          padding: '16px',
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: 12, color: '#00805F', fontWeight: 600 }}>Geschätzter Schaden</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#1a1a2e' }}>~{schaden.schadenBetrag} €</div>
          </div>
          <div style={{ fontSize: 30 }}>💰</div>
        </div>
      )}

      {/* Standort */}
      <div style={{
        background: '#fff',
        borderRadius: 14,
        padding: '14px',
        marginBottom: 14,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <MapPin size={16} color="#00805F" />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Standort</span>
        </div>
        <div style={{ fontSize: 13, color: '#6b7280' }}>
          Lat: {schaden.lat?.toFixed(5)} · Lng: {schaden.lng?.toFixed(5)}
        </div>
      </div>

      {/* Bemerkung */}
      {schaden.bemerkung && (
        <div style={{
          background: '#fff',
          borderRadius: 14,
          padding: '14px',
          marginBottom: 14,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>BEMERKUNG</div>
          <div style={{ fontSize: 14, color: '#374151' }}>{schaden.bemerkung}</div>
        </div>
      )}

      {/* Fotos */}
      {schaden.fotos?.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 14, padding: '14px', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 10 }}>FOTOS</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {schaden.fotos.map((f, i) => (
              <img key={i} src={f} alt="" style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 10 }} />
            ))}
          </div>
        </div>
      )}

      {/* PDF Export */}
      <button style={{
        width: '100%',
        padding: '14px',
        borderRadius: 14,
        background: '#f3f4f6',
        color: '#374151',
        fontSize: 14,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
      }}>
        <FileText size={18} />
        Protokoll exportieren (PDF)
      </button>
    </div>
  )
}
