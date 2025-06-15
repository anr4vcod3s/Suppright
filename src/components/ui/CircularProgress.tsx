// components/ui/CircularProgress.tsx
import { useState, useEffect, useRef } from "react";
import { getNestedValue } from "@/lib/comparisonUtils";
import { ComparisonProductData } from "@/lib/hooks";

type CircularProgressProps = {
  percentage: number;
  radius?: number;
  strokeWidth?: number;
  duration?: number;
  color?: string;
  backgroundColor?: string;
  size?: "sm" | "md" | "lg";
  delay?: number;
};

const CircularProgress = ({
  percentage,
  radius,
  strokeWidth,
  duration = 1500,
  color = "#3CB4E5", // Default color, can be overridden by getProgressColor
  backgroundColor = "rgba(229, 231, 235, 0.3)", // Default light gray, more transparent
  size = "md",
  delay = 0,
}: CircularProgressProps) => {
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const animatedOnceRef = useRef(false);

  const sizeConfig = {
    sm: { radius: 28, strokeWidth: 4.5 },
    md: { radius: 36, strokeWidth: 5.5 },
    lg: { radius: 44, strokeWidth: 6.5 },
  };

  const config = sizeConfig[size];
  const finalRadius = radius || config.radius;
  const finalStrokeWidth = strokeWidth || config.strokeWidth;

  const normalizedRadius = finalRadius - finalStrokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  const getProgressColor = (percent: number) => {
    if (percent >= 80) return "#10B981"; // Green
    if (percent >= 60) return "#F59E0B"; // Yellow/Amber
    if (percent >= 40) return "#EF4444"; // Red
    return "#6B7280"; // Gray
  };

  const progressColor =
    color === "#3CB4E5" ? getProgressColor(clampedPercentage) : color;

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (animatedOnceRef.current) {
      return;
    }
    const startAnimation = () => {
      animatedOnceRef.current = true;
      startTimeRef.current = null;
      const animateProgress = (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }
        const elapsed = timestamp - startTimeRef.current;
        const progressPercent =
          Math.min(elapsed / duration, 1) * clampedPercentage;
        setProgress(progressPercent);
        if (elapsed < duration) {
          animationRef.current = requestAnimationFrame(animateProgress);
        } else {
          setProgress(clampedPercentage);
        }
      };
      animationRef.current = requestAnimationFrame(animateProgress);
    };

    if (delay > 0) {
      const timeoutId = setTimeout(startAnimation, delay);
      return () => {
        clearTimeout(timeoutId);
        if (animationRef.current !== null) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      startAnimation();
    }

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [clampedPercentage, duration, delay]);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        className="relative"
        style={{ width: finalRadius * 2, height: finalRadius * 2 }}
      >
        <svg
          className="transform -rotate-90"
          width={finalRadius * 2}
          height={finalRadius * 2}
          viewBox={`0 0 ${finalRadius * 2} ${finalRadius * 2}`}
        >
          <circle
            stroke={backgroundColor}
            fill="transparent"
            strokeWidth={finalStrokeWidth}
            r={normalizedRadius}
            cx={finalRadius}
            cy={finalRadius}
            className="stroke-gray-200/30 dark:stroke-gray-700/30"
          />
          <circle
            stroke={progressColor}
            fill="transparent"
            strokeWidth={finalStrokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={finalRadius}
            cy={finalRadius}
            style={{
              transition: `stroke-dashoffset ${duration / 1000}s ease-out`,
              filter: `drop-shadow(0 0 3px ${progressColor}aa)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="tabular-nums"
            style={{
              fontSize: finalRadius / 2.4, // Increased font size
              fontWeight: 600, // Set to semibold
              color: progressColor,
              fontFamily:
                "'Inter', 'Arial Rounded MT Bold', 'Avenir', 'Nunito', sans-serif",
              lineHeight: 1,
              userSelect: "none",
              textShadow: `0 0 5px ${progressColor}33`,
            }}
          >
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

interface ProteinPercentageCellProps {
  product: ComparisonProductData;
  index: number;
}

const ProteinPercentageCell: React.FC<ProteinPercentageCellProps> = ({
  product,
  index,
}) => {
  const proteinPercentage = getNestedValue(
    product,
    "nutritional_info.protein_percentage",
  ) as number;

  if (proteinPercentage == null || isNaN(proteinPercentage)) {
    return (
      <div className="flex items-center justify-center py-4 min-h-[80px]">
        <span className="text-gray-500 dark:text-gray-400 italic text-sm">
          N/A
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-4 min-h-[80px]">
      <CircularProgress
        percentage={proteinPercentage}
        delay={index * 100}
        size="md"
        duration={1200}
        backgroundColor="rgba(209, 213, 229, 0.2)"
      />
    </div>
  );
};

export { CircularProgress, ProteinPercentageCell };