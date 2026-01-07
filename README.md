# Nuxt 4 Notes App

Простое приложение для заметок с WYSIWYG редактором на базе **Nuxt 4**, **Prisma 7** и **Tiptap**.

## Стек технологий

- **Frontend**: Nuxt 4, Vue 3, TypeScript
- **Backend**: Nuxt Server API (Nitro)
- **База данных**: PostgreSQL + Prisma 7
- **Редактор**: Tiptap (ProseMirror)
- **Инфраструктура**: Docker, Docker Compose

## Возможности

- Создание, редактирование и удаление заметок
- WYSIWYG редактор с форматированием (bold, italic, заголовки, списки)
- Адаптивный интерфейс с тёмной темой
- REST API для CRUD операций
- Docker-ready для разработки и продакшена

## Быстрый старт

### С Docker (рекомендуется)

```bash
# Клонировать репозиторий
git clone https://github.com/YOUR_USERNAME/nuxt4-notes.git
cd nuxt4-notes

# Скопировать переменные окружения
cp .env.example .env

# Запустить в dev режиме
make dev

# Применить схему БД (в отдельном терминале)
npm run db:push
```

Открой http://localhost:3000

### Без Docker

```bash
# Установить зависимости
npm install

# Настроить PostgreSQL и создать .env файл
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/nuxt4"' > .env

# Применить схему к БД
npm run db:push

# Запустить dev сервер
npm run dev
```

## Команды Make

| Команда | Описание |
|---------|----------|
| `make dev` | Запуск dev режима с hot-reload |
| `make prod` | Запуск production |
| `make db` | Запустить только PostgreSQL |
| `make down` | Остановить контейнеры |
| `make logs` | Показать логи |
| `make db-cli` | Открыть psql консоль |
| `make help` | Показать все команды |

## Структура проекта

```
app/
├── app.vue                 # Корневой компонент
├── pages/
│   └── index.vue           # Главная страница
├── components/
│   ├── NoteCard.vue        # Карточка заметки
│   ├── NoteModal.vue       # Модальное окно редактирования
│   └── TiptapEditor.vue    # WYSIWYG редактор

server/
├── api/notes/              # REST API endpoints
│   ├── index.get.ts        # GET /api/notes
│   ├── index.post.ts       # POST /api/notes
│   ├── [id].get.ts         # GET /api/notes/:id
│   ├── [id].put.ts         # PUT /api/notes/:id
│   └── [id].delete.ts      # DELETE /api/notes/:id
└── utils/
    └── prisma.ts           # Prisma Client singleton

prisma/
└── schema.prisma           # Схема базы данных
```

## API Endpoints

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/notes` | Список всех заметок |
| POST | `/api/notes` | Создать заметку |
| GET | `/api/notes/:id` | Получить заметку |
| PUT | `/api/notes/:id` | Обновить заметку |
| DELETE | `/api/notes/:id` | Удалить заметку |

## Переменные окружения

```env
DATABASE_URL="postgresql://nuxt_user:password123@localhost:5432/nuxt4"
```

## Разработка

```bash
# Сгенерировать Prisma Client
npm run db:generate

# Создать миграцию
npm run db:migrate

# Открыть Prisma Studio
npm run db:studio
```

## Лицензия

MIT
