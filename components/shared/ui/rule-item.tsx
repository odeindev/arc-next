// components/shared/ui/rule-item.tsx
import React from 'react';
import { highlightText } from '@/app/utils/highlightText';

interface RuleItemProps {
  rule: string;
  searchQuery: string;
}

export const RuleItem = React.memo(({ 
  rule, 
  searchQuery 
}: RuleItemProps) => {  
  return (
    <li 
      className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors text-slate-300 border-l-2 border-slate-600 group animate-fade-in"
    >
      <div className="flex">
        <span className="text-slate-300 group-hover:text-white transition-colors">
          {highlightText(rule, searchQuery)}
        </span>
      </div>
    </li>
  );
});

RuleItem.displayName = 'RuleItem';

export default RuleItem;