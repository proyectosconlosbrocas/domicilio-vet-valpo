import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Pencil, Phone, MapPin, Plus, PawPrint, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AppHeader } from "@/components/AppHeader";
import type { Tables } from "@vetvalpo/supabase";

type ClienteConMascotas = Tables<"clientes"> & { mascotas: Tables<"mascotas">[] };

export function ClientDetailScreen() {
  const { clienteId } = useParams<{ clienteId: string }>();
  const [cliente, setCliente] = useState<ClienteConMascotas | null | undefined>(undefined);

  useEffect(() => {
    if (!clienteId) return;
    let cancelled = false;
    supabase
      .from("clientes")
      .select("*, mascotas(*)")
      .eq("id", clienteId)
      .single()
      .then(({ data }) => {
        if (!cancelled) setCliente((data as ClienteConMascotas) ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [clienteId]);

  if (cliente === undefined) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <AppHeader title="Cliente" back />
        <p className="p-4 text-center text-sm text-neutral-500">Cargando…</p>
      </div>
    );
  }

  if (cliente === null) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <AppHeader title="Cliente" back />
        <p className="p-4 text-center text-sm text-neutral-500">No se encontró el cliente.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <AppHeader
        title={cliente.nombre}
        subtitle={cliente.rut ?? undefined}
        back
        action={
          <Link to={`/clientes/${cliente.id}/editar`} aria-label="Editar cliente">
            <Pencil size={20} />
          </Link>
        }
      />

      <div className="space-y-4 p-4">
        <section className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">Contacto</h2>
          <div className="space-y-2 text-sm text-neutral-700">
            {cliente.telefono && (
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-primary" /> {cliente.telefono}
              </p>
            )}
            {cliente.email && (
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-primary" /> {cliente.email}
              </p>
            )}
            {cliente.direccion && (
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" /> {cliente.direccion}
              </p>
            )}
            {cliente.contacto_emergencia_nombre && (
              <p className="text-neutral-500">
                Emergencia: {cliente.contacto_emergencia_nombre}
                {cliente.contacto_emergencia_telefono && ` — ${cliente.contacto_emergencia_telefono}`}
              </p>
            )}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Mascotas</h2>
            <Link
              to={`/clientes/${cliente.id}/mascotas/nueva`}
              className="flex items-center gap-1 text-sm font-medium text-primary"
            >
              <Plus size={16} /> Agregar
            </Link>
          </div>

          {cliente.mascotas.length === 0 ? (
            <p className="text-sm text-neutral-500">Sin mascotas registradas.</p>
          ) : (
            <ul className="space-y-2">
              {cliente.mascotas.map((mascota) => (
                <li key={mascota.id}>
                  <Link
                    to={`/mascotas/${mascota.id}`}
                    className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition active:scale-[0.99]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <PawPrint size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-800">{mascota.nombre}</p>
                      <p className="text-sm text-neutral-500">
                        {mascota.especie}
                        {mascota.raza ? ` · ${mascota.raza}` : ""}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
