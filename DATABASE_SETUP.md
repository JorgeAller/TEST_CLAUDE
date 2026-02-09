# Basketball Database Setup Guide

Quick start guide for setting up the basketball statistics database with Prisma and PostgreSQL.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- npm or yarn package manager

## Quick Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Database Connection

```bash
cp .env.example .env
```

Edit `.env` and update the `DATABASE_URL` with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/basketball_stats?schema=public"
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev
```

This will:
- Create all tables (Team, Player, Game, PlayerGameStats, PlayerSeasonStats, AdvancedMetrics)
- Set up relationships and indexes
- Install SQL functions for advanced metrics calculation (TS%, eFG%, PER, ORtg, AST/TO)
- Create a database trigger that auto-calculates per-game metrics on INSERT/UPDATE

### 5. Seed the Database (Optional)

```bash
npx tsx prisma/seed.ts
```

### 6. Verify Setup

```bash
npx prisma studio
```

This will open a browser interface at `http://localhost:5555` where you can view and edit your data.

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma              # Main Prisma schema
│   ├── seed.ts                    # Sample data seed
│   └── migrations/                # Prisma migration history
│       ├── 20260204161118_init/
│       └── 20260207123733_add_per_game_advanced_metrics/
├── src/                           # Application code
├── .env                           # Database connection string
└── package.json
```

## Usage Example

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a team
  const team = await prisma.team.create({
    data: {
      name: 'Lakers',
      city: 'Los Angeles',
      abbreviation: 'LAL',
      conference: 'Western',
      division: 'Pacific',
    },
  });

  // Create a player
  const player = await prisma.player.create({
    data: {
      firstName: 'LeBron',
      lastName: 'James',
      jerseyNumber: 23,
      position: 'SF',
      height: 206,
      weight: 113,
      teamId: team.id,
    },
  });

  console.log('Database setup successful!');
  console.log({ team, player });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## Common Commands

```bash
# All commands run from backend/

# View database in browser
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate Prisma Client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Format schema file
npx prisma format
```

## Database Schema Overview

### Core Entities

- **Team** - Teams with conference/division info
- **Player** - Players with biographical data and position (PG, SG, SF, PF, C)
- **Game** - Games with home/away teams, scores, and status
- **PlayerGameStats** - Player box score per game + auto-calculated advanced metrics
- **PlayerSeasonStats** - Aggregated season totals and averages
- **AdvancedMetrics** - Season-level advanced metrics (TS%, eFG%, PER, ORtg, DRtg, USG%, per-36, etc.)

### Key Features

- **Normalized Design** - 3NF compliance, no data redundancy
- **Complex Relationships** - Home/away teams, player-team associations
- **Performance Indexes** - Optimized for statistical queries and leaderboards
- **Auto-Calculated Metrics** - Database trigger auto-calculates TS%, eFG%, ORtg, PER, AST/TO per game
- **SQL Functions** - 6 reusable functions for metric calculations embedded in migrations
- **Type Safety** - Full TypeScript support via Prisma Client, Prisma enums for Position and GameStatus

## Advanced Metrics

### Auto-Calculated on INSERT/UPDATE (via DB trigger)

The following metrics are **automatically calculated** via a PostgreSQL trigger when `PlayerGameStats` records are inserted or updated:

- **True Shooting % (TS%)** - `PTS / (2 * (FGA + 0.44 * FTA))`
- **Effective Field Goal % (eFG%)** - `(FGM + 0.5 * 3PM) / FGA`
- **Offensive Rating (ORtg)** - `(PTS / Possessions) * 100`
- **Player Efficiency Rating (PER)** - Simplified: `(positive - negative) / MP * 100`
- **Assist-to-Turnover Ratio** - `AST / TOV`

### Available via SQL Functions (on-demand)

- **Usage Rate (USG%)** - Requires team-level aggregates, call `calculate_usage_rate()` manually
- **Batch Update** - Call `SELECT update_advanced_metrics()` to recalculate all existing rows

### Season-Level Metrics (via TypeScript service)

The `AdvancedMetrics` table stores season-level aggregated metrics including all the above plus: DRtg, Net Rating, AST%, TOV%, per-36 stats, STL%, BLK%.

See [database_documentation.md](./docs/database_documentation.md) for detailed formulas and usage.

## Example Queries

### Get Player Season Averages

```sql
SELECT
  p."firstName" || ' ' || p."lastName" as player_name,
  COUNT(gs.id) as games_played,
  ROUND(AVG(gs.points), 1) as ppg,
  ROUND(AVG(gs."totalRebounds"), 1) as rpg,
  ROUND(AVG(gs.assists), 1) as apg,
  ROUND(AVG(gs."trueShootingPct")::numeric, 3) as ts_pct,
  ROUND(AVG(gs."effectiveFgPct")::numeric, 3) as efg_pct,
  ROUND(AVG(gs."offensiveRating")::numeric, 1) as ortg,
  ROUND(AVG(gs."playerEfficiencyRating")::numeric, 1) as per
FROM "PlayerGameStats" gs
JOIN "Player" p ON gs."playerId" = p.id
JOIN "Game" g ON gs."gameId" = g.id
WHERE g.season = '2023-24'
  AND g.status = 'COMPLETED'
GROUP BY p.id, p."firstName", p."lastName"
ORDER BY ppg DESC
LIMIT 10;
```

### Get Game Box Score

```typescript
const boxScore = await prisma.playerGameStats.findMany({
  where: { gameId: 'game_id_here' },
  include: {
    player: {
      select: {
        firstName: true,
        lastName: true,
        jerseyNumber: true,
        position: true,
      },
    },
  },
  orderBy: { points: 'desc' },
});
```

## Troubleshooting

### Connection Issues

```bash
# Test PostgreSQL connection
psql -U username -d basketball_stats -c "SELECT version();"
```

### Migration Errors

```bash
# Reset and reapply migrations
npx prisma migrate reset
npx prisma migrate dev
```

### Prisma Client Out of Sync

```bash
# Regenerate client
npx prisma generate
```

## Next Steps

1. Set up the database (you're here!)
2. Review [database_documentation.md](./docs/database_documentation.md) for detailed schema info
3. Build your API layer using the Prisma Client
4. The advanced metrics are auto-calculated - just insert game stats and they appear!

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Schema Documentation](./docs/database_documentation.md)
