import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // Clean up any accidental "Bearer null" or "Bearer undefined"
      if (
        config.headers.Authorization === "Bearer null" ||
        config.headers.Authorization === "Bearer undefined" ||
        config.headers.Authorization === "Bearer "
      ) {
        delete config.headers.Authorization;
      }

      const token = localStorage.getItem("token");
      if (token && token !== "null" && token !== "undefined" && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 received and in browser, notify auth change if token expired
    if (typeof window !== "undefined" && error.response?.status === 401) {
      const currentToken = localStorage.getItem("token");
      if (currentToken) {
        // Token exists but was rejected by backend -> token expired
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("auth-change"));
      }
    }
    return Promise.reject(error);
  }
);

export default api;