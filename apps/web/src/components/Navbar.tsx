import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useScrollState } from "@/hooks/use-scroll-state";
import { useActiveSection } from "@/hooks/use-active-section";

const NAV_LINKS = [
  { href: "#sobre-mi", id: "sobre-mi", label: "Dra. Claudia Cárcamo" },
  { href: "#servicios", id: "servicios", label: "Servicios" },
  { href: "#operativos", id: "operativos", label: "Operativos" },
  { href: "#contacto", id: "contacto", label: "Contacto" },
];

const SECTION_IDS = ["inicio", ...NAV_LINKS.map((link) => link.id)];

export function Navbar() {
  const { scrolled } = useScrollState();
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);

  return (
    <nav className={`navbar sticky top-0 z-50 shadow-sm ${scrolled ? "scrolled" : ""}`}>
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center">
          <a
            href="https://www.instagram.com/domicilio.vet.valpo/"
            className="navbar-brand-logo"
            aria-label="Instagram de Domicilio Vet Valpo"
          >
            <img className="logonav" src="/assets/icono.png" alt="Logo Domicilio Vet Valpo" />
          </a>
          <a className="navbar-brand" href="#inicio">
            DOMICILIO VET VALPO
          </a>
        </div>

        <button
          type="button"
          className="navbar-toggler flex h-10 w-10 items-center justify-center rounded-md border md:hidden"
          aria-label="Abrir menú de navegación"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="text-white" /> : <Menu className="text-white" />}
        </button>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                className={`nav-link ${activeId === link.id ? "active" : ""}`}
                href={link.href}
                aria-current={activeId === link.id ? "true" : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {menuOpen && (
        <ul id="mobile-menu" className="flex flex-col items-center gap-1 pb-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                className={`nav-link ${activeId === link.id ? "active" : ""}`}
                href={link.href}
                aria-current={activeId === link.id ? "true" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
