"use client";

import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { addToCart } = useCart();

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-4">
          {product.title}
        </h1>

        <p className="text-xl font-semibold text-green-600 mb-4">
          {product.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>

        <p className="text-sm text-gray-600 mb-4">
          Categoria: {product.category}
        </p>

        <button
          onClick={() => addToCart(product)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Adicionar ao carrinho
        </button>
      </div>
    </>
  );
}
