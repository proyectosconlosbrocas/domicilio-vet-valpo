import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { useCliente } from "@/hooks/useCliente";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormValues {
  nombre: string;
  telefono: string;
  direccion: string;
  mascotaNombre: string;
  mascotaEspecie: string;
  mascotaRaza: string;
  consentimiento: boolean;
}

const EMPTY: FormValues = {
  nombre: "",
  telefono: "",
  direccion: "",
  mascotaNombre: "",
  mascotaEspecie: "",
  mascotaRaza: "",
  consentimiento: false,
};

function CompletarPerfilForm({ authUserId, email }: { authUserId: string; email: string | undefined }) {
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(field: keyof FormValues) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({
        ...prev,
        [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
      }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { data: cliente, error: clienteError } = await supabase
      .from("clientes")
      .insert({
        auth_user_id: authUserId,
        nombre: values.nombre,
        telefono: values.telefono,
        direccion: values.direccion || null,
        email: email ?? null,
        consentimiento_datos_aceptado: values.consentimiento,
        consentimiento_fecha: values.consentimiento ? new Date().toISOString() : null,
      })
      .select("id")
      .single();

    if (clienteError) {
      setSaving(false);
      // Carrera: si ya existía (auth_user_id es unique), mandamos derecho al portal.
      if (clienteError.code === "23505") {
        navigate("/portal", { replace: true });
        return;
      }
      setError(clienteError.message);
      return;
    }

    const { error: mascotaError } = await supabase.from("mascotas").insert({
      cliente_id: cliente.id,
      nombre: values.mascotaNombre,
      especie: values.mascotaEspecie,
      raza: values.mascotaRaza || null,
    });

    setSaving(false);
    if (mascotaError) {
      setError(mascotaError.message);
      return;
    }
    navigate("/portal", { replace: true });
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="mb-1 font-heading text-xl font-bold text-primary">Completá tu perfil</h1>
      <p className="mb-6 text-sm text-neutral-500">Ya iniciaste sesión — contanos de vos y de tu mascota.</p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">Tus datos</h2>
      <div className="mb-3">
        <Label htmlFor="nombre" className="mb-1.5 block">
          Nombre completo
        </Label>
        <Input id="nombre" required value={values.nombre} onChange={handleChange("nombre")} />
      </div>
      <div className="mb-3">
        <Label htmlFor="telefono" className="mb-1.5 block">
          Teléfono
        </Label>
        <Input id="telefono" type="tel" required value={values.telefono} onChange={handleChange("telefono")} />
      </div>
      <div className="mb-6">
        <Label htmlFor="direccion" className="mb-1.5 block">
          Dirección
        </Label>
        <Input id="direccion" value={values.direccion} onChange={handleChange("direccion")} />
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">Tu mascota</h2>
      <div className="mb-3">
        <Label htmlFor="mascotaNombre" className="mb-1.5 block">
          Nombre de tu mascota
        </Label>
        <Input id="mascotaNombre" required value={values.mascotaNombre} onChange={handleChange("mascotaNombre")} />
      </div>
      <div className="mb-3">
        <Label htmlFor="mascotaEspecie" className="mb-1.5 block">
          Especie
        </Label>
        <Input
          id="mascotaEspecie"
          required
          placeholder="Perro, gato…"
          value={values.mascotaEspecie}
          onChange={handleChange("mascotaEspecie")}
        />
      </div>
      <div className="mb-6">
        <Label htmlFor="mascotaRaza" className="mb-1.5 block">
          Raza
        </Label>
        <Input id="mascotaRaza" value={values.mascotaRaza} onChange={handleChange("mascotaRaza")} />
      </div>

      <label className="mb-6 flex items-start gap-2 text-sm text-neutral-600">
        <input
          type="checkbox"
          checked={values.consentimiento}
          onChange={handleChange("consentimiento")}
          className="mt-0.5 h-4 w-4 accent-primary"
        />
        Autorizo a Domicilio Vet Valpo a guardar mis datos y los de mi mascota para gestionar la atención
        veterinaria.
      </label>

      <Button type="submit" disabled={saving} className="w-full">
        {saving ? "Guardando…" : "Guardar y entrar al portal"}
      </Button>
    </form>
  );
}

export function CompletarPerfilPage() {
  const session = useSession();

  if (session === undefined) {
    return <p className="p-8 text-center text-neutral-500">Cargando…</p>;
  }

  if (session === null) {
    return <Navigate to="/portal" replace />;
  }

  return <CompletarPerfilInner authUserId={session.user.id} email={session.user.email} />;
}

function CompletarPerfilInner({ authUserId, email }: { authUserId: string; email: string | undefined }) {
  const { cliente } = useCliente(authUserId);

  if (cliente === undefined) {
    return <p className="p-8 text-center text-neutral-500">Cargando…</p>;
  }

  // Self-healing: si ya tiene perfil (ej. volvió a este link por error), directo al portal.
  if (cliente) {
    return <Navigate to="/portal" replace />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10">
      <CompletarPerfilForm authUserId={authUserId} email={email} />
    </div>
  );
}
