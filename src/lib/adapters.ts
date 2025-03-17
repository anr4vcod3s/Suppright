import axios from 'axios';
import { useQuery, QueryClient } from '@tanstack/react-query';
import { Product } from './schemas';

// Create a base axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
});

// Define API endpoints and query keys
export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  PRODUCT: (id: string) => `/products/${id}`,
};

export const QUERY_KEYS = {
  ALL_PRODUCTS: 'products',
  PRODUCT_DETAILS: 'product-details',
  PRODUCT_COMPARISON: 'product-comparison',
};

// Fetch all products (basic info for listings)
export const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await api.get(API_ENDPOINTS.PRODUCTS);
  return data;
};

// Fetch a single product with all details
export const fetchProductById = async (id: string): Promise<Product> => {
  const { data } = await api.get(API_ENDPOINTS.PRODUCT(id));
  return data;
};

// Fetch multiple products by ID (for comparison)
export const fetchProductsById = async (ids: string[]): Promise<Product[]> => {
  if (!ids.length) return [];
  
  // Using Promise.all to fetch multiple products in parallel
  const products = await Promise.all(
    ids.map(id => fetchProductById(id))
  );
  
  return products;
};

// React Query hooks

// Hook to get all products (basic info)
export function useProducts() {
  return useQuery({
    queryKey: [QUERY_KEYS.ALL_PRODUCTS],
    queryFn: () => fetchProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Hook to get a single product
export function useProduct(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_DETAILS, id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Hook to get multiple products for comparison
export function useProductComparison(ids: string[]) {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_COMPARISON, ids],
    queryFn: () => fetchProductsById(ids),
    enabled: ids.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Create a React Query client to be used app-wide
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Optional: Function to prefetch data for SSR
export async function prefetchProductsForSSR(queryClient: QueryClient): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.ALL_PRODUCTS],
    queryFn: () => fetchProducts()
  });
}

export async function prefetchProductForSSR(queryClient: QueryClient, id: string): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.PRODUCT_DETAILS, id],
    queryFn: () => fetchProductById(id)
  });
}

export async function prefetchProductComparisonForSSR(queryClient: QueryClient, ids: string[]): Promise<void> {
  if (ids.length > 0) {
    await queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.PRODUCT_COMPARISON, ids],
      queryFn: () => fetchProductsById(ids)
    });
  }
}