# CRC — Conference Room Reservation System

# NOTAS DEL DESARROLLADOR:
se eleigio el lenguaje tanto frontend como backend debido a que se tiene mayor expertise en TypeScript y que no se tendria que preocupar por la compatibilidad de dependencias externas com oversiones de PIP en el caso de que se hay usado python o el JDK en caso de haberse usado Java. Se decidio por una SPA con un backend en monolito debido a que la complejidad del proyecto no era tan grande, pero aun asi ase agregaron tests y validacion de inputs que inserte el usuario, de haber tenido mas tiempo y de acuerdo a mi experiencia habria ocupado probablemente la arquitectura hexagonal, ya que permite la insercion de nuevos modulos independientes pero comunicables entre si (aunque aqui tal vez requiera que la app se comunique via eventos); habria pulido mas la interfaz del usuario ya que es lo que mas me entretiene del desarrollo. habria agregado pruebas adicionales tanto unitarias como e2e y tal vez en el backend ocuparia una framework como NestJS para extra robusticidad.

A small full-stack app for reserving conference rooms: browse rooms, make a
reservation within business hours, view/filter/cancel reservations, and
manage the room list from an admin page. No login required. Available in
English and Spanish, with light/dark mode.

🇪🇸 [Leer en español](./README.es.md)

## Tech Stack

**Frontend** (`/client`)
- React + TypeScript, built with Vite
- [Material UI (MUI)](https://mui.com/) for components and theming, incl. MUI X Date/Time Pickers
- React Router for navigation
- react-i18next for English/Spanish translations
- Zod for form validation, Axios for API calls

**Backend** (`/server`)
- Node.js + Express + TypeScript
- MongoDB via Mongoose
- Zod for request validation
- Bundled for production with [esbuild](https://esbuild.github.io/)

**Shared** (`/shared`)
- Zod schemas and business-rule utilities (e.g. reservation overlap
  detection) used by both the client and the server, so validation logic is
  defined once

**Infra**
- Docker + Docker Compose (MongoDB, API server, and static client, wired
  together)

See [`PLAN.md`](./PLAN.md) for the full design/decision log.

## Business Rules

- Reservations are only allowed within **09:00–17:00**.
- A room can never have two overlapping reservations for the same date —
  enforced both in the UI (before a request is even sent) and in the API
  (the real source of truth).

## Quick Start (Docker — recommended)

This is the easiest way to run the whole stack (MongoDB + API + web app)
with zero local setup beyond Docker itself.

**Requirements:** [Docker](https://www.docker.com/) and Docker Compose.

```bash
docker compose up --build
```

Then open:
- **App:** http://localhost:5173
- **API:** http://localhost:4000/api (health check at `/api/health`)

The database auto-seeds with sample rooms and reservations on first start —
no manual setup needed. Data persists in a Docker volume across restarts;
to reset it, run `docker compose down -v`.

To stop everything: `docker compose down`.

## Local Development (without Docker)

**Requirements:** Node.js 20+, npm, and a local MongoDB instance running on
`mongodb://localhost:27017`.

```bash
# 1. Server
cd server
npm install
cp .env.example .env
npm run dev          # http://localhost:4000

# 2. Client (in a separate terminal)
cd client
npm install
cp .env.example .env
npm run dev           # http://localhost:5173
```

The server auto-seeds the database with sample rooms/reservations on
startup if empty — same as the Docker path.

### Other useful commands

```bash
# Server
npm run build         # typecheck + esbuild bundle to dist/
npm run start          # run the built bundle

# Client
npm run build          # production build to dist/
npm run preview        # preview the production build locally

# Shared (business-rule unit tests)
cd shared && npm test
```

## Project Structure

```
CRC/
├── PLAN.md              # design/decision log, kept up to date per phase
├── docker-compose.yml
├── client/               # React app
├── server/                # Express API
└── shared/                 # Zod schemas + overlap-check logic, used by both
```

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/rooms` | List rooms |
| POST | `/api/rooms` | Create a room |
| PUT | `/api/rooms/:id` | Update a room |
| DELETE | `/api/rooms/:id` | Delete a room |
| GET | `/api/reservations?roomNumber=&date=` | List reservations, optionally filtered |
| POST | `/api/reservations` | Create a reservation (rejects overlaps and out-of-hours times) |
| DELETE | `/api/reservations/:id` | Cancel a reservation |
