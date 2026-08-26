import { useCallback, useEffect, useState, type KeyboardEvent } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { heroCarouselImages } from "@/data/hero-carousel";

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);
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

  // Flechas del teclado cuando el carrusel tiene foco (mismo patrón que
  // Bootstrap/embla no dan gratis: hay que cablearlo a mano).
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollNext();
    }
  }

  const currentAlt = heroCarouselImages[selectedIndex]?.alt ?? "";

  return (
    <div
      className="hero-carousel"
      ref={emblaRef}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Fotos de Domicilio Vet Valpo"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flex h-full">
        {heroCarouselImages.map((image) => (
          <div className="embla__slide" key={image.src}>
            <img src={image.src} alt={image.alt} loading="lazy" />
          </div>
        ))}
      </div>

      {/* Anuncio para lectores de pantalla del slide actual, sin duplicar
          visualmente el alt de cada <img> (ya visible/leído por su cuenta). */}
      <span className="sr-only" aria-live="polite">
        {`Foto ${selectedIndex + 1} de ${heroCarouselImages.length}: ${currentAlt}`}
      </span>

      <button
        type="button"
        className="hero-carousel-control prev"
        onClick={scrollPrev}
        aria-label="Foto anterior"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        className="hero-carousel-control next"
        onClick={scrollNext}
        aria-label="Foto siguiente"
      >
        <ChevronRight size={20} />
      </button>

      <div className="hero-carousel-indicators">
        {heroCarouselImages.map((image, index) => (
          <button
            key={image.src}
            type="button"
            className={index === selectedIndex ? "active" : ""}
            aria-label={`Foto ${index + 1}`}
            aria-current={index === selectedIndex}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
