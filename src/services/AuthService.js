import { apiFetch } from "./api";
import { getToken, isLoggedIn, removeToken, saveToken } from "./token";

export { getToken, isLoggedIn, removeToken, saveToken };

export async function login({ email, password }) {
  const data = await apiFetch("/api/auth/login", { body: { email, password } });

  if (!data || !data.token) {
    throw new Error("Login response did not include a token.");
  }

  saveToken(data.token);
  return data;
}

export function register({ name, email, password, birthDate }) {
  return apiFetch("/api/auth/register", {
    body: { name, email, password, birthDate },
  });
}

export function requestPasswordReset(email) {
  return apiFetch("/api/auth/forgot-password", { body: { email } });
}

export function resetPassword({ token, newPassword }) {
  return apiFetch("/api/auth/reset-password", { body: { token, newPassword } });
}

export function logout() {
  removeToken();
}
