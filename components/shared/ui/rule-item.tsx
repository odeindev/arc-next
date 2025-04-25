// components/shared/ui/rule-item.tsx
import React, { useState, useCallback } from 'react';
import { highlightText } from '@/app/utils/highlightText';

interface RuleItemProps {
  rule: string;
  searchQuery: string;
  onClick?: () => void;
}

export const RuleItem = React.memo(({ 
  rule, 
  searchQuery,
  onClick
}: RuleItemProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  }, [onClick]);
  
  return (
    <li 
      className={`
        bg-slate-800 
        rounded-lg 
        p-4 
        hover:bg-slate-700/50 
        focus:outline-none 
        focus:ring-2 
        focus:ring-blue-500 
        focus-visible:ring-opacity-75
        active:bg-slate-700/70
        transition-all
        duration-200
        text-slate-300 
        border-l-2 
        ${isFocused ? 'border-blue-500' : 'border-slate-600'} 
        group 
        animate-fade-in
        cursor-pointer
      `}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
      role="button"
      aria-label={`Правило: ${rule}`}
    >
      <div className="flex items-center">
        <span className="text-slate-300 group-hover:text-white transition-colors">
          {highlightText(rule, searchQuery)}
        </span>
      </div>
    </li>
  );
});

RuleItem.displayName = 'RuleItem';

export default RuleItem;