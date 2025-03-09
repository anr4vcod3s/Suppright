'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { X, Plus } from 'lucide-react';

const CartDisplay = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { items, removeItem, isCartFull } = useCart();

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className="fixed bottom-8">
      {isExpanded ? (
        <div className="flex flex-col gap-3 items-center">
          {items.map((item) => (
            <div
              key={item.id}
              className="w-full max-w-md flex items-center justify-between bg-white rounded-full shadow-lg px-4 py-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <span>{item.name}</span>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          
          <div className="flex gap-3">
            {/* Collapse Button */}
            <button
              onClick={toggleExpanded}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50"
            >
              <X size={20} />
            </button>
            
            {/* Add Product Button */}
            <button
              disabled={isCartFull}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <Plus size={20} />
            </button>
            
            {/* Compare Page Button */}
            <Link href="/compare">
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50"
                title="Compare Products"
              >
                <span className="text-sm">Cmp</span>
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleExpanded}
          className="flex items-center gap-2 bg-white rounded-full shadow-lg px-3 py-2"
        >
          {items.map((item) => (
            <div key={item.id} className="w-8 h-8 bg-gray-200 rounded-full" />
          ))}
        </button>
      )}
    </div>
  );
};

export default CartDisplay;
