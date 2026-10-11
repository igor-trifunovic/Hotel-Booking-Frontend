# BookIT — Hotel Booking Frontend

A React single-page app for searching hotels, checking room availability across a
date range, and booking rooms. This repository contains **only the frontend** — it
talks to a separate Spring Boot REST API over JSON.

Built as a learning and portfolio project.

## Features

- **Hotel search** — by hotel name or city, with debounced autocomplete suggestions
- **Date-aware availability** — search results and room listings are filtered by the
  selected check-in/check-out dates, and each room shows whether it is free for them
- **Result cards** — nightly price, nights and trip total, and an availability badge
  that warns when only a few rooms are left
- **Reservations** — signed-in users can book a room and review their bookings
- **Authentication** — registration, login, and a complete password-reset flow
  (request link → set new password), using a JWT held client-side
- **Protected routes** — `/reservations` redirects to login without a token

## Tech stack

| Area | Choice |
|---|---|
| UI | React 19 |
| Routing | React Router 7 |
| Build | Create React App (`react-scripts` 5) |
| Styling | Plain CSS |
| Tests | Jest + React Testing Library |
| Backend | Spring Boot REST API (separate repository) |

## Architecture

Every HTTP call goes through one wrapper, so response checking, auth headers and
request cancellation live in a single place instead of being repeated per component:

```
token.js → api.js → AuthService · HotelService · ReservationService → components
```

- **`token.js`** — the only module that touches the stored JWT
- **`api.js`** — `apiFetch()`: attaches the bearer token when a call needs auth,
  throws a typed `ApiError` carrying the status and the server's message on non-2xx,
  clears the token and emits `auth:unauthorized` on a 401, and forwards an
  `AbortSignal` so effects can cancel in-flight requests
- **`*Service.js`** — one module per domain, each a thin set of named endpoint functions

## Getting started

### Prerequisites

- Node.js 18 or newer
- The backend API running and reachable (defaults to `http://localhost:8080`)

### Install and run

```bash
npm install
npm start
```

The app serves on <http://localhost:3000>.

### Configuration

The API base URL is read from `REACT_APP_API_URL`, falling back to
`http://localhost:8080` when unset:

```bash
cp .env.example .env.local
```

## Scripts

| Command | Purpose |
|---|---|
| `npm start` | Development server with hot reload |
| `npm test` | Jest in watch mode — a smoke test for the app shell plus unit tests for the API wrapper |
| `npm run build` | Optimised production bundle into `build/` |

## API endpoints consumed

| Method | Endpoint | Auth |
|---|---|---|
| `GET` | `/api/hotels` | — |
| `GET` | `/api/hotels/{id}` | — |
| `GET` | `/api/hotels/suggestions?query=` | — |
| `GET` | `/api/search?query=&checkIn=&checkOut=` | — |
| `GET` | `/api/rooms?hotelId=` | — |
| `GET` | `/api/availability?hotelId=&checkIn=&checkOut=` | — |
| `POST` | `/api/auth/register` | — |
| `POST` | `/api/auth/login` | — |
| `POST` | `/api/auth/forgot-password` | — |
| `POST` | `/api/auth/reset-password` | — |
| `GET` | `/api/reservations/me` | Bearer |
| `POST` | `/api/reservations` | Bearer |

## Project structure

```
src/
├── components/     Navbar, SearchForm, HotelCard
├── pages/          One component per route
├── services/       API wrapper and per-domain endpoint modules
├── utils/          Currency and date-range formatting
└── App.js          Route definitions
```
