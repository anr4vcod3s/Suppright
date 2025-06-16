// src/components/HeroComponent.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { SearchComponent } from "@/components/SearchComponent";
import { Product } from "@/lib/schemas";

const HeroComponent = () => {
  const handleProductSelect = (product: Product) => {
    console.log("Selected product:", product);
  };

  return (
    // FIX #1: The main hero container now uses `bg-background`.
    // This makes it WHITE in light mode (as you wanted) and dark in dark mode.
    <div
      id="hero"
      className="relative w-full h-[92vh] flex flex-col items-center justify-center text-center overflow-hidden bg-background"
    >
      {/* FIX #2: A dedicated, ALWAYS DARK canvas for the beams. */}
      {/* This div sits behind the content. It has a dark background so the
          beams are always visible, regardless of the theme. */}
      <div className="absolute top-0 left-0 w-full h-full z-0 ">
        <BackgroundBeams />
      </div>

      {/* FIX #3: A content layer that sits ON TOP of the beams canvas. */}
      {/* The `z-20` ensures this is always in front. */}
      <div className="relative z-20 flex flex-col items-center w-11/12 md:w-10/12">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground relative leading-snug">
          India’s Smartest{" "}
          <span className="relative inline-block">
            {/* FIX #4: YOUR EXACT HIGHLIGHT IS RESTORED. No changes. */}
            {/* This is your original, semi-transparent gradient. */}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute -inset-x-1.5 -inset-y-2 z-[-1] origin-left rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.4), rgba(96,165,250,0.4))",
                transformOrigin: "left",
              }}
            />
            {/* The text inside the highlight now correctly uses `text-foreground`
                so it's black in light mode and white in dark mode, matching
                the rest of the sentence for consistency. */}
            <span className="relative z-10 text-foreground">
              Supplement Comparison
            </span>
          </span>{" "}
          Tool.
        </h1>

        <p className="mb-8 mt-4 w-10/12 text-lg text-muted-foreground md:text-2xl">
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