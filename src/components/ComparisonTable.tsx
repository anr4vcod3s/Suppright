"use client";

import React, { useState, useEffect } from 'react';
import ComparisonColumn from './ComparisonColumn';
import { useComparison } from '@/context/context';
import { Product } from '@/lib/schemas';

interface ComparisonTableProps {
  // Function to fetch products by IDs (to be implemented by consumer)
  fetchProducts: (ids: string[]) => Promise<Product[]>;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ fetchProducts }) => {
  const { products: productIds, removeProduct } = useComparison();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Define metrics to display
  const metrics = [
    'brand',
    'nutritional_info.calories',
    'nutritional_info.protein_g',
    'nutritional_info.carbohydrates_g',
    'nutritional_info.fats_g',
    'amino_profiles.leucine_g',
    'amino_profiles.isoleucine_g',
    'amino_profiles.valine_g'
  ];
  
  // Create human-readable labels for each metric
  const metricLabels: Record<string, string> = {
    'brand': 'Brand',
    'nutritional_info.calories': 'Calories',
    'nutritional_info.protein_g': 'Protein (g)',
    'nutritional_info.carbohydrates_g': 'Carbs (g)',
    'nutritional_info.fats_g': 'Fat (g)',
    'amino_profiles.leucine_g': 'Leucine (g)',
    'amino_profiles.isoleucine_g': 'Isoleucine (g)',
    'amino_profiles.valine_g': 'Valine (g)'
  };

  useEffect(() => {
    const loadProducts = async () => {
      if (productIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const productsData = await fetchProducts(productIds);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [productIds, fetchProducts]);

  if (productIds.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No products selected for comparison.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex justify-between">
          <div className="w-64 bg-gray-200 h-96 animate-pulse"></div>
          {[...Array(productIds.length)].map((_, i) => (
            <div key={i} className="flex-1 bg-gray-100 h-96 mx-1 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className={`grid grid-cols-[auto_repeat(${products.length},_1fr)]`}>
        {/* Empty cell in top-left corner */}
        <div className="p-2 bg-gray-100"></div>
        
        {/* Product columns */}
        {products.map((product) => (
          <div key={product.id}>
            <ComparisonColumn 
              product={product} 
              removeItem={removeProduct}
              metrics={metrics}
            />
          </div>
        ))}
        
        {/* Metric rows */}
        {metrics.map((metric, index) => (
          <React.Fragment key={metric}>
            <div className={`p-2 font-medium ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
              {metricLabels[metric] || metric}
            </div>
            {products.map((product) => {
              const rawValue = getNestedProperty(product, metric);
              const value =
                typeof rawValue === 'string' || typeof rawValue === 'number'
                  ? rawValue
                  : '—';
              return (
                <div 
                  key={`${product.id}-${metric}`} 
                  className={`p-2 border-t border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  {value}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Helper function to get nested properties
function getNestedProperty<T>(obj: T, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export default ComparisonTable;
