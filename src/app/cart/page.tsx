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
      <main className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Carrinho</h1>
        <p className="text-gray-600 mb-6">Seu carrinho está vazio.</p>

        <Link
          href="/products"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
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
        <h1 className="text-2xl font-bold mb-6">Carrinho</h1>

        <ul className="space-y-4">
          {cart.map(item => (
            <li
              key={item.id}
              className="flex gap-4 border rounded p-4 items-center"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 object-contain"
              />

              <div className="flex-1">
                <h2 className="font-semibold">{item.title}</h2>

                <p className="text-sm text-gray-600 mb-2">
                  {(item.price * item.quantity).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>

                {/* Controle de quantidade */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decreaseFromCart(item.id)}
                    className="w-8 h-8 border rounded hover:bg-gray-100"
                  >
                    −
                  </button>

                  <span className="font-medium">{item.quantity}</span>

                  <button
                    onClick={() => addToCart(item)}
                    className="w-8 h-8 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Resumo */}
      <aside className="border rounded p-6 h-fit">
        <h2 className="text-lg font-semibold mb-4">Resumo</h2>

        <div className="flex justify-between mb-4">
          <span>Total</span>
          <strong>
            {total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </strong>
        </div>

        <button
          onClick={clearCart}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition mb-4"
        >
          Limpar carrinho
        </button>

        <Link
          href="/checkout"
          className="block text-center bg-green-600 text-white py-2 rounded hover:bg-green-700 transition font-semibold mb-4"
        >
          Ir para Checkout
        </Link>

        <Link
          href="/products"
          className="block text-center text-blue-600 hover:underline"
        >
          Continuar comprando
        </Link>
      </aside>
    </main>
  );
}
