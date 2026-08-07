# EPIC: Templates (MD-шаблоны)

---

## Контекст

**Модуль:** templates  
**Фаза:** Фаза 3.4  
**Зависит от:** scaffold  
**Статус:** [x] готово

---

## Цель эпика

> Пользователь может просматривать список MD-шаблонов (промпты, планы, шаблоны проектов), читать и редактировать их в отрендеренном виде. Шаблоны хранятся в PostgreSQL (V7 миграция), graph D3-визуализация показывает связи между шаблонами.

---

## БД -- миграция

**Файл:** `V7__templates.sql`

```sql
CREATE TABLE templates (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
    content     TEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_templates_name ON templates(name);
```

Чеклист:
- [x] Миграция написана и проверена на чистой БД
- [x] Данные персистентны между перезапусками контейнера
- [x] Нет конфликтов с предыдущими миграциями

---

## Backend

### Entity
- [x] `TemplateEntity.java` -- поля: id, name, content, createdAt, updatedAt

### Repository
- [x] `TemplateRepository.java` -- extends JpaRepository<TemplateEntity, Long>

### DTO
- [x] `TemplateListItem.java` -- record: id, name, updatedAt
- [x] `TemplateContent.java` -- record: id, name, content, updatedAt

### Service
- [x] `TemplateService.java`
- [x] Методы: listTemplates, getTemplateById, saveTemplate
- [x] Strict path traversal validation: normalized path startsWith checks
- [x] Данные в PostgreSQL (миграция V7), не на файловой системе

### Controller
- [x] `TemplateController.java` -- @RestController, @RequestMapping("/api/v1/templates")
- [x] GET / -- список всех шаблонов
- [x] GET /{id} -- содержимое конкретного шаблона
- [x] PUT /{id} -- сохранение (редактирование) шаблона
- [x] Все методы возвращают ApiResponse<T>

---

## Frontend (FSD)

### entities/template
- [x] `types.ts` -- интерфейсы Template, TemplateContent
- [x] `api.ts` -- axios-вызовы: getTemplates, getTemplateById, saveTemplate
- [x] `index.ts` -- публичный экспорт

### features/
- [x] `editTemplate/` -- редактирование шаблона

### widgets/TemplateViewer
- [x] Компонент просмотра/редактирования MD-шаблона
- [x] Рендер markdown через react-markdown + remark-gfm
- [x] Custom thematic styling для markdown
- [x] Пропсы типизированы

### pages/TemplatesPage
- [x] Страница подключена к роутеру (/templates)
- [x] Layout: сайдбар со списком слева, просмотр справа
- [x] Premium, modern, Vercel/shadcn-style дизайн
- [x] Данные загружаются через @tanstack/react-query
- [x] Выбор шаблона -> содержимое отображается справа

### Graph Visualization
- [x] D3 graph (react-force-graph-2d) показывает связи между шаблонами
- [x] ENVIE.md как физический центр "spiderweb" графа
- [x] Dynamic font scaling, stable clustering

---

## Сценарии для ручного тестирования

- [x] Открыть страницу Templates -> список шаблонов из БД отобразился
- [x] Выбрать шаблон -> содержимое отрендерилось справа как markdown
- [x] Редактировать шаблон -> изменения сохраняются в БД
- [x] Открыть Graph -> D3 визуализация связей отображается
- [x] Пустой список шаблонов -> UI показывает заглушку
- [x] Перезагрузить страницу -> данные сохранились в БД

---

## Признак завершения эпика

> Список шаблонов отображается из PostgreSQL (V7 миграция), содержимое рендерится как markdown. Редактирование работает. Graph D3-визуализация показывает связи между шаблонами. ENVIE.md закреплен как центр графа.

---

## Заметки

- [INFO] Templates хранятся в PostgreSQL (V7), а не на файловой системе.
- [INFO] Path traversal validation использует normalized path startsWith checks.
- Для рендера markdown используется react-markdown + remark-gfm.
- Graph использует react-force-graph-2d с custom physics для стабильного clustering.
- TemplateEntity + TemplateRepository -- теперь стандартный JPA паттерн.
