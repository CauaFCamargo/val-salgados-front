import { Link } from "react-router-dom";

interface OrderSuccessModalProps {
  numero: number | null;
  whatsappUrl: string | null;
  onClose: () => void;
}

export default function OrderSuccessModal({
  numero,
  whatsappUrl,
  onClose,
}: OrderSuccessModalProps) {
  // Só aparece quando existe um pedido recém-criado.
  if (numero === null || whatsappUrl === null) return null;

  return (
    <div
      className="bg-black/60 w-full h-full fixed top-0 left-0 z-[99] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-md w-full max-w-md text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl mb-2">✅</div>
        <h2 className="font-bold text-2xl">Pedido #{numero} confirmado!</h2>
        <p className="text-zinc-600 mt-2">
          Seu pedido foi registrado. Acompanhe o preparo pelo link abaixo — ele é
          só seu, pode salvar pra ver o status quando quiser.
        </p>

        {/* Confirmação do CLIENTE: link pessoal pra acompanhar o pedido.
            Link (react-router) navega sem recarregar a página inteira.
            onClose zera o pedido recém-criado antes de sair da Home. */}
        <Link
          to={`/pedido/${numero}`}
          onClick={onClose}
          className="mt-5 inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold px-5 py-3 rounded-lg duration-200 w-full"
        >
          <i className="fa fa-location-arrow text-lg" />
          Acompanhar meu pedido
        </Link>

        {/* Caminho INVERSO: é assim que a LOJA recebe o pedido. O cliente
            precisa tocar em "enviar" no WhatsApp (regra da plataforma).
            <a> em vez de window.open: clique = gesto real, não é bloqueado. */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-3 rounded-lg duration-200 w-full"
        >
          <i className="fa-brands fa-whatsapp text-xl" />
          Enviar o pedido pra loja no WhatsApp
        </a>

        <button
          onClick={onClose}
          className="mt-3 text-zinc-500 hover:text-zinc-700 w-full"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
