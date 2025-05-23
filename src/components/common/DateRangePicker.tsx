import React, { useState } from 'react';
import { format } from 'date-fns';

interface DateRange {
  from: string;
  to: string;
}

interface DateRangePickerProps {
  label?: string;
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
  error?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  label,
  dateRange,
  onChange,
  error
}) => {
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...dateRange, from: e.target.value });
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...dateRange, to: e.target.value });
  };

  // Predefined date ranges
  const setLastWeek = () => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    onChange({
      from: format(lastWeek, 'yyyy-MM-dd'),
      to: format(today, 'yyyy-MM-dd')
    });
  };

  const setLastMonth = () => {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    
    onChange({
      from: format(lastMonth, 'yyyy-MM-dd'),
      to: format(today, 'yyyy-MM-dd')
    });
  };

  const setLastYear = () => {
    const today = new Date();
    const lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);
    
    onChange({
      from: format(lastYear, 'yyyy-MM-dd'),
      to: format(today, 'yyyy-MM-dd')
    });
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">From</label>
          <input
            type="date"
            value={dateRange.from}
            onChange={handleFromChange}
            className={`
              block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
              rounded-md shadow-sm bg-white dark:bg-gray-700
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${error ? 'border-red-500' : ''}
            `}
          />
        </div>
        
        <div className="flex-1">
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">To</label>
          <input
            type="date"
            value={dateRange.to}
            onChange={handleToChange}
            className={`
              block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
              rounded-md shadow-sm bg-white dark:bg-gray-700
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${error ? 'border-red-500' : ''}
            `}
          />
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={setLastWeek}
          className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Last week
        </button>
        <button
          type="button"
          onClick={setLastMonth}
          className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Last month
        </button>
        <button
          type="button"
          onClick={setLastYear}
          className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Last year
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;