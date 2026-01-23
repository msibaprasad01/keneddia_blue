import axios from "axios";

const apiUrl = "http://192.168.0.135:6090/";

const API = axios.create({
  baseURL: apiUrl,
});

API.interceptors.request.use(
  (req) => {
    // Check both storages
    const token =
      sessionStorage.getItem("accessToken") ||
      localStorage.getItem("accessToken");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error),
);

// AUTH
export const loginAPI = (data) => API.post("api/v1/staff/login", data);

// ==================================================
// 👥 ROLES
// ==================================================

export const createRole = (data) => API.post("api/v1/roles", data);

export const getAllRoles = () => API.get("api/v1/showAll");

// ==================================================
// 👤 USERS
// ==================================================

export const createUser = (data) => API.post("api/v1/users/create", data);

export const getUsersPaginated = () => API.get("api/v1/users/auth/paginated");

// ==================================================
// 📍 LOCATIONS
// ==================================================

export const addLocation = (data) => API.post("api/v1/locations/create", data);

export const getAllLocations = () => API.get("api/v1/locations/all");

// ==================================================
// 🏨 PROPERTY TYPES
// ==================================================

export const addPropertyType = (data) =>
  API.post("api/v1/property-types/create", data);

export const getPropertyTypes = () => API.get("api/v1/property-types");

export const getPropertyTypeById = (id) =>
  API.get(`api/v1/property-types/${id}`);

export const getActivePropertyTypes = () =>
  API.get("api/v1/property-types/active");

export const updatePropertyTypeStatus = (id, isActive) =>
  API.patch(`api/v1/property-types/${id}/status`, null, {
    params: { isActive },
  });

// ==================================================
// 🍽️ PROPERTY CATEGORIES
// ==================================================

export const addPropertyCategory = (data) =>
  API.post("api/v1/property-categories/add", data);

export const getAllPropertyCategories = () =>
  API.get("api/v1/property-categories/all");

export const getActivePropertyCategories = () =>
  API.get("api/v1/property-categories/all?activeOnly=true");

export const updatePropertyCategoryStatus = (id, isActive) =>
  API.patch(`api/v1/property-categories/${id}/status`, null, {
    params: { isActive },
  });

// ==================================================
// 🏢 PROPERTIES
// ==================================================

export const addProperty = (type, data) =>
  API.post(`api/v1/properties/add/${type}`, data);
export const getAllProperties = () => API.get("api/v1/properties/showAll");

// ==================================================
// 🌐 WEBSITE PAGES (CMS)
// ==================================================

// ---------- HERO SECTION ----------

export const createOrUpdateHeroSection = (formData) =>
  API.post("api/v1/hero-sections", formData);

export const getHeroSection = () => API.get(`api/v1/hero-sections`);

// ---------- ABOUT US ----------

export const addAboutUs = (data) => API.post("api/v1/admin/about-us", data);

export const updateAboutUs = (id, data) =>
  API.put(`api/v1/admin/about-us/${id}`, data);

export const getAboutUsAdminById = (id) =>
  API.get(`api/v1/admin/about-us/${id}`);

export const getAboutUsPublicById = (id) =>
  API.get(`api/v1/public/about-us/${id}`);

// ---------- ABOUT US : VENTURES ----------

export const addVenture = (aboutUsId, formData) =>
  API.post(`api/v1/admin/about-us/${aboutUsId}/ventures`, formData);

export const updateVenture = (ventureId, formData) =>
  API.put(`api/v1/admin/about-us/ventures/${ventureId}`, formData);

export const getVenturesByAboutUsId = (aboutUsId) =>
  API.get(`api/v1/admin/about-us/${aboutUsId}/ventures`);

export const getPublicVenturesByAboutUsId = (aboutUsId) =>
  API.get(`api/v1/public/about-us/${aboutUsId}/ventures`);

// ---------- ABOUT US : RECOGNITIONS ----------

export const addRecognition = (aboutUsId, data) =>
  API.post(`api/v1/admin/about-us/${aboutUsId}/recognitions`, data);

export const updateRecognition = (recognitionId, data) =>
  API.put(`api/v1/admin/about-us/recognitions/${recognitionId}`, data);

export const getRecognitionsByAboutUsId = (aboutUsId) =>
  API.get(`api/v1/admin/about-us/${aboutUsId}/recognitions`);

export const getPublicRecognitionsByAboutUsId = (aboutUsId) =>
  API.get(`api/v1/public/about-us/${aboutUsId}/recognitions`);

// ---------- GUEST EXPERIENCE ----------

export const addGuestExperienceSection = (data) =>
  API.post("api/v1/guest-experience/section", data);

export const getGuestExperienceSection = () =>
  API.get("api/v1/guest-experience/section");

export const addGuestExperienceItem = (formData) =>
  API.post("api/v1/guest-experience", formData);

export const updateGuestExperienceItem = (id, formData) =>
  API.put(`api/v1/guest-experience/${id}`, formData);

// ---------- OUR PROPERTIES (HOMEPAGE) ----------

export const createOrUpdateOurPropertiesSection = (data) =>
  API.post("api/v1/our-properties/section", data);

export const getOurPropertiesSection = () =>
  API.get("api/v1/our-properties/section");

export const addOurPropertyItem = (sectionId, formData) =>
  API.post(`api/v1/our-properties/${sectionId}/items`, formData);

export const updateOurPropertyItem = (itemId, formData) =>
  API.put(`api/v1/our-properties/items/${itemId}`, formData);

export const getOurPropertyItemsBySectionId = (sectionId) =>
  API.get(`api/v1/our-properties/${sectionId}/items`);

// ---------- KENNEDIA GROUP ----------

export const createOrUpdateKennediaGroup = (data) =>
  API.post("api/v1/kennedia-group", data);

export const getKennediaGroup = () => API.get("api/v1/kennedia-group");

export default API;
