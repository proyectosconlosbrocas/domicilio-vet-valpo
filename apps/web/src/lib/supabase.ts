import { createVetSupabaseClient } from "@vetvalpo/supabase";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createVetSupabaseClient(url, anonKey);

// Solo en dev: permite a los tests E2E setear una sesión real (generada vía
// Admin API) sin depender de recibir un email de verdad. Nunca se incluye
// en el build de producción (import.meta.env.DEV es false en `vite build`).
if (import.meta.env.DEV) {
  (window as unknown as { __supabase: typeof supabase }).__supabase = supabase;
}
