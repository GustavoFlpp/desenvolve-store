"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPixQrCode, simulatePixPayment } from "@/services/api";
import { AbacatePayPixQrCodeResponse } from "@/types/payment";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"review" | "payment" | "success">("review");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<AbacatePayPixQrCodeResponse | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Formulário
  const [formData, setFormData] = useState({
    fullName: user?.username || "",
    email: user?.email || "",
    phone: "(11) 0000-0000",
    cpf: "000.000.000-00",
  });

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isAuthenticated) {
    return (
      <main className="max-w-4xl mx-auto p-6 text-center py-20">
        <h1 className="text-2xl font-bold mb-4 text-slate-50">Acesso Restrito</h1>
        <p className="text-slate-400 mb-6">Você precisa estar autenticado para realizar o checkout.</p>
        <Link href="/login" className="bg-violet-600 text-white px-6 py-2.5 rounded-xl hover:bg-violet-500 transition font-semibold">
          Fazer Login
        </Link>
      </main>
    );
  }

  if (cart.length === 0 && step !== "success") {
    return (
      <main className="max-w-4xl mx-auto p-6 text-center py-20">
        <h1 className="text-2xl font-bold mb-4 text-slate-50">Carrinho Vazio</h1>
        <p className="text-slate-400 mb-6">Adicione produtos antes de fazer checkout.</p>
        <Link href="/products" className="bg-violet-600 text-white px-6 py-2.5 rounded-xl hover:bg-violet-500 transition font-semibold">
          Voltar para Produtos
        </Link>
      </main>
    );
  }

  const handleCreatePixQrCode = async () => {
    try {
      setLoading(true);
      setError(null);

      const pixData = {
        amount: Math.round(total * 100), // Converter para centavos
        expiresIn: 3600, // 1 hora
        description: `Pagamento - Desenvolve Store - ${cart.length} item(ns)`,
        customer: {
          name: formData.fullName,
          cellphone: formData.phone,
          email: formData.email,
          taxId: formData.cpf,
        },
        metadata: {
          externalId: `order_${Date.now()}`,
        },
      };

      const response = await createPixQrCode(pixData);
      setQrCode(response);
      setOrderId(`order_${Date.now()}`);
      setStep("payment");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar QR Code";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      await simulatePixPayment({ orderId });

      // Simular sucesso após 2 segundos
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStep("success");
      clearCart();
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao simular pagamento";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      {/* STEP 1: REVIEW */}
      {step === "review" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Produtos */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-6 text-slate-50">Checkout</h1>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            {/* Dados de Entrega */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-slate-100">Dados de Entrega</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                />
                <input
                  type="tel"
                  placeholder="Telefone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                />
                <input
                  type="text"
                  placeholder="CPF"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                />
              </div>
            </section>

            {/* Produtos */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-slate-100">Itens do Pedido</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start border-b border-slate-800 pb-4 last:border-0">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-200">{item.title}</h3>
                      <p className="text-sm text-slate-500">Quantidade: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-400">
                        {(item.price * item.quantity).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Resumo */}
          <aside className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4 text-slate-100">Resumo</h2>

            <div className="space-y-3 mb-6 pb-6 border-b border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span>
                  {total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Frete</span>
                <span className="text-emerald-400">Grátis</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-violet-400">
                <span>Total</span>
                <span>
                  {total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>

            <button
              onClick={handleCreatePixQrCode}
              disabled={loading}
              className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold hover:bg-violet-500 transition disabled:bg-slate-700 disabled:text-slate-500"
            >
              {loading ? "Gerando QR Code..." : "Continuar para Pagamento"}
            </button>

            <Link
              href="/cart"
              className="block text-center mt-3 text-slate-400 hover:text-violet-400 text-sm transition"
            >
              ← Voltar para Carrinho
            </Link>
          </aside>
        </div>
      )}

      {/* STEP 2: PAYMENT */}
      {step === "payment" && qrCode && qrCode.data && (
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-slate-50">Pagamento PIX</h1>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
            <p className="text-slate-400 mb-6">
              Escaneie o QR Code abaixo para realizar o pagamento
            </p>

            {qrCode.data.brCodeBase64 ? (
              <img
                src={qrCode.data.brCodeBase64}
                alt="QR Code PIX"
                className="mx-auto mb-6 w-64 h-64 border border-slate-700 rounded-xl bg-white p-2"
              />
            ) : (
              <div className="mx-auto mb-6 w-64 h-64 border border-slate-700 rounded-xl bg-slate-800 flex items-center justify-center">
                <p className="text-slate-400 text-center">
                  QR Code PIX<br />
                  <span className="text-sm text-slate-500">(Não disponível no modo teste)</span>
                </p>
              </div>
            )}

            <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl mb-6">
              <p className="text-sm text-slate-400 mb-2">Valor a pagar:</p>
              <p className="text-2xl font-bold text-emerald-400">
                {qrCode.data.amount 
                  ? (qrCode.data.amount / 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  : "R$ 0,00"
                }
              </p>
            </div>

            <button
              onClick={handleSimulatePayment}
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-500 transition disabled:bg-slate-700 disabled:text-slate-500 mb-3"
            >
              {loading ? "Processando..." : "Simular Pagamento"}
            </button>

            <button
              onClick={() => setStep("review")}
              className="w-full border border-slate-700 text-slate-300 py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
            >
              Voltar
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SUCCESS */}
      {step === "success" && (
        <div className="max-w-md mx-auto text-center py-12">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold mb-2 text-slate-50">Pedido Realizado!</h1>
          <p className="text-slate-400 mb-6">
            Seu pedido foi processado com sucesso. Você receberá um e-mail de confirmação.
          </p>

          {orderId && (
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl mb-6">
              <p className="text-sm text-slate-400">ID do Pedido:</p>
              <p className="font-mono text-sm text-violet-400">{orderId}</p>
            </div>
          )}

          <Link
            href="/products"
            className="inline-block bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-500 transition"
          >
            Continuar Comprando
          </Link>
        </div>
      )}
    </main>
  );
}
