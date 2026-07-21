// Formata um número como moeda brasileira: 32.9 -> "R$ 32,90"
export const formatCurrency = (value: number): string =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
