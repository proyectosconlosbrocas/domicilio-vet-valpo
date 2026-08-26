import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@vetvalpo/supabase";

export function ContactEditForm({
  cliente,
  onSaved,
  onCancel,
}: {
  cliente: Tables<"clientes">;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState({
    nombre: cliente.nombre,
    telefono: cliente.telefono ?? "",
    telefono_alternativo: cliente.telefono_alternativo ?? "",
    email: cliente.email ?? "",
    direccion: cliente.direccion ?? "",
    contacto_emergencia_nombre: cliente.contacto_emergencia_nombre ?? "",
    contacto_emergencia_telefono: cliente.contacto_emergencia_telefono ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(field: keyof typeof values) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setValues((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { error: updateError } = await supabase.from("clientes").update(values).eq("id", cliente.id);

    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

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
        <Input id="telefono" type="tel" value={values.telefono} onChange={handleChange("telefono")} />
      </div>
      <div className="mb-3">
        <Label htmlFor="telefono_alternativo" className="mb-1.5 block">
          Teléfono alternativo
        </Label>
        <Input
          id="telefono_alternativo"
          type="tel"
          value={values.telefono_alternativo}
          onChange={handleChange("telefono_alternativo")}
        />
      </div>
      <div className="mb-3">
        <Label htmlFor="email" className="mb-1.5 block">
          Email
        </Label>
        <Input id="email" type="email" value={values.email} onChange={handleChange("email")} />
      </div>
      <div className="mb-3">
        <Label htmlFor="direccion" className="mb-1.5 block">
          Dirección
        </Label>
        <Input id="direccion" value={values.direccion} onChange={handleChange("direccion")} />
      </div>
      <div className="mb-3">
        <Label htmlFor="contacto_emergencia_nombre" className="mb-1.5 block">
          Contacto de emergencia — nombre
        </Label>
        <Input
          id="contacto_emergencia_nombre"
          value={values.contacto_emergencia_nombre}
          onChange={handleChange("contacto_emergencia_nombre")}
        />
      </div>
      <div className="mb-5">
        <Label htmlFor="contacto_emergencia_telefono" className="mb-1.5 block">
          Contacto de emergencia — teléfono
        </Label>
        <Input
          id="contacto_emergencia_telefono"
          type="tel"
          value={values.contacto_emergencia_telefono}
          onChange={handleChange("contacto_emergencia_telefono")}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving} className="flex-1">
          {saving ? "Guardando…" : "Guardar cambios"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
