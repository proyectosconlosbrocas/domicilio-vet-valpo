import { createVetSupabaseClient } from "@vetvalpo/supabase";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createVetSupabaseClient(url, anonKey);
