import React from 'react';
import { X } from 'lucide-react';
import { ComparisonProductData } from '@/lib/hooks';
import ProductCard from '@/components/ProductCard';

interface ComparisonColumnProps {
  product: ComparisonProductData;
  onRemove: (productId: string) => void;
}

const ComparisonColumn: React.FC<ComparisonColumnProps> = ({ product, onRemove }) => {
  return (
    <div className="relative h-full bg-white">
      {/* Remove Button */}
      <button 
        onClick={() => onRemove(product.id)} 
        className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-sm text-gray-400 hover:text-gray-700" 
        title="Remove"
        aria-label={`Remove ${product.name} from comparison`}
      >
        <X size={16} />
      </button>
      
      {/* Product Card (for image and basic info) */}
      <div className="p-4 border-b border-gray-200">
        <ProductCard product={product} />
      </div>
      
      {/* Additional details that might be shown in the header */}
      {product.brand && (
        <div className="px-4 pb-2 text-sm text-gray-500">
          {product.brand}
        </div>
      )}
    </div>
  );
};

export default ComparisonColumn;