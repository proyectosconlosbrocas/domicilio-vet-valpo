export interface Operativo {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string;
  imageAlt: string;
  /** encuadra la parte baja de la foto (.operativo-media.bottom) */
  imagePositionBottom?: boolean;
  features: string[];
  whatsappMessage: string;
}

export const operativos: Operativo[] = [
  {
    id: "esterilizacion",
    title: "Esterilización",
    location: "Diferentes sectores de Valparaíso y Viña del Mar",
    description:
      "Jornadas de esterilización programadas en diversos barrios de Valparaíso y Viña del Mar. Contribuimos al control poblacional responsable y mejoramos la salud de tu mascota mediante cirugías seguras realizadas por profesionales certificados.",
    image: "/assets/modificada.png",
    imageAlt: "Operativo de esterilización veterinaria",
    imagePositionBottom: true,
    features: [
      "Cirugía segura con anestesia controlada",
      "Equipo veterinario completo",
      "Seguimiento post-operatorio incluido",
      "Precios comunitarios accesibles",
    ],
    whatsappMessage: "Hola, quiero información sobre los operativos de esterilización",
  },
  {
    id: "desparasitacion",
    title: "Desparasitación",
    location: "Diferentes sectores de Valparaíso y Viña del Mar",
    description:
      "Jornadas preventivas de desparasitación interna y externa para proteger a tu mascota de parásitos. Servicios rápidos y efectivos que previenen enfermedades y mejoran la calidad de vida de tus compañeros.",
    image: "/assets/operativo-desparasitacion.jpg",
    imageAlt: "Operativo de desparasitación veterinaria",
    features: [
      "Desparasitación interna y externa",
      "Productos de alta calidad",
      "Orientación veterinaria profesional",
      "Atención rápida y eficiente",
    ],
    whatsappMessage: "Hola, quiero información sobre los operativos de desparasitación",
  },
];
