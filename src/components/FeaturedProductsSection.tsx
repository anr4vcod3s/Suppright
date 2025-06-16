import React from "react";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { supabase } from "@/lib/supabase/client";

// --- YOUR CONTROL PANEL ---
const curatedComparisons: string[][] = [
  ["optimum-nutrition-gold-standard", "muscleblaze-biozyme-whey"],
  ["myprotein-impact-whey-isolate", "dymatize-iso-100"],
  ["as-it-is-atom-whey-protein", "nakpro-perform-whey-protein-concentrate"],
];

// 1. Define a Zod schema for the exact data this component needs.
const FeaturedProductSchema = z.object({
  name: z.string(),
  slug: z.string(),
  image_url: z.string().url().optional().nullable(),
});

// Infer the TypeScript type from the schema.
type FeaturedProduct = z.infer<typeof FeaturedProductSchema>;

// Helper function to create the canonical URL slug
const createCanonicalSlug = (slugs: string[]): string => {
  return [...slugs].sort().join("-vs-");
};

export const FeaturedComparisons = async () => {
  try {
    const allUniqueSlugs = [...new Set(curatedComparisons.flat())];

    // 2. Fetch the data without .returns() and handle potential errors.
    const { data, error } = await supabase
      .from("products")
      .select("name, slug, image_url")
      .in("slug", allUniqueSlugs);

    if (error) {
      throw new Error(`Supabase fetch error: ${error.message}`);
    }

    // 3. Parse and validate the data at runtime.
    // This guarantees the data shape is correct.
    const products = FeaturedProductSchema.array().parse(data);

    if (!products || products.length === 0) {
      console.warn("No featured products found for the given slugs.");
      return null;
    }

    const productMap = new Map(products.map((p) => [p.slug, p]));

    return (
      <section className="w-full bg-gray-50 py-16 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-black dark:text-white md:text-4xl">
              Popular Comparisons
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              See how top supplements stack up head-to-head.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {curatedComparisons.map((slugSet, index) => {
              const productDetails = slugSet
                .map((slug) => productMap.get(slug))
                .filter((p): p is FeaturedProduct => !!p);

              if (productDetails.length < 2) {
                // This is a safe fallback if a slug is wrong or a product is missing
                console.warn(
                  `Could not find all products for slug set: [${slugSet.join(", ")}]`,
                );
                return null;
              }

              const [productA, productB] = productDetails;
              const comparisonUrl = `/compare/${createCanonicalSlug(slugSet)}`;

              return (
                <Link
                  href={comparisonUrl}
                  key={index}
                  className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="relative flex h-48 items-center justify-center p-4">
                    <div className="relative z-10 h-36 w-36 rounded-full bg-white p-2 shadow-lg ring-2 ring-blue-500/50">
                      <Image
                        src={productA.image_url || "/api/placeholder/200/200"}
                        alt={productA.name}
                        fill
                        className="object-contain"
                        sizes="150px"
                      />
                    </div>
                    <div className="absolute z-20 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-gray-800 text-sm font-bold text-white shadow-xl dark:border-gray-900">
                      VS
                    </div>
                    <div className="relative z-0 -ml-8 h-36 w-36 rounded-full bg-white p-2 shadow-lg ring-2 ring-red-500/50">
                      <Image
                        src={productB.image_url || "/api/placeholder/200/200"}
                        alt={productB.name}
                        fill
                        className="object-contain"
                        sizes="150px"
                      />
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-black dark:text-white">
                      {productA.name}
                      <span className="mx-2 text-gray-400">vs</span>
                      {productB.name}
                    </h3>
                    <div className="mt-4 inline-block rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-indigo-700">
                      Compare Now
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    );
  } catch (err) {
    console.error("Failed to render FeaturedComparisons:", err);
    // For the homepage, it's often better to just render nothing on error.
    return null;
  }
};