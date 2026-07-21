import { useCallback, useEffect, useState } from "react";
import {
  listarPedidos,
  atualizarStatus,
  SessaoExpiradaError,
  type Pedido,
} from "../services/api";
import { formatCurrency } from "../utils/format";

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

// Qual é o próximo status ao clicar "Avançar". Se não estiver no mapa
// (ENTREGUE/CANCELADO), não há próximo — o pedido chegou ao fim.
const PROXIMO_STATUS: Record<string, string | undefined> = {
  RECEBIDO: "EM_PRODUCAO",
  EM_PRODUCAO: "PRONTO",
  PRONTO: "ENTREGUE",
};

// Rótulos e cores amigáveis pra cada status.
const STATUS_INFO: Record<string, { label: string; cor: string }> = {
  RECEBIDO: { label: "Recebido", cor: "bg-blue-100 text-blue-700" },
  EM_PRODUCAO: { label: "Em produção", cor: "bg-amber-100 text-amber-700" },
  PRONTO: { label: "Pronto", cor: "bg-green-100 text-green-700" },
  ENTREGUE: { label: "Entregue", cor: "bg-zinc-200 text-zinc-600" },
  CANCELADO: { label: "Cancelado", cor: "bg-red-100 text-red-700" },
};

function formatarHora(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDashboard({ token, onLogout }: AdminDashboardProps) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  // useCallback pra a função não ser recriada a cada render (o useEffect depende dela).
  const carregar = useCallback(async () => {
    try {
      const lista = await listarPedidos(token);
      setPedidos(lista);
      setErro("");
    } catch (err) {
      // Token expirou → desloga. Qualquer outro erro → mostra aviso.
      if (err instanceof SessaoExpiradaError) onLogout();
      else setErro("Não foi possível carregar os pedidos.");
    } finally {
      setCarregando(false);
    }
  }, [token, onLogout]);

  // Carrega ao abrir e depois a cada 5s (polling). Limpa o timer ao sair.
  useEffect(() => {
    carregar();
    const timer = setInterval(carregar, 5000);
    return () => clearInterval(timer);
  }, [carregar]);

  const mudarStatus = async (pedido: Pedido, novoStatus: string) => {
    try {
      const atualizado = await atualizarStatus(token, pedido.id, novoStatus);
      // Troca só o pedido alterado na lista (sem recarregar tudo).
      setPedidos((prev) =>
        prev.map((p) => (p.id === atualizado.id ? atualizado : p))
      );
    } catch (err) {
      if (err instanceof SessaoExpiradaError) onLogout();
      else setErro("Não foi possível atualizar o status.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl">Pedidos</h1>
            <p className="text-sm text-zinc-500">
              {pedidos.length} no total · atualiza sozinho
            </p>
          </div>
          <button
            onClick={onLogout}
            className="text-sm border-2 border-zinc-200 hover:border-zinc-300 rounded px-3 py-1.5 duration-200"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5">
        {erro && <p className="text-red-500 mb-4">{erro}</p>}

        {carregando ? (
          <p className="text-zinc-500 text-center py-10">Carregando...</p>
        ) : pedidos.length === 0 ? (
          <p className="text-zinc-500 text-center py-10">
            Nenhum pedido ainda. Assim que um cliente enviar, aparece aqui.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {pedidos.map((pedido) => {
              const info = STATUS_INFO[pedido.status] ?? {
                label: pedido.status,
                cor: "bg-zinc-100 text-zinc-600",
              };
              const proximo = PROXIMO_STATUS[pedido.status];
              const finalizado =
                pedido.status === "ENTREGUE" || pedido.status === "CANCELADO";

              return (
                <div
                  key={pedido.id}
                  className="bg-white rounded-lg shadow-sm p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold">Pedido #{pedido.numero}</span>
                      <span className="text-zinc-400 text-sm ml-2">
                        {formatarHora(pedido.criadoEm)}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${info.cor}`}
                    >
                      {info.label}
                    </span>
                  </div>

                  <div className="mt-2 text-sm">
                    <p className="font-medium">
                      {pedido.clienteNome} · {pedido.telefone}
                    </p>
                    <p className="text-zinc-600">
                      {pedido.tipoEntrega === "ENTREGA"
                        ? `🛵 Entrega: ${pedido.endereco ?? "-"}`
                        : "🏠 Retirada na loja"}
                    </p>
                    <p className="text-zinc-600">
                      {pedido.formaPagamento === "PIX"
                        ? "💠 PIX"
                        : `💵 Dinheiro${
                            pedido.trocoPara != null
                              ? ` (troco p/ ${formatCurrency(pedido.trocoPara)})`
                              : ""
                          }`}
                    </p>
                  </div>

                  <ul className="mt-2 text-sm text-zinc-700 border-t pt-2">
                    {pedido.itens.map((item) => (
                      <li key={item.id} className="flex justify-between">
                        <span>
                          {item.quantidade}x {item.nome}
                        </span>
                        <span>
                          {formatCurrency(item.precoUnitario * item.quantidade)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t">
                    <span className="font-bold">
                      Total: {formatCurrency(pedido.total)}
                    </span>
                    {!finalizado && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => mudarStatus(pedido, "CANCELADO")}
                          className="text-sm text-red-600 hover:bg-red-50 rounded px-3 py-1.5 duration-200"
                        >
                          Cancelar
                        </button>
                        {proximo && (
                          <button
                            onClick={() => mudarStatus(pedido, proximo)}
                            className="text-sm bg-green-600 hover:bg-green-700 text-white rounded px-3 py-1.5 duration-200"
                          >
                            Avançar → {STATUS_INFO[proximo].label}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
