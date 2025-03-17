
// Fixed HeroComponent.tsx
'use client';
import React, { useState } from 'react';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { SearchComponent } from '@/components/SearchComponent';
import { Product } from '@/lib/schemas';

const HeroComponent = () => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const handleProductSelect = (product: Product) => {
    setSelectedProducts(prev => {
      const newSelection = [...prev, product];
      
      // If we have products selected, we might want to redirect or store them
      if (newSelection.length >= 2) {
        // Optional: redirect to compare page with selected products
        // router.push(`/compare?products=${newSelection.map(p => p.id).join(',')}`);
      }
      
      return newSelection;
    });
  };

  return (
    <div id="hero" className="relative w-full h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden">
      <BackgroundBeams className="absolute inset-0 w-full h-full -z-10" />
      <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
        Discover and Compare Products
      </h1>
      <p className="text-lg md:text-2xl text-black mb-6">
        Find the best products tailored just for you
      </p>
      <SearchComponent onProductSelect={handleProductSelect} />
      
      {/* Optionally display selected products */}
      {selectedProducts.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-black">Selected products: {selectedProducts.length}</p>
        </div>
      )}
    </div>
  );
};

export default HeroComponent;