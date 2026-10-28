import { ChevronLeft, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  back?: boolean;
  showLogout?: boolean;
  action?: React.ReactNode;
}

/**
 * Cabecera blanca y sobria: el rojo de marca queda para las acciones y los
 * datos que importan (días con visitas, botón principal), no para el marco.
 * Todos los toques son de 44px como mínimo.
 */
export function AppHeader({ title, subtitle, back, showLogout, action }: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white pt-safe-top">
      <div className="flex min-h-14 items-center justify-between gap-2 px-2">
        <div className="flex min-w-0 items-center gap-1">
          {back ? (
            <button
              onClick={() => navigate(-1)}
              aria-label="Volver"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink active:bg-neutral-100"
            >
              <ChevronLeft size={26} />
            </button>
          ) : (
            <img src="/icono.png" alt="" className="ml-2 mr-1 h-8 w-8 shrink-0" />
          )}
          <div className="min-w-0 py-2">
            <h1 className="truncate font-heading text-lg font-bold leading-tight text-ink">{title}</h1>
            {subtitle && <p className="truncate text-sm text-neutral-500">{subtitle}</p>}
          </div>
        </div>
        <div className="flex shrink-0 items-center">
          {action}
          {showLogout && (
            <button
              onClick={() => supabase.auth.signOut()}
              aria-label="Cerrar sesión"
              className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-600 active:bg-neutral-100"
            >
              <LogOut size={22} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

/** Botón de ícono para el slot `action` del header (editar, etc.). */
export const headerIconClass =
  "flex h-11 w-11 items-center justify-center rounded-full text-ink active:bg-neutral-100";
