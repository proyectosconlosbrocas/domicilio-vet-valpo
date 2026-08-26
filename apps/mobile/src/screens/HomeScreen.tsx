import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@vetvalpo/supabase";

export function HomeScreen({ session }: { session: Session }) {
  const [staff, setStaff] = useState<Tables<"staff"> | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("staff")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setStaff(data);
      });
    return () => {
      cancelled = true;
    };
  }, [session.user.id]);

  if (staff === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-neutral-500">
        Verificando acceso…
      </div>
    );
  }

  if (staff === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50 px-6 text-center">
        <p className="text-neutral-700">
          Tu cuenta ({session.user.email}) inició sesión, pero no está registrada como staff todavía.
        </p>
        <button onClick={() => supabase.auth.signOut()} className="text-sm font-medium text-primary underline">
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="flex items-center justify-between bg-primary px-4 py-4 text-white">
        <div>
          <p className="font-heading text-lg font-bold">Domicilio Vet Valpo</p>
          <p className="text-sm text-white/80">Hola, {staff.nombre}</p>
        </div>
        <button onClick={() => supabase.auth.signOut()} aria-label="Cerrar sesión">
          <LogOut size={22} />
        </button>
      </header>

      <main className="p-4">
        <p className="text-neutral-600">
          Conexión a Supabase verificada — clientes, mascotas y fichas van acá en la próxima etapa.
        </p>
      </main>
    </div>
  );
}
