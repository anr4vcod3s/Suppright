"use client";
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from 'use-debounce';
import { supabase } from '@/lib/supabase/client';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

export const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const { addItem, items } = useCart();
  const [results, setResults] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchProducts = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
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
          {results.map((product) => (
            <li
              key={product.id}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 border-b last:border-b-0"
              onClick={() => {
                if (items.length < 4) {
                  addItem(product);
                  setQuery('');
                  setResults([]);
                }
              }}
            >
              {product.name}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="text-red-500 mt-2 text-sm">
          {error}
        </p>
      )}
    </div>
  );
};