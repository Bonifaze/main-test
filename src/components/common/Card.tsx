import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <motion.div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {title && (
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
      )}
      <div className="p-6">{children}</div>
    </motion.div>
  );
};

export default Card;