
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = '' }: CardProps) => {
  const styles = 'bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6';
  return (
    <div className={`${styles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
