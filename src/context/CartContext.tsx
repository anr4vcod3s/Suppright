'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';

interface CartContextProps {
  items: Product[];
  addItem: (item: Product) => void;
  removeItem: (id: string) => void;
  isCartFull: boolean;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<Product[]>(() => {
    // Load from localStorage on mount
    if (typeof window !== 'undefined') {
      const storedItems = localStorage.getItem('cart');
      return storedItems ? JSON.parse(storedItems) : [];
    }
    return [];
  });

  const isCartFull = items.length >= 4;

  const addItem = (item: Product) => {
    if (items.length < 4 && !items.find(i => i.id === item.id)) {
      const newItems = [...items, item];
      setItems(newItems);
      localStorage.setItem('cart', JSON.stringify(newItems)); // Save to localStorage
    }
  };

  const removeItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems)); // Update localStorage
  };

  // Sync state with localStorage on mount (for safety)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedItems = localStorage.getItem('cart');
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    }
  }, []);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, isCartFull }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
