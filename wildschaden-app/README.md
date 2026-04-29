# 🦊 Wildschaden App – Rechberg

## Voraussetzungen

Installiere folgendes auf deinem Mac/PC, bevor du anfängst:

| Tool | Link | Warum |
|---|---|---|
| Node.js 20+ | https://nodejs.org | Build-Tool |
| Git | https://git-scm.com | Code herunterladen |
| Android Studio | https://developer.android.com/studio | Android App |
| Xcode 15+ (nur Mac) | Mac App Store | iOS App |

---

## Schritt 1 — Code herunterladen

```bash
git clone https://github.com/Pulse3000/wild.git
cd wild/wildschaden-app
npm install
```

---

## Schritt 2 — App bauen

```bash
npm run build
```

→ Erstellt den `dist/` Ordner mit der fertigen App.

---

## Schritt 3 — Android APK erstellen

```bash
npx cap sync android
npx cap open android
```

Android Studio öffnet sich. Dann:

1. Oben: **Build → Generate Signed App Bundle / APK**
2. Wähle **APK**
3. Erstelle einen neuen Keystore (einmalig, gut aufbewahren!)
4. Build Variant: **release**
5. **Finish** → APK liegt in `android/app/release/app-release.apk`

Die `.apk` Datei kannst du direkt auf Android-Geräte installieren oder im Google Play Store hochladen.

---

## Schritt 4 — iOS App erstellen (nur Mac)

```bash
npx cap sync ios
npx cap open ios
```

Xcode öffnet sich. Dann:

1. Links oben: dein Projektname auswählen
2. **Signing & Capabilities** → dein Apple Developer Account auswählen
3. Oben: Gerät auswählen (dein iPhone oder Simulator)
4. **▶ Play** drücken → App läuft auf deinem iPhone

Für App Store: **Product → Archive → Distribute App**

---

## Schritt 5 — Als Website veröffentlichen (Vercel)

```bash
npm install -g vercel
vercel --prod
```

→ Gibt dir eine URL wie `https://wild-xyz.vercel.app`

Auf dieser URL kannst du die App direkt im Browser nutzen **und** auf dem iPhone als PWA installieren (Safari → Teilen → Zum Home-Bildschirm).

---

## Lokale Entwicklung

```bash
npm run dev
```

→ App läuft auf http://localhost:5173 (Live-Reload, sofortige Änderungen)

---

## App-Struktur

```
src/
  pages/
    Uebersicht.jsx      ← Dashboard mit Statistiken
    Schaeden.jsx        ← Liste aller Schäden
    SchadenMelden.jsx   ← Neuen Schaden erfassen
    SchadenDetail.jsx   ← Einzelner Schaden (Foto, Karte, Bearbeiten)
    Karte.jsx           ← Alle Schäden auf OpenStreetMap
    Paechter.jsx        ← Pächter-Kontakte
    Einstellungen.jsx   ← Einstellungen, Export
  components/
    Header.jsx
    BottomNav.jsx
  store.js              ← Datenspeicher (localStorage)
```

---

## Häufige Probleme

**`npm run build` schlägt fehl** → `node --version` prüfen, muss v18+ sein

**Android Studio zeigt Fehler** → SDK 34 in Android Studio installieren: Tools → SDK Manager

**iOS: "No signing certificate"** → Xcode → Preferences → Accounts → Apple ID hinzufügen

**Karte lädt nicht** → Internetzugang prüfen (Leaflet braucht OpenStreetMap-Tiles)
