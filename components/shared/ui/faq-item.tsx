// components/shared/ui/faq-item.tsx
import React from 'react';
import { cn } from '@/components/shared/lib/utils';
import { ChevronDown } from 'lucide-react';
import { highlightText } from '@/app/utils/highlightText';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  searchQuery: string;
}

export const FAQItem = React.memo(({ 
  question, 
  answer, 
  isOpen, 
  onToggle, 
  searchQuery 
}: FAQItemProps) => {
  return (
    <li
      className={cn(
        "bg-slate-700/30 rounded-lg overflow-hidden transition-all duration-300",
        isOpen ? "ring-1 ring-yellow-400/30 shadow-lg shadow-yellow-400/5" : ""
      )}
    >
      <button
        className={cn(
          "w-full text-left p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors",
          isOpen ? "bg-slate-700/50 border-b border-slate-600/50" : ""
        )}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="flex items-center flex-1 pr-4">
          <span className="text-white font-medium">{highlightText(question, searchQuery)}</span>
        </div>
        <div
          className={cn(
            "transform transition-transform duration-300",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        >
          <ChevronDown size={20} className="text-yellow-400 flex-shrink-0" />
        </div>
      </button>

      <div 
        className={cn(
          "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-4 text-slate-300">
          <div className="bg-slate-700/20 p-4 rounded-lg">
            {highlightText(answer, searchQuery)}
          </div>
        </div>
      </div>
    </li>
  );
});

FAQItem.displayName = 'FAQItem';

export default FAQItem;