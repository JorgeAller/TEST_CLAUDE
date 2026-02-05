-- ============================================================================
-- ADVANCED BASKETBALL METRICS - SQL FUNCTIONS
-- ============================================================================
-- These functions calculate advanced basketball statistics efficiently
-- They can be used in queries or called from application code

-- ============================================================================
-- 1. TRUE SHOOTING PERCENTAGE (TS%)
-- ============================================================================
-- Formula: TS% = PTS / (2 * (FGA + 0.44 * FTA))
-- Measures shooting efficiency accounting for 2pt, 3pt, and free throws

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

-- ============================================================================
-- 2. EFFECTIVE FIELD GOAL PERCENTAGE (eFG%)
-- ============================================================================
-- Formula: eFG% = (FGM + 0.5 * 3PM) / FGA
-- Adjusts FG% to account for 3-pointers being worth more

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

-- ============================================================================
-- 3. USAGE RATE (USG%)
-- ============================================================================
-- Formula: USG% = 100 * ((FGA + 0.44 * FTA + TOV) * (Team_MP / 5)) / (MP * (Team_FGA + 0.44 * Team_FTA + Team_TOV))
-- Simplified version: percentage of team plays used while on court

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

-- ============================================================================
-- 4. PLAYER EFFICIENCY RATING (PER) - Simplified Version
-- ============================================================================
-- Simplified PER calculation (full NBA formula requires league averages)
-- Formula: (PTS + REB + AST + STL + BLK - Missed_FG - Missed_FT - TOV) / MP

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

-- ============================================================================
-- 5. OFFENSIVE RATING (ORtg) - Simplified
-- ============================================================================
-- Points produced per 100 possessions
-- Simplified: (Points / Possessions) * 100
-- Possessions ≈ FGA + 0.44 * FTA + TOV

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

-- ============================================================================
-- 6. ASSIST-TO-TURNOVER RATIO
-- ============================================================================
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
-- 7. BATCH UPDATE FUNCTION - Update Advanced Metrics for All Game Stats
-- ============================================================================
-- This function updates calculated metrics for all game stats records
-- Call this after inserting/updating game stats

CREATE OR REPLACE FUNCTION update_advanced_metrics()
RETURNS void AS $$
BEGIN
  UPDATE game_stats
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
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 8. TRIGGER - Auto-calculate metrics on insert/update
-- ============================================================================
-- Automatically calculate TS% and eFG% when game stats are inserted or updated

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
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS calculate_metrics_trigger ON game_stats;
CREATE TRIGGER calculate_metrics_trigger
  BEFORE INSERT OR UPDATE ON game_stats
  FOR EACH ROW
  EXECUTE FUNCTION trigger_calculate_metrics();

-- ============================================================================
-- EXAMPLE QUERIES
-- ============================================================================

-- Example 1: Get player season averages with advanced metrics
-- SELECT 
--   p."firstName" || ' ' || p."lastName" as player_name,
--   COUNT(gs.id) as games_played,
--   ROUND(AVG(gs.points), 1) as ppg,
--   ROUND(AVG(gs."totalRebounds"), 1) as rpg,
--   ROUND(AVG(gs.assists), 1) as apg,
--   ROUND(AVG(gs."trueShootingPct"), 3) as ts_pct,
--   ROUND(AVG(gs."effectiveFgPct"), 3) as efg_pct
-- FROM game_stats gs
-- JOIN players p ON gs."playerId" = p.id
-- JOIN games g ON gs."gameId" = g.id
-- WHERE g."seasonId" = 'season_id_here'
-- GROUP BY p.id, p."firstName", p."lastName"
-- ORDER BY ppg DESC;

-- Example 2: Get top scorers for a specific game
-- SELECT 
--   p."firstName" || ' ' || p."lastName" as player_name,
--   t.name as team_name,
--   gs.points,
--   gs."fieldGoalsMade" || '-' || gs."fieldGoalsAttempted" as fg,
--   gs."threePointersMade" || '-' || gs."threePointersAttempted" as three_pt,
--   gs."totalRebounds" as reb,
--   gs.assists as ast,
--   gs."trueShootingPct" as ts_pct
-- FROM game_stats gs
-- JOIN players p ON gs."playerId" = p.id
-- JOIN players_teams pt ON p.id = pt."playerId"
-- JOIN teams t ON pt."teamId" = t.id
-- WHERE gs."gameId" = 'game_id_here'
-- ORDER BY gs.points DESC;
