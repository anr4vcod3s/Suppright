"use client";
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from 'use-debounce';
import { supabase } from '@/lib/supabase/client';
import { useComparison } from '@/context/context';

// Import Product type from schemas.ts instead of types
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
  const [results, setResults] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Use the comparison context
  const { products, addProduct, isInComparison } = useComparison();

  useEffect(() => {
    const searchProducts = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, nutritional_info(*), amino_profiles(*)')
          .ilike('name', `%${debouncedQuery}%`)
          .limit(5);

        if (error) throw error;
        setResults(data as Product[]);
        setError(null);
      } catch {
        setError('Failed to search products');
        setResults([]);
      }
    };

    searchProducts();
  }, [debouncedQuery]);

  const handleProductSelect = (product: Product) => {
    // Don't add if we've reached the maximum
    if (products.length >= maxSelections) {
      return;
    }
    
    // Add product to comparison context
    addProduct(product.id);
    
    // Also call the prop callback if provided
    if (onProductSelect) {
      onProductSelect(product);
    }
    
    // Clear the search
    setQuery('');
    setResults([]);
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

      {results.length > 0 && (
        <ul className="absolute z-10 top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 border border-gray-200">
          {results.map((product) => {
            const alreadyAdded = isInComparison(product.id);
            return (
              <li
                key={product.id}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 border-b last:border-b-0 ${
                  alreadyAdded ? 'opacity-50' : ''
                }`}
                onClick={() => !alreadyAdded && handleProductSelect(product)}
              >
                {product.name} - {product.brand}
                {alreadyAdded && <span className="ml-2 text-sm text-blue-500">Added</span>}
              </li>
            );
          })}
        </ul>
      )}

      {error && (
        <p className="text-red-500 mt-2 text-sm">
          {error}
        </p>
      )}

      {products.length >= maxSelections && (
        <p className="text-amber-600 mt-2 text-sm">
          Maximum of {maxSelections} products selected
        </p>
      )}
    </div>
  );
};