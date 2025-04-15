// @app/components/shared/ui/section-header.tsx
'use client'

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/components/shared/lib/utils';

interface SectionHeaderProps {
  title: string;
  icon: LucideIcon;
  className?: string;
  extraContent?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  icon: Icon, 
  className, 
  extraContent 
}) => {
  return (
    <div className={cn(
      "bg-gradient-to-r from-slate-700 to-slate-700/70 p-6 rounded-xl mb-6 border-l-4 border-orange-400 shadow-lg shadow-orange-500/5",
      className
    )}>
      <h2 className="text-2xl text-white font-bold flex items-center mb-4">
        <Icon className="mr-3 text-orange-400" size={28} />
        {title}
      </h2>
      
      {extraContent && (
        <div className="mt-4">
          {extraContent}
        </div>
      )}
    </div>
  );
};