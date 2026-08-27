import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useStaff } from "@/hooks/useStaff";
import { HomeScreen } from "@/screens/HomeScreen";
import { ClientListScreen } from "@/screens/ClientListScreen";
import { ClientDetailScreen } from "@/screens/ClientDetailScreen";
import { ClientFormScreen } from "@/screens/ClientFormScreen";
import { PetDetailScreen } from "@/screens/PetDetailScreen";
import { PetFormScreen } from "@/screens/PetFormScreen";
import { VisitFormScreen } from "@/screens/VisitFormScreen";

const STAFF_EMAIL = import.meta.env.VITE_STAFF_EMAIL as string;
const STAFF_PASSWORD = import.meta.env.VITE_STAFF_PASSWORD as string;

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
          La cuenta configurada ({session.user.email}) no está registrada como staff todavía.
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/clientes" element={<ClientListScreen mode="ver" />} />
        <Route path="/clientes/editar" element={<ClientListScreen mode="editar" />} />
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

/**
 * App de uso privado: no se distribuye ni se publica, la usa una sola
 * persona. Por pedido explícito no hay pantalla de login — al abrir la app
 * se autentica sola contra Supabase con una credencial de staff embebida
 * (VITE_STAFF_EMAIL/PASSWORD). La protección real de los datos sigue siendo
 * RLS del lado del servidor (is_staff()), esto solo evita mostrar UI de
 * login. Si esta app llegara a distribuirse más ampliamente, hay que volver
 * a un login real por persona.
 */
function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function signInSilently() {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: STAFF_EMAIL,
        password: STAFF_PASSWORD,
      });
      if (cancelled) return;

      if (error) {
        setAuthError("No se pudo conectar. Revisá tu conexión a internet e intentá de nuevo.");
        return;
      }
      setAuthError(null);
      setSession(data.session);
    }

    async function ensureSession() {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;

      if (data.session) {
        setSession(data.session);
        return;
      }

      await signInSilently();
    }

    ensureSession();

    // Si por lo que sea la sesión se pierde (token revocado, etc.), no hay
    // pantalla de login a la que caer: se reintenta sola en silencio.
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (cancelled) return;
      if (newSession) {
        setSession(newSession);
      } else {
        signInSilently();
      }
    });
    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  if (authError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6 text-center text-neutral-500">
        {authError}
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-neutral-500">
        Cargando…
      </div>
    );
  }

  return <StaffGate session={session} />;
}

export default App;
