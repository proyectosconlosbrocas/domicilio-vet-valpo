import { Link } from "react-router-dom";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { BrandPattern } from "./motion/Backdrops";

export function Footer() {
  return (
    <footer className="site-footer">
      <BrandPattern tone="white" opacity={0.05} drift={30} fade="bottom" />
      <div className="wrap">
        <p className="footer-name">Domicilio Vet Valpo</p>

        <div className="footer-grid">
          <div>
            <h3>Atención</h3>
            <p>
              Veterinaria a domicilio con la Dra. Claudia Cárcamo.
              <br />
              Valparaíso y Viña del Mar, todos los días de 08:00 a 20:00.
            </p>
          </div>
          <div>
            <h3>Contacto</h3>
            <ul>
              <li>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp +56 9 6522 2368
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/domicilio.vet.valpo/" target="_blank" rel="noopener noreferrer">
                  Instagram @domicilio.vet.valpo
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3>Clientes</h3>
            <ul>
              <li>
                <Link to="/portal">Ver la ficha de mi mascota</Link>
              </li>
              <li>
                <a href="/#servicios">Servicios y precios</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Domicilio Vet Valpo</span>
          <span>Dra. Claudia Cárcamo, médico veterinario</span>
        </div>
      </div>
    </footer>
  );
}
