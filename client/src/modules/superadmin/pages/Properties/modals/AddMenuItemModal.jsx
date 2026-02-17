import React, { useState, useEffect } from "react";
import { X, Save, Loader2, Image as ImageIcon, Heart } from "lucide-react";

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

// ── Category options (can be fetched from API) ────────────────────────────────
const CATEGORIES = [
  "North Indian",
  "Coastal Tandoor",
  "Asian Fusion",
  "Szechuan",
  "Continental",
  "Desserts",
  "Beverages",
  "Starters",
  "Breads",
  "Rice & Biryani",
];

// ── Image Upload ──────────────────────────────────────────────────────────────
function ImageUpload({ value, onChange, onClear }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 px-4 py-2 w-fit rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all text-sm text-gray-500 font-medium">
        <ImageIcon size={14} />
        {value ? "Change Image" : "Upload Image"}
        <input type="file" accept="image/*" className="hidden"
          onChange={e => {
            const file = e.target.files?.[0];
            if (!file) return;
            // TODO: replace with uploadMedia(fd) call, use returned URL
            onChange(URL.createObjectURL(file), file);
          }} />
      </label>
      {value && (
        <div className="relative w-full h-44 rounded-xl overflow-hidden border shadow-sm">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button type="button" onClick={onClear}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────────────────────────────────────

const ITEM_TYPES = [
  "Starter",
  "Main Course",
  "Breads",
  "Rice & Biryani",
  "Dessert",
  "Beverage",
  "Side Dish",
  "Salad",
  "Soup",
];

const EMPTY = {
  name: "",
  category: "",
  itemType: "",
  description: "",
  likeCount: 0,
  isVeg: true,
  isSignature: false,
  image: "",
  imageFile: null,
  isActive: true,
};

function AddMenuItemModal({ isOpen, onClose, initialData, propertyData, onSave }) {
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const isEditing = !!initialData?.id;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          ...EMPTY,
          ...initialData,
          image: initialData.image?.url || initialData.image || "",
          imageFile: null,
        });
      } else {
        setForm(EMPTY);
      }
    }
  }, [isOpen, initialData]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      // TODO: wire up createMenuItem / updateMenuItem API
      // const fd = new FormData();
      // fd.append("data", JSON.stringify({ ...form, propertyId: propertyData?.id }));
      // if (form.imageFile) fd.append("file", form.imageFile);
      // isEditing ? await updateMenuItem(initialData.id, fd) : await createMenuItem(fd);
      await new Promise(r => setTimeout(r, 600)); // stub
      onSave?.();
      onClose(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h3 className="text-lg font-bold text-gray-800">
            {isEditing ? "Edit Menu Item" : "Add Menu Item"}
          </h3>
          <button onClick={() => onClose(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Image */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
              Item Image
            </label>
            <ImageUpload
              value={form.image}
              onChange={(url, file) => { set("image", url); set("imageFile", file); }}
              onClear={() => { set("image", ""); set("imageFile", null); }}
            />
          </div>

          {/* Name + Category */}
          <div className="flex gap-3">
            <Field label="Item Name" half>
              <input className={inp} value={form.name}
                onChange={e => set("name", e.target.value)}
                placeholder="e.g. Butter Chicken" />
            </Field>
            <Field label="Category" half>
              <select className={inp} value={form.category}
                onChange={e => set("category", e.target.value)}>
                <option value="">Select category...</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Description */}
          <Field label='Description (shown as italic quote on card)'>
            <textarea className={inp} rows={3} value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder='"Our legendary cream-based curry with succulent clay-oven grilled...' />
          </Field>

          {/* Item Type + Like Count */}
          <div className="flex gap-3">
            <Field label="Item Type" half>
              <select className={inp} value={form.itemType}
                onChange={e => set("itemType", e.target.value)}>
                <option value="">Select type...</option>
                {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Like Count" half>
              <div className="relative">
                <Heart size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400 fill-rose-400" />
                <input type="number" className={`${inp} pl-8`} value={form.likeCount} min={0}
                  onChange={e => set("likeCount", Number(e.target.value))}
                  placeholder="1240" />
              </div>
            </Field>
          </div>

          {/* Veg / Non-Veg + Signature + Active */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">

            {/* Veg / Non-Veg toggle */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Food Type</span>
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                <button type="button"
                  onClick={() => set("isVeg", true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all ${
                    form.isVeg ? "bg-green-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}>
                  <span className="w-3 h-3 rounded-sm border-2 border-current flex items-center justify-center">
                    <span className={form.isVeg ? "w-1.5 h-1.5 bg-white rounded-full" : ""} />
                  </span>
                  Veg
                </button>
                <button type="button"
                  onClick={() => set("isVeg", false)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all border-l ${
                    !form.isVeg ? "bg-red-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}>
                  <span className="w-3 h-3 rounded-sm border-2 border-current flex items-center justify-center">
                    <span className={!form.isVeg ? "w-1.5 h-1.5 bg-white rounded-full" : ""} />
                  </span>
                  Non-Veg
                </button>
              </div>
            </div>

            {/* Signature dish toggle */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Signature Dish</span>
              <label className="flex items-center gap-2 cursor-pointer h-[34px]">
                <div onClick={() => set("isSignature", !form.isSignature)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${form.isSignature ? "bg-amber-400" : "bg-gray-300"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isSignature ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
                <span className="text-xs font-semibold text-gray-600">
                  {form.isSignature ? "⭐ Yes, Signature" : "No"}
                </span>
              </label>
            </div>

            {/* Active toggle */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</span>
              <label className="flex items-center gap-2 cursor-pointer h-[34px]">
                <div onClick={() => set("isActive", !form.isActive)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${form.isActive ? "bg-blue-500" : "bg-gray-300"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
                <span className="text-xs font-semibold text-gray-600">Active</span>
              </label>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
          <button onClick={() => onClose(false)}
            className="px-5 py-2.5 rounded-lg border text-sm font-bold text-gray-600 hover:bg-white transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving || !form.name.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-50">
            {saving
              ? <><Loader2 size={15} className="animate-spin" /> Saving...</>
              : <><Save size={15} /> {isEditing ? "Update Item" : "Add Item"}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddMenuItemModal;