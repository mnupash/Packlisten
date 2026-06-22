import { useState, useEffect, useRef } from "react";

// ─── Seed Data (wird beim ersten Start automatisch geladen) ───────────────────
const SEED_LIST = {
  id: "tour-de-paris", name: "Tour de Paris",
  categories: [
    { id: "bekleidung", name: "Bekleidung", icon: "👕", items: [
      "2x Sponsoren Trikot","2x Bib","1x Notfall Bib (Schwarz)","1x Windweste",
      "Armlinge","Beinlinge","Handschuhe","Caps/Stirnband","Buff","Helm",
      "Regenjacke","Regenhose","Fahrradschuhe","Regenüberschuhe",
      "Radbrillen (Helles/Dunkles Visier)","Socken",
    ]},
    { id: "rad", name: "Rad & Werkzeug", icon: "🔧", items: [
      "Multitool","Flickzeug-Set","Ersatzschlauch x2","Reifenheber x2",
      "Minipumpe","CO2-Patronen","Kettenschloss x2","Fahrradschloss","Kettenoel",
    ]},
    { id: "elektronik", name: "Elektronik & Navigation", icon: "📱", items: [
      "Garmin Edge 1040","Ladekabel(s)","Powerbank","Smartphone","Garmin Varia Radar","Kopfhoerer",
    ]},
    { id: "nutrition", name: "Verpflegung", icon: "🥗", items: [
      "Energiegels","Energieriegel","Elektrolyttabletten","Trinkflaschen x2","Isotonik-Pulver",
    ]},
    { id: "unterkunft", name: "Übernachtung", icon: "⛺", items: [
      "Zelt / Biwak","Schlafsack","Isomatte","Stirnlampe + Batterien",
    ]},
    { id: "hygiene", name: "Hygiene & Erste Hilfe", icon: "🩹", items: [
      "Verbandszeug","Schmerzmittel","Sonnencreme LSF 50","Lippenpflege",
      "Zahnbürste & Paste","Chamois Creme","Mikrofaser-Handtuch",
    ]},
    { id: "dokumente", name: "Dokumente & Sonstiges", icon: "🪪", items: [
      "Personalausweis","Kreditkarte","Bargeld (EUR)","Krankenversicherungskarte","Startnummer / Teilnahmebeleg",
    ]},
  ],
  todos: [
    { text: "Medikamente besorgen", tag: "besorgung" },
    { text: "Fehlende Ausrüstung bestellen", tag: "bestellen" },
    { text: "Rad zur Inspektion bringen", tag: "rad" },
    { text: "Reifenluftdruck prüfen", tag: "rad" },
    { text: "Powerbank aufladen", tag: "vorbereitung" },
  ]
};

const BUILTIN_TEMPLATES = [
  {
    id: "tourparis", name: "Tour de Paris", icon: "🗼", color: "#185FA5", desc: "Star Ride – deine Vorlage",
    categories: SEED_LIST.categories, todos: SEED_LIST.todos,
  },
  {
    id: "bikepacking", name: "Bikepacking", icon: "🚴", color: "#1a1a1a", desc: "Mehrtägige Radreise",
    categories: [
      { id: "bekleidung", name: "Bekleidung", icon: "👕", items: ["Trikot","Radhose (Bib)","Windjacke","Regenjacke","Helm","Handschuhe","Radsocken","Fahrradschuhe","Sonnenbrille","Basisschicht Langarm"] },
      { id: "rad", name: "Rad & Werkzeug", icon: "🔧", items: ["Multitool","Flickzeug-Set","Ersatzschlauch x2","Reifenheber x2","Minipumpe","CO2-Patronen","Kettenschloss x2","Fahrradschloss","Kettenoel"] },
      { id: "elektronik", name: "Elektronik & Navigation", icon: "📱", items: ["Garmin Edge 1040","Ladekabel(s)","Powerbank","Smartphone","Garmin Varia Radar","Kopfhoerer"] },
      { id: "nutrition", name: "Verpflegung", icon: "🥗", items: ["Energiegels","Energieriegel","Elektrolyttabletten","Trinkflaschen x2","Isotonik-Pulver"] },
      { id: "unterkunft", name: "Übernachtung", icon: "⛺", items: ["Zelt / Biwak","Schlafsack","Isomatte","Stirnlampe + Batterien"] },
      { id: "hygiene", name: "Hygiene & Erste Hilfe", icon: "🩹", items: ["Verbandszeug","Schmerzmittel","Sonnencreme LSF 50","Lippenpflege","Zahnbürste & Paste","Chamois Creme","Mikrofaser-Handtuch"] },
      { id: "dokumente", name: "Dokumente", icon: "🪪", items: ["Personalausweis","Kreditkarte","Bargeld (EUR)","Krankenversicherungskarte","Startnummer / Teilnahmebeleg"] },
    ],
    todos: [{ text: "Medikamente besorgen", tag: "besorgung" },{ text: "Fehlende Ausrüstung bestellen", tag: "bestellen" },{ text: "Rad zur Inspektion", tag: "rad" },{ text: "Reifenluftdruck prüfen", tag: "rad" }]
  },
  {
    id: "starride", name: "Star Ride Paris", icon: "⭐", color: "#185FA5", desc: "1000 km, 8 Etappen",
    categories: [
      { id: "bekleidung", name: "Bekleidung", icon: "👕", items: ["Trikot x3","Radhose (Bib) x2","Windjacke","Regenjacke","Helm","Handschuhe","Radsocken x3","Fahrradschuhe","Sonnenbrille","Basisschicht Langarm","Casual-Kleidung Abend"] },
      { id: "rad", name: "Rad & Werkzeug", icon: "🔧", items: ["Multitool","Flickzeug-Set","Ersatzschlauch x3","Reifenheber x2","Minipumpe","CO2-Patronen","Kettenschloss x3","Kettenoel"] },
      { id: "elektronik", name: "Elektronik", icon: "📱", items: ["Garmin Edge 1040","Ladekabel(s)","Powerbank 20000mAh","Smartphone","Garmin Varia Radar","Stirnlampe","GoPro / Kamera"] },
      { id: "nutrition", name: "Verpflegung", icon: "🥗", items: ["Energiegels (Etappenvorrat)","Energieriegel","Elektrolyttabletten","Trinkflaschen x2","Isotonik-Pulver","Magnesium","Koffein-Gels"] },
      { id: "hotel", name: "Hotel / Gepäck", icon: "🏨", items: ["Reisetasche (Teamtransport)","Wechselkleidung x8","Schlafsachen","Zahnbürste & Paste","Duschgel & Shampoo","Mikrofaser-Handtuch"] },
      { id: "hygiene", name: "Pflege & Erste Hilfe", icon: "🩹", items: ["Chamois Creme (groß)","Verbandszeug","Schmerzmittel","Blasenpflaster","Sonnencreme LSF 50","Lippenpflege"] },
      { id: "dokumente", name: "Dokumente", icon: "🪪", items: ["Reisepass / Personalausweis","Kreditkarte","Bargeld EUR + CHF + DKK","Krankenversicherungskarte","Startnummer","Hotelbestätigungen"] },
    ],
    todos: [{ text: "Anmeldegebühr bezahlt?", tag: "vorbereitung" },{ text: "Trikot mit Sponsorenlogos bestellen", tag: "bestellen" },{ text: "Rad zur Inspektion (2 Wochen vor Start)", tag: "rad" },{ text: "Spendenseite aktualisieren", tag: "vorbereitung" }]
  },
  {
    id: "sommerurlaub", name: "Sommerurlaub", icon: "🌞", color: "#854F0B", desc: "Strandurlaub & Reisen",
    categories: [
      { id: "bekleidung", name: "Bekleidung", icon: "👕", items: ["T-Shirts x5","Shorts x3","Badehose / Bikini x2","Abendkleidung","Unterwäsche x7","Socken x5","Sandalen","Sneaker","Sonnenbrille","Sonnenhut / Cap"] },
      { id: "strand", name: "Strand & Pool", icon: "🏖", items: ["Sonnencreme LSF 50","After-Sun-Lotion","Strandtuch","Schnorchel-Set","Flip Flops"] },
      { id: "elektronik", name: "Elektronik", icon: "📱", items: ["Smartphone","Ladekabel(s)","Powerbank","Kamera","Reisestecker-Adapter","Kopfhörer","Kindle / Tablet"] },
      { id: "hygiene", name: "Hygiene", icon: "🧴", items: ["Zahnbürste & Paste","Deo","Shampoo & Duschgel","Schmerzmittel","Durchfall-Tabletten","Mückenschutz","Verbandsmaterial"] },
      { id: "dokumente", name: "Dokumente", icon: "🪪", items: ["Reisepass","Kreditkarte","Bargeld","Krankenversicherungskarte","Reiseversicherung","Buchungsbestätigungen","Impfpass"] },
    ],
    todos: [{ text: "Flug / Bahn buchen", tag: "bestellen" },{ text: "Hotel / Unterkunft buchen", tag: "bestellen" },{ text: "Reiseversicherung abschließen", tag: "besorgung" },{ text: "Währung besorgen", tag: "besorgung" },{ text: "Roaming / eSIM aktivieren", tag: "vorbereitung" }]
  },
  {
    id: "backpacking", name: "Backpacking", icon: "🎒", color: "#3B6D11", desc: "Mehrtägige Trekking-Tour",
    categories: [
      { id: "bekleidung", name: "Bekleidung", icon: "👕", items: ["Merino T-Shirt x2","Wanderhose (zip-off)","Fleecejacke","Hardshell Jacke","Regenhose","Wandersocken x3","Wanderschuhe","Sandalen / Crocs","Mütze","Handschuhe","Sonnenbrille","Buff"] },
      { id: "schlafen", name: "Schlafen & Unterkunft", icon: "🏕", items: ["Rucksack (60-70L)","Zelt (ultralight)","Schlafsack (-5°C)","Isomatte / Pad","Inlett / Hüttenschlafsack","Stirnlampe + Ersatzbatterien","Packsäcke / Dry Bags"] },
      { id: "kochen", name: "Kochen & Essen", icon: "🍳", items: ["Gaskocher","Gaskartuschen x2","Topf (klein)","Besteck (Titanium)","Feuerzeug","Wasserfilter / Steripen","Trinkflasche x2","Verpflegung (Tagesration)"] },
      { id: "navigation", name: "Navigation & Sicherheit", icon: "🗺", items: ["Karte (wasserfest)","Kompass","GPS offline","Pfeife","Notfalldecke","Erste-Hilfe-Set","Notfallkontakte notiert"] },
      { id: "hygiene", name: "Hygiene & Pflege", icon: "🩹", items: ["Sonnencreme LSF 50","Insektenschutz","Handdesinfektionsmittel","Toilettenpapier","Zahnbürste & Paste (mini)","Schmerzmittel","Blasenpflaster"] },
      { id: "dokumente", name: "Dokumente", icon: "🪪", items: ["Personalausweis / Reisepass","Notgeld","Krankenversicherungskarte","Reiseversicherung","Notrufnummern notiert"] },
    ],
    todos: [{ text: "Route planen & offline downloaden", tag: "vorbereitung" },{ text: "Wetterbericht prüfen", tag: "vorbereitung" },{ text: "Gaspatronen besorgen", tag: "besorgung" },{ text: "Schuhe einlaufen", tag: "vorbereitung" },{ text: "Notfallkontakt informieren", tag: "vorbereitung" }]
  },
  { id: "leer", name: "Leere Liste", icon: "📋", color: "#888", desc: "Komplett leer starten", categories: [], todos: [] },
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
const buildCatsFromTemplate = (tpl) => tpl.categories.map(c => ({ id: c.id + "-" + uid(), name: c.name, icon: c.icon, items: c.items.map(name => ({ id: uid(), name, checked: false })) }));
const buildTodosFromTemplate = (tpl) => tpl.todos.map(t => ({ id: uid(), text: t.text, done: false, tag: t.tag }));

const ls = {
  get: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del: (k) => { try { localStorage.removeItem(k); } catch {} },
};

const jsonbin = {
  async getAll(binId, apiKey) { const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, { headers: { "X-Master-Key": apiKey } }); if (!res.ok) throw new Error("JSONBin fetch fehlgeschlagen"); return (await res.json()).record || {}; },
  async setAll(binId, apiKey, record) { const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, { method: "PUT", headers: { "Content-Type": "application/json", "X-Master-Key": apiKey }, body: JSON.stringify(record) }); if (!res.ok) throw new Error("JSONBin write fehlgeschlagen"); },
  async createBin(apiKey) { const res = await fetch("https://api.jsonbin.io/v3/b", { method: "POST", headers: { "Content-Type": "application/json", "X-Master-Key": apiKey, "X-Bin-Name": "Packliste" }, body: JSON.stringify({}) }); if (!res.ok) throw new Error("Bin erstellen fehlgeschlagen"); return (await res.json()).metadata.id; }
};

// ─── Drag & Drop Hook ─────────────────────────────────────────────────────────
function useDragSort(onReorder) {
  const [dragId, setDragId] = useState(null);
  const [overId, setOverId] = useState(null);
  const touchRef = useRef({ active: false, id: null, scrollY: 0 });

  // HTML5 drag (desktop)
  const dragProps = (id) => ({
    draggable: true,
    onDragStart: (e) => { e.stopPropagation(); setDragId(id); e.dataTransfer.effectAllowed = "move"; },
    onDragOver: (e) => { e.preventDefault(); e.stopPropagation(); setOverId(id); },
    onDrop: (e) => { e.preventDefault(); e.stopPropagation(); if (dragId && dragId !== id) onReorder(dragId, id); setDragId(null); setOverId(null); },
    onDragEnd: () => { setDragId(null); setOverId(null); },
  });

  // Touch (mobile)
  const handleProps = (id) => ({
    onTouchStart: (e) => {
      touchRef.current = { active: true, id, scrollY: window.scrollY };
      setDragId(id);
    },
    onTouchMove: (e) => {
      if (!touchRef.current.active) return;
      e.preventDefault();
      const touch = e.touches[0];
      // Temporarily hide the dragged element to get what's underneath
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      const target = el?.closest("[data-sortid]");
      if (target && target.dataset.sortid !== touchRef.current.id) {
        setOverId(target.dataset.sortid);
      }
    },
    onTouchEnd: () => {
      if (touchRef.current.active && overId && touchRef.current.id !== overId) {
        onReorder(touchRef.current.id, overId);
      }
      touchRef.current.active = false;
      setDragId(null); setOverId(null);
    },
  });

  return { dragId, overId, dragProps, handleProps };
}

export default function App() {
  const [lists, setLists] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [list, setList] = useState(null);
  const [todos, setTodos] = useState([]);
  const [tab, setTab] = useState("pack");
  const [drawer, setDrawer] = useState(false);
  const [view, setView] = useState("app");
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [pickedTemplate, setPickedTemplate] = useState(null);
  const [newListName, setNewListName] = useState("");
  const [customTemplates, setCustomTemplates] = useState(() => ls.get("custom-templates") || []);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [newItems, setNewItems] = useState({});
  const [newCatName, setNewCatName] = useState("");
  const [showNewCat, setShowNewCat] = useState(false);
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoTag, setNewTodoTag] = useState("sonstiges");
  const [showTodoInput, setShowTodoInput] = useState(false);
  const [todoFilter, setTodoFilter] = useState("all");
  const [apiKey, setApiKey] = useState(() => ls.get("jb-apikey") || "");
  const [binId, setBinId] = useState(() => ls.get("jb-binid") || "");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [binIdInput, setBinIdInput] = useState("");
  const [syncStatus, setSyncStatus] = useState("idle");
  const [syncMsg, setSyncMsg] = useState("");
  const [creating, setCreating] = useState(false);
  const importFile = useRef(null);
  const cloudEnabled = apiKey && binId;

  const pushToCloud = async (record) => {
    if (!cloudEnabled) return;
    try { setSyncStatus("syncing"); await jsonbin.setAll(binId, apiKey, record); setSyncStatus("ok"); setTimeout(() => setSyncStatus("idle"), 2000); }
    catch (e) { setSyncStatus("error"); setSyncMsg(e.message); }
  };
  const pullFromCloud = async () => {
    if (!cloudEnabled) return null;
    try { setSyncStatus("syncing"); const r = await jsonbin.getAll(binId, apiKey); setSyncStatus("ok"); setTimeout(() => setSyncStatus("idle"), 2000); return r; }
    catch (e) { setSyncStatus("error"); setSyncMsg(e.message); return null; }
  };
  const buildRecord = (idx, lm, tm) => ({ index: idx, lists: lm, todos: tm });

  useEffect(() => {
    (async () => {
      let idx, listMap, todoMap;
      if (cloudEnabled) {
        const remote = await pullFromCloud();
        if (remote?.index) { idx = remote.index; listMap = remote.lists || {}; todoMap = remote.todos || {}; ls.set("jb-cache", remote); }
        else { const c = ls.get("jb-cache") || {}; idx = c.index; listMap = c.lists || {}; todoMap = c.todos || {}; }
      } else { idx = ls.get("pack-index"); listMap = ls.get("pack-lists") || {}; todoMap = ls.get("pack-todos") || {}; }
      // Erster Start: Seed-Daten laden
      if (!idx || idx.length === 0) {
        const sid = SEED_LIST.id;
        const seedCats = buildCatsFromTemplate(SEED_LIST);
        const seedTodos = buildTodosFromTemplate(SEED_LIST);
        const seedDoc = { id: sid, name: SEED_LIST.name, categories: seedCats };
        idx = [{ id: sid, name: SEED_LIST.name }];
        listMap = { [sid]: seedDoc };
        todoMap = { [sid]: seedTodos };
        if (cloudEnabled) { const r = { index: idx, lists: listMap, todos: todoMap }; ls.set("jb-cache", r); await pushToCloud(r); }
        else { ls.set("pack-index", idx); ls.set("pack-lists", listMap); ls.set("pack-todos", todoMap); }
      }

      if (idx?.length > 0) {
        setLists(idx); const fid = idx[0].id;
        if (listMap[fid]) { setActiveId(fid); setList(listMap[fid]); }
        setTodos(todoMap[fid] || []);
      }
    })();
  }, []);

  const getMaps = () => {
    const prev = cloudEnabled ? (ls.get("jb-cache") || {}) : {};
    return { listMap: { ...(prev.lists || ls.get("pack-lists") || {}) }, todoMap: { ...(prev.todos || ls.get("pack-todos") || {}) } };
  };
  const persist = async (idx, lm, tm) => {
    if (cloudEnabled) { const r = buildRecord(idx, lm, tm); ls.set("jb-cache", r); await pushToCloud(r); }
    else { ls.set("pack-index", idx); ls.set("pack-lists", lm); ls.set("pack-todos", tm); }
  };

  const selectList = (id) => {
    const { listMap, todoMap } = getMaps();
    if (listMap[id]) { setActiveId(id); setList(listMap[id]); }
    setTodos(todoMap[id] || []); setDrawer(false);
  };

  const createList = async () => {
    if (!pickedTemplate || !newListName.trim()) return;
    const name = newListName.trim(); const id = uid();
    const d = { id, name, categories: buildCatsFromTemplate(pickedTemplate) };
    const t = buildTodosFromTemplate(pickedTemplate);
    const idx = [...lists, { id, name }];
    const { listMap, todoMap } = getMaps();
    listMap[id] = d; todoMap[id] = t;
    setLists(idx); setActiveId(id); setList(d); setTodos(t);
    await persist(idx, listMap, todoMap);
    setShowTemplatePicker(false); setPickedTemplate(null); setNewListName(""); setDrawer(false);
  };

  const deleteList = async (id) => {
    const idx = lists.filter(l => l.id !== id);
    const { listMap, todoMap } = getMaps();
    delete listMap[id]; delete todoMap[id];
    setLists(idx); await persist(idx, listMap, todoMap);
    if (activeId === id) { if (idx.length > 0) selectList(idx[0].id); else { setActiveId(null); setList(null); setTodos([]); } }
  };

  const saveCurrentAsTemplate = () => {
    const name = templateName.trim(); if (!name || !list) return;
    const tpl = { id: uid(), name, icon: "⭐", color: "#5F5E5A", desc: "Eigene Vorlage", categories: list.categories.map(c => ({ id: c.id, name: c.name, icon: c.icon, items: c.items.map(i => i.name) })), todos: todos.map(t => ({ text: t.text, tag: t.tag })) };
    const updated = [...customTemplates, tpl];
    setCustomTemplates(updated); ls.set("custom-templates", updated);
    setShowSaveTemplate(false); setTemplateName("");
  };

  const updateList = async (u) => {
    setList(u);
    const { listMap, todoMap } = getMaps(); listMap[activeId] = u;
    await persist(lists, listMap, todoMap);
  };
  const updateTodos = async (u) => {
    setTodos(u);
    const { listMap, todoMap } = getMaps(); todoMap[activeId] = u;
    await persist(lists, listMap, todoMap);
  };

  // ─── Drag & Drop for categories ──────────────────────────────────────────
  const catDrag = useDragSort((fromId, toId) => {
    const cats = [...list.categories];
    const fi = cats.findIndex(c => c.id === fromId);
    const ti = cats.findIndex(c => c.id === toId);
    const [moved] = cats.splice(fi, 1);
    cats.splice(ti, 0, moved);
    updateList({ ...list, categories: cats });
  });

  // ─── Drag & Drop for items (per category) ────────────────────────────────
  const itemDragStates = {};
  list?.categories.forEach(cat => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    itemDragStates[cat.id] = useDragSort((fromId, toId) => {
      updateList({
        ...list,
        categories: list.categories.map(c => {
          if (c.id !== cat.id) return c;
          const items = [...c.items];
          const fi = items.findIndex(i => i.id === fromId);
          const ti = items.findIndex(i => i.id === toId);
          const [moved] = items.splice(fi, 1);
          items.splice(ti, 0, moved);
          return { ...c, items };
        })
      });
    });
  });

  const toggleItem = (cid, iid) => updateList({ ...list, categories: list.categories.map(c => c.id !== cid ? c : { ...c, items: c.items.map(i => i.id !== iid ? i : { ...i, checked: !i.checked }) }) });
  const addItem = (cid) => { const name = (newItems[cid] || "").trim(); if (!name) return; updateList({ ...list, categories: list.categories.map(c => c.id !== cid ? c : { ...c, items: [...c.items, { id: uid(), name, checked: false }] }) }); setNewItems(p => ({ ...p, [cid]: "" })); };
  const deleteItem = (cid, iid) => updateList({ ...list, categories: list.categories.map(c => c.id !== cid ? c : { ...c, items: c.items.filter(i => i.id !== iid) }) });
  const addCategory = () => { const name = newCatName.trim(); if (!name) return; updateList({ ...list, categories: [...list.categories, { id: uid(), name, icon: "📦", items: [] }] }); setNewCatName(""); setShowNewCat(false); };
  const deleteCategory = (cid) => updateList({ ...list, categories: list.categories.filter(c => c.id !== cid) });
  const resetChecked = () => updateList({ ...list, categories: list.categories.map(c => ({ ...c, items: c.items.map(i => ({ ...i, checked: false })) })) });
  const addTodo = () => { const text = newTodoText.trim(); if (!text) return; updateTodos([...todos, { id: uid(), text, done: false, tag: newTodoTag }]); setNewTodoText(""); setShowTodoInput(false); };
  const toggleTodo = (id) => updateTodos(todos.map(t => t.id !== id ? t : { ...t, done: !t.done }));
  const deleteTodo = (id) => updateTodos(todos.filter(t => t.id !== id));
  const clearDone = () => updateTodos(todos.filter(t => !t.done));

  const exportData = () => {
    const { listMap, todoMap } = getMaps();
    const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), index: lists, lists: listMap, todos: todoMap, customTemplates }, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "packliste-" + new Date().toISOString().slice(0, 10) + ".json"; a.click();
  };
  const importData = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.index || !data.lists) { alert("Ungültige Datei"); return; }
        setLists(data.index);
        if (data.index.length > 0) { const id = data.index[0].id; setActiveId(id); setList(data.lists[id]); setTodos(data.todos?.[id] || []); }
        if (data.customTemplates) { setCustomTemplates(data.customTemplates); ls.set("custom-templates", data.customTemplates); }
        await persist(data.index, data.lists, data.todos || {});
        alert("Import erfolgreich!");
      } catch { alert("Fehler beim Importieren"); }
    };
    reader.readAsText(file); e.target.value = "";
  };
  const saveSettings = async () => {
    const key = apiKeyInput.trim(); if (!key) { setSyncMsg("API Key fehlt"); return; }
    ls.set("jb-apikey", key); setApiKey(key);
    if (binIdInput.trim()) { ls.set("jb-binid", binIdInput.trim()); setBinId(binIdInput.trim()); setSyncMsg("Verbunden ✓"); }
    else { setCreating(true); try { const id = await jsonbin.createBin(key); ls.set("jb-binid", id); setBinId(id); setBinIdInput(id); setSyncMsg("Bin erstellt ✓"); } catch (ex) { setSyncMsg(ex.message); } setCreating(false); }
    setApiKeyInput("");
  };

  const total = list ? list.categories.reduce((s, c) => s + c.items.length, 0) : 0;
  const checked = list ? list.categories.reduce((s, c) => s + c.items.filter(i => i.checked).length, 0) : 0;
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
  const todoOpen = todos.filter(t => !t.done).length;
  const todoDone = todos.filter(t => t.done).length;
  const filtered = todoFilter === "all" ? todos : todoFilter === "open" ? todos.filter(t => !t.done) : todos.filter(t => t.tag === todoFilter);
  const allTemplates = [...BUILTIN_TEMPLATES, ...customTemplates];
  const syncColor = { idle: cloudEnabled ? "#3B6D11" : "#aaa", syncing: "#185FA5", ok: "#3B6D11", error: "#993C1D" }[syncStatus];
  const syncDot = { idle: cloudEnabled ? "☁" : "💾", syncing: "↑", ok: "✓", error: "✗" }[syncStatus];

  const C = ({ on, round }) => (
    <div style={{ width: 24, height: 24, borderRadius: round ? "50%" : 6, flexShrink: 0, border: on ? "none" : "2px solid #d0d0d0", background: on ? "#3B6D11" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
      {on && <span style={{ fontSize: 14, color: "#fff" }}>✓</span>}
    </div>
  );

  // Drag handle (≡)
  const Handle = ({ dragProps }) => (
    <div {...dragProps} style={{ padding: "4px 6px", cursor: "grab", touchAction: "none", color: "#ccc", fontSize: 18, userSelect: "none", flexShrink: 0 }}>⠿</div>
  );

  const TemplatePicker = () => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "flex-end" }}>
      <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", width: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column", paddingBottom: "env(safe-area-inset-bottom,0px)" }}>
        <div style={{ padding: "16px 20px 12px", borderBottom: "0.5px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Neue Liste</span>
          <button onClick={() => { setShowTemplatePicker(false); setPickedTemplate(null); setNewListName(""); }} style={{ fontSize: 24, border: "none", background: "none", cursor: "pointer", color: "#999" }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {!pickedTemplate ? (
            <>
              <p style={{ fontSize: 14, color: "#888", margin: "0 0 14px" }}>Vorlage auswählen:</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                {allTemplates.map(tpl => (
                  <button key={tpl.id} onClick={() => setPickedTemplate(tpl)} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "14px", borderRadius: 14, border: "1.5px solid #e8e8e8", background: "#fafafa", cursor: "pointer", textAlign: "left", gap: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                      <span style={{ fontSize: 26 }}>{tpl.icon}</span>
                      {!BUILTIN_TEMPLATES.find(b => b.id === tpl.id) && <span onClick={(e) => { e.stopPropagation(); const u = customTemplates.filter(t => t.id !== tpl.id); setCustomTemplates(u); ls.set("custom-templates", u); }} style={{ fontSize: 18, color: "#ccc" }}>×</span>}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{tpl.name}</span>
                    <span style={{ fontSize: 12, color: "#888" }}>{tpl.desc}</span>
                    {tpl.categories.length > 0 && <span style={{ fontSize: 11, color: "#bbb" }}>{tpl.categories.reduce((s, c) => s + c.items.length, 0)} Items</span>}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <button onClick={() => setPickedTemplate(null)} style={{ fontSize: 14, color: "#185FA5", border: "none", background: "none", cursor: "pointer", padding: "0 0 12px" }}>← Zurück</button>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, padding: "14px", background: "#f8f8f8", borderRadius: 12 }}>
                <span style={{ fontSize: 30 }}>{pickedTemplate.icon}</span>
                <div><p style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>{pickedTemplate.name}</p><p style={{ margin: 0, fontSize: 13, color: "#888" }}>{pickedTemplate.desc}</p></div>
              </div>
              <input autoFocus value={newListName} onChange={e => setNewListName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") createList(); }} placeholder={pickedTemplate.name + " 2026"} style={{ width: "100%", fontSize: 16, padding: "13px 14px", border: "1.5px solid #ddd", borderRadius: 12, boxSizing: "border-box", marginBottom: 16 }} />
              <button onClick={createList} disabled={!newListName.trim()} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: newListName.trim() ? "#1a1a1a" : "#e0e0e0", color: newListName.trim() ? "#fff" : "#aaa", fontSize: 16, fontWeight: 600, cursor: newListName.trim() ? "pointer" : "default" }}>Liste erstellen</button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#f2f2f7", minHeight: "100svh", display: "flex", flexDirection: "column", maxWidth: 600, margin: "0 auto" }}>
      {showTemplatePicker && <TemplatePicker />}
      {showSaveTemplate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "flex-end" }}>
          <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", width: "100%", padding: "20px 20px calc(20px + env(safe-area-inset-bottom,0px))" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontWeight: 700, fontSize: 18 }}>Als Vorlage speichern</span>
              <button onClick={() => setShowSaveTemplate(false)} style={{ fontSize: 24, border: "none", background: "none", cursor: "pointer", color: "#999" }}>×</button>
            </div>
            <input autoFocus value={templateName} onChange={e => setTemplateName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") saveCurrentAsTemplate(); }} placeholder="Vorlagenname (z.B. Alpenüberquerung)" style={{ width: "100%", fontSize: 16, padding: "13px 14px", border: "1.5px solid #ddd", borderRadius: 12, boxSizing: "border-box", marginBottom: 14 }} />
            <button onClick={saveCurrentAsTemplate} disabled={!templateName.trim()} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: templateName.trim() ? "#1a1a1a" : "#e0e0e0", color: templateName.trim() ? "#fff" : "#aaa", fontSize: 16, fontWeight: 600, cursor: templateName.trim() ? "pointer" : "default" }}>Vorlage speichern</button>
          </div>
        </div>
      )}

      {drawer && <div onClick={() => setDrawer(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 }} />}
      <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 290, background: "#fff", zIndex: 50, transform: drawer ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.25s ease", display: "flex", flexDirection: "column", paddingTop: "env(safe-area-inset-top,0px)" }}>
        <div style={{ padding: "16px 20px", borderBottom: "0.5px solid #e5e5e5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>🚴 Listen</span>
          <button onClick={() => setDrawer(false)} style={{ fontSize: 24, border: "none", background: "none", cursor: "pointer", color: "#999" }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
          {lists.map(l => (
            <div key={l.id} style={{ display: "flex", alignItems: "center", padding: "13px 12px", borderRadius: 12, background: activeId === l.id ? "#f0f0f0" : "transparent", marginBottom: 4 }}>
              <span onClick={() => selectList(l.id)} style={{ flex: 1, fontSize: 16, fontWeight: activeId === l.id ? 600 : 400, cursor: "pointer" }}>{l.name}</span>
              <span onClick={(e) => { e.stopPropagation(); deleteList(l.id); }} style={{ fontSize: 22, color: "#ccc", padding: "0 4px", cursor: "pointer" }}>×</span>
            </div>
          ))}
          <button onClick={() => { setShowTemplatePicker(true); setDrawer(false); }} style={{ width: "100%", padding: "13px", border: "1.5px dashed #ccc", borderRadius: 12, background: "none", fontSize: 15, color: "#888", cursor: "pointer", marginTop: 4 }}>+ Neue Liste</button>
        </div>
        <div style={{ padding: "12px 16px", borderTop: "0.5px solid #e5e5e5", paddingBottom: "calc(12px + env(safe-area-inset-bottom,0px))", display: "flex", flexDirection: "column", gap: 8 }}>
          {list && <button onClick={() => { setShowSaveTemplate(true); setDrawer(false); }} style={{ padding: "11px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", fontSize: 14, cursor: "pointer" }}>⭐ Als Vorlage speichern</button>}
          <button onClick={exportData} style={{ padding: "11px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", fontSize: 14, cursor: "pointer" }}>⬇ Exportieren</button>
          <button onClick={() => importFile.current.click()} style={{ padding: "11px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", fontSize: 14, cursor: "pointer" }}>⬆ Importieren</button>
          <input ref={importFile} type="file" accept=".json" onChange={importData} style={{ display: "none" }} />
        </div>
      </div>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "0.5px solid #e0e0e0", padding: "0 16px", paddingTop: "env(safe-area-inset-top,0px)", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ display: "flex", alignItems: "center", height: 52, gap: 12 }}>
          <button onClick={() => setDrawer(true)} style={{ fontSize: 22, border: "none", background: "none", cursor: "pointer", color: "#333", padding: "4px 4px 4px 0" }}>☰</button>
          <span style={{ fontWeight: 700, fontSize: 17, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{list ? list.name : "🚴 Packliste"}</span>
          <span style={{ fontSize: 13, color: syncColor }}>{syncDot}</span>
          <button onClick={() => setView(v => v === "settings" ? "app" : "settings")} style={{ fontSize: 20, border: "none", background: "none", cursor: "pointer", color: view === "settings" ? "#185FA5" : "#666", padding: "4px" }}>⚙️</button>
        </div>
        {view === "app" && list && (
          <div style={{ display: "flex", borderTop: "0.5px solid #f0f0f0" }}>
            {[["pack", "🎒", "Packliste", total - checked], ["todo", "✅", "To-Do", todoOpen]].map(([id, icon, label, badge]) => (
              <button key={id} onClick={() => setTab(id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", fontSize: 15, fontWeight: tab === id ? 600 : 400, border: "none", borderBottom: tab === id ? "2.5px solid #111" : "2.5px solid transparent", background: "none", cursor: "pointer", color: tab === id ? "#111" : "#999" }}>
                {icon} {label} {badge > 0 && <span style={{ fontSize: 12, background: "#e8e8e8", borderRadius: 99, padding: "1px 7px", color: "#555" }}>{badge}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {view === "settings" && (
        <div style={{ background: "#fff", margin: 16, borderRadius: 16, padding: 20 }}>
          <p style={{ fontWeight: 700, fontSize: 17, margin: "0 0 4px" }}>☁ JSONBin Sync</p>
          <p style={{ fontSize: 13, color: "#888", margin: "0 0 14px", lineHeight: 1.5 }}>Gleiche Daten auf allen Geräten. <a href="https://jsonbin.io" target="_blank" rel="noreferrer" style={{ color: "#185FA5" }}>jsonbin.io</a> → API Keys.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)} placeholder={apiKey ? "API Key (gesetzt)" : "Master API Key"} type="password" style={{ width: "100%", fontSize: 15, padding: "12px 14px", border: "1px solid #ddd", borderRadius: 10, boxSizing: "border-box" }} />
            <input value={binIdInput} onChange={e => setBinIdInput(e.target.value)} placeholder={binId || "Bin ID (leer = neuen erstellen)"} style={{ width: "100%", fontSize: 15, padding: "12px 14px", border: "1px solid #ddd", borderRadius: 10, boxSizing: "border-box" }} />
            <button onClick={saveSettings} disabled={creating} style={{ padding: "13px", borderRadius: 10, border: "none", background: "#1a1a1a", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>{creating ? "Erstelle Bin…" : "Verbinden"}</button>
            {syncMsg && <p style={{ fontSize: 13, color: syncStatus === "error" ? "#993C1D" : "#3B6D11", margin: 0 }}>{syncMsg}</p>}
            {binId && <p style={{ fontSize: 12, color: "#bbb", margin: 0 }}>Bin: <code style={{ background: "#f5f5f5", padding: "2px 6px", borderRadius: 4 }}>{binId}</code></p>}
            {cloudEnabled && <button onClick={() => { ls.del("jb-apikey"); ls.del("jb-binid"); ls.del("jb-cache"); setApiKey(""); setBinId(""); }} style={{ padding: "11px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", fontSize: 14, cursor: "pointer", color: "#666" }}>Verbindung trennen</button>}
          </div>
        </div>
      )}

      {view === "app" && (
        <div style={{ flex: 1, padding: "16px", paddingBottom: "calc(16px + env(safe-area-inset-bottom,0px))" }}>
          {!list ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 16 }}>
              <span style={{ fontSize: 64 }}>🚴</span>
              <p style={{ margin: 0, fontSize: 16, color: "#888" }}>Noch keine Liste vorhanden</p>
              <button onClick={() => setShowTemplatePicker(true)} style={{ padding: "14px 28px", borderRadius: 14, border: "none", background: "#1a1a1a", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>+ Erste Liste erstellen</button>
            </div>
          ) : tab === "pack" ? (
            <>
              <div style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 14, color: "#666" }}>{checked} von {total} gepackt</span>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: pct === 100 ? "#3B6D11" : "#111" }}>{pct}%</span>
                    <button onClick={resetChecked} style={{ fontSize: 13, padding: "5px 12px", borderRadius: 8, border: "1px solid #e0e0e0", background: "#f5f5f5", cursor: "pointer", color: "#666" }}>Reset</button>
                  </div>
                </div>
                <div style={{ height: 8, background: "#eee", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: pct + "%", background: pct === 100 ? "#3B6D11" : "#1a1a1a", borderRadius: 99, transition: "width 0.3s" }} />
                </div>
              </div>

              {/* Categories — draggable */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {list.categories.map((cat) => {
                  const cc = cat.items.filter(i => i.checked).length;
                  const cp = cat.items.length > 0 ? Math.round((cc / cat.items.length) * 100) : 0;
                  const isDraggingThis = catDrag.dragId === cat.id;
                  const isOver = catDrag.overId === cat.id && catDrag.dragId !== cat.id;
                  const itemDrag = itemDragStates[cat.id];

                  return (
                    <div
                      key={cat.id}
                      data-sortid={cat.id}
                      {...catDrag.dragProps(cat.id)}
                      style={{ background: "#fff", borderRadius: 16, overflow: "hidden", opacity: isDraggingThis ? 0.45 : 1, border: isOver ? "2px solid #1a1a1a" : "2px solid transparent", transition: "opacity 0.15s, border 0.15s" }}
                    >
                      {/* Category header */}
                      <div style={{ padding: "12px 12px 12px 16px", background: "#f9f9f9", borderBottom: "0.5px solid #efefef", display: "flex", alignItems: "center", gap: 8 }}>
                        {/* Drag handle for category */}
                        <div
                          {...catDrag.handleProps(cat.id)}
                          data-sortid={cat.id}
                          style={{ fontSize: 20, color: "#ccc", cursor: "grab", touchAction: "none", userSelect: "none", padding: "0 4px" }}
                        >⠿</div>
                        <span style={{ fontSize: 20 }}>{cat.icon}</span>
                        <span style={{ fontWeight: 600, fontSize: 16, flex: 1 }}>{cat.name}</span>
                        <span style={{ fontSize: 13, color: cp === 100 ? "#3B6D11" : "#bbb" }}>{cc}/{cat.items.length}</span>
                        <div style={{ width: 36, height: 5, background: "#e5e5e5", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: cp + "%", background: cp === 100 ? "#3B6D11" : "#888", borderRadius: 99, transition: "width 0.3s" }} />
                        </div>
                        <button onClick={() => deleteCategory(cat.id)} style={{ fontSize: 20, border: "none", background: "none", cursor: "pointer", color: "#ddd", padding: "0 0 0 4px" }}>×</button>
                      </div>

                      {/* Items — draggable within category */}
                      {cat.items.map((item) => {
                        const isDraggingItem = itemDrag?.dragId === item.id;
                        const isOverItem = itemDrag?.overId === item.id && itemDrag?.dragId !== item.id;
                        return (
                          <div
                            key={item.id}
                            data-sortid={item.id}
                            {...(itemDrag ? itemDrag.dragProps(item.id) : {})}
                            style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 12px 12px 8px", borderBottom: "0.5px solid #f5f5f5", opacity: isDraggingItem ? 0.4 : item.checked ? 0.4 : 1, borderTop: isOverItem ? "2px solid #1a1a1a" : "2px solid transparent", minHeight: 52, background: "#fff" }}
                          >
                            {/* Item drag handle */}
                            <div
                              {...(itemDrag ? itemDrag.handleProps(item.id) : {})}
                              data-sortid={item.id}
                              style={{ fontSize: 18, color: "#ddd", cursor: "grab", touchAction: "none", userSelect: "none", padding: "0 4px", flexShrink: 0 }}
                            >⠿</div>
                            <div onClick={() => toggleItem(cat.id, item.id)} style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, cursor: "pointer" }}>
                              <C on={item.checked} />
                              <span style={{ fontSize: 16, textDecoration: item.checked ? "line-through" : "none", color: "#111" }}>{item.name}</span>
                            </div>
                            <button onClick={() => deleteItem(cat.id, item.id)} style={{ fontSize: 20, border: "none", background: "none", cursor: "pointer", color: "#ddd", padding: "4px", flexShrink: 0 }}>×</button>
                          </div>
                        );
                      })}

                      <div style={{ display: "flex", gap: 8, padding: "10px 14px" }}>
                        <input value={newItems[cat.id] || ""} onChange={e => setNewItems(p => ({ ...p, [cat.id]: e.target.value }))} onKeyDown={e => { if (e.key === "Enter") addItem(cat.id); }} placeholder="Item hinzufügen…" style={{ flex: 1, fontSize: 15, padding: "10px 12px", border: "1px solid #e8e8e8", borderRadius: 10, background: "#fafafa" }} />
                        <button onClick={() => addItem(cat.id)} style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: "#1a1a1a", color: "#fff", fontSize: 20, cursor: "pointer" }}>+</button>
                      </div>
                    </div>
                  );
                })}

                {showNewCat ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input autoFocus value={newCatName} onChange={e => setNewCatName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addCategory(); if (e.key === "Escape") setShowNewCat(false); }} placeholder="Kategoriename" style={{ flex: 1, fontSize: 16, padding: "12px 14px", border: "1px solid #ddd", borderRadius: 12 }} />
                    <button onClick={addCategory} style={{ padding: "12px 16px", borderRadius: 12, border: "none", background: "#1a1a1a", color: "#fff", fontSize: 15, cursor: "pointer" }}>OK</button>
                    <button onClick={() => setShowNewCat(false)} style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>✕</button>
                  </div>
                ) : (
                  <button onClick={() => setShowNewCat(true)} style={{ padding: "14px", borderRadius: 14, border: "1.5px dashed #ccc", background: "none", fontSize: 15, color: "#aaa", cursor: "pointer", width: "100%" }}>+ Kategorie hinzufügen</button>
                )}
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" }}>
                {["all", "open", ...Object.keys(TAGS)].map(f => {
                  const label = f === "all" ? "Alle" : f === "open" ? "Offen" : TAGS[f].label;
                  const active = todoFilter === f;
                  return <button key={f} onClick={() => setTodoFilter(f)} style={{ flexShrink: 0, fontSize: 13, padding: "7px 14px", borderRadius: 99, background: active ? "#1a1a1a" : "#fff", border: "1px solid " + (active ? "#1a1a1a" : "#ddd"), color: active ? "#fff" : "#666", cursor: "pointer", fontWeight: active ? 600 : 400 }}>{label}</button>;
                })}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filtered.map(todo => {
                  const tc = TAGS[todo.tag] || TAGS.sonstiges;
                  return (
                    <div key={todo.id} onClick={() => toggleTodo(todo.id)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "#fff", borderRadius: 14, opacity: todo.done ? 0.45 : 1, cursor: "pointer", minHeight: 56 }}>
                      <C on={todo.done} round />
                      <span style={{ flex: 1, fontSize: 16, textDecoration: todo.done ? "line-through" : "none" }}>{todo.text}</span>
                      <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 99, background: tc.bg, color: tc.color, flexShrink: 0, fontWeight: 600 }}>{tc.label}</span>
                      <button onClick={(e) => { e.stopPropagation(); deleteTodo(todo.id); }} style={{ fontSize: 20, border: "none", background: "none", cursor: "pointer", color: "#ddd", padding: "4px" }}>×</button>
                    </div>
                  );
                })}
                {filtered.length === 0 && <div style={{ textAlign: "center", padding: "3rem", color: "#ccc", fontSize: 15 }}>✓ Keine Aufgaben hier</div>}
                {todoDone > 0 && <button onClick={clearDone} style={{ padding: "11px", borderRadius: 12, border: "1px solid #e0e0e0", background: "#fff", fontSize: 14, cursor: "pointer", color: "#888" }}>🗑 Erledigte löschen ({todoDone})</button>}
                {showTodoInput ? (
                  <div style={{ background: "#fff", borderRadius: 16, padding: "16px" }}>
                    <input autoFocus value={newTodoText} onChange={e => setNewTodoText(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addTodo(); if (e.key === "Escape") setShowTodoInput(false); }} placeholder="Aufgabe eingeben…" style={{ width: "100%", fontSize: 16, padding: "12px 14px", border: "1px solid #e0e0e0", borderRadius: 10, boxSizing: "border-box", marginBottom: 12 }} />
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                      {Object.entries(TAGS).map(([k, v]) => (
                        <button key={k} onClick={() => setNewTodoTag(k)} style={{ fontSize: 13, padding: "6px 12px", borderRadius: 99, cursor: "pointer", background: newTodoTag === k ? v.bg : "transparent", border: newTodoTag === k ? "1.5px solid " + v.color : "1px solid #e0e0e0", color: newTodoTag === k ? v.color : "#888", fontWeight: newTodoTag === k ? 600 : 400 }}>{v.label}</button>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={addTodo} style={{ flex: 1, padding: "13px", borderRadius: 10, border: "none", background: "#1a1a1a", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Hinzufügen</button>
                      <button onClick={() => setShowTodoInput(false)} style={{ padding: "13px 16px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>✕</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowTodoInput(true)} style={{ padding: "14px", borderRadius: 14, border: "1.5px dashed #ccc", background: "none", fontSize: 15, color: "#aaa", cursor: "pointer", width: "100%" }}>+ Aufgabe hinzufügen</button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
