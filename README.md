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

## Security-First Setup

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

4. Optional frontend API base URL in apps/web/.env

- VITE_API_BASE_URL=http://localhost:4000

## Teammate Setup (Own Atlas Cluster)

Use isolated MongoDB Atlas setup per teammate (no shared cluster).

1. Create your own Atlas project and cluster.
2. Create your own Atlas DB user and password.
3. Create local env files from examples:

```bash
copy apps\api\.env.example apps\api\.env
copy apps\web\.env.example apps\web\.env
```

4. Update apps/api/.env with your own values:

- MONGODB_URI (your own Atlas URI)
- MONGODB_DB (recommended: opensis)
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET

5. Run one-time seed on your own database:

```bash
npm run seed:demo
```

## Run Locally

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

## Current Foundation Implemented

- Auth endpoints: login, refresh, logout, me
- JWT access + refresh token flow
- Role and permission mapping
- Permission-protected routes
- Standard API success/error envelope
- MongoDB-backed users, refresh sessions, and students collections
- One-time demo seed command for onboarding
