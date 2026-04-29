import React, { useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import Uebersicht from './pages/Uebersicht.jsx'
import Schaeden from './pages/Schaeden.jsx'
import SchadenMelden from './pages/SchadenMelden.jsx'
import SchadenDetail from './pages/SchadenDetail.jsx'
import Karte from './pages/Karte.jsx'
import Paechter from './pages/Paechter.jsx'
import Einstellungen from './pages/Einstellungen.jsx'

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = () => setRefreshKey(k => k + 1)

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', height: '100dvh' }}>
        <Header />
        <main style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px))',
          paddingTop: '56px'
        }}>
          <Routes>
            <Route path="/" element={<Uebersicht key={refreshKey} />} />
            <Route path="/schaeden" element={<Schaeden key={refreshKey} />} />
            <Route path="/schaeden/neu" element={<SchadenMelden onSaved={refresh} />} />
            <Route path="/schaeden/:id" element={<SchadenDetail onUpdated={refresh} />} />
            <Route path="/karte" element={<Karte key={refreshKey} />} />
            <Route path="/paechter" element={<Paechter />} />
            <Route path="/einstellungen" element={<Einstellungen />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  )
}
