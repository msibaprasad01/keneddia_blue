// components/modals/AddHeroSectionModal.jsx
import React, { useState, useEffect } from "react";
import { colors } from "@/lib/colors/colors";
import { Upload, X, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  uploadHeroMediaBulk,
  createHeroSection,
  updateHeroSectionById,
} from "@/Api/Api";

function AddHeroSectionModal({ isOpen, onClose, onSuccess, editData = null }) {
  // 1. Defaults & State
  const [formData, setFormData] = useState({
    mainTitle: "",
    subTitle: "",
    ctaText: "",
    active: false, // Default changed to false
    showOnHomepage: false,
  });

  const [backgroundMedia, setBackgroundMedia] = useState({
    theme: "ALL", 
    allFiles: [], allPreviews: [], allMediaTypes: [], allMediaIds: [],
    lightFiles: [], lightPreviews: [], lightMediaTypes: [], lightMediaIds: [],
    darkFiles: [], darkPreviews: [], darkMediaTypes: [], darkMediaIds: [],
  });

  const [subMedia, setSubMedia] = useState({
    theme: "ALL",
    allFiles: [], allPreviews: [], allMediaTypes: [], allMediaIds: [],
    lightFiles: [], lightPreviews: [], lightMediaTypes: [], lightMediaIds: [],
    darkFiles: [], darkPreviews: [], darkMediaTypes: [], darkMediaIds: [],
  });

  const [showPreview, setShowPreview] = useState(true);
  const [previewTheme, setPreviewTheme] = useState("LIGHT");
  const [loading, setLoading] = useState(false);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);

  // 2. Form Reset & Initialization
  useEffect(() => {
    if (!isOpen) {
      setFormData({ mainTitle: "", subTitle: "", ctaText: "", active: false, showOnHomepage: false });
      const resetMedia = {
        theme: "ALL", allFiles: [], allPreviews: [], allMediaTypes: [], allMediaIds: [],
        lightFiles: [], lightPreviews: [], lightMediaTypes: [], lightMediaIds: [],
        darkFiles: [], darkPreviews: [], darkMediaTypes: [], darkMediaIds: [],
      };
      setBackgroundMedia(resetMedia);
      setSubMedia(resetMedia);
      setLoading(false);
    }
  }, [isOpen]);

  // 3. Edit Data Population
  useEffect(() => {
    if (editData && isOpen) {
      setFormData({
        mainTitle: editData.mainTitle || "",
        subTitle: editData.subTitle || "",
        ctaText: editData.ctaText || "",
        active: editData.active ?? false,
        showOnHomepage: editData.showOnHomepage ?? false,
      });

      // Background Media Logic
      if (editData.backgroundAll?.length > 0) {
        setBackgroundMedia(prev => ({
          ...prev, theme: "ALL",
          allPreviews: editData.backgroundAll.map(m => m.url),
          allMediaTypes: editData.backgroundAll.map(m => m.type),
          allMediaIds: editData.backgroundAll.map(m => m.mediaId),
        }));
      } else {
        setBackgroundMedia(prev => ({
          ...prev, theme: "SPLIT",
          lightPreviews: editData.backgroundLight?.map(m => m.url) || [],
          lightMediaTypes: editData.backgroundLight?.map(m => m.type) || [],
          lightMediaIds: editData.backgroundLight?.map(m => m.mediaId) || [],
          darkPreviews: editData.backgroundDark?.map(m => m.url) || [],
          darkMediaTypes: editData.backgroundDark?.map(m => m.type) || [],
          darkMediaIds: editData.backgroundDark?.map(m => m.mediaId) || [],
        }));
      }

      // Sub Media Logic
      if (editData.subAll?.length > 0) {
        setSubMedia(prev => ({
          ...prev, theme: "ALL",
          allPreviews: editData.subAll.map(m => m.url),
          allMediaTypes: editData.subAll.map(m => m.type),
          allMediaIds: editData.subAll.map(m => m.mediaId),
        }));
      } else {
        setSubMedia(prev => ({
          ...prev, theme: "SPLIT",
          lightPreviews: editData.subLight?.map(m => m.url) || [],
          lightMediaTypes: editData.subLight?.map(m => m.type) || [],
          lightMediaIds: editData.subLight?.map(m => m.mediaId) || [],
          darkPreviews: editData.subDark?.map(m => m.url) || [],
          darkMediaTypes: editData.subDark?.map(m => m.type) || [],
          darkMediaIds: editData.subDark?.map(m => m.mediaId) || [],
        }));
      }
    }
  }, [editData, isOpen]);

  // 4. Input Handlers
  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleMultipleFilesChange = (mediaType, theme, files, isBackground = true) => {
    if (!files || files.length === 0) return;
    const filesArray = Array.from(files);
    const newPreviews = [], newMediaTypes = [], newFiles = [];

    filesArray.forEach(file => {
      const type = file.type.startsWith("image/") ? "IMAGE" : "VIDEO";
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
      newMediaTypes.push(type);
    });

    const setter = isBackground ? setBackgroundMedia : setSubMedia;
    const key = theme === "LIGHT" ? "light" : theme === "DARK" ? "dark" : "all";

    setter(prev => ({
      ...prev,
      [`${key}Files`]: [...prev[`${key}Files`], ...newFiles],
      [`${key}Previews`]: [...prev[`${key}Previews`], ...newPreviews],
      [`${key}MediaTypes`]: [...prev[`${key}MediaTypes`], ...newMediaTypes],
    }));
  };

  const removeMediaAtIndex = (theme, index, isBackground = true) => {
    const setter = isBackground ? setBackgroundMedia : setSubMedia;
    const key = theme === "LIGHT" ? "light" : theme === "DARK" ? "dark" : "all";
    setter(prev => ({
      ...prev,
      [`${key}Files`]: prev[`${key}Files`].filter((_, i) => i !== index),
      [`${key}Previews`]: prev[`${key}Previews`].filter((_, i) => i !== index),
      [`${key}MediaTypes`]: prev[`${key}MediaTypes`].filter((_, i) => i !== index),
      [`${key}MediaIds`]: prev[`${key}MediaIds`].filter((_, i) => i !== index),
    }));
  };

  const handleThemeChange = (newTheme, isBackground = true) => {
    const setter = isBackground ? setBackgroundMedia : setSubMedia;
    setter(prev => ({ ...prev, theme: newTheme }));
  };

  // 5. API Logic
  const processUpload = async (files) => {
    if (!files || files.length === 0) return [];
    const uploadData = new FormData();
    files.forEach(f => uploadData.append("files", f));
    // Determine mediaType based on first file
    const type = files[0].type.startsWith("image/") ? "IMAGE" : "VIDEO";
    uploadData.append("mediaType", type);
    
    const response = await uploadHeroMediaBulk(uploadData);
    const data = response?.data?.data || response?.data || response;
    return Array.isArray(data) ? data.map(m => m.mediaId) : [];
  };

  const validateForm = () => {
    const hasText = formData.mainTitle.trim() || formData.subTitle.trim() || formData.ctaText.trim();
    const hasBg = backgroundMedia.allPreviews.length > 0 || backgroundMedia.lightPreviews.length > 0 || backgroundMedia.darkPreviews.length > 0;
    if (!hasText && !hasBg) {
      toast.error("Please provide at least a Title or Background Media.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      // Parallel uploads per category for precise ID mapping
      const [bgAll, bgLight, bgDark, subAll, subLight, subDark] = await Promise.all([
        processUpload(backgroundMedia.allFiles),
        processUpload(backgroundMedia.lightFiles),
        processUpload(backgroundMedia.darkFiles),
        processUpload(subMedia.allFiles),
        processUpload(subMedia.lightFiles),
        processUpload(subMedia.darkFiles),
      ]);

      const payload = {
        mainTitle: formData.mainTitle || null,
        subTitle: formData.subTitle || null,
        ctaText: formData.ctaText || null,
        active: formData.active,
        showOnHomepage: formData.showOnHomepage,
        backgroundAll: backgroundMedia.theme === "ALL" ? [...backgroundMedia.allMediaIds, ...bgAll] : [],
        backgroundLight: backgroundMedia.theme === "SPLIT" ? [...backgroundMedia.lightMediaIds, ...bgLight] : [],
        backgroundDark: backgroundMedia.theme === "SPLIT" ? [...backgroundMedia.darkMediaIds, ...bgDark] : [],
        subAll: subMedia.theme === "ALL" ? [...subMedia.allMediaIds, ...subAll] : [],
        subLight: subMedia.theme === "SPLIT" ? [...subMedia.lightMediaIds, ...subLight] : [],
        subDark: subMedia.theme === "SPLIT" ? [...subMedia.darkMediaIds, ...subDark] : [],
      };

      if (editData?.id) {
        await updateHeroSectionById(editData.id, payload);
        toast.success("Hero Section updated!");
      } else {
        await createHeroSection(payload);
        toast.success("Hero Section created!");
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-7xl max-h-[92vh] overflow-hidden rounded-xl shadow-2xl flex flex-col" 
           style={{ backgroundColor: colors.contentBg }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: colors.border }}>
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{editData ? "Edit Hero Section" : "Add Hero Section"}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors"><X size={20} /></button>
        </div>

        {/* Body */}
        <div className="flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-b border-t" style={{ borderColor: colors.border }}>
            
            {/* Left Column: Form with Grid Lines */}
            <div className="flex flex-col divide-y divide-gray-200" style={{ borderColor: colors.border }}>
              
              {/* Text Fields Section */}
              <div className="p-6 space-y-4">
                {[{ label: "Main Title", field: "mainTitle" }, { label: "Subtitle", field: "subTitle" }, { label: "CTA Button", field: "ctaText" }].map(item => (
                  <div key={item.field} className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{item.label}</label>
                    <input type="text" value={formData[item.field]} onChange={e => handleInputChange(item.field, e.target.value)} 
                           className="px-4 py-2.5 border rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                ))}
              </div>

              {/* Background Media with Dropdown BG fixed */}
              <div className="p-6 bg-gray-50/50">
                <div className="flex items-center justify-between mb-6">
                  <label className="text-sm font-bold">Background Media</label>
                  <select value={backgroundMedia.theme} onChange={e => handleThemeChange(e.target.value, true)} 
                          className="px-3 py-2 border rounded-lg text-xs font-bold bg-white shadow-sm outline-none cursor-pointer hover:border-primary transition-colors">
                    <option value="ALL">All Themes</option>
                    <option value="SPLIT">Separate for Light & Dark</option>
                  </select>
                </div>
                {backgroundMedia.theme === "ALL" ? (
                  <MediaUploader label="All Themes" previews={backgroundMedia.allPreviews} types={backgroundMedia.allMediaTypes}
                                 onUpload={f => handleMultipleFilesChange("bg", "ALL", f, true)} onRemove={i => removeMediaAtIndex("ALL", i, true)} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MediaUploader label="Light Theme" previews={backgroundMedia.lightPreviews} types={backgroundMedia.lightMediaTypes}
                                   onUpload={f => handleMultipleFilesChange("bg", "LIGHT", f, true)} onRemove={i => removeMediaAtIndex("LIGHT", i, true)} />
                    <MediaUploader label="Dark Theme" previews={backgroundMedia.darkPreviews} types={backgroundMedia.darkMediaTypes}
                                   onUpload={f => handleMultipleFilesChange("bg", "DARK", f, true)} onRemove={i => removeMediaAtIndex("DARK", i, true)} />
                  </div>
                )}
              </div>

              {/* Sub Media Section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <label className="text-sm font-bold">Sub Media (Optional)</label>
                  <select value={subMedia.theme} onChange={e => handleThemeChange(e.target.value, false)} 
                          className="px-3 py-2 border rounded-lg text-xs font-bold bg-white shadow-sm outline-none cursor-pointer">
                    <option value="ALL">All Themes</option>
                    <option value="SPLIT">Separate for Light & Dark</option>
                  </select>
                </div>
                {subMedia.theme === "ALL" ? (
                  <MediaUploader label="All Themes" previews={subMedia.allPreviews} types={subMedia.allMediaTypes}
                                 onUpload={f => handleMultipleFilesChange("sub", "ALL", f, false)} onRemove={i => removeMediaAtIndex("ALL", i, false)} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MediaUploader label="Light Theme" previews={subMedia.lightPreviews} types={subMedia.lightMediaTypes}
                                   onUpload={f => handleMultipleFilesChange("sub", "LIGHT", f, false)} onRemove={i => removeMediaAtIndex("LIGHT", i, false)} />
                    <MediaUploader label="Dark Theme" previews={subMedia.darkPreviews} types={subMedia.darkMediaTypes}
                                   onUpload={f => handleMultipleFilesChange("sub", "DARK", f, false)} onRemove={i => removeMediaAtIndex("DARK", i, false)} />
                  </div>
                )}
              </div>

              {/* Switches Section */}
              <div className="p-6 flex items-center gap-10">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={formData.active} onChange={e => handleInputChange("active", e.target.checked)} className="w-4 h-4 rounded accent-primary" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">Set as Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={formData.showOnHomepage} onChange={e => handleInputChange("showOnHomepage", e.target.checked)} className="w-4 h-4 rounded accent-primary" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">Show on Homepage</span>
                </label>
              </div>
            </div>

            {/* Right Column: Preview */}
            <div className="bg-gray-100 p-8 flex flex-col gap-6 border-l" style={{ borderColor: colors.border }}>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Live Preview</h3>
                <button onClick={() => setPreviewTheme(t => t === "LIGHT" ? "DARK" : "LIGHT")} className="text-[10px] font-bold px-3 py-1.5 bg-white border rounded shadow-sm hover:bg-gray-50">
                  Switching to: {previewTheme === "LIGHT" ? "Dark" : "Light"}
                </button>
              </div>
              
              <div className="w-full aspect-video rounded-xl bg-black overflow-hidden relative shadow-2xl border-4 border-white">
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 text-white bg-black/40">
                  <h1 className="text-3xl font-bold mb-1 leading-tight">{formData.mainTitle || "Main Title Preview"}</h1>
                  <p className="text-[10px] uppercase tracking-[0.4em] mb-6 opacity-70">{formData.subTitle || "Subtitle Display"}</p>
                  {formData.ctaText && <button className="px-6 py-2 rounded-full text-xs font-bold bg-primary text-white shadow-lg">{formData.ctaText}</button>}
                </div>
                {/* Background placeholder logic could go here */}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-end gap-3 bg-gray-50" style={{ borderColor: colors.border }}>
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg border font-bold text-sm hover:bg-white transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="px-8 py-2.5 rounded-lg font-bold text-sm text-white bg-primary disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
            {loading ? <Loader2 size={16} className="animate-spin" /> : (editData ? "Update Hero" : "Create Hero")}
          </button>
        </div>
      </div>
    </div>
  );
}

// Media Uploader helper
function MediaUploader({ label, previews, types, onUpload, onRemove }) {
  const inputId = React.useId();
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{label}</p>
      <div className="flex flex-wrap gap-3">
        {previews.map((p, i) => (
          <div key={i} className="relative w-20 h-20 rounded-lg border-2 overflow-hidden group bg-white shadow-sm border-white">
            {types[i] === "IMAGE" ? <img src={p} className="w-full h-full object-cover" /> : <video src={p} className="w-full h-full object-cover" />}
            <button onClick={() => onRemove(i)} className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>
          </div>
        ))}
        <label htmlFor={inputId} className="w-20 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-300 hover:text-primary hover:border-primary cursor-pointer transition-all hover:bg-white">
          <Upload size={18} />
          <input type="file" id={inputId} className="hidden" multiple accept="image/*,video/*" onChange={e => onUpload(e.target.files)} />
        </label>
      </div>
    </div>
  );
}

export default AddHeroSectionModal;