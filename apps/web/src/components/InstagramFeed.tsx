import { useEffect, useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { galleryPhotos } from "@/data/gallery";
import { useInView } from "@/hooks/use-in-view";

const INSTAGRAM_URL = "https://www.instagram.com/domicilio.vet.valpo/";
/** Por debajo de esto el feed se ve incompleto y se usan las fotos propias. */
const MIN_FEED_POSTS = 4;

interface InstagramPost {
  image_local_url?: string;
  url?: string;
  post_page_url?: string;
}

interface Tile {
  src: string;
  alt: string;
  href: string;
}

/**
 * Galería "En casa de nuestros pacientes". Intenta leer /instagram_posts.json
 * (generado por instagram_fetcher.py, tolerante a sus dos formatos). Las URLs
 * del CDN de Instagram son firmadas y caducan a los pocos días: si quedan
 * menos de MIN_FEED_POSTS imágenes que cargan, se muestran las fotos propias
 * de visitas (data/gallery.ts) en vez de dejar la sección vacía.
 */
export function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [failed, setFailed] = useState<Set<number>>(new Set());
  const head = useInView<HTMLDivElement>();
  const grid = useInView<HTMLDivElement>({ delay: 90 });

  useEffect(() => {
    let cancelled = false;
    fetch("/instagram_posts.json")
      .then((response) => (response.ok ? response.json() : []))
      .then((data: InstagramPost[]) => {
        if (!cancelled && Array.isArray(data)) setPosts(data);
      })
      .catch(() => {
        // sin conexión, archivo ausente o JSON inválido: quedan las fotos propias
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const feedTiles: (Tile & { index: number })[] = posts.flatMap((post, index) => {
    const src = post.image_local_url || post.url;
    if (!src || failed.has(index)) return [];
    return [{ index, src, alt: "Publicación de Domicilio Vet Valpo en Instagram", href: post.post_page_url || INSTAGRAM_URL }];
  });
  const useFeed = feedTiles.length >= MIN_FEED_POSTS;
  const tiles: (Tile & { index?: number })[] = useFeed
    ? feedTiles
    : galleryPhotos.map((photo) => ({ ...photo, href: INSTAGRAM_URL }));

  return (
    <section id="galeria" className="section">
      <div className="wrap">
        <div ref={head.ref} className={`section-head reveal ${head.isVisible ? "is-visible" : ""}`}>
          <h2 className="section-title">En casa de nuestros pacientes</h2>
          <p className="section-lead">
            Patios, livings y operativos en los cerros: así se ve una visita de Domicilio Vet Valpo.
          </p>
        </div>

        <div ref={grid.ref} className={`gallery reveal ${grid.isVisible ? "is-visible" : ""}`}>
          {tiles.map((tile) => (
            <a
              key={tile.src}
              className="gallery-item"
              href={tile.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${tile.alt} (abre Instagram)`}
            >
              <img
                src={tile.src}
                alt={tile.alt}
                loading="lazy"
                onError={
                  tile.index === undefined
                    ? undefined
                    : () => setFailed((prev) => new Set(prev).add(tile.index!))
                }
              />
            </a>
          ))}
        </div>

        <div className="gallery-footer">
          <p>Más visitas y avisos de operativos en Instagram.</p>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-quiet btn-sm">
            <FaInstagram aria-hidden="true" /> @domicilio.vet.valpo
          </a>
        </div>
      </div>
    </section>
  );
}
