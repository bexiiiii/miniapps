"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { apiClient, type AuthResponse } from "./api-client";

type TelegramWebApp = {
  initData: string;
  initDataUnsafe?: {
    user?: {
      id?: number;
      username?: string;
      first_name?: string;
      last_name?: string;
    };
  };
  ready?: () => void;
  expand?: () => void;
};

type TelegramWindow = Window & {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
};

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  isTelegramApp: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTelegramApp, setIsTelegramApp] = useState(false);

  const handleAuthSuccess = (response: AuthResponse) => {
    setUser(response.user);
    localStorage.setItem("user", JSON.stringify(response.user));
  };

  useEffect(() => {
    let cancelled = false;

    const bootstrapAuth = async () => {
      if (typeof window === "undefined") {
        if (!cancelled) {
          setLoading(false);
        }
        return;
      }

      if (!cancelled) {
        setLoading(true);
      }

      const telegram = (window as TelegramWindow).Telegram?.WebApp;

      if (!cancelled) {
        setIsTelegramApp(Boolean(telegram));
      }

      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const userStr = localStorage.getItem("user");
          if (userStr) {
            try {
              const parsedUser = JSON.parse(userStr) as User;
              if (!cancelled) {
                setUser(parsedUser);
              }
            } catch (error) {
              console.error("Error parsing user data:", error);
              localStorage.removeItem("authToken");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("user");
            }
          }
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("refreshToken");
        }

        const initData = telegram?.initData?.trim();
        if (telegram && initData) {
          try {
            telegram.ready?.();
            telegram.expand?.();
          } catch (readyError) {
            console.warn("Telegram WebApp ready error:", readyError);
          }

          try {
            const response = await apiClient.telegramLogin(initData);
            if (!cancelled) {
              handleAuthSuccess(response);
            }
          } catch (authError) {
            console.error("Telegram authentication failed:", authError);
            if (!cancelled) {
              const errorMessage = authError instanceof Error
                ? authError.message
                : "Не удалось авторизоваться через Telegram. Попробуйте позже.";
              toast.error(errorMessage);
              localStorage.removeItem("authToken");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("user");
              setUser(null);
            }
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void bootstrapAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiClient.login({ email, password });
      handleAuthSuccess(response);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
  }) => {
    try {
      setLoading(true);
      const response = await apiClient.register(userData);
      handleAuthSuccess(response);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isTelegramApp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
