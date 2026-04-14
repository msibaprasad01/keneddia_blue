import React, { useState, useEffect, useCallback, useMemo } from "react";
import { colors } from "@/lib/colors/colors";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  Trash2,
  Video,
  ImageIcon,
  Calendar,
  Pencil,
  X,
  Tag,
  Type,
  Eye,
  User,
  Phone,
  Mail,
  Building2,
  Volume2,
  VolumeX,
  ChevronLeft as ArrowLeft,
  ChevronRight as ArrowRight,
} from "lucide-react";
import {
  getGuestExperienceSection,
  deleteGuestExperience,
  addGuestExperienceSectionHeader,
  getGuestExperienceSectionHeader,
  addGuestExperineceRatingHeader,
  getGuestExperineceRatingHeader,
  EditGuestExperineceRatingHeader,
  getAllProperties,
  getPropertyTypes,
} from "@/Api/Api";
import { toast } from "react-hot-toast";

const formatDateTime = (isoString) => {
  if (!isoString) return { date: "—", time: "—" };
  const dt = new Date(isoString);
  const date = dt.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = dt.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return { date, time };
};

// ── Media helpers (same logic as Testimonials.jsx) ────────────────────────────
const isYoutubeUrl = (url) =>
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(url?.trim() ?? "");

const getYoutubeId = (url) => {
  if (!url) return null;
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^"&?/\s]{11})/);
  if (shortsMatch) return shortsMatch[1];
  const shortMatch = url.match(/youtu\.be\/([^"&?/\s]{11})/);
  if (shortMatch) return shortMatch[1];
  const longMatch = url.match(/[?&]v=([^"&?/\s]{11})/);
  if (longMatch) return longMatch[1];
  const embedMatch = url.match(/embed\/([^"&?/\s]{11})/);
  if (embedMatch) return embedMatch[1];
  return null;
};

const buildMediaList = (item) => {
  const allMedia = [];
  const seenUrls = new Set();
  const add = (type, url) => {
    if (url && typeof url === "string" && url.trim() !== "" && !seenUrls.has(url)) {
      seenUrls.add(url.trim());
      allMedia.push({ type, url: url.trim() });
    }
  };
  if (item.mediaList && Array.isArray(item.mediaList)) {
    item.mediaList.forEach((m) => {
      const url = m.url || m.imageUrl || m.videoUrl;
      if (!url) return;
      const isVid = m.type === "VIDEO" || isYoutubeUrl(url) || /\.(mp4|webm|mov|ogg)$/i.test(url);
      add(isVid ? "video" : "image", url);
    });
  }
  if (item.videoUrl) {
    const isVid = isYoutubeUrl(item.videoUrl) || /\.(mp4|webm|mov|ogg)$/i.test(item.videoUrl);
    if (isVid) add("video", item.videoUrl);
  }
  if (item.imageUrl) add("image", item.imageUrl);
  return allMedia;
};

// ── View Modal ────────────────────────────────────────────────────────────────
function ViewModal({ exp, onClose, properties, propertyTypes }) {
  const [mutedVideos, setMutedVideos] = useState(new Set());
  const [mediaErrors, setMediaErrors] = useState(new Set());
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);

  const allMedia = buildMediaList(exp);
  const validMedia = allMedia.filter((m) => !mediaErrors.has(m.url));
  const { date, time } = formatDateTime(exp.createdAt);

  const propertyName = properties.find((p) => p.id === exp.propertyId)?.propertyName;
  const typeName = propertyTypes.find((t) => t.id === exp.propertyTypeId)?.typeName;

  const toggleMute = (key) =>
    setMutedVideos((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const renderMediaItem = (m, idx) => {
    const videoKey = `video-${m.url}`;
    const isMuted = !mutedVideos.has(videoKey);

    if (m.type === "video") {
      if (isYoutubeUrl(m.url)) {
        const videoId = getYoutubeId(m.url);
        if (!videoId) return null;
        return (
          <div key={idx} className="w-full h-full relative group">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoId}&controls=1&modestbranding=1`}
              className="w-full h-full"
              style={{ border: "none" }}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <button
              onClick={(e) => { e.stopPropagation(); toggleMute(videoKey); }}
              className="absolute bottom-3 right-3 z-20 bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        );
      }
      return (
        <div key={idx} className="relative group w-full h-full">
          <video
            src={m.url}
            className="w-full h-full object-contain bg-black"
            autoPlay
            muted={isMuted}
            loop
            playsInline
            controls
          />
          <button
            onClick={(e) => { e.stopPropagation(); toggleMute(videoKey); }}
            className="absolute bottom-3 right-3 z-20 bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      );
    }
    return (
      <img
        key={idx}
        src={m.url}
        alt=""
        className="w-full h-full object-contain bg-black"
        loading="lazy"
        onError={() => setMediaErrors((prev) => new Set(prev).add(m.url))}
      />
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="admin-modal-overlay absolute inset-0" onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{ backgroundColor: colors.contentBg }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
          style={{ borderColor: colors.border }}
        >
          <h4 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
            Guest Experience Details
          </h4>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-black/10 transition-colors"
            style={{ color: colors.textSecondary }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          {/* Media Section */}
          {validMedia.length > 0 ? (
            <div className="relative bg-black" style={{ height: "320px" }}>
              {renderMediaItem(validMedia[activeMediaIdx], activeMediaIdx)}

              {/* Navigation arrows */}
              {validMedia.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveMediaIdx((i) => (i - 1 + validMedia.length) % validMedia.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-30 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    onClick={() => setActiveMediaIdx((i) => (i + 1) % validMedia.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-30 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
                  >
                    <ArrowRight size={16} />
                  </button>

                  {/* Dot indicators */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
                    {validMedia.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveMediaIdx(i)}
                        className={`rounded-full transition-all ${
                          i === activeMediaIdx ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Count badge */}
                  <div className="absolute top-3 right-3 z-30 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    {activeMediaIdx + 1} / {validMedia.length}
                  </div>
                </>
              )}

              {/* Thumbnail strip for multiple media */}
              {validMedia.length > 1 && (
                <div
                  className="absolute bottom-0 left-0 right-0 z-20 flex gap-1.5 overflow-x-auto px-3 pb-2 pt-8"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}
                >
                  {validMedia.map((m, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveMediaIdx(i)}
                      className={`flex-shrink-0 w-12 h-9 rounded overflow-hidden border-2 transition-all ${
                        i === activeMediaIdx ? "border-white" : "border-transparent opacity-60 hover:opacity-90"
                      }`}
                    >
                      {m.type === "video" ? (
                        isYoutubeUrl(m.url) ? (
                          <img
                            src={`https://img.youtube.com/vi/${getYoutubeId(m.url)}/default.jpg`}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                            <Video size={12} className="text-white/70" />
                          </div>
                        )
                      ) : (
                        <img src={m.url} alt="" className="w-full h-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div
              className="flex items-center justify-center gap-2 py-8 border-b"
              style={{ borderColor: colors.border, backgroundColor: colors.mainBg }}
            >
              <ImageIcon size={20} style={{ color: colors.textSecondary }} />
              <span className="text-sm" style={{ color: colors.textSecondary }}>
                No media attached
              </span>
            </div>
          )}

          {/* Details Grid */}
          <div className="p-5 space-y-4">
            {/* Title */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.textSecondary }}>
                Title
              </p>
              <p className="text-base font-medium" style={{ color: colors.textPrimary }}>
                {exp.title || "—"}
              </p>
            </div>

            {/* Description */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.textSecondary }}>
                Description
              </p>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: colors.textPrimary }}>
                {exp.description || "—"}
              </p>
            </div>

            {/* Author info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                className="flex items-start gap-2.5 p-3 rounded-lg border"
                style={{ backgroundColor: colors.mainBg, borderColor: colors.border }}
              >
                <User size={14} style={{ color: colors.primary }} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: colors.textSecondary }}>Author</p>
                  <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{exp.author || "—"}</p>
                </div>
              </div>
              <div
                className="flex items-start gap-2.5 p-3 rounded-lg border"
                style={{ backgroundColor: colors.mainBg, borderColor: colors.border }}
              >
                <Phone size={14} style={{ color: colors.primary }} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: colors.textSecondary }}>Phone</p>
                  <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{exp.authorPhone || "—"}</p>
                </div>
              </div>
              <div
                className="flex items-start gap-2.5 p-3 rounded-lg border"
                style={{ backgroundColor: colors.mainBg, borderColor: colors.border }}
              >
                <Mail size={14} style={{ color: colors.primary }} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: colors.textSecondary }}>Email</p>
                  <p className="text-sm font-medium break-all" style={{ color: colors.textPrimary }}>{exp.authorEmail || "—"}</p>
                </div>
              </div>
            </div>

            {/* Property / Type / Date / Status */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                className="flex items-start gap-2.5 p-3 rounded-lg border"
                style={{ backgroundColor: colors.mainBg, borderColor: colors.border }}
              >
                <Building2 size={14} style={{ color: colors.primary }} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: colors.textSecondary }}>Property</p>
                  <p className="text-xs font-medium" style={{ color: colors.textPrimary }}>
                    {propertyName || (exp.propertyId ? `ID: ${exp.propertyId}` : "—")}
                  </p>
                </div>
              </div>
              <div
                className="flex items-start gap-2.5 p-3 rounded-lg border"
                style={{ backgroundColor: colors.mainBg, borderColor: colors.border }}
              >
                <Tag size={14} style={{ color: colors.primary }} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: colors.textSecondary }}>Type</p>
                  <p className="text-xs font-medium" style={{ color: colors.textPrimary }}>
                    {typeName || (exp.propertyTypeId ? `ID: ${exp.propertyTypeId}` : "—")}
                  </p>
                </div>
              </div>
              <div
                className="flex items-start gap-2.5 p-3 rounded-lg border"
                style={{ backgroundColor: colors.mainBg, borderColor: colors.border }}
              >
                <Calendar size={14} style={{ color: colors.primary }} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: colors.textSecondary }}>Added On</p>
                  <p className="text-xs font-medium" style={{ color: colors.textPrimary }}>{date}</p>
                  <p className="text-[10px]" style={{ color: colors.textSecondary }}>{time}</p>
                </div>
              </div>
              <div
                className="flex items-start gap-2.5 p-3 rounded-lg border"
                style={{ backgroundColor: colors.mainBg, borderColor: colors.border }}
              >
                <div className="mt-0.5 flex-shrink-0 w-3.5 h-3.5 rounded-full" style={{ backgroundColor: exp.isActive ? "#22c55e" : "#ef4444" }} />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: colors.textSecondary }}>Status</p>
                  <p className="text-xs font-medium" style={{ color: exp.isActive ? "#22c55e" : "#ef4444" }}>
                    {exp.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>

            {/* Review Note */}
            {exp.reviewNote && (
              <div
                className="p-3 rounded-lg border"
                style={{ backgroundColor: colors.mainBg, borderColor: colors.border }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.textSecondary }}>
                  Review Note
                </p>
                <p className="text-sm leading-relaxed" style={{ color: colors.textPrimary }}>
                  {exp.reviewNote}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end px-5 py-4 border-t flex-shrink-0"
          style={{ borderColor: colors.border }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-black/5"
            style={{ borderColor: colors.border, color: colors.textSecondary }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function GuestExp() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Header state
  const [headerData, setHeaderData] = useState(null);
  const [headerFetching, setHeaderFetching] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [form, setForm] = useState({ sectionTag: "", title: "" });

  const [ratingForm, setRatingForm] = useState({
    description: "",
    rating: "",
    isActive: true,
  });
  const [savingRating, setSavingRating] = useState(false);
  const [ratingData, setRatingData] = useState(null);

  // View modal state
  const [viewExp, setViewExp] = useState(null);

  // Filter state
  const [filterPropertyId, setFilterPropertyId] = useState("");
  const [filterTypeId, setFilterTypeId] = useState("");
  const [properties, setProperties] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);

  // Fetch header
  const fetchHeader = useCallback(async () => {
    try {
      setHeaderFetching(true);
      const response = await getGuestExperienceSectionHeader();
      const data = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
      if (data) setHeaderData(data);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Error fetching header:", error);
      }
    } finally {
      setHeaderFetching(false);
    }
  }, []);

  const fetchRating = useCallback(async () => {
    try {
      const res = await getGuestExperineceRatingHeader();
      const data = Array.isArray(res.data) ? res.data[0] : res.data;
      if (data) {
        setRatingData(data);
        setRatingForm({
          description: data.description || "",
          rating: data.rating || "",
          isActive: data.isActive !== undefined ? data.isActive : true,
        });
      }
    } catch (err) {
      if (err.response?.status !== 404)
        console.error("Error fetching rating:", err);
    }
  }, []);
  const handleSaveRating = async () => {
    try {
      setSavingRating(true);
      const payload = {
        description: ratingForm.description,
        rating: parseFloat(ratingForm.rating),
        isActive: ratingForm.isActive,
      };

      if (ratingData?.id) {
        await EditGuestExperineceRatingHeader(ratingData.id, payload);
        toast.success("Rating updated successfully");
      } else {
        await addGuestExperineceRatingHeader(payload);
        toast.success("Rating saved successfully");
      }

      await fetchRating();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save rating");
    } finally {
      setSavingRating(false);
    }
  };

  // Fetch experiences
  const fetchGuestExperience = useCallback(async () => {
    try {
      setFetching(true);
      const response = await getGuestExperienceSection();
      const items = Array.isArray(response.data) ? response.data : [];
      const sorted = [...items].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setExperiences(sorted);
    } catch (error) {
      console.error("Error fetching guest experience:", error);
      toast.error("Failed to load guest experience data");
    } finally {
      setFetching(false);
    }
  }, []);

  // Fetch properties for the filter dropdown
  const fetchProperties = useCallback(async () => {
    try {
      const res = await getAllProperties();
      const data = res.data?.data || res.data || res;
      if (Array.isArray(data))
        setProperties(data.filter((p) => p.isActive));
    } catch (err) {
      console.error("Failed to load properties", err);
    }
  }, []);

  // Fetch property types for the filter dropdown
  const fetchPropertyTypes = useCallback(async () => {
    try {
      const res = await getPropertyTypes();
      const data = res.data?.data || res.data || res;
      if (Array.isArray(data))
        setPropertyTypes(data.filter((t) => t.isActive));
    } catch (err) {
      console.error("Failed to load property types", err);
    }
  }, []);

  useEffect(() => {
    fetchHeader();
    fetchRating();
    fetchGuestExperience();
    fetchProperties();
    fetchPropertyTypes();
  }, [fetchHeader, fetchGuestExperience, fetchProperties, fetchPropertyTypes]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterPropertyId, filterTypeId]);

  const openModal = () => {
    setForm({
      sectionTag: headerData?.sectionTag || "",
      title: headerData?.title || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm({ sectionTag: "", title: "" });
  };

  const handleModalSubmit = async () => {
    if (!form.sectionTag.trim() || !form.title.trim()) {
      toast.error("All fields are required");
      return;
    }
    try {
      setModalLoading(true);
      await addGuestExperienceSectionHeader({
        sectionTag: form.sectionTag.trim(),
        title: form.title.trim(),
      });
      toast.success(
        headerData
          ? "Header updated successfully"
          : "Header saved successfully",
      );
      await fetchHeader();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save header");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience?"))
      return;
    try {
      setLoading(true);
      await deleteGuestExperience(id);
      toast.success("Experience deleted successfully");
      fetchGuestExperience();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete experience");
    } finally {
      setLoading(false);
    }
  };

  const filteredExperiences = useMemo(() => {
    return experiences.filter((exp) => {
      const matchProperty =
        filterPropertyId === "" ||
        exp.propertyId === Number(filterPropertyId);
      const matchType =
        filterTypeId === "" ||
        exp.propertyTypeId === Number(filterTypeId);
      return matchProperty && matchType;
    });
  }, [experiences, filterPropertyId, filterTypeId]);

  const totalPages = Math.ceil(filteredExperiences.length / itemsPerPage);
  const currentExperiences = filteredExperiences.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-4">
      {/* ── Header Card ── */}
      <div
        className="rounded-lg shadow-sm p-5"
        style={{ backgroundColor: colors.contentBg }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-sm font-semibold"
            style={{ color: colors.textPrimary }}
          >
            Section Header
          </h3>
          <button
            onClick={openModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-white transition-colors hover:opacity-90"
          >
            <Pencil size={13} />
            {headerData ? "Edit Header" : "Add Header"}
          </button>
        </div>

        {headerFetching ? (
          <div className="flex items-center gap-2 py-2">
            <Loader2
              size={14}
              className="animate-spin"
              style={{ color: colors.primary }}
            />
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              Loading header...
            </span>
          </div>
        ) : headerData ? (
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Section Tag */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg border flex-1"
              style={{
                backgroundColor: colors.mainBg,
                borderColor: colors.border,
              }}
            >
              <Tag size={13} style={{ color: colors.primary }} />
              <div>
                <p
                  className="text-[10px] uppercase font-semibold tracking-wide"
                  style={{ color: colors.textSecondary }}
                >
                  Section Tag
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  {headerData.sectionTag}
                </p>
              </div>
            </div>
            {/* Title */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg border flex-[2]"
              style={{
                backgroundColor: colors.mainBg,
                borderColor: colors.border,
              }}
            >
              <Type size={13} style={{ color: colors.primary }} />
              <div>
                <p
                  className="text-[10px] uppercase font-semibold tracking-wide"
                  style={{ color: colors.textSecondary }}
                >
                  Title
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  {headerData.title}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs py-2" style={{ color: colors.textSecondary }}>
            No header configured yet. Click <strong>Add Header</strong> to set
            one.
          </p>
        )}
      </div>

      {/* ── Rating Header Card ── */}
      <div
        className="rounded-lg shadow-sm p-5"
        style={{ backgroundColor: colors.contentBg }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-sm font-semibold"
            style={{ color: colors.textPrimary }}
          >
            Rating Header
          </h3>
          <button
            onClick={handleSaveRating}
            disabled={savingRating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-white hover:opacity-90 disabled:opacity-50"
          >
            {savingRating && <Loader2 size={13} className="animate-spin" />}
            {ratingData?.id ? "Update Rating" : "Save Rating"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: colors.textSecondary }}
            >
              Description
            </label>
            <input
              type="text"
              value={ratingForm.description}
              onChange={(e) =>
                setRatingForm({ ...ratingForm, description: e.target.value })
              }
              placeholder="Excellent stay experience with great service."
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-primary/30"
              style={{
                backgroundColor: colors.mainBg,
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
            />
          </div>
          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: colors.textSecondary }}
            >
              Rating (0 – 5)
            </label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={ratingForm.rating}
              onChange={(e) =>
                setRatingForm({ ...ratingForm, rating: e.target.value })
              }
              placeholder="4.5"
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-primary/30"
              style={{
                backgroundColor: colors.mainBg,
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
            />
          </div>
          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: colors.textSecondary }}
            >
              Active Status
            </label>
            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={ratingForm.isActive}
                onChange={(e) =>
                  setRatingForm({ ...ratingForm, isActive: e.target.checked })
                }
                className="w-4 h-4 rounded"
                style={{ accentColor: colors.primary }}
              />
              <span className="text-sm" style={{ color: colors.textPrimary }}>
                Section is active
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div
        className="rounded-lg shadow-sm overflow-hidden"
        style={{ backgroundColor: colors.contentBg }}
      >
        <div
          className="p-5 border-b flex flex-col sm:flex-row sm:items-center gap-3"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center gap-2 flex-1">
            <Filter size={14} style={{ color: colors.primary }} />
            <h3
              className="text-sm font-semibold"
              style={{ color: colors.textPrimary }}
            >
              Guest Experiences
            </h3>
            <span
              className="ml-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: colors.primary + "18",
                color: colors.primary,
              }}
            >
              {filteredExperiences.length} of {experiences.length}
            </span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Property filter */}
            <select
              value={filterPropertyId}
              onChange={(e) => setFilterPropertyId(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/30 min-w-[150px]"
              style={{
                backgroundColor: colors.mainBg,
                borderColor: filterPropertyId ? colors.primary : colors.border,
                color: colors.textPrimary,
              }}
            >
              <option value="">All Properties</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.propertyName}
                </option>
              ))}
            </select>

            {/* Type filter */}
            <select
              value={filterTypeId}
              onChange={(e) => setFilterTypeId(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border outline-none focus:ring-2 focus:ring-primary/30 min-w-[130px]"
              style={{
                backgroundColor: colors.mainBg,
                borderColor: filterTypeId ? colors.primary : colors.border,
                color: colors.textPrimary,
              }}
            >
              <option value="">All Types</option>
              {propertyTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.typeName}
                </option>
              ))}
            </select>

            {/* Clear filters */}
            {(filterPropertyId || filterTypeId) && (
              <button
                onClick={() => {
                  setFilterPropertyId("");
                  setFilterTypeId("");
                }}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-colors hover:bg-red-50"
                style={{
                  borderColor: "#ef4444",
                  color: "#ef4444",
                }}
                title="Clear filters"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ backgroundColor: colors.mainBg }}>
                <th
                  className="p-4 text-xs font-semibold uppercase"
                  style={{ color: colors.textSecondary }}
                >
                  Media
                </th>
                <th
                  className="p-4 text-xs font-semibold uppercase"
                  style={{ color: colors.textSecondary }}
                >
                  Details
                </th>
                <th
                  className="p-4 text-xs font-semibold uppercase"
                  style={{ color: colors.textSecondary }}
                >
                  Author
                </th>
                <th
                  className="p-4 text-xs font-semibold uppercase"
                  style={{ color: colors.textSecondary }}
                >
                  Added On
                </th>
                <th
                  className="p-4 text-xs font-semibold uppercase text-right"
                  style={{ color: colors.textSecondary }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ divideColor: colors.border }}>
              {fetching ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center">
                    <Loader2
                      className="animate-spin mx-auto mb-2"
                      style={{ color: colors.primary }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      Fetching experiences...
                    </span>
                  </td>
                </tr>
              ) : currentExperiences.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-10 text-center text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    No experiences found.
                  </td>
                </tr>
              ) : (
                currentExperiences.map((exp) => {
                  const { date, time } = formatDateTime(exp.createdAt);
                  return (
                    <tr
                      key={exp.id}
                      className="hover:bg-black/5 transition-colors"
                    >
                      {/* Media */}
                      <td className="p-4">
                        <div
                          className="w-16 h-12 rounded bg-gray-200 overflow-hidden border flex items-center justify-center"
                          style={{ borderColor: colors.border }}
                        >
                          {exp.videoUrl ? (
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center relative">
                              <Video
                                size={16}
                                className="text-white opacity-70"
                              />
                              <span className="absolute bottom-0.5 right-1 text-[8px] text-white font-bold">
                                MP4
                              </span>
                            </div>
                          ) : exp.imageUrl ? (
                            <img
                              src={exp.imageUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon size={16} className="text-gray-400" />
                          )}
                        </div>
                      </td>

                      {/* Details */}
                      <td className="p-4">
                        <div
                          className="text-sm font-medium"
                          style={{ color: colors.textPrimary }}
                        >
                          {exp.title}
                        </div>
                        <div
                          className="text-xs line-clamp-1 max-w-[300px]"
                          style={{ color: colors.textSecondary }}
                        >
                          {exp.description}
                        </div>
                      </td>

                      {/* Author */}
                      <td className="p-4">
                        <div
                          className="text-sm font-medium"
                          style={{ color: colors.textPrimary }}
                        >
                          {exp.author}
                        </div>
                        <div
                          className="text-[10px]"
                          style={{ color: colors.textSecondary }}
                        >
                          {exp.authorEmail || "No Email"}
                        </div>
                      </td>

                      {/* Added On */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar
                            size={12}
                            style={{ color: colors.textSecondary }}
                          />
                          <span
                            className="text-sm font-medium"
                            style={{ color: colors.textPrimary }}
                          >
                            {date}
                          </span>
                        </div>
                        <div
                          className="text-[10px] mt-0.5 pl-[18px]"
                          style={{ color: colors.textSecondary }}
                        >
                          {time}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewExp(exp)}
                            className="p-2 rounded hover:bg-blue-50 transition-colors"
                            style={{ color: colors.primary }}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(exp.id)}
                            disabled={loading}
                            className="p-2 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                            style={{ color: "#ef4444" }}
                            title="Delete Experience"
                          >
                            {loading ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="p-4 flex items-center justify-between border-t"
          style={{ borderColor: colors.border, backgroundColor: colors.mainBg }}
        >
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            Showing {currentExperiences.length} of {filteredExperiences.length} items
            {(filterPropertyId || filterTypeId) && (
              <span style={{ color: colors.primary }}> (filtered)</span>
            )}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border disabled:opacity-30"
              style={{ borderColor: colors.border, color: colors.textPrimary }}
            >
              <ChevronLeft size={16} />
            </button>
            <span
              className="text-xs font-medium"
              style={{ color: colors.textPrimary }}
            >
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded border disabled:opacity-30"
              style={{ borderColor: colors.border, color: colors.textPrimary }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── View Modal ── */}
      {viewExp && (
        <ViewModal
          exp={viewExp}
          onClose={() => setViewExp(null)}
          properties={properties}
          propertyTypes={propertyTypes}
        />
      )}

      {/* ── Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="admin-modal-overlay absolute inset-0"
            onClick={closeModal}
          />

          {/* Modal Box */}
          <div
            className="admin-modal-surface relative w-full max-w-md rounded-xl shadow-2xl z-10"
            style={{ backgroundColor: colors.contentBg }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: colors.border }}
            >
              <h4
                className="text-sm font-semibold"
                style={{ color: colors.textPrimary }}
              >
                {headerData ? "Edit Section Header" : "Add Section Header"}
              </h4>
              <button
                onClick={closeModal}
                className="p-1.5 rounded hover:bg-black/10 transition-colors"
                style={{ color: colors.textSecondary }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-5 py-4 space-y-4">
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  Section Tag
                </label>
                <input
                  type="text"
                  value={form.sectionTag}
                  onChange={(e) =>
                    setForm({ ...form, sectionTag: e.target.value })
                  }
                  placeholder="e.g. Guest Experience"
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  style={{
                    backgroundColor: colors.mainBg,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Welcome to Our Hotel"
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  style={{
                    backgroundColor: colors.mainBg,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="flex items-center justify-end gap-2 px-5 py-4 border-t"
              style={{ borderColor: colors.border }}
            >
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-black/5"
                style={{
                  borderColor: colors.border,
                  color: colors.textSecondary,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                disabled={modalLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-white disabled:opacity-50 transition-colors"
              >
                {modalLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Pencil size={14} />
                )}
                {headerData ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GuestExp;
