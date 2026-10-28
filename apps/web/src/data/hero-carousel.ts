export interface CarouselImage {
  src: string;
  alt: string;
  /** Pie visible sobre la foto: dice qué es, no de dónde viene. */
  caption: string;
}

// Fotos reales de visitas a domicilio. La primera es la que se ve al cargar
// (no se marca lazy), así que conviene que sea la más representativa.
export const heroCarouselImages: CarouselImage[] = [
  {
    src: "/assets/IMG-20251110-WA0009.jpg",
    alt: "La Dra. Claudia Cárcamo con un gato en brazos durante una visita",
    caption: "Visita a domicilio en Valparaíso",
  },
  {
    src: "/assets/hero-section.jpg",
    alt: "La doctora junto a un perro en la calle de un cerro de Valparaíso",
    caption: "Atención en tu barrio",
  },
  {
    src: "/assets/IMG-20251110-WA0013.jpg",
    alt: "La doctora examina a un perro en el living de una casa",
    caption: "Consulta en el living de casa",
  },
  {
    src: "/assets/e7784dcf-0c57-4322-83a9-67347eebe558.jpg",
    alt: "La doctora sonriendo con un gato naranjo en brazos",
    caption: "Gatos y perros, sin estrés de traslado",
  },
  {
    src: "/assets/IMG-20251110-WA0003.jpg",
    alt: "Atención a un perro en el patio de una casa",
    caption: "Atención en el patio de casa",
  },
];
