const STORAGE_KEY = "authToken";

export function storeAuthToken(token, expiresIn, type = "Bearer") {
  const authData = { token, expiresIn, type };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
}

export function getAuthToken() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAuthToken() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function isAuthenticated() {
  return getAuthToken() !== null;
}
