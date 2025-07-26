// components/MetricRow.tsx
import React from "react";
import { ComparisonProductData } from "@/lib/hooks";
import { MetricConfig } from "./ComparisonTable";
import { MetricCell } from "./MetricCell";
import { Info } from "lucide-react";

interface MetricRowProps {
  metric: MetricConfig;
  products: ComparisonProductData[];
  gridContainerClasses: string;
  gridStyle: React.CSSProperties;
}

export const MetricRow: React.FC<MetricRowProps> = ({
  metric,
  products,
  gridContainerClasses,
  gridStyle,
}) => {
  return (
    <div className="even:bg-white/5 even:dark:bg-black/5 backdrop-blur-sm">
      {/* Label Section */}
      <div
        className="sticky left-0 z-10 flex-none font-semibold flex justify-center items-center group px-3 sm:px-5 lg:px-7 bg-inherit backdrop-blur-sm"
        title={metric.description}
      >
        <div className="w-full sm:w-4/5 lg:w-3/5 flex justify-center items-center text-center px-4 py-3 sm:px-5 sm:py-3.5 lg:px-6 lg:py-4 rounded-full border border-gray-400/20 dark:border-gray-700 bg-white/5 dark:bg-black/10 shadow-sm">
          <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent text-lg sm:text-xl lg:text-2xl">
            {metric.label}
          </span>
          {metric.description && (
            <Info
              className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-500 ml-2.5 sm:ml-3 lg:ml-4 opacity-60 group-hover:opacity-100 transition-opacity cursor-help flex-shrink-0"
            />
          )}
        </div>
      </div>

      {/* Values Section */}
      <div
        className={`${gridContainerClasses} min-h-[100px] sm:min-h-[110px] lg:min-h-[120px]`}
        style={gridStyle}
      >
        {products.map((product, index) => (
          <div
            key={`${metric.id}-${product.id}`}
            className={`flex py-4 items-stretch justify-center hover:bg-white/10 dark:hover:bg-black/10 transition-colors duration-200 ${
              index < products.length - 1
                ? "border-r border-gray-400/20 dark:border-gray-700"
                : ""
            }`}
          >
            <MetricCell product={product} metric={metric} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
};