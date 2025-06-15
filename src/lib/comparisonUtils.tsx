// lib/comparisonUtils.ts
import React from 'react';
// import { ComparisonProductData } from '@/lib/hooks'; // Not strictly needed in this file if only formatting primitives

// getNestedValue can be kept or removed based on final usage
// lib/comparisonUtils.ts
export const getNestedValue = (obj: unknown, path: string): unknown => {
  // Check if obj is an object and not null before starting
  if (typeof obj !== 'object' || obj === null) {
    return undefined;
  }

  const keys = path.split('.');
  let current: unknown = obj; // Start with the unknown object

  for (const key of keys) {
    // Before accessing a property, we MUST ensure 'current' is an indexable type
    if (typeof current !== 'object' || current === null || !Object.prototype.hasOwnProperty.call(current, key)) {
      return undefined; // Key doesn't exist or current is not an object
    }
    current = (current as Record<string, unknown>)[key]; // Assert after check
  }
  return current;
};

export type RenderableMetricType = 'boolean' | 'number' | 'text' | 'percentage';

export const renderValue = (value: unknown, type: RenderableMetricType, unit?: string): React.ReactNode => {
  if (value === undefined || value === null) {
    return <span className="text-gray-400 dark:text-gray-500 italic text-sm">N/A</span>;
  }

  switch (type) {
    case 'boolean':
      return (value as boolean) ?
        <span className="text-emerald-600 font-semibold text-lg">✓</span> :
        <span className="text-red-500 font-semibold text-lg">✗</span>;
    case 'number':
      const numValue = Number(value);
      if (isNaN(numValue)) return <span className="text-gray-400 dark:text-gray-500 italic text-sm">N/A</span>;
      const displayValue = numValue.toLocaleString(undefined, {
        minimumFractionDigits: unit === '$' ? 2 : (Number.isInteger(numValue) ? 0 : 1), // Show 0 decimals for whole numbers, 1 otherwise, 2 for currency
        maximumFractionDigits: unit === '$' ? 2 : 1,
      });
      return (
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {unit === '$' && unit}
          {displayValue}
          {unit && unit !== '$' && <span className="text-gray-500 dark:text-gray-400 text-xs ml-0.5">{unit}</span>}
        </span>
      );
    case 'percentage':
      const percentVal = Number(value);
      if (isNaN(percentVal)) return <span className="text-gray-400 dark:text-gray-500 italic text-sm">N/A</span>;
      return <span className="font-medium text-gray-900 dark:text-gray-100">{percentVal.toFixed(1)}%</span>;
    case 'text':
    default:
      // Ensure even numbers passed as 'text' are converted to string for React children
      return <span className="text-gray-900 dark:text-gray-100">{String(value)}</span>;
  }
};