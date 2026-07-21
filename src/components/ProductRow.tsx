import { formatCurrency } from "../utils/format";
import type { Product } from "../types";

interface ProductRowProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export default function ProductRow({ product, onAdd }: ProductRowProps) {
  const { name, description, price, image, emoji } = product;

  return (
    <div className="flex gap-2 py-4 border-b border-zinc-100">
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-28 h-28 shrink-0 rounded-md object-cover duration-300 hover:scale-110 hover:-rotate-2"
        />
      ) : (
        <div
          className="w-28 h-28 shrink-0 rounded-md flex items-center justify-center text-5xl duration-300 hover:scale-110 hover:-rotate-2"
          style={{ background: "#fdf1dc" }}
        >
          {emoji}
        </div>
      )}

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
