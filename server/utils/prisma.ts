/**
 * Prisma Client Singleton
 * 
 * Prisma 7 требует использования driver adapters.
 * Для PostgreSQL используем @prisma/adapter-pg.
 * 
 * Используем паттерн singleton чтобы:
 * 1. Иметь только одно подключение к БД на всё приложение
 * 2. Избежать утечки соединений при hot-reload в dev режиме
 * 
 * Nuxt автоматически экспортирует всё из server/utils/ глобально,
 * поэтому `prisma` будет доступна во всех API routes без импорта.
 */

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../prisma/generated/prisma/client';

// Расширяем глобальный объект для хранения экземпляра в dev режиме
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Функция для создания экземпляра Prisma Client с PostgreSQL адаптером
function createPrismaClient(): PrismaClient {
  // Создаём адаптер для PostgreSQL с connection string из переменной окружения
  // useRuntimeConfig() доступен только в Nuxt контексте, поэтому используем process.env напрямую
  const connectionString = process.env.DATABASE_URL || '';
  const adapter = new PrismaPg({ connectionString });
  
  // Передаём адаптер в конструктор PrismaClient (требование Prisma 7)
  return new PrismaClient({ adapter });
}

// Используем существующий экземпляр или создаём новый
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// В dev режиме сохраняем экземпляр в global, чтобы он пережил hot-reload
if (import.meta.dev) {
  globalForPrisma.prisma = prisma;
}

