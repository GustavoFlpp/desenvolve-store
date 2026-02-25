"use client";

import { Product } from "@/types/product";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-violet-500/30 transition-all group">
      <div className="aspect-square overflow-hidden rounded-xl mb-4 bg-slate-800 flex items-center justify-center h-48">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <h2 className="font-semibold text-sm line-clamp-2 mb-2 text-slate-100">
        {product.title}
      </h2>

      <p className="text-xs text-slate-500 mb-3 capitalize">
        {product.category}
      </p>

      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-bold text-emerald-400">
          {formattedPrice}
        </span>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/product/${product.id}`}
          className="flex-1 text-center border border-slate-700 text-slate-300 py-2 rounded-lg hover:bg-slate-800 hover:border-violet-500/30 transition text-sm font-medium"
        >
          Detalhes
        </Link>

        <button
          onClick={() => addToCart(product)}
          className="flex-1 bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-500 transition text-sm font-medium"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
