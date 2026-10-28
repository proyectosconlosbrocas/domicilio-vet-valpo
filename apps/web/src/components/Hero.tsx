import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Clock, MapPin, Wallet } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { BrandPattern } from "./motion/Backdrops";
import { buildWhatsappLink, WHATSAPP_GENERIC_MESSAGE } from "@/lib/whatsapp";
import { services } from "@/data/services";

const minPrice = Math.min(...services.flatMap((s) => (s.priceFrom ? [s.priceFrom] : [])));
const EASE = [0.2, 0.7, 0.2, 1] as const;
const OPEN_HOUR = 8;
const CLOSE_HOUR = 20;

const FACTS = [
  { icon: Clock, label: "Horario", value: "Todos los días, 8 a 20 h" },
  { icon: MapPin, label: "Zona", value: "Valparaíso y Viña" },
  { icon: Wallet, label: "Consultas", value: `Desde $${minPrice.toLocaleString("es-CL")}` },
];

/** Hora actual en Chile (0–23), sin importar la zona horaria del visitante. */
function chileHour() {
  return Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Santiago", hour: "numeric", hourCycle: "h23" }).format(
      new Date()
    )
  );
}

/** Si la agenda está atendiendo ahora; se recalcula cada minuto. */
function useAgendaAbierta() {
  const [abierta, setAbierta] = useState(() => {
    const h = chileHour();
    return h >= OPEN_HOUR && h < CLOSE_HOUR;
  });
  useEffect(() => {
    const id = window.setInterval(() => {
      const h = chileHour();
      setAbierta(h >= OPEN_HOUR && h < CLOSE_HOUR);
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return abierta;
}

// El título no se anima (tiene que estar pintado desde el primer frame); el
// resto entra en cascada corta que termina antes de 1,2 s.
const enter = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE },
});

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const abierta = useAgendaAbierta();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Tres capas a distinta velocidad al bajar: profundidad sin mover el texto.
  const mainY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const blockY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const insetY = useTransform(scrollYProgress, [0, 1], [0, -90]);

  return (
    <section id="inicio" ref={ref} className="hero">
      <BrandPattern tone="red" opacity={0.07} drift={40} fade="left" />

      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1 className="hero-title">
            <span className="hero-title-line">Veterinaria a domicilio</span> en{" "}
            <span className="accent">Valparaíso</span>
          </h1>
          <motion.p className="hero-lead" {...enter(0.05)}>
            La Dra. Claudia Cárcamo atiende a tu perro o gato en tu casa, sin traslados ni salas de espera.
            Consultas, cirugías, vacunas y homeopatía.
          </motion.p>
          <motion.div className="hero-actions" {...enter(0.15)}>
            <motion.a
              href={buildWhatsappLink(WHATSAPP_GENERIC_MESSAGE)}
              className="btn btn-whatsapp btn-lg"
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
        </div>

        {/* Fuera de .hero-copy para que en móvil vaya después de la foto. */}
        <motion.dl className="hero-facts" {...enter(0.25)}>
          {FACTS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="hero-fact">
              <dt>
                <Icon size={16} aria-hidden="true" /> {label}
              </dt>
              <dd>{value}</dd>
            </div>
          ))}
        </motion.dl>

        <div className="hero-media">
          <motion.div className="hero-media-block" style={{ y: blockY }} aria-hidden="true" />

          <motion.figure
            className="hero-photo-main"
            style={{ y: mainY }}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.05, ease: EASE }}
          >
            <img
              src="/assets/hero-principal.jpg"
              alt="La Dra. Claudia Cárcamo sonriendo con un gatito naranjo en brazos"
              width={960}
              height={1200}
            />
          </motion.figure>

          <motion.figure
            className="hero-photo-inset"
            style={{ y: insetY }}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          >
            <img
              src="/assets/hero-visita.jpg"
              alt="La doctora ausculta a un perro en el living de su familia"
              width={880}
              height={660}
            />
            <figcaption>Consulta en el living de casa</figcaption>
          </motion.figure>

          <motion.div
            className="hero-status"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
            role="status"
          >
            <span className={`hero-status-dot ${abierta ? "open" : ""}`} aria-hidden="true" />
            <span>
              <strong>{abierta ? "Agenda abierta" : "Fuera de horario"}</strong>
              <small>
                {abierta ? `Respondemos hasta las ${CLOSE_HOUR}:00` : `Respondemos desde las 0${OPEN_HOUR}:00`}
              </small>
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
