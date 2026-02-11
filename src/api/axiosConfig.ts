"use client";

import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

/* =============================
   REQUEST INTERCEPTOR
============================= */
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("authToken");
      if (token) {
        // ✅ Correct Axios v1 way (no TS error)
        config.headers = config.headers ?? {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    if (process.env.NODE_ENV === "development") {
      console.log("Request URL:", `${config.baseURL}${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =============================
   RESPONSE INTERCEPTOR
============================= */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      const requestUrl = String(error.config?.url ?? "");
      const isAuthRequest = requestUrl.includes("/auth/login");
      const isOnLoginPage = window.location.pathname === "/login";

      if (!isAuthRequest && !isOnLoginPage) {
        sessionStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
