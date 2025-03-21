import { useEffect, useMemo, useState } from 'react';
import { useComparison, useComparisonProducts } from '@/context/context';
import { supabase } from '@/lib/supabase/client';
import { Product, NutritionalInfo, ProductFeatures, DietaryInfo, ProductValueMetrics } from '@/lib/schemas';

export interface ComparisonProductData extends Product {
  nutritionalInfo?: NutritionalInfo;
  features?: ProductFeatures;
  dietaryInfo?: DietaryInfo;
  valueMetrics?: ProductValueMetrics;
}

// Error interface for serializable errors
export interface SerializableError {
  message: string;
  code?: string;
}

// Enhanced hook that fetches all required data for comparison
export const useComparisonData = () => {
  const { productIds, removeProduct, clearProducts } = useComparison();
  const { products, isLoading, error } = useComparisonProducts();
  
  const [detailedProducts, setDetailedProducts] = useState<ComparisonProductData[]>([]);
  const [isDetailedLoading, setIsDetailedLoading] = useState(false);
  const [detailedError, setDetailedError] = useState<SerializableError | null>(null);

  // Fetch detailed product information when basic products are loaded
  useEffect(() => {
    if (products.length === 0 || isLoading) {
      setDetailedProducts([]);
      return;
    }
    
    const fetchDetailedInfo = async () => {
      setIsDetailedLoading(true);
      setDetailedError(null);
      
      try {
        // Create an array to collect all data
        const enhancedProducts: ComparisonProductData[] = [...products];
        
        // Fetch nutritional info
        const { data: nutritionalData, error: nutritionalError } = await supabase
          .from('nutritional_info')
          .select('*')
          .in('product_id', productIds);
          
        if (nutritionalError) throw new Error(`Error fetching nutritional info: ${nutritionalError.message}`);
        
        // Fetch product features
        const { data: featuresData, error: featuresError } = await supabase
          .from('product_features')
          .select('*')
          .in('product_id', productIds);
          
        if (featuresError) throw new Error(`Error fetching product features: ${featuresError.message}`);
        
        // Fetch dietary info
        const { data: dietaryData, error: dietaryError } = await supabase
          .from('dietary_info')
          .select('*')
          .in('product_id', productIds);
          
        if (dietaryError) throw new Error(`Error fetching dietary info: ${dietaryError.message}`);
        
        // Fetch value metrics
        const { data: valueMetricsData, error: valueMetricsError } = await supabase
          .from('product_value_metrics')
          .select('*')
          .in('product_id', productIds);
          
        if (valueMetricsError) throw new Error(`Error fetching value metrics: ${valueMetricsError.message}`);
        
        // Map all data to respective products
        enhancedProducts.forEach((product, index) => {
          // Find related data for this product
          const nutritionalInfo = nutritionalData?.find(item => item.product_id === product.id) || undefined;
          const features = featuresData?.find(item => item.product_id === product.id) || undefined;
          const dietaryInfo = dietaryData?.find(item => item.product_id === product.id) || undefined;
          const valueMetrics = valueMetricsData?.find(item => item.product_id === product.id) || undefined;
          
          // Enhance the product with additional data
          enhancedProducts[index] = {
            ...product,
            nutritionalInfo,
            features,
            dietaryInfo,
            valueMetrics
          };
        });
        
        // Update state with enhanced products (maintaining order from productIds)
        const orderedDetailedProducts = productIds
          .map(id => enhancedProducts.find(product => product.id === id))
          .filter(Boolean) as ComparisonProductData[];
          
        setDetailedProducts(orderedDetailedProducts);
      } catch (err) {
        console.error('Error fetching detailed product info:', err);
        // Create a serializable error object instead of passing the Error instance
        setDetailedError({
          message: err instanceof Error ? err.message : 'Unknown error fetching detailed product info'
        });
      } finally {
        setIsDetailedLoading(false);
      }
    };
    
    fetchDetailedInfo();
  }, [products, productIds, isLoading]);
  
  // Calculate if the comparison can accept more products
  const canAddMore = useMemo(() => productIds.length < 4, [productIds.length]);
  
  // Return combined loading state
  const combinedLoading = isLoading || isDetailedLoading;
  
  // Create serializable error if needed
  const combinedError = error ? { message: error.message } : detailedError;
  
  return {
    products: detailedProducts,
    isLoading: combinedLoading,
    error: combinedError,
    removeProduct,
    clearProducts,
    canAddMore,
    productIds
  };
};