import { useEffect, useState } from "react";

/**
 * Un único listener de scroll compartido para: la clase "scrolled" del
 * navbar y la visibilidad del botón "volver arriba" (umbral 300px, igual
 * que el script.js original).
 */
export function useScrollState() {
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;
      setScrolled(y > 100);
      setShowBackToTop(y > 300);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { scrolled, showBackToTop };
}
