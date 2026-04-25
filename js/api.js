import { getLoginApiUrl } from "./config.js";

/**
 * @param {string} username
 * @param {string} password
 * @param {{ csrfToken?: string }} [opts]
 */
export async function loginUser(username, password, opts = {}) {
  const apiUrl = getLoginApiUrl();
  const headers = {
    "Content-Type": "application/json",
  };
  if (opts.csrfToken) {
    headers["X-CSRF-Token"] = opts.csrfToken;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ username, password }),
    });

    const text = await response.text();
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }
    }

    if (response.ok) {
      return {
        success: true,
        token: data.token,
        expiresIn: data.expiresIn,
        type: data.type || "Bearer",
        user: data.user,
      };
    }

    if (response.status === 401) {
      return {
        success: false,
        code: data.code,
        error: "Usuario o contraseña incorrectos",
      };
    }

    if (response.status === 422) {
      return {
        success: false,
        code: data.code || "VALIDATION_ERROR",
        error: data.error || "Error de validación",
        fields: data.fields || {},
      };
    }

    return {
      success: false,
      code: data.code || "SERVER_ERROR",
      error: "Error del servidor. Por favor intenta más tarde.",
    };
  } catch {
    return {
      success: false,
      error: "No fue posible conectar. Verifica tu conexión a internet.",
    };
  }
}
