import { getToken, removeToken } from "./token";

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080";

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function isAbortError(err) {
  return err && err.name === "AbortError";
}

async function parseBody(res) {
  if (res.status === 204) return null;

  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiFetch(path, { auth = false, body, method, signal, headers } = {}) {
  const requestHeaders = { ...headers };

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getToken();
    if (token) requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: method || (body !== undefined ? "POST" : "GET"),
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  const payload = await parseBody(res);

  if (!res.ok) {
    if (res.status === 401) {
      removeToken();
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    const message =
      (payload && payload.message) || `Request failed (${res.status}).`;

    throw new ApiError(message, res.status, payload);
  }

  return payload;
}
