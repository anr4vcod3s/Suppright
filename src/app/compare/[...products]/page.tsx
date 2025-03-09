// app/compare/[...products]/page.tsx
'use client';

import React from 'react';
import CompareTableComponent from '@/components/ComparisonTable';
import { useParams } from 'next/navigation';

const CompareProductsPage = () => {
  const params = useParams();
  const productIds = params?.products as string[] || [];
  
  // You could use these product IDs to pre-select specific products
  // in your comparison table if needed
  console.log('Products to compare:', productIds);
  
  return (
    <div className="max-w-7xl mx-auto pt-10 items-center">
      <h1 className="text-3xl font-bold mb-6">Product Comparison</h1>
      <CompareTableComponent />

    </div>
  );
};

export default CompareProductsPage;