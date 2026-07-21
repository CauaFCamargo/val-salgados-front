import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import AdminPage from "./pages/AdminPage";
import OrderStatus from "./pages/OrderStatus";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Loja do cliente (público) */}
        <Route path="/" element={<App />} />
        {/* Painel da Val (login + dashboard) */}
        <Route path="/admin" element={<AdminPage />} />
        {/* Acompanhamento público do pedido */}
        {/* O parâmetro é o TOKEN do pedido, não o número: o número é
            sequencial e permitiria abrir o pedido de qualquer pessoa. */}
        <Route path="/pedido/:token" element={<OrderStatus />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
