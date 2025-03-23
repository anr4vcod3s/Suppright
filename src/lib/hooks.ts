import { useEffect, useMemo, useState } from 'react';
import { useComparison, useComparisonProducts } from '@/context/context';
import { supabase } from '@/lib/supabase/client';
import { Product, NutritionalInfo, ProductFeatures, DietaryInfo, ProductValueMetrics, AminoProfile } from '@/lib/schemas';

export interface ComparisonProductData extends Product {
  nutritionalInfo?: NutritionalInfo;
  features?: ProductFeatures;
  dietaryInfo?: DietaryInfo;
  valueMetrics?: ProductValueMetrics;
  amino_profile?: AminoProfile; // Added amino_profile property
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
        const enhancedProducts: ComparisonProductData[] = [...products];
    
        // Fetch value metrics data
        const { data: valueMetricsData, error: valueMetricsError } = await supabase
          .from('product_value_metrics')
          .select('*')
          .in('product_id', productIds);
          
        if (valueMetricsError) throw new Error(`Error fetching value metrics: ${valueMetricsError.message}`);
        
        // Fetch amino profile data
        const { data: aminoProfileData, error: aminoProfileError } = await supabase
          .from('amino_profiles')
          .select('*')
          .in('product_id', productIds);
          
        if (aminoProfileError) throw new Error(`Error fetching amino profiles: ${aminoProfileError.message}`);
    
        // Map all data to respective products
        enhancedProducts.forEach((product, index) => {
          const valueMetrics = valueMetricsData?.find(item => item.product_id === product.id) || undefined;
          const aminoProfile = aminoProfileData?.find(item => item.product_id === product.id) || undefined;
          
          // Assign both value metrics and amino profile data
          enhancedProducts[index] = {
            ...product,
            valueMetrics,
            amino_profile: aminoProfile,
          };
        });
    
        setDetailedProducts(enhancedProducts);
      } catch (err) {
        console.error('Error fetching detailed product info:', err);
        setDetailedError({
          message: err instanceof Error ? err.message : 'Unknown error fetching detailed product info',
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