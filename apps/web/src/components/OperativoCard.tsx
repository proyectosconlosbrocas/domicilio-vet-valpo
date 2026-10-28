import { Check, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type { Operativo } from "@/data/operativos";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { useInView } from "@/hooks/use-in-view";

export function OperativoCard({ operativo, delay = 0 }: { operativo: Operativo; delay?: number }) {
  const { ref, isVisible } = useInView<HTMLElement>({ delay });

  return (
    <article ref={ref} className={`operativo reveal ${isVisible ? "is-visible" : ""}`}>
      <div className={`operativo-media ${operativo.imagePositionBottom ? "bottom" : ""}`}>
        <img src={operativo.image} alt={operativo.imageAlt} loading="lazy" />
      </div>
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
        className="btn btn-whatsapp btn-sm"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp aria-hidden="true" /> Consultar próximo operativo
      </a>
    </article>
  );
}
