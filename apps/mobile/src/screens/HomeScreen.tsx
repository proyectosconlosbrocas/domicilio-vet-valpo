import { Link } from "react-router-dom";
import { UserPlus, Users, PencilLine, CalendarPlus, ChevronRight } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { HomeCalendar } from "@/components/HomeCalendar";
import { buttonClass } from "@/components/ui";

const CLIENT_LINKS = [
  { to: "/clientes", label: "Ver clientes", icon: Users },
  { to: "/clientes/nuevo", label: "Agregar cliente", icon: UserPlus },
  { to: "/clientes/editar", label: "Editar clientes", icon: PencilLine },
];

const todayLabel = new Intl.DateTimeFormat("es-CL", {
  timeZone: "America/Santiago",
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(new Date());

/**
 * La pregunta de esta pantalla es "¿a quién visito hoy?": por eso el
 * calendario abre con el día de hoy seleccionado y su lista de visitas, y la
 * acción principal (agendar) va arriba, al alcance del pulgar.
 */
export function HomeScreen() {
  return (
    <div className="min-h-screen bg-neutral-50 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
      <AppHeader title="Domicilio Vet Valpo" subtitle={todayLabel.charAt(0).toUpperCase() + todayLabel.slice(1)} />

      <div className="space-y-4 p-4">
        <Link to="/agendar-visita" className={buttonClass.primary}>
          <CalendarPlus size={20} aria-hidden="true" /> Agendar visita
        </Link>

        <HomeCalendar />

        <nav aria-label="Clientes" className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white">
          <ul className="divide-y divide-neutral-100">
            {CLIENT_LINKS.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link to={to} className="flex min-h-14 items-center gap-3 px-4 active:bg-neutral-50">
                  <Icon size={20} className="text-neutral-500" aria-hidden="true" />
                  <span className="flex-1 font-medium text-ink">{label}</span>
                  <ChevronRight size={18} className="text-neutral-400" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
