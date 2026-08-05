# Three.js — лендинг с 3D-глобусом
## Теория + разбор кода

---

## 1. Ментальная модель: как работает Three.js

Three.js — обёртка над WebGL. WebGL — API браузера для рисования на GPU через GLSL-шейдеры.  
Ты никогда не пишешь пиксели руками — ты описываешь **объекты, свет, камеру**, а Three.js компилирует это в инструкции для GPU.

Минимальная программа — три объекта:

```
Scene ← всё что существует в мире
  └─ Mesh (объекты)
  └─ Lights (источники света)

Camera ← точка зрения, угол обзора

Renderer ← берёт Scene + Camera → рисует на <canvas>
```

Каждый кадр (60 раз в секунду):
```
requestAnimationFrame → изменить состояние → renderer.render(scene, cam)
```

---

## 2. Инициализация сцены

```js
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(W(), H());
renderer.setClearColor(0x000000, 1); // фон — чёрный
```

**`antialias: true`** — сглаживание краёв. Дорого на мобайле, но на десктопе обязательно для wireframe.

**`setPixelRatio(Math.min(devicePixelRatio, 2))`** — на Retina-экранах devicePixelRatio = 2 или 3. Если рендерить на 3× — утроенная нагрузка на GPU без видимого улучшения. Cap на 2 — разумный компромисс.

**`alpha: false`** — непрозрачный холст. Если `true`, браузер смешивает canvas с DOM-фоном, добавляя overhead. Нам не нужно — фон сам чёрный.

---

## 3. Камера

```js
const cam = new THREE.PerspectiveCamera(38, W() / H(), 0.1, 100);
cam.position.set(1.8, 0, 3.2);
cam.lookAt(1.8, 0, 0);
```

**`PerspectiveCamera(fov, aspect, near, far)`**

| Параметр | Что делает |
|---|---|
| `fov = 38` | Угол обзора в градусах. 38° — узкий, телефото-эффект. Делает глобус монументальным |
| `aspect = W/H` | Соотношение сторон холста. Обновляй при resize |
| `near = 0.1` | Ближняя плоскость отсечения — объекты ближе не рисуются |
| `far = 100` | Дальняя плоскость. Объекты дальше не рисуются |

**Почему `cam.position.x = 1.8`?**  
Глобус находится на x=1.8 (сдвинут вправо). Камера смотрит на ту же точку. Это создаёт эффект "глобус на правой половине экрана" без изменения canvas-layout.

---

## 4. Wireframe-глобус: математика сферы

Глобус — это не `SphereGeometry` с wireframe-материалом. Wireframe-флаг рисует треугольники — некрасиво, видны диагональные линии.

Мы строим линии **вручную** по географической логике:

### Параллели (горизонтальные кольца)

```js
for (let i = 0; i <= LAT_LINES; i++) {
  const lat = -90 + (180 / LAT_LINES) * i; // широта от -90° до +90°
  const phi = (90 - lat) * Math.PI / 180;   // → полярный угол (0 на северном полюсе)
  const r = RADIUS * Math.sin(phi);          // радиус кольца на этой высоте
  const y = RADIUS * Math.cos(phi);          // высота кольца
  // рисуем окружность радиуса r на высоте y
}
```

**Конверсия lat/lon → XYZ** (сферические координаты):
```
φ (phi)   = полярный угол от северного полюса = (90° - lat) в радианах
θ (theta) = азимутальный угол = lon в радианах

x = R · sin(φ) · cos(θ)
y = R · cos(φ)
z = R · sin(φ) · sin(θ)
```

Three.js использует правостороннюю систему: Y вверх, Z к зрителю.

### Меридианы (вертикальные полуокружности)

```js
for (let i = 0; i < LON_LINES; i++) {
  const lon = (360 / LON_LINES) * i;
  const theta = lon * Math.PI / 180;
  // каждая точка: phi идёт от 0 до π (от полюса до полюса)
  for (let j = 0; j <= SEG; j++) {
    const phi = (j / SEG) * Math.PI;
    pts.push(new THREE.Vector3(
      R * Math.sin(phi) * Math.cos(theta),
      R * Math.cos(phi),
      R * Math.sin(phi) * Math.sin(theta)
    ));
  }
}
```

### Почему экватор и нулевой меридиан ярче?

```js
const mat = (lat === 0) ? wireMatBright : wireMat;
```

`opacity: 0.45` vs `opacity: 0.18` — визуальная иерархия. Реальные географические карты делают экватор толще. Это честно передаёт структуру данных через дизайн.

---

## 5. Внутренняя чёрная сфера (culling trick)

```js
const innerGeo = new THREE.SphereGeometry(RADIUS * 0.995, 1, 1);
const innerMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
globeGroup.add(new THREE.Mesh(innerGeo, innerMat));
```

Зачем: без неё линии на "дальней" стороне глобуса просвечивают сквозь глобус и смешиваются с передними. Это выглядит как каша.

Внутренняя сфера рисуется с `BackSide` — значит её "лицо" смотрит внутрь, перекрывая задние линии. Размер `0.995R` — чтобы не перекрывать сами линии передней полусферы.

Это не хак — это стандартный паттерн для wireframe-глобусов.

---

## 6. Анимация

```js
let rotY = 0;
const SPEED = 0.0015;

function animate() {
  requestAnimationFrame(animate);
  rotY += SPEED;
  globeGroup.rotation.y = rotY;
  renderer.render(scene, cam);
}
animate();
```

**Почему не `rotation.y += SPEED` напрямую?**  
Технически одинаково. Но хранить `rotY` отдельно даёт доступ к текущему углу без чтения из Three.js объекта — нужно для конверсии в координаты (строка ниже).

**Преобразование угла в "долготу" для UI:**
```js
const lon = ((rotY * 180 / Math.PI) % 360 + 360) % 360;
```
- `rotY * 180 / Math.PI` — радианы → градусы
- `% 360` — держим в [0, 360)
- `+ 360) % 360` — защита от отрицательных значений в JS (`-10 % 360 = -10`, а не `350`)

---

## 7. Звёзды: PointsMaterial

```js
const starPos = new Float32Array(starCount * 3); // x,y,z для каждой звезды
for (let i = 0; i < starCount * 3; i++) {
  starPos[i] = (Math.random() - 0.5) * 60; // куб 60×60×60 вокруг центра
}
const starGeo = new THREE.BufferGeometry();
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.04, opacity: 0.25 })));
```

`THREE.Points` — один draw call для тысяч точек. Не создавай тысячи отдельных `Mesh` — это убивает GPU.

`Float32Array` — типизированный массив. Three.js работает напрямую с GPU через ArrayBuffer, поэтому нужен именно этот тип, а не обычный JS-массив.

---

## 8. CSS: слои и z-index

```
z-index: 0  — <canvas> (Three.js)
z-index: 4  — #vignette (radial-gradient затемнение краёв)
z-index: 5  — #scanlines (текстура полос)
z-index: 10 — #layout (текст, кнопки)
z-index: 20 — #brand, #status (фиксированные метки)
```

Vignette — `radial-gradient(ellipse, transparent 50%, black 100%)`. Размягчает края глобуса и "вдавливает" сцену в страницу.

Scanlines — `repeating-linear-gradient` с шагом 4px, opacity 3%. Добавляет минимальную текстуру без шума. На мониторах с низкой плотностью пикселей это видно, на Retina — почти нет. Приемлемо.

---

## 9. Шрифты и типографика

| Роль | Шрифт | Почему |
|---|---|---|
| Заголовок, навигация | Space Grotesk | Геометрический гротеск. Выглядит как инженерная документация |
| Часы, метки, координаты | JetBrains Mono | Моноширинный. Цифры не прыгают при смене. Технический register |

Оба с Google Fonts — ни одного CDN кроме. Размер шрифта через `clamp()`:
```css
font-size: clamp(28px, 3.5vw, 52px);
```
`clamp(min, preferred, max)` — адаптивный размер без медиазапросов. Ты задаёшь минимум, идеальное значение в vw, максимум.

---

## 10. Что добавить на следующем шаге (scroll-секции)

После Get Started — три секции с `scroll-snap`:

```
Section 1: Landing (текущая)
Section 2: Notes Feed — превью карточек заметок, твиттер-стиль
Section 3: Board — kanban в 3D-перспективе (CSS transform)
Section 4: Ideas — форма + AI-архитектура
```

Для scroll-анимации: `IntersectionObserver` + CSS `transition`. Three.js-сцену можно переиспользовать — при скролле менять `cam.position` через GSAP или ручной lerp.

Паттерн из `scroll_ladder_demo.html` (который ты прислал) — правильный: `position: sticky` + `scroll` event + lerp-интерполяция. Именно так работают Apple.com и Linear.app.

---

## Подводные камни

| Проблема | Решение |
|---|---|
| `devicePixelRatio > 2` на мобайле | `Math.min(devicePixelRatio, 2)` |
| Размытый canvas при resize | `renderer.setSize()` + `cam.aspect` + `updateProjectionMatrix()` |
| Wireframe-диагонали (треугольники видны) | Строй линии вручную, не используй `wireframe: true` на SphereGeometry |
| Задние линии глобуса просвечивают | Внутренняя сфера с `BackSide` |
| JS `% `с отрицательными числами | `((n % 360) + 360) % 360` |
| Тысячи `Mesh` для частиц | Один `THREE.Points` на все звёзды |

---

*Файл: `threejs-landing-theory.md`*  
*Связан с: `landing.html`*
