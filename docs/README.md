# Login HTML Front — uso local

## Requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari).
- Node.js 18+ solo si vas a ejecutar tests (`npm test`).

## Servir la página

Los módulos ES (`type="module"`) requieren un servidor HTTP (no abras `index.html` como `file://`).

Ejemplos:

```bash
# Python 3
python -m http.server 8000
```

Abre `http://localhost:8000` y prueba el formulario.

## Configurar el API

1. **Misma máquina / mismo origen**  
   Deja vacío el meta `login-api-base` en `index.html`. Las peticiones irán a `{origen actual}/api/auth/login`.

2. **API en otro host**  
   En `index.html`, ajusta:

   ```html
   <meta name="login-api-base" content="https://tu-api.com" />
   ```

3. **Redirección tras login** (opcional):

   ```html
   <meta name="login-success-redirect" content="./dashboard.html" />
   ```

4. **CSRF** (si el backend lo exige):

   ```html
   <meta name="csrf-token" content="TOKEN_DEL_SERVIDOR" />
   ```

## Contrato del login

Ver `specs/001-login-html-front/contracts/login-api-contract.md`: cuerpo JSON `{ "username", "password" }`, respuesta 200 con `token` y `expiresIn`. El token se guarda en `sessionStorage` bajo la clave `authToken`.

## Tests

```bash
npm install
npm test
```
