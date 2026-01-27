"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";

interface CartContextData {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextData | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

function addToCart(product: Product) {
  setItems((prev) => {
    const itemExists = prev.find(item => item.id === product.id);

    let updatedCart: CartItem[];

    if (itemExists) {
      updatedCart = prev.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...prev, { ...product, quantity: 1 }];
    }


    return updatedCart;
  });
}


  function removeFromCart(id: number) {
    setItems(prev => prev.filter(item => item.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
