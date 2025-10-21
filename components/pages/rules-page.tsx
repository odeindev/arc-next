// @components/pages/rules-page.tsx
'use client'

import React, { useState, useMemo, useEffect } from 'react';
import { cn } from '@/components/shared/lib/utils';
import { AlertTriangle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { ContentSection, SearchField, SectionHeader, ScrollTopButton } from '../../components/shared/ui/';
import { useScrollToTop, useActiveSection } from '../../components/hooks/useScroll';
import { useDebounce } from '../../components/hooks/useDebounce';

// Динамический импорт компонента RuleSection для разделения кода
const RuleSection = dynamic(() => import('../../components/shared/ui/rule-section'), {
  ssr: false,
  loading: () => <div className="h-32 bg-slate-700/20 rounded-lg animate-pulse" />
});

interface RulesPageProps {
  className?: string;
}

// Типы для данных правил
interface RuleItem {
  title?: string;
  rule?: string;
}

interface RuleSection {
  title: string;
  id: string;
  rules: string[];
}

export const RulesPage: React.FC<RulesPageProps> = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { showScrollTop, scrollToTop } = useScrollToTop();
  
  // Состояние для данных (загружаются динамически)
  const [rulesCollection, setRulesCollection] = useState<RuleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Динамическая загрузка данных
  useEffect(() => {
    const loadData = async () => {
      try {
        const rulesData = await import('@/public/data/content/rules');
        setRulesCollection(rulesData.RulesCollection);
      } catch (error) {
        console.error('Failed to load rules data:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadData();
  }, []);
  
  
  // Преобразование коллекции правил в структурированные секции
  const sections = useMemo(() => {
    return rulesCollection.reduce((sections, item) => {
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
    }, [] as RuleSection[]);
  }, [rulesCollection]);
  
  // Используем хук для отслеживания активной секции
  const { 
    activeSection, 
    highlightedSection, 
    setSectionRef, 
    scrollToSection 
  } = useActiveSection(sections);
  
  // Фильтруем секции на основе поискового запроса
  const filteredSections = useMemo(() => {
    if (!debouncedSearch) return sections;
    
    const searchLower = debouncedSearch.toLowerCase();
    return sections.map(section => ({
      ...section,
      rules: section.rules.filter(rule => 
        rule.toLowerCase().includes(searchLower)
      )
    })).filter(section => section.rules.length > 0);
  }, [sections, debouncedSearch]);
  
  // Кнопки навигации для секций
  const navigationButtons = useMemo(() => (
    <div className="flex flex-wrap gap-2">
      {sections.map((section, index) => (
        <button
          key={index}
          className={cn(
            "px-4 py-2 text-sm rounded-full transition-all",
            activeSection === section.id
              ? "bg-yellow-400 text-slate-900 font-medium shadow-lg shadow-yellow-400/20"
              : "bg-slate-800/90 text-slate-300 hover:bg-slate-500"
          )}
          onClick={() => scrollToSection(section.id)}
        >
          {section.title}
        </button>
      ))}
    </div>
  ), [sections, activeSection, scrollToSection]);
  
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
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <ContentSection 
        title="Правила сервера"
        iconSrc="/icons/rules-icon.gif"
        iconAlt="Rules"
        className="flex-grow"
      >
        <SearchField 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск по правилам..."
          className="mb-6"
          autoFocus={false}
        />
        
        <SectionHeader
          title="Общие правила и положения"
          icon={AlertTriangle}
          extraContent={navigationButtons}
        />
        
        <div className="bg-slate-700/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl">
          {isLoading ? (
            // Состояние загрузки
            <div className="p-6 space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-6 bg-slate-700/50 rounded w-1/4 mb-4"></div>
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="h-12 bg-slate-700/30 rounded-lg"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : filteredSections.length > 0 ? (
            filteredSections.map((section, sectionIndex) => (
              <RuleSection 
                key={sectionIndex}
                title={section.title}
                id={section.id}
                rules={section.rules}
                isHighlighted={highlightedSection === section.id}
                searchQuery={debouncedSearch}
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
      
      <ScrollTopButton show={showScrollTop} onClick={scrollToTop} />
    </div>
  );
};

export default RulesPage;