.PHONY: dev prod up down stop restart logs logs-app logs-db build clean ps shell shell-db db-cli help

# Цвета для вывода
YELLOW := \033[1;33m
GREEN := \033[1;32m
NC := \033[0m

help: ## Показать справку
	@echo "$(GREEN)Доступные команды:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

# ============================================
# Запуск
# ============================================

dev: ## Запустить в режиме разработки (с hot-reload)
	docker compose --profile dev up

dev-d: ## Запустить dev в фоне
	docker compose --profile dev up -d

prod: ## Запустить в production режиме
	docker compose --profile prod up --build

prod-d: ## Запустить prod в фоне
	docker compose --profile prod up -d --build

db: ## Запустить только PostgreSQL
	docker compose up postgres -d

# ============================================
# Остановка
# ============================================

down: ## Остановить и удалить контейнеры
	docker compose --profile dev --profile prod down

stop: ## Остановить контейнеры (без удаления)
	docker compose --profile dev --profile prod stop

restart: ## Перезапустить контейнеры
	docker compose --profile dev --profile prod restart

# ============================================
# Логи
# ============================================

logs: ## Показать логи всех контейнеров
	docker compose --profile dev --profile prod logs -f

logs-app: ## Показать логи приложения
	docker compose --profile dev --profile prod logs -f app-dev app-prod 2>/dev/null || true

logs-db: ## Показать логи PostgreSQL
	docker compose logs -f postgres

# ============================================
# Сборка и очистка
# ============================================

build: ## Пересобрать образы
	docker compose --profile dev --profile prod build

build-no-cache: ## Пересобрать образы без кэша
	docker compose --profile dev --profile prod build --no-cache

clean: ## Удалить контейнеры, volumes и образы
	docker compose --profile dev --profile prod down -v --rmi local

prune: ## Полная очистка Docker (осторожно!)
	docker system prune -af

# ============================================
# Prisma
# ============================================

db-generate: ## Сгенерировать Prisma Client
	npm run db:generate

db-push: ## Push схемы в базу (без миграций)
	npm run db:push

db-migrate: ## Создать и применить миграцию
	npm run db:migrate

db-studio: ## Открыть Prisma Studio
	npm run db:studio

# ============================================
# Утилиты
# ============================================

ps: ## Показать статус контейнеров
	docker compose --profile dev --profile prod ps -a

shell: ## Зайти в shell контейнера приложения (dev)
	docker compose --profile dev exec app-dev sh

shell-db: ## Зайти в shell PostgreSQL контейнера
	docker compose exec postgres sh

db-cli: ## Открыть psql консоль
	docker compose exec postgres psql -U nuxt_user -d nuxt4

# ============================================
# По умолчанию
# ============================================

.DEFAULT_GOAL := help

