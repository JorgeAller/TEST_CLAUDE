# Basketball Database Setup Guide

Quick start guide for setting up the basketball statistics database with Prisma and PostgreSQL.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 12+ installed and running
- npm or yarn package manager

## Quick Setup

### 1. Install Dependencies

```bash
npm install prisma @prisma/client
npm install -D typescript ts-node @types/node
```

### 2. Configure Database Connection

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/basketball_db?schema=public"
```

Replace `username`, `password`, and `basketball_db` with your PostgreSQL credentials.

### 3. Create Database

```bash
# Using psql
createdb basketball_db

# Or using SQL
psql -U postgres -c "CREATE DATABASE basketball_db;"
```

### 4. Run Initial Migration

```bash
# Generate and apply the migration
npx prisma migrate dev --name init

# This will:
# - Create all tables
# - Set up relationships
# - Create indexes
```

### 5. Apply Advanced Metrics Functions

```bash
# Apply the SQL functions for advanced metrics
psql -d basketball_db -f prisma/migrations/advanced_metrics.sql
```

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Verify Setup

```bash
# Open Prisma Studio to view your database
npx prisma studio
```

This will open a browser interface at `http://localhost:5555` where you can view and edit your data.

## Project Structure

```
project/
├── prisma/
│   ├── schema.prisma              # Main Prisma schema
│   └── migrations/
│       └── advanced_metrics.sql   # SQL functions for metrics
├── docs/
│   └── database_documentation.md  # Comprehensive documentation
├── .env                           # Database connection string
└── package.json
```

## Usage Example

Create a file `test-db.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a season
  const season = await prisma.season.create({
    data: {
      name: '2023-24',
      startDate: new Date('2023-10-01'),
      endDate: new Date('2024-06-30'),
      isActive: true,
    },
  });

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

  console.log('✅ Database setup successful!');
  console.log({ season, team, player });
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

Run it:

```bash
npx ts-node test-db.ts
```

## Common Commands

```bash
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

- **Season** - Basketball seasons (e.g., "2023-24")
- **Team** - Teams with conference/division info
- **Player** - Players with biographical data
- **Game** - Games with home/away teams and scores
- **GameStats** - Player statistics per game
- **PlayByPlayEvent** - Granular play-by-play events

### Key Features

✅ **Normalized Design** - 3NF compliance, no data redundancy  
✅ **Complex Relationships** - Home/away teams, player-team associations  
✅ **Performance Indexes** - Optimized for statistical queries  
✅ **Advanced Metrics** - Auto-calculated TS%, eFG%, PER, etc.  
✅ **Type Safety** - Full TypeScript support via Prisma Client  

## Advanced Metrics

The following metrics are **automatically calculated** when you insert/update game stats:

- **True Shooting %** (TS%)
- **Effective Field Goal %** (eFG%)

Additional metrics available via SQL functions:

- **Usage Rate** (USG%)
- **Player Efficiency Rating** (PER)
- **Offensive Rating** (ORtg)
- **Assist-to-Turnover Ratio**

See [database_documentation.md](./docs/database_documentation.md) for detailed formulas and usage.

## Example Queries

### Get Player Season Averages

```typescript
const seasonStats = await prisma.$queryRaw`
  SELECT 
    p."firstName" || ' ' || p."lastName" as player_name,
    COUNT(gs.id) as games_played,
    ROUND(AVG(gs.points), 1) as ppg,
    ROUND(AVG(gs."totalRebounds"), 1) as rpg,
    ROUND(AVG(gs.assists), 1) as apg,
    ROUND(AVG(gs."trueShootingPct")::numeric, 3) as ts_pct
  FROM game_stats gs
  JOIN players p ON gs."playerId" = p.id
  JOIN games g ON gs."gameId" = g.id
  WHERE g."seasonId" = ${seasonId}
    AND g.status = 'completed'
  GROUP BY p.id, p."firstName", p."lastName"
  ORDER BY ppg DESC
  LIMIT 10
`;
```

### Get Game Box Score

```typescript
const boxScore = await prisma.gameStats.findMany({
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
psql -U username -d basketball_db -c "SELECT version();"
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

1. ✅ Set up the database (you're here!)
2. 📝 Review [database_documentation.md](./docs/database_documentation.md) for detailed schema info
3. 🔨 Build your API layer using the Prisma Client
4. 📊 Implement statistical calculations using the provided SQL functions
5. 🎨 Create your frontend to display the data

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Schema Documentation](./docs/database_documentation.md)

---

**Need Help?** Check the comprehensive documentation in `docs/database_documentation.md` for:
- Entity relationship diagrams
- Detailed field descriptions
- Example queries
- Performance optimization tips
- Advanced metrics formulas
