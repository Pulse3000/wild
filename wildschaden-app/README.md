# 🦊 Die Wildschaden App – Rechberg & Umgebung

Eine vollständige **Progressive Web App (PWA)** zur Dokumentation und Verwaltung von Wildschäden.

## Features

- 📊 **Übersicht** – Statistiken, Charts (Wildart, Fläche, Betrag)
- 📋 **Schäden verwalten** – Erfassen, filtern, bearbeiten, löschen
- 📷 **Foto-Upload** – Kamera & Galerie direkt in der App
- 🗺️ **Karte** – Alle Schäden auf OpenStreetMap
- 👥 **Pächter** – Kontakte verwalten mit Telefon & E-Mail
- 🤖 **KI-Kalkulator** – Automatische Schadensbetrag-Schätzung
- 📍 **GPS** – Automatische Standorterfassung
- 📱 **PWA** – Installierbar auf iOS & Android

## 🚀 Auf Vercel veröffentlichen

### Option 1: Über Vercel Dashboard (empfohlen)

1. [vercel.com](https://vercel.com) → Account erstellen / anmelden
2. **"Add New Project"** klicken
3. ZIP entpacken → Ordner `wildschaden-app` auf GitHub pushen (oder direkt hochladen)
4. In Vercel: **Framework: Vite** auswählen
5. Build-Einstellungen werden automatisch aus `vercel.json` gelesen
6. **Deploy** klicken → fertig! ✅

### Option 2: Vercel CLI

```bash
npm install -g vercel
cd wildschaden-app
npm install
npm run build
vercel --prod
```

### Option 3: Drag & Drop (einfachste Methode)

1. `npm run build` ausführen (erstellt `dist/` Ordner)
2. [vercel.com/new](https://vercel.com/new) → "Deploy from template" → Drag & Drop des `dist/` Ordners

## 📱 Als App installieren (nach Vercel-Deployment)

### iOS (iPhone/iPad)
1. App-URL in **Safari** öffnen
2. Teilen-Button (⬆️) antippen
3. **"Zum Home-Bildschirm"** wählen
4. Name bestätigen → **Hinzufügen**

### Android
1. App-URL in **Chrome** öffnen  
2. Menü (⋮) antippen
3. **"App installieren"** oder **"Zum Startbildschirm hinzufügen"**
4. Bestätigen

## 🛠️ Lokale Entwicklung

```bash
cd wildschaden-app
npm install
npm run dev
# → http://localhost:5173
```

## 📦 Projektstruktur

```
wildschaden-app/
├── src/
│   ├── App.jsx              # Router & Layout
│   ├── store.js             # Lokaler Datenspeicher (localStorage)
│   ├── index.css            # Global Styles
│   ├── components/
│   │   ├── Header.jsx       # Top-Navigation
│   │   └── BottomNav.jsx    # Untere Navigation
│   └── pages/
│       ├── Uebersicht.jsx   # Dashboard
│       ├── Schaeden.jsx     # Schadensliste
│       ├── SchadenMelden.jsx # Schaden erfassen
│       ├── SchadenDetail.jsx # Schaden Details
│       ├── Karte.jsx        # Kartenansicht
│       ├── Paechter.jsx     # Pächter-Verwaltung
│       └── Einstellungen.jsx # Einstellungen
├── public/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── manifest.json
├── vite.config.js           # Vite + PWA Plugin
├── vercel.json              # Vercel Konfiguration
└── package.json
```

## 🔧 Tech Stack

- **React 18** + React Router v6
- **Vite** (Build Tool)
- **vite-plugin-pwa** (PWA + Service Worker)
- **Recharts** (Charts)
- **Leaflet** + React Leaflet (Karte)
- **Lucide React** (Icons)
- **localStorage** (Datenpersistenz)

## 📲 Capacitor (native iOS/Android App)

Um eine echte native App für den App Store zu bauen:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx cap init "Wildschaden App" "de.rechberg.wildschaden"
npm run build
npx cap add ios
npx cap add android
npx cap sync
npx cap open ios     # Öffnet Xcode
npx cap open android # Öffnet Android Studio
```
