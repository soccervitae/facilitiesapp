"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProfile } from "@/types";
import { DEFAULT_USERS } from "@/lib/mockData";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (credential: string, password: string) => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("facilities_session");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch { /* ignore */ }
    }
    setIsLoading(false);
  }, []);

  const login = async (credential: string, password: string) => {
    const stored = localStorage.getItem("facilities_portal_users");
    let users = DEFAULT_USERS;
    if (stored) {
      try { users = JSON.parse(stored); } catch { /* use defaults */ }
    }

    const cleanCred = credential.replace(/\D/g, "");
    const found = users.find((u: any) => {
      const cpfMatch = u.cpf.replace(/\D/g, "") === cleanCred && cleanCred !== "";
      const emailMatch = u.email.toLowerCase() === credential.toLowerCase();
      return (cpfMatch || emailMatch) && u.pass === password;
    });

    if (!found) throw new Error("Credenciais inválidas. Verifique CPF/email e senha.");

    const profile: UserProfile = {
      id: found.cpf,
      nome: found.name,
      email: found.email,
      tipo: found.tipo || found.profile?.toLowerCase() || "morador",
      cpf: found.cpf,
      unidade: found.unit,
      ativo: true,
      condominio_id: "cd-1",
    };

    localStorage.setItem("facilities_session", JSON.stringify(profile));
    setUser(profile);
  };

  const logout = () => {
    localStorage.removeItem("facilities_session");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
