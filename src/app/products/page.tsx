"use client";

import { useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Pagination } from "@/components/Pagination";
import { useProducts } from "@/context/ProductsContext";
import { useAuth } from "@/context/AuthContext";

const ITEMS_PER_PAGE = 6;

export default function ProductsPage() {
  const {
    allProducts,
    selectedCategory,
    loading,
    error,
    currentPage,
    setCurrentPage,
    loadProducts,
  } = useProducts();

  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    console.log("[PRODUCTS] Página carregada. User:", user, "Autenticado:", isAuthenticated);
  }, [user, isAuthenticated]);

  useEffect(() => {
    loadProducts(selectedCategory);
  }, [selectedCategory, loadProducts]);

  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = allProducts.slice(startIndex, endIndex);

  return (
    <div className="min-h-[calc(100vh-73px)] relative overflow-x-hidden">
      {/* Ambient glow */}
      <div className="absolute top-[-5%] right-[-10%] w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[100px] pointer-events-none" />

      <main className="relative max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-50">Loja</h1>
          <p className="text-slate-400 text-sm mt-1">Explore nosso catálogo de produtos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <div className="sticky top-24">
              <CategoryFilter />
            </div>
          </aside>

          <section className="md:col-span-3">
            {error && <ErrorMessage message={error} retry={() => loadProducts(selectedCategory)} />}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 animate-pulse flex flex-col">
                    <div className="aspect-square bg-slate-800/50 rounded-xl mb-4" />
                    <div className="h-3 bg-slate-800/50 rounded-full mb-2 w-1/3" />
                    <div className="h-4 bg-slate-800/50 rounded-full mb-2" />
                    <div className="h-4 bg-slate-800/50 rounded-full mb-4 w-2/3" />
                    <div className="mt-auto" />
                    <div className="h-5 bg-slate-800/50 rounded-full mb-4 w-1/3" />
                    <div className="h-8 bg-slate-800/50 rounded-xl mb-3" />
                    <div className="flex gap-2">
                      <div className="flex-1 h-10 bg-slate-800/50 rounded-xl" />
                      <div className="flex-1 h-10 bg-slate-800/50 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="text-center text-slate-400 py-20">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-lg font-medium">Nenhum produto encontrado.</p>
                <p className="text-sm text-slate-500 mt-1">Tente outra categoria</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
    </div>
  );
}

