# openSIS Modern

MERN-style migration workspace for openSIS with MySQL retained initially.

## Workspace Layout

- apps/web: React + Vite frontend
- apps/api: Express + TypeScript backend
- packages/types: Shared TypeScript types/contracts
- docs: Planning, decisions, and migration notes

## Quick Start

1. Install dependencies:
   npm install
2. Start backend (port 4000):
   npm run dev:api
3. Start frontend (port 5173):
   npm run dev:web

## Team Rules

- Keep legacy repo as read-only reference.
- Implement all new work in this repository.
- Use feature branches and PR review before merge.
