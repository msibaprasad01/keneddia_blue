import axios from "axios";

// ==================================================
// 🌐 BASE URL SETUP
// ==================================================

let apiUrl = "";

/**
 * Local mock server (same format as dev/qa/prod)
 * Example endpoints:
 * http://localhost:8080/api/v1/login
 */
if (process.env.NODE_ENV === "development") {
  apiUrl = "http://localhost:8080/";
} else {
  apiUrl = "https://devapi.jyotsnahealth.com/";
}

// ==================================================
// 🚀 AXIOS INSTANCE
// ==================================================

const API = axios.create({
  baseURL: apiUrl,
});

// ==================================================
// 🔐 REQUEST INTERCEPTOR
// ==================================================

API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

// ==================================================
// 🔐 AUTH APIs
// ==================================================

export const login = (requestData) =>
  API.post("api/v1/login", requestData);

export const logout = (username) =>
  API.post("api/v1/logout", { username });

export const refreshToken = () =>
  API.post("api/v1/refresh-token");

export const getProfile = (role) =>
  API.get(`v1/${role}/me`);
