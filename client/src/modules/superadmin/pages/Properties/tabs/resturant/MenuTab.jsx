import React, { useState } from "react";
import { PencilSquareIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { colors } from "@/lib/colors/colors";
import AddMenuItemModal from "../../modals/AddMenuItemModal";
import {
  Heart, Save, Image as ImageIcon, X,
  ChevronLeft, ChevronRight,
} from "lucide-react";

// ── Shared input style ────────────────────────────────────────────────────────
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

// ── Static seed data (replace with API) ───────────────────────────────────────

const INITIAL_HEADER = {
  headlinePart1: "Signature",
  headlinePart2: "Masterpieces",
  description: "Handcrafted masterpieces using premium ingredients and traditional techniques.",
  chefRemarkLabel: "CHEF'S REMARK",
  chefRemarkQuote: '"We don\'t just serve food; we serve memories crafted with heritage spices."',
  chefImage: "",
  chefImageFile: null,
};

const INITIAL_ITEMS = [
  { id: 1, name: "Butter Chicken",   category: "North Indian",    description: '"Our legendary cream-based curry with succulent clay-oven grilled..."', likeCount: 1240, image: "", isActive: true },
  { id: 2, name: "Tandoori Jhinga",  category: "Coastal Tandoor", description: '"Jumbo prawns marinated in a secret coastal spice mix and..."',         likeCount: 850,  image: "", isActive: true },
  { id: 3, name: "Truffle Dim Sum",  category: "Asian Fusion",    description: '"Hand-rolled translucent dumplings infused with aromati..."',            likeCount: 2100, image: "", isActive: true },
  { id: 4, name: "Szechuan Prawns",  category: "Szechuan",        description: '"Fiery wok-tossed prawns glazed in a bold and spicy authentic..."',      likeCount: 1800, image: "", isActive: false },
  { id: 5, name: "Dal Makhani",      category: "North Indian",    description: '"Slow-cooked overnight in a rich buttery tomato base..."',               likeCount: 970,  image: "", isActive: true },
  { id: 6, name: "Malabar Prawn",    category: "Coastal Tandoor", description: '"Kerala-style prawns in coconut milk and aromatic spices..."',          likeCount: 640,  image: "", isActive: true },
];

const PAGE_SIZE = 5;

// ── Chef image upload helper ──────────────────────────────────────────────────
function ChefImageUpload({ value, onChange, onClear }) {
  return (
    <div className="flex items-center gap-3">
      <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all text-xs text-gray-500 font-medium shrink-0">
        <ImageIcon size={13} />
        {value ? "Change" : "Upload"}
        <input type="file" accept="image/*" className="hidden"
          onChange={e => {
            const file = e.target.files?.[0];
            if (!file) return;
            onChange(URL.createObjectURL(file), file);
          }} />
      </label>
      {value
        ? <>
            <img src={value} alt="Chef" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow shrink-0" />
            <button type="button" onClick={onClear} className="text-red-400 hover:text-red-600 transition-colors">
              <X size={13} />
            </button>
          </>
        : <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border shrink-0">
            <ImageIcon size={14} className="text-gray-300" />
          </div>
      }
    </div>
  );
}

// ── Header Editor ─────────────────────────────────────────────────────────────
function HeaderEditor({ header, onSave }) {
  const [form, setForm] = useState(header);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    // TODO: await updateMenuHeader(form)
    await new Promise(r => setTimeout(r, 500));
    onSave(form);
    setSaving(false);
  };

  return (
    <div className="space-y-4">

      {/* Section headline */}
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Section Headline</h3>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex gap-3">
            <Field label='Part 1 (normal, e.g. "Signature")' half>
              <input className={inp} value={form.headlinePart1}
                onChange={e => set("headlinePart1", e.target.value)} placeholder="Signature" />
            </Field>
            <Field label='Part 2 (italic accent, e.g. "Masterpieces")' half>
              <input className={inp} value={form.headlinePart2}
                onChange={e => set("headlinePart2", e.target.value)} placeholder="Masterpieces" />
            </Field>
          </div>
          <Field label="Description">
            <textarea className={inp} rows={2} value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Short description below the heading..." />
          </Field>
          {/* Preview */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Preview</p>
            <p className="text-xl font-serif text-gray-900">
              {form.headlinePart1}{" "}
              <em className="text-rose-600 not-italic font-serif">{form.headlinePart2}</em>
            </p>
            <p className="text-xs text-gray-400 mt-1">{form.description}</p>
          </div>
        </div>
      </div>

      {/* Chef's remark card */}
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Chef's Remark Card</h3>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex gap-3">
            <Field label="Remark Label (e.g. CHEF'S REMARK)" half>
              <input className={inp} value={form.chefRemarkLabel}
                onChange={e => set("chefRemarkLabel", e.target.value)}
                placeholder="CHEF'S REMARK" />
            </Field>
            <div className="flex-1">
              <Field label="Chef Photo">
                <ChefImageUpload
                  value={form.chefImage}
                  onChange={(url, file) => { set("chefImage", url); set("chefImageFile", file); }}
                  onClear={() => { set("chefImage", ""); set("chefImageFile", null); }}
                />
              </Field>
            </div>
          </div>
          <Field label="Quote / Remark Text">
            <textarea className={inp} rows={2} value={form.chefRemarkQuote}
              onChange={e => set("chefRemarkQuote", e.target.value)}
              placeholder='' />
          </Field>

          {/* Preview of remark card */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Card Preview</p>
            <div className="flex items-start gap-3 bg-white rounded-xl p-3 border shadow-sm max-w-sm">
              <div className="relative shrink-0">
                {form.chefImage
                  ? <img src={form.chefImage} alt="Chef" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
                  : <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border">
                      <ImageIcon size={16} className="text-gray-300" />
                    </div>
                }
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-[8px] font-black">❝</span>
                </div>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-rose-600 mb-1">
                  {form.chefRemarkLabel || "CHEF'S REMARK"}
                </p>
                <p className="text-xs text-gray-600 italic leading-relaxed line-clamp-2">
                  {form.chefRemarkQuote || '"Add your quote here..."'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
// MENU TAB — MAIN
// ─────────────────────────────────────────────────────────────────────────────

const MenuTab = ({ data, onEdit, onAdd, onDelete, propertyData, refreshData }) => {
  const [header, setHeader]           = useState(INITIAL_HEADER);
  const [items, setItems]             = useState(INITIAL_ITEMS);
  const [activePanel, setActivePanel] = useState("items"); // "header" | "items"
  const [modalOpen, setModalOpen]     = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [page, setPage]               = useState(0);
  const [search, setSearch]           = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // ── Derived ──────────────────────────────────────────────────────────────
  const allCategories = [...new Set(items.map(i => i.category).filter(Boolean))];

  const filtered = items.filter(item => {
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = !categoryFilter || item.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const totalPages  = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated   = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const goToPage = (p) => setPage(Math.max(0, Math.min(p, totalPages - 1)));

  // Reset to page 0 on filter change
  const handleSearch = (v) => { setSearch(v); setPage(0); };
  const handleCat    = (v) => { setCategoryFilter(v); setPage(0); };

  // ── Modal ─────────────────────────────────────────────────────────────────
  const openCreate = () => { setEditingItem(null); setModalOpen(true); };
  const openEdit   = (item) => { setEditingItem(item); setModalOpen(true); };

  const handleModalClose = (didSave) => {
    setModalOpen(false);
    setEditingItem(null);
    if (didSave) refreshData?.();
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this menu item?")) return;
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-5">

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-800">Menu</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage the section header, chef remark, and all menu items
          </p>
        </div>
        {activePanel === "items" && (
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg transition-all hover:opacity-90"
            style={{ backgroundColor: colors.primary }}>
            <PlusIcon className="w-4 h-4" /> Add Item
          </button>
        )}
      </div>

      {/* ── Panel switcher ────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { key: "header", label: "Header & Chef" },
          { key: "items",  label: `Menu Items (${items.length})` },
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
        <div className="space-y-4">

          {/* Search + category filter */}
          <div className="flex gap-3">
            <input
              className={`${inp} max-w-xs`}
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search items..."
            />
            <select className={`${inp} max-w-[180px]`}
              value={categoryFilter} onChange={e => handleCat(e.target.value)}>
              <option value="">All categories</option>
              {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {(search || categoryFilter) && (
              <button onClick={() => { handleSearch(""); handleCat(""); }}
                className="text-xs font-bold text-gray-400 hover:text-gray-600 underline whitespace-nowrap">
                Clear filters
              </button>
            )}
          </div>

          {/* Table */}
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Image", "Name", "Category", "Description", "Likes", "Status", "Actions"].map(h => (
                    <th key={h}
                      className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-sm text-gray-400">
                      No menu items found.
                    </td>
                  </tr>
                )}

                {paginated.map(item => (
                  <tr key={item.id} className="bg-white hover:bg-gray-50/50 transition-colors">

                    {/* Image */}
                    <td className="px-4 py-3 w-16">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border bg-gray-100 flex items-center justify-center shrink-0">
                        {item.image
                          ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          : <ImageIcon size={14} className="text-gray-300" />
                        }
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3 max-w-[140px]">
                      <p className="font-semibold text-gray-800 truncate text-sm">{item.name}</p>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        {item.category || "—"}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="text-[11px] text-gray-400 italic truncate">{item.description || "—"}</p>
                    </td>

                    {/* Likes */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-500">
                        <Heart size={12} className="fill-rose-500" />
                        {item.likeCount?.toLocaleString() || 0}+
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-[10px] font-black uppercase tracking-wide px-2 py-1 rounded-full ${
                        item.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-all">
                          <PencilSquareIcon className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => handleDelete(item.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition-all">
                          <TrashIcon className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination footer */}
            {filtered.length > 0 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <p className="text-[11px] text-gray-400">
                  Showing{" "}
                  <span className="font-bold text-gray-600">
                    {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)}
                  </span>{" "}
                  of <span className="font-bold text-gray-600">{filtered.length}</span> items
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => goToPage(page - 1)} disabled={page === 0}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-30 transition-all">
                    <ChevronLeft size={14} />
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button key={i} onClick={() => goToPage(i)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                          i === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages - 1}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-30 transition-all">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      <AddMenuItemModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        initialData={editingItem}
        propertyData={propertyData}
        onSave={refreshData}
      />
    </div>
  );
};

export default MenuTab;