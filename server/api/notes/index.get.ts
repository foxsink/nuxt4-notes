/**
 * GET /api/notes
 * 
 * Возвращает список всех заметок, отсортированных по дате создания (новые первыми).
 * 
 * Пример ответа:
 * [
 *   { id: "clx...", title: "Заметка", content: "<p>Текст</p>", createdAt: "...", updatedAt: "..." },
 *   ...
 * ]
 */

export default defineEventHandler(async () => {
  // prisma доступна глобально благодаря server/utils/prisma.ts
  const notes = await prisma.note.findMany({
    orderBy: {
      createdAt: 'desc', // Сортировка: новые заметки сверху
    },
  });

  return notes;
});

