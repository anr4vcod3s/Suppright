// app/compare/[slug]/ComparePageClient.tsx
"use client";

import React from "react";
import Link from "next/link";
import ComparisonTable from "@/components/ComparisonTable";
import { useComparisonProducts } from "@/context/context";

interface ComparePageClientProps {
  initialError?: string;
}

const ComparePageClient: React.FC<ComparePageClientProps> = ({
  initialError,
}) => {
  const { products } = useComparisonProducts();

  // FIX: Both useEffect hooks have been removed.
  // The context is correctly hydrated by the server, and the server renders the initial H1/title.
  // No client-side sync or DOM manipulation is needed.

  if (initialError && products.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-red-500">Error Loading Comparison</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{initialError}</p>
        <Link href="/" className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Go to Homepage
        </Link>
      </div>
    );
  }

  return (
    <>
      {initialError && (
        <p className="mb-4 rounded-md bg-yellow-100 p-3 text-center text-sm text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
          Note: There might have been an issue loading some product details. ({initialError})
        </p>
      )}
      <ComparisonTable />
    </>
  );
};

export default ComparePageClient;