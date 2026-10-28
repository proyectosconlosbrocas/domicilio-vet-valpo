import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Clock, MapPin, Wallet } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { HeroCarousel } from "./HeroCarousel";
import { BrandPattern } from "./motion/Backdrops";
import { buildWhatsappLink, WHATSAPP_GENERIC_MESSAGE } from "@/lib/whatsapp";
import { services } from "@/data/services";

const minPrice = Math.min(...services.flatMap((s) => (s.priceFrom ? [s.priceFrom] : [])));
const EASE = [0.2, 0.7, 0.2, 1] as const;

// El título no se anima (tiene que estar pintado desde el primer frame); el
// resto entra en cascada corta que termina antes de 1,2 s.
const enter = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE },
});

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Al bajar, la foto se queda un poco atrás y el bloque rojo se adelanta: profundidad.
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const blockY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section id="inicio" ref={ref} className="hero">
      <BrandPattern tone="red" opacity={0.07} drift={40} fade="left" />

      <div className="wrap hero-grid">
        <h1 className="hero-title">
          Veterinaria a domicilio en <span className="accent">Valparaíso</span>
        </h1>

        <div>
          <motion.p className="hero-lead" {...enter(0.05)}>
            La Dra. Claudia Cárcamo atiende a tu perro o gato en tu casa, sin traslados ni salas de espera.
            Consultas, cirugías, vacunas y homeopatía en Valparaíso y Viña del Mar.
          </motion.p>
          <motion.div className="hero-actions" {...enter(0.15)}>
            <motion.a
              href={buildWhatsappLink(WHATSAPP_GENERIC_MESSAGE)}
              className="btn btn-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaWhatsapp aria-hidden="true" /> Agendar por WhatsApp
            </motion.a>
            <a href="#servicios" className="link-action">
              Ver servicios y precios <ArrowRight size={18} className="arrow" aria-hidden="true" />
            </a>
          </motion.div>
          <motion.ul className="hero-facts" {...enter(0.25)}>
            <li>
              <Clock size={18} aria-hidden="true" /> Todos los días, 08:00 a 20:00
            </li>
            <li>
              <MapPin size={18} aria-hidden="true" /> Valparaíso y Viña del Mar
            </li>
            <li>
              <Wallet size={18} aria-hidden="true" /> Consultas desde ${minPrice.toLocaleString("es-CL")}
            </li>
          </motion.ul>
        </div>

        <div className="hero-media">
          <motion.div className="hero-media-block" style={{ y: blockY }} aria-hidden="true" />
          <motion.div
            style={{ y: photoY }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          >
            <HeroCarousel />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
