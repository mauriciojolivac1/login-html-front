import { validateForm } from "./validation.js";
import { storeAuthToken } from "./auth.js";
import { loginUser } from "./api.js";
import { getSuccessRedirectHref } from "./config.js";

function getCsrfTokenFromMeta() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta?.getAttribute("content")?.trim() || "";
}

function displayFieldErrors(errors) {
  clearFieldErrors();
  Object.entries(errors).forEach(([field, message]) => {
    const input = document.getElementById(field);
    const errorSpan = document.getElementById(`error-${field}`);
    if (input) input.classList.add("error");
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.classList.add("show");
    }
  });
}

function clearFieldErrors() {
  document.querySelectorAll(".error-message").forEach((el) => {
    el.textContent = "";
    el.classList.remove("show");
  });
  document.querySelectorAll("input").forEach((el) => el.classList.remove("error"));
}

function showAlert(type, message) {
  const alertError = document.getElementById("alertError");
  const alertSuccess = document.getElementById("alertSuccess");
  if (!alertError || !alertSuccess) return;

  alertError.style.display = "none";
  alertError.classList.remove("show");
  alertSuccess.style.display = "none";
  alertSuccess.classList.remove("show");

  if (type === "error") {
    alertError.textContent = message;
    alertError.style.display = "block";
    alertError.classList.add("show");
  } else if (type === "success") {
    alertSuccess.textContent = message;
    alertSuccess.style.display = "block";
    alertSuccess.classList.add("show");
  }
}

function mapServerFieldToFormId(serverKey) {
  if (serverKey === "username") return "usernameOrEmail";
  return serverKey;
}

async function handleLoginSubmit(event) {
  event.preventDefault();

  const usernameOrEmailEl = document.getElementById("usernameOrEmail");
  const passwordEl = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");

  if (!usernameOrEmailEl || !passwordEl || !loginBtn) return;

  const usernameOrEmail = usernameOrEmailEl.value;
  const password = passwordEl.value;

  const validation = validateForm(usernameOrEmail, password);
  if (!validation.isValid) {
    displayFieldErrors(validation.errors);
    const alertError = document.getElementById("alertError");
    const alertSuccess = document.getElementById("alertSuccess");
    if (alertError) {
      alertError.style.display = "none";
      alertError.textContent = "";
    }
    if (alertSuccess) {
      alertSuccess.style.display = "none";
      alertSuccess.textContent = "";
    }
    return;
  }

  clearFieldErrors();
  const errEl = document.getElementById("alertError");
  const okEl = document.getElementById("alertSuccess");
  if (errEl) {
    errEl.style.display = "none";
    errEl.textContent = "";
  }
  if (okEl) {
    okEl.style.display = "none";
    okEl.textContent = "";
  }

  const csrf = getCsrfTokenFromMeta();
  loginBtn.disabled = true;
  const prevLabel = loginBtn.textContent;
  loginBtn.textContent = "Iniciando sesión...";

  const result = await loginUser(usernameOrEmail.trim(), password, {
    csrfToken: csrf || undefined,
  });

  if (result.success) {
    if (!result.token || result.expiresIn == null) {
      showAlert("error", "Respuesta del servidor incompleta. Intenta de nuevo.");
      loginBtn.disabled = false;
      loginBtn.textContent = prevLabel;
      return;
    }
    storeAuthToken(result.token, result.expiresIn, result.type);
    showAlert("success", "Sesión iniciada correctamente.");

    const redirect = getSuccessRedirectHref();
    if (redirect) {
      setTimeout(() => {
        window.location.href = redirect;
      }, 1200);
    }
    loginBtn.disabled = false;
    loginBtn.textContent = prevLabel;
    passwordEl.value = "";
    return;
  }

  if (result.fields && Object.keys(result.fields).length > 0) {
    const mapped = {};
    Object.entries(result.fields).forEach(([k, msg]) => {
      mapped[mapServerFieldToFormId(k)] = String(msg);
    });
    displayFieldErrors(mapped);
  }

  showAlert("error", result.error || "No se pudo iniciar sesión.");
  passwordEl.value = "";
  loginBtn.disabled = false;
  loginBtn.textContent = prevLabel;
  usernameOrEmailEl.focus();
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", handleLoginSubmit);
  }
});
