// Guarda/recupera o token do login da Val no navegador.
// localStorage = "gaveta" do navegador que sobrevive a recarregar a página.
// (Pra um painel interno simples, é suficiente. Em apps mais sensíveis, dá pra
//  usar cookies httpOnly, mas aí o backend precisa participar.)

const TOKEN_KEY = "val_admin_token";

export function salvarToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function pegarToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function limparToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
