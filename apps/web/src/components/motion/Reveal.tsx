import type { ReactNode } from "react";
import { motion, type Variants } from "motion/react";

const EASE = [0.2, 0.7, 0.2, 1] as const;

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const group: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const viewport = { once: true, amount: 0.15 } as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "article" | "figure";
}

/**
 * Entrada al hacer scroll (sube + aparece, una sola vez). Con
 * prefers-reduced-motion, el MotionConfig de App lo reduce a un fundido sin
 * desplazamiento: el contenido nunca queda oculto.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={item}
      transition={{ delay }}
    >
      {children}
    </Tag>
  );
}

/** Contenedor que escalona la entrada de sus RevealItem (60–90 ms entre cada uno). */
export function RevealGroup({
  children,
  className,
  as = "div",
}: Omit<RevealProps, "delay" | "as"> & { as?: "div" | "ul" }) {
  const Tag = motion[as];
  return (
    <Tag className={className} initial="hidden" whileInView="visible" viewport={viewport} variants={group}>
      {children}
    </Tag>
  );
}

export function RevealItem({ children, className, as = "div" }: Omit<RevealProps, "delay">) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={item}>
      {children}
    </Tag>
  );
}
