interface CartFooterProps {
  count: number;
  onOpen: () => void;
}

export default function CartFooter({ count, onOpen }: CartFooterProps) {
  return (
    <footer className="w-full bg-red-500 py-2 fixed bottom-0 left-0 z-40 flex items-center justify-center">
      <button
        onClick={onOpen}
        className="flex items-center gap-2 text-white font-bold"
      >
        (<span>{count}</span>)
        Veja meu carrinho
        <i className="fa fa-cart-plus text-lg text-white" />
      </button>
    </footer>
  );
}
