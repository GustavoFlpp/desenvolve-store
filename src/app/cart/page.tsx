"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, addToCart, decreaseFromCart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

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
      <aside className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
        <h2 className="text-lg font-semibold mb-4 text-slate-100">Resumo</h2>

        <div className="flex justify-between mb-4 text-slate-300">
          <span>Total</span>
          <strong className="text-emerald-400">
            {total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </strong>
        </div>

        <button
          onClick={clearCart}
          className="w-full border border-rose-500/30 text-rose-400 py-2.5 rounded-xl hover:bg-rose-500/10 transition mb-3 font-medium"
        >
          Limpar carrinho
        </button>

        <Link
          href="/checkout"
          className="block text-center bg-violet-600 text-white py-2.5 rounded-xl hover:bg-violet-500 transition font-semibold mb-3"
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
