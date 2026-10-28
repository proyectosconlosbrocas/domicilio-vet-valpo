import { Clock, MapPin } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { ContactForm } from "./ContactForm";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { useInView } from "@/hooks/use-in-view";

export function Contact() {
  const left = useInView<HTMLDivElement>();
  const right = useInView<HTMLDivElement>({ delay: 90 });

  return (
    <section id="contacto" className="section section-alt">
      <div className="wrap contact-grid">
        <div ref={left.ref} className={`reveal ${left.isVisible ? "is-visible" : ""}`}>
          <h2 className="section-title">Agenda una visita</h2>
          <p className="section-lead mt-4">
            Escríbenos por WhatsApp o deja tus datos en el formulario. Te respondemos para coordinar el día y la hora.
          </p>

          <ul className="contact-list">
            <li>
              <FaWhatsapp size={22} aria-hidden="true" />
              <span className="label">WhatsApp</span>
              <a className="value" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                +56 9 6522 2368
              </a>
            </li>
            <li>
              <Clock size={22} aria-hidden="true" />
              <span className="label">Horario</span>
              <span className="value">Todos los días, 08:00 a 20:00</span>
            </li>
            <li>
              <MapPin size={22} aria-hidden="true" />
              <span className="label">Zona de atención</span>
              <span className="value">Valparaíso y Viña del Mar</span>
            </li>
            <li>
              <FaInstagram size={22} aria-hidden="true" />
              <span className="label">Instagram</span>
              <a
                className="value"
                href="https://www.instagram.com/domicilio.vet.valpo/"
                target="_blank"
                rel="noopener noreferrer"
              >
                @domicilio.vet.valpo
              </a>
            </li>
          </ul>
        </div>

        <div ref={right.ref} className={`reveal ${right.isVisible ? "is-visible" : ""}`}>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
