# CRC — Sistema de Reserva de Salas de Conferencia

Una pequeña aplicación full-stack para reservar salas de conferencia:
explorar salas, hacer una reserva dentro del horario laboral, ver/filtrar/
cancelar reservas, y administrar la lista de salas desde una página de
administración. No requiere inicio de sesión. Disponible en inglés y
español, con modo claro/oscuro.

🇬🇧 [Read in English](./README.md)

## Stack Tecnológico

**Frontend** (`/client`)
- React + TypeScript, compilado con Vite
- [Material UI (MUI)](https://mui.com/) para componentes y theming, incluyendo MUI X Date/Time Pickers
- React Router para la navegación
- react-i18next para las traducciones inglés/español
- Zod para validación de formularios, Axios para las llamadas a la API

**Backend** (`/server`)
- Node.js + Express + TypeScript
- MongoDB vía Mongoose
- Zod para validación de peticiones
- Empaquetado para producción con [esbuild](https://esbuild.github.io/)

**Shared** (`/shared`)
- Esquemas de Zod y utilidades de reglas de negocio (p. ej. la detección de
  solapamiento de reservas) usadas tanto por el cliente como por el
  servidor, de forma que la lógica de validación se define una sola vez

**Infraestructura**
- Docker + Docker Compose (MongoDB, servidor de la API y cliente estático,
  todo conectado)

Consulta [`PLAN.md`](./PLAN.md) para el registro completo de diseño y
decisiones (en inglés).

## Reglas de Negocio

- Las reservas solo se permiten dentro del horario **09:00–17:00**.
- Una sala nunca puede tener dos reservas solapadas en la misma fecha —
  esto se valida tanto en la interfaz (antes de siquiera enviar la
  petición) como en la API (la verdadera fuente de la verdad).

## Inicio Rápido (Docker — recomendado)

Esta es la forma más sencilla de correr todo el stack (MongoDB + API +
aplicación web) sin necesitar configuración local más allá de Docker.

**Requisitos:** [Docker](https://www.docker.com/) y Docker Compose.

```bash
docker compose up --build
```

Luego abre:
- **Aplicación:** http://localhost:5173
- **API:** http://localhost:4000/api (verificación de estado en `/api/health`)

La base de datos se puebla automáticamente con salas y reservas de ejemplo
en el primer arranque — no se necesita configuración manual. Los datos
persisten en un volumen de Docker entre reinicios; para reiniciarlos desde
cero, ejecuta `docker compose down -v`.

Para detener todo: `docker compose down`.

## Desarrollo Local (sin Docker)

**Requisitos:** Node.js 20+, npm, y una instancia local de MongoDB
corriendo en `mongodb://localhost:27017`.

```bash
# 1. Servidor
cd server
npm install
cp .env.example .env
npm run dev          # http://localhost:4000

# 2. Cliente (en una terminal aparte)
cd client
npm install
cp .env.example .env
npm run dev           # http://localhost:5173
```

El servidor puebla automáticamente la base de datos con salas/reservas de
ejemplo al arrancar si está vacía — igual que con Docker.

### Otros comandos útiles

```bash
# Servidor
npm run build         # chequeo de tipos + empaquetado con esbuild a dist/
npm run start          # ejecuta el paquete ya compilado

# Cliente
npm run build          # build de producción a dist/
npm run preview        # previsualiza el build de producción localmente

# Shared (tests unitarios de reglas de negocio)
cd shared && npm test
```

## Estructura del Proyecto

```
CRC/
├── PLAN.md              # registro de diseño y decisiones (en inglés)
├── docker-compose.yml
├── client/               # aplicación React
├── server/                # API de Express
└── shared/                 # esquemas de Zod + lógica de solapamiento, usados por ambos
```

## Resumen de la API

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/rooms` | Listar salas |
| POST | `/api/rooms` | Crear una sala |
| PUT | `/api/rooms/:id` | Actualizar una sala |
| DELETE | `/api/rooms/:id` | Eliminar una sala |
| GET | `/api/reservations?roomNumber=&date=` | Listar reservas, con filtros opcionales |
| POST | `/api/reservations` | Crear una reserva (rechaza solapamientos y horarios fuera de servicio) |
| DELETE | `/api/reservations/:id` | Cancelar una reserva |
