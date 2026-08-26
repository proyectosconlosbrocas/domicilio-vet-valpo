import { MapPin } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { ContactForm } from "./ContactForm";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { useInView } from "@/hooks/use-in-view";

export function Contact() {
  const left = useInView<HTMLDivElement>();
  const right = useInView<HTMLDivElement>({ delay: 100 });

  return (
    <section id="contacto" className="contact-section py-16">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div ref={left.ref} className={`reveal ${left.isVisible ? "is-visible" : ""}`}>
            <h2 className="section-title mb-4">¿Listo para agendar?</h2>
            <p className="contact-description">
              Estamos aquí para ayudarte. Contáctanos a través de WhatsApp o completa el formulario y nos pondremos
              en contacto contigo.
            </p>
            <div className="contact-info-list">
              <div className="contact-info-item">
                <FaWhatsapp />
                <div>
                  <h4>WhatsApp</h4>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                    +56 9 6522 2368
                  </a>
                </div>
              </div>
              <div className="contact-info-item">
                <FaInstagram />
                <div>
                  <h4>Instagram</h4>
                  <a href="https://www.instagram.com/domicilio.vet.valpo/" target="_blank" rel="noopener noreferrer">
                    @domicilio.vet.valpo
                  </a>
                </div>
              </div>
              <div className="contact-info-item">
                <MapPin />
                <div>
                  <h4>Zona de Atención</h4>
                  <p>Valparaíso y Viña del Mar</p>
                </div>
              </div>
            </div>
          </div>

          <div ref={right.ref} className={`reveal ${right.isVisible ? "is-visible" : ""}`}>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
