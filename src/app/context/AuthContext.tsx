// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserInfo {
  username: string | null;
  first_name: string | null;
  last_name: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setRole: (role: string) => void;
  info: UserInfo | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const [info, setInfo] = useState<UserInfo | null>(null);
  // Lấy trạng thái đăng nhập từ cookie hoặc API
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          setRole(data.user.role); // Lưu role từ server
          setInfo({
            username: data.user.username,
            first_name: data.user.first_name,
            last_name: data.user.last_name,
          });
        } else {
          setIsAuthenticated(false);
          setRole(null);
          setInfo(null);
        }
      } catch (error) {
        console.error("Failed to check authentication", error);
        setIsAuthenticated(false);
        setRole(null);
        setInfo(null);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ info, isAuthenticated, role, setIsAuthenticated, setRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
