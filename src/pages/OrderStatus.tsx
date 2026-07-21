import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { buscarPedidoPublico, type PedidoPublico } from "../services/api";
import { formatCurrency } from "../utils/format";

// As etapas na ordem do fluxo. A barra marca até onde o pedido já chegou.
const ETAPAS = [
  { id: "RECEBIDO", label: "Recebido" },
  { id: "EM_PRODUCAO", label: "Em produção" },
  { id: "PRONTO", label: "Pronto" },
  { id: "ENTREGUE", label: "Entregue" },
];

export default function OrderStatus() {
  // Pega o :numero da URL (ex.: /pedido/6 → "6").
  const { numero } = useParams<{ numero: string }>();
  const [pedido, setPedido] = useState<PedidoPublico | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    if (!numero) return;
    try {
      const dados = await buscarPedidoPublico(Number(numero));
      setPedido(dados);
      setErro("");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao carregar");
    } finally {
      setCarregando(false);
    }
  }, [numero]);

  // Carrega ao abrir e atualiza a cada 10s (o cliente vê o status mudar).
  useEffect(() => {
    carregar();
    const timer = setInterval(carregar, 10000);
    return () => clearInterval(timer);
  }, [carregar]);

  const cancelado = pedido?.status === "CANCELADO";
  // Índice da etapa atual (pra pintar as etapas já concluídas).
  const etapaAtual = pedido ? ETAPAS.findIndex((e) => e.id === pedido.status) : -1;

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col items-center p-4">
      <div className="bg-white rounded-lg shadow w-full max-w-md p-6 mt-8">
        {carregando ? (
          <p className="text-center text-zinc-500 py-8">Carregando...</p>
        ) : erro ? (
          <div className="text-center py-8">
            <p className="text-red-500 font-medium">{erro}</p>
            <Link to="/" className="text-green-600 hover:underline mt-3 inline-block">
              Voltar ao cardápio
            </Link>
          </div>
        ) : pedido ? (
          <>
            <h1 className="text-2xl font-bold text-center">
              Pedido #{pedido.numero}
            </h1>
            <p className="text-center text-zinc-500 mt-1">
              Olá, {pedido.clienteNome.split(" ")[0]}! Acompanhe seu pedido:
            </p>

            {cancelado ? (
              <div className="bg-red-50 text-red-700 rounded-lg text-center py-4 mt-5 font-medium">
                Este pedido foi cancelado.
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-3">
                {ETAPAS.map((etapa, i) => {
                  const concluida = i <= etapaAtual;
                  const atual = i === etapaAtual;
                  return (
                    <div key={etapa.id} className="flex items-center gap-3">
                      <div
                        className={
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 " +
                          (concluida
                            ? "bg-green-600 text-white"
                            : "bg-zinc-200 text-zinc-400")
                        }
                      >
                        {concluida ? "✓" : i + 1}
                      </div>
                      <span
                        className={
                          atual
                            ? "font-bold"
                            : concluida
                            ? "text-zinc-700"
                            : "text-zinc-400"
                        }
                      >
                        {etapa.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="border-t mt-6 pt-4">
              <p className="text-sm text-zinc-500 mb-2">
                {pedido.tipoEntrega === "ENTREGA"
                  ? "🛵 Entrega"
                  : "🏠 Retirada na loja"}
              </p>
              <ul className="text-sm text-zinc-700">
                {pedido.itens.map((item) => (
                  <li key={item.id} className="flex justify-between py-0.5">
                    <span>
                      {item.quantidade}x {item.nome}
                    </span>
                    <span>
                      {formatCurrency(item.precoUnitario * item.quantidade)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="font-bold text-right mt-2">
                Total: {formatCurrency(pedido.total)}
              </p>
            </div>

            <Link
              to="/"
              className="block text-center text-green-600 hover:underline mt-5"
            >
              Fazer novo pedido
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );
}
