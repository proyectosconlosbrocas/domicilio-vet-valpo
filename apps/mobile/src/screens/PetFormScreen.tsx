import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { AppHeader } from "@/components/AppHeader";
import { TextField, SelectField, TextAreaField, fieldClass } from "@/components/fields";
import { BottomBar, ErrorBanner, Loading, Section, buttonClass, friendlyError } from "@/components/ui";
import type { TablesInsert } from "@vetvalpo/supabase";

type FormValues = Omit<TablesInsert<"mascotas">, "id" | "cliente_id" | "created_at" | "updated_at" | "foto_url">;

const EMPTY: FormValues = {
  nombre: "",
  especie: "",
  raza: "",
  sexo: "desconocido",
  esterilizado: false,
  fecha_nacimiento: "",
  color: "",
  peso_actual: null,
  microchip: "",
  alergias: "",
  condiciones_cronicas: "",
  temperamento: "",
  estado: "activo",
};

export function PetFormScreen() {
  const { clienteId, mascotaId } = useParams<{ clienteId?: string; mascotaId?: string }>();
  const isEdit = Boolean(mascotaId);
  const navigate = useNavigate();

  const [values, setValues] = useState<FormValues>(EMPTY);
  const [ownerClienteId, setOwnerClienteId] = useState<string | undefined>(clienteId);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mascotaId) return;
    supabase
      .from("mascotas")
      .select("*")
      .eq("id", mascotaId)
      .single()
      .then(({ data }) => {
        if (data) {
          setOwnerClienteId(data.cliente_id);
          setValues({
            nombre: data.nombre,
            especie: data.especie,
            raza: data.raza ?? "",
            sexo: data.sexo ?? "desconocido",
            esterilizado: data.esterilizado ?? false,
            fecha_nacimiento: data.fecha_nacimiento ?? "",
            color: data.color ?? "",
            peso_actual: data.peso_actual,
            microchip: data.microchip ?? "",
            alergias: data.alergias ?? "",
            condiciones_cronicas: data.condiciones_cronicas ?? "",
            temperamento: data.temperamento ?? "",
            estado: data.estado,
          });
        }
        setLoading(false);
      });
  }, [mascotaId]);

  function handleChange<K extends keyof FormValues>(field: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const raw = e.target.value;
      setValues((prev) => ({
        ...prev,
        [field]: field === "peso_actual" ? (raw === "" ? null : Number(raw)) : raw,
      }));
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...values,
      nombre: values.nombre.trim(),
      especie: values.especie.trim(),
      raza: values.raza || null,
      fecha_nacimiento: values.fecha_nacimiento || null,
      color: values.color || null,
      microchip: values.microchip || null,
      alergias: values.alergias || null,
      condiciones_cronicas: values.condiciones_cronicas || null,
      temperamento: values.temperamento || null,
    };

    const result =
      isEdit && mascotaId
        ? await supabase.from("mascotas").update(payload).eq("id", mascotaId).select("id").single()
        : await supabase
            .from("mascotas")
            .insert({ ...payload, cliente_id: ownerClienteId! })
            .select("id")
            .single();

    setSaving(false);
    if (result.error) {
      setError(friendlyError(result.error.message));
      return;
    }
    navigate(`/mascotas/${result.data.id}`, { replace: true });
  }

  const title = isEdit ? "Editar mascota" : "Nueva mascota";

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <AppHeader title={title} back />
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <AppHeader title={title} back />

      <form id="mascota-form" onSubmit={handleSubmit} className="space-y-4 p-4">
        <ErrorBanner message={error} />

        <Section title="Identificación">
          <TextField id="nombre" label="Nombre" required autoCapitalize="words" value={values.nombre} onChange={handleChange("nombre")} />
          <div className="mb-4">
            <span className="mb-1.5 block text-sm font-medium text-neutral-700">
              Especie <span className="text-primary-ink">*</span>
            </span>
            {/* Atajos para los dos casos del 99%; el campo sigue aceptando cualquier especie. */}
            <div className="mb-2 flex gap-2">
              {["Perro", "Gato"].map((opcion) => (
                <button
                  key={opcion}
                  type="button"
                  aria-pressed={values.especie === opcion}
                  onClick={() => setValues((prev) => ({ ...prev, especie: opcion }))}
                  className={`min-h-11 flex-1 rounded-xl border text-sm font-semibold transition ${
                    values.especie === opcion
                      ? "border-ink bg-ink text-white"
                      : "border-neutral-300 bg-white text-ink active:bg-neutral-100"
                  }`}
                >
                  {opcion}
                </button>
              ))}
            </div>
            <input
              id="especie"
              required
              aria-label="Especie"
              placeholder="u otra: conejo, hurón…"
              value={values.especie}
              onChange={handleChange("especie")}
              className={fieldClass}
            />
          </div>
          <TextField id="raza" label="Raza" value={values.raza ?? ""} onChange={handleChange("raza")} />
          <SelectField id="sexo" label="Sexo" value={values.sexo ?? "desconocido"} onChange={handleChange("sexo")}>
            <option value="macho">Macho</option>
            <option value="hembra">Hembra</option>
            <option value="desconocido">Desconocido</option>
          </SelectField>
          <label
            htmlFor="esterilizado"
            className="mb-4 flex min-h-12 items-center justify-between gap-3 rounded-xl border border-neutral-300 px-3.5"
          >
            <span className="text-base text-ink">Esterilizado/a</span>
            <input
              id="esterilizado"
              type="checkbox"
              checked={values.esterilizado ?? false}
              onChange={(e) => setValues((prev) => ({ ...prev, esterilizado: e.target.checked }))}
              className="h-5 w-5 accent-primary-ink"
            />
          </label>
          <TextField
            id="fecha_nacimiento"
            label="Fecha de nacimiento"
            type="date"
            hint="Aproximada sirve: se usa para mostrar la edad."
            value={values.fecha_nacimiento ?? ""}
            onChange={handleChange("fecha_nacimiento")}
          />
          <TextField id="color" label="Color" value={values.color ?? ""} onChange={handleChange("color")} />
          <TextField
            id="peso_actual"
            label="Peso actual (kg)"
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            value={values.peso_actual ?? ""}
            onChange={handleChange("peso_actual")}
          />
          <TextField id="microchip" label="Microchip" inputMode="numeric" value={values.microchip ?? ""} onChange={handleChange("microchip")} />
        </Section>

        <Section title="Salud y carácter">
          <TextAreaField id="alergias" label="Alergias" value={values.alergias ?? ""} onChange={handleChange("alergias")} />
          <TextAreaField
            id="condiciones_cronicas"
            label="Condiciones crónicas"
            value={values.condiciones_cronicas ?? ""}
            onChange={handleChange("condiciones_cronicas")}
          />
          <TextField
            id="temperamento"
            label="Temperamento"
            placeholder="Tranquilo, muerde al revisar oídos…"
            value={values.temperamento ?? ""}
            onChange={handleChange("temperamento")}
          />
          {isEdit && (
            <SelectField id="estado" label="Estado" value={values.estado} onChange={handleChange("estado")}>
              <option value="activo">Activo</option>
              <option value="fallecido">Fallecido</option>
              <option value="adoptado">Adoptado</option>
            </SelectField>
          )}
        </Section>
      </form>

      <BottomBar>
        <button type="submit" form="mascota-form" disabled={saving} className={buttonClass.primary}>
          {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Agregar mascota"}
        </button>
      </BottomBar>
    </div>
  );
}
