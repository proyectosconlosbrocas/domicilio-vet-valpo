import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AppHeader } from "@/components/AppHeader";
import { TextAreaField } from "@/components/fields";
import type { Tables } from "@vetvalpo/supabase";

type Cliente = Tables<"clientes">;

export function ScheduleVisitScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Si se llega desde el calendario tocando un día puntual, la fecha viene
  // fija en la URL y no se puede cambiar acá — solo elegir cliente y hora.
  const fechaFija = searchParams.get("fecha");

  const [clientes, setClientes] = useState<Cliente[] | null>(null);
  const [query, setQuery] = useState("");
  const [seleccionado, setSeleccionado] = useState<Cliente | null>(null);
  const [fecha, setFecha] = useState(fechaFija ?? "");
  const [hora, setHora] = useState("");
  const [notas, setNotas] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("clientes")
      .select("*")
      .eq("activo", true)
      .order("nombre")
      .then(({ data }) => {
        if (!cancelled) setClientes(data ?? []);
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
      (c) => c.nombre.toLowerCase().includes(q) || (c.telefono ?? "").toLowerCase().includes(q)
    );
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
      notas: notas || null,
      created_by: user?.id,
    });

    setSaving(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-10">
      <AppHeader title="Agendar visita" back />

      <div className="p-4">
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <label className="mb-1 block text-sm font-medium text-neutral-700">Cliente</label>

        {seleccionado ? (
          <div className="mb-4 flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
            <div>
              <p className="font-semibold text-neutral-800">{seleccionado.nombre}</p>
              <p className="text-sm text-neutral-500">{seleccionado.telefono ?? "Sin teléfono"}</p>
            </div>
            <button
              type="button"
              onClick={() => setSeleccionado(null)}
              className="text-sm font-medium text-primary underline"
            >
              Cambiar
            </button>
          </div>
        ) : (
          <>
            <div className="relative mb-3">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="search"
                placeholder="Buscar cliente por nombre o teléfono…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {clientes === null ? (
              <p className="text-center text-sm text-neutral-500">Cargando…</p>
            ) : filtered.length === 0 ? (
              <p className="text-center text-sm text-neutral-500">Sin resultados.</p>
            ) : (
              <ul className="mb-4 max-h-72 space-y-2 overflow-y-auto">
                {filtered.map((cliente) => (
                  <li key={cliente.id}>
                    <button
                      type="button"
                      onClick={() => setSeleccionado(cliente)}
                      className="block w-full rounded-xl bg-white p-3 text-left shadow-sm transition active:scale-[0.99]"
                    >
                      <p className="font-semibold text-neutral-800">{cliente.nombre}</p>
                      <p className="text-sm text-neutral-500">{cliente.telefono ?? "Sin teléfono"}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="fecha">
              Día de la visita <span className="text-primary">*</span>
            </label>
            <input
              id="fecha"
              type="date"
              required
              readOnly={Boolean(fechaFija)}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className={`w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                fechaFija ? "bg-neutral-100 text-neutral-500" : ""
              }`}
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="hora">
              Hora (opcional)
            </label>
            <input
              id="hora"
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <TextAreaField id="notas" label="Notas (opcional)" value={notas} onChange={(e) => setNotas(e.target.value)} />

          <button
            type="submit"
            disabled={!seleccionado || !fecha || saving}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
          >
            <Check size={18} />
            {saving ? "Agendando…" : "Agendar visita"}
          </button>
        </form>
      </div>
    </div>
  );
}
