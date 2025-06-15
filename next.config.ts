// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "example.com",
      "placehold.co",
      "slxbovqsolmiopzsdtpe.supabase.co", // <-- ADD THIS LINE
    ],
  },
};

module.exports = nextConfig;
