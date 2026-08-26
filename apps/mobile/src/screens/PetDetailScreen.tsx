import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Pencil, Plus, Stethoscope, Weight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AppHeader } from "@/components/AppHeader";
import type { Tables } from "@vetvalpo/supabase";

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
}

export function PetDetailScreen() {
  const { mascotaId } = useParams<{ mascotaId: string }>();
  const [mascota, setMascota] = useState<Tables<"mascotas"> | null | undefined>(undefined);
  const [visitas, setVisitas] = useState<Tables<"visitas">[]>([]);

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

  if (mascota === undefined) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <AppHeader title="Mascota" back />
        <p className="p-4 text-center text-sm text-neutral-500">Cargando…</p>
      </div>
    );
  }

  if (mascota === null) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <AppHeader title="Mascota" back />
        <p className="p-4 text-center text-sm text-neutral-500">No se encontró la mascota.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      <AppHeader
        title={mascota.nombre}
        subtitle={`${mascota.especie}${mascota.raza ? ` · ${mascota.raza}` : ""}`}
        back
        action={
          <Link to={`/mascotas/${mascota.id}/editar`} aria-label="Editar mascota">
            <Pencil size={20} />
          </Link>
        }
      />

      <div className="space-y-4 p-4">
        <section className="grid grid-cols-2 gap-3 rounded-xl bg-white p-4 shadow-sm text-sm">
          <div>
            <p className="text-neutral-400">Sexo</p>
            <p className="font-medium capitalize text-neutral-800">{mascota.sexo ?? "—"}</p>
          </div>
          <div>
            <p className="text-neutral-400">Esterilizado</p>
            <p className="font-medium text-neutral-800">{mascota.esterilizado ? "Sí" : "No"}</p>
          </div>
          <div>
            <p className="text-neutral-400">Peso actual</p>
            <p className="font-medium text-neutral-800">{mascota.peso_actual ? `${mascota.peso_actual} kg` : "—"}</p>
          </div>
          <div>
            <p className="text-neutral-400">Color</p>
            <p className="font-medium text-neutral-800">{mascota.color ?? "—"}</p>
          </div>
          {mascota.alergias && (
            <div className="col-span-2">
              <p className="text-neutral-400">Alergias</p>
              <p className="font-medium text-neutral-800">{mascota.alergias}</p>
            </div>
          )}
          {mascota.condiciones_cronicas && (
            <div className="col-span-2">
              <p className="text-neutral-400">Condiciones crónicas</p>
              <p className="font-medium text-neutral-800">{mascota.condiciones_cronicas}</p>
            </div>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Historial de visitas</h2>
          </div>

          {visitas.length === 0 ? (
            <p className="text-sm text-neutral-500">Sin visitas registradas.</p>
          ) : (
            <ul className="space-y-2">
              {visitas.map((visita) => (
                <li key={visita.id} className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-neutral-800">
                      <Stethoscope size={15} className="text-primary" /> {visita.motivo}
                    </p>
                    <p className="text-xs text-neutral-400">{formatFecha(visita.fecha)}</p>
                  </div>
                  {visita.diagnostico && <p className="text-sm text-neutral-600">{visita.diagnostico}</p>}
                  {visita.peso_registrado && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
                      <Weight size={12} /> {visita.peso_registrado} kg
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <Link
        to={`/mascotas/${mascota.id}/visitas/nueva`}
        className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 font-semibold text-white shadow-lg"
      >
        <Plus size={20} /> Nueva visita
      </Link>
    </div>
  );
}
