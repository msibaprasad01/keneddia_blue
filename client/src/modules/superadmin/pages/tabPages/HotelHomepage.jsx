import React, { useState, useEffect, useCallback } from "react";
import { colors } from "@/lib/colors/colors";
import {
  Save,
  Loader2,
  ImageIcon,
  X,
  Plus,
  Pencil,
  ToggleLeft,
  ToggleRight,
  BookOpen,
  Users,
  Building2,
} from "lucide-react";
import {
  createMenuHeaderSection,
  getMenuHeaders,
  updateMenuHeadersSection,
  toggleMenuHeadersSectionStatus,
} from "@/Api/RestaurantApi";
import {
  addGroupBooking,
  updateGroupBooking,
  getGroupBookings,
  getAllProperties,
  getPropertyTypes,
} from "@/Api/Api";
import { toast } from "react-hot-toast";

// ── Shared helpers ─────────────────────────────────────────────────────────────
const inp =
  "w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all";

const Field = ({ label, children, required }) => (
  <div>
    <label
      className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
      style={{ color: colors.textSecondary }}
    >
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

// ── Image upload helper ────────────────────────────────────────────────────────
function ImageUpload({ value, onChange, onClear }) {
  const displayUrl = typeof value === "string" && value ? value : null;
  return (
    <div className="flex items-center gap-3">
      <label
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed text-xs font-medium cursor-pointer transition-all hover:opacity-80"
        style={{
          borderColor: colors.border,
          color: colors.textSecondary,
          backgroundColor: colors.mainBg,
        }}
      >
        <ImageIcon size={13} />
        {displayUrl ? "Change Image" : "Upload Image"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            onChange(URL.createObjectURL(file), file);
          }}
        />
      </label>
      {displayUrl && (
        <>
          <img
            src={displayUrl}
            alt="preview"
            className="w-10 h-10 rounded-lg object-cover border"
            style={{ borderColor: colors.border }}
          />
          <button
            type="button"
            onClick={onClear}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <X size={13} />
          </button>
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SUB-TAB 1 — Menu Header
// ══════════════════════════════════════════════════════════════════════════════
function MenuHeaderTab() {
  const EMPTY = {
    part1: "",
    part2: "",
    description: "",
    isActive: true,
    imageUrl: "",
    imageFile: null,
    propertyId: "",
    existingId: null,
  };

  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const fetchProperties = useCallback(async () => {
    try {
      setLoadingProperties(true);
      const res = await getAllProperties();
      const data = res.data?.data || res.data || res;
      if (Array.isArray(data)) setProperties(data.filter((p) => p.isActive));
    } catch {
      toast.error("Failed to load properties");
    } finally {
      setLoadingProperties(false);
    }
  }, []);

  const fetchHeaders = useCallback(async () => {
    try {
      setFetching(true);
      const res = await getMenuHeaders();
      setHeaders(Array.isArray(res?.data) ? res.data : []);
    } catch {
      toast.error("Failed to load menu headers");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
    fetchHeaders();
  }, [fetchProperties, fetchHeaders]);

  const openAdd = () => {
    setForm(EMPTY);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (h) => {
    setForm({
      part1: h.part1 || "",
      part2: h.part2 || "",
      description: h.description || "",
      isActive: h.isActive ?? true,
      imageUrl: h.image?.url || h.imageUrl || "",
      imageFile: null,
      propertyId: h.propertyId ? String(h.propertyId) : "",
      existingId: h.id,
    });
    setEditingId(h.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.part1.trim()) return toast.error("Part 1 (heading) is required");
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("part1", form.part1.trim());
      fd.append("part2", form.part2.trim());
      fd.append("description", form.description.trim());
      fd.append("isActive", String(form.isActive));
      if (form.propertyId) fd.append("propertyId", form.propertyId);
      if (form.imageFile) fd.append("image", form.imageFile);

      if (form.existingId) {
        await updateMenuHeadersSection(form.existingId, fd);
        toast.success("Menu header updated");
      } else {
        await createMenuHeaderSection(fd);
        toast.success("Menu header created");
      }
      setShowForm(false);
      setEditingId(null);
      await fetchHeaders();
    } catch {
      toast.error("Failed to save menu header");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (h) => {
    try {
      setTogglingId(h.id);
      await toggleMenuHeadersSectionStatus(h.id, { isActive: !h.isActive });
      toast.success(`Header ${h.isActive ? "deactivated" : "activated"}`);
      await fetchHeaders();
    } catch {
      toast.error("Failed to toggle status");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold" style={{ color: colors.textPrimary }}>
          Menu Section Headers
        </h3>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:opacity-90 transition-all"
        >
          <Plus size={14} /> Add Header
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div
          className="rounded-xl border p-5 space-y-4"
          style={{ borderColor: colors.border, backgroundColor: colors.mainBg }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold" style={{ color: colors.textPrimary }}>
              {editingId ? "Edit Menu Header" : "New Menu Header"}
            </span>
            <button
              onClick={() => setShowForm(false)}
              className="p-1 rounded hover:bg-black/10 transition-colors"
              style={{ color: colors.textSecondary }}
            >
              <X size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Heading Part 1" required>
              <input
                className={inp}
                style={{ borderColor: colors.border, backgroundColor: colors.contentBg, color: colors.textPrimary }}
                placeholder="e.g. Our"
                value={form.part1}
                onChange={(e) => set("part1", e.target.value)}
              />
            </Field>
            <Field label="Heading Part 2">
              <input
                className={inp}
                style={{ borderColor: colors.border, backgroundColor: colors.contentBg, color: colors.textPrimary }}
                placeholder="e.g. Menu"
                value={form.part2}
                onChange={(e) => set("part2", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              rows={3}
              className={inp}
              style={{ borderColor: colors.border, backgroundColor: colors.contentBg, color: colors.textPrimary }}
              placeholder="Brief description for the menu section..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Property">
              <select
                className={inp}
                style={{ borderColor: colors.border, backgroundColor: colors.contentBg, color: colors.textPrimary }}
                value={form.propertyId}
                onChange={(e) => set("propertyId", e.target.value)}
                disabled={loadingProperties}
              >
                <option value="">— Select Property (optional) —</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.propertyName}</option>
                ))}
              </select>
            </Field>
            <Field label="Active Status">
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => set("isActive", e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: colors.primary }}
                />
                <span className="text-sm" style={{ color: colors.textPrimary }}>
                  Is Active
                </span>
              </label>
            </Field>
          </div>

          <Field label="Section Image">
            <ImageUpload
              value={form.imageUrl}
              onChange={(url, file) => { set("imageUrl", url); set("imageFile", file); }}
              onClear={() => { set("imageUrl", ""); set("imageFile", null); }}
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg text-xs border transition-colors"
              style={{ borderColor: colors.border, color: colors.textSecondary }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-primary text-white disabled:opacity-50 transition-all"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              {editingId ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {fetching ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin" style={{ color: colors.primary }} size={28} />
        </div>
      ) : headers.length === 0 ? (
        <div className="text-center py-12 text-sm" style={{ color: colors.textSecondary }}>
          No menu headers yet. Click <strong>Add Header</strong> to create one.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: colors.border }}>
          <table className="w-full text-left">
            <thead style={{ backgroundColor: colors.mainBg }}>
              <tr>
                {["Part 1", "Part 2", "Property", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ backgroundColor: colors.contentBg }}>
              {headers.map((h) => {
                const prop = properties.find((p) => p.id === h.propertyId);
                return (
                  <tr key={h.id} className="transition-colors hover:bg-black/5">
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: colors.textPrimary }}>{h.part1 || "—"}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: colors.textSecondary }}>{h.part2 || "—"}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: colors.textSecondary }}>{prop?.propertyName || "Global"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${h.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {h.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(h)} className="p-1.5 rounded hover:bg-muted transition-colors" style={{ color: colors.primary }} title="Edit">
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleToggle(h)}
                          disabled={togglingId === h.id}
                          className="p-1.5 rounded transition-colors"
                          style={{ color: h.isActive ? "#ef4444" : "#22c55e" }}
                          title={h.isActive ? "Deactivate" : "Activate"}
                        >
                          {togglingId === h.id ? <Loader2 size={13} className="animate-spin" /> : h.isActive ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SUB-TAB 2 — Group Booking Header
// ══════════════════════════════════════════════════════════════════════════════
function GroupBookingHeaderTab() {
  const EMPTY = {
    title: "",
    description: "",
    ctaText: "",
    ctaLink: "",
    numberOfPersons: "",
    propertyId: "",
    propertyTypeId: "",
    existingId: null,
  };

  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const fetchDropdowns = useCallback(async () => {
    try {
      setLoadingDropdowns(true);
      const [propRes, typeRes] = await Promise.all([getAllProperties(), getPropertyTypes()]);
      const props = propRes.data?.data || propRes.data || propRes;
      const types = typeRes.data?.data || typeRes.data || typeRes;
      if (Array.isArray(props)) setProperties(props.filter((p) => p.isActive));
      if (Array.isArray(types)) setPropertyTypes(types.filter((t) => t.isActive));
    } catch {
      toast.error("Failed to load properties/types");
    } finally {
      setLoadingDropdowns(false);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      setFetching(true);
      const res = await getGroupBookings();
      const data = res?.data || [];
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load group bookings");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchDropdowns();
    fetchBookings();
  }, [fetchDropdowns, fetchBookings]);

  const openAdd = () => {
    setForm(EMPTY);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (b) => {
    setForm({
      title: b.title || "",
      description: b.description || "",
      ctaText: b.ctaText || "",
      ctaLink: b.ctaLink || "",
      numberOfPersons: b.numberOfPersons ? String(b.numberOfPersons) : "",
      propertyId: b.propertyId ? String(b.propertyId) : "",
      propertyTypeId: b.propertyTypeId ? String(b.propertyTypeId) : "",
      existingId: b.id,
    });
    setEditingId(b.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    try {
      setSaving(true);
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        ctaText: form.ctaText.trim(),
        ctaLink: form.ctaLink.trim(),
        numberOfPersons: form.numberOfPersons ? Number(form.numberOfPersons) : null,
        propertyId: form.propertyId ? Number(form.propertyId) : null,
        propertyTypeId: form.propertyTypeId ? Number(form.propertyTypeId) : null,
      };

      if (form.existingId) {
        await updateGroupBooking(form.existingId, payload);
        toast.success("Group booking header updated");
      } else {
        await addGroupBooking(payload);
        toast.success("Group booking header created");
      }
      setShowForm(false);
      setEditingId(null);
      await fetchBookings();
    } catch {
      toast.error("Failed to save group booking header");
    } finally {
      setSaving(false);
    }
  };

  const getPropertyName = (id) => properties.find((p) => p.id === Number(id))?.propertyName || "—";
  const getTypeName = (id) => propertyTypes.find((t) => t.id === Number(id))?.typeName || "—";

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold" style={{ color: colors.textPrimary }}>
          Group Booking Headers
        </h3>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:opacity-90 transition-all"
        >
          <Plus size={14} /> Add Header
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div
          className="rounded-xl border p-5 space-y-4"
          style={{ borderColor: colors.border, backgroundColor: colors.mainBg }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold" style={{ color: colors.textPrimary }}>
              {editingId ? "Edit Group Booking Header" : "New Group Booking Header"}
            </span>
            <button
              onClick={() => setShowForm(false)}
              className="p-1 rounded hover:bg-black/10 transition-colors"
              style={{ color: colors.textSecondary }}
            >
              <X size={14} />
            </button>
          </div>

          <Field label="Title" required>
            <input
              className={inp}
              style={{ borderColor: colors.border, backgroundColor: colors.contentBg, color: colors.textPrimary }}
              placeholder="e.g. Plan Your Group Event"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </Field>

          <Field label="Description">
            <textarea
              rows={3}
              className={inp}
              style={{ borderColor: colors.border, backgroundColor: colors.contentBg, color: colors.textPrimary }}
              placeholder="Brief description for the group booking section..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="CTA Button Text">
              <input
                className={inp}
                style={{ borderColor: colors.border, backgroundColor: colors.contentBg, color: colors.textPrimary }}
                placeholder="e.g. Book Now"
                value={form.ctaText}
                onChange={(e) => set("ctaText", e.target.value)}
              />
            </Field>
            <Field label="CTA Link">
              <input
                className={inp}
                style={{ borderColor: colors.border, backgroundColor: colors.contentBg, color: colors.textPrimary }}
                placeholder="e.g. /contact"
                value={form.ctaLink}
                onChange={(e) => set("ctaLink", e.target.value)}
              />
            </Field>
            <Field label="Min. Persons">
              <input
                type="number"
                min="1"
                className={inp}
                style={{ borderColor: colors.border, backgroundColor: colors.contentBg, color: colors.textPrimary }}
                placeholder="e.g. 10"
                value={form.numberOfPersons}
                onChange={(e) => set("numberOfPersons", e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Property">
              <select
                className={inp}
                style={{ borderColor: colors.border, backgroundColor: colors.contentBg, color: colors.textPrimary }}
                value={form.propertyId}
                onChange={(e) => set("propertyId", e.target.value)}
                disabled={loadingDropdowns}
              >
                <option value="">— Select Property (optional) —</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.propertyName}</option>
                ))}
              </select>
            </Field>
            <Field label="Property Type">
              <select
                className={inp}
                style={{ borderColor: colors.border, backgroundColor: colors.contentBg, color: colors.textPrimary }}
                value={form.propertyTypeId}
                onChange={(e) => set("propertyTypeId", e.target.value)}
                disabled={loadingDropdowns}
              >
                <option value="">— Select Type (optional) —</option>
                {propertyTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.typeName}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg text-xs border transition-colors"
              style={{ borderColor: colors.border, color: colors.textSecondary }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-primary text-white disabled:opacity-50 transition-all"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              {editingId ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {fetching ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin" style={{ color: colors.primary }} size={28} />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 text-sm" style={{ color: colors.textSecondary }}>
          No group booking headers yet. Click <strong>Add Header</strong> to create one.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: colors.border }}>
          <table className="w-full text-left">
            <thead style={{ backgroundColor: colors.mainBg }}>
              <tr>
                {["Title", "CTA Text", "Min. Persons", "Property", "Type", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ backgroundColor: colors.contentBg }}>
              {bookings.map((b) => (
                <tr key={b.id} className="transition-colors hover:bg-black/5">
                  <td className="px-4 py-3 text-sm font-medium max-w-[200px]" style={{ color: colors.textPrimary }}>
                    <span className="line-clamp-1">{b.title || "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: colors.textSecondary }}>{b.ctaText || "—"}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: colors.textSecondary }}>{b.numberOfPersons ?? "—"}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: colors.textSecondary }}>
                    {b.propertyId ? getPropertyName(b.propertyId) : "Global"}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: colors.textSecondary }}>
                    {b.propertyTypeId ? getTypeName(b.propertyTypeId) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openEdit(b)}
                      className="p-1.5 rounded hover:bg-muted transition-colors"
                      style={{ color: colors.primary }}
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN — Hotel Homepage Tab
// ══════════════════════════════════════════════════════════════════════════════
const SUB_TABS = [
  { id: "menu", label: "Menu Header", icon: BookOpen, component: MenuHeaderTab },
  { id: "group", label: "Group Booking Header", icon: Users, component: GroupBookingHeaderTab },
];

function HotelHomepage() {
  const [activeSubTab, setActiveSubTab] = useState("menu");
  const ActiveComponent = SUB_TABS.find((t) => t.id === activeSubTab)?.component;

  return (
    <div className="space-y-4">
      {/* Sub-tab navigation */}
      <div
        className="flex gap-1 p-1 rounded-xl border"
        style={{ backgroundColor: colors.contentBg, borderColor: colors.border }}
      >
        {SUB_TABS.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex-1 justify-center"
              style={{
                backgroundColor: isActive ? colors.primary : "transparent",
                color: isActive ? "#fff" : colors.textSecondary,
              }}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Sub-tab content */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: colors.contentBg, borderColor: colors.border }}
      >
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}

export default HotelHomepage;
