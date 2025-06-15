// src/app/sitemap.xml/route.ts
import { supabase } from "@/lib/supabase/client";
import { MetadataRoute } from "next";

const URL = "https://www.yourdomain.com"; // Replace with your actual domain

// --- Helper function to create canonical comparison slugs ---
const createCanonicalSlug = (ids: string[]): string => {
  // Sort IDs to ensure consistency (e.g., [id2, id1] becomes [id1, id2])
  const sortedIds = [...ids].sort();
  // Join and encode for the URL
  return encodeURIComponent(sortedIds.join(","));
};

export async function GET() {
  // 1. DEFINE YOUR CURATED COMPARISONS HERE
  // These are the specific comparisons you want to appear in your sitemap.
  // Use the actual UUIDs of your products.
  const curatedComparisons: string[][] = [
    ["product-id-1", "product-id-2"], // Example: A popular 1v1 comparison
    ["product-id-3", "product-id-4"],
    ["product-id-1", "product-id-3", "product-id-5"], // Example: A 3-way comparison
    // Add more curated comparison sets as needed
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