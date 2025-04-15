// @app/hooks/useScroll.ts
'use client'

import { useState, useEffect, useCallback, useRef } from 'react';

export function useScrollToTop(threshold = 300) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    
    const handleScroll = () => {
      if (timeoutId !== null) return;
      
      timeoutId = setTimeout(() => {
        setShowScrollTop(window.scrollY > threshold);
        timeoutId = null;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { showScrollTop, scrollToTop };
}

export function useActiveSection<T extends { id: string }>(sections: T[], offset = 150) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const sectionRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    
    const handleScroll = () => {
      if (timeoutId !== null) return;
      
      timeoutId = setTimeout(() => {
        if (sections.length === 0) {
          timeoutId = null;
          return;
        }
        
        let currentSection = null;
        
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          const element = sectionRefs.current[section.id];
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= offset) {
              currentSection = section.id;
              break;
            }
          }
        }
        
        if (currentSection !== activeSection) {
          setActiveSection(currentSection);
        }
        
        timeoutId = null;
      }, 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, [sections, activeSection, offset]);
  
  const setSectionRef = useCallback((el: HTMLDivElement | null, sectionId: string) => {
    if (sectionRefs.current) {
      sectionRefs.current[sectionId] = el;
    }
  }, []);
  
  const scrollToSection = useCallback((sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const headerOffset = 120;
      const targetPosition = element.getBoundingClientRect().top + window.scrollY - headerOffset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      setActiveSection(sectionId);
      
      // Эффект подсветки с задержкой
      setTimeout(() => {
        setHighlightedSection(sectionId);
        setTimeout(() => {
          setHighlightedSection(null);
        }, 1500);
      }, 500);
    }
  }, []);
  
  return { 
    activeSection, 
    highlightedSection, 
    setSectionRef, 
    scrollToSection 
  };
}