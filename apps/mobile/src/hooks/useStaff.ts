import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@vetvalpo/supabase";

/**
 * undefined = cargando, null = la sesión no corresponde a ningún staff activo,
 * "error" = no se pudo consultar (sin red): no es lo mismo que "no es staff".
 */
export function useStaff(session: Session, retryKey = 0) {
  const [staff, setStaff] = useState<Tables<"staff"> | null | undefined | "error">(undefined);

  useEffect(() => {
    let cancelled = false;
    setStaff(undefined);
    supabase
      .from("staff")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data, error, status }) => {
        if (cancelled) return;
        if (status === 401) {
          // Token guardado inválido o revocado: se descarta la sesión local y
          // App.tsx (onAuthStateChange) vuelve a iniciar sesión en silencio.
          supabase.auth.signOut({ scope: "local" });
          return;
        }
        setStaff(error ? "error" : data);
      });
    return () => {
      cancelled = true;
    };
  }, [session.user.id, retryKey]);

  return staff;
}
