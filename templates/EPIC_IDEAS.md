# EPIC: Ideas (Список идей)

---

## Контекст

**Модуль:** ideas  
**Фаза:** Фаза 3.3  
**Зависит от:** scaffold  
**Статус:** [x] готово

---

## Цель эпика

> Пользователь может создавать карточки идей будущих проектов с описанием проблемы, решения, аудитории и монетизации. Идеи сохраняются в БД, фронтенд полностью реализован. AI-генерация архитектуры удалена с фронтенда.

---

## БД -- миграция

**Файл:** `V4__ideas.sql` + `V5__remove_ai_architecture.sql`

```sql
CREATE TYPE idea_status AS ENUM ('RAW', 'EXPLORING', 'ACCEPTED', 'REJECTED');

CREATE TABLE ideas (
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    summary         TEXT,
    problem         TEXT,
    solution        TEXT,
    audience        TEXT,
    monetization    TEXT,
    status          idea_status DEFAULT 'RAW',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);
```

Чеклист:
- [x] Миграция V4 написана
- [x] V5 миграция удалила ai_architecture (AI удален)
- [x] Миграция проверена на чистой БД (flyway migrate с нуля)
- [x] Нет конфликтов с предыдущими миграциями

---

## Backend

### Entity
- [x] `IdeaEntity.java` -- поля: id, title, summary, problem, solution, audience, monetization, status, createdAt, updatedAt
- [x] `IdeaStatus.java` -- enum: RAW, EXPLORING, ACCEPTED, REJECTED

### Repository
- [x] `IdeaRepository.java` -- extends JpaRepository<IdeaEntity, Long>
- [x] Кастомные запросы: findByStatus(IdeaStatus status)

### DTO
- [x] `IdeaResponse.java` -- все поля идеи для клиента
- [x] `CreateIdeaRequest.java` -- title, summary, problem, solution, audience, monetization
- [x] `UpdateIdeaRequest.java` -- title, summary, problem, solution, audience, monetization, status

### Service
- [x] `IdeaService.java`
- [x] Методы: createIdea, getAllIdeas, getIdeaById, updateIdea, deleteIdea
- [x] Логика только в сервисе, контроллер тонкий
- [x] AnthropicClient и AI-генерация удалены (V5 миграция убрала ai_architecture)

### Controller
- [x] `IdeaController.java` -- @RestController, @RequestMapping("/api/v1/ideas")
- [x] GET / -- список всех идей
- [x] GET /{id} -- одна идея
- [x] POST / -- создание идеи
- [x] PUT /{id} -- обновление идеи (включая смену статуса)
- [x] DELETE /{id} -- удаление идеи
- [x] Все методы возвращают ApiResponse<T>

---

## Frontend (FSD)

### entities/idea
- [x] `types.ts` -- интерфейсы Idea, IdeaStatus
- [x] `api.ts` -- axios-вызовы: getIdeas, getIdeaById, createIdea, updateIdea, deleteIdea
- [x] `index.ts` -- публичный экспорт

### features/
- [x] `createIdea/` -- форма создания идеи (title, summary, problem, solution, audience, monetization)
- [x] `updateIdea/` -- форма редактирования идеи
- [x] `deleteIdea/` -- кнопка удаления с подтверждением

### widgets/IdeaCard
- [x] Компонент карточки идеи
- [x] Отображение: title, summary, status badge, дата
- [x] Раскрытие: problem, solution, audience, monetization
- [x] Pulse-анимация для architecture generation удалена (AI убран)
- [x] Пропсы типизированы

### pages/IdeasPage
- [x] Страница подключена к роутеру
- [x] Данные загружаются через @tanstack/react-query
- [x] Состояния: загрузка / ошибка / пустой список / данные
- [x] CSS grid layout
- [x] Фильтрация по статусу (RAW/EXPLORING/ACCEPTED/REJECTED)

---

## Сценарии для ручного тестирования

- [x] Создать идею -> появилась в списке со статусом RAW
- [x] Обновить идею (изменить поля) -> изменения отобразились
- [x] Сменить статус идеи -> badge обновился
- [x] Удалить идею -> исчезла из списка
- [x] Перезагрузить страницу -> данные сохранились
- [x] Пустой список -> UI не падает, показывает заглушку

---

## Признак завершения эпика

> Полный CRUD идей реализован: создание, чтение, обновление, удаление. Карточки идей отображаются в grid layout с раскрытием деталей. Статус-бейджи работают. AI-генерация архитектуры удалена с фронтенда и бэкенда (V5 миграция). Данные живут в БД и переживают перезапуск.

---

## Заметки

- [INFO] AI-генерация архитектуры удалена (frontend и backend).
- [INFO] V5 миграция удалила ai_architecture из схемы БД.
- IdeaCard pulse-анимация удалена вместе с AI-фичей.
- Статус идеи (enum) -- единственный модуль в Envie где есть поле status. Не путать с Board, где status явно отсутствует.
