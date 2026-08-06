# Envie

Личный рабочий штаб (knowledge base + task management) для соло-разработчика. 
Архитектура "Без облака. Без авторизации. Без лишнего".

## Модули
- **Dashboard**: Интерактивная 3D-сцена (Three.js) с анимациями (GSAP) и статистикой.
- **Notes**: Лента заметок с тегами, вложениями медиафайлов и быстрым поиском (ILIKE).
- **Board**: Минималистичная Kanban-доска (задачи и подзадачи) без избыточной Jira-бюрократии.
- **Ideas**: База идей стартапов/фич со структурой (Проблема → Решение → Аудитория → Монетизация).
- **Templates**: Система управления Markdown-шаблонами. Автоматически строит D3-граф связей на основе префиксов файлов.
- **Wallpaper**: Модуль кастомизации фона (изображения и видео). Автоматическая адаптация под экраны с помощью двойного слоя (заблюренный cover + резкий contain).
- **For You**: Фокус-экран без лишнего UI для погружения в работу.

## Стек технологий

**Backend:**
- Java 17 / Spring Boot 3
- PostgreSQL (база данных)
- Flyway (версионирование схемы БД, миграции)
- Gradle (сборка)
- Архитектура: REST API, Controller-Service-Repository

**Frontend:**
- React 19 / TypeScript / Vite
- Tailwind CSS v4
- React Query (@tanstack/react-query)
- React Router DOM
- Feature-Sliced Design (FSD) архитектура
- UI: Sonner (тосты), Vaul (шторки)
- Графика: Three.js, GSAP, react-force-graph-2d

## Дизайн-код
Строгое соблюдение принципов Эмиля Ковальски (Emil Kowalski):
- Исключительно `transform` и `opacity` для анимаций (без `transition-all`).
- Функция плавности: `ease-out`.
- Микроинтеракции: масштабирование кнопок при нажатии (`active:scale-95`).
- Отсутствие эмодзи, строгая типографика (Geist), плоский премиум-дизайн с легкими тенями.

## Запуск проекта

**Docker (База данных + Приложение):**
```bash
docker-compose up -d
```

**Локальная разработка (Backend):**
```bash
cd backend
./gradlew bootRun
```
(Требует запущенного инстанса PostgreSQL, логин/пароль/порт в `application.properties`).

**Локальная разработка (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

## Структура БД (Flyway)
Все изменения базы данных строго версионируются в `backend/src/main/resources/db/migration/`. 
Изменение существующих скриптов `V...__name.sql` запрещено, любые изменения накатываются только новыми миграциями.
