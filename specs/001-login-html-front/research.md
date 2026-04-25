# Research: Login HTML Front - Technical Clarifications

**Created**: 2026-04-24  
**Phase**: Phase 0 - Research & Clarification  
**Goal**: Resolver todos los NEEDS CLARIFICATION del plan.md

---

## R1: JWT Storage Strategy (localStorage vs sessionStorage)

**Decision**: sessionStorage

**Rationale**: 
- sessionStorage es más seguro por defecto: el token se elimina automáticamente cuando se cierra la pestaña/navegador.
- Cumple con el principio III (Security First): "Los tokens JWT DEBEN guardarse con un patrón seguro y eliminarse al cerrar sesión".
- Protege contra ataques si otra pestaña es comprometida.
- Para aplicaciones SPA, la experiencia de recargar la página es aceptable.

**Alternatives considered**:
- **localStorage**: Persiste indefinidamente. Riesgo: si el dispositivo se roba, el token sigue activo hasta expirar en backend. NO recomendado para sensibilidad de seguridad.
- **Memory cookie** (secure, httpOnly): Requiere backend; fuera de alcance de este frontend-only. Recomendado para futuro backend.

**Implementation Detail**: 
- Guardar en sessionStorage con clave `authToken`.
- Al cargar la página, verificar presencia de token.
- Limpiar sessionStorage al hacer logout.

---

## R2: Testing Framework for Vanilla JavaScript

**Decision**: Vitest + jsdom (para tests unitarios); Playwright (para integration/e2e opcional)

**Rationale**:
- **Vitest**: Framework moderno, compatible con ES modules nativos, rápido, config simple.
- **jsdom**: Simula DOM en nodeJS para tests sin navegador real.
- **Conjunto mínimo MVP**: Tests unitarios para validation.js y auth.js.
- **Optional supplement**: Playwright para testing manual del flujo completo en navegador real.

**Alternatives considered**:
- **Jest**: Heavier, más setup. Vitest es más rápido y moderno.
- **Testing Library**: Orientado a React/framework; overkill para vanilla.
- **Manual testing only**: No escalable; dificulta mantenimiento.

**Implementation Detail**:
- Instalar: `npm install -D vitest @vitest/ui jsdom`
- Estructura: `tests/` con archivos `.test.js`
- Ejecutar: `npm test` (via package.json script)

---

## R3: Performance Goals & Constraints

**Decision**: 
- Página carga en < 2000ms (First Contentful Paint)
- Validación de formulario < 100ms
- Envío de credenciales: respuesta backend en < 5000ms (con feedback visual)

**Rationale**:
- Estándar web moderno: <2s para carga inicial es aceptable para PWA.
- Vanilla JS (sin framework): típicamente logra esto; muy rápido.
- Validación local es instantánea (JS puro).
- Respuesta de backend no está bajo nuestro control; pero mostrar spinner/loader es UX adecuada.

**Constraints**:
- Archivo HTML: < 50KB gzipped (muy alcanzable con vanilla)
- JS bundle: < 20KB (validación + auth)
- CSS: < 10KB (estilos simples de login)

---

## R4: CSRF Protection

**Decision**: Backend maneja CSRF. Frontend envía token CSRF en headers si backend lo requiere.

**Rationale**:
- CSRF es atacante submit formulario en nombre del usuario desde otro sitio.
- Si el backend es un API REST REST-only (sin session cookies), es menos vulnerable.
- Alternativamente, backend puede usar SameSite=Strict en cookies.
- Frontend puede recibir CSRF token en respuesta inicial (GET /login-form o similar) y adjuntarlo al POST.

**Implementation Detail**:
- Supuesto: Backend proporciona CSRF token en response inicial o en header.
- Frontend adjunta en header `X-CSRF-Token` o campo form.
- Validación real en backend.
- **Acción**: Documentar expectativa de API en contracts/login-api-contract.md

---

## R5: Client-side Email Validation

**Decision**: Validación básica con regex + pattern HTML5; sin verificación de dominio.

**Rationale**:
- HTML5 `<input type="email">` proporciona validación básica nativa.
- Regex perfeccionista es antipatrón; mejor validar el email en backend.
- UX: mostrar error "Formato de email inválido" si no coincide `^[^\s@]+@[^\s@]+\.[^\s@]+$`
- Backend validará existencia, DNS, etc.

**Alternatives considered**:
- **Regex perfecto RFC 5322**: 1000+ caracteres; no vale la pena en cliente.
- **Sin validación**: Mala UX; usuario ve error genérico del backend.

**Implementation Detail**:
- `<input type="email" required pattern="[^\s@]+@[^\s@]+\.[^\s@]+">`
- JS fallback: función `isValidEmail(email)` si necesario.

---

## R6: Secure Credential Handling in Frontend

**Decision**: 
1. No guardar credenciales en ningún lado (excepto campo input transitorio).
2. Enviar credenciales SOLO via HTTPS POST.
3. Limpiar campos después del envío.
4. Usar atributos HTML para proteger:
   - `autocomplete="off"` en password (opcional, algunos navegadores lo ignoran).
   - `input type="password"` para ocultar caracteres.

**Rationale**:
- Frontend NO debe guardar contraseñas (localStorage, cookies, globals, etc.)
- HTTPS garantiza encriptación en tránsito.
- Backend valida y almacena de forma segura (hashed).
- Principio III (Security First): Cumplida.

**Alternatives considered**:
- **Almacenar hash de password en cliente**: Peligroso; el hash es tan valioso como la contraseña.
- **API token en lugar de credenciales**: Post-autenticación; no aquí.

**Implementation Detail**:
```html
<input type="email" id="usernameOrEmail" name="username" required>
<input type="password" id="password" name="password" required autocomplete="off">
```

```javascript
// Limpiar después del envío
document.getElementById('password').value = '';
```

---

## R7: API Integration Contract

**Decision**: Crear `contracts/login-api-contract.md` que documente:
- Endpoint: POST /api/auth/login
- Request body: `{ "username": string, "password": string }`
- Response 200: `{ "token": string, "expires_in": number }`
- Response 401: `{ "error": "Invalid credentials" }`
- Response 422: `{ "error": "Validation failed", "fields": {...} }` (opcional)

**Rationale**:
- Contrato claro entre frontend y backend.
- Facilita desarrollo paralelo.
- Documentación de errores esperados.

---

## Summary of Decisions

| Item | Decision | Implementation |
|------|----------|-----------------|
| **Token Storage** | sessionStorage | Clave: `authToken` |
| **Testing** | Vitest + jsdom | `npm install -D vitest jsdom` |
| **Performance** | <2s load, <100ms validation | Monitor via DevTools |
| **CSRF** | Backend manages | Frontend adjunta header si backend requiere |
| **Email Validation** | HTML5 + básic regex | `type="email"` nativo |
| **Password Security** | HTTPS POST + no-storage | Limpiar campo post-envío |
| **API Contract** | POST /api/auth/login | Documentado en contracts/ |

---

## Phase 0 COMPLETE

Todos los NEEDS CLARIFICATION han sido resueltos.  
**Proceed to Phase 1: Design & Contracts**
