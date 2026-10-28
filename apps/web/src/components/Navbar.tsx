import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, UserCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useScrollState } from "@/hooks/use-scroll-state";
import { useActiveSection } from "@/hooks/use-active-section";
import { buildWhatsappLink, WHATSAPP_GENERIC_MESSAGE } from "@/lib/whatsapp";

// En el mismo orden en que aparecen las secciones en la página.
const NAV_LINKS = [
  { id: "servicios", label: "Servicios" },
  { id: "sobre-mi", label: "La doctora" },
  { id: "operativos", label: "Operativos" },
  { id: "contacto", label: "Contacto" },
];

const SECTION_IDS = ["inicio", ...NAV_LINKS.map((link) => link.id)];

export function Navbar() {
  const { scrolled } = useScrollState();
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);
  const { pathname } = useLocation();
  // Desde /portal los anclas tienen que volver a la landing.
  const base = pathname === "/" ? "" : "/";

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <nav className={`site-nav ${scrolled || menuOpen ? "scrolled" : ""}`} aria-label="Principal">
      <div className="wrap site-nav-row">
        <a className="brand" href={`${base}#inicio`}>
          <img src="/assets/icono.png" alt="" width={44} height={44} />
          <span className="brand-name">
            Domicilio <span>Vet Valpo</span>
          </span>
        </a>

        <ul className="nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                className={`nav-link ${activeId === link.id ? "active" : ""}`}
                href={`${base}#${link.id}`}
                aria-current={activeId === link.id ? "location" : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link to="/portal" className={`nav-link ${pathname === "/portal" ? "active" : ""}`}>
              <UserCircle size={18} aria-hidden="true" /> Clientes
            </Link>
          </li>
          <li className="nav-cta">
            <a
              href={buildWhatsappLink(WHATSAPP_GENERIC_MESSAGE)}
              className="btn btn-whatsapp btn-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp aria-hidden="true" /> Agendar
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Abrir menú de navegación"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <ul id="mobile-menu" className="nav-mobile">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                className={`nav-link ${activeId === link.id ? "active" : ""}`}
                href={`${base}#${link.id}`}
                aria-current={activeId === link.id ? "location" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link to="/portal" className="nav-link" onClick={() => setMenuOpen(false)}>
              <UserCircle size={20} aria-hidden="true" /> Clientes: ver la ficha de mi mascota
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
