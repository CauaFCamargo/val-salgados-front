import { useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import { pegarToken, salvarToken, limparToken } from "../services/auth";

// Página do /admin. Sem token → mostra o login. Com token → mostra o dashboard.
// O token começa lendo o localStorage, então a Val continua logada ao recarregar.
export default function AdminPage() {
  const [token, setToken] = useState<string | null>(pegarToken());

  const handleLogin = (novoToken: string) => {
    salvarToken(novoToken);
    setToken(novoToken);
  };

  const handleLogout = () => {
    limparToken();
    setToken(null);
  };

  if (!token) return <AdminLogin onLogin={handleLogin} />;
  return <AdminDashboard token={token} onLogout={handleLogout} />;
}
