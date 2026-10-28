import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Geolocation } from "@capacitor/geolocation";
import { MapPin, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AppHeader } from "@/components/AppHeader";
import { TextField } from "@/components/fields";
import { BottomBar, ErrorBanner, Loading, Section, buttonClass, friendlyError } from "@/components/ui";
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
      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 });
      setValues((prev) => ({
        ...prev,
        direccion_lat: position.coords.latitude,
        direccion_lng: position.coords.longitude,
      }));
    } catch {
      setLocationError("No se pudo obtener la ubicación. Revisa que el GPS y el permiso de ubicación estén activos.");
    } finally {
      setLocating(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...values,
      nombre: values.nombre.trim(),
      rut: values.rut?.trim() || null,
      email: values.email?.trim() || null,
    };

    const result = isEdit
      ? await supabase.from("clientes").update(payload).eq("id", clienteId!).select("id").single()
      : await supabase.from("clientes").insert(payload).select("id").single();

    setSaving(false);
    if (result.error) {
      setError(friendlyError(result.error.message));
      return;
    }
    navigate(`/clientes/${result.data.id}`, { replace: true });
  }

  const title = isEdit ? "Editar cliente" : "Nuevo cliente";

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <AppHeader title={title} back />
        <Loading />
      </div>
    );
  }

  const tieneUbicacion = values.direccion_lat != null && values.direccion_lng != null;

  return (
    <div className="min-h-screen bg-neutral-50 pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <AppHeader title={title} back />

      <form id="cliente-form" onSubmit={handleSubmit} className="space-y-4 p-4">
        <ErrorBanner message={error} />

        <Section title="Datos">
          <TextField
            id="nombre"
            label="Nombre completo"
            required
            autoComplete="off"
            autoCapitalize="words"
            value={values.nombre}
            onChange={handleChange("nombre")}
          />
          <TextField id="rut" label="RUT" placeholder="12.345.678-9" value={values.rut ?? ""} onChange={handleChange("rut")} />
        </Section>

        <Section title="Contacto">
          <TextField
            id="telefono"
            label="Teléfono"
            type="tel"
            inputMode="tel"
            placeholder="+56 9 1234 5678"
            hint="Se usa para los botones de WhatsApp y llamada."
            value={values.telefono ?? ""}
            onChange={handleChange("telefono")}
          />
          <TextField
            id="telefono_alternativo"
            label="Teléfono alternativo"
            type="tel"
            inputMode="tel"
            value={values.telefono_alternativo ?? ""}
            onChange={handleChange("telefono_alternativo")}
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            inputMode="email"
            autoCapitalize="none"
            value={values.email ?? ""}
            onChange={handleChange("email")}
          />
        </Section>

        <Section title="Dirección">
          <TextField
            id="direccion"
            label="Dirección"
            placeholder="Calle, número, cerro o sector"
            value={values.direccion ?? ""}
            onChange={handleChange("direccion")}
          />
          <button
            type="button"
            onClick={handleRegistrarUbicacion}
            disabled={locating}
            className={buttonClass.secondary}
          >
            <MapPin size={18} className="text-primary-ink" />
            {locating ? "Obteniendo ubicación…" : tieneUbicacion ? "Actualizar ubicación GPS" : "Guardar ubicación GPS actual"}
          </button>
          {tieneUbicacion && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-neutral-600">
              <CheckCircle2 size={16} className="text-whatsapp" />
              Ubicación guardada: “Cómo llegar” abrirá Google Maps aquí.
            </p>
          )}
          {!tieneUbicacion && !locationError && (
            <p className="mt-2 text-xs text-neutral-500">Úsalo estando en la casa del cliente para llegar exacto la próxima vez.</p>
          )}
          {locationError && <p className="mt-2 text-sm text-red-700">{locationError}</p>}
        </Section>

        <Section title="Contacto de emergencia">
          <TextField
            id="contacto_emergencia_nombre"
            label="Nombre"
            value={values.contacto_emergencia_nombre ?? ""}
            onChange={handleChange("contacto_emergencia_nombre")}
          />
          <TextField
            id="contacto_emergencia_telefono"
            label="Teléfono"
            type="tel"
            inputMode="tel"
            value={values.contacto_emergencia_telefono ?? ""}
            onChange={handleChange("contacto_emergencia_telefono")}
          />
        </Section>
      </form>

      <BottomBar>
        <button type="submit" form="cliente-form" disabled={saving} className={buttonClass.primary}>
          {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear cliente"}
        </button>
      </BottomBar>
    </div>
  );
}
