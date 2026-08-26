import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-2">&copy; 2024 Domicilio Vet Valpo - Dra. Claudia Cárcamo</p>
        <p className="mb-0">Atención veterinaria profesional a domicilio en Valparaíso y Viña del Mar</p>
        <div className="social-links mt-3">
          <a
            href="https://www.instagram.com/domicilio.vet.valpo/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </footer>
  );
}
