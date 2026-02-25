"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { getTranslatedTitle, getTranslatedCategory } from "@/utils/translations";
import { getProductAttributes } from "@/utils/productAttributes";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
    setQuantity(1);
  };

  const translatedTitle = getTranslatedTitle(product.id, product.title);
  const translatedCategory = getTranslatedCategory(product.category);
  const attributes = getProductAttributes(product.id, product.category);
  const hasAttributes = attributes.length > 0;

  return (
    <div className="group relative bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm flex flex-col h-full">
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl mb-4 bg-slate-800/50 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Category badge */}
      <span className="inline-block self-start text-[11px] text-slate-400 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full mb-3 font-medium">
        {translatedCategory}
      </span>

      {/* Title - fixed height for alignment */}
      <h2 className="relative font-semibold text-sm line-clamp-2 mb-3 text-slate-100 leading-snug min-h-[2.5rem]">
        {translatedTitle}
      </h2>

      {/* Spacer to push price + buttons to bottom */}
      <div className="mt-auto" />

      {/* Price */}
      <div className="relative mb-4">
        <span className="text-xl font-bold text-emerald-400">
          {formattedPrice}
        </span>
      </div>

      {/* Attribute hint */}
      {hasAttributes && (
        <div className="relative flex flex-wrap gap-1.5 mb-3">
          {attributes.map((attr) => (
            <span
              key={attr.label}
              className="text-[10px] text-slate-500 bg-slate-800/50 border border-slate-700/50 px-2 py-0.5 rounded-md"
            >
              {attr.label}: {attr.options.length} opções
            </span>
          ))}
        </div>
      )}

      {/* Quantity selector - only when no attributes needed */}
      {!hasAttributes && (
        <div className="relative flex items-center justify-center gap-3 mb-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded-lg border border-slate-700 text-slate-300 flex items-center justify-center hover:bg-slate-800 hover:border-violet-500/30 transition text-sm font-bold cursor-pointer"
          >
            −
          </button>
          <span className="text-sm font-semibold text-slate-200 w-6 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 rounded-lg border border-slate-700 text-slate-300 flex items-center justify-center hover:bg-slate-800 hover:border-violet-500/30 transition text-sm font-bold cursor-pointer"
          >
            +
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="relative flex gap-2">
        <Link
          href={`/product/${product.id}`}
          className="flex-1 text-center border border-slate-700 text-slate-300 py-2.5 rounded-xl hover:bg-slate-800 hover:border-slate-500 transition text-sm font-medium cursor-pointer"
        >
          Detalhes
        </Link>

        {hasAttributes ? (
          <Link
            href={`/product/${product.id}`}
            className="flex-1 text-center bg-violet-600 text-white py-2.5 rounded-xl hover:bg-violet-500 shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30 transition-all text-sm font-semibold cursor-pointer"
          >
            Adicionar
          </Link>
        ) : (
          <button
            onClick={handleAdd}
            className={`flex-1 py-2.5 rounded-xl transition-all text-sm font-semibold cursor-pointer ${
              added
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
                : "bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30"
            }`}
          >
            {added ? "✓ Adicionado" : "Adicionar"}
          </button>
        )}
      </div>
    </div>
  );
}
