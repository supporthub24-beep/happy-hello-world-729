import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          email?: string;
          updated_at?: string;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          role?: string;
        };
      };
      film_roll_movements: {
        Row: {
          id: string;
          direction: "in" | "out";
          roll_type: "BOPP" | "CPP" | "PP";
          size: string;
          micron: number;
          weight_kg: number;
          supplier: string;
          notes: string;
          movement_date: string;
          created_by: string | null;
          created_by_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          direction: "in" | "out";
          roll_type: "BOPP" | "CPP" | "PP";
          size: string;
          micron: number;
          weight_kg: number;
          supplier?: string;
          notes?: string;
          movement_date?: string;
          created_by?: string | null;
          created_by_name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          direction?: "in" | "out";
          roll_type?: "BOPP" | "CPP" | "PP";
          size?: string;
          micron?: number;
          weight_kg?: number;
          supplier?: string;
          notes?: string;
          movement_date?: string;
          created_by_name?: string;
          updated_at?: string;
        };
      };
      granule_movements: {
        Row: {
          id: string;
          direction: "in" | "out";
          grade: string;
          batch_number: string;
          supplier: string;
          machine: string;
          weight_kg: number;
          notes: string;
          movement_date: string;
          created_by: string | null;
          created_by_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          direction: "in" | "out";
          grade: string;
          batch_number: string;
          supplier?: string;
          machine?: string;
          weight_kg: number;
          notes?: string;
          movement_date?: string;
          created_by?: string | null;
          created_by_name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          direction?: "in" | "out";
          grade?: string;
          batch_number?: string;
          supplier?: string;
          machine?: string;
          weight_kg?: number;
          notes?: string;
          movement_date?: string;
          created_by_name?: string;
          updated_at?: string;
        };
      };
    };
  };
};
