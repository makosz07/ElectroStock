/**
 * ElectroStock — IndexedDB Wrapper
 * Cała logika persystencji danych działa lokalnie w przeglądarce.
 * Baza: electrostock_db  v4
 * Stores: users | parts | categories | platforms | log
 */

const DB_NAME    = 'electrostock_db';
const DB_VERSION = 4;
let db = null;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => {
      const d = e.target.result;
      // users
      if (!d.objectStoreNames.contains('users')) {
        const us = d.createObjectStore('users', { keyPath: 'username' });
        us.createIndex('by_username', 'username', { unique: true });
      }
      // categories
      if (!d.objectStoreNames.contains('categories')) {
        const cs = d.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
        cs.createIndex('by_user', 'username');
        cs.createIndex('by_name', ['username','name']);
      }
      // platforms
      if (!d.objectStoreNames.contains('platforms')) {
        const ps = d.createObjectStore('platforms', { keyPath: 'id', autoIncrement: true });
        ps.createIndex('by_user', 'username');
      }
      // parts
      if (!d.objectStoreNames.contains('parts')) {
        const pts = d.createObjectStore('parts', { keyPath: 'id', autoIncrement: true });
        pts.createIndex('by_user',     'username');
        pts.createIndex('by_category', ['username','category']);
        pts.createIndex('by_symbol',   ['username','symbol']);
        pts.createIndex('by_name',     ['username','name']);
      }
      // activity log
      if (!d.objectStoreNames.contains('log')) {
        const ls = d.createObjectStore('log', { keyPath: 'id', autoIncrement: true });
        ls.createIndex('by_user', 'username');
        ls.createIndex('by_part', 'partId');
      }
    };
    req.onsuccess = e => { db = e.target.result; resolve(db); };
    req.onerror   = e => reject(e.target.error);
  });
}

// ─── Generic helpers ───────────────────────

function tx(stores, mode='readonly') {
  return db.transaction(stores, mode);
}

function getAll(store, index, query) {
  return new Promise((resolve, reject) => {
    const t = tx(store);
    const s = t.objectStore(store);
    const req = index ? s.index(index).getAll(query) : s.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

function getByKey(store, key) {
  return new Promise((resolve, reject) => {
    const req = tx(store).objectStore(store).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

function putRecord(store, data) {
  return new Promise((resolve, reject) => {
    const req = tx(store, 'readwrite').objectStore(store).put(data);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

function addRecord(store, data) {
  return new Promise((resolve, reject) => {
    const req = tx(store, 'readwrite').objectStore(store).add(data);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

function deleteRecord(store, key) {
  return new Promise((resolve, reject) => {
    const req = tx(store, 'readwrite').objectStore(store).delete(key);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

// ─── USERS ─────────────────────────────────

async function createUser(username, passwordHash, email='') {
  return putRecord('users', { username, passwordHash, email, createdAt: Date.now(), settings: {} });
}

async function getUser(username) {
  return getByKey('users', username);
}

async function updateUserSettings(username, settings) {
  const u = await getUser(username);
  if (!u) return;
  u.settings = { ...(u.settings||{}), ...settings };
  return putRecord('users', u);
}

function hashPassword(pass) {
  // Simple deterministic hash — no external deps needed for local-only app
  let h = 5381;
  for (let i = 0; i < pass.length; i++) {
    h = (((h << 5) + h) + pass.charCodeAt(i)) | 0;
  }
  return 'h' + Math.abs(h).toString(36) + pass.length.toString(36);
}

// ─── CATEGORIES ────────────────────────────

async function getCategories(username) {
  return getAll('categories', 'by_user', username);
}

async function addCategory(username, name, icon='📦', parentId=null) {
  return addRecord('categories', { username, name, icon, parentId, createdAt: Date.now() });
}

async function updateCategory(id, name, icon) {
  const c = await getByKey('categories', id);
  if (!c) return;
  return putRecord('categories', { ...c, name, icon });
}

async function deleteCategory(id) {
  return deleteRecord('categories', id);
}

// ─── PLATFORMS ─────────────────────────────

async function getPlatforms(username) {
  return getAll('platforms', 'by_user', username);
}

async function addPlatform(username, name, color='#ff0000') {
  return addRecord('platforms', { username, name, color, createdAt: Date.now() });
}

async function updatePlatform(id, name, color) {
  const p = await getByKey('platforms', id);
  if (!p) return;
  return putRecord('platforms', { ...p, name, color });
}

async function deletePlatform(id) {
  return deleteRecord('platforms', id);
}

// ─── PARTS ─────────────────────────────────

async function getParts(username, filters={}) {
  let parts = await getAll('parts', 'by_user', username);

  if (filters.category) {
    const cats = Array.isArray(filters.category) ? filters.category : [filters.category];
    parts = parts.filter(p => cats.includes(p.category));
  }
  if (filters.platform) {
    const target = String(filters.platform);
    parts = parts.filter(p => {
      const list = (p.platforms || []).map(x => String(x));
      return list.includes(target);
    });
  }
  if (filters.lowStock) parts = parts.filter(p => p.quantity <= (p.minQty || 0));
  if (filters.q) {
    const q = filters.q.toLowerCase();
    parts = parts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.symbol||'').toLowerCase().includes(q) ||
      (p.description||'').toLowerCase().includes(q) ||
      (p.location||'').toLowerCase().includes(q)
    );
  }

  parts.sort((a,b) => (a.name||'').localeCompare(b.name||''));
  return parts;
}

async function getPartById(id) {
  return getByKey('parts', id);
}

async function addPart(username, data) {
  const part = {
    username,
    name:        data.name       || '',
    symbol:      data.symbol     || '',
    category:    data.category   || '',
    description: data.description|| '',
    quantity:    Number(data.quantity)   || 0,
    minQty:      Number(data.minQty)     || 0,
    maxQty:      Number(data.maxQty)     || 0,
    unit:        data.unit       || 'szt.',
    location:    data.location   || '',
    datasheet:   data.datasheet  || '',
    platforms:   data.platforms  || [],
    icon:        data.icon       || '🔩',
    tags:        data.tags       || [],
    notes:       data.notes      || '',
    price:       Number(data.price)      || 0,
    currency:    data.currency   || 'PLN',
    createdAt:   Date.now(),
    updatedAt:   Date.now(),
  };
  const id = await addRecord('parts', part);
  await logAction(username, id, 'add', { qty: part.quantity });
  return id;
}

async function updatePart(id, data) {
  const p = await getPartById(id);
  if (!p) return;
  const updated = { ...p, ...data, updatedAt: Date.now() };
  updated.quantity = Number(updated.quantity) || 0;
  updated.minQty   = Number(updated.minQty)   || 0;
  updated.maxQty   = Number(updated.maxQty)   || 0;
  updated.price    = Number(updated.price)    || 0;
  await putRecord('parts', updated);
  await logAction(p.username, id, 'edit', {});
  return id;
}

async function adjustQty(id, delta, note='') {
  const p = await getPartById(id);
  if (!p) return;
  const prev = p.quantity;
  p.quantity = Math.max(0, p.quantity + delta);
  p.updatedAt = Date.now();
  await putRecord('parts', p);
  await logAction(p.username, id, delta > 0 ? 'in' : 'out', { delta, prev, next: p.quantity, note });
  return p.quantity;
}

async function setQty(id, qty, note='') {
  const p = await getPartById(id);
  if (!p) return;
  const prev = p.quantity;
  p.quantity = Math.max(0, Number(qty) || 0);
  p.updatedAt = Date.now();
  await putRecord('parts', p);
  await logAction(p.username, id, 'set', { prev, next: p.quantity, note });
  return p.quantity;
}

async function deletePart(id) {
  return deleteRecord('parts', id);
}

// ─── LOG ───────────────────────────────────

async function logAction(username, partId, action, meta={}) {
  return addRecord('log', { username, partId, action, meta, at: Date.now() });
}

async function getLog(username, partId=null, limit=50) {
  let entries = await getAll('log', 'by_user', username);
  if (partId) entries = entries.filter(e => e.partId === partId);
  entries.sort((a,b) => b.at - a.at);
  return entries.slice(0, limit);
}

async function deleteLogForUser(username) {
  const entries = await getAll('log', 'by_user', username);
  for (const e of entries) await deleteRecord('log', e.id);
}

// ─── STATS ─────────────────────────────────

async function getStats(username) {
  const parts = await getAll('parts', 'by_user', username);
  const cats  = await getCategories(username);
  const lowStock = parts.filter(p => p.quantity <= (p.minQty||0) && (p.minQty||0)>0);
  const totalQty = parts.reduce((s,p) => s + p.quantity, 0);
  const totalVal = parts.reduce((s,p) => s + p.quantity * (p.price||0), 0);
  return {
    total: parts.length,
    categories: cats.length,
    lowStock: lowStock.length,
    totalQty,
    totalVal,
  };
}

// ─── EXPORT / IMPORT ───────────────────────

async function exportUserData(username) {
  const [parts, cats, plats, logs] = await Promise.all([
    getAll('parts',      'by_user', username),
    getAll('categories', 'by_user', username),
    getAll('platforms',  'by_user', username),
    getAll('log',        'by_user', username),
  ]);
  return { username, exportedAt: Date.now(), parts, categories: cats, platforms: plats, log: logs };
}

async function importUserData(username, data) {
  // Restore backup in REPLACE mode. This prevents duplicated categories, platforms and parts.
  const [oldParts, oldCats, oldPlats, oldLogs] = await Promise.all([
    getAll('parts', 'by_user', username),
    getAll('categories', 'by_user', username),
    getAll('platforms', 'by_user', username),
    getAll('log', 'by_user', username),
  ]);

  for (const r of oldLogs) await deleteRecord('log', r.id);
  for (const p of oldParts) await deleteRecord('parts', p.id);
  for (const c of oldCats) await deleteRecord('categories', c.id);
  for (const p of oldPlats) await deleteRecord('platforms', p.id);

  for (const c of (data.categories||[])) {
    const { id: _id, ...rest } = c;
    rest.username = username;
    await addRecord('categories', rest);
  }
  for (const p of (data.platforms||[])) {
    const { id: _id, ...rest } = p;
    rest.username = username;
    await addRecord('platforms', rest);
  }
  for (const p of (data.parts||[])) {
    const { id: _id, ...rest } = p;
    rest.username = username;
    await addRecord('parts', rest);
  }
  for (const l of (data.log||[])) {
    const { id: _id, ...rest } = l;
    rest.username = username;
    await addRecord('log', rest);
  }
}

// ─── SEED DEFAULT DATA ──────────────────────

const CATALOG_PROFILES = {
  electronics: {
    categories: [
      { name: 'Rezystory', icon: '🟫' },
      { name: 'Kondensatory', icon: '🟦' },
      { name: 'Tranzystory', icon: '🔺' },
      { name: 'Diody', icon: '💡' },
      { name: 'Układy scalone', icon: '🧩' },
      { name: 'Złącza', icon: '🔌' },
      { name: 'Cewki i dławiki', icon: '🌀' },
      { name: 'Mikrokontrolery', icon: '💻' },
      { name: 'Zasilanie', icon: '🔋' },
      { name: 'Inne', icon: '📦' },
    ],
    platforms: [
      { name: 'Arduino', color: '#00979D' },
      { name: 'Raspberry Pi', color: '#C51A4A' },
      { name: 'ESP32', color: '#E7352C' },
      { name: 'STM32', color: '#F97316' },
    ],
    parts: [
      { name: 'LED czerwona 5mm', symbol: 'LEDR5', category: 'Diody', icon: '💡', quantity: 2, minQty: 5, unit: 'szt.', location: 'C1-1', platformNames: ['Arduino','ESP32'] },
      { name: 'Rezystor 10kΩ 1/4W', symbol: 'R10K', category: 'Rezystory', icon: '🟫', quantity: 100, minQty: 20, unit: 'szt.', location: 'A1-1', platformNames: ['Arduino','Raspberry Pi','ESP32','STM32'] },
    ],
  },

  repair: {
    categories: [
      { name: 'Płyty główne', icon: '🧩' },
      { name: 'Ekrany i monitory', icon: '🖥️' },
      { name: 'Obudowy', icon: '📱' },
      { name: 'Baterie', icon: '🔋' },
      { name: 'Złącza', icon: '🔌' },
      { name: 'Taśmy flex', icon: '🎞️' },
      { name: 'Głośniki', icon: '🔊' },
      { name: 'Kamery', icon: '📷' },
      { name: 'Klawiatury', icon: '⌨️' },
      { name: 'Dyski', icon: '💾' },
      { name: 'Pamięć RAM', icon: '🧠' },
      { name: 'Inne', icon: '📦' },
    ],
    platforms: [
      { name: 'Telefony', color: '#22C55E' },
      { name: 'Laptopy', color: '#3B82F6' },
      { name: 'Komputery PC', color: '#A855F7' },
      { name: 'Tablety', color: '#F97316' },
    ],
    parts: [
      { name: 'Płyta główna laptopa', symbol: 'MB-LAP', category: 'Płyty główne', icon: '🧩', quantity: 1, minQty: 1, unit: 'szt.', location: 'S1-1', platformNames: ['Laptopy'] },
      { name: 'Ekran telefonu', symbol: 'LCD-PHONE', category: 'Ekrany i monitory', icon: '📱', quantity: 2, minQty: 1, unit: 'szt.', location: 'S2-1', platformNames: ['Telefony'] },
      { name: 'Bateria telefonu', symbol: 'BAT-PHONE', category: 'Baterie', icon: '🔋', quantity: 3, minQty: 1, unit: 'szt.', location: 'S2-2', platformNames: ['Telefony'] },
      { name: 'Dysk SSD 256GB', symbol: 'SSD256', category: 'Dyski', icon: '💾', quantity: 2, minQty: 1, unit: 'szt.', location: 'S3-1', platformNames: ['Laptopy','Komputery PC'] },
    ],
  },

  workshop: {
    categories: [
      { name: 'Narzędzia ręczne', icon: '🛠️' },
      { name: 'Narzędzia elektryczne', icon: '⚙️' },
      { name: 'Materiały', icon: '🧱' },
      { name: 'Śruby i mocowania', icon: '🔩' },
      { name: 'Kleje i chemia', icon: '🧪' },
      { name: 'Opakowania', icon: '📦' },
      { name: 'Akcesoria', icon: '🧰' },
      { name: 'Inne', icon: '📦' },
    ],
    platforms: [
      { name: 'Warsztat', color: '#F59E0B' },
      { name: 'Dom', color: '#10B981' },
      { name: 'Produkcja', color: '#6366F1' },
      { name: 'Naprawy', color: '#EF4444' },
    ],
    parts: [
      { name: 'Śrubokręt precyzyjny', symbol: 'TOOL-PREC', category: 'Narzędzia ręczne', icon: '🪛', quantity: 5, minQty: 1, unit: 'szt.', location: 'W1-1', platformNames: ['Warsztat','Naprawy'] },
      { name: 'Klej montażowy', symbol: 'GLUE', category: 'Kleje i chemia', icon: '🧪', quantity: 2, minQty: 1, unit: 'szt.', location: 'W2-1', platformNames: ['Warsztat','Produkcja'] },
      { name: 'Śruby M3', symbol: 'M3', category: 'Śruby i mocowania', icon: '🔩', quantity: 100, minQty: 20, unit: 'szt.', location: 'W3-1', platformNames: ['Warsztat'] },
    ],
  },


  creator: {
    categories: [
      { name: 'Materiały', icon: '🧱' },
      { name: 'Półprodukty', icon: '🧩' },
      { name: 'Gotowe produkty', icon: '✨' },
      { name: 'Opakowania', icon: '📦' },
      { name: 'Papier i wydruki', icon: '🖨️' },
      { name: 'Tkaniny', icon: '🧵' },
      { name: 'Narzędzia', icon: '🛠️' },
      { name: 'Inne', icon: '📦' },
    ],
    platforms: [
      { name: 'Produkcja', color: '#EC4899' },
      { name: 'Magazyn', color: '#22C55E' },
      { name: 'Wysyłka', color: '#3B82F6' },
      { name: 'Prototypy', color: '#F59E0B' },
    ],
    parts: [
      { name: 'Papier foto A4', symbol: 'PAPER-A4', category: 'Papier i wydruki', icon: '🖨️', quantity: 25, minQty: 5, unit: 'ark.', location: 'C1-1', platformNames: ['Produkcja','Prototypy'] },
      { name: 'Organza bag', symbol: 'BAG-ORG', category: 'Opakowania', icon: '🎁', quantity: 30, minQty: 10, unit: 'szt.', location: 'C3-1', platformNames: ['Wysyłka'] },
    ],
  },

  books: {
    categories: [
      { name: 'Książki', icon: '📚' },
      { name: 'Notesy', icon: '📓' },
      { name: 'Dokumenty', icon: '📄' },
      { name: 'Wydruki', icon: '🖨️' },
      { name: 'Archiwum', icon: '🗄️' },
      { name: 'Akcesoria', icon: '🏷️' },
      { name: 'Inne', icon: '📦' },
    ],
    platforms: [
      { name: 'Dom', color: '#14B8A6' },
      { name: 'Biuro', color: '#3B82F6' },
      { name: 'Archiwum', color: '#64748B' },
      { name: 'Sprzedaż', color: '#F97316' },
    ],
    parts: [
      { name: 'Notes A5', symbol: 'NOTE-A5', category: 'Notesy', icon: '📓', quantity: 12, minQty: 2, unit: 'szt.', location: 'B1-1', platformNames: ['Biuro','Sprzedaż'] },
      { name: 'Książka magazynowa', symbol: 'BOOK-INV', category: 'Książki', icon: '📚', quantity: 3, minQty: 1, unit: 'szt.', location: 'B2-1', platformNames: ['Dom','Archiwum'] },
    ],
  },

  clothes: {
    categories: [
      { name: 'Koszulki', icon: '👕' },
      { name: 'Bluzy', icon: '🧥' },
      { name: 'Spodnie', icon: '👖' },
      { name: 'Dodatki', icon: '🧢' },
      { name: 'Opakowania', icon: '📦' },
      { name: 'Inne', icon: '📦' },
    ],
    platforms: [
      { name: 'S', color: '#22C55E' },
      { name: 'M', color: '#3B82F6' },
      { name: 'L', color: '#F97316' },
      { name: 'XL', color: '#A855F7' },
    ],
    parts: [
      { name: 'Koszulka czarna M', symbol: 'TS-BLK-M', category: 'Koszulki', icon: '👕', quantity: 10, minQty: 2, unit: 'szt.', location: 'T1-M', platformNames: ['M'] },
      { name: 'Bluza grafitowa L', symbol: 'HD-GRA-L', category: 'Bluzy', icon: '🧥', quantity: 4, minQty: 1, unit: 'szt.', location: 'T2-L', platformNames: ['L'] },
    ],
  },

  collectibles: {
    categories: [
      { name: 'Monety', icon: '🪙' },
      { name: 'Karty kolekcjonerskie', icon: '🎴' },
      { name: 'Figurki', icon: '🧸' },
      { name: 'Pamiątki', icon: '🏆' },
      { name: 'Dokumenty', icon: '📄' },
      { name: 'Inne', icon: '📦' },
    ],
    platforms: [
      { name: 'Kolekcja główna', color: '#FACC15' },
      { name: 'Do sprzedaży', color: '#22C55E' },
      { name: 'Archiwum', color: '#64748B' },
      { name: 'Sejf', color: '#EF4444' },
    ],
    parts: [
      { name: 'Moneta srebrna 1 oz', symbol: 'SILVER-1OZ', category: 'Monety', icon: '🪙', quantity: 1, minQty: 0, unit: 'szt.', location: 'SAFE-1', platformNames: ['Kolekcja główna','Sejf'] },
      { name: 'Karta kolekcjonerska', symbol: 'CARD', category: 'Karty kolekcjonerskie', icon: '🎴', quantity: 20, minQty: 0, unit: 'szt.', location: 'K1-1', platformNames: ['Kolekcja główna'] },
    ],
  },

  universal: {
    categories: [
      { name: 'Akcesoria', icon: '🧰' },
      { name: 'Materiały', icon: '🧱' },
      { name: 'Opakowania', icon: '📦' },
      { name: 'Dokumenty', icon: '📄' },
      { name: 'Narzędzia', icon: '🛠️' },
      { name: 'Inne', icon: '📦' },
    ],
    platforms: [
      { name: 'Magazyn główny', color: '#22C55E' },
      { name: 'Biuro', color: '#3B82F6' },
      { name: 'Produkcja', color: '#F97316' },
      { name: 'Wysyłka', color: '#A855F7' },
    ],
    parts: [
      { name: 'Pudełko magazynowe', symbol: 'BOX', category: 'Opakowania', icon: '📦', quantity: 10, minQty: 2, unit: 'szt.', location: 'U1-1', platformNames: ['Magazyn główny','Wysyłka'] },
      { name: 'Koperta bąbelkowa', symbol: 'MAILER', category: 'Opakowania', icon: '✉️', quantity: 50, minQty: 10, unit: 'szt.', location: 'U1-2', platformNames: ['Wysyłka'] },
      { name: 'Etykiety samoprzylepne', symbol: 'LABEL', category: 'Materiały', icon: '🏷️', quantity: 100, minQty: 20, unit: 'szt.', location: 'U2-1', platformNames: ['Biuro','Wysyłka'] },
    ],
  },

  blank: {
    categories: [],
    platforms: [],
    parts: [],
  },
};

function getProfileCatalog(profile) {
  return CATALOG_PROFILES[profile] || CATALOG_PROFILES.electronics;
}

function choosePlatformNamesForPart(part, catalog) {
  const exact = (catalog.parts || []).find(s => s.name === part.name || s.symbol === part.symbol);
  if (exact) return exact.platformNames || [];

  const byCategory = (catalog.parts || []).find(s => s.category === part.category);
  if (byCategory) return byCategory.platformNames || [];

  // Electronics fallback: resistors/diodes can realistically be used on all starter boards.
  if (catalog === CATALOG_PROFILES.electronics) {
    if (['Rezystory','Diody','Kondensatory','Tranzystory','Układy scalone','Złącza','Cewki i dławiki','Mikrokontrolery','Zasilanie'].includes(part.category)) {
      return catalog.platforms.map(p => p.name);
    }
  }
  return [];
}

async function ensureProfileCatalog(username, profile='electronics', options={}) {
  const catalog = getProfileCatalog(profile);
  if (profile === 'blank') return;

  // Fix old category name.
  const existingCatsBefore = await getCategories(username);
  for (const c of existingCatsBefore) {
    if (c.name === 'Indukcyjności') await updateCategory(c.id, 'Cewki i dławiki', '🌀');
  }

  const existingCats = await getCategories(username);
  const catByName = Object.fromEntries(existingCats.map(c => [c.name, c]));
  for (const c of catalog.categories) {
    if (catByName[c.name]) await updateCategory(catByName[c.name].id, c.name, c.icon);
    else if (!options.repairOnly) await addCategory(username, c.name, c.icon);
    else if (!catByName[c.name]) await addCategory(username, c.name, c.icon);
  }

  const existingPlats = await getPlatforms(username);
  const platByName = Object.fromEntries(existingPlats.map(p => [p.name, p]));
  const platformIds = {};
  for (const p of catalog.platforms) {
    if (platByName[p.name]) {
      await updatePlatform(platByName[p.name].id, p.name, p.color);
      platformIds[p.name] = platByName[p.name].id;
    } else {
      platformIds[p.name] = await addPlatform(username, p.name, p.color);
    }
  }

  const parts = await getParts(username);
  if (parts.length === 0 && !options.repairOnly) {
    for (const s of catalog.parts) {
      const { platformNames = [], ...part } = s;
      part.platforms = platformNames.slice();
      await addPart(username, part);
    }
    return;
  }

  // Repair platform links for existing parts. This is the important fix.
  for (const part of parts) {
    const current = Array.isArray(part.platforms) ? part.platforms.filter(Boolean) : [];
    const names = choosePlatformNamesForPart(part, catalog);
    const platformNamesForPart = names.filter(Boolean);
    if (platformNamesForPart.length && current.length === 0) {
      await updatePart(part.id, { platforms: platformNamesForPart });
    }
  }
}

async function seedDefaults(username, profile='electronics') {
  await ensureProfileCatalog(username, profile, { repairOnly: false });
}
