# Design Engineering — Emil Kowalski
# Source: https://github.com/emilkowalski/skills/blob/main/skills/emil-design-eng/SKILL.md
# Добавь этот файл в docs/ и скидывай AI-кодеру вместе с AI_CODER_PROMPT.md

---

## Core Philosophy

### Taste is trained, not innate
Good taste is not personal preference. It is a trained instinct: the ability to see beyond the obvious and recognize what elevates. Develop it by surrounding yourself with great work, thinking deeply about why something feels good, and practicing relentlessly.

### Unseen details compound
Most details users never consciously notice. That is the point. Every invisible correct decision compounds into something people love without knowing why.

### Beauty is leverage
People select tools based on the overall experience. Good defaults and good animations are real differentiators.

---

## Review Format

When reviewing UI code — markdown table with Before/After/Why columns:

| Before | After | Why |
|--------|-------|-----|
| `transition: all 300ms` | `transition: transform 200ms ease-out` | Specify exact properties; avoid `all` |
| `transform: scale(0)` | `transform: scale(0.95); opacity: 0` | Nothing in the real world appears from nothing |
| `ease-in` on dropdown | `ease-out` with custom curve | `ease-in` feels sluggish |
| No `:active` state on button | `transform: scale(0.97)` on `:active` | Buttons must feel responsive to press |
| `transform-origin: center` on popover | `transform-origin: var(--radix-popover-content-transform-origin)` | Scale from trigger, not center |

---

## Animation Decision Framework

### 1. Should this animate at all?

| Frequency | Decision |
|-----------|----------|
| 100+ times/day (keyboard shortcuts) | No animation. Ever. |
| Tens of times/day (hover, list nav) | Remove or drastically reduce |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare/first-time (onboarding) | Can add delight |

**Never animate keyboard-initiated actions.**

### 2. Easing

Enter/exit → `ease-out` (starts fast, feels responsive)
Moving on screen → `ease-in-out`
Hover/color → `ease`
Constant motion → `linear`

**Custom curves — обязательно:**
```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```

**Никогда `ease-in` для UI.** Начинается медленно → интерфейс кажется вялым.

Ресурсы: [easing.dev](https://easing.dev/) / [easings.co](https://easings.co/)

### 3. Duration

| Element | Duration |
|---------|----------|
| Button press | 100–160ms |
| Tooltips, small popovers | 125–200ms |
| Dropdowns, selects | 150–250ms |
| Modals, drawers | 200–500ms |

**Rule: UI анимации — строго под 300ms.**

---

## Component Patterns

### Buttons
```css
.button {
  transition: transform 160ms ease-out;
}
.button:active {
  transform: scale(0.97);
}
```

### Элементы никогда не появляются из scale(0)
```css
/* Bad */
.entering { transform: scale(0); }

/* Good */
.entering { transform: scale(0.95); opacity: 0; }
```

### Popovers — origin-aware
```css
.popover {
  transform-origin: var(--radix-popover-content-transform-origin);
}
```
Исключение: модалки — `transform-origin: center` (не привязаны к триггеру).

### Tooltips — skip delay на последующих
После открытия первого тултипа — соседние открываются мгновенно без анимации.

### Blur для маскировки переходов
```css
.button-content.transitioning {
  filter: blur(2px);
  opacity: 0.7;
}
```
Не более 20px — тяжело для Safari.

### @starting-style для enter анимаций
```css
.toast {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 400ms ease, transform 400ms ease;

  @starting-style {
    opacity: 0;
    transform: translateY(100%);
  }
}
```

---

## Spring Animations

Используй когда: drag с momentum, элементы должны казаться "живыми", прерываемые жесты.

```js
import { useSpring } from 'framer-motion';

// Без spring: искусственно
const rotation = mouseX * 0.1;

// С spring: естественно
const springRotation = useSpring(mouseX * 0.1, {
  stiffness: 100,
  damping: 10,
});
```

**Apple-подход (проще):**
```js
{ type: "spring", duration: 0.5, bounce: 0.2 }
```

Bounce: 0.1–0.3, не больше. Избегай bounce в большинстве UI контекстов.

---

## Gesture / Drag

### Momentum dismissal
```js
const velocity = Math.abs(swipeAmount) / timeTaken;
if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
  dismiss();
}
```

### Damping на границах
Не останавливай drag резко — замедляй. Реальные объекты не бьются об стену.

### Асимметричный timing
Медленно когда пользователь решает → быстро когда система отвечает.
```css
.overlay { transition: clip-path 200ms ease-out; }
.button:active .overlay { transition: clip-path 2s linear; }
```

---

## Performance

- Анимируй только `transform` и `opacity` — GPU, без layout/paint
- Не обновляй CSS-переменные на родителе при drag — только `element.style.transform` напрямую
- Framer Motion `x`/`y` НЕ hardware-accelerated → используй `transform: "translateX()"` под нагрузкой
- CSS анимации > JS под нагрузкой (off main thread)

---

## Stagger

```css
.item { animation: fadeIn 300ms ease-out forwards; }
.item:nth-child(1) { animation-delay: 0ms; }
.item:nth-child(2) { animation-delay: 50ms; }
.item:nth-child(3) { animation-delay: 100ms; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
```
Задержки: 30–80ms между элементами. Не блокируй взаимодействие во время stagger.

---

## Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  .element {
    animation: fade 0.2s ease;
    /* без transform-based motion */
  }
}

@media (hover: hover) and (pointer: fine) {
  .element:hover { transform: scale(1.05); }
}
```

---

## Review Checklist

| Проблема | Решение |
|----------|---------|
| `transition: all` | Конкретные свойства: `transform 200ms ease-out` |
| `scale(0)` при входе | `scale(0.95)` + `opacity: 0` |
| `ease-in` на UI | `ease-out` или custom curve |
| `transform-origin: center` на popover | Привязать к триггеру |
| Анимация на keyboard action | Убрать полностью |
| Duration > 300ms на UI | Сократить до 150–250ms |
| Hover без media query | `@media (hover: hover) and (pointer: fine)` |
| Keyframes на rapidly-triggered | CSS transitions для прерываемости |
| Framer `x`/`y` под нагрузкой | `transform: "translateX()"` |
| Одинаковый enter/exit speed | Exit быстрее чем enter |
| Всё появляется одновременно | Stagger 30–80ms |
