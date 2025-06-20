// components/ComparisonTable.tsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useComparisonProducts, useComparison } from "@/context/context";
import ComparisonColumn from "./ComparisonColumn";
import {
  Loader2,
  ChevronDown,
  ChevronUp,
  Settings2,
  Info,
  AlertTriangle,
  Check,
  X,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { getNestedValue as getNestedPathValue } from "@/lib/comparisonUtils";
import { ComparisonProductData } from "@/lib/hooks";
import RadarChartSection from "./RadarChartSection";
import { MacrosCell } from "./ui/MacrosCell";
import { ScrollBasedTracingBeam } from "./ui/ScrollBasedTracingBeam";
import { ShimmeringHoverInfoCard } from "./ui/HoverInfoCard";

interface RadarChartDataPoint {
  amino: string;
  [productName: string]: string | number;
}

type TableMetricType =
  | "number"
  | "text"
  | "boolean"
  | "macros"
  | "protein_serving_display"
  | "flavors_display"
  | "dietary_summary_conditional"
  | "additional_compounds_display";

interface MetricConfig {
  id: string;
  label: string;
  path?: string;
  type: TableMetricType;
  unit?: string;
  description?: string;
}

const ComparisonTable: React.FC = () => {
  const { products, isLoading, error } = useComparisonProducts();
  const isMoreThanThree = products.length > 3; // otherwise fixed 1–3 columns
  const mobileColsClass =
    products.length === 1
      ? "grid-cols-1"
      : products.length === 2
      ? "grid-cols-2"
      : "grid-cols-3";

  const scrollCols = "grid-flow-col auto-cols-[calc((100vw-1rem)/3)]";

  const { removeProduct } = useComparison();
  const [showIndividualRadarChart, setShowIndividualRadarChart] =
    useState(false);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<
    Record<string, string | null>
  >({});
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const productCardHeight = 480;

  const gridContainerClasses = [
    "grid",
    isMoreThanThree ? scrollCols : mobileColsClass,
    "gap-2",
    "lg:grid-flow-row",
    "lg:grid-cols-[repeat(var(--num-products,1),minmax(0,1fr))]",
    "lg:gap-0",
  ].join(" ");

  const gridStyle = useMemo(
    () =>
      ({
        "--num-products": products.length || 1,
        "--product-card-height": `${productCardHeight}px`,
      } as React.CSSProperties),
    [products.length, productCardHeight]
  );

  useEffect(() => {
    if (!products || products.length === 0) {
      setSelectedSizes({});
      return;
    }
    const allProductSizes: Set<number>[] = products.map(
      (p) => new Set(p.product_sizes_details?.map((s) => s.size_kg) || [])
    );
    const commonSizesKg = allProductSizes.reduce((common, current) => {
      return new Set([...common].filter((size) => current.has(size)));
    });
    const targetCommonSize =
      commonSizesKg.size > 0 ? [...commonSizesKg][0] : null;
    setSelectedSizes((prevSelectedSizes) => {
      const newSelectedSizes: Record<string, string | null> = {};
      let stateChanged = false;
      for (const product of products) {
        let targetSizeId: string | null = null;
        if (targetCommonSize !== null) {
          targetSizeId =
            product.product_sizes_details?.find(
              (s) => s.size_kg === targetCommonSize
            )?.id || null;
        } else {
          targetSizeId =
            prevSelectedSizes[product.id] ||
            product.product_sizes_details?.find((s) => s.is_popular)?.id ||
            product.product_sizes_details?.[0]?.id ||
            null;
        }
        newSelectedSizes[product.id] = targetSizeId;
        if (prevSelectedSizes[product.id] !== targetSizeId) {
          stateChanged = true;
        }
      }
      if (
        stateChanged ||
        Object.keys(prevSelectedSizes).length !== products.length
      ) {
        return newSelectedSizes;
      }
      return prevSelectedSizes;
    });
  }, [products]);

  const handleSizeSelectionChange = (productId: string, newSizeId: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: newSizeId }));
  };

  const allMetrics: MetricConfig[] = [
    {
      id: "price_per_gram_protein",
      label: "Price per Gram Protein",
      path: "price_per_protein_g",
      type: "number",
      unit: "₹",
      description: "Cost effectiveness based on protein content.",
    },
    {
      id: "price_per_serving_pvm",
      label: "Price per Serving",
      path: "price_per_serving",
      type: "number",
      unit: "₹",
      description:
        "Estimated price per serving based on the most popular size.",
    },
    {
      id: "macros_profile_visual",
      label: "Macronutrient Profile",
      type: "macros",
      description: "Visual breakdown of Protein, Carbs, and Fats.",
    },
    {
      id: "protein_serving_info",
      label: "Protein / Serving Size",
      type: "protein_serving_display",
      description: "Amount of protein per recommended serving.",
    },
    {
      id: "servings_per_container",
      label: "Servings Per Container",
      path: "servings_per_container",
      type: "number",
      description: "Total servings in one product unit.",
    },
    {
      id: "calories",
      label: "Calories per Serving",
      path: "calories",
      type: "number",
      unit: "kcal",
      description: "Energy value per serving.",
    },
    {
      id: "cholesterol",
      label: "Cholesterol per Serving",
      path: "cholesterol_mg",
      type: "number",
      unit: "mg",
      description: "Cholesterol content per serving.",
    },
    {
      id: "bcaas",
      label: "BCAAs",
      path: "total_bcaas_g",
      type: "number",
      unit: "g",
      description: "Total Branched-Chain Amino Acids per serving.",
    },
    {
      id: "eaas_section",
      label: "EAAs",
      path: "total_eaas_g",
      type: "number",
      unit: "g",
      description:
        "Total Essential Amino Acids per serving. Click below to compare detailed profiles.",
    },
    {
      id: "flavors",
      label: "Available Flavors",
      type: "flavors_display",
      description: "Variety of flavors offered for the product.",
    },
    {
      id: "protein_source",
      label: "Protein Source",
      path: "protein_source",
      type: "text",
      description: "Primary source(s) of protein.",
    },
    {
      id: "filtration_process",
      label: "Filtration Process",
      path: "filtration_process",
      type: "text",
      description: "Method used to process and filter the protein.",
    },
    
    {
      id: "dietary_info_summary",
      label: "Dietary Information",
      type: "dietary_summary_conditional",
      description: "Summary of dietary flags and allergens.",
    },
    {
      id: "additional_compounds",
      label: "Additional Compounds",
      type: "additional_compounds_display",
      description: "Notable added ingredients or compounds.",
    },
  ];

  const priceMetricIds = ["price_per_gram_protein", "price_per_serving_pvm"];
  const priceMetrics = allMetrics.filter((m) => priceMetricIds.includes(m.id));
  const generalMetrics = allMetrics.filter(
    (m) => !priceMetricIds.includes(m.id)
  );

  const prepareRadarChartData = (): {
    data: RadarChartDataPoint[];
    productNames: string[];
    colors: string[];
  } => {
    if (!products || products.length === 0)
      return { data: [], productNames: [], colors: [] };
    const aminoAcidsForChart = [
      { key: "leucine_g", label: "Leucine" },
      { key: "isoleucine_g", label: "Isoleucine" },
      { key: "valine_g", label: "Valine" },
      { key: "histidine_g", label: "Histidine" },
      { key: "lysine_g", label: "Lysine" },
      { key: "methionine_g", label: "Methionine" },
      { key: "phenylalanine_g", label: "Phenylalanine" },
      { key: "threonine_g", label: "Threonine" },
      { key: "tryptophan_g", label: "Tryptophan" },
    ] as { key: keyof ComparisonProductData; label: string }[];
    const productNames = products.map((p) => p.name || "Unknown Product");
    const colors = [
      "#3B82F6",
      "#EF4444",
      "#10B981",
      "#F59E0B",
      "#8B5CF6",
      "#EC4899",
    ];
    const data: RadarChartDataPoint[] = aminoAcidsForChart.map((amino) => {
      const dataPoint: RadarChartDataPoint = { amino: amino.label };
      products.forEach((p) => {
        const aminoValue = p[amino.key];
        dataPoint[p.name || "Unknown"] =
          typeof aminoValue === "number" ? aminoValue : 0;
      });
      return dataPoint;
    });
    return { data, productNames, colors };
  };

  const renderMetricValue = (
    metric: MetricConfig,
    product: ComparisonProductData,
    productIndex: number
  ): React.ReactNode => {
    const value = metric.path
      ? getNestedPathValue(product, metric.path)
      : undefined;

    const simpleValueCellWrapper = (content: React.ReactNode) => (
      <div className="py-4 sm:py-5 lg:py-6 px-3 sm:px-4 lg:px-5 text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-200 h-full flex items-center justify-center text-center">
        {content}
      </div>
    );

    const renderSplitDecimalNumber = (
      num: number | string,
      baseClasses: string,
      fractionalClasses: string
    ) => {
      const numStr = String(num);
      const parts = numStr.split(".");
      const integerPart = parts[0];
      const fractionalPart = parts[1];

      return (
        <span className={`${baseClasses} tabular-nums`}>
          {integerPart}
          {fractionalPart && (
            <>
              <span className="text-gray-500 dark:text-gray-400">.</span>
              <span className={fractionalClasses}>{fractionalPart}</span>
            </>
          )}
        </span>
      );
    };

    const renderNumericValue = (
      val: number | null | undefined,
      unit?: string,
      isCurrency: boolean = false
    ) => {
      if (val == null || isNaN(val)) {
        return (
          <span className="text-gray-500 dark:text-gray-400 italic">N/A</span>
        );
      }

      return (
        <div className="flex items-baseline justify-center gap-1.5">
          {isCurrency && (
            <span className="font-medium text-2xl sm:text-3xl text-gray-800 dark:text-white tabular-nums">
              {unit}
            </span>
          )}
          {renderSplitDecimalNumber(
            val.toFixed(isCurrency ? 2 : 1),
            "font-normal text-3xl sm:text-4xl text-gray-800 dark:text-white",
            "text-2xl sm:text-3xl text-gray-500 dark:text-gray-400"
          )}
          {!isCurrency && unit && (
            <span className="font-medium text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              {unit}
            </span>
          )}
        </div>
      );
    };

    switch (metric.type) {
      case "macros":
        return <MacrosCell product={product} index={productIndex} />;
      case "protein_serving_display":
        const proteinG = product.protein_g;
        const servingSize = product.serving_size;
        if (proteinG == null || servingSize == null)
          return simpleValueCellWrapper(
            <span className="text-gray-500 dark:text-gray-400 italic">N/A</span>
          );
        return simpleValueCellWrapper(
          <div>
            {renderSplitDecimalNumber(
              proteinG.toFixed(1),
              "font-normal text-3xl sm:text-4xl text-gray-800 dark:text-white",
              "text-2xl sm:text-3xl text-gray-500 dark:text-gray-400"
            )}
            <span className="font-medium text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              g
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-base sm:text-lg tabular-nums">
              {" "}
              / {servingSize}g
            </span>
          </div>
        );
      case "flavors_display":
        const flavors = product.flavors_list || [];
        if (flavors.length === 0) {
          return simpleValueCellWrapper(
            <span className="text-gray-500 dark:text-gray-400 italic">N/A</span>
          );
        }
        return (
          <div
            className="
        py-5 px-4 text-xs sm:text-sm
        lg:py-4 lg:px-3 lg:text-base
        h-full flex items-start justify-center
        lg:items-center lg:justify-center
      "
          >
            <ul
              className="
          list-none text-left w-full
          pl-3 lg:pl-2
          space-y-2 lg:space-y-1.5
          max-h-[200px] lg:max-h-[150px]
        "
            >
              {flavors.map((flavor, i) => (
                <li
                  key={i}
                  className="font-medium text-gray-700 dark:text-gray-200"
                >
                  {flavor}
                </li>
              ))}
            </ul>
          </div>
        );
      case "dietary_summary_conditional":
        // build flags array
        const trueDietaryFlags = [
          product.gluten_free && { label: "Gluten-Free" },
          product.soy_free && { label: "Soy-Free" },
          product.vegetarian && { label: "Vegetarian" },
          product.vegan && { label: "Vegan" },
          product.keto_friendly && { label: "Keto-Friendly" },
        ].filter(Boolean) as { label: string }[];

        const hasAllergens = (product.allergens_list ?? []).length > 0;

        if (trueDietaryFlags.length === 0 && !hasAllergens) {
          return simpleValueCellWrapper(
            <span className="text-gray-500 dark:text-gray-400 italic">
              No specific dietary info
            </span>
          );
        }

        return (
          <div
            className="
      py-3 px-2 text-xs sm:text-sm
      lg:py-4 lg:px-4 lg:text-base
      space-y-2 lg:space-y-3
      w-full min-h-[100px]
      overflow-auto 
    "
          >
            {/* render flags */}
            {trueDietaryFlags.map((f) => (
              <div key={f.label} className="flex justify-center">
                <CheckCircle
                  className="
              w-4 h-4 lg:w-5 lg:h-5
              text-green-500 dark:text-green-400
              mr-2 lg:mr-2.5 flex-shrink-0
            "
                />
                <span className="font-bold text-gray-700 dark:text-gray-200">
                  {f.label}
                </span>
              </div>
            ))}

            {/* render allergens if any */}
            {hasAllergens && (
              <div
                className={`
          pt-2 lg:pt-3
          ${
            trueDietaryFlags.length > 0
              ? "mt-2 lg:mt-3 border-t border-gray-300/30 dark:border-gray-700/40"
              : ""
          }
        `}
              >
                <div className="mb-1">
                  <ShimmeringHoverInfoCard
                    infoContent="Common allergens declared by the manufacturer. Always check the product label for the most accurate information."
                    placement="top"
                  >
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      Allergens:
                    </span>
                  </ShimmeringHoverInfoCard>
                </div>
                <ul
                  className="
            list-none pl-3 lg:pl-4
            text-gray-600 dark:text-gray-300
            space-y-1 lg:space-y-1
            text-xs sm:text-sm lg:text-sm
          "
                >
                  {product.allergens_list!.map((a, i) => (
                    <li key={i} className="font-medium">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      case "additional_compounds_display":
        const compoundsMap = product.additional_compounds_map;
        if (!compoundsMap || Object.keys(compoundsMap).length === 0) {
          return simpleValueCellWrapper(
            <span className="text-gray-500 dark:text-gray-400 ">N/A</span>
          );
        }
        const compoundsArray = Object.entries(compoundsMap).map(
          ([name, value]) => ({ name, value: String(value) })
        );
        return (
          <div className="py-4 px-2 flex flex-wrap  justify-center items-center gap-x-4 gap-y-2 min-h-[100px]">
            {/* --- 3. USE THE NEW COMPONENT FOR EACH COMPOUND --- */}
            {compoundsArray.map((compound, index) => (
              <ShimmeringHoverInfoCard
                key={`${product.id}-compound-${index}`}
                infoContent={
                  <div className="p-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-base">
                      {compound.name}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {" "}
                      <span className="font-medium text-blue-500 dark:text-blue-400">
                        {compound.value}
                      </span>
                    </p>
                  </div>
                }
              >
                {compound.name}
              </ShimmeringHoverInfoCard>
            ))}
          </div>
        );
      case "number":
        return simpleValueCellWrapper(
          renderNumericValue(value as number, metric.unit, metric.unit === "₹")
        );
      case "text":
        return simpleValueCellWrapper(
          <span className="font-normal text-xl text-gray-800 dark:text-white">
            {value as string}
          </span>
        );
      case "boolean":
        return simpleValueCellWrapper(
          value ? (
            <Check className="w-8 h-8 text-green-500" />
          ) : (
            <X className="w-8 h-8 text-red-500" />
          )
        );
      default:
        const exhaustiveCheck: never = metric.type;
        console.error("Unhandled metric type:", exhaustiveCheck);
        return simpleValueCellWrapper(
          <span className="text-red-500 italic">Type Error</span>
        );
    }
  };

  const renderMetricRow = (metric: MetricConfig, metricIndex: number) => (
    <div
      key={metric.id}
      className={`${
        metricIndex % 2 === 0 ? "bg-white/5 dark:bg-black/5" : "bg-transparent"
      } backdrop-blur-sm`}
    >
      {/* Label Section */}
      <div
        className="
    sticky left-0 flex-none z-10
    font-semibold flex justify-center items-center group
    px-3 sm:px-5 lg:px-7
    bg-inherit backdrop-blur-sm
  "
        title={metric.description}
      >
        <div className="w-full sm:w-4/5 lg:w-3/5 flex justify-center items-center text-center px-4 py-3 sm:px-5 sm:py-3.5 lg:px-6 lg:py-4 rounded-full border border-gray-400/20 dark:border-gray-700 bg-white/5 dark:bg-black/10 shadow-sm">
          <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent text-lg sm:text-xl lg:text-2xl">
            {metric.label}
          </span>
          {metric.description && (
            <Info className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-500 ml-2.5 sm:ml-3 lg:ml-4 opacity-60 group-hover:opacity-100 transition-opacity cursor-help flex-shrink-0" />
          )}
        </div>
      </div>

      {/* Values Section */}
      <div
        className={`${gridContainerClasses} min-h-[100px] sm:min-h-[110px] lg:min-h-[120px]`}
        style={gridStyle}
      >
        {products.map((productItem, productIndexInRow) => (
          <div
            key={`${metric.id}-${productItem.id}`}
            className={`flex py-4 items-stretch justify-center hover:bg-white/10 dark:hover:bg-black/10 transition-colors duration-200 ${
              productIndexInRow < products.length - 1
                ? "border-r border-gray-400/20 dark:border-gray-700"
                : ""
            }`}
          >
            {productItem ? (
              renderMetricValue(metric, productItem, productIndexInRow)
            ) : (
              <div className="py-4 sm:py-5 lg:py-6 px-2 sm:px-3 lg:px-4 text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400 italic">
                N/A
              </div>
            )}
          </div>
        ))}
      </div>

      {/* EAA Section (conditionally rendered after the main row) */}
      {metric.id === "eaas_section" && products.length > 0 && (
        <div className="col-span-full py-4">
          <div className="text-center">
            <button
              onClick={() =>
                setShowIndividualRadarChart(!showIndividualRadarChart)
              }
              className="inline-flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 rounded-full text-sm sm:text-base lg:text-lg font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-500/10 dark:bg-indigo-400/20 hover:bg-indigo-500/20 dark:hover:bg-indigo-400/30 border border-indigo-500/20 dark:border-indigo-400/20 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Settings2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              <span>Compare Amino Profiles</span>
              {showIndividualRadarChart ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              )}
            </button>
          </div>

          {showIndividualRadarChart && (
            <div
              id="amino-acid-radar-chart"
              className="overflow-hidden bg-white/10 dark:bg-black/10 backdrop-blur-md p-3 sm:p-4 md:p-6 shadow-inner mt-4"
            >
              {(() => {
                const { data, productNames, colors } = prepareRadarChartData();
                return (
                  <RadarChartSection
                    data={data}
                    productNames={productNames}
                    colors={colors}
                  />
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (isLoading && products.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
        <Loader2 className="h-16 w-16 animate-spin text-blue-500 dark:text-blue-400 mb-4" />
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Loading Comparison...
        </p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-10 text-center min-h-[400px] bg-red-500/10 dark:bg-red-400/10 rounded-lg">
        <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
        <p className="text-xl font-semibold text-red-700 dark:text-red-300">
          Error Loading Comparison
        </p>
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
          {error.message}
        </p>
      </div>
    );
  }
  if (products.length === 0 && !isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-10 text-center min-h-[400px] flex flex-col items-center justify-center">
        <Info className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Comparison Table is Empty
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Add products to start comparing.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={tableContainerRef}
      className={`relative w-full mx-auto rounded-lg overflow-hidden bg-white/20 dark:bg-black/20 backdrop-blur-xl p-2 md:p-3 my-8 md:my-12 transition-all duration-300`}
    >
      <ScrollBasedTracingBeam targetRef={tableContainerRef} />

      <div
        className="comparison-table-scrollbar overflow-x-auto
	                scroll-snap-type-x-mandatory lg:scroll-snap-type-none
	                relative rounded-xl border border-gray-300 dark:border-gray-700"
      >
        <div className="w-full lg:w-full">
          <div
            className={`${gridContainerClasses} sticky top-0 z-20 bg-white/10 dark:bg-black/10 backdrop-blur-lg`}
            style={gridStyle}
          >
            {products.map((productItem, index) => (
              <ComparisonColumn
                key={productItem.id}
                product={productItem}
                onRemove={removeProduct}
                className={`scroll-snap-align-start lg:scroll-snap-align-none ${
                  index < products.length - 1
                    ? "border-r border-gray-300 dark:border-gray-700"
                    : ""
                }`}
                style={{ minHeight: `var(--product-card-height)` }}
                selectedSizeId={selectedSizes[productItem.id] || null}
                onSizeChange={handleSizeSelectionChange}
              />
            ))}
          </div>
          <div
            className="text-center py-3.5 sm:py-4 sticky z-10 bg-white/30 dark:bg-black/30 backdrop-blur-md"
            style={{ top: `var(--product-card-height)` }}
          >
            <button
              onClick={() => setShowPriceDetails(!showPriceDetails)}
              className="inline-flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 rounded-full text-sm sm:text-base lg:text-lg font-medium text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-black/60 hover:bg-white/80 dark:hover:bg-black/80 border border-gray-300/20 dark:border-gray-200 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              <span>
                {showPriceDetails
                  ? "Hide Price Analysis"
                  : "Show Price & Value Analysis"}
              </span>
              {showPriceDetails ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              )}
            </button>
          </div>
          {showPriceDetails &&
            priceMetrics.map((metric, index) => renderMetricRow(metric, index))}
          {generalMetrics.map((metric, index) =>
            renderMetricRow(metric, index)
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
