import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { loginUser } from "../js/api.js";

vi.mock("../js/config.js", () => ({
  getLoginApiUrl: () => "http://localhost/api/auth/login",
}));

describe("loginUser", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("200: éxito con token", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          token: "abc",
          expiresIn: 3600,
          type: "Bearer",
        }),
    });

    const r = await loginUser("user@test.com", "pass");
    expect(r.success).toBe(true);
    expect(r.token).toBe("abc");
    expect(r.expiresIn).toBe(3600);
  });

  it("401: credenciales inválidas", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ error: "Invalid credentials" }),
    });

    const r = await loginUser("u", "p");
    expect(r.success).toBe(false);
    expect(r.error).toMatch(/incorrectos/i);
  });

  it("422: errores de campo", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 422,
      text: async () =>
        JSON.stringify({
          error: "Validation failed",
          fields: { username: "Email format invalid" },
        }),
    });

    const r = await loginUser("bad", "p");
    expect(r.success).toBe(false);
    expect(r.fields.username).toBeDefined();
  });

  it("fallo de red", async () => {
    fetch.mockRejectedValue(new Error("network"));
    const r = await loginUser("a@b.co", "p");
    expect(r.success).toBe(false);
    expect(r.error).toMatch(/conectar/i);
  });
});
