export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
  emoji?: string;
}

export interface Category {
  id: string;
  label: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}
