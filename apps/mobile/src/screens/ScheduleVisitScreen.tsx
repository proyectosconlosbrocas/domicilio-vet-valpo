import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Check, UserPlus, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AppHeader } from "@/components/AppHeader";
import { TextAreaField, fieldClass } from "@/components/fields";
import { BottomBar, ErrorBanner, Loading, Section, buttonClass, friendlyError } from "@/components/ui";
import type { Tables } from "@vetvalpo/supabase";

type Cliente = Tables<"clientes">;

function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function formatFechaLarga(fecha: string) {
  const [y, m, d] = fecha.split("-").map(Number);
  return new Intl.DateTimeFormat("es-CL", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d))
  );
}

export function ScheduleVisitScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Si se llega desde el calendario tocando un día puntual, la fecha viene
  // fija en la URL y no se puede cambiar acá — solo elegir cliente y hora.
  const fechaFija = searchParams.get("fecha");
  // Desde la ficha de un cliente, ese cliente llega preseleccionado.
  const clienteInicial = searchParams.get("cliente");

  const [clientes, setClientes] = useState<Cliente[] | null>(null);
  const [query, setQuery] = useState("");
  const [seleccionado, setSeleccionado] = useState<Cliente | null>(null);
  // Sin fecha en la URL se propone hoy (hora de Chile): es el caso más común.
  const [fecha, setFecha] = useState(
    fechaFija ?? new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago" }).format(new Date())
  );
  const [hora, setHora] = useState("");
  const [notas, setNotas] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [creandoCliente, setCreandoCliente] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoTelefono, setNuevoTelefono] = useState("");
  const [creandoLoading, setCreandoLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("clientes")
      .select("*")
      .eq("activo", true)
      .order("nombre")
      .then(({ data }) => {
        if (cancelled) return;
        setClientes(data ?? []);
        if (clienteInicial) setSeleccionado(data?.find((c) => c.id === clienteInicial) ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [clienteInicial]);

  async function handleCrearClienteRapido() {
    setCreandoLoading(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from("clientes")
      .insert({ nombre: nuevoNombre.trim(), telefono: nuevoTelefono.trim() || null })
      .select("*")
      .single();

    setCreandoLoading(false);
    if (insertError) {
      setError(friendlyError(insertError.message));
      return;
    }

    setClientes((prev) => [...(prev ?? []), data].sort((a, b) => a.nombre.localeCompare(b.nombre)));
    setSeleccionado(data);
    setCreandoCliente(false);
    setNuevoNombre("");
    setNuevoTelefono("");
  }

  const filtered = useMemo(() => {
    if (!clientes) return [];
    const q = normalize(query.trim());
    if (!q) return clientes;
    return clientes.filter((c) => normalize(c.nombre).includes(q) || (c.telefono ?? "").includes(q));
  }, [clientes, query]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!seleccionado || !fecha) return;
    setSaving(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: insertError } = await supabase.from("agenda_visitas").insert({
      cliente_id: seleccionado.id,
      fecha,
      hora: hora || null,
      notas: notas.trim() || null,
      created_by: user?.id,
    });

    setSaving(false);
    if (insertError) {
      setError(friendlyError(insertError.message));
      return;
    }
    navigate("/", { replace: true });
  }

  const faltante = !seleccionado ? "Elige un cliente" : !fecha ? "Elige el día" : null;

  return (
    <div className="min-h-screen bg-neutral-50 pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <AppHeader title="Agendar visita" subtitle={fechaFija ? formatFechaLarga(fechaFija) : undefined} back />

      <form id="agendar" onSubmit={handleSubmit} className="space-y-4 p-4">
        <ErrorBanner message={error} />

        <Section title="Cliente">
          {seleccionado ? (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{seleccionado.nombre}</p>
                <p className="truncate text-sm text-neutral-500">{seleccionado.telefono ?? "Sin teléfono"}</p>
              </div>
              <button
                type="button"
                onClick={() => setSeleccionado(null)}
                className="min-h-11 shrink-0 rounded-full px-3 text-sm font-semibold text-primary-ink active:bg-neutral-100"
              >
                Cambiar
              </button>
            </div>
          ) : creandoCliente ? (
            <div>
              <p className="mb-3 text-sm text-neutral-600">Cliente nuevo con lo mínimo; el resto se completa después.</p>
              <input
                type="text"
                autoFocus
                placeholder="Nombre completo"
                aria-label="Nombre completo"
                autoComplete="off"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                className={`${fieldClass} mb-2`}
              />
              <input
                type="tel"
                inputMode="tel"
                placeholder="Teléfono (+56 9…)"
                aria-label="Teléfono"
                value={nuevoTelefono}
                onChange={(e) => setNuevoTelefono(e.target.value)}
                className={`${fieldClass} mb-3`}
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setCreandoCliente(false)} className={buttonClass.secondary}>
                  Cancelar
                </button>
                {/* No es un <form> anidado: se dispara a mano para no enviar el formulario de la visita. */}
                <button
                  type="button"
                  disabled={creandoLoading || !nuevoNombre.trim()}
                  onClick={handleCrearClienteRapido}
                  className={buttonClass.primary}
                >
                  {creandoLoading ? "Creando…" : "Crear y elegir"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="relative mb-3">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Buscar por nombre o teléfono"
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

              {clientes === null ? (
                <Loading />
              ) : (
                <ul className="-mx-4 max-h-72 divide-y divide-neutral-100 overflow-y-auto border-y border-neutral-100">
                  {filtered.length === 0 && (
                    <li className="px-4 py-4 text-center text-sm text-neutral-500">
                      {query ? `Nadie coincide con “${query}”.` : "Todavía no hay clientes."}
                    </li>
                  )}
                  {filtered.map((cliente) => (
                    <li key={cliente.id}>
                      <button
                        type="button"
                        onClick={() => setSeleccionado(cliente)}
                        className="block min-h-14 w-full px-4 py-2.5 text-left active:bg-neutral-50"
                      >
                        <p className="truncate font-semibold text-ink">{cliente.nombre}</p>
                        <p className="truncate text-sm text-neutral-500">{cliente.telefono ?? "Sin teléfono"}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <button
                type="button"
                onClick={() => {
                  setCreandoCliente(true);
                  // Si ya se escribió un nombre en el buscador, se aprovecha.
                  if (query.trim() && !/^\+?\d[\d\s]*$/.test(query.trim())) setNuevoNombre(query.trim());
                }}
                className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary-ink/50 text-sm font-semibold text-primary-ink"
              >
                <UserPlus size={17} /> Crear cliente rápido
              </button>
            </>
          )}
        </Section>

        <Section title="Cuándo">
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700" htmlFor="fecha">
                Día <span className="text-primary-ink">*</span>
              </label>
              <input
                id="fecha"
                type="date"
                required
                readOnly={Boolean(fechaFija)}
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700" htmlFor="hora">
                Hora
              </label>
              <input
                id="hora"
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className={`${fieldClass} w-32`}
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-neutral-500">La hora es opcional; se puede fijar después desde el calendario.</p>
        </Section>

        <Section>
          <TextAreaField
            id="notas"
            label="Notas (opcional)"
            placeholder="Motivo, indicaciones para llegar…"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
          />
        </Section>
      </form>

      <BottomBar>
        <button type="submit" form="agendar" disabled={Boolean(faltante) || saving} className={buttonClass.primary}>
          <Check size={20} aria-hidden="true" />
          {saving ? "Agendando…" : (faltante ?? "Agendar visita")}
        </button>
      </BottomBar>
    </div>
  );
}
