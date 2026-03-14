import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If Supabase env vars are not configured, export null so components can
// gracefully degrade instead of crashing with an invalid client.
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export interface Prediction {
  id: string;
  time_value: number;
  bs_station: string;
  load: number;
  esmode: number;
  txpower: number;
  predicted_energy: number;
  created_at: string;
}

