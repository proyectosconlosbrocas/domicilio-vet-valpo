import { motion } from "motion/react";

const ITEMS = [
  "Consultas a domicilio",
  "Cirugías y esterilizaciones",
  "Vacunas y desparasitación",
  "Homeopatía veterinaria",
  "Microchip y certificados",
  "Operativos en tu barrio",
];

/**
 * Franja con los servicios separados por la marca, en movimiento continuo.
 * Es decorativa (los servicios están en su sección), así que va aria-hidden.
 * El contenido se duplica para que el loop no tenga salto: se desplaza
 * exactamente la mitad de su ancho.
 */
export function BrandStrip() {
  const row = ITEMS.flatMap((text) => [
    <span key={text} className="strip-text">
      {text}
    </span>,
    <span key={`${text}-mark`} className="strip-mark" />,
  ]);

  return (
    <div className="brand-strip" aria-hidden="true">
      <motion.div
        className="strip-track"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 38, ease: "linear", repeat: Infinity }}
      >
        {row}
        {row.map((node, i) => (
          <span key={`dup-${i}`} className="contents">
            {node}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
