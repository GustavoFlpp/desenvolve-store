"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[LOGIN] Iniciando login com username:", username);

    try {
      console.log("[LOGIN] Chamando loginUser");
      await loginUser({ username, password });
      console.log("[LOGIN] Login bem-sucedido, redirecionando para /products");
      router.push("/products");
    } catch (err) {
      console.error("[LOGIN] Erro ao fazer login:", err);
      // Erro já é tratado no contexto
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-5 shadow-lg shadow-violet-500/25">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-50 mb-1">
            Desenvolve{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600">Store</span>
          </h1>
          <p className="text-sm text-slate-500">Faça login na sua conta</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
              Usuário
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-violet-600 text-white py-2.5 rounded-xl font-semibold hover:bg-violet-500 transition disabled:bg-slate-700 disabled:text-slate-500"
          >
            {isLoading ? "Autenticando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800">
          <p className="text-sm text-slate-400 text-center mb-3">
            Ainda não tem conta?{" "}
            <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-semibold transition">
              Criar Conta
            </Link>
          </p>
          <Link href="/products" className="block text-center text-slate-500 hover:text-slate-300 text-sm transition">
            ← Voltar para produtos
          </Link>
        </div>
      </div>
    </div>
  );
}
