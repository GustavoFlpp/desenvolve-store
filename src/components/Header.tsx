"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/types/cart";

export function Header() {
  const { cart } = useCart();

  const totalItems = cart.reduce(
    (acc: number, item: CartItem) => acc + item.quantity,
    0
  );

  return (
    <header className="w-full border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Desenvolve Store
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/products">Produtos</Link>

          <Link href="/cart" className="relative">
            Carrinho
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
