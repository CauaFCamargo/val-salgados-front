import { useState } from "react";
import { formatCurrency } from "../utils/format";
import type { CartItem } from "../types";
// Os tipos de pagamento/entrega moram no serviço da API (fonte única).
import type {
  CriarPedidoInput,
  FormaPagamento,
  TipoEntrega,
} from "../services/api";

// Pedido mínimo da loja, em unidades somadas de todos os itens.
// A API valida essa MESMA regra (lá é a fonte da verdade); aqui a gente só
// avisa o cliente antes dele tentar finalizar.
const PEDIDO_MINIMO_UNIDADES = 30;

// O modal coleta tudo do pedido MENOS os itens (que vêm do carrinho).
// Por isso reaproveitamos o tipo da API com Omit — um único ponto de verdade.
export type DadosCheckout = Omit<CriarPedidoInput, "itens">;

interface CartModalProps {
  open: boolean;
  items: CartItem[];
  total: number;
  onClose: () => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onCheckout: (dados: DadosCheckout) => void;
}

export default function CartModal({
  open,
  items,
  total,
  onClose,
  onIncrement,
  onDecrement,
  onCheckout,
}: CartModalProps) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega>("ENTREGA");
  const [endereco, setEndereco] = useState("");
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("PIX");
  const [trocoPara, setTrocoPara] = useState(""); // texto do input; convertido na hora
  // Um erro por campo: { nome: "...", endereco: "..." }
  const [erros, setErros] = useState<Record<string, string>>({});

  if (!open) return null;

  // Soma das QUANTIDADES (não do número de produtos diferentes): o mínimo é
  // 30 unidades no total, podendo misturar (10 coxinhas + 10 esfihas + 10 ...).
  const unidades = items.reduce((soma, it) => soma + it.qty, 0);
  const faltam = PEDIDO_MINIMO_UNIDADES - unidades;
  const atingiuMinimo = faltam <= 0;

  const handleCheckout = () => {
    const novosErros: Record<string, string> = {};

    if (!nome.trim()) novosErros.nome = "Informe seu nome.";
    if (telefone.trim().length < 8) novosErros.telefone = "Telefone inválido.";
    // Mesma regra que a API valida — aqui é só pra avisar antes de enviar.
    if (!atingiuMinimo) {
      novosErros.minimo = `O pedido mínimo é de ${PEDIDO_MINIMO_UNIDADES} unidades.`;
    }
    // Endereço só é obrigatório quando for ENTREGA (mesma regra do backend).
    if (tipoEntrega === "ENTREGA" && !endereco.trim()) {
      novosErros.endereco = "Endereço é obrigatório para entrega.";
    }

    // Troco: se o cliente digitou um valor, ele precisa cobrir o total.
    const trocoNum = trocoPara.trim() ? Number(trocoPara) : undefined;
    if (formaPagamento === "DINHEIRO" && trocoNum !== undefined) {
      if (Number.isNaN(trocoNum) || trocoNum < total) {
        novosErros.trocoPara = `O troco precisa ser ao menos ${formatCurrency(total)}.`;
      }
    }

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    // Monta o payload só com o que faz sentido pra cada caso.
    onCheckout({
      clienteNome: nome.trim(),
      telefone: telefone.trim(),
      tipoEntrega,
      endereco: tipoEntrega === "ENTREGA" ? endereco.trim() : undefined,
      formaPagamento,
      trocoPara: formaPagamento === "DINHEIRO" ? trocoNum : undefined,
    });
  };

  // Botão de um seletor "segmentado" (Entrega/Retirada, PIX/Dinheiro).
  const opcaoBtn = (ativo: boolean) =>
    "flex-1 py-2 rounded font-medium duration-200 border-2 " +
    (ativo
      ? "bg-green-600 border-green-600 text-white"
      : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300");

  const troco =
    formaPagamento === "DINHEIRO" && trocoPara.trim() && !Number.isNaN(Number(trocoPara))
      ? Number(trocoPara) - total
      : null;

  return (
    <div
      className="bg-black/60 w-full h-full fixed top-0 left-0 z-[99] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-5 rounded-md w-full max-w-xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-center font-bold text-2xl mb-2">Meu carrinho</h2>

        {items.length === 0 ? (
          <p className="text-center text-zinc-500 py-8">
            Seu carrinho está vazio. Escolha um salgado pra começar!
          </p>
        ) : (
          <div className="flex flex-col mb-2">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center gap-3 py-2 border-b border-zinc-100"
              >
                <div className="w-full">
                  <p className="font-medium">{it.name}</p>
                  <p className="text-sm text-zinc-500">{formatCurrency(it.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDecrement(it.id)}
                    className="w-8 h-8 rounded bg-zinc-100 hover:bg-zinc-200 font-bold"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-medium">{it.qty}</span>
                  <button
                    onClick={() => onIncrement(it.id)}
                    className="w-8 h-8 rounded bg-zinc-100 hover:bg-zinc-200 font-bold"
                  >
                    +
                  </button>
                </div>
                <p className="w-20 text-right font-bold">
                  {formatCurrency(it.price * it.qty)}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="font-bold">Total: <span>{formatCurrency(total)}</span></p>
          <p className="text-sm text-zinc-500">{unidades} unidades</p>
        </div>

        {/* Aviso do pedido mínimo: o cliente precisa saber ANTES de tentar
            finalizar, por isso fica visível junto do total. */}
        {items.length > 0 && !atingiuMinimo && (
          <p className="mt-2 text-sm bg-amber-50 text-amber-800 border border-amber-200 rounded p-2">
            Pedido mínimo de {PEDIDO_MINIMO_UNIDADES} unidades — faltam{" "}
            <strong>{faltam}</strong>. Pode misturar os salgados que quiser!
          </p>
        )}

        {/* Dados do cliente */}
        <p className="font-bold mt-4">Seu nome:</p>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Como podemos te chamar?"
          className="w-full border-2 p-1 rounded my-1 outline-none focus:border-green-600"
        />
        {erros.nome && <p className="text-red-500 text-sm">{erros.nome}</p>}

        <p className="font-bold mt-2">Telefone / WhatsApp:</p>
        <input
          type="tel"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          placeholder="(15) 99999-8888"
          className="w-full border-2 p-1 rounded my-1 outline-none focus:border-green-600"
        />
        {erros.telefone && <p className="text-red-500 text-sm">{erros.telefone}</p>}

        {/* Entrega x Retirada */}
        <p className="font-bold mt-4">Como você quer receber?</p>
        <div className="flex gap-2 mt-1">
          <button
            type="button"
            onClick={() => setTipoEntrega("ENTREGA")}
            className={opcaoBtn(tipoEntrega === "ENTREGA")}
          >
            🛵 Entrega
          </button>
          <button
            type="button"
            onClick={() => setTipoEntrega("RETIRADA")}
            className={opcaoBtn(tipoEntrega === "RETIRADA")}
          >
            🏠 Retirada
          </button>
        </div>

        {/* Endereço aparece só na Entrega */}
        {tipoEntrega === "ENTREGA" && (
          <>
            <p className="font-bold mt-3">Endereço de entrega:</p>
            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Digite seu endereço completo..."
              className="w-full border-2 p-1 rounded my-1 outline-none focus:border-green-600"
            />
            {erros.endereco && (
              <p className="text-red-500 text-sm">{erros.endereco}</p>
            )}
          </>
        )}
        {tipoEntrega === "RETIRADA" && (
          <p className="text-sm text-zinc-500 mt-2">
            Você retira na loja: Alameda Celidônio do Monte, 757 · Sorocaba - SP
          </p>
        )}

        {/* Forma de pagamento */}
        <p className="font-bold mt-4">Forma de pagamento:</p>
        <div className="flex gap-2 mt-1">
          <button
            type="button"
            onClick={() => setFormaPagamento("PIX")}
            className={opcaoBtn(formaPagamento === "PIX")}
          >
            💠 PIX
          </button>
          <button
            type="button"
            onClick={() => setFormaPagamento("DINHEIRO")}
            className={opcaoBtn(formaPagamento === "DINHEIRO")}
          >
            💵 Dinheiro
          </button>
        </div>

        {/* Troco aparece só no Dinheiro */}
        {formaPagamento === "DINHEIRO" && (
          <>
            <p className="font-bold mt-3">Troco para quanto? (opcional)</p>
            <input
              type="number"
              min={0}
              step="0.01"
              value={trocoPara}
              onChange={(e) => setTrocoPara(e.target.value)}
              placeholder="Ex.: 50"
              className="w-full border-2 p-1 rounded my-1 outline-none focus:border-green-600"
            />
            {erros.trocoPara && (
              <p className="text-red-500 text-sm">{erros.trocoPara}</p>
            )}
            {troco !== null && troco >= 0 && (
              <p className="text-sm text-zinc-600">
                Troco a devolver: {formatCurrency(troco)}
              </p>
            )}
          </>
        )}

        <div className="flex items-center justify-between mt-5 w-full">
          <button onClick={onClose}>Fechar</button>
          <button
            onClick={handleCheckout}
            disabled={items.length === 0 || !atingiuMinimo}
            className="bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-1 rounded duration-200"
          >
            Finalizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
