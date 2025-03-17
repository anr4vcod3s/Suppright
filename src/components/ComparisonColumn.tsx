import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/lib/schemas';

interface ComparisonColumnProps {
  product: Product;
  removeItem: (id: string) => void;
  metrics: string[];
}

const ComparisonColumn: React.FC<ComparisonColumnProps> = ({ 
  product, 
  removeItem,
  metrics
}) => {
  return (
    <div className="flex flex-col border-r border-gray-200">
      {/* Header */}
      <div className="p-2 flex justify-between items-center">
        <span className="text-lg font-medium">{product.name}</span>
        <button 
          onClick={() => removeItem(product.id)}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Remove from comparison"
        >
          X
        </button>
      </div>
      
      {/* Product Card */}
      <ProductCard product={product} />
      
      {/* Metric Rows */}
      {metrics.map((metric) => {
        const value = getNestedProperty(product, metric);
        
        return (
          <div key={metric} className="p-2 border-t border-gray-100">
            {value !== undefined ? value : '—'}
          </div>
        );
      })}
    </div>
  );
};

// Helper function to get nested properties
function getNestedProperty<T>(obj: T, path: string): string | number | undefined {
    return path.split('.').reduce<unknown>((current, key) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj) as string | number | undefined;
  }
  
export default ComparisonColumn;
