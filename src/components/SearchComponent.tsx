"use client";
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from 'use-debounce';
import { supabase } from '@/lib/supabase/client';
import { useComparison } from '@/context/context';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Import Product type from schemas.ts
import { Product } from '@/lib/schemas';

interface SearchComponentProps {
  onProductSelect?: (product: Product) => void;
  maxSelections?: number;
}

export const SearchComponent = ({ 
  onProductSelect,
  maxSelections = 4
}: SearchComponentProps) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [localResults, setLocalResults] = useState<Product[]>([]);
  
  // Use the comparison context with correct properties
  const { productIds, addProduct, isInComparison } = useComparison();
  
  // Use React Query for caching search results
  const queryClient = useQueryClient();
  
  const { data: results, error } = useQuery({
    queryKey: ['productSearch', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        return [];
      }
      
      // Only select the fields we need for the search results
      const { data, error } = await supabase
        .from('products')
        .select('id, name, brand')
        .ilike('name', `%${debouncedQuery}%`)
        .limit(5);
        
      if (error) throw error;
      return data as Product[];
    },
    enabled: debouncedQuery.length > 1, // Only run query if we have at least 2 characters
    staleTime: 30 * 60 * 1000, // Cache results for 30 minutes (increased from 5)
    refetchOnWindowFocus: false,
  });
  
  // Update local results when React Query results change
  useEffect(() => {
    if (results) {
      setLocalResults(results);
    }
  }, [results]);
  
  // Prefetch product details when hovering over a search result
  const prefetchProductDetails = (productId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['productDetails', productId],
      queryFn: async () => {
        const { data } = await supabase
          .from('products')
          .select('*, nutritional_info(*), amino_profiles(*)')
          .eq('id', productId)
          .single();
          
        return data;
      },
      staleTime: 60 * 60 * 1000, // Increased to 60 minutes
    });
  };
  
  const handleProductSelect = (product: Product) => {
    // Don't add if we've reached the maximum
    if (productIds.length >= maxSelections) {
      return;
    }
    
    // Add product to comparison context
    addProduct(product.id);
    
    // Call the prop callback if provided
    if (onProductSelect) {
      onProductSelect(product);
    }
    
    // Clear the search
    setQuery('');
    setLocalResults([]);
  };

  return (
    <div className="relative w-full max-w-md">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products to compare..."
        className="w-full"
      />

      {localResults.length > 0 && (
        <ul className="absolute z-10 top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 border border-gray-200">
          {localResults.map((item) => {
            // For actual products, check if already added
            const alreadyAdded = isInComparison(item.id);
            
            return (
              <li
                key={item.id}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 border-b last:border-b-0 ${
                  alreadyAdded ? 'opacity-50' : ''
                }`}
                onClick={() => {
                  if (!alreadyAdded) {
                    handleProductSelect(item);
                  }
                }}
                onMouseEnter={() => {
                  // Prefetch product details when hovering
                  prefetchProductDetails(item.id);
                }}
              >
                {item.name} - {item.brand}
                {alreadyAdded && <span className="ml-2 text-sm text-blue-500">Added</span>}
              </li>
            );
          })}
        </ul>
      )}

      {error && (
        <p className="text-red-500 mt-2 text-sm">
          Failed to search products: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      )}
    </div>
  );
};