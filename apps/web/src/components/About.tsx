import { Check } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { useInView } from "@/hooks/use-in-view";

const EXPERTISE = [
  "Homeopatía veterinaria",
  "Atención integral a domicilio",
  "Cirugías menores y esterilizaciones",
  "Medicina preventiva y vacunación",
];

export function About() {
  const image = useInView<HTMLElement>();
  const content = useInView<HTMLDivElement>({ delay: 90 });

  return (
    <section id="sobre-mi" className="section section-alt">
      <div className="wrap about-grid">
        <figure ref={image.ref} className={`about-figure reveal ${image.isVisible ? "is-visible" : ""}`}>
          <img src="/assets/doctora-claudia-carcamo.jpg" alt="Retrato de la Dra. Claudia Cárcamo" loading="lazy" />
          <figcaption>Dra. Claudia Cárcamo, médico veterinario titulada.</figcaption>
        </figure>

        <div ref={content.ref} className={`about-body reveal ${content.isVisible ? "is-visible" : ""}`}>
          <h2 className="section-title">Dra. Claudia Cárcamo</h2>
          <p className="section-lead">
            Médico veterinario titulada, con especialización en medicina homeopática y atención a domicilio. Mi
            pasión es brindar cuidados personalizados que respeten la naturaleza de cada animal.
          </p>
          <p>
            Atender en casa permite ver a cada mascota en su ambiente, tranquila y sin el estrés del traslado. Creo en
            una medicina que fortalece la salud de manera integral, respetando el equilibrio y las necesidades
            individuales de cada animal.
          </p>
          <ul className="check-list two-col">
            {EXPERTISE.map((item) => (
              <li key={item}>
                <Check size={20} aria-hidden="true" /> {item}
              </li>
            ))}
          </ul>
          <a
            href={buildWhatsappLink("Hola Dra. Claudia, quisiera agendar una consulta para mi mascota")}
            className="btn btn-whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp aria-hidden="true" /> Agendar con la doctora
          </a>
        </div>
      </div>
    </section>
  );
}
