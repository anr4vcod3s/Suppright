// components/ui/MacrosCell.tsx
import React from "react";
import { ComparisonProductData } from "@/lib/hooks";
import { CircularProgress } from "./CircularProgress"; // Ensure this path is correct

interface MacrosCellProps {
  product: ComparisonProductData;
  index: number; // For staggered animation delay
}

export const MacrosCell: React.FC<MacrosCellProps> = ({ product, index }) => {
  const proteinPercent = product.protein_macro_percentage ?? null;
  const carbsPercent = product.carb_macro_percentage ?? null;
  const fatsPercent = product.fat_macro_percentage ?? null;

  if (
    proteinPercent === null ||
    carbsPercent === null ||
    fatsPercent === null
  ) {
    if (
      (product.protein_g ?? 0) === 0 &&
      (product.carbohydrates_g ?? 0) === 0 &&
      (product.fats_g ?? 0) === 0
    ) {
      return (
        <div className="py-6 text-center text-base text-gray-400 dark:text-gray-600 italic min-h-[100px] flex items-center justify-center">
          N/A
        </div>
      );
    }
    return (
      <div className="py-6 text-center text-base text-gray-400 dark:text-gray-600 italic min-h-[100px] flex items-center justify-center">
        Macro % N/A
      </div>
    );
  }

  const proteinColor = "#10B981"; // Blue
  const carbsColor = "#3B82F6"; // Green
  const fatsColor = "#F59E0B"; // Amber/Orange

  return (
    <div className="py-3 px-1 flex flex-col items-center justify-around min-h-[140px] space-y-3">
      {/* Protein - Largest Circular Progress */}
      <div className="flex flex-col items-center">
        <CircularProgress
          percentage={proteinPercent}
          size="lg"
          color={proteinColor}
          backgroundColor="#E5E7EB"
          strokeWidth={7}
          delay={index * 100}
        />
        <span
          style={{ color: proteinColor }}
          className="mt-1 text-lg font-semibold"
        >
          Protein
        </span>
      </div>

      {/* Carbs & Fats - Slightly larger than before, stacked below Protein */}
      <div className="flex flex-row items-center gap-6">
        <div className="flex flex-col items-center">
          <CircularProgress
            percentage={carbsPercent}
            size="md" // Slightly larger than sm
            color={carbsColor}
            backgroundColor="#E5E7EB"
            strokeWidth={6}
            delay={index * 100 + 100}
          />
          <span
            style={{ color: carbsColor }}
            className="mt-1 text-lg font-medium"
          >
            Carbs
          </span>
        </div>
        <div className="flex flex-col items-center">
          <CircularProgress
            percentage={fatsPercent}
            size="md" // Slightly larger than sm
            color={fatsColor}
            backgroundColor="#E5E7EB"
            strokeWidth={6}
            delay={index * 100 + 200}
          />
          <span
            style={{ color: fatsColor }}
            className="mt-1 text-lg font-medium"
          >
            Fat
          </span>
        </div>
      </div>
    </div>
  );
};
