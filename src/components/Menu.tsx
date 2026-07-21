import { CATEGORIES } from "../data/categories";
import CategorySection from "./CategorySection";
import type { Product } from "../types";

interface MenuProps {
  products: Product[];
  query: string;
  onAdd: (product: Product) => void;
}

export default function Menu({ products, query, onAdd }: MenuProps) {
  const isEmpty = products.length === 0;

  return (
    <main className="mx-auto max-w-3xl px-4 pb-8">
      {isEmpty ? (
        <p className="text-center text-zinc-500 py-16">
          Nenhum salgado encontrado para “{query}”.
        </p>
      ) : (
        CATEGORIES.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            products={products.filter((p) => p.category === category.id)}
            onAdd={onAdd}
          />
        ))
      )}
    </main>
  );
}
