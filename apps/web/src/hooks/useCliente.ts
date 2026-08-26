import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@vetvalpo/supabase";

type ClienteConMascotas = Tables<"clientes"> & { mascotas: Tables<"mascotas">[] };

/** undefined = cargando. null = ese auth_user_id todavía no tiene fila en clientes (falta completar el perfil). */
export function useCliente(authUserId: string) {
  const [cliente, setCliente] = useState<ClienteConMascotas | null | undefined>(undefined);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setCliente(undefined);
    supabase
      .from("clientes")
      .select("*, mascotas(*)")
      .eq("auth_user_id", authUserId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setCliente((data as ClienteConMascotas) ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [authUserId, reloadToken]);

  return { cliente, refetch: () => setReloadToken((t) => t + 1) };
}
