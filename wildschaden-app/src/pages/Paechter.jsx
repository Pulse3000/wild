import React, { useState, useEffect } from 'react'
import { Users, Phone, Mail, Plus, Trash2, Map } from 'lucide-react'
import { getPaechter, addPaechter, deletePaechter } from '../store.js'

export default function Paechter() {
  const [paechter, setPaechter] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', revier: '', telefon: '', email: '', flaeche: '' })

  useEffect(() => {
    setPaechter(getPaechter())
  }, [])

  const handleAdd = () => {
    if (!form.name || !form.revier) return
    addPaechter(form)
    setPaechter(getPaechter())
    setForm({ name: '', revier: '', telefon: '', email: '', flaeche: '' })
    setShowForm(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Pächter wirklich löschen?')) {
      deletePaechter(id)
      setPaechter(getPaechter())
    }
  }

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Jagdpächter</div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 10,
            background: '#00805F', color: '#fff', fontSize: 13, fontWeight: 600
          }}
        >
          <Plus size={16} />
          Neu
        </button>
      </div>

      {showForm && (
        <div style={{
          background: '#fff', borderRadius: 16, padding: '16px',
          marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Neuer Pächter</div>
          {[
            { field: 'name', label: 'Name *', placeholder: 'Max Mustermann' },
            { field: 'revier', label: 'Revier *', placeholder: 'Revier Rechberg Nord' },
            { field: 'telefon', label: 'Telefon', placeholder: '07171-12345' },
            { field: 'email', label: 'E-Mail', placeholder: 'max@beispiel.de' },
            { field: 'flaeche', label: 'Fläche', placeholder: '850 ha' },
          ].map(({ field, label, placeholder }) => (
            <div key={field} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{label}</div>
              <input
                value={form[field]}
                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                placeholder={placeholder}
                style={{
                  width: '100%', padding: '10px 12px',
                  borderRadius: 10, border: '1.5px solid #e5e7eb',
                  fontSize: 14, color: '#1a1a2e'
                }}
              />
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleAdd}
              style={{
                flex: 1, padding: '12px', borderRadius: 10,
                background: '#00805F', color: '#fff', fontSize: 14, fontWeight: 600
              }}
            >
              Speichern
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                padding: '12px 16px', borderRadius: 10,
                background: '#f3f4f6', color: '#374151', fontSize: 14
              }}
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {paechter.map(p => (
          <div
            key={p.id}
            style={{
              background: '#fff', borderRadius: 16, padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <Map size={12} />
                  {p.revier} {p.flaeche && `· ${p.flaeche}`}
                </div>
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                style={{ padding: '6px', borderRadius: 8, background: '#fef2f2', color: '#ef4444' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {p.telefon && (
                <a
                  href={`tel:${p.telefon}`}
                  style={{
                    flex: 1, padding: '10px',
                    borderRadius: 10, background: '#f0fdf4',
                    color: '#00805F', fontSize: 13, fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                  }}
                >
                  <Phone size={15} />
                  {p.telefon}
                </a>
              )}
              {p.email && (
                <a
                  href={`mailto:${p.email}`}
                  style={{
                    flex: 1, padding: '10px',
                    borderRadius: 10, background: '#f0f9ff',
                    color: '#0ea5e9', fontSize: 13, fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                  }}
                >
                  <Mail size={15} />
                  E-Mail
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
