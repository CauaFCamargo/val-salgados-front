import { useState, useMemo, useEffect } from "react";
import { criarPedido } from "./services/api";
import { PRODUCTS } from "./data/products";
import { CATEGORIES } from "./data/categories";
import { useCart } from "./hooks/useCart";
import { useToast } from "./hooks/useToast";
import type { Product } from "./types";
import type { DadosCheckout } from "./components/CartModal";

import Header from "./components/Header";
import WelcomeBanner from "./components/WelcomeBanner";
import SearchBar from "./components/SearchBar";
import CategoryNav from "./components/CategoryNav";
import Menu from "./components/Menu";
import CartFooter from "./components/CartFooter";
import CartModal from "./components/CartModal";
import OrderSuccessModal from "./components/OrderSuccessModal";
import Toast from "./components/Toast";

export default function App() {
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeId, setActiveId] = useState("topo");
  // Pedido recém-criado (dispara o modal de sucesso com o botão do WhatsApp).
  const [pedidoCriado, setPedidoCriado] = useState<{
    numero: number;
    whatsappUrl: string;
  } | null>(null);

  const { items, count, total, addItem, incrementItem, decrementItem, clearCart } =
    useCart();
  const { message, showToast } = useToast();

  // Filtra os produtos pela busca (memoizado para não refiltrar à toa).
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS;
    return PRODUCTS.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

  // Scroll-spy: destaca a categoria da seção que está visível na tela.
  useEffect(() => {
    const sections = CATEGORIES.map((c) =>
      document.getElementById(`sec-${c.id}`)
    ).filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id.replace("sec-", ""));
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [filtered]);

  const handleAdd = (product: Product) => {
    addItem(product);
    showToast(`${product.name} adicionado!`);
  };

  const handleNavigate = (id: string) => {
    setActiveId(id);
    if (id === "topo") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document
      .getElementById(`sec-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Recebe os dados do modal e junta com os itens do carrinho pra criar o pedido.
  const handleCheckout = async (dados: DadosCheckout) => {
    try {
      const pedido = await criarPedido({
        ...dados,
        itens: items.map((item) => ({
          nome: item.name,
          quantidade: item.qty,
          precoUnitario: item.price,
        })),
      });

      setModalOpen(false);
      clearCart(); // esvazia o carrinho depois de enviar
      // Guarda o pedido pra abrir o modal de sucesso com o link do WhatsApp.
      setPedidoCriado({ numero: pedido.numero, whatsappUrl: pedido.whatsappUrl });
    } catch (erro) {
      const msg =
        erro instanceof Error ? erro.message : "Não foi possível enviar o pedido.";
      showToast(`Ops! ${msg}`);
    }
  };

  return (
    <>
      <Header />
      <WelcomeBanner />
      <SearchBar value={query} onChange={setQuery} />
      <CategoryNav activeId={activeId} onSelect={handleNavigate} />
      <Menu products={filtered} query={query} onAdd={handleAdd} />
      <CartFooter count={count} onOpen={() => setModalOpen(true)} />
      <CartModal
        open={modalOpen}
        items={items}
        total={total}
        onClose={() => setModalOpen(false)}
        onIncrement={incrementItem}
        onDecrement={decrementItem}
        onCheckout={handleCheckout}
      />
      <OrderSuccessModal
        numero={pedidoCriado?.numero ?? null}
        whatsappUrl={pedidoCriado?.whatsappUrl ?? null}
        onClose={() => setPedidoCriado(null)}
      />
      <Toast message={message} />
    </>
  );
}
