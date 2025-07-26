// context/context.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { ComparisonProductData } from '@/lib/hooks';

type RawSupabaseViewProduct = ComparisonProductData;

interface ComparisonContextType {
  productIds: string[];
  addProduct: (productIdOrIdsString: string) => void;
  removeProduct: (productId: string) => void;
  clearProducts: () => void;
  isInComparison: (productId: string) => boolean;
  products: ComparisonProductData[];
  isLoading: boolean;
  error: PostgrestError | Error | null;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);
const MAX_COMPARISON_PRODUCTS = 4;
const STORAGE_KEY = 'comparisonProducts';

const isValidUUID = (id: string): boolean => {
  if (!id || typeof id !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

interface ComparisonProviderProps {
  children: ReactNode;
  initialProducts?: ComparisonProductData[];
}

export const ComparisonProvider: React.FC<ComparisonProviderProps> = ({
  children,
  initialProducts = [],
}) => {
  const [productIds, setProductIds] = useState<string[]>(() => initialProducts.map((p) => p.id));
  const [products, setProducts] = useState<ComparisonProductData[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<PostgrestError | Error | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (initialProducts.length === 0) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setProductIds(parsed.filter((id): id is string => typeof id === 'string' && isValidUUID(id)).slice(0, MAX_COMPARISON_PRODUCTS));
          }
        }
      } catch (e) {
        console.error('localStorage parse error', e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [initialProducts.length]);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds));
    }
  }, [productIds, hasMounted]);

  useEffect(() => {
    if (!hasMounted) return;
    const initialIdsSet = new Set(initialProducts.map(p => p.id));
    if (productIds.length === initialIdsSet.size && productIds.every(id => initialIdsSet.has(id))) {
      return;
    }

    let isCancelled = false;
    const fetchProducts = async () => {
      if (productIds.length === 0) {
        setProducts([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: viewError } = await supabase.from('v_product_comparison_details').select('*').in('id', productIds).returns<RawSupabaseViewProduct[]>();
        if (isCancelled) return;
        if (viewError) throw viewError;
        const orderedProducts = productIds.map((id) => data?.find((p) => p.id === id)).filter(Boolean) as ComparisonProductData[];
        setProducts(orderedProducts);
      } catch (err: unknown) {
        if (isCancelled) return;
        setError(err instanceof Error ? err : new Error('Unknown fetch error'));
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };
    fetchProducts();
    return () => { isCancelled = true; };
  }, [productIds, hasMounted, initialProducts]);

  const addProduct = useCallback((productIdOrIdsString: string) => {
    const decodedString = decodeURIComponent(productIdOrIdsString);
    const idsToAdd = decodedString.split(',').map(id => id.trim()).filter(isValidUUID);
    if (idsToAdd.length === 0) return;
    setProductIds((prevIds) => {
      const newUniqueIds = idsToAdd.filter(id => !prevIds.includes(id));
      if (newUniqueIds.length === 0) return prevIds;
      return [...prevIds, ...newUniqueIds].slice(0, MAX_COMPARISON_PRODUCTS);
    });
  }, []);

  const removeProduct = useCallback((productId: string) => {
    setProductIds((prevIds) => prevIds.filter((id) => id !== productId));
  }, []);

  const clearProducts = useCallback(() => setProductIds([]), []);
  const isInComparison = useCallback((productId: string) => productIds.includes(productId), [productIds]);

  const contextValue = useMemo(() => ({
    productIds, addProduct, removeProduct, clearProducts, isInComparison, products, isLoading, error,
  }), [productIds, addProduct, removeProduct, clearProducts, isInComparison, products, isLoading, error]);

  return <ComparisonContext.Provider value={contextValue}>{children}</ComparisonContext.Provider>;
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) throw new Error('useComparison must be used within a ComparisonProvider');
  return context;
};

export const useComparisonProducts = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) throw new Error('useComparisonProducts must be used within a ComparisonProvider');
  return {
    products: context.products,
    isLoading: context.isLoading,
    error: context.error,
  };
};