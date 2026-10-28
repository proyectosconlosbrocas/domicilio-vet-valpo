import { services } from "@/data/services";
import { ServiceCard, ServiceMoreItem } from "./ServiceCard";
import { useInView } from "@/hooks/use-in-view";

export function Services() {
  const head = useInView<HTMLDivElement>();
  const featured = services.filter((service) => service.variant === "featured");
  const more = services.filter((service) => service.variant === "more");

  return (
    <section id="servicios" className="section">
      <div className="wrap">
        <div ref={head.ref} className={`section-head reveal ${head.isVisible ? "is-visible" : ""}`}>
          <h2 className="section-title">Servicios y precios</h2>
          <p className="section-lead">
            Todo se hace en tu casa, con el equipamiento necesario. Los valores son "desde": el precio final
            depende de tu mascota y del procedimiento, y te lo confirmamos por WhatsApp antes de la visita.
          </p>
        </div>

        <ul className="service-feature-list">
          {featured.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </ul>

        <div className="service-more">
          <h3 className="service-more-title">También a domicilio</h3>
          <ul className="service-more-list">
            {more.map((service, index) => (
              <ServiceMoreItem key={service.id} service={service} delay={index * 90} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
