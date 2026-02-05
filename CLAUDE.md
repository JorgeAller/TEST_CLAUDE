# CLAUDE.md

## Agent Scope: BACKEND API ONLY

- SOLO modificar archivos bajo `backend/src/`
- NO modificar `backend/prisma/schema.prisma` (cambios de schema van por la rama database)
- NO modificar archivos de `frontend/`
- Ejecutar comandos desde `backend/`
- Seguir el patrón Routes → Validators → Controllers → Services
- Todos los endpoints nuevos necesitan validadores Zod

---

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack basketball statistics platform with advanced analytics (TS%, eFG%, PER, ORtg, DRtg, USG%). Built with TypeScript on both ends: Express.js + Prisma backend, React 18 + Vite frontend.

## Prerequisites

- Node.js 18+, PostgreSQL 14+
- Backend runs on port 3000, frontend on port 5173

## Common Commands

### Backend (run from `backend/`)

```bash
npm run dev              # Start dev server (tsx watch)
npm run build            # TypeScript compilation to dist/
npm run start            # Start production server
npm run prisma:generate  # Regenerate Prisma client after schema changes
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database with sample data
npm run prisma:studio    # Open Prisma Studio GUI (port 5555)
```

### Frontend (run from `frontend/`)

```bash
npm run dev      # Start Vite dev server
npm run build    # tsc + vite build
npm run preview  # Preview production build
npm run lint     # ESLint
```

**No test framework is configured.** The backend `npm test` is a placeholder that exits with error.

## Architecture

### Backend: Clean layered architecture

```
Routes → Zod Validation Middleware → Controllers → Services → Prisma (PostgreSQL)
                                                       ↓
                                              Error Handler Middleware
```

- **Routes** (`backend/src/routes/`): Define endpoints, wire up validation and controllers
- **Validators** (`backend/src/validators/`): Zod schemas for request validation
- **Controllers** (`backend/src/controllers/`): Handle HTTP request/response, delegate to services
- **Services** (`backend/src/services/`): Business logic and database operations via Prisma
- **`advanced-metrics.service.ts`**: Calculates NBA-standard advanced stats (TS%, eFG%, PER, usage rate, offensive/defensive ratings, per-36 stats)
- **`config/database.ts`**: Singleton Prisma client with query logging
- **`middleware/error-handler.ts`**: Maps Prisma error codes to HTTP responses

### Frontend: Feature-based module organization

```
App.tsx (React Router + QueryClientProvider)
└── AppLayout (navigation shell)
    └── Pages → Feature modules → API hooks → Components
```

- **Features** (`frontend/src/features/`): Domain modules (players, teams, games, stats), each with its own `api/` directory containing React Query hooks
- **Hooks** (`frontend/src/hooks/`): Shared custom hooks (`use-players`, `use-games`, `use-teams`)
- **Components** (`frontend/src/components/`): Shared UI, layout, charts, and domain-specific components
- **`lib/api-client.ts`**: Custom fetch-based `ApiClient` class — all API calls go through this
- **`lib/query-client.ts`**: TanStack Query configuration
- **`theme/`**: Material-UI theme configuration

### Data flow

Frontend uses TanStack Query (React Query) for server state. The API client calls `GET /api/*` endpoints. Vite proxies `/api` requests to the backend in development.

### Database (Prisma)

Schema at `backend/prisma/schema.prisma`. Core models: **Season**, **Team**, **Player**, **Game**, **GameStats**, **PlayByPlayEvent**. Teams have home/away game relationships. GameStats links players to games with full box score data plus calculated advanced metrics.

## Path Aliases

Both sides use TypeScript path aliases. Import with `@/` prefix:

- **Backend**: `@/config/*`, `@/controllers/*`, `@/services/*`, `@/routes/*`, `@/middleware/*`, `@/validators/*`, `@/types/*`
- **Frontend**: `@/components/*`, `@/features/*`, `@/lib/*`, `@/hooks/*`, `@/types/*`, `@/validators/*`

## Key Conventions

- TypeScript strict mode on both frontend and backend — no `any` types (enforced by ESLint rule `@typescript-eslint/no-explicit-any: error` on frontend)
- All API input is validated with Zod schemas before reaching controllers
- UI uses Material-UI (MUI v7) + Tailwind CSS + Emotion for styling
- Environment config: backend uses `.env` (DATABASE_URL, PORT, CORS_ORIGIN), frontend uses `.env` (VITE_API_URL)
- After changing `schema.prisma`, run `npx prisma generate` then `npx prisma migrate dev`
