"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { CartItem } from "@/types/cart";

export function Header() {
  const { cart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  const totalItems = cart.reduce(
    (acc: number, item: CartItem) => acc + item.quantity,
    0
  );

  return (
    <header className="w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-violet-400 hover:text-violet-300 transition">
          Desenvolve Store
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/products" className="text-slate-300 hover:text-violet-400 transition font-medium">
            Produtos
          </Link>

          <Link href="/cart" className="relative text-slate-300 hover:text-violet-400 transition font-medium">
            Carrinho
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-violet-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-6 border-l border-slate-700">
              <span className="text-sm text-slate-400">
                {user?.username}
              </span>
              <button
                onClick={logout}
                className="text-sm text-rose-400 hover:text-rose-300 transition font-medium"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-500 transition text-sm font-semibold"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
