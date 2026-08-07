# EPIC: Wallpaper (Обои/гифки)

---

## Контекст

**Модуль:** wallpaper  
**Фаза:** Фаза 3.5  
**Зависит от:** scaffold  
**Статус:** [x] готово

---

## Цель эпика

> Пользователь может загружать изображения, гифки и видео с локального диска, просматривать галерею, выбирать активные обои которые отображаются как фон приложения. Premium dual-layer дизайн: blurred cover background + sharp 3:4 aspect ratio foreground frame.

---

## БД -- миграция

**Файл:** `V6__wallpaper.sql`

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
- [x] Миграция V6 написана
- [x] Миграция проверена на чистой БД (flyway migrate с нуля)
- [x] Нет конфликтов с предыдущими миграциями

---

## Backend

### Entity
- [x] `WallpaperEntity.java` -- поля: id, filePath, originalName, mediaType, active, createdAt

### Repository
- [x] `WallpaperRepository.java` -- extends JpaRepository<WallpaperEntity, Long>
- [x] Кастомные запросы: findByActiveTrue(), @Modifying updateAllSetActiveFalse()

### DTO
- [x] `WallpaperResponse.java` -- id, originalName, mediaType, active, createdAt, url
- [x] Upload принимает MultipartFile, отдельный request DTO не нужен

### Service
- [x] `WallpaperService.java`
- [x] Методы: uploadWallpaper, getWallpapers, getActiveWallpaper, setActive, deleteWallpaper
- [x] [WARNING] `setActive(Long id)` -- в одной транзакции: сбросить active=false у всех, затем active=true у выбранного
- [x] Загрузка файла: генерировать UUID-имя, сохранять в uploads/wallpapers/
- [x] Удаление: удалить запись из БД И файл с диска
- [x] Логика только в сервисе

### Файловые операции
- [x] Имя файла на диске генерируется сервером (UUID), `original_name` только для отображения
- [x] Файлы хранятся в uploads/wallpapers/
- [x] Поддерживаемые форматы: .jpg, .png, .gif, .mp4, .webp
- [x] Проверка MIME-типа при загрузке
- [x] MediaController serves videos inline (not as attachment) for wallpaper playback

### Controller
- [x] `WallpaperController.java` -- @RestController, @RequestMapping("/api/v1/wallpapers")
- [x] GET / -- список всех обоев
- [x] GET /active -- текущие активные обои
- [x] POST / -- загрузка файла (MultipartFile)
- [x] PATCH /{id}/activate -- установить обои как активные
- [x] PATCH /deactivate -- деактивировать все обои
- [x] DELETE /{id} -- удаление обоев (файл + запись в БД)
- [x] Все методы возвращают ApiResponse<T>

---

## Frontend (FSD)

### entities/wallpaper
- [x] `types.ts` -- интерфейс Wallpaper
- [x] `api.ts` -- axios-вызовы: getWallpapers, getActiveWallpaper, uploadWallpaper, setActive, deleteWallpaper
- [x] `index.ts` -- публичный экспорт

### features/
- [x] `uploadWallpaper/` -- форма/кнопка загрузки файла с file input
- [x] `deleteWallpaper/` -- кнопка удаления с подтверждением

### widgets/WallpaperGallery
- [x] Компонент галереи обоев
- [x] Сетка превью-изображений
- [x] Индикатор активного обоя (выделение рамкой/badge)
- [x] Клик по превью -> активация обоев
- [x] Пропсы типизированы

### pages/WallpaperPage
- [x] Страница подключена к роутеру (/wallpaper)
- [x] Premium Apple/Vercel dual-layer дизайн
- [x] Данные загружаются через @tanstack/react-query
- [x] Превью активного обоя в шапке страницы
- [x] Галерея всех загруженных обоев ниже

### Интеграция с App.tsx Layout
- [x] Активный обой отображается как фон всего приложения (не только на WallpaperPage)
- [x] Запрос активного обоя при загрузке App
- [x] Поддержка gif-анимации как фона
- [x] Поддержка mp4 видео как фона (loop, muted HTML5 video)
- [x] Dual-layer rendering: blurred cover (24px, 125% scale) + 3:4 aspect ratio foreground with cover
- [x] GIF wallpapers render only inside sidebar (aspect-square container)
- [x] Dark overlay for readability

---

## Сценарии для ручного тестирования

- [x] Загрузить jpg-файл -> появился в галерее
- [x] Загрузить gif-файл -> появился в галерее, анимация работает в превью и на фоне
- [x] Загрузить mp4-файл -> появился в галерее, видео играет на фоне
- [x] Активировать обои -> фон приложения сменился (dual-layer rendering)
- [x] Активировать другие обои -> предыдущие деактивировались, новые стали фоном
- [x] Деактивировать обои -> фоновый wallpaper сброшен
- [x] Удалить обои -> исчезли из галереи, файл удален с диска
- [x] Удалить активные обои -> фон сбрасывается
- [x] Перезагрузить страницу -> активные обои сохранились
- [x] Пустая галерея -> UI не падает, показывает заглушку
- [x] Загрузить файл неподдерживаемого формата -> ошибка валидации

---

## Признак завершения эпика

> Все сценарии пройдены. Обои загружаются (jpg/png/gif/mp4), отображаются в галерее, активируются как фон приложения с premium dual-layer дизайном. GIF отображается в sidebar как 1x1. Video wallpaper играет с loop/muted. Данные и файлы переживают перезапуск бэка.

---

## Заметки

- [WARNING] Единственный active: setActive в одной транзакции сбрасывает все active=false перед установкой нового active=true.
- [WARNING] UUID-имена файлов на диске. original_name никогда не используется как file_path.
- [INFO] Dual-layer rendering: blurred background (24px, 125%) + 3:4 foreground with cover.
- [INFO] GIF wallpapers confined to sidebar (aspect-square) to avoid fullscreen distortion.
- [INFO] Video wallpaper uses HTML5 video with loop and muted attributes.
