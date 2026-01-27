"use client";

import { useState, useEffect } from "react";
import { getCategories } from "@/services/api";

interface CategoryFilterProps {
  onCategoryChange: (category: string | null) => void;
}

export function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-8 bg-gray-200 rounded w-32"></div>
        <div className="h-8 bg-gray-200 rounded w-32"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">Categorias</h3>

      <button
        onClick={() => handleCategoryClick(null)}
        className={`block w-full text-left px-4 py-2 rounded transition ${
          selectedCategory === null
            ? "bg-blue-600 text-white"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        Todos os Produtos
      </button>

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={`block w-full text-left px-4 py-2 rounded capitalize transition ${
            selectedCategory === category
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
