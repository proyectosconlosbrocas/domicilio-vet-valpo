import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { AppHeader } from "@/components/AppHeader";
import { TextField } from "@/components/fields";
import type { TablesInsert } from "@vetvalpo/supabase";

type FormValues = Omit<TablesInsert<"clientes">, "id" | "auth_user_id" | "activo" | "created_at" | "updated_at">;

const EMPTY: FormValues = {
  nombre: "",
  rut: "",
  telefono: "",
  telefono_alternativo: "",
  email: "",
  direccion: "",
  contacto_emergencia_nombre: "",
  contacto_emergencia_telefono: "",
};

export function ClientFormScreen() {
  const { clienteId } = useParams<{ clienteId: string }>();
  const isEdit = Boolean(clienteId);
  const navigate = useNavigate();

  const [values, setValues] = useState<FormValues>(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clienteId) return;
    supabase
      .from("clientes")
      .select("*")
      .eq("id", clienteId)
      .single()
      .then(({ data }) => {
        if (data) {
          setValues({
            nombre: data.nombre,
            rut: data.rut ?? "",
            telefono: data.telefono ?? "",
            telefono_alternativo: data.telefono_alternativo ?? "",
            email: data.email ?? "",
            direccion: data.direccion ?? "",
            contacto_emergencia_nombre: data.contacto_emergencia_nombre ?? "",
            contacto_emergencia_telefono: data.contacto_emergencia_telefono ?? "",
          });
        }
        setLoading(false);
      });
  }, [clienteId]);

  function handleChange(field: keyof FormValues) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setValues((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = { ...values, rut: values.rut || null, email: values.email || null };

    const result = isEdit
      ? await supabase.from("clientes").update(payload).eq("id", clienteId!).select("id").single()
      : await supabase.from("clientes").insert(payload).select("id").single();

    setSaving(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    navigate(`/clientes/${result.data.id}`, { replace: true });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <AppHeader title={isEdit ? "Editar cliente" : "Nuevo cliente"} back />
        <p className="p-4 text-center text-sm text-neutral-500">Cargando…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <AppHeader title={isEdit ? "Editar cliente" : "Nuevo cliente"} back />

      <form onSubmit={handleSubmit} className="p-4">
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <TextField id="nombre" label="Nombre completo" required value={values.nombre} onChange={handleChange("nombre")} />
        <TextField id="rut" label="RUT" value={values.rut ?? ""} onChange={handleChange("rut")} />
        <TextField id="telefono" label="Teléfono" type="tel" value={values.telefono ?? ""} onChange={handleChange("telefono")} />
        <TextField
          id="telefono_alternativo"
          label="Teléfono alternativo"
          type="tel"
          value={values.telefono_alternativo ?? ""}
          onChange={handleChange("telefono_alternativo")}
        />
        <TextField id="email" label="Email" type="email" value={values.email ?? ""} onChange={handleChange("email")} />
        <TextField id="direccion" label="Dirección" value={values.direccion ?? ""} onChange={handleChange("direccion")} />
        <TextField
          id="contacto_emergencia_nombre"
          label="Contacto de emergencia — nombre"
          value={values.contacto_emergencia_nombre ?? ""}
          onChange={handleChange("contacto_emergencia_nombre")}
        />
        <TextField
          id="contacto_emergencia_telefono"
          label="Contacto de emergencia — teléfono"
          type="tel"
          value={values.contacto_emergencia_telefono ?? ""}
          onChange={handleChange("contacto_emergencia_telefono")}
        />

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
