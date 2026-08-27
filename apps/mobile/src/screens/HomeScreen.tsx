import { Link } from "react-router-dom";
import { UserPlus, Users, PencilLine, CalendarPlus } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { HomeCalendar } from "@/components/HomeCalendar";

const OPTIONS = [
  { to: "/clientes/nuevo", label: "Agregar cliente", icon: UserPlus },
  { to: "/clientes", label: "Ver clientes", icon: Users },
  { to: "/clientes/editar", label: "Editar clientes", icon: PencilLine },
  { to: "/agendar-visita", label: "Agendar visita", icon: CalendarPlus },
];

export function HomeScreen() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <AppHeader title="Domicilio Vet Valpo" />

      <div className="grid grid-cols-2 gap-3 p-4">
        {OPTIONS.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-2 rounded-xl bg-white p-3 text-center shadow-sm transition active:scale-[0.99]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon size={18} />
            </div>
            <span className="text-sm font-semibold text-neutral-800">{label}</span>
          </Link>
        ))}
      </div>

      <HomeCalendar />
    </div>
  );
}
