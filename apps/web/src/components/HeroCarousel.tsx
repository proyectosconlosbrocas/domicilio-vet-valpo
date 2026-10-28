import { useCallback, useEffect, useState, type KeyboardEvent } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { heroCarouselImages } from "@/data/hero-carousel";

const prefersReducedMotion =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function HeroCarousel() {
  // Con movimiento reducido no hay autoplay: las fotos se pasan a mano.
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    prefersReducedMotion ? [] : [Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Flechas del teclado cuando el carrusel tiene foco (embla no lo trae de serie).
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollNext();
    }
  }

  const current = heroCarouselImages[selectedIndex];

  return (
    <div
      className="hero-carousel"
      ref={emblaRef}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Fotos de visitas a domicilio"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flex h-full">
        {heroCarouselImages.map((image, index) => (
          <div
            className="embla__slide"
            key={image.src}
            role="group"
            aria-roledescription="foto"
            aria-label={`${index + 1} de ${heroCarouselImages.length}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      <p className="hero-carousel-caption" aria-live="polite">
        {current?.caption}
      </p>

      <button type="button" className="hero-carousel-control prev" onClick={scrollPrev} aria-label="Foto anterior">
        <ChevronLeft size={22} />
      </button>
      <button type="button" className="hero-carousel-control next" onClick={scrollNext} aria-label="Foto siguiente">
        <ChevronRight size={22} />
      </button>

      <div className="hero-carousel-indicators">
        {heroCarouselImages.map((image, index) => (
          <button
            key={image.src}
            type="button"
            className={index === selectedIndex ? "active" : ""}
            aria-label={`Ver foto ${index + 1}`}
            aria-current={index === selectedIndex ? "true" : undefined}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
