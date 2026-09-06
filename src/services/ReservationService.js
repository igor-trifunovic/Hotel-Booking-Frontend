import { apiFetch } from "./api";

export function getMyReservations({ signal } = {}) {
  return apiFetch("/api/reservations/me", { auth: true, signal });
}

export function createReservation({ roomId, checkInDate, checkOutDate }) {
  return apiFetch("/api/reservations", {
    auth: true,
    body: { roomId, checkInDate, checkOutDate },
  });
}
