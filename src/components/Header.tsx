import { useState } from "react";
import logo from "../assets/valsalgadoslogo.png";
import fundo from "../assets/fundo.png";
import { LOJA, linkWhatsappSuporte } from "../config/loja";

export default function Header() {
  // Feedback curto do "Compartilhar" quando caímos no plano B (copiar link).
  const [copiado, setCopiado] = useState(false);

  async function compartilhar() {
    const url = window.location.origin;
    const dados = {
      title: LOJA.nome,
      text: `Olha o cardápio da ${LOJA.nome}!`,
      url,
    };

    // navigator.share é o menu nativo de compartilhar (WhatsApp, Instagram,
    // etc.). Existe na maioria dos celulares, mas quase não existe no
    // computador — por isso o plano B de copiar o link.
    if (navigator.share) {
      try {
        await navigator.share(dados);
      } catch {
        // A pessoa fechou o menu de compartilhar. Não é erro, ignoramos.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Alguns navegadores bloqueiam a área de transferência sem HTTPS.
    }
  }

  const botaoCanto =
    "inline-flex items-center gap-1.5 bg-black/45 hover:bg-black/65 " +
    "text-white text-sm font-medium px-3 py-1.5 rounded-lg duration-200 " +
    "backdrop-blur-sm";

  return (
    <header
      // `relative` ancora os botões nos cantos.
      className="relative w-full h-[420px] bg-zinc-900 bg-cover bg-center"
      style={{ backgroundImage: `url(${fundo})` }}
    >
      {/* Canto superior esquerdo: suporte. Discreto de propósito — o pedido é
          feito aqui no site; o WhatsApp é só pra tirar dúvida. */}
      <a
        href={linkWhatsappSuporte()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a loja no WhatsApp"
        className={`absolute top-3 left-3 z-10 ${botaoCanto}`}
      >
        <i className="fa-brands fa-whatsapp text-base" />
        Fale com a loja
      </a>

      {/* Canto superior direito: compartilhar o cardápio. */}
      <button
        type="button"
        onClick={compartilhar}
        aria-label="Compartilhar o cardápio"
        className={`absolute top-3 right-3 z-10 ${botaoCanto}`}
      >
        <i className="fa fa-share-nodes text-base" />
        {copiado ? "Link copiado!" : "Compartilhar"}
      </button>

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
      </div>
    </header>
  );
}
