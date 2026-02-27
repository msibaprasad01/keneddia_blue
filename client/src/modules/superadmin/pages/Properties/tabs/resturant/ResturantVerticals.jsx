import React, { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  GripVertical,
  Image as ImageIcon,
  ShoppingBag,
  Eye,
  EyeOff,
  Quote,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  createVerticalSectionHeader,
  updateVerticalSectionHeader,
  getAllVerticalSectionsHeader,
  getVerticalSectionHeaderById,
  toggleVerticalSectionHeaderStatus,
  createVerticalCard,
  updateVerticalCard,
  getAllVerticalCards,
  getVerticalCardById,
  toggleVerticalCardStatus,
} from "@/Api/RestaurantApi";
import { uploadMedia } from "@/Api/Api";

// ── Shared styles ─────────────────────────────────────────────────────────────
const inp =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10 outline-none bg-white transition-all";

const CARD_COLORS = [
  { label: "Peach", value: "#FEF3ED" },
  { label: "Sky", value: "#EDF4FE" },
  { label: "Rose", value: "#FEEDED" },
  { label: "Mint", value: "#EDFEF3" },
  { label: "Lemon", value: "#FEFBED" },
  { label: "Lilac", value: "#F3EDFE" },
];

const Section = ({ title, children }) => (
  <div className="border border-gray-100 rounded-xl overflow-hidden">
    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
        {title}
      </h3>
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

// ── Reusable image upload with uploadMedia integration ────────────────────────
function ImageUpload({ value, onChange, onClear, rounded = false }) {
  const [uploading, setUploading] = useState(false);
  const cls = rounded ? "rounded-full" : "rounded-lg";

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadMedia(fd);
      const mediaId =
        typeof res.data === "number"
          ? res.data
          : (res.data?.id ?? res.data?.mediaId ?? res.data?.data?.id);
      const url =
        res.data?.url ?? res.data?.data?.url ?? URL.createObjectURL(file);
      onChange(url, mediaId);
    } catch {
      onChange(URL.createObjectURL(file), null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all text-sm text-gray-500 font-medium shrink-0">
        <ImageIcon size={14} />
        {uploading ? "Uploading…" : value ? "Change Image" : "Upload Image"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={handleFile}
        />
      </label>
      {value ? (
        <>
          <img
            src={value}
            alt=""
            className={`w-12 h-12 ${cls} object-cover border-2 border-white shadow shrink-0`}
          />
          <button
            type="button"
            onClick={onClear}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <X size={14} />
          </button>
        </>
      ) : (
        <div
          className={`w-12 h-12 ${cls} bg-gray-100 flex items-center justify-center border shrink-0`}
        >
          <ImageIcon size={16} className="text-gray-300" />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HEADER EDITOR
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_HEADER = {
  id: null,
  badgeLabel: "",
  headlineLine1: "",
  headlineLine2: "",
  description: "",
  policyType: "",
  policyName: "",
  policyDescription: "",
  policyMediaId: null,
  policyMediaUrl: "",
  isActive: true,
};

function HeaderEditor({ propertyId, onSaved }) {
  const [form, setForm] = useState(EMPTY_HEADER);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // Load existing header
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllVerticalSectionsHeader();
        const list = res.data?.data ?? res.data ?? [];
        const existing = Array.isArray(list)
          ? (list.find((h) => h.propertyId === propertyId) ?? list[0])
          : list;
        if (existing) {
          setForm({
            id: existing.id ?? null,
            badgeLabel: existing.badgeLabel ?? "",
            headlineLine1: existing.headlineLine1 ?? "",
            headlineLine2: existing.headlineLine2 ?? "",
            description: existing.description ?? "",
            policyType: existing.policyType ?? "",
            policyName: existing.policyName ?? "",
            policyDescription: existing.policyDescription ?? "",
            policyMediaId: existing.policyMediaId ?? null,
            policyMediaUrl:
              existing.policyMedia?.url ?? existing.policyMediaUrl ?? "",
            isActive: existing.isActive ?? true,
          });
        }
      } catch (e) {
        console.error("Failed to load header", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [propertyId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        badgeLabel: form.badgeLabel,
        headlineLine1: form.headlineLine1,
        headlineLine2: form.headlineLine2,
        description: form.description,
        policyType: form.policyType,
        policyName: form.policyName,
        policyDescription: form.policyDescription,
        propertyId,
        policyMediaId: form.policyMediaId,
        isActive: form.isActive,
      };

      if (form.id) {
        await updateVerticalSectionHeader(form.id, payload);
      } else {
        const res = await createVerticalSectionHeader(payload);
        const newId = res.data?.data?.id ?? res.data?.id;
        setForm((p) => ({ ...p, id: newId }));
      }
      onSaved?.();
    } catch (e) {
      console.error("Failed to save header", e);
      alert("Failed to save header. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-sm text-gray-400">
        Loading header…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Hero Text */}
      <Section title="Hero Text">
        <div className="flex gap-3">
          <Field label="Badge Label" half>
            <input
              className={inp}
              value={form.badgeLabel}
              onChange={(e) => set("badgeLabel", e.target.value)}
              placeholder="e.g. Verticals"
            />
          </Field>
          <Field label="Headline Line 1" half>
            <input
              className={inp}
              value={form.headlineLine1}
              onChange={(e) => set("headlineLine1", e.target.value)}
              placeholder="One Location."
            />
          </Field>
        </div>
        <Field label="Headline Line 2 (italic / accent color)">
          <input
            className={inp}
            value={form.headlineLine2}
            onChange={(e) => set("headlineLine2", e.target.value)}
            placeholder="Diverse Verticals."
          />
        </Field>
        <Field label="Description">
          <textarea
            className={inp}
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Short description shown below the heading..."
          />
        </Field>

        {/* Preview */}
        <div className="mt-1 p-4 rounded-xl bg-gray-50 border border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
            Preview
          </p>
          {form.badgeLabel && (
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-1 block">
              {form.badgeLabel}
            </span>
          )}
          <p className="text-xl font-serif text-gray-900">
            {form.headlineLine1 || "One Location."}{" "}
            <em className="text-rose-600 not-italic font-serif">
              {form.headlineLine2 || "Diverse Verticals."}
            </em>
          </p>
          <p className="text-xs text-gray-500 mt-1">{form.description}</p>
        </div>
      </Section>

      {/* Dining Policy */}
      <Section title="Dining Policy Card">
        <div className="flex gap-3">
          <Field label="Policy Type (label)" half>
            <input
              className={inp}
              value={form.policyType}
              onChange={(e) => set("policyType", e.target.value)}
              placeholder="DINING POLICY"
            />
          </Field>
          <Field label="Policy Name" half>
            <input
              className={inp}
              value={form.policyName}
              onChange={(e) => set("policyName", e.target.value)}
              placeholder="BYOB Support"
            />
          </Field>
        </div>
        <Field label="Quote / Description">
          <textarea
            className={inp}
            rows={2}
            value={form.policyDescription}
            onChange={(e) => set("policyDescription", e.target.value)}
            placeholder="Bring your favorite spirits; we provide premium glassware."
          />
        </Field>
        <Field label="Policy Image">
          <ImageUpload
            value={form.policyMediaUrl}
            rounded
            onChange={(url, mediaId) => {
              set("policyMediaUrl", url);
              if (mediaId) set("policyMediaId", mediaId);
            }}
            onClear={() => {
              set("policyMediaUrl", "");
              set("policyMediaId", null);
            }}
          />
        </Field>

        {/* Active toggle */}
        <label className="flex items-center gap-2 cursor-pointer w-fit">
          <div
            onClick={() => set("isActive", !form.isActive)}
            className={`relative w-9 h-5 rounded-full transition-colors ${form.isActive ? "bg-blue-500" : "bg-gray-300"}`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? "translate-x-4" : "translate-x-0.5"}`}
            />
          </div>
          <span className="text-xs font-semibold text-gray-600">Active</span>
        </label>
      </Section>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-bold bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-60"
        >
          {saving ? (
            "Saving…"
          ) : (
            <>
              <Save size={14} /> Save Header
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VERTICAL CARD FORM (add / edit)
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_VERTICAL = {
  id: null,
  verticalName: "",
  description: "",
  mediaId: null,
  mediaUrl: "",
  showOrderButton: false,
  link: "",
  extraText: "",
  cardBackgroundColor: "#FEF3ED",
  displayOrder: 1,
  isActive: true,
};

function VerticalForm({ initial, propertyId, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_VERTICAL);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        verticalName: form.verticalName,
        displayOrder: form.displayOrder,
        description: form.description,
        mediaId: form.mediaId,
        cardBackgroundColor: form.cardBackgroundColor,
        showOrderButton: form.showOrderButton,
        link: form.link,
        extraText: form.extraText,
        propertyId,
        isActive: form.isActive,
      };

      if (form.id) {
        await updateVerticalCard(form.id, payload);
        onSave({ ...form });
      } else {
        const res = await createVerticalCard(payload);
        const created = res.data?.data ?? res.data;
        onSave({ ...form, id: created?.id ?? Date.now() });
      }
    } catch (e) {
      console.error("Failed to save vertical", e);
      alert("Failed to save vertical. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-blue-200 rounded-xl bg-blue-50/30 p-4 space-y-4">
      <div className="flex gap-3">
        <Field label="Vertical Name" half>
          <input
            className={inp}
            value={form.verticalName}
            onChange={(e) => set("verticalName", e.target.value)}
            placeholder="e.g. Italian"
          />
        </Field>
        <Field label="Display Order" half>
          <input
            type="number"
            className={inp}
            value={form.displayOrder}
            min={1}
            onChange={(e) => set("displayOrder", Number(e.target.value))}
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          className={inp}
          rows={3}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Short tagline shown on the card..."
        />
      </Field>

      <div className="flex gap-3">
        <Field label="Extra Text" half>
          <input
            className={inp}
            value={form.extraText}
            onChange={(e) => set("extraText", e.target.value)}
            placeholder="Weekend Special Available"
          />
        </Field>
        <Field label="Link / URL" half>
          <input
            className={inp}
            value={form.link}
            onChange={(e) => set("link", e.target.value)}
            placeholder="/verticals/italian or https://..."
          />
        </Field>
      </div>

      <Field label="Image">
        <ImageUpload
          value={form.mediaUrl}
          rounded
          onChange={(url, mediaId) => {
            set("mediaUrl", url);
            if (mediaId) set("mediaId", mediaId);
          }}
          onClear={() => {
            set("mediaUrl", "");
            set("mediaId", null);
          }}
        />
      </Field>

      {/* Card background color picker */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
          Card Background Color
        </label>
        <div className="flex gap-2 flex-wrap">
          {CARD_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => set("cardBackgroundColor", c.value)}
              title={c.label}
              className={`w-8 h-8 rounded-full border-2 transition-all ${form.cardBackgroundColor === c.value ? "border-blue-500 scale-110" : "border-gray-200"}`}
              style={{ backgroundColor: c.value }}
            />
          ))}
          <input
            type="color"
            value={form.cardBackgroundColor}
            onChange={(e) => set("cardBackgroundColor", e.target.value)}
            className="w-8 h-8 rounded-full border border-gray-200 cursor-pointer p-0 overflow-hidden"
            title="Custom color"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        {[
          { label: "Show Order Button", key: "showOrderButton" },
          { label: "Active", key: "isActive" },
        ].map(({ label, key }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => set(key, !form[key])}
              className={`relative w-9 h-5 rounded-full transition-colors ${form[key] ? "bg-blue-500" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key] ? "translate-x-4" : "translate-x-0.5"}`}
              />
            </div>
            <span className="text-xs font-semibold text-gray-600">{label}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-2 justify-end pt-1">
        <button
          onClick={onCancel}
          disabled={saving}
          className="px-4 py-2 rounded-lg border text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-60"
        >
          <Save size={13} />{" "}
          {saving ? "Saving…" : form.id ? "Update" : "Add Vertical"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VERTICAL ROW
// ─────────────────────────────────────────────────────────────────────────────
function VerticalRow({
  v,
  onEdit,
  onDelete,
  onToggleStatus,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) {
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      await toggleVerticalCardStatus(v.id, !v.isActive);
      onToggleStatus(v.id, !v.isActive);
    } catch (e) {
      console.error("Failed to toggle status", e);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-all group">
      {/* color swatch */}
      <div
        className="w-1 self-stretch rounded-full shrink-0"
        style={{ backgroundColor: v.cardBackgroundColor }}
      />

      {/* image */}
      {v.mediaUrl ? (
        <img
          src={v.mediaUrl}
          alt={v.verticalName}
          className="w-11 h-11 rounded-full object-cover border shrink-0"
        />
      ) : (
        <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border">
          <ImageIcon size={14} className="text-gray-300" />
        </div>
      )}

      {/* info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-gray-800 truncate">
            {v.verticalName || "Unnamed"}
          </span>
          {v.showOrderButton && (
            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-rose-100 text-rose-600 rounded">
              Order btn
            </span>
          )}
          {v.extraText && (
            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded">
              {v.extraText}
            </span>
          )}
          <span
            className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${v.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
          >
            {v.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 truncate mt-0.5">
          {v.description}
        </p>
      </div>

      {/* order badge */}
      <span className="text-[10px] font-black text-gray-300 shrink-0">
        #{v.displayOrder}
      </span>

      {/* actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition-all"
        >
          <ChevronUp size={14} />
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition-all"
        >
          <ChevronDown size={14} />
        </button>
        <button
          onClick={handleToggle}
          disabled={toggling}
          title={v.isActive ? "Deactivate" : "Activate"}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-all disabled:opacity-50"
        >
          {v.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
        <button
          onClick={onEdit}
          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-400 transition-all"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW STRIP
// ─────────────────────────────────────────────────────────────────────────────
function PreviewStrip({ verticals }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {verticals
        .filter((v) => v.isActive)
        .map((v) => (
          <div
            key={v.id}
            className="shrink-0 w-36 rounded-2xl p-3 flex flex-col items-center gap-2 border border-white/60"
            style={{ backgroundColor: v.cardBackgroundColor }}
          >
            {v.mediaUrl ? (
              <img
                src={v.mediaUrl}
                alt={v.verticalName}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white">
                <ImageIcon size={18} className="text-gray-400" />
              </div>
            )}
            <p className="text-xs font-semibold text-gray-700 text-center leading-tight">
              {v.verticalName}
            </p>
            <div className="flex items-center gap-1 mt-auto">
              <span className="w-5 h-5 rounded-full bg-rose-500/80 flex items-center justify-center">
                <span className="text-white text-[8px]">›</span>
              </span>
              <span className="text-[8px] font-bold uppercase text-gray-500">
                Explore
              </span>
              {v.showOrderButton && (
                <span className="text-[8px] font-bold uppercase bg-rose-500 text-white px-1 rounded">
                  Order
                </span>
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
  const propertyId = propertyData?.id ?? propertyData?.propertyId ?? 1;

  const [verticals, setVerticals] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [activePanel, setActivePanel] = useState("verticals");
  const [showPreview, setShowPreview] = useState(false);

  // ── Load cards ────────────────────────────────────────────────────────────
  const fetchCards = async () => {
    setLoadingCards(true);
    try {
      const res = await getAllVerticalCards();
      const list = res.data?.data ?? res.data ?? [];
      const mapped = (Array.isArray(list) ? list : [])
        .filter((c) => !propertyId || c.propertyId === propertyId)
        .map((c) => ({
          id: c.id,
          verticalName: c.verticalName ?? "",
          description: c.description ?? "",
          cardBackgroundColor: c.cardBackgroundColor ?? "#FEF3ED",
          showOrderButton: c.showOrderButton ?? false,
          link: c.link ?? "",
          extraText: c.extraText ?? "",
          mediaId: c.mediaId ?? null,
          mediaUrl: c.media?.url ?? c.mediaUrl ?? "",
          displayOrder: c.displayOrder ?? 1,
          isActive: c.isActive ?? true,
        }));
      setVerticals(mapped);
    } catch (e) {
      console.error("Failed to load vertical cards", e);
    } finally {
      setLoadingCards(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [propertyId]);

  // ── CRUD ─────────────────────────────────────────────────────────────────
  const handleSaveVertical = (saved) => {
    setVerticals((prev) =>
      prev.some((v) => v.id === saved.id)
        ? prev.map((v) => (v.id === saved.id ? saved : v))
        : [...prev, saved],
    );
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vertical?")) return;
    try {
      await toggleVerticalCardStatus(id, false);
      setVerticals((prev) => prev.filter((v) => v.id !== id));
    } catch (e) {
      console.error("Failed to delete", e);
      alert("Failed to delete vertical.");
    }
  };

  const handleToggleStatus = (id, newStatus) => {
    setVerticals((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isActive: newStatus } : v)),
    );
  };

  const moveVertical = (id, dir) => {
    setVerticals((prev) => {
      const arr = [...prev].sort((a, b) => a.displayOrder - b.displayOrder);
      const idx = arr.findIndex((v) => v.id === id);
      const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= arr.length) return prev;
      const tmp = arr[idx].displayOrder;
      arr[idx] = { ...arr[idx], displayOrder: arr[swapIdx].displayOrder };
      arr[swapIdx] = { ...arr[swapIdx], displayOrder: tmp };
      // Persist order in background
      updateVerticalCard(arr[idx].id, {
        displayOrder: arr[idx].displayOrder,
        propertyId,
      }).catch(console.error);
      updateVerticalCard(arr[swapIdx].id, {
        displayOrder: arr[swapIdx].displayOrder,
        propertyId,
      }).catch(console.error);
      return arr;
    });
  };

  const sorted = [...verticals].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-800">
            Verticals Section
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage the hero header and all dining vertical cards shown on the
            website
          </p>
        </div>
        <button
          onClick={() => setShowPreview((p) => !p)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all"
        >
          {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

      {/* Mini preview strip */}
      {showPreview && (
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Live Preview — Active Verticals
          </p>
          <PreviewStrip verticals={sorted} />
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { key: "header", label: "Header & Policy" },
          { key: "verticals", label: `Vertical Cards (${verticals.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActivePanel(t.key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activePanel === t.key
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── HEADER PANEL ────────────────────────────────────────────────── */}
      {activePanel === "header" && (
        <HeaderEditor propertyId={propertyId} onSaved={refreshData} />
      )}

      {/* ── VERTICALS PANEL ─────────────────────────────────────────────── */}
      {activePanel === "verticals" && (
        <div className="space-y-3">
          {editingId !== "new" && (
            <div className="flex justify-end">
              <button
                onClick={() => setEditingId("new")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all"
              >
                <Plus size={14} /> Add Vertical
              </button>
            </div>
          )}

          {editingId === "new" && (
            <VerticalForm
              initial={{
                ...EMPTY_VERTICAL,
                displayOrder: verticals.length + 1,
              }}
              propertyId={propertyId}
              onSave={handleSaveVertical}
              onCancel={() => setEditingId(null)}
            />
          )}

          <div className="space-y-2">
            {loadingCards ? (
              <div className="py-16 text-center text-gray-400 text-sm">
                Loading verticals…
              </div>
            ) : sorted.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm border-2 border-dashed rounded-xl">
                No verticals yet — click <strong>Add Vertical</strong> to get
                started.
              </div>
            ) : (
              sorted.map((v, idx) => (
                <React.Fragment key={v.id}>
                  {editingId === v.id ? (
                    <VerticalForm
                      initial={v}
                      propertyId={propertyId}
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
                      onToggleStatus={handleToggleStatus}
                      onMoveUp={() => moveVertical(v.id, -1)}
                      onMoveDown={() => moveVertical(v.id, 1)}
                    />
                  )}
                </React.Fragment>
              ))
            )}
          </div>

          {verticals.length > 0 && (
            <p className="text-[11px] text-gray-400 text-right">
              {verticals.filter((v) => v.isActive).length} active ·{" "}
              {verticals.filter((v) => !v.isActive).length} inactive
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ResturantVerticals;
