import { getProducts } from "@/services/api";
import Link from "next/link";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Produtos</h1>

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="border rounded p-4 hover:shadow"
          >
            <h2 className="font-semibold">{product.title}</h2>
            <p className="text-sm text-gray-600">
              R$ {product.price}
            </p>

            <Link
              href={`/product/${product.id}`}
              className="text-blue-600 underline mt-2 inline-block"
            >
              Ver detalhes
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
