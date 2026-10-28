import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Pencil, Phone, MapPin, Plus, PawPrint, Mail, Navigation, ChevronRight, CalendarPlus, ShieldAlert } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { supabase } from "@/lib/supabase";
import { AppHeader, headerIconClass } from "@/components/AppHeader";
import { EmptyState, Loading, Section } from "@/components/ui";
import { buildClienteWhatsappLink, buildRegistroMessage } from "@/lib/whatsapp";
import type { Tables } from "@vetvalpo/supabase";

type ClienteConMascotas = Tables<"clientes"> & { mascotas: Tables<"mascotas">[] };

const quickActionClass =
  "flex min-h-16 flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-semibold active:scale-[0.97] transition";

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

  if (cliente === undefined || cliente === null) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <AppHeader title="Cliente" back />
        {cliente === undefined ? <Loading /> : <div className="p-4"><EmptyState>No se encontró el cliente.</EmptyState></div>}
      </div>
    );
  }

  const whatsappLink = buildClienteWhatsappLink(cliente.telefono, buildRegistroMessage(cliente.nombre));
  const tieneUbicacion = cliente.direccion_lat != null && cliente.direccion_lng != null;
  const mapsLink = tieneUbicacion
    ? `https://www.google.com/maps/dir/?api=1&destination=${cliente.direccion_lat},${cliente.direccion_lng}`
    : cliente.direccion
      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(cliente.direccion)}`
      : null;

  return (
    <div className="min-h-screen bg-neutral-50 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
      <AppHeader
        title={cliente.nombre}
        subtitle={cliente.rut ?? undefined}
        back
        action={
          <Link to={`/clientes/${cliente.id}/editar`} aria-label="Editar cliente" className={headerIconClass}>
            <Pencil size={20} />
          </Link>
        }
      />

      <div className="space-y-4 p-4">
        {/* Las tres cosas que se hacen con un cliente en terreno, al alcance del pulgar. */}
        <div className="flex gap-2">
          {cliente.telefono && (
            <a href={`tel:${cliente.telefono}`} className={`${quickActionClass} border border-neutral-200 bg-white text-ink`}>
              <Phone size={20} /> Llamar
            </a>
          )}
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`${quickActionClass} bg-whatsapp text-white`}
            >
              <FaWhatsapp size={20} /> WhatsApp
            </a>
          )}
          {mapsLink && (
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`${quickActionClass} border border-neutral-200 bg-white text-ink`}
            >
              <Navigation size={20} /> Cómo llegar
            </a>
          )}
        </div>

        <Section title="Contacto">
          <dl className="space-y-3 text-sm">
            {cliente.telefono && (
              <div className="flex items-start gap-3">
                <Phone size={17} className="mt-0.5 shrink-0 text-neutral-400" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Teléfono</dt>
                  <dd className="text-ink">
                    {cliente.telefono}
                    {cliente.telefono_alternativo && (
                      <span className="text-neutral-500"> · {cliente.telefono_alternativo}</span>
                    )}
                  </dd>
                </div>
              </div>
            )}
            {cliente.email && (
              <div className="flex items-start gap-3">
                <Mail size={17} className="mt-0.5 shrink-0 text-neutral-400" aria-hidden="true" />
                <div className="min-w-0">
                  <dt className="sr-only">Email</dt>
                  <dd className="break-words text-ink">{cliente.email}</dd>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <MapPin size={17} className="mt-0.5 shrink-0 text-neutral-400" aria-hidden="true" />
              <div>
                <dt className="sr-only">Dirección</dt>
                <dd className="text-ink">
                  {cliente.direccion || <span className="text-neutral-500">Sin dirección</span>}
                  {tieneUbicacion && <span className="block text-xs text-neutral-500">Ubicación GPS guardada</span>}
                </dd>
              </div>
            </div>
            {cliente.contacto_emergencia_nombre && (
              <div className="flex items-start gap-3">
                <ShieldAlert size={17} className="mt-0.5 shrink-0 text-neutral-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-neutral-500">Emergencia</dt>
                  <dd className="text-ink">
                    {cliente.contacto_emergencia_nombre}
                    {cliente.contacto_emergencia_telefono && (
                      <a href={`tel:${cliente.contacto_emergencia_telefono}`} className="block font-medium text-primary-ink">
                        {cliente.contacto_emergencia_telefono}
                      </a>
                    )}
                  </dd>
                </div>
              </div>
            )}
          </dl>
        </Section>

        <Section
          title={`Mascotas (${cliente.mascotas.length})`}
          action={
            <Link
              to={`/clientes/${cliente.id}/mascotas/nueva`}
              className="-my-2 flex min-h-11 items-center gap-1 text-sm font-semibold text-primary-ink"
            >
              <Plus size={16} /> Agregar
            </Link>
          }
        >
          {cliente.mascotas.length === 0 ? (
            <p className="text-sm text-neutral-500">Sin mascotas registradas.</p>
          ) : (
            <ul className="-mx-4 -mb-4 divide-y divide-neutral-100 border-t border-neutral-100">
              {cliente.mascotas.map((mascota) => (
                <li key={mascota.id}>
                  <Link to={`/mascotas/${mascota.id}`} className="flex min-h-16 items-center gap-3 px-4 active:bg-neutral-50">
                    <PawPrint size={20} className="shrink-0 text-primary-ink" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink">{mascota.nombre}</p>
                      <p className="truncate text-sm text-neutral-500">
                        {mascota.especie}
                        {mascota.raza ? ` · ${mascota.raza}` : ""}
                        {mascota.estado !== "activo" ? ` · ${mascota.estado}` : ""}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-neutral-400" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Link
          to={`/agendar-visita?cliente=${cliente.id}`}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary-soft font-heading font-semibold text-primary-ink"
        >
          <CalendarPlus size={18} /> Agendar visita para {cliente.nombre.split(" ")[0]}
        </Link>
      </div>
    </div>
  );
}
