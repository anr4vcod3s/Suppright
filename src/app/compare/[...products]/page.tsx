"use client";

import { useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ComparisonProvider, useComparison } from '@/context/context';
import ComparisonTable from '@/components/ComparisonTable';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/lib/schemas';

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

  const fetchProducts = useCallback(async (ids: string[]): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*, nutritional_info(*), amino_profiles(*)')
      .in('id', ids);

    if (error) {
      console.error('Error fetching products: ', error);
      return [];
    }
    return data;
  }, []);

  return (
    <div className="pt-20 px-4">
      <ComparisonTable fetchProducts={fetchProducts} />
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
