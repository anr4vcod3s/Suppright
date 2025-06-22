// app/compare/[slug]/page.tsx
import React from "react";
import Head from "next/head";
import Script from "next/script";
import { Metadata } from "next";
import { supabase } from "@/lib/supabase/client";
import ComparePageClient from "./ComparePageClient";

// ----- Types -----
export interface CompareProductMeta {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
  brand?: string | null;
}

export interface FetchedCompareData {
  productNames: string[];
  initialProductIds: string[];
  error?: string;
}

interface PageProps {
  params: Promise<{ slug?: string }>;
}

// ----- Data Fetcher -----
async function getProductDataFromSlug(
  slug?: string
): Promise<{
  ids: string[];
  names: string[];
  products: CompareProductMeta[];
  error?: string;
}> {
  if (!slug || !slug.trim()) {
    return { ids: [], names: [], products: [], error: "No comparison slug provided." };
  }
  const productSlugs = slug.split("-vs-");
  if (productSlugs.length === 0) {
    return { ids: [], names: [], products: [], error: "Invalid comparison slug." };
  }
  if (productSlugs.length > 3) {
    return {
      ids: [],
      names: [],
      products: [],
      error: "Too many products for comparison (max 3).",
    };
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, slug, image_url, brand")
      .in("slug", productSlugs)
      .returns<CompareProductMeta[]>();

    if (error) {
      console.error("Supabase error:", error);
      return {
        ids: [],
        names: [],
        products: [],
        error: `Database error: ${error.message}`,
      };
    }
    if (!data || data.length === 0) {
      return {
        ids: [],
        names: [],
        products: [],
        error: "One or more products not found.",
      };
    }

    const orderedIds: string[] = [];
    const orderedNames: string[] = [];
    const orderedProducts: CompareProductMeta[] = [];
    const mapBySlug = new Map(data.map((p) => [p.slug, p]));

    productSlugs.forEach((s) => {
      const p = mapBySlug.get(s);
      if (p) {
        orderedIds.push(p.id);
        orderedNames.push(p.name);
        orderedProducts.push(p);
      }
    });

    return { ids: orderedIds, names: orderedNames, products: orderedProducts };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unexpected server error.";
    console.error("Unhandled exception:", e);
    return { ids: [], names: [], products: [], error: msg };
  }
}

// ----- Metadata for SEO -----
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
  const { slug } = await params;
  const cleanSlug = slug ? encodeURIComponent(slug) : "";
  const { names: productNames } = await getProductDataFromSlug(slug);

  const title =
    productNames.length > 0
      ? `${productNames.join(" vs ")}: Price, Macros & Amino Profile Comparison (India ${new Date().getFullYear()})`
      : "Compare Indian Supplements | SuppCheck";

  const description =
    productNames.length > 0
      ? `Compare ${productNames.join(", ")} side-by-side: price, protein content, amino profiles and more.`
      : "Compare supplements on SuppCheck for price, macros, and amino profile.";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/compare/${cleanSlug}`,
    },
    openGraph: {
      title,
      description,
    },
  };
}

// ----- Page Component -----
export default async function CompareProductsPage({ params }: PageProps) {
  const { slug } = await params;
  const { ids, names, error } = await getProductDataFromSlug(slug);
  const fetchedData: FetchedCompareData = {
    productNames: names,
    initialProductIds: ids,
    error,
  };

  const pageTitle =
    names.length > 0
      ? `${names.join(" vs ")}: Price, Macros & Amino Profile Comparison (India ${new Date().getFullYear()})`
      : "Compare Indian Supplements | SuppCheck";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suppright.com";
  const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: names.map((name, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      name,
      url: `${baseUrl}/compare/${encodeURIComponent(slug || "")}`,
    },
  })),
};

  return (
    <>
      {/* <link rel="canonical"> for crawlers who don’t parse alternates */}
      <Head>
        <link
          rel="canonical"
          href={`${baseUrl}/compare/${encodeURIComponent(slug || "")}`}
        />
      </Head>

      <main className="container mx-auto p-4 md:w-5/6">
        {/* SEO-friendly server-rendered H1 */}
        <h1
          id="compare-heading"
          className="mb-8 mt-28 text-center text-base font-bold md:text-4xl"
        >
          {pageTitle}
        </h1>

        {/* JSON-LD injected after hydration */}
        <Script
          id="compare-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Client-only comparison UI */}
        <ComparePageClient fetchedData={fetchedData} />
      </main>
    </>
  );
}