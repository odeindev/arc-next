// components/shared/ui/rule-item.tsx
import React, { useMemo } from 'react';

interface RuleItemProps {
  rule: string;
  searchQuery: string;
  onClick?: () => void;
}

// Вынесли функцию подсветки для переиспользования
const highlightText = (text: string, query: string): React.ReactNode => {
  if (!query) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="bg-amber-400/30 text-white px-1 rounded">
        {part}
      </mark>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  );
};

export const RuleItem = React.memo<RuleItemProps>(({ 
  rule, 
  searchQuery,
  onClick
}) => {
  // Мемоизация подсвеченного текста
  const highlightedText = useMemo(
    () => highlightText(rule, searchQuery),
    [rule, searchQuery]
  );
  
  // Обработчик клавиатуры вынесен в useMemo
  const handleKeyDown = useMemo(
    () => (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.();
      }
    },
    [onClick]
  );
  
  return (
    <li 
      className="
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
        border-slate-600
        hover:border-blue-500
        group 
        animate-fade-in
        cursor-pointer
      "
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Правило: ${rule}`}
    >
      <div className="flex items-center">
        <span className="text-slate-300 group-hover:text-white transition-colors">
          {highlightedText}
        </span>
      </div>
    </li>
  );
}, (prevProps, nextProps) => {
  // Кастомная функция сравнения
  return (
    prevProps.rule === nextProps.rule &&
    prevProps.searchQuery === nextProps.searchQuery &&
    prevProps.onClick === nextProps.onClick
  );
});

RuleItem.displayName = 'RuleItem';

export default RuleItem;