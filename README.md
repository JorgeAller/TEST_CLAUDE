# 🏀 Basketball Statistics Platform

A comprehensive, production-ready basketball statistics management platform built with modern web technologies. Features advanced analytics including True Shooting %, Player Efficiency Rating (PER), Offensive/Defensive Rating, and more.

## 🎯 Features

### Backend
- **Clean Architecture** with clear separation of concerns (Routes → Controllers → Services)
- **Advanced Metrics Calculations**: TS%, eFG%, PER, ORtg, DRtg, USG%, AST%, TOV%, Per-36 stats
- **Optimized Database Queries** with Prisma ORM and PostgreSQL
- **Comprehensive Validation** using Zod on all endpoints
- **Type-Safe** with strict TypeScript configuration
- **RESTful API** with proper error handling

### Frontend
- **Feature-Based Architecture** for scalable code organization
- **React Query** for efficient server state management
- **Advanced Data Visualization** with Recharts
- **Responsive Design** with Tailwind CSS
- **Type-Safe** with strict TypeScript
- **Modern UI/UX** with basketball-themed styling

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **HTTP Client**: Axios

## 📦 Project Structure

```
basketball-stats-platform/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── seed.ts                # Sample data
│   ├── src/
│   │   ├── config/                # Database configuration
│   │   ├── controllers/           # Request handlers
│   │   ├── services/              # Business logic
│   │   ├── routes/                # API routes
│   │   ├── middleware/            # Validation & error handling
│   │   ├── validators/            # Zod schemas
│   │   ├── types/                 # TypeScript types
│   │   └── index.ts               # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── features/              # Feature-based modules
    │   │   ├── players/
    │   │   ├── teams/
    │   │   ├── games/
    │   │   └── stats/
    │   ├── components/            # Shared components
    │   ├── lib/                   # API client, utilities
    │   ├── types/                 # TypeScript types
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    ├── vite.config.ts
    └── tailwind.config.js
```

## ⚡ Start Your Project (Quick Version)

```bash
# 1. Instalar dependencias
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 2. Configurar base de datos (editar con tus credenciales de PostgreSQL)
cp backend/.env.example backend/.env
#    -> Abrir backend/.env y poner tu usuario/password en DATABASE_URL
#    -> DATABASE_URL="postgresql://TU_USUARIO:TU_PASSWORD@localhost:5432/basketball_stats?schema=public"

# 3. Preparar la base de datos
cd backend
npx prisma generate          # Genera el cliente Prisma
npx prisma migrate dev       # Crea las tablas (si la BD no existe, Prisma la crea)
npx tsx prisma/seed.ts       # (Opcional) Cargar datos de ejemplo
cd ..

# 4. Levantar el proyecto (abrir 2 terminales)

# Terminal 1 - Backend API (http://localhost:3000)
cd backend && npm run dev

# Terminal 2 - Frontend App (http://localhost:5173)
cd frontend && npm run dev
```

> **Verificar:** Abrir http://localhost:5173 en el navegador. Para explorar la BD: `cd backend && npx prisma studio`

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update the `DATABASE_URL` with your PostgreSQL credentials:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/basketball_stats?schema=public"
   ```

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Seed the database (optional)**
   ```bash
   npm run prisma:seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 📊 API Endpoints

### Players
- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get player by ID
- `POST /api/players` - Create new player
- `PUT /api/players/:id` - Update player
- `DELETE /api/players/:id` - Delete player
- `GET /api/players/:id/stats/:season` - Get player season stats
- `GET /api/players/:id/games` - Get player game logs

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `GET /api/teams/:id/roster` - Get team roster
- `GET /api/teams/:id/stats/:season` - Get team season stats

### Games
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get game by ID
- `POST /api/games` - Create new game
- `PUT /api/games/:id` - Update game
- `DELETE /api/games/:id` - Delete game
- `GET /api/games/:id/boxscore` - Get game box score

### Statistics
- `POST /api/stats/game` - Record game statistics
- `GET /api/stats/player/:playerId/season/:season` - Get player season stats
- `GET /api/stats/advanced/:playerId/:season` - Get advanced metrics
- `GET /api/stats/leaders/:season` - Get league leaders

## 📈 Advanced Metrics

### True Shooting Percentage (TS%)
```
TS% = PTS / (2 * (FGA + 0.44 * FTA))
```
Measures shooting efficiency accounting for 2-pointers, 3-pointers, and free throws.

### Effective Field Goal Percentage (eFG%)
```
eFG% = (FGM + 0.5 * 3PM) / FGA
```
Adjusts field goal percentage to account for 3-pointers being worth more.

### Player Efficiency Rating (PER)
Comprehensive per-minute rating that sums up all positive contributions and subtracts negative ones.

### Offensive Rating (ORtg)
Points produced per 100 possessions.

### Defensive Rating (DRtg)
Points allowed per 100 possessions (lower is better).

### Usage Rate (USG%)
Percentage of team plays used by a player while on the court.

## 🗄️ Database Schema

### Core Tables
- **Team**: Team information (name, city, conference, division)
- **Player**: Player details (name, position, physical stats, team)
- **Game**: Game records (teams, date, scores, season)
- **PlayerGameStats**: Box score statistics per player per game
- **PlayerSeasonStats**: Aggregated season statistics
- **AdvancedMetrics**: Calculated advanced metrics (TS%, PER, etc.)

## 🔧 Development

### Backend Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run prisma:studio # Open Prisma Studio (database GUI)
npm run prisma:seed  # Seed database with sample data
```

### Frontend Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🎨 Code Quality

- **TypeScript Strict Mode** enabled on both frontend and backend
- **No `any` types** - all code is properly typed
- **Zod Validation** on all API endpoints and forms
- **ESLint** configured with strict rules
- **Clean Architecture** principles followed

## 📝 License

MIT

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Built with modern web development best practices
- Follows NBA-standard statistical formulas
- Designed for scalability and maintainability
