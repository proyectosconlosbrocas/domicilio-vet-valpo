# Domicilio Vet Valpo Constitution

## Core Principles

### I. Sitio Estático, Sin Build
El sitio es HTML5 + CSS3 + JavaScript vanilla puro, sin framework de componentes ni paso de build. Cualquier cambio debe seguir siendo editable abriendo directamente `index.html`, `style.css` y `script.js`. Las librerías externas (Bootstrap, AOS, Bootstrap Icons, Font Awesome) se cargan por CDN, nunca se agregan a un bundler. Justificación: minimiza el hosting, evita dependencias de compilación y permite que personas no técnicas mantengan el sitio.

### II. Mobile-First y Responsive
Todo componente nuevo debe probarse primero en viewport móvil (menú colapsable, carrusel con `object-fit`, tarjetas apilables). Los breakpoints existentes en `style.css` (sección `/* Responsive */`) son la referencia; no se agregan media queries redundantes cuando ya existe una regla aplicable.

### III. WhatsApp Como Canal de Conversión Primario (NON-NEGOTIABLE)
Cada llamado a la acción de negocio (agendar consulta, cirugía, tratamiento homeopático, operativos, formulario de contacto) DEBE resolver en un enlace `https://wa.me/56965222368` con mensaje pre-rellenado y contextual al servicio consultado. No se introduce backend de reservas, pagos ni CRM sin que el usuario lo pida explícitamente: el negocio opera hoy 100% vía WhatsApp.

### IV. SEO Local y Accesibilidad
Toda sección pública debe mantener: meta description/keywords, Open Graph, Twitter Card, geo tags y el bloque `application/ld+json` de tipo `VeterinaryClinic` sincronizados con el contenido real de la página. Los elementos interactivos requieren `aria-label` o texto accesible equivalente, y el contraste de color sigue la paleta ya validada en `:root` de `style.css`.

### V. Identidad Visual Consistente
El color de marca `#FF3737` (variable `--primary-color`) y el set de íconos veterinarios generados a medida (`assets/icon-*.png`) son la única fuente de iconografía de marca; no se mezclan con íconos de stock de otro estilo. Los tokens de diseño (color, sombra, radio de borde, transición, tipografía) viven como CSS custom properties en `:root` — no se hardcodean valores nuevos que dupliquen un token existente. Tipografía: `Plus Jakarta Sans` (`--font-heading`) para títulos/CTAs y `Inter` (`--font-body`) para texto de cuerpo, cargadas desde Google Fonts — no se usa system-font como sustituto salvo fallback. Los íconos de marca dentro de una tarjeta/badge circular (`.service-icon`, `.expertise-icon`, `.operativo-icon`) siguen el mismo patrón: fondo `--bg-lighter` en reposo, `--primary-color` con el ícono invertido a blanco en hover.

## Stack Tecnológico

- HTML5 semántico, un único `index.html` (Single Page Application por anclas `#id`).
- Bootstrap 5.3.3 (grid, navbar, carrusel, formularios) vía `cdn.jsdelivr.net`.
- Bootstrap Icons 1.11.1 y Font Awesome 4.7.0 (iconografía UI y redes sociales).
- AOS 2.3.1 (`Animate On Scroll`) para animaciones de entrada, configurado con `once: true`.
- `script.js` vanilla: sin dependencias de npm, sin transpilación.
- Hosting de desarrollo: Replit (`.replit`, `python -m http.server 5000` o `static-web-server`). Candidato de producción: Vercel (`vercel.json`, build estático `@vercel/static`).

## Desarrollo y Documentación

Todo cambio de alcance (nueva sección, nuevo servicio, nueva integración) se documenta primero en `specs/<NNN>-<slug>/spec.md` antes de tocar código, siguiendo el flujo Spec-Driven Development de [github/spec-kit](https://github.com/github/spec-kit): `constitution → specify → plan → tasks → implement`. La verdad operativa del sitio vive en `specs/001-sitio-web-domicilio-vet-valpo/`; `replit.md` es un log histórico de Replit Agent y puede quedar desactualizado — en caso de conflicto, `specs/` manda.

## Governance

Esta constitución prevalece sobre preferencias de estilo individuales. Cualquier excepción (por ejemplo, introducir un framework, un backend, o abandonar WhatsApp como canal primario) debe justificarse en la sección "Complexity Tracking" del `plan.md` correspondiente y ser aprobada explícitamente por el dueño del negocio antes de implementarse.

**Version**: 1.0.0 | **Ratified**: 2026-08-26 | **Last Amended**: 2026-08-26
