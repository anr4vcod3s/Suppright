"use client";

import React, { useEffect } from "react"; // Make sure useEffect is imported
import Link from "next/link";
import ComparisonTable from "@/components/ComparisonTable";
import { useComparison, useComparisonProducts } from "@/context/context"; // Import the products hook
import { FetchedCompareData } from "./page";

interface ComparePageClientProps {
  fetchedData: FetchedCompareData;
}

const ComparePageClient: React.FC<ComparePageClientProps> = ({
  fetchedData,
}) => {
  const { initialProductIds, error: initialError } = fetchedData;
  const { addProduct, productIds, clearProducts } = useComparison();
  const { products } = useComparisonProducts(); // <-- Get the live products array from context

  // --- THIS IS THE NEW CODE TO DYNAMICALLY UPDATE THE TITLE ---
  useEffect(() => {
    // This effect runs whenever the 'products' array changes.
    if (products && products.length > 0) {
      const productNames = products.map((p) => p.name);
      const newTitle = `${productNames.join(" vs ")}: Price, Macros & Amino Profile Comparison (India ${new Date().getFullYear()})`;
      document.title = newTitle;
    } else if (!initialError) {
      // If the comparison becomes empty, reset to a default title.
      document.title = "Compare Indian Supplements | SuppCheck";
    }
    // The dependency array ensures this code only runs when 'products' or 'initialError' changes.
  }, [products, initialError]);
  // --- END OF NEW CODE ---

  // Effect to initialize context from server props (your existing logic)
  useEffect(() => {
    const currentIdsMatchInitial =
      initialProductIds.length === productIds.length &&
      initialProductIds.every((id) => productIds.includes(id));

    if (!currentIdsMatchInitial) {
      clearProducts();
      initialProductIds.forEach((id) => {
        addProduct(id);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProductIds]);

  const onPageDisplayTitle =
    products.length > 0
      ? products.map((p) => p.name).join(" vs ")
      : initialError
        ? "Problem Loading Products"
        : "Product Comparison";

  if (initialError && products.length === 0) {
    return (
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-red-500">
          Error Loading Comparison
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{initialError}</p>
        <Link
          href="/"
          className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Go to Homepage
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-8 mt-28 text-center text-base font-bold md:text-4xl">
        {onPageDisplayTitle}
      </h1>
      {initialError && products.length > 0 && (
        <p className="mb-4 rounded-md bg-yellow-100 p-3 text-center text-sm text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
          Note: There might have been an issue loading full details for all
          selected products. ({initialError})
        </p>
      )}
      <ComparisonTable />
    </main>
  );
};

export default ComparePageClient;