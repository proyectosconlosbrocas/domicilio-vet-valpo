# Documentación Spec-Driven (spec-kit)

Este proyecto documenta su alcance siguiendo el flujo de [github/spec-kit](https://github.com/github/spec-kit): `constitution → specify → plan → tasks → implement`.

- **[.specify/memory/constitution.md](../.specify/memory/constitution.md)** — principios no negociables del proyecto (sitio estático, mobile-first, WhatsApp como canal primario, SEO local, identidad visual).
- **[.specify/templates/](../.specify/templates/)** — plantillas oficiales de spec-kit (`spec-template.md`, `plan-template.md`, `tasks-template.md`, `constitution-template.md`), listas para clonar al documentar una feature nueva.
- **[001-sitio-web-domicilio-vet-valpo/](001-sitio-web-domicilio-vet-valpo/)** — documentación completa (as-built) del sitio actual:
  - [spec.md](001-sitio-web-domicilio-vet-valpo/spec.md): objetivos del sitio, mapa de navegación, inventario de las 10 secciones de `index.html`, user stories, requisitos funcionales, y los 7 issues/deuda técnica detectados.
  - [plan.md](001-sitio-web-domicilio-vet-valpo/plan.md): stack técnico, estructura de archivos real, chequeo contra la constitución.
  - [tasks.md](001-sitio-web-domicilio-vet-valpo/tasks.md): backlog priorizado (P1–P3) de las correcciones derivadas de esos issues.

## Cómo agregar una feature nueva

1. Copiar `.specify/templates/spec-template.md` a `specs/00N-nombre-feature/spec.md` y completarlo.
2. Copiar `plan-template.md` al mismo directorio, completar el contexto técnico y revisar contra `constitution.md`.
3. Copiar `tasks-template.md`, desglosar en tareas por user story.
4. Implementar siguiendo `tasks.md`.

Si más adelante se instala la CLI oficial (`uvx --from git+https://github.com/github/spec-kit.git specify init --here`) o los comandos `/speckit.*` para un agente compatible, reconocerá esta misma estructura sin cambios.

## Fuente de verdad

Ante cualquier contradicción entre `replit.md` (bitácora histórica del Replit Agent) y `specs/001-sitio-web-domicilio-vet-valpo/spec.md`, **este spec manda** — `replit.md` quedó desactualizado (ver Issue #6).
