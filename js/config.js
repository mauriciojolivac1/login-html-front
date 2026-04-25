/**
 * Resuelve la URL absoluta del endpoint POST /api/auth/login.
 * Meta opcional: <meta name="login-api-base" content="https://api.tudominio.com">
 * Si está vacío o ausente, usa el origen actual del documento.
 */
export function getLoginApiUrl() {
  if (typeof document === "undefined" || !document.querySelector) {
    return "/api/auth/login";
  }
  const meta = document.querySelector('meta[name="login-api-base"]');
  const raw = meta?.getAttribute("content")?.trim() ?? "";
  const base = raw || (typeof window !== "undefined" ? window.location.origin : "");
  const path = "/api/auth/login";
  try {
    return new URL(path, base.endsWith("/") ? base : `${base}/`).href;
  } catch {
    return path;
  }
}

export function getSuccessRedirectHref() {
  if (typeof document === "undefined") return "";
  const meta = document.querySelector('meta[name="login-success-redirect"]');
  return meta?.getAttribute("content")?.trim() ?? "";
}
