import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pnwnbascwchzajthrhuo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBud25iYXNjd2NoemFqdGhyaHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMDkxMDgsImV4cCI6MjA4Nzg4NTEwOH0.DgDCY-bZBhEIWoLj18r2z16SQEcNVHyyAQczc5zOibc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
