"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductsContext";
import { CartItem } from "@/types/cart";

export function Header() {
  const { cart } = useCart();
  const { isAuthenticated, user, avatar, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useProducts();
  const pathname = usePathname();

  const showSearch = pathname === "/products";

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

        {showSearch && (
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

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
