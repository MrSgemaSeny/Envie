# EPIC: Landing Page (Главная страница)

---

## Контекст

**Модуль:** landing  
**Фаза:** Фаза 2.x  
**Зависит от:** scaffold  
**Статус:** [x] готово

---

## Цель эпика

> Простая landing page на корневом маршруте `/` с часами и globe-элементом. Быстрая загрузка, минимум UI, фокус на эстетике.

---

## Frontend (FSD)

### pages/LandingPage
- [x] Маршрут `/` (корневой)
- [x] Простые часы (время)
- [x] Globe/wireframe элемент
- [x] Быстрая загрузка (минимальный bundle)
- [x] Ссылка на /dashboard для полной презентации

### Design
- [x] Minimalist aesthetic
- [x] Focus on typography
- [x] No heavy animations on load
- [x] Clear CTA to dashboard

---

## Сценарии для ручного тестирования

- [x] Открыть / -> простая страница с часами
- [x] Быстрая загрузка ( < 1s)
- [x] CTA click -> переход на /dashboard

---

## Признак завершения эпика

> Landing page `/` загружается быстро, показывает часы и globe. CTA ведет на dashboard.

---

## Заметки

- [INFO] Landing должен быть быстрым и простым
- [INFO] Dashboard -- это где сложная 3D-презентация
