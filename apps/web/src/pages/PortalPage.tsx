import { useState } from "react";
import { Navigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { LogOut, Pencil, Plus } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { useCliente } from "@/hooks/useCliente";
import { supabase } from "@/lib/supabase";
import { PortalLoginForm } from "@/components/portal/PortalLoginForm";
import { MascotaHistoryCard } from "@/components/portal/MascotaHistoryCard";
import { ContactEditForm } from "@/components/portal/ContactEditForm";
import { NewMascotaForm } from "@/components/portal/NewMascotaForm";

function PortalDashboard({ session }: { session: Session }) {
  const { cliente, refetch } = useCliente(session.user.id);
  const [editingContact, setEditingContact] = useState(false);
  const [addingMascota, setAddingMascota] = useState(false);

  if (cliente === undefined) {
    return <p className="p-8 text-center text-neutral-500">Cargando tu ficha…</p>;
  }

  if (cliente === null) {
    return <Navigate to="/completar-perfil" replace />;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Hola, {cliente.nombre.split(" ")[0]}</h1>
          <p className="text-sm text-neutral-500">Tu portal de Domicilio Vet Valpo</p>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary"
        >
          <LogOut size={16} /> Salir
        </button>
      </div>

      <section className="mb-8">
        {editingContact ? (
          <ContactEditForm
            cliente={cliente}
            onSaved={() => {
              setEditingContact(false);
              refetch();
            }}
            onCancel={() => setEditingContact(false)}
          />
        ) : (
          <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">
            <div className="text-sm text-neutral-600">
              <p>{cliente.telefono ?? "Sin teléfono"}</p>
              <p>{cliente.direccion ?? "Sin dirección"}</p>
            </div>
            <button
              onClick={() => setEditingContact(true)}
              className="flex items-center gap-1 text-sm font-medium text-primary"
              aria-label="Editar datos de contacto"
            >
              <Pencil size={16} /> Editar
            </button>
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Tus mascotas</h2>
          {!addingMascota && (
            <button
              onClick={() => setAddingMascota(true)}
              className="flex items-center gap-1 text-sm font-medium text-primary"
            >
              <Plus size={16} /> Agregar
            </button>
          )}
        </div>

        {addingMascota && (
          <div className="mb-4">
            <NewMascotaForm
              clienteId={cliente.id}
              onSaved={() => {
                setAddingMascota(false);
                refetch();
              }}
              onCancel={() => setAddingMascota(false)}
            />
          </div>
        )}

        {cliente.mascotas.length === 0 && !addingMascota ? (
          <p className="text-sm text-neutral-500">Todavía no tenés mascotas registradas.</p>
        ) : (
          <div className="space-y-3">
            {cliente.mascotas.map((mascota) => (
              <MascotaHistoryCard key={mascota.id} mascota={mascota} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function PortalPage() {
  const session = useSession();

  if (session === undefined) {
    return <p className="p-8 text-center text-neutral-500">Cargando…</p>;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {session === null ? (
        <div className="flex min-h-screen items-center justify-center px-4">
          <PortalLoginForm />
        </div>
      ) : (
        <PortalDashboard session={session} />
      )}
    </div>
  );
}
