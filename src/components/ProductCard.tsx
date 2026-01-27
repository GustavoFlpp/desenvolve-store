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
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="aspect-square overflow-hidden rounded mb-4 bg-gray-100 flex items-center justify-center h-48">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain p-4"
        />
      </div>

      <h2 className="font-semibold text-sm line-clamp-2 mb-2">
        {product.title}
      </h2>

      <p className="text-xs text-gray-500 mb-3 capitalize">
        {product.category}
      </p>

      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-bold text-green-600">
          {formattedPrice}
        </span>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/product/${product.id}`}
          className="flex-1 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
        >
          Detalhes
        </Link>

        <button
          onClick={() => addToCart(product)}
          className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition text-sm font-medium"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
