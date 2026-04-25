<!--
Sync Impact Report
Version change: template → 1.0.0
Modified principles:
- [PRINCIPLE_1_NAME] → I. UX Simplicity in Vanilla Frontend
- [PRINCIPLE_2_NAME] → II. Client-side JWT Authentication Flow
- [PRINCIPLE_3_NAME] → III. Security First for Credentials and Tokens
- [PRINCIPLE_4_NAME] → IV. Progressive Delivery and Independent Validation
- [PRINCIPLE_5_NAME] → V. Minimal Viable Implementation and Iteration
Added sections:
- Requisitos Técnicos
- Flujo de Desarrollo
Removed sections:
- placeholder template sections only
Templates reviewed:
- .specify/templates/constitution-template.md ✅ applied
- .specify/templates/plan-template.md ✅ reviewed
- .specify/templates/spec-template.md ✅ reviewed
- .specify/templates/tasks-template.md ✅ reviewed
Follow-up TODOs:
- none
-->
# Login HTML Front Constitution

## Core Principles

### I. UX Simplicity in Vanilla Frontend
La interfaz debe ser clara, accesible y directa. El proyecto DEBE usar HTML, CSS y JavaScript nativos para mantener la experiencia ligera y comprensible.

### II. Client-side JWT Authentication Flow
El frontend DEBE manejar la captura de credenciales, el envío seguro al backend y el uso del token JWT recibido para autorizar llamadas posteriores.

### III. Security First for Credentials and Tokens
Las credenciales NO deben expuestarse en URLs, registros o almacenamiento inseguro. Los tokens JWT DEBEN guardarse con un patrón seguro y eliminarse al cerrar sesión.

### IV. Progressive Delivery and Independent Validation
Cada entrega DEBE ser funcional por sí misma. El login debe poder probarse independientemente antes de añadir pantallas adicionales o mejoras de estilo.

### V. Minimal Viable Implementation and Iteration
El equipo DEBE priorizar un login funcional y seguro sobre complejidad innecesaria. Cualquier funcionalidad adicional DEBE justificar su valor frente al flujo central de inicio de sesión.

## Requisitos Técnicos
- El frontend debe construirse con HTML, CSS y JavaScript nativos sin frameworks de UI adicionales.
- El proyecto debe ser compatible con navegadores modernos de escritorio.
- El flujo JWT debe usar `fetch` con `Authorization: Bearer <token>` para llamadas autenticadas.
- No se requiere implementación de backend en este repositorio; el frontend debe integrarse fácilmente con un API de autenticación externo.
- La documentación debe explicar cómo ejecutar y probar el login localmente.

## Flujo de Desarrollo
- Las PRs DEBEN incluir la descripción del cambio y los pasos para probar el login.
- Los cambios DEBEN evaluarse según los principios de usabilidad, seguridad, alcance MVP y simplicidad.
- Los defectos de seguridad o experiencia DEBEN corregirse antes de aceptar una PR.
- El desarrollo DEBE avanzar de forma incremental: primero un login funcional, luego mejoras justificadas.

## Governance
Esta constitución define las reglas mínimas del proyecto Login HTML Front.
Cualquier enmienda DEBE documentarse en este archivo con fecha y motivo.
Las PRs DEBEN verificar el cumplimiento con los principios de seguridad, experiencia de usuario, alcance mínimo y validación independiente.

**Version**: 1.0.0 | **Ratified**: 2026-04-24 | **Last Amended**: 2026-04-24
