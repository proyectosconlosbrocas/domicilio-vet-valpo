import { FaWhatsapp } from "react-icons/fa";
import type { Service } from "@/data/services";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { useInView } from "@/hooks/use-in-view";

export function ServiceCard({ service, delay = 0 }: { service: Service; delay?: number }) {
  const { ref, isVisible } = useInView<HTMLDivElement>({ delay });

  return (
    <div ref={ref} className={`reveal h-full ${isVisible ? "is-visible" : ""}`}>
      <article className="service-card">
        <div className={`service-card-image ${service.variant === "icon-only" ? "icon-only" : ""}`}>
          <img src={service.image} alt={service.imageAlt} loading="lazy" />
        </div>
        <div className="service-card-body">
          <div className="service-icon-header">
            <img src={service.icon} alt={service.iconAlt} className="service-icon" />
            <h3 className="service-card-title">{service.title}</h3>
          </div>
          <p className="service-card-text">{service.description}</p>
          {service.priceFrom && (
            <div className="service-price">
              <span className="price-label">Desde</span>
              <span className="price-amount">${service.priceFrom.toLocaleString("es-CL")}</span>
              <span className="price-currency">CLP</span>
            </div>
          )}
          <a
            href={buildWhatsappLink(service.whatsappMessage)}
            className="btn btn-service"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp /> Contactar
          </a>
        </div>
      </article>
    </div>
  );
}
