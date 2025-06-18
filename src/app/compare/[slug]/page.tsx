import React from "react";
import { Metadata } from "next";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/lib/schemas";
import ComparePageClient from "./ComparePageClient";

export interface FetchedCompareData {
  productNames: string[];
  initialProductIds: string[];
  error?: string;
}

// --- Revised Helper Function ---
async function getProductDataFromSlug(
  slug?: string,
): Promise<{ ids: string[]; names: string[]; error?: string }> {
  if (!slug || !slug.trim()) {
    return { ids: [], names: [], error: "No comparison slug provided." };
  }

  const productSlugs = slug.split("-vs-");
  if (productSlugs.length === 0) {
    return { ids: [], names: [], error: "Invalid comparison slug." };
  }
  if (productSlugs.length > 4) {
    return {
      ids: [],
      names: [],
      error: "Too many products for comparison (max 4).",
    };
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, slug")
      .in("slug", productSlugs)
      .returns<Pick<Product, "id" | "name" | "slug">[]>();

    if (error) {
      console.error("Supabase query error:", error);
      return {
        ids: [],
        names: [],
        error: `A database error occurred: ${error.message}`,
      };
    }

    if (!data || data.length === 0) {
      return {
        ids: [],
        names: [],
        error: "One or more products could not be found.",
      };
    }

    const orderedIds: string[] = [];
    const orderedNames: string[] = [];
    const dataMap = new Map(data.map((p) => [p.slug, p]));

    productSlugs.forEach((s) => {
      const product = dataMap.get(s);
      if (product) {
        orderedIds.push(product.id);
        orderedNames.push(product.name);
      }
    });

    return { ids: orderedIds, names: orderedNames };
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "An unexpected server error occurred.";
    console.error("Unexpected error:", e);
    return { ids: [], names: [], error: errorMessage };
  }
}

// --- Metadata ---
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { names: productNamesForMeta, error: errorForMeta } =
    await getProductDataFromSlug(params.slug);

  if (errorForMeta && productNamesForMeta.length === 0) {
    return {
      title: "Error Loading Comparison | SuppCheck",
      description: errorForMeta,
    };
  }

  const pageTitle =
    productNamesForMeta.length > 0
      ? `${productNamesForMeta.join(" vs ")}: Price, Macros & Amino Profile Comparison (India ${new Date().getFullYear()})`
      : "Compare Indian Supplements | SuppCheck";

  const metaDescription =
    productNamesForMeta.length > 0
      ? `Side-by-side comparison of ${productNamesForMeta.join(", ")}. Analyze price per serving, protein content, and more to find the best whey protein in India.`
      : "Compare supplements to find the best one for your needs on SuppCheck.";

  return {
    title: pageTitle,
    description: metaDescription,
    openGraph: {
      title: pageTitle,
      description: metaDescription,
    },
    alternates: {
      canonical: params.slug ? `/compare/${params.slug}` : undefined,
    },
  };
}

// --- Page Component ---
export default async function CompareProductsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { ids, names, error: fetchError } = await getProductDataFromSlug(
    params.slug,
  );

  const fetchedData: FetchedCompareData = {
    productNames: names,
    initialProductIds: ids,
    error: fetchError,
  };

  return <ComparePageClient fetchedData={fetchedData} />;
}
