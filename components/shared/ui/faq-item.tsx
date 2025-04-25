// @components/shared/ui/faq-item.tsx
import React, { useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/components/shared/lib/utils';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  searchQuery?: string;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isOpen,
  onToggle,
  searchQuery = '',
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLLIElement>(null);

  // Подсвечивание искомых терминов
  const highlightText = (text: string) => {
    if (!searchQuery) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-400/30 text-white px-1 rounded">$1</mark>');
  };

  // Автоматическое раскрытие при совпадении поиска
  useEffect(() => {
    if (searchQuery && 
        (question.toLowerCase().includes(searchQuery.toLowerCase()) || 
         answer.toLowerCase().includes(searchQuery.toLowerCase())) && 
        !isOpen) {
      onToggle();
    }
  }, [searchQuery, question, answer, isOpen, onToggle]);

  // Прокрутка к элементу при поиске
  useEffect(() => {
    if (searchQuery && isOpen && itemRef.current) {
      setTimeout(() => {
        itemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [isOpen, searchQuery]);

  return (
    <li 
      ref={itemRef}
      className={cn(
        "bg-slate-800 rounded-lg shadow-sm transition-all duration-300",
        isOpen && "ring-1 ring-yellow-400/20 shadow-md bg-slate-700/60",
        searchQuery && (question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                     answer.toLowerCase().includes(searchQuery.toLowerCase())) && "ring-1 ring-yellow-400/30"
      )}
    >
      <button
        className={cn(
          "w-full text-left px-5 py-4 rounded-lg flex items-center justify-between",
          "focus:outline-none focus:ring-2 focus:ring-yellow-400/30 focus:ring-offset-2 focus:ring-offset-slate-800",
          "hover:bg-slate-700/70 transition-colors",
          isOpen && "rounded-b-none"
        )}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span 
          className="text-lg font-medium text-slate-200 flex-grow pr-4"
          dangerouslySetInnerHTML={{ __html: highlightText(question) }}
        />
        <ChevronDown
          className={cn(
            "flex-shrink-0 w-5 h-5 text-yellow-400 transition-transform duration-300",
            isOpen && "transform rotate-180"
          )}
        />
      </button>
      
      <div
        ref={contentRef}
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          !isOpen && "max-h-0 opacity-0",
          isOpen && "max-h-[1000px] opacity-100" // Динамическая высота для анимации
        )}
        style={{
          maxHeight: isOpen ? (contentRef.current?.scrollHeight || 1000) + 'px' : '0',
        }}
      >
        <div className="px-5 py-4 text-slate-300 border-t border-slate-600/20 bg-slate-800/30 rounded-b-lg">
          <div 
            className="prose prose-sm prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: highlightText(answer) }}
          />
        </div>
      </div>
    </li>
  );
};

export default FAQItem;