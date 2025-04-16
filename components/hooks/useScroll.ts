// components/hooks/useScroll.ts
import { useState, useEffect, useRef, useCallback } from 'react';

export function useActiveSection<T extends { id: string }>(sections: T[]) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [highlightedSection, setHighlightedSection] = useState<string>('');
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const observer = useRef<IntersectionObserver | null>(null);
  const scrollingToSection = useRef<boolean>(false);

  // Функция для установки ref элемента
  const setSectionRef = useCallback((element: HTMLElement | null, id: string) => {
    if (element) {
      sectionRefs.current[id] = element;
    }
  }, []);

  // Настраиваем IntersectionObserver для отслеживания видимых секций
  useEffect(() => {
    // Очищаем предыдущий observer
    if (observer.current) {
      observer.current.disconnect();
    }

    // Создаем новый observer
    observer.current = new IntersectionObserver(
      (entries) => {
        // Не обновляем активную секцию, если прокрутка программная
        if (scrollingToSection.current) return;

        const visibleSections = entries
          .filter(entry => entry.isIntersecting)
          .map(entry => entry.target.id);
          
        if (visibleSections.length > 0) {
          // Используем первую видимую секцию как активную
          setActiveSection(visibleSections[0]);
        }
      },
      {
        rootMargin: '-10% 0px -70% 0px', // Настраиваем область видимости
        threshold: 0.1 // 10% элемента должно быть видимо
      }
    );

    // Добавляем все секции в observer
    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.current?.observe(ref);
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [sections]);

  // Функция прокрутки к секции с подсветкой
  const scrollToSection = useCallback((id: string) => {
    const element = sectionRefs.current[id];
    if (!element) return;

    scrollingToSection.current = true;
    
    // Плавная прокрутка к секции
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });

    // Подсвечиваем секцию
    setHighlightedSection(id);
    setActiveSection(id);

    // Сбрасываем флаг после завершения прокрутки
    setTimeout(() => {
      scrollingToSection.current = false;
    }, 1000);

    // Сбрасываем подсветку через 2 секунды
    setTimeout(() => {
      setHighlightedSection('');
    }, 2000);
  }, []);

  return {
    activeSection,
    highlightedSection,
    setSectionRef,
    scrollToSection
  };
}

/**
 * Хук для отображения кнопки "Наверх" при прокрутке
 */
export function useScrollToTop(threshold: number = 300) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > threshold);
    };
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Проверка начального состояния
    
    return () => window.removeEventListener('scroll', checkScroll);
  }, [threshold]);
  
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);
  
  return { showScrollTop, scrollToTop };
}