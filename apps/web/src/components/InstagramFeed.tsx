import { useEffect, useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { useInView } from "@/hooks/use-in-view";

interface InstagramPost {
  image_local_url?: string;
  url?: string;
  post_page_url?: string;
}

/**
 * Lee /instagram_posts.json (generado por instagram_fetcher.py) y renderiza
 * un grid de miniaturas. Tolerante a ambos formatos que ese script puede
 * producir (image_local_url + post_page_url, o solo url) y a que el archivo
 * no exista o esté vacío. Las URLs directas del CDN de Instagram son
 * firmadas y caducan a los pocos días: si una imagen falla se descarta solo
 * esa, y si fallan todas el grid queda vacío (oculto) y solo se ve el botón
 * "Síguenos en Instagram".
 */
export function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [failed, setFailed] = useState<Set<number>>(new Set());
  const heading = useInView<HTMLDivElement>();
  const grid = useInView<HTMLDivElement>({ delay: 100 });

  useEffect(() => {
    let cancelled = false;
    fetch("/instagram_posts.json")
      .then((response) => (response.ok ? response.json() : []))
      .then((data: InstagramPost[]) => {
        if (!cancelled && Array.isArray(data)) setPosts(data);
      })
      .catch(() => {
        // sin conexión, archivo ausente o JSON inválido: el grid queda vacío
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visiblePosts = posts.filter((_, index) => !failed.has(index));

  return (
    <section id="instagram-feed" className="instagram-section py-16">
      <div className="container mx-auto px-4">
        <div ref={heading.ref} className={`text-center reveal ${heading.isVisible ? "is-visible" : ""}`}>
          <h2 className="section-title mb-3">Síguenos en Instagram</h2>
        </div>

        {visiblePosts.length > 0 && (
          <div ref={grid.ref} className={`instagram-grid mb-4 reveal ${grid.isVisible ? "is-visible" : ""}`}>
            {posts.map((post, index) => {
              if (failed.has(index)) return null;
              const imageUrl = post.image_local_url || post.url;
              if (!imageUrl) return null;
              return (
                <a
                  key={index}
                  className="instagram-grid-item"
                  href={post.post_page_url || "https://www.instagram.com/domicilio.vet.valpo/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ver publicación en Instagram"
                >
                  <img
                    src={imageUrl}
                    alt="Publicación de Domicilio Vet Valpo en Instagram"
                    loading="lazy"
                    onError={() => setFailed((prev) => new Set(prev).add(index))}
                  />
                </a>
              );
            })}
          </div>
        )}

        <div className="text-center">
          <a
            href="https://www.instagram.com/domicilio.vet.valpo/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-lg"
          >
            <FaInstagram /> @domicilio.vet.valpo
          </a>
        </div>
      </div>
    </section>
  );
}
