import { motion } from "motion/react";
import { Check, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type { Operativo } from "@/data/operativos";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { RevealItem } from "./motion/Reveal";

export function OperativoCard({ operativo }: { operativo: Operativo }) {
  return (
    <RevealItem as="article" className="operativo">
      <motion.div
        className={`operativo-media ${operativo.imagePositionBottom ? "bottom" : ""}`}
        whileHover={{ scale: 1.015 }}
        transition={{ duration: 0.3 }}
      >
        <img src={operativo.image} alt={operativo.imageAlt} loading="lazy" />
      </motion.div>
      <h3 className="operativo-title">Operativo de {operativo.title.toLowerCase()}</h3>
      <p className="operativo-where">
        <MapPin size={16} aria-hidden="true" /> {operativo.location}
      </p>
      <p>{operativo.description}</p>
      <ul className="check-list">
        {operativo.features.map((feature) => (
          <li key={feature}>
            <Check size={20} aria-hidden="true" /> {feature}
          </li>
        ))}
      </ul>
      <a
        href={buildWhatsappLink(operativo.whatsappMessage)}
        className="btn btn-on-red btn-sm"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp aria-hidden="true" /> Consultar próximo operativo
      </a>
    </RevealItem>
  );
}
