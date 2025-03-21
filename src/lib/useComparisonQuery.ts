import { useQueries, useQueryClient } from '@tanstack/react-query';
import { useComparison } from '@/context/context';
import { supabase } from '@/lib/supabase/client';
import { adaptProductForComparison } from './adapters';
import { ComparisonProductData } from './hooks';
import { SerializableError } from './hooks';  // Import the new error interface
import {
  Product,
  NutritionalInfo,
  ProductFeatures,
  DietaryInfo,
  ProductValueMetrics
} from '@/lib/schemas';

// Define query keys for better cache management
export const comparisonQueryKeys = {
  product: (id: string) => ['product', id],
  nutritionalInfo: (id: string) => ['nutritionalInfo', id],
  features: (id: string) => ['features', id],
  dietaryInfo: (id: string) => ['dietaryInfo', id],
  valueMetrics: (id: string) => ['valueMetrics', id],
  all: (ids: string[]) => ['comparison', ...ids]
};

// Fetch functions for each data type
const fetchProduct = async (id: string): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw new Error(`Error fetching product: ${error.message}`);
  if (!data) throw new Error(`Product not found with id: ${id}`);
  
  return data;
};

// Other fetch functions remain unchanged...
const fetchNutritionalInfo = async (id: string): Promise<NutritionalInfo | undefined> => {
  const { data, error } = await supabase
    .from('nutritional_info')
    .select('*')
    .eq('product_id', id)
    .single();
    
  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error fetching nutritional info: ${error.message}`);
  }
  
  return data || undefined;
};

const fetchProductFeatures = async (id: string): Promise<ProductFeatures | undefined> => {
  const { data, error } = await supabase
    .from('product_features')
    .select('*')
    .eq('product_id', id)
    .single();
    
  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error fetching product features: ${error.message}`);
  }
  
  return data || undefined;
};

const fetchDietaryInfo = async (id: string): Promise<DietaryInfo | undefined> => {
  const { data, error } = await supabase
    .from('dietary_info')
    .select('*')
    .eq('product_id', id)
    .single();
    
  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error fetching dietary info: ${error.message}`);
  }
  
  return data || undefined;
};

const fetchValueMetrics = async (id: string): Promise<ProductValueMetrics | undefined> => {
  const { data, error } = await supabase
    .from('product_value_metrics')
    .select('*')
    .eq('product_id', id)
    .single();
    
  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error fetching value metrics: ${error.message}`);
  }
  
  return data || undefined;
};

// Hook for fetching all comparison data with ReactQuery
export const useComparisonQuery = () => {
  const { productIds, removeProduct, clearProducts } = useComparison();
  const queryClient = useQueryClient();
  
  // Prefetch function for when products are added to comparison
  const prefetchProductData = async (productId: string) => {
    await queryClient.prefetchQuery({
      queryKey: comparisonQueryKeys.product(productId),
      queryFn: () => fetchProduct(productId)
    });
    
    // Prefetch all related data in parallel
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: comparisonQueryKeys.nutritionalInfo(productId),
        queryFn: () => fetchNutritionalInfo(productId)
      }),
      queryClient.prefetchQuery({
        queryKey: comparisonQueryKeys.features(productId),
        queryFn: () => fetchProductFeatures(productId)
      }),
      queryClient.prefetchQuery({
        queryKey: comparisonQueryKeys.dietaryInfo(productId),
        queryFn: () => fetchDietaryInfo(productId)
      }),
      queryClient.prefetchQuery({
        queryKey: comparisonQueryKeys.valueMetrics(productId),
        queryFn: () => fetchValueMetrics(productId)
      })
    ]);
  };
  
  // Use parallel queries for each product and its related data
  const productQueries = useQueries({
    queries: productIds.map(id => ({
      queryKey: comparisonQueryKeys.product(id),
      queryFn: () => fetchProduct(id),
      staleTime: 1000 * 60 * 5, // 5 minutes
    }))
  });
  
  const nutritionalQueries = useQueries({
    queries: productIds.map(id => ({
      queryKey: comparisonQueryKeys.nutritionalInfo(id),
      queryFn: () => fetchNutritionalInfo(id),
      staleTime: 1000 * 60 * 5, // 5 minutes
    }))
  });
  
  const featuresQueries = useQueries({
    queries: productIds.map(id => ({
      queryKey: comparisonQueryKeys.features(id),
      queryFn: () => fetchProductFeatures(id),
      staleTime: 1000 * 60 * 5, // 5 minutes
    }))
  });
  
  const dietaryQueries = useQueries({
    queries: productIds.map(id => ({
      queryKey: comparisonQueryKeys.dietaryInfo(id),
      queryFn: () => fetchDietaryInfo(id),
      staleTime: 1000 * 60 * 5, // 5 minutes
    }))
  });
  
  const valueMetricsQueries = useQueries({
    queries: productIds.map(id => ({
      queryKey: comparisonQueryKeys.valueMetrics(id),
      queryFn: () => fetchValueMetrics(id),
      staleTime: 1000 * 60 * 5, // 5 minutes
    }))
  });
  
  // Determine loading state from all queries
  const isLoading = 
    productQueries.some(query => query.isLoading) || 
    nutritionalQueries.some(query => query.isLoading) ||
    featuresQueries.some(query => query.isLoading) ||
    dietaryQueries.some(query => query.isLoading) ||
    valueMetricsQueries.some(query => query.isLoading);
  
  // Convert any errors to serializable objects
  const errors: SerializableError[] = [
    ...productQueries.map(query => query.error ? { message: String(query.error) } : null),
    ...nutritionalQueries.map(query => query.error ? { message: String(query.error) } : null),
    ...featuresQueries.map(query => query.error ? { message: String(query.error) } : null),
    ...dietaryQueries.map(query => query.error ? { message: String(query.error) } : null),
    ...valueMetricsQueries.map(query => query.error ? { message: String(query.error) } : null)
  ].filter(Boolean) as SerializableError[];
  
  const error = errors.length > 0 ? errors[0] : null;
  
  // Combine all product data
  const products: ComparisonProductData[] = productIds.map((id, index) => {
    const product = productQueries[index].data;
    const nutritionalInfo = nutritionalQueries[index].data;
    const features = featuresQueries[index].data;
    const dietaryInfo = dietaryQueries[index].data;
    const valueMetrics = valueMetricsQueries[index].data;
    
    if (!product) {
      // Return placeholder if product data is loading
      return {
        id,
        name: 'Loading...',
        brand: '',
      } as ComparisonProductData;
    }
    
    return adaptProductForComparison(
      product,
      nutritionalInfo,
      features,
      dietaryInfo,
      valueMetrics
    );
  });
  
  return {
    products,
    isLoading,
    error,
    removeProduct,
    clearProducts,
    prefetchProductData
  };
};

// Export the hook and query keys
export default useComparisonQuery;