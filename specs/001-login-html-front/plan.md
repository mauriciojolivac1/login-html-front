# Implementation Plan: Login HTML Front

**Branch**: `001-login-html-front` | **Date**: 2026-04-24 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-login-html-front/spec.md`

## Summary

Página de inicio de sesión HTML. El usuario ingresa sus credenciales (nombre de usuario/email y contraseña) en un formulario simple construido con HTML, CSS y JavaScript nativos. El frontend valida los campos obligatorios, muestra mensajes de error claros, y envía las credenciales a un servicio de autenticación externo via HTTP. Los tokens JWT recibidos se guardan de forma segura en el navegador.

## Technical Context

**Language/Version**: HTML5, CSS3, ES6+ JavaScript (vanilla, sin frameworks)  
**Primary Dependencies**: None (vanilla frontend stack)  
**Storage**: localStorage o sessionStorage para tokens JWT (NEEDS CLARIFICATION: decisión entre ambos)  
**Testing**: Framework de testing para DOM y JavaScript (NEEDS CLARIFICATION: Jest, Vitest, Playwright, o testing manual)  
**Target Platform**: Navegadores modernos de escritorio (Chrome, Firefox, Safari, Edge)  
**Project Type**: Web application (frontend solamente, no backend en este repo)  
**Performance Goals**: Carga bajo 2 segundos; respuesta de validación inmediata (NEEDS CLARIFICATION: objetivo exacto)  
**Constraints**: Almacenamiento seguro de tokens; protección contra XSS al manejar credenciales (NEEDS CLARIFICATION: si requiere CSRF token)  
**Scale/Scope**: Una página única (index.html) con formulario de login y mensajes de validación

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Verificación contra principios de constitución:**

✅ **I. UX Simplicity in Vanilla Frontend**: La especificación requiere HTML/CSS/JS nativos sin frameworks UI. Cumplida en Technical Context.

✅ **II. Client-side JWT Authentication Flow**: El frontend capturará credenciales y manejará JWT. Cumplida en User Story 1.

✅ **III. Security First for Credentials and Tokens**: FR-005 y la constitución requieren almacenamiento seguro. Cumplida en Requirements.

✅ **IV. Progressive Delivery and Independent Validation**: User Story 1 (P1) es autónoma y totalmente funcional independientemente.

✅ **V. Minimal Viable Implementation and Iteration**: Una sola página HTML, CSS, y JavaScript sin complejidad adicional.

**GATE RESULT**: PASS - Proceed to Phase 0 Research

## Project Structure

### Documentation (this feature)

```text
specs/001-login-html-front/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── login-api-contract.md  # API contract with external auth service
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
index.html              # Página principal con formulario de login
css/
├── styles.css         # Estilos globales y del formulario
└── reset.css          # Reset/normalize CSS (opcional)

js/
├── main.js            # Lógica principal e inicialización
├── auth.js            # Manejo de autenticación y JWT
├── validation.js      # Validación de formulario
└── api.js             # Llamadas HTTP al backend

assets/
├── icons/             # Iconos SVG o imágenes
└── favicon.ico        # Favicon del sitio

docs/
└── README.md          # Instrucciones de instalación y uso local

tests/
├── auth.test.js       # Tests de autenticación JWT
├── validation.test.js # Tests de validación
└── integration.test.html  # Test manual o con Playwright
```

**Structure Decision**: Single frontend project (vanilla HTML/CSS/JS). No backend needed. Estructura simple y flat siguiendo el principio de UX Simplicity. Directorio de assets para recursos visuales, js/ para módulos de funcionalidad, tests/ para pruebas.

