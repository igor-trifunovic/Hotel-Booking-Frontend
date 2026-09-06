import { apiFetch } from "./api";

export function getHotels({ signal } = {}) {
  return apiFetch("/api/hotels", { signal });
}

export function getHotel(hotelId, { signal } = {}) {
  return apiFetch(`/api/hotels/${encodeURIComponent(hotelId)}`, { signal });
}

export function getHotelSuggestions(query, { signal } = {}) {
  const params = new URLSearchParams({ query });
  return apiFetch(`/api/hotels/suggestions?${params}`, { signal });
}

export function searchHotels({ query, checkIn, checkOut }, { signal } = {}) {
  const params = new URLSearchParams({ query, checkIn, checkOut });
  return apiFetch(`/api/search?${params}`, { signal });
}

export function getRooms(hotelId, { signal } = {}) {
  const params = new URLSearchParams({ hotelId });
  return apiFetch(`/api/rooms?${params}`, { signal });
}

export function getAvailability({ hotelId, checkIn, checkOut }, { signal } = {}) {
  const params = new URLSearchParams({ hotelId, checkIn, checkOut });
  return apiFetch(`/api/availability?${params}`, { signal });
}
