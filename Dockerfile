# Dockerfile для Nuxt 4 приложения
FROM node:lts-alpine AS base

WORKDIR /app

# Копируем файлы зависимостей и Prisma схему
# (prisma generate запускается в postinstall, поэтому схема нужна до npm install)
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# ============================================
# Development stage
# ============================================
FROM base AS development

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ============================================
# Build stage (для production)
# ============================================
FROM base AS build

RUN npm ci

COPY . .

RUN npm run build

# ============================================
# Production stage
# ============================================
FROM node:lts-alpine AS production

WORKDIR /app

COPY --from=build /app/.output /app/.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]

