import { 
  Product, 
  NutritionalInfo, 
  ProductFeatures, 
  DietaryInfo, 
  ProductValueMetrics 
} from '@/lib/schemas';
import { ComparisonProductData } from './hooks';

/**
 * Normalizes protein source values to more readable format
 */
export const normalizeProteinSource = (source: string): string => {
  const sourceMappings: Record<string, string> = {
    'whey_concentrate': 'Whey Concentrate',
    'whey_isolate': 'Whey Isolate',
    'whey_hydrolysate': 'Whey Hydrolysate',
    'casein': 'Casein',
    'egg': 'Egg Protein',
    'soy': 'Soy Protein',
    'pea': 'Pea Protein',
    'rice': 'Rice Protein',
    'hemp': 'Hemp Protein',
    'mixed_plant': 'Mixed Plant Protein',
    'collagen': 'Collagen',
    'other': 'Other'
  };

  return sourceMappings[source] || source;
};

/**
 * Normalizes filtration process values to more readable format
 */
export const normalizeFiltrationProcess = (process: string): string => {
  const processMappings: Record<string, string> = {
    'micro_filtration': 'Micro-Filtration',
    'ultra_filtration': 'Ultra-Filtration',
    'cross_flow_filtration': 'Cross-Flow Filtration',
    'ion_exchange': 'Ion Exchange',
    'cold_processed': 'Cold Processed',
    'not_specified': 'Not Specified',
    'other': 'Other'
  };

  return processMappings[process] || process;
};

/**
 * Adapts database product data for the comparison table component
 */
export const adaptProductForComparison = (
  product: Product,
  nutritionalInfo?: NutritionalInfo,
  features?: ProductFeatures,
  dietaryInfo?: DietaryInfo,
  valueMetrics?: ProductValueMetrics
): ComparisonProductData => {
  
  // Create a copy of features to avoid modifying the original
  const formattedFeatures = features ? {
    ...features,
    // Store original enum value in display_protein_source instead of modifying protein_source
    display_protein_source: normalizeProteinSource(features.protein_source),
    display_filtration_process: features.filtration_process ? 
      normalizeFiltrationProcess(features.filtration_process) : undefined
  } : undefined;

  return {
    ...product,
    nutritionalInfo,
    features: formattedFeatures,
    dietaryInfo,
    valueMetrics
  };
};

/**
 * Batch process multiple products for comparison
 */
export const adaptProductsForComparison = (
  products: Product[],
  nutritionalInfos: NutritionalInfo[],
  featuresList: ProductFeatures[],
  dietaryInfos: DietaryInfo[],
  valueMetrics: ProductValueMetrics[]
): ComparisonProductData[] => {
  return products.map(product => {
    const nutritionalInfo = nutritionalInfos.find(info => info.product_id === product.id);
    const features = featuresList.find(f => f.product_id === product.id);
    const dietaryInfo = dietaryInfos.find(info => info.product_id === product.id);
    const metrics = valueMetrics.find(m => m.product_id === product.id);
    
    return adaptProductForComparison(
      product,
      nutritionalInfo,
      features,
      dietaryInfo,
      metrics
    );
  });
};

/**
 * Formats a numerical value for display
 */
export const formatNumericValue = (value: number | undefined, type: 'price' | 'percentage' | 'weight' | 'default'): string => {
  if (value === undefined) return '—';
  
  switch (type) {
    case 'price':
      return `$${value.toFixed(2)}`;
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'weight':
      return `${value.toFixed(1)}g`;
    case 'default':
    default:
      return value.toFixed(1);
  }
};

/**
 * Formats a boolean value for display
 */
export const formatBooleanValue = (value: boolean | undefined): string => {
  if (value === undefined) return '—';
  return value ? '✓' : '✗';
};