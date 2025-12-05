# Domicilio Vet Valpo - Veterinary Services Website

## Overview

This is a static website for "Domicilio Vet Valpo," a mobile veterinary service in Valparaíso, Chile, operated by Dr. Claudia Cárcamo. The website provides information about at-home veterinary services including consultations, surgeries, homeopathic treatments, and community veterinary outreach programs (operativos). It's built as a single-page application using vanilla HTML, CSS, and JavaScript with Bootstrap for responsive design.

## Recent Changes

**December 5, 2025:**
- Fixed HTML structure issues (footer tag closure)
- Improved mobile responsiveness for hero carousel using viewport-relative max-heights (70vh, 50vh, 45vh, 40vh)
- Changed carousel images to use object-fit: cover instead of contain for better visual presentation
- Fixed navbar brand text - using responsive font sizes instead of truncation
- Removed duplicate carousel slides and restored unique image set (8 distinct images)
- Enhanced Instagram feed error handling with fallback placeholder when images fail to load
- Added checkAllFailed() function to show placeholder when all Instagram CDN images are blocked by CORS

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
- Animated statistics counters triggered by viewport intersection
- Automatic mobile menu collapse on link click for better UX
- Smooth scroll behavior for anchor navigation
- Community operativos section with detailed service information
- Visual cards with hover effects for better interactivity
- Location-based information for veterinary operative events

### Styling Architecture

**CSS Organization:**
- CSS custom properties (variables) for consistent theming and easy maintenance
- Scoped color palette using semantic naming (primary, success, accent, bg-white)
- Standardized spacing system using predefined shadow and border-radius values
- Transition variables with cubic-bezier timing for smooth, modern animations
- Modular section-specific styles (services, operativos, testimonials, etc.)
- Responsive breakpoints for mobile, tablet, and desktop experiences

**Design Decisions:**
- Custom properties centralize all design tokens, making theme updates trivial
- Box-sizing border-box reset prevents layout calculation issues
- Smooth scroll behavior enhances navigation UX without JavaScript dependency

### JavaScript Architecture

**Interaction Patterns:**
- Event delegation for navigation menu interactions
- Intersection Observer API for performance-efficient scroll animations
- Closure-based counter animation with requestAnimationFrame-like timing

**Performance Considerations:**
- AOS library configured with `once: true` to prevent repeated animations and improve performance
- Intersection Observer used instead of scroll listeners to avoid layout thrashing
- Lazy initialization of counters only when elements enter viewport

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

1. **Hero Section**: Introduction to Domicilio Vet Valpo and Dr. Claudia Cárcamo's services
2. **Services Section**: Individual veterinary consultations, surgeries, and homeopathic treatments
3. **Operativos Section**: Community outreach programs including sterilization and deworming operatives
4. **Statistics Section**: Key metrics showcasing experience and client satisfaction
5. **About Section**: Information about Dr. Claudia Cárcamo and her expertise
6. **Testimonials Section**: Client reviews and feedback
7. **Contact Section**: WhatsApp integration and contact form for scheduling appointments

## Deployment

The website is served using Python's built-in HTTP server on port 5000. The workflow is configured to automatically start the web server when the Repl starts.