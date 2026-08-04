# ENVIE — Архитектура, логика, функциональность
# Отдай этот файл AI-кодеру ПЕРВЫМ, вместе с ENVIE_DESIGN.md, CONTEXT.md,
# PROJECT_LIFECYCLE.md, STYLE_GUIDE.md. Этот файл объясняет ЧТО и ПОЧЕМУ,
# остальные — КАК именно кодить.

---

## Что такое Envie и зачем

Envie — личный рабочий штаб автора (murat), соло-разработчика. Один пользователь —
сам автор, авторизации нет и не будет, приложение работает только на localhost.

Это не финальный продукт для внешних пользователей. Это pet-проект с двумя ролями:
1. Инструмент, которым автор реально пользуется каждый день — заметки, задачи, идеи.
2. Основа/witness для отчётов перед его руководителем (отец, не в бизнес-смысле —
   человек, которому автор отчитывается о своих проектах и идеях).

**Жёсткий дедлайн: 3 дня на первую рабочую версию.** Это диктует порядок разработки —
см. "Порядок реализации" ниже. Не пытайся сделать все 5 модулей одинаково глубоко
за один проход, если не сказано иначе.

**Второй проект того же автора** — JF-1C / ZhanFinance (github.com/MrSgemaSeny/JF-1C),
SaaS CRM+бухгалтерия для бизнесов в Казахстане, тот же стек, тот же автор, тот же стиль
работы. Envie сознательно переиспользует его паттерны (FSD, тот же backend-стек,
те же git-конвенции) — если увидишь противоречие между этим файлом и общей интуицией
"как принято делать Spring+React проект", доверяй этому файлу и STYLE_GUIDE.md.

---

## Стек

| Слой | Технология |
|------|-----------|
| Backend | Java 21 + Spring Boot 3 + Spring Data JPA + PostgreSQL + Flyway |
| Frontend | React 19 + Vite + TypeScript + Tailwind v4 (без config-файла, `@theme` в CSS) + Feature-Sliced Design |
| Хранилище файлов | Локальный диск (`uploads/`), путь пишется в БД |
| API | REST, `/api/v1/` с первого дня |
| Деплой | localhost only, CI/CD не нужен на старте |

---

## Порядок реализации (приоритет, не опция)

Автор сам расставил приоритет: **основная идея — дневник/заметки, всё остальное вторично.**
Если не укладываешься в срок — режь по этому списку снизу вверх, не размазывай качество
по всем модулям поровну.

1. **Notes** (обязательно, ядро продукта)
2. **Board** + **Ideas** (важно, показывает продукт как "рабочий штаб", не просто ленту)
3. **Templates** (только просмотр, редактирование не обязательно — см. ниже)
4. **Wallpaper** (можно урезать до статичных изображений, gif/mp4 — если останется время)

Тёмная дизайн-система (см. ENVIE_DESIGN.md) применяется по ходу дела, а не отдельным
проходом в конце — иначе за 3 дня на неё не останется времени вообще.

---

## Модули — функциональная логика

### 1. Notes (лента заметок) — ЯДРО ПРОДУКТА

Аналог — Twitter/Instagram/Threads-лента. Пишешь короткий пост (текст), можешь прикрепить
медиа (фото/документы) и теги. Внутри поста — при раскрытии — полная заметка с текстом
и прикреплёнными документами.

- `notes`: id, content, created_at, updated_at, pinned
- `note_media`: id, note_id, file_path, media_type, original_name
- `note_tags`: id, note_id, tag

Backend: NoteEntity/NoteMediaEntity/NoteTagEntity, NoteRepository, NoteService
(createNote, getNotes с пагинацией, getNoteById, updateNote, deleteNote, togglePin),
NoteController. Медиа — отдельный эндпоинт `POST /api/v1/notes/{id}/media`, сохраняет
файл на диск, путь в БД. `GET /api/v1/media/{filename}` отдаёт файл.

Frontend: `pages/FeedPage` — лента карточек в стиле твиттера, `widgets/NoteCard`,
`features/createNote` (текст + медиа + теги).

### 2. Board (доска задач)

**Важно, уже несколько раз уточнялось автором — читай внимательно, не додумывай:**
- НЕТ колонок-стадий (не Kanban в классическом смысле TODO/DONE).
- НЕТ поля `status`/`phase` в схеме. Автор сам определяет фазу задачи в голове,
  система это не отслеживает. Не добавляй это поле, даже если кажется логичным.
- НЕТ отдельной страницы задачи. Карточка на доске — и превью, и полное
  представление одновременно: заголовок, описание, список подзадач с чекбоксами —
  всё видно и редактируется прямо на самой доске, инлайн. Не создавай
  `TaskDetailPage` и отдельный роут `/board/tasks/{id}` — это лишний уровень
  навигации для пет-проекта, автор explicitly просил не усложнять.
- Задачи — просто карточки с подзадачами (чекбоксами), одна плоская сетка на
  `BoardPage`.

- `tasks`: id, title, description, created_at, updated_at
- `subtasks`: id, task_id, title, done, created_at

Backend: TaskEntity, SubtaskEntity (`@OneToMany`), TaskRepository, SubtaskRepository,
TaskService (CRUD задач и подзадач, включая update — редактирование title/description
инлайн на карточке), TaskController (`/api/v1/tasks`), SubtaskController
(`/api/v1/tasks/{taskId}/subtasks`, `/api/v1/subtasks/{id}`).

Frontend: `pages/BoardPage` (сетка карточек-задач), `widgets/TaskCard` (полная карточка:
заголовок, описание, чекбоксы подзадач, прогресс, инлайн-редактирование),
`features/createTask`, `features/createSubtask`, `features/updateTask`.

Удаление задачи — необратимая операция, кнопка удаления должна требовать подтверждения.

### 3. Ideas (список идей)

Карточки идей будущих проектов + генерация архитектуры по кнопке через Anthropic API.

- `ideas`: id, title, summary, problem, solution, audience, monetization,
  status (RAW/EXPLORING/ACCEPTED/REJECTED), ai_architecture, created_at, updated_at

Backend: IdeaEntity, IdeaStatus enum, IdeaService (CRUD + generateArchitecture),
IdeaController + `POST /api/v1/ideas/{id}/generate-architecture`. Вызов Anthropic API —
**только с backend**, ключ из env var `ANTHROPIC_API_KEY`, промпт берётся из шаблона
`AI_IDEA_PROMPT.md`, результат сохраняется в `ideas.ai_architecture`.

Frontend: `pages/IdeasPage`, `widgets/IdeaCard` + кнопка "Сгенерировать архитектуру",
`features/createIdea`, `features/generateArchitecture`.

### 4. Templates (MD-шаблоны)

Шаблоны хранятся как файлы в папке `templates/` НА ДИСКЕ, не в БД. Backend читает и
отдаёт их. Редактирование — опционально, можно не делать в первой версии.

- `GET /api/v1/templates` — список файлов
- `GET /api/v1/templates/{name}` — содержимое
- `PUT /api/v1/templates/{name}` — сохранить (опционально)

**[CRITICAL] Path traversal.** Параметр `name` НЕЛЬЗЯ использовать как сырой путь к файлу.
Валидируй его строго по списку файлов, полученному через `GET /api/v1/templates` —
никаких `../` и абсолютных путей. Это касается и GET, и PUT.

Frontend: `pages/TemplatesPage` (список слева, просмотр справа), `widgets/TemplateViewer`
(рендер MD, например react-markdown).

### 5. Wallpaper (обои/гифки)

Загружаешь файл с компа → он попадает в `uploads/wallpapers/` → один активный файл
отображается как фон, работает по принципу Wallpaper Engine.

- `wallpapers`: id, file_path, original_name, media_type, active, created_at

**[WARNING] Имя файла.** Не используй `original_name` как имя файла на диске — генерируй
серверное имя (UUID), `original_name` храни отдельно только для отображения. Иначе —
коллизии имён и потенциальный path traversal через имя загружаемого файла.

**[WARNING] Единственный active.** `setActive` обязан в одной транзакции сбросить
`active=false` у всех остальных записей перед тем как выставить `true` новой — иначе
можно получить несколько активных обоев одновременно.

Backend: WallpaperEntity, WallpaperService (uploadWallpaper, getWallpapers, setActive,
delete), WallpaperController. Поддержка: .jpg, .png, .gif, .webp, .mp4 (если не
укладываешься в срок — можно оставить только .jpg/.png/.gif на первую версию).

Frontend: `pages/WallpaperPage` (галерея + активация + превью активного обоя),
`features/uploadWallpaper`.

---

## Backend — обязательные конвенции

- Единый формат ответа: `ApiResponse<T>` (success/data/message), контроллеры всегда
  возвращают `ResponseEntity<ApiResponse<T>>`, никогда голый объект.
- Логика — только в сервисе. Контроллер — тонкий роутер, транзакции на уровне сервиса.
- `findById` всегда бросает `NotFoundException`, если не найдено.
- Records — только для DTO. **Entity — всегда обычный class**, не record (JPA нужен
  mutable no-args конструктор, record этого не даёт штатно).
- `@Data` на JPA-сущностях — запрещено (equals/hashCode ломает JPA). Используй
  `@Getter @Setter @RequiredArgsConstructor @Builder`.
- Миграции — только Flyway, только новые файлы (`V1__init.sql`, `V2__notes.sql`, ...),
  существующие никогда не редактируются. `ddl-auto=validate`, никогда `create`/`update`.
- Секреты — только в env vars (`ANTHROPIC_API_KEY` и т.д.), никогда в коде и в git.
- Логирование через SLF4J, не `System.out.println`. Не логировать чувствительные данные.

## Frontend — обязательные конвенции

- FSD импорт-правила: `pages → widgets → features → entities → shared`, только сверху
  вниз. Нарушение — ошибка архитектуры, не стилистическая придирка.
- Никакого `any` в TypeScript, никакого `useState` для серверных данных — только
  React Query. Прямой axios в компонентах запрещён — только через `entities/*/api.ts`.
- Каждый список/запрос — три состояния: loading / error / empty / data.
- Именованный экспорт компонентов (кроме pages), файл = имя компонента (`NoteCard.tsx`).

## Как работать над задачей (правила для AI-кодера)

- Делай только то, что попросили. Заметил проблему за пределами скоупа — сообщи отдельным
  пунктом в конце ответа, не чини сам.
- Не хватает контекста для уверенного решения — спроси, не угадывай. Один вопрос за раз.
- Баг не чинится за 3 попытки — остановись, опиши что перепробовано, предложи другой подход.
- Приоритет при конфликте требований: **Security > Correctness > Performance > Code Cleanliness**.
- Деструктивные операции (DROP, DELETE без WHERE) — только с явным подтверждением автора.
- После задачи: список изменённых файлов, что проверить вручную, предложение обновить
  блок "Последние изменения" в CONTEXT.md.
