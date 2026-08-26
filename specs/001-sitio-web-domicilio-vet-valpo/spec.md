# Feature Specification: Sitio Web Domicilio Vet Valpo

**Feature Branch**: `001-sitio-web-domicilio-vet-valpo`

**Created**: 2026-08-26

**Status**: Documentado (as-built). Este documento describe **objetivos, secciones, requisitos y user stories** del sitio, que no cambiaron con la migración de stack del 2026-08-26 (de HTML/CSS/JS estático a React + Vite + Tailwind + shadcn/ui). Para la implementación técnica vigente ver [plan.md](plan.md) y `.specify/memory/constitution.md` (v2.0.0).

**Input**: "Organiza y documenta con spec-kit todo el proyecto: cada menú, cada sección de la página, los objetivos de la página, etc."

## Objetivos del sitio *(mandatory)*

`Domicilio Vet Valpo` es el sitio de una sola página (SPA por anclas) de la Dra. Claudia Cárcamo, médico veterinario que atiende a domicilio en Valparaíso y Viña del Mar. Objetivos de negocio, en orden de prioridad:

1. **Generar contacto por WhatsApp** para agendar consultas, cirugías y tratamientos — es la única vía de conversión del sitio (no hay pagos, reservas ni backend).
2. **Comunicar el catálogo de servicios y precios referenciales** para que el usuario llegue a WhatsApp ya informado.
3. **Difundir los operativos veterinarios comunitarios** (esterilización y desparasitación masiva) como canal de acceso a precios comunitarios.
4. **Construir confianza en la Dra. Claudia Cárcamo** mostrando su especialización (homeopatía veterinaria, atención a domicilio).
5. **Posicionar la marca en SEO local** (Valparaíso, Viña del Mar) vía metadatos, geo tags y `schema.org/VeterinaryClinic`.
6. **Dirigir tráfico social a Instagram** (`@domicilio.vet.valpo`) como canal secundario de contenido.

## Mapa de navegación / Menú *(mandatory)*

Navbar fija (`sticky-top`), definida en [index.html:110-136](index.html#L110-L136):

| Elemento | Destino | Tipo |
|---|---|---|
| Logo (ícono) | `https://www.instagram.com/domicilio.vet.valpo/` | Enlace externo (no ancla) |
| Marca "DOMICILIO VET VALPO" | `#inicio` | Ancla interna |
| "Dra. Claudia Cárcamo" | `#sobre-mi` | Ancla interna |
| "Servicios" | `#servicios` | Ancla interna |
| "Operativos" | `#operativos` | Ancla interna |
| "Contacto" | `#contacto` | Ancla interna |

Botones flotantes persistentes (fuera del navbar, visibles en todo el scroll): WhatsApp (`wa.me`), Instagram, y "Volver arriba" (aparece tras 300px de scroll).

**Nota**: el menú NO tiene un ítem propio para la sección `#instagram-feed` (se llega solo scrolleando).

## Inventario de secciones *(mandatory)*

> Los links de línea (`index.html#L...`) de esta sección apuntan al `index.html` **pre-migración** (sitio estático, ver historial de git) — el contenido y el orden descritos siguen vigentes, pero la implementación actual vive componentizada en `src/components/*.tsx` (ver tabla de porteo en el plan de migración, `plan.md`). Mapeo rápido: Navbar→`Navbar.tsx`, Hero→`Hero.tsx`/`HeroCarousel.tsx`, Servicios→`Services.tsx`/`ServiceCard.tsx`, Operativos→`Operativos.tsx`/`OperativoCard.tsx`, Sobre Mí→`About.tsx`, Instagram→`InstagramFeed.tsx`, Contacto→`Contact.tsx`/`ContactForm.tsx`, Footer→`Footer.tsx`.

Cada sección de `index.html`, en orden de aparición (referencia histórica pre-migración):

### 1. Botones flotantes — [index.html:88-107](index.html#L88-L107)
WhatsApp (mensaje predefinido genérico), Instagram, y botón "volver arriba" (versión con ícono `bi-arrow-up-circle-fill`, ver sección 10 sobre duplicado).

### 2. Navbar — [index.html:110-136](index.html#L110-L136)
Ver "Mapa de navegación" arriba. Colapsa a menú hamburguesa en móvil; se cierra automáticamente al hacer clic en un link (`script.js`).

### 3. Hero — `#inicio` — [index.html:139-192](index.html#L139-L192)
Título (`H1`), subtítulo, dos párrafos de introducción de la Dra. Cárcamo, botón "Ver Servicios" (ancla a `#servicios`), carrusel de 8 imágenes (`heroCarousel`, intervalo 2000ms), fila de 6 íconos veterinarios de marca.

### 4. Servicios — `#servicios` — [index.html:195-351](index.html#L195-L351)
6 tarjetas de servicio, cada una con imagen, ícono, título, descripción y botón WhatsApp con mensaje pre-rellenado específico del servicio:

| Servicio | Precio "Desde" | Ícono |
|---|---|---|
| Consulta Veterinaria | $25.000 CLP | estetoscopio |
| Cirugía (incl. esterilización) | $80.000 CLP | cruz veterinaria |
| Tratamiento Homeopático | $30.000 CLP | pata-corazón |
| Vacunación y Prevención | *(sin precio publicado)* | jeringa |
| Procedimientos y Microchip | *(sin precio publicado)* | mascotas |
| Exámenes y Diagnóstico | *(sin precio publicado)* | estetoscopio |

### 5. Operativos Veterinarios — `#operativos` — [index.html:354-467](index.html#L354-L467)
Introducción explicativa ("¿Qué es un Operativo Veterinario?") + 2 tarjetas: **Esterilización** y **Desparasitación**, cada una con zona de cobertura (Valparaíso y Viña del Mar), lista de features con check y CTA "Consultar próximo operativo" por WhatsApp.

### 6. Sobre Mí — `#sobre-mi` — [index.html:473-512](index.html#L473-L512)
Foto de la Dra. Claudia Cárcamo con badge "Médico Veterinario Certificado", bio, lista de 4 especialidades (homeopatía, atención a domicilio, cirugías menores/esterilizaciones, medicina preventiva/vacunación), botón "Agendar Consulta" por WhatsApp.

### 7. Instagram — `#instagram-feed` — [index.html:515-524](index.html#L515-L524)
Sección reducida a un único botón CTA hacia el perfil de Instagram. **No renderiza publicaciones dinámicamente** (ver Issue #4 más abajo).

### 8. Contacto — `#contacto` — [index.html:527-590](index.html#L527-L590)
Lista de datos de contacto (WhatsApp, Instagram, zona de atención) + formulario (`#contactForm`: nombre, teléfono, mascota, mensaje) que al enviarse arma un mensaje y abre `wa.me` con el texto codificado — **no hay backend ni persistencia**, el formulario es un formateador de mensaje de WhatsApp.

### 9. Footer — [index.html:593-606](index.html#L593-L606)
Copyright, tagline, íconos de Instagram y WhatsApp.

### 10. Botón "Volver arriba" (duplicado) — [index.html:609-613](index.html#L609-L613)
Segunda instancia de `<button id="backToTop">` con SVG de flecha, distinta de la de la sección 1. Ver Issue #1.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Agendar una consulta por WhatsApp (Priority: P1)

Un dueño de mascota en Valparaíso/Viña del Mar quiere que una veterinaria lo atienda en su casa. Entra al sitio, revisa "Servicios", y contacta directamente por WhatsApp con el mensaje ya redactado para el servicio de su interés.

**Why this priority**: Es la única vía de conversión del negocio; sin esto el sitio no cumple su función.

**Independent Test**: Hacer clic en cualquier botón "Contactar" de una tarjeta de servicio y verificar que abre WhatsApp Web/App con el número `+56 9 6522 2368` y un mensaje coherente con el servicio elegido.

**Acceptance Scenarios**:

1. **Given** el usuario está en `#servicios`, **When** hace clic en "Contactar" de la tarjeta "Cirugía", **Then** se abre `wa.me/56965222368` con el texto "...cirugía veterinaria a domicilio".
2. **Given** el usuario está en cualquier parte del sitio, **When** hace clic en el botón flotante de WhatsApp, **Then** se abre WhatsApp con el mensaje genérico de contacto.

---

### User Story 2 - Completar el formulario de contacto (Priority: P1)

Un usuario prefiere describir su caso (nombre, teléfono, mascota, mensaje) antes de escribir directamente por WhatsApp.

**Why this priority**: Es el segundo mecanismo de conversión explícito de la sección `#contacto`, comparte prioridad con US1.

**Independent Test**: Completar los 4 campos del formulario y enviar; se debe abrir WhatsApp con un mensaje que incluya nombre, mascota, mensaje y teléfono.

**Acceptance Scenarios**:

1. **Given** el usuario completó los 4 campos, **When** presiona "Enviar por WhatsApp", **Then** se abre `wa.me` con un mensaje que interpola los 4 valores.
2. **Given** el usuario deja un campo requerido vacío, **When** intenta enviar, **Then** el navegador bloquea el envío por validación HTML5 (`required`).

> **Issue #2 resuelto** (2026-08-26): ahora hay un único listener de `submit`, dentro de `initContactForm()`, que abre WhatsApp con los datos reales y muestra el mensaje de éxito correspondiente.

---

### User Story 3 - Enterarse de un operativo comunitario (Priority: P2)

Un usuario con varias mascotas o con presupuesto ajustado busca esterilización/desparasitación a precio comunitario en su barrio.

**Why this priority**: Canal de captación masiva, pero secundario frente a la consulta individual.

**Independent Test**: Ir a `#operativos`, leer la explicación de qué es un operativo, y contactar por WhatsApp para "consultar próximo operativo".

**Acceptance Scenarios**:

1. **Given** el usuario llega a `#operativos` desde el navbar, **When** lee la tarjeta "Esterilización", **Then** ve zona de cobertura, features y un CTA de WhatsApp específico.

---

### User Story 4 - Conocer a la profesional antes de contactar (Priority: P2)

Un usuario nuevo quiere validar las credenciales y especialidad (homeopatía) de quien atenderá a su mascota antes de escribir.

**Independent Test**: Visitar `#sobre-mi` y verificar que se listan credenciales y especialidades, con CTA de agendamiento al final.

**Acceptance Scenarios**:

1. **Given** el usuario navega a "Dra. Claudia Cárcamo" desde el menú, **Then** ve foto, badge de certificación, bio y 4 especialidades.

---

### User Story 5 - Navegar el sitio desde el celular (Priority: P1)

La mayoría del tráfico de una veterinaria a domicilio local es móvil.

**Independent Test**: Abrir el sitio en un viewport ≤ 480px; el navbar colapsa a hamburguesa, el carrusel usa alturas relativas al viewport, las tarjetas se apilan en una columna.

**Acceptance Scenarios**:

1. **Given** un viewport móvil, **When** el usuario toca un link del menú colapsado, **Then** el menú se cierra automáticamente (`script.js`, `DOMContentLoaded`).

---

### User Story 6 - Seguir el perfil de Instagram (Priority: P3)

**Independent Test**: Clic en el logo del navbar, el botón flotante, la sección `#instagram-feed`, o el footer — los 4 deben apuntar al mismo perfil `https://www.instagram.com/domicilio.vet.valpo/`.

---

### Edge Cases

- ¿Qué pasa si el usuario no tiene WhatsApp instalado? → `wa.me` cae a WhatsApp Web; no hay canal de contacto alternativo (sin email ni teléfono para llamada visible salvo el mismo número).
- ¿Qué pasa si JavaScript falla o está deshabilitado? → El carrusel de Bootstrap deja de auto-rotar, AOS no anima (contenido queda oculto si depende de `data-aos` sin fallback de `noscript`), y el formulario de contacto no puede interceptar el `submit` (haría un GET/POST vacío a la página actual porque no tiene `action`/`method`).
- ¿Qué pasa con los dos botones "volver arriba"? → Ver Issue #1: solo uno queda funcional porque comparten `id`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sitio MUST mostrar una navegación fija con anclas a `#inicio`, `#sobre-mi`, `#servicios`, `#operativos`, `#contacto`.
- **FR-002**: Cada tarjeta de servicio MUST incluir un CTA que abra `https://wa.me/56965222368` con un mensaje pre-rellenado específico al servicio.
- **FR-003**: La sección de operativos MUST explicar el concepto y listar al menos los operativos de Esterilización y Desparasitación con su zona de cobertura.
- **FR-004**: El formulario de contacto MUST validar los campos nombre, teléfono, mascota y mensaje como requeridos (HTML5 `required`) antes de intentar el envío.
- **FR-005**: El envío del formulario de contacto MUST componer un mensaje de WhatsApp con los 4 valores capturados y abrir `wa.me` en una pestaña nueva.
- **FR-006**: El botón "volver arriba" MUST aparecer solo después de 300px de scroll y hacer scroll suave al tope.
- **FR-007**: El navbar MUST colapsar el menú móvil automáticamente al seleccionar cualquier link.
- **FR-008**: El sitio MUST exponer metadatos SEO (description, keywords, Open Graph, Twitter Card, geo tags) y un bloque `schema.org/VeterinaryClinic` coherente con el nombre, teléfono y zona geográfica reales del negocio.
- **FR-009**: Todas las imágenes decorativas/carrusel bajo el pliegue MUST usar `loading="lazy"`.
- **FR-010**: El sitio MUST degradar visualmente sin animaciones si AOS no carga (contenido no debe quedar invisible de forma permanente).

### Key Entities

- **Servicio**: nombre, descripción corta, precio opcional ("Desde $X CLP"), ícono de marca, mensaje de WhatsApp asociado. Vive como markup estático en `#servicios`; no hay fuente de datos externa (JSON/CMS).
- **Operativo**: tipo (Esterilización | Desparasitación), zona de cobertura, lista de features, CTA de WhatsApp. Estático en `#operativos`.
- **Envío de Formulario de Contacto**: nombre, teléfono, nombre de mascota, mensaje libre. No se persiste en ningún backend/base de datos — se transforma 1:1 en un mensaje de WhatsApp y se descarta del DOM al hacer `form.reset()`.
- **Publicación de Instagram**: `image_local_url` (preferido, imagen descargada localmente) o `url` (CDN de Instagram, expira) + `post_page_url` opcional. Consumida por `initInstagramFeed()` en `script.js`, que la renderiza en `#instagramGrid` (ver Issue #5 sobre la vigencia de los datos actuales).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario puede llegar desde cualquier sección del sitio hasta abrir WhatsApp con un mensaje contextual en 2 clics o menos.
- **SC-002**: El sitio es completamente navegable y legible en un viewport de 360px de ancho sin scroll horizontal.
- **SC-003**: Las 6 tarjetas de servicio, las 2 tarjetas de operativos y la tarjeta "Sobre Mí" son alcanzables desde el menú principal en un máximo de 1 clic + scroll.
- **SC-004**: El bloque `schema.org/VeterinaryClinic` valida sin errores en el [Rich Results Test de Google](https://search.google.com/test/rich-results) contra la URL de producción real (pendiente confirmar dominio, ver Issue #3).

## Issues conocidos / Deuda técnica detectada

> Se documentan aquí porque `spec-kit` pide que las ambigüedades y hallazgos queden explícitos (`NEEDS CLARIFICATION`) en vez de asumirse en silencio.

1. ~~**`id="backToTop"` duplicado**~~ — ✅ **Resuelto 2026-08-26**. [index.html:105](index.html#L105) y [index.html:609](index.html#L609) definían dos botones con el mismo `id`; se eliminó el segundo (SVG de flecha) y su bloque CSS huérfano (`.back-to-top.visible`), quedando un único botón controlado por la clase `.show`.
2. ~~**Doble listener de `submit` en `#contactForm`**~~ — ✅ **Resuelto 2026-08-26**. `initContactForm()` y el bloque `DOMContentLoaded` tenían cada uno su propio listener de `submit` sobre el mismo formulario. Se unificaron en un solo handler dentro de `initContactForm()` que arma el mensaje, abre `wa.me` y usa el spinner/mensaje de éxito reales (`#formMessage`).
3. ~~**Dominio inconsistente entre archivos SEO**~~ — ✅ **Resuelto 2026-08-26**. Se confirmó `https://domicilio-vet-valpo.vercel.app/` como dominio de producción (deployment activo en Vercel, ver About del repo GitHub) y se unificó en `og:url`/`twitter:url`/`og:image`/`twitter:image`/`schema.org` de `index.html`, `robots.txt` y `sitemap.xml`.
4. ~~**`sitemap.xml` desincronizado del HTML actual**~~ — ✅ **Resuelto 2026-08-26**. Se reescribió `sitemap.xml` con las anclas reales (`#servicios`, `#operativos`, `#sobre-mi`, `#contacto`) y el dominio de producción confirmado.
5. ~~**Feed de Instagram sin conectar**~~ — ✅ **Implementado 2026-08-26**, con una advertencia importante. Se agregó `initInstagramFeed()` en `script.js` (lee `instagram_posts.json`, renderiza un grid en `#instagramGrid`, oculta silenciosamente cualquier imagen/el grid completo si falla la carga). **Pero**: el `instagram_posts.json` versionado hoy contiene URLs directas del CDN de Instagram (`fbcdn.net`) con parámetros de firma (`oe=...`) que **expiran a los pocos días** — a la fecha de este documento ya están vencidas. Esto coincide con lo que `replit.md` ya documentaba de una implementación anterior ("blocked by CORS" / placeholder de fallback), que terminó siendo removida a favor del botón estático. El grid degradará automáticamente al botón solo, igual que hoy, **hasta que alguien vuelva a ejecutar `instagram_fetcher.py`** con una sesión de Instagram válida (requiere `instaloader --login=<cuenta>`, credenciales que este agente no tiene) para regenerar el JSON. Si se prioriza que las imágenes no dependan de una ejecución manual periódica, la solución de fondo es que `instagram_fetcher.py` descargue las imágenes a `assets/instagram/` (`image_local_url`, que ya soporta el nuevo renderer) en vez de enlazar el CDN — eso ya es lo que el script intenta hacer, pero el JSON commiteado quedó de una corrida anterior con el esquema viejo (`url` en vez de `image_local_url`).
6. ~~**`replit.md` desactualizado**~~ — ✅ **Resuelto 2026-08-26**. Se corrigió la lista de secciones, features y deployment, y se agregó una nota al inicio del archivo señalando a este `spec.md` como fuente de verdad vigente.
7. **Dos plataformas de despliegue configuradas simultáneamente** — ⚠️ **Aclarado 2026-08-26, sin cambios de código**. **Vercel es el hosting de producción confirmado** (`vercel.json`, dominio `domicilio-vet-valpo.vercel.app`, deployments activos). `.replit`/`.replit.backup` se conservan porque siguen siendo útiles para levantar el sitio en local/preview (así es como se abrió este proyecto en esta misma sesión) — no se eliminaron.

## Assumptions

- El negocio opera únicamente vía WhatsApp (`+56 9 6522 2368`); no existe backend de reservas ni se planea uno en el corto plazo (Constitución, Principio III).
- La zona de cobertura declarada (Valparaíso y Viña del Mar) es la vigente a la fecha de este documento.
- Los precios "Desde $X CLP" son referenciales y pueden variar según diagnóstico — así se comunica implícitamente con la palabra "Desde".
- El dominio de producción confirmado es `https://domicilio-vet-valpo.vercel.app/` (Vercel), según lo indicado por el dueño del proyecto el 2026-08-26.
