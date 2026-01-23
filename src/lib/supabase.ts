import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
