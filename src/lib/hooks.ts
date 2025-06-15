// lib/hooks.ts

export interface ProductSizeDetail {
  id: string;
  size_kg: number;
  price: number;
  is_popular?: boolean | null;
  affiliate_link?: string | null;
  retailer_name?: string | null;
}

interface Certification {
  id: string;
  name: string;
  image_url?: string | null;
}

export interface ComparisonProductData {
  id: string;
  name: string;
  brand: string;
  description?: string | null;
  slug: string; 
  image_url?: string | null;
  serving_size: number;
  servings_per_container: number;
  product_created_at?: string | Date | null;
  product_updated_at?: string | Date | null;
  calories?: number | null;
  protein_g?: number | null;
  carbohydrates_g?: number | null;
  fats_g?: number | null;
  cholesterol_mg?: number | null;
  protein_percentage?: number | null;
  protein_macro_percentage?: number | null;
  carb_macro_percentage?: number | null;
  fat_macro_percentage?: number | null;
  leucine_g?: number | null;
  isoleucine_g?: number | null;
  valine_g?: number | null;
  histidine_g?: number | null;
  lysine_g?: number | null;
  methionine_g?: number | null;
  phenylalanine_g?: number | null;
  threonine_g?: number | null;
  tryptophan_g?: number | null;
  total_bcaas_g?: number | null;
  total_eaas_g?: number | null;
  protein_source?: string | null;
  filtration_process?: string | null;
  gluten_free?: boolean | null;
  soy_free?: boolean | null;
  vegetarian?: boolean | null;
  vegan?: boolean | null;
  keto_friendly?: boolean | null;
  allergens_list?: string[] | null;
  price_per_protein_g?: number | null;
  price_per_serving?: number | null;
  flavors_list?: string[] | null;
  additional_compounds_map?: Record<string, string | number> | null;
  product_specific_certifications?: Certification[] | null;
  product_sizes_details?: ProductSizeDetail[] | null;
}