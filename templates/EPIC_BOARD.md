# EPIC: Board (Доска задач)

---

## Контекст

**Модуль:** board  
**Фаза:** Фаза 3.2  
**Зависит от:** scaffold  
**Статус:** [~] в процессе

---

## Цель эпика

> Пользователь может создавать задачи с подзадачами-чекбоксами на плоской сетке карточек. Все действия (просмотр, редактирование, чекбоксы) происходят инлайн на карточке, без отдельной страницы задачи. Данные сохраняются в БД.

---

## БД -- миграция

**Файл:** `V3__board.sql`

```sql
CREATE TABLE tasks (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subtasks (
    id         BIGSERIAL PRIMARY KEY,
    task_id    BIGINT REFERENCES tasks(id) ON DELETE CASCADE,
    title      VARCHAR(255) NOT NULL,
    done       BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subtasks_task_id ON subtasks(task_id);
```

Чеклист:
- [x] Миграция написана
- [x] Миграция проверена на чистой БД (flyway migrate с нуля)
- [x] Нет конфликтов с предыдущими миграциями

---

## Backend

### Entity
- [x] `TaskEntity.java` -- поля: id, title, description, createdAt, updatedAt
- [x] `SubtaskEntity.java` -- поля: id, taskId, title, done, createdAt
- [x] Связь: TaskEntity @OneToMany -> SubtaskEntity (cascade ALL, orphanRemoval)

### Repository
- [x] `TaskRepository.java` -- extends JpaRepository<TaskEntity, Long>
- [x] `SubtaskRepository.java` -- extends JpaRepository<SubtaskEntity, Long>

### DTO
- [x] `TaskResponse.java` -- id, title, description, subtasks, createdAt, updatedAt
- [x] `CreateTaskRequest.java` -- title, description
- [x] `UpdateTaskRequest.java` -- title, description
- [x] `SubtaskResponse.java` -- id, title, done, createdAt
- [x] `CreateSubtaskRequest.java` -- title
- [x] `UpdateSubtaskRequest.java` -- title, done

### Service
- [x] `TaskService.java`
- [x] Методы: createTask, getAllTasks, getTaskById, updateTask, deleteTask
- [x] Методы подзадач: createSubtask, updateSubtask, deleteSubtask, toggleSubtask
- [x] Логика только в сервисе, контроллер тонкий
- [x] Удаление задачи каскадно удаляет подзадачи

### Controller
- [x] `TaskController.java` -- @RestController, @RequestMapping("/api/v1/tasks")
- [x] GET / -- список всех задач (с подзадачами)
- [x] GET /{id} -- одна задача
- [x] POST / -- создание задачи
- [x] PUT /{id} -- обновление задачи (инлайн-редактирование title/description)
- [x] DELETE /{id} -- удаление задачи
- [x] `SubtaskController.java` -- @RestController
- [x] POST /api/v1/tasks/{taskId}/subtasks -- создание подзадачи
- [x] PUT /api/v1/subtasks/{id} -- обновление подзадачи (title, done)
- [x] DELETE /api/v1/subtasks/{id} -- удаление подзадачи
- [x] Все методы возвращают ApiResponse<T>

---

## Frontend (FSD)

### entities/task
- [x] `types.ts` -- интерфейсы Task, Subtask
- [x] `api.ts` -- axios-вызовы: getTasks, createTask, updateTask, deleteTask, createSubtask, updateSubtask, deleteSubtask
- [x] `index.ts` -- публичный экспорт

### features/
- [x] `createTask/` -- форма создания задачи (title + description)
- [x] `createSubtask/` -- форма добавления подзадачи к задаче
- [ ] `updateTask/` -- инлайн-редактирование title и description на карточке

### widgets/TaskCard
- [x] Компонент карточки задачи
- [x] Отображение: заголовок, описание, список подзадач с чекбоксами, прогресс
- [x] Удаление с подтверждением (confirmation dialog)
- [x] Переключение подзадач (toggle done)
- [x] Пропсы типизированы

### pages/BoardPage
- [x] Страница подключена к роутеру
- [x] Данные загружаются через @tanstack/react-query
- [x] Состояния: загрузка / ошибка / пустой список / данные
- [x] Masonry-layout сетка карточек

---

## Сценарии для ручного тестирования

- [x] Создать задачу -> появилась на доске
- [x] Добавить подзадачу -> чекбокс появился на карточке
- [x] Отметить подзадачу выполненной -> прогресс обновился
- [ ] Отредактировать заголовок инлайн -> изменения сохранились
- [x] Удалить задачу -> появился диалог подтверждения, после подтверждения задача исчезла
- [x] Перезагрузить страницу -> данные сохранились
- [x] Пустая доска -> UI не падает, показывает заглушку

---

## Признак завершения эпика

> Основной CRUD задач и подзадач реализован. Карточки отображаются на плоской сетке, подзадачи переключаются чекбоксами. Инлайн-редактирование title/description на карточке -- следующая итерация.

---

## Заметки

- [CRITICAL] Нет колонок-стадий (TODO/DONE). Это НЕ классический Kanban. Нет поля status/phase в схеме.
- [CRITICAL] Нет отдельной страницы задачи. Все действия инлайн на карточке. Не создавать TaskDetailPage.
- Удаление задачи -- необратимая операция, требуется подтверждение.
- updateTask feature (инлайн-редактирование) отложена, но backend endpoint PUT /{id} уже готов.
