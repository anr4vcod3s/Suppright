// types/index.ts
import { z } from 'zod';
import { ProductSchema } from '@/lib/supabase/schemas';

export type Product = z.infer<typeof ProductSchema>;
export type CartItem = Product; // Ensure cart items follow product schema

export interface ComparisonCart {
  items: CartItem[];
  maxItems: number;
}

export interface SearchState {
  query: string;
  results: Product[];
  isLoading: boolean;
  error: Error | null;
}