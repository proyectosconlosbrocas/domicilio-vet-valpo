import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, PawPrint, Plus, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { supabase } from "@/lib/supabase";
import { AppHeader, headerIconClass } from "@/components/AppHeader";
import { EmptyState, Loading } from "@/components/ui";
import { fieldClass } from "@/components/fields";
import { buildClienteWhatsappLink, buildRegistroMessage } from "@/lib/whatsapp";
import type { Tables } from "@vetvalpo/supabase";

type ClienteConMascotas = Tables<"clientes"> & { mascotas: Tables<"mascotas">[] };

interface ClientListScreenProps {
  /** "ver": tocar un cliente abre su ficha (solo lectura + accesos). "editar": tocar un cliente va directo al formulario de edición. */
  mode: "ver" | "editar";
}

/** Búsqueda sin tildes ni mayúsculas: "Ramon" encuentra "Ramón". */
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export function ClientListScreen({ mode }: ClientListScreenProps) {
  const [clientes, setClientes] = useState<ClienteConMascotas[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoadError(false);
    supabase
      .from("clientes")
      .select("*, mascotas(*)")
      .eq("activo", true)
      .order("nombre")
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setLoadError(true);
        setClientes((data as ClienteConMascotas[]) ?? []);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const filtered = useMemo(() => {
    if (!clientes) return [];
    const q = normalize(query.trim());
    if (!q) return clientes;
    const qDigits = q.replace(/\D/g, "");
    return clientes.filter(
      (c) =>
        normalize(c.nombre).includes(q) ||
        (qDigits.length >= 3 && (c.telefono ?? "").replace(/\D/g, "").includes(qDigits)) ||
        c.mascotas.some((m) => normalize(m.nombre).includes(q))
    );
  }, [clientes, query]);

  return (
    <div className="min-h-screen bg-neutral-50 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
      <AppHeader
        title={mode === "editar" ? "Editar clientes" : "Clientes"}
        subtitle={clientes ? `${clientes.length} activos` : undefined}
        back
        action={
          <Link to="/clientes/nuevo" aria-label="Agregar cliente" className={headerIconClass}>
            <Plus size={24} />
          </Link>
        }
      />

      <div className="sticky top-[calc(57px+env(safe-area-inset-top))] z-[5] bg-neutral-50 px-4 pb-3 pt-4">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
          <input
            type="search"
            placeholder="Cliente, mascota o teléfono"
            aria-label="Buscar cliente"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${fieldClass} pl-10 pr-11`}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Limpiar búsqueda"
              className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-neutral-400"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="px-4">
        {clientes === null ? (
          <Loading />
        ) : loadError ? (
          <EmptyState>
            No se pudo cargar la lista.{" "}
            <button type="button" className="font-semibold text-primary-ink" onClick={() => setReloadKey((k) => k + 1)}>
              Reintentar
            </button>
          </EmptyState>
        ) : filtered.length === 0 ? (
          <EmptyState>
            {query ? (
              <>Ningún cliente coincide con “{query}”.</>
            ) : (
              <>
                Todavía no hay clientes.{" "}
                <Link to="/clientes/nuevo" className="font-semibold text-primary-ink">
                  Agregar el primero
                </Link>
              </>
            )}
          </EmptyState>
        ) : (
          <ul className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white">
            {filtered.map((cliente) => {
              const whatsappLink = buildClienteWhatsappLink(cliente.telefono, buildRegistroMessage(cliente.nombre));
              return (
                <li key={cliente.id} className="flex items-center">
                  <Link
                    to={mode === "editar" ? `/clientes/${cliente.id}/editar` : `/clientes/${cliente.id}`}
                    className="block min-w-0 flex-1 px-4 py-3 active:bg-neutral-50"
                  >
                    <p className="truncate font-semibold text-ink">{cliente.nombre}</p>
                    <p className="truncate text-sm text-neutral-500">{cliente.telefono ?? "Sin teléfono"}</p>
                    {cliente.mascotas.length > 0 && (
                      <p className="mt-1 flex items-center gap-1 truncate text-sm text-neutral-600">
                        <PawPrint size={13} className="shrink-0 text-primary-ink" aria-hidden="true" />
                        {cliente.mascotas.map((m) => m.nombre).join(", ")}
                      </p>
                    )}
                  </Link>
                  {whatsappLink && (
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Escribir a ${cliente.nombre} por WhatsApp`}
                      className="mr-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-whatsapp/10 text-whatsapp active:bg-whatsapp/20"
                    >
                      <FaWhatsapp size={20} />
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
