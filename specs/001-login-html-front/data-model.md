# Data Model: Login HTML Front

**Created**: 2026-04-24  
**Phase**: Phase 1 - Design  
**Purpose**: Define entities, attributes, relationships, and validation rules

---

## Entities

### User Credentials

**Purpose**: Datos capturados del formulario de login y enviados al backend.

**Attributes**:

| Attribute | Type | Constraints | Notes |
|-----------|------|-------------|-------|
| `usernameOrEmail` | string | Required, 1-255 chars | Acepta nombre de usuario O email |
| `password` | string | Required, 1-255 chars | Nunca se almacena en cliente; transitorio |

**Validation Rules**:
- `usernameOrEmail` no puede estar vacío
- `usernameOrEmail` debe: ser email válido (RFC básico `user@domain.ext`) O ser alfanumérico de 3+ caracteres
- `password` no puede estar vacío
- `password` mínimo 1 carácter (restricción de servidor más estricta)

**State Transitions**:
```
[Empty] → [User fills fields] → [User clicks Send] → [Validation in progress] 
  → [ValidationPass] → [API Call in progress] → [Auth Success | Auth Error]
  → [Error shown/ Success handling]
```

**Storage**: NO se almacena. Es transitorio en el DOM (input fields).

---

### AuthToken

**Purpose**: Token JWT recibido del backend tras autenticación exitosa.

**Attributes**:

| Attribute | Type | Constraints | Notes |
|-----------|------|-------------|-------|
| `token` | string (JWT) | Required | Formato: `header.payload.signature` |
| `expiresIn` | number (seconds) | Required | Tiempo de vida del token |
| `type` | string | Optional, default "Bearer" | Tipo de autenticación |

**Validation Rules**:
- `token` no puede estar vacío
- `token` debe decodificar a válido JSON en payload (sin verificar firma en cliente)
- `expiresIn` > 0

**Storage**: sessionStorage con clave `authToken`
- Formato almacenado: JSON string
- Ejemplo: `{"token": "eyJ...", "expiresIn": 3600, "type": "Bearer"}`

**Lifecycle**:
1. **Adquirido**: POST /api/auth/login success
2. **Almacenado**: sessionStorage (inmediatamente)
3. **Usado**: En headers posteriores como `Authorization: Bearer <token>`
4. **Expirado**: Validar `expiresIn` antes de cada request; si expirado, limpiar y redirigir a login
5. **Descartado**: Al cerrar sesión O cerrar navegador/pestaña

---

### ValidationError

**Purpose**: Error de validación en el formulario; mostrado al usuario.

**Attributes**:

| Attribute | Type | Constraints | Notes |
|-----------|------|-------------|-------|
| `field` | string enum | Required | `"usernameOrEmail"` \| `"password"` |
| `message` | string | Required, < 200 chars | Mensaje legible por usuario |
| `code` | string | Optional | `"required"` \| `"invalid_format"` |

**Validation Rules**:
- `field` debe ser campo válido del formulario
- `message` debe estar en idioma del usuario (español para MVP)

**Examples**:
```json
{ "field": "usernameOrEmail", "message": "El email o usuario es obligatorio" }
{ "field": "password", "message": "La contraseña es obligatoria" }
{ "field": "usernameOrEmail", "message": "Formato de email inválido" }
```

---

### AuthResponse (API Response)

**Purpose**: Respuesta esperada del backend tras envío de credenciales.

**Attributes** (Success 200):

| Attribute | Type | Notes |
|-----------|------|-------|
| `token` | string | JWT token |
| `expiresIn` | number | Segundos hasta expiración |
| `user` | object (optional) | Datos del usuario autenticado |

**Attributes** (Error 401, 422):

| Attribute | Type | Notes |
|-----------|------|-------|
| `error` | string | Mensaje de error |
| `code` | string (optional) | Código de error (e.g., "INVALID_CREDENTIALS") |
| `fields` | object (optional) | Errores por campo para 422 |

---

## Relationships

```
User Credentials (form input)
    ↓ (HTTP POST)
Backend API
    ↓ (validates, authenticates)
AuthToken (upon success)
    ↓ (stored)
sessionStorage
    ↓ (retrieved for)
Subsequent API Calls
    ↓ (via Authorization header)
Protected Resources
```

---

## State Machine

```
START
  ↓
LOGIN_PAGE_LOADED
  ├─ User fills "usernameOrEmail" → (no validation yet)
  ├─ User fills "password" → (no validation yet)
  ├─ User clicks "Login" button
  ↓
VALIDATING_FORM
  ├─ If validation fails → VALIDATION_ERROR (show message, stay on form)
  ├─ If validation passes → next step
  ↓
SENDING_TO_BACKEND
  └─ Show spinner/loading indicator
  ↓
  ├─ Backend responds 200 (success)
  │   ↓
  │   STORE_TOKEN (sessionStorage)
  │   ↓
  │   AUTH_SUCCESS (redirect to app or show success message)
  │
  ├─ Backend responds 401/403 (invalid credentials)
  │   ↓
  │   SHOW_AUTH_ERROR ("Usuario o contraseña incorrectos")
  │   ↓
  │   CLEAR_FORM + RETURN_TO_LOGIN_PAGE
  │
  ├─ Backend responds 422 (validation error)
  │   ↓
  │   SHOW_FIELD_ERRORS
  │   ↓
  │   RETURN_TO_LOGIN_PAGE
  │
  └─ Backend responds 5xx / Network Error
      ↓
      SHOW_NETWORK_ERROR ("Error del servidor, intenta más tarde")
      ↓
      RETURN_TO_LOGIN_PAGE
```

---

## Constraints & Assumptions

- **No persistence of User Credentials**: Las credenciales son transitorio en el input DOM, nunca en storage.
- **Backend stores password hashed**: Frontend envía plaintext vía HTTPS; backend maneja seguridad.
- **Token format is JWT**: Frontend no verifica firma; confía en HTTPS.
- **Single user session per browser tab**: sessionStorage no comparte entre tabs.
- **No refresh token logic**: MVP no incluye refresh; token expira → relogin.
