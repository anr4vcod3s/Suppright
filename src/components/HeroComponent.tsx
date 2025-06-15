// src/components/HeroComponent.tsx
"use client";
import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { SearchComponent } from "@/components/SearchComponent";
import { Product } from "@/lib/schemas";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const HeroComponent = () => {
  const handleProductSelect = (product: Product) => {
    console.log("Selected product:", product);
  };

  const headlineWords = "India's Smartest Supplement Comparison Tool.";

  return (
    <div
      id="hero"
      className="relative w-full h-svh flex flex-col items-center justify-center text-center overflow-hidden"
    >
      <BackgroundBeams className="absolute inset-0 -z-10 w-full h-full" />

      <div className="relative flex flex-col items-center w-11/12 md:w-10/12">
        
          <TextGenerateEffect
            words={headlineWords}
          />

        <p className="mb-8 mt-4 w-10/12 text-lg text-black/80 md:text-2xl dark:text-white/80">
          Stop switching tabs. SuppRight puts all the data—prices, macros,
          ingredients—into one simple view. Compare hundreds of supplements in
          India and choose with confidence.
        </p>

        <div className="w-full max-w-md">
          <SearchComponent onProductSelect={handleProductSelect} />
        </div>
      </div>
    </div>
  );
};

export default HeroComponent;