export const INSTAGRAM_URL = "https://www.instagram.com/domicilio.vet.valpo/";

/**
 * Normaliza un teléfono chileno a formato wa.me (código de país + número,
 * sin espacios ni símbolos). Acepta variantes comunes con las que puede
 * quedar guardado un teléfono: "+56 9 1234 5678", "912345678",
 * "56912345678", "09 1234 5678".
 */
export function normalizeChileanPhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("56")) return digits;
  if (digits.startsWith("0")) return `56${digits.slice(1)}`;
  return `56${digits}`;
}

export function buildClienteWhatsappLink(telefono: string | null | undefined, message: string): string | null {
  const numero = normalizeChileanPhone(telefono);
  if (!numero) return null;
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
}

export function buildRegistroMessage(nombre: string): string {
  return (
    `¡Hola ${nombre}! 👋 Te confirmamos tu registro en Domicilio Vet Valpo. ` +
    `Cualquier consulta sobre tu mascota, escribinos por acá. ` +
    `Seguinos en Instagram: ${INSTAGRAM_URL}`
  );
}

function formatFechaCorta(fecha: string): string {
  const [, m, d] = fecha.split("-");
  return `${d}/${m}`;
}

export function buildCitaMessage(nombre: string, fecha: string, hora: string | null): string {
  const cuando = hora ? `el ${formatFechaCorta(fecha)} a las ${hora.slice(0, 5)} hrs` : `el ${formatFechaCorta(fecha)}`;
  return (
    `¡Hola ${nombre}! Te confirmamos tu visita ${cuando}. ` +
    `Cualquier consulta, escribinos por acá. ` +
    `Seguinos en Instagram: ${INSTAGRAM_URL}`
  );
}

export function buildVacunaMessage(nombre: string, mascotaNombre: string): string {
  return (
    `¡Hola ${nombre}! Te escribimos para recordarte que ${mascotaNombre} tiene una vacuna próxima a vencer. ` +
    `Cualquier consulta, escribinos por acá. ` +
    `Seguinos en Instagram: ${INSTAGRAM_URL}`
  );
}
