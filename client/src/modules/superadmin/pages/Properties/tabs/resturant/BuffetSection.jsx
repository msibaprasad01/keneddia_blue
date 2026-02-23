import React, { useState } from "react";
import {
  Plus, Pencil, Trash2, Save, X,
  Image as ImageIcon, ChevronUp, ChevronDown,
  Eye, EyeOff, IndianRupee,
} from "lucide-react";

const INITIAL_HEADER = {
  headlinePart1: "Buffet",
  headlinePart2: "Selection",
  description: "Explore international delicacies curated for every occasion.",
};

const INITIAL_ITEMS = [
  {
    id: 1,
    name: "Grand Indian Buffet",
    description: "A lavish spread of authentic Indian curries, tandoor, and desserts.",
    price: "700",
    ctaText: "Book Now",
    ctaLink: "/buffet/indian",
    image: "",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 2,
    name: "Continental Spread",
    description: "Freshly curated European flavors with seasonal ingredients.",
    price: "900",
    ctaText: "Reserve",
    ctaLink: "/buffet/continental",
    image: "",
    displayOrder: 2,
    isActive: true,
  },
];

// ── Shared styles ─────────────────────────────────────────────────────────────

const inp =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10 outline-none bg-white transition-all";

const Field = ({ label, children, half }) => (
  <div className={half ? "flex-1 min-w-0" : "w-full"}>
    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
      {label}
    </label>
    {children}
  </div>
);

const Section = ({ title, children }) => (
  <div className="border border-gray-100 rounded-xl overflow-hidden">
    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">{title}</h3>
    </div>
    <div className="p-4 space-y-3">{children}</div>
  </div>
);

// ── Image Upload Button ───────────────────────────────────────────────────────

function ImageUpload({ value, onChange, onClear, size = "md" }) {
  const dim = size === "sm" ? "w-10 h-10" : "w-14 h-14";
  return (
    <div className="flex items-center gap-3">
      <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all text-sm text-gray-500 font-medium shrink-0">
        <ImageIcon size={14} />
        {value ? "Change" : "Upload"}
        <input type="file" accept="image/*" className="hidden"
          onChange={e => {
            const file = e.target.files?.[0];
            if (!file) return;
            // TODO: replace with uploadMedia(fd) call, use returned URL
            onChange(URL.createObjectURL(file), file);
          }} />
      </label>
      {value
        ? <>
            <img src={value} alt="" className={`${dim} rounded-lg object-cover border shadow shrink-0`} />
            <button type="button" onClick={onClear} className="text-red-400 hover:text-red-600 transition-colors">
              <X size={14} />
            </button>
          </>
        : <div className={`${dim} rounded-lg bg-gray-100 flex items-center justify-center border shrink-0`}>
            <ImageIcon size={16} className="text-gray-300" />
          </div>
      }
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HEADER EDITOR
// ─────────────────────────────────────────────────────────────────────────────

function HeaderEditor({ header, onSave }) {
  const [form, setForm] = useState(header);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    // TODO: await updateBuffetHeader(form)
    await new Promise(r => setTimeout(r, 500));
    onSave(form);
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <Section title="Section Header">
        <div className="flex gap-3">
          <Field label='Headline Part 1 (normal, e.g. "Buffet")' half>
            <input className={inp} value={form.headlinePart1}
              onChange={e => set("headlinePart1", e.target.value)}
              placeholder="Buffet" />
          </Field>
          <Field label='Headline Part 2 (italic accent, e.g. "Selection")' half>
            <input className={inp} value={form.headlinePart2}
              onChange={e => set("headlinePart2", e.target.value)}
              placeholder="Selection" />
          </Field>
        </div>
        <Field label="Description">
          <textarea className={inp} rows={2} value={form.description}
            onChange={e => set("description", e.target.value)}
            placeholder="Short description shown below the heading..." />
        </Field>

        {/* Live preview */}
        <div className="mt-1 p-4 rounded-xl bg-gray-50 border border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Preview</p>
          <p className="text-xl font-serif text-gray-900">
            {form.headlinePart1 || "Buffet"}{" "}
            <em className="text-rose-600 not-italic font-serif">{form.headlinePart2 || "Selection"}</em>
          </p>
          <p className="text-xs text-gray-500 mt-1">{form.description}</p>
        </div>
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
// BUFFET ITEM FORM
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_ITEM = {
  id: null, name: "", description: "", price: "",
  ctaText: "Book Now", ctaLink: "",
  image: "", imageFile: null, displayOrder: 1, isActive: true,
};

function ItemForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_ITEM);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="border border-blue-200 rounded-xl bg-blue-50/30 p-4 space-y-4">

      {/* Name + Order */}
      <div className="flex gap-3">
        <Field label="Item Name" half>
          <input className={inp} value={form.name}
            onChange={e => set("name", e.target.value)}
            placeholder="e.g. Grand Indian Buffet" />
        </Field>
        <Field label="Display Order" half>
          <input type="number" className={inp} value={form.displayOrder} min={1}
            onChange={e => set("displayOrder", Number(e.target.value))} />
        </Field>
      </div>

      {/* Description */}
      <Field label="Description">
        <textarea className={inp} rows={3} value={form.description}
          onChange={e => set("description", e.target.value)}
          placeholder="Short description of this buffet offering..." />
      </Field>

      {/* Price + CTA text + CTA link */}
      <div className="flex gap-3">
        <Field label="Price (₹)" half>
          <div className="relative">
            <IndianRupee size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className={`${inp} pl-8`} value={form.price}
              onChange={e => set("price", e.target.value)}
              placeholder="700" />
          </div>
        </Field>
        <Field label="CTA Button Text" half>
          <input className={inp} value={form.ctaText}
            onChange={e => set("ctaText", e.target.value)}
            placeholder="Book Now" />
        </Field>
      </div>

      <Field label="CTA Link / URL">
        <input className={inp} value={form.ctaLink}
          onChange={e => set("ctaLink", e.target.value)}
          placeholder="/buffet/indian or https://..." />
      </Field>

      {/* Image upload */}
      <Field label="Buffet Image">
        <ImageUpload
          value={form.image}
          onChange={(url, file) => { set("image", url); set("imageFile", file); }}
          onClear={() => { set("image", ""); set("imageFile", null); }}
        />
      </Field>

      {/* Active toggle */}
      <label className="flex items-center gap-2 cursor-pointer w-fit">
        <div onClick={() => set("isActive", !form.isActive)}
          className={`relative w-9 h-5 rounded-full transition-colors ${form.isActive ? "bg-blue-500" : "bg-gray-300"}`}>
          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? "translate-x-4" : "translate-x-0.5"}`} />
        </div>
        <span className="text-xs font-semibold text-gray-600">Active</span>
      </label>

      {/* Actions */}
      <div className="flex gap-2 justify-end pt-1">
        <button onClick={onCancel}
          className="px-4 py-2 rounded-lg border text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all">
          Cancel
        </button>
        <button onClick={() => onSave(form)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all">
          <Save size={13} /> {form.id ? "Update Item" : "Add Item"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ITEM ROW
// ─────────────────────────────────────────────────────────────────────────────

function ItemRow({ item, onEdit, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-all group">

      {/* Thumbnail */}
      {item.image
        ? <img src={item.image} alt={item.name}
            className="w-12 h-12 rounded-lg object-cover border shrink-0" />
        : <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border shrink-0">
            <ImageIcon size={14} className="text-gray-300" />
          </div>
      }

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-gray-800 truncate">{item.name || "Unnamed"}</span>
          {item.price && (
            <span className="text-[10px] font-black px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
              ₹{item.price}
            </span>
          )}
          <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${item.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
            {item.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 truncate mt-0.5">{item.description}</p>
        {item.ctaText && (
          <p className="text-[10px] text-blue-400 mt-0.5 font-medium">
            CTA: {item.ctaText}
          </p>
        )}
      </div>

      {/* Order badge */}
      <span className="text-[10px] font-black text-gray-300 shrink-0">#{item.displayOrder}</span>

      {/* Actions */}
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
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function BuffetSection({ propertyData, refreshData }) {
  const [header, setHeader] = useState(INITIAL_HEADER);
  const [items, setItems]   = useState(INITIAL_ITEMS);
  const [editingId, setEditingId] = useState(null);
  const [activePanel, setActivePanel] = useState("items");

  // ── CRUD ─────────────────────────────────────────────────────────────────
  const handleSaveItem = (form) => {
    if (form.id) {
      setItems(prev => prev.map(i => i.id === form.id ? form : i));
    } else {
      setItems(prev => [...prev, { ...form, id: Date.now() }]);
    }
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this buffet item?")) return;
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const moveItem = (id, dir) => {
    setItems(prev => {
      const arr = [...prev].sort((a, b) => a.displayOrder - b.displayOrder);
      const idx = arr.findIndex(i => i.id === id);
      const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= arr.length) return prev;
      const tmp = arr[idx].displayOrder;
      arr[idx]     = { ...arr[idx],     displayOrder: arr[swapIdx].displayOrder };
      arr[swapIdx] = { ...arr[swapIdx], displayOrder: tmp };
      return arr;
    });
  };

  const sorted = [...items].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-5">

      {/* Top bar */}
      <div>
        <h2 className="text-base font-bold text-gray-800">Buffet Section</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Manage the buffet heading and all buffet offering cards shown on the website
        </p>
      </div>

      {/* Panel switcher */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { key: "header", label: "Header" },
          { key: "items",  label: `Buffet Items (${items.length})` },
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

      {/* ── HEADER PANEL ──────────────────────────────────────────────────── */}
      {activePanel === "header" && (
        <HeaderEditor header={header} onSave={setHeader} />
      )}

      {/* ── ITEMS PANEL ───────────────────────────────────────────────────── */}
      {activePanel === "items" && (
        <div className="space-y-3">

          {editingId !== "new" && (
            <div className="flex justify-end">
              <button onClick={() => setEditingId("new")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all">
                <Plus size={14} /> Add Buffet Item
              </button>
            </div>
          )}

          {editingId === "new" && (
            <ItemForm
              initial={{ ...EMPTY_ITEM, displayOrder: items.length + 1 }}
              onSave={handleSaveItem}
              onCancel={() => setEditingId(null)}
            />
          )}

          <div className="space-y-2">
            {sorted.length === 0 && (
              <div className="py-16 text-center text-gray-400 text-sm border-2 border-dashed rounded-xl">
                No buffet items yet — click <strong>Add Buffet Item</strong> to get started.
              </div>
            )}
            {sorted.map((item, idx) => (
              <React.Fragment key={item.id}>
                {editingId === item.id ? (
                  <ItemForm
                    initial={item}
                    onSave={handleSaveItem}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <ItemRow
                    item={item}
                    isFirst={idx === 0}
                    isLast={idx === sorted.length - 1}
                    onEdit={() => setEditingId(item.id)}
                    onDelete={() => handleDelete(item.id)}
                    onMoveUp={() => moveItem(item.id, -1)}
                    onMoveDown={() => moveItem(item.id, 1)}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {items.length > 0 && (
            <p className="text-[11px] text-gray-400 text-right">
              {items.filter(i => i.isActive).length} active · {items.filter(i => !i.isActive).length} inactive
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default BuffetSection;