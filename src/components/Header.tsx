import logo from "../assets/valsalgadoslogo.png";
import fundo from "../assets/fundo.png";

export default function Header() {
  return (
    <header
      className="w-full h-[420px] bg-zinc-900 bg-cover bg-center"
      style={{ backgroundImage: `url(${fundo})` }}
    >
      <div className="w-full h-full flex flex-col justify-center items-center">
        <img
          src={logo}
          alt="Logo Val Salgados"
          className="w-32 h-32 rounded-full shadow-lg hover:scale-110 duration-200"
        />
        <h1 className="text-4xl mt-4 mb-2 font-bold text-white">Val Salgados</h1>
        <span className="text-white font-medium">
          Alameda Celidônio do Monte, 757 · Sorocaba - SP
        </span>
        <div className="bg-green-600 px-4 py-1 rounded-lg mt-5">
          <span className="text-white font-medium">Seg à Sáb - 08:00 as 18:00</span>
        </div>
      </div>
    </header>
  );
}
