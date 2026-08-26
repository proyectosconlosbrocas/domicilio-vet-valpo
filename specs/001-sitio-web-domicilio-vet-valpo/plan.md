# Implementation Plan: Sitio Web Domicilio Vet Valpo

**Branch**: `migrate-react-vite-tailwind-shadcn` | **Date**: 2026-08-26 (v2, migración) | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-sitio-web-domicilio-vet-valpo/spec.md`

**Note**: Este plan describe la implementación **ya existente** (as-built) después de la migración a React + Vite + Tailwind + shadcn/ui. La versión anterior (sitio 100% estático sin build) queda documentada en el historial de git y en `.specify/memory/constitution.md` (registro de excepción, v2.0.0).

## Summary

Sitio de una página (SPA por anclas, sin router), sin backend ni base de datos, cuyo único objetivo de conversión sigue siendo dirigir al usuario a WhatsApp. Construido con React 18 + TypeScript + Vite 6, Tailwind CSS + primitivos de shadcn/ui, y el CSS bespoke del sitio original portado casi intacto como `src/styles/legacy.css`.

## Technical Context

**Language/Version**: TypeScript (React 18, Vite 6), Python 3 (solo para el script auxiliar `instagram_fetcher.py`, no forma parte del build).

**Primary Dependencies**: React, Vite, Tailwind CSS 3 + `tailwindcss-animate`, shadcn/ui (componentes copiados a `src/components/ui/`, no npm package), `embla-carousel-react` + `embla-carousel-autoplay` (carrusel del hero), `lucide-react` (iconografía UI), `react-icons/fa` (glifos de marca WhatsApp/Instagram), `class-variance-authority` + `clsx` + `tailwind-merge` (utilidades de shadcn). `instaloader` (Python) solo para `instagram_fetcher.py`.

**Storage**: N/A — no hay base de datos ni backend. El formulario de contacto no persiste datos, solo los reformatea en una URL `wa.me` vía `src/lib/whatsapp.ts`.

**Testing**: `@playwright/test` — smoke test E2E en `e2e/smoke.spec.ts` (carga de página, los 10 hrefs de WhatsApp son correctos, el formulario compone el mensaje esperado, el menú móvil se cierra al hacer click). Playwright MCP disponible para verificación interactiva adicional.

**Target Platform**: Navegador web, mobile-first. **Producción: Vercel** (`vercel.json`, `npm run build` → `dist/`, framework `vite`, dominio `domicilio-vet-valpo.vercel.app`). Desarrollo/preview local vía Replit (`.replit`, `npm run dev`, puerto 5000, `--host 0.0.0.0` para que el proxy de Replit vea el server).

**Project Type**: Sitio web de marketing/informativo de una sola página (SPA sin rutas).

**Performance Goals**: Vite con code-splitting/tree-shaking nativo; imágenes bajo el pliegue con `loading="lazy"`; sin Bootstrap/AOS/Font Awesome completos cargados por CDN (se reemplazaron por dependencias específicas y más livianas).

**Constraints**: Sin backend/base de datos (Constitución, Principio I y III); sin React Router (no hay nada que rutear, todo es scroll a anclas `#id`); el CSS bespoke se conserva en `legacy.css` en vez de reescribirse a utilities de Tailwind sin necesidad funcional.

**Scale/Scope**: Sitio de un solo negocio local (una profesional, un número de WhatsApp), tráfico bajo/medio, sin necesidad de escalar horizontalmente.

## Constitution Check

*Ver [.specify/memory/constitution.md](../../.specify/memory/constitution.md) (v2.0.0)*

| Principio | Estado actual | Nota |
|---|---|---|
| I. Frontend con build, sin backend | ✅ Cumple | React+Vite+Tailwind+shadcn; sin backend/DB introducidos |
| II. Mobile-first responsive | ✅ Cumple | Utilities responsive de Tailwind + breakpoints heredados en `legacy.css` |
| III. WhatsApp como canal primario | ✅ Cumple | Los 10 enlaces se generan uniformemente vía `buildWhatsappLink()` (antes 2 de 10 tenían codificación UTF-8 inconsistente) |
| IV. SEO local y accesibilidad | ✅ Cumple | Meta tags/JSON-LD conservados en el `index.html` raíz (entry de Vite) |
| V. Identidad visual consistente | ✅ Cumple | Tokens de marca en `legacy.css` + variables HSL de shadcn mapeadas a la misma paleta |

## Project Structure

### Documentación (esta feature)

```text
specs/001-sitio-web-domicilio-vet-valpo/
├── spec.md     # Especificación funcional completa (secciones, objetivos, issues)
├── plan.md     # Este archivo
└── tasks.md    # Backlog de mejoras + fases completadas
```

### Código fuente (raíz del repositorio)

```text
domicilio-vet-valpo/
├── index.html                   # Entry mínimo de Vite (meta tags/JSON-LD conservados)
├── src/
│   ├── main.tsx / App.tsx
│   ├── index.css                # @import legacy.css + capas de Tailwind + variables shadcn
│   ├── styles/legacy.css        # CSS bespoke heredado del sitio estático (casi intacto)
│   ├── lib/{whatsapp,utils}.ts
│   ├── hooks/{use-in-view,use-scroll-state}.ts
│   ├── data/{services,operativos,hero-carousel}.ts
│   └── components/{ui/, Navbar, FloatingButtons, Hero, HeroCarousel, Services,
│       ServiceCard, Operativos, OperativoCard, About, InstagramFeed, Contact,
│       ContactForm, Footer}.tsx
├── public/                      # assets/, instagram_posts.json, robots.txt, sitemap.xml (servidos tal cual)
├── e2e/smoke.spec.ts
├── vite.config.ts / tailwind.config.ts / postcss.config.js / tsconfig*.json / playwright.config.ts / components.json
├── vercel.json                  # Build moderno (autodetect Vite), output dist/
├── .replit                      # Workflow → npm install && npm run dev
├── instagram_fetcher.py         # Sin cambios, standalone (no forma parte del build)
└── .specify/, specs/            # Documentación Spec-Driven Development (este mismo sistema)
```

**Structure Decision**: Estructura estándar de un proyecto Vite+React (`src/`, `public/`), adoptada a pedido explícito del dueño del negocio pese a que contradice el Principio I original (v1.0.0) de la Constitución — ver el registro de excepción en `constitution.md` v2.0.0. `public/` reemplaza la carpeta `assets/` de la raíz para que Vite la sirva tal cual sin reescribir cada referencia de imagen a un import ESM.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Introducir build step (Vite) + framework (React) + librería de estilos (Tailwind) + sistema de componentes (shadcn/ui) | Pedido explícito del dueño del negocio, confirmado tras advertirle la contradicción con el Principio I original | Mantener el sitio estático (recomendado por el agente) fue rechazado explícitamente por el usuario a favor de tooling moderno de componentes |
