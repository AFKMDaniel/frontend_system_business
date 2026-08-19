# frontend_system_business

Frontend for a business-management system (teams, tasks, meetings, calendar, comments), backed by a FastAPI API ([api_system_business](https://github.com/NeroGeer/api_system_business)) with RBAC, JWT auth, and team-membership checks.

Stack: React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui (radix-nova), Redux Toolkit + RTK Query, React Router v7, i18next (i18n), Feature-Sliced Design.

## Prerequisites

- Node.js 22+ and npm
- Backend ([api_system_business](https://github.com/NeroGeer/api_system_business)) running on port 8000

## Environment variables

| Variable        | Default                            | Description                                                        |
| --------------- | ---------------------------------- | ------------------------------------------------------------------ |
| `FRONTEND_PORT` | `8080`                             | Host port exposed by the Docker container.                         |
| `BACKEND_URL`   | `http://host.docker.internal:8000` | Backend URL (full, with scheme) that nginx / Vite proxy `/api` to. |

The app always calls the same-origin `/api` base (`API_URL = '/api'` in `src/shared/config/index.ts`); it needs no API base env var.

Env files:

- `.env` — shared values used by docker-compose and Vite.
- `.env.development` — overrides `.env` in dev (Vite loads it with higher precedence). Set `BACKEND_URL=http://127.0.0.1:8000` here: the host machine cannot reach `host.docker.internal`, which is only valid inside the Docker container.
- `.env.example` — committed template of all variables.

## Dev setup

1. `npm install`
2. Create `.env` (see `.env.example`).
3. Create `.env.development`:
   ```
   BACKEND_URL=http://127.0.0.1:8000
   ```
4. Start the backend, then run the dev server:
   ```
   npm run dev
   ```
   The app is served at the Vite default port (`http://localhost:5173`).

How it works: Vite proxies requests to `/api/*` to `BACKEND_URL` (`server.proxy` in `vite.config.ts`). The app is single-origin, so auth cookies (`SameSite=Lax`, not Secure) work without CORS.

## Production setup (Docker + nginx)

Prerequisite: the backend must be reachable from inside the container. The default `BACKEND_URL=http://host.docker.internal:8000` targets the backend running on the host (on Linux Docker, add `--add-host=host.docker.internal:host-gateway`).

1. Make sure `.env` has `BACKEND_URL` pointing at the backend (the app always uses the same-origin `/api` base).
2. Build and start:
   ```
   docker compose up -d --build
   ```
3. The app is at `http://localhost:${FRONTEND_PORT}`.

How it works:

- Multi-stage `Dockerfile`: a Node build stage runs `npm run build`, then an `nginx:1.27-alpine` runtime stage serves the output.
- nginx serves the static bundle from `/usr/share/nginx/html` (SPA `try_files` fallback) and proxies `/api/*` to `BACKEND_URL`.
- The proxy block sets forwarding headers (`Host`, `X-Real-IP`, `X-Forwarded-*`), WebSocket upgrade headers, `proxy_redirect off`, and reasonable timeouts/buffers.

## Scripts

- `npm run dev` — Vite dev server with `/api` proxy
- `npm run build` — type-check (`tsc -b`) then production build
- `npm run lint` — oxlint
- `npm run format` / `npm run format:check` — Prettier
- `npm run preview` — preview the production build (note: `vite preview` does not apply `server.proxy`; it uses its own `preview.*` options)

## Localization

The UI is translated with i18next + react-i18next. Supported languages: **English** (default) and **Russian**.
