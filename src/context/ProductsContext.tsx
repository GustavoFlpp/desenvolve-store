"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useRef } from "react";
import { Product } from "@/types/product";
import { getProducts, getProductsByCategory, getCategories } from "@/services/api";

interface ProductsContextData {
  allProducts: Product[];
  categories: string[];
  selectedCategory: string | null;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  loadProducts: (category?: string | null) => Promise<void>;
  loadCategories: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextData | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategoryState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQueryState] = useState("");

  // Cache: guarda produtos por categoria (null = todos)
  const cacheRef = useRef<Map<string, Product[]>>(new Map());
  const categoriesLoadedRef = useRef(false);

  const loadProducts = useCallback(async (category?: string | null) => {
    const cacheKey = category ?? "__all__";

    // Se já tem em cache, usa direto sem loading
    if (cacheRef.current.has(cacheKey)) {
      setAllProducts(cacheRef.current.get(cacheKey)!);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let data: Product[];
      if (category) {
        data = await getProductsByCategory(category);
      } else {
        data = await getProducts();
      }

      cacheRef.current.set(cacheKey, data);
      setAllProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao carregar produtos";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    if (categoriesLoadedRef.current) return;

    try {
      const data = await getCategories();
      setCategories(data);
      categoriesLoadedRef.current = true;
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    }
  }, []);

  const setSelectedCategory = useCallback((category: string | null) => {
    setSelectedCategoryState(category);
    setCurrentPage(1);
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
    setCurrentPage(1);
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        allProducts,
        categories,
        selectedCategory,
        searchQuery,
        loading,
        error,
        currentPage,
        setCurrentPage,
        setSelectedCategory,
        setSearchQuery,
        loadProducts,
        loadCategories,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts deve ser usado dentro de ProductsProvider");
  }
  return context;
}
