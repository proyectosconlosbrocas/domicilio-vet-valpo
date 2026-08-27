import { Link } from "react-router-dom";
import { UserPlus, Users, PencilLine } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

const OPTIONS = [
  { to: "/clientes/nuevo", label: "Agregar cliente", icon: UserPlus },
  { to: "/clientes", label: "Ver clientes", icon: Users },
  { to: "/clientes/editar", label: "Editar clientes", icon: PencilLine },
];

export function HomeScreen() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <AppHeader title="Domicilio Vet Valpo" />

      <div className="flex flex-col gap-4 p-6">
        {OPTIONS.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition active:scale-[0.99]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon size={24} />
            </div>
            <span className="text-lg font-semibold text-neutral-800">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
