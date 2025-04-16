// components/shared/ui/rule-section.tsx
import React from 'react';
import { cn } from '@/components/shared/lib/utils';
import dynamic from 'next/dynamic';

// Динамический импорт RuleItem для разделения кода
const RuleItem = dynamic(() => import('./rule-item'), {
  ssr: false,
  loading: () => <div className="h-16 bg-slate-700/20 rounded-lg animate-pulse" />
});

interface RuleSectionProps {
  title: string;
  id: string;
  rules: string[];
  isHighlighted: boolean;
  searchQuery: string;
  setRef: (el: HTMLDivElement | null) => void;
}

export const RuleSection = React.memo(({ 
  title,
  id,
  rules,
  isHighlighted,
  searchQuery,
  setRef
}: RuleSectionProps) => {
  return (
    <div 
      className={cn(
        "mb-8 last:mb-0 border-b border-slate-700/50 pb-6 last:border-0 last:pb-0 p-6 transition-all",
        isHighlighted ? "section-highlight" : ""
      )}
      ref={setRef}
      id={id}
    >
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 bg-orange-400 rounded-full mr-3"></div>
        <h2 className="text-xl text-orange-400 font-bold">{title}</h2>
      </div>
      <ul className="space-y-3 py-6">
        {rules.map((rule, ruleIndex) => (
          <RuleItem
            key={ruleIndex}
            rule={rule}
            searchQuery={searchQuery}
          />
        ))}
      </ul>
    </div>
  );
});

RuleSection.displayName = 'RuleSection';

export default RuleSection;