import React, { ReactNode } from 'react';
import { ArrowUpDown } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
  sortable?: boolean;
  sortKey?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

function Table<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No data available',
  onSort,
  sortField,
  sortDirection
}: TableProps<T>) {
  const renderCell = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    
    return item[column.accessor] as ReactNode;
  };
  
  if (isLoading) {
    return (
      <div className="w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="bg-white dark:bg-gray-800 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {column.sortable && onSort ? (
                      <button 
                        className="flex items-center space-x-1 text-left"
                        onClick={() => column.sortKey && onSort(column.sortKey)}
                      >
                        <span>{column.header}</span>
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="bg-white dark:bg-gray-800 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {column.sortable && onSort ? (
                      <button 
                        className="flex items-center space-x-1 text-left"
                        onClick={() => column.sortKey && onSort(column.sortKey)}
                      >
                        <span>{column.header}</span>
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
          <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
            {emptyMessage}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="bg-white dark:bg-gray-800 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {column.sortable && onSort ? (
                    <button 
                      className="flex items-center space-x-1 text-left"
                      onClick={() => column.sortKey && onSort(column.sortKey)}
                    >
                      <span>{column.header}</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((item) => (
              <tr key={keyExtractor(item)} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex} 
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 ${column.className || ''}`}
                  >
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;