<script setup lang="ts">
/**
 * NoteModal - модальное окно для создания/редактирования заметки
 * 
 * Работает в двух режимах:
 * 1. Создание - когда note не передан
 * 2. Редактирование - когда передан существующий note
 * 
 * Особенности:
 * - Закрывается по клику на overlay или кнопке
 * - Закрывается по Escape
 * - Блокирует прокрутку body когда открыт
 * - Использует Teleport для рендера в конце body
 * 
 * Props:
 * - modelValue: boolean - открыт/закрыт (v-model)
 * - note: объект заметки для редактирования (опционально)
 * 
 * Emits:
 * - update:modelValue: управление видимостью
 * - save: сохранение заметки { title, content }
 */

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const props = defineProps<{
  modelValue: boolean;
  note?: Note | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  save: [data: { title: string; content: string }];
}>();

// Локальное состояние формы
const title = ref('');
const content = ref('');

// Флаг сохранения (для disabled кнопки)
const isSaving = ref(false);

// Режим редактирования или создания
const isEditing = computed(() => !!props.note);

// Заголовок модального окна
const modalTitle = computed(() => 
  isEditing.value ? 'Редактировать заметку' : 'Новая заметка'
);

/**
 * Заполняем форму при открытии модалки
 * Если передан note - берём его данные, иначе очищаем
 */
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      if (props.note) {
        title.value = props.note.title;
        content.value = props.note.content;
      } else {
        title.value = '';
        content.value = '';
      }
    }
  }
);

/**
 * Закрытие модального окна
 */
function close() {
  emit('update:modelValue', false);
}

/**
 * Сохранение заметки
 */
async function save() {
  // Валидация
  if (!title.value.trim()) {
    alert('Введите заголовок');
    return;
  }

  isSaving.value = true;
  
  try {
    emit('save', {
      title: title.value.trim(),
      content: content.value,
    });
  } finally {
    isSaving.value = false;
  }
}

/**
 * Закрытие по Escape
 */
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close();
  }
}

// Подписываемся на клавиатуру когда модалка открыта
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeydown);
      // Блокируем прокрутку body
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = '';
    }
  }
);

// Очистка при размонтировании
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>

<template>
  <!-- Teleport рендерит контент в конце body -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="close">
        <div class="modal-container">
          <!-- Шапка -->
          <header class="modal-header">
            <h2>{{ modalTitle }}</h2>
            <button class="close-btn" @click="close" title="Закрыть">
              ✕
            </button>
          </header>

          <!-- Форма -->
          <div class="modal-body">
            <!-- Поле заголовка -->
            <div class="form-group">
              <label for="note-title">Заголовок</label>
              <input
                id="note-title"
                v-model="title"
                type="text"
                placeholder="Название заметки..."
                class="title-input"
                autofocus
              />
            </div>

            <!-- WYSIWYG редактор (только на клиенте, т.к. Tiptap не совместим с SSR) -->
            <div class="form-group">
              <label>Содержимое</label>
              <ClientOnly>
                <TiptapEditor 
                  v-model="content" 
                  placeholder="Начните писать заметку..."
                />
                <template #fallback>
                  <div class="editor-placeholder">Загрузка редактора...</div>
                </template>
              </ClientOnly>
            </div>
          </div>

          <!-- Футер с кнопками -->
          <footer class="modal-footer">
            <button class="btn btn-secondary" @click="close">
              Отмена
            </button>
            <button 
              class="btn btn-primary" 
              :disabled="isSaving || !title.trim()"
              @click="save"
            >
              {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Overlay - затемнённый фон */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

/* Контейнер модалки */
.modal-container {
  background: var(--modal-bg, #1a1a1a);
  border: 1px solid var(--border-color, #3a3a3a);
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

/* Шапка */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color, #3a3a3a);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-color, #f0f0f0);
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-muted, #888);
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.15s, color 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: var(--hover-bg, #333);
  color: var(--text-color, #f0f0f0);
}

/* Тело модалки */
.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: var(--text-muted, #a0a0a0);
  font-weight: 500;
}

.title-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-color, #3a3a3a);
  border-radius: 8px;
  background: var(--input-bg, #252525);
  color: var(--text-color, #f0f0f0);
  font-size: 1rem;
  transition: border-color 0.15s;
}

.title-input:focus {
  outline: none;
  border-color: var(--accent-color, #7c9eff);
}

.title-input::placeholder {
  color: var(--placeholder-color, #666);
}

.editor-placeholder {
  border: 1px solid var(--border-color, #3a3a3a);
  border-radius: 8px;
  background: var(--editor-bg, #1a1a1a);
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted, #666);
}

/* Футер */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--border-color, #3a3a3a);
}

/* Кнопки */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s, opacity 0.15s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--btn-secondary-bg, #333);
  color: var(--text-color, #f0f0f0);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--btn-secondary-hover, #444);
}

.btn-primary {
  background: var(--accent-color, #7c9eff);
  color: #000;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-hover, #9db8ff);
}

/* Анимация появления/исчезновения */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95) translateY(10px);
}
</style>

