import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import UserTracker from './pages/UserTracker';
import EntityTracker from './pages/EntityTracker';
import Analytics from './pages/Analytics';
import EditLog from './pages/EditLog';
import ExportCenter from './pages/ExportCenter';
import HistoryLog from './pages/HistoryLog';
import Documentation from './pages/Documentation';
import ThemeContext from './context/ThemeContext';
import { TrackedHistoryProvider } from './context/TrackedHistoryContext';
import './App.css';

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <TrackedHistoryProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
            <Layout>
              <Routes>
                <Route path="/" element={<UserTracker />} />
                <Route path="/entity-tracker" element={<EntityTracker />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/edit-log" element={<EditLog />} />
                <Route path="/export" element={<ExportCenter />} />
                <Route path="/history" element={<HistoryLog />} />
                <Route path="/docs" element={<Documentation />} />
              </Routes>
            </Layout>
          </div>
        </Router>
      </TrackedHistoryProvider>
    </ThemeContext.Provider>
  );
}

export default App;