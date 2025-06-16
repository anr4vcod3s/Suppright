// src/components/ComparisonDisplay.tsx
"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useComparison, useComparisonProducts } from "@/context/context";
import { X, Scale } from "lucide-react";

const ICON_BUTTON_CLASSES =
  "w-12 h-12 flex items-center justify-center rounded-full bg-card shadow-lg hover:bg-accent text-foreground";

const ITEM_AVATAR_CLASSES =
  "w-12 h-12 bg-secondary rounded-full flex items-center justify-center overflow-hidden ring-2 ring-background";

const ComparisonDisplay = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { removeProduct } = useComparison();
  const { products, isLoading } = useComparisonProducts();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isExpanded) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!document.querySelector(".comparison-container")?.contains(target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded, mounted]);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const compareUrl = useMemo(() => {
    if (products.length < 2) return "#";
    const sortedSlugs = products.map((p) => p.slug).filter(Boolean).sort();
    if (sortedSlugs.length < 2) return "#";
    return `/compare/${sortedSlugs.join("-vs-")}`;
  }, [products]);

  if (!mounted || products.length === 0) {
    return null;
  }

  const canCompare = products.length >= 2 && compareUrl !== "#";

  return (
    // This is the main container, correctly positioned and aligned.
    <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 comparison-container z-50">
      {isExpanded ? (
        // --- EXPANDED VIEW ---
        <div
          className="
            flex flex-col gap-3 transition-all duration-300
            dark:bg-black/30 dark:backdrop-blur-lg dark:p-4 dark:rounded-2xl
            dark:border dark:border-white/20 dark:shadow-lg
          "
        >
          {isLoading && products.length === 0 ? (
            <div className="w-full max-w-md flex items-center justify-center bg-card rounded-full shadow-lg px-4 py-2">
              <span className="text-sm text-muted-foreground">
                Loading products...
              </span>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="w-full md:w-96 flex items-center justify-between bg-card rounded-full shadow-lg pl-3 pr-4 py-2"
              >
                <div className="flex items-center gap-4">
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
                      <span className="text-sm text-card-foreground">
                        {product.name.substring(0, 1)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-medium truncate max-w-48 md:max-w-64 text-card-foreground">
                      {product.name}
                    </span>
                    <span className="text-sm text-muted-foreground truncate max-w-48 md:max-w-64">
                      {product.brand}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeProduct(product.id)}
                  className="p-2 hover:bg-accent rounded-full"
                  aria-label="Remove item"
                >
                  <X size={20} className="text-muted-foreground" />
                </button>
              </div>
            ))
          )}

          <div className="flex gap-3 self-end">
            <Link href={canCompare ? compareUrl : "#"} passHref>
              <button
                disabled={!canCompare}
                className={`w-auto h-12 flex items-center justify-center rounded-full bg-card shadow-lg hover:bg-accent px-6 ${
                  !canCompare ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Compare Products"
                aria-label="Compare products"
              >
                <Scale size={20} className="mr-2" />
                <span className="text-base font-medium text-foreground">
                  Compare
                </span>
              </button>
            </Link>
            <button
              onClick={toggleExpanded}
              className={ICON_BUTTON_CLASSES}
              aria-label="Collapse comparison"
            >
              <X size={24} />
            </button>
            
          </div>
        </div>
      ) : (
        // --- COLLAPSED VIEW ---
        <div className="flex items-center gap-3">
          <Link href={canCompare ? compareUrl : "#"} passHref>
            <button
              disabled={!canCompare}
              className={`
                relative w-12 h-12 rounded-full overflow-hidden shadow-lg border border-border
                transition-opacity duration-300
                ${!canCompare ? "opacity-50 cursor-not-allowed" : ""}
              `}
              title="Compare Products"
              aria-label="Compare products"
            >
              {canCompare && (
                <div className="absolute inset-0 w-full h-full bg-[conic-gradient(from_180deg_at_50%_50%,#FF9933_0deg,#FFFFFF_120deg,#138808_240deg,#FF9933_360deg)] animate-spin-slow" />
              )}
              <span className="absolute inset-[2px] w-auto h-auto flex items-center justify-center bg-card rounded-full hover:bg-transparent">
                <Scale size={24} className="text-foreground" />
              </span>
            </button>
          </Link>
          
          <button
            onClick={toggleExpanded}
            className={`flex items-center bg-card rounded-full shadow-lg p-2 border border-border ${
              !isExpanded ? "animate-subtle-pulse" : ""
            }`}
            aria-label="View comparison items"
          >
            <div className="flex space-x-2">
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className={ITEM_AVATAR_CLASSES}>
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-base text-card-foreground">
                      {product.name.substring(0, 1)}
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