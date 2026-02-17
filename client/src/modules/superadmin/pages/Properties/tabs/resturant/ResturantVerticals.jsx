import React, { useState } from "react";
import {
  Plus, Pencil, Trash2, Save, X, GripVertical,
  Image as ImageIcon, ShoppingBag, Eye, EyeOff,
  Quote, ChevronUp, ChevronDown,
} from "lucide-react";

// ── Static seed data (replace with API calls) ─────────────────────────────────

const INITIAL_HEADER = {
  badgeLabel: "Verticals",
  headlineLine1: "One Location.",
  headlineLine2: "Diverse Verticals.",
  description:
    "Discover a curated collection of culinary spaces designed for every mood and occasion. From intimate fine dining to casual gourmet treats.",
  diningPolicy: {
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=80&h=80&fit=crop",
    policyType: "DINING POLICY",
    policyName: "BYOB Support",
    quote:
      "Bring your favorite spirits; we provide the perfect ambiance and premium glassware.",
  },
};

const CARD_COLORS = [
  { label: "Peach",  value: "#FEF3ED" },
  { label: "Sky",    value: "#EDF4FE" },
  { label: "Rose",   value: "#FEEDED" },
  { label: "Mint",   value: "#EDFEF3" },
  { label: "Lemon",  value: "#FEFBED" },
  { label: "Lilac",  value: "#F3EDFE" },
];

const INITIAL_VERTICALS = [
  {
    id: 1, name: "Italian", description:
      "Authentic Mediterranean soul in a sophisticated setting. Experience the rich heritage of Tuscany through our hand-picked ingredients.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop",
    exploreLink: "/verticals/italian", showOrderButton: false,
    cardColor: "#FEF3ED", displayOrder: 1, isActive: true,
  },
  {
    id: 2, name: "Luxury Lounge", description:
      "Premium comfort tailored for memorable family gatherings. A refined space where elegance meets contemporary dining.",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200&h=200&fit=crop",
    exploreLink: "/verticals/luxury-lounge", showOrderButton: false,
    cardColor: "#EDF4FE", displayOrder: 2, isActive: true,
  },
  // {
  //   id: 3, name: "Spicy Darbar", description:
  //     "Bold, traditional Indian flavors with a fiery spirit. Royal curries and tandoori masterpieces prepared with authentic spices.",
  //   image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop",
  //   exploreLink: "/verticals/spicy-darbar", showOrderButton: false,
  //   cardColor: "#FEEDED", displayOrder: 3, isActive: true,
  // },
  // {
  //   id: 4, name: "Takeaway Treats", description:
  //     "Gourmet quality on the go for your convenience. Perfectly packaged meals that bring the restaurant experience to your home.",
  //   image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop",
  //   exploreLink: "/verticals/takeaway", showOrderButton: true,
  //   cardColor: "#EDFEF3", displayOrder: 4, isActive: true,
  // },
];

// ── Shared input style ────────────────────────────────────────────────────────
const inp =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10 outline-none bg-white transition-all";

// ── Section wrapper ───────────────────────────────────────────────────────────
const Section = ({ title, children }) => (
  <div className="border border-gray-100 rounded-xl overflow-hidden">
    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">{title}</h3>
    </div>
    <div className="p-4 space-y-3">{children}</div>
  </div>
);

const Field = ({ label, children, half }) => (
  <div className={half ? "flex-1" : "w-full"}>
    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
      {label}
    </label>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// HEADER EDITOR
// ─────────────────────────────────────────────────────────────────────────────
function HeaderEditor({ header, onSave }) {
  const [form, setForm] = useState(header);
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));
  const setPolicy = (key, val) =>
    setForm(p => ({ ...p, diningPolicy: { ...p.diningPolicy, [key]: val } }));

  const handleSave = async () => {
    setSaving(true);
    // TODO: await updateVerticalsHeader(form)
    await new Promise(r => setTimeout(r, 600));
    onSave(form);
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <Section title="Hero Text">
        <div className="flex gap-3">
          <Field label="Badge Label" half>
            <input className={inp} value={form.badgeLabel}
              onChange={e => set("badgeLabel", e.target.value)} placeholder="e.g. Verticals" />
          </Field>
          <Field label="Headline Line 1" half>
            <input className={inp} value={form.headlineLine1}
              onChange={e => set("headlineLine1", e.target.value)} placeholder="One Location." />
          </Field>
        </div>
        <Field label="Headline Line 2 (italic / accent color)">
          <input className={inp} value={form.headlineLine2}
            onChange={e => set("headlineLine2", e.target.value)} placeholder="Diverse Verticals." />
        </Field>
        <Field label="Description">
          <textarea className={inp} rows={3} value={form.description}
            onChange={e => set("description", e.target.value)} />
        </Field>
      </Section>

      <Section title="Dining Policy Card">
        <div className="flex gap-3">
          <Field label="Policy Type (label)" half>
            <input className={inp} value={form.diningPolicy.policyType}
              onChange={e => setPolicy("policyType", e.target.value)} placeholder="DINING POLICY" />
          </Field>
          <Field label="Policy Name" half>
            <input className={inp} value={form.diningPolicy.policyName}
              onChange={e => setPolicy("policyName", e.target.value)} placeholder="BYOB Support" />
          </Field>
        </div>
        <Field label="Quote / Description">
          <textarea className={inp} rows={2} value={form.diningPolicy.quote}
            onChange={e => setPolicy("quote", e.target.value)} />
        </Field>
        <Field label="Policy Image">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all text-sm text-gray-500 font-medium">
              <ImageIcon size={14} />
              {form.diningPolicy.image ? "Change Image" : "Upload Image"}
              <input type="file" accept="image/*" className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  // TODO: upload file to server, use returned URL
                  setPolicy("image", URL.createObjectURL(file));
                  setPolicy("imageFile", file);
                }} />
            </label>
            {form.diningPolicy.image
              ? <img src={form.diningPolicy.image} alt=""
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow shrink-0" />
              : <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border shrink-0">
                  <ImageIcon size={16} className="text-gray-300" />
                </div>
            }
            {form.diningPolicy.image && (
              <button type="button"
                onClick={() => { setPolicy("image", ""); setPolicy("imageFile", null); }}
                className="text-red-400 hover:text-red-600 transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </Field>
      </Section>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-bold bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-60">
          {saving ? "Saving..." : <><Save size={14} /> Save Header</>}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VERTICAL CARD FORM (add / edit)
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_VERTICAL = {
  id: null, name: "", description: "", image: "", imageFile: null,
  showOrderButton: false,
  cardColor: "#FEF3ED", displayOrder: 1, isActive: true,
};

function VerticalForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_VERTICAL);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="border border-blue-200 rounded-xl bg-blue-50/30 p-4 space-y-4">
      <div className="flex gap-3">
        <Field label="Vertical Name" half>
          <input className={inp} value={form.name}
            onChange={e => set("name", e.target.value)} placeholder="e.g. Italian" />
        </Field>
        <Field label="Display Order" half>
          <input type="number" className={inp} value={form.displayOrder} min={1}
            onChange={e => set("displayOrder", Number(e.target.value))} />
        </Field>
      </div>

      <Field label="Description">
        <textarea className={inp} rows={3} value={form.description}
          onChange={e => set("description", e.target.value)}
          placeholder="Short tagline shown on the card..." />
      </Field>

      <Field label="Image">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all text-sm text-gray-500 font-medium">
            <ImageIcon size={14} />
            {form.image ? "Change Image" : "Upload Image"}
            <input type="file" accept="image/*" className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (!file) return;
                // TODO: upload file to server, use returned URL
                // For now preview locally
                set("image", URL.createObjectURL(file));
                set("imageFile", file);
              }} />
          </label>
          {form.image
            ? <img src={form.image} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow shrink-0" />
            : <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border shrink-0">
                <ImageIcon size={16} className="text-gray-300" />
              </div>
          }
          {form.image && (
            <button type="button" onClick={() => { set("image", ""); set("imageFile", null); }}
              className="text-red-400 hover:text-red-600 transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
      </Field>

      {/* Card background color picker */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
          Card Background Color
        </label>
        <div className="flex gap-2 flex-wrap">
          {CARD_COLORS.map(c => (
            <button key={c.value} type="button"
              onClick={() => set("cardColor", c.value)}
              title={c.label}
              className={`w-8 h-8 rounded-full border-2 transition-all ${form.cardColor === c.value ? "border-blue-500 scale-110" : "border-gray-200"}`}
              style={{ backgroundColor: c.value }}
            />
          ))}
          {/* Custom hex */}
          <input type="color" value={form.cardColor}
            onChange={e => set("cardColor", e.target.value)}
            className="w-8 h-8 rounded-full border border-gray-200 cursor-pointer p-0 overflow-hidden"
            title="Custom color" />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        {[
          { label: "Show Order Button", key: "showOrderButton" },
          { label: "Active", key: "isActive" },
        ].map(({ label, key }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => set(key, !form[key])}
              className={`relative w-9 h-5 rounded-full transition-colors ${form[key] ? "bg-blue-500" : "bg-gray-300"}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key] ? "translate-x-4" : "translate-x-0.5"}`} />
            </div>
            <span className="text-xs font-semibold text-gray-600">{label}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-2 justify-end pt-1">
        <button onClick={onCancel}
          className="px-4 py-2 rounded-lg border text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all">
          Cancel
        </button>
        <button onClick={() => onSave(form)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all">
          <Save size={13} /> {form.id ? "Update" : "Add Vertical"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VERTICAL ROW (list item)
// ─────────────────────────────────────────────────────────────────────────────
function VerticalRow({ v, onEdit, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-all group">

      {/* color swatch */}
      <div className="w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: v.cardColor }} />

      {/* image */}
      {v.image
        ? <img src={v.image} alt={v.name} className="w-11 h-11 rounded-full object-cover border shrink-0" />
        : <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border">
            <ImageIcon size={14} className="text-gray-300" />
          </div>
      }

      {/* info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-800 truncate">{v.name || "Unnamed"}</span>
          {v.showOrderButton && (
            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-rose-100 text-rose-600 rounded">
              Order btn
            </span>
          )}
          <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${v.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
            {v.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 truncate mt-0.5">{v.description}</p>
      </div>

      {/* order badge */}
      <span className="text-[10px] font-black text-gray-300 shrink-0">#{v.displayOrder}</span>

      {/* actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onMoveUp} disabled={isFirst}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition-all">
          <ChevronUp size={14} />
        </button>
        <button onClick={onMoveDown} disabled={isLast}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition-all">
          <ChevronDown size={14} />
        </button>
        <button onClick={onEdit}
          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-400 transition-all">
          <Pencil size={14} />
        </button>
        <button onClick={onDelete}
          className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-all">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW STRIP (mini replica of website cards)
// ─────────────────────────────────────────────────────────────────────────────
function PreviewStrip({ verticals }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {verticals.filter(v => v.isActive).map(v => (
        <div key={v.id}
          className="shrink-0 w-36 rounded-2xl p-3 flex flex-col items-center gap-2 border border-white/60"
          style={{ backgroundColor: v.cardColor }}>
          {v.image
            ? <img src={v.image} alt={v.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow" />
            : <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white">
                <ImageIcon size={18} className="text-gray-400" />
              </div>
          }
          <p className="text-xs font-semibold text-gray-700 text-center leading-tight">{v.name}</p>
          <div className="flex items-center gap-1 mt-auto">
            <span className="w-5 h-5 rounded-full bg-rose-500/80 flex items-center justify-center">
              <span className="text-white text-[8px]">›</span>
            </span>
            <span className="text-[8px] font-bold uppercase text-gray-500">Explore</span>
            {v.showOrderButton && (
              <span className="text-[8px] font-bold uppercase bg-rose-500 text-white px-1 rounded">Order</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function ResturantVerticals({ propertyData, refreshData }) {
  const [header, setHeader]       = useState(INITIAL_HEADER);
  const [verticals, setVerticals] = useState(INITIAL_VERTICALS);
  const [editingId, setEditingId] = useState(null);   // null = none, "new" = add form
  const [activePanel, setActivePanel] = useState("verticals"); // "header" | "verticals"
  const [showPreview, setShowPreview] = useState(false);

  // ── CRUD helpers ──────────────────────────────────────────────────────────
  const handleSaveVertical = (form) => {
    if (form.id) {
      setVerticals(prev => prev.map(v => v.id === form.id ? form : v));
    } else {
      setVerticals(prev => [...prev, { ...form, id: Date.now() }]);
    }
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this vertical?")) return;
    setVerticals(prev => prev.filter(v => v.id !== id));
  };

  const moveVertical = (id, dir) => {
    setVerticals(prev => {
      const arr = [...prev].sort((a, b) => a.displayOrder - b.displayOrder);
      const idx = arr.findIndex(v => v.id === id);
      const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= arr.length) return prev;
      // Swap display orders
      const tmp = arr[idx].displayOrder;
      arr[idx] = { ...arr[idx], displayOrder: arr[swapIdx].displayOrder };
      arr[swapIdx] = { ...arr[swapIdx], displayOrder: tmp };
      return arr;
    });
  };

  const sorted = [...verticals].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-5">

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-800">Verticals Section</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage the hero header and all dining vertical cards shown on the website
          </p>
        </div>
        <button onClick={() => setShowPreview(p => !p)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all">
          {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

      {/* ── Mini preview strip ──────────────────────────────────────────── */}
      {showPreview && (
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Live Preview — Active Verticals
          </p>
          <PreviewStrip verticals={sorted} />
        </div>
      )}

      {/* ── Tab switcher ────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { key: "header",    label: "Header & Policy" },
          { key: "verticals", label: `Vertical Cards (${verticals.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setActivePanel(t.key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activePanel === t.key
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── HEADER PANEL ────────────────────────────────────────────────── */}
      {activePanel === "header" && (
        <HeaderEditor header={header} onSave={setHeader} />
      )}

      {/* ── VERTICALS PANEL ─────────────────────────────────────────────── */}
      {activePanel === "verticals" && (
        <div className="space-y-3">

          {/* Add button */}
          {editingId !== "new" && (
            <div className="flex justify-end">
              <button onClick={() => setEditingId("new")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all">
                <Plus size={14} /> Add Vertical
              </button>
            </div>
          )}

          {/* New vertical form */}
          {editingId === "new" && (
            <VerticalForm
              initial={{ ...EMPTY_VERTICAL, displayOrder: verticals.length + 1 }}
              onSave={handleSaveVertical}
              onCancel={() => setEditingId(null)}
            />
          )}

          {/* List */}
          <div className="space-y-2">
            {sorted.length === 0 && (
              <div className="py-16 text-center text-gray-400 text-sm border-2 border-dashed rounded-xl">
                No verticals yet — click <strong>Add Vertical</strong> to get started.
              </div>
            )}
            {sorted.map((v, idx) => (
              <React.Fragment key={v.id}>
                {editingId === v.id ? (
                  <VerticalForm
                    initial={v}
                    onSave={handleSaveVertical}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <VerticalRow
                    v={v}
                    isFirst={idx === 0}
                    isLast={idx === sorted.length - 1}
                    onEdit={() => setEditingId(v.id)}
                    onDelete={() => handleDelete(v.id)}
                    onMoveUp={() => moveVertical(v.id, -1)}
                    onMoveDown={() => moveVertical(v.id, 1)}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Footer stats */}
          {verticals.length > 0 && (
            <p className="text-[11px] text-gray-400 text-right">
              {verticals.filter(v => v.isActive).length} active · {verticals.filter(v => !v.isActive).length} inactive
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ResturantVerticals;