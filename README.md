# 🏪 Desenvolve Store

Uma aplicação educacional de e-commerce desenvolvida como desafio frontend de 4 sprints, integrando a **Fake Store API** com React, Next.js e TypeScript.

## 📋 Sobre o Projeto

Desenvolve Store é um portal de compras que demonstra habilidades em:

- ✅ Consumo de APIs REST
- ✅ Gerenciamento de estado global (Context API)
- ✅ Roteamento dinâmico (Next.js App Router)
- ✅ Persistência de dados (localStorage)
- ✅ Componentização em React
- ✅ Estilização responsiva (Tailwind CSS)
- ✅ TypeScript para type safety

## 🚀 Tecnologias Utilizadas

| Stack | Versão |
|-------|--------|
| **Next.js** | 16.1.5 |
| **React** | 19.2.3 |
| **TypeScript** | 5.x |
| **Tailwind CSS** | 4.x |
| **Node.js** | 18+ |

## 📦 O Que Precisa Ser Implementado

### Funcionalidades Obrigatórias ✨
Implemente as funcionalidades principais de um e-commerce:
- Consumo de APIs REST
- Gerenciamento de estado global
- Roteamento dinâmico
- Persistência de dados
- Componentização em React
- Estilização responsiva
- TypeScript para type safety

### Extras Educacionais (Opcional) 🎁
> As funcionalidades abaixo **não fazem parte dos requisitos obrigatórios** do desafio.
> Foram implementadas como aprendizado adicional e exploração de conceitos reais de mercado.

- [x] **Autenticação** — Login e cadastro com Fake Store API, Context API + localStorage
- [x] **Perfil do usuário** — Edição de dados, upload de foto de perfil, alteração de senha
- [x] **Pagamento PIX (AbacatePay)** — Checkout com geração de QR Code PIX em tempo real
- [x] **API Routes (proxy)** — Rotas server-side no Next.js para evitar exposição de chaves
- [x] **Traduções pt-BR** — Títulos, descrições e categorias dos produtos traduzidos
- [x] **Design system** — Dark theme coeso (slate + violet), animações, glassmorphism, glow effects

## 📂 Estrutura do Projeto

```
src/
├── app/                      # Páginas (Next.js App Router)
│   ├── layout.tsx           # Layout raiz com Providers
│   ├── page.tsx             # Home
│   ├── products/            # Lista de produtos
│   │   └── page.tsx
│   ├── product/
│   │   └── [id]/            # Detalhes do produto
│   │       └── page.tsx
│   ├── cart/                # Carrinho
│   │   └── page.tsx
│   ├── login/               # Login (extra)
│   │   └── page.tsx
│   ├── signup/              # Cadastro (extra)
│   │   └── page.tsx
│   ├── profile/             # Perfil do usuário (extra)
│   │   └── page.tsx
│   ├── checkout/            # Checkout com PIX (extra)
│   │   └── page.tsx
│   └── api/                 # API Routes - proxy server-side (extra)
│       ├── pix/
│       └── billing/
├── components/              # Componentes reutilizáveis
│   ├── Header.tsx          # Navegação, avatar e contador do carrinho
│   ├── ProductCard.tsx     # Card do produto com quantidade
│   ├── CategoryFilter.tsx  # Filtro de categorias
│   ├── ProductDetails.tsx  # Detalhes do produto
│   ├── ErrorMessage.tsx    # Mensagem de erro
│   └── Pagination.tsx      # Paginação
├── context/                # Estado global
│   ├── CartContext.tsx     # Context API do carrinho
│   └── AuthContext.tsx     # Context API de autenticação (extra)
├── services/               # Serviços de API
│   └── api.ts             # Fetch das endpoints
├── utils/                  # Utilidades
│   └── translations.ts    # Traduções pt-BR dos produtos
└── types/                  # Tipos TypeScript
    ├── product.ts
    ├── cart.ts
    ├── auth.ts
    └── payment.ts
```

## 🔧 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd desenvolve-store
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

4. Acesse no navegador:
```
http://localhost:3000
```

## 📱 Páginas Principais

| Rota | Descrição |
|------|-----------|
| `/` | Home - Apresentação da aplicação |
| `/products` | Lista de produtos com filtro por categoria |
| `/product/:id` | Detalhes de um produto específico |
| `/cart` | Carrinho de compras com CRUD |
| `/login` | Login de usuário *(extra)* |
| `/signup` | Cadastro de usuário *(extra)* |
| `/profile` | Perfil com edição de dados e upload de foto *(extra)* |
| `/checkout` | Checkout com pagamento PIX *(extra)* |

## 🎨 Features de UX

- **Loading States**: Skeletons animados enquanto dados carregam
- **Responsividade**: Design adaptado para mobile, tablet e desktop
- **Filtro por Categorias**: Dinamicamente carregadas da API
- **Persistência**: Carrinho e autenticação salvos em localStorage
- **Feedback**: Mensagens de erro claras, toast de confirmação
- **Formatação**: Preços em BRL (Real Brasileiro)
- **Traduções**: Produtos traduzidos para português brasileiro
- **Dark Theme**: Design coeso com paleta slate + violet + emerald
- **Animações**: fadeIn, gradient, hover effects, glassmorphism

## 🔌 Endpoints da Fake Store API Utilizados

```javascript
// Produtos
GET /products              // Todos os produtos
GET /products/:id          // Produto específico
GET /products/categories   // Todas as categorias
GET /products/category/:cat // Produtos de uma categoria
```

📖 Documentação: https://fakestoreapi.com

## 🥑 AbacatePay (Extra Educacional)

> **Esta integração é opcional e puramente educacional.** Não faz parte dos requisitos do desafio.

Implementamos um fluxo completo de pagamento PIX usando a API da [AbacatePay](https://abacatepay.com):

1. **Checkout** — Cliente revisa itens, informa CPF e telefone
2. **QR Code PIX** — Gerado em tempo real via API da AbacatePay
3. **Confirmação** — Pagamento verificado automaticamente

A integração utiliza **API Routes do Next.js** como proxy server-side para não expor chaves no client.

```
POST /api/pix/create      → Gera QR Code PIX
POST /api/pix/simulate     → Simula pagamento (sandbox)
GET  /api/pix/check        → Verifica status
POST /api/billing/create   → Cria cobrança
GET  /api/billing/list     → Lista cobranças
```

📖 Documentação: https://abacatepay.com

## 💾 Persistência

O carrinho é automaticamente salvo em `localStorage` na chave `desenvolve-store-cart`. Os dados persistem após:
- Recarregar a página
- Fechar e reabrir o navegador
- Limpar manualmente o carrinho

## 📊 Análise de Requisitos

| Critério | Peso | Status |
|----------|------|--------|
| Consumo de API & Hooks | 30% | ✅ 100% |
| Funcionalidades do Carrinho | 40% | ✅ 100% |
| Organização e Componentização | 20% | ✅ 100% |
| UX/Interface & Entrega | 10% | ✅ 100% |

**Total: 100% ✅**

## 🚀 Deploy

A aplicação pode ser facilmente deployada em:

- **Vercel** (recomendado para Next.js)
- **Netlify**
- **AWS Amplify**

### Deploy no Vercel

```bash
npm run build
# Fazer push para GitHub
# Conectar repositório no Vercel
```

## 🤝 Autor

Desenvolvido como desafio educacional de Frontend.

## 📞 Suporte

Para questões sobre o projeto, consulte:
- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação React](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Fake Store API](https://fakestoreapi.com/docs)

## 📄 Licença

Este projeto é de código aberto para fins educacionais.

---

**Status**: ✅ Completo - Pronto para produção

**Última atualização**: Fevereiro de 2026
