import { FaWhatsapp } from "react-icons/fa";
import { ArrowUp } from "lucide-react";
import { useScrollState } from "@/hooks/use-scroll-state";
import { buildWhatsappLink, WHATSAPP_GENERIC_MESSAGE } from "@/lib/whatsapp";

/**
 * Botón redondo de WhatsApp (solo desktop; en mobile lo reemplaza la
 * MobileCtaBar) y "volver arriba". El botón flotante de Instagram se quitó:
 * competía con WhatsApp por la misma esquina y ya está en contacto y footer.
 */
export function FloatingButtons() {
  const { showBackToTop } = useScrollState();

  return (
    <>
      <a
        href={buildWhatsappLink(WHATSAPP_GENERIC_MESSAGE)}
        className="fab fab-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        title="Contactar por WhatsApp"
      >
        <FaWhatsapp aria-hidden="true" />
      </a>

      <button
        type="button"
        className={`fab fab-top ${showBackToTop ? "show" : ""}`}
        aria-label="Volver arriba"
        title="Volver arriba"
        tabIndex={showBackToTop ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp size={20} aria-hidden="true" />
      </button>
    </>
  );
}
