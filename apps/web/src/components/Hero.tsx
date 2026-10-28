import { ArrowRight, Clock, MapPin, Wallet } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { HeroCarousel } from "./HeroCarousel";
import { buildWhatsappLink, WHATSAPP_GENERIC_MESSAGE } from "@/lib/whatsapp";
import { services } from "@/data/services";

const minPrice = Math.min(...services.flatMap((s) => (s.priceFrom ? [s.priceFrom] : [])));

export function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="wrap hero-grid">
        {/* El título no se anima: tiene que estar pintado desde el primer
            frame. El resto entra en cascada corta (termina antes de 1,2 s). */}
        <h1 className="hero-title">
          Veterinaria a domicilio en <span className="accent">Valparaíso</span>
        </h1>
        <div>
          <p className="hero-lead hero-enter hero-enter-2">
            La Dra. Claudia Cárcamo atiende a tu perro o gato en tu casa, sin traslados ni salas de espera.
            Consultas, cirugías, vacunas y homeopatía en Valparaíso y Viña del Mar.
          </p>
          <div className="hero-actions hero-enter hero-enter-3">
            <a
              href={buildWhatsappLink(WHATSAPP_GENERIC_MESSAGE)}
              className="btn btn-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp aria-hidden="true" /> Agendar por WhatsApp
            </a>
            <a href="#servicios" className="link-action">
              Ver servicios y precios <ArrowRight size={18} className="arrow" aria-hidden="true" />
            </a>
          </div>
          <ul className="hero-facts hero-enter hero-enter-4">
            <li>
              <Clock size={18} aria-hidden="true" /> Todos los días, 08:00 a 20:00
            </li>
            <li>
              <MapPin size={18} aria-hidden="true" /> Valparaíso y Viña del Mar
            </li>
            <li>
              <Wallet size={18} aria-hidden="true" /> Consultas desde ${minPrice.toLocaleString("es-CL")}
            </li>
          </ul>
        </div>

        <div className="hero-enter hero-enter-2">
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
}
