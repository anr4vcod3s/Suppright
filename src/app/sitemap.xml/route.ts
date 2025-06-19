// src/app/sitemap.xml/route.ts
import { supabase } from "@/lib/supabase/client";
import { MetadataRoute } from "next";

const URL = "https://www.suppright.com"; // Replace with your actual domain

// --- Helper function to create canonical comparison slugs ---
const createCanonicalSlug = (ids: string[]): string => {
  // Sort IDs to ensure consistency (e.g., [id2, id1] becomes [id1, id2])
  const sortedIds = [...ids].sort();
  // Join and encode for the URL
  return encodeURIComponent(sortedIds.join(","));
};

export async function GET() {
 
  const curatedComparisons: string[][] = [
  // --- 2-Product Comparisons ---

  // 1. Avvatar Whey Blend vs. The Whole Truth Pure Isolate (Common Whey Comparison)
  ["f6b2fc5d-3b64-4715-bbe6-8ba02928e3d8", "c138fdaf-2ce2-4bbf-b3cc-153fdea4ceb9"],

  // 2. Wellbeing Nutrition Isolate (Velositol) vs. Nutrabox Whey (DHA/MCT)
  ["164e72f8-520c-4e2a-af73-ef0a22b90924", "657f53d3-1674-4b7c-9c93-4e6d4aac52df"],

  // 3. Plant-Based: Wellbeing Nutrition Plant vs. Nutrabox Plant
  ["758ccf69-90ce-4ecc-87ee-98f68405282d", "b1af4363-8503-450b-9039-0dce1e18a11b"],

  // 4. Mass Gainer vs. Protein Plus (different purpose products)
  ["63e1faa4-a6fa-4c0e-bb48-27b60d767305", "e6b44fe2-23fd-4afb-b392-f7801a87c807"],

  // 5. Casein vs. Ripped Whey Isolate (Slow vs. Fast release)
  ["a284c705-5281-45fe-a3c7-44b7391aa1d8", "70daf206-1c6d-4370-9252-da688639be4c"],

  // 6. Unflavored Whey (Avvatar) vs. Unflavoured Raw Whey Concentrate (TWT)
  ["e2ed4198-bb97-480b-ace0-f2f6fb60e0e8", "3be5c1f3-2018-4e0c-b28a-e8e975a11556"],

  // --- 3-Product Comparisons ---

  // 7. Premium Isolates from different brands
  [
    "dfed599b-4a79-442c-bc3c-5258c69a492f", // Avvatar Isorich
    "164e72f8-520c-4e2a-af73-ef0a22b90924", // Wellbeing Nutrition Dark Choc Isolate
    "c138fdaf-2ce2-4bbf-b3cc-153fdea4ceb9"  // The Whole Truth Pure Isolate
  ],

  // 8. Plant Protein Variety
  [
    "b1af4363-8503-450b-9039-0dce1e18a11b", // Nutrabox Plant Protein
    "758ccf69-90ce-4ecc-87ee-98f68405282d", // Wellbeing Nutrition Belgian Dark Choc Plant Protein
    "b34a2db2-c9b4-4ca2-9204-f40e45f02fbd"  // Nutrabox Peanut Protein
  ],

  // 9. Different Unflavored Options
  [
    "e2ed4198-bb97-480b-ace0-f2f6fb60e0e8", // Avvatar Whey Protein Unflavored
    "6797ac2a-3e5a-47dd-b712-628937a2b5e6", // Wellbeing Nutrition Unflavored Isolate
    "70e3ced4-4313-4cf6-8eaf-39ea65e457ca"  // Nutrabox 100% Raw Whey Isolate
  ],

  // --- 4-Product Comparisons ---

  // 10. Diverse Mix: Whey, Isolate, Plant, Casein
  [
    "f6b2fc5d-3b64-4715-bbe6-8ba02928e3d8", // Avvatar Whey Protein (Blend)
    "c138fdaf-2ce2-4bbf-b3cc-153fdea4ceb9", // The Whole Truth Pure Whey Protein Isolate
    "758ccf69-90ce-4ecc-87ee-98f68405282d", // Wellbeing Nutrition Belgian Dark Choc Plant Protein
    "a284c705-5281-45fe-a3c7-44b7391aa1d8"  // Nutrabox Casein Protein
  ],

  // 11. Brands & Flavors
  [
    "4f18809c-6fa2-43d9-b3d5-3b52128d180e", // Wellbeing Nutrition Mango Isolate + Concentrate
    "a6b86180-4961-4727-b97f-9c025dcf84e5", // The Whole Truth Mango Milkshake
    "d053c30a-16ad-47b2-83ac-478ed209f412", // Nutrabox The Alpha Whey
    "65daf2ef-3799-4b4b-8bcd-83ec4608d1ec"  // Wellbeing Nutrition Cappuccino Isolate + Concentrate
  ]
];

  // 2. Generate sitemap entries for these curated comparisons
  const comparisonEntries: MetadataRoute.Sitemap = curatedComparisons.map(
    (idSet) => ({
      url: `${URL}/compare/${createCanonicalSlug(idSet)}`,
      lastModified: new Date(), // Or fetch the latest `updated_at` of the products involved
      changeFrequency: "monthly",
      priority: 0.8, // Give comparison pages a high priority
    }),
  );

  // 3. Fetch individual product pages (as before)
  const { data: products } = await supabase
    .from("products")
    .select("id, updated_at");

  const productEntries: MetadataRoute.Sitemap =
    products?.map(({ id, updated_at }) => ({
      url: `${URL}/product/${id}`, // Assuming you have individual product pages
      lastModified: updated_at ? new Date(updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    })) ?? [];

  // 4. Define static pages
  const staticRoutes = ["", "/compare"].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.9, // Homepage gets highest priority
  }));

  // 5. Combine all entries
  const allEntries = [
    ...staticRoutes,
    ...productEntries,
    ...comparisonEntries,
  ];

  // 6. Generate the XML response
  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allEntries
    .map((entry) => {
      const lastModDate = entry.lastModified
        ? new Date(entry.lastModified)
        : new Date();
      return `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${lastModDate.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency || "yearly"}</changefreq>
    <priority>${entry.priority || 0.5}</priority>
  </url>`;
    })
    .join("")}
</urlset>`,
    {
      headers: {
        "Content-Type": "application/xml",
      },
    },
  );
}