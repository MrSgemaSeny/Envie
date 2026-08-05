# Envie

> Личный штаб. Notes · Board · Ideas · Templates · Wallpaper — всё в одном месте, у тебя на компьютере.

Привет! Envie — это локальное приложение, которое я делаю для себя: фиксировать идеи, вести задачи и держать заметки в одном окне, без необходимости открывать пять разных сервисов. Никакой регистрации, никакого облака — всё крутится у тебя на машине и пишет данные в твою же локальную базу.

Если ты клонировал репозиторий, чтобы посмотреть, как это устроено, или поднять у себя — этот README проведёт тебя через весь путь: что тут вообще есть, как это работает изнутри и как это запустить с нуля.

---

## Что здесь есть

Приложение состоит из шести модулей. Из них полностью рабочие — пять, шестой (видео/гиф-обои) сейчас в процессе.

| Модуль | Что делает | Статус |
|---|---|---|
| **Notes** | Заметки с тегами, вложениями (фото/файлы) и возможностью закрепить наверх | Готово |
| **Board** | Задачи с подзадачами внутри каждой карточки — «подзадача = фаза» | Готово |
| **Ideas** | База идей: проблема, решение, аудитория, монетизация + статус (`RAW → EXPLORING → ACCEPTED/REJECTED`) | Готово |
| **Templates** | Просмотр и редактирование MD-шаблонов и промптов прямо из папки на диске | Готово |
| **Wallpaper** | Кастомные обои рабочего пространства, до 50MB на файл | Готово для картинок, видео и гифки — доделываются |
| **Dashboard** | Точка входа с навигацией по всем модулям | Готово |

Раньше в планах была ещё генерация архитектуры идеи через AI (Anthropic API) — от неё отказались осознанно: для двух человек, которые ведут заметки для себя, это было лишним слоем сложности. Если интересно, в миграциях БД остался след этого решения (`V5__remove_ai_architecture.sql`).

---

## Как это устроено технически

### Backend
- **Java 21 + Spring Boot 3** — простой REST API, без лишней магии
- **PostgreSQL** — вся структурированная информация (заметки, задачи, идеи, обои) живёт тут
- **Flyway** — миграции схемы БД, по одной пачке SQL на каждый новый модуль (`V1` → `V6`); это значит, что схема никогда не создаётся "магически" через `ddl-auto`, а версионируется как код
- **Spring Data JPA + Hibernate** — ORM-слой
- **Spring Actuator** — health-check, фронт дёргает его при старте и показывает тост, если бэкенд не поднялся
- **Multipart upload** — файлы (заметки, обои) до 50MB через `FileStorageService`, хранятся на диске, в БД — только путь

### Frontend
- **React + TypeScript + Vite**
- **Feature-Sliced Design (FSD)** — код разложен по слоям `entities / features / widgets / pages`, а не свален в одну папку `components`
- **TanStack Query** — кеш запросов, мутации, инвалидация — без ручного управления состоянием загрузки
- **Axios** — HTTP-клиент
- **React Router** — навигация, приложение живёт под `basename="/Envie"`
- **Sonner** — toast-уведомления
- **Tailwind CSS** — стилизация

### Почему архитектура именно такая
Каждый модуль на бэкенде — это отдельный Java-пакет (`notes`, `board`, `ideas`, `templates`, `wallpaper`), и внутри у каждого свой контроллер, сервис, репозиторий и сущность. Модули друг друга не трогают напрямую. Это не "энтерпрайз ради энтерпрайза" — просто так проще добавлять новый модуль, не боясь что-то сломать в существующих: скопировал структуру пакета, завёл миграцию, готово.

---

## Структура проекта

```
Envie/
├── backend/                                # Spring Boot backend
│   └── src/main/
│       ├── java/kz/envie/
│       │   ├── EnvieBackendApplication.java
│       │   ├── config/
│       │   │   └── WebConfig.java              # CORS
│       │   ├── shared/
│       │   │   ├── ApiResponse.java            # Обёртка { data, message }
│       │   │   ├── GlobalExceptionHandler.java
│       │   │   └── exception/ResourceNotFoundException.java
│       │   ├── notes/                          # Заметки
│       │   │   ├── controller/  (NoteController, MediaController)
│       │   │   ├── service/     (NoteService, FileStorageService)
│       │   │   ├── entity/      (NoteEntity, NoteTagEntity, NoteMediaEntity)
│       │   │   ├── dto/  └ repository/
│       │   ├── board/                          # Задачи
│       │   │   ├── controller/  (TaskController, SubtaskController)
│       │   │   ├── service/     (TaskService)
│       │   │   ├── entity/      (TaskEntity, SubtaskEntity)
│       │   │   ├── dto/  └ repository/
│       │   ├── ideas/                          # Идеи
│       │   │   ├── controller/  (IdeaController)
│       │   │   ├── service/     (IdeaService)
│       │   │   ├── entity/      (IdeaEntity, IdeaStatus)
│       │   │   ├── dto/  └ repository/
│       │   ├── templates/                      # MD-шаблоны (читает файлы с диска, без БД)
│       │   │   ├── controller/  (TemplateController)
│       │   │   ├── service/     (TemplateService)
│       │   │   └── dto/
│       │   └── wallpaper/                      # Обои
│       │       ├── WallpaperController.java
│       │       ├── WallpaperService.java
│       │       ├── WallpaperRepository.java
│       │       ├── WallpaperEntity.java
│       │       └── WallpaperDto.java
│       └── resources/
│           ├── application.properties
│           └── db/migration/
│               ├── V1__init.sql
│               ├── V2__notes.sql
│               ├── V3__board.sql
│               ├── V4__ideas.sql
│               ├── V5__remove_ai_architecture.sql
│               └── V6__wallpaper.sql
│
└── frontend/                          # React frontend
    └── src/
        ├── App.tsx                    # Layout + роутер
        ├── main.tsx                   # QueryClient + StrictMode
        ├── index.css                  # Tailwind + CSS-переменные темы
        ├── shared/api/client.ts       # axios instance → VITE_API_URL
        ├── entities/                  # Доменные типы + API-хуки
        │   ├── note/  ├ task/  ├ idea/  ├ template/  └ wallpaper/
        ├── features/                  # Формы и юзкейсы
        │   ├── createNote/  ├ createTask/  ├ createSubtask/  └ createIdea/
        ├── widgets/                   # Карточки-компоненты
        │   ├── NoteCard/  ├ TaskCard/  ├ IdeaCard/  └ TemplateViewer/
        └── pages/
            ├── LandingPage/  ├ DashboardPage/  ├ FeedPage/
            ├── BoardPage/  ├ IdeasPage/  ├ TemplatesPage/  └ WallpaperPage/
```

---

## API

Base URL: `http://localhost:8080/api/v1`

Все ответы завёрнуты в один формат: `{ "data": ..., "message": "..." }` — это `ApiResponse`, единый контракт для всего API.

### Notes

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/notes` | Список заметок (закреплённые — первыми) |
| `POST` | `/notes` | Создать заметку (`multipart/form-data`: `content`, `tags`, `files[]`) |
| `PUT` | `/notes/{id}/pin` | Закрепить / открепить |
| `DELETE` | `/notes/{id}` | Удалить заметку |
| `GET` | `/media/{filename}` | Отдать файл (заметки и обои используют один и тот же MediaController) |

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
| `PUT` | `/ideas/{id}` | Обновить идею (в том числе статус) |
| `DELETE` | `/ideas/{id}` | Удалить идею |

### Templates

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/templates` | Список `.md`-файлов из папки шаблонов |
| `GET` | `/templates/{name}` | Содержимое конкретного шаблона |
| `PUT` | `/templates/{name}` | Перезаписать содержимое |

### Wallpaper

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/wallpapers` | Список загруженных обоев |
| `GET` | `/wallpapers/active` | Текущий активный фон |
| `POST` | `/wallpapers` | Загрузить файл (до 50MB) |
| `PUT` | `/wallpapers/{id}/activate` | Сделать активным |
| `PUT` | `/wallpapers/deactivate` | Сбросить фон |
| `DELETE` | `/wallpapers/{id}` | Удалить |

### Служебные

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/actuator/health` | Health-check, фронт проверяет при старте |

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

-- wallpaper (V6)
wallpapers    { id, filename, original_name, is_active, created_at }
```

Templates не хранятся в БД — это обычные `.md`-файлы на диске, сервис просто читает и пишет папку.

---

## Локальный запуск

Ниже — пошагово, с объяснением, зачем каждый шаг нужен, а не просто список команд.

### Что понадобится
- **Java 21+** — на нём написан бэкенд
- **Node.js 20+** — для сборки и запуска фронтенда
- **PostgreSQL 15+** — единственная внешняя зависимость; всё остальное (файлы, шаблоны) лежит прямо в файловой системе

### 1. Поднять базу данных

Приложению нужна база и пользователь с доступом к ней. Захардкоженных кредов в коде больше нет — заводишь свои:

```sql
CREATE DATABASE envie;
CREATE USER envie_app WITH PASSWORD 'придумай-свой-пароль';
GRANT ALL PRIVILEGES ON DATABASE envie TO envie_app;
```

Имя базы, пользователя и пароль — на твоё усмотрение, главное — передать их бэкенду на следующем шаге (иначе он попробует достучаться до дефолтных `localhost:5432/envie` без пароля и упадёт при старте).

### 2. Backend

Все параметры подключения передаются через переменные окружения — так безопасный пароль не оказывается закоммиченным в репозиторий:

```bash
cd backend

SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/envie \
SPRING_DATASOURCE_USERNAME=envie_app \
SPRING_DATASOURCE_PASSWORD=твой-пароль \
./gradlew bootRun
```

При старте Flyway сам прогонит все миграции (`V1` → `V6`) и создаст нужные таблицы — руками ничего накатывать не нужно.

Бэкенд поднимется на `http://localhost:8080`. Проверить, что всё живо: `http://localhost:8080/api/v1/actuator/health` должен ответить `{"status":"UP"}`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Фронтенд поднимется на `http://localhost:5173`.

По умолчанию API-клиент смотрит на `http://localhost:8080/api/v1`. Если у тебя бэкенд крутится на другом порту или хосте — переопредели через `.env` в папке `frontend`:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

**Важный нюанс:** CORS на бэкенде (`WebConfig.java`) сейчас разрешён только для `http://localhost:5173`. Если фронтенд у тебя почему-то поднялся на другом порту — запросы к API будут падать с CORS-ошибкой в консоли браузера. Либо запускай фронт строго на 5173, либо поправь `WebConfig.java` под свой порт.

---

## Конфигурация

Все параметры бэкенда переопределяются через переменные окружения:

| Переменная | По умолчанию | Описание |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/envie` | JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | — | Пользователь БД, задаётся при поднятии базы |
| `SPRING_DATASOURCE_PASSWORD` | — | Пароль БД, задаётся при поднятии базы |
| `UPLOAD_DIR` | `./uploads` | Папка для загружаемых файлов (заметки, обои) |
| `TEMPLATES_DIR` | `../templates` | Папка с MD-шаблонами |

---

## Что в планах

- [ ] **Wallpaper: видео и гифки** — сейчас можно загружать только картинки, добавляется проигрывание `video/*` в реальном времени
- [ ] **Редактирование заметок** — inline edit контента и тегов, сейчас можно только создавать/пинить/удалять

Осознанно НЕ в планах: авторизация, деплой в облако, мультипользовательский режим и AI-генерация архитектуры идей — для локального личного инструмента это лишний вес, а не польза.

---

## .gitignore рекомендации

```gitignore
# Загруженные файлы — не коммитить
uploads/

# Локальные секреты
.env
*.env.local
```
