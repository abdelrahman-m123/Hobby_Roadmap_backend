import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick, animate = true }) => {
  const Component = animate ? motion.div : 'div';
  const props = animate ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.4 }
  } : {};

  return (
    <Component
      {...props}
      onClick={onClick}
      className={clsx(
        'bg-white rounded-xl transition-all duration-300',
        onClick && 'cursor-pointer active:scale-[0.98]',
        className
      )}
    >
      {children}
    </Component>
  );
};
