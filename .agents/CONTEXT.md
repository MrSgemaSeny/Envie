# Envie Context

## Current State
- The Board (Kanban) module frontend has been implemented.
- Added Task and Subtask entities with React Query hooks connected to the `apiClient`.
- Implemented `CreateTaskForm` and `CreateSubtaskForm` components using Emil's UI principles.
- Created `TaskCard` widget with delete confirmation and subtask toggling.
- Added a `BoardPage` showcasing tasks in a masonry layout and linked it in `App.tsx`.
- Integrated custom `ease-out` timing functions in `index.css` for animations compliant with Emil's design rules.

## Recent Changes
- Created `src/entities/task/types.ts` and `api.ts`.
- Implemented features: `createTask`, `createSubtask`.
- Implemented widget: `TaskCard`.
- Implemented page: `BoardPage`.
- Updated `App.tsx` router configuration.
