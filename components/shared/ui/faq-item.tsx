// @components/shared/ui/faq-item.tsx
import React, { useRef, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/components/shared/lib/utils';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  searchQuery?: string;
}

// Вынесли функцию подсветки наружу для мемоизации
const createHighlightedText = (text: string, searchQuery: string): string => {
  if (!searchQuery) return text;
  
  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-amber-400/30 text-white px-1 rounded">$1</mark>');
};

export const FAQItem = React.memo<FAQItemProps>(({
  question,
  answer,
  isOpen,
  onToggle,
  searchQuery = '',
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Мемоизация подсвеченного текста
  const highlightedQuestion = useMemo(
    () => createHighlightedText(question, searchQuery),
    [question, searchQuery]
  );

  const highlightedAnswer = useMemo(
    () => createHighlightedText(answer, searchQuery),
    [answer, searchQuery]
  );

  // Убрал auto-expand эффект (создавал лишние ререндеры)
  // Вместо этого, пусть пользователь сам открывает найденные элементы

  return (
    <li 
      className={cn(
        "bg-slate-800 rounded-lg shadow-sm transition-all duration-300",
        isOpen && "ring-1 ring-amber-400/20 shadow-md bg-slate-700/60",
        searchQuery && (question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                     answer.toLowerCase().includes(searchQuery.toLowerCase())) && "ring-1 ring-amber-400/30"
      )}
    >
      <button
        className={cn(
          "w-full text-left px-5 py-4 rounded-lg flex items-center justify-between",
          "focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:ring-offset-2 focus:ring-offset-slate-800",
          "hover:bg-slate-700/70 transition-colors",
          isOpen && "rounded-b-none"
        )}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span 
          className="text-lg font-medium text-slate-200 flex-grow pr-4"
          dangerouslySetInnerHTML={{ __html: highlightedQuestion }}
        />
        <ChevronDown
          className={cn(
            "flex-shrink-0 w-5 h-5 text-amber-400 transition-transform duration-300",
            isOpen && "transform rotate-180"
          )}
        />
      </button>
      
      {/* Используем CSS для анимации без JS расчетов */}
      <div
        ref={contentRef}
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-5 py-4 text-slate-300 border-t border-slate-600/20 bg-slate-800/30 rounded-b-lg">
          <div 
            className="prose prose-sm prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: highlightedAnswer }}
          />
        </div>
      </div>
    </li>
  );
}, (prevProps, nextProps) => {
  // Кастомная функция сравнения для React.memo
  return (
    prevProps.question === nextProps.question &&
    prevProps.answer === nextProps.answer &&
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.searchQuery === nextProps.searchQuery
  );
});

FAQItem.displayName = 'FAQItem';

export default FAQItem;