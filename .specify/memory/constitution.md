# Domicilio Vet Valpo Constitution

## Core Principles

### I. Frontend con Build, Sin Backend
El sitio es una SPA de una sola página construida con **React + TypeScript + Vite**, con **Tailwind CSS** y primitivos de **shadcn/ui** para UI nueva. Sigue sin haber backend, base de datos, ni rutas de servidor — es contenido de marketing estático compilado a `dist/` y servido como archivos estáticos (Vercel). Cualquier lógica bespoke ya afinada (gradientes, animaciones, hover states) vive en `src/styles/legacy.css`, importado una sola vez en `src/index.css`, en vez de reescribirse a utilities de Tailwind sin necesidad funcional real. Justificación del cambio (v1→v2): se adoptó tooling moderno de componentes/estilos a pedido explícito, priorizando DX y mantenibilidad de un component tree sobre la simplicidad de "abrir y editar un HTML" — ver Governance para el registro de esta excepción.

### II. Mobile-First y Responsive
Todo componente nuevo debe probarse primero en viewport móvil (menú colapsable, carrusel con `object-fit`, tarjetas apilables). El layout usa utilities responsive de Tailwind (`sm:`/`md:`/`lg:`); los breakpoints bespoke que siguen en `legacy.css` (`@media max-width: 992px/768px/576px`) son la referencia para ese código heredado — no se agregan reglas redundantes cuando ya existe una aplicable en cualquiera de los dos sistemas.

### III. WhatsApp Como Canal de Conversión Primario (NON-NEGOTIABLE)
Cada llamado a la acción de negocio (agendar consulta, cirugía, tratamiento homeopático, operativos, formulario de contacto) DEBE resolver en un enlace `https://wa.me/56965222368` con mensaje pre-rellenado y contextual al servicio consultado, generado uniformemente por `buildWhatsappLink()`/`buildWhatsappMessage()` en `src/lib/whatsapp.ts` — no se hardcodean URLs `wa.me` sueltas en componentes. No se introduce backend de reservas, pagos ni CRM sin que el usuario lo pida explícitamente: el negocio opera hoy 100% vía WhatsApp.

### IV. SEO Local y Accesibilidad
Toda sección pública debe mantener: meta description/keywords, Open Graph, Twitter Card, geo tags y el bloque `application/ld+json` de tipo `VeterinaryClinic` sincronizados con el contenido real de la página. Como es una sola página sin rutas, estos metadatos viven estáticos en el `index.html` raíz (entry de Vite) — no se introduce react-helmet ni gestión dinámica de `<head>` sin una razón real (múltiples rutas/páginas). Los elementos interactivos requieren `aria-label` o texto accesible equivalente.

### V. Identidad Visual Consistente
El color de marca `#FF3737` y el set de íconos veterinarios generados a medida (`public/assets/icon-*.png`) son la única fuente de iconografía de marca; no se mezclan con íconos de stock de otro estilo para elementos de marca (sí se usa `lucide-react`/`react-icons` para iconografía de UI genérica: flechas, check, mapa, reloj). Los tokens de diseño (color, sombra, radio de borde, transición, tipografía) viven como CSS custom properties en `:root` de `legacy.css` — no se hardcodean valores nuevos que dupliquen un token existente. Los primitivos de shadcn/ui (`Button`, `Input`, etc.) se re-temáticos vía las variables HSL de `src/index.css` (`--primary`, `--radius`, etc.), mapeadas a esos mismos tokens de marca, no a la paleta neutra por defecto de shadcn. Tipografía: `Plus Jakarta Sans` para títulos/CTAs y `Inter` para texto de cuerpo, cargadas desde Google Fonts.

## Stack Tecnológico

- **React 18 + TypeScript + Vite 6**, sin React Router (una sola página, navegación por anclas `#id`).
- **Tailwind CSS 3** + `tailwindcss-animate`, para layout nuevo y primitivos de shadcn/ui.
- **shadcn/ui** (`Button`, `Input`, `Textarea`, `Label`, `Card`) — componentes copiados a `src/components/ui/`, no una dependencia npm.
- **embla-carousel-react** + `embla-carousel-autoplay` para el carrusel del hero (reemplaza el carrusel imperativo de Bootstrap).
- **lucide-react** (iconografía UI genérica) + **react-icons/fa** (solo `FaWhatsapp`/`FaInstagram`, glifos de marca).
- `src/styles/legacy.css`: CSS bespoke heredado del sitio estático (gradientes, keyframes, pseudo-elementos, patrón ícono-en-badge), importado en `src/index.css` antes de las utilities de Tailwind.
- Un hook propio `useInView` (IntersectionObserver nativo) reemplaza a AOS; `useScrollState` centraliza el listener de scroll (navbar + back-to-top).
- Testing: `@playwright/test` para un smoke test E2E (`e2e/smoke.spec.ts`) — carga de página, hrefs de WhatsApp, envío del formulario, menú móvil.
- Hosting de desarrollo: Replit (`.replit`, `npm run dev`, puerto 5000, `--host 0.0.0.0`). Producción: **Vercel** (`vercel.json`, `npm run build` → `dist/`, framework `vite`), dominio `domicilio-vet-valpo.vercel.app`.
- MCPs de proyecto (`.mcp.json`): Playwright, GitHub, Context7, Chrome DevTools, Vercel.

## Desarrollo y Documentación

Todo cambio de alcance (nueva sección, nuevo servicio, nueva integración) se documenta primero en `specs/<NNN>-<slug>/spec.md` antes de tocar código, siguiendo el flujo Spec-Driven Development de [github/spec-kit](https://github.com/github/spec-kit): `constitution → specify → plan → tasks → implement`. La verdad operativa del sitio vive en `specs/001-sitio-web-domicilio-vet-valpo/`; `replit.md` es un log histórico de Replit Agent y puede quedar desactualizado — en caso de conflicto, `specs/` manda.

## Governance

Esta constitución prevalece sobre preferencias de estilo individuales. Cualquier excepción debe justificarse en la sección "Complexity Tracking" del `plan.md` correspondiente y ser aprobada explícitamente por el dueño del negocio antes de implementarse.

**Registro de excepción (v2.0.0)**: el Principio I original ("Sitio Estático, Sin Build") fue reemplazado a pedido explícito del dueño del negocio el 2026-08-26, confirmado luego de advertirle la contradicción con la versión 1.0.0 de esta constitución. No hubo cambio de producto — WhatsApp sigue siendo el único canal de conversión (Principio III intacto) y no se introdujo backend/base de datos.

**Version**: 2.0.0 | **Ratified**: 2026-08-26 | **Last Amended**: 2026-08-26
