"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, LoginCredentials, AuthResponse } from "@/types/auth";
import { login } from "@/services/api";

interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginUser: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

const AUTH_STORAGE_KEY = "desenvolve-store-auth";
const TOKEN_STORAGE_KEY = "desenvolve-store-token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Carregar dados de autenticação ao montar
  useEffect(() => {
    const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (err) {
        console.error("Erro ao carregar autenticação:", err);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    }
    setIsMounted(true);
  }, []);

  const loginUser = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const authResponse: AuthResponse = await login(credentials);

      // Buscar dados do usuário (simulamos pegando o username)
      const userData: User = {
        id: 1,
        username: credentials.username,
        email: `${credentials.username}@example.com`,
      };

      // Salvar dados
      setToken(authResponse.token);
      setUser(userData);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      localStorage.setItem(TOKEN_STORAGE_KEY, authResponse.token);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer login";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        error,
        loginUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}
