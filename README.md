# Val Salgados

Cardápio digital para uma microempresa de salgados. O cliente recebe o link pelo
WhatsApp, monta o pedido e (em breve) envia direto pela plataforma. Este
repositório é o **frontend** — a primeira fase de um sistema maior de gestão de
pedidos e produção.

## Stack

- **React 18** + **Vite**
- **Tailwind CSS**
- **Intl API** para formatação de moeda (pt-BR)

## Como rodar

```bash
npm install
npm run dev
```

Antes de rodar, coloque as imagens em `src/assets/` (veja a seção abaixo).

## Estrutura

```
src/
├── assets/        Imagens (logo, fundo, fotos dos produtos)
├── components/    Componentes de UI (Header, ProductRow, CartModal, ...)
├── data/          Produtos e categorias (dados separados da UI)
├── hooks/         useCart (useReducer) e useToast
├── utils/         Formatação de moeda
├── App.jsx        Orquestra estado (busca, carrinho, navegação)
└── main.jsx       Ponto de entrada
```

Decisões de design que valem comentar:

- **`useReducer` no carrinho** — as ações (adicionar, +, −, limpar) são transições
  claras de um mesmo estado, então um reducer deixa a lógica testável e isolada
  da UI, dentro do hook `useCart`.
- **Dados separados da UI** — `data/products.js` funciona como um mock da API.
  Quando o backend existir, troca-se o array por um `fetch` sem mexer nos
  componentes.
- **Scroll-spy** — a navegação por categorias destaca a seção visível usando
  `IntersectionObserver`.
- **IDs estáveis nos produtos** — usados como `key` no React e prontos para virar
  chave primária no banco.

## Imagens

Coloque estes arquivos em `src/assets/` (os nomes precisam bater):

- `valsalgadoslogo.png` — logo (círculo do topo)
- `fundo.png` — foto de fundo do header
- `empadinhadefrango.png`, `empadinhapalmito.png`, `coxinha.png` — fotos de produto

Produtos sem foto usam um emoji como reserva. Para adicionar uma nova foto:
importe a imagem no topo de `src/data/products.js` e use no campo `image` do
produto.

## Roadmap

- [ ] Backend (Node + Express + Prisma + PostgreSQL) modelando pedidos
- [ ] Envio do pedido pelo WhatsApp com mensagem de confirmação
- [ ] Página de acompanhamento de status do pedido
- [ ] Impressão térmica 80mm (via cliente + via empresa)
- [ ] Testes + CI/CD + deploy
