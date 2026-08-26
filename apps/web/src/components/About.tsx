import { Award } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { useInView } from "@/hooks/use-in-view";

const EXPERTISE = [
  { icon: "/assets/icon-pata-corazon.png", alt: "Icono homeopatía", label: "Especialista en Homeopatía Veterinaria" },
  { icon: "/assets/icon-mascotas.png", alt: "Icono atención domicilio", label: "Atención Integral a Domicilio" },
  { icon: "/assets/icon-cruz-veterinaria.png", alt: "Icono cirugías", label: "Cirugías Menores y Esterilizaciones" },
  { icon: "/assets/icon-jeringa.png", alt: "Icono vacunación", label: "Medicina Preventiva y Vacunación" },
];

export function About() {
  const image = useInView<HTMLDivElement>();
  const content = useInView<HTMLDivElement>({ delay: 100 });

  return (
    <section id="sobre-mi" className="about-section py-16">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div ref={image.ref} className={`reveal lg:col-span-5 ${image.isVisible ? "is-visible" : ""}`}>
            <div className="about-image-wrapper">
              <img
                src="/assets/doctora-claudia-carcamo.jpg"
                alt="Dra. Claudia Cárcamo"
                className="w-full rounded-2xl shadow"
                loading="lazy"
              />
              <div className="about-badge">
                <Award />
                <span>Médico Veterinario Certificado</span>
              </div>
            </div>
          </div>

          <div ref={content.ref} className={`reveal lg:col-span-7 ${content.isVisible ? "is-visible" : ""}`}>
            <h2 className="section-title mb-4">Dra. Claudia Cárcamo</h2>
            <p className="about-text">
              Médico Veterinario titulada con especialización en medicina homeopática y atención a domicilio. Mi
              pasión es brindar cuidados personalizados que respeten la naturaleza de cada animal.
            </p>
            <div className="expertise-list">
              {EXPERTISE.map((item) => (
                <div className="expertise-item" key={item.label}>
                  <img src={item.icon} alt={item.alt} className="expertise-icon" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              className="btn btn-primary btn-lg mt-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp /> Agendar Consulta
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
