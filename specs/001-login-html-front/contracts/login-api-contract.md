# API Contract: Login Authentication

**Created**: 2026-04-24  
**Phase**: Phase 1 - Contracts  
**Scope**: Frontend-to-Backend communication for login feature

---

## Endpoint: POST /api/auth/login

**Purpose**: Authenticate user with credentials and receive JWT token.

**Protocol**: HTTPS POST (required)

---

## Request

### Headers

```
Content-Type: application/json
X-CSRF-Token: [token] (if backend requires CSRF protection)
```

### Body

```json
{
  "username": "string (required, 1-255 chars)",
  "password": "string (required, 1-255 chars)"
}
```

**Fields**:
- `username`: Can be email (user@example.com) or username (johndoe)
- `password`: Plaintext; backend responsible for hashing and comparison

**Example Request**:
```bash
curl -X POST https://api.example.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john@example.com",
    "password": "securePassword123"
  }'
```

---

## Response: 200 OK (Success)

### Headers

```
Content-Type: application/json
```

### Body

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "type": "Bearer",
  "user": {
    "id": "12345",
    "username": "john",
    "email": "john@example.com"
  }
}
```

**Fields**:
- `token` (string, required): JWT token for subsequent authenticated requests
- `expiresIn` (number, required): Token validity in seconds (e.g., 3600 = 1 hour)
- `type` (string, optional): Token type, typically "Bearer"
- `user` (object, optional): User details; frontend can store for display

**Example Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "expiresIn": 3600,
  "type": "Bearer",
  "user": {
    "id": "1",
    "username": "john",
    "email": "john@example.com"
  }
}
```

**Frontend Action**:
1. Extract `token` and `expiresIn`
2. Store in sessionStorage:
   ```javascript
   sessionStorage.setItem('authToken', JSON.stringify({
     token: response.token,
     expiresIn: response.expiresIn,
     type: response.type || 'Bearer'
   }));
   ```
3. Redirect user to app/dashboard

---

## Response: 401 Unauthorized (Invalid Credentials)

### Headers

```
Content-Type: application/json
```

### Body

```json
{
  "error": "Invalid credentials",
  "code": "INVALID_CREDENTIALS"
}
```

**HTTP Status Code**: 401

**Frontend Action**:
1. Show error message to user: "Usuario o contraseña incorrectos"
2. Keep form visible for retry
3. Clear password field
4. Focus on username/email field

---

## Response: 422 Unprocessable Entity (Validation Error)

### Headers

```
Content-Type: application/json
```

### Body

```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "fields": {
    "username": "Email format invalid",
    "password": "Password is required"
  }
}
```

**HTTP Status Code**: 422

**Frontend Action**:
1. Show field-specific error messages
2. Highlight problematic fields
3. Keep form visible for correction

---

## Response: 5xx Server Error (Backend Error)

### Headers

```
Content-Type: application/json
```

### Body

```json
{
  "error": "Internal server error",
  "code": "SERVER_ERROR"
}
```

**HTTP Status Code**: 500, 502, 503, etc.

**Frontend Action**:
1. Show generic error: "Error del servidor. Por favor intenta más tarde."
2. Allow retry
3. Log error details for debugging

---

## Response: Network Timeout / Connection Error

**Frontend Action**:
1. Show error: "No fue posible conectar. Verifica tu conexión a internet."
2. Allow retry
3. Implement exponential backoff for retry logic

---

## Subsequent Authenticated Requests

Once token is stored, include in all subsequent requests:

### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Example**:
```javascript
fetch('https://api.example.com/api/user/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

## Token Expiration Handling

If backend responds 401 to an authenticated request:

1. **On frontend**: Token in sessionStorage has expired or been revoked
2. **Action**: 
   - Clear sessionStorage
   - Redirect user to login page
   - Show message: "Tu sesión expiró. Por favor inicia sesión nuevamente."

---

## Security Notes

- **HTTPS Only**: All requests must use HTTPS to protect credentials and tokens in transit
- **CORS**: Backend must configure CORS appropriately for frontend domain
- **CSRF**: If using session cookies, backend should set SameSite=Strict or provide CSRF token
- **Rate limiting**: Backend should rate-limit login attempts (e.g., 5 attempts per 15 minutes per IP)
- **Password requirements**: Backend enforces; frontend provides feedback if needed

---

## Summary Table

| Scenario | Status | User Message | Frontend Action |
|----------|--------|--------------|-----------------|
| Valid credentials | 200 | Success (optional) | Store token, redirect |
| Invalid credentials | 401 | "Usuario o contraseña incorrectos" | Show error, keep form |
| Validation error | 422 | Field-specific errors | Highlight fields, show errors |
| Server error | 5xx | "Error del servidor, intenta más tarde" | Allow retry |
| Network error | N/A | "No fue posible conectar" | Allow retry |

