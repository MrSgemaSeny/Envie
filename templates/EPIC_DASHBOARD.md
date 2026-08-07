# EPIC: Dashboard (3D-презентация)

---

## Контекст

**Модуль:** dashboard  
**Фаза:** Фаза 2.x  
**Зависит от:** scaffold, layout  
**Статус:** [x] готово

---

## Цель эпика

> Landing-страница с интерактивной 3D-сценой (Three.js), статистикой и вдохновляющим дизайном. Wireframe Box, центральный glowing core, орбитальные кольца, 3D rotating cards carousel.

---

## Frontend (FSD)

### pages/DashboardPage
- [x] Маршрут `/dashboard`
- [x] Three.js Hero canvas: wireframe Box + glowing core + rings
- [x] Transparent renderer (alpha: true, clear alpha 0) для отображения поверх wallpaper
- [x] Helix canvas с 3D rotating cards carousel
- [x] GSAP ScrollTrigger helix ladder model
- [x] Bento modules layout
- [x] Particle blast animation
- [x] Scroll progress listener на main container
- [x] Preloader с session-level state (оптимизация загрузки)

### Three.js Scene
- [x] Wireframe Box geometry
- [x] Glowing central core с bloom effect
- [x] Orbital rings (3 штуки)
- [x] Responsive sizing
- [x] No emoji compliance (Rule 3)

### Kimi Alignment
- [x] Дизайн выровнен с https://msdv5t7ruvpwg.kimi.page/
- [x] Wireframe Box как Hero element
- [x] Glowing central core
- [x] Rings rendering

---

## Сценарии для ручного тестирования

- [x] Открыть /dashboard -> 3D сцена отображается
- [x] Прокрутка -> GSAP animations trigger
- [x] Video wallpaper playing behind -> 3D scene remains visible
- [x] Preloader -> session-level state prevents repeat
- [x] Responsive resize -> canvas adjusts

---

## Признак завершения эпика

> Dashboard отображается на /dashboard с полной 3D-сценой. Wireframe Box, glowing core и rings рендерятся. Bento modules и particle effects работают. 3D scene прозрачная для wallpaper.

---

## Заметки

- [INFO] Three.js scene использует transparent renderer для совместимости с wallpaper
- [INFO] Preloader имеет session-level state для предотвращения повторных показов
- [INFO] No emoji rule строго соблюдается
