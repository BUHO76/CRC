# Build context is the repo root (server needs the sibling /shared directory).
FROM node:20 AS build
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm ci
COPY server ./
COPY shared /app/shared
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app/server
ENV NODE_ENV=production
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/server/dist ./dist
EXPOSE 4000
CMD ["node", "dist/index.js"]
