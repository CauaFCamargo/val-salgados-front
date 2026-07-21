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
        <h2 className="font-bold text-2xl">Pedido #{numero} criado!</h2>
        <p className="text-zinc-600 mt-2">
          Falta um passo: envie o pedido pra gente pelo WhatsApp pra confirmar.
        </p>

        {/* <a> em vez de window.open: clique = gesto real do usuário, não é
            bloqueado como popup. target/rel: abre em nova aba com segurança. */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-3 rounded-lg duration-200 w-full"
        >
          <i className="fa-brands fa-whatsapp text-xl" />
          Enviar pelo WhatsApp
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
