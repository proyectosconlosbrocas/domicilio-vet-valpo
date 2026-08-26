---
description: "Backlog de mejoras del sitio Domicilio Vet Valpo, derivado de los issues detectados en spec.md"
---

# Tasks: Sitio Web Domicilio Vet Valpo

**Input**: [spec.md](spec.md) (sección "Issues conocidos / Deuda técnica detectada"), [plan.md](plan.md)

**Prerequisites**: Ninguno — el sitio ya está implementado; estas tareas son correcciones y decisiones pendientes, no un build inicial.

**Organización**: agrupadas por prioridad de negocio (P1 = afecta directamente la conversión por WhatsApp).

## Format: `[ID] [P?] [Issue] Description`

- **[P]**: puede hacerse en paralelo (archivos distintos, sin dependencias)
- **[Issue]**: referencia al issue numerado en `spec.md`

---

## Fase 1: Bugs que afectan la conversión (P1)

- [x] T001 [Issue #1] Eliminar el `<button id="backToTop">` duplicado en `index.html` (líneas 105 y 609) y dejar un único botón funcional. *(Resuelto 2026-08-26: se eliminó el botón de la línea 609 y su bloque CSS huérfano en `.visible`; queda un solo botón controlado por la clase `.show`.)*
- [x] T002 [Issue #2] Unificar el manejo del `submit` de `#contactForm` en `script.js`: elegir un solo flujo (idealmente el que abre `wa.me` con los datos reales) y eliminar el listener de `initContactForm()` que simula un envío exitoso ficticio, o fusionar ambos en un único handler con feedback visual real. *(Resuelto 2026-08-26: un único listener en `initContactForm()` arma el mensaje, abre WhatsApp y muestra el spinner/mensaje de éxito reales.)*

**Checkpoint**: El botón "volver arriba" y el formulario de contacto se comportan de forma predecible y sin duplicidad.

---

## Fase 2: Consistencia de SEO y dominio (P2) — ✅ Completada 2026-08-26

- [x] T003 [P] [Issue #3] Definir el dominio de producción canónico. *(Confirmado por el dueño del negocio: `domicilio-vet-valpo.vercel.app`, Vercel.)*
- [x] T004 [Issue #3] Actualizar `og:url`, `twitter:url`, `og:image`, `twitter:image` en `index.html` y la URL del `schema.org/VeterinaryClinic` para que usen ese dominio consistentemente.
- [x] T005 [P] [Issue #3] Corregir el dominio en `sitemap.xml` y `robots.txt` para que apunten a `domicilio-vet-valpo.vercel.app`.
- [x] T006 [Issue #4] Reescribir `sitemap.xml` para reflejar las anclas reales del sitio (`#servicios`, `#operativos`, `#sobre-mi`, `#contacto`) y quitar `#precios`/`#galeria`, que no existían.

**Checkpoint**: ✅ Un solo dominio aparece en todos los archivos SEO (`index.html`, `robots.txt`, `sitemap.xml`), y el sitemap coincide con las secciones reales.

---

## Fase 3: Feed de Instagram (P3) — ✅ Implementado 2026-08-26, con seguimiento pendiente

- [x] T007 [Issue #5] Decisión del dueño del negocio: **(a) conectar el feed dinámico**.
- [x] T008 [Issue #5] Implementado `initInstagramFeed()` en `script.js` + `#instagramGrid` en `index.html`: hace fetch de `instagram_posts.json`, renderiza miniaturas, y degrada silenciosamente al botón "Síguenos en Instagram" si el JSON falta, está vacío, o ninguna imagen carga.
- [ ] T008b **[NUEVO, Issue #5]** El `instagram_posts.json` versionado hoy trae URLs de CDN de Instagram ya expiradas (parámetro `oe=` de firma temporal) — el grid no mostrará imágenes reales hasta que alguien con acceso a la cuenta de Instagram ejecute `instaloader --login=<cuenta>` y luego `python instagram_fetcher.py` para regenerar el JSON con imágenes descargadas localmente (`image_local_url`, que ya soporta el renderer).

**Checkpoint**: `#instagram-feed` tiene código listo para mostrar contenido dinámico real; falta una corrida válida de `instagram_fetcher.py` con sesión de Instagram para que se vea contenido (T008b).

---

## Fase 4: Documentación (P3) — ✅ Completada 2026-08-26

- [x] T009 [Issue #6] `replit.md` actualizado: se quitaron las referencias a "Statistics Section" y "Testimonials Section" (ya eliminadas, ver commits `bccc2d3` y `ee62419`), se corrigió la lista de secciones, features y deployment, y se agregó una entrada de changelog resumiendo los cambios de esta sesión.

**Checkpoint**: ✅ No hay documentación contradictoria sobre qué secciones existen hoy en el sitio.

---

## Fase 5: Despliegue (P3) — ✅ Aclarado 2026-08-26

- [x] T010 [Issue #7] Confirmado: **Vercel es la plataforma de producción**. Se decidió conservar `.replit`/`.replit.backup` porque siguen siendo útiles para levantar el sitio en local/preview; no se eliminó ninguna configuración.

---

## Dependencias

- T004 depende de T003 (necesita el dominio ya decidido).
- T005 depende de T003.
- T008 depende de T007 (solo si se elige la opción (a)).
- El resto de las tareas es independiente y puede abordarse en paralelo.

## Fase 6: Modernización visual (P2) — ✅ Completada 2026-08-26

- [x] T011 Tipografía real: se agregó Google Fonts (`Plus Jakarta Sans` para títulos/CTAs, `Inter` para cuerpo) — antes `font-family: 'Inter'` nunca cargaba una fuente real por falta de `<link>`, y el sitio caía a la fuente del sistema.
- [x] T012 Bug real corregido: `.contact-form .form-control` en `style.css` apuntaba a una clase (`contact-form`) que no existe en el HTML (el wrapper es `.contact-form-wrapper`) — los inputs del formulario nunca recibían el estilo pensado para ellos. Corregido el selector.
- [x] T013 Limpieza de CSS muerto: eliminada la sección `.stats-section`/`.stat-*` (la sección de Estadísticas ya no existe en el HTML desde el commit `bccc2d3`) y una llave `}` huérfana que quedó de una refactor anterior en los estilos del carrusel.
- [x] T014 Accesibilidad del carrusel del hero: no tenía controles ni indicadores — giraba solo cada 2s sin forma de pausarlo (problema real para usuarios con trastornos vestibulares). Se agregaron flechas prev/next e indicadores, se bajó la velocidad a 4s y se activó `data-bs-pause="hover"`.
- [x] T015 Inconsistencia de diseño en las cards de servicio: 3 de 6 ("Vacunación", "Procedimientos y Microchip", "Exámenes") reutilizaban un ícono chico estirado a tamaño de foto. Se les dio un tratamiento propio (`.icon-only`: ícono centrado sobre fondo degradado) en vez de forzarlas a verse como las 3 cards con foto real.
- [x] T016 Navbar con `backdrop-filter` (efecto vidrio), footer rediseñado de rojo sólido a un neutro oscuro con acentos de marca (más premium, menos "plantilla"), sombras "glow" de marca en botones primarios/WhatsApp en vez de sombras negras planas, pulso sutil en el botón flotante de WhatsApp (CTA de conversión principal).
- [x] T017 Consistencia: íconos de "Sobre Mí" y "Operativos" ahora usan el mismo patrón de badge circular que los íconos de Servicios (antes solo estos últimos lo tenían).

**Checkpoint**: Rediseño visual aplicado sin cambiar la estructura de secciones ni el contenido de negocio; dos bugs reales (`.contact-form`, llave huérfana) y un problema de accesibilidad (carrusel sin controles) corregidos de paso.

## Fase 7: Migración a React + Vite + Tailwind + shadcn/ui (P1) — 2026-08-26

Pedido explícito del dueño del negocio, confirmado tras advertirle que contradice el Principio I original de la Constitución (v1.0.0, "Sitio Estático, Sin Build"). Ver `.specify/memory/constitution.md` v2.0.0 (Principio I reescrito + registro de excepción) y `plan.md` (Technical Context/Project Structure actualizados). Plan completo ejecutado: `C:\Users\Usuario\.claude\plans\melodic-purring-fox.md`.

- [x] T018 Scaffold Vite + React + TypeScript (`package.json`, `vite.config.ts`, `tsconfig*.json`, `tailwind.config.ts`, `postcss.config.js`, `components.json`).
- [x] T019 `assets/`, `instagram_posts.json`, `robots.txt`, `sitemap.xml` movidos a `public/` (`git mv`, historia preservada). Nuevo `index.html` mínimo de Vite con todos los meta tags/JSON-LD conservados.
- [x] T020 CSS híbrido: `style.css` portado a `src/styles/legacy.css` (+ base `.btn`/`.btn-lg` agregada porque Bootstrap ya no está para proveerla) e importado en `src/index.css` junto a las capas de Tailwind y las variables de tema de shadcn/ui mapeadas a la paleta de marca.
- [x] T021 Primitivos de shadcn/ui escritos a mano en `src/components/ui/` (`button`, `input`, `textarea`, `label`, `card`) — sin correr el wizard interactivo `shadcn init` (no viable en shell no interactiva).
- [x] T022 `HeroCarousel.tsx` con `embla-carousel-react` + `embla-carousel-autoplay` (reemplaza el carrusel imperativo de Bootstrap), controles prev/next e indicadores hechos a mano.
- [x] T023 Componentes de página: `Navbar`, `FloatingButtons` (un solo botón `backToTop` — el bug de id duplicado del sitio estático deja de ser posible por construcción), `Hero`, `Services`/`ServiceCard` (data-driven, variant `photo`/`icon-only`), `Operativos`/`OperativoCard`, `About`, `InstagramFeed` (mismo fetch + fallback silencioso), `Contact`/`ContactForm` (un solo handler de submit — el bug de doble listener también deja de ser posible por construcción), `Footer`.
- [x] T024 `src/lib/whatsapp.ts`: única fuente de verdad para las 10 URLs de WhatsApp del sitio (`buildWhatsappLink`/`buildWhatsappMessage`) — se detectó que 2 de las 10 originales tenían codificación UTF-8 mixta (no percent-encoded); ahora las 10 se generan uniformemente.
- [x] T025 `useInView` (IntersectionObserver nativo) reemplaza AOS; `useScrollState` centraliza el listener de scroll (navbar `scrolled` + `back-to-top`).
- [x] T026 Se retiraron por completo Bootstrap 5 (CSS+JS), Bootstrap Icons, Font Awesome 4.7.0 (CDN) y AOS. Layout reconstruido con utilities de Tailwind sección por sección.
- [x] T027 `vercel.json` actualizado a build moderno (`npm run build` → `dist/`, framework `vite`, sin el config legacy `builds`/`@vercel/static`). `.replit` actualizado (`npm install && npm run dev`, con `--host 0.0.0.0 --port 5000`).
- [x] T028 `e2e/smoke.spec.ts` (Playwright): carga de página, los 10 hrefs de WhatsApp correctos, el formulario compone el mensaje esperado y abre WhatsApp, el menú móvil se cierra al hacer click.
- [x] T029 `npm run build` limpio (0 errores TS). Verificado visualmente (desktop 1400px + mobile 390px, con Playwright vía script directo — el MCP recién instalado necesita reinicio de sesión para conectarse, ver T033) contra las capturas tomadas antes de la migración: hero, servicios (foto + icon-only), operativos, sobre mí, instagram (fallback silencioso), contacto y footer — visualmente equivalentes.
- [x] T030 `npx playwright test` — 4/4 tests pasando. En el primer intento fallaron 2: (a) el test asumía que los 12 enlaces `wa.me` llevan mensaje, sin contar que "Agendar Consulta" (Sobre Mí) y el link de la ficha de contacto son bare a propósito, igual que en el sitio original — de paso se detectó que el porteo le había agregado sin querer un mensaje a "Agendar Consulta" que el original no tenía, revertido; (b) el test verificaba el mensaje de éxito del formulario después de varias aserciones, arriesgando la carrera contra el auto-ocultado a los 5s — reordenado.
- [x] T031 Commit local de la migración en la rama `migrate-react-vite-tailwind-shadcn`. Push, PR y deploy a Vercel quedan pendientes — requieren autorización OAuth de los MCPs de GitHub/Vercel (ver Fase 8) y una decisión explícita del dueño del negocio antes de tocar producción.

**Checkpoint**: sitio migrado a React+Vite+Tailwind+shadcn/ui manteniendo el 100% del contenido, la estructura de secciones y el diseño visual ya afinado; de paso, 2 clases de bug del sitio estático (id duplicado, doble submit listener) quedan estructuralmente imposibles de reintroducir.

## Fase 8: MCPs de proyecto (P2) — 2026-08-26

- [x] T032 Instalados a nivel proyecto (`.mcp.json`, commiteado): Playwright, GitHub, Context7, Chrome DevTools, Vercel.
- [ ] T033 **Pendiente, requiere al usuario**: autorizar por OAuth los MCPs de GitHub y Vercel (sesión no interactiva, no se puede completar el flujo de navegador desde acá) — necesario antes de poder crear PRs o gestionar deploys desde Claude Code.

## Fase 9: UX/UI — segunda pasada (P2) — 2026-08-26

Pedido del dueño del negocio: otra vuelta de diseño visual + revisión de usabilidad/accesibilidad + nuevas funcionalidades UX (no feedback puntual).

- [x] T034 Accesibilidad: skip-link real (`.skip-to-main` ya existía en CSS pero nadie lo renderizaba — quedó cableado a `<main id="main-content">`), con fondo oscuro dedicado en vez del rojo del navbar para que se note al recibir foco.
- [x] T035 Accesibilidad: carrusel del hero navegable con flechas de teclado (←/→) y anuncio `aria-live` del slide actual para lectores de pantalla (`role="region"`, `aria-roledescription="carrusel"`).
- [x] T036 Accesibilidad: botón del menú móvil con `aria-controls` apuntando a la lista, label en español más descriptivo.
- [x] T037 Nueva funcionalidad UX: scroll-spy (`useActiveSection`) — el link activo del navbar se resalta (negrita + subrayado) según la sección visible, sin agregar un listener de scroll adicional (reusa IntersectionObserver).
- [x] T038 Nueva funcionalidad UX: barra de conversión fija en mobile (`MobileCtaBar`) — reemplaza al botón flotante redondo de WhatsApp en viewports chicos (un CTA de ancho completo convierte mejor que un círculo de 50px en la esquina), aparece tras el mismo umbral de scroll que "volver arriba". Bug real detectado y corregido en el proceso: el `padding-bottom` que le da aire al footer para que la barra no tape los íconos de redes estaba declarado *antes* que la regla base `.footer` en el CSS, así que el shorthand `padding: 2.5rem 0` lo pisaba — reubicado después.
- [x] T039 Rediseño visual: hero alineado a la izquierda en desktop (`≥992px`) en vez de centrado — más editorial y legible; se mantiene centrado en mobile donde el bloque de texto es angosto.
- [x] T040 Rediseño visual: los botones CTA (`.btn-primary`, `.btn-outline-primary`, `.btn-whatsapp`, `.btn-service`, `.operativo-cta`) pasan de radio "pill" (999px) a un radio estructurado de 12px (`--button-radius`) — menos "plantilla SaaS genérica". Los badges/tags (`.hero-eyebrow`, `.about-badge`, `.operativo-badge`) mantienen la forma pill, que sí les corresponde.
- [x] T041 `npm run build` limpio + `npx playwright test` 4/4 (se actualizó un test cuyo selector apuntaba al `aria-label` en inglés del botón de menú, cambiado a español en T036) + verificación visual desktop/mobile con Playwright.

**Checkpoint**: cambios de UX/UI aplicados con justificación funcional en cada uno (no solo estética), sin regresiones — verificado con build + suite E2E + inspección visual.

## Fase 10: Fase 1 (MVP) — mitad web del sistema clínico (P1) — 2026-08-26

- [x] T042 `apps/web` gana React Router: `/` (landing pública sin cambios), `/portal` (login por magic link + dashboard del cliente), `/completar-perfil` (alta de cliente + primera mascota, autenticado). Code-splitting por ruta (`React.lazy`) — el portal no infla el bundle de la landing pública.
- [x] T043 `PortalLoginForm`: pide el email, llama `signInWithOtp` con `emailRedirectTo` a `/completar-perfil`.
- [x] T044 `CompletarPerfilPage`: inserta `clientes` (`auth_user_id = auth.uid()`) + primera `mascotas`, con checkbox real de consentimiento de datos (`consentimiento_datos_aceptado`/`consentimiento_fecha`, agregados en el esquema). Self-healing: si el cliente ya existe (choque de unique en `auth_user_id`, o vuelve a este link por error), redirige directo a `/portal`.
- [x] T045 `PortalPage`: ficha de cada mascota con historial de visitas/vacunas/desparasitaciones **solo lectura** (`MascotaHistoryCard`, expandible), edición de datos de contacto propios (`ContactEditForm`), alta de mascotas nuevas (`NewMascotaForm`) — nunca edita `mascotas` directamente ni sube `foto_url` (según el diseño de RLS: el cliente no tiene `UPDATE` en `mascotas`).
- [x] T046 Link "Portal de Clientes" agregado al Navbar de la landing (desktop + menú mobile).
- [x] T047 Verificación end-to-end real: se generó un magic link real vía Admin API (`scripts/generate-test-magiclink.mjs`) sin depender de recibir un email, se inyectó la sesión en el navegador vía `supabase.auth.setSession()` (expuesto en `window.__supabase` solo en modo dev — nunca en el build de producción) y se probó por UI con Playwright el flujo completo: magic link → completar perfil → dashboard con la mascota creada → expandir historial (vacío, sin errores) → editar contacto propio → persiste tras reload. 6/6 pasos sin errores. Datos de prueba limpiados al final (`scripts/cleanup-test-cliente.mjs`).
- [x] T048 Suite existente de e2e de la landing (`smoke.spec.ts`) sigue 4/4 verde tras agregar el router — sin regresión.

**Hallazgo real durante la verificación, requiere acción manual tuya**: al probar `signInWithOtp` con `emailRedirectTo: '.../completar-perfil'`, Supabase **ignoró silenciosamente esa URL** y redirigió a `http://localhost:3000` (un default de proyecto nuevo, no configurado) — porque las Redirect URLs no están todavía en la lista blanca del proyecto. Para que el magic link real funcione en producción y en local:

1. Dashboard → **Authentication → URL Configuration**.
2. **Site URL**: `https://domicilio-vet-valpo.vercel.app`.
3. **Redirect URLs**, agregar:
   - `http://localhost:5000/completar-perfil` (dev)
   - `https://domicilio-vet-valpo.vercel.app/completar-perfil` (producción)
4. Recomendado también antes de exponer el formulario público de verdad: configurar **SMTP propio** (Resend/Postmark) en Authentication → Emails — el proveedor de email built-in de Supabase tiene un límite de pocos envíos por hora que un formulario público real supera rápido.

No pude hacer esto por API — la configuración de URLs de Auth se administra desde el dashboard (o la Management API, que necesita un token distinto al de este proyecto).

**Checkpoint**: MVP completo de las dos mitades (Fase 1 mobile en la Fase 7-9, Fase 1 web acá) verificado de punta a punta contra la base de datos real, con datos de prueba limpiados. Falta el paso manual de Auth URL Configuration arriba antes de que el magic link funcione para clientes reales.

## Notes

- Fases 1-6 (issues del sitio estático original) se resolvieron editando directamente HTML/CSS/JS sin build, en línea con el Principio I **original** de la Constitución (v1.0.0). La Fase 7 reemplaza esa arquitectura — ver el registro de excepción en `constitution.md` v2.0.0.
- Al completar una tarea, marcar su checkbox y actualizar la sección "Issues conocidos" de [spec.md](spec.md) para que ambos documentos queden sincronizados.
