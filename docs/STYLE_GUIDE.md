# STYLE_GUIDE.md — Envie
# Конвенции кода. AI-кодер обязан следовать этому файлу.
# При конфликте с "общепринятым" — этот файл приоритетнее.

---

## Backend (Java / Spring Boot)

### Общее
- Java 21, используй records для DTO где возможно
- **Entity — всегда class, не record.** JPA требует mutable no-args constructor и final-поля record с Hibernate не совместимы.
- Lombok: @Getter, @Setter, @RequiredArgsConstructor, @Builder — да. @Data — нет (equals/hashCode проблемы с JPA)
- Никаких статических утилитных классов с состоянием
- Исключения — только через кастомные классы наследующие RuntimeException

### Структура пакетов
```
kz.envie.
├── notes/
│   ├── NoteEntity.java
│   ├── NoteRepository.java
│   ├── NoteService.java
│   ├── NoteController.java
│   └── dto/
│       ├── NoteResponse.java
│       ├── CreateNoteRequest.java
│       └── UpdateNoteRequest.java
├── shared/
│   ├── ApiResponse.java       ← единый формат ответа
│   ├── GlobalExceptionHandler.java
│   └── exception/
│       ├── NotFoundException.java
│       └── BadRequestException.java
```

### ApiResponse — единый формат
```java
public record ApiResponse<T>(
    boolean success,
    T data,
    String message
) {
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null);
    }
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, null, message);
    }
}
```
Все контроллеры возвращают `ResponseEntity<ApiResponse<T>>`. Никогда голый объект.

### Контроллеры
```java
@RestController
@RequestMapping("/api/v1/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NoteResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(noteService.getAll()));
    }
}
```
- Логика только в сервисе, контроллер — тонкий роутер
- Валидация входных данных через @Valid + Jakarta Validation

### Сервисы
- Транзакции на уровне сервиса (@Transactional), не контроллера
- Методы findById всегда бросают NotFoundException если не найдено
- Нет прямых вызовов репозитория из контроллера

### Миграции (Flyway)
- Только новые файлы, никогда не редактируй существующие
- Имена: `V1__init.sql`, `V2__notes.sql`, `V3__board.sql`
- Всегда: IF NOT EXISTS где применимо
- Комментарий в начале файла: что делает миграция

### Логирование
```java
private static final Logger log = LoggerFactory.getLogger(NoteService.class);
log.info("Creating note");     // не System.out.println
log.error("Failed", e);        // с exception объектом
```
Никогда не логируй содержимое запросов целиком (может содержать чувствительное).

---

## Frontend (React / TypeScript / FSD)

### Структура FSD — правило импортов
```
pages     → может импортировать: widgets, features, entities, shared
widgets   → может импортировать: features, entities, shared
features  → может импортировать: entities, shared
entities  → может импортировать: shared
shared    → ничего из выше
```
Нарушение этих правил — ошибка архитектуры.

### Типизация
- Никаких `any`. Если не знаешь тип — `unknown` и сужай.
- Все пропсы компонентов типизированы через interface, не inline
- API ответы типизированы через интерфейсы в `entities/*/types.ts`

### API слой (entities/*/api.ts)
```typescript
// entities/note/api.ts
import { apiClient } from '@/shared/api/client';
import type { Note, CreateNoteDto } from './types';

export const noteApi = {
  getAll: () => apiClient.get<Note[]>('/notes'),
  getById: (id: number) => apiClient.get<Note>(`/notes/${id}`),
  create: (dto: CreateNoteDto) => apiClient.post<Note>('/notes', dto),
  update: (id: number, dto: Partial<CreateNoteDto>) => apiClient.put<Note>(`/notes/${id}`, dto),
  delete: (id: number) => apiClient.delete(`/notes/${id}`),
};
```
Все запросы только через `noteApi`, никогда прямой axios в компонентах.

### React Query
```typescript
// В компоненте
const { data, isLoading, error } = useQuery({
  queryKey: ['notes'],
  queryFn: noteApi.getAll,
});

const mutation = useMutation({
  mutationFn: noteApi.create,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
});
```
Никакого useState для серверных данных — только React Query.

### Компоненты
- Функциональные компоненты, никаких классовых
- Один компонент — один файл
- Имя файла = имя компонента: `NoteCard.tsx`
- Экспорт именованный, не default (кроме pages)

### Именование
| Тип | Стиль | Пример |
|-----|-------|--------|
| Компонент | PascalCase | `NoteCard` |
| Хук | camelCase с use | `useNotes` |
| Файл компонента | PascalCase | `NoteCard.tsx` |
| Файл утилиты | camelCase | `formatDate.ts` |
| CSS класс | kebab-case (Tailwind) | `note-card` |
| Константа | UPPER_SNAKE | `API_BASE_URL` |

### Tailwind v4
- Только утилитные классы, никаких кастомных CSS файлов для компонентов
- Responsive: mobile-first (sm:, md:, lg:)
- Тёмная тема через dark: префикс если нужна

### Обработка состояний в UI
Каждый список/запрос обязан иметь три состояния:
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage message={error.message} />;
if (!data?.length) return <EmptyState text="Нет записей" />;
return <NoteList notes={data} />;
```

---

## Git конвенции

### Коммиты
```
feat(notes): add create note endpoint
fix(board): fix subtask deletion cascade
chore: update dependencies
refactor(ideas): extract AI service
docs: update CONTEXT.md
```
Формат: `тип(модуль): описание на английском`

### Ветки
```
main          ← стабильный код
feat/notes    ← новый модуль или фича
fix/board-bug ← исправление бага
```

---

## Что никогда не делать

- `ddl-auto=create` или `update` — никогда, только `validate`
- `SELECT *` в нативных запросах
- Бизнес-логика в контроллере
- `any` в TypeScript
- `console.log` в продакшн коде (фронт)
- `System.out.println` в Java
- Секреты в коде или в git
- Редактирование существующих Flyway миграций
- Прямой axios в React компонентах (только через api.ts)
- useState для данных с сервера (только React Query)
