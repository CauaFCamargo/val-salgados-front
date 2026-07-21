interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 mt-6">
      <div className="relative">
        <i className="fa fa-search absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar salgado..."
          className="w-full border-2 border-zinc-200 rounded-full py-3 pl-11 pr-4 outline-none focus:border-green-600 duration-200"
        />
      </div>
    </div>
  );
}
