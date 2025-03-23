
// ComparisonTable.tsx - Fixed version
import React, { useMemo } from 'react';
import { useComparisonData, ComparisonProductData } from '@/lib/hooks';
import ComparisonColumn from './ComparisonColumn';
import { Loader2 } from 'lucide-react';

// Define the metric types more specifically
type MetricType = 'boolean' | 'number' | 'text' | 'percentage';

// Interface for a single metric
interface Metric {
  id: string;
  label: string;
  path: string; 
  type: MetricType;
  unit?: string;
  formatter?: (value: unknown) => React.ReactNode; // Replaced 'any' with 'unknown'
}

// Interface for a group of metrics
interface MetricSection {
  title: string;
  metrics: Metric[];
}

const ComparisonTable: React.FC = () => {
  const { 
    products, 
    isLoading, 
    error, 
    removeProduct, 
    clearProducts, 
  } = useComparisonData();

  // Define the column width based on number of products
  const columnWidth = useMemo(() => {
    const productCount = products.length;
    if (productCount === 0) return '100%';
    return `${Math.min(33, 100 / productCount)}%`;
  }, [products.length]);

  // Define the metrics for comparison
  const metricSections: MetricSection[] = [
     {
      title: 'Value',
      metrics: [
        { id: 'price', label: 'Price per kg', path: 'value_metrics.price_per_kg', type: 'number', unit: '$' },
        { id: 'value_ratio', label: 'Price per serving', path: 'value_metrics.price_per_serving', type: 'number', unit: '$' },
        { id: 'serving_count', label: 'Servings per Package', path: 'servings_per_container', type: 'number' },
        { id: 'serving_size', label: 'Serving Size', path: 'serving_size', type: 'number', unit: 'g' },
      ],
    },
    {
      title: 'Nutrition',
      metrics: [
        { id: 'calories', label: 'Calories', path: 'nutritional_info.calories', type: 'number' },
        { id: 'protein', label: 'Protein', path: 'nutritional_info.protein_g', type: 'number', unit: 'g' },
        { id: 'protein_percentage', label: 'Protein %', path: 'nutritional_info.protein_percentage', type: 'percentage' },
        { id: 'carbs', label: 'Carbohydrates', path: 'nutritional_info.carbohydrates_g', type: 'number', unit: 'g' },
        { id: 'fat', label: 'Fat', path: 'nutritional_info.fats_g', type: 'number', unit: 'g' },
        { id: 'saturated_fat', label: 'Saturated Fat', path: 'nutritional_info.saturated_fats_g', type: 'number', unit: 'g' },
        { id: 'cholesterol', label: 'Cholesterol', path: 'nutritional_info.cholesterol_mg', type: 'number', unit: 'mg' },
        { id: 'sodium', label: 'Sodium', path: 'nutritional_info.sodium_mg', type: 'number', unit: 'mg' },
      ],
    },
    {
      title: 'Amino Acids',
      metrics: [
        { id: 'leucine', label: 'Leucine', path: 'amino_profile.leucine_g', type: 'number', unit: 'g' },
        { id: 'isoleucine', label: 'Isoleucine', path: 'amino_profile.isoleucine_g', type: 'number', unit: 'g' },
        { id: 'valine', label: 'Valine', path: 'amino_profile.valine_g', type: 'number', unit: 'g' },
        { id: 'alanine', label: 'Alanine', path: 'amino_profile.alanine_g', type: 'number', unit: 'g' },
        { id: 'arginine', label: 'Arginine', path: 'amino_profile.arginine_g', type: 'number', unit: 'g' },
        { id: 'aspartic_acid', label: 'Aspartic Acid', path: 'amino_profile.aspartic_acid_g', type: 'number', unit: 'g' },
        { id: 'cysteine', label: 'Cysteine', path: 'amino_profile.cysteine_g', type: 'number', unit: 'g' },
        { id: 'glutamic_acid', label: 'Glutamic Acid', path: 'amino_profile.glutamic_acid_g', type: 'number', unit: 'g' },
        { id: 'glutamine', label: 'Glutamine', path: 'amino_profile.glutamine_g', type: 'number', unit: 'g' },
        { id: 'glycine', label: 'Glycine', path: 'amino_profile.glycine_g', type: 'number', unit: 'g' },
        { id: 'histidine', label: 'Histidine', path: 'amino_profile.histidine_g', type: 'number', unit: 'g' },
        { id: 'lysine', label: 'Lysine', path: 'amino_profile.lysine_g', type: 'number', unit: 'g' },
        { id: 'methionine', label: 'Methionine', path: 'amino_profile.methionine_g', type: 'number', unit: 'g' },
        { id: 'phenylalanine', label: 'Phenylalanine', path: 'amino_profile.phenylalanine_g', type: 'number', unit: 'g' },
        { id: 'proline', label: 'Proline', path: 'amino_profile.proline_g', type: 'number', unit: 'g' },
        { id: 'serine', label: 'Serine', path: 'amino_profile.serine_g', type: 'number', unit: 'g' },
        { id: 'threonine', label: 'Threonine', path: 'amino_profile.threonine_g', type: 'number', unit: 'g' },
        { id: 'tryptophan', label: 'Tryptophan', path: 'amino_profile.tryptophan_g', type: 'number', unit: 'g' },
        { id: 'tyrosine', label: 'Tyrosine', path: 'amino_profile.tyrosine_g', type: 'number', unit: 'g' },
      ]
    },  
    {
      title: 'Dietary',
      metrics: [
        { id: 'vegetarian', label: 'Vegetarian', path: 'dietary_info.vegetarian', type: 'boolean' },
        { id: 'vegan', label: 'Vegan', path: 'dietary_info.vegan', type: 'boolean' },
        { id: 'gluten_free', label: 'Gluten Free', path: 'dietary_info.gluten_free', type: 'boolean' },
        { id: 'soy_free', label: 'Soy Free', path: 'dietary_info.soy_free', type: 'boolean' },
      ],
    },  
    {
      title: 'Features',
      metrics: [
        { id: 'grass_fed', label: 'Grass Fed', path: 'features.grass_fed', type: 'boolean' },
        { id: 'artificial_sweeteners', label: 'Artificial Sweeteners', path: 'features.artificial_sweeteners', type: 'boolean' },
        { id: 'natural_sweeteners', label: 'Natural Sweeteners', path: 'features.natural_sweeteners', type: 'boolean' },
        { id: 'artificial_flavoring', label: 'Artificial Flavoring', path: 'features.artificial_flavoring', type: 'boolean' },
      ],
    },
    
  ];
  

  // Helper function to safely get nested property value
  const getNestedValue = (obj: ComparisonProductData, path: string): unknown => {
    if (!obj) return undefined;
    
    const keys = path.split('.');
    return keys.reduce((acc, key) => {
      return acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined;
    }, obj as unknown);
  };
  
  // Function to render value based on type
  const renderValue = (value: unknown, type: MetricType, unit?: string): React.ReactNode => {
    if (value === undefined || value === null) {
      return <span className="text-gray-400">N/A</span>;
    }
    
    switch (type) {
      case 'boolean':
        return (value as boolean) ? 
          <span className="text-green-600 font-bold">Yes</span> : 
          <span className="text-red-600">No</span>;
      
      case 'number':
        const numValue = value as number;
        if (isNaN(numValue)) return <span className="text-gray-400">N/A</span>;
        
        if (unit === '$') {
          return `${unit}${numValue.toFixed(2)}`;
        }
        return numValue.toFixed(1) + (unit ? ` ${unit}` : '');
      
      case 'percentage':
        const percentValue = value as number;
        if (isNaN(percentValue)) return <span className="text-gray-400">N/A</span>;
        return `${percentValue.toFixed(1)}%`;
      
      default:
        return String(value);
    }
  };
  
  // If no products, show empty state
  if (products.length === 0 && !isLoading) {
    return (
      <div className="w-full p-8 text-center border border-gray-200 rounded-md">
        <h3 className="text-xl font-medium text-gray-700 mb-2">No products to compare</h3>
        <p className="text-gray-500 mb-4">Add products to your comparison to get started.</p>
      </div>
    );
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full p-8 text-center border border-gray-200 rounded-md">
        <div className="flex justify-center mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
        <p className="text-gray-500">Loading product comparison...</p>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="w-full p-8 text-center border border-gray-200 rounded-md">
        <h3 className="text-xl font-medium text-red-600 mb-2">Error Loading Comparison</h3>
        <p className="text-gray-500 mb-4">{error.message}</p>
        <button 
          onClick={clearProducts}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800"
        >
          Reset Comparison
        </button>
      </div>
    );
  }
  
  return (
    <div className="w-full border border-gray-200 rounded-md overflow-hidden">
      {/* Product Headers */}
      <div className="flex w-full">
        {products.map((product) => (
          <div key={product.id} style={{ width: columnWidth }} className="relative">
            <ComparisonColumn 
              product={product} 
              onRemove={removeProduct}
            />
          </div>
        ))}
      </div>
      
      {/* Render each section with its metrics */}
      {metricSections.map((section) => (
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
                {products.map((product) => {
                  const rawValue = getNestedValue(product, metric.path);
                  return (
                    <div 
                      key={`${metric.id}-${product.id}`} 
                      className="p-4 border-r border-gray-200"
                      style={{ width: columnWidth }}
                    >
                      {metric.formatter 
                        ? metric.formatter(rawValue) 
                        : renderValue(rawValue, metric.type, metric.unit)}
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

export default ComparisonTable;
