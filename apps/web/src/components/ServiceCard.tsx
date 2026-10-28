import { ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type { Service } from "@/data/services";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { useInView } from "@/hooks/use-in-view";

/** Servicio principal: fila con foto grande, descripción y precio de referencia. */
export function ServiceCard({ service }: { service: Service }) {
  const { ref, isVisible } = useInView<HTMLLIElement>();

  return (
    <li ref={ref} className={`service-feature reveal ${isVisible ? "is-visible" : ""}`}>
      <div className="service-feature-media">
        <img src={service.image} alt={service.imageAlt} loading="lazy" />
      </div>
      <div className="service-feature-body">
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
      </div>
    </li>
  );
}

/** Servicio secundario: foto, título, una línea y link de consulta. */
export function ServiceMoreItem({ service, delay = 0 }: { service: Service; delay?: number }) {
  const { ref, isVisible } = useInView<HTMLLIElement>({ delay });

  return (
    <li ref={ref} className={`service-more-item reveal ${isVisible ? "is-visible" : ""}`}>
      <div className="service-more-media">
        <img src={service.image} alt={service.imageAlt} loading="lazy" />
      </div>
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
    </li>
  );
}
