<script setup lang="ts">
/**
 * NoteCard - карточка заметки в сетке
 * 
 * Отображает:
 * - Заголовок (обрезается если длинный)
 * - Превью контента (первые ~100 символов, без HTML тегов)
 * - Дата создания в читаемом формате
 * - Кнопка удаления (с подтверждением)
 * 
 * Props:
 * - note: объект заметки из API
 * 
 * Emits:
 * - click: клик по карточке (для открытия редактора)
 * - delete: запрос на удаление
 */

// Тип заметки (должен совпадать с Prisma моделью)
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const props = defineProps<{
  note: Note;
}>();

const emit = defineEmits<{
  click: [];
  delete: [];
}>();

/**
 * Извлекает текст из HTML и обрезает до указанной длины
 * 
 * Используем DOMParser для безопасного парсинга HTML.
 * Это работает только на клиенте, поэтому оборачиваем в проверку.
 */
const contentPreview = computed(() => {
  if (!props.note.content) return 'Пустая заметка...';
  
  // Убираем HTML теги простым регулярным выражением
  // (DOMParser был бы безопаснее, но это требует клиентского кода)
  const text = props.note.content
    .replace(/<[^>]*>/g, ' ')  // Заменяем теги на пробелы
    .replace(/\s+/g, ' ')       // Убираем множественные пробелы
    .trim();
  
  // Обрезаем до 120 символов
  if (text.length > 120) {
    return text.slice(0, 120) + '...';
  }
  return text || 'Пустая заметка...';
});

/**
 * Форматирует дату в читаемый формат
 * Использует Intl.DateTimeFormat для локализации
 */
const formattedDate = computed(() => {
  const date = new Date(props.note.createdAt);
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
});

/**
 * Обработчик удаления
 * Показывает confirm диалог перед удалением
 */
function handleDelete(event: Event) {
  // Останавливаем всплытие чтобы не сработал click на карточке
  event.stopPropagation();
  
  if (confirm('Удалить заметку?')) {
    emit('delete');
  }
}
</script>

<template>
  <article class="note-card" @click="emit('click')">
    <!-- Заголовок -->
    <h3 class="title">{{ note.title }}</h3>
    
    <!-- Превью контента -->
    <p class="preview">{{ contentPreview }}</p>
    
    <!-- Футер с датой и кнопкой удаления -->
    <footer class="footer">
      <time class="date" :datetime="note.createdAt">
        {{ formattedDate }}
      </time>
      
      <button 
        class="delete-btn" 
        @click="handleDelete"
        title="Удалить заметку"
      >
        ✕
      </button>
    </footer>
  </article>
</template>

<style scoped>
.note-card {
  background: var(--card-bg, #1e1e1e);
  border: 1px solid var(--border-color, #3a3a3a);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  display: flex;
  flex-direction: column;
  min-height: 160px;
}

.note-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border-color: var(--accent-color, #7c9eff);
}

.title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--text-color, #f0f0f0);
  /* Обрезка длинного заголовка */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview {
  flex: 1;
  font-size: 0.9rem;
  color: var(--text-muted, #a0a0a0);
  margin: 0;
  line-height: 1.5;
  /* Ограничение до 3 строк */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color, #3a3a3a);
}

.date {
  font-size: 0.75rem;
  color: var(--text-muted, #888);
}

.delete-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-muted, #888);
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.15s, color 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn:hover {
  background: rgba(255, 100, 100, 0.15);
  color: #ff6b6b;
}
</style>

