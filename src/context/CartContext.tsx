"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";

interface CartContextData {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  decreaseFromCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextData | undefined>(undefined);

const CART_STORAGE_KEY = "desenvolve-store-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Carregar carrinho do localStorage ao montar o componente
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        console.error("Erro ao carregar carrinho do localStorage");
      }
    }
    setIsMounted(true);
  }, []);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isMounted]);

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

  function decreaseFromCart(id: number) {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  }

  function removeFromCart(id: number) {
    setCart(prev => prev.filter(item => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, decreaseFromCart, removeFromCart, clearCart }}
    >
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
