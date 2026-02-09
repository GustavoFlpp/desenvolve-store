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
      <main className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
        <p className="text-gray-600 mb-6">Você precisa estar autenticado para realizar o checkout.</p>
        <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Fazer Login
        </Link>
      </main>
    );
  }

  if (cart.length === 0 && step !== "success") {
    return (
      <main className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Carrinho Vazio</h1>
        <p className="text-gray-600 mb-6">Adicione produtos antes de fazer checkout.</p>
        <Link href="/products" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
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
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {/* Dados de Entrega */}
            <section className="border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Dados de Entrega</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="tel"
                  placeholder="Telefone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="CPF"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </section>

            {/* Produtos */}
            <section className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Itens do Pedido</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start border-b pb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
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
          <aside className="border rounded-lg p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Resumo</h2>

            <div className="space-y-3 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span>Grátis</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-blue-600">
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
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? "Gerando QR Code..." : "Continuar para Pagamento"}
            </button>

            <Link
              href="/cart"
              className="block text-center mt-3 text-blue-600 hover:underline text-sm"
            >
              ← Voltar para Carrinho
            </Link>
          </aside>
        </div>
      )}

      {/* STEP 2: PAYMENT */}
      {step === "payment" && qrCode && qrCode.data && (
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Pagamento PIX</h1>

          <div className="bg-white border rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-6">
              Escaneie o QR Code abaixo para realizar o pagamento
            </p>

            {qrCode.data.brCodeBase64 ? (
              <img
                src={qrCode.data.brCodeBase64}
                alt="QR Code PIX"
                className="mx-auto mb-6 w-64 h-64 border rounded bg-gray-100"
              />
            ) : (
              <div className="mx-auto mb-6 w-64 h-64 border rounded bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  QR Code PIX<br />
                  <span className="text-sm">(Não disponível no modo teste)</span>
                </p>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded mb-6">
              <p className="text-sm text-gray-600 mb-2">Valor a pagar:</p>
              <p className="text-2xl font-bold text-blue-600">
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
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 mb-3"
            >
              {loading ? "Processando..." : "Simular Pagamento"}
            </button>

            <button
              onClick={() => setStep("review")}
              className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
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
          <h1 className="text-3xl font-bold mb-2">Pedido Realizado!</h1>
          <p className="text-gray-600 mb-6">
            Seu pedido foi processado com sucesso. Você receberá um e-mail de confirmação.
          </p>

          {orderId && (
            <div className="bg-gray-50 p-4 rounded mb-6">
              <p className="text-sm text-gray-600">ID do Pedido:</p>
              <p className="font-mono text-sm">{orderId}</p>
            </div>
          )}

          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Continuar Comprando
          </Link>
        </div>
      )}
    </main>
  );
}
