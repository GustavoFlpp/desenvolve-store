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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-2 text-slate-50">Conta Criada!</h1>
          <p className="text-slate-400 mb-6">
            Sua conta foi criada com sucesso. Você será redirecionado em breve...
          </p>
          <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-50">Criar Conta</h1>
        <p className="text-slate-400 text-center mb-8">Junte-se ao Desenvolve Store</p>

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
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Escolha um nome de usuário"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-300 mb-2"
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
            {isLoading ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-slate-400 mb-3">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition">
              Fazer Login
            </Link>
          </p>
          <Link href="/products" className="text-slate-500 hover:text-slate-300 transition">
            ← Voltar para produtos
          </Link>
        </div>
      </div>
    </div>
  );
}
