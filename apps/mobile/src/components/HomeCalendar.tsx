import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, CalendarPlus, Clock, Check, X, Navigation, Trash2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { supabase } from "@/lib/supabase";
import { buildClienteWhatsappLink, buildCitaMessage } from "@/lib/whatsapp";
import { Loading } from "@/components/ui";

const CHILE_TZ = "America/Santiago";
const WEEKDAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];
const WEEKDAY_NAMES = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
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
  id: string;
  fecha: string;
  hora: string | null;
  notas: string | null;
  cliente_id: string;
  clientes: {
    nombre: string;
    telefono: string | null;
    direccion: string | null;
    direccion_lat: number | null;
    direccion_lng: number | null;
  } | null;
}

function mapsLink(cliente: NonNullable<AgendaCliente["clientes"]>): string | null {
  if (cliente.direccion_lat != null && cliente.direccion_lng != null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${cliente.direccion_lat},${cliente.direccion_lng}`;
  }
  if (cliente.direccion) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(cliente.direccion)}`;
  }
  return null;
}

const actionClass = "flex h-11 w-11 items-center justify-center rounded-full";

export function HomeCalendar() {
  const today = useMemo(chileToday, []);
  const [viewYear, setViewYear] = useState(today.year);
  const [viewMonth, setViewMonth] = useState(today.month);
  const [agenda, setAgenda] = useState<AgendaCliente[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  // Abre con hoy seleccionado: lo primero que se necesita es la ruta del día.
  const [selectedDay, setSelectedDay] = useState<number | null>(today.day);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingHora, setEditingHora] = useState("");
  const [rowError, setRowError] = useState<string | null>(null);

  const isCurrentMonth = viewYear === today.year && viewMonth === today.month;

  useEffect(() => {
    const firstDay = dateStr(viewYear, viewMonth, 1);
    const daysInMonth = new Date(Date.UTC(viewYear, viewMonth + 1, 0)).getUTCDate();
    const lastDay = dateStr(viewYear, viewMonth, daysInMonth);

    let cancelled = false;
    setAgenda(null);
    setLoadError(false);
    supabase
      .from("agenda_visitas")
      .select("id, fecha, hora, notas, cliente_id, clientes(nombre, telefono, direccion, direccion_lat, direccion_lng)")
      .gte("fecha", firstDay)
      .lte("fecha", lastDay)
      .order("hora", { nullsFirst: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setLoadError(true);
          setAgenda([]);
          return;
        }
        setAgenda((data as unknown as AgendaCliente[]) ?? []);
      });
    return () => {
      cancelled = true;
    };
  }, [viewYear, viewMonth, reloadKey]);

  const agendaPorDia = useMemo(() => {
    const map = new Map<number, AgendaCliente[]>();
    for (const item of agenda ?? []) {
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
    setSelectedDay(y === today.year && m === today.month ? today.day : null);
    setEditingId(null);
  }

  function goToday() {
    setViewMonth(today.month);
    setViewYear(today.year);
    setSelectedDay(today.day);
    setEditingId(null);
  }

  function selectDay(day: number) {
    setSelectedDay((prev) => (prev === day ? null : day));
    setEditingId(null);
    setRowError(null);
  }

  async function guardarHora(item: AgendaCliente) {
    const { error } = await supabase.from("agenda_visitas").update({ hora: editingHora || null }).eq("id", item.id);
    if (error) {
      setRowError("No se pudo guardar la hora. Revisa tu conexión.");
      return;
    }
    setAgenda((prev) => (prev ?? []).map((a) => (a.id === item.id ? { ...a, hora: editingHora || null } : a)));
    setEditingId(null);
    setRowError(null);
  }

  async function cancelarCita(item: AgendaCliente) {
    if (!window.confirm(`¿Cancelar la visita de ${item.clientes?.nombre ?? "este cliente"}?`)) return;
    const { error } = await supabase.from("agenda_visitas").delete().eq("id", item.id);
    if (error) {
      setRowError("No se pudo cancelar la visita. Revisa tu conexión.");
      return;
    }
    setAgenda((prev) => (prev ?? []).filter((a) => a.id !== item.id));
    setRowError(null);
  }

  const seleccionados = selectedDay ? (agendaPorDia.get(selectedDay) ?? []) : [];
  const fechaSeleccionada = selectedDay ? dateStr(viewYear, viewMonth, selectedDay) : null;
  const selectedWeekday = selectedDay ? WEEKDAY_NAMES[(leadingBlanks + selectedDay - 1) % 7] : "";
  const isTodaySelected = isCurrentMonth && selectedDay === today.day;

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white">
      <div className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Mes anterior"
            className={`${actionClass} text-neutral-600 active:bg-neutral-100`}
          >
            <ChevronLeft size={22} />
          </button>
          <div className="text-center">
            <p className="font-heading text-base font-bold text-ink" aria-live="polite">
              {MONTH_LABELS[viewMonth]} {viewYear}
            </p>
            {!isCurrentMonth && (
              <button type="button" onClick={goToday} className="text-xs font-semibold text-primary-ink">
                Volver a hoy
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Mes siguiente"
            className={`${actionClass} text-neutral-600 active:bg-neutral-100`}
          >
            <ChevronRight size={22} />
          </button>
        </div>

        <div className="mb-1 grid grid-cols-7" aria-hidden="true">
          {WEEKDAY_LABELS.map((label, i) => (
            <div key={i} className="text-center text-xs font-medium text-neutral-400">
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={`blank-${i}`} />;
            const count = agendaPorDia.get(day)?.length ?? 0;
            const isToday = isCurrentMonth && day === today.day;
            const isSelected = day === selectedDay;
            return (
              <button
                key={day}
                type="button"
                onClick={() => selectDay(day)}
                aria-pressed={isSelected}
                aria-label={`${day} de ${MONTH_LABELS[viewMonth].toLowerCase()}${isToday ? ", hoy" : ""}${
                  count ? `, ${count} visita${count > 1 ? "s" : ""}` : ""
                }`}
                className="flex h-12 flex-col items-center justify-center"
              >
                <span
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm transition",
                    isSelected
                      ? "bg-primary-ink font-bold text-white"
                      : isToday
                        ? "font-bold text-primary-ink ring-2 ring-inset ring-primary-ink"
                        : count
                          ? "font-semibold text-ink"
                          : "text-neutral-600",
                  ].join(" ")}
                >
                  {day}
                </span>
                {/* Un punto por visita (máx. 3): se lee la carga del día de un vistazo. */}
                <span className="mt-0.5 flex h-1.5 gap-0.5">
                  {Array.from({ length: Math.min(count, 3) }, (_, n) => (
                    <span key={n} className="h-1.5 w-1.5 rounded-full bg-primary" />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {loadError && (
        <div className="flex items-center justify-between gap-2 border-t border-neutral-100 px-4 py-3 text-sm text-red-800">
          No se pudo cargar la agenda.
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="min-h-11 font-semibold text-primary-ink"
          >
            Reintentar
          </button>
        </div>
      )}

      {selectedDay && fechaSeleccionada && (
        <div className="border-t border-neutral-100 p-4">
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h2 className="font-heading text-base font-bold text-ink">
              {isTodaySelected ? "Hoy" : `${selectedWeekday.charAt(0).toUpperCase()}${selectedWeekday.slice(1)} ${selectedDay}`}
            </h2>
            {agenda && (
              <span className="text-sm text-neutral-500">
                {seleccionados.length === 0
                  ? "Sin visitas"
                  : `${seleccionados.length} visita${seleccionados.length > 1 ? "s" : ""}`}
              </span>
            )}
          </div>

          {rowError && (
            <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {rowError}
            </p>
          )}

          {agenda === null ? (
            <Loading />
          ) : (
            seleccionados.length > 0 && (
              <ul className="mb-3 divide-y divide-neutral-100">
                {seleccionados.map((item) => {
                  const cliente = item.clientes;
                  const whatsappLink = cliente
                    ? buildClienteWhatsappLink(cliente.telefono, buildCitaMessage(cliente.nombre, item.fecha, item.hora))
                    : null;
                  const rutaLink = cliente ? mapsLink(cliente) : null;
                  return (
                    <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        {editingId === item.id ? (
                          <div className="flex shrink-0 items-center gap-1">
                            <input
                              type="time"
                              autoFocus
                              value={editingHora}
                              onChange={(e) => setEditingHora(e.target.value)}
                              aria-label="Hora de la visita"
                              className="h-11 w-28 rounded-lg border border-neutral-300 px-2 text-base"
                            />
                            <button
                              type="button"
                              onClick={() => guardarHora(item)}
                              aria-label="Guardar hora"
                              className={`${actionClass} bg-primary-ink text-white`}
                            >
                              <Check size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              aria-label="Cancelar edición de hora"
                              className={`${actionClass} text-neutral-500 active:bg-neutral-100`}
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(item.id);
                              setEditingHora(item.hora?.slice(0, 5) ?? "");
                            }}
                            aria-label={`Cambiar hora (${item.hora ? item.hora.slice(0, 5) : "sin hora"})`}
                            className="flex h-11 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-neutral-100 font-heading text-sm font-bold tabular-nums text-ink active:bg-neutral-200"
                          >
                            {item.hora ? item.hora.slice(0, 5) : <Clock size={16} className="text-neutral-500" />}
                          </button>
                        )}

                        {editingId !== item.id && (
                          <Link to={`/clientes/${item.cliente_id}`} className="min-w-0 flex-1 py-0.5">
                            <p className="truncate font-semibold text-ink">{cliente?.nombre ?? "Cliente"}</p>
                            <p className="truncate text-sm text-neutral-500">
                              {item.notas || cliente?.direccion || (item.hora ? "Sin notas" : "Toca la hora para fijarla")}
                            </p>
                          </Link>
                        )}
                      </div>

                      {editingId !== item.id && (
                        <div className="mt-2 flex items-center gap-2 pl-[76px]">
                          {whatsappLink && (
                            <a
                              href={whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Confirmar visita por WhatsApp a ${cliente?.nombre}`}
                              className="flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full bg-whatsapp px-3 text-sm font-semibold text-white"
                            >
                              <FaWhatsapp size={16} /> Confirmar
                            </a>
                          )}
                          {rutaLink && (
                            <a
                              href={rutaLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full bg-neutral-100 px-3 text-sm font-semibold text-ink"
                            >
                              <Navigation size={15} /> Cómo llegar
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => cancelarCita(item)}
                            aria-label={`Cancelar visita de ${cliente?.nombre ?? "cliente"}`}
                            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full text-neutral-400 active:bg-neutral-100"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )
          )}

          <Link
            to={`/agendar-visita?fecha=${fechaSeleccionada}`}
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-soft text-sm font-semibold text-primary-ink"
          >
            <CalendarPlus size={16} /> Agendar en este día
          </Link>
        </div>
      )}
    </div>
  );
}
