import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, PawPrint } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AppHeader } from "@/components/AppHeader";
import type { Tables } from "@vetvalpo/supabase";

type ClienteConMascotas = Tables<"clientes"> & { mascotas: Tables<"mascotas">[] };

interface ClientListScreenProps {
  /** "ver": tocar un cliente abre su ficha (solo lectura + accesos). "editar": tocar un cliente va directo al formulario de edición. */
  mode: "ver" | "editar";
}

export function ClientListScreen({ mode }: ClientListScreenProps) {
  const [clientes, setClientes] = useState<ClienteConMascotas[] | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("clientes")
      .select("*, mascotas(*)")
      .eq("activo", true)
      .order("nombre")
      .then(({ data }) => {
        if (!cancelled) setClientes((data as ClienteConMascotas[]) ?? []);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!clientes) return [];
    const q = query.trim().toLowerCase();
    if (!q) return clientes;
    return clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        (c.telefono ?? "").toLowerCase().includes(q) ||
        c.mascotas.some((m) => m.nombre.toLowerCase().includes(q))
    );
  }, [clientes, query]);

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <AppHeader title={mode === "editar" ? "Editar clientes" : "Clientes"} back />

      <div className="p-4">
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            placeholder="Buscar por cliente, mascota o teléfono…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {clientes === null ? (
          <p className="text-center text-sm text-neutral-500">Cargando…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-neutral-500">
            {query ? "Sin resultados." : "Todavía no hay clientes registrados."}
          </p>
        ) : (
          <ul className="space-y-2">
            {filtered.map((cliente) => (
              <li key={cliente.id}>
                <Link
                  to={mode === "editar" ? `/clientes/${cliente.id}/editar` : `/clientes/${cliente.id}`}
                  className="block rounded-xl bg-white p-4 shadow-sm transition active:scale-[0.99]"
                >
                  <p className="font-semibold text-neutral-800">{cliente.nombre}</p>
                  <p className="text-sm text-neutral-500">{cliente.telefono ?? "Sin teléfono"}</p>
                  {cliente.mascotas.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {cliente.mascotas.map((m) => (
                        <span
                          key={m.id}
                          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                        >
                          <PawPrint size={12} /> {m.nombre}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
