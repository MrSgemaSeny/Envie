# Templates Page — Graph Redesign
> Envie / src/pages/TemplatesPage

---

## 1. Что не так сейчас

Текущий layout: sidebar-list слева + viewer справа.  
Проблема не в коде — проблема в парадигме.  
Список файлов не даёт никакого контекста: что это, зачем, как связано.  
12 файлов с именами типа `EPIC_BOARD.md` выглядят как папка в проводнике Windows.

Цель редизайна: **граф как навигация, viewer как детализация**.

---

## 2. Теория — как работает граф

### Откуда берутся связи

Два варианта:

**A. Автосвязи по префиксу** (проще, нулевой бэк):
```
EPIC_BOARD.md ─┐
EPIC_IDEAS.md  ├─ группа "EPIC"
EPIC_NOTES.md  ┘

AI_CODER_PROMPT.md ─ группа "AI"
STYLE_GUIDE.md     ─ группа "STYLE"
```
Парсим имя файла: `name.split('_')[0]` → группа.  
Связи строятся между файлами одной группы автоматически.  
Никаких таблиц в БД, никаких ручных действий.

**B. Ручные связи через БД** (гибко, но надо кликать):
```sql
CREATE TABLE template_links (
  source VARCHAR(255),
  target VARCHAR(255),
  PRIMARY KEY (source, target)
);
```
Юзер сам выбирает "связать CONTEXT.md с EPIC_BOARD.md".

**Выбор для Envie: вариант A** — автосвязи по префиксу.  
Красиво сразу, без настройки. Всегда можно добавить B поверх.

---

## 3. Библиотека графа

Лучший вариант для React + красота: **`@react-three/fiber`** (overkill).  
Оптимальный: **`react-force-graph-2d`** — WebGL, физика, zero-config.

```bash
npm install react-force-graph-2d
```

Альтернатива без WebGL: **`d3-force`** напрямую через `useEffect` + SVG.  
D3 даёт больше контроля над анимацией нод, но больше кода.

**Выбор: `react-force-graph-2d`** — быстро, красиво, нет лишнего кода.

---

## 4. Структура данных графа

```typescript
// src/entities/template/types.ts — добавить:

export interface GraphNode {
  id: string;        // имя файла: "EPIC_BOARD.md"
  name: string;      // отображаемое имя: "EPIC_BOARD"
  group: string;     // префикс: "EPIC"
  updatedAt: string;
  val: number;       // размер ноды (все = 1 для начала)
}

export interface GraphLink {
  source: string;    // "EPIC_BOARD.md"
  target: string;    // "EPIC_IDEAS.md"
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
```

---

## 5. Утилита построения графа

```typescript
// src/entities/template/lib/buildGraph.ts

import { Template, GraphData, GraphNode, GraphLink } from '../types';

// Цвет по группе — монохром с акцентом через opacity
const GROUP_COLORS: Record<string, string> = {
  EPIC:    'rgba(250,250,250,0.9)',
  AI:      'rgba(250,250,250,0.6)',
  STYLE:   'rgba(250,250,250,0.5)',
  PROJECT: 'rgba(250,250,250,0.7)',
  DEFAULT: 'rgba(250,250,250,0.4)',
};

export function buildGraph(templates: Template[]): GraphData {
  const nodes: GraphNode[] = templates.map(t => {
    const group = t.name.includes('_')
      ? t.name.split('_')[0].toUpperCase()
      : 'DEFAULT';

    return {
      id: t.name,
      name: t.name.replace('.md', ''),
      group,
      updatedAt: t.updatedAt,
      val: 1,
      color: GROUP_COLORS[group] ?? GROUP_COLORS.DEFAULT,
    };
  });

  // Строим связи: все файлы одной группы связаны между собой
  const links: GraphLink[] = [];
  const byGroup = nodes.reduce((acc, node) => {
    if (!acc[node.group]) acc[node.group] = [];
    acc[node.group].push(node.id);
    return acc;
  }, {} as Record<string, string[]>);

  Object.values(byGroup).forEach(group => {
    for (let i = 0; i < group.length - 1; i++) {
      links.push({ source: group[i], target: group[i + 1] });
    }
  });

  return { nodes, links };
}
```

---

## 6. Компонент графа

```typescript
// src/widgets/TemplateGraph/TemplateGraph.tsx

import { useRef, useCallback, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { GraphData, GraphNode } from '../../entities/template/types';

interface Props {
  data: GraphData;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TemplateGraph({ data, selectedId, onSelect }: Props) {
  const fgRef = useRef<any>(null);

  // Центрировать граф при маунте
  useEffect(() => {
    if (fgRef.current) {
      setTimeout(() => fgRef.current?.zoomToFit(400, 80), 300);
    }
  }, [data]);

  const paintNode = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D) => {
    const isSelected = node.id === selectedId;
    const r = isSelected ? 7 : 5;

    // Glow для выбранной ноды
    if (isSelected) {
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, r + 6, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fill();
    }

    // Нода
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, r, 0, 2 * Math.PI);
    ctx.fillStyle = isSelected ? '#ffffff' : (node as any).color;
    ctx.fill();

    // Лейбл
    ctx.font = `${isSelected ? 600 : 400} 3.5px Geist Sans, sans-serif`;
    ctx.fillStyle = isSelected ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'center';
    ctx.fillText(node.name, node.x!, node.y! + r + 5);
  }, [selectedId]);

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={data}
      backgroundColor="transparent"
      nodeCanvasObject={paintNode}
      nodeCanvasObjectMode={() => 'replace'}
      linkColor={() => 'rgba(255,255,255,0.08)'}
      linkWidth={1}
      onNodeClick={(node: any) => onSelect(node.id)}
      cooldownTicks={100}
      nodeRelSize={5}
      d3AlphaDecay={0.02}
      d3VelocityDecay={0.3}
    />
  );
}
```

---

## 7. Новый TemplatesPage

```typescript
// src/pages/TemplatesPage/TemplatesPage.tsx

import { useState, useMemo } from 'react';
import { useGetTemplates, useGetTemplate } from '../../entities/template/api';
import { TemplateGraph } from '../../widgets/TemplateGraph/TemplateGraph';
import { TemplateViewer } from '../../widgets/TemplateViewer/TemplateViewer';
import { buildGraph } from '../../entities/template/lib/buildGraph';

export function TemplatesPage() {
  const { data: templates = [] } = useGetTemplates();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: selectedTemplate } = useGetTemplate(selectedId);

  const graphData = useMemo(() => buildGraph(templates), [templates]);

  return (
    <div className="relative flex h-full overflow-hidden">

      {/* Граф — занимает весь экран */}
      <div className="flex-1 relative">
        {templates.length > 0 && (
          <TemplateGraph
            data={graphData}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}

        {/* Hint если ничего не выбрано */}
        {!selectedId && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-xs text-muted-foreground/30 tracking-widest uppercase">
              Click a node
            </p>
          </div>
        )}
      </div>

      {/* Viewer — выезжает справа как drawer */}
      <div className={`
        absolute right-0 top-0 h-full w-[480px] z-20
        bg-background/80 backdrop-blur-xl border-l border-border/30
        transition-transform duration-300
        ${selectedId ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {selectedTemplate && (
          <div className="h-full flex flex-col">
            {/* Close button */}
            <button
              onClick={() => setSelectedId(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex-1 overflow-auto p-6 pt-8">
              <TemplateViewer template={selectedTemplate} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 8. Структура файлов — что добавляется

```
src/
├── entities/
│   └── template/
│       ├── api.ts           (без изменений)
│       ├── types.ts         (+ GraphNode, GraphLink, GraphData)
│       └── lib/
│           └── buildGraph.ts  ← NEW
├── widgets/
│   ├── TemplateViewer/      (без изменений)
│   └── TemplateGraph/       ← NEW
│       └── TemplateGraph.tsx
└── pages/
    └── TemplatesPage/
        └── TemplatesPage.tsx  (полная замена)
```

---

## 9. Roadmap

### Шаг 1 — Установка и скелет (30 мин)
```bash
npm install react-force-graph-2d
npm install --save-dev @types/react-force-graph-2d
```
Создать `buildGraph.ts`, убедиться что граф рендерится с тестовыми данными.

### Шаг 2 — Интеграция с реальными данными (20 мин)
Подключить `useGetTemplates`, передать в `buildGraph`, проверить группировку.

### Шаг 3 — Drawer viewer (20 мин)
Slide-in панель справа при клике на ноду. `TemplateViewer` без изменений — просто переносим внутрь.

### Шаг 4 — Полировка (30 мин)
- Hover эффект на нодах (cursor: pointer)
- Анимация появления нод при первом рендере (`fgRef.current?.zoomToFit`)
- Убрать Edit кнопку из TemplateViewer (просмотр — не редактируем)

---

## 10. Подводные камни

**`react-force-graph-2d` и SSR** — не проблема, Vite/CRA работает.

**Canvas и Retina** — библиотека сама обрабатывает `devicePixelRatio`, но если ноды выглядят размыто — добавить `nodeRelSize` побольше.

**Прозрачный фон** — `backgroundColor="transparent"` работает, но canvas элемент по умолчанию белый. Нужно убедиться что у canvas нет `background` в CSS.

**Физика разлетается за экран** — решается через `fgRef.current?.zoomToFit(400, 80)` после `cooldownTicks`.

**Группы с одним файлом** — нода без связей будет одинокой в пространстве, физика её унесёт. Фикс: добавить центральный "root" нод и связать с ним все одиночки.

```typescript
// buildGraph.ts — добавить в конце функции:
const loners = nodes.filter(n =>
  !links.some(l => l.source === n.id || l.target === n.id)
);
// Можно создать невидимый центральный нод и связать их с ним
// или просто оставить — для 12 файлов это не критично
```
