# Envie

Personal knowledge base and task management for solo developers.
"Without cloud. Without authorization. Without excess."

## Modules
- **Landing**: Minimal root page (`/`) with clock and globe. Fast loading.
- **Dashboard**: Interactive 3D scene (Three.js) with wireframe box, glowing core, rings, GSAP animations, bento modules.
- **Notes**: Twitter-style feed with tags, media attachments, two-column layout, timeline cards.
- **Board**: Flat grid Kanban (tasks + subtasks) without Jira bureaucracy. Vaul drawers, Sonner toasts.
- **Ideas**: Startup/project ideas base with structure (Problem, Solution, Audience, Monetization). Status badges.
- **Templates**: Markdown templates system with D3 graph visualization. Stored in PostgreSQL.
- **Wallpaper**: Customizable background (images, GIFs, video). Premium dual-layer rendering (blurred cover + 3:4 frame).
- **For You**: Focus screen with minimal UI for deep work.

## Tech Stack

**Backend:**
- Java 17 / Spring Boot 3
- PostgreSQL (database)
- Flyway (schema versioning, migrations)
- Gradle (build)
- Architecture: REST API, Controller-Service-Repository

**Frontend:**
- React 18 / TypeScript / Vite
- Tailwind CSS v4
- React Query (@tanstack/react-query)
- React Router DOM
- Feature-Sliced Design (FSD) architecture
- UI: Sonner (toasts), Vaul (drawers)
- Graphics: Three.js, GSAP, react-force-graph-2d, react-markdown

## Design System
Emil Kowalski principles:
- Animations: `transform` and `opacity` only (no `transition-all`).
- Easing: `ease-out`.
- Micro-interactions: button scale on press (`active:scale-95`).
- No emoji, strict typography (Geist), flat premium design with subtle shadows.
- Semantic Tailwind tokens: `bg-background`, `text-foreground`, `border-border`.

## Project Structure
```
/workspace/project/Envie/
├── backend/           # Spring Boot application
│   └── src/main/resources/db/migration/  # Flyway migrations
├── frontend/          # React application
│   └── src/
│       ├── entities/     # Data types and API
│       ├── features/     # User actions
│       ├── widgets/      # Reusable components
│       └── pages/       # Route pages
├── templates/          # Markdown templates
├── docker-compose.yml  # PostgreSQL + App
└── README.md
```

## Quick Start

**Docker (Full stack):**
```bash
docker-compose up -d
```

**Local development (Backend):**
```bash
cd backend
./gradlew bootRun
```
Requires PostgreSQL instance (test_user/pass1, envie database).

**Local development (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

## Database (Flyway)
All DB changes versioned in `backend/src/main/resources/db/migration/`.
Existing `V...__name.sql` files are immutable. New changes via new migrations only.

## Migrations Overview
- V1: Initial schema
- V2: Notes tables
- V3: Board (tasks/subtasks)
- V4: Ideas
- V5: Remove AI architecture
- V6: Wallpaper
- V7: Templates (moved to PostgreSQL)
