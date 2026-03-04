"use client";

import { useEffect } from "react";
import { useProducts } from "@/context/ProductsContext";
import { getTranslatedCategory } from "@/utils/translations";

export function CategoryFilter() {
  const { categories, selectedCategory, setSelectedCategory, loadCategories } = useProducts();
  const loading = categories.length === 0;

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-8 bg-slate-800 rounded-lg w-32"></div>
        <div className="h-8 bg-slate-800 rounded-lg w-32"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg text-slate-100 mb-3">Categorias</h3>

      <button
        onClick={() => handleCategoryClick(null)}
        className={`block w-full text-left px-4 py-2.5 rounded-xl transition font-medium text-sm cursor-pointer ${
          selectedCategory === null
            ? "bg-violet-600 text-white"
            : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-violet-500/30"
        }`}
      >
        Todos os Produtos
      </button>

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={`block w-full text-left px-4 py-2.5 rounded-xl transition font-medium text-sm cursor-pointer ${
            selectedCategory === category
              ? "bg-violet-600 text-white"
              : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-violet-500/30"
          }`}
        >
          {getTranslatedCategory(category)}
        </button>
      ))}
    </div>
  );
}
