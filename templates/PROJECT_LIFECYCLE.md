# PROJECT_LIFECYCLE.md — Envie
# Личный рабочий штаб: заметки + идеи + канбан + шаблоны + обои
# Стек: React/Vite/TS/FSD + Java Spring Boot + PostgreSQL
# Автор: murat / m_orynbassarr

---

## Как использовать

1. Скинь этот файл AI-кодеру в начале сессии.
2. AI читает "Текущее состояние" → находит фазу → действует по чеклисту.
3. Статусы: `[ ]` не начато / `[~]` в процессе / `[x]` готово / `[-]` пропущено осознанно

---

## Текущее состояние

```
Проект: Envie
Фаза: 1 — Идея и фундамент
Подфаза: 1.1 — Идея и скоуп
Дата обновления: 2026-08-04
Blocker: нет
Следующий шаг: scaffold бэкенда и фронтенда, первая миграция
```

---

## ФАЗА 1 — ИДЕЯ И ФУНДАМЕНТ

> Цель: зафиксировать идею, выбрать стек, подготовить окружение. Никакого кода продукта.

### 1.1 Идея и скоуп

- [x] **Что за продукт:**
  Envie — личный рабочий штаб для одного пользователя (без авторизации).
  Место где живут идеи новых проектов, заметки в стиле твиттера, канбан-доска задач,
  шаблоны для AI-промптов, и страница с обоями/гифками с локального диска.
  Цель — структурировать мысли, фиксировать прогресс, делать отчёты для папы.

- [x] **Пользователи и роли:**
  Один пользователь — сам автор. Авторизация не нужна. Роли не нужны.

- [x] **MVP (что входит):**
  1. Лента заметок — главная страница в стиле твиттера: короткий пост + медиа + теги.
     Внутри поста — полная заметка с текстом и прикреплёнными документами.
  2. Канбан-доска — карточки задач с подзадачами. Без стадий, просто карточки.
  3. Список идей — карточки идей проектов + AI-генерация архитектуры по шаблону.
  4. Шаблоны — просмотр и редактирование MD-файлов: промпты, планы, шаблоны проектов.
  5. Страница обоев/гифок — загрузка файлов с локального диска, отображение как wallpaper engine.

- [x] **Out of scope (MVP):**
  - Авторизация и мультипользовательность
  - Облачный деплой (только localhost)
  - Уведомления, напоминания
  - Мобильная версия
  - Экспорт/импорт данных

- [x] **Масштаб:** 1 пользователь, локально. Нагрузки нет.

### 1.2 Анализ рынка и конкурентов

- [x] **Аналоги:**
  - Notion — перегружен, не заточен под идеи разработчика
  - Obsidian — только MD, нет канбана и ленты
  - Linear — только задачи, нет заметок и идей
  - Twitter/Threads — только лента, нет структуры для проектов

- [x] **Отличие:** Всё в одном месте, заточено под соло-разработчика,
  структура как у реального продукта (Spring + FSD), без лишнего.

- [x] **Аудитория:** Один конкретный человек — автор.

### 1.3 Выбор стека

- [x] **Frontend:** React 18 + Vite + TypeScript + Tailwind v4 + Feature-Sliced Design
  — тот же стек что в JF-1C, переиспользуем паттерны без раскачки
- [x] **Backend:** Java 21 + Spring Boot 3 + Spring Data JPA
  — тот же стек что в JF-1C, модульный монолит
- [x] **БД:** PostgreSQL — реляционная, знакома, миграции через Flyway
- [x] **Хранилище файлов:** локальный диск (uploads папка в backend)
  — деплой только localhost, S3 не нужен
- [x] **Деплой:** localhost only. Никакого CI/CD на старте.
- [x] **API:** REST, /api/v1/

### 1.4 Архитектурные решения

- [x] **Монолит** — проект маленький, один пользователь, монолит единственный вариант
- [x] **Модули backend:**
  - `notes` — лента заметок (посты + медиа + теги)
  - `board` — канбан (карточки + подзадачи)
  - `ideas` — список идей + AI-генерация архитектуры
  - `templates` — MD шаблоны (CRUD)
  - `wallpaper` — загрузка и отдача медиафайлов с диска
  - `shared` — общие утилиты, ApiResponse, исключения
- [x] **Frontend FSD:**
  - `pages:` FeedPage, BoardPage, IdeasPage, TemplatesPage, WallpaperPage
  - `widgets:` NoteCard, IdeaCard, TaskCard, TemplateViewer, MediaPlayer
  - `features:` createNote, createIdea, createTask, generateArchitecture, uploadMedia
  - `entities:` note, idea, task, template, media
  - `shared:` api, ui-kit, lib, config
- [x] **Миграции:** Flyway, ddl-auto=validate в dev, никогда create/update
- [x] **Версионирование API:** /api/v1/ с первого дня

### 1.5 Репозиторий и окружение

- [x] **Структура репозитория:**
  ```
  Envie/
  ├── backend/                  # Spring Boot
  │   ├── src/main/java/kz/envie/
  │   │   ├── notes/
  │   │   │   ├── controller/
  │   │   │   ├── service/
  │   │   │   ├── repository/
  │   │   │   └── dto/
  │   │   ├── board/
  │   │   ├── ideas/
  │   │   ├── templates/
  │   │   ├── wallpaper/
  │   │   └── shared/
  │   ├── src/main/resources/
  │   │   ├── db/migration/     # Flyway
  │   │   └── application.yml
  │   └── uploads/              # локальные файлы
  ├── frontend/                 # React/Vite/FSD
  │   ├── src/
  │   │   ├── pages/
  │   │   ├── widgets/
  │   │   ├── features/
  │   │   ├── entities/
  │   │   └── shared/
  │   └── .env.local
  ├── templates/                # MD шаблоны
  │   ├── IDEA.md
  │   ├── NOTE.md
  │   ├── WEEKLY.md
  │   ├── REPORT.md
  │   └── AI_IDEA_PROMPT.md
  ├── .gitignore
  └── README.md
  ```
- [x] Git init, .gitignore настроен (node_modules, target/, .env, uploads/)
- [x] README.md минимальный (что это, как запустить)
- [x] Секретов нет в коде с первого коммита

---

## ФАЗА 2 — СКЕЛЕТ И ЗАПУСК

> Цель: проект запускается локально, фронт и бэк общаются. Ничего больше.
> Авторизация НЕ нужна — пропускаем Auth модуль полностью.

### 2.1 Backend скелет

- [x] Проект создан через Spring Initializr (Java 21, Spring Boot 3, Web, JPA, PostgreSQL, Flyway, Lombok)
- [x] application.yml настроен: datasource, flyway, ddl-auto=validate
- [x] Первая миграция V1__init.sql создана (пустая, но рабочая)
- [x] Health endpoint `/actuator/health` отвечает
- [x] GlobalExceptionHandler настроен — все ошибки в ApiResponse<T>
- [x] Логирование через SLF4J/Logback, не System.out.println
- [x] CORS настроен на http://localhost:5173

### 2.2 Frontend скелет

- [x] Проект создан: `npm create vite@latest frontend -- --template react-ts`
- [x] Зависимости: tailwindcss v4, react-router-dom, axios, @tanstack/react-query
- [x] FSD структура папок создана (pages/widgets/features/entities/shared)
- [x] Роутинг настроен: 5 маршрутов (/, /board, /ideas, /templates, /wallpaper)
- [x] API клиент настроен: axios instance с baseURL из VITE_API_URL
- [x] .env.local: VITE_API_URL=http://localhost:8080/api/v1
- [x] Сборка проходит без ошибок: `npm run build`

### 2.3 Проверка связки

- [x] Фронт делает запрос к `/actuator/health` и получает 200
- [x] Нет CORS ошибок в консоли

---

## ФАЗА 3 — CORE МОДУЛИ (MVP)

> Цель: все 5 модулей работают end-to-end.
> Порядок: notes → board → ideas → templates → wallpaper

### 3.1 Модуль: Notes (лента заметок)

**БД миграция:**
- [ ] V2__notes.sql: таблицы `notes`, `note_media`, `note_tags`
  ```sql
  notes: id, content, created_at, updated_at, pinned
  note_media: id, note_id, file_path, media_type, original_name
  note_tags: id, note_id, tag
  ```

**Backend:**
- [ ] NoteEntity, NoteMediaEntity, NoteTagEntity
- [ ] NoteRepository (JPA)
- [ ] NoteService: createNote, getNotes (пагинация), getNoteById, updateNote, deleteNote, togglePin
- [ ] NoteController: GET /api/v1/notes, POST /api/v1/notes, PUT /api/v1/notes/{id}, DELETE /api/v1/notes/{id}
- [ ] NoteDto, CreateNoteRequest, NoteResponse
- [ ] Медиа: POST /api/v1/notes/{id}/media — сохраняет файл на диск, путь в БД
- [ ] GET /api/v1/media/{filename} — отдаёт файл с диска

**Frontend:**
- [ ] entities/note: типы, api-методы
- [ ] features/createNote: форма (текст + загрузка медиа + теги)
- [ ] widgets/NoteCard: карточка поста (твиттер-стиль)
- [ ] pages/FeedPage: лента карточек + кнопка создать
- [ ] Внутри карточки: раскрытие полной заметки с документами

### 3.2 Модуль: Board (канбан)

**БД миграция:**
- [ ] V3__board.sql: таблицы `tasks`, `subtasks`
  ```sql
  tasks: id, title, description, created_at, updated_at
  subtasks: id, task_id, title, done, created_at
  ```

**Backend:**
- [ ] TaskEntity, SubtaskEntity
- [ ] TaskService: CRUD задач + CRUD подзадач
- [ ] TaskController: GET /api/v1/tasks, POST /api/v1/tasks, PUT /api/v1/tasks/{id}, DELETE /api/v1/tasks/{id}
- [ ] SubtaskController: POST /api/v1/tasks/{id}/subtasks, PUT /api/v1/subtasks/{id}, DELETE /api/v1/subtasks/{id}

**Frontend:**
- [ ] entities/task: типы, api-методы
- [ ] features/createTask, features/createSubtask
- [ ] widgets/TaskCard: карточка с подзадачами (чекбоксы)
- [ ] pages/BoardPage: сетка карточек + создать карточку

### 3.3 Модуль: Ideas (список идей)

**БД миграция:**
- [ ] V4__ideas.sql: таблица `ideas`
  ```sql
  ideas: id, title, summary, problem, solution, audience, monetization,
         status (RAW/EXPLORING/ACCEPTED/REJECTED), ai_architecture, created_at, updated_at
  ```

**Backend:**
- [ ] IdeaEntity, IdeaStatus enum
- [ ] IdeaService: CRUD + generateArchitecture (вызов Anthropic API)
- [ ] IdeaController: GET /api/v1/ideas, POST /api/v1/ideas, PUT /api/v1/ideas/{id},
  DELETE /api/v1/ideas/{id}, POST /api/v1/ideas/{id}/generate-architecture
- [ ] Anthropic API интеграция: POST запрос к api.anthropic.com/v1/messages
  — ключ из application.yml (env var ANTHROPIC_API_KEY)
  — промпт берётся из AI_IDEA_PROMPT.md шаблона
  — результат сохраняется в ideas.ai_architecture

**Frontend:**
- [ ] entities/idea: типы, api-методы
- [ ] features/createIdea, features/generateArchitecture
- [ ] widgets/IdeaCard: карточка идеи + кнопка "Сгенерировать архитектуру"
- [ ] pages/IdeasPage: список карточек + форма создания

### 3.4 Модуль: Templates (MD шаблоны)

**Подход:** шаблоны хранятся как файлы в папке `templates/` на диске, не в БД.
Backend только читает и отдаёт их. Редактирование — опционально.

**Backend:**
- [ ] TemplateController: GET /api/v1/templates — список файлов из папки
- [ ] GET /api/v1/templates/{name} — содержимое файла
- [ ] PUT /api/v1/templates/{name} — сохранить изменения (опционально)

**Frontend:**
- [ ] entities/template: типы, api-методы
- [ ] widgets/TemplateViewer: MD рендеринг (react-markdown)
- [ ] pages/TemplatesPage: список шаблонов слева, просмотр/редактирование справа

### 3.5 Модуль: Wallpaper (обои/гифки)

**Подход:** файлы загружаются с компа, хранятся в `uploads/wallpapers/`.
Один активный файл отображается как фон.

**БД миграция:**
- [ ] V5__wallpapers.sql: таблица `wallpapers`
  ```sql
  wallpapers: id, file_path, original_name, media_type, active, created_at
  ```

**Backend:**
- [ ] WallpaperEntity
- [ ] WallpaperService: uploadWallpaper, getWallpapers, setActive, delete
- [ ] WallpaperController: GET /api/v1/wallpapers, POST /api/v1/wallpapers,
  PUT /api/v1/wallpapers/{id}/activate, DELETE /api/v1/wallpapers/{id}
- [ ] Поддержка: .jpg, .png, .gif, .webp, .mp4

**Frontend:**
- [ ] entities/wallpaper: типы, api-методы
- [ ] features/uploadWallpaper
- [ ] pages/WallpaperPage: галерея + кнопка активации + превью активного обоя

---

## ФАЗА 4 — БЕЗОПАСНОСТЬ

> Минимальный чеклист для локального приложения без авторизации.

### 4.1 Backend

- [ ] Загрузка файлов: проверка MIME (только изображения/gif/mp4)
- [ ] Блокировка опасных расширений (.exe, .sh, .bat, .js в uploads)
- [ ] Нет raw stack trace в ответах API (GlobalExceptionHandler закрывает)
- [ ] ANTHROPIC_API_KEY только в env vars, не в коде и не в git
- [ ] .gitignore покрывает: .env, application-local.yml, uploads/

### 4.2 Frontend

- [ ] Нет console.log с чувствительными данными
- [ ] API ключи не попадают в frontend-код

---

## ФАЗА 5 — КАЧЕСТВО

> Минимальный уровень для соло-проекта.

### 5.1 Backend

- [ ] Smoke-тест: каждый эндпоинт возвращает ожидаемый статус
- [ ] Нет N+1 в getNotes (fetch с media и tags одним запросом)
- [ ] Нет SQL-инъекций (только JPA/параметризованные запросы)

### 5.2 Frontend

- [ ] Нет падений при пустых данных (пустая лента, пустая доска)
- [ ] Загрузка файлов: есть индикатор прогресса
- [ ] Ошибки API отображаются пользователю, не только в консоли

### 5.3 Код

- [ ] Нет дублирования API-вызовов (всё через entities/*/api.ts)
- [ ] Нет TODO/FIXME без комментария

---

## ФАЗА 6 — РАСШИРЕНИЕ (после MVP)

> Что добавить после того как MVP стабилен.

### Кандидаты на расширение:
- [ ] Поиск по заметкам и идеям
- [ ] Экспорт заметки/идеи в MD файл
- [ ] Тёмная/светлая тема
- [ ] Drag-and-drop порядка карточек на доске
- [ ] AI-чат внутри идеи (история диалога с Claude)
- [ ] Связи между идеями и заметками (теги / [[links]])

---

## ПРИЛОЖЕНИЕ A — Чеклист перед каждым коммитом

- [ ] Код компилируется без ошибок
- [ ] Нет секретов в изменениях (`git diff` — проверь)
- [ ] Нет отладочных логов
- [ ] Flyway миграции не редактировались (только новые файлы)

---

## ПРИЛОЖЕНИЕ B — Схема БД (итоговая)

```
notes          note_media      note_tags
────────       ──────────      ─────────
id             id              id
content        note_id ──┐     note_id ──┐
created_at     file_path  │     tag       │
updated_at     media_type │               │
pinned         orig_name  │               │
               └──────────┘     └─────────┘

tasks          subtasks
──────         ────────
id             id
title          task_id
description    title
created_at     done
updated_at     created_at

ideas
─────
id
title
summary
problem
solution
audience
monetization
status
ai_architecture
created_at
updated_at

wallpapers
──────────
id
file_path
original_name
media_type
active
created_at
```

---

## ПРИЛОЖЕНИЕ C — Переменные окружения

**Backend (application.yml / env vars):**
```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/envie
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=...
ANTHROPIC_API_KEY=sk-ant-...
UPLOAD_DIR=./uploads
TEMPLATES_DIR=../templates
```

**Frontend (.env.local):**
```
VITE_API_URL=http://localhost:8080/api/v1
```
