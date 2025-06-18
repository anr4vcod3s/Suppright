"use client";
import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import { supabase } from "@/lib/supabase/client";
import { useComparison } from "@/context/context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/lib/schemas";

interface SearchComponentProps {
  onProductSelect?: (product: Product) => void;
  maxSelections?: number;
}

export const SearchComponent = ({
  onProductSelect,
  maxSelections = 4,
}: SearchComponentProps) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [localResults, setLocalResults] = useState<Product[]>([]);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { productIds, addProduct, isInComparison } = useComparison();
  const queryClient = useQueryClient();

  const { data: results, error } = useQuery({
    queryKey: ["productSearch", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) return [];

      const { data, error } = await supabase
        .from("products")
        .select("id, name, brand")
        .or(`name.ilike.%${debouncedQuery}%,brand.ilike.%${debouncedQuery}%`)
        .limit(8);

      if (error) throw error;
      return data as Product[];
    },
    enabled: debouncedQuery.length > 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (results) {
      const filteredResults = results.filter(
        (product) => !isInComparison(product.id),
      );
      setLocalResults(filteredResults);
    }
  }, [results, isInComparison]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setLocalResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const prefetchProductDetails = (productId: string) => {
    queryClient.prefetchQuery({
      queryKey: ["productDetails", productId],
      queryFn: async () => {
        const { data } = await supabase
          .from("products")
          .select("*, nutritional_info(*), amino_profiles(*)")
          .eq("id", productId)
          .single();

        return data;
      },
      staleTime: 60 * 60 * 1000,
    });
  };

  const handleProductSelect = (product: Product) => {
    if (productIds.length >= maxSelections) return;

    addProduct(product.id);
    if (onProductSelect) onProductSelect(product);

    setQuery("");
    setLocalResults([]);
  };

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-2xl">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products to compare..."
        className="w-full md:h-14 text-lg placeholder:text-base md:placeholder:text-lg rounded-full"
      />

      {localResults.length > 0 && (
        // MODIFIED: Replaced static colors with theme-aware variables for dark mode.
        <ul className="absolute z-10 top-full left-0 w-full bg-background shadow-xl rounded-2xl mt-2 border border-border overflow-hidden">
          {localResults.map((item) => (
            <li
              key={item.id}
              // MODIFIED: Reduced vertical padding to py-2 and updated border color.
              className="relative px-6 py-2 cursor-pointer border-b border-border last:border-b-0 overflow-hidden"
              onClick={() => handleProductSelect(item)}
              onMouseEnter={() => prefetchProductDetails(item.id)}
            >
              <span className="relative z-10 text-lg">
                {item.name} - {item.brand}
              </span>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="text-red-500 mt-2 text-base">
          Failed to search products:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      )}
    </div>
  );
};