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

  // ADDED: Ref for the main component container to detect outside clicks
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
    if (results) setLocalResults(results);
  }, [results]);

  // ADDED: Effect to handle closing the suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setLocalResults([]); // Clear results to close the dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array ensures this runs only once

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
    // ADDED: Ref is attached to the main container
    <div ref={searchContainerRef} className="relative w-full max-w-3xl">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products to compare..."
        // MODIFIED: Added placeholder:text-lg for larger placeholder text
        className="w-full h-14 text-lg placeholder:text-lg"
      />

      {localResults.length > 0 && (
        // MODIFIED: Changed to rounded-xl for a fuller rounded look
        <ul className="absolute z-10 top-full left-0 w-full bg-white shadow-xl rounded-xl mt-2 border border-gray-200 overflow-hidden">
          {localResults.map((item) => {
            const alreadyAdded = isInComparison(item.id);

            return (
              <li
                key={item.id}
                // MODIFIED: Reduced vertical padding (py-3) and removed hover/transition classes
                className={`relative px-6 py-3 cursor-pointer border-b last:border-b-0 overflow-hidden ${
                  alreadyAdded ? "opacity-50" : ""
                }`}
                onClick={() => {
                  if (!alreadyAdded) handleProductSelect(item);
                }}
                onMouseEnter={() => {
                  prefetchProductDetails(item.id);
                }}
              >
                <span className="relative z-10 text-lg">
                  {item.name} - {item.brand}
                  {alreadyAdded && (
                    <span className="ml-2 text-base text-blue-500 font-medium">
                      Added
                    </span>
                  )}
                </span>
              </li>
            );
          })}
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