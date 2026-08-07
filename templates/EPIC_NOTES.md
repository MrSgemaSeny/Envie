# EPIC: Notes (Лента заметок)

---

## Контекст

**Модуль:** notes  
**Фаза:** Фаза 3.1  
**Зависит от:** scaffold  
**Статус:** [x] готово

---

## Цель эпика

> Пользователь может создавать заметки в формате ленты (Twitter-стиль) с текстом, медиа-вложениями и тегами. Заметки сохраняются в БД, медиа-файлы хранятся на диске, данные переживают перезапуск сервера.

---

## Дополнительные фичи (Post-MVP)

### Notes Redesign (v3)
- [x] Двухколоночный layout: w-72 левая панель (composer + stats), правая панель (лента)
- [x] Timeline-карточки без границ, разделены subtle borders, normal font weight
- [x] Composer с image previews и отдельными Photo/File upload controls
- [x] Нормализация тегов на фронтенде: trim whitespace, strip `#` перед сохранением
- [x] Исправлен баг в CreateNoteForm: removeFile очищает document input ref
- [x] Пресеты aspect ratio для image attachments (object-contain, max-h-450px вместо banner crops)

---

## БД -- миграция

**Файл:** `V2__notes.sql`

```sql
CREATE TABLE notes (
    id          BIGSERIAL PRIMARY KEY,
    content     TEXT NOT NULL,
    pinned      BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE note_media (
    id            BIGSERIAL PRIMARY KEY,
    note_id       BIGINT REFERENCES notes(id) ON DELETE CASCADE,
    file_path     VARCHAR(500) NOT NULL,
    media_type    VARCHAR(50) NOT NULL,
    original_name VARCHAR(255) NOT NULL
);

CREATE TABLE note_tags (
    id      BIGSERIAL PRIMARY KEY,
    note_id BIGINT REFERENCES notes(id) ON DELETE CASCADE,
    tag     VARCHAR(100) NOT NULL
);

CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX idx_notes_pinned ON notes(pinned);
CREATE INDEX idx_note_tags_tag ON note_tags(tag);
```

Чеклист:
- [x] Миграция написана
- [x] Миграция проверена на чистой БД (flyway migrate с нуля)
- [x] Нет конфликтов с предыдущими миграциями

---

## Backend

### Entity
- [x] `NoteEntity.java` -- поля: id, content, pinned, createdAt, updatedAt
- [x] `NoteMediaEntity.java` -- поля: id, noteId, filePath, mediaType, originalName
- [x] `NoteTagEntity.java` -- поля: id, noteId, tag
- [x] Связь: NoteEntity @OneToMany -> NoteMediaEntity, NoteTagEntity (cascade ALL, orphanRemoval)

### Repository
- [x] `NoteRepository.java` -- extends JpaRepository<NoteEntity, Long>
- [x] `NoteMediaRepository.java` -- extends JpaRepository<NoteMediaEntity, Long>
- [x] Пагинация через Pageable в NoteRepository

### DTO
- [x] `NoteDto.java` (NoteResponse) -- все поля заметки + вложенные медиа и теги
- [x] `MediaDto.java` -- информация о медиа-файле
- [x] CreateNoteRequest -- content, tags (список)

### Service
- [x] `NoteService.java`
- [x] Методы: createNote, getNotes (пагинация), getNoteById, updateNote, deleteNote, togglePin
- [x] Логика только в сервисе, контроллер тонкий
- [x] `FileStorageService.java` -- сохранение файлов на диск, генерация UUID-имени

### Файловые операции
- [x] Имя файла на диске генерируется сервером (UUID), не из пользовательского ввода
- [x] `original_name` хранится в БД только для отображения
- [x] Проверка MIME-типа при загрузке

### Controller
- [x] `NoteController.java` -- @RestController, @RequestMapping("/api/v1/notes")
- [x] GET / -- список заметок с пагинацией
- [x] GET /{id} -- одна заметка
- [x] POST / -- создание заметки
- [x] PUT /{id} -- обновление заметки
- [x] DELETE /{id} -- удаление заметки
- [x] PATCH /{id}/pin -- переключение закрепления
- [x] `MediaController.java` -- @RequestMapping("/api/v1")
- [x] POST /notes/{id}/media -- загрузка медиа-файла
- [x] GET /media/{filename} -- отдача файла
- [x] Все методы возвращают ApiResponse<T>

---

## Frontend (FSD)

### entities/note
- [x] `types.ts` -- интерфейсы Note, NoteMedia, NoteTag
- [x] `api.ts` -- axios-вызовы: getNotes, getNoteById, createNote, updateNote, deleteNote, togglePin, uploadMedia
- [x] `index.ts` -- публичный экспорт

### features/
- [x] `createNote/` -- форма создания заметки (текст + медиа + теги)
- [x] `updateNote/` -- инлайн-редактирование заметки
- [x] `deleteNote/` -- кнопка удаления с подтверждением

### widgets/NoteCard
- [x] Компонент карточки заметки в стиле Twitter
- [x] Отображение: текст, медиа-превью, теги, дата
- [x] Пропсы типизированы

### pages/FeedPage
- [x] Страница подключена к роутеру
- [x] Данные загружаются через @tanstack/react-query
- [x] Состояния: загрузка / ошибка / пустой список / данные

---

## Сценарии для ручного тестирования

- [x] Создать заметку с текстом -> появилась в ленте
- [x] Создать заметку с медиа-вложением -> файл загрузился, превью отображается
- [x] Добавить теги -> теги видны на карточке, фильтрация работает
- [x] Закрепить заметку -> отображается вверху ленты
- [x] Удалить заметку -> исчезла из ленты, файл удален с диска
- [x] Перезагрузить страницу -> данные сохранились
- [x] Пустая лента -> показывает заглушку
- [x] Нормализация тегов (#tag, " tag ") -> сохраняется как "tag"
- [x] Удаление заметки с медиа -> файлы очищаются с диска

---

## Признак завершения эпика

> Полный CRUD заметок реализован: создание, чтение, обновление (инлайн), удаление. Загрузка медиа (фото/файлы), теги с нормализацией, закрепление. FileStorageService.deleteFile вызывается при удалении заметок. Данные живут в БД и переживают перезапуск.

---

## Заметки

- Модуль реализован первым как ядро продукта
- Медиа-файлы хранятся в uploads/ на диске с UUID-именами
- FileStorageService.deleteFile гарантирует清理 медиа-файлов при удалении заметки
- Теги нормализуются на фронтенде: trim whitespace, strip leading `#`
- Notes Redesign v3: timeline-карточки, двухколоночный layout, enhanced composer
