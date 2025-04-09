'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/components/shared/lib/utils';
import { Button } from '@/components/shared/ui';

interface ErrorSectionProps {
  code: string;
  title: string;
  description: string;
  buttonColor?: 'orange' | 'purple' | 'yellow';
  className?: string;
  backgroundGradient?: string;
  decorationGradient?: string;
  decorationColors?: {
    primary: string;
    secondary: string;
  };
}

export const ErrorSection: React.FC<ErrorSectionProps> = ({
  code,
  title,
  description,
  buttonColor = 'orange',
  className,
  backgroundGradient = 'from-gray-900 via-gray-800 to-gray-900',
  decorationGradient = 'from-red-500 to-red-800',
  decorationColors = { 
    primary: 'red-700', 
    secondary: 'red-600' 
  }
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300);
  }, []);

  return (
    <div className={cn('relative min-h-screen flex flex-col overflow-hidden', className)}>
      <div className={`relative flex-grow flex items-center justify-center bg-gradient-to-b ${backgroundGradient} py-44`}>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-r ${decorationGradient} opacity-10 rounded-full animate-pulse transform scale-150`}></div>
          <div className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-${decorationColors.primary} opacity-20 rounded-full blur-3xl animate-spin-slow`}></div>
          <div className={`absolute top-20 right-10 w-48 h-48 bg-${decorationColors.secondary} opacity-20 rounded-full blur-2xl animate-bounce`}></div>
        </div>
        <div className={`relative z-10 text-center space-y-6 px-6 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-9xl font-extrabold text-white drop-shadow-md transform transition-all hover:scale-105">
            {code}
          </h1>
          <p className="text-2xl text-white transition-opacity duration-300 opacity-80 hover:opacity-100">
            {title}
          </p>
          <p className="text-lg text-gray-300">
            {description}
          </p>
          <Button 
            color={buttonColor}
            href='/' 
            text='Вернуться на главную' 
            className='w-64 h-12 hover:shadow-lg transition-all transform hover:scale-105 shadow-lg' 
          />
        </div>
      </div>
      <div className="relative">
      </div>
    </div>
  );
};

export default ErrorSection;