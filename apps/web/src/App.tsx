import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";

// El portal (con el cliente de Supabase) se separa del bundle principal:
// la gran mayoría de las visitas son a la landing pública y no necesitan
// bajar ese código.
const PortalPage = lazy(() => import("@/pages/PortalPage").then((m) => ({ default: m.PortalPage })));
const CompletarPerfilPage = lazy(() =>
  import("@/pages/CompletarPerfilPage").then((m) => ({ default: m.CompletarPerfilPage }))
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/portal"
          element={
            <Suspense fallback={<PageLoader />}>
              <PortalPage />
            </Suspense>
          }
        />
        <Route
          path="/completar-perfil"
          element={
            <Suspense fallback={<PageLoader />}>
              <CompletarPerfilPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function PageLoader() {
  return <p className="p-8 text-center text-neutral-500">Cargando…</p>;
}

export default App;
