import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { AppHeader } from "@/components/AppHeader";
import { TextField, TextAreaField } from "@/components/fields";

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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      motivo: values.motivo,
      diagnostico: values.diagnostico || null,
      tratamiento: values.tratamiento || null,
      peso_registrado: values.peso_registrado ? Number(values.peso_registrado) : null,
      observaciones: values.observaciones || null,
      proxima_cita: values.proxima_cita || null,
      costo: values.costo ? Number(values.costo) : null,
      created_by: user?.id,
    });

    // Si se registró un peso, se refleja también como el peso_actual de la mascota.
    if (!insertError && values.peso_registrado) {
      await supabase
        .from("mascotas")
        .update({ peso_actual: Number(values.peso_registrado) })
        .eq("id", mascotaId!);
    }

    setSaving(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    navigate(`/mascotas/${mascotaId}`, { replace: true });
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <AppHeader title="Nueva visita" back />

      <form onSubmit={handleSubmit} className="p-4">
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <TextField id="motivo" label="Motivo de consulta" required value={values.motivo} onChange={handleChange("motivo")} />
        <TextAreaField id="diagnostico" label="Diagnóstico" value={values.diagnostico} onChange={handleChange("diagnostico")} />
        <TextAreaField id="tratamiento" label="Tratamiento" value={values.tratamiento} onChange={handleChange("tratamiento")} />
        <TextField
          id="peso_registrado"
          label="Peso registrado (kg)"
          type="number"
          step="0.1"
          value={values.peso_registrado}
          onChange={handleChange("peso_registrado")}
        />
        <TextAreaField id="observaciones" label="Observaciones" value={values.observaciones} onChange={handleChange("observaciones")} />
        <TextField
          id="proxima_cita"
          label="Próxima cita recomendada"
          type="date"
          value={values.proxima_cita}
          onChange={handleChange("proxima_cita")}
        />
        <TextField id="costo" label="Costo (CLP)" type="number" value={values.costo} onChange={handleChange("costo")} />

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Registrar visita"}
        </button>
      </form>
    </div>
  );
}
