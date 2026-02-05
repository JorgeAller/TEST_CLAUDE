import { usePlayerWithStats, usePlayerGameLog } from '@/hooks/use-players';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { StatGrid, StatBadge } from '@/components/ui/StatBadge';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { PerformanceTrendChart } from '@/components/charts/PerformanceTrendChart';
import { Table, Column } from '@/components/ui/Table';
import { formatPlayerName, formatPosition, formatHeight, formatWeight, formatNumber, formatPercentage, formatDate, calculateAge } from '@/lib/utils';
import { User } from 'lucide-react';
import { PlayerGameStats } from '@/types';

interface PlayerDetailViewProps {
  playerId: string;
  season?: string;
}

export function PlayerDetailView({ playerId, season = '2023-24' }: PlayerDetailViewProps) {
  const { player, seasonStats, advancedMetrics, isLoading, isError, error } = usePlayerWithStats(playerId, season);
  const { data: gameLog, isLoading: gameLogLoading } = usePlayerGameLog(playerId, season);

  if (isLoading) {
    return <LoadingOverlay message="Loading player details..." />;
  }

  if (isError || !player) {
    return <ErrorMessage message={error?.message || 'Failed to load player details'} />;
  }

  const age = calculateAge(player.birthDate);

  // Prepare trend data from game log
  const trendData = gameLog?.slice(0, 10).reverse().map((game) => ({
    date: formatDate(game.game?.gameDate || ''),
    Points: game.points,
    Rebounds: game.totalRebounds,
    Assists: game.assists,
  })) || [];

  const gameLogColumns: Column<PlayerGameStats>[] = [
    {
      key: 'date',
      header: 'Date',
      accessor: (row) => formatDate(row.game?.gameDate || ''),
      sortable: true,
    },
    {
      key: 'opponent',
      header: 'Opponent',
      accessor: (row) => row.game?.awayTeam?.abbreviation || row.game?.homeTeam?.abbreviation || '-',
    },
    {
      key: 'min',
      header: 'MIN',
      accessor: (row) => formatNumber(Number(row.minutesPlayed)),
      sortable: true,
    },
    {
      key: 'pts',
      header: 'PTS',
      accessor: (row) => row.points,
      sortable: true,
      className: 'font-semibold text-basketball-orange',
    },
    {
      key: 'reb',
      header: 'REB',
      accessor: (row) => row.totalRebounds,
      sortable: true,
    },
    {
      key: 'ast',
      header: 'AST',
      accessor: (row) => row.assists,
      sortable: true,
    },
    {
      key: 'stl',
      header: 'STL',
      accessor: (row) => row.steals,
      sortable: true,
    },
    {
      key: 'blk',
      header: 'BLK',
      accessor: (row) => row.blocks,
      sortable: true,
    },
    {
      key: 'fg',
      header: 'FG',
      accessor: (row) => `${row.fieldGoalsMade}-${row.fieldGoalsAttempted}`,
    },
    {
      key: '3p',
      header: '3P',
      accessor: (row) => `${row.threePointersMade}-${row.threePointersAttempted}`,
    },
    {
      key: 'plusMinus',
      header: '+/-',
      accessor: (row) => row.plusMinus !== null && row.plusMinus !== undefined ? (row.plusMinus > 0 ? `+${row.plusMinus}` : row.plusMinus) : '-',
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Player Header */}
      <Card variant="elevated">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-basketball-orange to-basketball-court flex items-center justify-center text-white font-bold text-5xl shadow-xl">
              {player.jerseyNumber || <User className="w-16 h-16" />}
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-4xl text-gray-900 dark:text-white mb-2">
                {formatPlayerName(player.firstName, player.lastName)}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                {formatPosition(player.position)}
              </p>
              {player.team && (
                <p className="text-lg font-semibold text-basketball-orange mb-4">
                  {player.team.city} {player.team.name}
                </p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Height:</span>
                  <span className="ml-2 font-semibold text-gray-900 dark:text-white">{formatHeight(player.height)}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Weight:</span>
                  <span className="ml-2 font-semibold text-gray-900 dark:text-white">{formatWeight(player.weight)}</span>
                </div>
                {age && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Age:</span>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">{age}</span>
                  </div>
                )}
                {player.jerseyNumber && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Number:</span>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">#{player.jerseyNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Season Stats */}
      {seasonStats && (
        <Card>
          <CardHeader>Season Averages ({season})</CardHeader>
          <CardContent>
            <StatGrid columns={5}>
              <StatBadge label="PPG" value={formatNumber(seasonStats.avgPoints)} variant="primary" />
              <StatBadge label="RPG" value={formatNumber(seasonStats.avgRebounds)} variant="primary" />
              <StatBadge label="APG" value={formatNumber(seasonStats.avgAssists)} variant="primary" />
              <StatBadge label="MPG" value={formatNumber(seasonStats.avgMinutes)} />
              <StatBadge label="GP" value={seasonStats.gamesPlayed} />
            </StatGrid>
            <div className="mt-4">
              <StatGrid columns={5}>
                <StatBadge label="FG%" value={formatPercentage(seasonStats.fieldGoalPercentage)} />
                <StatBadge label="3P%" value={formatPercentage(seasonStats.threePointPercentage)} />
                <StatBadge label="FT%" value={formatPercentage(seasonStats.freeThrowPercentage)} />
                <StatBadge label="Total PTS" value={seasonStats.totalPoints} />
                <StatBadge label="Total REB" value={seasonStats.totalRebounds} />
              </StatGrid>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Metrics */}
      {advancedMetrics && (
        <Card>
          <CardHeader>Advanced Metrics ({season})</CardHeader>
          <CardContent>
            <StatGrid columns={4}>
              <StatBadge label="PER" value={formatNumber(advancedMetrics.playerEfficiencyRating)} variant="success" />
              <StatBadge label="TS%" value={formatPercentage(advancedMetrics.trueShootingPercentage)} variant="success" />
              <StatBadge label="eFG%" value={formatPercentage(advancedMetrics.effectiveFieldGoalPercentage)} />
              <StatBadge label="USG%" value={formatNumber(advancedMetrics.usageRate)} />
            </StatGrid>
            <div className="mt-4">
              <StatGrid columns={4}>
                <StatBadge label="ORtg" value={formatNumber(advancedMetrics.offensiveRating)} />
                <StatBadge label="DRtg" value={formatNumber(advancedMetrics.defensiveRating)} />
                <StatBadge label="Net Rtg" value={formatNumber(advancedMetrics.netRating)} />
                <StatBadge label="AST/TO" value={formatNumber(advancedMetrics.assistToTurnoverRatio)} />
              </StatGrid>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Trends */}
      {trendData.length > 0 && (
        <PerformanceTrendChart
          data={trendData}
          metrics={[
            { key: 'Points', label: 'Points', color: '#FF6B35' },
            { key: 'Rebounds', label: 'Rebounds', color: '#3B82F6' },
            { key: 'Assists', label: 'Assists', color: '#10B981' },
          ]}
          title="Last 10 Games Performance"
          type="area"
        />
      )}

      {/* Game Log */}
      <Card>
        <CardHeader>Game Log ({season})</CardHeader>
        <CardContent>
          {gameLogLoading ? (
            <LoadingOverlay message="Loading game log..." />
          ) : gameLog && gameLog.length > 0 ? (
            <Table data={gameLog} columns={gameLogColumns} stickyHeader />
          ) : (
            <p className="text-center py-8 text-gray-500">No game data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
