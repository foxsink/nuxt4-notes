/**
 * GET /api/notes/:id
 * 
 * Возвращает одну заметку по ID.
 * 
 * Параметры URL:
 * - id: уникальный идентификатор заметки (CUID)
 * 
 * Возвращает 404 если заметка не найдена.
 */

export default defineEventHandler(async (event) => {
  // getRouterParam извлекает динамический параметр из URL
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID заметки обязателен',
    });
  }

  // findUnique ищет по уникальному полю (id)
  const note = await prisma.note.findUnique({
    where: { id },
  });

  // Если заметка не найдена — возвращаем 404
  if (!note) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Заметка не найдена',
    });
  }

  return note;
});

