// Formata um número como moeda brasileira: 32.9 -> "R$ 32,90"
export const formatCurrency = (value: number): string =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

// Tira tudo que não é número: "(15) 99851-2564" -> "15998512564"
export const apenasDigitos = (valor: string): string => valor.replace(/\D/g, "");

// Máscara de telefone brasileiro, aplicada enquanto a pessoa digita.
// Como cortamos em 11 dígitos, é impossível digitar um telefone maior que o
// real — e qualquer letra/símbolo é descartado.
//   11 dígitos (celular): (15) 99851-2564
//   10 dígitos (fixo):    (15) 3221-4455
export function formatarTelefone(valor: string): string {
  const d = apenasDigitos(valor).slice(0, 11);

  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  // Até 10 dígitos tratamos como fixo (4 dígitos antes do traço).
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  // 11 dígitos = celular (5 antes do traço).
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// Um telefone só é válido com DDD + número: 10 (fixo) ou 11 (celular) dígitos.
export const telefoneValido = (valor: string): boolean => {
  const n = apenasDigitos(valor).length;
  return n === 10 || n === 11;
};
