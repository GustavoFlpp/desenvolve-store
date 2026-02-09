"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Pagination } from "@/components/Pagination";
import { getProducts, getProductsByCategory } from "@/services/api";
import { Product } from "@/types/product";

const ITEMS_PER_PAGE = 6;

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      setCurrentPage(1);

      let data;
      if (selectedCategory) {
        data = await getProductsByCategory(selectedCategory);
      } else {
        data = await getProducts();
      }

      setAllProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao carregar produtos";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = allProducts.slice(startIndex, endIndex);

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Loja</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <CategoryFilter onCategoryChange={setSelectedCategory} />
        </aside>

        <section className="md:col-span-3">
          {error && <ErrorMessage message={error} retry={loadProducts} />}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : currentProducts.length === 0 ? (
            <div className="text-center text-gray-600 py-12">
              <p className="text-lg">Nenhum produto encontrado.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                startIndex={startIndex}
                endIndex={endIndex}
                total={allProducts.length}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}

