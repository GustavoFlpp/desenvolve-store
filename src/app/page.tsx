import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
          <span className="text-violet-400 text-sm font-medium">E-commerce Educacional</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-50 leading-tight">
          Bem-vindo à{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600">
            Desenvolve Store
          </span>
        </h1>

        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Aplicação de e-commerce desenvolvida com Next.js e Tailwind CSS,
          integrando a Fake Store API e pagamentos via AbacatePay.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link
            href="/products"
            className="bg-violet-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-violet-500 transition text-lg shadow-lg shadow-violet-600/25"
          >
            Ver Produtos
          </Link>

          <a
            href="https://fakestoreapi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-slate-700 text-slate-300 px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-800 hover:border-slate-600 transition text-lg"
          >
            Fake Store API
          </a>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-violet-500/30 transition group">
            <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-violet-500/20 transition">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-slate-100">Catálogo</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Navegue por produtos de várias categorias com filtros e paginação
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-violet-500/30 transition group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition">
              <span className="text-2xl">🛒</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-slate-100">Carrinho</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Adicione, remova e gerencie produtos com persistência local
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-violet-500/30 transition group">
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-rose-500/20 transition">
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-slate-100">Pagamento</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Checkout com PIX via integração com AbacatePay
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 bg-slate-900 rounded-2xl p-8 border border-slate-800">
          <h3 className="text-xl font-semibold mb-6 text-slate-100">Stack Tecnológico</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              "Next.js 16",
              "React 19",
              "TypeScript",
              "Tailwind CSS",
              "Context API",
              "localStorage",
              "Fetch API",
              "AbacatePay",
            ].map((tech) => (
              <div
                key={tech}
                className="bg-slate-800 text-slate-300 px-4 py-2.5 rounded-lg font-medium text-sm border border-slate-700 hover:border-violet-500/30 transition"
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
