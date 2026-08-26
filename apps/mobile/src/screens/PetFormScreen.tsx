import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { AppHeader } from "@/components/AppHeader";
import { TextField, SelectField, TextAreaField } from "@/components/fields";
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
      setError(result.error.message);
      return;
    }
    navigate(`/mascotas/${result.data.id}`, { replace: true });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <AppHeader title={isEdit ? "Editar mascota" : "Nueva mascota"} back />
        <p className="p-4 text-center text-sm text-neutral-500">Cargando…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <AppHeader title={isEdit ? "Editar mascota" : "Nueva mascota"} back />

      <form onSubmit={handleSubmit} className="p-4">
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <TextField id="nombre" label="Nombre" required value={values.nombre} onChange={handleChange("nombre")} />
        <TextField id="especie" label="Especie" required placeholder="Perro, gato…" value={values.especie} onChange={handleChange("especie")} />
        <TextField id="raza" label="Raza" value={values.raza ?? ""} onChange={handleChange("raza")} />

        <SelectField id="sexo" label="Sexo" value={values.sexo ?? "desconocido"} onChange={handleChange("sexo")}>
          <option value="macho">Macho</option>
          <option value="hembra">Hembra</option>
          <option value="desconocido">Desconocido</option>
        </SelectField>

        <div className="mb-4 flex items-center gap-2">
          <input
            id="esterilizado"
            type="checkbox"
            checked={values.esterilizado ?? false}
            onChange={(e) => setValues((prev) => ({ ...prev, esterilizado: e.target.checked }))}
            className="h-4 w-4 accent-primary"
          />
          <label htmlFor="esterilizado" className="text-sm text-neutral-700">
            Esterilizado/a
          </label>
        </div>

        <TextField
          id="fecha_nacimiento"
          label="Fecha de nacimiento"
          type="date"
          value={values.fecha_nacimiento ?? ""}
          onChange={handleChange("fecha_nacimiento")}
        />
        <TextField id="color" label="Color" value={values.color ?? ""} onChange={handleChange("color")} />
        <TextField
          id="peso_actual"
          label="Peso actual (kg)"
          type="number"
          step="0.1"
          value={values.peso_actual ?? ""}
          onChange={handleChange("peso_actual")}
        />
        <TextField id="microchip" label="Microchip" value={values.microchip ?? ""} onChange={handleChange("microchip")} />
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

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Guardar"}
        </button>
      </form>
    </div>
  );
}
