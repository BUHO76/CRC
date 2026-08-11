# PLAN.md — Conference Room Reservation System (CRC)

Status legend: `[ ]` not started · `[~]` in progress · `[x]` done

This file is the source of truth for scope and sequencing. Update the checklist
as work lands — don't let it drift from reality.

---

## 1. Overview

A small full-stack app for reserving conference rooms. No authentication —
open access. Core rule: a room can never have two overlapping reservations.
Overlap is checked on the frontend (so an invalid request never reaches the
API) and re-checked on the backend (defense in depth, since the API must
never trust the client alone).

## 2. Decisions Log

Captured from planning Q&A — treat these as settled unless revisited:

| Topic | Decision |
|---|---|
| Auth | None. Fully open, no login, no roles enforced server-side. |
| Landing page | `/` is a role **picker** (UI-only, no auth): "Admin" → room management, "User" → reservation flow. Both routes remain reachable from nav either way. |
| Room management | Admin CRUD page (create/edit/delete rooms) **plus** an auto-seed on server start. |
| Room fields | `number` (identifier) + `capacity`. No name/location field. |
| Seed trigger | Automatic — backend checks on startup if the `rooms` collection is empty and seeds it if so. No manual script step required. |
| Cancel flow | User cancels directly from the reservation list (filter → click Cancel). No confirmation code, no identity check. |
| Language/tooling | TypeScript on both frontend and backend. |
| i18n | react-i18next (or equivalent), Spanish + English. |
| Validation | Zod on the frontend form; equivalent validation independently enforced on the backend. |
| Error handling | Global modal component for surfacing errors (validation errors, API errors, overlap conflicts). Built as an MUI `Dialog`. |
| Styling / components | Material UI (MUI) — forms, tables, buttons, dialogs all built from MUI components + `sx`/theme, not plain CSS. |
| Package manager | npm |
| MongoDB target | Local MongoDB instance (`mongodb://localhost:27017/crc` by default, overridable via `.env`) |
| Project structure | Single repo, two workspaces — `/client` (React) and `/server` (Express) — see §9. |
| Reservation date/time model | `date` (YYYY-MM-DD) + `startTime`/`endTime` (HH:mm, 24h), same-day only — no overnight/multi-day spans. |
| Operating hours | Reservations only allowed within **09:00–17:00**. A stay past 17:00 isn't a single reservation — the user books a fresh reservation for the next day (same room if still free, or another one). |

All decisions are now settled — no open items remain.

## 4. Data Models

### Room
```ts
{
  _id: ObjectId,
  number: string,      // e.g. "101" — unique
  capacity: number,    // seats
  createdAt: Date,
}
```

### Reservation
```ts
{
  _id: ObjectId,
  roomNumber: string,   // references Room.number
  reservedBy: string,   // name of the person reserving
  date: string,          // "YYYY-MM-DD"
  startTime: string,     // "HH:mm"
  endTime: string,       // "HH:mm", must be > startTime
  createdAt: Date,
}
```

## 5. Business Rules

### 5.1 Operating hours (09:00–17:00)

Every reservation's `startTime` and `endTime` must fall within `09:00`–`17:00`
on a single `date`. There is no overnight/multi-day reservation — a booking
that would need to continue past 17:00 is simply a *new* reservation for the
next day (same room if still free, or a different one). Enforced via the
Zod schema (`startTime >= "09:00"`, `endTime <= "17:00"`, `endTime > startTime`)
on both frontend and backend.

### 5.2 No Overlapping Reservations

Two reservations for the **same `roomNumber`** and **same `date`** conflict
if: `existing.startTime < new.endTime AND existing.endTime > new.startTime`.

- **Frontend**: before submit, fetch existing reservations for the chosen
  room + date (reuses the filter endpoint) and validate client-side. If a
  conflict is found, show the error modal — the reservation request is
  never sent.
- **Backend**: on `POST /reservations`, independently re-run the same
  overlap check against the DB inside the request before inserting. Reject
  with `409 Conflict` if a conflict exists. This is the real source of
  truth; the frontend check is a UX nicety, not the security boundary.

## 6. API Endpoints

All request bodies validated with Zod schemas (shared shape between
frontend and backend where practical, e.g. a `/shared` schema folder).

### Rooms
- `GET /api/rooms` — list all rooms (used to populate the reservation form's room selector and the admin page)
- `POST /api/rooms` — create a room `{ number, capacity }`
- `PUT /api/rooms/:id` — update a room
- `DELETE /api/rooms/:id` — delete a room

### Reservations
- `POST /api/reservations` — create a reservation `{ roomNumber, reservedBy, date, startTime, endTime }`. 400 on validation failure, 409 on overlap.
- `GET /api/reservations?roomNumber=&date=` — filter reservations by room number and/or date (both optional; no params returns full list for the list view)
- `DELETE /api/reservations/:id` — cancel a reservation

## 7. Frontend Views / Routes

- `/` — Landing / role picker ("Admin" / "User" buttons, no auth)
- `/admin/rooms` — Room management (list, create, edit, delete)
- `/reserve` — Reservation form (room dropdown, name, date, start/end time; Zod validation + overlap pre-check)
- `/reservations` — List of reservations with filter by room number + date, Cancel action per row
- Global: Error modal (MUI `Dialog`), mounted once, triggered via a shared error/toast context
- Global: language switcher (EN/ES) in the MUI `AppBar`/nav
- Component library: MUI (`@mui/material`, `@mui/icons-material`) for buttons, tables (reservation list), forms/inputs, dialogs. MUI X Date/Time Pickers (`@mui/x-date-pickers`) for the date + start/end time fields on the reservation form.

## 8. i18n

- Library: `react-i18next` for app copy (nav, labels, validation/error messages)
- MUI's own locale text (`ptBR`/`esES`/`enUS` theme locales) applied to the theme so built-in component strings (date pickers, table pagination, etc.) follow the same language switch
- Locale files: `/client/src/locales/en.json`, `/client/src/locales/es.json`
- Cover: nav, form labels + validation messages, list/table headers, modal error text, empty states

## 9. Project Structure (proposed)

```
CRC/
├── PLAN.md
├── README.md
├── client/                # React + TS
│   ├── src/
│   │   ├── components/    # feature-organized (per coding-style rules)
│   │   ├── pages/
│   │   ├── locales/
│   │   ├── hooks/
│   │   ├── lib/            # api client, zod schemas
│   │   └── theme/           # MUI theme + locale config
│   └── package.json
├── server/                 # Node + Express + TS
│   ├── src/
│   │   ├── routes/
│   │   ├── models/          # Mongoose schemas
│   │   ├── controllers/
│   │   ├── validation/      # zod schemas
│   │   ├── seed/             # auto-seed logic, run on startup
│   │   └── app.ts
│   └── package.json
└── shared/                  # optional: zod schemas shared by client+server
```

## 10. Testing Strategy

- **Backend**: Vitest/Jest + Supertest — unit tests for overlap logic, integration tests per endpoint (create/filter/cancel, including the 409 conflict path).
- **Frontend**: Vitest/Jest + React Testing Library — form validation, overlap pre-check UX, list filtering, cancel flow, error modal.
- **E2E** (stretch goal, confirm if wanted): Playwright — reserve → see it in list → cancel it, and the overlap-block path.

## 11. Build Checklist

### Phase 0 — Scaffolding
- [ ] Init `client` (Vite + React + TS), install MUI (`@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`, `@mui/x-date-pickers`)
- [ ] Init `server` (Express + TS)
- [ ] Connect server to local MongoDB (`mongodb://localhost:27017/crc`, via `.env`)
- [ ] Set up shared Zod schema location
- [ ] Set up base MUI theme + `react-i18next` scaffolding

### Phase 1 — Rooms
- [ ] Room model (Mongoose)
- [ ] Room CRUD endpoints
- [ ] Auto-seed on server startup (seed if `rooms` is empty)
- [ ] Admin room management page (list/create/edit/delete)

### Phase 2 — Reservations core
- [ ] Reservation model (Mongoose)
- [ ] Zod schema enforcing 09:00–17:00 operating hours + `endTime > startTime`
- [ ] Overlap-check utility (shared logic, unit tested first)
- [ ] `POST /api/reservations` with backend overlap + operating-hours enforcement
- [ ] `GET /api/reservations` filter by room number + date
- [ ] `DELETE /api/reservations/:id`

### Phase 3 — Frontend flows
- [ ] Landing / role picker page
- [ ] Reservation form with Zod validation + overlap pre-check
- [ ] Reservation list page with filters + cancel action
- [ ] Global error modal wired to API/validation failures

### Phase 4 — i18n
- [ ] react-i18next setup
- [ ] EN + ES locale files
- [ ] Language switcher in nav

### Phase 5 — Testing & polish
- [ ] Backend unit + integration tests
- [ ] Frontend component tests
- [ ] Manual pass: overlap edge cases (adjacent times, same start/end) and operating-hours edge cases (starts before 09:00, ends after 17:00, exactly 09:00–17:00)
- [ ] README updated with setup + run instructions
