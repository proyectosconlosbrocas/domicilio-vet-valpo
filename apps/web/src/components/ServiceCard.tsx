import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type { Service } from "@/data/services";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { Reveal, RevealItem } from "./motion/Reveal";

/** Servicio principal: fila con foto grande (con parallax), descripción y precio de referencia. */
export function ServiceCard({ service }: { service: Service }) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: mediaRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const blockY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <li className="service-feature">
      <div ref={mediaRef} className="service-feature-media-wrap">
        <motion.div className="service-feature-block" style={{ y: blockY }} aria-hidden="true" />
        <Reveal className="service-feature-media">
          <motion.img src={service.image} alt={service.imageAlt} loading="lazy" style={{ y: imageY }} />
        </Reveal>
      </div>
      <Reveal className="service-feature-body" delay={0.08}>
        <h3 className="service-feature-title">{service.title}</h3>
        <p className="service-feature-text">{service.description}</p>
        {service.priceFrom && (
          <p className="service-price">
            <span className="service-price-label">Desde</span>
            <span className="service-price-amount">${service.priceFrom.toLocaleString("es-CL")}</span>
          </p>
        )}
        <a
          href={buildWhatsappLink(service.whatsappMessage)}
          className="btn btn-whatsapp btn-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp aria-hidden="true" /> Agendar {service.title.toLowerCase()}
        </a>
      </Reveal>
    </li>
  );
}

/** Servicio secundario: foto, título, una línea y link de consulta. */
export function ServiceMoreItem({ service }: { service: Service }) {
  return (
    <RevealItem as="li" className="service-more-item">
      <motion.div className="service-more-media" whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
        <img src={service.image} alt={service.imageAlt} loading="lazy" />
      </motion.div>
      <h4>{service.title}</h4>
      <p>{service.description}</p>
      <a
        href={buildWhatsappLink(service.whatsappMessage)}
        className="link-action"
        target="_blank"
        rel="noopener noreferrer"
      >
        Consultar por WhatsApp <ArrowRight size={18} className="arrow" aria-hidden="true" />
      </a>
    </RevealItem>
  );
}
