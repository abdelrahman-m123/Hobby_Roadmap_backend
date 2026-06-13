import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass, Bookmark, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/roadmaps', icon: Compass, label: 'Explore' },
    ...(user ? [
      { path: '/saved', icon: Bookmark, label: 'Saved' },
      { path: '/profile', icon: User, label: 'Profile' }
    ] : [
      { path: '/login', icon: User, label: 'Account' }
    ])
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg safe-bottom">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center touch-target"
            >
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center space-y-1 px-3 py-1 rounded-lg transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.div>
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
