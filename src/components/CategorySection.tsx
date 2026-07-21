import ProductRow from "./ProductRow";
import type { Category, Product } from "../types";

interface CategorySectionProps {
  category: Category;
  products: Product[];
  onAdd: (product: Product) => void;
  quantidades: Record<string, number>;
}

export default function CategorySection({
  category,
  products,
  onAdd,
  quantidades,
}: CategorySectionProps) {
  if (products.length === 0) return null;

  return (
    <section id={`sec-${category.id}`} className="pt-8 scroll-mt-16">
      <h2 className="font-bold text-3xl">{category.label}</h2>
      <div className="mt-2">
        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            onAdd={onAdd}
            quantidade={quantidades[product.id] ?? 0}
          />
        ))}
      </div>
    </section>
  );
}
