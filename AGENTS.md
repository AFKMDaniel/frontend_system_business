# frontend_system_business

Frontend for a business-management system (teams, tasks, meetings, calendar, comments) backed by a FastAPI API with RBAC, JWT auth, and team membership checks. UI lives under `src/`.

## Tech stack

- React 19 + TypeScript (TS 6) + Vite 8
- Tailwind CSS v4 via `@tailwindcss/vite` plugin (CSS-first, `@import "tailwindcss"` in `src/index.css`)
- shadcn/ui components (`radix-nova` style) — owned source under `src/shared/ui`, configured in `components.json`
- Radix primitives via `radix-ui` package; icons via `lucide-react`
- React Router v7 for routing
- Feature-Sliced Design (FSD) folder structure

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — type-check (`tsc -b`) then production build (this is the verify command)
- `npm run lint` — run oxlint
- `npm run preview` — preview production build
- `npx shadcn@latest add <component>` — add a new shadcn/ui component (installs into `src/shared/ui`)

### Add shadcn/ui components

To bring in a new UI component from the shadcn library:

```
npx shadcn@latest add button
```

- The component is installed as **owned source** (editable) into `src/shared/ui/<name>.tsx` — not a runtime dependency, so you can modify it.
- New components are registered in `components.json` aliases and auto-install their deps (radix-ui primitives, lucide icons, etc.).
- After adding, re-run `npm run build` to verify the new component compiles.
- Import it via the `@/shared/ui` path, e.g. `import { Button } from "@/shared/ui/button"`.

Common needs for this app: `input`, `label`, `card`, `badge`, `select`, `dialog`, `dropdown-menu`, `avatar`, `table`, `textarea`, `separator`, `tabs`, `toast`, `tooltip`, `skeleton`.

## Architecture (FSD layers)

Directories under `src/` (some still scaffolding):

- `app/` — app initialization: providers (store, root API, base query), router
- `pages/` — page compositions (login, dashboard, team, task, meeting, calendar)
- `widgets/` — composite UI blocks (sidebar, header, task-list, calendar-view)
- `features/` — user scenarios (auth/login, create-task, join-team, comment-form, meeting-form)
- `entities/` — domain models + API clients (user, team, task, meeting, comment)
- `shared/` — reuse across layers: `api/` (fetch client), `config/`, `lib/` (utils), `types/`, `ui/` (shadcn components)

### Layering rules

- Code may import from its own layer and any layer below it; never import upwards (`entities` → `shared` is fine, `shared` → `features` is not).
- `entities/*` must not import `widgets/features/pages`.
- `shared` must not import anything from other FSD layers.

## State management

- **Redux Toolkit + RTK Query** is the single data-fetching/state layer (no custom fetch client).
- Root API: `app/providers/root-api.ts` (`createApi`, empty endpoints for now). Reauth (401 → refresh → retry) lives in `app/providers/base-query.ts`, which dispatches the `refreshToken` thunk on 401. Access token lives only in Redux memory (`entities/user/auth-slice.ts`, no localStorage persistence) — a page reload logs the user out.
- Per-entity endpoint slices are added with `rootApi.injectEndpoints(...)` under `entities/<domain>/api.ts` (importing `rootApi` from `@/app/providers/root-api`), with `tagTypes: ['User','Team','Task','Meeting','Comment']` for cross-entity cache invalidation. Auth thunks (`login`, `refreshToken`, `logout`) live in `entities/user/auth-thunks.ts`.
- Store + typed hooks (`useAppDispatch`/`useAppSelector`) live in `app/providers/store.ts`; the Redux Provider wrapper is `app/providers/index.tsx`.
- Layering: lower layers (features/widgets/pages/entities) may import the store and root API (`app/providers/store.ts`, `app/providers/root-api.ts`) (documented FSD exception); `shared/` must not import from `app/`.

## Conventions

- Import alias: `@/*` → `./src/*` (configured in `tsconfig.app.json` + `vite.config.ts`).
- shadcn components use `cn()` from `@/shared/lib/utils` for class merging — use it for any component that merges Tailwind classes.
- Use existing shadcn components from `@/shared/ui` before writing raw DOM/Tailwind.
- Icons: `lucide-react` only.
- Styling: Tailwind utility classes; theme tokens (bg-primary, text-muted-foreground, border, ring) come from CSS variables in `src/index.css` — prefer tokens over raw colors.
- TypeScript: `verbatimModuleSyntax` is on — use `import type { ... }` for type-only imports. No unused locals/parameters allowed.
- API access goes through per-entity clients under `entities/<domain>/` (e.g. `entities/task/api.ts`) built on `rootApi` from `@/app/providers/root-api`.
- Path alias (`@/*`) is required for imports within `src/`.
