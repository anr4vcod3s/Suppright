// components/FeaturedProducts.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useComparison, useComparisonProducts } from '@/context/context';

// Hardcoded featured product IDs and minimal info for demo.
const FEATURED_PRODUCTS = [
  {
    "id": "f6b2fc5d-3b64-4715-bbe6-8ba02928e3d8",
    "name": "Whey Protein",
    "brand": "Avvatar",
  },
  {
    "id": "c138fdaf-2ce2-4bbf-b3cc-153fdea4ceb9",
    "name": "Pure Whey Protein Isolate",
    "brand": "The Whole Truth",
  },
  {
    "id": "164e72f8-520c-4e2a-af73-ef0a22b90924",
    "name": "Dark Chocolate Whey Protein Isolate",
    "brand": "Wellbeing Nutrition",
  },
  {
    "id": "657f53d3-1674-4b7c-9c93-4e6d4aac52df",
    "name": "Swiss Chocolate 100% Whey Protein",
    "brand": "Nutrabox",  }
]

export default function FeaturedProducts() {
  const { clearProducts, addProduct } = useComparison();
  const { products } = useComparisonProducts();
  const router = useRouter();

  const [pendingCompare, setPendingCompare] = useState(false);

  // Compute compareUrl exactly as in ComparisonDisplay
  const compareUrl = React.useMemo(() => {
    if (products.length < 2) return '#';
    const sortedSlugs = products.map((p) => p.slug).filter(Boolean).sort();
    if (sortedSlugs.length < 2) return '#';
    return `/compare/${sortedSlugs.join('-vs-')}`;
  }, [products]);

  // Wait for context to update, then navigate
  useEffect(() => {
    if (
      pendingCompare &&
      products.length === FEATURED_PRODUCTS.length &&
      products.every((p) => FEATURED_PRODUCTS.some((f) => f.id === p.id)) &&
      compareUrl !== '#'
    ) {
      router.push(compareUrl);
      setPendingCompare(false);
    }
  }, [pendingCompare, products, compareUrl, router]);

  const handleCompareFeatured = () => {
    clearProducts();
    FEATURED_PRODUCTS.forEach((prod) => addProduct(prod.id));
    setPendingCompare(true);
  };

  return (
    <section className="max-w-5xl mx-auto my-12 px-4">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Featured Supplement Picks
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {FEATURED_PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="bg-card rounded-xl shadow-lg p-4 flex flex-col items-center"
          >
           {/* <div className="w-24 h-24 mb-3 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-card-foreground">
                  {product.name[0]}
                </span>
              )}
            </div>*/}
            <div className="text-center">
              <div className="font-semibold text-lg">{product.name}</div>
              <div className="text-sm text-muted-foreground">{product.brand}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleCompareFeatured}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold text-lg shadow-lg hover:scale-105 transition-transform"
        >
          Compare These
        </button>
      </div>
    </section>
  );
}