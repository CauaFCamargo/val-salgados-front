// -----------------------------------------------------------------------------
// Fotos dos produtos (jeito Vite: importa a imagem e usa a variável).
// Coloque os arquivos em src/assets/ com estes nomes. Para adicionar uma nova
// foto: (1) importe aqui em cima, (2) use no campo `image` do produto.
// Produtos sem foto usam `emoji` como reserva temporária.
//
// As fotos abaixo (exceto empadas/coxinha originais) são ilustrativas, de bancos
// de licença livre (Pexels — uso livre, sem atribuição). Troque pelas fotos reais
// da Val quando disponíveis.
// -----------------------------------------------------------------------------
import empadaFrango from "../assets/empadinhadefrango.png";
import empadaPalmito from "../assets/empadinhapalmito.png";
import coxinha from "../assets/coxinha.png";
import baguetePresunto from "../assets/baguete-presunto.jpg";
import bagueteFrango from "../assets/baguete-frango.jpg";
import burguerCheddar from "../assets/burguer-cheddar.jpg";
import burguerQueijo from "../assets/burguer-queijo.jpg";
import valDog from "../assets/val-dog.jpg";
import bauru from "../assets/bauru.jpg";
import esfihaFrango from "../assets/esfiha-frango.jpg";
import esfihaCarne from "../assets/esfiha-carne.jpg";
import trouxinhaCalabresa from "../assets/trouxinha-calabresa.jpg";
import trouxinhaQueijos from "../assets/trouxinha-queijos.jpg";
import paoPizzaAberto from "../assets/pao-pizza-aberto.jpg";
import paoPizzaFrango from "../assets/pao-pizza-frango.jpg";
import pastelaoCalabresa from "../assets/pastelao-calabresa.jpg";
import pastelaoFrango from "../assets/pastelao-frango.jpg";
import pastelaoPresunto from "../assets/pastelao-presunto.jpg";
import coxinhaSimples from "../assets/coxinha-simples.jpg";
import risolis from "../assets/risolis.jpg";
import bolinhoQueijo from "../assets/bolinho-queijo.jpg";
import bolinhoOvo from "../assets/bolinho-ovo.jpg";
import bolinhoCarne from "../assets/bolinho-carne.jpg";
import type { Product } from "../types";

// Cada produto tem um `id` estável (bom para keys do React e para o backend depois).
export const PRODUCTS: Product[] = [
  // Empadas
  {
    id: "empada-frango",
    name: "Empada de Frango",
    category: "empadas",
    price: 4.5,
    image: empadaFrango,
    description: "Massa amanteigada recheada com frango temperado da casa.",
  },
  {
    id: "empada-palmito",
    name: "Empada de Palmito",
    category: "empadas",
    price: 4.5,
    image: empadaPalmito,
    description: "Massa amanteigada com palmito cremoso e temperos frescos.",
  },

  // Baguetes
  {
    id: "baguete-presunto-queijo",
    name: "Baguete Presunto e Queijo",
    category: "baguetes",
    price: 4.0,
    image: baguetePresunto,
    description: "Baguete crocante com presunto e queijo derretido.",
  },
  {
    id: "baguete-frango-cheddar",
    name: "Baguete de Frango c/ Cheddar",
    category: "baguetes",
    price: 4.0,
    image: bagueteFrango,
    description: "Frango desfiado com cheddar cremoso na baguete tostada.",
  },

  // Lanches
  {
    id: "val-burguer-cheddar",
    name: "Val Burguer com Cheddar",
    category: "lanches",
    price: 4.0,
    image: burguerCheddar,
    description: "Hambúrguer artesanal com cheddar e pão macio.",
  },
  {
    id: "val-burguer-queijo",
    name: "Val Burguer com Queijo",
    category: "lanches",
    price: 4.0,
    image: burguerQueijo,
    description: "Hambúrguer artesanal com queijo prato derretido.",
  },
  {
    id: "val-dog-queijo",
    name: "Val Dog com Queijo",
    category: "lanches",
    price: 4.0,
    image: valDog,
    description: "Salsicha, queijo, molho e batata palha no pão macio.",
  },
  {
    id: "bauru-presunto-queijo",
    name: "Bauru Presunto/Queijo Fatiado",
    category: "lanches",
    price: 4.0,
    image: bauru,
    description: "Presunto e queijo fatiado com tomate no pão francês.",
  },

  // Esfihas
  {
    id: "esfiha-frango-catupiry",
    name: "Esfiha Frango com Catupiry",
    category: "esfihas",
    price: 4.0,
    image: esfihaFrango,
    description: "Esfiha assada de frango com catupiry cremoso.",
  },
  {
    id: "esfiha-carne-crua",
    name: "Esfiha de Carne Crua",
    category: "esfihas",
    price: 4.0,
    image: esfihaCarne,
    description: "Esfiha aberta de carne temperada estilo tradicional.",
  },

  // Trouxinhas
  {
    id: "trouxinha-calabresa-queijo",
    name: "Trouxinhas de Calabr. c/ Queijo",
    category: "trouxinhas",
    price: 4.0,
    image: trouxinhaCalabresa,
    description: "Massa fininha recheada com calabresa e queijo.",
  },
  {
    id: "trouxinha-queijos",
    name: "Trouxinhas Queijos",
    category: "trouxinhas",
    price: 4.0,
    image: trouxinhaQueijos,
    description: "Massa fininha recheada com mistura de queijos.",
  },

  // Pão de pizza
  {
    id: "pao-pizza-aberto",
    name: "Pão de Pizza Aberto",
    category: "pao-pizza",
    price: 4.0,
    image: paoPizzaAberto,
    description: "Pão macio coberto com molho, queijo e orégano.",
  },
  {
    id: "pao-pizza-frango",
    name: "Pão de Pizza Frango",
    category: "pao-pizza",
    price: 4.0,
    image: paoPizzaFrango,
    description: "Pão de pizza recheado com frango e queijo.",
  },

  // Pastelões
  {
    id: "pastelao-calabresa-cheddar",
    name: "Pastelão de Calabresa c/ Cheddar",
    category: "pasteloes",
    price: 4.0,
    image: pastelaoCalabresa,
    description: "Pastelão grande com calabresa e cheddar.",
  },
  {
    id: "pastelao-frango-catupiry",
    name: "Pastelão de Frango c/ Catupiry",
    category: "pasteloes",
    price: 4.0,
    image: pastelaoFrango,
    description: "Pastelão grande de frango com catupiry.",
  },
  {
    id: "pastelao-presunto-queijo",
    name: "Pastelão de Presunto e Queijo",
    category: "pasteloes",
    price: 4.0,
    image: pastelaoPresunto,
    description: "Pastelão grande com presunto e queijo.",
  },

  // Salgados fritos
  {
    id: "coxinha-catupiry",
    name: "Coxinha c/ Catupiry",
    category: "fritos",
    price: 4.0,
    image: coxinha,
    description: "Coxinha de frango cremosa com catupiry.",
  },
  {
    id: "coxinha-simples",
    name: "Coxinha Simples/Marguerita",
    category: "fritos",
    price: 4.0,
    image: coxinhaSimples,
    description: "Coxinha tradicional de frango, sequinha e crocante.",
  },
  {
    id: "risolis-presunto-queijo",
    name: "Risólis Presunto/Queijo",
    category: "fritos",
    price: 4.0,
    image: risolis,
    description: "Risoles crocante de presunto e queijo.",
  },
  {
    id: "bolinho-queijo",
    name: "Bolinho de Queijo",
    category: "fritos",
    price: 4.0,
    image: bolinhoQueijo,
    description: "Bolinho frito recheado com queijo derretido.",
  },
  {
    id: "bolinho-ovo-carne",
    name: "Bolinho de Ovo c/ Carne Moída",
    category: "fritos",
    price: 4.0,
    image: bolinhoOvo,
    description: "Bolinho de ovo com carne moída temperada.",
  },
  {
    id: "bolinho-carne",
    name: "Bolinho de Carne",
    category: "fritos",
    price: 4.0,
    image: bolinhoCarne,
    description: "Bolinho frito recheado com carne temperada.",
  },
];
