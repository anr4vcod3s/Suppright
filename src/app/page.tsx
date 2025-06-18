// src/app/page.tsx
import React from "react";
import { Metadata } from "next";

// Import all the necessary components for the homepage
import HeroComponent from "@/components/HeroComponent";
import ComparisonDisplay from "@/components/ComparisonDisplay";
import { WhyTrustSuppRight } from "@/components/TrustRight";
import FeaturedProducts from "@/components/FeaturedComparisons";

// --- SEO METADATA FOR THE HOMEPAGE ---
// This tells Google what your main page is about.
export const metadata: Metadata = {
  title: "SuppRight: India's Smartest Supplement Comparison Tool",
  description:
    "Stop switching tabs. Compare prices, macros, and ingredients for hundreds of supplements in India with SuppRight's easy-to-use tool. Choose with confidence.",
  // --- ADD THIS BLOCK ---
  alternates: {
    canonical: "https://www.suppright.in", // Your final domain
  },
  // --- END OF ADDITION ---
  openGraph: {
    title: "SuppRight: India's Smartest Supplement Comparison Tool",
    description: "Unbiased data to help you choose the right supplement.",
    url: "https://www.suppright.in", // Your final domain
    siteName: "SuppRight",
    images: [
      {
        url: "https://www.suppright.in/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

// --- THE HOMEPAGE COMPONENT ---
// Note: This component is NOT async. This is crucial for preventing hydration errors.
const HomePage = () => {
  return (
    // The main container for the page content
    <main className="flex flex-col">
      {/* 1. The main hero section with the search bar */}
      <HeroComponent />
      {/* 2. The "How it Works" section to build user trust */}
      <WhyTrustSuppRight />
      <FeaturedProducts/>
      <ComparisonDisplay />
    </main>
  );
};

export default HomePage;