import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

// Validate Supabase environment variables
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10, 'Invalid Supabase Anon Key')
})

// Validate and parse environment variables
const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
})

// Create Supabase client for both server and client-side use
export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL, 
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
