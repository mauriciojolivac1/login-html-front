import { describe, it, expect, beforeEach } from "vitest";
import {
  storeAuthToken,
  getAuthToken,
  clearAuthToken,
  isAuthenticated,
} from "../js/auth.js";

describe("auth sessionStorage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("guarda y recupera token", () => {
    storeAuthToken("jwt-here", 3600, "Bearer");
    const t = getAuthToken();
    expect(t).toEqual({ token: "jwt-here", expiresIn: 3600, type: "Bearer" });
    expect(isAuthenticated()).toBe(true);
  });

  it("clearAuthToken elimina sesión", () => {
    storeAuthToken("x", 1);
    clearAuthToken();
    expect(getAuthToken()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });
});
