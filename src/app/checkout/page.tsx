"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPixQrCode, simulatePixPayment } from "@/services/api";
import { AbacatePayPixQrCodeResponse } from "@/types/payment";
import { ShippingOption } from "@/types/address";
import { fetchAddressByCep, maskCep, calculateShipping } from "@/utils/shipping";

function maskCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated, address } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"review" | "payment" | "success">("review");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<AbacatePayPixQrCodeResponse | null>(null);
  const [pixId, setPixId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Formulário
  const [formData, setFormData] = useState({
    fullName: user?.username || "",
    email: user?.email || "",
    phone: "",
    cpf: "",
  });

  const SHIPPING_STORAGE_KEY = "desenvolve-store-shipping";

  // Endereço de entrega
  const [shippingCep, setShippingCep] = useState("");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<string | null>(null);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalWithShipping = total + (selectedShipping?.price || 0);

  // Carregar frete salvo do localStorage, endereço do perfil, ou calcular
  useEffect(() => {
    // 1. Tentar restaurar do localStorage (vem do carrinho)
    const saved = localStorage.getItem(SHIPPING_STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.cep && data.estado) {
          setShippingCep(data.cep);
          const options = calculateShipping(data.estado, total);
          setShippingOptions(options);
          if (data.selectedId) {
            const selected = options.find((o) => o.id === data.selectedId);
            setSelectedShipping(selected || null);
          }
          // Montar endereço de entrega
          if (address) {
            setDeliveryAddress(
              `${address.logradouro}, ${address.numero}${address.complemento ? " - " + address.complemento : ""} — ${address.bairro}, ${address.cidade}/${address.estado}`
            );
          }
          return;
        }
      } catch { /* ignore */ }
    }

    // 2. Fallback: endereço salvo do perfil
    if (address) {
      const cep = address.cep.replace(/\D/g, "");
      setShippingCep(maskCep(cep));
      setDeliveryAddress(
        `${address.logradouro}, ${address.numero}${address.complemento ? " - " + address.complemento : ""} — ${address.bairro}, ${address.cidade}/${address.estado}`
      );
      const options = calculateShipping(address.estado, total);
      setShippingOptions(options);
    }
  }, [address]); // eslint-disable-line react-hooks/exhaustive-deps

  // Recalcular frete quando total mudar
  useEffect(() => {
    if (shippingOptions.length > 0 && deliveryAddress) {
      const estado = deliveryAddress.split("/").pop()?.trim() || "";
      if (estado) {
        const options = calculateShipping(estado, total);
        setShippingOptions(options);
        if (selectedShipping) {
          const updated = options.find((o) => o.id === selectedShipping.id);
          setSelectedShipping(updated || null);
        }
      }
    }
  }, [total]); // eslint-disable-line react-hooks/exhaustive-deps

  // Salvar seleção de frete no localStorage quando mudar
  useEffect(() => {
    if (selectedShipping && shippingCep) {
      const estado = deliveryAddress?.split("/").pop()?.trim() || "";
      if (estado) {
        localStorage.setItem(
          SHIPPING_STORAGE_KEY,
          JSON.stringify({ cep: shippingCep, estado, selectedId: selectedShipping.id })
        );
      }
    }
  }, [selectedShipping, shippingCep, deliveryAddress]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCalcShipping = async () => {
    const clean = shippingCep.replace(/\D/g, "");
    if (clean.length !== 8) {
      setShippingError("Digite um CEP válido");
      return;
    }
    setShippingLoading(true);
    setShippingError(null);
    setShippingOptions([]);
    setSelectedShipping(null);
    setDeliveryAddress(null);

    const result = await fetchAddressByCep(clean);
    if (!result) {
      setShippingError("CEP não encontrado");
      setShippingLoading(false);
      return;
    }

    setDeliveryAddress(`${result.logradouro} — ${result.bairro}, ${result.cidade}/${result.estado}`);
    const options = calculateShipping(result.estado, total);
    setShippingOptions(options);
    setShippingLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <main className="max-w-4xl mx-auto p-6 text-center py-20">
        <h1 className="text-2xl font-bold mb-4 text-slate-50">Acesso Restrito</h1>
        <p className="text-slate-400 mb-6">Você precisa estar autenticado para realizar o checkout.</p>
        <Link href="/login" className="bg-violet-600 text-white px-6 py-2.5 rounded-xl hover:bg-violet-500 transition font-semibold cursor-pointer">
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
        <Link href="/products" className="bg-violet-600 text-white px-6 py-2.5 rounded-xl hover:bg-violet-500 transition font-semibold cursor-pointer">
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
        amount: Math.round(totalWithShipping * 100), // Converter para centavos
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
      setPixId(response.data?.id || null);
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

      if (!pixId) {
        throw new Error("ID do QR Code PIX não encontrado");
      }

      await simulatePixPayment(pixId, { orderId });

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

            {/* Dados pessoais */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-slate-100">Dados Pessoais</h2>
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
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                />
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: maskCpf(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                />
              </div>
            </section>

            {/* Endereço e frete */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-slate-100">Endereço e Frete</h2>

              {deliveryAddress && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 mb-4">
                  <p className="text-sm text-slate-300">{deliveryAddress}</p>
                </div>
              )}

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={shippingCep}
                  onChange={(e) => setShippingCep(maskCep(e.target.value))}
                  placeholder="00000-000"
                  className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition text-sm"
                />
                <button
                  onClick={handleCalcShipping}
                  disabled={shippingLoading}
                  className="bg-violet-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-violet-500 transition disabled:bg-slate-700 disabled:text-slate-500 cursor-pointer"
                >
                  {shippingLoading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    "Calcular"
                  )}
                </button>
              </div>

              {shippingError && (
                <p className="text-xs text-rose-400 mb-3">{shippingError}</p>
              )}

              {shippingOptions.length > 0 && (
                <div className="space-y-2">
                  {shippingOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        selectedShipping?.id === option.id
                          ? "border-violet-500 bg-violet-500/10"
                          : "border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="checkout-shipping"
                        checked={selectedShipping?.id === option.id}
                        onChange={() => setSelectedShipping(option)}
                        className="accent-violet-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-200">{option.name}</span>
                          <span className="text-xs text-slate-500">{option.description}</span>
                        </div>
                        <span className="text-xs text-slate-400">
                          até {option.estimatedDays} dias úteis
                        </span>
                      </div>
                      <span className={`text-sm font-semibold ${option.price === 0 ? "text-emerald-400" : "text-slate-200"}`}>
                        {option.price === 0 ? "Grátis" : option.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {shippingOptions.length === 0 && !shippingError && !shippingLoading && (
                <p className="text-sm text-slate-500">Digite o CEP acima para ver as opções de envio.</p>
              )}
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
                {selectedShipping ? (
                  <span className={selectedShipping.price === 0 ? "text-emerald-400" : ""}>
                    {selectedShipping.price === 0
                      ? "Grátis"
                      : selectedShipping.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                ) : (
                  <span className="text-slate-500 text-sm">--</span>
                )}
              </div>
              {selectedShipping && (
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{selectedShipping.name}</span>
                  <span>até {selectedShipping.estimatedDays} dias úteis</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold text-violet-400">
                <span>Total</span>
                <span>
                  {totalWithShipping.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>

            <button
              onClick={handleCreatePixQrCode}
              disabled={loading}
              className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold hover:bg-violet-500 transition disabled:bg-slate-700 disabled:text-slate-500 cursor-pointer"
            >
              {loading ? "Gerando QR Code..." : "Continuar para Pagamento"}
            </button>

            <Link
              href="/cart"
              className="block text-center mt-3 text-slate-400 hover:text-violet-400 text-sm transition cursor-pointer"
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
          <p className="text-center text-xs text-slate-500 -mt-4 mb-6">(funcionalidade extra educacional — não obrigatória para o desafio)</p>

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
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-500 transition disabled:bg-slate-700 disabled:text-slate-500 mb-3 cursor-pointer"
            >
              {loading ? "Processando..." : "Simular Pagamento"}
            </button>

            <button
              onClick={() => setStep("review")}
              className="w-full border border-slate-700 text-slate-300 py-3 rounded-xl font-semibold hover:bg-slate-800 transition cursor-pointer"
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
            className="inline-block bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-500 transition cursor-pointer"
          >
            Continuar Comprando
          </Link>
        </div>
      )}
    </main>
  );
}
