import { services } from "@/data/services";
import { ServiceCard, ServiceMoreItem } from "./ServiceCard";
import { Reveal, RevealGroup } from "./motion/Reveal";
import { BrandMark } from "./motion/Backdrops";

export function Services() {
  const featured = services.filter((service) => service.variant === "featured");
  const more = services.filter((service) => service.variant === "more");

  return (
    <section id="servicios" className="section section-services">
      <BrandMark tone="red" opacity={0.05} size="30rem" position={{ right: "-9rem", top: "4rem" }} />

      <div className="wrap">
        <Reveal className="section-head">
          <h2 className="section-title">Servicios y precios</h2>
          <p className="section-lead">
            Todo se hace en tu casa, con el equipamiento necesario. Los valores son "desde": el precio final
            depende de tu mascota y del procedimiento, y te lo confirmamos por WhatsApp antes de la visita.
          </p>
        </Reveal>

        <ul className="service-feature-list">
          {featured.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </ul>

        <div className="service-more">
          <Reveal>
            <h3 className="service-more-title">También a domicilio</h3>
          </Reveal>
          <RevealGroup as="ul" className="service-more-list">
            {more.map((service) => (
              <ServiceMoreItem key={service.id} service={service} />
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
