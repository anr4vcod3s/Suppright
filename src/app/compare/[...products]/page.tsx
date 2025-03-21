"use client";

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ComparisonProvider, useComparison } from '@/context/context';
import ComparisonTable from '@/components/ComparisonTable';

const ComparePageContent = () => {
  const params = useParams();
  const productsParam = params?.products;
  const { clearProducts, addProduct } = useComparison();

  useEffect(() => {
    if (productsParam) {
      let productIds: string[];
      if (Array.isArray(productsParam)) {
        productIds = productsParam;
      } else {
        productIds = productsParam.split(',');
      }
      clearProducts();
      productIds.forEach((id) => addProduct(id));
    }
  }, [addProduct, clearProducts, productsParam]);

  return (
    <div className="pt-20 px-4">
      <ComparisonTable />
    </div>
  );
};

const ComparePage = () => {
  return (
    <ComparisonProvider>
      <ComparePageContent />
    </ComparisonProvider>
  );
};

export default ComparePage;