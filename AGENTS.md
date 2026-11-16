# frontend_system_business

Frontend for a business-management system (teams, tasks, meetings, calendar, comments) backed by a FastAPI API with RBAC, JWT auth, and team membership checks. UI lives under `src/`.

## Tech stack

- React 19 + TypeScript (TS 6) + Vite 8
- Tailwind CSS v4 via `@tailwindcss/vite` plugin (CSS-first, `@import "tailwindcss"` in `src/index.css`)
- shadcn/ui components (`radix-nova` style) — owned source under `src/shared/ui`, configured in `components.json`
- Radix primitives via `radix-ui` package; icons via `lucide-react`
- React Router v7 for routing
- i18next + react-i18next for localization

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — type-check (`tsc -b`) then production build
- `npx tsc -b` — type-check only (this is the verify command)
- `npm run lint` — run oxlint
- `npm run preview` — preview production build

## State management

- **Redux Toolkit + RTK Query** is the single data-fetching/state layer (no custom fetch client).
- Reauth (401 → refresh → retry) is handled by the base query, which reads the `refreshToken` thunk from the thunk `extraArgument` passed to the store. The access token is kept only in Redux memory (no localStorage persistence) — a page reload logs the user out.
- Extend the root API with `rootApi.injectEndpoints(...)`. Tag types (`User`, `Team`, `Task`, `Meeting`, `Comment`, `Calendar`) are declared once in `TAG_TYPES` — use those strings for `providesTags`/`invalidatesTags`.
- Auth thunks are `login`, `register`, and `refreshToken`. `logout` is an RTK Query mutation (`userApi.useLogoutMutation`), and its fulfilled matcher clears the access token in the auth slice.
- `RootState`/`AppDispatch` are declared as global types, and typed hooks (`useAppDispatch`/`useAppSelector`) are available.

## Dialogs

- Dialog state is a Redux slice with `openDialog`/`closeDialog`/`clearDialogContent` actions and selectors.
- `DialogPropsMap`, `DialogId`, `DialogPayload` and `DialogRegistry` are declared globally. `DialogPropsMap` is the single source of truth: `DialogId` is derived as `keyof DialogPropsMap` (there is no separate ID constants object).
- Dialog components are registered in a registry map and rendered by a single dialog host. The registry pulls in dialog components, so it must never be imported by the store.
- Open a dialog with `dispatch(openDialog({ id: 'join-team' }))`; props are type-checked per dialog ID.

## Localization

- **i18next + react-i18next** (`i18next`, `i18next-browser-languagedetector`, `react-i18next`). Import `useTranslation`/`i18n` from `@/shared/i18n`, never from `react-i18next` directly.
- Supported languages: `en` (default) and `ru`. New languages must also be added to `SUPPORTED_LANGUAGES`.
- Translation resources must be registered in `resources`. Keys are type-checked against the `en` file, so keys must stay in sync across all locale files.
- Detection: `localStorage` (`language` key) → `navigator`, with `load: 'languageOnly'` (region code stripped, e.g. `en-US` → `en`).
- Use reactive `useTranslation()` inside components. `i18n.t()` is fine for non-reactive contexts such as yup schema messages at module scope.
- Dates: use `formatDate()` (it picks the date-fns locale via `getDateLocale()`); add a mapping for any new locale.

## Forms (react-hook-form)

- **react-hook-form** is the form library (`useForm`, `useController`). Bind controls through the existing `Form*` wrappers (`FormInput`, `FormCombobox`, `FormDatePicker`, `FormRating`). Prefer these over raw RHF binding.
- The wrappers use `useController({ control, name })` (not the `<Controller>` component) and are generic over `TFieldValues`/`TName`; `FormCombobox` is additionally generic over the option type `TOption` and stores the selected option object in the form field.
- `FormInput` renders `Field`/`FieldLabel`/`FieldError`; `FormCombobox`/`FormDatePicker` render only the bound control — supply labels with `FilterGroup` or `Field`/`FieldLabel`.
- Pick the hook per form: plain `useForm` for local/transient forms (e.g. the task filter); `useFormWithErrorHandling` from `@/shared/lib/use-form-with-error-handling` for forms that submit to the server (adds field-level server errors + toast fallback).
- Submit-button pattern: `<Button type="submit" disabled={!isDirty}>`; after applying/committing call `reset(values)` so `isDirty` returns to `false` and the button re-disables.
- **Missing a wrapper? Create one.** Follow the same `useController` pattern: render the underlying control with `field.value`/`field.onChange`. When the control takes an array of options, type that prop as `readonly TOption[]` (Base UI's `items` is `readonly any[]`, so without an explicit type the option generic can't be inferred from it).

## Conventions

- File names and the components they export must match: a component file's name (kebab-case) must correspond to its main exported component (PascalCase), e.g. `task-list-body.tsx` exports `TaskListBody`. `index.tsx` is reserved as a folder entry/barrel (public API), not a component file.
- Import alias: `@/*` → `./src/*` (configured in `tsconfig.app.json` + `vite.config.ts`).
- Use `cn()` from `@/shared/lib/utils` for any component that merges Tailwind classes.
- Use existing components from `@/shared/ui` before writing raw DOM/Tailwind.
- Icons: `lucide-react` only.
- Styling: Tailwind utility classes; theme tokens (bg-primary, text-muted-foreground, border, ring) come from CSS variables in `src/index.css` — prefer tokens over raw colors.
- TypeScript: `verbatimModuleSyntax` is on — use `import type { ... }` for type-only imports. No unused locals/parameters allowed.
- API access goes through RTK Query clients built on `rootApi` from `@/shared/api`.
- Path alias (`@/*`) is required for imports within `src/`.
