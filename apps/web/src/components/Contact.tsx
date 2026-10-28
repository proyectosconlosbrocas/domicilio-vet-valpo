import { Clock, MapPin } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { ContactForm } from "./ContactForm";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { Reveal } from "./motion/Reveal";
import { BrandPattern } from "./motion/Backdrops";

export function Contact() {
  return (
    <section id="contacto" className="section section-contact">
      <BrandPattern tone="red" opacity={0.08} drift={50} fade="right" />

      <div className="wrap contact-grid">
        <Reveal>
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
        </Reveal>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
