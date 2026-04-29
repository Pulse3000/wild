// Simple local state store using localStorage
const STORAGE_KEY = 'wildschaden_data';

const defaultData = {
  schaeden: [
    {
      id: '1',
      art: 'Wühlschaden',
      verursacher: 'Schwarzwild',
      schweregrad: 'Schwer',
      flaeche: 'Grünland',
      ort: 'Nordfeld West',
      datum: '2026-04-29',
      status: 'Offen',
      bemerkung: 'Großflächiger Wühlschaden',
      lat: 48.714,
      lng: 9.843,
      schadenBetrag: 1200,
      fotos: []
    },
    {
      id: '2',
      art: 'Verbiss',
      verursacher: 'Rehwild',
      schweregrad: 'Mittel',
      flaeche: 'Wald/Jungkultur',
      ort: 'Hangwald Ost',
      datum: '2026-04-29',
      status: 'In Bearbeitung',
      bemerkung: 'Mehrere Jungbäume verbissen',
      lat: 48.718,
      lng: 9.850,
      schadenBetrag: 800,
      fotos: []
    },
    {
      id: '3',
      art: 'Schälschaden',
      verursacher: 'Rotwild',
      schweregrad: 'Leicht',
      flaeche: 'Fichtenschonung',
      ort: 'Fichtenwald Nord',
      datum: '2026-04-28',
      status: 'Abgeschlossen',
      bemerkung: 'Schälschaden an 3 Fichten',
      lat: 48.720,
      lng: 9.838,
      schadenBetrag: 450,
      fotos: []
    }
  ],
  paechter: [
    {
      id: 'p1',
      name: 'Hans Müller',
      revier: 'Revier Rechberg Nord',
      telefon: '07171-12345',
      email: 'mueller@jagd-rechberg.de',
      flaeche: '850 ha'
    },
    {
      id: 'p2',
      name: 'Karl Bauer',
      revier: 'Revier Rechberg Süd',
      telefon: '07171-67890',
      email: 'bauer@jagd-rechberg.de',
      flaeche: '620 ha'
    }
  ],
  nextId: 4
};

export function getData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultData };
    return JSON.parse(raw);
  } catch {
    return { ...defaultData };
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getSchaeden() {
  return getData().schaeden;
}

export function getSchaden(id) {
  return getData().schaeden.find(s => s.id === id);
}

export function addSchaden(schaden) {
  const data = getData();
  const newSchaden = { ...schaden, id: String(data.nextId), status: 'Offen' };
  data.schaeden.unshift(newSchaden);
  data.nextId += 1;
  saveData(data);
  return newSchaden;
}

export function updateSchaden(id, updates) {
  const data = getData();
  data.schaeden = data.schaeden.map(s => s.id === id ? { ...s, ...updates } : s);
  saveData(data);
}

export function deleteSchaden(id) {
  const data = getData();
  data.schaeden = data.schaeden.filter(s => s.id !== id);
  saveData(data);
}

export function getPaechter() {
  return getData().paechter;
}

export function addPaechter(paechter) {
  const data = getData();
  const newP = { ...paechter, id: 'p' + Date.now() };
  data.paechter.push(newP);
  saveData(data);
  return newP;
}

export function deletePaechter(id) {
  const data = getData();
  data.paechter = data.paechter.filter(p => p.id !== id);
  saveData(data);
}

export function kalkuliereSchaden(art, schweregrad, flaeche) {
  const basisPreise = {
    'Grünland': 1800,
    'Wald/Jungkultur': 3500,
    'Fichtenschonung': 2800,
    'Maisfeld': 2200,
    'Getreidefeld': 1900,
    'Sonstiges': 1500
  };
  const schwereMulti = { 'Leicht': 0.3, 'Mittel': 0.6, 'Schwer': 1.0 };
  const artMulti = {
    'Wühlschaden': 1.2,
    'Verbiss': 0.8,
    'Schälschaden': 0.9,
    'Fraßschaden': 1.1,
    'Sonstiges': 0.7
  };
  const basis = basisPreise[flaeche] || 1500;
  const sm = schwereMulti[schweregrad] || 0.5;
  const am = artMulti[art] || 0.8;
  return Math.round(basis * sm * am);
}
