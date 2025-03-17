'use client';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface ComparisonContextType {
  products: string[];
  addProduct: (productId: string) => void;
  removeProduct: (productId: string) => void;
  clearProducts: () => void;
  isInComparison: (productId: string) => boolean;
}

export const ComparisonContext = createContext<ComparisonContextType>({
  products: [],
  addProduct: () => {},
  removeProduct: () => {},
  clearProducts: () => {},
  isInComparison: () => false,
});

const MAX_COMPARISON_PRODUCTS = 4;
const STORAGE_KEY = 'comparisonProducts';

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<string[]>([]);
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    setIsClientSide(true);
    try {
      const savedComparison = localStorage.getItem(STORAGE_KEY);
      if (savedComparison) {
        const parsedProducts = JSON.parse(savedComparison);
        if (Array.isArray(parsedProducts)) {
          setProducts(parsedProducts.slice(0, MAX_COMPARISON_PRODUCTS));
        }
      }
    } catch (e) {
      console.error('Error parsing saved comparison data', e);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (isClientSide && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
  }, [products, isClientSide]);

  const addProduct = useCallback((productId: string) => {
    setProducts(prevProducts => {
      if (prevProducts.includes(productId)) {
        console.log('Product already in comparison:', productId);
        return prevProducts;
      }
      if (prevProducts.length >= MAX_COMPARISON_PRODUCTS) {
        console.log('Maximum products reached');
        return prevProducts;
      }
      console.log('Adding product to comparison:', productId);
      return [...prevProducts, productId];
    });
  }, []);

  const removeProduct = useCallback((productId: string) => {
    console.log('Removing product from comparison:', productId);
    setProducts(prevProducts => prevProducts.filter(id => id !== productId));
  }, []);

  const clearProducts = useCallback(() => {
    console.log('Clearing all products from comparison');
    setProducts([]);
  }, []);

  const isInComparison = useCallback((productId: string) => {
    return products.includes(productId);
  }, [products]);

  const contextValue = {
    products,
    addProduct,
    removeProduct,
    clearProducts,
    isInComparison,
  };

  return (
    <ComparisonContext.Provider value={contextValue}>
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => useContext(ComparisonContext);
