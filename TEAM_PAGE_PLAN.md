# Team Page Implementation Plan

Single team page at `/teams/:teamId` with a header showing three tabs: **Tasks** (default), **Members**, **Meetings**. Members/Meetings tabs are placeholders for now.

## Decisions (already agreed with user)

- **Tasks tab**: one list (no kanban), filters: `All / Mine` toggle + status filter (`All / Open / In progress / Closed`) + **executor filter** + **start/end date range**, status-colored rows/badges, role-gated actions. Create/edit/delete included. **No** task detail page/comments yet.
- **Members tab**: blank placeholder ("coming soon") for now — only the page shell/tab exists.
- **Meetings tab**: blank placeholder ("coming soon").
- **Task workflow** (discrete actions, no drag-and-drop; backend enforces transitions):
  - `open` → **Assign member** (manager/admin) → `work`
  - `work` → **Decline** (executor) → clears executor, back to `open` (`updateTask({ executor_user_id: null })`)
  - `work` → **Close** (executor, manager, admin) → `closed`
  - `work` → **Remove executor** (manager/admin) → `open`
  - any → **Close** (manager/admin)
  - Create/Edit/Delete task: manager/admin only
- **Roles**: two hooks — `useAppRole()` (global app role from `/users/me`, e.g. `'admin'`) and `useTeamRole(teamId)` (team role from `/users/me` → `teams` where `team.id === teamId`; `'manager' | 'employee' | null`). The `current_team` field is **ignored**; `teamApi.getTeam` is **not** used for role/executor mapping.
- Status type from backend: `'open' | 'work' | 'closed'` (`StatusTask` in `entities/task/types.ts`). Display labels: Open / In progress / Closed.

## Task statuses & display

Each task row and its status badge share one color per status (use Tailwind color tokens via a status→color map):

| Status | Row accent + badge color | Label |
| --- | --- | --- |
| `open` | neutral/secondary | Open |
| `work` | blue/primary | In progress |
| `closed` | green | Closed |

## Route structure

```
/teams/:teamId            → TeamLayout widget (imports existing Layout), index = Tasks
/teams/:teamId/members    → Members (placeholder)
/teams/:teamId/meetings   → Meetings (placeholder)
```

---

## Tasks (each is self-contained for a separate agent)

Conventions that apply to all tasks: import alias `@/*`; use `cn()` for class merging; use existing shadcn components in `src/shared/ui`; `import type { }` for type-only imports (verbatimModuleSyntax); no unused vars/params; API access via entity clients built on `rootApi`. Verify each task with `npm run build` (tsc + vite) and `npm run lint`.

### T1 — Add shared UI components

- Run `npx shadcn@latest add badge select textarea date-picker` (installs editable source into `src/shared/ui/`; auto-registers deps, including `react-day-picker` + `date-fns`).
- Verify `npm run build`.

### T2 — Team layout widget + routes

- **`src/widgets/team/team-layout.tsx`** (new) — `TeamLayout`: reads `teamId` from route params (`useParams`); team name for the title via `teamApi.useGetTeamQuery({ teamId })`; imports the **existing `Layout` widget** (`@/widgets/layout`) and renders it with `tabs` prop (`Tasks` → `/teams/${teamId}` `end: true`, `Members`, `Meetings`) wrapping `<Outlet />`.
- **`src/app/router/index.tsx`**: add nested routes under `AuthGuard`:
  - `/teams/:teamId` → `TeamLayout`, children: index → `TeamTasksPage`, `members` → `TeamMembersPage`, `meetings` → `TeamMeetingsPage`.
- Tab pages live in **separate folders with `index.tsx`**: `src/pages/team/tasks/index.tsx`, `src/pages/team/members/index.tsx`, `src/pages/team/meetings/index.tsx`. Members/Meetings render a placeholder ("coming soon"); Tasks is a stub for now (filled by T5).
- Verify `npm run build`.

### T3 — Home page: link team rows to team page

- **`src/pages/home/index.tsx`**: wrap each team row in `NavLink` to `/teams/${membership.team.id}` (keep the existing list styling).
- Verify `npm run build`.

### T4 — Role hooks (2 hooks)

- **`src/entities/user/lib/use-app-role.ts`** — `useAppRole()`: returns the current user's global app role (e.g. `'admin'`) from `userApi.useGetUserMeQuery()`; `'admin'` grants manager-level access. Export a matching `AppRole` type. Export via `entities/user/index.ts`.
- **`src/entities/team/lib/use-team-role.ts`** — `useTeamRole(teamId): TeamRole | null`: from `userApi.useGetUserMeQuery()` → `user.teams.find((m) => m.team.id === teamId)?.role`. **No** `getTeam` call.
- Export the team hook via `entities/team/index.ts`.
- Verify `npm run build`.

### T5 — Task list widget

- **`src/widgets/team/task-list.tsx`** (new), props: none — `teamId` from route params (`useParams`).
  - Data: `taskApi.useGetTasksQuery({ teamId, params })`.
  - Filters:
    - `All / Mine` toggle → `params.only_my`.
    - Status filter buttons `All / Open / In progress / Closed` → client-side filter on `status`.
    - **Executor filter** → `params.executor_user_id` (select of team members; options from `teamApi.useGetTeamMembersQuery({ teamId })`).
    - **Start/end date filters** → `params.start_date` / `params.end_date` (shadcn `DatePicker`).
  - Render each task row: left accent/border + status badge colored by status (per the color map above), description (truncated), executor (email mapped from the members query, or user id), deadline (formatted), grade badge when present (`task.grade`), and a per-row actions control (T7).
  - Sort by deadline ascending. Loading spinner + empty state + error state.
- Verify `npm run build`.

### T6 — Task form dialog (create + edit)

- **`src/features/team/task-form/`** — `index.tsx`, `types.ts`.
  - `CreateTaskDialogProps = { task?: TaskSchema }` (task present → edit mode). `teamId` from route params (`useParams`), members from `teamApi.useGetTeamMembersQuery` — **from hooks**, not props.
  - Form (react-hook-form + `useFormWithErrorHandling` from `@/shared/lib`, `yup` resolver like `join-team`): description (textarea), deadline (**shadcn `DatePicker`**, stored as `Date` in form state and converted to ISO string on submit), executor (select from members, optional).
  - Submit: `taskApi.useCreateTaskMutation` or `taskApi.useUpdateTaskMutation` (edit). On success `dispatch(closeDialog())`.
  - Edit mode pre-fills values; store `task.id` in state to call `updateTask`.
- Register dialog:
  - **`src/app/dialog/types.ts`**: add `createTask: 'create-task'` to `DIALOG_IDS`; add `[DIALOG_IDS.createTask]: CreateTaskDialogProps` to `DialogPropsMap`.
  - **`src/app/dialog/model.ts`**: register `CreateTaskDialog`.
- Verify `npm run build`.

### T7 — Task actions (status/executor) feature

- **`src/features/team/task-actions/index.tsx`** (new), props: `{ task: TaskSchema }` — `teamId` from route params (`useParams`), members from hook.
  - Uses `useTeamRole(teamId)`, `useAppRole()`, `taskApi.useUpdateTaskMutation`, `taskApi.useUpdateTaskStatusMutation`.
  - Dropdown menu (per-row) with role-gated items:
    - **Assign** (manager/admin, when `task.executor_user_id == null`): dropdown of members → `updateTask({ executor_user_id })` (no separate dialog).
    - **Remove executor** (manager/admin, when assigned): `updateTask({ executor_user_id: null })`.
    - **Decline** (executor = current user, when `work`): `updateTask({ executor_user_id: null })` (backend re-opens the task).
    - **Close** (executor, manager, admin, when not `closed`): `updateTaskStatus({ status: 'closed' })`.
  - Not all actions need to be in a menu — inline buttons are fine for single-action cases. Disable or hide items the current user cannot perform.
- Verify `npm run build`.

### T8 — Members tab placeholder

- **`src/pages/team/members/index.tsx`**: simple empty-state block ("Members — coming soon").
- Verify `npm run build`.

### T9 — Meetings tab placeholder

- **`src/pages/team/meetings/index.tsx`**: simple empty-state block ("Meetings — coming soon").
- Verify `npm run build`.

---

## Final verification

- `npm run lint` and `npm run build` pass.
- Manual check: `/teams/:id` from home page → three tabs render; tasks list filters/actions work per role matrix; members/meetings show placeholders.
