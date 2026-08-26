# Domicilio Vet Valpo - Veterinary Services Website

> ⚠️ **Nota (2026-08-26)**: este archivo es una bitácora histórica del Replit Agent y quedó desactualizado (p. ej. todavía menciona una "Statistics Section" y una "Testimonials Section" ya eliminadas). La documentación completa y vigente del sitio — objetivos, menú, cada sección, requisitos e issues conocidos — vive en [specs/001-sitio-web-domicilio-vet-valpo/spec.md](specs/001-sitio-web-domicilio-vet-valpo/spec.md), siguiendo el formato de [github/spec-kit](https://github.com/github/spec-kit). Ante cualquier contradicción con lo de abajo, ese spec manda.

## Overview

This is a static website for "Domicilio Vet Valpo," a mobile veterinary service in Valparaíso, Chile, operated by Dr. Claudia Cárcamo. The website provides information about at-home veterinary services including consultations, surgeries, homeopathic treatments, and community veterinary outreach programs (operativos). It's built as a single-page application using vanilla HTML, CSS, and JavaScript with Bootstrap for responsive design.

## Recent Changes

**August 26, 2026 (design refresh):**
- Loaded real Google Fonts (`Plus Jakarta Sans` for headings/CTAs, `Inter` for body) — `font-family: 'Inter'` was declared before but never actually loaded, so the site silently fell back to the system font.
- Fixed a real bug: `.contact-form .form-control` in `style.css` targeted a class that doesn't exist in the HTML (the wrapper is `.contact-form-wrapper`), so the contact form inputs never got their intended styling. Selector corrected.
- Removed dead CSS: the `.stats-section`/`.stat-*` rules (Statistics section was removed from the HTML back in commit `bccc2d3` but its CSS lingered) and a stray orphan `}` left over from an earlier refactor of the carousel styles.
- Hero carousel accessibility: it had no controls and auto-rotated every 2s with no way to pause it. Added prev/next arrows and indicator dots, slowed it to 4s, and set `data-bs-pause="hover"`.
- Fixed a design inconsistency: 3 of the 6 service cards (Vacunación, Procedimientos y Microchip, Exámenes) were stretching a small brand icon into a photo-sized slot. They now get a dedicated `.icon-only` treatment (icon centered on a soft gradient) instead of imitating the photo cards.
- Navbar got a `backdrop-filter` glass effect; footer moved from solid brand red to a dark neutral with brand-red accents (reads less "template", more premium) without touching red anywhere else. Primary/WhatsApp buttons got brand-tinted "glow" shadows instead of plain black ones. WhatsApp floating button got a subtle pulse ring since it's the primary conversion CTA.
- Icon badges (circular, tinted background, invert-to-white on hover) unified across Services, About ("Sobre Mí"), and Operativos — previously only the Services icons had this treatment.
- Full documentation of this pass lives in `specs/001-sitio-web-domicilio-vet-valpo/tasks.md`, Fase 6.

**August 26, 2026:**
- Documented the whole site with a Spec-Driven Development structure (`.specify/`, `specs/001-sitio-web-domicilio-vet-valpo/`) following [github/spec-kit](https://github.com/github/spec-kit) — see `specs/001-sitio-web-domicilio-vet-valpo/spec.md` for the authoritative, up-to-date description of every section, objective and requirement.
- Fixed duplicate `id="backToTop"` (two buttons shared one id; only one was ever wired up) — removed the dead second button and its orphan CSS.
- Fixed `#contactForm` having two independent `submit` listeners (one showed a fake success message, the other actually opened WhatsApp) — unified into a single handler in `initContactForm()`.
- Confirmed `domicilio-vet-valpo.vercel.app` (Vercel) as the canonical production domain and unified it across `index.html` (Open Graph/Twitter/schema.org), `robots.txt`, and `sitemap.xml` (previously three different, partially typo'd domains).
- Rewrote `sitemap.xml` to match the site's real anchors (`#servicios`, `#operativos`, `#sobre-mi`, `#contacto`) instead of stale ones (`#precios`, `#galeria`) that never existed in `index.html`.
- Added `initInstagramFeed()` in `script.js` + `#instagramGrid` in `index.html`: reads `instagram_posts.json` and renders a thumbnail grid, degrading silently to the "Síguenos en Instagram" button alone if the file is missing/empty or images fail to load. **Note**: the committed `instagram_posts.json` currently has expired, signed Instagram CDN URLs — the grid won't show real photos until `instagram_fetcher.py` is re-run with a valid Instagram session.

**December 5, 2025:**
- Fixed HTML structure issues (footer tag closure)
- Improved mobile responsiveness for hero carousel using viewport-relative max-heights (70vh, 50vh, 45vh, 40vh)
- Changed carousel images to use object-fit: cover instead of contain for better visual presentation
- Fixed navbar brand text - using responsive font sizes instead of truncation
- Removed duplicate carousel slides and restored unique image set (8 distinct images)
- Enhanced Instagram feed error handling with fallback placeholder when images fail to load
- Added checkAllFailed() function to show placeholder when all Instagram CDN images are blocked by CORS
- Fixed carousel layout shift on page load by adding aspect-ratio: 4/3 and min-height constraints
- Sped up carousel transitions from 3000ms to 2000ms for faster image cycling
- Improved image framing with object-position: center top for better subject visibility

**November 22, 2025:**
- Enhanced visual aesthetics with improved color palette, shadows, and gradients
- Added new CSS variables for accent colors and improved border radius system
- Implemented modern transition effects using cubic-bezier timing functions
- Added new "Operativos Veterinarios" section explaining community outreach programs
- Created dedicated cards for sterilization and deworming operative services
- Updated navigation menu to include "Operativos" link
- Improved overall typography and spacing throughout the site
- Generated and integrated 6 custom veterinary icons in brand colors (#FF3737)
- Added personalized icons to service cards (stethoscope, medical cross, paw-heart)
- Incorporated custom icons in expertise section (4 different veterinary symbols)
- Enhanced operativos section with themed icons (medical cross, syringe)
- Implemented hover animations and effects for all custom icons

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- Pure HTML5, CSS3, and vanilla JavaScript
- Bootstrap 5.3.3 for responsive UI components and grid system
- Font Awesome 4.7.0 and Bootstrap Icons 1.11.1 for iconography
- AOS (Animate On Scroll) library for scroll animations

**Design Pattern:**
- Single-page application (SPA) structure with anchor-based navigation
- Mobile-first responsive design approach
- Progressive enhancement with JavaScript for animations and interactions

**Rationale:**
The static site approach was chosen for simplicity, fast loading times, and minimal hosting requirements. This is appropriate for an informational website that doesn't require complex state management or server-side rendering. Bootstrap provides a battle-tested responsive framework that ensures consistent cross-device compatibility without custom CSS media queries.

**Key Features:**
- Sticky navigation bar that remains accessible during scrolling
- Automatic mobile menu collapse on link click for better UX
- Smooth scroll behavior for anchor navigation
- Community operativos section with detailed service information
- Visual cards with hover effects for better interactivity
- Location-based information for veterinary operative events
- Dynamic Instagram thumbnail grid (`initInstagramFeed()`), fetched from `instagram_posts.json`, with silent fallback to the follow button

### Styling Architecture

**CSS Organization:**
- CSS custom properties (variables) for consistent theming and easy maintenance
- Scoped color palette using semantic naming (primary, success, accent, bg-white)
- Standardized spacing system using predefined shadow and border-radius values
- Transition variables with cubic-bezier timing for smooth, modern animations
- Modular section-specific styles (services, operativos, about, contact, Instagram grid, etc.)
- Responsive breakpoints for mobile, tablet, and desktop experiences

**Design Decisions:**
- Custom properties centralize all design tokens, making theme updates trivial
- Box-sizing border-box reset prevents layout calculation issues
- Smooth scroll behavior enhances navigation UX without JavaScript dependency

### JavaScript Architecture

**Interaction Patterns:**
- Event delegation for navigation menu interactions
- Intersection Observer API for performance-efficient scroll animations (via AOS)
- `fetch()` + graceful degradation for the Instagram grid (`initInstagramFeed()`): per-image `onerror` hides just that thumbnail, and hides the whole grid if every image fails

**Performance Considerations:**
- AOS library configured with `once: true` to prevent repeated animations and improve performance
- Intersection Observer used instead of scroll listeners to avoid layout thrashing
- Instagram thumbnails use `loading="lazy"`

**Alternatives Considered:**
Could have used React or Vue for component architecture, but rejected due to:
- Cons: Unnecessary complexity and bundle size for static content
- Pros of current approach: Zero build step, faster initial load, easier maintenance for non-technical users

## External Dependencies

### CDN-Hosted Libraries

**Bootstrap 5.3.3:**
- Purpose: Responsive grid system, UI components, and utilities
- Source: `cdn.jsdelivr.net`
- Integrity: SHA-384 subresource integrity verification enabled

**Font Libraries:**
- Bootstrap Icons 1.11.1 from `cdn.jsdelivr.net`
- Font Awesome 4.7.0 from `stackpath.bootstrapcdn.com`
- Purpose: Social media icons and UI elements

**AOS (Animate On Scroll):**
- Version: 2.3.1
- Source: `unpkg.com`
- Purpose: Scroll-triggered animations for visual engagement

### Third-Party Integrations

**WhatsApp Business Integration:**
- Direct link integration via `wa.me` URL scheme
- Phone: +56965222368
- Pre-filled message for consultation inquiries
- Floating action button for persistent accessibility

**Instagram Integration:**
- Profile link: `@domicilio.vet.valpo`
- Navbar brand logo links to Instagram
- Floating social media button for engagement

**SEO & Performance:**
- Preconnect hints for CDN domains to reduce DNS lookup time
- Semantic HTML for search engine optimization
- Meta description for search result snippets
- Favicon for brand recognition in browser tabs

### Asset Management

**Local Assets:**
- Custom logo/icon: `assets/icono.png`
- Service images: `assets/foto1.png`, `assets/foto2.png`, `assets/foto3.png`
- Specialized service images: `assets/homeopatia.png`, `assets/quirurjico.png`
- Custom veterinary icons (AI-generated, brand color #FF3737):
  - `assets/icon-estetoscopio.png` - Stethoscope (used in consultation service)
  - `assets/icon-jeringa.png` - Syringe/vaccine (used in deworming operative & vaccination)
  - `assets/icon-pata-corazon.png` - Paw with heart (used in homeopathy & expertise)
  - `assets/icon-mascotas.png` - Dog & cat (used in home care expertise)
  - `assets/icon-cruz-veterinaria.png` - Veterinary cross (used in surgery & sterilization)
  - `assets/icon-plato.png` - Pet bowl (available for future use)
- Custom stylesheet: `style.css`
- Custom JavaScript: `script.js`

All external dependencies are loaded from CDNs for caching benefits and reduced server load.

## Website Sections

Full detail (objectives, markup, requirements, known issues) lives in [specs/001-sitio-web-domicilio-vet-valpo/spec.md](specs/001-sitio-web-domicilio-vet-valpo/spec.md). Summary, in page order:

1. **Floating buttons**: WhatsApp, Instagram, back-to-top
2. **Navbar**: sticky, anchors to Hero/About/Services/Operativos/Contact
3. **Hero Section** (`#inicio`): introduction + 8-image carousel
4. **Services Section** (`#servicios`): 6 service cards, each with a WhatsApp CTA
5. **Operativos Section** (`#operativos`): community sterilization & deworming outreach
6. **About Section** (`#sobre-mi`): Dr. Claudia Cárcamo's bio and expertise
7. **Instagram Section** (`#instagram-feed`): dynamic thumbnail grid + follow button
8. **Contact Section** (`#contacto`): contact info + form that opens WhatsApp with the entered data
9. **Footer**: copyright + social links

*(The Statistics and Testimonials sections mentioned in older revisions of this file were removed from the site — see commits `bccc2d3` and `ee62419`.)*

## Deployment

**Production**: Vercel (`vercel.json`, static build), domain `domicilio-vet-valpo.vercel.app`.

**Local/preview**: served with Python's built-in HTTP server on port 5000 via the Replit workflow (`.replit`), which starts automatically when the Repl starts.