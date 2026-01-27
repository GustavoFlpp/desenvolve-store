"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";

interface CartContextData {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}


const CartContext = createContext<CartContextData | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

function addToCart(product: Product) {
  setCart(prev => {
    const itemExists = prev.find(item => item.id === product.id);

    if (itemExists) {
      return prev.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [...prev, { ...product, quantity: 1 }];
  });
}

function removeFromCart(id: number) {
  setCart(prev => prev.filter(item => item.id !== id));
}

function clearCart() {
  setCart([]);
}


  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
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
