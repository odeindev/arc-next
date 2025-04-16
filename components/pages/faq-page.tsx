// @components/pages/faq-page.tsx
'use client'

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { cn } from '@/components/shared/lib/utils';
import { HelpCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { ContentSection } from '../../components/shared/ui/content-section';
import { SearchField } from '../../components/shared/ui/search-field';
import { SectionHeader } from '../../components/shared/ui/section-header';
import { ScrollTopButton } from '../../components/shared/ui/scroll-top-button';
import { useScrollToTop } from '../../components/hooks/useScroll';
import { useDebounce } from '../../components/hooks/useDebounce';

// Динамический импорт компонента FAQItem для разделения кода
const FAQItem = dynamic(() => import('../shared/ui/faq-item'), {
  ssr: false, // Отключаем SSR для этого компонента, так как он используется только на клиенте
  loading: () => <div className="h-16 bg-slate-700/20 rounded-lg animate-pulse" />
});

interface FAQPageProps {
  className?: string;
}

// Интерфейсы для типизации
interface FAQ {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  faqs: FAQ[];
}

interface FAQExtraNoteType {
  title: string;
  paragraphs: string[];
}

export const FAQPage: React.FC<FAQPageProps> = ({ className }) => {
  const [expandedFaqs, setExpandedFaqs] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { showScrollTop, scrollToTop } = useScrollToTop();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Состояния для данных (загружаются динамически)
  const [faqCollection, setFaqCollection] = useState<FAQSection[]>([]);
  const [faqExtraNote, setFaqExtraNote] = useState<FAQExtraNoteType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Динамическая загрузка данных
  useEffect(() => {
    const loadData = async () => {
      try {
        const faqData = await import('@/public/data/content/faq');
        setFaqCollection(faqData.FAQCollection);
        setFaqExtraNote(faqData.FAQExtraNote);
      } catch (error) {
        console.error('Failed to load FAQ data:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadData();
  }, []);

  // Функция переключения состояния FAQ с мемоизацией
  const toggleFaq = React.useCallback((key: string) => {
    setExpandedFaqs(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Функция проверки, расширен ли FAQ с мемоизацией
  const isExpanded = React.useCallback((key: string) => {
    return expandedFaqs[key] || false;
  }, [expandedFaqs]);

  // Мемоизируем отфильтрованные FAQ
  const filteredFAQs = useMemo(() => {
    if (!debouncedSearch) return faqCollection;
    
    const searchLower = debouncedSearch.toLowerCase();
    return faqCollection.map(section => ({
      ...section,
      faqs: section.faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchLower) ||
        faq.answer.toLowerCase().includes(searchLower)
      )
    })).filter(section => section.faqs.length > 0);
  }, [debouncedSearch, faqCollection]);

  // Мемоизация статистики
  const faqStats = useMemo(() => ({
    totalQuestions: faqCollection.reduce((count, section) => count + section.faqs.length, 0),
    totalCategories: faqCollection.length
  }), [faqCollection]);

  // UI элементы статистики
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
          {isLoading ? (
            // Состояние загрузки
            <div className="p-6 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-6 bg-slate-700/50 rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    {Array.from({ length: 2 }).map((_, j) => (
                      <div key={j} className="h-16 bg-slate-700/30 rounded-lg"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : filteredFAQs.length > 0 ? (
            <ul className="flex flex-col divide-y divide-slate-700/50">
              {filteredFAQs.map((section, sectionIndex) => (
                <li key={sectionIndex} className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-orange-400 rounded-full mr-3"></div>
                    <h2 className="text-xl text-orange-400 font-bold">{section.title}</h2>
                  </div>
                  <ul className="space-y-4">
                    {section.faqs.map((faq, faqIndex) => {
                      const key = `${sectionIndex}-${faqIndex}`;
                      return (
                        <FAQItem
                          key={key}
                          question={faq.question}
                          answer={faq.answer}
                          isOpen={isExpanded(key)}
                          onToggle={() => toggleFaq(key)}
                          searchQuery={debouncedSearch}
                        />
                      );
                    })}
                  </ul>
                </li>
              ))}
              {!debouncedSearch && faqExtraNote && (
                <div className="p-6 border-t border-slate-700/50">
                  <h2 className="text-xl text-orange-400 font-bold mb-2">{faqExtraNote.title}</h2>
                  <div className="text-slate-300 bg-slate-700/30 p-4 rounded-lg space-y-3">
                    {faqExtraNote.paragraphs.map((p, i) => (
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