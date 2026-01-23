// components/HeroSection.jsx
import React, { useState, useEffect, useCallback } from "react";
import { colors } from "@/lib/colors/colors";
import { Upload, Loader2 } from "lucide-react";
import { createOrUpdateHeroSection, getHeroSection } from "@/Api/Api";
import { toast } from "react-hot-toast";

function HeroSection() {
  const [formData, setFormData] = useState({
    mainTitle: "",
    subTitle: "",
    ctaText: "",
    active: true,
  });

  const [files, setFiles] = useState({
    backgroundMedia: null,
    subMedia: null,
  });

  const [mediaTypes, setMediaTypes] = useState({
    backgroundMediaType: "IMAGE",
    subMediaType: "IMAGE",
  });

  const [previews, setPreviews] = useState({
    backgroundMedia: null,
    subMedia: null,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [existingData, setExistingData] = useState(null);

  // Fetch hero section data on component mount only
  const fetchHeroSection = useCallback(async () => {
    try {
      setFetching(true);
      const response = await getHeroSection();
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Get the latest hero section (last item in array or highest id)
        const latestHero = response.data.reduce((latest, current) => 
          current.id > latest.id ? current : latest
        );
        
        setExistingData(latestHero);
        
        // Populate form with latest data
        setFormData({
          mainTitle: latestHero.mainTitle || "",
          subTitle: latestHero.subTitle || "",
          ctaText: latestHero.ctaText || "",
          active: latestHero.active ?? true,
        });

        // Set media types from API
        setMediaTypes({
          backgroundMediaType: latestHero.backgroundMediaType || "IMAGE",
          subMediaType: latestHero.subMediaType || "IMAGE",
        });

        // Set previews from API URLs
        setPreviews({
          backgroundMedia: latestHero.backgroundMediaUrl || null,
          subMedia: latestHero.subMediaUrl || null,
        });

        console.log("Latest Hero Section:", latestHero);
      } else {
        // Set default values if no data
        setFormData({
          mainTitle: "Where Luxury Meets Experience",
          subTitle: "KENNEDIA BLU GROUP",
          ctaText: "Explore →",
          active: true,
        });
      }
    } catch (error) {
      console.error("Error fetching hero section:", error);
      toast.error("Failed to load hero section data");
      
      // Set default values on error
      setFormData({
        mainTitle: "Where Luxury Meets Experience",
        subTitle: "KENNEDIA BLU GROUP",
        ctaText: "Explore →",
        active: true,
      });
    } finally {
      setFetching(false);
    }
  }, []);

  // Fetch on mount only
  useEffect(() => {
    fetchHeroSection();
  }, []); // Empty dependency array - runs once on mount

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, file) => {
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Please upload an image or video file");
      return;
    }

    // Update media type based on file
    const mediaType = isImage ? "IMAGE" : "VIDEO";
    const typeField =
      field === "backgroundMedia" ? "backgroundMediaType" : "subMediaType";

    setMediaTypes((prev) => ({ ...prev, [typeField]: mediaType }));
    setFiles((prev) => ({ ...prev, [field]: file }));

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreviews((prev) => ({ ...prev, [field]: previewUrl }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.mainTitle.trim()) {
      toast.error("Main title is required");
      return;
    }
    if (!formData.subTitle.trim()) {
      toast.error("Subtitle is required");
      return;
    }
    if (!formData.ctaText.trim()) {
      toast.error("CTA button text is required");
      return;
    }
    
    // Only require background media if no existing data
    if (!files.backgroundMedia && !existingData?.backgroundMediaUrl) {
      toast.error("Background media is required");
      return;
    }

    try {
      setLoading(true);

      // Prepare FormData
      const payload = new FormData();
      payload.append("mainTitle", formData.mainTitle);
      payload.append("subTitle", formData.subTitle);
      payload.append("ctaText", formData.ctaText);
      payload.append("active", formData.active);

      // Only append background media if a new file is selected
      if (files.backgroundMedia) {
        payload.append("backgroundMediaType", mediaTypes.backgroundMediaType);
        payload.append("backgroundMedia", files.backgroundMedia);
      }

      // Only append sub media if a new file is selected
      if (files.subMedia) {
        payload.append("subMediaType", mediaTypes.subMediaType);
        payload.append("subMedia", files.subMedia);
      }

      const response = await createOrUpdateHeroSection(payload);

      toast.success("Hero section saved successfully!");
      console.log("Response:", response.data);

      // Refresh data after successful save
      await fetchHeroSection();
      
      // Clear file inputs
      setFiles({
        backgroundMedia: null,
        subMedia: null,
      });
      
    } catch (error) {
      console.error("Error saving hero section:", error);
      toast.error(
        error.response?.data?.message || "Failed to save hero section"
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching
  if (fetching) {
    return (
      <div
        className="rounded-lg p-6 shadow-sm flex items-center justify-center h-[600px]"
        style={{ backgroundColor: colors.contentBg }}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin" style={{ color: colors.primary }} />
          <p style={{ color: colors.textSecondary }}>Loading hero section...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg p-6 shadow-sm"
      style={{ backgroundColor: colors.contentBg }}
    >
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="flex flex-col gap-5">
          <h2
            className="text-xl font-semibold m-0 mb-2"
            style={{ color: colors.textPrimary }}
          >
            Hero Section
          </h2>

          <div className="flex flex-col gap-2">
            <label
              className="text-[13px] font-medium"
              style={{ color: colors.textSecondary }}
            >
              Main Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={formData.mainTitle}
              onChange={(e) => handleInputChange("mainTitle", e.target.value)}
              className="px-3 py-2.5 border rounded-md text-sm outline-none transition-colors"
              style={{
                borderColor: colors.border,
                color: colors.textPrimary,
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
              value={formData.subTitle}
              onChange={(e) => handleInputChange("subTitle", e.target.value)}
              className="px-3 py-2.5 border rounded-md text-sm outline-none transition-colors"
              style={{
                borderColor: colors.border,
                color: colors.textPrimary,
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
              value={formData.ctaText}
              onChange={(e) => handleInputChange("ctaText", e.target.value)}
              className="px-3 py-2.5 border rounded-md text-sm outline-none transition-colors"
              style={{
                borderColor: colors.border,
                color: colors.textPrimary,
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
              Background Image/Video{" "}
              {!existingData?.backgroundMediaUrl && (
                <span style={{ color: "#ef4444" }}>*</span>
              )}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                id="backgroundMedia"
                accept="image/*,video/*"
                onChange={(e) =>
                  handleFileChange("backgroundMedia", e.target.files[0])
                }
                className="hidden"
              />
              <label
                htmlFor="backgroundMedia"
                className="flex items-center gap-2 px-4 py-2.5 border-none rounded-md text-sm font-medium cursor-pointer transition-colors"
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
                <Upload size={16} />
                <span>{files.backgroundMedia ? "Change" : "Upload"}</span>
              </label>
              {files.backgroundMedia ? (
                <span
                  className="text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  {files.backgroundMedia.name}
                </span>
              ) : existingData?.backgroundMediaUrl ? (
                <span
                  className="text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  Current: {mediaTypes.backgroundMediaType}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-[13px] font-medium"
              style={{ color: colors.textSecondary }}
            >
              Add Sub Image/Video
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                id="subMedia"
                accept="image/*,video/*"
                onChange={(e) =>
                  handleFileChange("subMedia", e.target.files[0])
                }
                className="hidden"
              />
              <label
                htmlFor="subMedia"
                className="flex items-center gap-2 px-4 py-2.5 border-none rounded-md text-sm font-medium cursor-pointer transition-colors"
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
                <Upload size={16} />
                <span>{files.subMedia ? "Change" : "Upload"}</span>
              </label>
              {files.subMedia ? (
                <span
                  className="text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  {files.subMedia.name}
                </span>
              ) : existingData?.subMediaUrl ? (
                <span
                  className="text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  Current: {mediaTypes.subMediaType}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => handleInputChange("active", e.target.checked)}
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
            {/* Background Media - Video or Image */}
            {mediaTypes.backgroundMediaType === "VIDEO" && previews.backgroundMedia ? (
              <video
                key={previews.backgroundMedia} // Force re-render when URL changes
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "brightness(0.7)" }}
              >
                <source src={previews.backgroundMedia} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : mediaTypes.backgroundMediaType === "IMAGE" && previews.backgroundMedia ? (
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('${previews.backgroundMedia}')`,
                }}
              />
            ) : (
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              />
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
                {formData.mainTitle || "Your Main Title"}
              </h1>
              <p
                className="text-sm font-medium m-0 mb-6 tracking-[2px]"
                style={{ color: colors.sidebarText }}
              >
                {formData.subTitle || "Your Subtitle"}
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
                {formData.ctaText || "Button Text"}
              </button>
            </div>
          </div>

          {previews.subMedia && (
            <div className="mt-4">
              <p
                className="text-xs font-medium mb-2"
                style={{ color: colors.textSecondary }}
              >
                Sub Media Preview:
              </p>
              {mediaTypes.subMediaType === "IMAGE" ? (
                <img
                  src={previews.subMedia}
                  alt="Sub media preview"
                  className="w-full h-32 object-cover rounded-md"
                />
              ) : (
                <video 
                  key={previews.subMedia}
                  controls 
                  className="w-full h-32 object-cover rounded-md"
                  playsInline
                >
                  <source src={previews.subMedia} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeroSection;