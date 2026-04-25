# Tasks: Login HTML Front

**Input**: `specs/001-login-html-front/` (plan, spec, research, data-model, contracts)  
**Prerequisites**: plan.md, spec.md ✓

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Crear estructura `css/`, `js/`, `assets/`, `docs/`, `tests/` y archivos base según plan.md
- [x] T002 Añadir `package.json` con Vitest + jsdom y script `npm test`
- [x] T003 [P] Añadir `.gitignore` para Node y artefactos comunes

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T004 Implementar resolución de URL del login (`js/config.js` + meta en HTML)
- [x] T005 [P] Añadir `css/reset.css` y enlazar desde `index.html`

**Checkpoint**: Base lista para User Story 1

## Phase 3: User Story 1 — Login básico (P1) MVP

**Goal**: Formulario login, validación, POST al API, JWT en sessionStorage, mensajes de error.  
**Independent Test**: Abrir `index.html` con servidor HTTP, probar campos vacíos, formato, y flujo con mock/red real.

### Tests (Vitest)

- [x] T006 [P] [US1] Tests unitarios de validación en `tests/validation.test.js`
- [x] T007 [P] [US1] Tests unitarios de token en `tests/auth.test.js`
- [x] T008 [P] [US1] Tests de `loginUser` con `fetch` mockeado en `tests/api.test.js`

### Implementation

- [x] T009 [P] [US1] `js/validation.js` — reglas de data-model.md (requerido, email o usuario alfanumérico 3+)
- [x] T010 [P] [US1] `js/auth.js` — sessionStorage clave `authToken` según contrato
- [x] T011 [US1] `js/api.js` — POST JSON `{ username, password }`, manejo 200/401/422/5xx/red
- [x] T012 [US1] `index.html` + `css/styles.css` — formulario accesible, campos FR-001 a FR-006
- [x] T013 [US1] `js/main.js` — envío, errores de campo, alertas, loading, redirección opcional vía meta

**Checkpoint**: US1 funcional de forma independiente

## Phase 4: Polish & Cross-Cutting

- [x] T014 `vitest.config.js` y ajustes finos de UX (focus, limpiar password en error auth)
- [x] T015 [P] Documentación local en `docs/README.md` alineada con quickstart.md

## Dependencies & Execution Order

- T001 → T002, T003 en paralelo tras estructura
- T004, T005 antes del HTML final si se prefiere; T012 puede asumir T004
- Tests T006–T008 pueden escribirse antes o junto a T009–T011 (TDD preferido: tests antes de cerrar T009–T011)
- T012–T013 dependen de T009–T011
- T014–T015 al final
