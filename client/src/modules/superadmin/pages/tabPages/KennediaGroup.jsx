import React, { useState, useEffect, useCallback } from "react";
import { colors } from "@/lib/colors/colors";
import {
  Plus,
  Power,
  PowerOff,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  createOrUpdateKennediaGroup,
  getKennediaGroup,
  enableKennediaDivision,
  disableKennediaDivision,
} from "@/Api/Api";
import { toast } from "react-hot-toast";

// ── Small helpers ──────────────────────────────────────────────────────────
const RequiredLabel = ({ children }) => (
  <label
    className="block text-xs font-semibold mb-1"
    style={{ color: colors.textPrimary }}
  >
    {children} <span className="text-red-500">*</span>
  </label>
);

const ErrorMsg = ({ msg }) =>
  msg ? (
    <p className="mt-1 text-[11px] text-red-500 font-medium">{msg}</p>
  ) : null;

const fieldCls = (hasError) =>
  `w-full px-3 py-2 rounded border text-sm transition-colors outline-none focus:ring-2 ${
    hasError
      ? "border-red-400 bg-red-50 focus:ring-red-200"
      : "border-gray-200 focus:ring-blue-100 focus:border-blue-400"
  }`;

function KennediaGroup() {
  const [headerSettings, setHeaderSettings] = useState({
    mainTitle: "",
    subTitle: "",
  });
  const [centerLogoSettings, setCenterLogoSettings] = useState({
    logoText: "",
    logoSubText: "",
  });
  const [businessDivisions, setBusinessDivisions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [existingData, setExistingData] = useState(null);

  // ── Validation errors ────────────────────────────────────────────────────
  const [errors, setErrors] = useState({});

  const clearError = (key) =>
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchKennediaGroup = useCallback(async () => {
    try {
      setFetching(true);
      const response = await getKennediaGroup();
      if (response.data) {
        const data = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        if (data) {
          setExistingData(data);
          setHeaderSettings({
            mainTitle: data.mainTitle || "",
            subTitle: data.subTitle || "",
          });
          setCenterLogoSettings({
            logoText: data.logoText || "",
            logoSubText: data.logoSubText || "",
          });
          if (data.divisions && Array.isArray(data.divisions)) {
            setBusinessDivisions(
              data.divisions.map((div) => ({
                id: div.id,
                icon: div.icon || "",
                title: div.title || "",
                description: div.description || "",
                ctaLink: div.ctaLink || "",
                displayOrder: div.displayOrder || 1,
                isActive: div.active !== undefined ? div.active : true,
                isExisting: true,
              })),
            );
          }
        }
      }
    } catch (error) {
      console.error("Error fetching Kennedia Group:", error);
      if (error.response?.status !== 404)
        toast.error("Failed to load Kennedia Group data");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchKennediaGroup();
  }, [fetchKennediaGroup]);

  // ── Validate ─────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!headerSettings.mainTitle.trim())
      newErrors.mainTitle = "Main title is required";
    if (!headerSettings.subTitle.trim())
      newErrors.subTitle = "Subtitle is required";
    if (!centerLogoSettings.logoText.trim())
      newErrors.logoText = "Logo text is required";
    if (!centerLogoSettings.logoSubText.trim())
      newErrors.logoSubText = "Logo subtext is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleToggleStatus = async (division) => {
    if (!division.isExisting) {
      toast.error(
        "Please save the group first before toggling status of new items",
      );
      return;
    }
    try {
      setLoading(true);
      if (division.isActive) {
        await disableKennediaDivision(division.id);
        toast.success(`${division.title} disabled successfully`);
      } else {
        await enableKennediaDivision(division.id);
        toast.success(`${division.title} enabled successfully`);
      }
      await fetchKennediaGroup();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDivision = () => {
    if (businessDivisions.length >= 5) {
      toast.error("You can only add up to 5 business divisions");
      return;
    }
    setBusinessDivisions([
      ...businessDivisions,
      {
        id: Date.now(),
        icon: "",
        title: "",
        description: "",
        ctaLink: "",
        displayOrder: businessDivisions.length + 1,
        isActive: true,
        isExisting: false,
      },
    ]);
  };

  const handleDivisionChange = (id, field, value) =>
    setBusinessDivisions(
      businessDivisions.map((d) =>
        d.id === id ? { ...d, [field]: value } : d,
      ),
    );

  const handleMoveDivision = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === businessDivisions.length - 1)
    )
      return;
    const newDivisions = [...businessDivisions];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newDivisions[index], newDivisions[targetIndex]] = [
      newDivisions[targetIndex],
      newDivisions[index],
    ];
    newDivisions.forEach((div, idx) => {
      div.displayOrder = idx + 1;
    });
    setBusinessDivisions(newDivisions);
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        mainTitle: headerSettings.mainTitle,
        subTitle: headerSettings.subTitle,
        logoText: centerLogoSettings.logoText,
        logoSubText: centerLogoSettings.logoSubText,
        divisions: businessDivisions.map((div) => ({
          icon: div.icon,
          title: div.title,
          description: div.description,
          ctaLink: div.ctaLink,
          displayOrder: div.displayOrder,
        })),
      };
      await createOrUpdateKennediaGroup(payload);
      toast.success("Kennedia Group saved successfully!");
      setErrors({});
      await fetchKennediaGroup();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save Kennedia Group",
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div
        className="rounded-lg p-6 flex items-center justify-center h-[400px]"
        style={{ backgroundColor: colors.contentBg }}
      >
        <Loader2
          size={32}
          className="animate-spin"
          style={{ color: colors.primary }}
        />
      </div>
    );

  return (
    <div className="space-y-3">
      {/* ── Header Settings ─────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 sm:p-5 shadow-sm"
        style={{ backgroundColor: colors.contentBg }}
      >
        <div className="flex items-center gap-2 mb-4">
          <h3
            className="text-sm font-semibold m-0"
            style={{ color: colors.textPrimary }}
          >
            Header Settings
          </h3>
          <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">
            * Required
          </span>
        </div>

        <div className="space-y-3">
          {/* Main Title */}
          <div>
            <RequiredLabel>Main Title</RequiredLabel>
            <input
              type="text"
              value={headerSettings.mainTitle}
              onChange={(e) => {
                setHeaderSettings({
                  ...headerSettings,
                  mainTitle: e.target.value,
                });
                if (e.target.value.trim()) clearError("mainTitle");
              }}
              className={fieldCls(errors.mainTitle)}
              placeholder="e.g. The Kennedia Group"
            />
            <ErrorMsg msg={errors.mainTitle} />
          </div>

          {/* Subtitle */}
          <div>
            <RequiredLabel>Subtitle</RequiredLabel>
            <input
              type="text"
              value={headerSettings.subTitle}
              onChange={(e) => {
                setHeaderSettings({
                  ...headerSettings,
                  subTitle: e.target.value,
                });
                if (e.target.value.trim()) clearError("subTitle");
              }}
              className={fieldCls(errors.subTitle)}
              placeholder="e.g. A Legacy of Excellence"
            />
            <ErrorMsg msg={errors.subTitle} />
          </div>
        </div>
      </div>

      {/* ── Center Logo Settings ─────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 sm:p-5 shadow-sm"
        style={{ backgroundColor: colors.contentBg }}
      >
        <div className="flex items-center gap-2 mb-4">
          <h3
            className="text-sm font-semibold m-0"
            style={{ color: colors.textPrimary }}
          >
            Center Logo Settings
          </h3>
          <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">
            * Required
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Logo Text */}
          <div>
            <RequiredLabel>Logo Text</RequiredLabel>
            <input
              type="text"
              value={centerLogoSettings.logoText}
              onChange={(e) => {
                setCenterLogoSettings({
                  ...centerLogoSettings,
                  logoText: e.target.value,
                });
                if (e.target.value.trim()) clearError("logoText");
              }}
              className={fieldCls(errors.logoText)}
              placeholder="e.g. KENNEDIA"
            />
            <ErrorMsg msg={errors.logoText} />
          </div>

          {/* Logo Subtext */}
          <div>
            <RequiredLabel>Logo Subtext</RequiredLabel>
            <input
              type="text"
              value={centerLogoSettings.logoSubText}
              onChange={(e) => {
                setCenterLogoSettings({
                  ...centerLogoSettings,
                  logoSubText: e.target.value,
                });
                if (e.target.value.trim()) clearError("logoSubText");
              }}
              className={fieldCls(errors.logoSubText)}
              placeholder="e.g. GROUP"
            />
            <ErrorMsg msg={errors.logoSubText} />
          </div>
        </div>
      </div>

      {/* ── Business Divisions ───────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 sm:p-5 shadow-sm"
        style={{ backgroundColor: colors.contentBg }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-sm font-semibold m-0"
            style={{ color: colors.textPrimary }}
          >
            Business Divisions ({businessDivisions.length}/5)
          </h3>
          <button
            onClick={handleAddDivision}
            disabled={businessDivisions.length >= 5}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-white disabled:opacity-50 transition-colors"
          >
            <Plus size={16} /> Add Division
          </button>
        </div>

        <div className="space-y-3">
          {businessDivisions.map((division, index) => (
            <div
              key={division.id}
              className="rounded-lg p-4 border transition-all"
              style={{
                backgroundColor: colors.mainBg,
                borderColor: colors.border,
                opacity: division.isActive ? 1 : 0.6,
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={division.icon}
                  onChange={(e) =>
                    handleDivisionChange(division.id, "icon", e.target.value)
                  }
                  className="w-full px-2.5 py-1.5 rounded border text-sm border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="Icon"
                />
                <input
                  type="text"
                  value={division.title}
                  onChange={(e) =>
                    handleDivisionChange(division.id, "title", e.target.value)
                  }
                  className="w-full px-2.5 py-1.5 rounded border text-sm border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={division.description}
                  onChange={(e) =>
                    handleDivisionChange(
                      division.id,
                      "description",
                      e.target.value,
                    )
                  }
                  className="w-full px-2.5 py-1.5 rounded border text-sm border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="Description"
                />
                <input
                  type="number"
                  value={division.displayOrder}
                  readOnly
                  className="w-full px-2.5 py-1.5 rounded border text-sm bg-muted opacity-50"
                />
              </div>

              <div className="mt-3">
                <input
                  type="text"
                  value={division.ctaLink}
                  onChange={(e) =>
                    handleDivisionChange(division.id, "ctaLink", e.target.value)
                  }
                  className="w-full px-2.5 py-1.5 rounded border text-sm border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="CTA Link (e.g. https://example.com)"
                />
              </div>

              <div
                className="flex items-center justify-between mt-3 pt-3 border-t"
                style={{ borderColor: colors.border }}
              >
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveDivision(index, "up")}
                    disabled={index === 0}
                    className="p-1.5 rounded border disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => handleMoveDivision(index, "down")}
                    disabled={index === businessDivisions.length - 1}
                    className="p-1.5 rounded border disabled:opacity-30"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <button
                  onClick={() => handleToggleStatus(division)}
                  disabled={loading || !division.isExisting}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all shadow-sm ${
                    !division.isExisting
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : division.isActive
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                >
                  {division.isActive ? (
                    <Power size={14} />
                  ) : (
                    <PowerOff size={14} />
                  )}
                  {division.isActive ? "Active" : "Disabled"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Submit ───────────────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 sm:p-5 shadow-sm"
        style={{ backgroundColor: colors.contentBg }}
      >
        {/* Summary of errors above submit */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs font-bold text-red-600 mb-1">
              Please fix the following errors:
            </p>
            <ul className="list-disc list-inside space-y-0.5">
              {Object.values(errors).map((msg, i) => (
                <li key={i} className="text-xs text-red-500">
                  {msg}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold bg-primary text-white disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : existingData ? (
            "Update Kennedia Group"
          ) : (
            "Save Kennedia Group"
          )}
        </button>
      </div>
    </div>
  );
}

export default KennediaGroup;
