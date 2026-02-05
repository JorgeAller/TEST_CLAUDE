import { Player, PlayerSeasonStats, AdvancedMetrics } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { StatBadge } from '@/components/ui/StatBadge';
import { formatPlayerName, formatPosition, formatHeight, formatWeight, formatNumber, calculateAge } from '@/lib/utils';
import { User } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  seasonStats?: PlayerSeasonStats;
  advancedMetrics?: AdvancedMetrics;
  onClick?: () => void;
  compact?: boolean;
}

export function PlayerCard({ player, seasonStats, advancedMetrics, onClick, compact = false }: PlayerCardProps) {
  const age = calculateAge(player.birthDate);

  if (compact) {
    return (
      <Card
        className="cursor-pointer hover:shadow-lg transition-shadow"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-basketball-orange to-basketball-court flex items-center justify-center text-white font-bold text-xl">
              {player.jerseyNumber || <User className="w-8 h-8" />}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {formatPlayerName(player.firstName, player.lastName)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatPosition(player.position)} {player.team && `• ${player.team.abbreviation}`}
              </p>
            </div>
            {seasonStats && (
              <div className="flex gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-basketball-orange">{formatNumber(seasonStats.avgPoints)}</div>
                  <div className="text-xs text-gray-500 uppercase">PPG</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{formatNumber(seasonStats.avgRebounds)}</div>
                  <div className="text-xs text-gray-500 uppercase">RPG</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{formatNumber(seasonStats.avgAssists)}</div>
                  <div className="text-xs text-gray-500 uppercase">APG</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="cursor-pointer hover:shadow-xl transition-all"
      onClick={onClick}
      variant="elevated"
    >
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-basketball-orange to-basketball-court flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              {player.jerseyNumber || <User className="w-12 h-12" />}
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-2xl text-gray-900 dark:text-white mb-1">
                {formatPlayerName(player.firstName, player.lastName)}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                {formatPosition(player.position)}
              </p>
              {player.team && (
                <p className="text-sm font-semibold text-basketball-orange">
                  {player.team.city} {player.team.name}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
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

          {/* Season Stats */}
          {seasonStats && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                Season Averages
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                <StatBadge label="PPG" value={formatNumber(seasonStats.avgPoints)} size="sm" />
                <StatBadge label="RPG" value={formatNumber(seasonStats.avgRebounds)} size="sm" />
                <StatBadge label="APG" value={formatNumber(seasonStats.avgAssists)} size="sm" />
                <StatBadge label="FG%" value={formatNumber(seasonStats.fieldGoalPercentage ? seasonStats.fieldGoalPercentage * 100 : 0)} size="sm" />
                <StatBadge label="3P%" value={formatNumber(seasonStats.threePointPercentage ? seasonStats.threePointPercentage * 100 : 0)} size="sm" />
                <StatBadge label="FT%" value={formatNumber(seasonStats.freeThrowPercentage ? seasonStats.freeThrowPercentage * 100 : 0)} size="sm" />
              </div>
            </div>
          )}

          {/* Advanced Metrics */}
          {advancedMetrics && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                Advanced Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatBadge label="PER" value={formatNumber(advancedMetrics.playerEfficiencyRating)} size="sm" variant="primary" />
                <StatBadge label="TS%" value={formatNumber(advancedMetrics.trueShootingPercentage ? advancedMetrics.trueShootingPercentage * 100 : 0)} size="sm" variant="success" />
                <StatBadge label="ORtg" value={formatNumber(advancedMetrics.offensiveRating)} size="sm" />
                <StatBadge label="DRtg" value={formatNumber(advancedMetrics.defensiveRating)} size="sm" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
