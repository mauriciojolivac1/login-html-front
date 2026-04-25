# Quickstart: Login HTML Front

**Created**: 2026-04-24  
**Phase**: Phase 1 - Implementation Guidance  
**Duration**: ~5 minutes to get login page running locally

---

## Prerequisites

- Node.js 16+ (for testing; optional for basic HTML/CSS/JS)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Git (to clone / manage branches)
- Text editor or IDE (VS Code, etc.)

---

## Step 1: Clone or Set Up Project Directory

```bash
# Clone the repository (if not already done)
git clone https://github.com/mauriciojolivac1/login-html-front.git
cd login-html-front

# Create feature branch (if not already on 001-login-html-front)
git checkout 001-login-html-front
```

---

## Step 2: Create Basic Project Structure

```bash
# From repo root, create directories
mkdir -p css js assets tests

# Create basic files
touch index.html
touch css/styles.css
touch js/main.js
touch js/validation.js
touch js/auth.js
touch js/api.js
```

---

## Step 3: Add Minimal HTML Form

**File: `index.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Proyecto Frontend</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="login-container">
        <h1>Iniciá Sesión</h1>
        <form id="loginForm">
            <div class="form-group">
                <label for="usernameOrEmail">Email o Usuario:</label>
                <input type="email" id="usernameOrEmail" name="username" required>
                <span class="error-message" id="error-usernameOrEmail"></span>
            </div>

            <div class="form-group">
                <label for="password">Contraseña:</label>
                <input type="password" id="password" name="password" required>
                <span class="error-message" id="error-password"></span>
            </div>

            <button type="submit" id="loginBtn">Iniciar Sesión</button>
        </form>

        <div id="alerts">
            <div class="alert alert-error" id="alertError" style="display: none;"></div>
            <div class="alert alert-success" id="alertSuccess" style="display: none;"></div>
        </div>
    </div>

    <script src="js/validation.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/api.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
```

---

## Step 4: Add Basic CSS Styling

**File: `css/styles.css`**

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    padding: 40px;
    width: 100%;
    max-width: 400px;
}

h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
    font-size: 24px;
}

.form-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
}

label {
    font-weight: 500;
    color: #555;
    margin-bottom: 8px;
    font-size: 14px;
}

input {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.3s;
}

input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

input.error {
    border-color: #e74c3c;
}

.error-message {
    color: #e74c3c;
    font-size: 12px;
    margin-top: 4px;
    display: none;
}

.error-message.show {
    display: block;
}

button {
    width: 100%;
    padding: 12px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
}

button:hover {
    background: #5568d3;
}

button:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.alert {
    margin-top: 20px;
    padding: 12px;
    border-radius: 4px;
    font-size: 14px;
}

.alert-error {
    background: #ffe6e6;
    color: #c53030;
    border-left: 4px solid #c53030;
}

.alert-success {
    background: #e6ffed;
    color: #22863a;
    border-left: 4px solid #22863a;
}

.alert.show {
    display: block !important;
}
```

---

## Step 5: Add Validation Module

**File: `js/validation.js`**

```javascript
/**
 * Validate email or username
 */
function isValidUsernameOrEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_-]{3,}$/;
    
    return emailRegex.test(value) || usernameRegex.test(value);
}

/**
 * Validate password (basic: non-empty)
 */
function isValidPassword(password) {
    return password.length > 0;
}

/**
 * Validate entire form
 * Returns: { isValid: boolean, errors: {...} }
 */
function validateForm(username, password) {
    const errors = {};

    if (!username) {
        errors.usernameOrEmail = "El email o usuario es obligatorio";
    } else if (!isValidUsernameOrEmail(username)) {
        errors.usernameOrEmail = "Formato de email o usuario inválido";
    }

    if (!password) {
        errors.password = "La contraseña es obligatoria";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}
```

---

## Step 6: Add Auth & API Modules

**File: `js/auth.js`**

```javascript
/**
 * Store auth token in sessionStorage
 */
function storeAuthToken(token, expiresIn, type = 'Bearer') {
    const authData = { token, expiresIn, type };
    sessionStorage.setItem('authToken', JSON.stringify(authData));
}

/**
 * Retrieve auth token from sessionStorage
 */
function getAuthToken() {
    const authData = sessionStorage.getItem('authToken');
    return authData ? JSON.parse(authData) : null;
}

/**
 * Clear auth token
 */
function clearAuthToken() {
    sessionStorage.removeItem('authToken');
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return getAuthToken() !== null;
}
```

**File: `js/api.js`**

```javascript
/**
 * Send login credentials to backend
 * Backend URL should be configurable (for now, hardcoded or from env)
 */
async function loginUser(username, password) {
    const apiUrl = 'https://your-api-endpoint.example.com/api/auth/login';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        if (response.ok) {
            const data = await response.json();
            return {
                success: true,
                token: data.token,
                expiresIn: data.expiresIn,
                user: data.user
            };
        } else if (response.status === 401) {
            return {
                success: false,
                error: 'Usuario o contraseña incorrectos'
            };
        } else if (response.status === 422) {
            const data = await response.json();
            return {
                success: false,
                error: 'Error de validación',
                fields: data.fields
            };
        } else {
            return {
                success: false,
                error: 'Error del servidor. Por favor intenta más tarde.'
            };
        }
    } catch (error) {
        return {
            success: false,
            error: 'No fue posible conectar. Verifica tu conexión a internet.'
        };
    }
}
```

---

## Step 7: Add Main Controller

**File: `js/main.js`**

```javascript
/**
 * Initialize login form handler
 */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');

    if (form) {
        form.addEventListener('submit', handleLoginSubmit);
    }
});

/**
 * Handle form submission
 */
async function handleLoginSubmit(event) {
    event.preventDefault();

    const usernameOrEmail = document.getElementById('usernameOrEmail').value;
    const password = document.getElementById('password').value;

    // Validate form
    const validation = validateForm(usernameOrEmail, password);

    if (!validation.isValid) {
        // Show field errors
        displayFieldErrors(validation.errors);
        return;
    }

    // Clear previous errors
    clearFieldErrors();

    // Disable button during request
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Iniciando sesión...';

    // Send to backend
    const result = await loginUser(usernameOrEmail, password);

    if (result.success) {
        // Store token
        storeAuthToken(result.token, result.expiresIn);
        
        // Show success
        showAlert('success', 'Sesión iniciada correctamente! Redirigiendo...');
        
        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = '/dashboard.html'; // Adjust redirect URL
        }, 2000);
    } else {
        // Show error
        showAlert('error', result.error);
        
        // Clear password field for security
        document.getElementById('password').value = '';
        
        // Re-enable button
        loginBtn.disabled = false;
        loginBtn.textContent = 'Iniciar Sesión';
    }
}

/**
 * Display field-specific errors
 */
function displayFieldErrors(errors) {
    clearFieldErrors();
    
    Object.entries(errors).forEach(([field, message]) => {
        const input = document.getElementById(field);
        const errorSpan = document.getElementById(`error-${field}`);
        
        if (input) input.classList.add('error');
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.classList.add('show');
        }
    });
}

/**
 * Clear field errors
 */
function clearFieldErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
    });

    const inputs = document.querySelectorAll('input');
    inputs.forEach(el => el.classList.remove('error'));
}

/**
 * Show alert message
 */
function showAlert(type, message) {
    const alertError = document.getElementById('alertError');
    const alertSuccess = document.getElementById('alertSuccess');

    // Hide both
    alertError.style.display = 'none';
    alertSuccess.style.display = 'none';

    // Show relevant one
    if (type === 'error') {
        alertError.textContent = message;
        alertError.classList.add('show');
    } else if (type === 'success') {
        alertSuccess.textContent = message;
        alertSuccess.classList.add('show');
    }
}
```

---

## Step 8: Run Locally

### Option A: Simple HTTP Server

```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js http-server
npm install -g http-server
http-server

# Or using VS Code Live Server extension
```

Then open browser: **http://localhost:8000**

### Option B: With Testing (Vitest)

```bash
# Install testing dependencies
npm init -y
npm install -D vitest jsdom

# Create test files in tests/ directory
# Run tests
npm test
```

---

## Step 9: Test Login Flow Manually

1. **Open** http://localhost:8000 in browser
2. **Leave both fields empty, click "Iniciar Sesión"** → Should see validation errors
3. **Enter email/username and empty password** → Should see password error
4. **Enter both fields with invalid email** → Should see format error
5. **Enter valid email and password** → Should attempt backend call
   - If backend not configured: Network error shown (expected)
   - If backend configured: Success or auth error from backend

---

## Step 10: Configure Backend Endpoint

Edit `js/api.js` line 5:

```javascript
const apiUrl = 'https://your-api-endpoint.example.com/api/auth/login';
```

Replace with your actual backend URL.

---

## Next Steps

- [ ] Set up Jest/Vitest for unit testing
- [ ] Set up Playwright for integration testing
- [ ] Add CSRF token handling (once backend defines it)
- [ ] Add loading spinner/skeleton during API call
- [ ] Add "Remember me" feature (optional MVP+)
- [ ] Implement token expiration handling
- [ ] Add password strength indicator (optional MVP+)

---

## Troubleshooting

**Q: "CORS error" when calling backend API**  
A: Backend must allow requests from your frontend origin. Contact backend team to configure CORS.

**Q: "Network error" even though backend is running**  
A: Check backend URL is correct and backend is running. Use browser DevTools (Network tab) to inspect request.

**Q: Token not being stored**  
A: Check browser DevTools → Application → Session Storage. If empty, login may not be succeeding.

**Q: Page redirect doesn't work**  
A: Change `/dashboard.html` in `main.js` to your actual next page URL.

---

## Summary

You now have a functional login page with:
- ✅ HTML form with email/username and password fields
- ✅ Client-side validation
- ✅ Secure JWT token storage in sessionStorage
- ✅ API integration (ready to connect to backend)
- ✅ Error messages and user feedback

Ready for Phase 2 (Tasks) implementation!

