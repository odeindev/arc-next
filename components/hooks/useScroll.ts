// components/hooks/useScroll.ts
import { useState, useEffect, useRef, useCallback } from 'react';

const HIGHLIGHT_DURATION = 2000; // Время подсветки секции в мс
const SCROLL_LOCK_DURATION = 500; // Длительность блокировки при программной прокрутке

/**
 * Хук для отслеживания активной секции на странице и плавной прокрутки
 */
export function useActiveSection<T extends { id: string }>(sections: T[]) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [highlightedSection, setHighlightedSection] = useState<string>('');

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const scrollingToSection = useRef(false);
  const highlightTimeout = useRef<number | null>(null);
  const scrollLockTimeout = useRef<number | null>(null);

  // Устанавливаем ref для секции
  const setSectionRef = useCallback((element: HTMLElement | null, id: string) => {
    if (element) sectionRefs.current[id] = element;
  }, []);

  // IntersectionObserver для отслеживания видимых секций
  useEffect(() => {
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollingToSection.current) return;

        const visibleSections = entries
          .filter(entry => entry.isIntersecting)
          .map(entry => entry.target.id);

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0]);
        }
      },
      {
        rootMargin: '-10% 0px -70% 0px',
        threshold: 0.1
      }
    );

    Object.values(sectionRefs.current).forEach(el => el && observer.observe(el));

    return () => observer.disconnect();
  }, [sections.map(s => s.id).join(',')]); // мемоизация по id секций

  // Функция плавной прокрутки к секции
  const scrollToSection = useCallback((id: string) => {
    const element = sectionRefs.current[id];
    if (!element) return;

    // Блокируем обновление activeSection от IntersectionObserver
    scrollingToSection.current = true;

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
    setHighlightedSection(id);

    // Сбрасываем подсветку через HIGHLIGHT_DURATION
    if (highlightTimeout.current) clearTimeout(highlightTimeout.current);
    highlightTimeout.current = window.setTimeout(() => {
      setHighlightedSection('');
    }, HIGHLIGHT_DURATION);

    // Сбрасываем блокировку IntersectionObserver через SCROLL_LOCK_DURATION
    if (scrollLockTimeout.current) clearTimeout(scrollLockTimeout.current);
    scrollLockTimeout.current = window.setTimeout(() => {
      scrollingToSection.current = false;
    }, SCROLL_LOCK_DURATION);
  }, []);

  return {
    activeSection,
    highlightedSection,
    setSectionRef,
    scrollToSection
  };
}

/**
 * Хук для показа кнопки "Наверх" и прокрутки наверх
 */
export function useScrollToTop(threshold: number = 300) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > threshold;
      setShowScrollTop(prev => (prev !== shouldShow ? shouldShow : prev));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Проверяем начальное состояние
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { showScrollTop, scrollToTop };
}
