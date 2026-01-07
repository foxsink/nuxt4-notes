<script setup lang="ts">
/**
 * TiptapEditor - WYSIWYG редактор на базе Tiptap
 * 
 * Tiptap - это headless редактор (без UI), мы сами создаём toolbar.
 * Основан на ProseMirror - мощном редакторе для работы с rich text.
 * 
 * Props:
 * - modelValue: HTML строка для двустороннего связывания (v-model)
 * - placeholder: текст-подсказка когда редактор пуст
 * 
 * Emits:
 * - update:modelValue: когда контент меняется
 */

import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

// Props с типизацией
const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

// Emit для v-model
const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

// Создаём экземпляр редактора
const editor = useEditor({
  // Расширения определяют возможности редактора
  extensions: [
    // StarterKit включает: bold, italic, strike, code, headings, lists, blockquote и др.
    StarterKit.configure({
      // Настройка заголовков - разрешаем только h2 и h3
      heading: {
        levels: [2, 3],
      },
    }),
    // Placeholder показывает подсказку в пустом редакторе
    Placeholder.configure({
      placeholder: props.placeholder || 'Начните писать...',
    }),
  ],
  // Начальный контент
  content: props.modelValue,
  // Колбэк при изменении контента
  onUpdate: ({ editor }) => {
    // Получаем HTML и отправляем родителю
    emit('update:modelValue', editor.getHTML());
  },
});

// Следим за внешними изменениями modelValue
// Это нужно когда родитель меняет контент программно
watch(
  () => props.modelValue,
  (newValue) => {
    // Проверяем что редактор существует и контент действительно изменился
    // (чтобы избежать бесконечного цикла)
    if (editor.value && editor.value.getHTML() !== newValue) {
      editor.value.commands.setContent(newValue, { emitUpdate: false });
    }
  }
);

// При размонтировании компонента уничтожаем редактор
onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<template>
  <div class="tiptap-editor">
    <!-- Toolbar с кнопками форматирования -->
    <div v-if="editor" class="toolbar">
      <!-- Кнопка Bold -->
      <button
        type="button"
        :class="{ active: editor.isActive('bold') }"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        @click="editor.chain().focus().toggleBold().run()"
        title="Жирный (Ctrl+B)"
      >
        <strong>B</strong>
      </button>

      <!-- Кнопка Italic -->
      <button
        type="button"
        :class="{ active: editor.isActive('italic') }"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        @click="editor.chain().focus().toggleItalic().run()"
        title="Курсив (Ctrl+I)"
      >
        <em>I</em>
      </button>

      <!-- Кнопка Strike (зачёркнутый) -->
      <button
        type="button"
        :class="{ active: editor.isActive('strike') }"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        @click="editor.chain().focus().toggleStrike().run()"
        title="Зачёркнутый"
      >
        <s>S</s>
      </button>

      <span class="divider" />

      <!-- Заголовок H2 -->
      <button
        type="button"
        :class="{ active: editor.isActive('heading', { level: 2 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        title="Заголовок 2"
      >
        H2
      </button>

      <!-- Заголовок H3 -->
      <button
        type="button"
        :class="{ active: editor.isActive('heading', { level: 3 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        title="Заголовок 3"
      >
        H3
      </button>

      <span class="divider" />

      <!-- Маркированный список -->
      <button
        type="button"
        :class="{ active: editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
        title="Маркированный список"
      >
        •
      </button>

      <!-- Нумерованный список -->
      <button
        type="button"
        :class="{ active: editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
        title="Нумерованный список"
      >
        1.
      </button>

      <span class="divider" />

      <!-- Цитата -->
      <button
        type="button"
        :class="{ active: editor.isActive('blockquote') }"
        @click="editor.chain().focus().toggleBlockquote().run()"
        title="Цитата"
      >
        "
      </button>

      <!-- Код -->
      <button
        type="button"
        :class="{ active: editor.isActive('code') }"
        :disabled="!editor.can().chain().focus().toggleCode().run()"
        @click="editor.chain().focus().toggleCode().run()"
        title="Код"
      >
        &lt;/&gt;
      </button>
    </div>

    <!-- Область редактирования -->
    <EditorContent :editor="editor" class="editor-content" />
  </div>
</template>

<style scoped>
.tiptap-editor {
  border: 1px solid var(--border-color, #3a3a3a);
  border-radius: 8px;
  overflow: hidden;
  background: var(--editor-bg, #1a1a1a);
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  background: var(--toolbar-bg, #252525);
  border-bottom: 1px solid var(--border-color, #3a3a3a);
}

.toolbar button {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--text-color, #e0e0e0);
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.15s, color 0.15s;
}

.toolbar button:hover:not(:disabled) {
  background: var(--hover-bg, #3a3a3a);
}

.toolbar button.active {
  background: var(--active-bg, #4a4a4a);
  color: var(--accent-color, #7c9eff);
}

.toolbar button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.divider {
  width: 1px;
  height: 24px;
  background: var(--border-color, #3a3a3a);
  margin: 0 4px;
  align-self: center;
}

.editor-content {
  padding: 16px;
  min-height: 200px;
  color: var(--text-color, #e0e0e0);
}

/* Стили для контента редактора */
.editor-content :deep(.tiptap) {
  outline: none;
  min-height: 180px;
}

.editor-content :deep(.tiptap p) {
  margin: 0 0 0.75em;
}

.editor-content :deep(.tiptap h2) {
  font-size: 1.5em;
  margin: 1em 0 0.5em;
}

.editor-content :deep(.tiptap h3) {
  font-size: 1.25em;
  margin: 1em 0 0.5em;
}

.editor-content :deep(.tiptap ul),
.editor-content :deep(.tiptap ol) {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.editor-content :deep(.tiptap blockquote) {
  border-left: 3px solid var(--accent-color, #7c9eff);
  padding-left: 1em;
  margin: 1em 0;
  opacity: 0.9;
}

.editor-content :deep(.tiptap code) {
  background: var(--code-bg, #2a2a2a);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
  font-size: 0.9em;
}

/* Placeholder стили */
.editor-content :deep(.tiptap p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: var(--placeholder-color, #666);
  pointer-events: none;
  height: 0;
}
</style>

