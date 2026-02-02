//components/shared/hero-section.tsx

'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { cn } from '@/components/shared/lib/utils';
import { HeroProps, CarouselState } from '@/components/widgets/hero/model/types';
import { ImageCarousel } from '@/components/widgets/hero/ui/image-carousel';
import { ParticlesCanvas } from '@/components/widgets/hero/ui/particles-canvas';
import { ServerInfoCard } from '@/components/widgets/hero/ui/server-info-card';
import { calculateParallaxStyles } from '@/components/widgets/hero/lib/parallax';
import { CAROUSEL_IMAGE_COUNT, CAROUSEL_TRANSITION_DURATION } from '@/components/widgets/hero/model/constants';
import { preloadImage, clearPreloadCache } from '@/components/widgets/hero/lib/image-preload';
import { GALLERY_IMAGES_AVIF } from '@/public/images/index';

// Константы
const DELAYS = {
  VISIBILITY: 100,
  COPY_FEEDBACK: 2000,
  SLIDE_INTERVAL: 5000,
} as const;

export const HeroSection = ({
  className,
  serverVersion = '1.18.2',
  serverIp = 'arc-craft.net',
}: HeroProps) => {
  // Состояние
  const [copied, setCopied] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [carouselState, setCarouselState] = useState<CarouselState>({
    currentImageIndex: 1,
    isTransitioning: false,
    preloadedImages: new Set([1]),
  });

  // Рефы
  const heroRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Мемоизация
  const parallaxStyles = useMemo(() => calculateParallaxStyles(scrollY), [scrollY]);

  // Копирование IP
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(serverIp);
      setCopied(true);
      
      setTimeout(() => {
        if (mountedRef.current) {
          setCopied(false);
        }
      }, DELAYS.COPY_FEEDBACK);
      
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  }, [serverIp]);

  // Обновление предзагруженных изображений
  const updatePreloadedImages = useCallback((index: number) => {
    setCarouselState(prev => ({
      ...prev,
      preloadedImages: new Set([...prev.preloadedImages, index])
    }));
  }, []);

  // Предзагрузка
  const preloadNextImage = useCallback((nextIndex: number) => {
    if (carouselState.preloadedImages.has(nextIndex)) return;
    preloadImage(nextIndex, () => updatePreloadedImages(nextIndex));
  }, [carouselState.preloadedImages, updatePreloadedImages]);

  // Переключение слайда
  const handleSlideChange = useCallback((nextIndex: number) => {
    if (nextIndex === carouselState.currentImageIndex || carouselState.isTransitioning) return;
    
    preloadNextImage(nextIndex);
    setCarouselState(prev => ({ ...prev, isTransitioning: true }));
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      
      setCarouselState(prev => ({ ...prev, currentImageIndex: nextIndex }));
      
      const afterNextIndex = (nextIndex % CAROUSEL_IMAGE_COUNT) + 1;
      preloadNextImage(afterNextIndex);
      
      setTimeout(() => {
        if (mountedRef.current) {
          setCarouselState(prev => ({ ...prev, isTransitioning: false }));
        }
      }, CAROUSEL_TRANSITION_DURATION);
    }, CAROUSEL_TRANSITION_DURATION);
  }, [carouselState.currentImageIndex, carouselState.isTransitioning, preloadNextImage]);

  // Скролл и видимость
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    const visTimeout = setTimeout(() => setIsVisible(true), DELAYS.VISIBILITY);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(visTimeout);
    };
  }, []);

  // Начальная предзагрузка (минимальная)
  useEffect(() => {
    // Предзагружаем только следующее изображение
    preloadNextImage(2);
    
    return () => clearPreloadCache();
  }, [preloadNextImage]);

  // Автоматическая смена слайдов
  useEffect(() => {
    if (carouselState.isTransitioning) return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (!mountedRef.current) return;
      
      const nextIndex = (carouselState.currentImageIndex % CAROUSEL_IMAGE_COUNT) + 1;
      handleSlideChange(nextIndex);
    }, DELAYS.SLIDE_INTERVAL);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [carouselState.currentImageIndex, carouselState.isTransitioning, handleSlideChange]);

  // Глобальная очистка
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      clearPreloadCache();
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className={cn('relative w-full h-[1080px] min-h-screen overflow-hidden', className)}
      aria-label="Главная секция Arc Craft"
    >
      <div className="relative w-full h-full overflow-hidden" style={{ perspective: '1000px' }}>
        <ImageCarousel parallaxStyles={parallaxStyles} carouselState={carouselState} />
        <ParticlesCanvas />

        <div className="absolute inset-0 flex flex-col justify-center items-center px-4 md:px-8">
          <div className={cn(
            "max-w-6xl mx-auto text-center transition-all duration-1000",
            isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-10"
          )}>
            <div className="mb-6 md:mb-10 relative">
              <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-2 text-white">
                Добро пожаловать на
              </h1>
              <div className="relative inline-block">
                <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 text-white font-chakra-petch">
                  <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-400 text-transparent bg-clip-text">
                    ARC CRAFT
                  </span>
                </h1>
                <div className="h-1 w-full bg-gradient-to-r from-cyan-200 via-blue-400 to-cyan-600 rounded-full"></div>
              </div>
            </div>

            <p className={cn(
              "font-normal text-base md:text-lg lg:text-xl max-w-4xl mx-auto mb-6 text-slate-100 font-mulish transition-all duration-1000 delay-300",
              isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
            )}>
             Погрузитесь в мир тайн и вдохновения, где каждая идея оживает, а единомышленники становятся вашей силой. 
             Окунитесь в античную атмосферу и создайте свою легенду.
            </p>

            <div className={cn(
              "flex justify-center gap-2 mb-8 transition-opacity duration-1000 delay-400",
              isVisible ? "opacity-100" : "opacity-0"
            )} role="navigation" aria-label="Навигация по галерее изображений">
              {GALLERY_IMAGES_AVIF.map((image) => (
                <button
                  key={image.id}
                  type="button" 
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    carouselState.currentImageIndex === image.id 
                      ? "bg-cyan-400 w-6" 
                      : "bg-gray-400/50 hover:bg-gray-300/70"
                  )}
                  onClick={() => handleSlideChange(image.id)}
                  aria-label={`Перейти к изображению ${image.id}`}
                  aria-current={carouselState.currentImageIndex === image.id ? "true" : "false"}
                ></button>
              ))}
            </div>

            <div className={cn(
              "transition-all duration-1000 delay-500",
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            )}>
              <ServerInfoCard 
                serverVersion={serverVersion} 
                serverIp={serverIp} 
                onCopy={copyToClipboard} 
                copied={copied} 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};