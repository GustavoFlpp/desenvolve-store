import { getProductById } from "@/services/api";

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

        <p className="text-sm text-gray-600">
          Categoria: {product.category}
        </p>
      </div>
    </main>
  );
}
