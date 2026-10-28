import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

type Tone = "red" | "white" | "ink";

interface BrandPatternProps {
  tone?: Tone;
  /** Opacidad del patrón: es textura, no contenido. */
  opacity?: number;
  /** Recorrido del parallax en px (arriba/abajo) mientras la sección cruza la pantalla. */
  drift?: number;
  /** Desvanecido para que el patrón no compita con el texto. */
  fade?: "bottom" | "left" | "right" | "radial" | "none";
}

/**
 * Fondo de sección con la cruz de Domicilio Vet Valpo repetida en diagonal
 * (assets/brand-tile.png usado como máscara: se tiñe del color que se pida).
 * Se mueve con el scroll a otra velocidad que el contenido (parallax).
 */
export function BrandPattern({ tone = "red", opacity = 0.06, drift = 60, fade = "none" }: BrandPatternProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-drift, drift]);

  return (
    <div ref={ref} className={`backdrop backdrop-fade-${fade}`} aria-hidden="true">
      <motion.div className={`brand-pattern tone-${tone}`} style={{ y, opacity }} />
    </div>
  );
}

interface BrandMarkProps {
  tone?: Tone;
  opacity?: number;
  size?: string;
  /** Posición CSS de la marca dentro de la sección. */
  position: React.CSSProperties;
  /** Grados que gira mientras la sección cruza la pantalla. */
  rotate?: number;
}

/** La marca sola, grande y tenue, que gira y se desplaza con el scroll. */
export function BrandMark({ tone = "red", opacity = 0.07, size = "34rem", position, rotate = 24 }: BrandMarkProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const r = useTransform(scrollYProgress, [0, 1], [-rotate / 2, rotate / 2]);
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <div ref={ref} className="backdrop" aria-hidden="true">
      <motion.div
        className={`brand-mark tone-${tone}`}
        style={{ ...position, width: size, height: size, rotate: r, y, opacity }}
      />
    </div>
  );
}
