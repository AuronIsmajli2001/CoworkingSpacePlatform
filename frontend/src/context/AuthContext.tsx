// This file defines the AuthContext used to manage and provide user authentication state throughout the app.
// It exposes the `AuthProvider` component to wrap your app with context, and the `useAuth` hook to access the user.
// When the app loads, it checks `localStorage` for an access token and decodes it using `jwtDecode`
// to extract the user's ID and role. This makes the user data available globally via context.
// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axiosConfig";

interface User {
  userId: string;
  role: string;
  membershipId?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const callRefreshToken = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  console.log("[AuthContext] Attempting refresh with:", { accessToken, refreshToken });
  if (!accessToken || !refreshToken) return;

  try {
    const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/api/Auth/refresh-token`, {
      accessToken,
      refreshToken,
    });
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
    console.log("[AuthContext] Refresh successful. Old accessToken:", accessToken, "New accessToken:", newAccessToken);
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    return newAccessToken;
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error("[AuthContext] Refresh failed: Unauthorized/Invalid token", error);
      localStorage.clear();
      window.location.href = "/auth";
    } else {
      console.warn("[AuthContext] Token refresh failed due to network or server error. Will retry on next activity.", error);
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const refreshUserToken = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded: any = jwtDecode(token);
        setUser({
          userId: decoded.userId,
          role: decoded.role,
          membershipId: decoded.membershipId,
        });
      }
    } catch (err) {
      console.error("Failed to refresh user token", err);
      // If token is invalid, clear user state
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } 
  };

  useEffect(() => {
    // Initial token check
    refreshUserToken();

    // Set up periodic token refresh (every 2 minutes)
    const refreshInterval = setInterval(() => {
      callRefreshToken().then(refreshUserToken);
    }, 2 * 60 * 1000); // every 2 minutes

    // Set up visibility change listener to refresh token when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        callRefreshToken().then(refreshUserToken);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Call your refresh logic here
    }, 60 * 1000); // every 1 minute
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
