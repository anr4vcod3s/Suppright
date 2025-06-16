import React from "react";
import { X, AlertTriangle } from "lucide-react";
import { ComparisonProductData } from "@/lib/hooks";
import ProductCard from "./ProductCard";

interface ComparisonColumnProps {
  product?: ComparisonProductData | null;
  onRemove: (productId: string) => void;
  className?: string;
  style?: React.CSSProperties;
  selectedSizeId: string | null;
  onSizeChange: (productId: string, newSizeId: string) => void;
}

const ComparisonColumn: React.FC<ComparisonColumnProps> = ({
  product,
  onRemove,
  className = "",
  style = {},
  selectedSizeId,
  onSizeChange,
}) => {
  const baseClasses =
    "comparison-grid-cell flex flex-col items-center justify-center";

  if (!product || !product.id || !product.name || !product.brand) {
    return (
      <div
        className={`${baseClasses} ${className} py-4 px-3 bg-white/5 dark:bg-black/10 backdrop-blur-sm text-center h-full min-h-[200px] rounded-lg`}
        style={style}
      >
        <AlertTriangle className="h-10 w-10 text-amber-500 dark:text-amber-400 mb-3" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Product data unavailable.
        </p>
        {product?.id && (
          <button
            onClick={() => onRemove(product.id)}
            className="mt-3 text-xs text-red-500 hover:text-red-400 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          >
            Remove Product
          </button>
        )}
      </div>
    );
  }

  const productCardDataForHeader = {
    id: product.id,
    name: product.name,
    brand: product.brand,
    image_url: product.image_url,
    certifications: product.product_specific_certifications || [],
    product_sizes: product.product_sizes_details || [],
  };

  return (
    <div
      className={`${baseClasses} ${className} relative justify-start p-2 pt-3`}
      style={style}
    >
      <button
        onClick={() => onRemove(product.id)}
        className="absolute top-2.5 right-2.5 rounded-full p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 bg-white/20 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/40 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 z-20 group"
        aria-label={`Remove ${product.name} from comparison`}
      >
        <X className="h-4 w-4 group-hover:scale-110 transition-transform" />
      </button>
      <div className="w-full flex-grow flex items-start justify-center">
        <ProductCard
          product={productCardDataForHeader}
          selectedSizeId={selectedSizeId}
          onSizeChange={(newSizeId) => onSizeChange(product.id, newSizeId)}
        />
      </div>
    </div>
  );
};

export default ComparisonColumn;