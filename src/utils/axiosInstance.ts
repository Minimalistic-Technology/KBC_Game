import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_DEV,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const msg = error.response.data?.message || "";
      // Check for specific session expired message or general Unauthorized
      if (typeof window !== "undefined" && (msg === "Session expired. Logged in from another device." || msg === "Unauthorized")) {
        // Clear any local session data if needed
        sessionStorage.removeItem('pin_verified');

        // Redirect to login only if not already there
        if (!window.location.pathname.includes("/auth/login")) {
          window.location.href = "/auth/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;