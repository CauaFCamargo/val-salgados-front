// Em produção, defina VITE_API_URL (ex.: https://api.valsalgados.com).
// Em desenvolvimento, cai no localhost por padrão.
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Tipos "nomeados": os mesmos valores que a API (Zod/Prisma) aceita.
// Deixar como união de strings evita erro de digitação e documenta as opções.
export type TipoEntrega = "ENTREGA" | "RETIRADA";
export type FormaPagamento = "PIX" | "DINHEIRO";

// O formato do que a gente manda pro backend.
export interface CriarPedidoInput {
  clienteNome: string;
  telefone: string;
  tipoEntrega: TipoEntrega;
  // Todos opcionais aqui porque na RETIRADA não se pede endereço.
  // Na ENTREGA, rua/número/bairro/cidade são exigidos (front e API validam).
  endereco?: string; // rua / logradouro
  numeroEndereco?: string;
  bairro?: string;
  cidade?: string;
  complemento?: string;
  formaPagamento: FormaPagamento;
  trocoPara?: number; // só no DINHEIRO
  itens: {
    nome: string;
    quantidade: number;
    precoUnitario: number;
  }[];
}

// O formato do que a API devolve (o que interessa pro front usar).
export interface PedidoCriado {
  id: number;
  numero: number;
  status: string;
  subtotal: number;
  taxaEntrega: number;
  total: number;
  formaPagamento: FormaPagamento;
  tipoEntrega: TipoEntrega;
  whatsappUrl: string; // link wa.me pronto, montado pela API
}

export async function criarPedido(
  dados: CriarPedidoInput
): Promise<PedidoCriado> {
  const resposta = await fetch(`${API_URL}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  if (!resposta.ok) {
    // Tenta ler a mensagem de erro que a API mandou (validação Zod, etc.).
    const erro = await resposta.json().catch(() => null);
    throw new Error(erro?.erro ?? "Não foi possível criar o pedido");
  }

  return resposta.json();
}

// ---------------------------------------------------------------------------
// Área administrativa (dashboard da Val) — chamadas que exigem token JWT.
// ---------------------------------------------------------------------------

// Um item do pedido como a API devolve.
export interface ItemPedido {
  id: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

// O pedido completo, como vem do GET /pedidos.
export interface Pedido {
  id: number;
  numero: number;
  criadoEm: string;
  clienteNome: string;
  telefone: string;
  tipoEntrega: TipoEntrega;
  endereco: string | null;
  numeroEndereco: string | null;
  bairro: string | null;
  cidade: string | null;
  complemento: string | null;
  formaPagamento: FormaPagamento;
  trocoPara: number | null;
  subtotal: number;
  taxaEntrega: number;
  desconto: number;
  total: number;
  status: string;
  // O agente de impressão local marca como true depois de imprimir o cupom.
  // O painel pode voltar pra false pra o agente imprimir de novo.
  impresso: boolean;
  itens: ItemPedido[];
}

// Erro específico pra "token expirou/ inválido" (a UI usa isso pra deslogar).
export class SessaoExpiradaError extends Error {
  constructor() {
    super("Sessão expirada. Entre novamente.");
    this.name = "SessaoExpiradaError";
  }
}

// O que a rota pública devolve (subconjunto seguro do pedido — sem telefone,
// endereço, troco). Usado na página de acompanhamento do cliente.
export interface PedidoPublico {
  numero: number;
  status: string;
  criadoEm: string;
  tipoEntrega: TipoEntrega;
  total: number;
  clienteNome: string;
  itens: ItemPedido[];
}

// GET /pedidos/:numero (público) → status de um pedido pelo número.
export async function buscarPedidoPublico(
  numero: number
): Promise<PedidoPublico> {
  const resposta = await fetch(`${API_URL}/pedidos/${numero}`);

  if (resposta.status === 404) throw new Error("Pedido não encontrado");
  if (!resposta.ok) throw new Error("Não foi possível carregar o pedido");

  return resposta.json();
}

// POST /auth/login → devolve o token.
export async function login(usuario: string, senha: string): Promise<string> {
  const resposta = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, senha }),
  });

  if (!resposta.ok) {
    throw new Error("Usuário ou senha inválidos");
  }

  const dados = await resposta.json();
  return dados.token as string;
}

// GET /pedidos (protegido) → lista todos os pedidos.
export async function listarPedidos(token: string): Promise<Pedido[]> {
  const resposta = await fetch(`${API_URL}/pedidos`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (resposta.status === 401) throw new SessaoExpiradaError();
  if (!resposta.ok) throw new Error("Não foi possível carregar os pedidos");

  return resposta.json();
}

// PATCH /pedidos/:id/status (protegido) → muda o status e devolve o pedido.
export async function atualizarStatus(
  token: string,
  id: number,
  status: string
): Promise<Pedido> {
  const resposta = await fetch(`${API_URL}/pedidos/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (resposta.status === 401) throw new SessaoExpiradaError();
  if (!resposta.ok) throw new Error("Não foi possível atualizar o status");

  return resposta.json();
}

// Marca/desmarca o pedido como impresso.
// `impresso: false` devolve o pedido pra fila do agente de impressão local,
// que roda na máquina da loja e imprime os pedidos ainda não impressos.
export async function definirImpresso(
  token: string,
  id: number,
  impresso: boolean
): Promise<{ id: number; impresso: boolean }> {
  const resposta = await fetch(`${API_URL}/pedidos/${id}/impresso`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ impresso }),
  });

  if (resposta.status === 401) throw new SessaoExpiradaError();
  if (!resposta.ok) throw new Error("Não foi possível atualizar a impressão");

  return resposta.json();
}
