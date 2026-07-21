import { CATEGORIES } from "../data/categories";

interface CategoryNavProps {
  activeId: string;
  onSelect: (id: string) => void;
}

export default function CategoryNav({ activeId, onSelect }: CategoryNavProps) {
  const chips = [{ id: "topo", label: "Topo" }, ...CATEGORIES];

  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-zinc-200 mt-6">
      <div className="mx-auto max-w-3xl px-2">
        <div className="flex gap-2 overflow-x-auto py-3">
          {chips.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={
                "shrink-0 px-4 py-1.5 rounded-full text-sm font-medium duration-200 " +
                (activeId === c.id
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200")
              }
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
