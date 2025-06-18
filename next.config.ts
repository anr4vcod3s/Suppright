// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ tells Next.js to not lint during "next build"
  },
  images: {
    domains: [
      "example.com",
      "placehold.co",
      "slxbovqsolmiopzsdtpe.supabase.co", // <-- ADD THIS LINE
    ],
  },
};

module.exports = nextConfig;
