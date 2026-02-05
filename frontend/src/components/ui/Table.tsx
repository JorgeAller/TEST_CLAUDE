import { ReactNode, useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  accessor: (row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  stickyHeader?: boolean;
  hoverable?: boolean;
  striped?: boolean;
  onRowClick?: (row: T) => void;
}

export function Table<T>({
  data,
  columns,
  className,
  stickyHeader = true,
  hoverable = true,
  striped = false,
  onRowClick,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    const sorted = [...data].sort((a, b) => {
      const column = columns.find((col) => col.key === sortConfig.key);
      if (!column) return 0;

      const aValue = column.accessor(a);
      const bValue = column.accessor(b);

      // Handle different types
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue);
      const bString = String(bValue);
      return sortConfig.direction === 'asc'
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });

    return sorted;
  }, [data, sortConfig, columns]);

  const handleSort = (columnKey: string) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    setSortConfig((current) => {
      if (current?.key === columnKey) {
        return current.direction === 'asc' ? { key: columnKey, direction: 'desc' } : null;
      }
      return { key: columnKey, direction: 'asc' };
    });
  };

  const getSortIcon = (columnKey: string) => {
    if (sortConfig?.key !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 opacity-40" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  return (
    <div className={cn('overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700', className)}>
      <table className="w-full text-sm">
        <thead className={cn('bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700', {
          'sticky top-0 z-10': stickyHeader,
        })}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs',
                  column.headerClassName,
                  {
                    'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800': column.sortable,
                  }
                )}
                onClick={() => handleSort(column.key)}
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {column.sortable && getSortIcon(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
          {sortedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn({
                'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer': hoverable || onRowClick,
                'bg-gray-50 dark:bg-gray-900': striped && rowIndex % 2 === 1,
              })}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn('px-4 py-3 text-gray-900 dark:text-gray-100', column.className)}
                >
                  {column.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {sortedData.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No data available
        </div>
      )}
    </div>
  );
}
