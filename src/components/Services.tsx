import { services } from "@/data/services";
import { ServiceCard } from "./ServiceCard";

export function Services() {
  return (
    <section id="servicios" className="services-section py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="section-title">Nuestros Servicios</h2>
          <p className="section-subtitle">Atención profesional y personalizada para tu mascota</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} delay={(index % 3) * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
