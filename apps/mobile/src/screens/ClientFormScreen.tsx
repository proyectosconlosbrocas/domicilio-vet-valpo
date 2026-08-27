import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Geolocation } from "@capacitor/geolocation";
import { MapPin, CheckCircle2 } from "lucide-react";
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
  direccion_lat: null,
  direccion_lng: null,
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
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

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
            direccion_lat: data.direccion_lat,
            direccion_lng: data.direccion_lng,
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

  async function handleRegistrarUbicacion() {
    setLocating(true);
    setLocationError(null);
    try {
      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      setValues((prev) => ({
        ...prev,
        direccion_lat: position.coords.latitude,
        direccion_lng: position.coords.longitude,
      }));
    } catch {
      setLocationError("No se pudo obtener la ubicación. Revisá que el permiso de ubicación esté activo.");
    } finally {
      setLocating(false);
    }
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

  const tieneUbicacion = values.direccion_lat != null && values.direccion_lng != null;

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

        <div className="mb-4">
          <button
            type="button"
            onClick={handleRegistrarUbicacion}
            disabled={locating}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary py-2.5 text-sm font-semibold text-primary transition disabled:opacity-60"
          >
            <MapPin size={16} />
            {locating ? "Obteniendo ubicación…" : "Registrar dirección con Google Maps"}
          </button>
          {tieneUbicacion && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-neutral-500">
              <CheckCircle2 size={14} className="text-primary" />
              Ubicación capturada ({values.direccion_lat!.toFixed(5)}, {values.direccion_lng!.toFixed(5)})
            </p>
          )}
          {locationError && <p className="mt-1.5 text-xs text-red-600">{locationError}</p>}
        </div>

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
