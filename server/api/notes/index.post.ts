/**
 * POST /api/notes
 * 
 * Создаёт новую заметку.
 * 
 * Body:
 * {
 *   "title": "Заголовок заметки",
 *   "content": "<p>HTML контент из редактора</p>"
 * }
 * 
 * Возвращает созданную заметку.
 */

export default defineEventHandler(async (event) => {
  // readBody парсит JSON из тела запроса
  const body = await readBody<{ title: string; content: string }>(event);

  // Валидация входных данных
  if (!body.title?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Заголовок обязателен',
    });
  }

  // Создаём заметку в базе данных
  const note = await prisma.note.create({
    data: {
      title: body.title.trim(),
      content: body.content || '',
    },
  });

  // Возвращаем созданную заметку с кодом 201 (Created)
  setResponseStatus(event, 201);
  return note;
});

