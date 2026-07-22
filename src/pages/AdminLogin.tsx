import { useState } from "react";
import { login } from "../services/api";

interface AdminLoginProps {
  onLogin: (token: string) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // evita o form recarregar a página
    setErro("");
    setCarregando(true);
    try {
      const token = await login(usuario, senha);
      onLogin(token);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao entrar");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-center">Painel do Val</h1>
        <p className="text-center text-zinc-500 text-sm mt-1">
          Acesso restrito à administração
        </p>

        <label className="block font-medium mt-5">Usuário</label>
        <input
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="w-full border-2 p-2 rounded mt-1 outline-none focus:border-green-600"
          autoFocus
        />

        <label className="block font-medium mt-3">Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full border-2 p-2 rounded mt-1 outline-none focus:border-green-600"
        />

        {erro && <p className="text-red-500 text-sm mt-3">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-2 rounded mt-5 duration-200"
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
