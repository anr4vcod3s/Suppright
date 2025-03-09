// src/components/ProductCard.tsx
import React from 'react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

interface Certification {
  id: string;
  name: string;
  image_url: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Check if certifications exist on the product
  const hasCertifications = 
    product.certifications && 
    Array.isArray(product.certifications) && 
    product.certifications.length > 0;

  return (
    <div className="flex flex-col border border-gray-300 rounded-md overflow-hidden bg-white">
      {/* Certification Badges */}
      {hasCertifications && (
        <div className="flex flex-wrap justify-end gap-1 p-2 bg-gray-50">
          {product.certifications.map((cert: Certification) => (
            <div 
              key={cert.id} 
              className="flex items-center" 
              title={cert.name}
            >
              <img 
                src={cert.image_url} 
                alt={cert.name} 
                className="h-6 w-6 object-contain"
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Product Image */}
      <div className="w-full h-48 relative bg-white flex items-center justify-center p-2">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            No image
          </div>
        )}
      </div>
      
      {/* Brand and Product Name */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-baseline gap-1">
          <span className="font-semibold text-gray-600">{product.brand || 'Brand'}</span>
          <span className="text-lg font-bold truncate">{product.name}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;