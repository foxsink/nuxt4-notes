/**
 * DELETE /api/notes/:id
 * 
 * Удаляет заметку по ID.
 * 
 * Параметры URL:
 * - id: уникальный идентификатор заметки
 * 
 * Возвращает удалённую заметку или 404 если не найдена.
 */

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID заметки обязателен',
    });
  }

  try {
    // delete удаляет и возвращает удалённую запись
    const note = await prisma.note.delete({
      where: { id },
    });

    return note;
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: 'Заметка не найдена',
    });
  }
});

