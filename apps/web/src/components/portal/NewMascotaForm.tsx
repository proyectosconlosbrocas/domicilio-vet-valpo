import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export function NewMascotaForm({ clienteId, onSaved, onCancel }: { clienteId: string; onSaved: () => void; onCancel: () => void }) {
  const [values, setValues] = useState({ nombre: "", especie: "", raza: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(field: keyof typeof values) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setValues((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { error: insertError } = await supabase.from("mascotas").insert({
      cliente_id: clienteId,
      nombre: values.nombre,
      especie: values.especie,
      raza: values.raza || null,
    });

    setSaving(false);
    if (insertError) {
      setError(insertError.message);
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
        <Label htmlFor="pet-nombre" className="mb-1.5 block">
          Nombre de tu mascota
        </Label>
        <Input id="pet-nombre" required value={values.nombre} onChange={handleChange("nombre")} />
      </div>
      <div className="mb-3">
        <Label htmlFor="pet-especie" className="mb-1.5 block">
          Especie
        </Label>
        <Input id="pet-especie" required placeholder="Perro, gato…" value={values.especie} onChange={handleChange("especie")} />
      </div>
      <div className="mb-5">
        <Label htmlFor="pet-raza" className="mb-1.5 block">
          Raza
        </Label>
        <Input id="pet-raza" value={values.raza} onChange={handleChange("raza")} />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving} className="flex-1">
          {saving ? "Guardando…" : "Agregar mascota"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
