# CONTEXT.md — Envie
# Текущее состояние проекта (Second Brain). Обновляется после реализации фич.

---

## Что такое Envie

Личный рабочий штаб соло-разработчика (Second Brain). Один пользователь, без авторизации, только localhost.
Модули: лента заметок (твиттер-стиль), канбан-доска, список идей, MD-шаблоны, страница обоев/видео-гифок с локального диска, 3D Dashboard.

**Репозиторий:** github.com/MrSgemaSeny/Envie
**Последнее обновление:** 2026-08-07

---

## Стек

| Слой | Технология |
|------|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind v4 + FSD |
| Backend | Java 17 + Spring Boot 3 + Spring Data JPA |
| БД | PostgreSQL + Flyway миграции |
| Хранилище файлов | Локальный диск (uploads/) |
| Деплой | Frontend: GitHub Pages, Backend: localhost |

---

## Структура проекта

```
Envie/
├── backend/
│   └── src/main/java/kz/envie/
│       ├── notes/
│       ├── board/
│       ├── ideas/
│       ├── templates/
│       ├── wallpaper/
│       └── shared/
├── frontend/
│   └── src/
│       ├── pages/
│       ├── widgets/
│       ├── features/
│       ├── entities/
│       └── shared/
├── templates/         ← MD шаблоны и База Знаний (Second Brain)
└── PROJECT_LIFECYCLE.md
```

---

## Состояние модулей

| Модуль | Статус | Фаза | Blocker |
|--------|--------|------|---------|
| Scaffold (бэк + фронт) | [x] готово | Фаза 2 | нет |
| Notes | [x] готово | Фаза 3.1 | нет |
| Board | [x] готово | Фаза 3.2 | нет |
| Ideas | [x] готово | Фаза 3.3 | нет |
| Templates | [x] готово | Фаза 3.4 | нет |
| Wallpaper | [x] готово | Фаза 3.5 | нет |
| Dashboard & Landing | [x] готово | Фаза 4 | нет |

---

## Известные решения и ограничения

- Авторизация отсутствует намеренно — один пользователь, localhost
- Файлы хранятся на диске в `uploads/`, ссылки в БД
- MD шаблоны хранятся в PostgreSQL (`V7__templates.sql`) для надежности и отображаются в D3 графике знаний
- CORS настроен на http://localhost:5173
- ddl-auto=validate, схема управляемся исключительно через Flyway
- Бэкенд работает на Gradle (`./gradlew build`)

---

## Последние изменения

| Дата | Что сделано |
|------|-------------|
| 2026-08-04 | Создана документация, PROJECT_LIFECYCLE.md, структура проекта. Backend на Gradle, Frontend на Vite/Tailwind v4 |
| 2026-08-04 | Настроен CI/CD для деплоя Frontend в GitHub Pages |
| 2026-08-04 | Фаза 3.1: Реализован модуль Notes (БД миграция, Backend API, Frontend FSD UI) |
| 2026-08-05 | Фазы 3.2–3.5: Реализованы модули Board, Ideas, Templates и Wallpaper |
| 2026-08-06 | Переработка 3D Dashboard (Kimi style), D3 паутина графа связей к ENVIE.md, поддержка видео/GIF обоев |
| 2026-08-07 | Исправлена ошибка PostgreSQL `lower(bytea)` в поисковом JPQL запросе `IdeaRepository` |
| 2026-08-07 | Полная переработка UI `CreateIdeaDrawer`: адаптивная ширина `max-w-5xl`, многострочные `textarea` с автоматической подгонкой высоты (`auto-resize`) без внутренних скроллов |

---

## Следующий шаг

Поддержка текущего функционала и полировка пользовательского интерфейса Second Brain.
