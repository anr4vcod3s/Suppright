"use client";
import React, { useEffect, useState, useMemo } from 'react';
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
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    // Load search history from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  // Use the comparison context with correct properties
  const { productIds, addProduct, isInComparison } = useComparison();
  
  // Use React Query for caching search results
  const queryClient = useQueryClient();
  
  const { data: results, error, isLoading } = useQuery({
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
    staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
    refetchOnWindowFocus: false,
  });
  
  // Update local results when React Query results change
  useEffect(() => {
    if (results) {
      setLocalResults(results);
    }
  }, [results]);
  
  // Save search history to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentSearches', JSON.stringify(searchHistory));
    }
  }, [searchHistory]);
  
  // Function to add a search term to history
  const addToSearchHistory = (term: string) => {
    if (!term) return;
    
    setSearchHistory(prev => {
      // Remove if it exists already to avoid duplicates
      const filtered = prev.filter(item => item !== term);
      // Add to the beginning and limit to 5 items
      return [term, ...filtered].slice(0, 5);
    });
  };
  
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
      staleTime: 5 * 60 * 1000, // 5 minutes
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
    
    // Add to search history
    addToSearchHistory(query);
    
    // Clear the search
    setQuery('');
    setLocalResults([]);
  };
  
  // Show recent searches if no query and we have search history
  const displayResults = useMemo(() => {
    if (debouncedQuery) {
      return localResults;
    } else if (searchHistory.length > 0) {
      // We'll show recent searches as "dummy" products
      return searchHistory.map((term, index) => ({
        id: `history-${index}`,
        name: term,
        brand: 'Recent search',
      } as Product));
    }
    return [];
  }, [debouncedQuery, localResults, searchHistory]);
  
  const handleHistoryItemClick = (term: string) => {
    setQuery(term);
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

      {displayResults.length > 0 && (
        <ul className="absolute z-10 top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 border border-gray-200">
          {displayResults.map((item) => {
            // Check if it's a history item
            const isHistoryItem = item.id.startsWith('history-');
            
            // For actual products, check if already added
            const alreadyAdded = !isHistoryItem && isInComparison(item.id);
            
            return (
              <li
                key={item.id}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 border-b last:border-b-0 ${
                  alreadyAdded ? 'opacity-50' : ''
                }`}
                onClick={() => {
                  if (isHistoryItem) {
                    handleHistoryItemClick(item.name);
                  } else if (!alreadyAdded) {
                    handleProductSelect(item);
                  }
                }}
                onMouseEnter={() => {
                  // Prefetch product details when hovering (only for actual products)
                  if (!isHistoryItem) {
                    prefetchProductDetails(item.id);
                  }
                }}
              >
                {item.name}
                {!isHistoryItem && ` - ${item.brand}`}
                {isHistoryItem && (
                  <span className="ml-2 text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Recent
                  </span>
                )}
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

      {isLoading && query.length > 1 && (
        <p className="text-gray-500 mt-2 text-sm">
          Searching...
        </p>
      )}

    </div>
  );
};