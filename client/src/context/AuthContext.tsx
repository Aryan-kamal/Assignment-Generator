"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchMe = useCallback(async (t: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        setToken(t);
      } else {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
    } catch {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      fetchMe(stored);
    } else {
      setLoading(false);
    }
  }, [fetchMe]);

  useEffect(() => {
    if (!loading && !user && !pathname.startsWith("/auth")) {
      router.push("/auth/login");
    }
  }, [loading, user, pathname, router]);

  const login = async (email: string, password: string): Promise<string | null> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("token", data.data.token);
      setToken(data.data.token);
      setUser(data.data.user);
      return null;
    }
    return data.error || "Login failed";
  };

  const register = async (name: string, email: string, password: string): Promise<string | null> => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("token", data.data.token);
      setToken(data.data.token);
      setUser(data.data.user);
      return null;
    }
    return data.error || "Registration failed";
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
