'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { X, Plus } from 'lucide-react';

// Extract reusable styles as constants
const ICON_BUTTON_CLASSES = "w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50";
const ITEM_AVATAR_CLASSES = "w-8 h-8 bg-gray-200 rounded-full";

const CartDisplay = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { items, removeItem, isCartFull } = useCart();
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
      if (isExpanded && !document.querySelector('.cart-container')?.contains(target)) {
        setIsExpanded(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded, mounted]);

  const toggleExpanded = () => setIsExpanded(!isExpanded);
  
  // Only render on client-side to avoid hydration mismatch
  if (!mounted) {
    return null;
  }
  
  // Don't render anything if cart is empty
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-8 cart-container">
      {isExpanded ? (
        <div className="flex flex-col gap-3 items-center">
          {items.map((item) => (
            <div
              key={item.id}
              className="w-full max-w-md flex items-center justify-between bg-white rounded-full shadow-lg px-4 py-2"
            >
              <div className="flex items-center gap-3">
                <div className={ITEM_AVATAR_CLASSES} />
                <span>{item.name}</span>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Remove item"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          
          <div className="flex gap-3">
            {/* Collapse Button */}
            <button
              onClick={toggleExpanded}
              className={ICON_BUTTON_CLASSES}
              aria-label="Collapse cart"
            >
              <X size={20} />
            </button>
            
            {/* Add Product Button */}
            <button
              disabled={isCartFull}
              className={`${ICON_BUTTON_CLASSES} disabled:opacity-50`}
              aria-label="Add product"
            >
              <Plus size={20} />
            </button>
            
            {/* Compare Page Button */}
            <Link href="/compare">
              <button
                className="w-auto h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50"
                title="Compare Products"
                aria-label="Compare products"
              >
                <span className="text-sm">Compare</span>
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleExpanded}
          className="flex items-center gap-1 bg-white rounded-full shadow-lg px-2 py-2"
          aria-label="View cart items"
        >
          {items.map((item) => (
            <div key={item.id} className={ITEM_AVATAR_CLASSES} />
          ))}
        </button>
      )}
    </div>
  );
};

export default CartDisplay;