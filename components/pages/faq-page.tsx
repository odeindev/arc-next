// @components/pages/faq-page.tsx
'use client'

import React, { useState, useRef, useMemo, useCallback } from 'react';
import { cn } from '@/components/shared/lib/utils';
import { FAQCollection, FAQExtraNote } from '../../public/index';
import { ContentSection } from '../../components/shared/ui/content-section';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchField } from '../../components/shared/ui/search-field';
import { SectionHeader } from '../../components/shared/ui/section-header';
import { ScrollTopButton } from '../../components/shared/ui/scroll-top-button';
import { useScrollToTop } from '../../components/hooks/useScroll';
import { highlightText } from '@/app/utils/highlightText';

interface FAQPageProps {
  className?: string;
}

// Выделение FAQ элемента в отдельный компонент для лучшей организации
const FAQItem = React.memo(({ 
  faq, 
  isOpen, 
  onToggle, 
  searchQuery 
}: { 
  faq: { question: string; answer: string; }; 
  isOpen: boolean; 
  onToggle: () => void; 
  searchQuery: string;
}) => {
  return (
    <motion.li
      initial={false}
      animate={isOpen ? {
        boxShadow: '0 10px 25px -5px rgba(251, 146, 60, 0.1), 0 8px 10px -6px rgba(251, 146, 60, 0.05)'
      } : {
        boxShadow: 'none'
      }}
      className={cn(
        "bg-slate-700/30 rounded-lg overflow-hidden transition-all duration-300",
        isOpen ? "ring-1 ring-orange-400/30" : ""
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
          <span className="text-white font-medium">{highlightText(faq.question, searchQuery)}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={20} className="text-orange-400 flex-shrink-0" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 text-slate-300">
              <div className="bg-slate-700/20 p-4 rounded-lg">
                {highlightText(faq.answer, searchQuery)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
});

FAQItem.displayName = 'FAQItem';

export const FAQPage: React.FC<FAQPageProps> = ({ className }) => {
  const [expandedFaqs, setExpandedFaqs] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const { showScrollTop, scrollToTop } = useScrollToTop();

  const scrollRef = useRef<HTMLDivElement>(null);

  // Оптимизация: Используем useCallback для функций
  const toggleFaq = useCallback((sectionIndex: number, faqIndex: number) => {
    const key = `${sectionIndex}-${faqIndex}`;
    setExpandedFaqs(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const isExpanded = useCallback((sectionIndex: number, faqIndex: number) => {
    const key = `${sectionIndex}-${faqIndex}`;
    return expandedFaqs[key] || false;
  }, [expandedFaqs]);

  // Мемоизируем отфильтрованные FAQ для предотвращения повторных вычислений
  const filteredFAQs = useMemo(() => {
    if (!searchQuery) return FAQCollection;
    
    return FAQCollection.map(section => ({
      ...section,
      faqs: section.faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(section => section.faqs.length > 0);
  }, [searchQuery]);

  // Статистика подсчета только один раз при инициализации
  const faqStats = useMemo(() => ({
    totalQuestions: FAQCollection.reduce((count, section) => count + section.faqs.length, 0),
    totalCategories: FAQCollection.length
  }), []);

  // Создаем статистику для отображения в header
  const statsContent = (
    <div className="flex flex-wrap gap-3">
      <div className="bg-slate-800/90 px-4 py-2 rounded-lg text-slate-300 flex items-center">
        <span className="font-medium text-orange-400 mr-2">{faqStats.totalQuestions}</span>
        <span>вопросов</span>
      </div>
      <div className="bg-slate-800/90 px-4 py-2 rounded-lg text-slate-300 flex items-center">
        <span className="font-medium text-orange-400 mr-2">{faqStats.totalCategories}</span>
        <span>категорий</span>
      </div>
    </div>
  );

  return (
    <div className={cn('relative min-h-screen flex flex-col', className)} ref={scrollRef}>
      <ContentSection
        title="Часто задаваемые вопросы"
        iconSrc="/icons/faq-icon.gif"
        iconAlt="FAQ"
        className="flex-grow"
      >
        <SearchField 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск по вопросам и ответам..."
          className="mb-6"
          autoFocus={false}
        />

        <SectionHeader
          title="Ответы на популярные вопросы"
          icon={HelpCircle}
          extraContent={statsContent}
        />

        <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl">
          {filteredFAQs.length > 0 ? (
            <ul className="flex flex-col divide-y divide-slate-700/50">
              {filteredFAQs.map((section, sectionIndex) => (
                <li key={sectionIndex} className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-orange-400 rounded-full mr-3"></div>
                    <h2 className="text-xl text-orange-400 font-bold">{section.title}</h2>
                  </div>
                  <ul className="space-y-4">
                    {section.faqs.map((faq, faqIndex) => (
                      <FAQItem
                        key={faqIndex}
                        faq={faq}
                        isOpen={isExpanded(sectionIndex, faqIndex)}
                        onToggle={() => toggleFaq(sectionIndex, faqIndex)}
                        searchQuery={searchQuery}
                      />
                    ))}
                  </ul>
                </li>
              ))}
              {!searchQuery && FAQExtraNote && (
                <div className="p-6 border-t border-slate-700/50">
                  <h2 className="text-xl text-orange-400 font-bold mb-2">{FAQExtraNote.title}</h2>
                  <div className="text-slate-300 bg-slate-700/30 p-4 rounded-lg space-y-3">
                    {FAQExtraNote.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              )}
            </ul>
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

export default FAQPage;