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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Desenvolve Store</h1>
        <p className="text-gray-600 text-center mb-8">Faça login na sua conta</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {isLoading ? "Autenticando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-4">Credenciais de teste:</p>
          <div className="bg-gray-50 p-4 rounded text-sm space-y-2">
            <p>
              <strong>Usuário:</strong>{" "}
              <code className="bg-white px-2 py-1 rounded">johnd</code>
            </p>
            <p>
              <strong>Senha:</strong>{" "}
              <code className="bg-white px-2 py-1 rounded">m38rmF$</code>
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-3">
            Ainda não tem conta?{" "}
            <Link href="/signup" className="text-green-600 hover:underline font-semibold">
              Criar Conta
            </Link>
          </p>
          <Link href="/products" className="block text-center text-blue-600 hover:underline text-sm">
            ← Voltar para produtos
          </Link>
        </div>
      </div>
    </div>
  );
  /* Testando commit */
}
