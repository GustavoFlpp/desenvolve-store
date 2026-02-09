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
    <header className="w-full border-b border-gray-200 bg-white shadow">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Desenvolve Store
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/products" className="hover:text-blue-600 transition">
            Produtos
          </Link>

          <Link href="/cart" className="relative hover:text-blue-600 transition">
            Carrinho
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 pl-6 border-l border-gray-200">
                <span className="text-sm text-gray-600">
                  👤 {user?.username}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-red-600 hover:underline"
                >
                  Sair
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
