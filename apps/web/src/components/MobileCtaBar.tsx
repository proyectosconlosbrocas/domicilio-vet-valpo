import { FaWhatsapp } from "react-icons/fa";
import { useScrollState } from "@/hooks/use-scroll-state";
import { buildWhatsappLink, WHATSAPP_GENERIC_MESSAGE } from "@/lib/whatsapp";

/**
 * Barra de conversión fija en mobile (patrón estándar de landing pages
 * orientadas a WhatsApp/llamada): reemplaza al botón flotante redondo de
 * WhatsApp en viewports chicos, donde un CTA de ancho completo convierte
 * mejor que un botón circular de 50px perdido en la esquina. Aparece
 * después del mismo umbral de scroll que el botón "volver arriba" (300px),
 * para no competir con el CTA del hero que ya está en la primera pantalla.
 */
export function MobileCtaBar() {
  const { showBackToTop } = useScrollState();

  return (
    <div className={`mobile-cta-bar ${showBackToTop ? "show" : ""}`}>
      <a
        href={buildWhatsappLink(WHATSAPP_GENERIC_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-whatsapp w-full"
      >
        <FaWhatsapp /> Agendar por WhatsApp
      </a>
    </div>
  );
}
