export interface Service {
  id: string;
  title: string;
  description: string;
  /** 'photo': imagen real del servicio. 'icon-only': se muestra el ícono de marca centrado sobre gradiente. */
  variant: "photo" | "icon-only";
  image: string;
  imageAlt: string;
  icon: string;
  iconAlt: string;
  priceFrom?: number;
  whatsappMessage: string;
}

export const services: Service[] = [
  {
    id: "consulta",
    title: "Consulta Veterinaria",
    description:
      "Atención veterinaria completa en la comodidad de tu hogar. Agenda tu hora cualquier día previo contacto.",
    variant: "photo",
    image: "/assets/modificada.png",
    imageAlt: "Consulta veterinaria a domicilio",
    icon: "/assets/icon-estetoscopio.png",
    iconAlt: "Icono estetoscopio",
    priceFrom: 25000,
    whatsappMessage: "Hola, me interesa agendar una consulta veterinaria a domicilio",
  },
  {
    id: "cirugia",
    title: "Cirugía",
    description:
      "Realizamos procedimientos quirúrgicos, incluyendo esterilizaciones para caninos y felinos, con equipamiento especializado en tu domicilio.",
    variant: "photo",
    image: "/assets/hero-section.png",
    imageAlt: "Cirugía veterinaria a domicilio",
    icon: "/assets/icon-cruz-veterinaria.png",
    iconAlt: "Icono cruz veterinaria",
    priceFrom: 80000,
    whatsappMessage: "Hola, necesito información sobre cirugía veterinaria a domicilio",
  },
  {
    id: "homeopatia",
    title: "Tratamiento Homeopático",
    description: "Medicina natural y holística personalizada para el bienestar integral de tu mascota.",
    variant: "photo",
    image: "/assets/homeopatia1.png",
    imageAlt: "Tratamiento homeopático veterinario",
    icon: "/assets/icon-pata-corazon.png",
    iconAlt: "Icono pata con corazón",
    priceFrom: 30000,
    whatsappMessage: "Hola, me interesa conocer sobre tratamientos homeopáticos veterinarios",
  },
  {
    id: "vacunacion",
    title: "Vacunación y Prevención",
    description: "Protege a tu mascota con nuestros completos planes de vacunación y desparasitación a domicilio.",
    variant: "icon-only",
    image: "/assets/icon-jeringa.png",
    imageAlt: "Vacunación y Prevención",
    icon: "/assets/icon-jeringa.png",
    iconAlt: "Icono jeringa",
    whatsappMessage: "Hola, quisiera consultar por vacunación y desparasitación",
  },
  {
    id: "procedimientos",
    title: "Procedimientos y Microchip",
    description:
      "Realizamos implantación de microchip, emitimos certificados de viaje y hacemos procedimientos de cuidado general.",
    variant: "icon-only",
    image: "/assets/icon-mascotas.png",
    imageAlt: "Procedimientos y Microchip",
    icon: "/assets/icon-mascotas.png",
    iconAlt: "Icono mascotas",
    whatsappMessage: "Hola, quisiera consultar por procedimientos y microchip",
  },
  {
    id: "examenes",
    title: "Exámenes y Diagnóstico",
    description: "Toma de muestras y test rápidos en tu hogar para un diagnóstico preciso y oportuno.",
    variant: "icon-only",
    image: "/assets/icon-estetoscopio.png",
    imageAlt: "Exámenes y Diagnóstico",
    icon: "/assets/icon-estetoscopio.png",
    iconAlt: "Icono estetoscopio",
    whatsappMessage: "Hola, quisiera consultar por exámenes y diagnóstico",
  },
];
