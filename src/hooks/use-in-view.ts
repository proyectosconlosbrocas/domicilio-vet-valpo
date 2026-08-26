import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** ms de retraso antes de revelar, para el efecto cascada que tenía AOS (data-aos-delay). */
  delay?: number;
  once?: boolean;
  threshold?: number;
}

/**
 * Reemplazo liviano de AOS (Animate On Scroll) con IntersectionObserver
 * nativo — sin dependencia nueva. Devuelve un ref para el elemento y un
 * booleano `isVisible` que se vuelve true cuando entra en viewport.
 * Respeta `prefers-reduced-motion` a través de la clase `.reveal` en
 * legacy.css (la transición se anula globalmente ahí, no acá).
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  delay = 0,
  once = true,
  threshold = 0.15,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = window.setTimeout(() => setIsVisible(true), delay);
          if (once) observer.disconnect();
          return () => window.clearTimeout(timer);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay, once, threshold]);

  return { ref, isVisible };
}
