import { describe, it, expect } from "vitest";
import { validateForm, isValidUsernameOrEmail, isValidPassword } from "../js/validation.js";

describe("isValidUsernameOrEmail", () => {
  it("acepta email válido", () => {
    expect(isValidUsernameOrEmail("a@b.co")).toBe(true);
  });

  it("acepta usuario alfanumérico de 3+ caracteres", () => {
    expect(isValidUsernameOrEmail("usr_01")).toBe(true);
  });

  it("rechaza usuario corto", () => {
    expect(isValidUsernameOrEmail("ab")).toBe(false);
  });

  it("rechaza vacío", () => {
    expect(isValidUsernameOrEmail("")).toBe(false);
  });
});

describe("isValidPassword", () => {
  it("rechaza vacío", () => {
    expect(isValidPassword("")).toBe(false);
  });

  it("acepta cualquier longitud > 0", () => {
    expect(isValidPassword("x")).toBe(true);
  });
});

describe("validateForm", () => {
  it("detecta ambos campos vacíos", () => {
    const r = validateForm("", "");
    expect(r.isValid).toBe(false);
    expect(r.errors.usernameOrEmail).toBeDefined();
    expect(r.errors.password).toBeDefined();
  });

  it("detecta formato inválido cuando no es email ni usuario válido", () => {
    const r = validateForm("bad@sinpunto", "secret");
    expect(r.isValid).toBe(false);
    expect(r.errors.usernameOrEmail).toMatch(/inválido/i);
  });
});
