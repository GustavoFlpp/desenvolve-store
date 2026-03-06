"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, LoginCredentials, AuthResponse } from "@/types/auth";
import { Address } from "@/types/address";
import { login } from "@/services/api";

interface AuthContextData {
  user: User | null;
  token: string | null;
  avatar: string | null;
  address: Address | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginUser: (credentials: LoginCredentials) => Promise<void>;
  loginOffline: (user: Omit<User, "id">) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  updateAvatar: (base64: string) => void;
  updateAddress: (address: Address) => void;
  clearAddress: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

const AUTH_STORAGE_KEY = "desenvolve-store-auth";
const TOKEN_STORAGE_KEY = "desenvolve-store-token";
const AVATAR_STORAGE_KEY = "desenvolve-store-avatar";
const ADDRESS_STORAGE_KEY = "desenvolve-store-address";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Carregar dados de autenticação ao montar
  useEffect(() => {
    console.log("[AUTH] Montando AuthContext, carregando dados do localStorage");
    const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    console.log("[AUTH] savedUser:", savedUser);
    console.log("[AUTH] savedToken:", savedToken);

    if (savedUser && savedToken) {
      try {
        console.log("[AUTH] Parseando usuário salvo");
        const parsedUser = JSON.parse(savedUser);
        console.log("[AUTH] Usuário parseado:", parsedUser);
        setUser(parsedUser);
        setToken(savedToken);
        console.log("[AUTH] Usuário e token carregados com sucesso");
      } catch (err) {
        console.error("[AUTH] Erro ao carregar autenticação:", err);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } else {
      console.log("[AUTH] Nenhum usuário ou token salvo");
    }
    const savedAvatar = localStorage.getItem(AVATAR_STORAGE_KEY);
    if (savedAvatar) setAvatar(savedAvatar);
    const savedAddress = localStorage.getItem(ADDRESS_STORAGE_KEY);
    if (savedAddress) {
      try {
        setAddress(JSON.parse(savedAddress));
      } catch (err) {
        console.error("Erro ao carregar endereço:", err);
        localStorage.removeItem(ADDRESS_STORAGE_KEY);
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

  const loginOffline = async (userData: Omit<User, "id">) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("[AUTH] loginOffline: Fazendo login offline com:", userData);

      const fullUser: User = {
        id: 1,
        ...userData,
      };

      const token = "fake-token-" + Date.now();

      // Salvar dados no localStorage
      setToken(token);
      setUser(fullUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fullUser));
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      console.log("[AUTH] loginOffline: Login bem-sucedido, dados salvos");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer login offline";
      setError(errorMessage);
      console.error("[AUTH] loginOffline error:", errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAvatar(null);
    setAddress(null);
    setError(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(AVATAR_STORAGE_KEY);
    localStorage.removeItem(ADDRESS_STORAGE_KEY);
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const updateAvatar = (base64: string) => {
    setAvatar(base64);
    localStorage.setItem(AVATAR_STORAGE_KEY, base64);
  };

  const updateAddress = (addr: Address) => {
    setAddress(addr);
    localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addr));
  };

  const clearAddress = () => {
    setAddress(null);
    localStorage.removeItem(ADDRESS_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        avatar,
        address,
        isAuthenticated: !!token && !!user,
        isLoading,
        error,
        loginUser,
        loginOffline,
        logout,
        updateUser,
        updateAvatar,
        updateAddress,
        clearAddress,
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
