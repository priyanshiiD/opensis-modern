# openSIS Modern

Modern migration workspace for openSIS using a monorepo with:
- React + Vite frontend (JavaScript/JSX)
- Express + MongoDB backend (JavaScript)

This repository is prepared to be shared with teammates without local secrets or generated build noise.

## Repository Structure

```
opensis-modern/
   apps/
      api/            # Express API (JavaScript)
      web/            # React app (Vite + JSX)
   package.json      # Workspace scripts
```

## What Is Implemented

- Auth endpoints: login, refresh, logout, me
- JWT access + refresh token flow
- Role and permission mapping
- Permission-protected routes
- MongoDB-backed users, refresh sessions, and students collections
- One-time demo seed command for onboarding

## Quick Start (Teammate Onboarding)

Each teammate should use their own MongoDB Atlas cluster and credentials.

1. Install dependencies

```bash
npm install
```

2. Create environment files from examples

```bash
copy apps\api\.env.example apps\api\.env
copy apps\web\.env.example apps\web\.env
```

3. Fill real values in apps/api/.env

- MONGODB_URI
- MONGODB_DB
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET

Optional one-time demo seed values (used only with `npm run seed:demo`):
- DEMO_USERNAME=demo.admin
- DEMO_PASSWORD=Demo@12345!
- DEMO_PROFILE_ID=1

4. Set frontend API base URL in apps/web/.env

- VITE_API_BASE_URL=http://localhost:4000

5. Run one-time seed on your own database

```bash
npm run seed:demo
```

6. Start backend and frontend

```bash
npm run dev:api
npm run dev:web
```

## Run Commands

Backend:

```bash
npm run dev:api
```

One-time demo seed (run once after env setup, then keep normal runtime clean):

```bash
npm run seed:demo
```

Frontend:

```bash
npm run dev:web
```

Build all workspaces:

```bash
npm run build
```

## Troubleshooting

- Atlas auth failed (`bad auth : authentication failed`):
Use the correct Atlas DB username/password in MONGODB_URI. If password contains special characters (for example `@`), URL-encode them in the URI.

- API port already in use (`EADDRINUSE: 4000`):
Stop the previous backend process and run `npm run dev:api` again.

- Login fails after setup:
Run `npm run seed:demo` once, then retry login with demo.admin / Demo@12345!.

## Share-Ready Rules

- Never commit .env files.
- Keep only .env.example in git.
- Never hardcode secrets, passwords, or token keys in source code.
- Do not commit dist/, node_modules/, or tsbuildinfo files.

## Pre-Share Checklist

Before pushing for teammates:

1. Confirm no secrets are present in staged changes.
2. Confirm generated files are absent (dist, node_modules, .tsbuildinfo, transpiled js duplicates).
3. Run build:

```bash
npm run build
```

4. Review final status:

```bash
git status --short
```
