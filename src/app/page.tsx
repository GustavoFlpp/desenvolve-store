import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden relative">
      {/* Ambient glow effects */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[60%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <main className="relative max-w-5xl mx-auto px-6 pt-28 pb-20 text-center">
        <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 backdrop-blur-sm animate-[fadeIn_0.6s_ease-out]">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-violet-300 text-sm font-medium tracking-wide">E-commerce Educacional</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-slate-50 leading-[1.1] tracking-tight animate-[fadeIn_0.8s_ease-out]">
          Bem-vindo à{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-violet-600 animate-[gradient_3s_ease_infinite] bg-[length:200%_auto]">
            Desenvolve Store
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-[fadeIn_1s_ease-out]">
          Aplicação de e-commerce desenvolvida com Next.js e Tailwind CSS,
          integrando a Fake Store API e pagamentos via AbacatePay{" "}
          <span className="text-slate-500 text-base">(extra educacional, não obrigatório)</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-24 animate-[fadeIn_1.2s_ease-out]">
          <Link
            href="/products"
            className="group relative bg-violet-600 text-white px-10 py-4 rounded-2xl font-semibold hover:bg-violet-500 transition-all text-lg shadow-xl shadow-violet-600/30 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10">Ver Produtos</span>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <a
            href="https://fakestoreapi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-slate-700 text-slate-300 px-10 py-4 rounded-2xl font-semibold hover:bg-slate-800/80 hover:border-slate-500 transition-all text-lg hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
          >
            Fake Store API
          </a>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: "📦",
              title: "Catálogo",
              desc: "Navegue por produtos de várias categorias com filtros e paginação",
              accent: "violet",
            },
            {
              icon: "🛒",
              title: "Carrinho",
              desc: "Adicione, remova e gerencie produtos com persistência local",
              accent: "emerald",
            },
            {
              icon: "💳",
              title: "Pagamento",
              desc: "Checkout com PIX via integração com AbacatePay (extra educacional)",
              accent: "rose",
            },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className="group relative bg-slate-900/80 rounded-2xl p-8 border border-slate-800 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Hover glow */}
              <div
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  feature.accent === "violet"
                    ? "bg-violet-500/5"
                    : feature.accent === "emerald"
                    ? "bg-emerald-500/5"
                    : "bg-rose-500/5"
                }`}
              />

              <div
                className={`relative w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 ${
                  feature.accent === "violet"
                    ? "bg-violet-500/10 group-hover:bg-violet-500/20 group-hover:shadow-lg group-hover:shadow-violet-500/20"
                    : feature.accent === "emerald"
                    ? "bg-emerald-500/10 group-hover:bg-emerald-500/20 group-hover:shadow-lg group-hover:shadow-emerald-500/20"
                    : "bg-rose-500/10 group-hover:bg-rose-500/20 group-hover:shadow-lg group-hover:shadow-rose-500/20"
                }`}
              >
                <span className="text-2xl leading-none">{feature.icon}</span>
              </div>

              <h3 className="relative text-lg font-semibold mb-3 text-slate-100">
                {feature.title}
              </h3>
              <p className="relative text-slate-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="relative bg-slate-900/80 rounded-2xl p-10 border border-slate-800 backdrop-blur-sm mb-20">
          <h3 className="text-xl font-semibold mb-8 text-slate-100">Stack Tecnológico</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "Next.js 16", color: "violet" },
              { name: "React 19", color: "violet" },
              { name: "TypeScript", color: "violet" },
              { name: "Tailwind CSS", color: "violet" },
              { name: "Context API", color: "emerald" },
              { name: "localStorage", color: "emerald" },
              { name: "Fetch API", color: "emerald" },
              { name: "AbacatePay (extra)", color: "emerald" },
            ].map((tech) => (
              <div
                key={tech.name}
                className={`px-4 py-3 rounded-xl font-medium text-sm border transition-all duration-300 hover:scale-[1.03] cursor-default ${
                  tech.color === "violet"
                    ? "bg-violet-500/5 text-violet-300 border-violet-500/15 hover:border-violet-500/40 hover:bg-violet-500/10 hover:shadow-md hover:shadow-violet-500/10"
                    : "bg-emerald-500/5 text-emerald-300 border-emerald-500/15 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:shadow-md hover:shadow-emerald-500/10"
                }`}
              >
                {tech.name}
              </div>
            ))}
          </div>
        </div>

        {/* AbacatePay Section */}
        <div className="relative bg-slate-900/80 rounded-2xl p-10 border border-emerald-500/10 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-2xl">🥑</span>
            <h3 className="text-xl font-semibold text-slate-100">AbacatePay</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold uppercase tracking-wider">
              Extra
            </span>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-2xl mx-auto text-center">
            Como funcionalidade <span className="text-slate-300 font-medium">extra e puramente educacional</span>,
            integramos a API de pagamentos da AbacatePay para simular um fluxo real de checkout com PIX.
            Esta funcionalidade <span className="text-slate-300 font-medium">não faz parte dos requisitos obrigatórios</span> do
            desafio de 4 sprints — foi implementada como aprendizado adicional.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              {
                step: "1",
                title: "Checkout",
                desc: "O cliente revisa os itens do carrinho e informa CPF e telefone",
              },
              {
                step: "2",
                title: "QR Code PIX",
                desc: "Um QR Code é gerado em tempo real via API da AbacatePay",
              },
              {
                step: "3",
                title: "Confirmação",
                desc: "O pagamento é verificado automaticamente e o pedido confirmado",
              },
            ].map((item) => (
              <div key={item.step} className="bg-slate-800/40 rounded-xl p-5 border border-slate-800 flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400 mb-4">
                  {item.step}
                </div>
                <h4 className="text-sm font-semibold text-slate-200 mb-2">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4">
            <a
              href="https://abacatepay.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition font-medium"
            >
              abacatepay.com →
            </a>
            <span className="text-xs text-slate-600">|</span>
            <span className="text-xs text-slate-600">Integração via API Routes (server-side proxy)</span>
          </div>
        </div>
      </main>
    </div>
  );
}
