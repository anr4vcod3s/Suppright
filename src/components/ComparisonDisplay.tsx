"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useComparison, useComparisonProducts } from "@/context/context";
import { X, Scale } from "lucide-react";

const ICON_BUTTON_CLASSES =
  "w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50";
const ITEM_AVATAR_CLASSES =
  "w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden";

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
    if (products.length < 2) {
      return "#";
    }
    const sortedSlugs = products
      .map((p) => p.slug)
      .filter(Boolean)
      .sort();
    if (sortedSlugs.length < 2) {
      return "#";
    }
    return `/compare/${sortedSlugs.join("-vs-")}`;
  }, [products]);

  if (!mounted || products.length === 0) {
    return null;
  }

  const canCompare = products.length >= 2 && compareUrl !== "#";

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center comparison-container z-50">
      {isExpanded ? (
        // --- EXPANDED VIEW ---
        <div className="flex flex-col gap-3 items-center">
          {isLoading && products.length === 0 ? (
            <div className="w-full max-w-md flex items-center justify-center bg-white rounded-full shadow-lg px-4 py-2">
              <span className="text-sm">Loading products...</span>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="w-full md:w-80 flex items-center justify-between bg-white rounded-full shadow-lg px-4 py-2"
              >
                <div className="flex items-center gap-3">
                  <div className={ITEM_AVATAR_CLASSES}>
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xs">
                        {product.name.substring(0, 1)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium truncate max-w-32 md:max-w-48">
                      {product.name}
                    </span>
                    <span className="text-xs text-gray-500 truncate max-w-32 md:max-w-48">
                      {product.brand}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeProduct(product.id)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  aria-label="Remove item"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}

          <div className="flex gap-3">
            <button
              onClick={toggleExpanded}
              className={ICON_BUTTON_CLASSES}
              aria-label="Collapse comparison"
            >
              <X size={20} />
            </button>
            <Link href={canCompare ? compareUrl : "#"} passHref>
              <button
                disabled={!canCompare}
                className={`w-auto h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 px-4 ${
                  !canCompare ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Compare Products"
                aria-label="Compare products"
              >
                <Scale size={16} className="mr-2" />
                <span className="text-sm font-medium">Compare</span>
              </button>
            </Link>
          </div>
        </div>
      ) : (
        // --- COLLAPSED VIEW ---
        <div className="flex items-center gap-3">
          <button
            onClick={toggleExpanded}
            className={`flex items-center gap-2 bg-white rounded-full shadow-lg px-3 py-2 ${
              !isExpanded ? "animate-subtle-pulse" : ""
            }`}
            aria-label="View comparison items"
          >
            <div className="flex justify-between items-center space-x-2">
              {products.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className={`${ITEM_AVATAR_CLASSES} border-2 border-white`}
                >
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xs">
                      {product.name.substring(0, 1)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </button>

          <Link href={canCompare ? compareUrl : "#"} passHref>
            <button
              disabled={!canCompare}
              className={`w-auto h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 px-4 ${
                !canCompare ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Compare Products"
              aria-label="Compare products"
            >
              <Scale size={16} className="mr-2" />
              <span className="text-sm font-medium">Compare</span>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ComparisonDisplay;