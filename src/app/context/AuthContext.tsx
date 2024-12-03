// context/AuthContext.tsx
"use client";

import { GetServerSideProps } from "next";
import React, { createContext, useContext, useState, ReactNode } from "react";
interface UserInfo {
  id: number | null;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  photo: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setRole: (role: string) => void;
  info: UserInfo | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const [info, setInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
            id: data.user.id,
            username: data.user.username,
            first_name: data.user.first_name,
            last_name: data.user.last_name,
            photo: data.user.photo,
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
      } finally {
        setLoading(false); // Hoàn tất việc tải dữ liệu
      }
    };
    checkAuth();
  }, [isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  return (
    <AuthContext.Provider
      value={{
        info,
        isAuthenticated,
        loading,
        role,
        setIsAuthenticated,
        setRole,
      }}
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

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch("https://api.example.com/products");
  const data = await res.json();

  return {
    props: {
      products: data.products,
    },
  };
};
