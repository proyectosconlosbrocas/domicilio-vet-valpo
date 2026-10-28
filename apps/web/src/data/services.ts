export interface Service {
  id: string;
  title: string;
  description: string;
  /** 'featured': fila grande con foto y precio. 'more': bloque de "también a domicilio". */
  variant: "featured" | "more";
  image: string;
  imageAlt: string;
  priceFrom?: number;
  whatsappMessage: string;
}

export const services: Service[] = [
  {
    id: "consulta",
    title: "Consulta a domicilio",
    description:
      "Examen completo, diagnóstico y tratamiento sin sacar a tu mascota de casa: menos estrés para ella y para ti. Atendemos todos los días, con hora previa.",
    variant: "featured",
    image: "/assets/IMG-20251110-WA0016.jpg",
    imageAlt: "La doctora revisa a un perro en el living de su casa",
    priceFrom: 25000,
    whatsappMessage: "Hola, me interesa agendar una consulta veterinaria a domicilio",
  },
  {
    id: "cirugia",
    title: "Cirugía",
    description:
      "Realizamos procedimientos quirúrgicos, incluyendo esterilizaciones para caninos y felinos, con equipamiento especializado en tu domicilio.",
    variant: "featured",
    image: "/assets/quirurjico.png",
    imageAlt: "La doctora con mascarilla junto a un perro en la mesa de procedimientos",
    priceFrom: 80000,
    whatsappMessage: "Hola, necesito información sobre cirugía veterinaria a domicilio",
  },
  {
    id: "homeopatia",
    title: "Homeopatía veterinaria",
    description: "Tratamientos homeopáticos personalizados para el bienestar físico y emocional de tu mascota, como complemento de la medicina veterinaria.",
    variant: "featured",
    image: "/assets/foto2.png",
    imageAlt: "La Dra. Claudia Cárcamo junto a un pendón de nanomedicina homeopática",
    priceFrom: 30000,
    whatsappMessage: "Hola, me interesa conocer sobre tratamientos homeopáticos veterinarios",
  },
  {
    id: "vacunacion",
    title: "Vacunas y desparasitación",
    description: "Protege a tu mascota con nuestros completos planes de vacunación y desparasitación a domicilio.",
    variant: "more",
    image: "/assets/IMG-20251110-WA0011.jpg",
    imageAlt: "Vacunación de un perro en el patio de su casa",
    whatsappMessage: "Hola, quisiera consultar por vacunación y desparasitación",
  },
  {
    id: "procedimientos",
    title: "Microchip y certificados",
    description:
      "Realizamos implantación de microchip, emitimos certificados de viaje y hacemos procedimientos de cuidado general.",
    variant: "more",
    image: "/assets/IMG-20251110-WA0014.jpg",
    imageAlt: "Procedimiento a un perro en el living de su familia",
    whatsappMessage: "Hola, quisiera consultar por procedimientos y microchip",
  },
  {
    id: "examenes",
    title: "Exámenes y test rápidos",
    description: "Toma de muestras y test rápidos en tu hogar para un diagnóstico preciso y oportuno.",
    variant: "more",
    image: "/assets/IMG-20251110-WA0019.jpg",
    imageAlt: "Examen de oído a un perro en su casa",
    whatsappMessage: "Hola, quisiera consultar por exámenes y diagnóstico",
  },
];
