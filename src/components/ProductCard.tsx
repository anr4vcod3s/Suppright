import React from 'react';
import Image from 'next/image'; // Import Next.js Image component
import { Product } from '@/lib/schemas';

interface ProductCardProps {
  product: Pick<Product, 'id' | 'name' | 'brand' | 'image_url'> & {
    certifications?: Array<{
      id: string;
      image_url: string;
    }>;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="border border-gray-300 rounded-md bg-white p-3">
      {/* Certifications */}
      {product.certifications && product.certifications.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {product.certifications.map((cert) => (
            <Image 
              key={cert.id} 
              src={cert.image_url} 
              alt="Certification"
              width={24} 
              height={24} 
              className="h-6 w-6"
            />
          ))}
        </div>
      )}

      {/* Image */}
      <div className="h-48 flex items-center justify-center">
        {product.image_url ? (
          <Image 
            src={product.image_url} 
            alt={product.name} 
            width={192} // Adjust width
            height={192} // Adjust height
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">No image</div>
        )}
      </div>

      {/* Brand & Name */}
      <div className="mt-2">
        <span className="text-sm text-gray-600 font-semibold">{product.brand}</span>
        <h3 className="text-lg font-bold truncate">{product.name}</h3>
      </div>
    </div>
  );
};

export default ProductCard;
