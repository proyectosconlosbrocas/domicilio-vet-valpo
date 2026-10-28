import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { AppHeader } from "@/components/AppHeader";
import { TextField, TextAreaField } from "@/components/fields";
import { BottomBar, ErrorBanner, Section, buttonClass, friendlyError } from "@/components/ui";

interface FormValues {
  motivo: string;
  diagnostico: string;
  tratamiento: string;
  peso_registrado: string;
  observaciones: string;
  proxima_cita: string;
  costo: string;
}

const EMPTY: FormValues = {
  motivo: "",
  diagnostico: "",
  tratamiento: "",
  peso_registrado: "",
  observaciones: "",
  proxima_cita: "",
  costo: "",
};

export function VisitFormScreen() {
  const { mascotaId } = useParams<{ mascotaId: string }>();
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [mascota, setMascota] = useState<{ nombre: string; cliente_id: string } | null>(null);
  // Si se fija próxima cita, por defecto también queda en el calendario de la Home.
  const [agendarControl, setAgendarControl] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mascotaId) return;
    supabase
      .from("mascotas")
      .select("nombre, cliente_id")
      .eq("id", mascotaId)
      .single()
      .then(({ data }) => setMascota(data ?? null));
  }, [mascotaId]);

  function handleChange(field: keyof FormValues) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: insertError } = await supabase.from("visitas").insert({
      mascota_id: mascotaId!,
      motivo: values.motivo.trim(),
      diagnostico: values.diagnostico.trim() || null,
      tratamiento: values.tratamiento.trim() || null,
      peso_registrado: values.peso_registrado ? Number(values.peso_registrado) : null,
      observaciones: values.observaciones.trim() || null,
      proxima_cita: values.proxima_cita || null,
      costo: values.costo ? Number(values.costo) : null,
      created_by: user?.id,
    });

    if (insertError) {
      setSaving(false);
      setError(friendlyError(insertError.message));
      return;
    }

    // Si se registró un peso, se refleja también como el peso_actual de la mascota.
    if (values.peso_registrado) {
      await supabase
        .from("mascotas")
        .update({ peso_actual: Number(values.peso_registrado) })
        .eq("id", mascotaId!);
    }

    if (values.proxima_cita && agendarControl && mascota) {
      await supabase.from("agenda_visitas").insert({
        cliente_id: mascota.cliente_id,
        fecha: values.proxima_cita,
        notas: `Control de ${mascota.nombre}: ${values.motivo.trim()}`,
        created_by: user?.id,
      });
    }

    setSaving(false);
    navigate(`/mascotas/${mascotaId}`, { replace: true });
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <AppHeader title="Registrar visita" subtitle={mascota?.nombre} back />

      <form id="visita-form" onSubmit={handleSubmit} className="space-y-4 p-4">
        <ErrorBanner message={error} />

        <Section title="Consulta">
          <TextField
            id="motivo"
            label="Motivo de consulta"
            required
            placeholder="Vacuna anual, vómitos, control…"
            value={values.motivo}
            onChange={handleChange("motivo")}
          />
          <TextAreaField id="diagnostico" label="Diagnóstico" value={values.diagnostico} onChange={handleChange("diagnostico")} />
          <TextAreaField id="tratamiento" label="Tratamiento" value={values.tratamiento} onChange={handleChange("tratamiento")} />
          <TextAreaField id="observaciones" label="Observaciones" value={values.observaciones} onChange={handleChange("observaciones")} />
        </Section>

        <Section title="Registro">
          <div className="grid grid-cols-2 gap-3">
            <TextField
              id="peso_registrado"
              label="Peso (kg)"
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              value={values.peso_registrado}
              onChange={handleChange("peso_registrado")}
            />
            <TextField
              id="costo"
              label="Costo (CLP)"
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              value={values.costo}
              onChange={handleChange("costo")}
            />
          </div>
          <TextField
            id="proxima_cita"
            label="Próximo control"
            type="date"
            value={values.proxima_cita}
            onChange={handleChange("proxima_cita")}
          />
          {values.proxima_cita && (
            <label className="flex min-h-11 items-center gap-3 text-sm text-ink">
              <input
                type="checkbox"
                checked={agendarControl}
                onChange={(e) => setAgendarControl(e.target.checked)}
                className="h-5 w-5 accent-primary-ink"
              />
              Agendarlo también en el calendario
            </label>
          )}
        </Section>
      </form>

      <BottomBar>
        <button type="submit" form="visita-form" disabled={saving} className={buttonClass.primary}>
          {saving ? "Guardando…" : "Guardar visita"}
        </button>
      </BottomBar>
    </div>
  );
}
