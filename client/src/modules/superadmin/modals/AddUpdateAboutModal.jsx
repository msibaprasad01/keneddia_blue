import React, { useState, useEffect } from "react";
import { colors } from "@/lib/colors/colors";
import {
  X,
  Loader2,
  Trash2,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import { addAboutUs, updateAboutUsById } from "@/Api/Api";
import { toast } from "react-hot-toast";

function AddUpdateAboutModal({ isOpen, onClose, editData = null }) {
  const [formData, setFormData] = useState({
    sectionTitle: "",
    subTitle: "",
    description: "",
    videoUrl: "",
    videoTitle: "",
    ctaButtonText: "More Details →",
    ctaButtonUrl: "",
  });

  // mediaItems will store either existing URLs or local File objects
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData && isOpen) {
      setFormData({
        sectionTitle: editData.sectionTitle || "",
        subTitle: editData.subTitle || "",
        description: editData.description || "",
        videoUrl: editData.videoUrl || "",
        videoTitle: editData.videoTitle || "",
        ctaButtonText: editData.ctaButtonText || "More Details →",
        ctaButtonUrl: editData.ctaButtonUrl || "",
      });

      // Map existing media from the 'media' array returned by backend
      if (editData.media && Array.isArray(editData.media)) {
        setMediaItems(
          editData.media.map((m) => ({
            id: m.id,
            url: m.url,
            file: null,      // No local file for existing items
            isExisting: true, // Flag to identify items already on server
          }))
        );
      }
    } else if (!isOpen) {
      resetForm();
    }
  }, [editData, isOpen]);

  const resetForm = () => {
    setFormData({
      sectionTitle: "",
      subTitle: "",
      description: "",
      videoUrl: "",
      videoTitle: "",
      ctaButtonText: "More Details →",
      ctaButtonUrl: "",
    });
    // Clean up local preview URLs to free memory
    mediaItems.forEach(item => {
      if (item.url && item.url.startsWith('blob:')) {
        URL.revokeObjectURL(item.url);
      }
    });
    setMediaItems([]);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddMediaSlot = () => {
    setMediaItems((prev) => [
      ...prev,
      { id: Date.now(), url: "", file: null, isExisting: false },
    ]);
  };

  const handleRemoveMediaItem = (id) => {
    setMediaItems((prev) => {
      const itemToRemove = prev.find(item => item.id === id);
      if (itemToRemove?.url?.startsWith('blob:')) {
        URL.revokeObjectURL(itemToRemove.url);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleFileSelect = (id, file) => {
    if (!file) return;

    // Create local preview
    const previewUrl = URL.createObjectURL(file);

    setMediaItems((prev) =>
      prev.map((item) =>
        item.id === id 
          ? { ...item, file: file, url: previewUrl } 
          : item
      )
    );
  };

  const handleSubmit = async () => {
    if (!formData.sectionTitle.trim() || !formData.subTitle.trim()) {
      toast.error("Section title and subtitle are required");
      return;
    }

    try {
      setLoading(true);

      // 1. Collect URLs of images that were ALREADY on the server (to keep them)
      const existingMediaUrls = mediaItems
        .filter((item) => item.isExisting && item.url)
        .map((item) => item.url);

      // 2. Collect NEW File objects from the local state
      const newFiles = mediaItems
        .filter((item) => item.file instanceof File)
        .map((item) => item.file);

      // 3. Match Postman structure: payload contains text data + separate files array
      const payload = {
        sectionTitle: formData.sectionTitle.trim(),
        subTitle: formData.subTitle.trim(),
        description: formData.description.trim(),
        videoUrl: formData.videoUrl.trim(),
        videoTitle: formData.videoTitle.trim(),
        ctaButtonText: formData.ctaButtonText.trim(),
        ctaButtonUrl: formData.ctaButtonUrl.trim(),
        mediaUrls: existingMediaUrls, // Backend needs this to know which old images to keep
        files: newFiles,              // Backend processes these as 'files' multipart
      };

      if (editData?.id) {
        await updateAboutUsById(editData.id, payload);
        toast.success("About Us updated successfully");
      } else {
        await addAboutUs(payload);
        toast.success("About Us created successfully");
      }

      onClose(true);
      resetForm();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error?.response?.data?.message || "Failed to save section");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl" style={{ backgroundColor: colors.contentBg }}>
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: colors.contentBg, borderColor: colors.border }}>
          <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            {editData ? "Update About Us" : "Add About Us"}
          </h3>
          <button onClick={() => onClose(false)} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Info Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-400">Section Title</label>
              <input value={formData.sectionTitle} onChange={(e) => handleInputChange("sectionTitle", e.target.value)} className="w-full px-4 py-2 rounded-lg border text-sm" style={{ backgroundColor: colors.mainBg }} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-400">Sub Title</label>
              <input value={formData.subTitle} onChange={(e) => handleInputChange("subTitle", e.target.value)} className="w-full px-4 py-2 rounded-lg border text-sm" style={{ backgroundColor: colors.mainBg }} />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-400">Description</label>
              <textarea rows={3} value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} className="w-full px-4 py-2 rounded-lg border text-sm resize-none" style={{ backgroundColor: colors.mainBg }} />
            </div>
          </div>

          {/* YouTube Video Section */}
          <div className="p-4 rounded-xl border border-dashed" style={{ borderColor: colors.border }}>
            <h4 className="text-xs font-bold uppercase mb-4 text-primary">YouTube Video Feature</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Video Title" value={formData.videoTitle} onChange={(e) => handleInputChange("videoTitle", e.target.value)} className="w-full px-4 py-2 rounded-lg border text-sm" style={{ backgroundColor: colors.mainBg }} />
              <input placeholder="YouTube URL" value={formData.videoUrl} onChange={(e) => handleInputChange("videoUrl", e.target.value)} className="w-full px-4 py-2 rounded-lg border text-sm" style={{ backgroundColor: colors.mainBg }} />
            </div>
          </div>

          {/* Image Gallery Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase text-primary">Image Gallery (Files)</h4>
              <button onClick={handleAddMediaSlot} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold" style={{ color: colors.primary, borderColor: colors.primary }}>
                <Plus size={14} /> Add Image Slot
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {mediaItems.map((item) => (
                <div key={item.id} className="relative p-3 rounded-xl border bg-gray-50 group" style={{ borderColor: colors.border }}>
                  <button onClick={() => handleRemoveMediaItem(item.id)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Trash2 size={12} />
                  </button>
                  
                  <div className="space-y-3">
                    {/* Only show file input for NEW slots, not existing server images */}
                    {!item.isExisting && (
                      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-2 min-h-[100px] border-gray-300">
                        {item.url ? (
                          <img src={item.url} alt="Preview" className="h-20 w-full object-cover rounded-lg" />
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center">
                            <ImageIcon className="text-gray-400" size={24} />
                            <span className="text-[10px] mt-1 text-gray-500">Choose File</span>
                            <input type="file" accept="image/*" onChange={(e) => handleFileSelect(item.id, e.target.files[0])} className="hidden" />
                          </label>
                        )}
                      </div>
                    )}

                    {/* Show existing images from server */}
                    {item.isExisting && (
                      <div className="relative">
                        <img src={item.url} alt="Server Image" className="h-24 w-full object-cover rounded-lg border" />
                        <div className="absolute top-1 left-1 bg-blue-500 text-white text-[8px] px-1.5 py-0.5 rounded">Saved</div>
                      </div>
                    )}
                    
                    {item.file && <p className="text-[10px] text-center text-green-600 font-bold">New File Selected</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t flex gap-3" style={{ borderColor: colors.border }}>
          <button onClick={() => onClose(false)} className="flex-1 py-3 rounded-xl font-bold text-sm border hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} className="flex-[2] py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-50" style={{ backgroundColor: colors.primary }}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : (editData ? "Update Section" : "Save Section")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddUpdateAboutModal;