// components/HeroSection.jsx
import React, { useState, useEffect, useCallback } from "react";
import { colors } from "@/lib/colors/colors";
import {
  Upload,
  Loader2,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { createOrUpdateHeroSection, getHeroSection } from "@/Api/Api";
import { toast } from "react-hot-toast";

function HeroSection() {
  // Array of hero slides, each with its own content and media
  const [heroSlides, setHeroSlides] = useState([
    {
      mainTitle: "",
      subTitle: "",
      ctaText: "",
      backgroundFile: null,
      backgroundPreview: null,
      backgroundMediaType: "IMAGE",
      subFile: null,
      subPreview: null,
      subMediaType: "IMAGE",
    },
  ]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [existingData, setExistingData] = useState(null);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [formData, setFormData] = useState({
    active: true,
  });

  // Fetch hero section data on component mount
  const fetchHeroSection = useCallback(async () => {
    try {
      setFetching(true);
      const response = await getHeroSection();

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        // Sort by ID to get latest entries first
        const sortedData = [...response.data].sort((a, b) => b.id - a.id);
        
        // Set the latest one as existing data for reference
        setExistingData(sortedData[0]);
        setFormData({
          active: sortedData[0].active ?? true,
        });

        // Convert each hero section item to a slide
        const existingSlides = sortedData.map(item => ({
          mainTitle: item.mainTitle || "",
          subTitle: item.subTitle || "",
          ctaText: item.ctaText || "",
          backgroundFile: null,
          backgroundPreview: item.backgroundMediaUrl || null,
          backgroundMediaType: item.backgroundMediaType || "IMAGE",
          subFile: null,
          subPreview: item.subMediaUrl || null,
          subMediaType: item.subMediaType || "IMAGE",
        }));

        if (existingSlides.length > 0) {
          setHeroSlides(existingSlides);
        }

        console.log("Loaded Hero Sections:", existingSlides.length, "slides");
      } else {
        // Default slide if no data
        setHeroSlides([
          {
            mainTitle: "Where Luxury Meets Experience",
            subTitle: "KENNEDIA BLU GROUP",
            ctaText: "Explore →",
            backgroundFile: null,
            backgroundPreview: null,
            backgroundMediaType: "IMAGE",
            subFile: null,
            subPreview: null,
            subMediaType: "IMAGE",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching hero section:", error);
      toast.error("Failed to load hero section data");
      
      // Set default slide on error
      setHeroSlides([
        {
          mainTitle: "Where Luxury Meets Experience",
          subTitle: "KENNEDIA BLU GROUP",
          ctaText: "Explore →",
          backgroundFile: null,
          backgroundPreview: null,
          backgroundMediaType: "IMAGE",
          subFile: null,
          subPreview: null,
          subMediaType: "IMAGE",
        },
      ]);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchHeroSection();
  }, []);

  // Handle input changes for current slide
  const handleInputChange = (field, value) => {
    setHeroSlides((prev) => {
      const updated = [...prev];
      updated[currentSlideIndex] = {
        ...updated[currentSlideIndex],
        [field]: value,
      };
      return updated;
    });
  };

  // Handle background media file for current slide
  const handleBackgroundFileChange = (file) => {
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Please select a valid image or video file");
      return;
    }

    const mediaType = isImage ? "IMAGE" : "VIDEO";
    const previewUrl = URL.createObjectURL(file);

    setHeroSlides((prev) => {
      const updated = [...prev];
      updated[currentSlideIndex] = {
        ...updated[currentSlideIndex],
        backgroundFile: file,
        backgroundPreview: previewUrl,
        backgroundMediaType: mediaType,
      };
      return updated;
    });
  };

  // Handle sub media file for current slide
  const handleSubFileChange = (file) => {
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Please select a valid image or video file");
      return;
    }

    const mediaType = isImage ? "IMAGE" : "VIDEO";
    const previewUrl = URL.createObjectURL(file);

    setHeroSlides((prev) => {
      const updated = [...prev];
      updated[currentSlideIndex] = {
        ...updated[currentSlideIndex],
        subFile: file,
        subPreview: previewUrl,
        subMediaType: mediaType,
      };
      return updated;
    });
  };

  // Remove background media from current slide
  const removeBackgroundMedia = () => {
    setHeroSlides((prev) => {
      const updated = [...prev];
      updated[currentSlideIndex] = {
        ...updated[currentSlideIndex],
        backgroundFile: null,
        backgroundPreview: null,
        backgroundMediaType: "IMAGE",
      };
      return updated;
    });
  };

  // Remove sub media from current slide
  const removeSubMedia = () => {
    setHeroSlides((prev) => {
      const updated = [...prev];
      updated[currentSlideIndex] = {
        ...updated[currentSlideIndex],
        subFile: null,
        subPreview: null,
        subMediaType: "IMAGE",
      };
      return updated;
    });
  };

  // Add a new slide
  const addSlide = () => {
    setHeroSlides((prev) => [
      ...prev,
      {
        mainTitle: "",
        subTitle: "",
        ctaText: "",
        backgroundFile: null,
        backgroundPreview: null,
        backgroundMediaType: "IMAGE",
        subFile: null,
        subPreview: null,
        subMediaType: "IMAGE",
      },
    ]);
    setCurrentSlideIndex(heroSlides.length);
  };

  // Remove current slide
  const removeSlide = () => {
    if (heroSlides.length === 1) {
      toast.error("At least one slide is required");
      return;
    }

    setHeroSlides((prev) =>
      prev.filter((_, index) => index !== currentSlideIndex),
    );
    setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
  };

  // Navigate between slides
  const goToPreviousSlide = () => {
    setCurrentSlideIndex((prev) =>
      prev > 0 ? prev - 1 : heroSlides.length - 1,
    );
  };

  const goToNextSlide = () => {
    setCurrentSlideIndex((prev) =>
      prev < heroSlides.length - 1 ? prev + 1 : 0,
    );
  };

  const handleSubmit = async () => {
    // -------- Validation --------
    for (let i = 0; i < heroSlides.length; i++) {
      const slide = heroSlides[i];

      if (!slide.mainTitle.trim()) {
        toast.error(`Main title is required for slide ${i + 1}`);
        return;
      }

      if (!slide.subTitle.trim()) {
        toast.error(`Subtitle is required for slide ${i + 1}`);
        return;
      }

      if (!slide.ctaText.trim()) {
        toast.error(`CTA text is required for slide ${i + 1}`);
        return;
      }

      if (!slide.backgroundFile && !slide.backgroundPreview) {
        toast.error(`Background media is required for slide ${i + 1}`);
        return;
      }
    }

    try {
      setLoading(true);

      const payload = new FormData();

      // -------- Build indexed payload with proper handling --------
      for (let index = 0; index < heroSlides.length; index++) {
        const slide = heroSlides[index];

        // Text fields - ALWAYS REQUIRED
        payload.append(`heroSections[${index}].mainTitle`, slide.mainTitle);
        payload.append(`heroSections[${index}].subTitle`, slide.subTitle);
        payload.append(`heroSections[${index}].ctaText`, slide.ctaText);
        payload.append(
          `heroSections[${index}].backgroundMediaType`,
          slide.backgroundMediaType,
        );
        payload.append(
          `heroSections[${index}].subMediaType`,
          slide.subMediaType,
        );
        payload.append(`heroSections[${index}].active`, "true");

        // Background media - ALWAYS REQUIRED
        if (slide.backgroundFile) {
          // New file upload
          payload.append(`backgroundMedia[${index}]`, slide.backgroundFile);
        } else if (slide.backgroundPreview && slide.backgroundPreview.startsWith('http')) {
          // Existing URL from server - fetch and convert to file
          try {
            const response = await fetch(slide.backgroundPreview);
            const blob = await response.blob();
            const filename = slide.backgroundPreview.split('/').pop() || `background-${index}`;
            const file = new File([blob], filename, { type: blob.type });
            payload.append(`backgroundMedia[${index}]`, file);
          } catch (error) {
            console.error(`Failed to fetch background media for slide ${index}:`, error);
            toast.error(`Failed to process background media for slide ${index + 1}`);
            setLoading(false);
            return;
          }
        } else if (slide.backgroundPreview && slide.backgroundPreview.startsWith('blob:')) {
          // Blob URL - convert to file
          try {
            const response = await fetch(slide.backgroundPreview);
            const blob = await response.blob();
            const file = new File([blob], `background-${index}.${blob.type.split('/')[1]}`, { type: blob.type });
            payload.append(`backgroundMedia[${index}]`, file);
          } catch (error) {
            console.error(`Failed to process blob for slide ${index}:`, error);
            toast.error(`Failed to process background media for slide ${index + 1}`);
            setLoading(false);
            return;
          }
        }

        // Sub media - OPTIONAL but must follow same pattern if exists
        if (slide.subFile) {
          payload.append(`subMedia[${index}]`, slide.subFile);
        } else if (slide.subPreview && slide.subPreview.startsWith('http')) {
          try {
            const response = await fetch(slide.subPreview);
            const blob = await response.blob();
            const filename = slide.subPreview.split('/').pop() || `sub-${index}`;
            const file = new File([blob], filename, { type: blob.type });
            payload.append(`subMedia[${index}]`, file);
          } catch (error) {
            console.warn(`Failed to fetch sub media for slide ${index}:`, error);
            // Sub media is optional, so we just warn and continue
          }
        } else if (slide.subPreview && slide.subPreview.startsWith('blob:')) {
          try {
            const response = await fetch(slide.subPreview);
            const blob = await response.blob();
            const file = new File([blob], `sub-${index}.${blob.type.split('/')[1]}`, { type: blob.type });
            payload.append(`subMedia[${index}]`, file);
          } catch (error) {
            console.warn(`Failed to process sub blob for slide ${index}:`, error);
          }
        }
      }

      // Debug: Log payload contents
      console.log('=== FormData Payload ===');
      for (let pair of payload.entries()) {
        console.log(pair[0], pair[1]);
      }

      // -------- API call --------
      const response = await createOrUpdateHeroSection(payload);

      toast.success("Hero section saved successfully!");
      console.log("Hero section response:", response?.data);

      // Re-fetch latest data
      await fetchHeroSection();
    } catch (error) {
      console.error("Error saving hero section:", error);

      toast.error(
        error?.response?.data?.message || "Failed to save hero section",
      );
    } finally {
      setLoading(false);
    }
  };

  // Auto-rotate preview slides
  useEffect(() => {
    if (heroSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentPreviewIndex((prev) => (prev + 1) % heroSlides.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [heroSlides.length]);

  if (fetching) {
    return (
      <div
        className="rounded-lg p-6 shadow-sm flex items-center justify-center h-[600px]"
        style={{ backgroundColor: colors.contentBg }}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={32}
            className="animate-spin"
            style={{ color: colors.primary }}
          />
          <p style={{ color: colors.textSecondary }}>Loading hero section...</p>
        </div>
      </div>
    );
  }

  const currentSlide = heroSlides[currentSlideIndex];

  return (
    <div
      className="rounded-lg p-6 shadow-sm"
      style={{ backgroundColor: colors.contentBg }}
    >
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2
              className="text-xl font-semibold m-0"
              style={{ color: colors.textPrimary }}
            >
              Hero Section
            </h2>
            <button
              onClick={addSlide}
              className="flex items-center gap-2 px-3 py-1.5 border-none rounded-md text-xs font-medium cursor-pointer transition-colors"
              style={{
                backgroundColor: colors.primary,
                color: colors.sidebarText,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
              }}
            >
              <Plus size={14} />
              <span>Add Slide</span>
            </button>
          </div>

          {/* Slide Navigation */}
          <div
            className="flex items-center justify-between p-3 rounded-md border"
            style={{ borderColor: colors.border }}
          >
            <button
              onClick={goToPreviousSlide}
              className="p-1.5 border-none rounded cursor-pointer transition-colors"
              style={{ backgroundColor: "transparent" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.border;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ChevronLeft size={20} style={{ color: colors.textPrimary }} />
            </button>

            <div className="flex items-center gap-2">
              <span
                className="text-sm font-medium"
                style={{ color: colors.textPrimary }}
              >
                Slide {currentSlideIndex + 1} of {heroSlides.length}
              </span>
              {heroSlides.length > 1 && (
                <button
                  onClick={removeSlide}
                  className="px-2 py-1 border-none rounded text-xs cursor-pointer transition-colors"
                  style={{
                    backgroundColor: "#fee",
                    color: "#ef4444",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#fdd";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#fee";
                  }}
                >
                  Remove
                </button>
              )}
            </div>

            <button
              onClick={goToNextSlide}
              className="p-1.5 border-none rounded cursor-pointer transition-colors"
              style={{ backgroundColor: "transparent" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.border;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ChevronRight size={20} style={{ color: colors.textPrimary }} />
            </button>
          </div>

          {/* Slide Content Form */}
          <div className="flex flex-col gap-2">
            <label
              className="text-[13px] font-medium"
              style={{ color: colors.textSecondary }}
            >
              Main Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={currentSlide.mainTitle}
              onChange={(e) => handleInputChange("mainTitle", e.target.value)}
              className="px-3 py-2.5 border rounded-md text-sm outline-none transition-colors"
              style={{
                borderColor: colors.border,
                backgroundColor: '#F3F4F6',
                color: '#000000',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = colors.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = colors.border;
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-[13px] font-medium"
              style={{ color: colors.textSecondary }}
            >
              Subtitle <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={currentSlide.subTitle}
              onChange={(e) => handleInputChange("subTitle", e.target.value)}
              className="px-3 py-2.5 border rounded-md text-sm outline-none transition-colors"
              style={{
                borderColor: colors.border,
                backgroundColor: '#F3F4F6',
                color: '#000000',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = colors.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = colors.border;
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-[13px] font-medium"
              style={{ color: colors.textSecondary }}
            >
              Call-to-Action Button Text{" "}
              <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={currentSlide.ctaText}
              onChange={(e) => handleInputChange("ctaText", e.target.value)}
              className="px-3 py-2.5 border rounded-md text-sm outline-none transition-colors"
              style={{
                borderColor: colors.border,
                backgroundColor: '#F3F4F6',
                color: '#000000',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = colors.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = colors.border;
              }}
            />
          </div>

          {/* Background Media Section */}
          <div className="flex flex-col gap-2">
            <label
              className="text-[13px] font-medium"
              style={{ color: colors.textSecondary }}
            >
              Background Image/Video <span style={{ color: "#ef4444" }}>*</span>
            </label>

            {currentSlide.backgroundPreview ? (
              <div
                className="flex items-center gap-3 p-3 border rounded-md"
                style={{ borderColor: colors.border }}
              >
                {currentSlide.backgroundMediaType === "IMAGE" ? (
                  <img
                    src={currentSlide.backgroundPreview}
                    alt="Background"
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <video
                    src={currentSlide.backgroundPreview}
                    className="w-20 h-20 object-cover rounded"
                    muted
                  />
                )}
                <div className="flex-1">
                  <p
                    className="text-sm font-medium m-0"
                    style={{ color: colors.textPrimary }}
                  >
                    {currentSlide.backgroundMediaType}
                  </p>
                  {currentSlide.backgroundFile && (
                    <p
                      className="text-xs m-0"
                      style={{ color: colors.textSecondary }}
                    >
                      {currentSlide.backgroundFile.name}
                    </p>
                  )}
                </div>
                <button
                  onClick={removeBackgroundMedia}
                  className="p-2 border-none rounded cursor-pointer transition-colors"
                  style={{ backgroundColor: "transparent" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#fee";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <X size={18} style={{ color: "#ef4444" }} />
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  id={`backgroundMedia-${currentSlideIndex}`}
                  accept="image/*,video/*"
                  onChange={(e) =>
                    handleBackgroundFileChange(e.target.files[0])
                  }
                  className="hidden"
                />
                <label
                  htmlFor={`backgroundMedia-${currentSlideIndex}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-md text-sm font-medium cursor-pointer transition-colors"
                  style={{
                    borderColor: colors.border,
                    color: colors.textSecondary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.color = colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.color = colors.textSecondary;
                  }}
                >
                  <Upload size={18} />
                  <span>Choose Background Media</span>
                </label>
              </div>
            )}
          </div>

          {/* Sub Media Section */}
          <div className="flex flex-col gap-2">
            <label
              className="text-[13px] font-medium"
              style={{ color: colors.textSecondary }}
            >
              Sub Image/Video (Optional)
            </label>

            {currentSlide.subPreview ? (
              <div
                className="flex items-center gap-3 p-3 border rounded-md"
                style={{ borderColor: colors.border }}
              >
                {currentSlide.subMediaType === "IMAGE" ? (
                  <img
                    src={currentSlide.subPreview}
                    alt="Sub media"
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <video
                    src={currentSlide.subPreview}
                    className="w-20 h-20 object-cover rounded"
                    muted
                  />
                )}
                <div className="flex-1">
                  <p
                    className="text-sm font-medium m-0"
                    style={{ color: colors.textPrimary }}
                  >
                    {currentSlide.subMediaType}
                  </p>
                  {currentSlide.subFile && (
                    <p
                      className="text-xs m-0"
                      style={{ color: colors.textSecondary }}
                    >
                      {currentSlide.subFile.name}
                    </p>
                  )}
                </div>
                <button
                  onClick={removeSubMedia}
                  className="p-2 border-none rounded cursor-pointer transition-colors"
                  style={{ backgroundColor: "transparent" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#fee";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <X size={18} style={{ color: "#ef4444" }} />
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  id={`subMedia-${currentSlideIndex}`}
                  accept="image/*,video/*"
                  onChange={(e) => handleSubFileChange(e.target.files[0])}
                  className="hidden"
                />
                <label
                  htmlFor={`subMedia-${currentSlideIndex}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-md text-sm font-medium cursor-pointer transition-colors"
                  style={{
                    borderColor: colors.border,
                    color: colors.textSecondary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.color = colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.color = colors.textSecondary;
                  }}
                >
                  <Upload size={18} />
                  <span>Choose Sub Media</span>
                </label>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ active: e.target.checked })}
              className="w-4 h-4 cursor-pointer"
              style={{ accentColor: colors.primary }}
            />
            <label
              htmlFor="active"
              className="text-[13px] font-medium cursor-pointer"
              style={{ color: colors.textSecondary }}
            >
              Set as Active
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 border-none rounded-md text-sm font-semibold cursor-pointer transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: colors.primary,
              color: colors.sidebarText,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = colors.primaryHover;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = colors.primary;
              }
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Hero Section</span>
            )}
          </button>
        </div>

        {/* Right Column - Preview */}
        <div className="flex flex-col gap-3">
          <h3
            className="text-base font-semibold m-0"
            style={{ color: colors.textPrimary }}
          >
            Preview
          </h3>
          <div
            className="w-full h-[400px] rounded-lg flex items-center justify-center relative overflow-hidden"
            style={{
              backgroundColor: "#1a1a2e",
            }}
          >
            {/* Background Media with rotation */}
            {heroSlides[currentPreviewIndex]?.backgroundPreview ? (
              <>
                {heroSlides[currentPreviewIndex]?.backgroundMediaType ===
                "VIDEO" ? (
                  <video
                    key={heroSlides[currentPreviewIndex]?.backgroundPreview}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                    style={{ filter: "brightness(0.7)" }}
                  >
                    <source
                      src={heroSlides[currentPreviewIndex]?.backgroundPreview}
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('${heroSlides[currentPreviewIndex]?.backgroundPreview}')`,
                    }}
                  />
                )}
              </>
            ) : (
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              />
            )}

            {/* Indicator Dots */}
            {heroSlides.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPreviewIndex(index)}
                    className="w-2 h-2 rounded-full border-none cursor-pointer transition-all"
                    style={{
                      backgroundColor:
                        index === currentPreviewIndex
                          ? colors.primary
                          : "rgba(255,255,255,0.5)",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Content Overlay */}
            <div className="text-center p-10 z-10 relative">
              <h1
                className="text-[32px] font-bold m-0 mb-2"
                style={{
                  color: colors.sidebarText,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                {heroSlides[currentPreviewIndex]?.mainTitle ||
                  "Your Main Title"}
              </h1>
              <p
                className="text-sm font-medium m-0 mb-6 tracking-[2px]"
                style={{ color: colors.sidebarText }}
              >
                {heroSlides[currentPreviewIndex]?.subTitle || "Your Subtitle"}
              </p>
              <button
                className="px-8 py-3 border-none rounded-md text-sm font-semibold cursor-pointer transition-colors"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.sidebarText,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary;
                }}
              >
                {heroSlides[currentPreviewIndex]?.ctaText || "Button Text"}
              </button>
            </div>
          </div>

          {/* Current Slide Sub Media Preview */}
          {currentSlide.subPreview && (
            <div className="mt-4">
              <p
                className="text-xs font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Sub Media for Current Slide:
              </p>
              <div>
                {currentSlide.subMediaType === "IMAGE" ? (
                  <img
                    src={currentSlide.subPreview}
                    alt="Sub media"
                    className="w-full h-32 object-cover rounded-md"
                  />
                ) : (
                  <video
                    key={currentSlide.subPreview}
                    controls
                    className="w-full h-32 object-cover rounded-md"
                    playsInline
                  >
                    <source src={currentSlide.subPreview} type="video/mp4" />
                  </video>
                )}
              </div>
            </div>
          )}

          {/* Slide Summary */}
          <div
            className="mt-2 p-3 rounded-md"
            style={{ backgroundColor: colors.border }}
          >
            <p
              className="text-xs font-medium m-0 mb-1"
              style={{ color: colors.textSecondary }}
            >
              All Slides ({heroSlides.length}):
            </p>
            <div className="flex flex-col gap-1">
              {heroSlides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlideIndex(index)}
                  className="text-left px-2 py-1.5 rounded text-xs cursor-pointer transition-colors border-none"
                  style={{
                    backgroundColor:
                      index === currentSlideIndex
                        ? colors.primary
                        : "transparent",
                    color:
                      index === currentSlideIndex
                        ? colors.sidebarText
                        : colors.textSecondary,
                  }}
                >
                  {index + 1}. {slide.mainTitle || "Untitled"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default HeroSection;