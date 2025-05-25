// This file defines the AuthContext used to manage and provide user authentication state throughout the app.
// It exposes the `AuthProvider` component to wrap your app with context, and the `useAuth` hook to access the user.
// When the app loads, it checks `localStorage` for an access token and decodes it using `jwtDecode`
// to extract the user's ID and role. This makes the user data available globally via context.
// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  userId: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({ userId: decoded.userId, role: decoded.role });
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }
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
