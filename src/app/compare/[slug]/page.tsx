// app/compare/[slug]/page.tsx
import React from "react";
import { Metadata } from "next";
import { supabase } from "@/lib/supabase/client";
import { ComparisonProvider } from "@/context/context";
import { ComparisonProductData } from "@/lib/hooks";
import ComparePageClient from "./ComparePageClient";

// ----- Caching Configuration -----
// This enables Incremental Static Regeneration (ISR).
// The page will be cached for 1 hour (3600 seconds).
export const revalidate = 3600;

// ----- Types -----
export interface FetchedInitialData {
  products: ComparisonProductData[];
  error?: string;
}

// FIX: This is the corrected interface that solves the TypeScript build error.
// It now includes `searchParams`, which Next.js requires for all page components.
interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// ----- Data Fetcher (Runs on the Server) -----
async function getInitialComparisonData(
  slug: string,
): Promise<FetchedInitialData> {
  if (!slug || !slug.trim()) {
    return { products: [], error: "No comparison slug provided." };
  }
  const productSlugs = slug.split("-vs-").filter(Boolean);
  if (productSlugs.length === 0) {
    return { products: [], error: "Invalid comparison slug." };
  }
  if (productSlugs.length > 4) {
    return { products: [], error: "Too many products for comparison (max 4)." };
  }

  try {
    const { data, error } = await supabase
      .from("v_product_comparison_details")
      .select("*")
      .in("slug", productSlugs)
      .returns<ComparisonProductData[]>();

    if (error) {
      console.error("Supabase error in page.tsx:", error);
      return { products: [], error: `Database error: ${error.message}` };
    }
    if (!data || data.length === 0) {
      return { products: [], error: "One or more products not found." };
    }

    const mapBySlug = new Map(data.map((p) => [p.slug, p]));
    const orderedProducts: ComparisonProductData[] = productSlugs
      .map((s) => mapBySlug.get(s))
      .filter((p): p is ComparisonProductData => !!p);

    return { products: orderedProducts };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unexpected server error.";
    console.error("Unhandled exception in page.tsx:", e);
    return { products: [], error: msg };
  }
}

// ----- Metadata for SEO (Runs on the Server) -----
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = params;
  const { products } = await getInitialComparisonData(slug);
  const productNames = products.map((p) => `${p.brand} ${p.name}`);
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://suppright.com";

  const title =
    productNames.length > 0
      ? `${productNames.join(
          " vs ",
        )}: Price, Macros & Amino Profile Comparison (India ${new Date().getFullYear()})`
      : "Compare Indian Supplements | SuppCheck";
  const description =
    productNames.length > 0
      ? `Compare ${productNames.join(
          ", ",
        )} side-by-side: price, protein content, amino profiles and more.`
      : "Compare supplements on SuppCheck for price, macros, and amino profile.";

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/compare/${slug}` },
    openGraph: { title, description },
  };
}

// ----- Page Component (Server Component) -----
export default async function CompareProductsPage({ params }: PageProps) {
  const { slug } = params;
  const { products: initialProducts, error } = await getInitialComparisonData(
    slug,
  );

  const pageTitle =
    initialProducts.length > 0
      ? `${initialProducts.map((p) => `${p.brand} ${p.name}`).join(" vs ")}`
      : "Compare Indian Supplements";

  return (
    <ComparisonProvider initialProducts={initialProducts}>
      <main className="container mx-auto p-4 md:w-5/6">
        <h1
          id="compare-heading"
          className="mb-8 mt-28 text-center text-2xl font-bold md:text-4xl"
        >
          {pageTitle}
        </h1>
        <ComparePageClient initialError={error} />
      </main>
    </ComparisonProvider>
  );
}