import { useState, useEffect, useRef } from "react";

const SEED_LIST = {
  id: "tour-de-paris", name: "Tour de Paris",
  categories: [
    { id: "radbekleidung", name: "Radbekleidung", icon: "🚴", items: [
      "2x Sponsoren Trikot","2x Bib","1x Notfall Bib (Schwarz)","1x Windweste",
      "Armlinge","Beinlinge","Handschuhe","Caps/Stirnband","Buff","Helm",
      "Regenjacke","Regenhose","Fahrradschuhe","Regenüberschuhe",
      "Radbrillen (Helles/Dunkles Visier)","Socken",
    ]},
    { id: "freizeitkleidung", name: "Freizeitkleidung", icon: "👔", items: [
      "kurze Sporthose","2x kurze Hosen","3-4 T-Shirts","1x lange Stoffhose",
      "Socken","Boxershorts","Schuhe/Sneaker","Badelatschen",
      "1x Handtuch groß","1x Handtuch klein",
    ]},
    { id: "elektronik", name: "Elektronik & Navigation", icon: "📱", items: [
      "Radcomputer","Rücklicht","Powerbank","Smartphone","Ladekabel(s)","Kopfhörer",
    ]},
    { id: "rad", name: "Rad & Werkzeug", icon: "🔧", items: [
      "Multitool","Flickzeug-Set","Ersatzschlauch x2","Ersatzmantel 1x",
      "Ersatzcleats 1x","Reifenheber x2","Minipumpe","CO2-Patronen",
      "Kettenschloss x2","Kettenwachs",
    ]},
    { id: "nutrition", name: "Verpflegung", icon: "⚡", items: [
      "Energiegels","Energieriegel","Elektrolyttabletten",
      "Trinkflaschen x2","Isotonik-Pulver","Eiweißpulver",
    ]},
    { id: "hygiene", name: "Hygiene & Erste Hilfe", icon: "🩹", items: [
      "Verbandszeug","Schmerzmittel","Persönliche Medikamente",
      "Sonnencreme LSF 50","Lippenpflege","Zahnbürste & Paste",
      "Mikrofaser-Handtuch","Deo","Haarshampoo & Duschgel","Bodylotion",
    ]},
    { id: "dokumente", name: "Dokumente & Sonstiges", icon: "🪪", items: [
      "Personalausweis","Kreditkarte","Bargeld (EUR)",
      "Krankenversicherungskarte","Rynkeby Notfallkarte",
      "Versicherungskarte (Ausland)","Impfpass",
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
  { id: "tourparis", name: "Tour de Paris", icon: "🗼", color: "#185FA5", desc: "Star Ride – deine Vorlage", categories: SEED_LIST.categories, todos: SEED_LIST.todos },
  { id: "bikepacking", name: "Bikepacking", icon: "🚴", color: "#1a1a1a", desc: "Mehrtägige Radreise",
    categories: [
      { id: "bekleidung", name: "Radbekleidung", icon: "🚴", items: ["Trikot","Radhose (Bib)","Windjacke","Regenjacke","Helm","Handschuhe","Radsocken","Fahrradschuhe","Sonnenbrille","Basisschicht Langarm"] },
      { id: "rad", name: "Rad & Werkzeug", icon: "🔧", items: ["Multitool","Flickzeug-Set","Ersatzschlauch x2","Reifenheber x2","Minipumpe","CO2-Patronen","Kettenschloss x2","Fahrradschloss","Kettenöl"] },
      { id: "elektronik", name: "Elektronik", icon: "📱", items: ["Garmin Edge 1040","Ladekabel(s)","Powerbank","Smartphone","Garmin Varia Radar","Kopfhörer"] },
      { id: "nutrition", name: "Verpflegung", icon: "⚡", items: ["Energiegels","Energieriegel","Elektrolyttabletten","Trinkflaschen x2","Isotonik-Pulver"] },
      { id: "unterkunft", name: "Übernachtung", icon: "⛺", items: ["Zelt / Biwak","Schlafsack","Isomatte","Stirnlampe + Batterien"] },
      { id: "hygiene", name: "Hygiene & Erste Hilfe", icon: "🩹", items: ["Verbandszeug","Schmerzmittel","Sonnencreme LSF 50","Lippenpflege","Zahnbürste & Paste","Chamois Creme","Mikrofaser-Handtuch"] },
      { id: "dokumente", name: "Dokumente", icon: "🪪", items: ["Personalausweis","Kreditkarte","Bargeld (EUR)","Krankenversicherungskarte"] },
    ],
    todos: [{ text: "Medikamente besorgen", tag: "besorgung" },{ text: "Fehlende Ausrüstung bestellen", tag: "bestellen" },{ text: "Rad zur Inspektion", tag: "rad" }]
  },
  { id: "sommerurlaub", name: "Sommerurlaub", icon: "🌞", color: "#854F0B", desc: "Strandurlaub & Reisen",
    categories: [
      { id: "bekleidung", name: "Bekleidung", icon: "👔", items: ["T-Shirts x5","Shorts x3","Badehose / Bikini x2","Abendkleidung","Unterwäsche x7","Socken x5","Sandalen","Sneaker","Sonnenbrille","Sonnenhut"] },
      { id: "strand", name: "Strand & Pool", icon: "🏖", items: ["Sonnencreme LSF 50","After-Sun-Lotion","Strandtuch","Schnorchel-Set","Flip Flops"] },
      { id: "elektronik", name: "Elektronik", icon: "📱", items: ["Smartphone","Ladekabel(s)","Powerbank","Kamera","Reisestecker-Adapter","Kopfhörer"] },
      { id: "hygiene", name: "Hygiene", icon: "🧴", items: ["Zahnbürste & Paste","Deo","Shampoo & Duschgel","Schmerzmittel","Mückenschutz","Verbandsmaterial"] },
      { id: "dokumente", name: "Dokumente", icon: "🪪", items: ["Reisepass","Kreditkarte","Bargeld","Krankenversicherungskarte","Buchungsbestätigungen"] },
    ],
    todos: [{ text: "Flug / Bahn buchen", tag: "bestellen" },{ text: "Hotel buchen", tag: "bestellen" },{ text: "Währung besorgen", tag: "besorgung" }]
  },
  { id: "backpacking", name: "Backpacking", icon: "🎒", color: "#3B6D11", desc: "Mehrtägige Trekking-Tour",
    categories: [
      { id: "bekleidung", name: "Bekleidung", icon: "👔", items: ["Merino T-Shirt x2","Wanderhose","Fleecejacke","Hardshell Jacke","Wandersocken x3","Wanderschuhe","Mütze","Handschuhe","Buff"] },
      { id: "schlafen", name: "Schlafen", icon: "⛺", items: ["Rucksack 60L","Zelt (ultralight)","Schlafsack (-5°C)","Isomatte","Stirnlampe + Batterien"] },
      { id: "kochen", name: "Kochen & Essen", icon: "🍳", items: ["Gaskocher","Gaskartuschen x2","Topf (klein)","Besteck","Feuerzeug","Wasserfilter","Trinkflasche x2"] },
      { id: "navigation", name: "Navigation", icon: "🗺", items: ["Karte (wasserfest)","Kompass","GPS offline","Pfeife","Notfalldecke","Erste-Hilfe-Set"] },
      { id: "hygiene", name: "Hygiene", icon: "🩹", items: ["Sonnencreme LSF 50","Insektenschutz","Zahnbürste & Paste (mini)","Schmerzmittel","Blasenpflaster"] },
      { id: "dokumente", name: "Dokumente", icon: "🪪", items: ["Personalausweis","Notgeld","Krankenversicherungskarte","Notrufnummern"] },
    ],
    todos: [{ text: "Route offline downloaden", tag: "vorbereitung" },{ text: "Gaspatronen besorgen", tag: "besorgung" },{ text: "Notfallkontakt informieren", tag: "vorbereitung" }]
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
const buildCatsFromTemplate = (tpl) => tpl.categories.map(c => ({ id: c.id + "-" + uid(), name: c.name, icon: c.icon, items: c.items.map(name => ({ id: uid(), name, checked: false })) }));
const buildTodosFromTemplate = (tpl) => tpl.todos.map(t => ({ id: uid(), text: t.text, done: false, tag: t.tag }));

const ls = {
  get: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del: (k) => { try { localStorage.removeItem(k); } catch {} },
};

const jsonbin = {
  async getAll(binId, apiKey) { const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, { headers: { "X-Master-Key": apiKey } }); if (!res.ok) throw new Error("Fetch fehlgeschlagen"); return (await res.json()).record || {}; },
  async setAll(binId, apiKey, record) { const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, { method: "PUT", headers: { "Content-Type": "application/json", "X-Master-Key": apiKey }, body: JSON.stringify(record) }); if (!res.ok) throw new Error("Write fehlgeschlagen"); },
  async createBin(apiKey) { const res = await fetch("https://api.jsonbin.io/v3/b", { method: "POST", headers: { "Content-Type": "application/json", "X-Master-Key": apiKey, "X-Bin-Name": "Packliste" }, body: JSON.stringify({}) }); if (!res.ok) throw new Error("Bin erstellen fehlgeschlagen"); return (await res.json()).metadata.id; }
};

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

  // ─── Inline editing state ─────────────────────────────────────────────────
  const [editingCatId, setEditingCatId] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // ─── Drag state ───────────────────────────────────────────────────────────
  const [drag, setDrag] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const touchRef = useRef({ active: false });
  const importFile = useRef(null);
  const cloudEnabled = !!(apiKey && binId);

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
  const getMaps = () => { const prev = cloudEnabled ? (ls.get("jb-cache") || {}) : {}; return { listMap: { ...(prev.lists || ls.get("pack-lists") || {}) }, todoMap: { ...(prev.todos || ls.get("pack-todos") || {}) } }; };
  const persist = async (idx, lm, tm) => {
    if (cloudEnabled) { const r = { index: idx, lists: lm, todos: tm }; ls.set("jb-cache", r); await pushToCloud(r); }
    else { ls.set("pack-index", idx); ls.set("pack-lists", lm); ls.set("pack-todos", tm); }
  };

  useEffect(() => {
    (async () => {
      let idx, listMap, todoMap;
      if (cloudEnabled) {
        const remote = await pullFromCloud();
        if (remote?.index) { idx = remote.index; listMap = remote.lists || {}; todoMap = remote.todos || {}; ls.set("jb-cache", remote); }
        else { const c = ls.get("jb-cache") || {}; idx = c.index; listMap = c.lists || {}; todoMap = c.todos || {}; }
      } else { idx = ls.get("pack-index"); listMap = ls.get("pack-lists") || {}; todoMap = ls.get("pack-todos") || {}; }

      if (!idx || idx.length === 0) {
        const sid = uid();
        const seedCats = buildCatsFromTemplate(SEED_LIST);
        const seedTodos = buildTodosFromTemplate(SEED_LIST);
        const seedDoc = { id: sid, name: SEED_LIST.name, categories: seedCats };
        idx = [{ id: sid, name: SEED_LIST.name }];
        listMap = { [sid]: seedDoc };
        todoMap = { [sid]: seedTodos };
        await persist(idx, listMap, todoMap);
      }

      setLists(idx);
      const fid = idx[0].id;
      if (listMap[fid]) { setActiveId(fid); setList(listMap[fid]); }
      setTodos(todoMap[fid] || []);
    })();
  }, []);

  const selectList = (id) => { const { listMap, todoMap } = getMaps(); if (listMap[id]) { setActiveId(id); setList(listMap[id]); } setTodos(todoMap[id] || []); setDrawer(false); };
  const createList = async () => {
    if (!pickedTemplate || !newListName.trim()) return;
    const name = newListName.trim(); const id = uid();
    const d = { id, name, categories: buildCatsFromTemplate(pickedTemplate) }; const t = buildTodosFromTemplate(pickedTemplate);
    const idx = [...lists, { id, name }]; const { listMap, todoMap } = getMaps();
    listMap[id] = d; todoMap[id] = t;
    setLists(idx); setActiveId(id); setList(d); setTodos(t);
    await persist(idx, listMap, todoMap);
    setShowTemplatePicker(false); setPickedTemplate(null); setNewListName(""); setDrawer(false);
  };
  const deleteList = async (id) => {
    const idx = lists.filter(l => l.id !== id); const { listMap, todoMap } = getMaps();
    delete listMap[id]; delete todoMap[id]; setLists(idx); await persist(idx, listMap, todoMap);
    if (activeId === id) { if (idx.length > 0) selectList(idx[0].id); else { setActiveId(null); setList(null); setTodos([]); } }
  };
  const saveCurrentAsTemplate = () => {
    const name = templateName.trim(); if (!name || !list) return;
    const tpl = { id: uid(), name, icon: "⭐", color: "#5F5E5A", desc: "Eigene Vorlage", categories: list.categories.map(c => ({ id: c.id, name: c.name, icon: c.icon, items: c.items.map(i => i.name) })), todos: todos.map(t => ({ text: t.text, tag: t.tag })) };
    const updated = [...customTemplates, tpl]; setCustomTemplates(updated); ls.set("custom-templates", updated);
    setShowSaveTemplate(false); setTemplateName("");
  };

  const updateList = async (u) => { setList(u); const { listMap, todoMap } = getMaps(); listMap[activeId] = u; await persist(lists, listMap, todoMap); };
  const updateTodos = async (u) => { setTodos(u); const { listMap, todoMap } = getMaps(); todoMap[activeId] = u; await persist(lists, listMap, todoMap); };

  // ─── Inline editing ───────────────────────────────────────────────────────
  const startEditCat = (cat) => { setEditingCatId(cat.id); setEditingItemId(null); setEditValue(cat.name); };
  const commitEditCat = (catId) => {
    const name = editValue.trim(); if (!name) { setEditingCatId(null); return; }
    updateList({ ...list, categories: list.categories.map(c => c.id !== catId ? c : { ...c, name }) });
    setEditingCatId(null);
  };
  const startEditItem = (catId, item) => { setEditingItemId(item.id); setEditingCatId(null); setEditValue(item.name); };
  const commitEditItem = (catId, itemId) => {
    const name = editValue.trim(); if (!name) { setEditingItemId(null); return; }
    updateList({ ...list, categories: list.categories.map(c => c.id !== catId ? c : { ...c, items: c.items.map(i => i.id !== itemId ? i : { ...i, name }) }) });
    setEditingItemId(null);
  };

  // ─── List mutations ───────────────────────────────────────────────────────
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

  // ─── Drag & Drop ──────────────────────────────────────────────────────────
  const reorderCats = (fromId, toId) => {
    if (!list || fromId === toId) return;
    const cats = [...list.categories];
    const fi = cats.findIndex(c => c.id === fromId); const ti = cats.findIndex(c => c.id === toId);
    if (fi < 0 || ti < 0) return;
    const [moved] = cats.splice(fi, 1); cats.splice(ti, 0, moved);
    updateList({ ...list, categories: cats });
  };
  const reorderItems = (catId, fromId, toId) => {
    if (!list || fromId === toId) return;
    updateList({ ...list, categories: list.categories.map(c => {
      if (c.id !== catId) return c;
      const items = [...c.items];
      const fi = items.findIndex(i => i.id === fromId); const ti = items.findIndex(i => i.id === toId);
      if (fi < 0 || ti < 0) return c;
      const [moved] = items.splice(fi, 1); items.splice(ti, 0, moved);
      return { ...c, items };
    })});
  };
  const onDragStart = (e, type, id, catId) => { e.stopPropagation(); setDrag({ type, id, catId }); e.dataTransfer.effectAllowed = "move"; };
  const onDragOver = (e, type, id, catId) => { e.preventDefault(); e.stopPropagation(); setDragOver({ type, id, catId }); };
  const onDrop = (e, type, id, catId) => { e.preventDefault(); e.stopPropagation(); if (!drag) return; if (type === "cat" && drag.type === "cat") reorderCats(drag.id, id); if (type === "item" && drag.type === "item") reorderItems(catId, drag.id, id); setDrag(null); setDragOver(null); };
  const onDragEnd = () => { setDrag(null); setDragOver(null); };
  const onTouchStartHandle = (e, type, id, catId) => { e.stopPropagation(); touchRef.current = { active: true, type, id, catId }; setDrag({ type, id, catId }); };
  const onTouchMove = (e) => { if (!touchRef.current.active) return; e.preventDefault(); const touch = e.touches[0]; const el = document.elementFromPoint(touch.clientX, touch.clientY); const target = el?.closest("[data-sortid]"); if (target) setDragOver({ type: target.dataset.sorttype, id: target.dataset.sortid, catId: target.dataset.sortcat }); };
  const onTouchEnd = () => { if (touchRef.current.active && drag && dragOver && drag.id !== dragOver.id) { if (drag.type === "cat" && dragOver.type === "cat") reorderCats(drag.id, dragOver.id); if (drag.type === "item" && dragOver.type === "item") reorderItems(drag.catId, drag.id, dragOver.id); } touchRef.current.active = false; setDrag(null); setDragOver(null); };

  // ─── Export / Import / Settings ───────────────────────────────────────────
  const exportData = () => {
    const { listMap, todoMap } = getMaps();
    const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), index: lists, lists: listMap, todos: todoMap, customTemplates }, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "packliste-" + new Date().toISOString().slice(0, 10) + ".json"; a.click();
  };
  const exportSingleList = (listId, listName) => {
    const { listMap, todoMap } = getMaps();
    const data = { version: 1, type: "single", exportedAt: new Date().toISOString(), index: [{ id: listId, name: listName }], lists: { [listId]: listMap[listId] }, todos: { [listId]: todoMap[listId] || [] } };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = listName.replace(/\s+/g, "-").toLowerCase() + "-" + new Date().toISOString().slice(0, 10) + ".json"; a.click();
  };

  const importData = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const data = JSON.parse(ev.target.result); if (!data.index || !data.lists) { alert("Ungültige Datei"); return; }
        const { listMap, todoMap } = getMaps();
        if (data.type === "single") {
          // Einzelne Liste mergen — bestehende Listen bleiben erhalten
          const imp = data.index[0];
          const exists = lists.find(l => l.id === imp.id);
          const newIdx = exists ? lists : [...lists, imp];
          const newListMap = { ...listMap, [imp.id]: data.lists[imp.id] };
          const newTodoMap = { ...todoMap, [imp.id]: data.todos?.[imp.id] || [] };
          setLists(newIdx); setActiveId(imp.id); setList(data.lists[imp.id]); setTodos(data.todos?.[imp.id] || []);
          await persist(newIdx, newListMap, newTodoMap);
          alert("Liste "" + imp.name + "" importiert!");
        } else {
          // Kompletter Import
          setLists(data.index); if (data.index.length > 0) { const id = data.index[0].id; setActiveId(id); setList(data.lists[id]); setTodos(data.todos?.[id] || []); }
          if (data.customTemplates) { setCustomTemplates(data.customTemplates); ls.set("custom-templates", data.customTemplates); }
          await persist(data.index, data.lists, data.todos || {}); alert("Import erfolgreich!");
        }
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

  // ─── Computed ─────────────────────────────────────────────────────────────
  const total = list ? list.categories.reduce((s, c) => s + c.items.length, 0) : 0;
  const checked = list ? list.categories.reduce((s, c) => s + c.items.filter(i => i.checked).length, 0) : 0;
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
  const todoOpen = todos.filter(t => !t.done).length;
  const todoDone = todos.filter(t => t.done).length;
  const filtered = todoFilter === "all" ? todos : todoFilter === "open" ? todos.filter(t => !t.done) : todos.filter(t => t.tag === todoFilter);
  const allTemplates = [...BUILTIN_TEMPLATES, ...customTemplates];
  const syncColor = { idle: cloudEnabled ? "#3B6D11" : "#aaa", syncing: "#185FA5", ok: "#3B6D11", error: "#993C1D" }[syncStatus];
  const syncDot = { idle: cloudEnabled ? "☁" : "💾", syncing: "↑", ok: "✓", error: "✗" }[syncStatus];

  const Checkbox = ({ on, round }) => (
    <div style={{ width: 24, height: 24, borderRadius: round ? "50%" : 6, flexShrink: 0, border: on ? "none" : "2px solid #d0d0d0", background: on ? "#3B6D11" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
      {on && <span style={{ fontSize: 14, color: "#fff" }}>✓</span>}
    </div>
  );

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#f2f2f7", minHeight: "100svh", display: "flex", flexDirection: "column", maxWidth: 600, margin: "0 auto" }}>

      {/* Template Picker */}
      {showTemplatePicker && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "flex-end" }}>
          <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", width: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column", paddingBottom: "env(safe-area-inset-bottom,0px)" }}>
            <div style={{ padding: "16px 20px 12px", borderBottom: "0.5px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700, fontSize: 18 }}>Neue Liste</span>
              <button onClick={() => { setShowTemplatePicker(false); setPickedTemplate(null); setNewListName(""); }} style={{ fontSize: 24, border: "none", background: "none", cursor: "pointer", color: "#999" }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
              {!pickedTemplate ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
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
      )}

      {/* Save Template Modal */}
      {showSaveTemplate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "flex-end" }}>
          <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", width: "100%", padding: "20px 20px calc(20px + env(safe-area-inset-bottom,0px))" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontWeight: 700, fontSize: 18 }}>Als Vorlage speichern</span>
              <button onClick={() => setShowSaveTemplate(false)} style={{ fontSize: 24, border: "none", background: "none", cursor: "pointer", color: "#999" }}>×</button>
            </div>
            <input autoFocus value={templateName} onChange={e => setTemplateName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") saveCurrentAsTemplate(); }} placeholder="Vorlagenname" style={{ width: "100%", fontSize: 16, padding: "13px 14px", border: "1.5px solid #ddd", borderRadius: 12, boxSizing: "border-box", marginBottom: 14 }} />
            <button onClick={saveCurrentAsTemplate} disabled={!templateName.trim()} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: templateName.trim() ? "#1a1a1a" : "#e0e0e0", color: templateName.trim() ? "#fff" : "#aaa", fontSize: 16, fontWeight: 600, cursor: templateName.trim() ? "pointer" : "default" }}>Speichern</button>
          </div>
        </div>
      )}

      {/* Drawer */}
      {drawer && <div onClick={() => setDrawer(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 }} />}
      <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 290, background: "#fff", zIndex: 50, transform: drawer ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.25s ease", display: "flex", flexDirection: "column", paddingTop: "env(safe-area-inset-top,0px)" }}>
        <div style={{ padding: "16px 20px", borderBottom: "0.5px solid #e5e5e5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>🚴 Listen</span>
          <button onClick={() => setDrawer(false)} style={{ fontSize: 24, border: "none", background: "none", cursor: "pointer", color: "#999" }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
          {lists.map(l => (
            <div key={l.id} style={{ display: "flex", alignItems: "center", padding: "10px 12px", borderRadius: 12, background: activeId === l.id ? "#f0f0f0" : "transparent", marginBottom: 4, gap: 6 }}>
              <span onClick={() => selectList(l.id)} style={{ flex: 1, fontSize: 16, fontWeight: activeId === l.id ? 600 : 400, cursor: "pointer" }}>{l.name}</span>
              <button onClick={() => exportSingleList(l.id, l.name)} style={{ fontSize: 13, color: "#555", cursor: "pointer", padding: "5px 10px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", flexShrink: 0 }}>⬇ Export</button>
              <span onClick={() => deleteList(l.id)} style={{ fontSize: 22, color: "#ccc", padding: "0 4px", cursor: "pointer" }}>×</span>
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

      {/* Settings */}
      {view === "settings" && (
        <div style={{ background: "#fff", margin: 16, borderRadius: 16, padding: 20 }}>
          <p style={{ fontWeight: 700, fontSize: 17, margin: "0 0 4px" }}>☁ JSONBin Sync</p>
          <p style={{ fontSize: 13, color: "#888", margin: "0 0 14px", lineHeight: 1.5 }}><a href="https://jsonbin.io" target="_blank" rel="noreferrer" style={{ color: "#185FA5" }}>jsonbin.io</a> → API Keys → Master Key.</p>
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

      {/* Main content */}
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

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {list.categories.map((cat) => {
                  const cc = cat.items.filter(i => i.checked).length;
                  const cp = cat.items.length > 0 ? Math.round((cc / cat.items.length) * 100) : 0;
                  const isCatDragging = drag?.type === "cat" && drag?.id === cat.id;
                  const isCatOver = dragOver?.type === "cat" && dragOver?.id === cat.id && drag?.id !== cat.id;
                  return (
                    <div key={cat.id} data-sorttype="cat" data-sortid={cat.id}
                      onDragOver={(e) => onDragOver(e, "cat", cat.id, null)}
                      onDrop={(e) => onDrop(e, "cat", cat.id, null)}
                      onDragEnd={onDragEnd}
                      style={{ background: "#fff", borderRadius: 16, overflow: "hidden", opacity: isCatDragging ? 0.4 : 1, border: isCatOver ? "2.5px solid #1a1a1a" : "2.5px solid transparent" }}>
                      {/* Category header */}
                      <div style={{ padding: "11px 12px 11px 8px", background: "#f9f9f9", borderBottom: "0.5px solid #efefef", display: "flex", alignItems: "center", gap: 8 }}>
                        <div draggable onDragStart={(e) => onDragStart(e, "cat", cat.id, null)}
                          onTouchStart={(e) => onTouchStartHandle(e, "cat", cat.id, null)}
                          onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
                          data-sorttype="cat" data-sortid={cat.id}
                          style={{ fontSize: 20, color: "#ccc", cursor: "grab", touchAction: "none", userSelect: "none", padding: "2px 6px", flexShrink: 0 }}>⠿</div>
                        <span style={{ fontSize: 20 }}>{cat.icon}</span>
                        {/* Editable category name */}
                        {editingCatId === cat.id ? (
                          <input autoFocus value={editValue} onChange={e => setEditValue(e.target.value)}
                            onBlur={() => commitEditCat(cat.id)}
                            onKeyDown={e => { if (e.key === "Enter") commitEditCat(cat.id); if (e.key === "Escape") setEditingCatId(null); }}
                            style={{ flex: 1, fontSize: 16, fontWeight: 600, border: "none", borderBottom: "2px solid #1a1a1a", background: "transparent", outline: "none", padding: "2px 0" }} />
                        ) : (
                          <span onDoubleClick={() => startEditCat(cat)} style={{ fontWeight: 600, fontSize: 16, flex: 1, cursor: "text" }} title="Doppeltippen zum Bearbeiten">{cat.name}</span>
                        )}
                        <span style={{ fontSize: 13, color: cp === 100 ? "#3B6D11" : "#bbb" }}>{cc}/{cat.items.length}</span>
                        <div style={{ width: 36, height: 5, background: "#e5e5e5", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: cp + "%", background: cp === 100 ? "#3B6D11" : "#888", borderRadius: 99 }} />
                        </div>
                        <button onClick={() => deleteCategory(cat.id)} style={{ fontSize: 20, border: "none", background: "none", cursor: "pointer", color: "#ddd", padding: "0 0 0 4px" }}>×</button>
                      </div>

                      {/* Items */}
                      {cat.items.map((item) => {
                        const isItemDragging = drag?.type === "item" && drag?.id === item.id;
                        const isItemOver = dragOver?.type === "item" && dragOver?.id === item.id && drag?.id !== item.id;
                        return (
                          <div key={item.id} data-sorttype="item" data-sortid={item.id} data-sortcat={cat.id}
                            onDragOver={(e) => onDragOver(e, "item", item.id, cat.id)}
                            onDrop={(e) => onDrop(e, "item", item.id, cat.id)}
                            onDragEnd={onDragEnd}
                            style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 12px 12px 6px", borderBottom: "0.5px solid #f5f5f5", opacity: isItemDragging ? 0.35 : item.checked ? 0.4 : 1, borderTop: isItemOver ? "2px solid #1a1a1a" : "2px solid transparent", minHeight: 52, background: "#fff" }}>
                            <div draggable onDragStart={(e) => onDragStart(e, "item", item.id, cat.id)}
                              onTouchStart={(e) => onTouchStartHandle(e, "item", item.id, cat.id)}
                              onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
                              data-sorttype="item" data-sortid={item.id} data-sortcat={cat.id}
                              style={{ fontSize: 18, color: "#ddd", cursor: "grab", touchAction: "none", userSelect: "none", padding: "2px 6px", flexShrink: 0 }}>⠿</div>
                            <div onClick={() => { if (editingItemId !== item.id) toggleItem(cat.id, item.id); }} style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, cursor: "pointer" }}>
                              <Checkbox on={item.checked} />
                              {/* Editable item name */}
                              {editingItemId === item.id ? (
                                <input autoFocus value={editValue} onChange={e => setEditValue(e.target.value)}
                                  onBlur={() => commitEditItem(cat.id, item.id)}
                                  onKeyDown={e => { if (e.key === "Enter") commitEditItem(cat.id, item.id); if (e.key === "Escape") setEditingItemId(null); }}
                                  onClick={e => e.stopPropagation()}
                                  style={{ flex: 1, fontSize: 16, border: "none", borderBottom: "2px solid #1a1a1a", background: "transparent", outline: "none", padding: "2px 0" }} />
                              ) : (
                                <span onDoubleClick={(e) => { e.stopPropagation(); startEditItem(cat.id, item); }}
                                  style={{ fontSize: 16, textDecoration: item.checked ? "line-through" : "none" }}
                                  title="Doppeltippen zum Bearbeiten">{item.name}</span>
                              )}
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
                    <button onClick={addCategory} style={{ padding: "12px 16px", borderRadius: 12, border: "none", background: "#1a1a1a", color: "#fff", cursor: "pointer" }}>OK</button>
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
                      <Checkbox on={todo.done} round />
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
