"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { CartItem } from "@/types/cart";

export function Header() {
  const { cart } = useCart();
  const { isAuthenticated, user, avatar, logout } = useAuth();

  const totalItems = cart.reduce(
    (acc: number, item: CartItem) => acc + item.quantity,
    0
  );

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all group-hover:scale-105">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <span className="text-lg font-bold text-slate-100 group-hover:text-violet-300 transition">
            Desenvolve <span className="text-violet-400">Store</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link href="/products" className="text-sm text-slate-400 hover:text-violet-400 hover:bg-violet-500/5 transition px-3.5 py-2 rounded-xl font-medium">
            Produtos
          </Link>

          <Link href="/cart" className="relative text-sm text-slate-400 hover:text-violet-400 hover:bg-violet-500/5 transition px-3.5 py-2 rounded-xl font-medium">
            Carrinho
            {totalItems > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-violet-500 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold leading-none">
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 ml-3 pl-4 border-l border-slate-800">
              <Link
                href="/profile"
                className="flex items-center gap-2 hover:opacity-80 transition px-2 py-1.5 rounded-xl hover:bg-violet-500/5"
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-7 h-7 rounded-full object-cover border-2 border-violet-500/30"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-violet-600/20 border-2 border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-400">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-slate-400 hover:text-violet-400 transition font-medium">
                  {user?.username}
                </span>
              </Link>
              <button
                onClick={logout}
                className="text-sm text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/5 transition font-medium px-3 py-2 rounded-xl cursor-pointer"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-3 bg-violet-600 text-white px-5 py-2 rounded-xl hover:bg-violet-500 transition text-sm font-semibold shadow-md shadow-violet-600/20 hover:shadow-violet-500/30"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
