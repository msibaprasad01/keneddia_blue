import React, { useState, useEffect } from "react";
import { colors } from "@/lib/colors/colors";
import {
  X,
  Upload,
  Loader2,
  MapPin,
  Tag,
  FileText,
  Calendar,
  Clock,
  Image as ImageIcon,
  Building2,
  Hotel,
  AlignLeft,
  Home,
  Ruler,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Instagram,
} from "lucide-react";
import {
  createDailyOffer,
  updateDailyOfferById,
  uploadMedia,
  getMediaById,
  getAllProperties,
} from "@/Api/Api";
import { showSuccess, showInfo, showError, showWarning } from "@/lib/toasters/toastUtils";

const inputStyles = `
  input::placeholder, textarea::placeholder {
    color: #9CA3AF !important;
    opacity: 1;
  }
  .custom-modal-container {
    width: 80% !important;
    max-width: 80% !important;
  }
`;

// Media Detection Rules Configuration
const MEDIA_DETECTION_RULES = {
  instagramBannerReel: {
    label: "Instagram Banner / Reel",
    aspectRatio: "9:16",
    allowedDimensions: [
      { width: 1080, height: 1920 },
      { width: 900, height: 1600 },
      { width: 720, height: 1280 },
      { width: 450, height: 800 },
    ],
    minHeight: 800,
    ratioTolerance: 0.01,
    detectBy: ["exactDimensionMatch", "aspectRatioMatch"],
    uiState: {
      badge: "Banner detected",
      color: "success",
      icon: "instagram",
    },
  },
};

function CreateOfferModal({ isOpen, onClose, editingOffer }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDesc: "",
    couponCode: "",
    ctaText: "Claim Offer",
    ctaLink: "",
    location: "",
    propertyId: null,
    propertyTypeId: null,
    propertyName: "",
    propertyType: "",
    expiresAt: "",
    availableHours: "",
    imageMediaId: null,
    isActive: false,
    showOnHomePage: false,
    displayLocation: "PROPERTY_PAGE",
  });

  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("22:00");
  const [availableProperties, setAvailableProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedMediaId, setUploadedMediaId] = useState(null);
  const [mediaType, setMediaType] = useState(null); // "IMAGE" | "VIDEO"

  // Enhanced state for banner detection
  const [imageDimensions, setImageDimensions] = useState(null);
  const [detectedBannerType, setDetectedBannerType] = useState(null);
  const [isBannerDetected, setIsBannerDetected] = useState(false);

  // Validation state
  const [touchedFields, setTouchedFields] = useState({});

  useEffect(() => {
    if (isOpen) fetchProperties();
  }, [isOpen]);

  const convert12to24 = (time12h) => {
    if (!time12h) return "10:00";
    try {
      const [time, modifier] = time12h.split(" ");
      let [hours, minutes] = time.split(":");
      if (hours === "12") hours = "00";
      if (modifier === "PM") hours = parseInt(hours, 10) + 12;
      return `${hours.toString().padStart(2, "0")}:${minutes}`;
    } catch (e) {
      return "10:00";
    }
  };

  useEffect(() => {
    if (editingOffer && isOpen) {
      if (editingOffer.imageMediaId)
        fetchMediaDetails(editingOffer.imageMediaId);

      if (
        editingOffer.availableHours &&
        editingOffer.availableHours.includes(" - ")
      ) {
        const parts = editingOffer.availableHours.split(" - ");
        setStartTime(convert12to24(parts[0]));
        setEndTime(convert12to24(parts[1]));
      }

      setFormData({
        ...editingOffer,
        expiresAt: editingOffer.expiresAt
          ? new Date(editingOffer.expiresAt).toISOString().split("T")[0]
          : "",
        displayLocation: editingOffer.displayLocation || "PROPERTY_PAGE",
        isActive: editingOffer.isActive ?? false,
        ctaLink: editingOffer.ctaLink || "",
      });
      setUploadedMediaId(editingOffer.imageMediaId || null);
      setImagePreview(
        editingOffer.image?.url || editingOffer.image?.src || null,
      );

      // Check if editing offer has banner dimensions
      if (editingOffer.image?.width && editingOffer.image?.height) {
        const dims = {
          width: editingOffer.image.width,
          height: editingOffer.image.height,
        };
        setImageDimensions(dims);
        detectBannerType(dims);
      }
    } else if (isOpen) {
      resetForm();
    }
  }, [editingOffer, isOpen]);

  const fetchProperties = async () => {
    try {
      setLoadingProperties(true);
      const response = await getAllProperties();
      const propertiesData = response.data?.data || response.data || response;
      if (Array.isArray(propertiesData))
        setAvailableProperties(propertiesData.filter((p) => p.isActive));
    } catch (error) {
      showError("Failed to load properties");
    } finally {
      setLoadingProperties(false);
    }
  };

  const fetchMediaDetails = async (mediaId) => {
    try {
      const response = await getMediaById(mediaId);
      const mediaData = response.data?.data;
      if (mediaData) {
        setImagePreview(mediaData.url);
        setUploadedMediaId(mediaId);

        // Check if media has dimensions
        if (mediaData.width && mediaData.height) {
          const dims = { width: mediaData.width, height: mediaData.height };
          setImageDimensions(dims);
          detectBannerType(dims);
        }
      }
    } catch (error) {
      console.error("Error fetching media details:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      longDesc: "",
      couponCode: "",
      ctaText: "Claim Offer",
      ctaLink: "",
      location: "",
      propertyId: null,
      propertyTypeId: null,
      propertyName: "",
      propertyType: "",
      expiresAt: "",
      availableHours: "",
      imageMediaId: null,
      isActive: false,
      showOnHomePage: false,
      displayLocation: "PROPERTY_PAGE",
    });
    setImagePreview(null);
    setUploadedMediaId(null);
    setImageDimensions(null);
    setDetectedBannerType(null);
    setIsBannerDetected(false);
    setMediaType(null);
    setStartTime("10:00");
    setEndTime("22:00");
    setTouchedFields({});
  };

  /**
   * Calculate aspect ratio as string (e.g., "9:16")
   */
  const calculateAspectRatio = (width, height) => {
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  };

  /**
   * Check if aspect ratio matches with tolerance
   */
  const aspectRatioMatches = (width, height, targetRatio, tolerance = 0.01) => {
    const [targetW, targetH] = targetRatio.split(":").map(Number);
    const actualRatio = width / height;
    const expectedRatio = targetW / targetH;
    const difference = Math.abs(actualRatio - expectedRatio);

    return difference <= tolerance;
  };

  /**
   * Detect banner type based on dimensions
   */
  const detectBannerType = (dimensions) => {
    if (!dimensions || !dimensions.width || !dimensions.height) {
      setIsBannerDetected(false);
      setDetectedBannerType(null);
      return null;
    }

    const { width, height } = dimensions;

    console.log("🔍 Detecting Banner Type:", {
      width,
      height,
      aspectRatio: calculateAspectRatio(width, height),
    });

    // Check Instagram Banner/Reel
    const igRule = MEDIA_DETECTION_RULES.instagramBannerReel;

    // Method 1: Exact Dimension Match
    const exactMatch = igRule.allowedDimensions.some(
      (dim) => dim.width === width && dim.height === height,
    );

    // Method 2: Aspect Ratio Match
    const ratioMatch = aspectRatioMatches(
      width,
      height,
      igRule.aspectRatio,
      igRule.ratioTolerance,
    );

    // Method 3: Minimum Height Check
    const meetsMinHeight = height >= igRule.minHeight;

    const isInstagramBanner = exactMatch || (ratioMatch && meetsMinHeight);

    console.log("📊 Banner Detection Results:", {
      exactMatch,
      ratioMatch,
      meetsMinHeight,
      isInstagramBanner,
      calculatedRatio: calculateAspectRatio(width, height),
      targetRatio: igRule.aspectRatio,
    });

    if (isInstagramBanner) {
      setIsBannerDetected(true);
      setDetectedBannerType({
        type: "instagramBannerReel",
        label: igRule.label,
        badge: igRule.uiState.badge,
        color: igRule.uiState.color,
        icon: igRule.uiState.icon,
        dimensions: { width, height },
        aspectRatio: calculateAspectRatio(width, height),
      });
      return "instagramBannerReel";
    }

    setIsBannerDetected(false);
    setDetectedBannerType(null);
    return null;
  };

  /**
   * Load image file and extract dimensions
   */
  const loadImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.onload = () => {
          const dimensions = {
            width: img.naturalWidth,
            height: img.naturalHeight,
          };

          console.log("🖼️ Image Dimensions Loaded:", dimensions);
          resolve(dimensions);
        };

        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };

        img.src = e.target.result;
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  };

  const handlePropertySelect = (propertyId) => {
    const selectedProperty = availableProperties.find(
      (p) => p.id === parseInt(propertyId),
    );
    if (selectedProperty) {
      setFormData((prev) => ({
        ...prev,
        propertyId: selectedProperty.id,
        propertyTypeId:
          selectedProperty.propertyTypeId || selectedProperty.typeId || 1,
        propertyName: selectedProperty.propertyName,
        propertyType: selectedProperty.propertyTypes?.join(", ") || "",
        location:
          `${selectedProperty.area || ""}, ${selectedProperty.locationName || ""}`.replace(
            /^, |, $/g,
            "",
          ),
      }));
      setTouchedFields((prev) => ({ ...prev, propertyId: true }));
    }
  };

  const formatTimeTo12h = (timeStr) => {
    const [hours, minutes] = timeStr.split(":");
    let h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isImage && !isVideo) {
      showError("Unsupported file type");
      return;
    }

    setMediaType(isVideo ? "VIDEO" : "IMAGE");
    setImagePreview(URL.createObjectURL(file));
    setTouchedFields((prev) => ({ ...prev, image: true }));

    // 👉 IMAGE FLOW (existing logic stays)
    if (isImage) {
      try {
        const dimensions = await loadImageDimensions(file);
        setImageDimensions(dimensions);
        const bannerType = detectBannerType(dimensions);
        uploadMediaFile(file, "IMAGE", dimensions, bannerType);
      } catch (err) {
        showError("Failed to process image");
      }
      return;
    }

    // 👉 VIDEO FLOW (new)
    uploadMediaFile(file, "VIDEO");
  };

  const uploadMediaFile = async (
    file,
    type,
    dimensions = null,
    bannerType = null,
  ) => {
    try {
      setUploadingImage(true);
      const fd = new FormData();

      fd.append("file", file);
      fd.append("type", type); // IMAGE | VIDEO

      // Only attach dimensions for images
      if (type === "IMAGE" && dimensions) {
        fd.append("width", dimensions.width.toString());
        fd.append("height", dimensions.height.toString());
      }

      const response = await uploadMedia(fd);
      const mediaId = response?.data;

      if (!mediaId) throw new Error("Invalid upload response");

      setUploadedMediaId(mediaId);

      if (type === "VIDEO") {
        showSuccess("Video uploaded successfully 🎥");
      } else if (isBannerDetected && detectedBannerType) {
        showSuccess(`${detectedBannerType.label} Detected! Title and Description are now optional.`);
      } else {
        showSuccess("Image uploaded successfully");
      }
    } catch (error) {
      showError("Upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  /**
   * Check if property is required based on display location
   */
  const isPropertyRequired = () => {
    const location = formData.displayLocation;
    return location === "PROPERTY_PAGE" || location === "BOTH";
  };

  // Validation function
  const validateForm = () => {
    const errors = [];

    // Image/Video is always required
    if (!uploadedMediaId && !formData.imageMediaId) {
      errors.push("Offer Visual");
    }

    // Property is required if displayLocation is PROPERTY_PAGE or BOTH
    if (isPropertyRequired() && !formData.propertyId) {
      errors.push("Property");
    }

    // Title is required if NOT a banner
    if (!isBannerDetected && !formData.title?.trim()) {
      errors.push("Offer Title");
    }

    return errors;
  };

  // Check if form is valid
  const isFormValid = () => {
    const errors = validateForm();
    return errors.length === 0;
  };

  // Handle button click - shows validation errors or submits
  const handleButtonClick = () => {
    // Mark all fields as touched
    setTouchedFields({
      title: true,
      propertyId: true,
      image: true,
    });

    const errors = validateForm();
    
    if (errors.length > 0) {
      showError(`Please fill required fields: ${errors.join(", ")}`);
      return;
    }

    // If valid, proceed with submit
    handleSubmit();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const timeString = `${formatTimeTo12h(startTime)} - ${formatTimeTo12h(endTime)}`;

      const payload = {
        title: formData.title.trim() || "Untitled Offer",
        description: formData.description.trim(),
        longDesc: formData.longDesc.trim(),
        couponCode: formData.couponCode.trim(),
        availableHours: timeString,
        ctaText: formData.ctaText.trim(),
        ctaLink: formData.ctaLink.trim(),
        displayLocation: formData.displayLocation,
        propertyId: parseInt(formData.propertyId) || null,
        propertyTypeId: formData.propertyTypeId || null,
        imageMediaId: uploadedMediaId || formData.imageMediaId,
        expiresAt: formData.expiresAt,
        isActive: formData.isActive,
      };

      console.log("📦 Submitting payload:", payload);

      if (editingOffer) {
        await updateDailyOfferById(editingOffer.id, payload);
        showSuccess("Offer updated successfully");
      } else {
        await createDailyOffer(payload);
        showSuccess("Offer created successfully");
      }
      onClose(true);
      resetForm();
    } catch (error) {
      console.error("Submit error:", error);
      showError(error.response?.data?.message || "Failed to save offer");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <style>{inputStyles}</style>
      <div
        className="custom-modal-container h-[90vh] overflow-hidden rounded-xl shadow-2xl flex flex-col"
        style={{ backgroundColor: colors.contentBg }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b bg-inherit">
          <div className="flex items-center gap-3">
            <h3
              className="text-xl font-bold"
              style={{ color: colors.textPrimary }}
            >
              {editingOffer ? "Update Daily Offer" : "Assign Offer to Property"}
            </h3>
            {/* Banner Detection Badge */}
            {isBannerDetected && detectedBannerType && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-full text-xs font-bold shadow-lg animate-pulse">
                <Instagram size={14} />
                <span>{detectedBannerType.badge}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => onClose(false)}
            className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Left Column */}
            <div className="space-y-5">
              {/* Display Location */}
              <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100 space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold uppercase text-blue-600">
                  <Home size={14} /> Display Location
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "HOME_PAGE", label: "Home Page" },
                    { id: "PROPERTY_PAGE", label: "Property" },
                    { id: "BOTH", label: "Both" },
                  ].map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({ ...p, displayLocation: loc.id }))
                      }
                      className={`py-2 text-[11px] font-bold rounded-md border transition-all cursor-pointer ${
                        formData.displayLocation === loc.id
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                      }`}
                    >
                      {loc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                  <Building2 size={12} /> Select Property
                  {isPropertyRequired() && <span className="text-red-500">*</span>}
                  {!isPropertyRequired() && (
                    <span className="ml-auto text-[10px] text-gray-500 font-normal italic">
                      (Optional for Home Page only)
                    </span>
                  )}
                </label>
                <select
                  value={formData.propertyId || ""}
                  onChange={(e) => handlePropertySelect(e.target.value)}
                  onBlur={() => setTouchedFields((prev) => ({ ...prev, propertyId: true }))}
                  className={`w-full p-2.5 rounded-lg border bg-[#F3F4F6] text-sm focus:ring-1 focus:ring-primary/20 outline-none ${
                    isPropertyRequired() && touchedFields.propertyId && !formData.propertyId
                      ? "border-red-500 border-2"
                      : ""
                  }`}
                >
                  <option value="">Choose a property...</option>
                  {availableProperties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.propertyName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title and Coupon Code */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                    Offer Title
                    {!isBannerDetected && (
                      <span className="text-red-500">*</span>
                    )}
                    {isBannerDetected && (
                      <span className="ml-auto text-[10px] text-gray-500 font-normal italic">
                        (Optional for banners)
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, title: e.target.value }))
                    }
                    onBlur={() => setTouchedFields((prev) => ({ ...prev, title: true }))}
                    className={`w-full p-2.5 rounded-lg border bg-[#F3F4F6] text-sm ${
                      !isBannerDetected && touchedFields.title && !formData.title
                        ? "border-red-500 border-2"
                        : ""
                    }`}
                    placeholder="Weekend Special"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                    Coupon Code
                    {isBannerDetected && (
                      <span className="ml-auto text-[10px] text-gray-500 font-normal italic">
                        (Optional)
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={formData.couponCode}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        couponCode: e.target.value.toUpperCase(),
                      }))
                    }
                    className="w-full p-2.5 rounded-lg border bg-[#F3F4F6] text-sm font-mono"
                    placeholder="WKND20"
                  />
                </div>
              </div>

              {/* Validity Hours */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                  <Clock size={12} /> Validity Hours
                  {isBannerDetected && (
                    <span className="ml-auto text-[10px] text-gray-500 font-normal italic">
                      (Optional)
                    </span>
                  )}
                </label>
                <div className="flex items-center gap-3 p-2 bg-[#F3F4F6] border rounded-lg">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="bg-transparent text-sm font-medium outline-none cursor-pointer"
                  />
                  <span className="text-gray-400 font-bold text-xs">TO</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="bg-transparent text-sm font-medium outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Short Tagline */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  Short Tagline
                  {isBannerDetected && (
                    <span className="ml-auto text-[10px] text-gray-500 font-normal italic">
                      (Optional)
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                  className="w-full p-2.5 rounded-lg border bg-[#F3F4F6] text-sm"
                  maxLength={50}
                />
              </div>

              {/* CTA Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                  <LinkIcon size={12} /> CTA Link
                  {isBannerDetected && (
                    <span className="ml-auto text-[10px] text-gray-500 font-normal italic">
                      (Optional)
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={formData.ctaLink}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, ctaLink: e.target.value }))
                  }
                  className="w-full p-2.5 rounded-lg border bg-[#F3F4F6] text-sm"
                  placeholder="https://example.com/offer"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                  <ImageIcon size={14} /> Offer Visual
                  <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() =>
                    document.getElementById("offer-img-upload")?.click()
                  }
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-all bg-[#F3F4F6] ${
                    touchedFields.image && !uploadedMediaId && !formData.imageMediaId
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    id="offer-img-upload"
                    type="file"
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                  />

                  {uploadingImage ? (
                    <Loader2
                      className="animate-spin mx-auto text-primary"
                      size={32}
                    />
                  ) : (
                    <Upload className="mx-auto text-gray-300" size={32} />
                  )}
                  <p className="mt-2 text-xs font-medium text-gray-500">
                    Square Banner (1080x1080) or Reel (9:16) Recommended
                  </p>
                  {imageDimensions && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-white border rounded-full text-xs font-mono shadow-sm">
                      <Ruler size={12} className="text-blue-500" />
                      <span className="font-bold">
                        {imageDimensions.width} × {imageDimensions.height}
                      </span>
                      {detectedBannerType && (
                        <span className="text-purple-600 font-semibold">
                          ({detectedBannerType.aspectRatio})
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {imagePreview && (
                  <div className="mt-4 relative group rounded-xl overflow-hidden border shadow-lg">
                    {mediaType === "VIDEO" ? (
                      <video
                        src={imagePreview}
                        className="w-full h-48 object-cover"
                        controls
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={imagePreview}
                        className="w-full h-48 object-cover"
                        alt="Preview"
                      />
                    )}

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(null);
                        setUploadedMediaId(null);
                        setImageDimensions(null);
                        setDetectedBannerType(null);
                        setIsBannerDetected(false);
                        setMediaType(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Banner Detection Info Alert */}
              {isBannerDetected && detectedBannerType && (
                <div className="p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 border-2 border-purple-200 rounded-lg shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Instagram className="text-white" size={20} />
                    </div>
                    <div className="space-y-2 flex-1">
                      <p className="text-sm font-bold text-purple-900">
                        {detectedBannerType.label} Detected!
                      </p>
                      <p className="text-xs text-purple-700 leading-relaxed">
                        Dimensions:{" "}
                        <span className="font-mono font-semibold">
                          {detectedBannerType.dimensions.width}×
                          {detectedBannerType.dimensions.height}
                        </span>{" "}
                        ({detectedBannerType.aspectRatio})
                      </p>
                      <p className="text-xs text-purple-600 leading-relaxed">
                        Title and Description are now optional. {isPropertyRequired() && "Property is still required based on display location."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Status */}
              <div className="p-4 border rounded-lg bg-[#F3F4F6] flex items-center justify-between">
                <p className="text-xs font-bold uppercase text-gray-600">
                  Active Status
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, isActive: !p.isActive }))
                  }
                  className={`h-6 w-11 rounded-full transition-colors relative cursor-pointer shadow-inner ${formData.isActive ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all shadow-md ${formData.isActive ? "left-6" : "left-1"}`}
                  />
                </button>
              </div>

              {/* Expires On */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  Expires On
                  {isBannerDetected && (
                    <span className="ml-auto text-[10px] text-gray-500 font-normal italic">
                      (Optional)
                    </span>
                  )}
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, expiresAt: e.target.value }))
                  }
                  className="w-full p-2.5 rounded-lg border bg-[#F3F4F6] text-sm"
                />
              </div>

              {/* Detailed Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  Detailed Description
                  {isBannerDetected && (
                    <span className="ml-auto text-[10px] text-gray-500 font-normal italic">
                      (Optional)
                    </span>
                  )}
                </label>
                <textarea
                  value={formData.longDesc}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, longDesc: e.target.value }))
                  }
                  rows={4}
                  className="w-full p-2.5 rounded-lg border bg-[#F3F4F6] text-sm resize-none"
                  placeholder="Enter full offer details..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={() => onClose(false)}
            className="px-6 py-2.5 rounded-lg border font-bold text-gray-600 hover:bg-white transition-all cursor-pointer"
          >
            Cancel
          </button>
          
          {/* Wrapper div to capture clicks even when button is disabled */}
          <div onClick={handleButtonClick}>
            <button
              disabled={loading || uploadingImage}
              className={`px-10 py-2.5 rounded-lg font-bold text-white shadow-lg shadow-primary/20 flex items-center gap-2 transition-all ${
                loading || uploadingImage || !isFormValid()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-90 cursor-pointer"
              }`}
              style={{ backgroundColor: colors.primary }}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : editingOffer ? (
                "Update Offer"
              ) : (
                "Create Offer"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateOfferModal;