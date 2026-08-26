# Implementation Plan: Sitio Web Domicilio Vet Valpo

**Branch**: `main` | **Date**: 2026-08-26 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-sitio-web-domicilio-vet-valpo/spec.md`

**Note**: Este plan describe la implementación **ya existente** (as-built), no una a construir. Sirve como referencia técnica para cualquier cambio futuro y como gate de la Constitución del proyecto.

## Summary

Sitio de una página (SPA por anclas), 100% estático, sin backend ni base de datos, cuyo único objetivo de conversión es dirigir al usuario a WhatsApp. Construido con HTML5/CSS3/JS vanilla + Bootstrap 5.3.3 vía CDN, sin paso de build.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES6, sin transpilar), Python 3 (solo para el script auxiliar `instagram_fetcher.py`, no forma parte del sitio servido).

**Primary Dependencies**: Bootstrap 5.3.3 (CSS + JS bundle), Bootstrap Icons 1.11.1, Font Awesome 4.7.0, AOS 2.3.1 — todas cargadas desde CDN (`cdn.jsdelivr.net`, `stackpath.bootstrapcdn.com`, `unpkg.com`), ninguna instalada vía npm. `instaloader` (Python) solo para `instagram_fetcher.py`.

**Storage**: N/A — no hay base de datos ni backend. El formulario de contacto no persiste datos, solo los reformatea en una URL `wa.me`.

**Testing**: No hay suite de tests automatizada. Verificación actual es manual/visual (abrir el sitio, probar el flujo de WhatsApp).

**Target Platform**: Navegador web, mobile-first. **Producción: Vercel** (`vercel.json`, estático, dominio `domicilio-vet-valpo.vercel.app` — confirmado 2026-08-26). Desarrollo/preview local vía Replit (`python -m http.server 5000` o `static-web-server`, ver `.replit`), que se conserva para ese uso.

**Project Type**: Sitio web de marketing/informativo de una sola página.

**Performance Goals**: Carga rápida sin build step; `preconnect` a los CDNs de Bootstrap para reducir latencia de DNS; imágenes bajo el pliegue con `loading="lazy"`.

**Constraints**: Cero dependencias de build (Constitución, Principio I); debe seguir siendo editable directamente en los 3 archivos fuente (`index.html`, `style.css`, `script.js`) sin herramientas adicionales.

**Scale/Scope**: Sitio de un solo negocio local (una profesional, un número de WhatsApp), tráfico bajo/medio, sin necesidad de escalar horizontalmente.

## Constitution Check

*Ver [.specify/memory/constitution.md](../../.specify/memory/constitution.md)*

| Principio | Estado actual | Nota |
|---|---|---|
| I. Sitio estático sin build | ✅ Cumple | 3 archivos fuente, sin bundler |
| II. Mobile-first responsive | ✅ Cumple | Breakpoints en `style.css`, navbar colapsable |
| III. WhatsApp como canal primario | ✅ Cumple | Issue #2 resuelto: un solo handler de formulario |
| IV. SEO local y accesibilidad | ✅ Cumple | Issues #3 y #4 resueltos: dominio unificado (`domicilio-vet-valpo.vercel.app`) y sitemap sincronizado |
| V. Identidad visual consistente | ✅ Cumple | Tokens en `:root` de `style.css`, íconos de marca `#FF3737` |

## Project Structure

### Documentación (esta feature)

```text
specs/001-sitio-web-domicilio-vet-valpo/
├── spec.md     # Especificación funcional completa (secciones, objetivos, issues)
├── plan.md     # Este archivo
└── tasks.md    # Backlog de mejoras derivado de los issues del spec
```

### Código fuente (raíz del repositorio)

```text
domicilio-vet-valpo/
├── index.html                  # Único documento HTML — todas las secciones (SPA por anclas)
├── style.css                   # Estilos + design tokens (CSS custom properties en :root)
├── script.js                   # Interacciones: AOS init, navbar scroll, back-to-top, formulario de contacto
├── robots.txt                  # Directivas de indexación + referencia a sitemap.xml
├── sitemap.xml                 # Sitemap SEO (desincronizado, ver Issue #4)
├── vercel.json                 # Config de build estático para Vercel (@vercel/static)
├── .replit / .replit.backup    # Config de workflow y puertos para Replit (dev/preview)
├── replit.md                   # Bitácora histórica del Replit Agent (desactualizada, ver Issue #6)
├── instagram_fetcher.py        # Script Python (instaloader) que descarga posts de Instagram a JSON — no conectado a la UI
├── instagram_posts.json        # Salida de instagram_fetcher.py — no consumida por script.js/index.html
├── assets/                     # Imágenes: hero, carrusel, servicios, operativos, íconos de marca (#FF3737), fotos WhatsApp sin optimizar
└── .specify/, specs/           # Documentación Spec-Driven Development (este mismo sistema)
```

**Structure Decision**: Se mantiene la estructura plana existente (sin `src/`, sin monorepo) porque el Principio I de la Constitución prohíbe introducir build tooling o reestructuraciones que compliquen la edición directa. La documentación Spec-Driven Development se agrega como capas nuevas (`.specify/`, `specs/`) sin tocar los archivos fuente del sitio.

## Complexity Tracking

*Sin violaciones que requieran justificación — no se introdujo ningún framework, backend ni build step nuevo.*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
