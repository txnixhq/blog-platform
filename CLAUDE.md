# Project: Blog Platform

## What this is
A full-stack blog platform with markdown post creation, user accounts,
and commenting. Goal: deployed live MVP in 90 minutes.

## Tech stack
- Backend: Python + FastAPI
- Frontend: React + Vite + Tailwind
- Database: Supabase (auth + PostgreSQL)
- Deploy: Railway

## File structure
/backend     → FastAPI app (main.py, routes/)
/frontend    → React + Vite (src/components/, src/pages/)

## Coding standards
- FastAPI routes use async/await
- All API responses return { data, error } shape
- React components in PascalCase, one per file
- Use httpx for all Supabase REST API calls (no supabase Python package)
- Tailwind for all styling

## Critical Windows/Railway fixes (do not change these)
- Always use httpx for Supabase calls, never the supabase Python package
- Frontend package.json build script must use:
  "build": "node node_modules/vite/bin/vite.js build"
  "preview": "node node_modules/vite/bin/vite.js preview --host 0.0.0.0 --port $PORT"
- vite.config.js must include preview.allowedHosts for Railway domain

## Auth
Use Supabase Auth (email + password). 
- Public: read posts, read comments
- Authenticated: create posts, create comments, delete own content

## Do NOT
- Use the supabase Python package (causes pyiceberg C++ error on Windows)
- Use vite binary directly (permission denied on Railway Alpine)
- Add packages not in the stack without asking
- Build everything at once — follow phases in plan.md