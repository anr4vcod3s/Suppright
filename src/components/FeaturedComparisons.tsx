'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useComparison, useComparisonProducts } from '@/context/context';

const FEATURED_PRODUCTS = [
  {
    id: 'dfed599b-4a79-442c-bc3c-5258c69a492f',
    name: 'Isorich Protein',
    brand: 'Avvatar',
  },
  {
    id: 'c138fdaf-2ce2-4bbf-b3cc-153fdea4ceb9',
    name: 'Pure Whey Protein Isolate',
    brand: 'The Whole Truth',
  },
  {
    id: '657f53d3-1674-4b7c-9c93-4e6d4aac52df',
    name: 'Swiss Chocolate 100% Whey Protein',
    brand: 'Nutrabox',
  },
];

export default function FeaturedProducts() {
  const { clearProducts, addProduct } = useComparison();
  const { products } = useComparisonProducts();
  const router = useRouter();

  const [pendingCompare, setPendingCompare] = useState(false);

  const compareUrl = React.useMemo(() => {
    if (products.length < 2) return '#';
    const sortedSlugs = products.map((p) => p.slug).filter(Boolean).sort();
    return sortedSlugs.length < 2 ? '#' : `/compare/${sortedSlugs.join('-vs-')}`;
  }, [products]);

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
    <section className="max-w-6xl mx-auto my-16 px-4">
      <h2 className="text-4xl font-bold mb-10 text-center">Featured Supplement Picks</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {FEATURED_PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-md p-6 flex flex-col items-center text-center space-y-3 min-h-[180px]"
          >
            {/* Placeholder Circle 
            <div className="w-20 h-20 mb-2 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <span className="text-xl font-bold text-neutral-500 dark:text-neutral-400">
                {product.name[0]}
              </span>
            </div>*/}
            <h3 className="text-lg font-semibold ">{product.brand}</h3>
            <p className="text-lg text-neutral-700 dark:text-neutral-300">{product.name}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleCompareFeatured}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold text-lg shadow-xl hover:scale-105 transition-transform"
        >
          Compare These
        </button>
      </div>
    </section>
  );
}
