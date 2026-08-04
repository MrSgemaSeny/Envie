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

## Recent Changes
- Updated `src/index.css` with semantic color palette based on `ENVIE_DESIGN.md`.
- Refactored `App.tsx`, `BoardPage`, `FeedPage`, `NoteCard`, `TaskCard`, and all forms to use the new semantic tokens and transition rules.
- Replaced custom error divs with `sonner` Toaster in `App.tsx`.
- Replaced `window.confirm` with Vaul `<Drawer>` for deleting tasks in `TaskCard`.
- Enforced strict sub-300ms, transform/opacity only animations with custom ease-outs.
