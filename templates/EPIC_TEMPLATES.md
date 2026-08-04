# EPIC: Templates (MD-шаблоны)

---

## Контекст

**Модуль:** templates  
**Фаза:** Фаза 3.4  
**Зависит от:** scaffold  
**Статус:** [ ] не начато

---

## Цель эпика

> Пользователь может просматривать список MD-шаблонов (промпты, планы, шаблоны проектов) из папки templates/ и читать их содержимое в отрендеренном виде. Редактирование -- опционально в первой версии.

---

## БД -- миграция

**Миграция не требуется.** Шаблоны хранятся как файлы на диске в папке `templates/`, не в БД.

---

## Backend

### Entity

Entity не требуется -- данные не в БД.

### Repository

Repository не требуется -- данные не в БД.

### DTO
- [ ] `TemplateListItem.java` -- record: name, sizeBytes, lastModified
- [ ] `TemplateContent.java` -- record: name, content, lastModified

### Service
- [ ] `TemplateService.java`
- [ ] Методы: listTemplates, getTemplateByName, saveTemplate (опционально)
- [ ] [CRITICAL] Валидация имени файла: разрешены ТОЛЬКО файлы из списка, полученного через listTemplates. Никаких `../`, абсолютных путей, символических ссылок.
- [ ] Whitelist-подход: список допустимых файлов строится через Files.list() папки templates/, параметр name проверяется строго по этому списку.

### Controller
- [ ] `TemplateController.java` -- @RestController, @RequestMapping("/api/v1/templates")
- [ ] GET / -- список файлов в папке templates/
- [ ] GET /{name} -- содержимое конкретного шаблона
- [ ] PUT /{name} -- сохранение шаблона (опционально, MVP можно не делать)
- [ ] [CRITICAL] Параметр `name` валидируется по whitelist, не используется как сырой путь к файлу
- [ ] Все методы возвращают ApiResponse<T>

---

## Frontend (FSD)

### entities/template
- [ ] `types.ts` -- интерфейсы TemplateListItem, TemplateContent
- [ ] `api.ts` -- axios-вызовы: getTemplates, getTemplateByName, saveTemplate
- [ ] `index.ts` -- публичный экспорт

### features/
- [ ] `editTemplate/` -- редактирование шаблона (опционально, v2)

### widgets/TemplateViewer
- [ ] Компонент просмотра MD-шаблона
- [ ] Рендер markdown через react-markdown или аналог
- [ ] Подсветка синтаксиса в блоках кода
- [ ] Пропсы типизированы

### pages/TemplatesPage
- [ ] Страница подключена к роутеру
- [ ] Layout: список шаблонов слева, просмотр справа (split-pane)
- [ ] Данные загружаются через @tanstack/react-query
- [ ] Состояния: загрузка / ошибка / пустой список / данные
- [ ] Выбор шаблона из списка -> содержимое отображается справа

---

## Сценарии для ручного тестирования

- [ ] Открыть страницу Templates -> список MD-файлов из папки templates/ отобразился
- [ ] Выбрать шаблон -> содержимое отрендерилось справа как markdown
- [ ] Попытка path traversal (../etc/passwd в URL) -> 400 Bad Request, не 500 и не содержимое файла
- [ ] Пустая папка templates/ -> UI показывает заглушку
- [ ] Добавить новый .md файл в папку -> после обновления страницы он появился в списке

---

## Признак завершения эпика

> Список шаблонов отображается из папки templates/, содержимое рендерится как markdown. Path traversal заблокирован. Редактирование не обязательно для закрытия эпика.

---

## Заметки

- [CRITICAL] Path traversal -- главный security-риск этого модуля. Валидация по whitelist обязательна.
- Шаблоны не в БД, Flyway миграция не нужна.
- Редактирование (PUT endpoint + editTemplate feature) -- nice-to-have, не блокирует закрытие эпика.
- Для рендера markdown на фронтенде использовать react-markdown с поддержкой GFM.
- Этот модуль не имеет Entity/Repository -- исключение из стандартного паттерна.
