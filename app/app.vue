<script setup lang="ts">
/**
 * Корневой компонент приложения
 * 
 * NuxtPage - рендерит текущую страницу из pages/
 * NuxtRouteAnnouncer - для accessibility (объявляет изменения маршрута)
 */
</script>

<template>
  <div class="app">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<style>
/**
 * Глобальные стили и CSS переменные
 * 
 * Используем CSS Custom Properties (переменные) для:
 * - Единообразия цветов во всём приложении
 * - Возможности лёгкой смены темы
 * - Переиспользования в компонентах
 */

/* Подключаем шрифт */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

/* CSS переменные для тёмной темы */
:root {
  /* Цвета фона */
  --bg-color: #0d0d0d;
  --card-bg: #1a1a1a;
  --modal-bg: #1a1a1a;
  --editor-bg: #1a1a1a;
  --toolbar-bg: #252525;
  --input-bg: #252525;
  --code-bg: #2a2a2a;
  
  /* Цвета текста */
  --text-color: #f0f0f0;
  --text-muted: #888888;
  --placeholder-color: #555555;
  
  /* Акцентный цвет */
  --accent-color: #7c9eff;
  --accent-hover: #9db8ff;
  
  /* Границы */
  --border-color: #2a2a2a;
  
  /* Интерактивные элементы */
  --hover-bg: #333333;
  --active-bg: #404040;
  
  /* Кнопки */
  --btn-secondary-bg: #2a2a2a;
  --btn-secondary-hover: #3a3a3a;
}

/* Сброс стилей */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Базовые стили */
html {
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-color);
  background: var(--bg-color);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  min-height: 100vh;
  /* Градиентный фон для глубины */
  background: 
    radial-gradient(ellipse at top left, rgba(124, 158, 255, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, rgba(124, 158, 255, 0.03) 0%, transparent 50%),
    var(--bg-color);
}

/* Убираем стили ссылок по умолчанию */
a {
  color: inherit;
  text-decoration: none;
}

/* Стили для скроллбара */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-color);
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--hover-bg);
}

/* Выделение текста */
::selection {
  background: var(--accent-color);
  color: #000;
}
</style>
