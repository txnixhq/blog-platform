# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Full-stack blog platform with markdown post creation, user accounts, and commenting. Build in phases per `plan.md` — do not build everything at once.

## Tech Stack

- **Backend:** Python + FastAPI (`/backend`)
- **Frontend:** React + Vite + Tailwind (`/frontend`)
- **Database/Auth:** Supabase (PostgreSQL + Auth)
- **Deploy:** Railway

## Dev Commands

**Backend** (from `/backend`):
```
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend** (from `/frontend`):
```
npm install
npm run dev
```

**Frontend build** (Railway-safe — do not use `vite` binary directly):
```
node node_modules/vite/bin/vite.js build
```

## Architecture

### Backend (`/backend`)
- `main.py` — FastAPI app entry point, mounts routers, configures CORS
- `routes/` — one file per resource (`posts.py`, `comments.py`, `auth.py`)
- All Supabase calls use `httpx` with the REST API and service-role key (never the supabase Python package)
- Every route is `async def`; all responses return `{ "data": ..., "error": ... }`

### Frontend (`/frontend`)
- `src/pages/` — route-level components (one per page)
- `src/components/` — shared UI components (PascalCase, one per file)
- All styling via Tailwind utility classes
- Auth state managed via React context; JWT stored in localStorage and sent as `Authorization: Bearer <token>` header

### Database (Supabase)
- `posts`: `id, user_id, title, content (markdown), created_at`
- `comments`: `id, post_id, user_id, content, created_at`
- RLS enabled: users can only delete their own rows
- Public read on both tables; authenticated write

### Auth
Supabase email+password auth.
- Public: read posts, read comments
- Authenticated: create posts, create comments, delete own content

## Critical Windows/Railway Constraints

- **Never** use the `supabase` Python package — causes a pyiceberg C++ error on Windows
- **Never** call the `vite` binary directly — permission denied on Railway Alpine
- `package.json` scripts must use:
  ```json
  "build": "node node_modules/vite/bin/vite.js build",
  "preview": "node node_modules/vite/bin/vite.js preview --host 0.0.0.0 --port $PORT"
  ```
- `vite.config.js` must include `preview.allowedHosts` with the Railway domain

## Do Not

- Add packages outside the stack without asking
- Skip `plan.md` phases — build incrementally
