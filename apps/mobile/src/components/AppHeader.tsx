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

export function AppHeader({ title, subtitle, back, showLogout, action }: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-primary px-4 py-4 text-white">
      <div className="flex min-w-0 items-center gap-2">
        {back && (
          <button onClick={() => navigate(-1)} aria-label="Volver" className="shrink-0">
            <ChevronLeft size={24} />
          </button>
        )}
        <div className="min-w-0">
          <p className="truncate font-heading text-lg font-bold">{title}</p>
          {subtitle && <p className="truncate text-sm text-white/80">{subtitle}</p>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {action}
        {showLogout && (
          <button onClick={() => supabase.auth.signOut()} aria-label="Cerrar sesión">
            <LogOut size={22} />
          </button>
        )}
      </div>
    </header>
  );
}
