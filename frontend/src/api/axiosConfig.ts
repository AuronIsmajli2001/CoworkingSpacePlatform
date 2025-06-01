import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { jwtDecode } from "jwt-decode";

// Add type declaration for Vite's import.meta.env
declare global {
  interface ImportMeta {
    env: {
      VITE_API_BASE_URL: string;
    };
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Optional: if you want to switch baseURL in production
// You can use VITE_ENV or NODE_ENV if you define it in .env
// Example:
// if (import.meta.env.MODE === 'production') {
//   api.defaults.baseURL = 'https://your-production-url.com';
// }

// --- Refresh Promise Queue ---
let refreshPromise: Promise<string> | null = null;

// Function to check if token is expired or about to expire (within 5 minutes)
const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    return expirationTime - currentTime < fiveMinutes;
  } catch {
    return true; // If token can't be decoded, consider it expired
  }
};

// Function to refresh token (with queue)
const refreshToken = async () => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await api.post("/auth/refresh-token", {
          accessToken: localStorage.getItem("accessToken"),
          refreshToken: localStorage.getItem("refreshToken"),
        });
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        return accessToken;
      } catch (error) {
        localStorage.clear();
        window.location.href = "/auth";
        throw error;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
};

// Request interceptor
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken");
  
  if (token) {
    // Check if token is about to expire
    if (isTokenExpiringSoon(token)) {
      try {
        const newToken = await refreshToken();
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${newToken}`;
      } catch (error) {
        // If refresh fails, continue with current token
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
