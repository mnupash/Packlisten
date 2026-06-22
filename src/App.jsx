import { useState, useEffect, useRef } from "react";

// ─── Default data ────────────────────────────────────────────────────────────
const CATS = [
  { id: "bekleidung", name: "Bekleidung", icon: "👕", items: [
    { id: "b1", name: "Trikot", checked: false },{ id: "b2", name: "Radhose (Bib)", checked: false },
    { id: "b3", name: "Windjacke", checked: false },{ id: "b4", name: "Regenjacke", checked: false },
    { id: "b5", name: "Helm", checked: false },{ id: "b6", name: "Handschuhe", checked: false },
    { id: "b7", name: "Radsocken", checked: false },{ id: "b8", name: "Fahrradschuhe", checked: false },
    { id: "b9", name: "Sonnenbrille", checked: false },{ id: "b10", name: "Basisschicht Langarm", checked: false },
  ]},
  { id: "rad", name: "Rad & Werkzeug", icon: "🔧", items: [
    { id: "r1", name: "Multitool", checked: false },{ id: "r2", name: "Flickzeug-Set", checked: false },
    { id: "r3", name: "Ersatzschlauch x2", checked: false },{ id: "r4", name: "Reifenheber x2", checked: false },
    { id: "r5", name: "Minipumpe", checked: false },{ id: "r6", name: "CO2-Patronen", checked: false },
    { id: "r7", name: "Kettenschloss x2", checked: false },{ id: "r8", name: "Fahrradschloss", checked: false },
    { id: "r9", name: "Kettenoel", checked: false },
  ]},
  { id: "elektronik", name: "Elektronik & Navigation", icon: "📱", items: [
    { id: "e1", name: "Garmin Edge 1040", checked: false },{ id: "e2", name: "Ladekabel(s)", checked: false },
    { id: "e3", name: "Powerbank", checked: false },{ id: "e4", name: "Smartphone", checked: false },
    { id: "e5", name: "Garmin Varia Radar", checked: false },{ id: "e6", name: "Kopfhoerer", checked: false },
  ]},
  { id: "nutrition", name: "Verpflegung", icon: "🥗", items: [
    { id: "n1", name: "Energiegels", checked: false },{ id: "n2", name: "Energieriegel", checked: false },
    { id: "n3", name: "Elektrolyttabletten", checked: false },{ id: "n4", name: "Trinkflaschen x2", checked: false },
    { id: "n5", name: "Isotonik-Pulver", checked: false },
  ]},
  { id: "unterkunft", name: "Uebernachtung", icon: "⛺", items: [
    { id: "u1", name: "Zelt / Biwak", checked: false },{ id: "u2", name: "Schlafsack", checked: false },
    { id: "u3", name: "Isomatte", checked: false },{ id: "u4", name: "Stirnlampe + Batterien", checked: false },
  ]},
  { id: "hygiene", name: "Hygiene & Erste Hilfe", icon: "🩹", items: [
    { id: "h1", name: "Verbandszeug", checked: false },{ id: "h2", name: "Schmerzmittel", checked: false },
    { id: "h3", name: "Sonnencreme LSF 50", checked: false },{ id: "h4", name: "Lippenpflege", checked: false },
    { id: "h5", name: "Zahnbuerste & Paste", checked: false },{ id: "h6", name: "Chamois Creme", checked: false },
    { id: "h7", name: "Mikrofaser-Handtuch", checked: false },
  ]},
  { id: "dokumente", name: "Dokumente & Sonstiges", icon: "🪪", items: [
    { id: "d1", name: "Personalausweis", checked: false },{ id: "d2", name: "Kreditkarte", checked: false },
    { id: "d3", name: "Bargeld (EUR)", checked: false },{ id: "d4", name: "Krankenversicherungskarte", checked: false },
    { id: "d5", name: "Startnummer / Teilnahmebeleg", checked: false },
  ]},
];

const DEFAULT_TODOS = [
  { id: "t1", text: "Medikamente besorgen", done: false, tag: "besorgung" },
  { id: "t2", text: "Fehlende Ausruestung bestellen", done: false, tag: "bestellen" },
  { id: "t3", text: "Rad zur Inspektion bringen", done: false, tag: "rad" },
  { id: "t4", text: "Reifenluftdruck pruefen", done: false, tag: "rad" },
  { id: "t5", text: "Powerbank aufladen", done: false, tag: "vorbereitung" },
];

const TAGS = {
  besorgung:    { label: "Besorgung",    color: "#993C1D", bg: "#FAECE7" },
  bestellen:    { label: "Bestellen",    color: "#185FA5", bg: "#E6F1FB" },
  rad:          { label: "Rad",          color: "#3B6D11", bg: "#EAF3DE" },
  vorbereitung: { label: "Vorbereitung", color: "#854F0B", bg: "#FAEEDA" },
  sonstiges:    { label: "Sonstiges",    color: "#5F5E5A", bg: "#F1EFE8" },
};

const uid = () => Math.random().toString(36).slice(2, 9);
const deepClone = (x) => JSON.parse(JSON.stringify(x));

// ─── localStorage ────────────────────────────────────────────────────────────
const ls = {
  get: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del: (k) => { try { localStorage.removeItem(k); } catch {} },
};

// ─── JSONBin ──────────────────────────────────────────────────────────────────
const jsonbin = {
  async getAll(binId, apiKey) {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
      headers: { "X-Master-Key": apiKey }
    });
    if (!res.ok) throw new Error("JSONBin fetch fehlgeschlagen");
    const data = await res.json();
    return data.record || {};
  },
  async setAll(binId, apiKey, record) {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Master-Key": apiKey },
      body: JSON.stringify(record)
    });
    if (!res.ok) throw new Error("JSONBin write fehlgeschlagen");
  },
  async createBin(apiKey) {
    const res = await fetch("https://api.jsonbin.io/v3/b", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Master-Key": apiKey, "X-Bin-Name": "Packliste" },
      body: JSON.stringify({})
    });
    if (!res.ok) throw new Error("JSONBin erstellen fehlgeschlagen");
    const data = await res.json();
    return data.metadata.id;
  }
};

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [lists, setLists] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [list, setList] = useState(null);
  const [todos, setTodos] = useState([]);
  const [tab, setTab] = useState("pack");
  const [sidebar, setSidebar] = useState(true);
  const [view, setView] = useState("app"); // "app" | "settings"
  const [newListName, setNewListName] = useState("");
  const [showNewList, setShowNewList] = useState(false);
  const [newItems, setNewItems] = useState({});
  const [newCatName, setNewCatName] = useState("");
  const [showNewCat, setShowNewCat] = useState(false);
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoTag, setNewTodoTag] = useState("sonstiges");
  const [showTodoInput, setShowTodoInput] = useState(false);
  const [todoFilter, setTodoFilter] = useState("all");

  // JSONBin settings
  const [apiKey, setApiKey] = useState(() => ls.get("jb-apikey") || "");
  const [binId, setBinId] = useState(() => ls.get("jb-binid") || "");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [binIdInput, setBinIdInput] = useState("");
  const [syncStatus, setSyncStatus] = useState("idle"); // idle | syncing | ok | error
  const [syncMsg, setSyncMsg] = useState("");
  const [creating, setCreating] = useState(false);

  const cloudEnabled = apiKey && binId;
  const remoteCache = useRef({});

  // ── Storage helpers ─────────────────────────────────────────────────────────
  const pushToCloud = async (record) => {
    if (!cloudEnabled) return;
    try {
      setSyncStatus("syncing");
      await jsonbin.setAll(binId, apiKey, record);
      setSyncStatus("ok");
      setTimeout(() => setSyncStatus("idle"), 2000);
    } catch (e) {
      setSyncStatus("error"); setSyncMsg(e.message);
    }
  };

  const pullFromCloud = async () => {
    if (!cloudEnabled) return null;
    try {
      setSyncStatus("syncing");
      const record = await jsonbin.getAll(binId, apiKey);
      remoteCache.current = record;
      setSyncStatus("ok");
      setTimeout(() => setSyncStatus("idle"), 2000);
      return record;
    } catch (e) {
      setSyncStatus("error"); setSyncMsg(e.message);
      return null;
    }
  };

  const buildRecord = (idx, listMap, todoMap) => ({ index: idx, lists: listMap, todos: todoMap });

  // ── Init ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      let idx, listMap, todoMap;
      if (cloudEnabled) {
        const remote = await pullFromCloud();
        if (remote && remote.index) {
          idx = remote.index; listMap = remote.lists || {}; todoMap = remote.todos || {};
          // also write to localStorage as cache
          ls.set("jb-cache", remote);
        } else {
          // fallback to local cache
          const cache = ls.get("jb-cache") || {};
          idx = cache.index; listMap = cache.lists || {}; todoMap = cache.todos || {};
        }
      } else {
        idx = ls.get("pack-index");
        listMap = ls.get("pack-lists") || {};
        todoMap = ls.get("pack-todos") || {};
      }

      if (idx && idx.length > 0) {
        setLists(idx);
        const firstId = idx[0].id;
        const d = listMap[firstId];
        const t = todoMap[firstId];
        if (d) { setActiveId(firstId); setList(d); }
        setTodos(t || deepClone(DEFAULT_TODOS));
      }
    })();
  }, []);

  const save = async (newLists, newList, newTodos, newActiveId) => {
    const idx = newLists || lists;
    const lid = newActiveId !== undefined ? newActiveId : activeId;

    // build full maps from current state + updates
    const prevCache = cloudEnabled ? (ls.get("jb-cache") || {}) : {};
    const prevListMap = prevCache.lists || ls.get("pack-lists") || {};
    const prevTodoMap = prevCache.todos || ls.get("pack-todos") || {};

    const listMap = { ...prevListMap };
    const todoMap = { ...prevTodoMap };
    if (newList && lid) listMap[lid] = newList;
    if (newTodos && lid) todoMap[lid] = newTodos;

    if (cloudEnabled) {
      const record = buildRecord(idx, listMap, todoMap);
      ls.set("jb-cache", record);
      await pushToCloud(record);
    } else {
      ls.set("pack-index", idx);
      ls.set("pack-lists", listMap);
      ls.set("pack-todos", todoMap);
    }
  };

  // ── List operations ──────────────────────────────────────────────────────────
  const selectList = async (id) => {
    let listMap, todoMap;
    if (cloudEnabled) {
      const cache = ls.get("jb-cache") || {};
      listMap = cache.lists || {};
      todoMap = cache.todos || {};
    } else {
      listMap = ls.get("pack-lists") || {};
      todoMap = ls.get("pack-todos") || {};
    }
    const d = listMap[id]; const t = todoMap[id];
    if (d) { setActiveId(id); setList(d); }
    setTodos(t || deepClone(DEFAULT_TODOS));
  };

  const createList = async () => {
    const name = newListName.trim() || "Neue Liste";
    const id = uid();
    const d = { id, name, categories: deepClone(CATS) };
    const t = deepClone(DEFAULT_TODOS);
    const newIdx = [...lists, { id, name }];
    setLists(newIdx); setActiveId(id); setList(d); setTodos(t);
    await save(newIdx, d, t, id);
    setNewListName(""); setShowNewList(false);
  };

  const deleteList = async (id) => {
    const newIdx = lists.filter(l => l.id !== id);
    setLists(newIdx);

    // remove from maps
    const prevCache = cloudEnabled ? (ls.get("jb-cache") || {}) : {};
    const listMap = { ...(prevCache.lists || ls.get("pack-lists") || {}) };
    const todoMap = { ...(prevCache.todos || ls.get("pack-todos") || {}) };
    delete listMap[id]; delete todoMap[id];

    if (cloudEnabled) {
      const record = buildRecord(newIdx, listMap, todoMap);
      ls.set("jb-cache", record);
      await pushToCloud(record);
    } else {
      ls.set("pack-index", newIdx); ls.set("pack-lists", listMap); ls.set("pack-todos", todoMap);
    }

    if (activeId === id) {
      if (newIdx.length > 0) { await selectList(newIdx[0].id); }
      else { setActiveId(null); setList(null); setTodos([]); }
    }
  };

  const updateList = async (updated) => { setList(updated); await save(null, updated, null); };
  const updateTodos = async (updated) => { setTodos(updated); await save(null, null, updated); };

  const toggleItem = (catId, itemId) => updateList({ ...list, categories: list.categories.map(c =>
    c.id !== catId ? c : { ...c, items: c.items.map(i => i.id !== itemId ? i : { ...i, checked: !i.checked }) }
  )});
  const addItem = (catId) => {
    const name = (newItems[catId] || "").trim(); if (!name) return;
    updateList({ ...list, categories: list.categories.map(c =>
      c.id !== catId ? c : { ...c, items: [...c.items, { id: uid(), name, checked: false }] }
    )});
    setNewItems(p => ({ ...p, [catId]: "" }));
  };
  const deleteItem = (catId, itemId) => updateList({ ...list, categories: list.categories.map(c =>
    c.id !== catId ? c : { ...c, items: c.items.filter(i => i.id !== itemId) }
  )});
  const addCategory = () => {
    const name = newCatName.trim(); if (!name) return;
    updateList({ ...list, categories: [...list.categories, { id: uid(), name, icon: "📦", items: [] }] });
    setNewCatName(""); setShowNewCat(false);
  };
  const deleteCategory = (catId) => updateList({ ...list, categories: list.categories.filter(c => c.id !== catId) });
  const resetChecked = () => updateList({ ...list, categories: list.categories.map(c =>
    ({ ...c, items: c.items.map(i => ({ ...i, checked: false })) })
  )});

  const addTodo = () => {
    const text = newTodoText.trim(); if (!text) return;
    updateTodos([...todos, { id: uid(), text, done: false, tag: newTodoTag }]);
    setNewTodoText(""); setShowTodoInput(false);
  };
  const toggleTodo = (id) => updateTodos(todos.map(t => t.id !== id ? t : { ...t, done: !t.done }));
  const deleteTodo = (id) => updateTodos(todos.filter(t => t.id !== id));
  const clearDone = () => updateTodos(todos.filter(t => !t.done));

  // ── Export ───────────────────────────────────────────────────────────────────
  const exportData = () => {
    const prevCache = cloudEnabled ? (ls.get("jb-cache") || {}) : {};
    const listMap = prevCache.lists || ls.get("pack-lists") || {};
    const todoMap = prevCache.todos || ls.get("pack-todos") || {};
    const data = { version: 1, exportedAt: new Date().toISOString(), index: lists, lists: listMap, todos: todoMap };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = "packliste-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    a.click(); URL.revokeObjectURL(url);
  };

  const importFile = useRef(null);
  const importData = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.index || !data.lists) { alert("Ungültige Backup-Datei"); return; }
        setLists(data.index);
        if (data.index.length > 0) {
          const id = data.index[0].id;
          setActiveId(id); setList(data.lists[id] || null);
          setTodos(data.todos?.[id] || deepClone(DEFAULT_TODOS));
        }
        if (cloudEnabled) {
          const record = buildRecord(data.index, data.lists, data.todos || {});
          ls.set("jb-cache", record);
          await pushToCloud(record);
        } else {
          ls.set("pack-index", data.index);
          ls.set("pack-lists", data.lists);
          ls.set("pack-todos", data.todos || {});
        }
        alert("Import erfolgreich!");
      } catch { alert("Fehler beim Importieren"); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // ── JSONBin Settings ─────────────────────────────────────────────────────────
  const saveSettings = async () => {
    const key = apiKeyInput.trim(); const id = binIdInput.trim();
    if (!key) { setSyncMsg("API Key fehlt"); return; }
    ls.set("jb-apikey", key); setApiKey(key);
    if (id) {
      ls.set("jb-binid", id); setBinId(id);
    } else {
      setCreating(true);
      try {
        const newId = await jsonbin.createBin(key);
        ls.set("jb-binid", newId); setBinId(newId); setBinIdInput(newId);
        setSyncMsg("Bin erstellt: " + newId);
      } catch (e) { setSyncMsg(e.message); }
      setCreating(false);
    }
    setApiKeyInput(""); setSyncMsg("Gespeichert ✓");
  };

  const clearSettings = () => {
    ls.del("jb-apikey"); ls.del("jb-binid"); ls.del("jb-cache");
    setApiKey(""); setBinId(""); setSyncMsg("Einstellungen gelöscht");
  };

  const manualSync = async () => {
    const remote = await pullFromCloud();
    if (!remote || !remote.index) { setSyncMsg("Nichts in der Cloud gefunden"); return; }
    ls.set("jb-cache", remote);
    setLists(remote.index);
    if (remote.index.length > 0) {
      const id = remote.index[0].id;
      setActiveId(id); setList(remote.lists?.[id] || null);
      setTodos(remote.todos?.[id] || deepClone(DEFAULT_TODOS));
    }
  };

  // ── Computed ─────────────────────────────────────────────────────────────────
  const total = list ? list.categories.reduce((s, c) => s + c.items.length, 0) : 0;
  const checked = list ? list.categories.reduce((s, c) => s + c.items.filter(i => i.checked).length, 0) : 0;
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
  const todoDone = todos.filter(t => t.done).length;
  const todoOpen = todos.filter(t => !t.done).length;
  const filtered = todoFilter === "all" ? todos : todoFilter === "open" ? todos.filter(t => !t.done) : todos.filter(t => t.tag === todoFilter);

  // ── Styles ────────────────────────────────────────────────────────────────────
  const card = { background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, overflow: "hidden" };
  const inp = { flex: 1, fontSize: 13, padding: "5px 8px", border: "0.5px solid #e0e0e0", borderRadius: 8, background: "transparent", color: "inherit" };
  const btn = (primary) => ({ fontSize: 13, padding: "6px 14px", borderRadius: 8, border: primary ? "none" : "0.5px solid #ddd", background: primary ? "#222" : "#fff", color: primary ? "#fff" : "#555", cursor: "pointer" });

  const Checkbox = ({ checked: chk, round }) => (
    <div style={{ width: 18, height: 18, borderRadius: round ? "50%" : 4, flexShrink: 0, border: chk ? "none" : "1.5px solid #ccc", background: chk ? "#3B6D11" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
      {chk && <span style={{ fontSize: 11, color: "#fff", lineHeight: 1 }}>✓</span>}
    </div>
  );

  const TabBtn = ({ id, label, badge }) => (
    <button onClick={() => setTab(id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", fontSize: 14, fontWeight: tab === id ? 600 : 400, borderBottom: tab === id ? "2px solid #222" : "2px solid transparent", borderTop: "none", borderLeft: "none", borderRight: "none", background: "transparent", cursor: "pointer", borderRadius: 0, color: tab === id ? "#111" : "#888" }}>
      {label}
      {badge > 0 && <span style={{ fontSize: 11, background: "#f0f0f0", borderRadius: 99, padding: "1px 6px", color: "#777" }}>{badge}</span>}
    </button>
  );

  const syncColor = { idle: "#bbb", syncing: "#185FA5", ok: "#3B6D11", error: "#993C1D" }[syncStatus];
  const syncLabel = { idle: cloudEnabled ? "☁ Sync aktiv" : "💾 Lokal", syncing: "↑ Synchronisiere…", ok: "✓ Gespeichert", error: "✗ " + syncMsg }[syncStatus];

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100svh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#111" }}>

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 16px", borderBottom: "0.5px solid #e5e5e5", background: "#fff", gap: 10 }}>
        <span style={{ fontWeight: 700, fontSize: 16, flex: 1 }}>🚴 Packliste</span>
        <span style={{ fontSize: 12, color: syncColor }}>{syncLabel}</span>
        {cloudEnabled && (
          <button onClick={manualSync} style={{ ...btn(false), fontSize: 12, padding: "4px 10px" }}>↻ Sync</button>
        )}
        <button onClick={exportData} style={{ ...btn(false), fontSize: 12, padding: "4px 10px" }}>⬇ Export</button>
        <button onClick={() => importFile.current.click()} style={{ ...btn(false), fontSize: 12, padding: "4px 10px" }}>⬆ Import</button>
        <input ref={importFile} type="file" accept=".json" onChange={importData} style={{ display: "none" }} />
        <button onClick={() => setView(v => v === "settings" ? "app" : "settings")} style={{ ...btn(view === "settings"), fontSize: 13, padding: "4px 10px" }}>⚙</button>
      </div>

      {/* Settings panel */}
      {view === "settings" && (
        <div style={{ background: "#fafafa", borderBottom: "0.5px solid #e5e5e5", padding: "1.25rem 1.5rem" }}>
          <p style={{ fontWeight: 600, fontSize: 15, margin: "0 0 4px" }}>☁ JSONBin Sync</p>
          <p style={{ fontSize: 13, color: "#777", margin: "0 0 16px" }}>Daten werden auf allen Geräten geteilt. Konto anlegen auf <a href="https://jsonbin.io" target="_blank" rel="noreferrer" style={{ color: "#185FA5" }}>jsonbin.io</a> → API Keys → Master Key kopieren.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 480 }}>
            <div>
              <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Master API Key</label>
              <input value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)} placeholder={apiKey ? "••••••••••••••••" : "API Key eingeben"} type="password" style={{ width: "100%", fontSize: 14, padding: "8px 10px", border: "0.5px solid #ddd", borderRadius: 8, boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Bin ID <span style={{ color: "#bbb" }}>(leer lassen = neuen Bin erstellen)</span></label>
              <input value={binIdInput} onChange={e => setBinIdInput(e.target.value)} placeholder={binId || "z.B. 68abc123def456"} style={{ width: "100%", fontSize: 14, padding: "8px 10px", border: "0.5px solid #ddd", borderRadius: 8, boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <button onClick={saveSettings} style={btn(true)} disabled={creating}>{creating ? "Erstelle Bin…" : "Speichern & verbinden"}</button>
              {cloudEnabled && <button onClick={clearSettings} style={btn(false)}>Verbindung trennen</button>}
              {syncMsg && <span style={{ fontSize: 13, color: syncStatus === "error" ? "#993C1D" : "#3B6D11" }}>{syncMsg}</span>}
            </div>
            {binId && <p style={{ fontSize: 12, color: "#999", margin: 0 }}>Aktive Bin ID: <code style={{ background: "#f0f0f0", padding: "1px 6px", borderRadius: 4 }}>{binId}</code></p>}
          </div>

          <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "0.5px solid #e5e5e5" }}>
            <p style={{ fontWeight: 600, fontSize: 14, margin: "0 0 8px" }}>📂 Backup</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={exportData} style={btn(false)}>⬇ Als JSON exportieren</button>
              <button onClick={() => importFile.current.click()} style={btn(false)}>⬆ JSON importieren</button>
            </div>
            <p style={{ fontSize: 12, color: "#aaa", margin: "8px 0 0" }}>Export enthält alle Listen, Kategorien, Items und To-Dos.</p>
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ display: "flex", flex: 1 }}>

        {/* Sidebar */}
        <div style={{ width: sidebar ? 200 : 0, minWidth: sidebar ? 200 : 0, overflow: "hidden", transition: "all 0.2s", borderRight: "0.5px solid #e5e5e5", display: "flex", flexDirection: "column", gap: 4, padding: sidebar ? "1rem 0.75rem" : 0, background: "#fafafa" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px 4px" }}>Listen</p>
          {lists.map(l => (
            <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", borderRadius: 8, background: activeId === l.id ? "#ececec" : "transparent", cursor: "pointer" }}>
              <span onClick={() => selectList(l.id)} style={{ flex: 1, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.name}</span>
              <span onClick={(e) => { e.stopPropagation(); deleteList(l.id); }} style={{ fontSize: 16, color: "#ccc", cursor: "pointer", lineHeight: 1 }}>×</span>
            </div>
          ))}
          {showNewList ? (
            <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
              <input autoFocus value={newListName} onChange={e => setNewListName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") createList(); if (e.key === "Escape") setShowNewList(false); }} placeholder="Listenname" style={{ flex: 1, fontSize: 13, padding: "4px 8px", border: "0.5px solid #ddd", borderRadius: 6 }} />
              <button onClick={createList} style={{ fontSize: 13, padding: "4px 8px", borderRadius: 6, border: "0.5px solid #ddd", background: "#fff", cursor: "pointer" }}>+</button>
            </div>
          ) : (
            <button onClick={() => setShowNewList(true)} style={{ marginTop: 8, fontSize: 13, display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", border: "none", background: "transparent", cursor: "pointer", color: "#888" }}>
              + Neue Liste
            </button>
          )}
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {!list ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, gap: 16, color: "#aaa" }}>
              <div style={{ fontSize: 48, opacity: 0.3 }}>📋</div>
              <p style={{ margin: 0 }}>Keine Liste ausgewählt</p>
              <button onClick={() => { setShowNewList(true); setSidebar(true); }} style={btn(true)}>+ Erste Liste erstellen</button>
            </div>
          ) : (
            <>
              <div style={{ padding: "0.75rem 1rem 0", borderBottom: "0.5px solid #e5e5e5", background: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <button onClick={() => setSidebar(p => !p)} style={{ padding: "4px 6px", border: "none", background: "transparent", cursor: "pointer", fontSize: 18, color: "#666" }}>☰</button>
                  <span style={{ fontWeight: 600, fontSize: 16, flex: 1 }}>{list.name}</span>
                </div>
                <div style={{ display: "flex" }}>
                  <TabBtn id="pack" label="🎒 Packliste" badge={total - checked} />
                  <TabBtn id="todo" label="✅ To-Do" badge={todoOpen} />
                </div>
              </div>

              <div style={{ flex: 1, padding: "1rem", overflow: "auto", background: "#f8f8f8" }}>

                {/* PACKLISTE */}
                {tab === "pack" && (
                  <>
                    <div style={{ ...card, marginBottom: "1rem", padding: "12px 14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666", marginBottom: 8 }}>
                        <span>{checked} von {total} gepackt</span>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <span style={{ fontWeight: 600, color: pct === 100 ? "#3B6D11" : "#111" }}>{pct}%</span>
                          <button onClick={resetChecked} style={{ fontSize: 12, padding: "2px 8px", borderRadius: 6, border: "0.5px solid #ddd", background: "#f5f5f5", cursor: "pointer", color: "#666" }}>Reset</button>
                        </div>
                      </div>
                      <div style={{ height: 6, background: "#eee", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: pct + "%", background: pct === 100 ? "#3B6D11" : "#333", borderRadius: 99, transition: "width 0.3s" }} />
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {list.categories.map(cat => {
                        const cc = cat.items.filter(i => i.checked).length;
                        const cp = cat.items.length > 0 ? Math.round((cc / cat.items.length) * 100) : 0;
                        return (
                          <div key={cat.id} style={card}>
                            <div style={{ padding: "9px 14px", background: "#f5f5f5", borderBottom: "0.5px solid #e5e5e5", display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 16 }}>{cat.icon}</span>
                              <span style={{ fontWeight: 600, fontSize: 14, flex: 1 }}>{cat.name}</span>
                              <span style={{ fontSize: 12, color: cp === 100 ? "#3B6D11" : "#aaa" }}>{cc}/{cat.items.length}</span>
                              <div style={{ width: 40, height: 4, background: "#ddd", borderRadius: 99, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: cp + "%", background: cp === 100 ? "#3B6D11" : "#888", borderRadius: 99, transition: "width 0.3s" }} />
                              </div>
                              <span onClick={() => deleteCategory(cat.id)} style={{ fontSize: 16, color: "#ccc", cursor: "pointer", lineHeight: 1, marginLeft: 4 }}>×</span>
                            </div>
                            <div style={{ background: "#fff" }}>
                              {cat.items.map(item => (
                                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderBottom: "0.5px solid #f2f2f2", opacity: item.checked ? 0.4 : 1, cursor: "pointer" }} onClick={() => toggleItem(cat.id, item.id)}>
                                  <Checkbox checked={item.checked} />
                                  <span style={{ fontSize: 14, flex: 1, textDecoration: item.checked ? "line-through" : "none" }}>{item.name}</span>
                                  <span onClick={(e) => { e.stopPropagation(); deleteItem(cat.id, item.id); }} style={{ fontSize: 16, color: "#ccc", cursor: "pointer", lineHeight: 1 }}>×</span>
                                </div>
                              ))}
                              <div style={{ display: "flex", gap: 6, padding: "7px 14px" }}>
                                <input value={newItems[cat.id] || ""} onChange={e => setNewItems(p => ({ ...p, [cat.id]: e.target.value }))} onKeyDown={e => { if (e.key === "Enter") addItem(cat.id); }} placeholder="Item hinzufügen…" style={inp} />
                                <button onClick={() => addItem(cat.id)} style={{ ...btn(false), padding: "4px 10px" }}>+</button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div>
                        {showNewCat ? (
                          <div style={{ display: "flex", gap: 6 }}>
                            <input autoFocus value={newCatName} onChange={e => setNewCatName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addCategory(); if (e.key === "Escape") setShowNewCat(false); }} placeholder="Kategoriename" style={{ flex: 1, fontSize: 14, padding: "8px 12px", border: "0.5px solid #ddd", borderRadius: 8 }} />
                            <button onClick={addCategory} style={btn(true)}>Erstellen</button>
                            <button onClick={() => setShowNewCat(false)} style={btn(false)}>✕</button>
                          </div>
                        ) : (
                          <button onClick={() => setShowNewCat(true)} style={{ fontSize: 14, width: "100%", padding: "12px", borderRadius: 12, border: "0.5px dashed #ccc", background: "transparent", cursor: "pointer", color: "#999" }}>
                            + Kategorie hinzufügen
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* TO-DO */}
                {tab === "todo" && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", gap: 8, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {["all", "open", ...Object.keys(TAGS)].map(f => {
                          const label = f === "all" ? "Alle" : f === "open" ? "Offen" : TAGS[f].label;
                          const active = todoFilter === f;
                          return <button key={f} onClick={() => setTodoFilter(f)} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 99, background: active ? "#222" : "#fff", border: "0.5px solid " + (active ? "#222" : "#ddd"), color: active ? "#fff" : "#666", cursor: "pointer" }}>{label}</button>;
                        })}
                      </div>
                      {todoDone > 0 && <button onClick={clearDone} style={{ ...btn(false), fontSize: 12, padding: "4px 10px" }}>🗑 Erledigte löschen ({todoDone})</button>}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {filtered.map(todo => {
                        const tc = TAGS[todo.tag] || TAGS.sonstiges;
                        return (
                          <div key={todo.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 10, opacity: todo.done ? 0.5 : 1, cursor: "pointer" }} onClick={() => toggleTodo(todo.id)}>
                            <Checkbox checked={todo.done} round />
                            <span style={{ flex: 1, fontSize: 14, textDecoration: todo.done ? "line-through" : "none" }}>{todo.text}</span>
                            <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: tc.bg, color: tc.color, flexShrink: 0, fontWeight: 600 }}>{tc.label}</span>
                            <span onClick={(e) => { e.stopPropagation(); deleteTodo(todo.id); }} style={{ fontSize: 16, color: "#ccc", cursor: "pointer", lineHeight: 1 }}>×</span>
                          </div>
                        );
                      })}
                      {filtered.length === 0 && <div style={{ textAlign: "center", padding: "2.5rem", color: "#ccc", fontSize: 14 }}>✓ Keine Aufgaben hier</div>}
                      <div style={{ marginTop: 4 }}>
                        {showTodoInput ? (
                          <div style={{ background: "#fff", border: "0.5px solid #ddd", borderRadius: 12, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
                            <input autoFocus value={newTodoText} onChange={e => setNewTodoText(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addTodo(); if (e.key === "Escape") setShowTodoInput(false); }} placeholder="Aufgabe eingeben…" style={{ fontSize: 14, padding: "8px 10px", border: "0.5px solid #ddd", borderRadius: 8 }} />
                            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                              <span style={{ fontSize: 13, color: "#666" }}>Kategorie:</span>
                              {Object.entries(TAGS).map(([k, v]) => (
                                <button key={k} onClick={() => setNewTodoTag(k)} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 99, cursor: "pointer", background: newTodoTag === k ? v.bg : "transparent", border: newTodoTag === k ? "1.5px solid " + v.color : "0.5px solid #ddd", color: newTodoTag === k ? v.color : "#888", fontWeight: newTodoTag === k ? 600 : 400 }}>{v.label}</button>
                              ))}
                              <div style={{ flex: 1 }}></div>
                              <button onClick={addTodo} style={btn(true)}>Hinzufügen</button>
                              <button onClick={() => setShowTodoInput(false)} style={btn(false)}>Abbrechen</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setShowTodoInput(true)} style={{ fontSize: 14, width: "100%", padding: "12px", borderRadius: 12, border: "0.5px dashed #ccc", background: "transparent", cursor: "pointer", color: "#999" }}>
                            + Aufgabe hinzufügen
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
