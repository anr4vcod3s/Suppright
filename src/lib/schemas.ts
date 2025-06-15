import { z } from 'zod';

// ---------- Base Types ----------

const uuidSchema = z.string().uuid();
const priceSchema = z.number().positive().multipleOf(0.01);
const weightSchema = z.number().positive();
const percentageSchema = z.number().min(0).max(100);
const booleanSchema = z.boolean();
const textArraySchema = z.array(z.string());

// ---------- Certifications Schema (moved up before ProductSchema) ----------

// Certifications Table Schema
export const CertificationSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(100),
  image_url: z.string().url().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type Certification = z.infer<typeof CertificationSchema>;

// ---------- Core Tables Schemas ----------

// Products Table Schema
export const ProductSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(255),
  brand: z.string().min(1).max(100),
  description: z.string().optional(),
  slug: z.string(),
  image_url: z.string().url().optional(),
  serving_size: z.number().positive(),
  servings_per_container: z.number().positive(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  certifications: z.array(CertificationSchema).optional(),
});

export type Product = z.infer<typeof ProductSchema>;

// Product Sizes Table Schema
export const ProductSizeSchema = z.object({
  id: uuidSchema,
  product_id: uuidSchema,
  size_kg: weightSchema,
  price: priceSchema,
  is_popular: booleanSchema.default(false),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type ProductSize = z.infer<typeof ProductSizeSchema>;

// Nutritional Info Table Schema
export const NutritionalInfoSchema = z.object({
  product_id: uuidSchema,
  calories: z.number().nonnegative(),
  protein_g: z.number().nonnegative(),
  carbohydrates_g: z.number().nonnegative(),
  fats_g: z.number().nonnegative(),
  saturated_fats_g: z.number().nonnegative().optional(),
  cholesterol_mg: z.number().nonnegative().optional(),
  sodium_mg: z.number().nonnegative().optional(),
  protein_percentage: percentageSchema,
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type NutritionalInfo = z.infer<typeof NutritionalInfoSchema>;

// Amino Profiles Table Schema
export const AminoProfileSchema = z.object({
  product_id: uuidSchema,
  // BCAAs
  leucine_g: z.number().nonnegative(),
  isoleucine_g: z.number().nonnegative(),
  valine_g: z.number().nonnegative(),
  // Other common amino acids
  alanine_g: z.number().nonnegative().optional(),
  arginine_g: z.number().nonnegative().optional(),
  aspartic_acid_g: z.number().nonnegative().optional(),
  cysteine_g: z.number().nonnegative().optional(),
  glutamic_acid_g: z.number().nonnegative().optional(),
  glutamine_g: z.number().nonnegative().optional(),
  glycine_g: z.number().nonnegative().optional(),
  histidine_g: z.number().nonnegative().optional(),
  lysine_g: z.number().nonnegative().optional(),
  methionine_g: z.number().nonnegative().optional(),
  phenylalanine_g: z.number().nonnegative().optional(),
  proline_g: z.number().nonnegative().optional(),
  serine_g: z.number().nonnegative().optional(),
  threonine_g: z.number().nonnegative().optional(),
  tryptophan_g: z.number().nonnegative().optional(),
  tyrosine_g: z.number().nonnegative().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type AminoProfile = z.infer<typeof AminoProfileSchema>;

// Product Features Table Schema
export const ProductFeaturesSchema = z.object({
  product_id: uuidSchema,
  protein_source: z.enum([
    'whey_concentrate', 
    'whey_isolate', 
    'whey_hydrolysate', 
    'casein', 
    'egg', 
    'soy', 
    'pea', 
    'rice', 
    'hemp', 
    'mixed_plant',
    'collagen',
    'other'
  ]),
  filtration_process: z.enum([
    'micro_filtration',
    'ultra_filtration',
    'cross_flow_filtration',
    'ion_exchange',
    'cold_processed',
    'not_specified',
    'other'
  ]).optional(),
  manufacturing_country: z.string().optional(),
  manufacturing_standards: z.string().optional(),
  artificial_sweeteners: booleanSchema.default(false),
  natural_sweeteners: booleanSchema.default(false),
  artificial_flavoring: booleanSchema.default(false),
  grass_fed: booleanSchema.default(false),
  hormone_free: booleanSchema.default(false),
  third_party_tested: booleanSchema.default(false),
  banned_substance_tested: booleanSchema.default(false),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type ProductFeatures = z.infer<typeof ProductFeaturesSchema>;

// Dietary Info Table Schema
export const DietaryInfoSchema = z.object({
  product_id: uuidSchema,
  lactose_content_g: z.number().nonnegative().optional(),
  gluten_free: booleanSchema.default(false),
  soy_free: booleanSchema.default(false),
  vegetarian: booleanSchema.default(false),
  vegan: booleanSchema.default(false),
  keto_friendly: booleanSchema.default(false),
  allergens: textArraySchema.optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type DietaryInfo = z.infer<typeof DietaryInfoSchema>;

// Product Flavors Table Schema
export const ProductFlavorSchema = z.object({
  id: uuidSchema,
  product_id: uuidSchema,
  flavor_name: z.string().min(1).max(100),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type ProductFlavor = z.infer<typeof ProductFlavorSchema>;

// Additional Compounds Table Schema
export const AdditionalCompoundsSchema = z.object({
  product_id: uuidSchema,
  compounds: z.record(z.string(), z.number()).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type AdditionalCompounds = z.infer<typeof AdditionalCompoundsSchema>;

// Product Certifications Table Schema (junction table)
export const ProductCertificationSchema = z.object({
  product_id: uuidSchema,
  certification_id: uuidSchema,
  created_at: z.date().optional(),
});

export type ProductCertification = z.infer<typeof ProductCertificationSchema>;

// ---------- View Schemas ----------

// Product Card Info View Schema (for product listing cards)
export const ProductCardInfoSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  brand: z.string(),
  image_url: z.string().url().optional(),
  protein_percentage: percentageSchema,
  display_price: priceSchema,
  display_size: weightSchema,
  flavors: textArraySchema,
  price_per_serving: priceSchema,
});

export type ProductCardInfo = z.infer<typeof ProductCardInfoSchema>;

// Product Complete Info View Schema (for product detail pages)
export const ProductCompleteInfoSchema = z.object({
  // Base product info
  id: uuidSchema,
  name: z.string(),
  brand: z.string(),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
  serving_size: z.number().positive(),
  servings_per_container: z.number().positive(),
  
  // Size and pricing info
  sizes: z.array(z.object({
    size_kg: weightSchema,
    price: priceSchema,
    is_popular: booleanSchema,
  })),
  
  // Nutritional info
  nutritional_info: z.object({
    calories: z.number().nonnegative(),
    protein_g: z.number().nonnegative(),
    carbohydrates_g: z.number().nonnegative(),
    fats_g: z.number().nonnegative(),
    saturated_fats_g: z.number().nonnegative().optional(),
    cholesterol_mg: z.number().nonnegative().optional(),
    sodium_mg: z.number().nonnegative().optional(),
    protein_percentage: percentageSchema,
  }),
  
  // Amino profile
  amino_profile: z.object({
    bcaas: z.object({
      leucine_g: z.number().nonnegative(),
      isoleucine_g: z.number().nonnegative(),
      valine_g: z.number().nonnegative(),
      total_bcaa_g: z.number().nonnegative(),
    }),
    eaas: z.record(z.string(), z.number()).optional(),
    other_aminos: z.record(z.string(), z.number()).optional(),
  }).optional(),
  
  // Features
  features: z.object({
    protein_source: z.string(),
    filtration_process: z.string().optional(),
    manufacturing_country: z.string().optional(),
    manufacturing_standards: z.string().optional(),
    artificial_sweeteners: booleanSchema,
    natural_sweeteners: booleanSchema,
    artificial_flavoring: booleanSchema,
    grass_fed: booleanSchema,
    hormone_free: booleanSchema,
    third_party_tested: booleanSchema,
    banned_substance_tested: booleanSchema,
  }),
  
  // Dietary info
  dietary_info: z.object({
    lactose_content_g: z.number().nonnegative().optional(),
    gluten_free: booleanSchema,
    soy_free: booleanSchema,
    vegetarian: booleanSchema,
    vegan: booleanSchema,
    keto_friendly: booleanSchema,
    allergens: textArraySchema.optional(),
  }),
  
  // Flavors
  flavors: textArraySchema,
  
  // Additional compounds
  additional_compounds: z.record(z.string(), z.number()).optional(),
  
  // Certifications
  certifications: z.array(z.object({
    name: z.string(),
    image_url: z.string().url().optional(),
  })).optional(),
  
  // Value metrics
  value_metrics: z.object({
    price_per_serving: priceSchema,
    price_per_kg: priceSchema,
    price_per_protein_g: priceSchema,
  }),
  
  // Amino acid value metrics
  amino_acid_value_metrics: z.object({
    price_per_bcaa_g: priceSchema.optional(),
    price_per_eaa_g: priceSchema.optional(),
    price_per_glutamine_g: priceSchema.optional(),
  }).optional(),
});

export type ProductCompleteInfo = z.infer<typeof ProductCompleteInfoSchema>;

// ---------- Materialized View Schemas ----------

// Product Value Metrics View Schema
export const ProductValueMetricsSchema = z.object({
  product_id: uuidSchema,
  size_kg: weightSchema,
  price: priceSchema,
  affiliate_url: z.string().url().optional(),
  retailer_name: z.string().optional(),
  price_per_serving: priceSchema,
  price_per_kg: priceSchema,
  price_per_protein_g: priceSchema,
});

export type ProductValueMetrics = z.infer<typeof ProductValueMetricsSchema>;

// Amino Acid Value Metrics View Schema
export const AminoAcidValueMetricsSchema = z.object({
  product_id: uuidSchema,
  price_per_bcaa_g: priceSchema.optional(),
  price_per_eaa_g: priceSchema.optional(),
  price_per_glutamine_g: priceSchema.optional(),
});

export type AminoAcidValueMetrics = z.infer<typeof AminoAcidValueMetricsSchema>;

// ---------- Helper Functions ----------

// Function to validate a complete product with all related data
export const validateCompleteProduct = (data: unknown): ProductCompleteInfo => {
  return ProductCompleteInfoSchema.parse(data);
};

// Function to validate a product card for listing
export const validateProductCard = (data: unknown): ProductCardInfo => {
  return ProductCardInfoSchema.parse(data);
};

// Function to validate product value metrics
export const validateProductValueMetrics = (data: unknown): ProductValueMetrics => {
  return ProductValueMetricsSchema.parse(data);
};

// ---------- Input Schemas for Insertion/Updates ----------

// Schema for creating a new product (minimal required fields)
export const CreateProductSchema = ProductSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Schema for updating a product
export const UpdateProductSchema = ProductSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Add to your Product schema or create extended type
export interface ExtendedProduct extends Product {
  additional_compounds?: Record<string, number>;
  flavors?: string[];
}
