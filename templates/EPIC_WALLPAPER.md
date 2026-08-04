# EPIC: Wallpaper (Обои/гифки)

---

## Контекст

**Модуль:** wallpaper  
**Фаза:** Фаза 3.5  
**Зависит от:** scaffold  
**Статус:** [ ] не начато

---

## Цель эпика

> Пользователь может загружать изображения и гифки с локального диска, просматривать галерею, выбирать активные обои которые отображаются как фон приложения в стиле Wallpaper Engine.

---

## БД -- миграция

**Файл:** `V5__wallpaper.sql`

```sql
CREATE TABLE wallpapers (
    id            BIGSERIAL PRIMARY KEY,
    file_path     VARCHAR(500) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    media_type    VARCHAR(50) NOT NULL,
    active        BOOLEAN DEFAULT FALSE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wallpapers_active ON wallpapers(active);
```

Чеклист:
- [ ] Миграция написана
- [ ] Миграция проверена на чистой БД (flyway migrate с нуля)
- [ ] Нет конфликтов с предыдущими миграциями

---

## Backend

### Entity
- [ ] `WallpaperEntity.java` -- поля: id, filePath, originalName, mediaType, active, createdAt

### Repository
- [ ] `WallpaperRepository.java` -- extends JpaRepository<WallpaperEntity, Long>
- [ ] Кастомные запросы: findByActiveTrue(), @Modifying updateAllSetActiveFalse()

### DTO
- [ ] `WallpaperResponse.java` -- id, originalName, mediaType, active, createdAt, url
- [ ] Upload принимает MultipartFile, отдельный request DTO не нужен

### Service
- [ ] `WallpaperService.java`
- [ ] Методы: uploadWallpaper, getWallpapers, getActiveWallpaper, setActive, deleteWallpaper
- [ ] [WARNING] `setActive(Long id)` -- в одной транзакции: сбросить active=false у всех, затем active=true у выбранного. Иначе возможны несколько активных обоев.
- [ ] Загрузка файла: генерировать UUID-имя, сохранять в uploads/wallpapers/
- [ ] Удаление: удалить запись из БД И файл с диска
- [ ] Логика только в сервисе

### Файловые операции
- [ ] Имя файла на диске генерируется сервером (UUID), `original_name` только для отображения
- [ ] Файлы хранятся в uploads/wallpapers/
- [ ] Поддерживаемые форматы v1: .jpg, .png, .gif (v2: .webp, .mp4)
- [ ] Проверка MIME-типа при загрузке

### Controller
- [ ] `WallpaperController.java` -- @RestController, @RequestMapping("/api/v1/wallpapers")
- [ ] GET / -- список всех обоев
- [ ] GET /active -- текущие активные обои
- [ ] POST / -- загрузка файла (MultipartFile)
- [ ] PATCH /{id}/activate -- установить обои как активные
- [ ] DELETE /{id} -- удаление обоев (файл + запись в БД)
- [ ] Все методы возвращают ApiResponse<T>

---

## Frontend (FSD)

### entities/wallpaper
- [ ] `types.ts` -- интерфейс Wallpaper
- [ ] `api.ts` -- axios-вызовы: getWallpapers, getActiveWallpaper, uploadWallpaper, setActive, deleteWallpaper
- [ ] `index.ts` -- публичный экспорт

### features/
- [ ] `uploadWallpaper/` -- форма/кнопка загрузки файла с file input
- [ ] `deleteWallpaper/` -- кнопка удаления с подтверждением

### widgets/WallpaperGallery
- [ ] Компонент галереи обоев
- [ ] Сетка превью-изображений
- [ ] Индикатор активного обоя (выделение рамкой/badge)
- [ ] Клик по превью -> активация обоев
- [ ] Пропсы типизированы

### pages/WallpaperPage
- [ ] Страница подключена к роутеру
- [ ] Данные загружаются через @tanstack/react-query
- [ ] Состояния: загрузка / ошибка / пустой список / данные
- [ ] Превью активного обоя в шапке страницы
- [ ] Галерея всех загруженных обоев ниже

### Интеграция с App.tsx
- [ ] Активный обой отображается как фон всего приложения (не только на WallpaperPage)
- [ ] Запрос активного обоя при загрузке App
- [ ] Поддержка gif-анимации как фона

---

## Сценарии для ручного тестирования

- [ ] Загрузить jpg-файл -> появился в галерее
- [ ] Загрузить gif-файл -> появился в галерее, анимация работает в превью
- [ ] Активировать обои -> фон приложения сменился
- [ ] Активировать другие обои -> предыдущие деактивировались, новые стали фоном
- [ ] Удалить обои -> исчезли из галереи, файл удален с диска
- [ ] Удалить активные обои -> фон сбрасывается
- [ ] Перезагрузить страницу -> активные обои сохранились
- [ ] Пустая галерея -> UI не падает, показывает заглушку
- [ ] Загрузить файл неподдерживаемого формата -> ошибка валидации

---

## Признак завершения эпика

> Все сценарии выше пройдены вручную. Обои загружаются, отображаются в галерее, активируются как фон приложения. Данные и файлы переживают перезапуск бэка.

---

## Заметки

- [WARNING] Единственный active: setActive обязан в одной транзакции сбросить все active=false перед установкой нового active=true.
- [WARNING] UUID-имена файлов на диске. original_name никогда не используется как file_path.
- Поддержка .mp4 и .webp отложена на v2, если не укладываемся в срок.
- Модуль самый низкий по приоритету (5 из 5). Можно урезать до статичных изображений.
- Интеграция с App.tsx (фон приложения) -- отдельный подэтап, может быть отложен.
