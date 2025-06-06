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
      VITE_FRONTEND_URL: string;
      VITE_RESERVATIONS_API: string;
    };
  }
}

// Debug log to verify environment variables
console.log("Environment variables:", {
  API_BASE: import.meta.env.VITE_API_BASE_URL,
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL,
  RESERVATIONS_API: import.meta.env.VITE_RESERVATIONS_API,
});

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Debug log to verify axios instance creation
console.log("Axios instance created with config:", {
  baseURL: api.defaults.baseURL,
  withCredentials: api.defaults.withCredentials,
});

// --- Refresh Promise Queue ---
let refreshPromise: Promise<string> | null = null;

// Function to check if token is expired or about to expire (within 5 minutes)
const isTokenExpiringSoon = (token: string): boolean => {
  if (!token) return true;

  try {
    const decoded: any = jwtDecode(token);
    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

    console.log("Token expiration check:", {
      expiresIn: (expirationTime - currentTime) / (60 * 1000),
      isExpiringSoon: expirationTime - currentTime < fiveMinutes,
    });

    return expirationTime - currentTime < fiveMinutes;
  } catch (error) {
    console.error("Token decode error:", error);
    return true; // If token can't be decoded, consider it expired
  }
};

// Function to refresh token (with queue)
const refreshToken = async (): Promise<string> => {
  console.log("Attempting to refresh token...");

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const refreshTokenValue = localStorage.getItem("refreshToken");
        const accessToken = localStorage.getItem("accessToken");

        if (!refreshTokenValue || !accessToken) {
          throw new Error("No tokens available for refresh");
        }

        console.log("Making refresh token request...");
        const response = await api.post("/auth/refresh-token", {
          accessToken,
          refreshToken: refreshTokenValue,
        });

        console.log("Refresh token response:", response.data);

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        return newAccessToken;
      } catch (error) {
        console.error("Refresh token failed:", error);
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
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    console.log("Request interceptor - URL:", config.url);

    const token = localStorage.getItem("accessToken");

    if (token) {
      console.log("Found access token, checking expiration...");

      if (isTokenExpiringSoon(token)) {
        console.log("Token is expiring soon, attempting refresh...");
        try {
          const newToken = await refreshToken();
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${newToken}`;
          console.log("Using refreshed token for request");
        } catch (error) {
          console.error("Refresh failed, using original token:", error);
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      } else {
        console.log("Token is valid, using existing token");
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      console.log("No access token found");
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("Response received:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  async (error: AxiosError) => {
    console.error("Response error:", {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
    });

    if (!error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("401 detected, attempting token refresh...");
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        console.log("Retrying original request with new token");
        return api(originalRequest);
      } catch (refreshError) {
        console.error(
          "Refresh token failed in response interceptor:",
          refreshError
        );
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
