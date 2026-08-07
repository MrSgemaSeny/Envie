# EPIC: Layout (Навигация и сайдбар)

---

## Контекст

**Модуль:** layout  
**Фаза:** Фаза 2.x  
**Зависит от:** scaffold  
**Статус:** [x] готово

---

## Цель эпика

> Постоянный левый вертикальный сайдбар с навигацией между модулями. Collapsible sidebar с smooth transition. Glassmorphism эффект. Wallpaper-aware rendering.

---

## Frontend (FSD)

### Layout Component
- [x] Persistent left-side vertical sidebar
- [x] Collapsible sidebar: margin-left transition (ml-0 to -ml-56)
- [x] Smooth slide without layout wrap/warp
- [x] Static hamburger menu button (top-left, no X-cross animation)
- [x] Glassmorphism effect (backdrop-blur-md) on .bg-card

### Navigation
- [x] Dashboard link (/dashboard)
- [x] Notes/Feed link (/notes)
- [x] Board link (/board)
- [x] Ideas link (/ideas)
- [x] Templates link (/templates)
- [x] Wallpaper link (/wallpaper)
- [x] For You link (/foryou)

### App.tsx Integration
- [x] Routes configuration
- [x] Layout wrapper with sidebar
- [x] Wallpaper background integration
- [x] Dark overlay for readability
- [x] Sonner Toaster for notifications

### Wallpaper-Aware
- [x] useActiveWallpaper hook integration
- [x] Background image with dark overlay
- [x] GIF rendering in sidebar only (aspect-square)
- [x] Video wallpaper playback support

---

## Сценарии для ручного тестирования

- [x] Открыть приложение -> sidebar отображается слева
- [x] Клик на hamburger -> sidebar collapsible animation
- [x] Навигация -> переход между страницами
- [x] Wallpaper active -> background displays
- [x] Glassmorphism -> cards have blur effect

---

## Признак завершения эпика

> Layout обеспечивает навигацию между всеми модулями. Sidebar collapsible с smooth transition. Glassmorphism применен глобально. Wallpaper-aware rendering работает.

---

## Заметки

- [INFO] Sidebar margin-left transition вместо width для smooth animation
- [INFO] Wallpaper может быть GIF (sidebar only) или video (full background)
- [INFO] Dark overlay гарантирует readability поверх wallpaper
