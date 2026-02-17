import React, { useState } from "react";
import {
  Save, Image as ImageIcon, X, Plus, Trash2,
  Instagram, Facebook, Twitter, MessageCircle,
  Phone, Clock, MapPin, Link,
} from "lucide-react";

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

// ── Image Upload ──────────────────────────────────────────────────────────────
function ImageUpload({ value, onChange, onClear, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="flex items-center gap-2 px-4 py-2 w-fit rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all text-sm text-gray-500 font-medium">
        <ImageIcon size={14} />
        {value ? "Change Image" : "Upload Image"}
        <input type="file" accept="image/*" className="hidden"
          onChange={e => {
            const file = e.target.files?.[0];
            if (!file) return;
            // TODO: replace with uploadMedia(fd) call
            onChange(URL.createObjectURL(file), file);
          }} />
      </label>
      {value && (
        <div className="relative w-full h-52 rounded-xl overflow-hidden border shadow-sm">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button type="button" onClick={onClear}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
            <X size={12} />
          </button>
        </div>
      )}
      {!value && (
        <div className="w-full h-32 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50">
          <ImageIcon size={24} className="text-gray-300" />
        </div>
      )}
    </div>
  );
}

// ── Social icon map ───────────────────────────────────────────────────────────
const SOCIAL_ICONS = {
  instagram: <Instagram size={14} />,
  facebook:  <Facebook size={14} />,
  twitter:   <Twitter size={14} />,
  whatsapp:  <MessageCircle size={14} />,
  other:     <Link size={14} />,
};

const SOCIAL_OPTIONS = ["instagram", "facebook", "twitter", "whatsapp", "other"];

// ── Seed data ─────────────────────────────────────────────────────────────────
const INITIAL = {
  // Hero badge
  badgeLabel:    "KENNEDIA BLU RESTAURANT GHAZIABAD",

  // Headline
  headlineLine1: "Experience elegance, taste",
  headlineLine2: "and unforgettable dining.",

  // Description — stored as plain text; bold/italic applied via HTML in website
  description:
    'We believe dining is more than just a meal; it\'s a **curated premium experience**. Our philosophy balances bold Indian tradition with refined global elegance, all within a *thoughtfully designed setting.*',

  // Restaurant image
  image:     "",
  imageFile: null,

  // Social links
  socialLinks: [
    { id: 1, platform: "instagram", url: "" },
    { id: 2, platform: "facebook",  url: "" },
    { id: 3, platform: "twitter",   url: "" },
    { id: 4, platform: "whatsapp",  url: "" },
  ],

  // Availability
  openTime:  "11:00",
  closeTime: "23:30",
  days:      "Monday — Sunday",

  // Connect card
  connectLabel:    "CONNECT",
  connectTitle:    "Get In Touch",
  connectSubtitle: "DIRECT RESERVATION",

  // Quick connect
  whatsappNumber: "",
  callNumber:     "",
};

// ─────────────────────────────────────────────────────────────────────────────
// LIVE PREVIEW (mini replica of website section)
// ─────────────────────────────────────────────────────────────────────────────
function LivePreview({ form }) {
  return (
    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Live Preview</p>
      <div className="bg-white rounded-xl border p-5 flex gap-6 shadow-sm">
        {/* Left image placeholder */}
        <div className="w-32 h-28 rounded-xl overflow-hidden border shrink-0 bg-gray-100 flex items-center justify-center">
          {form.image
            ? <img src={form.image} alt="" className="w-full h-full object-cover" />
            : <ImageIcon size={20} className="text-gray-300" />
          }
        </div>
        {/* Right content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="text-[9px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-1">
            <MapPin size={9} /> {form.badgeLabel}
          </p>
          <p className="text-sm font-serif text-gray-800 leading-tight">{form.headlineLine1}</p>
          <p className="text-sm font-serif italic text-gray-400 leading-tight">{form.headlineLine2}</p>
          <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">{form.description}</p>
          <div className="flex gap-4 pt-1">
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Availability</p>
              <p className="text-xs font-semibold text-gray-700">
                {form.openTime} — {form.closeTime}
              </p>
              <p className="text-[9px] uppercase text-gray-400">{form.days}</p>
            </div>
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">{form.connectLabel}</p>
              <p className="text-xs font-semibold text-gray-700">{form.connectTitle}</p>
              <p className="text-[9px] uppercase text-gray-400">{form.connectSubtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function ResturantAbout({ propertyData, refreshData }) {
  const [form, setForm]     = useState(INITIAL);
  const [saving, setSaving] = useState(false);
  const [activePanel, setActivePanel] = useState("content"); // "content" | "media" | "connect"

  const set    = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setArr = (k, idx, field, val) =>
    setForm(p => ({
      ...p,
      [k]: p[k].map((item, i) => i === idx ? { ...item, [field]: val } : item),
    }));

  const addSocialLink = () =>
    setForm(p => ({
      ...p,
      socialLinks: [...p.socialLinks, { id: Date.now(), platform: "other", url: "" }],
    }));

  const removeSocialLink = (id) =>
    setForm(p => ({ ...p, socialLinks: p.socialLinks.filter(s => s.id !== id) }));

  const handleSave = async () => {
    setSaving(true);
    // TODO: await updateRestaurantAbout(form)
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
  };

  const panels = [
    { key: "content", label: "Content" },
    { key: "media",   label: "Image & Social" },
    { key: "connect", label: "Connect" },
  ];

  return (
    <div className="space-y-5">

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-800">About Section</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage the restaurant story, image, social links, and contact details
          </p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-bold bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-60">
          {saving ? "Saving..." : <><Save size={14} /> Save All</>}
        </button>
      </div>

      {/* ── Panel switcher ────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {panels.map(t => (
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

      {/* ── CONTENT PANEL ─────────────────────────────────────────────────── */}
      {activePanel === "content" && (
        <div className="space-y-4">

          <Section title="Badge & Location">
            <Field label="Badge Label (shown in red above headline)">
              <div className="relative">
                <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400" />
                <input className={`${inp} pl-8`} value={form.badgeLabel}
                  onChange={e => set("badgeLabel", e.target.value)}
                  placeholder="KENNEDIA BLU RESTAURANT GHAZIABAD" />
              </div>
            </Field>
          </Section>

          <Section title="Headline">
            <Field label="Line 1 (normal serif, e.g. &quot;Experience elegance, taste&quot;)">
              <input className={inp} value={form.headlineLine1}
                onChange={e => set("headlineLine1", e.target.value)}
                placeholder="Experience elegance, taste" />
            </Field>
            <Field label="Line 2 (italic/muted, e.g. &quot;and unforgettable dining.&quot;)">
              <input className={inp} value={form.headlineLine2}
                onChange={e => set("headlineLine2", e.target.value)}
                placeholder="and unforgettable dining." />
            </Field>
          </Section>

          <Section title="Description">
            <p className="text-[10px] text-gray-400 mb-1">
              Use <code className="bg-gray-100 px-1 rounded">**text**</code> for bold and{" "}
              <code className="bg-gray-100 px-1 rounded">*text*</code> for italic (rendered on website).
            </p>
            <textarea className={inp} rows={5} value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder='We believe dining is more than j' />
          </Section>

          <Section title="Availability">
            <div className="flex gap-3">
              <Field label="Opening Time" half>
                <div className="relative">
                  <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="time" className={`${inp} pl-8`} value={form.openTime}
                    onChange={e => set("openTime", e.target.value)} />
                </div>
              </Field>
              <Field label="Closing Time" half>
                <div className="relative">
                  <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="time" className={`${inp} pl-8`} value={form.closeTime}
                    onChange={e => set("closeTime", e.target.value)} />
                </div>
              </Field>
            </div>
            <Field label="Days (e.g. Monday — Sunday)">
              <input className={inp} value={form.days}
                onChange={e => set("days", e.target.value)}
                placeholder="Monday — Sunday" />
            </Field>
          </Section>

          {/* Live preview */}
          <LivePreview form={form} />
        </div>
      )}

      {/* ── MEDIA PANEL ───────────────────────────────────────────────────── */}
      {activePanel === "media" && (
        <div className="space-y-4">

          <Section title="Restaurant Image (shown on left side)">
            <ImageUpload
              value={form.image}
              onChange={(url, file) => { set("image", url); set("imageFile", file); }}
              onClear={() => { set("image", ""); set("imageFile", null); }}
            />
          </Section>

          <Section title="Social Links (shown as icon buttons on image)">
            <div className="space-y-2">
              {form.socialLinks.map((link, idx) => (
                <div key={link.id} className="flex gap-2 items-center">
                  {/* Platform selector */}
                  <select
                    className="border border-gray-200 rounded-lg px-2 py-2 text-sm text-gray-700 bg-white outline-none focus:border-blue-400 shrink-0 w-36"
                    value={link.platform}
                    onChange={e => setArr("socialLinks", idx, "platform", e.target.value)}>
                    {SOCIAL_OPTIONS.map(p => (
                      <option key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>

                  {/* Icon preview */}
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border shrink-0 text-gray-500">
                    {SOCIAL_ICONS[link.platform] || SOCIAL_ICONS.other}
                  </div>

                  {/* URL */}
                  <input className={`${inp} flex-1`} value={link.url}
                    onChange={e => setArr("socialLinks", idx, "url", e.target.value)}
                    placeholder={
                      link.platform === "whatsapp" ? "WhatsApp number or link" :
                      link.platform === "instagram" ? "https://instagram.com/..." :
                      link.platform === "facebook"  ? "https://facebook.com/..." :
                      link.platform === "twitter"   ? "https://twitter.com/..." :
                      "https://..."
                    }
                  />

                  <button onClick={() => removeSocialLink(link.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-all shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={addSocialLink}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all w-fit mt-1">
              <Plus size={13} /> Add Social Link
            </button>
          </Section>
        </div>
      )}

      {/* ── CONNECT PANEL ─────────────────────────────────────────────────── */}
      {activePanel === "connect" && (
        <div className="space-y-4">

          <Section title="Connect Card (shown beside Availability)">
            <div className="flex gap-3">
              <Field label="Section Label (small caps above)" half>
                <input className={inp} value={form.connectLabel}
                  onChange={e => set("connectLabel", e.target.value)}
                  placeholder="CONNECT" />
              </Field>
              <Field label="Title" half>
                <input className={inp} value={form.connectTitle}
                  onChange={e => set("connectTitle", e.target.value)}
                  placeholder="Get In Touch" />
              </Field>
            </div>
            <Field label="Subtitle (small caps below title)">
              <input className={inp} value={form.connectSubtitle}
                onChange={e => set("connectSubtitle", e.target.value)}
                placeholder="DIRECT RESERVATION" />
            </Field>
          </Section>

          <Section title="Quick Connect Methods">
            {/* WhatsApp */}
            <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <MessageCircle size={15} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700">WhatsApp</p>
                  <p className="text-[10px] text-gray-400">Instant Chat</p>
                </div>
              </div>
              <Field label="WhatsApp Number / Link">
                <div className="relative">
                  <MessageCircle size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" />
                  <input className={`${inp} pl-8`} value={form.whatsappNumber}
                    onChange={e => set("whatsappNumber", e.target.value)}
                    placeholder="+91 9876543210 or https://wa.me/..." />
                </div>
              </Field>
            </div>

            {/* Direct Call */}
            <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                  <Phone size={15} className="text-rose-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700">Direct Call</p>
                  <p className="text-[10px] text-gray-400">Speak to Host</p>
                </div>
              </div>
              <Field label="Phone Number">
                <div className="relative">
                  <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500" />
                  <input className={`${inp} pl-8`} value={form.callNumber}
                    onChange={e => set("callNumber", e.target.value)}
                    placeholder="+91 9876543210" />
                </div>
              </Field>
            </div>
          </Section>

          {/* Quick Connect preview */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
              Quick Connect Preview
            </p>
            <div className="space-y-1">
              <p className="text-[10px] text-gray-400 font-semibold uppercase">Quick Connect</p>
              <p className="text-[10px] text-gray-400">Choose preferred method</p>
              <div className="flex gap-2 pt-1">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-xs font-bold text-green-700">
                  <MessageCircle size={12} /> WhatsApp
                  <span className="text-[9px] font-normal text-green-500">Instant Chat</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                  <Phone size={12} /> Direct Call
                  <span className="text-[9px] font-normal text-rose-400">Speak to Host</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default ResturantAbout;