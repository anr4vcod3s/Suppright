"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import ComparisonTable from "@/components/ComparisonTable";
import { useComparison, useComparisonProducts } from "@/context/context";
import type { FetchedCompareData } from "./page";

interface ComparePageClientProps {
  fetchedData: FetchedCompareData;
}


const ComparePageClient: React.FC<ComparePageClientProps> = ({
  fetchedData,
}) => {
  const { initialProductIds, error: initialError } = fetchedData;
  const { addProduct, productIds, clearProducts } = useComparison();
  const { products } = useComparisonProducts(); // This 'products' array has p.name and p.brand separate

  useEffect(() => {
    // 1) Build a clean H1 text (now including brand name)
    let h1Text = "Compare Indian Supplements"; // Default if no products
    if (products.length > 0) {
      // CRITICAL CHANGE: Map to "Brand Product Name"
      const namesWithBrands = products.map((p) => `${p.brand} ${p.name}`);
      h1Text = `${namesWithBrands.join(" vs ")}`;
    }

    // 2) Build full title for <title> tag (with year)
    const year = new Date().getFullYear();
    const docTitle = `${h1Text} (India ${year})`;
    document.title = docTitle;

    // 3) Patch the existing H1 on the page
    const h1 = document.getElementById("compare-heading");
    if (h1) h1.textContent = h1Text;
  }, [products]);

  useEffect(() => {
    const match = initialProductIds.length === productIds.length &&
      initialProductIds.every((id) => productIds.includes(id));
    if (!match) {
      clearProducts();
      initialProductIds.forEach(addProduct);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProductIds]);

  if (initialError && products.length === 0) {
    return (
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-red-500">Error Loading Comparison</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{initialError}</p>
        <Link href="/" className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Go to Homepage
        </Link>
      </main>
    );
  }

  return (
    <>
      {initialError && products.length > 0 && (
        <p className="mb-4 rounded-md bg-yellow-100 p-3 text-center text-sm text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
          Note: There might have been an issue loading full details for all selected products. ({initialError})
        </p>
      )}
      <ComparisonTable />
    </>
  );
};

export default ComparePageClient;