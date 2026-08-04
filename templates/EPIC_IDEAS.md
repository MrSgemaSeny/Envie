# EPIC: Ideas (Список идей)

---

## Контекст

**Модуль:** ideas  
**Фаза:** Фаза 3.3  
**Зависит от:** scaffold  
**Статус:** [ ] не начато

---

## Цель эпика

> Пользователь может создавать карточки идей будущих проектов с описанием проблемы, решения, аудитории и монетизации. По нажатию кнопки бэкенд вызывает Anthropic API и генерирует архитектуру проекта, которая сохраняется в БД.

---

## БД -- миграция

**Файл:** `V4__ideas.sql`

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
    ai_architecture TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);
```

Чеклист:
- [ ] Миграция написана
- [ ] Миграция проверена на чистой БД (flyway migrate с нуля)
- [ ] Нет конфликтов с предыдущими миграциями

---

## Backend

### Entity
- [ ] `IdeaEntity.java` -- поля: id, title, summary, problem, solution, audience, monetization, status, aiArchitecture, createdAt, updatedAt
- [ ] `IdeaStatus.java` -- enum: RAW, EXPLORING, ACCEPTED, REJECTED

### Repository
- [ ] `IdeaRepository.java` -- extends JpaRepository<IdeaEntity, Long>
- [ ] Кастомные запросы: findByStatus(IdeaStatus status)

### DTO
- [ ] `IdeaResponse.java` -- все поля идеи для клиента
- [ ] `CreateIdeaRequest.java` -- title, summary, problem, solution, audience, monetization
- [ ] `UpdateIdeaRequest.java` -- title, summary, problem, solution, audience, monetization, status

### Service
- [ ] `IdeaService.java`
- [ ] Методы: createIdea, getAllIdeas, getIdeaById, updateIdea, deleteIdea
- [ ] `generateArchitecture(Long id)` -- вызывает Anthropic API, сохраняет результат в ideas.ai_architecture
- [ ] Логика только в сервисе, контроллер тонкий
- [ ] Anthropic API ключ берется из env var `ANTHROPIC_API_KEY`
- [ ] Промпт для генерации берется из шаблона `AI_IDEA_PROMPT.md`

### Controller
- [ ] `IdeaController.java` -- @RestController, @RequestMapping("/api/v1/ideas")
- [ ] GET / -- список всех идей
- [ ] GET /{id} -- одна идея
- [ ] POST / -- создание идеи
- [ ] PUT /{id} -- обновление идеи (включая смену статуса)
- [ ] DELETE /{id} -- удаление идеи
- [ ] POST /{id}/generate-architecture -- генерация архитектуры через AI
- [ ] Все методы возвращают ApiResponse<T>

---

## Frontend (FSD)

### entities/idea
- [ ] `types.ts` -- интерфейсы Idea, IdeaStatus
- [ ] `api.ts` -- axios-вызовы: getIdeas, getIdeaById, createIdea, updateIdea, deleteIdea, generateArchitecture
- [ ] `index.ts` -- публичный экспорт

### features/
- [ ] `createIdea/` -- форма создания идеи (title, summary, problem, solution, audience, monetization)
- [ ] `updateIdea/` -- форма редактирования идеи
- [ ] `deleteIdea/` -- кнопка удаления с подтверждением
- [ ] `generateArchitecture/` -- кнопка генерации архитектуры, вызывает POST /{id}/generate-architecture

### widgets/IdeaCard
- [ ] Компонент карточки идеи
- [ ] Отображение: title, summary, status badge, дата
- [ ] Раскрытие: problem, solution, audience, monetization
- [ ] Блок AI-архитектуры (рендер markdown, если ai_architecture заполнена)
- [ ] Кнопка "Сгенерировать архитектуру" (с loading-состоянием)
- [ ] Пропсы типизированы

### pages/IdeasPage
- [ ] Страница подключена к роутеру
- [ ] Данные загружаются через @tanstack/react-query
- [ ] Состояния: загрузка / ошибка / пустой список / данные
- [ ] Фильтрация по статусу (RAW/EXPLORING/ACCEPTED/REJECTED)

---

## Сценарии для ручного тестирования

- [ ] Создать идею -> появилась в списке со статусом RAW
- [ ] Обновить идею (изменить поля) -> изменения отобразились
- [ ] Сменить статус идеи -> badge обновился
- [ ] Нажать "Сгенерировать архитектуру" -> loading-спиннер, затем появился блок с архитектурой
- [ ] Удалить идею -> исчезла из списка
- [ ] Перезагрузить страницу -> данные сохранились
- [ ] Пустой список -> UI не падает, показывает заглушку
- [ ] Повторная генерация архитектуры -> перезаписывает предыдущий результат

---

## Признак завершения эпика

> Все сценарии выше пройдены вручную. Идеи сохраняются в БД, AI-архитектура генерируется через Anthropic API и отображается на карточке. Данные переживают перезапуск бэка.

---

## Заметки

- [CRITICAL] Anthropic API вызывается ТОЛЬКО с backend. Ключ берется из env var ANTHROPIC_API_KEY, никогда не попадает на фронтенд.
- [WARNING] Генерация архитектуры может занимать 10-30 секунд. Нужен loading-стейт и обработка таймаута.
- Промпт для генерации берется из файла AI_IDEA_PROMPT.md в папке templates/.
- Статус идеи (enum) -- единственный модуль в Envie где есть поле status. Не путать с Board, где status явно отсутствует.
