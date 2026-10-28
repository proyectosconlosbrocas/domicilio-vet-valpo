export interface GalleryPhoto {
  src: string;
  alt: string;
}

/** Fotos propias de visitas y operativos, usadas cuando el feed de Instagram no está disponible. */
export const galleryPhotos: GalleryPhoto[] = [
  { src: "/assets/IMG-20251110-WA0012.jpg", alt: "Revisión de un perro en el patio, junto a su dueño" },
  { src: "/assets/IMG-20251110-WA0018.jpg", alt: "Operativo veterinario al aire libre" },
  { src: "/assets/c2fcfc8d-2852-49a1-9e4d-06353f5cf027.jpg", alt: "La doctora con un gato blanco en brazos" },
  { src: "/assets/IMG-20251110-WA0015.jpg", alt: "Atención en el interior de una casa" },
  { src: "/assets/foto3.png", alt: "Revisión de un perro sostenido por su dueño" },
  { src: "/assets/IMG-20251110-WA0020.jpg", alt: "Curación de un perro en el suelo de su casa" },
  { src: "/assets/foto1.png", alt: "La doctora abrazando a un cachorro" },
  { src: "/assets/consulta-veterinaria.jpg", alt: "La doctora sutura a un perro durante un procedimiento" },
];
