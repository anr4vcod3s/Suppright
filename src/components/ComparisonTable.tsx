'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ProductCard from './ProductCard';

// A type-safe helper to extract nested values via a dot-separated path
const getNestedValue = <T,>(obj: T, path: string): unknown => {
  return path.split('.').reduce((acc: unknown, part: string) => {
    if (acc !== undefined && acc !== null && typeof acc === 'object') {
      const record = acc as Record<string, unknown>;
      return record[part];
    }
    return undefined;
  }, obj);
};

interface Metric {
  id: string;
  label: string;
  path: string; // dot-separated path to the field
  type?: 'boolean' | 'list' | 'object' | 'currency' | 'percentage';
  unit?: string;
}

interface Section {
  title: string;
  metrics: Metric[];
}

// Updated sections & metrics based on discussion
const sections: Section[] = [
  {
    title: 'Core Product Information',
    metrics: [
      { id: 'serving_size', label: 'Serving Size', path: 'serving_size', unit: 'g' },
      { id: 'price_per_serving', label: 'Price Per Serving', path: 'price_per_serving', type: 'currency' },
      { id: 'price_per_gram_protein', label: 'Price Per Gram Protein', path: 'price_per_gram_protein', type: 'currency' },
      { id: 'flavors', label: 'Available Flavors', path: 'flavors', type: 'list' },
    ],
  },
  {
    title: 'Nutritional Essentials',
    metrics: [
      { id: 'calories', label: 'Calories Per Serving', path: 'nutritional_info.calories' },
      { id: 'protein', label: 'Protein Per Serving', path: 'nutritional_info.protein', unit: 'g' },
      { id: 'protein_percentage', label: 'Protein Percentage', path: 'nutritional_info.protein_percentage', type: 'percentage' },
      { id: 'carbohydrates', label: 'Carbs', path: 'nutritional_info.carbohydrates', unit: 'g' },
      { id: 'fats', label: 'Fats', path: 'nutritional_info.fats', unit: 'g' },
      { id: 'sugars', label: 'Sugars', path: 'nutritional_info.sugars', unit: 'g' },
    ],
  },
  {
    title: 'Protein Composition',
    metrics: [
      { id: 'protein_source', label: 'Protein Source', path: 'protein_source' },
      { id: 'bcaa_total', label: 'Total BCAAs', path: 'amino_profiles.bcaa_total', unit: 'g' },
      { id: 'leucine', label: 'Leucine', path: 'amino_profiles.leucine_g', unit: 'g' },
      { id: 'isoleucine', label: 'Isoleucine', path: 'amino_profiles.isoleucine_g', unit: 'g' },
      { id: 'valine', label: 'Valine', path: 'amino_profiles.valine_g', unit: 'g' },
      { id: 'eaa_total', label: 'Total EAAs', path: 'amino_profiles.eaa_total', unit: 'g' },
      { id: 'lysine', label: 'Lysine', path: 'amino_profiles.lysine_g', unit: 'g' },
      { id: 'methionine', label: 'Methionine', path: 'amino_profiles.methionine_g', unit: 'g' },
      { id: 'phenylalanine', label: 'Phenylalanine', path: 'amino_profiles.phenylalanine_g', unit: 'g' },
      { id: 'threonine', label: 'Threonine', path: 'amino_profiles.threonine_g', unit: 'g' },
      { id: 'tryptophan', label: 'Tryptophan', path: 'amino_profiles.tryptophan_g', unit: 'g' },
      { id: 'histidine', label: 'Histidine', path: 'amino_profiles.histidine_g', unit: 'g' },
    ],
  },
  {
    title: 'Product Classification',
    metrics: [
      { id: 'additional_compounds', label: 'Key Additives', path: 'additional_compounds', type: 'object' },
      { id: 'lactose_free', label: 'Lactose Free', path: 'dietary_info.lactose_free', type: 'boolean' },
      { id: 'gluten_free', label: 'Gluten Free', path: 'dietary_info.gluten_free', type: 'boolean' },
      { id: 'soy_free', label: 'Soy Free', path: 'dietary_info.soy_free', type: 'boolean' },
      { id: 'vegetarian', label: 'Vegetarian', path: 'dietary_info.vegetarian', type: 'boolean' },
      { id: 'vegan', label: 'Vegan', path: 'dietary_info.vegan', type: 'boolean' },
      { id: 'keto_friendly', label: 'Keto Friendly', path: 'dietary_info.keto_friendly', type: 'boolean' },
      { id: 'allergens', label: 'Allergens', path: 'dietary_info.allergens', type: 'list' },
    ],
  },
  {
    title: 'Quality Indicators',
    metrics: [
      { id: 'third_party_tested', label: 'Third-Party Tested', path: 'quality.third_party_tested', type: 'boolean' },
      { id: 'artificial_ingredients', label: 'Artificial Ingredients', path: 'quality.artificial_ingredients', type: 'boolean' },
      { id: 'manufacturing_standards', label: 'Manufacturing Standards', path: 'quality.manufacturing_standards' },
      { id: 'hormone_free', label: 'Hormone Free', path: 'quality.hormone_free', type: 'boolean' },
    ],
  },
];

const CompareTableComponent: React.FC = () => {
  const { items, removeItem } = useCart();
  // Add this state to control client-side rendering
  const [isClient, setIsClient] = useState(false);
  
  // Use useEffect to mark when component is mounted on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate dynamic column width with useMemo for performance
  const columnWidth = useMemo(() => {
    // Always provide a default value for server-side rendering
    const count = isClient ? (items.length || 1) : 1;
    return `${100 / count}%`;
  }, [items.length, isClient]);

  // Enhanced render function with formatting based on type and units
  const renderValue = (value: unknown, type?: string, unit?: string): React.ReactNode => {
    if (value === undefined || value === null) return 'N/A';
    
    switch (type) {
      case 'boolean':
        return (value as boolean) ? 'Yes' : 'No';
      case 'list':
        return Array.isArray(value) ? value.join(', ') : 'N/A';
      case 'object':
        if (typeof value === 'object' && value !== null) {
          return Object.entries(value as Record<string, unknown>)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ');
        }
        return String(value);
      case 'currency':
        return typeof value === 'number' 
          ? `$${value.toFixed(2)}` 
          : `$${value}`;
      case 'percentage':
        return typeof value === 'number' 
          ? `${value.toFixed(1)}%` 
          : `${value}%`;
      default:
        if (unit && (typeof value === 'number' || typeof value === 'string')) {
          return `${value}${unit}`;
        }
        return String(value);
    }
  };

  // Return a consistent skeleton during server rendering
  if (!isClient) {
    return (
      <div className="w-full p-8 text-center text-gray-500">
        Loading comparison data...
      </div>
    );
  }

  // After client-side hydration is complete, we can safely render based on actual data
  if (items.length === 0) {
    return (
      <div className="w-full p-8 text-center text-gray-500">
        No products selected for comparison. Please add products to compare.
      </div>
    );
  }

  return (
    <div className="w-full border border-gray-200 rounded-md overflow-hidden">
      {/* Product Headers with ProductCard */}
      <div className="flex w-full">
        {items.map((product) => (
          <div key={product.id} style={{ width: columnWidth }} className="relative">
            {/* Remove Button */}
            <button
              onClick={() => removeItem(product.id)}
              className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-sm text-gray-400 hover:text-gray-700"
              title="Remove"
            >
              <X size={16} />
            </button>
            
            {/* Product Card */}
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Render each section with its metrics */}
      {sections.map((section) => (
        <div key={section.title} className="w-full">
          {/* Section Title Row */}
          <div className="w-full p-2 bg-white border-y border-gray-200 font-bold">
            {section.title}
          </div>

          {section.metrics.map((metric) => (
            <React.Fragment key={metric.id}>
              {/* Metric Label Row */}
              <div className="w-full p-2 bg-gray-200 border-b border-gray-200 text-sm font-semibold">
                {metric.label}
              </div>

              {/* Metric Values Row */}
              <div className="flex w-full border-b border-gray-200">
                {items.map((product) => {
                  const rawValue = getNestedValue(product, metric.path);
                  return (
                    <div
                      key={`${metric.id}-${product.id}`}
                      className="p-4 border-r border-gray-200"
                      style={{ width: columnWidth }}
                    >
                      {renderValue(rawValue, metric.type, metric.unit)}
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CompareTableComponent;