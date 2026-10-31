# frontend_system_business

Frontend for a business-management system (teams, tasks, meetings, calendar, comments) backed by a FastAPI API with RBAC, JWT auth, and team membership checks. UI lives under `src/`.

## Tech stack

- React 19 + TypeScript (TS 6) + Vite 8
- Tailwind CSS v4 via `@tailwindcss/vite` plugin (CSS-first, `@import "tailwindcss"` in `src/index.css`)
- shadcn/ui components (`radix-nova` style) — owned source under `src/shared/ui`, configured in `components.json`
- Radix primitives via `radix-ui` package; icons via `lucide-react`
- React Router v7 for routing
- i18next + react-i18next for localization
- Feature-Sliced Design (FSD) folder structure

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — type-check (`tsc -b`) then production build
- `npx tsc -b` — type-check only (this is the verify command)
- `npm run lint` — run oxlint
- `npm run preview` — preview production build

## Architecture (FSD layers)

Directories under `src/` (some still scaffolding):

- `app/` — app initialization and composition root: providers (store + thunk extra args, dialog registry + host), layouts (`home-layout`, `team-layout`), router
- `pages/` — page compositions (login, teams, task, meeting, calendar)
- `widgets/` — composite UI blocks (sidebar, header, task-list, calendar-view)
- `features/` — user scenarios (auth/login, create-task, join-team, comment-form, meeting-form)
- `entities/` — domain models + API clients (user, team, task, meeting, comment)
- `shared/` — reuse across layers: `api/` (root API + base query), `config/`, `lib/` (utils), `model/` (dialog state), `types/`, `ui/`

### Layering rules

- Code may import from its own layer and any layer below it; never import upwards (`entities` → `shared` is fine, `shared` → `features` is not).
- `entities/*` must not import `widgets/features/pages`.
- `shared` must not import anything from other FSD layers, including `app/` (no exception for the store).
- **Cross-entity imports use `@x` public APIs.** When an entity needs something from another entity, that dependency is declared as `entities/<domain>/@x/<consumer>.ts`, which re-exports only what that specific consumer may use (e.g. `entities/user/@x/team.ts` is user's API for `team`; `entities/task/@x/team.ts` is task's API for `team`). Consumers import `@/entities/<domain>/@x/<consumer>`, never the other entity's `types`/`lib`/`api` paths directly. `@x` files are not re-exported from the entity's `index.ts` barrel.
- Known `@x` cycle: `entities/team` and `entities/user` reference each other's `@x` files (`entities/team/@x/user.ts` ↔ `entities/user/@x/team.ts`). It is currently runtime-safe because `entities/team/types.ts` has no imports; adding an import there (or any runtime import back into `team` internals) risks a module-initialization cycle. Break it by moving `TEAM_ROLES`/`TeamRole` out of `entities/team` (to `shared` or a standalone entity).

## State management

- **Redux Toolkit + RTK Query** is the single data-fetching/state layer (no custom fetch client).
- Root API: `shared/api/root-api.ts` (`createApi`, empty endpoints for now). Reauth (401 → refresh → retry) lives in `shared/api/base-query.ts`, which reads the `refreshToken` thunk from the thunk `extraArgument` passed in `app/providers/store/index.ts`. Access token lives only in Redux memory (`entities/user/auth-slice.ts`, no localStorage persistence) — a page reload logs the user out.
- Per-entity endpoint slices are added with `rootApi.injectEndpoints(...)` under `entities/<domain>/api.ts` (importing `rootApi` from `@/shared/api`), with `tagTypes: ['User','Team','Task','Meeting','Comment']` for cross-entity cache invalidation. Auth thunks (`login`, `register`, `refreshToken`) live in `entities/user/auth-thunks.ts`; `logout` is an RTK Query mutation on `userApi` (`userApi.useLogoutMutation`), and its fulfilled matcher clears the access token in `auth-slice.ts`.
- Store lives in `app/providers/store/index.ts`; the Redux Provider wrapper is `app/providers/index.tsx`. `RootState`/`AppDispatch` are declared as global types in `app/providers/store/types.d.ts`, and typed hooks (`useAppDispatch`/`useAppSelector`) live in `shared/lib/redux.ts`.

## Dialogs

- Dialog state lives in `shared/model/dialog/slice.ts` (Redux slice, `openDialog`/`closeDialog`/`clearDialogContent` actions, selectors). Lower layers import from `@/shared/model/dialog`, never from `app/`.
- `DialogPropsMap`, `DialogId`, `DialogPayload` and `DialogRegistry` are declared globally in `app/providers/dialog/dialog.d.ts` (type-only imports from feature slices; `app` is allowed to import them), so the shared slice can type `openDialog` payloads without importing features. `DialogPropsMap` is the single source of truth: `DialogId` is derived as `keyof DialogPropsMap` (there is no separate ID constants object).
- The composition root stays in `app/providers/dialog/`: `model.ts` (`{ id: component }` registry map — pulls in feature components, so it must never be imported by the store) and `ui/dialog-host.tsx` (mounted in `app/providers/index.tsx`).
- Dialog props types are owned by the feature that renders the dialog (e.g. `JoinTeamDialogProps` in `features/team/join-team/types.ts`) and referenced from `app/providers/dialog/dialog.d.ts` via type-only imports.
- Open a dialog with `dispatch(openDialog({ id: 'join-team' }))`; props are type-checked per dialog ID. `@/app/providers/dialog/ui/dialog-host` is internal to the host.

## Localization

- **i18next + react-i18next** (`i18next`, `i18next-browser-languagedetector`, `react-i18next`). Init lives in `src/shared/i18n/index.ts`, imported once in `src/main.tsx`. Import `useTranslation`/`i18n` from `@/shared/i18n`, never from `react-i18next` directly.
- Supported languages: `en` (default) and `ru`. Declared in `SUPPORTED_LANGUAGES` in `src/shared/i18n/languages.ts`; add new languages there too.
- Resources: `src/shared/i18n/locales/<lang>/translation.json`, registered in `resources` in `index.ts`. Keys are type-checked against the `en` file (augmentation in `src/shared/i18n/i18next.d.ts`), so keys must stay in sync across all locale files.
- Detection: `localStorage` (`language` key) → `navigator`, with `load: 'languageOnly'` (region code stripped, e.g. `en-US` → `en`).
- Use reactive `useTranslation()` inside components. `i18n.t()` is fine for non-reactive contexts such as yup schema messages at module scope.
- Dates: use `formatDate()` from `@/shared/i18n/lib/format-date` (picks the date-fns locale via `getDateLocale()` in `src/shared/i18n/lib/date-locale.ts`); add the new locale's mapping there.
- Language switcher UI: `features/language/ui/language-menu-items.tsx` (header dropdown).

## Forms (react-hook-form)

- **react-hook-form** is the form library (`useForm`, `useController`). Bind controls through the wrappers in `src/shared/ui/form/`: `form-input.tsx` (`FormInput`), `form-combobox.tsx` (`FormCombobox`), `form-date-picker.tsx` (`FormDatePicker`). Prefer these over raw RHF binding.
- The wrappers use `useController({ control, name })` (not the `<Controller>` component) and are generic over `TFieldValues`/`TName`; `FormCombobox` is additionally generic over the option type `TOption` and stores the selected option object in the form field.
- `FormInput` renders `Field`/`FieldLabel`/`FieldError`; `FormCombobox`/`FormDatePicker` render only the bound control — supply labels with `FilterGroup` or `Field`/`FieldLabel`.
- Pick the hook per form: plain `useForm` for local/transient forms (e.g. the task filter); `useFormWithErrorHandling` from `@/shared/lib/use-form-with-error-handling` for forms that submit to the server (adds field-level server errors + toast fallback).
- Submit-button pattern: `<Button type="submit" disabled={!isDirty}>`; after applying/committing call `reset(values)` so `isDirty` returns to `false` and the button re-disables.
- **Missing a wrapper? Create one.** If a control has no `Form*` wrapper, add `src/shared/ui/form/form-<control>.tsx` following the same `useController` pattern: render the underlying control with `field.value`/`field.onChange`. When the control takes an array of options, type that prop as `readonly TOption[]` (Base UI's `items` is `readonly any[]`, so without an explicit type the option generic can't be inferred from it).

## Conventions

- File names and the components they export must match: a component file's name (kebab-case) must correspond to its main exported component (PascalCase), e.g. `task-list-body.tsx` exports `TaskListBody`. `index.tsx` is reserved as a folder entry/barrel (public API), not a component file.
- Import alias: `@/*` → `./src/*` (configured in `tsconfig.app.json` + `vite.config.ts`).
- Components in `src/shared/ui` use `cn()` from `@/shared/lib/utils` for class merging — use it for any component that merges Tailwind classes.
- Use existing components from `@/shared/ui` before writing raw DOM/Tailwind.
- Icons: `lucide-react` only.
- Styling: Tailwind utility classes; theme tokens (bg-primary, text-muted-foreground, border, ring) come from CSS variables in `src/index.css` — prefer tokens over raw colors.
- TypeScript: `verbatimModuleSyntax` is on — use `import type { ... }` for type-only imports. No unused locals/parameters allowed.
- API access goes through per-entity clients under `entities/<domain>/` (e.g. `entities/task/api.ts`) built on `rootApi` from `@/shared/api`.
- Path alias (`@/*`) is required for imports within `src/`.
