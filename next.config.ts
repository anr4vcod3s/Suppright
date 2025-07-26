/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "example.com",
      "placehold.co",
      "supabase.co",
    ],
  },
  // Cache static assets for 1 year
  async headers() {
    return [
      {
        source: "/:path*.(jpg|jpeg|png|webp|svg|gif|ico|woff|woff2|ttf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          }
        ]
      }
    ];
  },
  // Optimize package imports
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-tooltip"
    ],
    // Modern browser optimization
    modernBrowsers: true
  },
  // Enable React Strict Mode
  reactStrictMode: true,
};

module.exports = nextConfig;