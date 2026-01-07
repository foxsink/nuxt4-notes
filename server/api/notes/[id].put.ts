/**
 * PUT /api/notes/:id
 * 
 * Обновляет существующую заметку.
 * 
 * Параметры URL:
 * - id: уникальный идентификатор заметки
 * 
 * Body:
 * {
 *   "title": "Новый заголовок",      // опционально
 *   "content": "<p>Новый текст</p>"  // опционально
 * }
 * 
 * Prisma автоматически обновит поле updatedAt.
 */

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody<{ title?: string; content?: string }>(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID заметки обязателен',
    });
  }

  // Проверяем что хотя бы одно поле передано для обновления
  if (!body.title && body.content === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Нужно передать title или content для обновления',
    });
  }

  try {
    // update обновляет запись и возвращает обновлённую версию
    const note = await prisma.note.update({
      where: { id },
      data: {
        // Обновляем только переданные поля
        ...(body.title && { title: body.title.trim() }),
        ...(body.content !== undefined && { content: body.content }),
      },
    });

    return note;
  } catch {
    // Prisma выбрасывает ошибку если запись не найдена
    throw createError({
      statusCode: 404,
      statusMessage: 'Заметка не найдена',
    });
  }
});

