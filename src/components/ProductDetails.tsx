"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { getTranslatedTitle, getTranslatedDescription, getTranslatedCategory } from "@/utils/translations";
import { getProductAttributes } from "@/utils/productAttributes";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({});
  const [attrError, setAttrError] = useState(false);

  const translatedTitle = getTranslatedTitle(product.id, product.title);
  const translatedDescription = getTranslatedDescription(product.id, product.description);
  const translatedCategory = getTranslatedCategory(product.category);
  const attributes = getProductAttributes(product.id, product.category);

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price * quantity);

  const handleAdd = () => {
    // Validate all attributes are selected
    if (attributes.length > 0) {
      const allSelected = attributes.every((attr) => selectedAttrs[attr.label]);
      if (!allSelected) {
        setAttrError(true);
        return;
      }
    }
    setAttrError(false);

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    setQuantity(1);
  };

  const handleSelectAttr = (label: string, value: string) => {
    setSelectedAttrs((prev) => ({ ...prev, [label]: value }));
    setAttrError(false);
  };

  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/products" className="hover:text-violet-400 transition">Loja</Link>
        <span>/</span>
        <span className="text-slate-400">{translatedCategory}</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-slate-50 leading-tight">
        {translatedTitle}
      </h1>

      {/* Category */}
      <span className="inline-block self-start text-xs text-slate-400 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full mb-6 font-medium">
        {translatedCategory}
      </span>

      {/* Price */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 mb-6">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-emerald-400">{formattedPrice}</span>
          <span className="text-sm text-slate-500">/ unidade</span>
        </div>
        {quantity > 1 && (
          <p className="text-sm text-slate-400 mt-2">
            Total: <span className="text-emerald-400 font-semibold">{formattedTotal}</span>
          </p>
        )}
      </div>

      {/* Description */}
      {translatedDescription && (
        <div className="bg-slate-800/30 border border-slate-800 rounded-xl p-4 mb-6">
          <h3 className="text-xs font-medium text-slate-500 mb-2 tracking-wide">Sobre o produto</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            {translatedDescription}
          </p>
        </div>
      )}

      {/* Product Attributes (size, color, etc.) */}
      {attributes.length > 0 && (
        <div className="space-y-4 mb-6">
          {attrError && (
            <p className="text-xs text-rose-400 font-medium">
              Selecione todas as opções antes de adicionar ao carrinho
            </p>
          )}

          {attributes.map((attr) => (
            <div key={attr.label}>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-sm font-medium text-slate-300">{attr.label}:</span>
                {selectedAttrs[attr.label] && (
                  <span className="text-xs text-violet-400 font-medium">{selectedAttrs[attr.label]}</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {attr.options.map((option) => {
                  const isSelected = selectedAttrs[attr.label] === option;
                  return (
                    <button
                      key={option}
                      onClick={() => handleSelectAttr(attr.label, option)}
                      className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/20"
                          : "bg-slate-800/50 text-slate-300 border-slate-700 hover:border-violet-500/30 hover:bg-slate-800"
                      } ${
                        attrError && !selectedAttrs[attr.label]
                          ? "border-rose-500/40"
                          : ""
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quantity + Add to cart */}
      <div className="mt-4 space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-300">Quantidade:</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 h-9 rounded-xl border border-slate-700 text-slate-300 flex items-center justify-center hover:bg-slate-800 hover:border-violet-500/30 transition font-bold"
            >
              −
            </button>
            <span className="text-lg font-semibold text-slate-100 w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 rounded-xl border border-slate-700 text-slate-300 flex items-center justify-center hover:bg-slate-800 hover:border-violet-500/30 transition font-bold"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className={`w-full py-3.5 rounded-2xl font-semibold text-base transition-all duration-300 ${
            added
              ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/25"
              : "bg-violet-600 text-white hover:bg-violet-500 shadow-xl shadow-violet-600/25 hover:shadow-violet-500/30 hover:scale-[1.01] active:scale-[0.99]"
          }`}
        >
          {added ? "\u2713 Adicionado ao carrinho!" : "Adicionar ao carrinho"}
        </button>

        <Link
          href="/products"
          className="block text-center text-sm text-slate-500 hover:text-violet-400 transition cursor-pointer"
        >
          ← Voltar para a loja
        </Link>
      </div>
    </div>
  );
}
