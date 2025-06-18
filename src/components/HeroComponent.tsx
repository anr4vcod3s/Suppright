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
    <div
      id="hero"
      className="relative w-full h-[92vh] flex flex-col items-center justify-center text-center overflow-hidden bg-background"
    >
      <div className="absolute top-0 left-0 w-full h-full z-0 ">
        <BackgroundBeams />
      </div>

      <div className="relative z-20 flex flex-col items-center w-11/12 md:w-10/12">
        <h1 className="text-2xl md:text-5xl font-bold text-foreground relative leading-snug">
          India’s Smartest{" "}
          <span className="relative inline-block">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute -inset-x-1.5 -inset-y-0.5 z-[-1] origin-left rounded-2xl md:-inset-y-2"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.4), rgba(96,165,250,0.4))",
                transformOrigin: "left",
              }}
            />
            <span className="relative z-10 text-foreground">
              Supplement Comparison
            </span>
          </span>{" "}
          Tool.
        </h1>

        <p className="mt-2 mb-8 md:mb-16 md:mt-8 w-10/12 text-muted-foreground md:text-3xl">
          Compare your favourite supplements in one view.
        </p>

        <div className="md:w-5/6 flex justify-center">
          <SearchComponent onProductSelect={handleProductSelect} />
        </div>
      </div>
    </div>
  );
};

export default HeroComponent;
