import { Clock, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { HeroCarousel } from "./HeroCarousel";
import { buildWhatsappLink, WHATSAPP_GENERIC_MESSAGE } from "@/lib/whatsapp";
import { useInView } from "@/hooks/use-in-view";

const HERO_ICONS = [
  "/assets/icon-cruz-veterinaria.png",
  "/assets/icon-estetoscopio.png",
  "/assets/icon-jeringa.png",
  "/assets/icon-mascotas.png",
  "/assets/icon-pata-corazon.png",
  "/assets/icon-plato.png",
];

export function Hero() {
  const left = useInView<HTMLDivElement>();
  const right = useInView<HTMLDivElement>({ delay: 150 });

  return (
    <section id="inicio" className="hero-section">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-8 py-8 lg:grid-cols-2 lg:py-0">
          <div
            ref={left.ref}
            className={`hero-content-left reveal ${left.isVisible ? "is-visible" : ""}`}
          >
            <img src="/assets/hero-logo.png" alt="" aria-hidden="true" className="hero-logo" />
            <span className="hero-eyebrow">
              <MapPin size={16} /> Valparaíso y Viña del Mar
            </span>
            <h1 className="hero-title">Atención Veterinaria a Domicilio en Valparaíso</h1>
            <p className="hero-subtitle">
              Cuidamos de tus mascotas con profesionalismo y cariño, directamente en la comodidad de tu hogar
            </p>
            <div className="hero-description">
              <p>
                En <strong>Domicilio Vet Valpo</strong>, la Dra. Claudia Cárcamo ofrece atención especializada a
                domicilio, brindando tratamientos homeopáticos personalizados para el bienestar físico y emocional
                de tus compañeros.
              </p>
              <p>
                Creemos en una medicina natural que fortalece la salud de manera integral, respetando el equilibrio
                y las necesidades individuales de cada animal.
              </p>
            </div>
            <div className="hero-cta-row">
              <a
                href={buildWhatsappLink(WHATSAPP_GENERIC_MESSAGE)}
                className="btn btn-whatsapp btn-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp /> Agendar por WhatsApp
              </a>
              <a href="#servicios" className="btn btn-outline-primary btn-lg">
                Ver Servicios
              </a>
            </div>
            <p className="hero-hours">
              <Clock size={16} /> Atención todos los días de 08:00 a 20:00
            </p>
          </div>

          <div ref={right.ref} className={`reveal ${right.isVisible ? "is-visible" : ""}`}>
            <HeroCarousel />
            <div className="hero-icons-container mt-4">
              {HERO_ICONS.map((icon) => (
                <img key={icon} src={icon} alt="Icono" className="hero-icon" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
