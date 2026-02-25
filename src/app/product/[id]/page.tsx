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
    <main className="p-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-80 object-contain"
        />
      </div>

      <ProductDetails product={product} />
    </main>
  );
}
