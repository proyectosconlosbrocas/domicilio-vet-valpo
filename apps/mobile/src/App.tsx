import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useStaff } from "@/hooks/useStaff";
import { LoginScreen } from "@/screens/LoginScreen";
import { ClientListScreen } from "@/screens/ClientListScreen";
import { ClientDetailScreen } from "@/screens/ClientDetailScreen";
import { ClientFormScreen } from "@/screens/ClientFormScreen";
import { PetDetailScreen } from "@/screens/PetDetailScreen";
import { PetFormScreen } from "@/screens/PetFormScreen";
import { VisitFormScreen } from "@/screens/VisitFormScreen";

function StaffGate({ session }: { session: Session }) {
  const staff = useStaff(session);

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientListScreen />} />
        <Route path="/clientes/nuevo" element={<ClientFormScreen />} />
        <Route path="/clientes/:clienteId" element={<ClientDetailScreen />} />
        <Route path="/clientes/:clienteId/editar" element={<ClientFormScreen />} />
        <Route path="/clientes/:clienteId/mascotas/nueva" element={<PetFormScreen />} />
        <Route path="/mascotas/:mascotaId" element={<PetDetailScreen />} />
        <Route path="/mascotas/:mascotaId/editar" element={<PetFormScreen />} />
        <Route path="/mascotas/:mascotaId/visitas/nueva" element={<VisitFormScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-neutral-500">
        Cargando…
      </div>
    );
  }

  return session ? <StaffGate session={session} /> : <LoginScreen />;
}

export default App;
