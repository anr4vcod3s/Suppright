'use client';
import React, { useMemo } from 'react';
import ComparisonColumn from './ComparisonColumn';
import { useComparisonData } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const metricGroups = {
  'Nutrition': [
    { key: 'nutritionalInfo.protein_g', label: 'Protein (g)' },
    { key: 'nutritionalInfo.calories', label: 'Calories' },
    { key: 'nutritionalInfo.carbohydrates_g', label: 'Carbs (g)' },
    { key: 'nutritionalInfo.fats_g', label: 'Fat (g)' },
    { key: 'nutritionalInfo.protein_percentage', label: 'Protein %' }
  ],
  'Value': [
    { key: 'valueMetrics.price_per_serving', label: 'Price/Serving' },
    { key: 'valueMetrics.price_per_kg', label: 'Price/kg' },
    { key: 'valueMetrics.price_per_protein_g', label: 'Price/Protein g' }
  ],
  'Features': [
    { key: 'features.protein_source', label: 'Protein Source' },
    { key: 'features.filtration_process', label: 'Filtration' },
    { key: 'features.artificial_sweeteners', label: 'Artificial Sweeteners' },
    { key: 'features.grass_fed', label: 'Grass Fed' },
    { key: 'features.third_party_tested', label: 'Third Party Tested' }
  ],
  'Dietary': [
    { key: 'dietaryInfo.gluten_free', label: 'Gluten Free' },
    { key: 'dietaryInfo.lactose_content_g', label: 'Lactose (g)' },
    { key: 'dietaryInfo.soy_free', label: 'Soy Free' },
    { key: 'dietaryInfo.vegetarian', label: 'Vegetarian' },
    { key: 'dietaryInfo.vegan', label: 'Vegan' },
    { key: 'dietaryInfo.keto_friendly', label: 'Keto Friendly' }
  ]
};

const ComparisonTable: React.FC = () => {
  const { products, isLoading, error, removeProduct, clearProducts } = useComparisonData();
  
  // Flatten metrics for easier iteration in ComparisonColumn
  const allMetricKeys = useMemo(() => {
    return Object.values(metricGroups).flatMap(group => group.map(item => item.key));
  }, []);
  
  // If no products are being compared
  if (products.length === 0 && !isLoading) {
    return (
      <div className="p-6 text-center border rounded-lg bg-gray-50">
        <h2 className="text-xl font-medium mb-3">No Products to Compare</h2>
        <p className="text-gray-600 mb-4">Add products to your comparison to see them here.</p>
      </div>
    );
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 text-center border rounded-lg bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading comparison data...</p>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="p-6 text-center border rounded-lg bg-gray-50 text-red-600">
        <h2 className="text-xl font-medium mb-3">Error Loading Comparison</h2>
        <p className="mb-4">{error.message}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <div className="flex justify-end p-2 bg-gray-50 border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearProducts}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Clear All
        </Button>
      </div>
      
      <div className="min-w-fit">
        <div className="grid grid-flow-col auto-cols-fr">
          {/* Metrics Labels Column */}
          <div className="border-r border-gray-200">
            <div className="p-2 h-16 flex items-end">
              <span className="text-lg font-medium text-gray-400">Metrics</span>
            </div>
            
            {/* Product Height Placeholder */}
            <div className="h-64 border-b border-gray-200"></div>
            
            {/* Metric Group Headers and Rows */}
            {Object.entries(metricGroups).map(([groupName, metrics]) => (
              <React.Fragment key={groupName}>
                <div className="p-2 bg-gray-100 font-medium border-t border-gray-200">
                  {groupName}
                </div>
                {metrics.map(({ label }) => (
                  <div key={label} className="p-2 border-t border-gray-100">
                    {label}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          
          {/* Product Columns - Now using ComparisonColumn component */}
          {products.map((product) => (
            <ComparisonColumn 
              key={product.id} 
              product={product} 
              removeItem={removeProduct}
              metrics={allMetricKeys}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;