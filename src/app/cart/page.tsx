"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { fetchAddressByCep, maskCep, calculateShipping } from "@/utils/shipping";
import { ShippingOption } from "@/types/address";

export default function CartPage() {
  const { cart, addToCart, decreaseFromCart, removeFromCart, clearCart } = useCart();
  const { address } = useAuth();

  const SHIPPING_STORAGE_KEY = "desenvolve-store-shipping";

  const [shippingCep, setShippingCep] = useState("");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [shippingState, setShippingState] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalWithShipping = total + (selectedShipping?.price || 0);

  // Carregar frete salvo do localStorage ou do endereço do perfil
  useEffect(() => {
    if (initialized) return;

    // Tentar carregar do localStorage primeiro
    const saved = localStorage.getItem(SHIPPING_STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.cep && data.estado) {
          setShippingCep(data.cep);
          setShippingState(data.estado);
          const options = calculateShipping(data.estado, total);
          setShippingOptions(options);
          if (data.selectedId) {
            const selected = options.find((o) => o.id === data.selectedId);
            setSelectedShipping(selected || null);
          }
          setInitialized(true);
          return;
        }
      } catch { /* ignore */ }
    }

    // Fallback: auto-preencher do endereço salvo do perfil
    if (address) {
      const cep = address.cep.replace(/\D/g, "");
      setShippingCep(maskCep(cep));
      setShippingState(address.estado);
      const options = calculateShipping(address.estado, total);
      setShippingOptions(options);
    }
    setInitialized(true);
  }, [address]); // eslint-disable-line react-hooks/exhaustive-deps

  // Salvar seleção de frete no localStorage
  useEffect(() => {
    if (!initialized) return;
    if (shippingState && selectedShipping) {
      localStorage.setItem(
        SHIPPING_STORAGE_KEY,
        JSON.stringify({ cep: shippingCep, estado: shippingState, selectedId: selectedShipping.id })
      );
    }
  }, [selectedShipping, shippingCep, shippingState, initialized]); // eslint-disable-line react-hooks/exhaustive-deps

  // Recalcular quando total mudar e já tiver estado
  useEffect(() => {
    if (shippingState) {
      const options = calculateShipping(shippingState, total);
      setShippingOptions(options);
      // Manter seleção se ainda existir
      if (selectedShipping) {
        const updated = options.find((o) => o.id === selectedShipping.id);
        setSelectedShipping(updated || null);
      }
    }
  }, [total]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCalculateShipping = async () => {
    const clean = shippingCep.replace(/\D/g, "");
    if (clean.length !== 8) {
      setShippingError("Digite um CEP válido com 8 dígitos");
      return;
    }

    setShippingLoading(true);
    setShippingError(null);
    setShippingOptions([]);
    setSelectedShipping(null);

    const result = await fetchAddressByCep(clean);
    if (!result) {
      setShippingError("CEP não encontrado");
      setShippingLoading(false);
      return;
    }

    setShippingState(result.estado);
    const options = calculateShipping(result.estado, total);
    setShippingOptions(options);
    setShippingLoading(false);
  };

  if (cart.length === 0) {
    return (
      <main className="max-w-4xl mx-auto p-6 text-center py-20">
        <h1 className="text-2xl font-bold mb-4 text-slate-50">Carrinho</h1>
        <p className="text-slate-400 mb-6">Seu carrinho está vazio.</p>

        <Link
          href="/products"
          className="inline-block bg-violet-600 text-white px-6 py-2.5 rounded-xl hover:bg-violet-500 transition font-semibold"
        >
          Ver produtos
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Lista de produtos */}
      <section className="lg:col-span-2">
        <h1 className="text-2xl font-bold mb-6 text-slate-50">Carrinho</h1>

        <ul className="space-y-4">
          {cart.map(item => (
            <li
              key={item.id}
              className="flex gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 items-center"
            >
              <div className="bg-slate-800 rounded-xl p-2 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-contain"
                />
              </div>

              <div className="flex-1">
                <h2 className="font-semibold text-slate-100">{item.title}</h2>

                <p className="text-sm text-emerald-400 font-bold mb-2">
                  {(item.price * item.quantity).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>

                {/* Controle de quantidade */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decreaseFromCart(item.id)}
                    className="w-8 h-8 border border-slate-700 rounded-lg hover:bg-slate-800 text-slate-300 transition"
                  >
                    −
                  </button>

                  <span className="font-medium text-slate-200">{item.quantity}</span>

                  <button
                    onClick={() => addToCart(item)}
                    className="w-8 h-8 border border-slate-700 rounded-lg hover:bg-slate-800 text-slate-300 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-sm text-rose-400 hover:text-rose-300 transition font-medium"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Resumo */}
      <aside className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit space-y-5">
        <h2 className="text-lg font-semibold text-slate-100">Resumo</h2>

        {/* Calcular frete */}
        <div>
          <h3 className="text-sm font-medium text-slate-300 mb-2">Calcular frete</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={shippingCep}
              onChange={(e) => setShippingCep(maskCep(e.target.value))}
              placeholder="00000-000"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
            />
            <button
              onClick={handleCalculateShipping}
              disabled={shippingLoading}
              className="bg-violet-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-violet-500 transition disabled:bg-slate-700 disabled:text-slate-500"
            >
              {shippingLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                "Calcular"
              )}
            </button>
          </div>
          <a
            href="https://buscacepinter.correios.com.br/app/endereco/index.php"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-violet-400 hover:text-violet-300 transition mt-1.5 inline-block"
          >
            Não sei meu CEP
          </a>

          {shippingError && (
            <p className="text-xs text-rose-400 mt-2">{shippingError}</p>
          )}

          {/* Opções de frete */}
          {shippingOptions.length > 0 && (
            <div className="mt-3 space-y-2">
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
                    name="shipping"
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
        </div>

        {/* Valores */}
        <div className="border-t border-slate-800 pt-4 space-y-3">
          <div className="flex justify-between text-sm text-slate-400">
            <span>Subtotal</span>
            <span>
              {total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>

          <div className="flex justify-between text-sm text-slate-400">
            <span>Frete</span>
            {selectedShipping ? (
              <span className={selectedShipping.price === 0 ? "text-emerald-400" : ""}>
                {selectedShipping.price === 0
                  ? "Grátis"
                  : selectedShipping.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            ) : (
              <span className="text-slate-500 text-xs">Calcule acima</span>
            )}
          </div>

          <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-800">
            <span className="text-slate-100">Total</span>
            <span className="text-emerald-400">
              {totalWithShipping.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        </div>

        <button
          onClick={clearCart}
          className="w-full border border-rose-500/30 text-rose-400 py-2.5 rounded-xl hover:bg-rose-500/10 transition font-medium"
        >
          Limpar carrinho
        </button>

        <Link
          href="/checkout"
          className="block text-center bg-violet-600 text-white py-2.5 rounded-xl hover:bg-violet-500 transition font-semibold"
        >
          Ir para Checkout
        </Link>

        <Link
          href="/products"
          className="block text-center text-slate-400 hover:text-violet-400 transition text-sm"
        >
          Continuar comprando
        </Link>
      </aside>
    </main>
  );
}
