# Envie Context

## Current State
- The Board (Kanban) module frontend has been implemented.
- Added Task and Subtask entities with React Query hooks connected to the `apiClient`.
- Implemented `CreateTaskForm` and `CreateSubtaskForm` components using Emil's UI principles.
- Created `TaskCard` widget with delete confirmation and subtask toggling.
- Added a `BoardPage` showcasing tasks in a masonry layout and linked it in `App.tsx`.
- Integrated custom `ease-out` timing functions in `index.css` for animations compliant with Emil's design rules.
- **Design System Overhaul completed**: All components use semantic Tailwind tokens (`bg-background`, `text-foreground`, `border-border`, etc.). Hardcoded colors removed.
- **UI Libraries integrated**: Added `sonner` for toast notifications and `vaul` for bottom sheet drawers (used in TaskCard deletion confirmation).
- **Ideas Module implemented (Phase 3.3)**: Added Idea entity, `CreateIdeaDrawer`, `IdeaCard` with architecture generation pulse animation, and `IdeasPage` with CSS grid layout.
- **Backend Ideas Module**: Added `V4__ideas.sql` (UUID), `IdeaEntity`, `IdeaService`, `IdeaController`, and `AnthropicClient` (built-in HttpClient). `AI_IDEA_PROMPT.md` created.

## Recent Changes
- Updated `src/index.css` with semantic color palette based on `ENVIE_DESIGN.md`.
- Refactored `App.tsx`, `BoardPage`, `FeedPage`, `NoteCard`, `TaskCard`, and all forms to use the new semantic tokens and transition rules.
- Replaced custom error divs with `sonner` Toaster in `App.tsx`.
- Replaced `window.confirm` with Vaul `<Drawer>` for deleting tasks in `TaskCard`.
- Enforced strict sub-300ms, transform/opacity only animations with custom ease-outs.
- Implemented frontend for Ideas module: entity types, API hooks, UI components (`IdeaCard`, `CreateIdeaDrawer`, `IdeasPage`), integrated with `vaul` and `sonner`.
- Implemented backend for Ideas module: integrated Anthropic API for architecture generation.
- **Frontend Layout Refactored**: Replaced top navigation with a persistent left-side vertical sidebar. Added a new `DashboardPage` as the default landing route (`/`), moving the feed to `/notes`.
- **White Shadows UI**: Added custom css variables for white glows (`--shadow-glow`, `--shadow-glow-hover`) in `index.css` and applied them globally to all cards (`IdeaCard`, `NoteCard`, `TaskCard`) via Tailwind classes for an elevated premium look.
- **Frontend AI Removal**: Removed all traces of AI architecture generation from the frontend codebase, including `aiArchitecture` fields, API hooks, and UI buttons.
- **Templates Module Frontend (Phase 3.4)**: Added `react-markdown` and `remark-gfm`. Created Types and API hooks for templates. Implemented `TemplateViewer` for reading and editing markdown with custom thematic styling. Created `TemplatesPage` with a sidebar layout and connected it to the `/templates` route in `App.tsx`.
- **Backend Templates & Security**: Created `TemplateController` and `TemplateService` for reading and writing local `.md` files without database. Implemented strict path traversal validation using normalized path startsWith checks. Fixed logic operators in `MediaController`. Deleted Anthropic related backend configurations and created V5 migration to remove `ai_architecture` from the database.
- **Premium UI Refactor**: Refactored Board, Feed, and Ideas modules to use a modern Vercel/shadcn aesthetic. Replaced heavy animations and white glows with flat design, subtle `shadow-sm`, compact padding, sharp Geist typography hierarchy, and beautiful compact badges.
- **UI Refactor & Type Strictness**: Redesigned App sidebar, DashboardPage, and TemplatesPage/TemplateViewer to look premium, modern, and clean, heavily inspired by Vercel/shadcn style. Ensured clean markdown rendering. Fixed all implicit `any` TypeScript errors across the codebase.
- **Backend Wallpaper Module**: Created `V6__wallpaper.sql` migration, `WallpaperEntity`, `WallpaperDto`, `WallpaperRepository`, `WallpaperService` and `WallpaperController`. Handled file uploads using existing `FileStorageService` and implemented endpoints to set and get the active wallpaper.
- **Frontend Wallpaper Module**: Implemented `WallpaperPage` for viewing and uploading wallpapers. Integrated `useActiveWallpaper` hook in `App.tsx` Layout to dynamically set the app's background image with a dark overlay. Added a glassmorphism effect (`backdrop-blur-md`) to `.bg-card` globally in `index.css`.
- **Notes Redesign (v3)**: Redesigned the Notes page to use a two-column layout (w-72 left panel for composer and stats, right panel for the scrollable feed). Transformed notes into modern, borderless timeline cards separated by subtle borders with normal font weight. Upgraded composer with image previews and separate Photo/File upload controls.
- **Video Wallpaper Support**: Fixed `MediaController.java` to serve videos inline rather than as attachments. Updated layout and wallpaper selector to render background video wallpaper animations using loop/muted HTML5 elements.
- **Layout & Rendering Fixes**: Implemented a collapsible layout sidebar with a simple, static hamburger menu button located at the top-left (no X-cross animation, button remains static). Restored video wallpaper visibility on the Dashboard route by clearing background fills in Three.js and CSS. Redesigned image attachments inside NoteCards to preserve aspect ratios (using object-contain with max-h-450px) instead of forced banner crops.
- **GIF Wallpaper Sidebar Placement**: Configured GIF wallpapers to render exclusively inside the sidebar as a 1x1 aspect ratio container (`aspect-square`), avoiding fullscreen distortion.
