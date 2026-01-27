import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          Bem-vindo à Desenvolve Store
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Uma aplicação educacional de e-commerce desenvolvida com Next.js e
          Tailwind CSS, integrando dados da Fake Store API.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-lg"
          >
            Ver Produtos
          </Link>

          <a
            href="https://fakestoreapi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition text-lg"
          >
            Fake Store API
          </a>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">Catálogo</h3>
            <p className="text-gray-600">
              Navegue por produtos de várias categorias
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold mb-2">Carrinho</h3>
            <p className="text-gray-600">
              Adicione produtos e gerencie seu carrinho
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-4">💾</div>
            <h3 className="text-xl font-semibold mb-2">Persistência</h3>
            <p className="text-gray-600">
              Seus dados são salvos localmente
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-md">
          <h3 className="text-2xl font-semibold mb-6">Stack Tecnológico</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Next.js 16",
              "React 19",
              "TypeScript",
              "Tailwind CSS",
              "Context API",
              "localStorage",
              "Fetch API",
              "SSR/SSG",
            ].map((tech) => (
              <div
                key={tech}
                className="bg-blue-100 text-blue-900 px-4 py-2 rounded font-medium"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
