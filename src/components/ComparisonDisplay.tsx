"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useComparison, useComparisonProducts } from "@/context/context";
import { X, Scale } from "lucide-react";

// Mobile: 8×8, Desktop: 12×12
const ITEM_AVATAR_CLASSES =
  "w-8 h-8 md:w-12 md:h-12 bg-secondary rounded-full " +
  "flex items-center justify-center overflow-hidden ring-2 ring-background";

// Glass-panel pill styles
const glassPanelPillClasses = `
  rounded-full bg-card shadow-lg
  dark:bg-black/30 dark:backdrop-blur-lg
  dark:border dark:border-white/20
  dark:shadow-lg dark:shadow-white/10
`;

const ComparisonDisplay: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [mounted, setMounted] = useState(false);

  const { removeProduct } = useComparison();
  const { products, isLoading } = useComparisonProducts();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isExpanded) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !document
          .querySelector(".comparison-container")
          ?.contains(e.target as Node)
      ) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mounted, isExpanded]);

  const toggleExpanded = () => setIsExpanded((v) => !v);

  const compareUrl = useMemo(() => {
    if (products.length < 2) return "#";
    const slugs = products
      .map((p) => p.slug)
      .filter(Boolean)
      .sort();
    return slugs.length >= 2 ? `/compare/${slugs.join("-vs-")}` : "#";
  }, [products]);

  if (!mounted || products.length === 0) return null;
  const canCompare = products.length >= 2 && compareUrl !== "#";

  return (
    <div
      className="comparison-container fixed bottom-4 right-4
                 md:bottom-8 md:right-8 flex flex-col items-end
                 gap-2 md:gap-3 z-50"
    >
      {isExpanded ? (
        // Expanded view
        <div className="flex flex-col gap-2 md:gap-3 transition-all duration-300">
          {isLoading && products.length === 0 ? (
            <div
              className={`w-full max-w-sm md:max-w-lg flex
                         items-center justify-center px-3 py-1
                         md:px-4 md:py-2 ${glassPanelPillClasses}`}
            >
              <span className="text-xs md:text-sm text-muted-foreground">
                Loading products...
              </span>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className={`w-full max-w-sm md:max-w-lg flex
                           items-center justify-between pl-2 pr-3
                           py-1 md:pl-3 md:pr-4 md:py-2
                           ${glassPanelPillClasses}`}
              >
                <div className="flex items-center gap-2 md:gap-4">
                  <div className={ITEM_AVATAR_CLASSES}>
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xs md:text-sm text-card-foreground">
                        {product.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    {/* Brand above, slightly smaller */}
                    <span
                      className="text-xs md:text-sm font-medium
                                 truncate max-w-28 md:max-w-56
                                 text-muted-foreground"
                    >
                      {product.brand}
                    </span>
                    {/* Product name below, main */}
                    <span
                      className="text-sm md:text-base
                                 truncate max-w-28 md:max-w-56
                                 text-card-foreground"
                    >
                      {product.name}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeProduct(product.id)}
                  className="p-1 md:p-2 hover:bg-accent/50 rounded-full"
                  aria-label="Remove item"
                >
                  <X className="text-muted-foreground w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            ))
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 md:gap-3 self-end">
            <Link href={canCompare ? compareUrl : "#"} passHref>
              <button
                disabled={!canCompare}
                className={`flex items-center justify-center
                            h-10 md:h-14 px-4 md:px-6
                            ${glassPanelPillClasses} ${
                  !canCompare ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Compare Products"
                aria-label="Compare products"
              >
                <Scale className="mr-1 md:mr-2 text-foreground w-3 h-3 md:w-5 md:h-5" />
                <span className="text-xs md:text-base font-medium text-foreground">
                  Compare
                </span>
              </button>
            </Link>
            <button
              onClick={toggleExpanded}
              className={`flex items-center justify-center
                          h-10 w-10 md:h-14 md:w-14
                          hover:bg-accent/50 ${glassPanelPillClasses}`}
              aria-label="Collapse comparison"
            >
              <X className="text-foreground w-4 h-4 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      ) : (
        // Collapsed view
        <div className="flex items-center gap-2 md:gap-3">
          <Link href={canCompare ? compareUrl : "#"} passHref>
            <button
              disabled={!canCompare}
              className={`relative overflow-hidden
                          w-8 h-8 md:w-12 md:h-12
                          transition-opacity duration-300
                          ${glassPanelPillClasses} ${
                !canCompare ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Compare Products"
              aria-label="Compare products"
            >
              {canCompare && (
                <div
                  className="absolute inset-0 w-full h-full
                             bg-[conic-gradient(from_180deg_at_50%_50%,#FF9933_0deg,#FFFFFF_120deg,#138808_240deg,#FF9933_360deg)]
                             animate-spin-slow"
                />
              )}
              <span className="absolute inset-[2px] flex items-center justify-center bg-card rounded-full hover:bg-transparent">
                <Scale className="text-foreground w-4 h-4 md:w-6 md:h-6" />
              </span>
            </button>
          </Link>
          <button
            onClick={toggleExpanded}
            className={`flex items-center p-1 md:p-2
                        ${glassPanelPillClasses} ${
              !isExpanded ? "animate-subtle-pulse" : ""
            }`}
            aria-label="View comparison items"
          >
            <div className="flex space-x-1 md:space-x-2">
              {products.slice(0, 4).map((p) => (
                <div key={p.id} className={ITEM_AVATAR_CLASSES}>
                  {p.image_url ? (
                    <Image
                      src={p.image_url}
                      alt={p.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xs md:text-base text-card-foreground">
                      {p.name.charAt(0)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ComparisonDisplay;