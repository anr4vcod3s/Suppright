// components/ProductCard.tsx
"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { ChevronDown, ExternalLink, X, AlertTriangle } from "lucide-react";
import { ProductSizeDetail } from "@/lib/hooks";

interface Certification {
  id: string;
  name: string;
  image_url?: string | null;
}

export interface ProductCardProps {
  product?: {
    id: string;
    name: string;
    brand: string;
    image_url?: string | null;
    certifications?: Certification[];
    product_sizes_details?: ProductSizeDetail[] | null;
  };
  comparisonMode?: boolean;
  onRemove?: (productId: string) => void;
  selectedSizeId?: string | null;
  onSizeChange?: (newSizeId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const PLACEHOLDER_IMAGE_LG = "/api/placeholder/400/400";
const PLACEHOLDER_CERT_IMAGE = "/api/placeholder/60/60";

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  comparisonMode = false,
  onRemove,
  selectedSizeId,
  onSizeChange,
  className = "",
  style = {},
}) => {
  // Hooks and logic remain the same...
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    currentDisplayPrice,
    currentDisplayRetailer,
    currentAffiliateLink,
    selectedSizeObject,
  } = useMemo(() => {
    const sizes = product?.product_sizes_details || [];
    const selectedDetail = sizes.find((s) => s.id === selectedSizeId);
    return {
      currentDisplayPrice: selectedDetail?.price ?? null,
      currentDisplayRetailer: selectedDetail?.retailer_name ?? null,
      currentAffiliateLink: selectedDetail?.affiliate_link ?? null,
      selectedSizeObject: selectedDetail,
    };
  }, [product?.product_sizes_details, selectedSizeId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as HTMLElement).closest(".size-dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  if (comparisonMode && (!product || !product.id || !product.name || !product.brand)) {
    return (
      <div className={`comparison-grid-cell flex flex-col items-center justify-center py-4 px-3 bg-white/5 dark:bg-black/10 backdrop-blur-sm text-center h-full min-h-[200px] rounded-lg ${className}`} style={style}>
        <AlertTriangle className="h-10 w-10 text-amber-500 dark:text-amber-400 mb-3" />
        <p className="text-sm text-gray-600 dark:text-gray-400">Product data unavailable.</p>
        {product?.id && onRemove && <button onClick={() => onRemove(product.id)} className="mt-3 text-xs text-red-500 hover:text-red-400">Remove Product</button>}
      </div>
    );
  }

  if (!product) {
    return <div className="w-full p-4 text-center text-gray-500 dark:text-gray-400 min-h-[300px] flex items-center justify-center">Product data loading...</div>;
  }

  const handleSizeChange = (sizeId: string) => {
    if (onSizeChange) onSizeChange(sizeId);
    setIsDropdownOpen(false);
  };

  const formattedProductName = `${product.brand} ${product.name}`;
  const availableSizesForDropdown = product.product_sizes_details || [];

  const PriceDisplay = () => (
    <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-gray-200 dark:from-gray-300 dark:via-indigo-800 dark:to-slate-800 py-2 px-2 md:py-2.5 md:px-4 rounded-full group-hover/price:scale-105 transition-transform duration-300">
      <div className="flex items-center space-x-2">
        <span className="font-bold text-white text-base md:text-lg tabular-nums">₹{currentDisplayPrice!.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
        {currentDisplayRetailer && <span className="hidden sm:inline text-sm md:text-base text-white/80 truncate max-w-[60px] md:max-w-[80px]">{currentDisplayRetailer}</span>}
        {currentAffiliateLink && <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/90" />}
      </div>
    </div>
  );

  const containerClass = comparisonMode ? `comparison-grid-cell relative justify-start p-2 pt-3 ${className}` : `w-full max-w-full lg:max-w-[320px] h-full flex flex-col text-left ${className}`;

  return (
    <div className={containerClass} style={style}>
      {comparisonMode && onRemove && (
        <button onClick={() => onRemove(product.id)} className="absolute top-2.5 right-2.5 rounded-full p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 bg-white/20 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/40 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 z-20 group" aria-label={`Remove ${product.name} from comparison`}>
          <X className="h-4 w-4 group-hover:scale-110 transition-transform" />
        </button>
      )}
      <div className={comparisonMode ? "w-full flex-grow flex items-start justify-center" : ""}>
        <div className={comparisonMode ? "w-full" : ""}>
          <div className="p-3 h-28 mb-2 flex flex-col justify-start">
            <div className="text-sm font-semibold md:font-bold italic text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{product.brand}</div>
            <h2 className="text-base md:text-xl font-semibold text-gray-800 dark:text-white leading-tight line-clamp-none">{product.name}</h2>
          </div>
          <div className="relative w-full h-[40vw] lg:h-80 mx-auto bg-gray-200/20 dark:bg-gray-700/20 overflow-hidden group transition-all duration-300">
            <Image src={product.image_url || PLACEHOLDER_IMAGE_LG} alt={formattedProductName} fill sizes="(max-width: 768px) 33vw, 250px" className="object-contain" priority={true} />
            <div className="absolute bottom-3 right-3 z-10">
              {currentDisplayPrice !== null ? (currentAffiliateLink ? <a href={currentAffiliateLink} target="_blank" rel="noopener noreferrer" className="block rounded-full shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer group/price"><PriceDisplay /></a> : <div className="block rounded-full shadow-lg transition-all duration-300 group/price"><PriceDisplay /></div>) : <div className="bg-gray-200/50 dark:bg-gray-700/50 border border-gray-300/30 dark:border-gray-600/30 py-2 px-4 rounded-full shadow-sm"><span className="text-base text-gray-600 dark:text-gray-300">N/A</span></div>}
            </div>
          </div>
          <div className="flex justify-center items-center py-2 size-dropdown-container">
            {availableSizesForDropdown.length > 0 && (
              <div className="relative">
                <button type="button" className="px-3.5 py-2 mt-2 border border-gray-300/60 dark:border-gray-600/60 rounded-full text-base font-medium text-gray-700 dark:text-gray-200 bg-white/40 dark:bg-black/50 hover:bg-white/60 dark:hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:ring-offset-2 focus:ring-offset-white/20 dark:focus:ring-offset-black/20 flex items-center min-w-[90px] justify-center transition-all duration-200 shadow-sm hover:shadow-md" onClick={() => setIsDropdownOpen(!isDropdownOpen)} aria-haspopup="listbox" aria-expanded={isDropdownOpen}>
                  <span className="truncate tabular-nums">{selectedSizeObject ? `${selectedSizeObject.size_kg}kg` : "Size"}</span>
                  <ChevronDown className={`w-4 h-4 ml-2 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-48 bg-white/80 dark:bg-black/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-600/50 rounded-lg shadow-2xl z-[6000] max-h-52 overflow-y-auto py-1">
                    {availableSizesForDropdown.map((sizeOpt) => (
                      <div key={sizeOpt.id} className={`px-3.5 py-2 text-sm hover:bg-indigo-500/10 dark:hover:bg-indigo-400/20 cursor-pointer text-gray-800 dark:text-gray-100 ${selectedSizeId === sizeOpt.id ? "bg-indigo-500/20 dark:bg-indigo-400/30 font-semibold" : ""} transition-colors duration-150 tabular-nums`} onClick={() => handleSizeChange(sizeOpt.id)} role="option" aria-selected={selectedSizeId === sizeOpt.id}>
                        {sizeOpt.size_kg} kg - ₹<span className="tabular-nums">{sizeOpt.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                        {sizeOpt.retailer_name && <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">({sizeOpt.retailer_name})</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="h-[72px] w-full flex items-center justify-center overflow-x-auto no-scrollbar">
            {product.certifications && product.certifications.length > 0 && (
              <div className="flex items-center justify-center flex-nowrap gap-4 md:gap-5">
                {product.certifications.map((cert) => (
                  <div key={cert.id} className="group relative flex-shrink-0 flex items-center justify-center w-16 h-16 md:w-[70px] md:h-[70px] rounded-full bg-white/30 dark:bg-black/40 backdrop-blur-sm border border-gray-300/30 dark:border-gray-600/30 hover:scale-105 transition-all duration-300" title={cert.name}>
                    <div className="relative w-11 h-11 md:w-12 md:h-12">
                      {/* FIX: Using the placeholder for certification images */}
                      <Image src={cert.image_url || PLACEHOLDER_CERT_IMAGE} alt={cert.name} fill sizes="70px" className="object-contain rounded-full p-1" />
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
                      <div className="bg-black/80 dark:bg-white/80 backdrop-blur-sm text-white dark:text-black text-sm px-2.5 py-1.5 rounded-md shadow-xl">{cert.name}</div>
                      <div className="w-2.5 h-2.5 bg-black/80 dark:bg-white/80 transform rotate-45 absolute -bottom-[5px] left-1/2 -translate-x-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;