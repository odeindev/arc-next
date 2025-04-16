// @components/pages/rules-page.tsx
'use client'

import React, { useState, useMemo } from 'react';
import { cn } from '@/components/shared/lib/utils';
import { RulesCollection } from '../../public/index';
import { ContentSection } from '../../components/shared/ui/content-section';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { SearchField } from '../../components/shared/ui/search-field';
import { SectionHeader } from '../../components/shared/ui/section-header';
import { ScrollTopButton } from '../../components/shared/ui/scroll-top-button';
import { useScrollToTop, useActiveSection } from '../../components/hooks/useScroll';
import { highlightText } from '@/app/utils/highlightText';

interface RulesPageProps {
  className?: string;
}

// Выделение компонента правила для лучшей организации
const RuleItem = React.memo(({ 
  rule, 
  index,
  searchQuery 
}: { 
  rule: string;
  index: number;
  searchQuery: string;
}) => {  
  return (
    <motion.li 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors text-slate-300 border-l-2 border-slate-600 group"
    >
      <div className="flex">
        <span className="text-slate-300 group-hover:text-white transition-colors">
          {highlightText(rule, searchQuery)}
        </span>
      </div>
    </motion.li>
  );
});

RuleItem.displayName = 'RuleItem';

// Выделение секции правил
const RuleSection = React.memo(({ 
  section, 
  isHighlighted,
  searchQuery,
  setRef
}: { 
  section: { title: string; id: string; rules: string[] };
  isHighlighted: boolean;
  searchQuery: string;
  setRef: (el: HTMLDivElement | null) => void;
}) => {
  return (
    <div 
      className={cn(
        "mb-8 last:mb-0 border-b border-slate-700/50 pb-6 last:border-0 last:pb-0 p-6 transition-all",
        isHighlighted ? "section-highlight" : ""
      )}
      ref={setRef}
      id={section.id}
    >
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 bg-orange-400 rounded-full mr-3"></div>
        <h2 className="text-xl text-orange-400 font-bold">{section.title}</h2>
      </div>
      <ul className="space-y-3 py-6">
        {section.rules.map((rule, ruleIndex) => (
          <RuleItem
            key={ruleIndex}
            rule={rule}
            index={ruleIndex}
            searchQuery={searchQuery}
          />
        ))}
      </ul>
    </div>
  );
});

RuleSection.displayName = 'RuleSection';

export const RulesPage: React.FC<RulesPageProps> = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { showScrollTop, scrollToTop } = useScrollToTop();
  
  // Мемоизируем секции для предотвращения ненужных перерасчетов
  const sections = useMemo(() => {
    return RulesCollection.reduce((sections, item) => {
      if (item.title) {
        sections.push({
          title: item.title,
          id: item.title.toLowerCase().replace(/\s+/g, '-'),
          rules: []
        });
      } else if (sections.length > 0 && item.rule) {
        sections[sections.length - 1].rules.push(item.rule);
      }            
      return sections;
    }, [] as {title: string, id: string, rules: string[]}[]);
  }, []);
  
  const { 
    activeSection, 
    highlightedSection, 
    setSectionRef, 
    scrollToSection 
  } = useActiveSection(sections);
  
  // Мемоизируем отфильтрованные секции
  const filteredSections = useMemo(() => {
    if (!searchQuery) return sections;
    
    return sections.map(section => ({
      ...section,
      rules: section.rules.filter(rule => 
        rule.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(section => section.rules.length > 0);
  }, [sections, searchQuery]);
  
  // Создаем элементы быстрой навигации для отображения в header
  const navigationButtons = (
    <div className="flex flex-wrap gap-2">
      {sections.map((section, index) => (
        <button
          key={index}
          className={cn(
            "px-4 py-2 text-sm rounded-full transition-all",
            activeSection === section.id
              ? "bg-orange-400 text-slate-900 font-medium shadow-lg shadow-orange-400/20"
              : "bg-slate-800/90 text-slate-300 hover:bg-slate-700"
          )}
          onClick={() => scrollToSection(section.id)}
        >
          {section.title}
        </button>
      ))}
    </div>
  );
  
  return (
    <div className={cn('relative min-h-screen flex flex-col', className)}>
      <style jsx global>{`
        @keyframes section-highlight-animation {
          0% { background-color: rgba(251, 146, 60, 0); }
          30% { background-color: rgba(251, 146, 60, 0.3); }
          100% { background-color: rgba(251, 146, 60, 0); }
        }
        .section-highlight {
          animation: section-highlight-animation 1.8s ease-in-out;
        }
      `}</style>
      
      <ContentSection 
        title="Правила сервера"
        iconSrc="/icons/rules-icon.gif"
        iconAlt="Rules"
        className="flex-grow"
      >
        {/* Search bar with new component */}
        <SearchField 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск по правилам..."
          className="mb-6"
          autoFocus={false}
        />
        
        {/* Header with navigation */}
        <SectionHeader
          title="Общие правила и положения"
          icon={AlertTriangle}
          extraContent={navigationButtons}
        />
        
        {/* Rules content */}
        <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl">
          {filteredSections.length > 0 ? (
            filteredSections.map((section, sectionIndex) => (
              <RuleSection 
                key={sectionIndex}
                section={section}
                isHighlighted={highlightedSection === section.id}
                searchQuery={searchQuery}
                setRef={(el) => setSectionRef(el, section.id)}
              />
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="text-xl text-slate-400 mb-2">По вашему запросу ничего не найдено</div>
              <div className="text-slate-500">Попробуйте изменить поисковый запрос</div>
            </div>
          )}
        </div>
      </ContentSection>
      
      {/* Scroll to top button */}
      <ScrollTopButton show={showScrollTop} onClick={scrollToTop} />
    </div>
  );
};

export default RulesPage;