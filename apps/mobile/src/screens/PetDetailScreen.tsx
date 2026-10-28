import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertTriangle, Pencil, Plus, Weight, CalendarClock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AppHeader, headerIconClass } from "@/components/AppHeader";
import { EmptyState, Loading, Section } from "@/components/ui";
import type { Tables } from "@vetvalpo/supabase";

function formatFecha(iso: string) {
  // Las fechas "YYYY-MM-DD" se leen en UTC para que no se corran un día en Chile.
  const date = iso.length === 10 ? new Date(`${iso}T12:00:00Z`) : new Date(iso);
  return date.toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" });
}

function edad(fechaNacimiento: string | null): string | null {
  if (!fechaNacimiento) return null;
  const nacimiento = new Date(`${fechaNacimiento}T12:00:00Z`);
  const meses =
    (new Date().getFullYear() - nacimiento.getUTCFullYear()) * 12 + (new Date().getMonth() - nacimiento.getUTCMonth());
  if (meses < 0) return null;
  if (meses < 12) return `${meses} ${meses === 1 ? "mes" : "meses"}`;
  const anios = Math.floor(meses / 12);
  return `${anios} ${anios === 1 ? "año" : "años"}`;
}

export function PetDetailScreen() {
  const { mascotaId } = useParams<{ mascotaId: string }>();
  const [mascota, setMascota] = useState<Tables<"mascotas"> | null | undefined>(undefined);
  const [visitas, setVisitas] = useState<Tables<"visitas">[] | null>(null);

  useEffect(() => {
    if (!mascotaId) return;
    let cancelled = false;

    supabase
      .from("mascotas")
      .select("*")
      .eq("id", mascotaId)
      .single()
      .then(({ data }) => {
        if (!cancelled) setMascota(data ?? null);
      });

    supabase
      .from("visitas")
      .select("*")
      .eq("mascota_id", mascotaId)
      .order("fecha", { ascending: false })
      .then(({ data }) => {
        if (!cancelled) setVisitas(data ?? []);
      });

    return () => {
      cancelled = true;
    };
  }, [mascotaId]);

  if (mascota === undefined || mascota === null) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <AppHeader title="Mascota" back />
        {mascota === undefined ? <Loading /> : <div className="p-4"><EmptyState>No se encontró la mascota.</EmptyState></div>}
      </div>
    );
  }

  const datos: [string, string][] = [
    ["Sexo", mascota.sexo && mascota.sexo !== "desconocido" ? mascota.sexo[0].toUpperCase() + mascota.sexo.slice(1) : "—"],
    ["Esterilizado", mascota.esterilizado ? "Sí" : "No"],
    ["Peso actual", mascota.peso_actual ? `${mascota.peso_actual} kg` : "—"],
    ["Edad", edad(mascota.fecha_nacimiento) ?? "—"],
    ["Color", mascota.color ?? "—"],
    ["Microchip", mascota.microchip ?? "—"],
  ];

  return (
    <div className="min-h-screen bg-neutral-50 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
      <AppHeader
        title={mascota.nombre}
        subtitle={`${mascota.especie}${mascota.raza ? ` · ${mascota.raza}` : ""}`}
        back
        action={
          <Link to={`/mascotas/${mascota.id}/editar`} aria-label="Editar mascota" className={headerIconClass}>
            <Pencil size={20} />
          </Link>
        }
      />

      <div className="space-y-4 p-4">
        {/* Alergias y condiciones crónicas arriba y destacadas: es lo que no se puede pasar por alto antes de tratar. */}
        {(mascota.alergias || mascota.condiciones_cronicas) && (
          <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-950" role="note">
            <p className="mb-1 flex items-center gap-2 font-semibold">
              <AlertTriangle size={17} aria-hidden="true" /> Antes de tratar
            </p>
            {mascota.alergias && (
              <p>
                <span className="font-medium">Alergias:</span> {mascota.alergias}
              </p>
            )}
            {mascota.condiciones_cronicas && (
              <p>
                <span className="font-medium">Condiciones crónicas:</span> {mascota.condiciones_cronicas}
              </p>
            )}
          </div>
        )}

        <Section title="Datos">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {datos.map(([label, value]) => (
              <div key={label} className="min-w-0">
                <dt className="text-neutral-500">{label}</dt>
                <dd className="truncate font-medium text-ink">{value}</dd>
              </div>
            ))}
            {mascota.temperamento && (
              <div className="col-span-2">
                <dt className="text-neutral-500">Temperamento</dt>
                <dd className="font-medium text-ink">{mascota.temperamento}</dd>
              </div>
            )}
          </dl>
        </Section>

        <Section title={visitas ? `Historial (${visitas.length})` : "Historial"}>
          {visitas === null ? (
            <Loading />
          ) : visitas.length === 0 ? (
            <p className="text-sm text-neutral-500">Sin visitas registradas.</p>
          ) : (
            <ol className="-mx-4 -mb-4 divide-y divide-neutral-100 border-t border-neutral-100">
              {visitas.map((visita) => (
                <li key={visita.id} className="px-4 py-3">
                  <div className="mb-0.5 flex items-baseline justify-between gap-3">
                    <p className="min-w-0 font-semibold text-ink">{visita.motivo}</p>
                    <p className="shrink-0 text-xs tabular-nums text-neutral-500">{formatFecha(visita.fecha)}</p>
                  </div>
                  {visita.diagnostico && <p className="text-sm text-neutral-700">{visita.diagnostico}</p>}
                  {visita.tratamiento && (
                    <p className="text-sm text-neutral-600">
                      <span className="text-neutral-500">Tratamiento:</span> {visita.tratamiento}
                    </p>
                  )}
                  {(visita.peso_registrado || visita.proxima_cita) && (
                    <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
                      {visita.peso_registrado && (
                        <span className="flex items-center gap-1">
                          <Weight size={12} aria-hidden="true" /> {visita.peso_registrado} kg
                        </span>
                      )}
                      {visita.proxima_cita && (
                        <span className="flex items-center gap-1">
                          <CalendarClock size={12} aria-hidden="true" /> Control: {formatFecha(visita.proxima_cita)}
                        </span>
                      )}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          )}
        </Section>
      </div>

      <Link
        to={`/mascotas/${mascota.id}/visitas/nueva`}
        className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-4 flex min-h-14 items-center gap-2 rounded-full bg-primary-ink px-5 font-heading font-bold text-white shadow-lg shadow-black/15 active:scale-[0.97]"
      >
        <Plus size={20} aria-hidden="true" /> Registrar visita
      </Link>
    </div>
  );
}
