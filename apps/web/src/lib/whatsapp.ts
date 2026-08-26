/**
 * Fuente de verdad única para todos los enlaces de WhatsApp del sitio.
 *
 * En el sitio estático original, 8 de los 10 enlaces de wa.me estaban
 * percent-encoded a mano y 2 (los de Operativos) tenían caracteres UTF-8
 * crudos sin encodear. Acá el texto en español vive como fuente de verdad
 * y toda URL se genera de forma uniforme con encodeURIComponent().
 */

export const WHATSAPP_NUMBER = "56965222368";

export function buildWhatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_GENERIC_MESSAGE =
  "Hola, me estoy contactando contigo para saber más información sobre consulta veterinaria a domicilio";

export interface ContactFormValues {
  name: string;
  phone: string;
  pet: string;
  message: string;
}

export function buildWhatsappMessage({ name, phone, pet, message }: ContactFormValues): string {
  return `Hola, mi nombre es ${name}. Mi mascota se llama ${pet}. ${message}. Mi teléfono es ${phone}.`;
}
