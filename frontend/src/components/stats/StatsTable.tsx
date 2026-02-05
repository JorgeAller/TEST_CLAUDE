import { PlayerSeasonStats } from '@/types';
import { Table, Column } from '@/components/ui/Table';
import { formatNumber, formatPercentage, formatPlayerName } from '@/lib/utils';

interface StatsTableProps {
  stats: PlayerSeasonStats[];
  onRowClick?: (stat: PlayerSeasonStats) => void;
}

export function StatsTable({ stats, onRowClick }: StatsTableProps) {
  const columns: Column<PlayerSeasonStats>[] = [
    {
      key: 'player',
      header: 'Player',
      accessor: (row) => row.player ? formatPlayerName(row.player.firstName, row.player.lastName) : '-',
      sortable: true,
      className: 'font-semibold',
    },
    {
      key: 'season',
      header: 'Season',
      accessor: (row) => row.season,
      sortable: true,
    },
    {
      key: 'gp',
      header: 'GP',
      accessor: (row) => row.gamesPlayed,
      sortable: true,
      className: 'text-center',
    },
    {
      key: 'ppg',
      header: 'PPG',
      accessor: (row) => formatNumber(row.avgPoints),
      sortable: true,
      className: 'font-semibold text-basketball-orange',
    },
    {
      key: 'rpg',
      header: 'RPG',
      accessor: (row) => formatNumber(row.avgRebounds),
      sortable: true,
    },
    {
      key: 'apg',
      header: 'APG',
      accessor: (row) => formatNumber(row.avgAssists),
      sortable: true,
    },
    {
      key: 'mpg',
      header: 'MPG',
      accessor: (row) => formatNumber(row.avgMinutes),
      sortable: true,
    },
    {
      key: 'fg',
      header: 'FG%',
      accessor: (row) => formatPercentage(row.fieldGoalPercentage),
      sortable: true,
    },
    {
      key: '3p',
      header: '3P%',
      accessor: (row) => formatPercentage(row.threePointPercentage),
      sortable: true,
    },
    {
      key: 'ft',
      header: 'FT%',
      accessor: (row) => formatPercentage(row.freeThrowPercentage),
      sortable: true,
    },
  ];

  return (
    <Table
      data={stats}
      columns={columns}
      onRowClick={onRowClick}
      stickyHeader
      hoverable
    />
  );
}
