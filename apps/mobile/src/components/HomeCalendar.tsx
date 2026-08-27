import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

const CHILE_TZ = "America/Santiago";
const WEEKDAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];
const MONTH_LABELS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

/** Fecha "de hoy" según la hora de Chile, sin importar la zona horaria del dispositivo. */
function chileToday(): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: CHILE_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get("year"), month: get("month") - 1, day: get("day") };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function dateStr(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

interface AgendaCliente {
  fecha: string;
  cliente_id: string;
  clientes: { nombre: string } | null;
}

export function HomeCalendar() {
  const today = useMemo(chileToday, []);
  const [viewYear, setViewYear] = useState(today.year);
  const [viewMonth, setViewMonth] = useState(today.month);
  const [agenda, setAgenda] = useState<AgendaCliente[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    const firstDay = dateStr(viewYear, viewMonth, 1);
    const daysInMonth = new Date(Date.UTC(viewYear, viewMonth + 1, 0)).getUTCDate();
    const lastDay = dateStr(viewYear, viewMonth, daysInMonth);

    let cancelled = false;
    setSelectedDay(null);
    supabase
      .from("agenda_visitas")
      .select("fecha, cliente_id, clientes(nombre)")
      .gte("fecha", firstDay)
      .lte("fecha", lastDay)
      .then(({ data }) => {
        if (!cancelled) setAgenda((data as unknown as AgendaCliente[]) ?? []);
      });
    return () => {
      cancelled = true;
    };
  }, [viewYear, viewMonth]);

  const agendaPorDia = useMemo(() => {
    const map = new Map<number, AgendaCliente[]>();
    for (const item of agenda) {
      const day = Number(item.fecha.slice(8, 10));
      map.set(day, [...(map.get(day) ?? []), item]);
    }
    return map;
  }, [agenda]);

  const daysInMonth = new Date(Date.UTC(viewYear, viewMonth + 1, 0)).getUTCDate();
  const firstWeekday = new Date(Date.UTC(viewYear, viewMonth, 1)).getUTCDay(); // 0=domingo
  const leadingBlanks = (firstWeekday + 6) % 7; // semana empieza en lunes

  const cells: (number | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isCurrentMonth = viewYear === today.year && viewMonth === today.month;

  function changeMonth(delta: number) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewMonth(m);
    setViewYear(y);
  }

  const seleccionados = selectedDay ? (agendaPorDia.get(selectedDay) ?? []) : [];

  return (
    <div className="mx-4 mb-4 rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={() => changeMonth(-1)} aria-label="Mes anterior" className="p-1 text-neutral-500">
          <ChevronLeft size={20} />
        </button>
        <p className="font-heading text-sm font-bold text-neutral-800">
          {MONTH_LABELS[viewMonth]} {viewYear}
        </p>
        <button type="button" onClick={() => changeMonth(1)} aria-label="Mes siguiente" className="p-1 text-neutral-500">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label, i) => (
          <div key={i} className="text-center text-xs font-medium text-neutral-400">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`blank-${i}`} />;
          const hasAgenda = agendaPorDia.has(day);
          const isToday = isCurrentMonth && day === today.day;
          const isSelected = day === selectedDay;
          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(hasAgenda ? day : null)}
              className={[
                "aspect-square rounded-lg text-sm transition",
                hasAgenda
                  ? "border-2 border-primary bg-primary/10 font-bold text-primary"
                  : "text-neutral-700",
                isToday && !hasAgenda ? "bg-neutral-100 font-semibold" : "",
                isSelected ? "ring-2 ring-primary ring-offset-1" : "",
              ].join(" ")}
            >
              {day}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div className="mt-3 border-t border-neutral-100 pt-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Agendados el {selectedDay} de {MONTH_LABELS[viewMonth].toLowerCase()}
          </p>
          {seleccionados.length === 0 ? (
            <p className="text-sm text-neutral-500">Sin citas.</p>
          ) : (
            <ul className="space-y-1">
              {seleccionados.map((item) => (
                <li key={item.cliente_id} className="text-sm text-neutral-700">
                  • {item.clientes?.nombre ?? "Cliente"}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
