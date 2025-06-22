// src/app/sitemap.xml/route.ts
import { supabase } from "@/lib/supabase/client";
import { MetadataRoute } from "next";

const URL = "https://www.suppright.com";

// Helper to slugify comparison sets
const createSlugFromProductSlugs = (slugs: string[]): string => {
  return slugs.sort().join("-vs-");
};

// Helper to escape XML entities
const escapeXml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

export async function GET(): Promise<Response> {
  try {
    const { data: allProducts, error } = await supabase
      .from("products")
      .select("id, slug, updated_at")
      .order("updated_at", { ascending: false })
      .limit(1000); // Reasonable limit to prevent performance issues

    if (error || !allProducts) {
      console.error("Supabase fetch failed in sitemap:", error);
      // Return minimal sitemap instead of failing completely
      return new Response(
        generateMinimalSitemap(),
        {
          status: 200,
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=300", // Short cache on error
          },
        }
      );
    }

    // Basic validation - only filter out products without required fields
    const validProducts = allProducts.filter(p => p.slug && p.id);
    const idToSlug = new Map(validProducts.map((p) => [p.id, p.slug]));
    const idToUpdatedAt = new Map(validProducts.map((p) => [p.id, p.updated_at]));

    const curatedComparisons: string[][] = [
      ["f6b2fc5d-3b64-4715-bbe6-8ba02928e3d8", "c138fdaf-2ce2-4bbf-b3cc-153fdea4ceb9"],
      ["164e72f8-520c-4e2a-af73-ef0a22b90924", "657f53d3-1674-4b7c-9c93-4e6d4aac52df"],
      ["758ccf69-90ce-4ecc-87ee-98f68405282d", "b1af4363-8503-450b-9039-0dce1e18a11b"],
      ["63e1faa4-a6fa-4c0e-bb48-27b60d767305", "e6b44fe2-23fd-4afb-b392-f7801a87c807"],
      ["a284c705-5281-45fe-a3c7-44b7391aa1d8", "70daf206-1c6d-4370-9252-da688639be4c"],
      ["e2ed4198-bb97-480b-ace0-f2f6fb60e0e8", "3be5c1f3-2018-4e0c-b28a-e8e975a11556"],
      ["dfed599b-4a79-442c-bc3c-5258c69a492f", "164e72f8-520c-4e2a-af73-ef0a22b90924", "c138fdaf-2ce2-4bbf-b3cc-153fdea4ceb9"],
      ["b1af4363-8503-450b-9039-0dce1e18a11b", "758ccf69-90ce-4ecc-87ee-98f68405282d", "b34a2db2-c9b4-4ca2-9204-f40e45f02fbd"],
      ["e2ed4198-bb97-480b-ace0-f2f6fb60e0e8", "6797ac2a-3e5a-47dd-b712-628937a2b5e6", "70e3ced4-4313-4cf6-8eaf-39ea65e457ca"],
    ];

    // Individual product pages (single product comparisons)
    const productEntries: MetadataRoute.Sitemap = validProducts.map((product) => ({
      url: `${URL}/compare/${product.slug}`,
      lastModified: new Date(product.updated_at || new Date()),
      changeFrequency: "monthly" as const, // Product data might change monthly
      priority: 0.6,
    }));

    const comparisonEntries: MetadataRoute.Sitemap = curatedComparisons
      .filter((idSet) => 
        idSet.length <= 3 && // Respect 3-product limit
        idSet.every((id) => idToSlug.has(id)) // All products exist
      )
      .map((idSet) => {
        const slugs = idSet.map((id) => idToSlug.get(id)!);
        const lastModifiedDates = idSet.map((id) => idToUpdatedAt.get(id));
        const latestDate = new Date(
          Math.max(...lastModifiedDates.map((d) => new Date(d ?? "").getTime()))
        );

        return {
          url: `${URL}/compare/${createSlugFromProductSlugs(slugs)}`,
          lastModified: latestDate,
          changeFrequency: "monthly" as const, // Comparison data (prices, macros) might update monthly
          priority: 0.8,
        };
      });

    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: URL,
        lastModified: new Date(),
        changeFrequency: "weekly" as const, // Only homepage changes somewhat regularly
        priority: 1.0,
      },
      {
        url: `${URL}/compare`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.9,
      },
      {
        url: `${URL}/about`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.5,
      },
      {
        url: `${URL}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.3,
      },
      {
        url: `${URL}/terms-of-service`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.3,
      }
    ];

    const allEntries = [...staticRoutes, ...comparisonEntries, ...productEntries];

    return new Response(
      generateSitemapXml(allEntries),
      {
        headers: {
          "Content-Type": "application/xml",
          "Cache-Control": "public, max-age=86400", // 24 hours - aggressive caching for infrequent updates
        },
      }
    );

  } catch (error) {
    console.error("Unexpected error in sitemap generation:", error);
    return new Response(generateMinimalSitemap(), {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=300",
      },
    });
  }
}

function generateSitemapXml(entries: MetadataRoute.Sitemap): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map((entry) => {
    // Handle the TypeScript issue properly
    const lastModified = entry.lastModified instanceof Date 
      ? entry.lastModified.toISOString()
      : new Date(entry.lastModified || new Date()).toISOString();
    
    return `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;
}

function generateMinimalSitemap(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapeXml(URL)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${escapeXml(`${URL}/about`)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${escapeXml(`${URL}/privacy-policy`)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${escapeXml(`${URL}/terms-of-service`)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`;
}