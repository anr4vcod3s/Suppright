import { z } from 'zod'

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Product name is required'),
  brand: z.string().min(1, 'Brand is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  category_id: z.string().uuid(),
  image_url: z.string().nullable().default('/placeholder.png'),
  serving_size: z.number().positive('Serving size must be positive'),
  servings_per_container: z.number().int().positive('Servings per container must be a positive integer'),
  nutritional_info: z.object({
    calories: z.number().int().nonnegative(),
    protein: z.number().nonnegative(),
    carbohydrates: z.number().nonnegative(),
    sugars: z.number().nonnegative(),
    fats: z.number().nonnegative(),
  }).optional(),
  certifications: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      image_url: z.string().url()
    })
  ).default([])
});

  
  // Search input validation schema
  export const SearchInputSchema = z.object({
    query: z.string().trim().min(1, 'Search query must be at least 1 character long'),
    category: z.string().optional()
  })
  
  // Comparison basket state validation schema
  export const ComparisonBasketSchema = z.object({
    products: z.array(ProductSchema).max(4, 'Cannot compare more than 4 products')
  })