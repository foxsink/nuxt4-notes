<script setup lang="ts">
/**
 * Главная страница - список заметок
 * 
 * Функционал:
 * - Отображение заметок в виде сетки карточек
 * - Создание новой заметки
 * - Редактирование существующей заметки
 * - Удаление заметки
 * - Загрузка данных с сервера
 */

// Тип заметки
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Состояние модального окна
const isModalOpen = ref(false);
const editingNote = ref<Note | null>(null);

/**
 * useFetch - composable Nuxt для загрузки данных
 * 
 * Особенности:
 * - Автоматически выполняется на сервере (SSR) и клиенте
 * - Кэширует результат (не делает повторный запрос при навигации назад)
 * - Возвращает реактивные данные: data, pending, error, refresh
 */
const { data: notes, pending, error, refresh } = await useFetch<Note[]>('/api/notes', {
  // Ключ для дедупликации запросов
  key: 'notes-list',
});

/**
 * Открыть модалку для создания новой заметки
 */
function openCreateModal() {
  editingNote.value = null;
  isModalOpen.value = true;
}

/**
 * Открыть модалку для редактирования заметки
 */
function openEditModal(note: Note) {
  editingNote.value = note;
  isModalOpen.value = true;
}

/**
 * Сохранить заметку (создание или обновление)
 */
async function saveNote(data: { title: string; content: string }) {
  try {
    if (editingNote.value) {
      // Обновление существующей заметки
      await $fetch(`/api/notes/${editingNote.value.id}`, {
        method: 'PUT',
        body: data,
      });
    } else {
      // Создание новой заметки
      await $fetch('/api/notes', {
        method: 'POST',
        body: data,
      });
    }
    
    // Закрываем модалку и обновляем список
    isModalOpen.value = false;
    await refresh();
  } catch (e) {
    console.error('Ошибка сохранения:', e);
    alert('Не удалось сохранить заметку');
  }
}

/**
 * Удалить заметку
 */
async function deleteNote(note: Note) {
  try {
    await $fetch(`/api/notes/${note.id}`, {
      method: 'DELETE',
    });
    
    // Обновляем список
    await refresh();
  } catch (e) {
    console.error('Ошибка удаления:', e);
    alert('Не удалось удалить заметку');
  }
}
</script>

<template>
  <div class="page">
    <!-- Шапка -->
    <header class="header">
      <h1>Заметки</h1>
      <button class="btn-create" @click="openCreateModal">
        + Новая заметка
      </button>
    </header>

    <!-- Состояние загрузки -->
    <div v-if="pending" class="loading">
      <div class="spinner" />
      <p>Загрузка заметок...</p>
    </div>

    <!-- Ошибка -->
    <div v-else-if="error" class="error">
      <p>Ошибка загрузки: {{ error.message }}</p>
      <button class="btn-retry" @click="refresh()">Повторить</button>
    </div>

    <!-- Пустое состояние -->
    <div v-else-if="!notes?.length" class="empty">
      <div class="empty-icon">📝</div>
      <h2>Заметок пока нет</h2>
      <p>Создайте первую заметку!</p>
      <button class="btn-create" @click="openCreateModal">
        + Создать заметку
      </button>
    </div>

    <!-- Сетка карточек -->
    <div v-else class="notes-grid">
      <TransitionGroup name="card">
        <NoteCard
          v-for="note in notes"
          :key="note.id"
          :note="note"
          @click="openEditModal(note)"
          @delete="deleteNote(note)"
        />
      </TransitionGroup>
    </div>

    <!-- Модальное окно -->
    <NoteModal
      v-model="isModalOpen"
      :note="editingNote"
      @save="saveNote"
    />
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 40px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Шапка */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color, #f0f0f0);
  margin: 0;
}

.btn-create {
  padding: 12px 24px;
  background: var(--accent-color, #7c9eff);
  color: #000;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s, transform 0.1s;
}

.btn-create:hover {
  background: var(--accent-hover, #9db8ff);
}

.btn-create:active {
  transform: scale(0.98);
}

/* Сетка карточек */
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* Состояния загрузки, ошибки, пустое */
.loading,
.error,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  color: var(--text-muted, #a0a0a0);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color, #3a3a3a);
  border-top-color: var(--accent-color, #7c9eff);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error {
  color: #ff6b6b;
}

.btn-retry {
  margin-top: 16px;
  padding: 10px 20px;
  background: transparent;
  border: 1px solid #ff6b6b;
  color: #ff6b6b;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s;
}

.btn-retry:hover {
  background: rgba(255, 107, 107, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.empty h2 {
  margin: 0 0 8px;
  color: var(--text-color, #f0f0f0);
}

.empty p {
  margin: 0 0 24px;
}

/* Анимации появления/исчезновения карточек */
.card-enter-active {
  transition: all 0.3s ease-out;
}

.card-leave-active {
  transition: all 0.2s ease-in;
  position: absolute;
}

.card-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.card-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Для плавного перемещения остальных карточек */
.card-move {
  transition: transform 0.3s ease;
}
</style>

