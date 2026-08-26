import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export type { Database } from "./database.types";
export type VetSupabaseClient = SupabaseClient<Database>;

/**
 * Factory en vez de un singleton con env vars leídas acá adentro: Vite
 * (import.meta.env.VITE_*) y Expo (process.env.EXPO_PUBLIC_*) exponen las
 * variables de entorno de formas distintas — cada app las lee con su propia
 * convención y se las pasa a esta función.
 */
export function createVetSupabaseClient(url: string, anonKey: string): VetSupabaseClient {
  if (!url || !anonKey) {
    throw new Error(
      "createVetSupabaseClient: faltan url/anonKey. Revisá las variables de entorno " +
        "(VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY en web, EXPO_PUBLIC_SUPABASE_URL/" +
        "EXPO_PUBLIC_SUPABASE_ANON_KEY en mobile)."
    );
  }
  return createClient<Database>(url, anonKey);
}

// Re-exporta tipos de fila/insert/update por tabla para no repetir
// Database["public"]["Tables"]["x"]["Row"] en cada componente.
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
