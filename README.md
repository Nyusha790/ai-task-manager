# AI Task Manager

AI Task Manager - учебное веб-приложение для управления задачами. Данные сохраняются в PostgreSQL. Дополнительный Python-скрипт выгружает все задачи в CSV-файл.

## Стек технологий

- Frontend: React + JavaScript.
- Backend: Node.js + Express.
- База данных: PostgreSQL.
- Дополнительно: Python.
- Контейнеризация: Docker + Docker Compose.
- Контроль версий: Git.

## Возможности

- создание задачи с названием и описанием;
- просмотр списка задач;
- изменение статуса через select;
- удаление задачи;
- отображение количества задач по статусам;
- экспорт задач в tasks.csv.

Статусы задач: new, in_progress, done.

## Описание файлов проекта

### Корень проекта

- `README.md` - описание проекта и инструкция по запуску.
- `.gitignore` - список файлов, которые не загружаются в GitHub.
- `.env.example` - пример настроек приложения и базы данных.
- `docker-compose.yml` - запуск PostgreSQL, backend и frontend в Docker.

### Backend

- `backend/Dockerfile` - сборка Docker-образа backend.
- `backend/.dockerignore` - исключения при сборке backend.
- `backend/package.json` - зависимости и команды Node.js.
- `backend/package-lock.json` - точные версии зависимостей backend.
- `backend/src/server.js` - запуск сервера.
- `backend/src/app.js` - настройка Express, маршрутов и middleware.
- `backend/src/config/db.js` - подключение к PostgreSQL.
- `backend/src/controllers/taskController.js` - получение, создание, изменение и удаление задач.
- `backend/src/routes/taskRoutes.js` - REST API-маршруты задач.
- `backend/src/middleware/asyncHandler.js` - обработка ошибок асинхронных функций.
- `backend/src/middleware/errorHandler.js` - обработка ошибок API и неизвестных маршрутов.

### База данных

- `database/init.sql` - создание таблицы tasks и её полей.

### Frontend

- `frontend/Dockerfile` - сборка Docker-образа frontend.
- `frontend/.dockerignore` - исключения при сборке frontend.
- `frontend/package.json` - зависимости и команды React/Vite.
- `frontend/package-lock.json` - точные версии зависимостей frontend.
- `frontend/index.html` - HTML-шаблон приложения.
- `frontend/vite.config.js` - настройки Vite.
- `frontend/src/main.jsx` - точка входа React-приложения.
- `frontend/src/App.jsx` - главный компонент и управление задачами.
- `frontend/src/api/tasks.js` - запросы frontend к backend.
- `frontend/src/components/TaskForm.jsx` - форма создания задачи.
- `frontend/src/components/TaskTable.jsx` - список задач, выбор статуса и удаление.
- `frontend/src/styles.css` - стили интерфейса.

### Python

- `scripts/export_tasks.py` - экспортирует задачи из PostgreSQL в CSV.
- `scripts/requirements.txt` - зависимости Python-скрипта.

## Запуск приложения

Для запуска должен быть установлен и запущен Docker Desktop.

### 1. Клонирование проекта

```powershell
git clone https://github.com/Nyusha790/ai-task-manager.git
cd ai-task-manager


## Проверка работы

1. Создайте задачу через форму.
2. Проверьте, что она появилась в списке.
3. Измените статус через выпадающий список.
4. Обновите страницу и проверьте сохранение статуса.
5. Удалите задачу.

### REST API

| Метод  | URL            | Что делает                          |
|--------|----------------|-------------------------------------|
| POST   | `/tasks`       | Создание задачи                     |
| GET    | `/tasks`       | Получение списка задач              |
| PUT    | `/tasks/:id`   | Изменение статуса                   |
| DELETE | `/tasks/:id`   | Удаление задачи                     |
| GET    | `/health`      | Проверка работоспособности backend  |

## Экспорт задач в CSV

Для экспорта должен быть установлен Python 3, а PostgreSQL должен быть запущен.

В корне проекта выполните:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r scripts/requirements.txt
python scripts/export_tasks.py



После выполнения в корне проекта появится файл tasks.csv.

 Остановка приложения
powershell
docker compose down
Полезные команды
Команда	Что делает
docker compose up -d --build	 Собрать и запустить все сервисы
docker ps	 Показать запущенные контейнеры
docker compose logs backend	 Логи backend
docker compose logs frontend  Логи frontend
docker compose logs db	 Логи базы данных
docker compose down	 Остановить все контейнеры
docker compose down -v	Остановить и удалить данные БД