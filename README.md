# Envie

> Personal headquarters. Notes · Board · Ideas — all in one place.

Envie — локальное приложение-штаб для управления мыслями, задачами и идеями. Без авторизации, без облака, без лишнего.

---

## Что внутри

| Раздел | Что делает |
|---|---|
| **Notes** | Лента заметок с тегами, медиа (фото/файлы) и пином |
| **Board** | Список задач с подзадачами и чекбоксами |
| **Ideas** | База идей со структурированным описанием (проблема, решение, аудитория, монетизация) и статусами |
| **Templates** | MD-шаблоны и промпты *(placeholder, в разработке)* |
| **Wallpaper** | Страница с обоями/гифками *(placeholder, в разработке)* |
| **Dashboard** | Главная — точка входа с навигацией |

---

## Стек

### Backend
- **Java 21 + Spring Boot 3**
- **PostgreSQL** — основная БД
- **Flyway** — миграции схемы (`V1` → `V5`)
- **Spring Data JPA + Hibernate** — ORM
- **Spring Actuator** — health-check (`/api/v1/actuator/health`)
- **Multipart upload** — файлы до 50MB через `FileStorageService`

### Frontend
- **React 18 + TypeScript + Vite**
- **FSD (Feature-Sliced Design)** — архитектура слоёв
- **TanStack Query** — server state, кеш, мутации
- **Axios** — HTTP-клиент
- **React Router v6** — навигация с `basename="/Envie"`
- **Sonner** — toast-уведомления
- **Tailwind CSS v4** — стилизация

---

## Структура проекта

```
envie/
├── src/                              # Spring Boot backend
│   └── main/
│       ├── java/kz/envie/
│       │   ├── EnvieBackendApplication.java
│       │   ├── config/
│       │   │   └── WebConfig.java          # CORS
│       │   ├── shared/
│       │   │   ├── ApiResponse.java        # Обёртка { data, message }
│       │   │   ├── GlobalExceptionHandler.java
│       │   │   └── exception/
│       │   │       └── ResourceNotFoundException.java
│       │   ├── notes/                      # Модуль заметок
│       │   │   ├── controller/
│       │   │   │   ├── NoteController.java
│       │   │   │   └── MediaController.java
│       │   │   ├── service/
│       │   │   │   ├── NoteService.java
│       │   │   │   └── FileStorageService.java
│       │   │   ├── entity/
│       │   │   │   ├── NoteEntity.java
│       │   │   │   ├── NoteTagEntity.java
│       │   │   │   └── NoteMediaEntity.java
│       │   │   ├── dto/
│       │   │   └── repository/
│       │   ├── board/                      # Модуль задач
│       │   │   ├── controller/
│       │   │   │   ├── TaskController.java
│       │   │   │   └── SubtaskController.java
│       │   │   ├── service/TaskService.java
│       │   │   ├── entity/
│       │   │   │   ├── TaskEntity.java
│       │   │   │   └── SubtaskEntity.java
│       │   │   ├── dto/
│       │   │   └── repository/
│       │   └── ideas/                      # Модуль идей
│       │       ├── controller/IdeaController.java
│       │       ├── service/IdeaService.java
│       │       ├── entity/
│       │       │   ├── IdeaEntity.java
│       │       │   └── IdeaStatus.java     # RAW | EXPLORING | ACCEPTED | REJECTED
│       │       ├── dto/
│       │       └── repository/
│       └── resources/
│           ├── application.properties
│           └── db/migration/
│               ├── V1__init.sql
│               ├── V2__notes.sql
│               ├── V3__board.sql
│               ├── V4__ideas.sql
│               └── V5__remove_ai_architecture.sql
│
└── src_front/                        # React frontend
    ├── App.tsx                       # Layout + роутер
    ├── main.tsx                      # QueryClient + StrictMode
    ├── index.css                     # Tailwind + CSS-переменные темы
    ├── shared/
    │   └── api/client.ts             # axios instance → VITE_API_URL
    ├── entities/                     # Доменные типы + API-хуки
    │   ├── note/                     # useNotes, useCreateNote, useTogglePin, useDeleteNote
    │   ├── task/                     # useTasks, useCreateTask, useUpdateTask, useDeleteTask,
    │   │                             # useCreateSubtask, useUpdateSubtask, useDeleteSubtask
    │   └── idea/                     # useGetIdeas, useCreateIdea, useUpdateIdea, useDeleteIdea
    ├── features/                     # Юзкейсы (формы, дроуэры)
    │   ├── createNote/
    │   ├── createTask/
    │   ├── createSubtask/
    │   └── createIdea/
    ├── widgets/                      # Карточки-компоненты
    │   ├── NoteCard/
    │   ├── TaskCard/
    │   └── IdeaCard/
    └── pages/
        ├── DashboardPage/
        ├── FeedPage/
        ├── BoardPage/
        ├── IdeasPage/
        └── (Templates, Wallpaper — placeholder)
```

---

## API

Base URL: `http://localhost:8080/api/v1`

### Notes

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/notes` | Список заметок (pinned сначала, pageable) |
| `POST` | `/notes` | Создать заметку (`multipart/form-data`: `content`, `tags`, `files[]`) |
| `PUT` | `/notes/{id}/pin` | Переключить пин |
| `DELETE` | `/notes/{id}` | Удалить заметку |
| `GET` | `/notes/media/{filename}` | Получить файл из `uploads/` |

### Board

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/tasks` | Список задач с подзадачами |
| `POST` | `/tasks` | Создать задачу |
| `PUT` | `/tasks/{id}` | Обновить задачу |
| `DELETE` | `/tasks/{id}` | Удалить задачу |
| `POST` | `/tasks/{taskId}/subtasks` | Добавить подзадачу |
| `PUT` | `/subtasks/{id}` | Обновить подзадачу (title, done) |
| `DELETE` | `/subtasks/{id}` | Удалить подзадачу |

### Ideas

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/ideas` | Список идей |
| `POST` | `/ideas` | Создать идею |
| `PUT` | `/ideas/{id}` | Обновить идею |
| `DELETE` | `/ideas/{id}` | Удалить идею |

Статусы идеи: `RAW` → `EXPLORING` → `ACCEPTED` / `REJECTED`

### Служебные

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/actuator/health` | Health-check (фронт мониторит при старте) |

---

## Схема БД

```sql
-- notes (V2)
notes         { id, content, pinned, created_at, updated_at }
note_tags     { id, note_id → notes, tag }
note_media    { id, note_id → notes, file_path, media_type, original_name }

-- board (V3)
tasks         { id, title, description, created_at, updated_at }
subtasks      { id, task_id → tasks, title, done, created_at }

-- ideas (V4, V5)
ideas         { id, title, summary, problem, solution, audience, monetization, status, created_at, updated_at }
```

---

## Локальный запуск

### Требования
- Java 21+
- Node.js 20+
- PostgreSQL 15+

### 1. База данных

```sql
CREATE DATABASE envie;
CREATE USER test_user WITH PASSWORD 'pass1';
GRANT ALL PRIVILEGES ON DATABASE envie TO test_user;
```

### 2. Backend

```bash
cd backend
./gradlew bootRun

# Или с кастомными параметрами
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/envie \
SPRING_DATASOURCE_USERNAME=test_user \
SPRING_DATASOURCE_PASSWORD=pass1 \
./gradlew bootRun
```

Flyway автоматически применит миграции `V1`–`V5` при старте.

Бэкенд поднимается на `http://localhost:8080`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Фронтенд поднимается на `http://localhost:5173`.

По умолчанию API-клиент смотрит на `http://localhost:8080/api/v1`. Переопределить через `.env`:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

---

## Конфигурация

Все параметры бэкенда переопределяются через переменные окружения:

| Переменная | По умолчанию | Описание |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/envie` | JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | `test_user` | Пользователь БД |
| `SPRING_DATASOURCE_PASSWORD` | `pass1` | Пароль БД |
| `UPLOAD_DIR` | `./uploads` | Папка для загружаемых файлов |
| `TEMPLATES_DIR` | `../templates` | Папка с MD-шаблонами |
| `ANTHROPIC_API_KEY` | *(пусто)* | Ключ для AI-функций |

---

## Что в планах

- [ ] **Templates** — просмотр и редактирование MD-файлов из `templates/`
- [ ] **Wallpaper** — страница с локальными гифками/обоями
- [ ] **AI-план** — генерация архитектурного описания идеи через Anthropic API
- [ ] **Редактирование заметок** — inline edit контента и тегов
- [ ] **Kanban-режим** для Board — колонки вместо masonry-сетки

---

## .gitignore рекомендации

```gitignore
# Загруженные файлы — не коммитить
uploads/

# Локальные секреты
.env
*.env.local
```
