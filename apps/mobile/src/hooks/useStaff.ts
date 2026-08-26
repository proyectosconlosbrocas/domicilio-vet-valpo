import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@vetvalpo/supabase";

/** undefined = cargando, null = la sesión no corresponde a ningún staff activo. */
export function useStaff(session: Session) {
  const [staff, setStaff] = useState<Tables<"staff"> | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    setStaff(undefined);
    supabase
      .from("staff")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setStaff(data);
      });
    return () => {
      cancelled = true;
    };
  }, [session.user.id]);

  return staff;
}
