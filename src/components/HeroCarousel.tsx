import { useCallback, useEffect, useState } from "react";
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

  return (
    <div className="hero-carousel" ref={emblaRef}>
      <div className="flex h-full">
        {heroCarouselImages.map((image) => (
          <div className="embla__slide" key={image.src}>
            <img src={image.src} alt={image.alt} loading="lazy" />
          </div>
        ))}
      </div>

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
