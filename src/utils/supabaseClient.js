import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || (typeof process !== 'undefined' && process.env.VITE_SUPABASE_URL);
const supabaseKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) || (typeof process !== 'undefined' && process.env.VITE_SUPABASE_PUBLISHABLE_KEY);

export const supabase = createClient(supabaseUrl, supabaseKey);