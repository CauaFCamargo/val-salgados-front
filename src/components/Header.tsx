import logo from "../assets/valsalgadoslogo.png";
import fundo from "../assets/fundo.png";
import { LOJA, linkWhatsappSuporte } from "../config/loja";

export default function Header() {
  return (
    <header
      className="w-full h-[420px] bg-zinc-900 bg-cover bg-center"
      style={{ backgroundImage: `url(${fundo})` }}
    >
      <div className="w-full h-full flex flex-col justify-center items-center">
        <img
          src={logo}
          alt={`Logo ${LOJA.nome}`}
          className="w-32 h-32 rounded-full shadow-lg hover:scale-110 duration-200"
        />
        <h1 className="text-4xl mt-4 mb-2 font-bold text-white">{LOJA.nome}</h1>
        <span className="text-white font-medium">{LOJA.endereco}</span>
        <div className="bg-green-600 px-4 py-1 rounded-lg mt-5">
          <span className="text-white font-medium">{LOJA.horario}</span>
        </div>

        {/* Suporte: abre a conversa com a loja no WhatsApp.
            target="_blank" + rel="noopener noreferrer" = abre em nova aba sem
            dar à outra página acesso a esta (boa prática de segurança). */}
        <a
          href={linkWhatsappSuporte()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar com a loja no WhatsApp"
          className="mt-3 inline-flex items-center gap-2 bg-white/95 hover:bg-white text-green-700 font-bold px-4 py-2 rounded-lg shadow duration-200 hover:scale-105"
        >
          <i className="fa-brands fa-whatsapp text-xl" />
          Falar com a loja
        </a>
      </div>
    </header>
  );
}
