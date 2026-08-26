import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { ArrowUpCircle } from "lucide-react";
import { useScrollState } from "@/hooks/use-scroll-state";
import { buildWhatsappLink, WHATSAPP_GENERIC_MESSAGE } from "@/lib/whatsapp";

export function FloatingButtons() {
  const { showBackToTop } = useScrollState();

  return (
    <>
      <a
        href={buildWhatsappLink(WHATSAPP_GENERIC_MESSAGE)}
        className="whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
      >
        <FaWhatsapp />
      </a>

      <a
        href="https://www.instagram.com/domicilio.vet.valpo/"
        target="_blank"
        rel="noopener noreferrer"
        className="instagram-btn"
        aria-label="Seguir en Instagram"
      >
        <FaInstagram />
      </a>

      <button
        type="button"
        className={`back-to-top ${showBackToTop ? "show" : ""}`}
        aria-label="Volver arriba"
        title="Volver arriba"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUpCircle size={26} />
      </button>
    </>
  );
}
