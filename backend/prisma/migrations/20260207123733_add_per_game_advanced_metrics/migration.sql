-- AlterTable
ALTER TABLE "PlayerGameStats" ADD COLUMN     "assistToTurnoverRatio" DECIMAL(4,2),
ADD COLUMN     "effectiveFgPct" DECIMAL(5,4),
ADD COLUMN     "offensiveRating" DECIMAL(6,2),
ADD COLUMN     "playerEfficiencyRating" DECIMAL(6,2),
ADD COLUMN     "trueShootingPct" DECIMAL(5,4),
ADD COLUMN     "usageRate" DECIMAL(5,4);

-- ============================================================================
-- ADVANCED BASKETBALL METRICS - SQL FUNCTIONS
-- ============================================================================

-- 1. TRUE SHOOTING PERCENTAGE (TS%)
-- Formula: TS% = PTS / (2 * (FGA + 0.44 * FTA))
CREATE OR REPLACE FUNCTION calculate_true_shooting_pct(
  points INTEGER,
  field_goals_attempted INTEGER,
  free_throws_attempted INTEGER
)
RETURNS DECIMAL(5, 4) AS $$
BEGIN
  IF field_goals_attempted = 0 AND free_throws_attempted = 0 THEN
    RETURN NULL;
  END IF;

  RETURN ROUND(
    points::DECIMAL / (2 * (field_goals_attempted + 0.44 * free_throws_attempted)),
    4
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. EFFECTIVE FIELD GOAL PERCENTAGE (eFG%)
-- Formula: eFG% = (FGM + 0.5 * 3PM) / FGA
CREATE OR REPLACE FUNCTION calculate_effective_fg_pct(
  field_goals_made INTEGER,
  three_pointers_made INTEGER,
  field_goals_attempted INTEGER
)
RETURNS DECIMAL(5, 4) AS $$
BEGIN
  IF field_goals_attempted = 0 THEN
    RETURN NULL;
  END IF;

  RETURN ROUND(
    (field_goals_made + 0.5 * three_pointers_made)::DECIMAL / field_goals_attempted,
    4
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. USAGE RATE (USG%)
-- Formula: USG% = 100 * ((FGA + 0.44 * FTA + TOV) * (Team_MP / 5)) / (MP * (Team_FGA + 0.44 * Team_FTA + Team_TOV))
CREATE OR REPLACE FUNCTION calculate_usage_rate(
  player_fga INTEGER,
  player_fta INTEGER,
  player_tov INTEGER,
  player_mp INTEGER,
  team_fga INTEGER,
  team_fta INTEGER,
  team_tov INTEGER,
  team_mp INTEGER
)
RETURNS DECIMAL(5, 4) AS $$
DECLARE
  player_plays DECIMAL;
  team_plays DECIMAL;
BEGIN
  IF player_mp = 0 OR team_mp = 0 THEN
    RETURN NULL;
  END IF;

  player_plays := player_fga + 0.44 * player_fta + player_tov;
  team_plays := team_fga + 0.44 * team_fta + team_tov;

  IF team_plays = 0 THEN
    RETURN NULL;
  END IF;

  RETURN ROUND(
    (player_plays * (team_mp::DECIMAL / 5)) / (player_mp * team_plays),
    4
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 4. PLAYER EFFICIENCY RATING (PER) - Simplified
-- Formula: (PTS + REB + AST + STL + BLK - Missed_FG - Missed_FT - TOV) / MP * 100
CREATE OR REPLACE FUNCTION calculate_simple_per(
  points INTEGER,
  total_rebounds INTEGER,
  assists INTEGER,
  steals INTEGER,
  blocks INTEGER,
  field_goals_made INTEGER,
  field_goals_attempted INTEGER,
  free_throws_made INTEGER,
  free_throws_attempted INTEGER,
  turnovers INTEGER,
  minutes_played INTEGER
)
RETURNS DECIMAL(6, 2) AS $$
DECLARE
  missed_fg INTEGER;
  missed_ft INTEGER;
  efficiency_score DECIMAL;
BEGIN
  IF minutes_played = 0 THEN
    RETURN NULL;
  END IF;

  missed_fg := field_goals_attempted - field_goals_made;
  missed_ft := free_throws_attempted - free_throws_made;

  efficiency_score := (
    points +
    total_rebounds +
    assists +
    steals +
    blocks -
    missed_fg -
    missed_ft -
    turnovers
  )::DECIMAL / minutes_played;

  RETURN ROUND(efficiency_score * 100, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 5. OFFENSIVE RATING (ORtg) - Simplified
-- Points produced per 100 possessions
CREATE OR REPLACE FUNCTION calculate_offensive_rating(
  points INTEGER,
  field_goals_attempted INTEGER,
  free_throws_attempted INTEGER,
  turnovers INTEGER
)
RETURNS DECIMAL(6, 2) AS $$
DECLARE
  possessions DECIMAL;
BEGIN
  possessions := field_goals_attempted + 0.44 * free_throws_attempted + turnovers;

  IF possessions = 0 THEN
    RETURN NULL;
  END IF;

  RETURN ROUND((points::DECIMAL / possessions) * 100, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 6. ASSIST-TO-TURNOVER RATIO
CREATE OR REPLACE FUNCTION calculate_ast_to_ratio(
  assists INTEGER,
  turnovers INTEGER
)
RETURNS DECIMAL(4, 2) AS $$
BEGIN
  IF turnovers = 0 THEN
    RETURN assists::DECIMAL;
  END IF;

  RETURN ROUND(assists::DECIMAL / turnovers, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- BATCH UPDATE FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION update_advanced_metrics()
RETURNS void AS $$
BEGIN
  UPDATE "PlayerGameStats"
  SET
    "trueShootingPct" = calculate_true_shooting_pct(
      points,
      "fieldGoalsAttempted",
      "freeThrowsAttempted"
    ),
    "effectiveFgPct" = calculate_effective_fg_pct(
      "fieldGoalsMade",
      "threePointersMade",
      "fieldGoalsAttempted"
    ),
    "offensiveRating" = calculate_offensive_rating(
      points,
      "fieldGoalsAttempted",
      "freeThrowsAttempted",
      turnovers
    ),
    "playerEfficiencyRating" = calculate_simple_per(
      points,
      "totalRebounds",
      assists,
      steals,
      blocks,
      "fieldGoalsMade",
      "fieldGoalsAttempted",
      "freeThrowsMade",
      "freeThrowsAttempted",
      turnovers,
      FLOOR("minutesPlayed")::INTEGER
    ),
    "assistToTurnoverRatio" = calculate_ast_to_ratio(
      assists,
      turnovers
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGER - Auto-calculate metrics on INSERT/UPDATE
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_calculate_metrics()
RETURNS TRIGGER AS $$
BEGIN
  NEW."trueShootingPct" := calculate_true_shooting_pct(
    NEW.points,
    NEW."fieldGoalsAttempted",
    NEW."freeThrowsAttempted"
  );

  NEW."effectiveFgPct" := calculate_effective_fg_pct(
    NEW."fieldGoalsMade",
    NEW."threePointersMade",
    NEW."fieldGoalsAttempted"
  );

  NEW."offensiveRating" := calculate_offensive_rating(
    NEW.points,
    NEW."fieldGoalsAttempted",
    NEW."freeThrowsAttempted",
    NEW.turnovers
  );

  NEW."playerEfficiencyRating" := calculate_simple_per(
    NEW.points,
    NEW."totalRebounds",
    NEW.assists,
    NEW.steals,
    NEW.blocks,
    NEW."fieldGoalsMade",
    NEW."fieldGoalsAttempted",
    NEW."freeThrowsMade",
    NEW."freeThrowsAttempted",
    NEW.turnovers,
    FLOOR(NEW."minutesPlayed")::INTEGER
  );

  NEW."assistToTurnoverRatio" := calculate_ast_to_ratio(
    NEW.assists,
    NEW.turnovers
  );

  -- usageRate requires team-level aggregates, cannot be calculated in row trigger

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS calculate_metrics_trigger ON "PlayerGameStats";
CREATE TRIGGER calculate_metrics_trigger
  BEFORE INSERT OR UPDATE ON "PlayerGameStats"
  FOR EACH ROW
  EXECUTE FUNCTION trigger_calculate_metrics();

-- ============================================================================
-- BACKFILL - Calculate metrics for existing rows
-- ============================================================================
SELECT update_advanced_metrics();
