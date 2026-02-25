"use client";

import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { addToCart } = useCart();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-slate-50">
        {product.title}
      </h1>

      <p className="text-2xl font-bold text-emerald-400 mb-4">
        {product.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </p>

      <p className="text-sm text-slate-400 mb-2 capitalize">
        Categoria: {product.category}
      </p>

      {product.description && (
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          {product.description}
        </p>
      )}

      <button
        onClick={() => addToCart(product)}
        className="mt-2 bg-violet-600 text-white px-6 py-3 rounded-xl hover:bg-violet-500 transition font-semibold shadow-lg shadow-violet-600/25"
      >
        Adicionar ao carrinho
      </button>
    </div>
  );
}
