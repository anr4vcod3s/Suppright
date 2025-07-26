"use client";
import React, { useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { SearchComponent } from "@/components/SearchComponent";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/schemas";
import { useComparison } from "@/context/context";

const HeroComponent = () => {
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { products, addProduct, removeProduct } = useComparison();

  const handleProductSelect = (product: Product) => {
    addProduct(product.id);
  };

  // Generate comparison URL same as ComparisonDisplay component
  const compareUrl = useMemo(() => {
    if (products.length < 2) return "#";
    const slugs = products
      .map((p) => p.slug)
      .filter(Boolean)
      .sort();
    return slugs.length >= 2 ? `/compare/${slugs.join("-vs-")}` : "#";
  }, [products]);

  const canCompare = products.length >= 2 && compareUrl !== "#";

  const handleCompare = () => {
    if (canCompare) {
      router.push(compareUrl);
    }
  };

  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;

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
        }, 300);
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
      className="relative w-full h-[96vh] flex flex-col items-center justify-center text-center bg-background"
    >
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <BackgroundBeams />
      </div>

      <div className="sm:absolute md:top-0 sm:top-1/3 md:relative z-20 flex flex-col items-center w-11/12 md:w-10/12">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground relative leading-snug">
          India&apos;s Smartest {""}
          <span className="relative inline-block">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute -inset-x-1.5 -inset-y-0.5 md:-inset-1 z-[-1] origin-left rounded-xl "
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
          Compare your favourite protein supplements in one view
        </p>

        <div
          ref={searchContainerRef}
          className="md:w-3/5 w-full flex flex-col items-center gap-3"
        >
          {/* Container for Search bar and Compare button */}
          <div className="w-full flex justify-center">
            <div className="relative w-full max-w-xl flex items-center">
              <div className="flex-grow">
                <SearchComponent onProductSelect={handleProductSelect} />
              </div>
              
              {/* Compare button positioned to the right */}
              <AnimatePresence>
                {products.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 20 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="ml-2"
                  >
                    <Button 
                      onClick={handleCompare}
                      disabled={!canCompare}
                      className={`h-10 rounded-full ${!canCompare ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Compare 
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Container for selected product pills */}
          <AnimatePresence>
            {products.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                className="relative w-full max-w-xl flex items-center justify-between bg-background/30 backdrop-blur-sm border border-white/20 rounded-full py-2 pl-5 pr-3 text-sm text-left"
              >
                <span className="truncate text-muted-foreground">
                  {product.name}
                </span>
                <button
                  onClick={() => removeProduct(product.id)}
                  className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
                  aria-label={`Remove ${product.name} from comparison`}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HeroComponent;