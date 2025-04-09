'use client'

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { FAQCollection, FAQExtraNote } from '../../public/index';
import { ContentSection } from '../../components/shared/content-section';
import { HelpCircle, ChevronDown, Search, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  className?: string;
}

export const FAQPage: React.FC<Props> = ({ className }) => {
  const [expandedFaqs, setExpandedFaqs] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (sectionIndex: number, faqIndex: number) => {
    const key = `${sectionIndex}-${faqIndex}`;
    setExpandedFaqs(prev => {
      const newState = {
        ...prev,
        [key]: !prev[key]
      };

      return newState;
    });
  };

  const isExpanded = (sectionIndex: number, faqIndex: number) => {
    const key = `${sectionIndex}-${faqIndex}`;
    return expandedFaqs[key] || false;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const allFaqs = FAQCollection;

  const filteredFAQs = searchQuery
    ? FAQCollection.map(section => ({
      ...section,
      faqs: section.faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(section => section.faqs.length > 0)
    : FAQCollection;

  return (
    <div className={cn('relative min-h-screen flex flex-col', className)} ref={scrollRef}>
      <ContentSection
        title="Часто задаваемые вопросы"
        iconSrc="/icons/faq-icon.gif"
        iconAlt="FAQ"
        className="flex-grow"
      >
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="text-slate-400" size={20} />
          </div>
          <input
            type="text"
            placeholder="Поиск по вопросам и ответам..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800/80 text-white rounded-lg border border-slate-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="bg-gradient-to-r from-slate-700 to-slate-700/70 p-6 rounded-xl mb-6 border-l-4 border-orange-400 shadow-lg shadow-orange-500/5">
          <h2 className="text-2xl text-white font-bold flex items-center">
            <HelpCircle className="mr-3 text-orange-400" size={28} />
            Ответы на популярные вопросы
          </h2>

          <div className="mt-4 flex flex-wrap gap-3">
            <div className="bg-slate-800/90 px-4 py-2 rounded-lg text-slate-300 flex items-center">
              <span className="font-medium text-orange-400 mr-2">{allFaqs.reduce((count, section) => count + section.faqs.length, 0)}</span>
              <span>вопросов</span>
            </div>
            <div className="bg-slate-800/90 px-4 py-2 rounded-lg text-slate-300 flex items-center">
              <span className="font-medium text-orange-400 mr-2">{allFaqs.length}</span>
              <span>категорий</span>
            </div>
          </div>
        </div>

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
                    {section.faqs.map((faq, faqIndex) => {
                      const isOpen = isExpanded(sectionIndex, faqIndex);
                      const highlightMatch = (text: string) => {
                        if (!searchQuery) return text;

                        return text.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) =>
                          part.toLowerCase() === searchQuery.toLowerCase()
                            ? <mark key={i} className="bg-orange-400/20 text-orange-100 px-1 rounded">{part}</mark>
                            : part
                        );
                      };

                      return (
                        <motion.li
                          key={faqIndex}
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
                            onClick={() => toggleFaq(sectionIndex, faqIndex)}
                            aria-expanded={isOpen}
                          >
                            <div className="flex items-center flex-1 pr-4">
                              {/* Убрали нумерацию вопросов */}
                              <span className="text-white font-medium">{highlightMatch(faq.question)}</span>
                            </div>
                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown
                                size={20}
                                className="text-orange-400 flex-shrink-0"
                              />
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
                                    {highlightMatch(faq.answer)}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.li>
                      );
                    })}
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

export default FAQPage;