'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useComparison, useComparisonProducts } from '@/context/context';
import { X, Plus, Scale } from 'lucide-react';
import Image from 'next/image';

// Extract reusable styles as constants
const ICON_BUTTON_CLASSES = "w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50";
const ITEM_AVATAR_CLASSES = "w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden";

const ComparisonDisplay = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { productIds, removeProduct } = useComparison();
  const { products, isLoading } = useComparisonProducts();
  const [mounted, setMounted] = useState(false);
  
  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle click outside to collapse
  useEffect(() => {
    if (!mounted) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (isExpanded && !document.querySelector('.comparison-container')?.contains(target)) {
        setIsExpanded(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded, mounted]);

  const toggleExpanded = () => setIsExpanded(!isExpanded);
  
  // Check if we can add more products
  const canAddMoreProducts = useMemo(() => productIds.length < 4, [productIds]);
  
  // Generate compare URL
  const compareUrl = useMemo(() => 
    productIds.length > 1 ? `/compare/${productIds.join(',')}` : '#',
    [productIds]
  );
  
  // Only render on client-side to avoid hydration mismatch
  if (!mounted) {
    return null;
  }
  
  // Don't render anything if comparison is empty
  if (productIds.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-8 items-center comparison-container z-50">
      {isExpanded ? (
        <div className="flex flex-col gap-3 items-center">
          {isLoading ? (
            <div className="w-full max-w-md flex items-center justify-center bg-white rounded-full shadow-lg px-4 py-2">
              <span className="text-sm">Loading products...</span>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="w-full md:w-80 flex items-center justify-between bg-white rounded-full shadow-lg px-4 py-2"
              >
                <div className="flex items-center gap-3">
                  <div className={ITEM_AVATAR_CLASSES}>
                    {product.image_url ? (
                      <Image 
                        src={product.image_url} 
                        alt={product.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xs">{product.name.substring(0, 1)}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium truncate max-w-32 md:max-w-48">{product.name}</span>
                    <span className="text-xs text-gray-500 truncate max-w-32 md:max-w-48">{product.brand}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeProduct(product.id)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  aria-label="Remove item"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
          
          <div className="flex gap-3">
            {/* Collapse Button */}
            <button
              onClick={toggleExpanded}
              className={ICON_BUTTON_CLASSES}
              aria-label="Collapse comparison"
            >
              <X size={20} />
            </button>
            
            {/* Add Product Button */}
            <Link href="/products">
              <button
                disabled={!canAddMoreProducts}
                className={`${ICON_BUTTON_CLASSES} ${!canAddMoreProducts ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Add product to comparison"
              >
                <Plus size={20} />
              </button>
            </Link>
            
            {/* Compare Page Button */}
            <Link href={compareUrl}>
              <button
                disabled={productIds.length < 2}
                className={`w-auto h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 px-4 ${productIds.length < 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Compare Products"
                aria-label="Compare products"
              >
                <Scale size={16} className="mr-2" />
                <span className="text-sm font-medium">Compare</span>
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleExpanded}
          className="flex items-center gap-2 bg-white rounded-full shadow-lg px-3 py-2"
          aria-label="View comparison items"
        >
          <div className="flex justify-between items-center space-x-2">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className={`${ITEM_AVATAR_CLASSES} border-2 border-white`}>
                {product.image_url ? (
                  <Image 
                    src={product.image_url} 
                    alt={product.name}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-xs">{product.name.substring(0, 1)}</span>
                )}
              </div>
            ))}
            {productIds.length > 3 && (
              <div className={`${ITEM_AVATAR_CLASSES} border-2 border-white bg-gray-100`}>
                <span className="text-xs">+{productIds.length - 3}</span>
              </div>
            )}
          </div>
        </button>
      )}
    </div>
  );
};

export default ComparisonDisplay;