"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUser } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { loginUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações
    if (!formData.username.trim()) {
      setError("Usuário é obrigatório");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("E-mail válido é obrigatório");
      return;
    }

    if (formData.password.length < 6) {
      setError("Senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não conferem");
      return;
    }

    try {
      setIsLoading(true);

      // Criar usuário
      await createUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      setSuccess(true);

      // Fazer login automaticamente após 2 segundos
      setTimeout(async () => {
        try {
          await loginUser({
            username: formData.username,
            password: formData.password,
          });
          router.push("/products");
        } catch (loginError) {
          console.error("Erro ao fazer login após cadastro:", loginError);
          // Redirecionar para login mesmo se falhar
          router.push("/login");
        }
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar conta";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-2">Conta Criada!</h1>
          <p className="text-gray-600 mb-6">
            Sua conta foi criada com sucesso. Você será redirecionado em breve...
          </p>
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Criar Conta</h1>
        <p className="text-gray-600 text-center mb-8">Junte-se ao Desenvolve Store</p>

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
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Escolha um nome de usuário"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirme sua senha"
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
            {isLoading ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600 mb-3">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-semibold">
              Fazer Login
            </Link>
          </p>
          <Link href="/products" className="text-gray-600 hover:underline">
            ← Voltar para produtos
          </Link>
        </div>
      </div>
    </div>
  );
}
