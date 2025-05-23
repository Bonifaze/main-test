import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface TrackingEntry {
  id: string;
  timestamp: string;
  ipAddress: string;
  queryType: 'user' | 'entity';
  searchValue: string;
  dateRange: {
    from: string;
    to: string;
  };
  properties?: string[];
  resultsCount?: number;
}

interface TrackedHistoryContextType {
  history: TrackingEntry[];
  addEntry: (entry: Omit<TrackingEntry, 'id' | 'timestamp' | 'ipAddress'>) => void;
  clearHistory: () => void;
}

const TrackedHistoryContext = createContext<TrackedHistoryContextType>({
  history: [],
  addEntry: () => {},
  clearHistory: () => {},
});

export const TrackedHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<TrackingEntry[]>(() => {
    const savedHistory = localStorage.getItem('trackingHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem('trackingHistory', JSON.stringify(history));
  }, [history]);

  const addEntry = (entry: Omit<TrackingEntry, 'id' | 'timestamp' | 'ipAddress'>) => {
    const newEntry: TrackingEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1', // In a real app, this would be fetched from the server
    };
    
    setHistory(prevHistory => [newEntry, ...prevHistory]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <TrackedHistoryContext.Provider value={{ history, addEntry, clearHistory }}>
      {children}
    </TrackedHistoryContext.Provider>
  );
};

export default TrackedHistoryContext;