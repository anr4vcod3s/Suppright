"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { SearchComponent } from "@/components/SearchComponent";
import { Product } from "@/lib/schemas";

const HeroComponent = () => {
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleProductSelect = (product: Product) => {
    console.log("Selected product:", product);
  };

  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;

      // Only act if the focused element is an input inside the search container
      if (
        window.innerWidth <= 768 &&
        searchContainerRef.current &&
        searchContainerRef.current.contains(target) &&
        target.tagName === "INPUT"
      ) {
        setTimeout(() => {
          searchContainerRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300); // Wait for mobile keyboard to animate
      }
    };

    window.addEventListener("focusin", handleFocus);

    return () => {
      window.removeEventListener("focusin", handleFocus);
    };
  }, []);

  return (
    <div
      id="hero"
      className="relative w-full h-[92vh] flex flex-col items-center justify-center text-center bg-background"
    >
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <BackgroundBeams />
      </div>

      <div className="absolute top-1/3 md:top-1/3 z-20 flex flex-col items-center w-11/12 md:w-10/12">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground relative leading-snug">
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
          Tool
        </h1>

        <p className="mt-2 mb-2 md:mb-8 md:mt-4 md:w-10/12 text-muted-foreground text-sm md:text-xl">
          Compare your favourite supplements in one view
        </p>

        <div
          ref={searchContainerRef}
          className="md:w-5/6 flex justify-center"
        >
          <SearchComponent onProductSelect={handleProductSelect} />
        </div>
      </div>
    </div>
  );
};

export default HeroComponent;
