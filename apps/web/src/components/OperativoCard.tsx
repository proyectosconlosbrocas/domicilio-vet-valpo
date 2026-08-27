import { CheckCircle2, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type { Operativo } from "@/data/operativos";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { useInView } from "@/hooks/use-in-view";

export function OperativoCard({ operativo, delay = 0 }: { operativo: Operativo; delay?: number }) {
  const { ref, isVisible } = useInView<HTMLDivElement>({ delay });

  return (
    <div ref={ref} className={`reveal h-full ${isVisible ? "is-visible" : ""}`}>
      <article className="operativo-card">
        <div className={`operativo-image-container ${operativo.imagePositionBottom ? "esterilizacion-image-container" : ""}`}>
          <img src={operativo.image} alt={operativo.imageAlt} loading="lazy" />
          <div className="operativo-badge">Operativo</div>
        </div>
        <div className="operativo-content">
          <h3 className="operativo-title">
            <span className="operativo-icon-badge">
              <img src={operativo.icon} alt={operativo.iconAlt} className="operativo-icon" />
            </span>
            {operativo.title}
          </h3>
          <div className="operativo-location">
            <MapPin size={18} />
            <span>{operativo.location}</span>
          </div>
          <p className="operativo-description">{operativo.description}</p>
          <div className="operativo-features">
            {operativo.features.map((feature) => (
              <div className="operativo-feature" key={feature}>
                <CheckCircle2 size={18} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <a
            href={buildWhatsappLink(operativo.whatsappMessage)}
            className="operativo-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
            Consultar próximo operativo
          </a>
        </div>
      </article>
    </div>
  );
}
