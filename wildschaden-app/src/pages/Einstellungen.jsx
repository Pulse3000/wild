import React, { useState } from 'react'
import { Settings, Info, Smartphone, Bell, Map, Shield, ChevronRight, Download } from 'lucide-react'
import { getSchaeden } from '../store.js'

export default function Einstellungen() {
  const [notifications, setNotifications] = useState(true)
  const [gpsAuto, setGpsAuto] = useState(true)

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>
        {title}
      </div>
      <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        {children}
      </div>
    </div>
  )

  const Row = ({ icon: Icon, label, value, onClick, toggle, toggled, onToggle, last }) => (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px',
        borderBottom: last ? 'none' : '1px solid #f3f4f6',
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: 9,
        background: '#f3f4f6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon size={18} color="#374151" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        {value && <div style={{ fontSize: 12, color: '#9ca3af' }}>{value}</div>}
      </div>
      {toggle && (
        <div
          onClick={e => { e.stopPropagation(); onToggle() }}
          style={{
            width: 44, height: 26, borderRadius: 13,
            background: toggled ? '#00805F' : '#d1d5db',
            position: 'relative', cursor: 'pointer', transition: 'background 0.2s'
          }}
        >
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: '#fff', position: 'absolute', top: 2,
            left: toggled ? 20 : 2, transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }} />
        </div>
      )}
      {onClick && !toggle && <ChevronRight size={16} color="#d1d5db" />}
    </div>
  )

  const handleInstallPWA = () => {
    alert('App installieren:\n\n📱 iOS Safari:\nTeilen → "Zum Home-Bildschirm"\n\n🤖 Android Chrome:\nMenü (⋮) → "App installieren"')
  }

  const handleExport = () => {
    const schaeden = getSchaeden()
    const csv = [
      ['ID','Art','Verursacher','Schweregrad','Fläche','Ort','Datum','Status','Betrag €','Bemerkung'].join(';'),
      ...schaeden.map(s => [s.id,s.art,s.verursacher,s.schweregrad,s.flaeche,s.ort,s.datum,s.status,s.schadenBetrag||0,s.bemerkung||''].join(';'))
    ].join('\n')
    const blob = new Blob(['\uFEFF'+csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'wildschaeden_export.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ padding: '16px', paddingBottom: 32 }}>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Einstellungen</div>

      <Section title="App">
        <Row icon={Smartphone} label="Als App installieren" value="Zum Homescreen hinzufügen (PWA)" onClick={handleInstallPWA} />
        <Row icon={Bell} label="Benachrichtigungen" value={notifications ? 'Aktiviert' : 'Deaktiviert'} toggle toggled={notifications} onToggle={() => setNotifications(!notifications)} last />
      </Section>

      <Section title="Standort">
        <Row icon={Map} label="GPS automatisch" value={gpsAuto ? 'Standort wird automatisch erfasst' : 'Manuell setzen'} toggle toggled={gpsAuto} onToggle={() => setGpsAuto(!gpsAuto)} last />
      </Section>

      <Section title="Daten">
        <Row icon={Download} label="Daten exportieren (CSV)" value="Alle Schäden herunterladen" onClick={handleExport} last />
      </Section>

      <Section title="Über die App">
        <Row icon={Info} label="Version" value="1.0.0 – Wildschaden App Rechberg" />
        <Row icon={Shield} label="Datenschutz" value="Alle Daten bleiben lokal auf deinem Gerät" last />
      </Section>

      <div style={{ textAlign: 'center', padding: '24px 0 8px', color: '#9ca3af', fontSize: 12, lineHeight: 1.6 }}>
        🦊 Die Wildschaden App<br />
        Rechberg & Umgebung<br />
        Jagdpächter, Landwirte & Behörden digital vernetzt
      </div>
    </div>
  )
}
