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

    try {
      await loginUser({ username, password });
      router.push("/products");
    } catch {
      // Erro já é tratado no contexto
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-50">Desenvolve Store</h1>
        <p className="text-slate-400 text-center mb-8">Faça login na sua conta</p>

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
          <p className="text-sm text-slate-400 text-center mb-4">Credenciais de teste:</p>
          <div className="bg-slate-800 p-4 rounded-xl text-sm space-y-2 border border-slate-700">
            <p className="text-slate-300">
              <strong className="text-slate-200">Usuário:</strong>{" "}
              <code className="bg-slate-900 px-2 py-1 rounded text-violet-400">johnd</code>
            </p>
            <p className="text-slate-300">
              <strong className="text-slate-200">Senha:</strong>{" "}
              <code className="bg-slate-900 px-2 py-1 rounded text-violet-400">m38rmF$</code>
            </p>
          </div>
        </div>

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
