// components/MetricCell.tsx
import React, { Suspense, lazy } from "react";
import { ComparisonProductData } from "@/lib/hooks";
import { MetricConfig } from "./ComparisonTable";
import { getNestedValue } from "@/lib/comparisonUtils";
import { LazyLoadWrapper } from "@/lib/LazyLoadWrapper";
import { CheckCircle } from "lucide-react";

// Dynamically import the heavy/custom components
const MacrosCell = lazy(() =>
  import("./ui/MacrosCell").then((module) => ({ default: module.MacrosCell }))
);
const ShimmeringHoverInfoCard = lazy(() =>
  import("./ui/HoverInfoCard")
);

interface MetricCellProps {
  product: ComparisonProductData;
  metric: MetricConfig;
  index: number;
}

const CellPlaceholder = ({ minHeight = "120px" }) => (
  <div
    className="h-full w-full flex items-center justify-center"
    style={{ minHeight }}
  />
);

export const MetricCell: React.FC<MetricCellProps> = ({
  product,
  metric,
  index,
}) => {
  const value = metric.path ? getNestedValue(product, metric.path) : undefined;

  // This is our new standard container for consistent padding and alignment.
  const cellWrapper = (content: React.ReactNode) => (
    <div className="py-4 pl-8 px-5 h-full w-full flex flex-col items-start justify-center text-left">
      {content}
    </div>
  );

  switch (metric.type) {
    // Custom graphical components can keep their own layout (e.g., centered)
    case "macros":
      return (
        <LazyLoadWrapper placeholder={<CellPlaceholder minHeight="140px" />}>
          <Suspense fallback={<CellPlaceholder minHeight="140px" />}>
            <MacrosCell product={product} index={index} />
          </Suspense>
        </LazyLoadWrapper>
      );

    // --- Start of Standardized Cells ---

    case "protein_serving_display":
      const proteinG = product.protein_g;
      const servingSize = product.serving_size;
      if (proteinG == null || servingSize == null) {
        return cellWrapper(<span className="text-gray-500 italic">N/A</span>);
      }
      return cellWrapper(
        <>
          <span className="text-xl font-semibold text-gray-800 dark:text-white tabular-nums">
            {proteinG.toFixed(1)}g
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            per {servingSize}g serving
          </span>
        </>
      );

    case "number":
    case "percentage":
      const numValue = Number(value);
      if (value == null || isNaN(numValue)) {
        return cellWrapper(<span className="text-gray-500 italic">N/A</span>);
      }
      return cellWrapper(
        <>
          <span className="text-xl font-semibold text-gray-800 dark:text-white tabular-nums">
            {numValue.toLocaleString(undefined, {
              minimumFractionDigits: Number.isInteger(numValue) ? 0 : 1,
              maximumFractionDigits: 1,
            })}
            {metric.type === "percentage" && "%"}
          </span>
          {metric.unit && (
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {metric.unit}
            </span>
          )}
        </>
      );

    case "text":
      if (!value) {
        return cellWrapper(<span className="text-gray-500 italic">N/A</span>);
      }
      return cellWrapper(
        <span className="text-base font-medium text-gray-800 dark:text-white">
          {String(value)}
        </span>
      );

    // ==================== THIS IS THE FIX ====================
    case "flavors_display":
      const flavors = product.flavors_list || [];
      if (flavors.length === 0) {
        return cellWrapper(<span className="text-gray-500 italic">N/A</span>);
      }
      // We now map over the entire `flavors` array to display all of them.
      // The container uses `justify-start` to align the list to the top,
      // which looks better for potentially long lists.
      return (
        <div className="py-4 px-5 h-full w-full flex flex-col items-start justify-start text-left">
          <div className="flex flex-col items-start space-y-1">
            {flavors.map((flavor, i) => (
              <span key={i} className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {flavor}
              </span>
            ))}
          </div>
        </div>
      );
    // =========================================================

    case "dietary_summary_conditional":
      const trueDietaryFlags = [
        product.gluten_free && { label: "Gluten-Free" },
        product.soy_free && { label: "Soy-Free" },
        product.vegetarian && { label: "Vegetarian" },
        product.vegan && { label: "Vegan" },
        product.keto_friendly && { label: "Keto-Friendly" },
      ].filter(Boolean) as { label: string }[];
      const hasAllergens = (product.allergens_list ?? []).length > 0;
      if (trueDietaryFlags.length === 0 && !hasAllergens) {
        return cellWrapper(<span className="text-gray-500 italic">No specific dietary info</span>);
      }
      return cellWrapper(
        <div className="flex flex-col items-start space-y-2">
          {trueDietaryFlags.map((f) => (
            <div key={f.label} className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{f.label}</span>
            </div>
          ))}
          {hasAllergens && (
            <div className={`w-full pt-2 ${trueDietaryFlags.length > 0 ? "mt-2 border-t border-gray-300/30 dark:border-gray-700/40" : ""}`}>
              <div className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">Allergens:</div>
              <ul className="list-none space-y-1">
                {product.allergens_list!.map((a, i) => (
                  <li key={i} className="text-xs text-gray-600 dark:text-gray-300">{a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );

    case "additional_compounds_display":
      const compoundsMap = product.additional_compounds_map;
      if (!compoundsMap || Object.keys(compoundsMap).length === 0) {
        return cellWrapper(<span className="text-gray-500 italic">N/A</span>);
      }
      // This is a graphical/tag element, so centered layout is acceptable here.
      return (
        <div className="py-4 px-3 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 min-h-[100px]">
          {Object.entries(compoundsMap).map(([name, val], i) => (
            <LazyLoadWrapper key={i} placeholder={<div className="h-6 w-24 bg-gray-200/50 dark:bg-gray-700/50 rounded-md animate-pulse" />}>
              <Suspense fallback={null}>
                <ShimmeringHoverInfoCard infoContent={`${name}: ${val}`}>{name}</ShimmeringHoverInfoCard>
              </Suspense>
            </LazyLoadWrapper>
          ))}
        </div>
      );

    default:
      return cellWrapper(<span className="text-red-500 italic">Invalid Metric</span>);
  }
};