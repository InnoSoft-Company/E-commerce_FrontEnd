"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, tokenHelper, User } from "@/src/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: any) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]     = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount — try to restore session
  useEffect(() => {
    const restore = async () => {
      const access = tokenHelper.getAccess();
      if (!access) { setLoading(false); return; }
      try {
        const me = await authApi.me();
        setUser(me);
      } catch {
        tokenHelper.clear();
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const tokens = await authApi.login(email, password);
    tokenHelper.save(tokens.access, tokens.refresh);
    const me = await authApi.me();
    setUser(me);
    return me.is_staff || me.is_admin;
  };

  const register = async (data: any) => {
    const res = await authApi.register(data);
    tokenHelper.save(res.tokens.access, res.tokens.refresh);
    setUser(res.user);
  };

  const logout = () => {
    const refresh = tokenHelper.getRefresh();
    if (refresh) authApi.logout(refresh).catch(() => {});
    tokenHelper.clear();
    setUser(null);
  };

  const updateUser = async (data: Partial<User>) => {
    const updated = await authApi.updateProfile(data);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{
      user, loading,
      isAuthenticated: !!user,
      isAdmin: !!(user?.is_staff || user?.is_admin),
      login, logout, register, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
