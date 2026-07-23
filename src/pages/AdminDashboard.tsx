import { useCallback, useEffect, useMemo, useState } from "react";
import {
  listarPedidos,
  atualizarStatus,
  definirFilaImpressao,
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
  RECEBIDO: "PRONTO",
  PRONTO: "ENTREGUE",
  // Legado: a etapa "Em produção" foi removida do fluxo, mas pedidos que já
  // estavam nela precisam continuar avançando normalmente.
  EM_PRODUCAO: "PRONTO",
};

// Rótulos e cores amigáveis pra cada status.
const STATUS_INFO: Record<string, { label: string; cor: string }> = {
  RECEBIDO: { label: "Recebido", cor: "bg-blue-100 text-blue-700" },
  PRONTO: { label: "Pronto", cor: "bg-green-100 text-green-700" },
  ENTREGUE: { label: "Entregue", cor: "bg-zinc-200 text-zinc-600" },
  CANCELADO: { label: "Cancelado", cor: "bg-red-100 text-red-700" },
  // Legado: mantido só pra pedidos antigos continuarem exibindo um rótulo
  // legível. Nenhum pedido novo entra nesse status.
  EM_PRODUCAO: { label: "Em produção", cor: "bg-amber-100 text-amber-700" },
};

// Status que ainda exigem ação do Val (aparecem no card "Pendentes").
// EM_PRODUCAO entra pelo mesmo motivo legado acima.
const PENDENTES = ["RECEBIDO", "EM_PRODUCAO"];

// Monta o endereço numa linha legível: "Rua X, 123 · Centro - Sorocaba (Apto 4)".
// `filter(Boolean)` descarta os campos vazios, então pedidos antigos (feitos
// antes dos campos separados existirem) continuam aparecendo direito.
function formatarEndereco(pedido: Pedido): string {
  const ruaNumero = [pedido.endereco, pedido.numeroEndereco]
    .filter(Boolean)
    .join(", ");
  const bairroCidade = [pedido.bairro, pedido.cidade].filter(Boolean).join(" - ");
  const base = [ruaNumero, bairroCidade, pedido.cep].filter(Boolean).join(" · ");
  return pedido.complemento ? `${base} (${pedido.complemento})` : base || "-";
}

function formatarHora(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Converte uma data ISO no "dia" dela (YYYY-MM-DD) no fuso LOCAL.
// Cuidado importante: usar toISOString() aqui daria o dia em UTC, e um pedido
// feito às 21h no Brasil cairia no dia seguinte. Por isso montamos na mão.
function diaLocal(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export default function AdminDashboard({ token, onLogout }: AdminDashboardProps) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  // Filtro de data: começa no dia de hoje. `verTodos` ignora o filtro.
  const [dia, setDia] = useState(() => diaLocal(new Date()));
  const [verTodos, setVerTodos] = useState(false);

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

  // Lista já filtrada pelo dia escolhido. useMemo evita refazer o filtro a
  // cada render — só recalcula quando os pedidos ou o filtro mudam.
  const visiveis = useMemo(() => {
    if (verTodos) return pedidos;
    return pedidos.filter((p) => diaLocal(new Date(p.criadoEm)) === dia);
  }, [pedidos, dia, verTodos]);

  // Os números do topo, calculados sempre em cima do que está visível.
  const resumo = useMemo(
    () => ({
      quantidade: visiveis.length,
      pendentes: visiveis.filter((p) => PENDENTES.includes(p.status)).length,
      naFila: visiveis.filter((p) => p.filaCliente || p.filaLoja).length,
    }),
    [visiveis]
  );

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

  // Imprimir NÃO imprime a partir do navegador — ele não enxerga a impressora
  // da loja. A gente só põe a via escolhida na fila; o agente local, que fica
  // consultando a API, imprime no próximo ciclo e dá baixa sozinho.
  const enviarViaParaImpressao = async (pedido: Pedido, via: "cliente" | "loja") => {
    try {
      await definirFilaImpressao(token, pedido.id, { [via]: true });
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedido.id
            ? {
                ...p,
                filaCliente: via === "cliente" ? true : p.filaCliente,
                filaLoja: via === "loja" ? true : p.filaLoja,
              }
            : p
        )
      );
    } catch (err) {
      if (err instanceof SessaoExpiradaError) onLogout();
      else setErro("Não foi possível enviar a via pra impressão.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-xl">Painel de pedidos</h1>
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

          {/* Filtro por dia */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <label htmlFor="filtro-dia" className="text-sm text-zinc-600">
              Dia:
            </label>
            <input
              id="filtro-dia"
              type="date"
              value={dia}
              disabled={verTodos}
              onChange={(e) => setDia(e.target.value)}
              className="border-2 border-zinc-200 rounded px-2 py-1 text-sm disabled:opacity-50"
            />
            <button
              onClick={() => {
                setDia(diaLocal(new Date()));
                setVerTodos(false);
              }}
              className="text-sm border-2 border-zinc-200 hover:border-zinc-300 rounded px-3 py-1 duration-200"
            >
              Hoje
            </button>
            <button
              onClick={() => setVerTodos((v) => !v)}
              className={
                "text-sm rounded px-3 py-1 duration-200 border-2 " +
                (verTodos
                  ? "bg-gray-900 border-gray-900 text-white"
                  : "border-zinc-200 hover:border-zinc-300")
              }
            >
              Todos os dias
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5">
        {erro && <p className="text-red-500 mb-4">{erro}</p>}

        {/* Cards de resumo — sempre sobre o período selecionado */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white rounded-lg shadow-sm p-3">
            <p className="text-xs text-zinc-500">Pedidos</p>
            <p className="font-bold text-2xl">{resumo.quantidade}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3">
            <p className="text-xs text-zinc-500">Pendentes</p>
            <p className="font-bold text-2xl text-amber-600">
              {resumo.pendentes}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3">
            <p className="text-xs text-zinc-500">Na fila</p>
            <p className="font-bold text-2xl text-blue-700">
              {resumo.naFila}
            </p>
          </div>
        </div>

        {carregando ? (
          <p className="text-zinc-500 text-center py-10">Carregando...</p>
        ) : visiveis.length === 0 ? (
          <p className="text-zinc-500 text-center py-10">
            {verTodos
              ? "Nenhum pedido ainda. Assim que um cliente enviar, aparece aqui."
              : "Nenhum pedido nesse dia. Troque a data ou veja todos os dias."}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {visiveis.map((pedido) => {
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
                    <div className="flex items-center gap-2">
                      {/* Selo só quando alguma via está na fila (estado
                          transitório até o agente imprimir). Diz qual via. */}
                      {(pedido.filaCliente || pedido.filaLoja) && (
                        <span
                          className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700"
                          title="Na fila — o agente vai imprimir no próximo ciclo"
                        >
                          🖨️ Na fila
                          {pedido.filaCliente && pedido.filaLoja
                            ? " (2 vias)"
                            : pedido.filaCliente
                            ? " (cliente)"
                            : " (loja)"}
                        </span>
                      )}
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${info.cor}`}
                      >
                        {info.label}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 text-sm">
                    <p className="font-medium">
                      {pedido.clienteNome} · {pedido.telefone}
                    </p>
                    <p className="text-zinc-600">
                      {pedido.tipoEntrega === "ENTREGA"
                        ? `🛵 Entrega: ${formatarEndereco(pedido)}`
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
                    <div className="flex flex-wrap gap-2 justify-end">
                      {/* Impressão manual por via: um botão pra cada. Enquanto
                          a via está na fila, o botão fica desabilitado, pra não
                          pedir a mesma via duas vezes antes do agente pegar. */}
                      <button
                        onClick={() => enviarViaParaImpressao(pedido, "cliente")}
                        disabled={pedido.filaCliente}
                        className="text-sm border-2 border-zinc-200 hover:border-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed rounded px-3 py-1.5 duration-200"
                      >
                        {pedido.filaCliente ? "🖨️ Cliente…" : "🖨️ Via cliente"}
                      </button>
                      <button
                        onClick={() => enviarViaParaImpressao(pedido, "loja")}
                        disabled={pedido.filaLoja}
                        className="text-sm border-2 border-zinc-200 hover:border-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed rounded px-3 py-1.5 duration-200"
                      >
                        {pedido.filaLoja ? "🖨️ Loja…" : "🖨️ Via loja"}
                      </button>
                      {!finalizado && (
                        <>
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
                        </>
                      )}
                    </div>
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
