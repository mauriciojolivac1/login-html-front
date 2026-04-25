const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-zA-Z0-9_-]{3,255}$/;

export function isValidUsernameOrEmail(value) {
  const v = String(value ?? "").trim();
  if (!v) return false;
  if (EMAIL_RE.test(v)) return true;
  return USERNAME_RE.test(v);
}

export function isValidPassword(password) {
  return String(password ?? "").length > 0;
}

/**
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateForm(usernameOrEmail, password) {
  const errors = {};
  const user = String(usernameOrEmail ?? "").trim();
  const pass = String(password ?? "");

  if (!user) {
    errors.usernameOrEmail = "El email o usuario es obligatorio";
  } else if (!isValidUsernameOrEmail(user)) {
    errors.usernameOrEmail = "Formato de email o usuario inválido";
  }

  if (!pass) {
    errors.password = "La contraseña es obligatoria";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
