import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, PawPrint, Stethoscope, Syringe, Bug } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@vetvalpo/supabase";

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
}

export function MascotaHistoryCard({ mascota }: { mascota: Tables<"mascotas"> }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [visitas, setVisitas] = useState<Tables<"visitas">[]>([]);
  const [vacunas, setVacunas] = useState<Tables<"vacunas">[]>([]);
  const [desparasitaciones, setDesparasitaciones] = useState<Tables<"desparasitaciones">[]>([]);

  useEffect(() => {
    if (!open || loaded) return;
    Promise.all([
      supabase.from("visitas").select("*").eq("mascota_id", mascota.id).order("fecha", { ascending: false }),
      supabase.from("vacunas").select("*").eq("mascota_id", mascota.id).order("fecha_aplicacion", { ascending: false }),
      supabase
        .from("desparasitaciones")
        .select("*")
        .eq("mascota_id", mascota.id)
        .order("fecha", { ascending: false }),
    ]).then(([v, va, d]) => {
      setVisitas(v.data ?? []);
      setVacunas(va.data ?? []);
      setDesparasitaciones(d.data ?? []);
      setLoaded(true);
    });
  }, [open, loaded, mascota.id]);

  return (
    <div className="rounded-2xl bg-white shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PawPrint size={22} />
          </div>
          <div>
            <p className="font-heading font-bold text-neutral-800">{mascota.nombre}</p>
            <p className="text-sm text-neutral-500">
              {mascota.especie}
              {mascota.raza ? ` · ${mascota.raza}` : ""}
              {mascota.peso_actual ? ` · ${mascota.peso_actual} kg` : ""}
            </p>
          </div>
        </div>
        {open ? <ChevronUp className="text-neutral-400" /> : <ChevronDown className="text-neutral-400" />}
      </button>

      {open && (
        <div className="space-y-4 border-t border-neutral-100 p-4">
          {!loaded ? (
            <p className="text-sm text-neutral-500">Cargando historial…</p>
          ) : (
            <>
              <HistorySection
                icon={<Stethoscope size={16} className="text-primary" />}
                title="Visitas"
                empty="Sin visitas registradas."
                items={visitas.map((v) => ({
                  id: v.id,
                  fecha: formatFecha(v.fecha),
                  title: v.motivo,
                  detail: v.diagnostico,
                }))}
              />
              <HistorySection
                icon={<Syringe size={16} className="text-primary" />}
                title="Vacunas"
                empty="Sin vacunas registradas."
                items={vacunas.map((v) => ({
                  id: v.id,
                  fecha: formatFecha(v.fecha_aplicacion),
                  title: v.tipo,
                  detail: v.proxima_dosis ? `Próxima dosis: ${formatFecha(v.proxima_dosis)}` : null,
                }))}
              />
              <HistorySection
                icon={<Bug size={16} className="text-primary" />}
                title="Desparasitaciones"
                empty="Sin desparasitaciones registradas."
                items={desparasitaciones.map((d) => ({
                  id: d.id,
                  fecha: formatFecha(d.fecha),
                  title: `${d.tipo}${d.producto ? ` — ${d.producto}` : ""}`,
                  detail: d.proxima_dosis ? `Próxima dosis: ${formatFecha(d.proxima_dosis)}` : null,
                }))}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface HistoryItem {
  id: string;
  fecha: string;
  title: string;
  detail?: string | null;
}

function HistorySection({
  icon,
  title,
  empty,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  empty: string;
  items: HistoryItem[];
}) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
        {icon} {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-400">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="rounded-lg bg-neutral-50 p-3 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-medium text-neutral-700">{item.title}</p>
                <p className="text-xs text-neutral-400">{item.fecha}</p>
              </div>
              {item.detail && <p className="mt-0.5 text-neutral-500">{item.detail}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
