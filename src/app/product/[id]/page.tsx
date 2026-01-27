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
    <main className="p-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-80 object-contain"
      />

      <ProductDetails product={product} />
    </main>
  );
}
