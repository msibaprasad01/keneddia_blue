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
  (error) => Promise.reject(error)
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

export default API;
