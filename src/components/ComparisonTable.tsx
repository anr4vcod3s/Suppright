// components/ComparisonTable.tsx
import React, { useMemo, useState, useEffect, lazy, Suspense } from "react";
import { useComparisonProducts, useComparison } from "@/context/context";
import ProductCard from "./ProductCard";
import { MetricRow } from "./MetricRow";
import {
  Loader2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Info,
  AlertTriangle,
  Settings2,
} from "lucide-react";
import { ComparisonProductData } from "@/lib/hooks";

const RadarChartSection = lazy(() => import("./RadarChartSection"));

export interface MetricConfig {
  id: string;
  label: string;
  path?: string;
  type: string;
  unit?: string;
  description?: string;
}

interface RadarChartDataPoint {
  amino: string;
  [productName: string]: string | number;
}

const allMetrics: MetricConfig[] = [
  { id: "price_per_gram_protein", label: "Price per Gram Protein", path: "price_per_protein_g", type: "number", unit: "₹", description: "Cost effectiveness based on protein content." },
  { id: "price_per_serving_pvm", label: "Price per Serving", path: "price_per_serving", type: "number", unit: "₹", description: "Estimated price per serving based on the most popular size." },
  { id: "macros_profile_visual", label: "Macronutrient Profile", type: "macros", description: "Visual breakdown of Protein, Carbs, and Fats." },
  { id: "protein_serving_info", label: "Protein / Serving Size", type: "protein_serving_display", description: "Amount of protein per recommended serving." },
  { id: "servings_per_container", label: "Servings Per Container", path: "servings_per_container", type: "number", description: "Total servings in one product unit." },
  { id: "calories", label: "Calories per Serving", path: "calories", type: "number", unit: "kcal", description: "Energy value per serving." },
  { id: "cholesterol", label: "Cholesterol per Serving", path: "cholesterol_mg", type: "number", unit: "mg", description: "Cholesterol content per serving." },
  { id: "bcaas", label: "BCAAs", path: "total_bcaas_g", type: "number", unit: "g", description: "Total Branched-Chain Amino Acids per serving." },
  { id: "eaas_section", label: "EAAs", path: "total_eaas_g", type: "number", unit: "g", description: "Total Essential Amino Acids per serving. Click below to compare detailed profiles." },
  { id: "flavors", label: "Available Flavors", type: "flavors_display", description: "Variety of flavors offered for the product." },
  { id: "protein_source", label: "Protein Source", path: "protein_source", type: "text", description: "Primary source(s) of protein." },
  { id: "filtration_process", label: "Filtration Process", path: "filtration_process", type: "text", description: "Method used to process and filter the protein." },
  { id: "dietary_info_summary", label: "Dietary Information", type: "dietary_summary_conditional", description: "Summary of dietary flags and allergens." },
  { id: "additional_compounds", label: "Additional Compounds", type: "additional_compounds_display", description: "Notable added ingredients or compounds." },
];

const priceMetrics = allMetrics.filter((m) => m.id.startsWith("price"));
const generalMetrics = allMetrics.filter((m) => !m.id.startsWith("price"));

const ComparisonTable: React.FC = () => {
  const { products, isLoading, error } = useComparisonProducts();
  const { removeProduct } = useComparison();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string | null>>({});
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [showIndividualRadarChart, setShowIndividualRadarChart] = useState(false);

  // FIX: Define a constant for the header height to correctly position the sticky button.
  const productCardHeight = 480;

  const gridContainerClasses = useMemo(() => {
    const count = products.length || 1;
    const isMoreThanThree = count > 3;
    let mobileColsClass = "grid-cols-1";
    if (count === 2) mobileColsClass = "grid-cols-2";
    else if (count >= 3) mobileColsClass = "grid-cols-3";
    const scrollCols = "grid-flow-col auto-cols-[calc((100vw-1rem)/3)]";
    return `grid ${isMoreThanThree ? scrollCols : mobileColsClass} gap-2 lg:grid-flow-row lg:grid-cols-[repeat(var(--num-products,1),minmax(0,1fr))] lg:gap-0`;
  }, [products.length]);

  const gridStyle = useMemo(() => ({
    "--num-products": products.length || 1,
    // Pass the height as a CSS variable for the button's sticky position
    "--product-card-height": `${productCardHeight}px`,
  } as React.CSSProperties), [products.length]);

  useEffect(() => {
    const newSelectedSizes: Record<string, string | null> = {};
    for (const product of products) {
      newSelectedSizes[product.id] = product.product_sizes_details?.[0]?.id || null;
    }
    setSelectedSizes(newSelectedSizes);
  }, [products]);

  const handleSizeSelectionChange = (productId: string, newSizeId: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: newSizeId }));
  };

  const prepareRadarChartData = () => {
    // ... (data preparation logic remains the same)
    if (!products || products.length === 0) return { data: [], productNames: [], colors: [] };
    const aminoAcidsForChart = [
      { key: "leucine_g", label: "Leucine" }, { key: "isoleucine_g", label: "Isoleucine" }, { key: "valine_g", label: "Valine" },
      { key: "histidine_g", label: "Histidine" }, { key: "lysine_g", label: "Lysine" }, { key: "methionine_g", label: "Methionine" },
      { key: "phenylalanine_g", label: "Phenylalanine" }, { key: "threonine_g", label: "Threonine" }, { key: "tryptophan_g", label: "Tryptophan" },
    ] as { key: keyof ComparisonProductData; label: string }[];
    const productNames = products.map((p) => p.name || "Unknown Product");
    const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];
    const data = aminoAcidsForChart.map((amino) => {
      const dataPoint: RadarChartDataPoint = { amino: amino.label };
      products.forEach((p) => {
        const aminoValue = p[amino.key];
        dataPoint[p.name || "Unknown"] = typeof aminoValue === "number" ? aminoValue : 0;
      });
      return dataPoint;
    });
    return { data, productNames, colors };
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="h-12 w-12 animate-spin" /></div>;
  if (error) return <div className="flex flex-col items-center p-20 text-red-500"><AlertTriangle className="h-12 w-12 mb-4" />Error loading data.</div>;
  if (products.length === 0) return <div className="flex flex-col items-center p-20 text-gray-500"><Info className="h-12 w-12 mb-4" />Add products to compare.</div>;

  return (
    <div className="relative w-full mx-auto rounded-lg overflow-hidden bg-white/20 dark:bg-black/20 backdrop-blur-xl p-2 md:p-3 my-8 md:my-12">
      <div className="comparison-table-scrollbar overflow-x-auto relative rounded-xl border border-gray-300 dark:border-gray-700">
        {/* This wrapper ensures all content scrolls horizontally together */}
        <div className="w-full lg:w-full">
          {/* FIX: The header section is now sticky */}
          <div className="sticky top-0 z-20 bg-white/10 dark:bg-black/10 backdrop-blur-lg" style={gridStyle}>
            <div className={gridContainerClasses}>
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  comparisonMode={true}
                  onRemove={removeProduct}
                  selectedSizeId={selectedSizes[product.id] || null}
                  onSizeChange={(newSizeId) => handleSizeSelectionChange(product.id, newSizeId)}
                  className={`scroll-snap-align-start lg:scroll-snap-align-none ${index < products.length - 1 ? "border-r border-gray-300 dark:border-gray-700" : ""}`}
                  style={{ minHeight: `var(--product-card-height)` }}
                />
              ))}
            </div>
          </div>

          {/* FIX: The button is also sticky, positioned below the header */}
          <div
            className="text-center py-3.5 sm:py-4 sticky z-10 bg-white/30 dark:bg-black/30 backdrop-blur-md"
            style={{ top: `var(--product-card-height)` }}
          >
            <button onClick={() => setShowPriceDetails(!showPriceDetails)} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-black/60 hover:bg-white/80 dark:hover:bg-black/80 border border-gray-300/20 shadow-md hover:shadow-lg transition-all">
              <DollarSign className="w-5 h-5" />
              <span>{showPriceDetails ? "Hide Price Analysis" : "Show Price & Value Analysis"}</span>
              {showPriceDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {/* The metrics will now scroll underneath the sticky elements */}
          <div>
            {showPriceDetails && priceMetrics.map((metric) => (
              <MetricRow key={metric.id} metric={metric} products={products} gridContainerClasses={gridContainerClasses} gridStyle={gridStyle} />
            ))}
            {generalMetrics.map((metric) => (
              <React.Fragment key={metric.id}>
                <MetricRow metric={metric} products={products} gridContainerClasses={gridContainerClasses} gridStyle={gridStyle} />
                {metric.id === "eaas_section" && products.length > 0 && (
                  <div className="col-span-full py-4 text-center">
                    <button onClick={() => setShowIndividualRadarChart(!showIndividualRadarChart)} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 shadow-sm transition-all">
                      <Settings2 className="w-5 h-5" />
                      <span>Compare Amino Profiles</span>
                      {showIndividualRadarChart ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    {showIndividualRadarChart && (
                      <div className="overflow-hidden bg-white/10 dark:bg-black/10 backdrop-blur-md p-3 sm:p-4 md:p-6 shadow-inner mt-4">
                        <Suspense fallback={<div className="min-h-[300px] flex items-center justify-center">Loading Chart...</div>}>
                          <RadarChartSection {...prepareRadarChartData()} />
                        </Suspense>
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;