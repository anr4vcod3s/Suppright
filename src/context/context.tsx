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

// The view returns data that matches this type, so we can use it directly.
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

const ComparisonContext = createContext<ComparisonContextType | undefined>(
  undefined
);
const MAX_COMPARISON_PRODUCTS = 4;
const STORAGE_KEY = 'comparisonProducts';

const isValidUUID = (id: string): boolean => {
  if (!id || typeof id !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
};

interface ComparisonProviderProps {
  children: ReactNode;
  initialProductIds?: string[];
}

export const ComparisonProvider: React.FC<ComparisonProviderProps> = ({
  children,
  initialProductIds,
}) => {
  const [productIds, setProductIds] = useState<string[]>(() => {
    if (initialProductIds && Array.isArray(initialProductIds)) {
      return initialProductIds
        .filter(isValidUUID)
        .slice(0, MAX_COMPARISON_PRODUCTS);
    }
    return [];
  });
  const [products, setProducts] = useState<ComparisonProductData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<PostgrestError | Error | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  // Effect to load initial IDs from localStorage on the client
  useEffect(() => {
    setHasMounted(true);
    if (
      !initialProductIds ||
      initialProductIds.length === 0
    ) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setProductIds(
              parsed
                .filter(
                  (id): id is string => typeof id === 'string' && isValidUUID(id)
                )
                .slice(0, MAX_COMPARISON_PRODUCTS)
            );
          }
        }
      } catch (e) {
        console.error('localStorage parse error for comparison products', e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [initialProductIds]);

  // Effect to save IDs to localStorage whenever they change
  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds));
    }
  }, [productIds, hasMounted]);

  // *** SIMPLIFIED AND CORRECTED FETCHING LOGIC ***
  useEffect(() => {
    if (!hasMounted) return;

    const fetchProducts = async () => {
      if (productIds.length === 0) {
        setProducts([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: viewError } = await supabase
          .from('v_product_comparison_details')
          .select('*')
          .in('id', productIds)
          .returns<RawSupabaseViewProduct[]>();

        if (viewError) throw viewError;

        // Order the results to match the order of productIds
        const orderedProducts = productIds
          .map((id) => data?.find((p) => p.id === id))
          .filter(Boolean) as ComparisonProductData[];

        setProducts(orderedProducts);
      } catch (err: unknown) {
        console.error('Error in fetchProducts:', err);
        if (err instanceof PostgrestError || err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('Unknown error fetching product details.'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [productIds, hasMounted]);

  const addProduct = useCallback((productIdOrIdsString: string) => {
    const decodedString = decodeURIComponent(productIdOrIdsString);
    let idsToAdd: string[] = [];
    if (decodedString.includes(',')) {
      idsToAdd = decodedString
        .split(',')
        .map((id) => id.trim())
        .filter(isValidUUID);
    } else if (isValidUUID(decodedString)) {
      idsToAdd = [decodedString];
    } else {
      return;
    }
    if (idsToAdd.length === 0) return;
    setProductIds((prevIds) => {
      const currentIdsSet = new Set(prevIds);
      const newUniqueIds = idsToAdd.filter((id) => !currentIdsSet.has(id));
      if (newUniqueIds.length === 0) return prevIds;
      const combinedIds = [...prevIds, ...newUniqueIds];
      return Array.from(new Set(combinedIds)).slice(0, MAX_COMPARISON_PRODUCTS);
    });
  }, []);

  const removeProduct = useCallback((productId: string) => {
    setProductIds((prevIds) => prevIds.filter((id) => id !== productId));
  }, []);

  const clearProducts = useCallback(() => {
    setProductIds([]);
  }, []);

  const isInComparison = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds]
  );

  const contextValue = useMemo(
    () => ({
      productIds,
      addProduct,
      removeProduct,
      clearProducts,
      isInComparison,
      products,
      isLoading,
      error,
    }),
    [
      productIds,
      addProduct,
      removeProduct,
      clearProducts,
      isInComparison,
      products,
      isLoading,
      error,
    ]
  );

  return (
    <ComparisonContext.Provider value={contextValue}>
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined)
    throw new Error('useComparison must be used within a ComparisonProvider');
  return {
    productIds: context.productIds,
    addProduct: context.addProduct,
    removeProduct: context.removeProduct,
    clearProducts: context.clearProducts,
    isInComparison: context.isInComparison,
  };
};

export const useComparisonProducts = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined)
    throw new Error(
      'useComparisonProducts must be used within a ComparisonProvider'
    );
  return {
    products: context.products,
    isLoading: context.isLoading,
    error: context.error,
  };
};