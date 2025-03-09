// src/components/ColumnComponent.tsx
import React from 'react';
import { Product } from '@/types';

interface ColumnComponentProps {
  product: Product;
  onRemove: (id: string) => void;
}

const ColumnComponent: React.FC<ColumnComponentProps> = ({ product, onRemove }) => {
  return (
    <div className="p-4 border border-gray-300 bg-white text-left font-medium text-lg">
      <div className="flex justify-between items-center">
        <span>{product.name}</span>
        <button
          onClick={() => onRemove(product.id)}
          className="text-red-500 hover:text-red-700"
          title="Remove product"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default ColumnComponent;
