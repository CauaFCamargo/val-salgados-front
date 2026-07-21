// -----------------------------------------------------------------------------
// Dados fixos da loja usados pelo FRONT (cabeçalho e botão de suporte).
//
// A API tem os mesmos dados em src/config/empresa.ts — lá é a fonte da verdade
// pro que entra no pedido (link do pedido, chave PIX). Aqui é só o que a página
// mostra, porque o front é estático e precisa dessa informação no build.
// -----------------------------------------------------------------------------
export const LOJA = {
  nome: "Val Salgados",
  endereco: "Alameda Celidônio do Monte, 757 · Sorocaba - SP",
  horario: "Seg à Sáb - 08:00 as 18:00",
  // Número que recebe as mensagens: formato internacional, só dígitos
  // (55 = Brasil, 15 = DDD). Dá pra sobrescrever no Vercel com
  // VITE_WHATSAPP_NUMERO, sem precisar mexer no código.
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMERO ?? "5515998512564",
};

// Link que abre a conversa com a loja no WhatsApp, já com uma mensagem
// inicial escrita — assim a pessoa não trava no "o que eu escrevo?".
// Funciona no celular (abre o app) e no computador (abre o WhatsApp Web).
export function linkWhatsappSuporte(): string {
  const texto = `Olá! Vim pelo site da ${LOJA.nome} e preciso de ajuda.`;
  return `https://wa.me/${LOJA.whatsapp}?text=${encodeURIComponent(texto)}`;
}
