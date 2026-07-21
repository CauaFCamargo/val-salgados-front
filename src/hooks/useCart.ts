import { useReducer, useMemo, useCallback } from "react";
import type { CartItem, Product } from "../types";

// Estado do carrinho: um mapa { [id]: { id, name, price, qty } }.
// Usei useReducer (em vez de vários useState) porque as ações do carrinho
// — adicionar, incrementar, decrementar, limpar — são transições claras de
// um mesmo estado. Fica testável e fácil de evoluir.

type CartState = Record<string, CartItem>;

type CartAction =
  | { type: "ADD"; product: Product }
  | { type: "INCREMENT"; id: string }
  | { type: "DECREMENT"; id: string }
  | { type: "CLEAR" };

const initialState: CartState = {};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const { id, name, price } = action.product;
      const current = state[id];
      return {
        ...state,
        [id]: { id, name, price, qty: (current?.qty || 0) + 1 },
      };
    }
    case "INCREMENT":
      return {
        ...state,
        [action.id]: { ...state[action.id], qty: state[action.id].qty + 1 },
      };
    case "DECREMENT": {
      const qty = state[action.id].qty - 1;
      if (qty <= 0) {
        const next = { ...state };
        delete next[action.id];
        return next;
      }
      return { ...state, [action.id]: { ...state[action.id], qty } };
    }
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
}

export function useCart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const items = useMemo(() => Object.values(state), [state]);
  const count = useMemo(() => items.reduce((sum, it) => sum + it.qty, 0), [items]);
  const total = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  );

  const addItem = useCallback(
    (product: Product) => dispatch({ type: "ADD", product }),
    []
  );
  const incrementItem = useCallback(
    (id: string) => dispatch({ type: "INCREMENT", id }),
    []
  );
  const decrementItem = useCallback(
    (id: string) => dispatch({ type: "DECREMENT", id }),
    []
  );
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  return { items, count, total, addItem, incrementItem, decrementItem, clearCart };
}
