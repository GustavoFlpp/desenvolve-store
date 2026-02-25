import { getProductById } from "@/services/api";
import { ProductDetails } from "@/components/ProductDetails";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  return (
    <div className="min-h-[calc(100vh-73px)] relative">
      {/* Ambient glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Image card */}
        <div className="group bg-slate-900/80 border border-slate-800 rounded-2xl p-8 flex items-center justify-center backdrop-blur-sm hover:border-slate-600 transition-all duration-300 sticky top-24">
          <div className="relative">
            <img
              src={product.image}
              alt={product.title}
              className="w-full max-h-[400px] object-contain group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Details */}
        <ProductDetails product={product} />
      </main>
    </div>
  );
}
