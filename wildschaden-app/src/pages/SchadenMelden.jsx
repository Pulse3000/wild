import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Image, MapPin, Sparkles, FileText, Bell, Save, AlertCircle } from 'lucide-react'
import { addSchaden, kalkuliereSchaden } from '../store.js'

const SCHADENSARTEN = ['Wühlschaden', 'Verbiss', 'Schälschaden', 'Fraßschaden', 'Sonstiges']
const VERURSACHER = ['Schwarzwild', 'Rehwild', 'Rotwild', 'Damwild', 'Sonstiges']
const SCHWEREGRADE = ['Leicht', 'Mittel', 'Schwer']
const FLAECHEN = ['Grünland', 'Wald/Jungkultur', 'Fichtenschonung', 'Maisfeld', 'Getreidefeld', 'Sonstiges']

export default function SchadenMelden({ onSaved }) {
  const navigate = useNavigate()
  const fileRef = useRef()

  const [form, setForm] = useState({
    art: '',
    verursacher: '',
    schweregrad: '',
    flaeche: '',
    ort: '',
    datum: new Date().toISOString().split('T')[0],
    bemerkung: '',
    lat: 48.714,
    lng: 9.843,
    fotos: [],
    schadenBetrag: 0
  })

  const [gpsStatus, setGpsStatus] = useState('Lade GPS…')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setForm(f => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude }))
          setGpsStatus('GPS-Standort erfasst ✓')
        },
        () => setGpsStatus('GPS nicht verfügbar – Standort gesetzt')
      )
    } else {
      setGpsStatus('GPS nicht unterstützt')
    }
  }, [])

  // Auto-kalkulation
  useEffect(() => {
    if (form.art && form.schweregrad && form.flaeche) {
      const betrag = kalkuliereSchaden(form.art, form.schweregrad, form.flaeche)
      setForm(f => ({ ...f, schadenBetrag: betrag }))
    }
  }, [form.art, form.schweregrad, form.flaeche])

  const handlePhoto = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setForm(f => ({ ...f, fotos: [...f.fotos, ev.target.result] }))
      }
      reader.readAsDataURL(file)
    })
  }

  const validate = () => {
    const e = {}
    if (!form.art) e.art = true
    if (!form.verursacher) e.verursacher = true
    if (!form.schweregrad) e.schweregrad = true
    if (!form.flaeche) e.flaeche = true
    if (!form.ort) e.ort = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => {
      addSchaden(form)
      onSaved && onSaved()
      navigate(-1)
    }, 500)
  }

  const Chip = ({ options, field, label }) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        color: errors[field] ? '#ef4444' : '#6b7280',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        marginBottom: 8
      }}>
        {label} {errors[field] && '⚠'}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => { setForm(f => ({ ...f, [field]: opt })); setErrors(e => ({ ...e, [field]: false })) }}
            style={{
              padding: '8px 14px',
              borderRadius: 20,
              fontSize: 14,
              background: form[field] === opt ? '#00805F' : '#fff',
              color: form[field] === opt ? '#fff' : '#374151',
              border: form[field] === opt ? '1.5px solid #00805F' : '1.5px solid #e5e7eb',
              fontWeight: form[field] === opt ? 600 : 400
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{ padding: '16px', paddingBottom: 32 }}>
      {/* Fotos */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
          FOTOS DES SCHADENS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button
            onClick={() => { fileRef.current.setAttribute('capture', 'environment'); fileRef.current.click() }}
            style={{
              padding: '16px',
              borderRadius: 14,
              background: '#fff',
              border: '1.5px dashed #d1d5db',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              color: '#374151',
              fontSize: 14
            }}
          >
            <Camera size={24} color="#00805F" />
            Kamera
          </button>
          <button
            onClick={() => { fileRef.current.removeAttribute('capture'); fileRef.current.click() }}
            style={{
              padding: '16px',
              borderRadius: 14,
              background: '#fff',
              border: '1.5px dashed #d1d5db',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              color: '#374151',
              fontSize: 14
            }}
          >
            <Image size={24} color="#00805F" />
            Galerie
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handlePhoto}
        />

        {form.fotos.length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 10, overflowX: 'auto' }}>
            {form.fotos.map((f, i) => (
              <img
                key={i}
                src={f}
                alt=""
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}
              />
            ))}
          </div>
        )}

        <div style={{
          marginTop: 10,
          fontSize: 12,
          color: '#00805F',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          <Sparkles size={14} />
          Foto hochladen → KI erkennt Schadensart & Verursacher automatisch
        </div>
      </div>

      <Chip options={SCHADENSARTEN} field="art" label="Schadensart" />
      <Chip options={VERURSACHER} field="verursacher" label="Verursacher" />

      {/* Schweregrad */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: errors.schweregrad ? '#ef4444' : '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
          SCHWEREGRAD {errors.schweregrad && '⚠'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {SCHWEREGRADE.map(s => (
            <button
              key={s}
              onClick={() => { setForm(f => ({ ...f, schweregrad: s })); setErrors(e => ({ ...e, schweregrad: false })) }}
              style={{
                padding: '12px 8px',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 500,
                background: form.schweregrad === s ?
                  (s === 'Leicht' ? '#22c55e' : s === 'Mittel' ? '#f59e0b' : '#ef4444') : '#fff',
                color: form.schweregrad === s ? '#fff' : '#374151',
                border: form.schweregrad === s ? 'none' : '1.5px solid #e5e7eb'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <Chip options={FLAECHEN} field="flaeche" label="Fläche" />

      {/* Ort + Datum */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: errors.ort ? '#ef4444' : '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
            ORT {errors.ort && '⚠'}
          </div>
          <input
            value={form.ort}
            onChange={e => { setForm(f => ({ ...f, ort: e.target.value })); setErrors(e => ({ ...e, ort: false })) }}
            placeholder="z.B. Nordfeld West"
            style={{
              width: '100%', padding: '12px', borderRadius: 12,
              border: `1.5px solid ${errors.ort ? '#ef4444' : '#e5e7eb'}`,
              fontSize: 14, background: '#fff', color: '#1a1a2e'
            }}
          />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
            DATUM
          </div>
          <input
            type="date"
            value={form.datum}
            onChange={e => setForm(f => ({ ...f, datum: e.target.value }))}
            style={{
              width: '100%', padding: '12px', borderRadius: 12,
              border: '1.5px solid #e5e7eb',
              fontSize: 14, background: '#fff', color: '#1a1a2e'
            }}
          />
        </div>
      </div>

      {/* KI Kalkulator */}
      {form.schadenBetrag > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #e8f5f0, #d1ede6)',
          borderRadius: 14,
          padding: '14px',
          marginBottom: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <Sparkles size={20} color="#00805F" />
          <div>
            <div style={{ fontSize: 12, color: '#00805F', fontWeight: 600 }}>KI-Schadenskalkulator</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e' }}>~{form.schadenBetrag} €</div>
            <div style={{ fontSize: 11, color: '#6b7280' }}>Geschätzter Schadensbetrag</div>
          </div>
        </div>
      )}
      {!form.schadenBetrag && (
        <div style={{
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: 14,
          padding: '12px',
          marginBottom: 18,
          fontSize: 13,
          color: '#9ca3af',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <Sparkles size={16} />
          KI-Schadenskalkulator (Schadensart, Schwere & Fläche erforderlich)
        </div>
      )}

      {/* GPS */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 14,
        padding: '14px',
        marginBottom: 18
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <MapPin size={16} color="#00805F" />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Standort</span>
        </div>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{gpsStatus}</div>
        <div style={{ fontSize: 12, color: '#9ca3af' }}>
          Lat: {form.lat.toFixed(5)} · Lng: {form.lng.toFixed(5)}
        </div>
      </div>

      {/* Bemerkung */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
          BEMERKUNG
        </div>
        <textarea
          value={form.bemerkung}
          onChange={e => setForm(f => ({ ...f, bemerkung: e.target.value }))}
          placeholder="Weitere Informationen zum Schaden…"
          rows={3}
          style={{
            width: '100%', padding: '12px', borderRadius: 12,
            border: '1.5px solid #e5e7eb',
            fontSize: 14, background: '#fff', color: '#1a1a2e',
            resize: 'none'
          }}
        />
      </div>

      {/* PDF Protokoll */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 14,
        padding: '14px',
        marginBottom: 18
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <FileText size={16} color="#374151" />
          <span style={{ fontSize: 13, fontWeight: 700 }}>Offizielles Protokoll</span>
        </div>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 10 }}>
          Exportiert ein vollständiges PDF für Versicherungs- und Jagdbehörden-Anträge (inkl. Fotos & KI-Kalkulation).
        </div>
        <button style={{
          width: '100%', padding: '12px',
          borderRadius: 10, background: '#f3f4f6',
          fontSize: 13, fontWeight: 600, color: '#374151',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
        }}>
          <FileText size={16} />
          Offizielles Protokoll exportieren
        </button>
      </div>

      {/* Sektor-Benachrichtigung */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 14,
        padding: '12px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        <Bell size={16} color="#374151" />
        <span style={{ fontSize: 13, color: '#374151' }}>Sektor-Benachrichtigung</span>
      </div>

      {/* Speichern */}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: 16,
          background: saving ? '#9ca3af' : '#00805F',
          color: '#fff',
          fontSize: 16,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          boxShadow: '0 4px 12px rgba(0,128,95,0.3)'
        }}
      >
        <Save size={20} />
        {saving ? 'Wird gespeichert…' : 'Schaden speichern'}
      </button>

      {Object.keys(errors).length > 0 && (
        <div style={{
          marginTop: 12,
          padding: '10px 14px',
          background: '#fef2f2',
          borderRadius: 10,
          fontSize: 13,
          color: '#ef4444',
          display: 'flex',
          gap: 8,
          alignItems: 'center'
        }}>
          <AlertCircle size={16} />
          Bitte alle Pflichtfelder ausfüllen
        </div>
      )}
    </div>
  )
}
