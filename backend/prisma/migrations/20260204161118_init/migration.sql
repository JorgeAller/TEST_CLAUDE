-- CreateEnum
CREATE TYPE "Position" AS ENUM ('PG', 'SG', 'SF', 'PF', 'C');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'POSTPONED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "conference" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "position" "Position" NOT NULL,
    "jerseyNumber" INTEGER,
    "height" INTEGER,
    "weight" INTEGER,
    "birthDate" TIMESTAMP(3),
    "teamId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "homeTeamId" TEXT NOT NULL,
    "awayTeamId" TEXT NOT NULL,
    "gameDate" TIMESTAMP(3) NOT NULL,
    "season" TEXT NOT NULL,
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "status" "GameStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerGameStats" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "minutesPlayed" DECIMAL(5,2) NOT NULL,
    "points" INTEGER NOT NULL,
    "fieldGoalsMade" INTEGER NOT NULL,
    "fieldGoalsAttempted" INTEGER NOT NULL,
    "threePointersMade" INTEGER NOT NULL,
    "threePointersAttempted" INTEGER NOT NULL,
    "freeThrowsMade" INTEGER NOT NULL,
    "freeThrowsAttempted" INTEGER NOT NULL,
    "offensiveRebounds" INTEGER NOT NULL,
    "defensiveRebounds" INTEGER NOT NULL,
    "totalRebounds" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "steals" INTEGER NOT NULL,
    "blocks" INTEGER NOT NULL,
    "turnovers" INTEGER NOT NULL,
    "personalFouls" INTEGER NOT NULL,
    "plusMinus" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerGameStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerSeasonStats" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "gamesPlayed" INTEGER NOT NULL,
    "gamesStarted" INTEGER,
    "totalMinutes" DECIMAL(8,2) NOT NULL,
    "totalPoints" INTEGER NOT NULL,
    "totalFieldGoalsMade" INTEGER NOT NULL,
    "totalFieldGoalsAttempted" INTEGER NOT NULL,
    "totalThreePointersMade" INTEGER NOT NULL,
    "totalThreePointersAttempted" INTEGER NOT NULL,
    "totalFreeThrowsMade" INTEGER NOT NULL,
    "totalFreeThrowsAttempted" INTEGER NOT NULL,
    "totalOffensiveRebounds" INTEGER NOT NULL,
    "totalDefensiveRebounds" INTEGER NOT NULL,
    "totalRebounds" INTEGER NOT NULL,
    "totalAssists" INTEGER NOT NULL,
    "totalSteals" INTEGER NOT NULL,
    "totalBlocks" INTEGER NOT NULL,
    "totalTurnovers" INTEGER NOT NULL,
    "totalPersonalFouls" INTEGER NOT NULL,
    "avgPoints" DECIMAL(5,2) NOT NULL,
    "avgRebounds" DECIMAL(5,2) NOT NULL,
    "avgAssists" DECIMAL(5,2) NOT NULL,
    "avgMinutes" DECIMAL(5,2) NOT NULL,
    "fieldGoalPercentage" DECIMAL(5,4),
    "threePointPercentage" DECIMAL(5,4),
    "freeThrowPercentage" DECIMAL(5,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerSeasonStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvancedMetrics" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "trueShootingPercentage" DECIMAL(5,4),
    "effectiveFieldGoalPercentage" DECIMAL(5,4),
    "playerEfficiencyRating" DECIMAL(6,2),
    "offensiveRating" DECIMAL(6,2),
    "defensiveRating" DECIMAL(6,2),
    "netRating" DECIMAL(6,2),
    "usageRate" DECIMAL(5,2),
    "assistPercentage" DECIMAL(5,2),
    "turnoverPercentage" DECIMAL(5,2),
    "pointsPer36" DECIMAL(5,2),
    "reboundsPer36" DECIMAL(5,2),
    "assistsPer36" DECIMAL(5,2),
    "stealsPer36" DECIMAL(5,2),
    "blocksPer36" DECIMAL(5,2),
    "assistToTurnoverRatio" DECIMAL(5,2),
    "stealPercentage" DECIMAL(5,2),
    "blockPercentage" DECIMAL(5,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdvancedMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_abbreviation_key" ON "Team"("abbreviation");

-- CreateIndex
CREATE INDEX "Team_conference_division_idx" ON "Team"("conference", "division");

-- CreateIndex
CREATE INDEX "Player_teamId_idx" ON "Player"("teamId");

-- CreateIndex
CREATE INDEX "Player_lastName_firstName_idx" ON "Player"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "Game_gameDate_idx" ON "Game"("gameDate");

-- CreateIndex
CREATE INDEX "Game_season_idx" ON "Game"("season");

-- CreateIndex
CREATE INDEX "Game_homeTeamId_awayTeamId_idx" ON "Game"("homeTeamId", "awayTeamId");

-- CreateIndex
CREATE INDEX "PlayerGameStats_playerId_idx" ON "PlayerGameStats"("playerId");

-- CreateIndex
CREATE INDEX "PlayerGameStats_gameId_idx" ON "PlayerGameStats"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerGameStats_playerId_gameId_key" ON "PlayerGameStats"("playerId", "gameId");

-- CreateIndex
CREATE INDEX "PlayerSeasonStats_season_idx" ON "PlayerSeasonStats"("season");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerSeasonStats_playerId_season_key" ON "PlayerSeasonStats"("playerId", "season");

-- CreateIndex
CREATE INDEX "AdvancedMetrics_season_idx" ON "AdvancedMetrics"("season");

-- CreateIndex
CREATE INDEX "AdvancedMetrics_playerEfficiencyRating_idx" ON "AdvancedMetrics"("playerEfficiencyRating");

-- CreateIndex
CREATE INDEX "AdvancedMetrics_trueShootingPercentage_idx" ON "AdvancedMetrics"("trueShootingPercentage");

-- CreateIndex
CREATE UNIQUE INDEX "AdvancedMetrics_playerId_season_key" ON "AdvancedMetrics"("playerId", "season");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerGameStats" ADD CONSTRAINT "PlayerGameStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerGameStats" ADD CONSTRAINT "PlayerGameStats_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerSeasonStats" ADD CONSTRAINT "PlayerSeasonStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvancedMetrics" ADD CONSTRAINT "AdvancedMetrics_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
