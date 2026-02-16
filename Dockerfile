# =========================
# Stage 1 — Dependencies
# =========================
FROM node:20-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci


# =========================
# Stage 2 — Development
# =========================
FROM node:20-alpine AS dev

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000
CMD ["npm", "start"]


# =========================
# Stage 3 — Build
# =========================
FROM node:20-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build


# =========================
# Stage 4 — Production Runtime
# =========================
FROM nginx:stable-alpine AS prod

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
