# Basketball Database Schema Documentation

## Overview

This database schema is designed for a comprehensive basketball statistics platform using PostgreSQL and Prisma ORM. It supports player tracking, game statistics, play-by-play events, and advanced metrics calculations.

## Entity Relationship Diagram

```mermaid
erDiagram
    Season ||--o{ Game : contains
    Team ||--o{ Player : has
    Team ||--o{ Game : "plays as home"
    Team ||--o{ Game : "plays as away"
    Game ||--o{ GameStats : records
    Game ||--o{ PlayByPlayEvent : contains
    Player ||--o{ GameStats : achieves
    Player ||--o{ PlayByPlayEvent : performs
    
    Season {
        string id PK
        string name UK
        datetime startDate
        datetime endDate
        boolean isActive
    }
    
    Team {
        string id PK
        string name UK
        string city
        string abbreviation UK
        string conference
        string division
    }
    
    Player {
        string id PK
        string firstName
        string lastName
        int jerseyNumber
        string position
        int height
        int weight
        datetime birthDate
        string teamId FK
    }
    
    Game {
        string id PK
        datetime gameDate
        string location
        string status
        int homeScore
        int awayScore
        string seasonId FK
        string homeTeamId FK
        string awayTeamId FK
    }
    
    GameStats {
        string id PK
        string gameId FK
        string playerId FK
        int points
        int fieldGoalsMade
        int fieldGoalsAttempted
        int threePointersMade
        int totalRebounds
        int assists
        decimal trueShootingPct
        decimal effectiveFgPct
    }
    
    PlayByPlayEvent {
        string id PK
        string gameId FK
        string playerId FK
        string eventType
        int period
        string gameClock
        int gameClockSeconds
        boolean isSuccessful
        int courtX
        int courtY
    }
```

## Core Entities

### Season
Represents a basketball season (e.g., "2023-24").

**Key Fields:**
- `name` - Unique season identifier (e.g., "2023-24")
- `isActive` - Indicates current active season
- `startDate` / `endDate` - Season duration

**Indexes:**
- `isActive` - Fast filtering of active season

---

### Team
Represents a basketball team with organizational details.

**Key Fields:**
- `abbreviation` - Unique 3-letter code (e.g., "LAL", "GSW")
- `conference` / `division` - Organizational structure

**Indexes:**
- Composite index on `(conference, division)` for conference standings

**Relationships:**
- One-to-Many with `Player`
- One-to-Many with `Game` (as home team)
- One-to-Many with `Game` (as away team)

---

### Player
Represents a basketball player with biographical and team information.

**Key Fields:**
- `position` - Player position (PG, SG, SF, PF, C)
- `height` / `weight` - Physical measurements (cm/kg)
- `teamId` - Current team (nullable for free agents)

**Indexes:**
- `teamId` - Fast team roster queries
- `isActive` - Filter active/retired players
- Composite `(lastName, firstName)` - Player search

**Relationships:**
- Many-to-One with `Team`
- One-to-Many with `GameStats`
- One-to-Many with `PlayByPlayEvent`

---

### Game
Represents a single game between two teams.

**Key Fields:**
- `homeTeamId` / `awayTeamId` - Competing teams
- `homeScore` / `awayScore` - Final scores
- `status` - Game state (scheduled, in_progress, completed, etc.)
- `period` / `gameClock` - Current game time

**Indexes:**
- `seasonId` - Season game listings
- `homeTeamId` / `awayTeamId` - Team schedules
- `gameDate` - Chronological queries
- `status` - Filter by game state

**Relationships:**
- Many-to-One with `Season`
- Many-to-One with `Team` (home)
- Many-to-One with `Team` (away)
- One-to-Many with `GameStats`
- One-to-Many with `PlayByPlayEvent`

---

### GameStats
Player statistics for a single game.

**Key Fields:**
- **Shooting:** `fieldGoalsMade`, `fieldGoalsAttempted`, `threePointersMade`, `freeThrowsMade`
- **Rebounding:** `offensiveRebounds`, `defensiveRebounds`, `totalRebounds`
- **Playmaking:** `assists`, `turnovers`
- **Defense:** `steals`, `blocks`, `personalFouls`
- **Advanced:** `trueShootingPct`, `effectiveFgPct`, `usageRate`, `plusMinus`

**Constraints:**
- Unique constraint on `(gameId, playerId)` - One stat line per player per game

**Indexes:**
- `gameId` - All stats for a game
- `playerId` - Player game log
- `points`, `totalRebounds`, `assists` - Leaderboards

**Auto-Calculated Fields:**
Advanced metrics are automatically calculated via database triggers on insert/update.

---

### PlayByPlayEvent
Granular play-by-play events during a game.

**Key Fields:**
- `eventType` - Event category (shot, rebound, assist, turnover, foul, substitution)
- `eventSubType` - Specific type (2pt, 3pt, offensive, defensive)
- `period` / `gameClock` / `gameClockSeconds` - Event timing
- `isSuccessful` - Event outcome (made/missed shot, etc.)
- `courtX` / `courtY` - Shot chart coordinates
- `assistPlayerId` - Assisting player for made shots

**Indexes:**
- Composite `(gameId, period, gameClockSeconds)` - **Critical for chronological queries**
- `playerId` - Player event history
- `eventType` - Filter by event type
- Composite `(gameId, eventType)` - Game-specific event filtering

**Use Cases:**
- Shot charts (using courtX/courtY)
- Momentum analysis
- Play sequencing
- Real-time game updates

## Advanced Metrics

### Automatic Calculation
The following metrics are **automatically calculated** via database triggers when `GameStats` records are inserted or updated:

1. **True Shooting % (TS%)**
   - Formula: `PTS / (2 * (FGA + 0.44 * FTA))`
   - Measures overall shooting efficiency

2. **Effective Field Goal % (eFG%)**
   - Formula: `(FGM + 0.5 * 3PM) / FGA`
   - Adjusts FG% for 3-pointer value

### SQL Functions Available

Additional metrics can be calculated on-demand using provided SQL functions:

3. **Usage Rate (USG%)**
   ```sql
   SELECT calculate_usage_rate(
     player_fga, player_fta, player_tov, player_mp,
     team_fga, team_fta, team_tov, team_mp
   );
   ```

4. **Player Efficiency Rating (PER)**
   ```sql
   SELECT calculate_simple_per(
     points, total_rebounds, assists, steals, blocks,
     field_goals_made, field_goals_attempted,
     free_throws_made, free_throws_attempted,
     turnovers, minutes_played
   );
   ```

5. **Offensive Rating (ORtg)**
   ```sql
   SELECT calculate_offensive_rating(
     points, field_goals_attempted,
     free_throws_attempted, turnovers
   );
   ```

6. **Assist-to-Turnover Ratio**
   ```sql
   SELECT calculate_ast_to_ratio(assists, turnovers);
   ```

## Example Queries

### 1. Player Season Averages with Advanced Metrics

```sql
SELECT 
  p."firstName" || ' ' || p."lastName" as player_name,
  t.name as team,
  COUNT(gs.id) as games_played,
  ROUND(AVG(gs.points), 1) as ppg,
  ROUND(AVG(gs."totalRebounds"), 1) as rpg,
  ROUND(AVG(gs.assists), 1) as apg,
  ROUND(AVG(gs.steals), 1) as spg,
  ROUND(AVG(gs.blocks), 1) as bpg,
  ROUND(AVG(gs."trueShootingPct")::numeric, 3) as ts_pct,
  ROUND(AVG(gs."effectiveFgPct")::numeric, 3) as efg_pct,
  ROUND(AVG(gs."plusMinus"), 1) as plus_minus
FROM game_stats gs
JOIN players p ON gs."playerId" = p.id
LEFT JOIN teams t ON p."teamId" = t.id
JOIN games g ON gs."gameId" = g.id
WHERE g."seasonId" = 'season_id_here'
  AND g.status = 'completed'
GROUP BY p.id, p."firstName", p."lastName", t.name
HAVING COUNT(gs.id) >= 10  -- Minimum games played
ORDER BY ppg DESC
LIMIT 20;
```

### 2. Game Box Score

```sql
SELECT 
  p."firstName" || ' ' || p."lastName" as player,
  p."jerseyNumber" as "#",
  p.position as pos,
  gs."minutesPlayed" as min,
  gs.points as pts,
  gs."fieldGoalsMade" || '-' || gs."fieldGoalsAttempted" as fg,
  gs."threePointersMade" || '-' || gs."threePointersAttempted" as "3pt",
  gs."freeThrowsMade" || '-' || gs."freeThrowsAttempted" as ft,
  gs."totalRebounds" as reb,
  gs.assists as ast,
  gs.steals as stl,
  gs.blocks as blk,
  gs.turnovers as tov,
  gs."personalFouls" as pf,
  gs."plusMinus" as "+/-"
FROM game_stats gs
JOIN players p ON gs."playerId" = p.id
WHERE gs."gameId" = 'game_id_here'
ORDER BY gs.points DESC;
```

### 3. Team Standings

```sql
SELECT 
  t.name as team,
  COUNT(CASE WHEN 
    (g."homeTeamId" = t.id AND g."homeScore" > g."awayScore") OR
    (g."awayTeamId" = t.id AND g."awayScore" > g."homeScore")
  THEN 1 END) as wins,
  COUNT(CASE WHEN 
    (g."homeTeamId" = t.id AND g."homeScore" < g."awayScore") OR
    (g."awayTeamId" = t.id AND g."awayScore" < g."homeScore")
  THEN 1 END) as losses,
  ROUND(
    COUNT(CASE WHEN 
      (g."homeTeamId" = t.id AND g."homeScore" > g."awayScore") OR
      (g."awayTeamId" = t.id AND g."awayScore" > g."homeScore")
    THEN 1 END)::numeric / COUNT(g.id),
    3
  ) as win_pct
FROM teams t
LEFT JOIN games g ON (g."homeTeamId" = t.id OR g."awayTeamId" = t.id)
  AND g.status = 'completed'
  AND g."seasonId" = 'season_id_here'
GROUP BY t.id, t.name
ORDER BY win_pct DESC, wins DESC;
```

### 4. Shot Chart Data

```sql
SELECT 
  pbe."courtX",
  pbe."courtY",
  pbe."isSuccessful",
  pbe."eventSubType",
  pbe.description
FROM play_by_play_events pbe
WHERE pbe."gameId" = 'game_id_here'
  AND pbe."playerId" = 'player_id_here'
  AND pbe."eventType" = 'shot'
  AND pbe."courtX" IS NOT NULL
  AND pbe."courtY" IS NOT NULL
ORDER BY pbe.period, pbe."gameClockSeconds" DESC;
```

### 5. Play-by-Play Timeline

```sql
SELECT 
  pbe.period,
  pbe."gameClock",
  p."firstName" || ' ' || p."lastName" as player,
  pbe."eventType",
  pbe."eventSubType",
  pbe.description,
  pbe."homeScore" || '-' || pbe."awayScore" as score
FROM play_by_play_events pbe
LEFT JOIN players p ON pbe."playerId" = p.id
WHERE pbe."gameId" = 'game_id_here'
ORDER BY pbe.period, pbe."gameClockSeconds" DESC
LIMIT 100;
```

### 6. Player Shooting Efficiency Leaderboard

```sql
SELECT 
  p."firstName" || ' ' || p."lastName" as player,
  COUNT(gs.id) as games,
  ROUND(AVG(gs.points), 1) as ppg,
  ROUND(AVG(gs."fieldGoalsMade")::numeric / NULLIF(AVG(gs."fieldGoalsAttempted"), 0) * 100, 1) as fg_pct,
  ROUND(AVG(gs."threePointersMade")::numeric / NULLIF(AVG(gs."threePointersAttempted"), 0) * 100, 1) as three_pct,
  ROUND(AVG(gs."trueShootingPct")::numeric * 100, 1) as ts_pct,
  ROUND(AVG(gs."effectiveFgPct")::numeric * 100, 1) as efg_pct
FROM game_stats gs
JOIN players p ON gs."playerId" = p.id
JOIN games g ON gs."gameId" = g.id
WHERE g."seasonId" = 'season_id_here'
  AND g.status = 'completed'
GROUP BY p.id, p."firstName", p."lastName"
HAVING COUNT(gs.id) >= 10
  AND AVG(gs."fieldGoalsAttempted") >= 5  -- Minimum FGA per game
ORDER BY ts_pct DESC
LIMIT 20;
```

## Performance Optimization

### Indexing Strategy

The schema includes strategic indexes for optimal query performance:

1. **Foreign Key Indexes**: All foreign keys are indexed for fast joins
2. **Composite Indexes**: Multi-column indexes for common query patterns
   - `(gameId, period, gameClockSeconds)` on PlayByPlayEvent - chronological queries
   - `(conference, division)` on Team - standings queries
   - `(lastName, firstName)` on Player - name searches

3. **Leaderboard Indexes**: Single-column indexes on statistical columns
   - `points`, `totalRebounds`, `assists` on GameStats

### Query Optimization Tips

1. **Always filter by season** when querying games to leverage the `seasonId` index
2. **Use the status index** to filter completed games vs in-progress
3. **Leverage composite indexes** by including all indexed columns in WHERE clauses
4. **Batch calculate metrics** using the `update_advanced_metrics()` function for bulk updates
5. **Use EXPLAIN ANALYZE** to verify index usage in production queries

### Data Types

- **Decimal(5, 4)** for percentages - stores values like 0.5234 (52.34%)
- **Integer** for counts and scores - efficient storage and calculation
- **String (cuid)** for IDs - globally unique, URL-safe identifiers
- **DateTime** for timestamps - proper timezone handling

## Migration Guide

### Initial Setup

1. **Initialize Prisma**:
   ```bash
   npx prisma init
   ```

2. **Configure DATABASE_URL** in `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/basketball_db"
   ```

3. **Generate and apply migration**:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Apply advanced metrics functions**:
   ```bash
   psql -d basketball_db -f prisma/migrations/advanced_metrics.sql
   ```

5. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

### Updating Schema

When modifying the schema:

```bash
npx prisma migrate dev --name descriptive_name
npx prisma generate
```

## Usage in Application Code

### TypeScript Example

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new player
const player = await prisma.player.create({
  data: {
    firstName: 'LeBron',
    lastName: 'James',
    jerseyNumber: 23,
    position: 'SF',
    height: 206,
    weight: 113,
    teamId: 'lakers_team_id',
  },
});

// Record game stats (metrics auto-calculated via trigger)
const stats = await prisma.gameStats.create({
  data: {
    gameId: 'game_id',
    playerId: player.id,
    minutesPlayed: 38,
    points: 30,
    fieldGoalsMade: 11,
    fieldGoalsAttempted: 20,
    threePointersMade: 2,
    threePointersAttempted: 5,
    freeThrowsMade: 6,
    freeThrowsAttempted: 8,
    totalRebounds: 8,
    assists: 7,
    steals: 2,
    blocks: 1,
    turnovers: 3,
  },
});

// Query with relations
const gameWithStats = await prisma.game.findUnique({
  where: { id: 'game_id' },
  include: {
    homeTeam: true,
    awayTeam: true,
    gameStats: {
      include: {
        player: true,
      },
      orderBy: {
        points: 'desc',
      },
    },
  },
});
```

## Design Decisions

### Normalization
- **3NF compliance**: Eliminates data redundancy
- **Separate GameStats table**: Allows efficient querying of player performance
- **PlayByPlayEvent granularity**: Enables detailed analysis and shot charts

### Relationships
- **Self-referential Game relations**: Properly models home/away team dynamics
- **Nullable player in PlayByPlayEvent**: Supports team-level events (team rebounds)
- **Cascade deletes**: Maintains referential integrity (deleting a game removes its stats)

### Performance
- **Strategic indexing**: Balances query speed with write performance
- **Automatic metric calculation**: Reduces application complexity
- **Composite indexes**: Optimizes common multi-column queries

### Scalability
- **CUID identifiers**: Distributed-friendly, no auto-increment bottlenecks
- **Indexed foreign keys**: Maintains performance as data grows
- **Efficient data types**: Minimizes storage footprint

---

**Schema Version**: 1.0  
**Last Updated**: 2026-02-04  
**Prisma Version**: 5.x+  
**PostgreSQL Version**: 12+
