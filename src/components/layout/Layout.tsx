import React, { useState, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  MenuIcon, 
  XIcon, 
  Sun, 
  Moon, 
  UserSearch, 
  Database, 
  BarChart2, 
  List, 
  FileDown, 
  History, 
  BookOpen 
} from 'lucide-react';
import ThemeContext from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  
  const navItems = [
    { path: '/', name: 'User Tracker', icon: <UserSearch className="w-5 h-5" /> },
    { path: '/entity-tracker', name: 'Entity Tracker', icon: <Database className="w-5 h-5" /> },
    { path: '/analytics', name: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> },
    { path: '/edit-log', name: 'Edit Log', icon: <List className="w-5 h-5" /> },
    { path: '/export', name: 'Export Center', icon: <FileDown className="w-5 h-5" /> },
    { path: '/history', name: 'History Log', icon: <History className="w-5 h-5" /> },
    { path: '/docs', name: 'Documentation', icon: <BookOpen className="w-5 h-5" /> },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Backdrop for Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.aside
          initial={{ x: sidebarOpen ? 0 : -280 }}
          animate={{ x: sidebarOpen ? 0 : -280 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed md:static inset-y-0 left-0 z-30 w-64 h-screen overflow-y-auto bg-white dark:bg-gray-800 shadow-lg md:shadow-none md:translate-x-0 transition-transform`}
        >
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <Link to="/" className="flex items-center space-x-2" onClick={closeSidebar}>
              {/* <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" /> */}
              <img src="/logo.svg" alt="Logo" className="w-10 h-10" />
              <span className="text-xl font-bold">Wikidata-Track</span>
            </Link>
            <button 
              className="p-1 rounded-md md:hidden hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={toggleSidebar}
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      location.pathname === item.path ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''
                    }`}
                    onClick={closeSidebar}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="absolute bottom-0  p-4 border-t dark:border-gray-700">
            <button 
              onClick={toggleTheme}
              className="flex items-center justify-center p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'dark' ? (
                <div className="flex items-center">
                  <Sun className="w-5 h-5 mr-2" />
                  <span>Light Mode</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Moon className="w-5 h-5 mr-2" />
                  <span>Dark Mode</span>
                </div>
              )}
            </button>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-x-hidden">
        <header className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="p-2 mr-4 rounded-md md:mr-6 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold">
              {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 md:hidden"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="page-transition">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;