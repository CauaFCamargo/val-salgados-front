import { formatCurrency } from "../utils/format";
import type { Product } from "../types";

interface ProductRowProps {
  product: Product;
  onAdd: (product: Product) => void;
  // Quantas unidades deste produto já estão no carrinho (0 = nenhuma).
  quantidade: number;
}

export default function ProductRow({
  product,
  onAdd,
  quantidade,
}: ProductRowProps) {
  const { name, description, price, image, emoji } = product;
  const noCarrinho = quantidade > 0;

  return (
    <div className="flex gap-2 py-4 border-b border-zinc-100">
      {/* `relative` serve de âncora pro selo posicionado no canto da foto. */}
      <div className="relative w-28 h-28 shrink-0">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-28 h-28 rounded-md object-cover duration-300 hover:scale-110 hover:-rotate-2"
          />
        ) : (
          <div
            className="w-28 h-28 rounded-md flex items-center justify-center text-5xl duration-300 hover:scale-110 hover:-rotate-2"
            style={{ background: "#fdf1dc" }}
          >
            {emoji}
          </div>
        )}

        {/* Selo com a quantidade no carrinho. Só aparece quando há pelo menos
            1 unidade, pra não poluir o cardápio inteiro com "0". */}
        {noCarrinho && (
          <span
            className="absolute -top-1 -right-1 min-w-[26px] h-[26px] px-1 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center shadow"
            aria-label={`${quantidade} no carrinho`}
          >
            {quantidade}
          </span>
        )}
      </div>

      <div className="w-full">
        <p className="font-bold">{name}</p>
        <p className="text-sm">{description}</p>
        <div className="flex items-center gap-2 justify-between mt-3">
          <p className="font-bold text-lg">{formatCurrency(price)}</p>
          <button
            onClick={() => onAdd(product)}
            className="bg-gray-900 hover:bg-gray-800 px-5 py-2 rounded duration-200"
            aria-label={`Adicionar ${name}`}
          >
            <i className="fa fa-cart-plus text-lg text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
