// @app/rules/RulesPage.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/components/shared/lib/utils';
import { RulesCollection } from '../../public/index';
import { ContentSection } from '../../components/shared/ui/content-section';
import { AlertTriangle, Search, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  className?: string;
}

export const RulesPage: React.FC<Props> = ({ className }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  
  const sectionRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  
  // Generate sections data
  const sections = RulesCollection.reduce((sections, item) => {
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
  
  // Filter rules based on search
  const filteredSections = searchQuery 
    ? sections.map(section => ({
        ...section,
        rules: section.rules.filter(rule => 
          rule.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(section => section.rules.length > 0)
    : sections;
  
  // Scroll spy effect
  useEffect(() => {
    // Обновленная функция handleScroll
    const handleScroll = () => {
      // Show/hide scroll to top button
      setShowScrollTop(window.scrollY > 300);
      
      // Update active section based on scroll position
      if (sections.length === 0) return;
      
      // Добавляем отступ для определения активной секции
      const scrollOffset = 150;
      
      let currentSection = null;
      // Перебираем секции в обратном порядке для более точного определения текущей
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = sectionRefs.current[section.id];
        if (element) {
          const rect = element.getBoundingClientRect();
          // Учитываем отступ при определении активной секции
          if (rect.top <= scrollOffset) {
            currentSection = section.id;
            break;
          }
        }
      }
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);
  
  // Установка рефов правильным способом
  const setSectionRef = (el: HTMLDivElement | null, sectionId: string) => {
    if (sectionRefs.current) {
      sectionRefs.current[sectionId] = el;
    }
  };
  
  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      // Упрощенный расчет позиции с фиксированным отступом
      const headerOffset = -400; // Отступ сверху
      const targetPosition = element.offsetTop - headerOffset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Устанавливаем активную секцию
      setActiveSection(sectionId);
      
      // Добавляем небольшую задержку перед подсветкой,
      // чтобы она запускалась после завершения скролла
      setTimeout(() => {
        setHighlightedSection(sectionId);
        setTimeout(() => {
          setHighlightedSection(null);
        }, 1500);
      }, 500); // Задержка перед подсветкой
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
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
        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="text-slate-400" size={20} />
          </div>
          <input 
            type="text"
            placeholder="Поиск по правилам..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800/80 text-white rounded-lg border border-slate-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Header with navigation */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-700/70 p-6 rounded-xl mb-6 border-l-4 border-orange-400 shadow-lg shadow-orange-500/5">
          <h2 className="text-2xl text-white font-bold flex items-center mb-4">
            <AlertTriangle className="mr-3 text-orange-400" size={28} />
            Общие правила и положения
          </h2>
          
          {/* Quick navigation */}
          <div className="flex flex-wrap gap-2 mt-4">
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
        </div>
        
        {/* Rules content */}
        <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl">
          {filteredSections.length > 0 ? (
            filteredSections.map((section, sectionIndex) => (
              <div 
                key={sectionIndex} 
                className={cn(
                  "mb-8 last:mb-0 border-b border-slate-700/50 pb-6 last:border-0 last:pb-0 p-6 transition-all",
                  highlightedSection === section.id ? "section-highlight" : ""
                )}
                ref={(el) => setSectionRef(el, section.id)}
                id={section.id}
              >
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-orange-400 rounded-full mr-3"></div>
                  <h2 className="text-xl text-orange-400 font-bold">{section.title}</h2>
                </div>
                <ul className="space-y-3 py-6">
                  {section.rules.map((rule, ruleIndex) => (
                    <motion.li 
                      key={ruleIndex} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: ruleIndex * 0.05 }}
                      className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors text-slate-300 border-l-2 border-slate-600 group"
                    >
                      <div className="flex">
                        <span className="text-slate-300 group-hover:text-white transition-colors">
                          {searchQuery ? (
                            <>
                              {rule.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) => 
                                part.toLowerCase() === searchQuery.toLowerCase() 
                                  ? <mark key={i} className="bg-orange-400/20 text-orange-100 px-1 rounded">{part}</mark>
                                  : part
                              )}
                            </>
                          ) : rule}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
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
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 bg-orange-400 text-slate-900 p-3 rounded-full shadow-lg shadow-orange-400/20 hover:bg-orange-500 transition-colors"
            onClick={scrollToTop}
            aria-label="Прокрутить вверх"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RulesPage;