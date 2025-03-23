'use client';
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/lib/schemas';

// Split into two contexts: one for IDs, one for product details
interface ComparisonIDsContextType {
  productIds: string[];
  addProduct: (productId: string) => void;
  removeProduct: (productId: string) => void;
  clearProducts: () => void;
  isInComparison: (productId: string) => boolean;
}

interface ComparisonProductsContextType {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
}

export const ComparisonIDsContext = createContext<ComparisonIDsContextType>({
  productIds: [],
  addProduct: () => {},
  removeProduct: () => {},
  clearProducts: () => {},
  isInComparison: () => false,
});

export const ComparisonProductsContext = createContext<ComparisonProductsContextType>({
  products: [],
  isLoading: false,
  error: null,
});

const MAX_COMPARISON_PRODUCTS = 4;
const STORAGE_KEY = 'comparisonProducts';

// Helper function to validate UUIDs
const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Provider for product IDs
export const ComparisonIDsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productIds, setProductIds] = useState<string[]>([]);
  // Use a state to track if we're in the browser
  const [hasMounted, setHasMounted] = useState(false);

  // Use useEffect to set hasMounted to true after the component mounts
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Only initialize from localStorage after component has mounted
  useEffect(() => {
    if (hasMounted && typeof window !== 'undefined') {
      try {
        const savedComparison = localStorage.getItem(STORAGE_KEY);
        if (savedComparison) {
          const parsedProducts = JSON.parse(savedComparison);
          if (Array.isArray(parsedProducts)) {
            // Validate each ID is a proper UUID
            const validIds = parsedProducts
              .filter(id => typeof id === 'string' && isValidUUID(id))
              .slice(0, MAX_COMPARISON_PRODUCTS);
            
            setProductIds(validIds);
          }
        }
      } catch (e) {
        console.error('Error parsing saved comparison data', e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [hasMounted]);

  // Save to localStorage when productIds change
  useEffect(() => {
    if (hasMounted && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds));
    }
  }, [productIds, hasMounted]);

  // Add product (memoized)
  const addProduct = useCallback((productId: string) => {
    // First decode the URL-encoded string
    const decodedId = decodeURIComponent(productId);
    
    // Handle comma-separated UUIDs by splitting and validating each
    if (decodedId.includes(',')) {
      const ids = decodedId.split(',');
      ids.forEach(id => {
        const trimmedId = id.trim();
        if (isValidUUID(trimmedId)) {
          setProductIds(prevProducts => {
            if (prevProducts.includes(trimmedId) || prevProducts.length >= MAX_COMPARISON_PRODUCTS) {
              return prevProducts;
            }
            return [...prevProducts, trimmedId];
          });
        } else {
          console.error('Invalid UUID format in comma-separated list:', trimmedId);
        }
      });
      return;
    }
    
    // Original single UUID validation
    if (!isValidUUID(decodedId)) {
      console.error('Invalid UUID format:', decodedId);
      return;
    }
    
    setProductIds(prevProducts => {
      // Return same array if no change to prevent unnecessary rerenders
      if (prevProducts.includes(decodedId)) {
        console.log('Product already in comparison:', decodedId);
        return prevProducts;
      }
      if (prevProducts.length >= MAX_COMPARISON_PRODUCTS) {
        console.log('Maximum products reached');
        return prevProducts;
      }
      console.log('Adding product to comparison:', decodedId);
      return [...prevProducts, decodedId];
    });
  }, []);

  // Remove product (memoized)
  const removeProduct = useCallback((productId: string) => {
    console.log('Removing product from comparison:', productId);
    setProductIds(prevProducts => {
      const newProducts = prevProducts.filter(id => id !== productId);
      // Return same array if no change
      return prevProducts.length === newProducts.length ? prevProducts : newProducts;
    });
  }, []);

  // Clear all products (memoized)
  const clearProducts = useCallback(() => {
    console.log('Clearing all products from comparison');
    setProductIds([]);
  }, []);

  // Check if a product is in comparison (memoized)
  const isInComparison = useCallback((productId: string) => {
    return productIds.includes(productId);
  }, [productIds]);

  // Memoize context value to prevent unnecessary rerenders
  const contextValue = useMemo(() => ({
    productIds,
    addProduct,
    removeProduct,
    clearProducts,
    isInComparison,
  }), [productIds, addProduct, removeProduct, clearProducts, isInComparison]);

  return (
    <ComparisonIDsContext.Provider value={contextValue}>
      {children}
    </ComparisonIDsContext.Provider>
  );
};

// Provider for product details
export const ComparisonProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { productIds } = useComparison();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [cachedProductDetails, setCachedProductDetails] = useState<Record<string, Product>>({});

  // Use useEffect to set hasMounted to true after the component mounts
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Fetch product details when IDs change
  useEffect(() => {
    if (!hasMounted || productIds.length === 0) {
      setProducts([]);
      return;
    }
    
    // First check which products we already have cached
    const productsToFetch = productIds.filter(id => !cachedProductDetails[id]);
    
    // If all products are already cached, use the cache
    if (productsToFetch.length === 0) {
      const orderedProducts = productIds
        .map(id => cachedProductDetails[id])
        .filter(Boolean) as Product[];
      
      setProducts(orderedProducts);
      return;
    }
    
    // Otherwise fetch the missing products
    setIsLoading(true);
    setError(null);
    
    const fetchProducts = async () => {
      try {
        const validProductIds = productIds.filter(id => typeof id === 'string' && isValidUUID(id));
        
        if (validProductIds.length === 0) {
          setProducts([]);
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('products')
          .select(`
            id, name, brand, image_url, 
            serving_size, servings_per_container,
            nutritional_info: nutritional_info(*),
            value_metrics: product_value_metrics(*),
            features: product_features(*),
            dietary_info: dietary_info(*),
            amino_profile: amino_profiles(*)
          `)
          .in('id', validProductIds);
    
        if (error) throw new Error(`Error fetching products: ${error.message}`);
    
        // Update cache with fetched products
        const newCache = { ...cachedProductDetails };
        data?.forEach(product => { newCache[product.id] = product as Product; });
        setCachedProductDetails(newCache);
    
        // Maintain order of products as in the productIds array
        const orderedProducts = productIds.map(id => newCache[id]).filter(Boolean) as Product[];
        setProducts(orderedProducts);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching products'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [productIds, hasMounted, cachedProductDetails]);

  // Memoize context value
  const contextValue = useMemo(() => ({
    products,
    isLoading,
    error
  }), [products, isLoading, error]);

  return (
    <ComparisonProductsContext.Provider value={contextValue}>
      {children}
    </ComparisonProductsContext.Provider>
  );
};

// Combined provider
export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ComparisonIDsProvider>
      <ComparisonProductsProvider>
        {children}
      </ComparisonProductsProvider>
    </ComparisonIDsProvider>
  );
};

// Custom hooks
export const useComparison = () => useContext(ComparisonIDsContext);
export const useComparisonProducts = () => useContext(ComparisonProductsContext);